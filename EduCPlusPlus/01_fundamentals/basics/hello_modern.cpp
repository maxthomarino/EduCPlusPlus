/**
 * hello_modern.cpp - Modern C++ Hello World
 *
 * In pre-C++11 code, types had to be spelled out explicitly, strings were
 * passed as const char* or heavy std::string copies, and formatted output
 * required printf (unsafe) or iostream manipulators (verbose).
 *
 * Modern C++ introduces auto (C++11), string_view (C++17), structured
 * bindings (C++17), and std::format (C++20) to make everyday code shorter,
 * safer, and more readable. Use these as your default vocabulary.
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
// 1. auto — let the compiler deduce the type
//    Reduces verbosity and prevents narrowing bugs from writing
//    the wrong type. Use auto when the type is obvious from the
//    right-hand side of the assignment.
//
//    Watch out: auto strips top-level const and references.
//    Use "const auto&" when you need them preserved.
// -----------------------------------------------

// -----------------------------------------------
// 2. string_view — a lightweight, non-owning view of a string
//    Unlike const std::string&, string_view does not allocate
//    and can bind to string literals, std::string, or substrings.
//
//    Watch out: the viewed string must outlive the string_view.
//    Never return a string_view to a local std::string.
// -----------------------------------------------
auto greet(std::string_view name) -> std::string {
    return std::format("Hello, {}! Welcome to Modern C++.", name);
}

// -----------------------------------------------
// 3. Trailing return type (auto -> Type)
//    Useful when the return type depends on parameters or when
//    you prefer the function name to appear first for readability.
//    Required for some template and decltype(auto) patterns.
// -----------------------------------------------
auto add(int a, int b) -> int {
    return a + b;
}

// -----------------------------------------------
// 4. Structured bindings (C++17) — unpack aggregates
//    Works with pairs, tuples, arrays, and structs with
//    all-public members. Avoids .first/.second boilerplate.
//
//    Watch out: structured bindings create copies by default.
//    Use "auto& [x, y] = ..." to bind by reference.
// -----------------------------------------------

// =========================================
// Key Takeaways:
//   1. Prefer auto when the type is clear from context; spell it out when not.
//   2. Use string_view for read-only string parameters — zero copies, zero allocations.
//   3. Use std::format instead of iostream manipulators or printf for type-safe output.
//   4. Structured bindings replace tedious .first/.second access on pairs and tuples.
// =========================================

int main() {
    // auto deduces std::string from greet()'s return type
    auto message = greet("World");
    std::cout << message << '\n';

    // Trailing return type — same as writing "int add(int, int)"
    std::cout << std::format("add(3, 4) = {}\n", add(3, 4));

    // Structured bindings: unpack a pair without .first/.second
    auto [x, y] = std::pair{10, 20};
    std::cout << std::format("x = {}, y = {}\n", x, y);

    // Structured bindings with an array
    int arr[] = {100, 200, 300};
    auto [a, b, c] = arr;
    std::cout << std::format("a = {}, b = {}, c = {}\n", a, b, c);

    // const auto& binding — avoids copying
    const auto& [cx, cy] = std::pair{42, 99};
    std::cout << std::format("cx = {}, cy = {}\n", cx, cy);

    return 0;
}
