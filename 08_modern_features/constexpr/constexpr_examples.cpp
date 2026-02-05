/**
 * constexpr_examples.cpp - constexpr in Modern C++
 *
 * constexpr moves computation from runtime to compile time.
 * Benefits: zero runtime cost, catch errors at compile time,
 * values usable as template arguments and array sizes.
 *
 * Evolution:
 *   C++11: simple constexpr functions (single return statement)
 *   C++14: loops, local variables, multiple statements
 *   C++17: constexpr if, constexpr lambdas
 *   C++20: constexpr std::vector, std::string, virtual, try/catch, new/delete
 */

#include <iostream>
#include <format>
#include <array>
#include <string_view>
#include <numeric>
#include <cmath>

// -----------------------------------------------
// 1. Basic constexpr functions
//    Evaluated at compile time when called with
//    compile-time arguments.
// -----------------------------------------------
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; ++i) {  // Loops OK since C++14
        result *= i;
    }
    return result;
}

constexpr double power(double base, int exp) {
    double result = 1.0;
    for (int i = 0; i < exp; ++i) {
        result *= base;
    }
    return result;
}

// -----------------------------------------------
// 2. constexpr class: compile-time objects
// -----------------------------------------------
class Vec2 {
    double x_, y_;

public:
    constexpr Vec2(double x, double y) : x_(x), y_(y) {}

    constexpr Vec2 operator+(const Vec2& other) const {
        return Vec2(x_ + other.x_, y_ + other.y_);
    }

    constexpr Vec2 operator*(double scalar) const {
        return Vec2(x_ * scalar, y_ * scalar);
    }

    constexpr double dot(const Vec2& other) const {
        return x_ * other.x_ + y_ * other.y_;
    }

    constexpr double magnitude_squared() const {
        return x_ * x_ + y_ * y_;
    }

    constexpr double x() const { return x_; }
    constexpr double y() const { return y_; }
};

// -----------------------------------------------
// 3. constexpr with arrays: build lookup tables at compile time
// -----------------------------------------------
constexpr auto build_squares_table() {
    std::array<int, 20> table{};
    for (int i = 0; i < 20; ++i) {
        table[i] = i * i;
    }
    return table;
}

// The entire table is computed at compile time!
constexpr auto squares = build_squares_table();

// -----------------------------------------------
// 4. constexpr if (C++17): compile-time branching
//    Dead branches are not compiled, enabling type-generic code.
// -----------------------------------------------
template<typename T>
constexpr auto process(T value) {
    if constexpr (std::is_integral_v<T>) {
        return value * 2;        // Only compiled for integers
    } else if constexpr (std::is_floating_point_v<T>) {
        return value + 0.5;      // Only compiled for floats
    } else {
        return value;            // Fallback
    }
}

// -----------------------------------------------
// 5. constexpr string processing
//    Process strings at compile time.
// -----------------------------------------------
constexpr int count_vowels(std::string_view s) {
    int count = 0;
    for (char c : s) {
        switch (c) {
            case 'a': case 'e': case 'i': case 'o': case 'u':
            case 'A': case 'E': case 'I': case 'O': case 'U':
                ++count;
        }
    }
    return count;
}

constexpr bool is_palindrome(std::string_view s) {
    std::size_t left = 0;
    std::size_t right = s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        ++left;
        --right;
    }
    return true;
}

// -----------------------------------------------
// 6. consteval (C++20): MUST be evaluated at compile time
//    Unlike constexpr, cannot be called at runtime.
// -----------------------------------------------
consteval int compile_time_only(int n) {
    return n * n + 1;
}

// -----------------------------------------------
// 7. constinit (C++20): ensure static initialization
//    Prevents the "static initialization order fiasco."
// -----------------------------------------------
constinit int global_value = factorial(5);  // Initialized at compile time

int main() {
    // 1. constexpr functions
    constexpr int f10 = factorial(10);  // Computed at compile time
    static_assert(f10 == 3628800);      // Verified at compile time!

    std::cout << std::format("factorial(10) = {}\n", f10);
    std::cout << std::format("2^10 = {}\n", static_cast<int>(power(2, 10)));

    // 2. constexpr class
    constexpr Vec2 a(3.0, 4.0);
    constexpr Vec2 b(1.0, 2.0);
    constexpr Vec2 c = a + b;
    constexpr double d = a.dot(b);

    static_assert(c.x() == 4.0);
    static_assert(c.y() == 6.0);
    static_assert(d == 11.0);

    std::cout << std::format("({},{}) + ({},{}) = ({},{})\n",
                              a.x(), a.y(), b.x(), b.y(), c.x(), c.y());
    std::cout << std::format("dot product = {}\n", d);

    // 3. Compile-time lookup table
    std::cout << std::format("squares[7] = {}\n", squares[7]);
    std::cout << std::format("squares[15] = {}\n", squares[15]);
    static_assert(squares[7] == 49);

    // 4. constexpr if
    static_assert(process(5) == 10);
    static_assert(process(3.0) == 3.5);
    std::cout << std::format("process(5) = {}\n", process(5));
    std::cout << std::format("process(3.0) = {}\n", process(3.0));

    // 5. Compile-time string processing
    constexpr int vowels = count_vowels("Hello World");
    static_assert(vowels == 3);
    std::cout << std::format("Vowels in 'Hello World': {}\n", vowels);

    static_assert(is_palindrome("racecar"));
    static_assert(!is_palindrome("hello"));
    std::cout << std::format("'racecar' palindrome? {}\n", is_palindrome("racecar"));

    // 6. consteval
    constexpr int ce = compile_time_only(7);  // OK: compile time
    static_assert(ce == 50);
    std::cout << std::format("compile_time_only(7) = {}\n", ce);

    // int runtime_val = 7;
    // compile_time_only(runtime_val);  // ERROR: must be compile-time

    // 7. constinit
    std::cout << std::format("global_value = {}\n", global_value);

    return 0;
}
