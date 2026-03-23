/**
 * ranges_algorithms.cpp - C++20 Ranges and Views
 *
 * WHY IT EXISTS:  Classic STL algorithms require passing begin/end iterator
 *                 pairs, which is verbose and error-prone (mismatched
 *                 iterators).  C++20 Ranges let you pass a container directly,
 *                 add *projections* (transform the comparison key inline), and
 *                 compose lazy *views* with the pipe (|) operator -- all with
 *                 zero runtime overhead.
 *
 * WHEN TO USE:    Prefer ranges:: algorithms whenever you target C++20 or
 *                 later.  Use views to build declarative data-processing
 *                 pipelines (filter, transform, take, drop) that are evaluated
 *                 lazily -- no intermediate containers are created.
 *
 * STANDARD:       C++20  (headers <algorithm>, <ranges>)
 * PREREQUISITES:  Iterators, lambdas, STL algorithm basics
 * REFERENCE:      reference/en/cpp/algorithm/ranges
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: Can views be used with plain C arrays?
// A: Yes. C arrays model the contiguous_range concept, so most view adaptors
//    (filter, transform, take, drop) work directly on them. You can also
//    wrap a C array with std::span for added safety without copying.
//
// Q: Are views always lazy?
// A: All standard view adaptors are lazy -- they compute elements on demand
//    when iterated.  However, some adaptors (e.g., views::reverse on a
//    non-bidirectional range, or views::join in certain cases) may cache
//    iterators internally for performance, which can consume a small amount
//    of state.  The key guarantee is that no intermediate container is
//    created.
//
// Q: How do I materialize a view into a concrete container?
// A: In C++23, use std::ranges::to<std::vector>() at the end of a pipeline.
//    In C++20, construct the container from the view's begin/end iterators:
//    auto v = std::vector(view.begin(), view.end()); or use
//    std::ranges::copy into a back_inserter.
//
// Q: How does the ranges library protect against dangling iterators?
// A: When you pass an rvalue (temporary) range to a ranges algorithm that
//    returns an iterator, the library returns the special type
//    std::ranges::dangling instead of an actual iterator. This causes a
//    compile error if you try to dereference it, preventing use-after-
//    destruction bugs that are common with classic STL algorithms.
//
// =====================================================

#include <iostream>
#include <format>
#include <vector>
#include <string>
#include <algorithm>
#include <ranges>

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. std::ranges:: algorithms accept a whole container -- no more
//    error-prone begin()/end() pairs.
// 2. Views are lazy, composable range adaptors.  They do not own or copy
//    data; they evaluate elements on demand.
// 3. The pipe operator (|) chains views left-to-right, producing a single
//    lazy pipeline that is only computed when iterated.
// 4. Projections let you sort/find/compare by a derived key (e.g., string
//    length) without writing a custom comparator.
// 5. std::ranges:: and std:: algorithms are different overload sets.
//    Do not mix their iterator/sentinel types in a single call.
// -----------------------------------------------

int main() {
    // -----------------------------------------------
    // 1. Range-based algorithms (no begin/end needed!)
    //    std::ranges::sort replaces std::sort(v.begin(), v.end())
    //
    //    Watch out: std::ranges:: algorithms and
    //    std:: algorithms are different overloads.
    //    Do not mix their iterator types in one call.
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
    //
    //    Projections are a major ergonomic win over
    //    classic STL: instead of writing a lambda
    //    comparator, pass a member pointer or callable
    //    as the third argument to ranges:: algorithms.
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
