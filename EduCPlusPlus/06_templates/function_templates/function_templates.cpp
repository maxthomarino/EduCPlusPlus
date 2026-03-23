/**
 * function_templates.cpp - Function Templates in C++
 *
 * WHY THEY EXIST: Templates let you write a function once and have the
 *                 compiler generate a type-specific version for every type
 *                 you call it with.  Without templates, you would need to
 *                 duplicate code for each type (or resort to unsafe void*).
 *
 * WHEN TO USE:    Whenever the same algorithm or operation applies to multiple
 *                 types.  Pair templates with concepts (C++20) or SFINAE/
 *                 enable_if to constrain which types are accepted.
 *
 * STANDARD:       Templates exist since C++98.  Significantly improved in
 *                 C++11 (variadic), C++14 (auto return), C++17 (if constexpr,
 *                 fold expressions), and C++20 (concepts, abbreviated syntax).
 * PREREQUISITES:  Overloading, type deduction, header/source split
 * REFERENCE:      reference/en/cpp/language/function_template
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: Why must template definitions go in header files?
// A: The compiler needs the full template body at every call site in order
//    to stamp out a type-specific instantiation. If the definition is in a
//    .cpp file, other translation units see only the declaration and cannot
//    instantiate the template, causing linker errors. The usual solution is
//    to put definitions in headers. Alternatively, you can use explicit
//    instantiation in a .cpp file to force specific versions to be
//    generated there.
//
// Q: What is two-phase name lookup?
// A: Template compilation happens in two phases. Phase 1 (at definition
//    time) checks syntax and looks up names that do not depend on template
//    parameters. Phase 2 (at instantiation time) looks up dependent names
//    -- those that involve the template parameter T. This is why a typo in
//    a non-dependent name is caught immediately, but an error in a
//    dependent expression only appears when the template is instantiated.
//
// Q: Can template functions be virtual?
// A: No. Virtual dispatch requires a fixed vtable determined at compile
//    time, but each instantiation of a function template would need its
//    own vtable slot. Since the compiler cannot predict all possible
//    instantiations, virtual function templates are prohibited. Use
//    type erasure (e.g., std::function, std::any) or the CRTP pattern
//    if you need polymorphism with templates.
//
// Q: When should I use auto parameters vs explicit template parameters?
// A: The abbreviated syntax void f(auto x) (C++20) is convenient for
//    simple, unconstrained cases. Use explicit template parameters when
//    you need to name the type (e.g., to declare a local variable of
//    type T), when you need multiple parameters to share the same type,
//    or when you want to apply concepts: template<std::integral T>.
//    The abbreviated form deduces each auto independently, so
//    f(auto a, auto b) allows different types for a and b.
//
// =====================================================

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <type_traits>

// -----------------------------------------------
// 1. Basic function template
//    What: Templates generate type-safe code for families of types or values.
//    When: Use this when the same logic should work across multiple types.
//    Why: It improves reuse with compile-time checking and optimization.
//    Use: Define clear template parameters and constrain behavior where needed.
//    Which: C++98+ (modern features added later)
//
//    T is deduced from the arguments.
//
//    Watch out: template code must be in headers
//    (or the same translation unit) -- the compiler
//    needs the full definition at each instantiation
//    site.  Putting the body in a .cpp file causes
//    linker errors.
// -----------------------------------------------
template<typename T>
T max_of(T a, T b) {
    return (a > b) ? a : b;
}

// HOW TEMPLATE INSTANTIATION WORKS:
//   When you call max_of(3, 7), the compiler deduces T=int and generates a
//   concrete function — conceptually max_of_int_int — with every occurrence
//   of T replaced by int.  This is called *instantiation*.
//
//   Each unique set of template arguments creates a separate instantiation
//   with its own machine code.  max_of<int> and max_of<double> are two
//   completely independent functions in the final binary.
//
//   Instantiation happens entirely at compile time — there is zero overhead
//   compared to hand-written per-type functions.  You get type-safety and
//   code reuse for free.
//
//   Because the compiler must see the full template body to stamp out each
//   specialization, the definition must be visible at the point of use.
//   In practice this means keeping template definitions in header files.
//   Putting the body in a .cpp file and including only a declaration causes
//   linker errors (the other translation unit cannot instantiate what it
//   cannot see).
//
//   There are two kinds of instantiation:
//     - Implicit instantiation: triggered automatically when you use the
//       template (e.g., calling max_of(3, 7)).
//     - Explicit instantiation: you force the compiler to generate a
//       specific version with a declaration like:
//         template int max_of(int, int);
//       in a .cpp file.  This can reduce compile times in large projects by
//       instantiating once and linking everywhere.

// -----------------------------------------------
// 2. Multiple template parameters
//    What: Templates generate type-safe code for families of types or values.
//    When: Use this when the same logic should work across multiple types.
//    Why: It improves reuse with compile-time checking and optimization.
//    Use: Define clear template parameters and constrain behavior where needed.
//    Which: C++98+ (modern features added later)
//
//    Watch out: template argument deduction can fail
//    silently if types don't match exactly.  Use
//    explicit template arguments when in doubt
//    (e.g., max_of<double>(1, 2.5)).
// -----------------------------------------------
template<typename T, typename U>
auto add(T a, U b) {
    return a + b;  // Return type deduced (C++14)
}

// -----------------------------------------------
// 3. Non-type template parameters
//    What: Templates generate type-safe code for families of types or values.
//    When: Use this when the same logic should work across multiple types.
//    Why: It improves reuse with compile-time checking and optimization.
//    Use: Define clear template parameters and constrain behavior where needed.
//    Which: C++98+ (modern features added later)
//
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
//    What: Templates generate type-safe code for families of types or values.
//    When: Use this when the same logic should work across multiple types.
//    Why: It improves reuse with compile-time checking and optimization.
//    Use: Define clear template parameters and constrain behavior where needed.
//    Which: C++98+ (modern features added later)
//
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

// HOW SPECIALIZATION RESOLUTION WORKS:
//   When you write type_name<int>(), the compiler must decide which
//   definition to call.  It follows a strict priority order:
//
//   1. First, look for a *full (explicit) specialization* that matches the
//      template arguments exactly.  type_name<int>() has one above, so it
//      wins immediately — returning "int" instead of "unknown".
//
//   2. If no full specialization matches, look for a *partial
//      specialization*.  This applies to class templates only — function
//      templates cannot be partially specialized.  (You can achieve a
//      similar effect for functions by using overloading or if constexpr.)
//
//   3. If no specialization matches at all, use the *primary template*.
//      For type_name<float>() — which has no specialization — the primary
//      template would be selected, returning "unknown".
//
//   This layered resolution is why you can customize type_name<int>()
//   without affecting the general template: the specialization is a
//   completely separate function that the compiler prefers when the
//   arguments match exactly.

// -----------------------------------------------
// 5. SFINAE and enable_if (pre-C++20 way to constrain)
//    What: Templates generate type-safe code for families of types or values.
//    When: Use this when the same logic should work across multiple types.
//    Why: It improves reuse with compile-time checking and optimization.
//    Use: Define clear template parameters and constrain behavior where needed.
//    Which: C++98+ (modern features added later)
//
//    Only enable this function for integral types.
// -----------------------------------------------
template<typename T>
auto is_even(T value) -> std::enable_if_t<std::is_integral_v<T>, bool> {
    return value % 2 == 0;
}

// HOW SFINAE WORKS:
//   SFINAE = Substitution Failure Is Not An Error.
//
//   When the compiler encounters a call like is_even(42), it tries every
//   candidate template.  For this overload it substitutes T=int into the
//   signature, including the return type:
//     std::enable_if_t<std::is_integral_v<int>, bool>
//   Since is_integral_v<int> is true, enable_if_t<true, bool> yields bool,
//   the substitution succeeds, and this overload is viable.
//
//   If you called is_even(3.14), the compiler substitutes T=double:
//     std::enable_if_t<std::is_integral_v<double>, bool>
//   is_integral_v<double> is false, so enable_if_t<false, bool> has no
//   member type — the substitution *fails*.  Instead of emitting a compile
//   error, the compiler silently removes this overload from the candidate
//   set.  That is SFINAE in action.
//
//   Watch out: only errors in the *immediate context* count as SFINAE
//   errors.  The immediate context is the function signature: return type,
//   parameter types, template parameter default arguments, and explicit
//   template arguments.  If the substitution succeeds in the signature but
//   an error occurs inside the *function body*, that is a hard compile
//   error — not SFINAE.
//
//   C++20 concepts replaced most SFINAE usage with clearer, more readable
//   syntax.  For example, the function above can be rewritten as:
//     template<std::integral T>
//     bool is_even(T value) { return value % 2 == 0; }
//   Concepts produce better error messages and are easier to compose.

// -----------------------------------------------
// 6. if constexpr: compile-time branching in templates
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
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
//    What: Variadic templates accept zero or more template arguments.
//    When: Use this for type-safe APIs that operate on an arbitrary number of arguments.
//    Why: They replace unsafe C-style variadics with compile-time checked code.
//    Use: Expand parameter packs directly or with fold expressions.
//    Which: C++11 (fold expressions in C++17)
//
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

// HOW FOLD EXPRESSIONS EXPAND:
//   A fold expression collapses a parameter pack with a binary operator.
//   The compiler expands it at compile time — there is no loop at runtime.
//
//   Given args = {1, 2, 3}:
//
//   Unary right fold:  (args + ...)
//     expands to:  (1 + (2 + 3))
//     — association starts from the right.
//
//   Unary left fold:   (... + args)
//     expands to:  ((1 + 2) + 3)
//     — association starts from the left.
//
//   Binary left fold:  (init + ... + args)
//     expands to:  (((init + 1) + 2) + 3)
//     — an initial value is folded in from the left.
//
//   Binary right fold: (args + ... + init)
//     expands to:  (1 + (2 + (3 + init)))
//     — an initial value is folded in from the right.
//
//   The comma fold used in print_all above — ((std::cout << args << ' '), ...)
//   — expands to a sequence of comma-separated expressions:
//     (std::cout << a1 << ' '), (std::cout << a2 << ' '), ...
//   Each expression is evaluated left-to-right (guaranteed by the comma
//   operator), so the arguments print in order.

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Templates generate type-specific code at compile time -- zero runtime
//    overhead compared to hand-written per-type functions.
// 2. Template definitions must be visible at the point of instantiation,
//    so keep them in header files (or use explicit instantiation).
// 3. Use if constexpr (C++17) for compile-time branching inside templates
//    -- unreachable branches are discarded entirely, no SFINAE needed.
// 4. Fold expressions (C++17) make variadic templates dramatically simpler
//    by collapsing a parameter pack with a binary operator.
// 5. Prefer C++20 concepts over SFINAE / enable_if for constraining
//    template arguments -- they produce much clearer error messages.
// -----------------------------------------------

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
