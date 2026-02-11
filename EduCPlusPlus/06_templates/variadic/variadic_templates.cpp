/**
 * variadic_templates.cpp - Parameter Packs and Fold Expressions
 *
 * Before C++11, writing a function that accepts "any number of arguments
 * of any types" required C-style variadic functions (printf-style ...),
 * which are type-unsafe and error-prone. Variadic templates solve this
 * with full type safety and zero runtime overhead.
 *
 * C++17 added fold expressions, which dramatically simplify operating
 * on parameter packs — replacing pages of recursive template code with
 * a single line.
 *
 * Use variadic templates when you need a function or class that works
 * with an arbitrary number of heterogeneous arguments: logging, tuple
 * construction, factory functions, string formatting, event systems.
 *
 * Prerequisites: Function templates, class templates (06_templates/).
 * Reference:     reference/en/cpp/language/parameter_pack.html
 *                reference/en/cpp/language/fold.html
 */

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <tuple>
#include <memory>
#include <sstream>
#include <type_traits>
#include <numeric>

// =====================================================
// FREQUENTLY ASKED QUESTIONS (first-timer Q&A)
// =====================================================
//
// Q: What is "..." in template code?
// A: The three dots (...) are called the "ellipsis" and have THREE
//    different roles in variadic templates:
//    1. In the template parameter list: typename... Args
//       -> DECLARES a parameter pack (zero or more type parameters)
//    2. After a pattern in the function body: args...
//       -> EXPANDS the pack (generates one copy per element)
//    3. In a fold expression: (args + ...)
//       -> FOLDS the pack with an operator
//
// Q: How many arguments can a parameter pack hold?
// A: The standard doesn't specify a limit, but compilers typically
//    support at least 1024. In practice, if you're passing more than
//    ~20 arguments, you probably want a container instead.
//
// Q: Is there runtime overhead for variadic templates?
// A: No. The compiler generates a separate function for each unique
//    set of argument types at compile time. The result is as if you
//    wrote each overload by hand. This is called "monomorphization."
//
// Q: What's the difference between a "parameter pack" and a "pack expansion"?
// A: A parameter pack (Args... or args...) is the unexpanded bundle.
//    A pack expansion is when you write a pattern followed by "..."
//    which the compiler replaces with the pattern applied to EACH
//    element: f(args...) becomes f(arg1, arg2, arg3).
//
// Q: Can I index into a parameter pack like pack[2]?
// A: Not directly in C++17. You can use recursion, std::tuple with
//    std::get<N>, or (in C++26) pack indexing with pack...[N].
//    For now, fold expressions handle most use cases without indexing.
//
// Q: What's the difference between Args... and Args&&...?
// A: Args... is a pack of types. Args&&... is a pack of forwarding
//    references. When combined with std::forward<Args>(args)..., you
//    get perfect forwarding — each argument preserves its value
//    category (lvalue stays lvalue, rvalue stays rvalue).
// =====================================================

// =====================================================
// HOW PARAMETER PACK EXPANSION WORKS
//
// The compiler sees a "pattern" followed by "..." and repeats
// the ENTIRE PATTERN for each element in the pack, separated
// by commas.
//
// Given: template<typename... Args> void f(Args... args)
// Called as: f(1, 2.0, "hi")
//
//   Args  = {int, double, const char*}     (type pack)
//   args  = {1, 2.0, "hi"}                 (value pack)
//
// Pack expansion examples:
//
//   args...
//   -> 1, 2.0, "hi"
//      (just list all elements)
//
//   sizeof...(args)
//   -> 3
//      (count the elements — note: this is a compile-time value)
//
//   f(args)...
//   -> f(1), f(2.0), f("hi")
//      (apply f to each element, comma-separated)
//
//   g(args..., extra)
//   -> g(1, 2.0, "hi", extra)
//      (expand pack, then append extra)
//
//   (args + 1)...
//   -> (1 + 1), (2.0 + 1), ("hi" + 1)
//      (apply the + 1 pattern to each element)
//
//   std::forward<Args>(args)...
//   -> std::forward<int>(arg0), std::forward<double>(arg1), ...
//      (both the type pack AND value pack expand in lockstep)
//
// This expansion happens at COMPILE TIME. The compiler literally
// generates the expanded code as if you typed it by hand.
// =====================================================

// -----------------------------------------------
// 1. Basic variadic function using recursion (C++11)
//    Before fold expressions, the standard technique was:
//    - A BASE CASE that handles 0 or 1 arguments
//    - A RECURSIVE CASE that peels off the first argument
//      and recurses on the rest
//
//    This is the "head + tail" pattern.
// -----------------------------------------------

// Base case: no arguments left
void print() {
    std::cout << '\n';
}

// Recursive case: handle first argument, recurse for the rest
// 'First' is the head; 'Rest...' is the tail (zero or more remaining)
template<typename First, typename... Rest>
void print(const First& first, const Rest&... rest) {
    std::cout << first;
    if constexpr (sizeof...(rest) > 0) {
        std::cout << ", ";
    }
    print(rest...);  // Recurse with the remaining arguments
    // Each recursive call instantiates a new function with one
    // fewer parameter, until we hit print() — the base case.
}

// -----------------------------------------------
// HOW THE RECURSION UNFOLDS:
//
// Call: print(1, 2.5, "hello")
//
// 1. print<int, double, const char*>(1, 2.5, "hello")
//    First = int, first = 1
//    Rest  = {double, const char*}, rest = {2.5, "hello"}
//    prints: 1,
//    calls: print(2.5, "hello")
//
// 2. print<double, const char*>(2.5, "hello")
//    First = double, first = 2.5
//    Rest  = {const char*}, rest = {"hello"}
//    prints: 2.5,
//    calls: print("hello")
//
// 3. print<const char*>("hello")
//    First = const char*, first = "hello"
//    Rest  = {} (empty)
//    prints: hello
//    calls: print()          <- base case
//
// 4. print()
//    prints: \n
//
// Output: 1, 2.5, hello\n
// -----------------------------------------------

// -----------------------------------------------
// 2. Fold expressions (C++17) — the modern way
//    A fold expression applies a binary operator across all elements
//    of a parameter pack in a single expression. No recursion needed.
//
//    Four forms:
//    (pack op ...)      — right fold:  a1 op (a2 op (a3 op a4))
//    (... op pack)      — left fold:   ((a1 op a2) op a3) op a4
//    (pack op ... op init) — right fold with init value
//    (init op ... op pack) — left fold with init value
//
//    The "init" form is essential for empty packs: without an init
//    value, folding an empty pack is ill-formed (except for &&, ||, ,).
//
//    Watch out: the parentheses are REQUIRED — they are part of
//    the fold expression syntax, not optional grouping.
//
//    Q: When do I use left fold vs right fold?
//    A: For commutative operations (addition, multiplication), it
//       doesn't matter. For non-commutative operations (subtraction,
//       division, string concatenation), left fold gives the intuitive
//       left-to-right evaluation: (((a - b) - c) - d).
// -----------------------------------------------

// Sum any number of arguments (right fold)
template<typename... Args>
auto sum(Args... args) {
    return (args + ...);
    // If args = {1, 2, 3, 4}, expands to:
    //   1 + (2 + (3 + 4))
    // = 1 + (2 + 7)
    // = 1 + 9
    // = 10
}

// Sum with an initial value (left fold with init)
// Handles empty pack: sum_safe() returns 0
template<typename... Args>
auto sum_safe(Args... args) {
    return (0 + ... + args);
    // If args is empty, this is just 0.
    // If args = {1, 2, 3}, expands to:
    //   ((0 + 1) + 2) + 3
}

// Product with initial value
template<typename... Args>
auto product(Args... args) {
    return (1 * ... * args);
    // Empty pack returns 1 (multiplicative identity)
}

// -----------------------------------------------
// 3. Fold with the comma operator
//    The comma operator (,) evaluates its left operand, discards
//    the result, then evaluates and returns its right operand.
//    Folding over comma lets you execute a statement for each
//    pack element without recursion.
// -----------------------------------------------

// Print all arguments separated by spaces (no recursion!)
template<typename... Args>
void print_all(const Args&... args) {
    // Left fold over comma: ((cout << a1, cout << " "), (cout << a2, cout << " ")), ...
    // The inner lambda handles the formatting per element
    bool first = true;
    auto print_one = [&first](const auto& arg) {
        if (!first) std::cout << ", ";
        std::cout << arg;
        first = false;
    };
    (print_one(args), ...);  // Fold over comma: calls print_one for each arg
    std::cout << '\n';
}

// -----------------------------------------------
// 4. sizeof...(pack) — count elements at compile time
//    Returns a std::size_t that is a compile-time constant.
//    Useful for static_assert checks and conditional compilation.
// -----------------------------------------------
template<typename... Args>
void show_count(Args... args) {
    // sizeof... counts the elements in the pack
    constexpr auto count = sizeof...(Args);  // or sizeof...(args) — same result
    std::cout << std::format("  Pack contains {} element(s)\n", count);

    // sizeof...(Args) and sizeof...(args) always return the same value.
    // The first counts type parameters, the second counts value parameters.
    // They're in lockstep, so use whichever reads better.
    static_assert(sizeof...(Args) == sizeof...(args));
}

// -----------------------------------------------
// 5. Perfect forwarding with parameter packs
//    The combination of Args&&... (forwarding references) and
//    std::forward<Args>(args)... preserves each argument's value
//    category through an intermediary function.
//
//    This is how std::make_unique, std::make_shared, and
//    std::emplace_back work internally.
//
//    Watch out: Args&&... are forwarding references ONLY when
//    Args is a deduced template parameter. If Args is known
//    (e.g., int&&...), these are rvalue references, NOT forwarding.
// -----------------------------------------------

// A factory function that constructs any type with any arguments
template<typename T, typename... Args>
std::unique_ptr<T> create(Args&&... args) {
    // std::forward<Args>(args)... expands BOTH packs in lockstep:
    // If Args = {int, const string&, double}, args = {a, b, c}:
    //   std::forward<int>(a), std::forward<const string&>(b), std::forward<double>(c)
    return std::make_unique<T>(std::forward<Args>(args)...);
}

struct Point {
    double x, y, z;
    Point(double x, double y, double z) : x(x), y(y), z(z) {}
};

// -----------------------------------------------
// 6. Variadic class template: a simple Tuple
//    Variadic templates work on classes too. The standard
//    std::tuple is built this way internally.
//
//    HOW IT WORKS:
//    The class uses recursive inheritance — each level stores
//    one element and inherits from the remainder.
//
//    SimpleTuple<int, double, string>
//      inherits from SimpleTuple<double, string>
//        inherits from SimpleTuple<string>
//          inherits from SimpleTuple<>   (empty base)
//
//    Memory layout:
//    [ int value_ | double value_ | string value_ ]
//    ^ SimpleTuple<int, double, string>
//                   ^ SimpleTuple<double, string>
//                                  ^ SimpleTuple<string>
// -----------------------------------------------

// Base case: empty tuple
template<typename... Ts>
struct SimpleTuple {};

// Recursive case: store Head, inherit rest
template<typename Head, typename... Tail>
struct SimpleTuple<Head, Tail...> : SimpleTuple<Tail...> {
    Head value_;

    // Constructor: initialize our element, forward the rest to base
    SimpleTuple(Head head, Tail... tail)
        : SimpleTuple<Tail...>(tail...), value_(head) {}
};

// Helper to get the Nth element (0-indexed)
// This uses recursive template specialization to "count down" to N=0
template<std::size_t N, typename Head, typename... Tail>
struct TupleGet {
    static auto& get(SimpleTuple<Head, Tail...>& t) {
        // Not at index 0 yet — skip Head and recurse into the base
        return TupleGet<N - 1, Tail...>::get(
            static_cast<SimpleTuple<Tail...>&>(t)
        );
    }
};

template<typename Head, typename... Tail>
struct TupleGet<0, Head, Tail...> {
    static Head& get(SimpleTuple<Head, Tail...>& t) {
        return t.value_;  // N == 0, this is the element we want
    }
};

// Convenience function
template<std::size_t N, typename... Ts>
auto& get(SimpleTuple<Ts...>& t) {
    return TupleGet<N, Ts...>::get(t);
}

// -----------------------------------------------
// 7. Practical example: type-safe printf replacement
//    Combines fold expressions with format strings.
// -----------------------------------------------

// Check that ALL arguments satisfy a concept
template<typename... Args>
concept AllPrintable = (requires(std::ostream& os, Args args) {
    { os << args };
} && ...);
// The && ... is a fold over the concept constraint itself!
// Each Args element must support os << arg.

template<typename... Args>
    requires AllPrintable<Args...>
void log_message(const std::string& prefix, const Args&... args) {
    std::cout << "[" << prefix << "] ";
    // Fold with comma — print each arg with a separator
    ((std::cout << args << " "), ...);
    std::cout << '\n';
}

// -----------------------------------------------
// 8. constexpr all_of / any_of / none_of
//    Fold expressions with && and || create compile-time
//    predicate checks over type lists.
// -----------------------------------------------

// Are ALL types integral?
template<typename... Ts>
constexpr bool all_integral = (std::is_integral_v<Ts> && ...);

// Is ANY type a floating point?
template<typename... Ts>
constexpr bool any_floating = (std::is_floating_point_v<Ts> || ...);

// Are ALL types the same?
template<typename First, typename... Rest>
constexpr bool all_same = (std::is_same_v<First, Rest> && ...);

// =========================================
// Key Takeaways:
//   1. typename... Args declares a parameter pack — zero or more types.
//   2. sizeof...(Args) counts pack elements at compile time.
//   3. Pack expansion (pattern...) repeats the pattern per element.
//   4. Fold expressions (C++17) replace recursive templates for most
//      pack operations: (args + ...), (... + args), (init op ... op args).
//   5. Perfect forwarding: template<typename... Args> void f(Args&&... args)
//      with std::forward<Args>(args)... preserves value categories.
//   6. Variadic class templates use recursive inheritance (head + tail).
//   7. Prefer fold expressions over recursion — they're simpler,
//      compile faster, and produce better error messages.
// =========================================

int main() {
    // ---- 1. Recursive print (C++11 style) ----
    std::cout << "=== 1. Recursive variadic print ===\n";
    std::cout << "  ";
    print(1, 2.5, "hello", 'x');
    std::cout << "  ";
    print("single argument");
    std::cout << "  ";
    print();  // Empty — just prints newline

    // ---- 2. Fold expressions ----
    std::cout << "\n=== 2. Fold expressions ===\n";
    std::cout << std::format("  sum(1, 2, 3, 4, 5) = {}\n", sum(1, 2, 3, 4, 5));
    std::cout << std::format("  sum(1.5, 2.5) = {:.1f}\n", sum(1.5, 2.5));
    std::cout << std::format("  sum_safe() = {}\n", sum_safe());  // Empty pack -> 0
    std::cout << std::format("  product(2, 3, 4) = {}\n", product(2, 3, 4));
    std::cout << std::format("  product() = {}\n", product());  // Empty pack -> 1

    // ---- 3. Fold with comma operator ----
    std::cout << "\n=== 3. Comma fold (no recursion) ===\n";
    std::cout << "  ";
    print_all(42, 3.14, "world", 'Z');

    // ---- 4. sizeof... ----
    std::cout << "\n=== 4. sizeof...(pack) ===\n";
    show_count(1, 2, 3);
    show_count("hello");
    show_count();  // 0 elements

    // ---- 5. Perfect forwarding factory ----
    std::cout << "\n=== 5. Perfect forwarding ===\n";
    auto pt = create<Point>(1.0, 2.0, 3.0);
    std::cout << std::format("  Point({}, {}, {})\n", pt->x, pt->y, pt->z);

    auto str = create<std::string>(5, 'A');  // string(5, 'A') = "AAAAA"
    std::cout << std::format("  String: \"{}\"\n", *str);

    // ---- 6. Variadic class template (SimpleTuple) ----
    std::cout << "\n=== 6. Variadic class template ===\n";
    SimpleTuple<int, double, std::string> t(42, 3.14, "hello");
    std::cout << std::format("  get<0>: {}\n", get<0>(t));
    std::cout << std::format("  get<1>: {:.2f}\n", get<1>(t));
    std::cout << std::format("  get<2>: {}\n", get<2>(t));

    // ---- 7. Type-safe logging ----
    std::cout << "\n=== 7. Type-safe log ===\n";
    log_message("INFO", "User", "logged in from", "192.168.1.1");
    log_message("DEBUG", "Value =", 42, "delta =", 0.001);

    // ---- 8. Compile-time type predicates ----
    std::cout << "\n=== 8. Compile-time predicates ===\n";
    static_assert(all_integral<int, short, long, char>);
    static_assert(!all_integral<int, double>);
    static_assert(any_floating<int, double, char>);
    static_assert(!any_floating<int, long>);
    static_assert(all_same<int, int, int>);
    static_assert(!all_same<int, int, double>);

    std::cout << std::format("  all_integral<int, short, long>: {}\n",
                              all_integral<int, short, long>);
    std::cout << std::format("  any_floating<int, double>: {}\n",
                              any_floating<int, double>);
    std::cout << std::format("  all_same<int, int, int>: {}\n",
                              all_same<int, int, int>);

    std::cout << "\nAll static_asserts passed.\n";

    return 0;
}
