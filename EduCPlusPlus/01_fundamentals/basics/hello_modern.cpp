/**
 * hello_modern.cpp - Modern C++ Hello World
 *
 * If you learned older C++, this file shows the "new default style" in one
 * place. Classic code often repeated types everywhere, passed strings in ways
 * that copied more than needed, and built output with verbose stream chains.
 *
 * Modern C++ gives us cleaner tools:
 * - auto (C++11) to remove obvious type repetition
 * - std::string_view (C++17) for non-owning string parameters
 * - structured bindings (C++17) for readable unpacking
 * - std::format (C++20) for safer, clearer formatting
 *
 * Reference: reference/en/cpp/language/auto.html
 *            reference/en/cpp/string/basic_string_view.html
 *            reference/en/cpp/utility/format/format.html
 */

#include <iostream>
#include <string>
#include <string_view>
#include <format>

// -----------------------------------------------
// 1. auto -- let the compiler deduce the type
//    What: auto deduces a variable's type from its initializer expression.
//    When: Use this when the initializer already makes the type clear.
//    Why: It removes redundant type spelling while preserving static type safety.
//    Use: Write auto name = initializer; and use const auto& for non-owning reads.
//    Which: C++11
//
//    Read this left to right: "I need a value here; the initializer
//    tells the compiler exactly what type it should be." This makes
//    local code shorter and easier to scan.
//
//    Watch out: auto strips top-level const and references.
//    Use "const auto&" when you need them preserved.
// -----------------------------------------------

// -----------------------------------------------
// 2. string_view -- a lightweight, non-owning view of a string
//    What: std::string_view is a non-owning view over contiguous characters.
//    When: Use this for read-only string parameters when ownership should not transfer.
//    Why: It avoids allocations and copies compared with pass-by-value strings.
//    Use: Take std::string_view in APIs and ensure referenced storage outlives the view.
//    Which: C++17
//
//    Think of string_view as a read-only "window" into text that
//    already exists elsewhere. That makes it a great default for
//    input parameters that only need to read.
//
//    Watch out: the viewed string must outlive the string_view.
//    Never return a string_view to a local std::string.
// -----------------------------------------------
auto greet(std::string_view name) -> std::string {
    return std::format("Hello, {}! Welcome to Modern C++.", name);
}

// -----------------------------------------------
// 3. Trailing return type (auto -> Type)
//    What: A trailing return type places the return type after the parameter list.
//    When: Use this when the return type depends on parameters or is clearer at the end.
//    Why: It improves readability in template-heavy signatures.
//    Use: Write auto fn(args) -> ReturnType.
//    Which: C++11
//
//    For simple functions this is mostly a style choice. For templates
//    and decltype-heavy signatures, it can make declarations much easier
//    to read because the function name appears earlier.
// -----------------------------------------------
auto add(int a, int b) -> int {
    return a + b;
}

// -----------------------------------------------
// 4. Structured bindings (C++17) -- unpack aggregates
//    What: Structured bindings unpack tuple-like or aggregate values into named variables.
//    When: Use this when you need readable names for pair/tuple/struct elements.
//    Why: It removes boilerplate like .first and .second.
//    Use: Write auto [a, b] = value; or auto& [a, b] = value; to bind by reference.
//    Which: C++17
//
//    This is mainly about readability. Instead of "pair.first" and
//    "pair.second", give values meaningful names right away.
//
//    Watch out: structured bindings create copies by default.
//    Use "auto& [x, y] = ..." to bind by reference.
// -----------------------------------------------

// =========================================
// Key Takeaways:
//   1. Prefer auto when the type is obvious from the initializer.
//   2. Use string_view for read-only string parameters to avoid copies.
//   3. Use std::format for clear, type-safe string formatting.
//   4. Use structured bindings to replace .first/.second boilerplate.
// =========================================

int main() {
    // auto deduces std::string from greet()'s return type
    auto message = greet("World");
    std::cout << message << '\n';

    // Trailing return type -- same result as "int add(int, int)"
    std::cout << std::format("add(3, 4) = {}\n", add(3, 4));

    // Structured bindings: unpack a pair without .first/.second
    auto [x, y] = std::pair{10, 20};
    std::cout << std::format("x = {}, y = {}\n", x, y);

    // Structured bindings with an array
    int arr[] = {100, 200, 300};
    auto [a, b, c] = arr;
    std::cout << std::format("a = {}, b = {}, c = {}\n", a, b, c);

    // const auto& binding -- avoids copying
    const auto& [cx, cy] = std::pair{42, 99};
    std::cout << std::format("cx = {}, cy = {}\n", cx, cy);

    return 0;
}
