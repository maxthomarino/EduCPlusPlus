/**
 * functions.cpp - Functions in Modern C++
 *
 * Functions are where you package behavior and name intent.
 * Modern C++ improves function design in three important ways:
 * - clearer declarations (trailing return types, auto return deduction)
 * - compile-time execution tools (constexpr)
 * - safer generic interfaces (variadic templates, [[nodiscard]], delete/default)
 *
 * The goal is not to use every feature everywhere. The goal is to pick the
 * smallest feature that makes your function easier to read and harder to misuse.
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
//    What: A trailing return type places the return type after the parameter list.
//    When: Use this when the return type depends on parameters or is clearer at the end.
//    Why: It improves readability in template-heavy signatures.
//    Use: Write auto fn(args) -> ReturnType.
//    Which: C++11
//
//    For everyday functions, this is mostly style.
//    For templates and decltype-based returns, it can
//    make long declarations much easier to follow.
//
//    Watch out: trailing return types are required for some
//    decltype expressions; otherwise they are optional.
// -----------------------------------------------
auto multiply(int a, double b) -> double {
    return a * b;
}

// -----------------------------------------------
// 2. Auto return type deduction (C++14)
//    What: Auto return type deduction lets the compiler deduce a function return type from return statements.
//    When: Use this for simple functions where the return type is obvious from the implementation.
//    Why: It shortens signatures and avoids repeating long types.
//    Use: Declare the function with auto and provide return expressions of one consistent type.
//    Which: C++14
//
//    This works best when a reader can infer the type quickly.
//    If the return type is subtle or important to the API contract,
//    spelling it out is usually clearer.
//
//    Watch out: all return paths must resolve to one type.
// -----------------------------------------------
auto make_greeting(std::string_view name) {
    return std::format("Hello, {}!", name);
}

// -----------------------------------------------
// 3. constexpr functions (C++11/14/20)
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
//    A constexpr function can still run at runtime.
//    It runs at compile time only when the context requires
//    a constant expression.
//
//    Watch out: "constexpr function" does not mean
//    "always compile-time execution."
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
//    What: Function overloading provides multiple functions with the same name but different signatures.
//    When: Use this when operations share intent but differ by argument types or counts.
//    Why: It creates a clean API while preserving type safety.
//    Use: Define distinct parameter lists and avoid ambiguous overload sets.
//    Which: C++98+
//
//    Overloads let call sites stay simple:
//    print(42), print(3.14), print("text") all express the same intent.
//
//    Watch out: implicit conversions can create ambiguity.
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
//    What: = default and = delete control special member function generation and availability.
//    When: Use this when class ownership or copy/move behavior must be explicit.
//    Why: It documents class semantics and prevents accidental operations.
//    Use: Default operations you want and delete operations that must not compile.
//    Which: C++11
//
//    This makes ownership rules explicit in class definitions,
//    so readers and compilers both know what is allowed.
//
//    Watch out: declaring any constructor suppresses some implicit ones.
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
//    What: Variadic templates accept zero or more template arguments.
//    When: Use this for type-safe APIs that operate on an arbitrary number of arguments.
//    Why: They replace unsafe C-style variadics with compile-time checked code.
//    Use: Expand parameter packs directly or with fold expressions.
//    Which: C++11 (fold expressions in C++17)
//
//    Variadic templates are the type-safe way to say
//    "this function can accept many arguments."
//    Fold expressions make common patterns concise.
//
//    Watch out: some fold operators need an explicit identity value
//    if the pack can be empty.
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
//    What: [[nodiscard]] requests a warning when a returned value is ignored.
//    When: Use this on functions where ignoring the result is usually a bug.
//    Why: It catches silent logic errors at compile time.
//    Use: Annotate return types or functions with [[nodiscard]].
//    Which: C++17
//
//    Use this for "important result" APIs such as error checks,
//    validation calls, and computed decisions.
//
//    Watch out: if you ignore the result intentionally, document why.
// -----------------------------------------------
[[nodiscard]] int compute_important_value() {
    return 42;
}

// =========================================
// Key Takeaways:
//   1. Use constexpr for pure computations that may benefit from compile-time evaluation.
//   2. Use auto return deduction when return type is obvious; spell it out when clarity is better.
//   3. Use overloads to keep call sites readable across related input types.
//   4. Use fold expressions to simplify variadic template logic.
//   5. Use [[nodiscard]] and = delete to prevent common misuse at compile time.
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

    // [[nodiscard]] -- uncommenting this line would warn:
    // compute_important_value();
    int val = compute_important_value();
    std::cout << std::format("Important value: {}\n", val);

    return 0;
}
