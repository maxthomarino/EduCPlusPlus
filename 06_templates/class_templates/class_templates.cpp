/**
 * class_templates.cpp - Class Templates in C++
 *
 * WHY THEY EXIST: Class templates let you write type-generic containers and
 *                 abstractions once, and the compiler stamps out a concrete
 *                 class for each combination of template arguments you use.
 *                 This is how the entire STL (vector, map, unique_ptr, ...)
 *                 is built.
 *
 * WHEN TO USE:    Any time you need a data structure or abstraction that works
 *                 across multiple types: stacks, matrices, smart pointers,
 *                 optional wrappers, type traits, etc.
 *
 * STANDARD:       C++98 (basic), C++11 (variadic, alias templates),
 *                 C++17 (CTAD), C++20 (concepts for constraining)
 * PREREQUISITES:  Function templates, type deduction, RAII
 * REFERENCE:      reference/en/cpp/language/class_template
 */

#include <iostream>
#include <format>
#include <string>
#include <stdexcept>
#include <type_traits>
#include <initializer_list>

// -----------------------------------------------
// 1. Basic class template: a type-safe stack
//    Works with any type T and a compile-time capacity N.
//
//    Watch out: CTAD (C++17 Class Template Argument
//    Deduction) can deduce unexpected types -- e.g.,
//    std::vector v{1, 2} deduces vector<int> but
//    std::vector v{"hello"} deduces vector<const char*>,
//    not vector<string>.  Be explicit when the deduced
//    type might surprise you.
// -----------------------------------------------
template<typename T, std::size_t MaxSize = 10>
class Stack {
    T data_[MaxSize];
    std::size_t top_ = 0;

public:
    void push(const T& value) {
        if (top_ >= MaxSize)
            throw std::overflow_error("Stack overflow");
        data_[top_++] = value;
    }

    T pop() {
        if (top_ == 0)
            throw std::underflow_error("Stack underflow");
        return data_[--top_];
    }

    [[nodiscard]] const T& peek() const {
        if (top_ == 0)
            throw std::underflow_error("Stack is empty");
        return data_[top_ - 1];
    }

    [[nodiscard]] bool empty() const { return top_ == 0; }
    [[nodiscard]] std::size_t size() const { return top_; }
};

// -----------------------------------------------
// 2. Class template with multiple type parameters
//    A simple key-value pair.
// -----------------------------------------------
template<typename Key, typename Value>
struct Pair {
    Key first;
    Value second;

    // C++17 CTAD: compiler can deduce Key and Value from constructor args
    Pair(Key k, Value v) : first(std::move(k)), second(std::move(v)) {}

    void print() const {
        std::cout << std::format("({}, {})\n", first, second);
    }
};

// Deduction guide (explicit CTAD for C++17)
// Allows: Pair p("hello", 42); -> Pair<const char*, int>
// With this guide: -> Pair<std::string, int>
Pair(const char*, auto) -> Pair<std::string, decltype(std::declval<decltype(std::declval<int>())>())>;

// -----------------------------------------------
// 3. Partial specialization
//    Specialize the template for pointer types.
// -----------------------------------------------
template<typename T>
class TypeInfo {
public:
    static std::string describe() {
        return "Regular type";
    }
};

// Partial specialization for pointer types
template<typename T>
class TypeInfo<T*> {
public:
    static std::string describe() {
        return "Pointer type";
    }
};

// Partial specialization for arrays
template<typename T, std::size_t N>
class TypeInfo<T[N]> {
public:
    static std::string describe() {
        return std::format("Array of {} elements", N);
    }
};

// -----------------------------------------------
// 4. A more realistic example: Matrix
//    Demonstrates template methods and operator overloading.
// -----------------------------------------------
template<typename T, std::size_t Rows, std::size_t Cols>
class Matrix {
    T data_[Rows][Cols]{};  // Value-initialized to zero

public:
    Matrix() = default;

    // Initializer list constructor
    Matrix(std::initializer_list<std::initializer_list<T>> init) {
        std::size_t r = 0;
        for (const auto& row : init) {
            std::size_t c = 0;
            for (const auto& val : row) {
                if (r < Rows && c < Cols)
                    data_[r][c] = val;
                ++c;
            }
            ++r;
        }
    }

    // Element access
    T& operator()(std::size_t r, std::size_t c) { return data_[r][c]; }
    const T& operator()(std::size_t r, std::size_t c) const { return data_[r][c]; }

    // Matrix addition (same dimensions required at compile time!)
    Matrix operator+(const Matrix& other) const {
        Matrix result;
        for (std::size_t r = 0; r < Rows; ++r)
            for (std::size_t c = 0; c < Cols; ++c)
                result(r, c) = data_[r][c] + other(r, c);
        return result;
    }

    // Scalar multiplication
    Matrix operator*(T scalar) const {
        Matrix result;
        for (std::size_t r = 0; r < Rows; ++r)
            for (std::size_t c = 0; c < Cols; ++c)
                result(r, c) = data_[r][c] * scalar;
        return result;
    }

    void print() const {
        for (std::size_t r = 0; r < Rows; ++r) {
            for (std::size_t c = 0; c < Cols; ++c) {
                std::cout << std::format("{:6.1f} ", static_cast<double>(data_[r][c]));
            }
            std::cout << '\n';
        }
    }

    static constexpr std::size_t rows() { return Rows; }
    static constexpr std::size_t cols() { return Cols; }
};

// -----------------------------------------------
// 5. Type traits: compile-time type introspection
//    Build your own traits to query type properties.
// -----------------------------------------------
template<typename T>
struct is_string : std::false_type {};

template<>
struct is_string<std::string> : std::true_type {};

template<>
struct is_string<const char*> : std::true_type {};

// Helper variable template (C++14 convention)
template<typename T>
inline constexpr bool is_string_v = is_string<T>::value;

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Class templates let you write type-generic containers (Stack, Matrix,
//    Pair) once; the compiler generates a separate class per instantiation.
// 2. Partial specialization lets you customize behavior for categories of
//    types (e.g., all pointer types, all arrays) without repeating the
//    entire class.
// 3. CTAD (C++17) deduces template arguments from constructor parameters,
//    but be careful: it can pick surprising types (const char* vs string).
//    Write explicit deduction guides to steer deduction.
// 4. Non-type template parameters (like Rows, Cols) move information into
//    the type system, enabling compile-time dimension checks.
// 5. Custom type traits (is_string_v) let you query type properties at
//    compile time and use them in if constexpr or enable_if.
// -----------------------------------------------

int main() {
    // Stack
    std::cout << "--- Stack<int, 5> ---\n";
    Stack<int, 5> stack;
    for (int i = 1; i <= 5; ++i) stack.push(i * 10);

    while (!stack.empty()) {
        std::cout << stack.pop() << ' ';
    }
    std::cout << '\n';

    // Stack with strings
    Stack<std::string> str_stack;
    str_stack.push("hello");
    str_stack.push("world");
    std::cout << std::format("Top: {}\n", str_stack.peek());

    // Pair with CTAD
    std::cout << "\n--- Pair ---\n";
    Pair p1(std::string("age"), 25);  // CTAD: Pair<string, int>
    Pair p2(std::string("pi"), 3.14); // CTAD: Pair<string, double>
    p1.print();
    p2.print();

    // Partial specialization
    std::cout << "\n--- Partial Specialization ---\n";
    std::cout << std::format("int:    {}\n", TypeInfo<int>::describe());
    std::cout << std::format("int*:   {}\n", TypeInfo<int*>::describe());
    std::cout << std::format("int[5]: {}\n", TypeInfo<int[5]>::describe());

    // Matrix
    std::cout << "\n--- Matrix<double, 2, 3> ---\n";
    Matrix<double, 2, 3> m1 = {{1, 2, 3}, {4, 5, 6}};
    Matrix<double, 2, 3> m2 = {{10, 20, 30}, {40, 50, 60}};

    auto m3 = m1 + m2;
    auto m4 = m1 * 2.0;

    std::cout << "m1 + m2:\n";
    m3.print();
    std::cout << "m1 * 2:\n";
    m4.print();

    // Type traits
    std::cout << "\n--- Custom Type Traits ---\n";
    std::cout << std::format("is_string<std::string>: {}\n", is_string_v<std::string>);
    std::cout << std::format("is_string<int>: {}\n", is_string_v<int>);

    return 0;
}
