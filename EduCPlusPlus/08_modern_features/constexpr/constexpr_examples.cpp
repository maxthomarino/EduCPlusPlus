/**
 * constexpr_examples.cpp - Compile-Time Computation in Modern C++
 *
 * Before constexpr (C++11), compile-time computation required template
 * metaprogramming — arcane, slow to compile, and unreadable. constexpr
 * lets you write normal-looking functions and classes that the compiler
 * evaluates at compile time when given constant inputs.
 *
 * Use constexpr for lookup tables, math constants, validation, and any
 * computation whose inputs are known at compile time. Use consteval when
 * runtime evaluation must be forbidden. Use constinit to prevent the
 * "static initialization order fiasco."
 *
 * Evolution: C++11 (single-statement), C++14 (loops, variables),
 *   C++17 (constexpr if, constexpr lambdas), C++20 (consteval, constinit,
 *   constexpr virtual, std::vector, std::string, try/catch, new/delete).
 *
 * Reference: reference/en/cpp/language/constexpr.html
 *            reference/en/cpp/language/consteval.html
 *            reference/en/cpp/language/constinit.html
 */

#include <iostream>
#include <format>
#include <array>
#include <string_view>
#include <numeric>
#include <cmath>

// -----------------------------------------------
// 1. Basic constexpr functions
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
//    Evaluated at compile time when called with constant arguments,
//    but can also run at runtime with non-constant arguments.
//    Since C++14, loops, local variables, and multiple statements
//    are all allowed inside constexpr functions.
//
//    Watch out: calling a constexpr function with a runtime value
//    does NOT make the result a compile-time constant. Only a
//    constexpr variable assignment forces compile-time evaluation.
// -----------------------------------------------
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; ++i) {
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
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
//    Constructors and member functions can be constexpr, allowing
//    entire objects to be created and manipulated at compile time.
//    All members must be literal types (scalars, arrays, etc.).
//
//    Watch out: a constexpr constructor does not guarantee compile-time
//    construction — only a constexpr variable declaration does.
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
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
//    The entire table is embedded in the binary as constant data —
//    zero runtime cost. This replaces the old pattern of static
//    initialization with manually computed values.
// -----------------------------------------------
constexpr auto build_squares_table() {
    std::array<int, 20> table{};
    for (int i = 0; i < 20; ++i) {
        table[i] = i * i;
    }
    return table;
}

constexpr auto squares = build_squares_table();

// -----------------------------------------------
// 4. constexpr if (C++17): compile-time branching
//    What: if constexpr performs compile-time branching.
//    When: Use this in templates or generic lambdas where behavior depends on type properties.
//    Why: It discards invalid branches at compile time and simplifies metaprogramming.
//    Use: Write if constexpr (condition) { ... } else { ... }.
//    Which: C++17
//
//    Only the taken branch is compiled; the other is discarded.
//    This enables type-generic code without SFINAE.
//
//    Watch out: the discarded branch must still be syntactically
//    valid. Only template-dependent expressions are truly discarded.
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
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
//    std::string_view is a literal type, so it can be processed
//    at compile time. Useful for compile-time parsing, validation,
//    and hash computation.
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
//    What: consteval makes a function an immediate function that must run at compile time.
//    When: Use this when runtime evaluation must be forbidden.
//    Why: It enforces compile-time computation and catches misuse early.
//    Use: Declare the function consteval and call it only in constant-evaluation contexts.
//    Which: C++20
//
//    Unlike constexpr (which *may* run at runtime), consteval
//    functions are "immediate functions" — every call MUST produce
//    a constant expression or the program is ill-formed.
//
//    Use consteval when a runtime call would be a bug (e.g.,
//    compile-time configuration, code generation, static checks).
//
//    Watch out: you cannot take the address of a consteval function,
//    and you cannot call one with a runtime-only argument.
// -----------------------------------------------
consteval int compile_time_only(int n) {
    return n * n + 1;
}

// -----------------------------------------------
// 7. constinit (C++20): ensure static/thread-local initialization
//    What: constinit guarantees constant initialization for static or thread_local objects.
//    When: Use this to prevent dynamic initialization order issues for static storage.
//    Why: It enforces predictable startup initialization semantics.
//    Use: Apply constinit to static/thread_local variables with constant initializers.
//    Which: C++20
//
//    Guarantees that a static or thread_local variable is initialized
//    at compile time (constant initialization). Prevents the "static
//    initialization order fiasco" where globals depend on each other
//    across translation units.
//
//    Unlike constexpr, constinit does NOT make the variable const —
//    the variable can be modified at runtime.
//
//    Watch out: constinit only applies to static/thread_local
//    variables. It cannot be used on local variables.
// -----------------------------------------------
constinit int global_value = factorial(5);  // Initialized at compile time
// global_value can be modified at runtime (it's not const)

// =========================================
// Key Takeaways:
//   1. constexpr = *may* evaluate at compile time; assign to a constexpr
//      variable to *force* compile-time evaluation.
//   2. consteval = *must* evaluate at compile time; use for values that
//      should never be computed at runtime.
//   3. constinit = initialized at compile time but mutable at runtime;
//      prevents static initialization order problems.
//   4. Use static_assert to verify constexpr results at compile time.
//   5. Compile-time lookup tables (constexpr arrays) are embedded in
//      the binary with zero runtime cost.
// =========================================

int main() {
    // 1. constexpr functions
    std::cout << "--- constexpr Functions ---\n";
    constexpr int f10 = factorial(10);  // Forced compile-time evaluation
    static_assert(f10 == 3628800);      // Verified at compile time

    std::cout << std::format("factorial(10) = {}\n", f10);
    std::cout << std::format("2^10 = {}\n", static_cast<int>(power(2, 10)));

    // 2. constexpr class
    std::cout << "\n--- constexpr Class ---\n";
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
    std::cout << "\n--- Compile-Time Lookup Table ---\n";
    std::cout << std::format("squares[7] = {}\n", squares[7]);
    std::cout << std::format("squares[15] = {}\n", squares[15]);
    static_assert(squares[7] == 49);

    // 4. constexpr if
    std::cout << "\n--- constexpr if ---\n";
    static_assert(process(5) == 10);
    static_assert(process(3.0) == 3.5);
    std::cout << std::format("process(5) = {}\n", process(5));
    std::cout << std::format("process(3.0) = {}\n", process(3.0));

    // 5. Compile-time string processing
    std::cout << "\n--- Compile-Time Strings ---\n";
    constexpr int vowels = count_vowels("Hello World");
    static_assert(vowels == 3);
    std::cout << std::format("Vowels in 'Hello World': {}\n", vowels);

    static_assert(is_palindrome("racecar"));
    static_assert(!is_palindrome("hello"));
    std::cout << std::format("'racecar' palindrome? {}\n", is_palindrome("racecar"));

    // 6. consteval — compile-time only
    std::cout << "\n--- consteval ---\n";
    constexpr int ce = compile_time_only(7);
    static_assert(ce == 50);
    std::cout << std::format("compile_time_only(7) = {}\n", ce);

    // This would NOT compile — runtime argument not allowed:
    // int runtime_val = 7;
    // compile_time_only(runtime_val);  // ERROR: not a constant expression

    // 7. constinit
    std::cout << "\n--- constinit ---\n";
    std::cout << std::format("global_value (initialized at compile time) = {}\n",
                              global_value);
    // constinit does NOT make it const — we can modify at runtime:
    global_value = 999;
    std::cout << std::format("global_value (after runtime modification) = {}\n",
                              global_value);

    return 0;
}
