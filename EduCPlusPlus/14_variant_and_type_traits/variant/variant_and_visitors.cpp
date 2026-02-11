/**
 * variant_and_visitors.cpp - std::variant and std::visit
 *
 * std::variant (C++17) is a type-safe union. It holds ONE value at a time
 * from a fixed set of types, but unlike a C union, it KNOWS which type is
 * currently stored and prevents you from reading the wrong one.
 *
 * Why it matters:
 *   - Replaces error-prone C unions with compile-time safety
 *   - Enables "sum types" / "tagged unions" familiar from Rust (enum),
 *     Haskell (data), and TypeScript (discriminated unions)
 *   - Combined with std::visit, enables the Visitor pattern without
 *     virtual functions — no heap allocation, no vtable overhead
 *
 * Key vocabulary:
 *   std::variant<A, B, C>   — can hold an A, a B, or a C
 *   std::get<T>(v)          — extract value (throws if wrong type)
 *   std::get_if<T>(&v)      — extract pointer (nullptr if wrong type)
 *   std::holds_alternative<T>(v) — check which type is active
 *   std::visit(visitor, v)  — apply a callable to the active value
 *   v.index()               — numeric index of the active type
 *
 * Prerequisites: Lambdas, templates, basic polymorphism concepts.
 * Reference:     reference/en/cpp/utility/variant.html
 */

#include <iostream>
#include <format>
#include <variant>
#include <string>
#include <vector>
#include <cmath>
#include <cassert>

// =====================================================
// FREQUENTLY ASKED QUESTIONS (first-timer Q&A)
// =====================================================
//
// Q: How is std::variant different from a C union?
// A: A C union stores one of several types but has NO WAY to know
//    which type is currently active. Reading the wrong member is
//    undefined behavior. std::variant tracks the active type and
//    throws std::bad_variant_access if you try to read the wrong one.
//
// Q: How is std::variant different from std::any?
// A: std::any can hold ANY type (like a Python variable). It uses
//    heap allocation and type erasure. std::variant holds one of a
//    FIXED, compile-time-known set of types, stored inline (no heap).
//    Prefer variant when you know the possible types — it's faster,
//    smaller, and the compiler checks exhaustiveness.
//
// Q: How is std::variant different from inheritance/virtual functions?
// A: With inheritance, the set of derived types is OPEN — anyone can
//    add a new subclass. With variant, the set is CLOSED — all types
//    are listed in the template parameters. This closedness lets the
//    compiler warn if your visitor doesn't handle all types.
//    Use inheritance when the type set may grow. Use variant when
//    the set is fixed and known at compile time.
//
// Q: What happens if I don't handle all types in a visitor?
// A: It won't compile. std::visit requires the visitor to be callable
//    with EVERY type in the variant. This is called "exhaustiveness
//    checking" and is one of variant's greatest strengths.
//
// Q: Can a variant be empty (hold no value)?
// A: Almost never. A variant ALWAYS holds one of its types. The only
//    exception is "valueless by exception" — a state that occurs if
//    a type's constructor or assignment throws an exception partway
//    through changing the active type. In practice this is extremely
//    rare. Check with v.valueless_by_exception() if you're worried.
//
// Q: What type does a variant default-construct to?
// A: The FIRST type in the list. std::variant<int, string> default-
//    constructs to int{} (which is 0). If the first type isn't
//    default-constructible, the variant isn't either — put a simple
//    type first, or use std::monostate as the first type.
//
// Q: What is std::monostate?
// A: An empty type that serves as a "nothing" or "uninitialized" state.
//    Put it first in the variant to allow default construction:
//    std::variant<std::monostate, ComplexType> — defaults to monostate.
//    It's essentially a "none" / "null" option for your variant.
// =====================================================

// =====================================================
// HOW std::variant WORKS INTERNALLY
//
// A variant is essentially:
//   1. A storage buffer large enough to hold the largest type
//      (like a union, using aligned_union or similar)
//   2. An integer "index" that tracks which type is currently active
//
// Simplified conceptual layout:
//
//   struct variant<int, double, string> {
//       alignas(max_align) char storage[max_size];  // raw bytes
//       std::size_t index_;  // 0 = int, 1 = double, 2 = string
//   };
//
// When you assign a value:
//   v = 42;         // destroy current value, construct int in storage, set index_ = 0
//   v = "hello";    // destroy current value, construct string in storage, set index_ = 2
//
// When you read a value:
//   std::get<int>(v);  // check index_ == 0, reinterpret storage as int
//   std::get<string>(v); // check index_ == 2, throw if not
//
// std::visit works by creating a function pointer table (similar to
// a vtable) indexed by the variant's active index. For a visitor V
// and variant<A, B, C>, the compiler generates:
//   table[0] = V(get<A>)
//   table[1] = V(get<B>)
//   table[2] = V(get<C>)
// Then std::visit does: table[v.index()](v)
// This is a single indirect call — very fast.
// =====================================================

// -----------------------------------------------
// The "overloaded" helper — the idiomatic way to build
// a visitor from multiple lambdas (C++17)
// -----------------------------------------------
template<class... Ts>
struct overloaded : Ts... {
    using Ts::operator()...;
};
// Deduction guide (tells the compiler how to deduce Ts...)
template<class... Ts>
overloaded(Ts...) -> overloaded<Ts...>;

// HOW THIS WORKS:
//   overloaded inherits from ALL the lambda types and pulls in
//   each one's operator() with a "using" declaration.
//   So overloaded{lambda1, lambda2, lambda3} is a single object
//   whose operator() is overloaded for each lambda's parameter type.
//
//   Example:
//     auto visitor = overloaded{
//         [](int i)    { cout << "int: " << i; },
//         [](double d) { cout << "dbl: " << d; },
//     };
//     visitor(42);    // calls the int lambda
//     visitor(3.14);  // calls the double lambda
//
// This is a VERY common C++ idiom. You'll see it in almost every
// codebase that uses std::variant.

// -----------------------------------------------
// 1. Basic variant usage
// -----------------------------------------------
void demo_basic_variant() {
    std::cout << "=== 1. Basic variant usage ===\n\n";

    // A variant that can hold int, double, or string
    std::variant<int, double, std::string> v;

    // Default-constructed: holds the FIRST type (int), value-initialized to 0
    std::cout << std::format("  Default: index={}, value={}\n",
                              v.index(), std::get<int>(v));

    // Assign an int
    v = 42;
    std::cout << std::format("  After v=42: index={}, value={}\n",
                              v.index(), std::get<int>(v));

    // Assign a double — the int is destroyed, double is constructed
    v = 3.14;
    std::cout << std::format("  After v=3.14: index={}, value={:.2f}\n",
                              v.index(), std::get<double>(v));

    // Assign a string
    v = std::string("hello");
    std::cout << std::format("  After v=\"hello\": index={}, value={}\n",
                              v.index(), std::get<std::string>(v));

    // --- Checking the active type ---
    std::cout << std::format("\n  holds int?    {}\n", std::holds_alternative<int>(v));
    std::cout << std::format("  holds string? {}\n", std::holds_alternative<std::string>(v));
}

// -----------------------------------------------
// 2. Safe access: get vs get_if
// -----------------------------------------------
void demo_safe_access() {
    std::cout << "\n=== 2. Safe access ===\n\n";

    std::variant<int, std::string> v = 42;

    // --- std::get<T>: throws if wrong type ---
    try {
        [[maybe_unused]] auto& s = std::get<std::string>(v);
    } catch (const std::bad_variant_access& e) {
        std::cout << std::format("  std::get<string> threw: {}\n", e.what());
    }

    // --- std::get_if<T>: returns nullptr if wrong type (no exception) ---
    if (auto* pi = std::get_if<int>(&v)) {
        // pi is a pointer to the int inside the variant
        std::cout << std::format("  get_if<int> succeeded: {}\n", *pi);
    }
    if (auto* ps = std::get_if<std::string>(&v)) {
        std::cout << std::format("  get_if<string> succeeded: {}\n", *ps);
    } else {
        std::cout << "  get_if<string> returned nullptr (expected)\n";
    }

    // Rule of thumb:
    //   Use std::get when you KNOW the type (e.g., after holds_alternative check)
    //   Use std::get_if when you want to CHECK and access in one step
    //   Use std::visit when you need to handle ALL types

    // --- Access by index (less readable, avoid if possible) ---
    v = std::string("world");
    auto& s = std::get<1>(v);  // index 1 = string (0-based)
    std::cout << std::format("  get<1>: {}\n", s);
}

// -----------------------------------------------
// 3. std::visit — the power tool
// -----------------------------------------------
void demo_visit() {
    std::cout << "\n=== 3. std::visit ===\n\n";

    using Value = std::variant<int, double, std::string>;

    // --- 3a. Visit with the overloaded lambda pattern ---
    std::cout << "--- 3a. overloaded{} visitor ---\n";
    Value values[] = {42, 3.14, std::string("hello")};

    for (const auto& v : values) {
        std::visit(overloaded{
            [](int i)              { std::cout << std::format("  int: {}\n", i); },
            [](double d)           { std::cout << std::format("  double: {:.2f}\n", d); },
            [](const std::string& s) { std::cout << std::format("  string: \"{}\"\n", s); },
        }, v);
    }
    // If you forget to handle a type, this WON'T COMPILE.
    // Try commenting out one of the lambdas to see the error.

    // --- 3b. Visit with a generic lambda ---
    std::cout << "\n--- 3b. Generic lambda visitor ---\n";
    for (const auto& v : values) {
        std::visit([](const auto& val) {
            std::cout << std::format("  value: {}\n", val);
        }, v);
    }
    // A generic lambda (auto param) handles ALL types. This compiles
    // as long as std::format can handle all the variant's types.

    // --- 3c. Visit that returns a value ---
    std::cout << "\n--- 3c. Returning from visit ---\n";
    Value v = 42;
    std::string description = std::visit(overloaded{
        [](int i)              { return std::format("integer {}", i); },
        [](double d)           { return std::format("decimal {:.2f}", d); },
        [](const std::string& s) { return std::format("text \"{}\"", s); },
    }, v);
    std::cout << std::format("  Description: {}\n", description);
    // All return types must be the SAME (or convertible to a common type).
}

// -----------------------------------------------
// 4. Real-world example: expression evaluator
//    This shows how variant replaces inheritance for
//    a closed set of types (AST nodes).
// -----------------------------------------------

// Define AST node types as simple structs
struct Literal { double value; };
struct Add { };
struct Multiply { };

// An expression is either a literal or an operation on two sub-expressions
// (We use indices into a vector to avoid recursive variant)
struct Expression {
    std::variant<Literal, Add, Multiply> node;
    int left = -1;   // index into expression list (-1 = none)
    int right = -1;
};

double evaluate(const std::vector<Expression>& exprs, int index) {
    const auto& expr = exprs[index];

    return std::visit(overloaded{
        [](const Literal& lit) {
            return lit.value;
        },
        [&](const Add&) {
            return evaluate(exprs, expr.left) + evaluate(exprs, expr.right);
        },
        [&](const Multiply&) {
            return evaluate(exprs, expr.left) * evaluate(exprs, expr.right);
        },
    }, expr.node);
}

void demo_expression_evaluator() {
    std::cout << "\n=== 4. Expression evaluator ===\n\n";

    // Build: (3 + 4) * 2
    std::vector<Expression> exprs;
    exprs.push_back({Literal{3.0}});         // [0] = 3
    exprs.push_back({Literal{4.0}});         // [1] = 4
    exprs.push_back({Add{}, 0, 1});          // [2] = [0] + [1] = 3 + 4
    exprs.push_back({Literal{2.0}});         // [3] = 2
    exprs.push_back({Multiply{}, 2, 3});     // [4] = [2] * [3] = 7 * 2

    double result = evaluate(exprs, 4);
    std::cout << std::format("  (3 + 4) * 2 = {}\n", result);

    // No virtual functions, no heap allocation, no vtable —
    // just a variant and a visit. The compiler checks at compile time
    // that every node type is handled.
}

// -----------------------------------------------
// 5. std::monostate — the "empty" state
// -----------------------------------------------
void demo_monostate() {
    std::cout << "\n=== 5. std::monostate ===\n\n";

    // Problem: you want a variant that can be "unset"
    // Solution: use std::monostate as the first alternative

    // Without monostate, a variant<string, vector<int>> can't be
    // "empty" — it always holds a string or a vector.
    // With monostate, it can represent "nothing":
    std::variant<std::monostate, std::string, int> maybe_value;

    // Default-constructed to monostate (the first type)
    std::cout << std::format("  Is monostate? {}\n",
                              std::holds_alternative<std::monostate>(maybe_value));

    // Now set a value
    maybe_value = "hello";
    std::cout << std::format("  After assignment: {}\n",
                              std::get<std::string>(maybe_value));

    // Visit with monostate handling
    std::visit(overloaded{
        [](std::monostate)       { std::cout << "  (empty)\n"; },
        [](const std::string& s) { std::cout << std::format("  string: {}\n", s); },
        [](int i)                { std::cout << std::format("  int: {}\n", i); },
    }, maybe_value);

    // monostate vs std::optional:
    //   std::optional<T> holds T or nothing — for a SINGLE type.
    //   variant<monostate, A, B, C> holds nothing, A, B, or C — for MULTIPLE types.
}

// -----------------------------------------------
// 6. Visiting multiple variants simultaneously
// -----------------------------------------------
void demo_multi_visit() {
    std::cout << "\n=== 6. Multi-variant visit ===\n\n";

    using Operand = std::variant<int, double>;
    Operand a = 10;
    Operand b = 3.5;

    // std::visit can take MULTIPLE variants — the visitor receives
    // one argument per variant, with all type combinations handled
    auto result = std::visit(overloaded{
        [](int x, int y)       -> double { return x + y; },
        [](int x, double y)    -> double { return x + y; },
        [](double x, int y)    -> double { return x + y; },
        [](double x, double y) -> double { return x + y; },
    }, a, b);

    std::cout << std::format("  10 + 3.5 = {}\n", result);

    // For N types and M variants, you need N^M overloads.
    // A generic lambda avoids the combinatorial explosion:
    auto generic_add = std::visit([](auto x, auto y) -> double {
        return static_cast<double>(x) + static_cast<double>(y);
    }, a, b);
    std::cout << std::format("  Generic: 10 + 3.5 = {}\n", generic_add);
}

// =========================================
// Key Takeaways:
//   1. std::variant<A, B, C> holds exactly ONE of A, B, or C at a time.
//   2. It's a type-safe, stack-allocated replacement for C unions.
//   3. std::visit + overloaded{} is the idiomatic way to handle all types.
//   4. Forgetting to handle a type in a visitor is a COMPILE ERROR.
//   5. Default-constructs to the FIRST type. Use std::monostate for "empty".
//   6. Prefer variant over inheritance when the type set is closed and known.
//   7. Use std::get_if for safe, no-throw access; std::get for known types.
// =========================================

int main() {
    demo_basic_variant();
    demo_safe_access();
    demo_visit();
    demo_expression_evaluator();
    demo_monostate();
    demo_multi_visit();

    return 0;
}
