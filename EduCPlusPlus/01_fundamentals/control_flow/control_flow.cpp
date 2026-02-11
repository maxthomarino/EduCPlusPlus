/**
 * control_flow.cpp - Control Flow in Modern C++
 *
 * Before C++17, variables declared for use in an if or switch had to live
 * in the surrounding scope, polluting it even when they were only needed
 * inside the branch. C++17 if-init and switch-init confine those variables
 * to the statement itself, and C++20 adds init-statements to range-for.
 *
 * Use these features whenever a variable only matters inside a branch or
 * loop -- it makes intent clearer and prevents accidental reuse.
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

// Helper that may or may not return a value
std::optional<int> find_first_even(const std::vector<int>& nums) {
    for (int n : nums) {
        if (n % 2 == 0) return n;
    }
    return std::nullopt;
}

// =========================================
// Key Takeaways:
//   1. if/switch with initializers (C++17) keep helper variables out of the
//      surrounding scope -- use them as your default style.
//   2. Range-for with structured bindings (C++17) replaces iterator boilerplate
//      for maps and other pair-like containers.
//   3. constexpr if (C++17) discards the untaken branch at compile time --
//      essential for writing clean generic (template) code.
//   4. Prefer range-for over index loops; prefer algorithms over raw loops
//      when the intent matches a named algorithm.
// =========================================

int main() {
    // -----------------------------------------------
    // 1. if-else with initializer (C++17)
    //    Syntax: if (init; condition) { ... }
    //    The variable is scoped to the if/else block, so it
    //    cannot leak into the surrounding scope.
    //
    //    Watch out: the initializer variable is visible in BOTH
    //    the if-branch and the else-branch, but not after.
    // -----------------------------------------------
    if (auto val = find_first_even({3, 7, 4, 9}); val.has_value()) {
        std::cout << std::format("First even: {}\n", *val);
    } else {
        std::cout << "No even number found\n";
    }
    // 'val' is no longer accessible here -- keeps scope clean

    // -----------------------------------------------
    // 2. switch with initializer (C++17)
    //    Same idea as if-init: declare a variable scoped to the
    //    switch statement. Eliminates extra braces or outer variables.
    //
    //    Watch out: don't forget break -- C++ switch cases fall
    //    through by default. Use [[fallthrough]] when intentional.
    // -----------------------------------------------
    enum class Color { Red, Green, Blue };

    auto pick = Color::Green;
    switch (pick) {
        case Color::Red:   std::cout << "Red\n";   break;
        case Color::Green: std::cout << "Green\n"; break;
        case Color::Blue:  std::cout << "Blue\n";  break;
    }

    // -----------------------------------------------
    // 3. Range-based for loops (C++11/17/20)
    //    Iterate directly over containers and ranges without
    //    manually managing iterators or indices.
    //
    //    Watch out: modifying the container (insert/erase) during
    //    a range-for is undefined behavior -- use index loops or
    //    erase-remove for that.
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
    //    Classic loop forms still useful when the number of
    //    iterations is not known ahead of time.
    //
    //    Watch out: do-while always executes the body at least
    //    once -- make sure that first iteration is safe.
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
    //    Demonstrated inside a lambda for simplicity.
    //    The untaken branch is discarded entirely -- it does not
    //    even need to be valid for the given type.
    //
    //    Watch out: constexpr if only works inside templates
    //    (or generic lambdas). In a non-template function, both
    //    branches are still compiled and must be well-formed.
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
