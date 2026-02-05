/**
 * control_flow.cpp - Control Flow in Modern C++
 *
 * Demonstrates: if-init, switch, range-for, while, do-while
 * C++17 if-init and structured bindings make control flow cleaner.
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

int main() {
    // -----------------------------------------------
    // 1. if-else with initializer (C++17)
    //    Syntax: if (init; condition) { ... }
    //    The variable is scoped to the if/else block.
    // -----------------------------------------------
    if (auto val = find_first_even({3, 7, 4, 9}); val.has_value()) {
        std::cout << std::format("First even: {}\n", *val);
    } else {
        std::cout << "No even number found\n";
    }
    // 'val' is no longer accessible here -- keeps scope clean

    // -----------------------------------------------
    // 2. switch with initializer (C++17)
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
