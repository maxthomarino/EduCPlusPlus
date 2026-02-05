/**
 * concepts_intro.cpp - C++20 Concepts
 * 
 * Concepts constrain templates with readable requirements.
 * Better error messages, cleaner code.
 */

#include <iostream>
#include <format>
#include <concepts>
#include <vector>
#include <list>

// Define a concept: type must be addable
template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

// Define concept: must have .size() and be iterable
template<typename T>
concept Container = requires(T c) {
    { c.size() } -> std::convertible_to<std::size_t>;
    { c.begin() };
    { c.end() };
};

// Use concept in template (clean syntax!)
template<Addable T>
T sum(T a, T b) {
    return a + b;
}

// Requires clause syntax
template<typename T>
    requires std::integral<T>
T factorial(T n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

// Concept with auto (terse syntax)
void print_size(const Container auto& c) {
    std::cout << std::format("Size: {}\n", c.size());
}

// Multiple constraints
template<typename T>
    requires std::integral<T> && std::signed_integral<T>
T absolute(T value) {
    return value < 0 ? -value : value;
}

// Combining standard concepts
template<std::floating_point T>
T average(const std::vector<T>& values) {
    T sum = 0;
    for (const auto& v : values) sum += v;
    return sum / static_cast<T>(values.size());
}

int main() {
    // Addable concept
    std::cout << std::format("sum(3, 4) = {}\n", sum(3, 4));
    std::cout << std::format("sum(1.5, 2.5) = {}\n", sum(1.5, 2.5));
    // sum("a", "b");  // Error: strings not Addable
    
    // Integral concept
    std::cout << std::format("factorial(5) = {}\n", factorial(5));
    // factorial(5.0);  // Error: double is not integral
    
    // Container concept
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::list<double> lst = {1.1, 2.2, 3.3};
    print_size(vec);
    print_size(lst);
    // print_size(42);  // Error: int is not a Container
    
    // Floating point concept
    std::vector<double> grades = {85.5, 92.0, 78.5, 96.0};
    std::cout << std::format("Average: {:.2f}\n", average(grades));
    
    // Signed integral concept
    std::cout << std::format("absolute(-42) = {}\n", absolute(-42));
    
    return 0;
}
