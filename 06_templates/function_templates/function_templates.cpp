/**
 * function_templates.cpp - Function Templates in C++
 *
 * Templates let you write type-generic code.
 * The compiler generates a specialized version for each type used.
 */

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <type_traits>

// -----------------------------------------------
// 1. Basic function template
//    T is deduced from the arguments.
// -----------------------------------------------
template<typename T>
T max_of(T a, T b) {
    return (a > b) ? a : b;
}

// -----------------------------------------------
// 2. Multiple template parameters
// -----------------------------------------------
template<typename T, typename U>
auto add(T a, U b) {
    return a + b;  // Return type deduced (C++14)
}

// -----------------------------------------------
// 3. Non-type template parameters
//    Values (not types) as template arguments.
// -----------------------------------------------
template<int N>
constexpr int power_of_two() {
    return 1 << N;
}

template<typename T, std::size_t N>
void print_array(const T (&arr)[N]) {
    std::cout << "Array[" << N << "]: ";
    for (std::size_t i = 0; i < N; ++i) {
        std::cout << arr[i] << ' ';
    }
    std::cout << '\n';
}

// -----------------------------------------------
// 4. Template specialization
//    Provide a custom implementation for a specific type.
// -----------------------------------------------
template<typename T>
std::string type_name() {
    return "unknown";
}

// Full specializations for common types
template<> std::string type_name<int>()         { return "int"; }
template<> std::string type_name<double>()      { return "double"; }
template<> std::string type_name<std::string>() { return "std::string"; }

// -----------------------------------------------
// 5. SFINAE and enable_if (pre-C++20 way to constrain)
//    Only enable this function for integral types.
// -----------------------------------------------
template<typename T>
auto is_even(T value) -> std::enable_if_t<std::is_integral_v<T>, bool> {
    return value % 2 == 0;
}

// -----------------------------------------------
// 6. if constexpr: compile-time branching in templates
//    Different code paths for different types, no runtime cost.
// -----------------------------------------------
template<typename T>
std::string describe(T value) {
    if constexpr (std::is_integral_v<T>) {
        return std::format("{} (integer, {} bytes)", value, sizeof(T));
    } else if constexpr (std::is_floating_point_v<T>) {
        return std::format("{:.4f} (floating, {} bytes)", value, sizeof(T));
    } else {
        return "unsupported type";
    }
}

// -----------------------------------------------
// 7. Variadic templates with fold expressions (C++17)
//    Accept any number of arguments of any types.
// -----------------------------------------------
template<typename... Args>
auto sum(Args... args) {
    return (args + ...);  // Unary right fold
}

template<typename... Args>
void print_all(Args&&... args) {
    ((std::cout << args << ' '), ...);  // Comma fold
    std::cout << '\n';
}

int main() {
    // Basic template
    std::cout << std::format("max(3, 7) = {}\n", max_of(3, 7));
    std::cout << std::format("max(3.14, 2.72) = {}\n", max_of(3.14, 2.72));
    std::cout << std::format("max(\"abc\", \"xyz\") = {}\n",
                              max_of<std::string>("abc", "xyz"));

    // Multiple template parameters
    std::cout << std::format("add(1, 2.5) = {}\n", add(1, 2.5));

    // Non-type parameters
    std::cout << std::format("2^10 = {}\n", power_of_two<10>());

    int arr[] = {10, 20, 30, 40};
    print_array(arr);  // N deduced as 4

    // Specialization
    std::cout << std::format("type_name<int>: {}\n", type_name<int>());
    std::cout << std::format("type_name<double>: {}\n", type_name<double>());

    // SFINAE
    std::cout << std::format("is_even(42) = {}\n", is_even(42));
    // is_even(3.14);  // Compile error: not integral

    // if constexpr
    std::cout << describe(42) << '\n';
    std::cout << describe(3.14159) << '\n';

    // Variadic templates
    std::cout << std::format("sum(1,2,3,4,5) = {}\n", sum(1, 2, 3, 4, 5));
    print_all("hello", 42, 3.14, 'x');

    return 0;
}
