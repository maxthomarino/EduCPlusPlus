/**
 * type_traits_guide.cpp - Type Traits and Compile-Time Type Introspection
 *
 * Type traits (from <type_traits>) let you ask questions about types at
 * COMPILE TIME: "Is T an integer?" "Is T copyable?" "What happens if I
 * remove const from T?" The compiler answers these questions before any
 * code runs, enabling templates to adapt their behavior based on type
 * properties.
 *
 * Why it matters:
 *   - Write templates that work correctly with ANY type by checking
 *     properties rather than naming specific types
 *   - Enable/disable function overloads based on type properties
 *   - Optimize at compile time (e.g., use memcpy for trivially copyable
 *     types, element-wise copy for others)
 *   - Replace SFINAE with cleaner constexpr if (C++17) + type traits
 *   - Underpin how std::move, std::forward, and the entire STL work
 *
 * The three categories of type traits:
 *   1. Type queries:        is_integral, is_floating_point, is_class, ...
 *   2. Type relationships:  is_same, is_base_of, is_convertible, ...
 *   3. Type transformations: remove_const, add_pointer, decay, ...
 *
 * Naming convention:
 *   std::is_integral<T>      — a struct with a static bool member "value"
 *   std::is_integral_v<T>    — shorthand for ::value (variable template, C++17)
 *   std::remove_const<T>     — a struct with a member type alias "type"
 *   std::remove_const_t<T>   — shorthand for ::type (alias template, C++14)
 *
 * Prerequisites: Templates, constexpr, concepts (helpful but not required).
 * Reference:     reference/en/cpp/header/type_traits.html
 */

#include <iostream>
#include <format>
#include <type_traits>
#include <string>
#include <vector>
#include <memory>

// =====================================================
// FREQUENTLY ASKED QUESTIONS (first-timer Q&A)
// =====================================================
//
// Q: What IS a "type trait"?
// A: A type trait is a template struct that contains compile-time
//    information about a type. For example, std::is_integral<int>
//    is a struct whose static member "value" is true. The compiler
//    evaluates this at compile time — no runtime cost.
//
// Q: Why not just use concepts (C++20) instead?
// A: Concepts build ON TOP of type traits. When you write
//    std::integral<T>, that concept is defined using std::is_integral_v<T>.
//    Type traits are the foundation; concepts are the friendly syntax.
//    You still need type traits for:
//    - Type transformations (remove_const, decay, etc.)
//    - Compile-time conditional types (std::conditional)
//    - SFINAE (pre-C++20 code)
//    - Any metaprogramming that manipulates types
//
// Q: What's the difference between _v and _t suffixes?
// A:   std::is_integral_v<T>   = std::is_integral<T>::value   (bool)
//      std::remove_const_t<T>  = std::remove_const<T>::type   (a type)
//    _v is for VALUE traits (answers with true/false).
//    _t is for TYPE traits (answers with a transformed type).
//    Always use the _v / _t shortcuts — they're shorter and clearer.
//
// Q: When are type traits evaluated?
// A: At COMPILE TIME. They produce compile-time constants (constexpr
//    bool) or type aliases. Zero runtime overhead. The compiler uses
//    template specialization internally to "compute" the answer.
//
// Q: How do type traits work internally?
// A: Through template specialization. For example:
//
//    // Primary template: default is false
//    template<typename T>
//    struct is_pointer : std::false_type {};
//
//    // Specialization for pointer types: true
//    template<typename T>
//    struct is_pointer<T*> : std::true_type {};
//
//    is_pointer<int>::value   → false (matches primary)
//    is_pointer<int*>::value  → true  (matches specialization)
//
//    std::true_type and std::false_type are just structs with a static
//    constexpr bool member "value" set to true or false respectively.
//
// Q: What is "SFINAE" and how do type traits relate to it?
// A: SFINAE = "Substitution Failure Is Not An Error." It's a C++
//    rule: if substituting template parameters produces an invalid
//    type, the compiler silently discards that overload instead of
//    reporting an error. Type traits like std::enable_if<condition>
//    deliberately create invalid types to selectively disable
//    template overloads. C++20 concepts are the modern replacement
//    for SFINAE, but understanding SFINAE helps you read older code.
// =====================================================

// =====================================================
// HOW TYPE TRAITS WORK: THE MECHANICS
//
// All type traits ultimately rely on template specialization.
// The compiler matches the most specific specialization:
//
//   template<typename T> struct is_void : false_type {};
//   template<>           struct is_void<void> : true_type {};
//
// For compound types like pointers, partial specialization is used:
//
//   template<typename T> struct is_pointer : false_type {};
//   template<typename T> struct is_pointer<T*> : true_type {};
//
// For cv-qualifiers, multiple specializations handle all variants:
//
//   template<typename T> struct remove_const          { using type = T; };
//   template<typename T> struct remove_const<const T> { using type = T; };
//
// The compiler's type deduction engine does the heavy lifting —
// matching T* against int* deduces T = int, confirming it IS a pointer.
// =====================================================

// -----------------------------------------------
// 1. Type category queries — "What kind of type is this?"
// -----------------------------------------------
void demo_type_categories() {
    std::cout << "=== 1. Type categories ===\n\n";

    // --- Fundamental type queries ---
    std::cout << "  Fundamental types:\n";
    std::cout << std::format("    is_integral<int>:        {}\n", std::is_integral_v<int>);
    std::cout << std::format("    is_integral<double>:     {}\n", std::is_integral_v<double>);
    std::cout << std::format("    is_integral<bool>:       {}\n", std::is_integral_v<bool>);
    // bool IS integral in C++ — it's essentially an integer that holds 0 or 1

    std::cout << std::format("    is_floating_point<double>: {}\n",
                              std::is_floating_point_v<double>);
    std::cout << std::format("    is_arithmetic<int>:      {}\n", std::is_arithmetic_v<int>);
    // is_arithmetic = is_integral OR is_floating_point

    // --- Compound type queries ---
    std::cout << "\n  Compound types:\n";
    std::cout << std::format("    is_pointer<int*>:        {}\n", std::is_pointer_v<int*>);
    std::cout << std::format("    is_pointer<int>:         {}\n", std::is_pointer_v<int>);
    std::cout << std::format("    is_reference<int&>:      {}\n", std::is_reference_v<int&>);
    std::cout << std::format("    is_array<int[5]>:        {}\n", std::is_array_v<int[5]>);
    std::cout << std::format("    is_array<vector<int>>:   {}\n",
                              std::is_array_v<std::vector<int>>);
    // vector is NOT an array in the type trait sense — it's a class

    // --- Class type queries ---
    std::cout << "\n  Class types:\n";
    std::cout << std::format("    is_class<string>:        {}\n", std::is_class_v<std::string>);
    std::cout << std::format("    is_class<int>:           {}\n", std::is_class_v<int>);
    std::cout << std::format("    is_enum<std::byte>:      {}\n", std::is_enum_v<std::byte>);

    // --- Const/volatile queries ---
    std::cout << "\n  CV qualifiers:\n";
    std::cout << std::format("    is_const<const int>:     {}\n", std::is_const_v<const int>);
    std::cout << std::format("    is_const<int>:           {}\n", std::is_const_v<int>);
    // Watch out: is_const<const int*> is FALSE — the pointer is not const,
    // the pointed-to int is. is_const<int* const> is TRUE — the pointer is const.
    std::cout << std::format("    is_const<const int*>:    {} (pointer is not const!)\n",
                              std::is_const_v<const int*>);
    std::cout << std::format("    is_const<int* const>:    {} (pointer IS const)\n",
                              std::is_const_v<int* const>);
}

// -----------------------------------------------
// 2. Type property queries — "What can I do with this type?"
// -----------------------------------------------
void demo_type_properties() {
    std::cout << "\n=== 2. Type properties ===\n\n";

    // --- Constructibility ---
    std::cout << "  Constructibility:\n";
    std::cout << std::format("    is_default_constructible<int>:    {}\n",
                              std::is_default_constructible_v<int>);
    std::cout << std::format("    is_copy_constructible<string>:    {}\n",
                              std::is_copy_constructible_v<std::string>);
    std::cout << std::format("    is_move_constructible<unique_ptr>: {}\n",
                              std::is_move_constructible_v<std::unique_ptr<int>>);
    std::cout << std::format("    is_copy_constructible<unique_ptr>: {}\n",
                              std::is_copy_constructible_v<std::unique_ptr<int>>);
    // unique_ptr is move-only — it's move constructible but NOT copy constructible

    // --- Trivially copyable (safe for memcpy) ---
    std::cout << "\n  Trivially copyable:\n";
    std::cout << std::format("    is_trivially_copyable<int>:      {}\n",
                              std::is_trivially_copyable_v<int>);
    std::cout << std::format("    is_trivially_copyable<string>:   {}\n",
                              std::is_trivially_copyable_v<std::string>);
    // string has internal pointers and allocations — memcpy would break it.
    // int is just bytes — memcpy is safe and the compiler can optimize copies.

    // This is how STL implementations optimize: vector<int> can use memcpy
    // for reallocation, but vector<string> must call move constructors.

    // --- noexcept properties ---
    std::cout << "\n  noexcept properties:\n";
    std::cout << std::format("    is_nothrow_move_constructible<string>:    {}\n",
                              std::is_nothrow_move_constructible_v<std::string>);
    std::cout << std::format("    is_nothrow_move_constructible<vector<int>>: {}\n",
                              std::is_nothrow_move_constructible_v<std::vector<int>>);
    // std::vector checks this at compile time when reallocating.
    // If move is noexcept, it moves elements. If not, it copies (for safety).

    // --- Polymorphic ---
    struct Base { virtual ~Base() = default; };
    struct Derived : Base {};
    struct PlainStruct { int x; };

    std::cout << "\n  Polymorphic:\n";
    std::cout << std::format("    is_polymorphic<Base>:         {}\n",
                              std::is_polymorphic_v<Base>);
    std::cout << std::format("    is_polymorphic<PlainStruct>:  {}\n",
                              std::is_polymorphic_v<PlainStruct>);
    // Polymorphic = has at least one virtual function. This is what
    // dynamic_cast requires.
}

// -----------------------------------------------
// 3. Type relationships — "How do these types relate?"
// -----------------------------------------------
void demo_type_relationships() {
    std::cout << "\n=== 3. Type relationships ===\n\n";

    struct Animal { virtual ~Animal() = default; };
    struct Dog : Animal {};
    struct Cat : Animal {};

    // --- Same type ---
    std::cout << "  is_same:\n";
    std::cout << std::format("    is_same<int, int>:       {}\n",
                              std::is_same_v<int, int>);
    std::cout << std::format("    is_same<int, long>:      {}\n",
                              std::is_same_v<int, long>);
    std::cout << std::format("    is_same<int, const int>: {}\n",
                              std::is_same_v<int, const int>);
    // const int is NOT the same as int — they're different types.
    // Use std::remove_const_t if you want to compare ignoring const.

    // --- Inheritance ---
    std::cout << "\n  is_base_of:\n";
    std::cout << std::format("    is_base_of<Animal, Dog>: {}\n",
                              std::is_base_of_v<Animal, Dog>);
    std::cout << std::format("    is_base_of<Dog, Animal>: {}\n",
                              std::is_base_of_v<Dog, Animal>);
    std::cout << std::format("    is_base_of<Dog, Cat>:    {}\n",
                              std::is_base_of_v<Dog, Cat>);
    // Note: is_base_of<T, T> is TRUE — a class IS a base of itself.

    // --- Convertibility ---
    std::cout << "\n  is_convertible:\n";
    std::cout << std::format("    is_convertible<int, double>:   {}\n",
                              std::is_convertible_v<int, double>);
    std::cout << std::format("    is_convertible<double, int>:   {}\n",
                              std::is_convertible_v<double, int>);
    std::cout << std::format("    is_convertible<Dog*, Animal*>: {}\n",
                              std::is_convertible_v<Dog*, Animal*>);
    std::cout << std::format("    is_convertible<Animal*, Dog*>: {}\n",
                              std::is_convertible_v<Animal*, Dog*>);
    // Derived* converts to Base* implicitly (safe upcast).
    // Base* does NOT convert to Derived* implicitly (needs a cast).
}

// -----------------------------------------------
// 4. Type transformations — "Give me a modified version of this type"
// -----------------------------------------------
void demo_type_transformations() {
    std::cout << "\n=== 4. Type transformations ===\n\n";

    // --- remove_const / add_const ---
    static_assert(std::is_same_v<std::remove_const_t<const int>, int>);
    static_assert(std::is_same_v<std::add_const_t<int>, const int>);
    std::cout << "  remove_const_t<const int> == int: true\n";
    std::cout << "  add_const_t<int> == const int:    true\n";

    // --- remove_reference ---
    // This is how std::move works internally!
    // std::move(x) is essentially: static_cast<remove_reference_t<T>&&>(x)
    static_assert(std::is_same_v<std::remove_reference_t<int&>, int>);
    static_assert(std::is_same_v<std::remove_reference_t<int&&>, int>);
    static_assert(std::is_same_v<std::remove_reference_t<int>, int>);
    std::cout << "  remove_reference_t<int&>  == int: true\n";
    std::cout << "  remove_reference_t<int&&> == int: true\n";

    // --- remove_pointer / add_pointer ---
    static_assert(std::is_same_v<std::remove_pointer_t<int*>, int>);
    static_assert(std::is_same_v<std::add_pointer_t<int>, int*>);
    std::cout << "  remove_pointer_t<int*> == int:    true\n";
    std::cout << "  add_pointer_t<int> == int*:       true\n";

    // --- decay: simulates pass-by-value transformation ---
    // decay does what happens when you pass an argument by value:
    //   - Removes references: int& -> int
    //   - Removes cv-qualifiers: const int -> int
    //   - Array to pointer: int[5] -> int*
    //   - Function to function pointer: void(int) -> void(*)(int)
    static_assert(std::is_same_v<std::decay_t<const int&>, int>);
    static_assert(std::is_same_v<std::decay_t<int[5]>, int*>);
    std::cout << "  decay_t<const int&> == int:       true\n";
    std::cout << "  decay_t<int[5]> == int*:          true\n";

    // --- conditional: compile-time if for types ---
    // std::conditional<condition, TypeIfTrue, TypeIfFalse>
    using small_type = std::conditional_t<sizeof(int) <= 4, int, long>;
    static_assert(std::is_same_v<small_type, int>);  // int is usually 4 bytes
    std::cout << std::format("\n  conditional: sizeof(int)={}, chose: int\n", sizeof(int));

    // This is the type-level equivalent of the ternary operator:
    //   value-level:  auto x = (cond ? a : b);
    //   type-level:   using T = conditional_t<cond, A, B>;
}

// -----------------------------------------------
// 5. Practical: using type traits with constexpr if
//    This is the modern (C++17) way to branch at compile time
//    based on type properties. Replaces SFINAE for most cases.
// -----------------------------------------------

template<typename T>
std::string describe_type(const T& value) {
    // constexpr if: the "dead" branch is discarded at compile time.
    // This means code in the else branch doesn't need to be valid
    // for all T — only the taken branch is compiled.
    if constexpr (std::is_integral_v<T>) {
        if constexpr (std::is_signed_v<T>) {
            return std::format("signed integer: {}", value);
        } else {
            return std::format("unsigned integer: {}", value);
        }
    } else if constexpr (std::is_floating_point_v<T>) {
        return std::format("floating point: {:.6f}", value);
    } else if constexpr (std::is_same_v<T, std::string>) {
        return std::format("string: \"{}\"", value);
    } else {
        return "(unknown type)";
    }
}

void demo_constexpr_if() {
    std::cout << "\n=== 5. constexpr if + type traits ===\n\n";

    std::cout << std::format("  {}\n", describe_type(42));
    std::cout << std::format("  {}\n", describe_type(42u));
    std::cout << std::format("  {}\n", describe_type(3.14));
    std::cout << std::format("  {}\n", describe_type(std::string("hello")));
}

// -----------------------------------------------
// 6. Practical: optimized copy using type traits
//    The STL uses this exact technique internally.
// -----------------------------------------------

template<typename T>
void smart_copy(const T* src, T* dst, std::size_t count) {
    if constexpr (std::is_trivially_copyable_v<T>) {
        // Safe to use memcpy — T has no custom copy logic
        std::memcpy(dst, src, count * sizeof(T));
        std::cout << "  (used memcpy — trivially copyable)\n";
    } else {
        // Must use element-wise copy — T has custom constructors
        for (std::size_t i = 0; i < count; ++i) {
            dst[i] = src[i];
        }
        std::cout << "  (used element-wise copy — non-trivial type)\n";
    }
}

void demo_optimized_copy() {
    std::cout << "\n=== 6. Optimized copy ===\n\n";

    int ints[] = {1, 2, 3, 4, 5};
    int int_copy[5];
    std::cout << "  Copying int[5]:\n";
    smart_copy(ints, int_copy, 5);

    std::string strings[] = {"a", "b", "c"};
    std::string str_copy[3];
    std::cout << "  Copying string[3]:\n";
    smart_copy(strings, str_copy, 3);
}

// -----------------------------------------------
// 7. Writing your own type trait
// -----------------------------------------------

// Check if a type has a .size() method
template<typename T, typename = void>
struct has_size : std::false_type {};

template<typename T>
struct has_size<T, std::void_t<decltype(std::declval<T>().size())>>
    : std::true_type {};

// HOW THIS WORKS:
//   std::void_t<Expr> is void if Expr is valid, and a substitution
//   failure if Expr is invalid.
//
//   std::declval<T>() creates a "fake" T value for use in decltype
//   (it never runs — it's a compile-time-only construct).
//
//   For has_size<std::string>:
//     decltype(std::declval<string>().size()) → std::size_t (valid!)
//     std::void_t<std::size_t> → void
//     Matches the specialization → true_type
//
//   For has_size<int>:
//     decltype(std::declval<int>().size()) → ERROR (int has no .size())
//     Substitution failure → NOT an error (SFINAE)
//     Falls back to primary template → false_type

// Shorthand with _v
template<typename T>
constexpr bool has_size_v = has_size<T>::value;

void demo_custom_trait() {
    std::cout << "\n=== 7. Custom type trait ===\n\n";

    static_assert(has_size_v<std::string>);
    static_assert(has_size_v<std::vector<int>>);
    static_assert(!has_size_v<int>);
    static_assert(!has_size_v<double>);

    std::cout << std::format("  has_size<string>:     {}\n", has_size_v<std::string>);
    std::cout << std::format("  has_size<vector<int>>: {}\n", has_size_v<std::vector<int>>);
    std::cout << std::format("  has_size<int>:         {}\n", has_size_v<int>);
    std::cout << std::format("  has_size<double>:      {}\n", has_size_v<double>);

    // C++20 concepts make this MUCH simpler:
    //   template<typename T>
    //   concept HasSize = requires(T t) { { t.size() } -> std::convertible_to<std::size_t>; };
    //
    // But understanding the type_traits approach helps you read
    // pre-C++20 code and understand how concepts work internally.
}

// -----------------------------------------------
// 8. std::enable_if — SFINAE-based overload control (pre-C++20)
//    Included for completeness — prefer concepts in new code.
// -----------------------------------------------

// Only enable this function for arithmetic types
template<typename T>
std::enable_if_t<std::is_arithmetic_v<T>, T>
safe_abs(T value) {
    return value < 0 ? -value : value;
}

// HOW std::enable_if WORKS:
//   enable_if<true, T>::type  = T      (valid — overload is included)
//   enable_if<false, T>::type = ???    (doesn't exist — SFINAE kicks in)
//
// When T = int:
//   is_arithmetic_v<int> = true
//   enable_if_t<true, int> = int      (return type is int)
//   Function is included in overload set
//
// When T = string:
//   is_arithmetic_v<string> = false
//   enable_if_t<false, string> = <substitution failure>
//   Function is excluded from overload set (no error — SFINAE)
//
// The C++20 equivalent is MUCH cleaner:
//   template<std::is_arithmetic T>   // Won't compile, not a concept
//   T safe_abs(T value);
//
//   Or with a concept:
//   template<typename T> requires std::is_arithmetic_v<T>
//   T safe_abs(T value);

void demo_enable_if() {
    std::cout << "\n=== 8. std::enable_if (SFINAE) ===\n\n";

    std::cout << std::format("  safe_abs(-42) = {}\n", safe_abs(-42));
    std::cout << std::format("  safe_abs(-3.14) = {:.2f}\n", safe_abs(-3.14));
    // safe_abs(std::string("hello"));  // Won't compile — string is not arithmetic

    std::cout << "  (safe_abs(string) correctly rejected at compile time)\n";
}

// =========================================
// Key Takeaways:
//   1. Type traits answer compile-time questions about types.
//   2. Use _v suffix for value traits, _t suffix for type transformations.
//   3. Combine type traits with constexpr if (C++17) for clean branching.
//   4. Key traits to know: is_integral, is_same, is_base_of,
//      is_trivially_copyable, remove_const, remove_reference, decay.
//   5. std::decay_t<T> gives you the type you'd get if you passed T by value.
//   6. std::conditional_t<bool, A, B> is a compile-time ternary for types.
//   7. std::void_t + SFINAE lets you detect if a type supports an operation.
//   8. Prefer C++20 concepts over enable_if for new code — same power,
//      much cleaner syntax.
// =========================================

int main() {
    demo_type_categories();
    demo_type_properties();
    demo_type_relationships();
    demo_type_transformations();
    demo_constexpr_if();
    demo_optimized_copy();
    demo_custom_trait();
    demo_enable_if();

    std::cout << "\nAll static_asserts passed.\n";

    return 0;
}
