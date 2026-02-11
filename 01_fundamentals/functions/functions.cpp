/**
 * functions.cpp - Functions in Modern C++
 *
 * Classic C++ functions required explicit return types, could not run at
 * compile time, and had no way to accept an arbitrary number of typed
 * arguments without resorting to C-style varargs. Modern standards fix
 * all of this: C++11 added constexpr, trailing returns, default/delete,
 * and variadic templates; C++14 gave us auto return deduction; C++17
 * brought fold expressions and [[nodiscard]].
 *
 * Use these features to write functions that are shorter, safer, and
 * easier for the compiler to optimize.
 *
 * Standard: C++11 / C++14 / C++17 (see individual sections)
 * Prerequisites: 01_fundamentals/basics/ (auto, type deduction)
 * Reference: reference/en/cpp/language/function.html
 *            reference/en/cpp/language/constexpr.html
 *            reference/en/cpp/language/fold.html
 */

#include <iostream>
#include <format>
#include <string>
#include <string_view>
#include <numeric>

// -----------------------------------------------
// 1. Trailing return type (C++11)
//    Syntax: auto f(params) -> ReturnType { ... }
//    Useful when the return type depends on parameters or
//    when you want the function name to appear first for
//    readability in long declarations.
//
//    Watch out: trailing return types are required for some
//    decltype expressions; otherwise they are a style choice.
// -----------------------------------------------
auto multiply(int a, double b) -> double {
    return a * b;
}

// -----------------------------------------------
// 2. Auto return type deduction (C++14)
//    Compiler deduces the return type from the body.
//    All return statements must deduce to the same type.
//
//    Watch out: the definition must be visible at the call
//    site -- you cannot use auto return in a declaration-only
//    header without providing the body.
// -----------------------------------------------
auto make_greeting(std::string_view name) {
    return std::format("Hello, {}!", name);
}

// -----------------------------------------------
// 3. constexpr functions (C++11/14/20)
//    Evaluated at compile time when called in a constant
//    expression; otherwise run normally at runtime. C++14
//    relaxed the "single return" rule; C++20 allows even
//    more (try/catch, virtual calls, allocations).
//
//    Watch out: a constexpr function is not *guaranteed* to
//    run at compile time -- only when the result is used in
//    a constexpr context (e.g., constexpr variable, static_assert).
// -----------------------------------------------
constexpr int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

constexpr bool is_prime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; ++i) {
        if (n % i == 0) return false;
    }
    return true;
}

// -----------------------------------------------
// 4. Function overloading
//    Same name, different parameter types. The compiler picks
//    the best match using overload resolution rules.
//
//    Watch out: implicit conversions can cause ambiguous calls
//    (e.g., passing a float to overloads for int and double).
//    Use explicit casts or add an exact overload to resolve.
// -----------------------------------------------
void print(int value) {
    std::cout << std::format("int: {}\n", value);
}

void print(double value) {
    std::cout << std::format("double: {:.2f}\n", value);
}

void print(std::string_view value) {
    std::cout << std::format("string: {}\n", value);
}

// -----------------------------------------------
// 5. Default and deleted functions (C++11)
//    = default tells the compiler to generate the special member.
//    = delete forbids calling that function (compile-time error).
//
//    Watch out: if you declare ANY constructor, the compiler no
//    longer generates the default constructor. Use = default to
//    bring it back explicitly.
// -----------------------------------------------
struct NonCopyable {
    NonCopyable() = default;                            // Use compiler-generated default
    NonCopyable(const NonCopyable&) = delete;           // Prevent copying
    NonCopyable& operator=(const NonCopyable&) = delete;
    NonCopyable(NonCopyable&&) = default;               // Allow moving
    NonCopyable& operator=(NonCopyable&&) = default;
};

// -----------------------------------------------
// 6. Variadic templates (C++11) -- fold expressions (C++17)
//    Accept any number of arguments with full type safety.
//    Fold expressions (C++17) eliminate the need for recursive
//    template expansion in many common cases.
//
//    Watch out: fold over an empty parameter pack is only valid
//    for &&, ||, and comma. Other operators require at least one
//    argument or an explicit init value: (args + ... + 0).
// -----------------------------------------------
template<typename... Args>
auto sum_all(Args... args) {
    return (args + ...);  // C++17 fold expression
}

// Print any number of arguments
template<typename First, typename... Rest>
void print_all(First first, Rest... rest) {
    std::cout << first;
    if constexpr (sizeof...(rest) > 0) {
        std::cout << ", ";
        print_all(rest...);  // Recursive expansion
    } else {
        std::cout << '\n';
    }
}

// -----------------------------------------------
// 7. [[nodiscard]] attribute (C++17)
//    Warns if the return value is discarded. Apply it to
//    functions where ignoring the result is almost certainly
//    a bug (error codes, computed values, RAII guards).
//
//    Watch out: you can silence the warning with a (void) cast,
//    but ask yourself whether ignoring the result is intentional.
// -----------------------------------------------
[[nodiscard]] int compute_important_value() {
    return 42;
}

// =========================================
// Key Takeaways:
//   1. Use constexpr for any function that CAN be evaluated at compile time --
//      the compiler will still allow runtime calls when needed.
//   2. Prefer auto return deduction for short, obvious function bodies;
//      spell out the return type when it aids readability.
//   3. Fold expressions (C++17) replace recursive variadic helpers with a
//      single, readable expression.
//   4. Mark functions [[nodiscard]] when ignoring the return value is a bug.
//   5. Use = delete to explicitly forbid unwanted operations (copying,
//      implicit conversions) rather than leaving them silently available.
// =========================================

int main() {
    // Trailing return type
    std::cout << std::format("3 * 2.5 = {}\n", multiply(3, 2.5));

    // Auto return deduction
    std::cout << make_greeting("World") << '\n';

    // constexpr: computed at compile time
    constexpr int fib10 = fibonacci(10);
    std::cout << std::format("fibonacci(10) = {}\n", fib10);

    static_assert(is_prime(17), "17 should be prime");  // Compile-time check!
    std::cout << std::format("is_prime(17) = {}\n", is_prime(17));

    // Overloaded functions
    print(42);
    print(3.14);
    print("hello");

    // Variadic fold expression
    std::cout << std::format("sum_all(1,2,3,4,5) = {}\n", sum_all(1, 2, 3, 4, 5));

    // Print any number of arguments
    print_all(1, "hello", 3.14, 'x');

    // [[nodiscard]] -- uncommenting the line below would cause a compiler warning:
    // compute_important_value();  // Warning: return value discarded!
    int val = compute_important_value();
    std::cout << std::format("Important value: {}\n", val);

    return 0;
}
