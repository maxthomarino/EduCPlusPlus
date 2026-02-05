/**
 * functions.cpp - Functions in Modern C++
 *
 * Demonstrates: trailing return types, auto deduction, constexpr functions,
 * default/deleted functions, overloading, and variadic templates.
 */

#include <iostream>
#include <format>
#include <string>
#include <string_view>
#include <numeric>

// -----------------------------------------------
// 1. Trailing return type (C++11)
//    Useful when return type depends on parameters.
// -----------------------------------------------
auto multiply(int a, double b) -> double {
    return a * b;
}

// -----------------------------------------------
// 2. Auto return type deduction (C++14)
//    Compiler deduces the return type from the body.
// -----------------------------------------------
auto make_greeting(std::string_view name) {
    return std::format("Hello, {}!", name);
}

// -----------------------------------------------
// 3. constexpr functions (C++11/14/20)
//    Evaluated at compile time when possible.
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
//    Same name, different parameter types.
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
//    Accept any number of arguments.
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
//    Warns if the return value is discarded.
// -----------------------------------------------
[[nodiscard]] int compute_important_value() {
    return 42;
}

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
