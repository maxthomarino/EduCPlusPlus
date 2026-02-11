/**
 * ranges_intro.cpp - C++20 Ranges Library
 *
 * Before C++20, STL algorithms required explicit iterator pairs — verbose,
 * error-prone (mismatched begin/end), and impossible to compose without
 * intermediate containers. Ranges (C++20) fix all three problems: you pass
 * the container directly, compose operations with the pipe (|) operator,
 * and views evaluate lazily — no intermediate allocations.
 *
 * Use ranges when chaining filters, transforms, or slicing on sequences.
 * Prerequisites: See 04_stl_containers/ and 05_algorithms/ first.
 * Reference: reference/en/cpp/ranges.html
 *            reference/en/cpp/ranges/filter_view.html
 *            reference/en/cpp/ranges/transform_view.html
 */

#include <iostream>
#include <format>
#include <ranges>
#include <vector>
#include <string>
#include <algorithm>
#include <numeric>

// -----------------------------------------------
// 1. Ranges vs traditional iterator pairs
//    Traditional: algorithm(begin, end, predicate)
//    Ranges:      algorithm(container, predicate)
//    Eliminates mismatched iterator bugs and is shorter to write.
//
//    Watch out: range-based algorithms are in std::ranges::,
//    not std::. The two namespaces have different overloads.
// -----------------------------------------------

// -----------------------------------------------
// 2. View composition with the pipe operator (|)
//    Views are lightweight, non-owning wrappers that describe
//    a transformation. They do NOT store results — each element
//    is computed on demand during iteration.
//
//    Watch out: a view holds a reference to its source range.
//    If the source is destroyed, the view dangles.
// -----------------------------------------------

// -----------------------------------------------
// 3. Lazy evaluation — views compute on demand
//    A pipeline like filter | transform | take does not loop
//    through the data three times. Each element flows through
//    the entire pipeline before the next element is requested.
// -----------------------------------------------

// -----------------------------------------------
// 4. Common view adaptors
//    take(n)    — first n elements
//    drop(n)    — skip first n elements
//    reverse    — iterate in reverse
//    keys/values — project pairs (e.g., from a map)
//
//    Watch out: views::reverse requires a bidirectional range.
//    Forward-only ranges (like views::iota) cannot be reversed.
// -----------------------------------------------

// -----------------------------------------------
// 5. views::iota — generate a sequence of values
//    iota(start) produces an infinite sequence: start, start+1, ...
//    iota(start, end) produces [start, end).
//    Useful for index generation and replacing manual loops.
// -----------------------------------------------

// -----------------------------------------------
// 6. Range algorithms — pass the container, not iterators
//    std::ranges::sort, std::ranges::find, std::ranges::count_if, etc.
//    These accept a range directly and support projections (member
//    pointers or callables that extract a sort key).
// -----------------------------------------------

// -----------------------------------------------
// 7. Projections — sort/compare by a computed key
//    A projection is an extra argument that transforms each element
//    before the comparator sees it. Avoids writing custom comparators.
// -----------------------------------------------

// =========================================
// Key Takeaways:
//   1. Views are lazy and non-owning — they compose without allocating.
//   2. Use | to chain view adaptors into readable pipelines.
//   3. Prefer std::ranges:: algorithms over std:: — they accept whole containers.
//   4. Use projections to sort or compare by a specific field/key.
//   5. Never let a view outlive the range it refers to.
// =========================================

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // ---- 1. Traditional vs Ranges ----
    std::cout << "--- Traditional vs Ranges ---\n";

    // Traditional: iterator pairs, manual loop
    std::cout << "Traditional even squares: ";
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        if (*it % 2 == 0) {
            std::cout << (*it * *it) << ' ';
        }
    }
    std::cout << '\n';

    // Ranges: composable and declarative
    std::cout << "Ranges even squares:     ";
    auto even_squares = numbers
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });

    for (int n : even_squares) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // ---- 3. Lazy evaluation demo ----
    std::cout << "\n--- Lazy Evaluation ---\n";
    auto pipeline = numbers
        | std::views::filter([](int n) {
            std::cout << std::format("  filtering {}\n", n);
            return n > 5;
          })
        | std::views::transform([](int n) {
            std::cout << std::format("  transforming {}\n", n);
            return n * 2;
          })
        | std::views::take(3);

    // Nothing has been computed yet — the pipeline is just a description.
    // Computation happens element-by-element only when we iterate:
    std::cout << "Taking first 3 numbers > 5, doubled:\n";
    for (int n : pipeline) {
        std::cout << std::format("  got: {}\n", n);
    }

    // ---- 4. Common view adaptors ----
    std::cout << "\n--- Common Views ---\n";

    std::cout << "take(5):    ";
    for (int n : numbers | std::views::take(5)) {
        std::cout << n << ' ';
    }

    std::cout << "\ndrop(7):    ";
    for (int n : numbers | std::views::drop(7)) {
        std::cout << n << ' ';
    }

    std::cout << "\nreverse:    ";
    for (int n : numbers | std::views::reverse) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // ---- 5. views::iota ----
    std::cout << "\n--- views::iota ---\n";

    std::cout << "iota(1, 6):  ";
    for (int n : std::views::iota(1, 6)) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // Combine iota with other views — no container needed at all
    std::cout << "First 5 squares: ";
    for (int n : std::views::iota(1)
                 | std::views::transform([](int n) { return n * n; })
                 | std::views::take(5)) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // ---- 6. Range algorithms ----
    std::cout << "\n--- Range Algorithms ---\n";

    std::vector<int> data = {5, 1, 4, 2, 3};

    // std::ranges::sort — pass the container directly
    std::ranges::sort(data);
    std::cout << "Sorted: ";
    for (int n : data) std::cout << n << ' ';
    std::cout << '\n';

    // std::ranges::find
    auto it = std::ranges::find(data, 3);
    if (it != data.end()) {
        std::cout << std::format("Found 3 at index {}\n",
                                  std::distance(data.begin(), it));
    }

    // ---- 7. Projections ----
    std::cout << "\n--- Projections ---\n";

    struct Student {
        std::string name;
        int grade;
    };

    std::vector<Student> students = {
        {"Alice", 92}, {"Bob", 85}, {"Charlie", 98}, {"Diana", 88}
    };

    // Sort by grade descending using a projection — no custom comparator
    std::ranges::sort(students, std::ranges::greater{}, &Student::grade);

    std::cout << "Students by grade (descending):\n";
    for (const auto& s : students) {
        std::cout << std::format("  {} - {}\n", s.name, s.grade);
    }

    // Find student by name using a projection
    auto found = std::ranges::find(students, "Bob", &Student::name);
    if (found != students.end()) {
        std::cout << std::format("Found {}: grade {}\n",
                                  found->name, found->grade);
    }

    return 0;
}
