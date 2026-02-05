/**
 * ranges_algorithms.cpp - C++20 Ranges and Views
 *
 * Demonstrates: ranges::sort, ranges::find, views::filter,
 * views::transform, views::take, pipe operator, and composability.
 * Ranges make algorithm calls cleaner (no begin/end pairs).
 */

#include <iostream>
#include <format>
#include <vector>
#include <string>
#include <algorithm>
#include <ranges>
#include <numeric>

int main() {
    // -----------------------------------------------
    // 1. Range-based algorithms (no begin/end needed!)
    //    std::ranges::sort replaces std::sort(v.begin(), v.end())
    // -----------------------------------------------
    std::cout << "--- Range Algorithms ---\n";
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7};

    std::ranges::sort(nums);  // Clean! No begin/end
    std::cout << "Sorted: ";
    for (int n : nums) std::cout << n << ' ';
    std::cout << '\n';

    // ranges::find returns a sentinel-aware iterator
    if (auto it = std::ranges::find(nums, 7); it != nums.end()) {
        std::cout << std::format("Found 7 at index {}\n",
                                  std::distance(nums.begin(), it));
    }

    // ranges::count, ranges::min, ranges::max
    std::cout << std::format("Min: {}, Max: {}\n",
                              std::ranges::min(nums),
                              std::ranges::max(nums));

    // -----------------------------------------------
    // 2. Views: lazy, composable transformations
    //    Views don't modify the original data.
    //    They are evaluated on-demand (lazy).
    // -----------------------------------------------
    std::cout << "\n--- Views ---\n";

    // filter: keep only even numbers
    std::cout << "Even numbers: ";
    for (int n : nums | std::views::filter([](int n) { return n % 2 == 0; })) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // transform: square each element
    std::cout << "Squared: ";
    for (int n : nums | std::views::transform([](int n) { return n * n; })) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // take: only the first N elements
    std::cout << "First 3: ";
    for (int n : nums | std::views::take(3)) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // drop: skip the first N elements
    std::cout << "Skip 4: ";
    for (int n : nums | std::views::drop(4)) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // reverse
    std::cout << "Reversed: ";
    for (int n : nums | std::views::reverse) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // -----------------------------------------------
    // 3. Composing views with the pipe operator
    //    This is the real power of ranges: chain
    //    multiple transformations, evaluated lazily.
    // -----------------------------------------------
    std::cout << "\n--- Composing Views ---\n";

    // Get squares of even numbers, take first 2
    auto pipeline = nums
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; })
        | std::views::take(2);

    std::cout << "Squares of evens (first 2): ";
    for (int n : pipeline) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // -----------------------------------------------
    // 4. views::iota -- generate a range of numbers
    // -----------------------------------------------
    std::cout << "\n--- views::iota ---\n";

    // Numbers 1 to 10
    std::cout << "1..10: ";
    for (int n : std::views::iota(1, 11)) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // FizzBuzz with ranges!
    std::cout << "\nFizzBuzz (1-15):\n";
    for (int n : std::views::iota(1, 16)) {
        if (n % 15 == 0)      std::cout << "FizzBuzz ";
        else if (n % 3 == 0)  std::cout << "Fizz ";
        else if (n % 5 == 0)  std::cout << "Buzz ";
        else                   std::cout << std::format("{} ", n);
    }
    std::cout << '\n';

    // -----------------------------------------------
    // 5. Projections: transform the comparison key
    //    Sort strings by length without a custom comparator.
    // -----------------------------------------------
    std::cout << "\n--- Projections ---\n";
    std::vector<std::string> words = {"banana", "fig", "cherry", "apple", "date"};

    // Sort by string length using a projection
    std::ranges::sort(words, {}, &std::string::size);

    std::cout << "Sorted by length: ";
    for (const auto& w : words) {
        std::cout << std::format("{}({}) ", w, w.size());
    }
    std::cout << '\n';

    return 0;
}
