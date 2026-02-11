/**
 * lambda_examples.cpp - Lambda Expressions in C++
 *
 * Before C++11, passing behavior to algorithms required writing separate
 * functor classes or using function pointers — verbose and far from the
 * call site. Lambdas let you define anonymous functions inline, right
 * where they are used. C++14 added generic lambdas (auto params) and
 * init captures; C++17 made them constexpr; C++20 added template params.
 *
 * Use lambdas for short callbacks, algorithm predicates, and any place
 * you need a one-off callable. Prefer named functions for complex logic.
 *
 * Syntax: [captures](params) -> return_type { body }
 * Prerequisites: See 01_fundamentals/functions/ first.
 * Reference: reference/en/cpp/language/lambda.html
 */

#include <iostream>
#include <format>
#include <vector>
#include <algorithm>
#include <functional>
#include <string>
#include <memory>

// -----------------------------------------------
// 1. Basic lambda — no captures, no parameters
//    The simplest form: [] { body }.
//    Equivalent to a struct with an operator() — the compiler
//    generates one for you.
// -----------------------------------------------

// -----------------------------------------------
// 2. Lambda with parameters and return type
//    Return type is deduced unless explicitly specified.
//    Watch out: if the body has multiple return statements
//    with different types, you must specify -> return_type.
// -----------------------------------------------

// -----------------------------------------------
// 3. Capture by value [x] vs by reference [&x]
//    By-value captures are const by default inside the lambda body.
//    By-reference captures see (and can modify) the original variable.
//
//    Watch out: capturing a local by reference and returning or storing
//    the lambda creates a dangling reference — the local dies at scope end.
// -----------------------------------------------

// -----------------------------------------------
// 4. Mutable lambdas — modifying by-value captures
//    The mutable keyword lets you modify the lambda's internal copy
//    of a captured variable. The original variable is unaffected.
// -----------------------------------------------

// -----------------------------------------------
// 5. Generic lambdas (C++14) — auto parameters
//    Each auto parameter makes the lambda's operator() a template.
//    This is the simplest way to write type-generic inline code.
//
//    Watch out: each unique set of argument types instantiates a
//    separate specialization — keep generic lambda bodies small.
// -----------------------------------------------

// -----------------------------------------------
// 6. Init captures (C++14) — create new variables in the capture
//    Syntax: [name = expr]. Lets you move objects into a lambda or
//    rename captured variables. Essential for move-only types.
//
//    Watch out: a moved-from variable (the source) is in a valid
//    but unspecified state — don't read it after the move.
// -----------------------------------------------

// -----------------------------------------------
// 7. Immediately-invoked lambda expressions (IILE)
//    Call the lambda right where you define it. Useful for
//    complex initialization of const variables.
// -----------------------------------------------

// -----------------------------------------------
// 8. Lambdas with STL algorithms
//    Lambdas are the primary way to customize algorithm behavior.
//    They replace the old-style functor objects.
// -----------------------------------------------

// -----------------------------------------------
// 9. Storing lambdas with std::function
//    std::function<R(Args...)> can hold any callable with the
//    matching signature: lambdas, function pointers, functors.
//
//    Watch out: std::function has overhead (type erasure, possible
//    heap allocation). Prefer auto or templates when possible.
// -----------------------------------------------

// =========================================
// Key Takeaways:
//   1. Prefer [&] or [=] for short-lived lambdas; use explicit
//      captures ([x, &y]) when the lambda may outlive the scope.
//   2. Use generic lambdas (auto params) for simple type-generic code.
//   3. Use init captures ([ptr = std::move(p)]) to move resources in.
//   4. Immediately-invoked lambdas are a clean way to init const variables.
//   5. Avoid std::function unless you need runtime polymorphism for callables.
// =========================================

int main() {
    std::cout << "--- 1. Basic Lambda ---\n";
    auto greet = [] { std::cout << "Hello from a lambda!\n"; };
    greet();

    std::cout << "\n--- 2. Lambda with Parameters ---\n";
    auto add = [](int a, int b) { return a + b; };
    std::cout << std::format("5 + 3 = {}\n", add(5, 3));

    // Explicit return type needed when multiple return paths differ
    auto safe_divide = [](double a, double b) -> double {
        if (b == 0.0) return 0.0;
        return a / b;
    };
    std::cout << std::format("10 / 3 = {:.2f}\n", safe_divide(10.0, 3.0));

    std::cout << "\n--- 3. Capture by Value vs Reference ---\n";
    int multiplier = 10;
    auto times = [multiplier](int x) { return x * multiplier; };
    std::cout << std::format("7 * 10 = {}\n", times(7));

    int counter = 0;
    auto increment = [&counter] { ++counter; };
    increment();
    increment();
    std::cout << std::format("Counter after 2 increments: {}\n", counter);

    // Mixed captures: a by value, b by reference
    int a = 1, b = 2;
    auto mixed = [a, &b] { b += a; };
    mixed();
    std::cout << std::format("b after mixed capture: {}\n", b);  // b is now 3

    std::cout << "\n--- 4. Mutable Lambda ---\n";
    int x = 0;
    auto mutable_lambda = [x]() mutable { return ++x; };
    std::cout << std::format("Call 1: {}\n", mutable_lambda());  // 1
    std::cout << std::format("Call 2: {}\n", mutable_lambda());  // 2
    // The internal copy increments, but the original x is still 0
    std::cout << std::format("Original x: {}\n", x);

    std::cout << "\n--- 5. Generic Lambda (C++14) ---\n";
    auto print_value = [](const auto& value) {
        std::cout << value << '\n';
    };
    print_value(42);
    print_value("Hello");
    print_value(3.14);

    // Generic lambda with multiple auto params — each independently deduced
    auto max_of = [](const auto& a, const auto& b) {
        return (a > b) ? a : b;
    };
    std::cout << std::format("max(3, 7) = {}\n", max_of(3, 7));

    std::cout << "\n--- 6. Init Captures (C++14) ---\n";
    // Move a unique_ptr into a lambda — only possible with init captures
    auto ptr = std::make_unique<int>(42);
    auto use_ptr = [p = std::move(ptr)] {
        std::cout << std::format("Moved unique_ptr holds: {}\n", *p);
    };
    use_ptr();
    // ptr is now nullptr — ownership was transferred to the lambda

    // Rename a captured variable for clarity
    std::string long_name = "some_important_value";
    auto show = [val = std::move(long_name)] {
        std::cout << std::format("Init-captured: {}\n", val);
    };
    show();

    std::cout << "\n--- 7. Immediately-Invoked Lambda ---\n";
    // Use IILE to initialize a const variable with complex logic
    const auto config_value = []{
        // Imagine reading from environment or config file
        int base = 100;
        int offset = 42;
        return base + offset;
    }();  // Note the () — invoked immediately
    std::cout << std::format("config_value = {}\n", config_value);

    std::cout << "\n--- 8. Lambdas with STL Algorithms ---\n";
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Sort descending using a lambda comparator
    std::sort(nums.begin(), nums.end(),
              [](int a, int b) { return a > b; });

    std::cout << "Sorted descending: ";
    std::for_each(nums.begin(), nums.end(),
                  [](int n) { std::cout << n << ' '; });
    std::cout << '\n';

    // Count elements matching a predicate
    auto count_even = std::count_if(nums.begin(), nums.end(),
                                     [](int n) { return n % 2 == 0; });
    std::cout << std::format("Even numbers: {}\n", count_even);

    std::cout << "\n--- 9. std::function ---\n";
    // std::function can store any callable matching the signature
    std::function<int(int, int)> operation = add;
    std::cout << std::format("operation(10, 20) = {}\n", operation(10, 20));

    // Swap the operation at runtime
    operation = [](int a, int b) { return a * b; };
    std::cout << std::format("operation(10, 20) = {}\n", operation(10, 20));

    return 0;
}
