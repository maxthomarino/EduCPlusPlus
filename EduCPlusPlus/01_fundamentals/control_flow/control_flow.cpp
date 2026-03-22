/**
 * control_flow.cpp - Control Flow in Modern C++
 *
 * Control flow is where your program decides what happens next.
 * Modern C++ keeps the familiar if/switch/loops, but adds features that
 * reduce scope clutter and make branch intent easier to read.
 *
 * In this lesson, focus on one habit: keep temporary decision variables
 * as close as possible to the place where they are used.
 *
 * Standard: C++17 (if-init, constexpr if), C++20 (range-for init)
 * Prerequisites: 01_fundamentals/basics/ (auto, structured bindings)
 * Reference: reference/en/cpp/language/if.html
 *            reference/en/cpp/language/range-for.html
 */

#include <iostream>
#include <format>
#include <vector>
#include <map>
#include <optional>
#include <type_traits>

// Helper that may or may not return a value
std::optional<int> find_first_even(const std::vector<int>& nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return std::nullopt;
}

// =========================================
// Key Takeaways:
//   1. Prefer if/switch initializers when a helper value is only needed in
//      that statement.
//   2. Prefer range-for for direct traversal, especially with structured bindings.
//   3. Use constexpr if in generic code to select behavior at compile time.
//   4. Choose while/do-while when the number of iterations is condition-driven.
// =========================================

int main() {
    // -----------------------------------------------
    // 1. if-else with initializer (C++17)
    //    What: If-with-initializer declares a helper variable scoped to the if/else statement.
    //    When: Use this when a temporary value is needed only for the branch condition and body.
    //    Why: It keeps helper variables out of outer scope and reduces accidental reuse.
    //    Use: Use the form if (init; condition) { ... } else { ... }.
    //    Which: C++17
    //
    //    This pattern reads naturally: "compute value, then branch on it."
    //    The temporary stays local to the decision itself, which keeps
    //    surrounding code cleaner.
    //
    //    Watch out: the initializer variable is visible in BOTH
    //    the if-branch and the else-branch, but not after.
    // -----------------------------------------------
    if (auto val = find_first_even({3, 7, 4, 9}); val.has_value()) {
        std::cout << std::format("First even: {}\n", *val);
    } else {
        std::cout << "No even number found\n";
    }
    // 'val' is no longer accessible here -- scope stays tight

    // -----------------------------------------------
    // 2. switch with initializer (C++17)
    //    What: Switch-with-initializer declares a value scoped to the switch statement.
    //    When: Use this when the switched value is only relevant inside that switch.
    //    Why: It keeps local decision state tightly scoped and clearer.
    //    Use: Use the form switch (init; value) { case ... }.
    //    Which: C++17
    //
    //    Same idea as if-init, but for multi-way branching:
    //    compute once, branch many ways, keep temporary local.
    //
    //    Watch out: switch cases fall through by default.
    //    Use break (or [[fallthrough]] intentionally).
    // -----------------------------------------------
    enum class Color { Red, Green, Blue };

    // switch with init-statement: 'pick' is scoped to this switch block
    switch (auto pick = Color::Green; pick) {
        case Color::Red:   std::cout << "Red\n";   break;
        case Color::Green: std::cout << "Green\n"; break;
        case Color::Blue:  std::cout << "Blue\n";  break;
    }
    // 'pick' is no longer accessible here -- stays tightly scoped

    // -----------------------------------------------
    // 3. Range-based for loops (C++11/17/20)
    //    What: Range-based for loops iterate directly over container elements.
    //    When: Use this for straightforward element traversal without manual index or iterator control.
    //    Why: It reduces loop boilerplate and common indexing mistakes.
    //    Use: Write for (auto& element : container) { ... } and choose const/reference intentionally.
    //    Which: C++11 (with later enhancements in C++17/C++20)
    //
    //    Range-for keeps loop intent obvious: "visit each element."
    //    You spend less attention on loop mechanics and more on logic.
    //
    //    Watch out: modifying container shape (insert/erase) during
    //    a range-for is usually unsafe.
    // -----------------------------------------------
    std::vector<int> numbers = {10, 20, 30, 40, 50};

    // Basic range-for
    std::cout << "Numbers: ";
    for (int n : numbers) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // Range-for with structured bindings (C++17)
    std::map<std::string, int> scores = {
        {"Alice", 95}, {"Bob", 87}, {"Carol", 92}
    };

    for (const auto& [name, score] : scores) {
        std::cout << std::format("{}: {}\n", name, score);
    }

    // Range-for with init-statement (C++20)
    for (auto v = std::vector{1, 2, 3}; int n : v) {
        std::cout << std::format("val = {}\n", n);
    }

    // -----------------------------------------------
    // 4. while and do-while
    //    What: while and do-while loops run repeated work based on a runtime condition.
    //    When: Use while when zero iterations are possible, and do-while when one iteration is required.
    //    Why: They model open-ended loops better than fixed-count for loops.
    //    Use: Keep loop conditions explicit and update loop state in a single obvious place.
    //    Which: C++98+
    //
    //    Use these when you do not know the exact iteration count up front.
    //    The loop continues until your condition says "stop."
    //
    //    Watch out: do-while always executes once.
    // -----------------------------------------------
    // Collatz conjecture: keep going until we reach 1
    int n = 27;
    int steps = 0;
    while (n != 1) {
        n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
        ++steps;
    }
    std::cout << std::format("Collatz(27) took {} steps\n", steps);

    // do-while: body executes at least once
    int attempt = 0;
    do {
        ++attempt;
    } while (attempt < 3);
    std::cout << std::format("Attempts: {}\n", attempt);

    // -----------------------------------------------
    // 5. constexpr if (C++17) -- compile-time branching
    //    What: if constexpr performs compile-time branching.
    //    When: Use this in templates or generic lambdas where behavior depends on type properties.
    //    Why: It discards invalid branches at compile time and simplifies metaprogramming.
    //    Use: Write if constexpr (condition) { ... } else { ... }.
    //    Which: C++17
    //
    //    Think of this as "type-based branching." The wrong branch
    //    is removed during compilation, so it does not need to compile
    //    for that type at all.
    //
    //    Watch out: constexpr if is meaningful in dependent/generic
    //    contexts, such as templates and generic lambdas.
    // -----------------------------------------------
    auto describe = [](auto value) {
        if constexpr (std::is_integral_v<decltype(value)>) {
            std::cout << std::format("{} is an integer\n", value);
        } else if constexpr (std::is_floating_point_v<decltype(value)>) {
            std::cout << std::format("{} is a float\n", value);
        } else {
            std::cout << "Unknown type\n";
        }
    };

    describe(42);
    describe(3.14);

    return 0;
}

// =========================================
// General Discussion
// =========================================
// The biggest quality-of-life improvement here is initializer-style branching.
// if (init; condition) and switch (init; value) keep temporary state near the
// decision, which makes code easier to trust during review.
//
// Range-for is still the clearest loop for straightforward traversal. Once
// the loop logic becomes complex, it helps to pause and ask whether a named
// algorithm or a small helper function would explain intent better.
//
// constexpr if is the bridge to generic programming without template noise.
// It keeps type-specific behavior explicit while still letting one function
// handle multiple categories of input.
// =========================================
