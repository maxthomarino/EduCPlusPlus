/**
 * concepts_intro.cpp - C++20 Concepts
 *
 * Before concepts, constraining templates relied on SFINAE (Substitution
 * Failure Is Not An Error) — complex, hard to read, and producing
 * notoriously poor error messages. Concepts (C++20) replace SFINAE with
 * named, readable constraints that produce clear diagnostics.
 *
 * Use concepts to restrict template parameters to types that satisfy your
 * requirements. Prefer standard library concepts (std::integral, etc.)
 * over writing your own when possible.
 *
 * Prerequisites: See 06_templates/function_templates/ first.
 * Reference: reference/en/cpp/language/constraints.html
 *            reference/en/cpp/concepts.html
 */

#include <iostream>
#include <format>
#include <concepts>
#include <vector>
#include <list>
#include <string>
#include <type_traits>

// -----------------------------------------------
// 1. Defining a concept with a requires-expression
//    What: A requires-expression checks whether operations are valid for a type.
//    When: Use this when concepts need precise syntactic and semantic requirements.
//    Why: It lets constraints express real usage rather than ad-hoc trait checks.
//    Use: Write requires(T t) { ... } blocks and compose them into concepts.
//    Which: C++20
//
//    A concept is a compile-time predicate on types.
//    The requires-expression lists operations the type must support.
//
//    Watch out: a concept checks syntactic validity, not semantic
//    correctness. "a + b" compiling doesn't mean the result is
//    mathematically meaningful.
// -----------------------------------------------

// Type must support addition returning something convertible to T
template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

// Type must have .size() and be iterable
template<typename T>
concept Container = requires(T c) {
    { c.size() } -> std::convertible_to<std::size_t>;
    { c.begin() };
    { c.end() };
};

// -----------------------------------------------
// 2. Three syntaxes for using concepts
//    What: Concepts are compile-time constraints for template parameters.
//    When: Use this when templates require specific operations or properties.
//    Why: They improve diagnostics and make template contracts explicit.
//    Use: Apply requires clauses or constrained template parameters.
//    Which: C++20
//
//    All three are equivalent; choose the one that reads best.
//
//    (a) Constrained template parameter: template<Addable T>
//    (b) Requires clause:                template<typename T> requires Addable<T>
//    (c) Terse (auto) syntax:            void f(Addable auto x)
//
//    Watch out: in the terse syntax, each 'auto' parameter is
//    independently deduced — f(Addable auto a, Addable auto b)
//    allows a and b to be *different* types.
// -----------------------------------------------

// (a) Constrained template parameter
template<Addable T>
T sum(T a, T b) {
    return a + b;
}

// (b) Requires clause
template<typename T>
    requires std::integral<T>
T factorial(T n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

// (c) Terse auto syntax
void print_size(const Container auto& c) {
    std::cout << std::format("Size: {}\n", c.size());
}

// -----------------------------------------------
// 3. Combining concepts with && and ||
//    What: Concepts are compile-time constraints for template parameters.
//    When: Use this when templates require specific operations or properties.
//    Why: They improve diagnostics and make template contracts explicit.
//    Use: Apply requires clauses or constrained template parameters.
//    Which: C++20
//
//    Build complex constraints from simpler ones.
//    && means "both must hold"; || means "at least one must hold".
// -----------------------------------------------
template<typename T>
    requires std::integral<T> && std::signed_integral<T>
T absolute(T value) {
    return value < 0 ? -value : value;
}

// -----------------------------------------------
// 4. Using standard library concepts
//    What: Concepts are compile-time constraints for template parameters.
//    When: Use this when templates require specific operations or properties.
//    Why: They improve diagnostics and make template contracts explicit.
//    Use: Apply requires clauses or constrained template parameters.
//    Which: C++20
//
//    <concepts> provides many ready-made concepts:
//    std::integral, std::floating_point, std::signed_integral,
//    std::same_as, std::convertible_to, std::totally_ordered, etc.
//
//    Prefer these over hand-written concepts — they are precise,
//    well-tested, and recognized by every C++ developer.
// -----------------------------------------------
template<std::floating_point T>
T average(const std::vector<T>& values) {
    T sum = 0;
    for (const auto& v : values) sum += v;
    return sum / static_cast<T>(values.size());
}

// -----------------------------------------------
// 5. static_assert with concepts
//    What: Concepts are compile-time constraints for template parameters.
//    When: Use this when templates require specific operations or properties.
//    Why: They improve diagnostics and make template contracts explicit.
//    Use: Apply requires clauses or constrained template parameters.
//    Which: C++20
//
//    Use static_assert to verify that a type satisfies a concept
//    at compile time. Useful for documentation and catching errors
//    early in template-heavy code.
// -----------------------------------------------

// =========================================
// Key Takeaways:
//   1. Concepts replace SFINAE with readable, named constraints.
//   2. Use standard library concepts (<concepts>) before writing your own.
//   3. Three syntax forms exist — pick whichever is clearest for the context.
//   4. Concepts check syntax only, not semantics — a + b compiling does
//      not guarantee mathematical correctness.
//   5. Use static_assert(Concept<T>) to document and enforce type requirements.
// =========================================

int main() {
    // ---- 1 & 2. Addable concept ----
    std::cout << "--- Concepts: Addable ---\n";
    std::cout << std::format("sum(3, 4) = {}\n", sum(3, 4));
    std::cout << std::format("sum(1.5, 2.5) = {}\n", sum(1.5, 2.5));
    // sum("a", "b");  // Error: const char* not Addable

    // Factorial — requires std::integral
    std::cout << std::format("factorial(5) = {}\n", factorial(5));
    // factorial(5.0);  // Error: double is not integral

    // ---- 2c. Terse auto syntax ----
    std::cout << "\n--- Container concept ---\n";
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::list<double> lst = {1.1, 2.2, 3.3};
    print_size(vec);
    print_size(lst);
    // print_size(42);  // Error: int is not a Container

    // ---- 3. Combined constraints ----
    std::cout << "\n--- Combined constraints ---\n";
    std::cout << std::format("absolute(-42) = {}\n", absolute(-42));
    // absolute(42u);  // Error: unsigned is not signed_integral

    // ---- 4. Standard library concept ----
    std::cout << "\n--- std::floating_point ---\n";
    std::vector<double> grades = {85.5, 92.0, 78.5, 96.0};
    std::cout << std::format("Average: {:.2f}\n", average(grades));

    // ---- 5. static_assert with concepts ----
    static_assert(Addable<int>);
    static_assert(Addable<double>);
    static_assert(Container<std::vector<int>>);
    static_assert(std::integral<int>);
    static_assert(!std::integral<double>);  // double is NOT integral

    std::cout << "\nAll static_asserts passed.\n";

    return 0;
}
