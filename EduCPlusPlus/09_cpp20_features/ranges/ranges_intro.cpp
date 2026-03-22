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

// -----------------------------------------------
// HOW IT WORKS: Lazy Evaluation in Ranges
//
// A view pipeline like filter | transform | take does NOT create
// three separate loops or three intermediate containers.  Instead,
// each view wraps the previous one, forming a chain of lightweight
// adaptor objects.
//
// When you iterate the final view (e.g., in a range-for loop),
// requesting the next element triggers a pull-based chain:
//
//   take asks transform for an element
//     -> transform asks filter for an element
//       -> filter asks the source container, skipping elements
//          that don't match the predicate
//       <- filter returns the first matching element to transform
//     <- transform applies its function and returns the result
//   <- take yields the result to the caller
//
// This is "pull-based" iteration: the consumer (take) pulls one
// element at a time through the entire pipeline.  No element is
// processed until it is actually requested.
//
// Because of this design, take(3) on an INFINITE source (like
// views::iota(1)) works perfectly — it only ever pulls 3 elements,
// never touching the rest.  The infinite source never fully
// materializes.
// -----------------------------------------------

// -----------------------------------------------
// 1. Ranges vs traditional iterator pairs
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
//    Traditional: algorithm(begin, end, predicate)
//    Ranges:      algorithm(container, predicate)
//    Eliminates mismatched iterator bugs and is shorter to write.
//
//    Watch out: range-based algorithms are in std::ranges::,
//    not std::. The two namespaces have different overloads.
//
//    HOW IT WORKS: Views vs Containers
//
//    A container OWNS its elements.  std::vector allocates memory
//    and stores the actual data.  Copying a container copies every
//    element.
//
//    A view DESCRIBES a transformation — it stores only a reference
//    (or iterator pair) to the source range plus the operation
//    (predicate, function, count, etc.).  It does not allocate
//    memory for results.
//
//    Views are cheap to copy — O(1) — because they are just a
//    pointer plus some lightweight state (a lambda, an integer).
//
//    Multiple views can refer to the same underlying container.
//    Watch out: modifying the container (inserting, erasing) while
//    a view refers to it invalidates the view, just like it would
//    invalidate iterators.
//
//    Formally, views satisfy the std::ranges::view concept: they
//    are semiregular (movable, default-constructible in most cases)
//    and have O(1) move and destruction.
// -----------------------------------------------

// -----------------------------------------------
// 2. View composition with the pipe operator (|)
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
//    Views are lightweight, non-owning wrappers that describe
//    a transformation. They do NOT store results — each element
//    is computed on demand during iteration.
//
//    Watch out: a view holds a reference to its source range.
//    If the source is destroyed, the view dangles.
// -----------------------------------------------

// -----------------------------------------------
// 3. Lazy evaluation — views compute on demand
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
//    A pipeline like filter | transform | take does not loop
//    through the data three times. Each element flows through
//    the entire pipeline before the next element is requested.
// -----------------------------------------------

// -----------------------------------------------
// 4. Common view adaptors
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
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
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
//    iota(start) produces an infinite sequence: start, start+1, ...
//    iota(start, end) produces [start, end).
//    Useful for index generation and replacing manual loops.
// -----------------------------------------------

// -----------------------------------------------
// 6. Range algorithms — pass the container, not iterators
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
//    std::ranges::sort, std::ranges::find, std::ranges::count_if, etc.
//    These accept a range directly and support projections (member
//    pointers or callables that extract a sort key).
// -----------------------------------------------

// -----------------------------------------------
// 7. Projections — sort/compare by a computed key
//    What: C++20 ranges combine views and algorithms into composable pipelines.
//    When: Use this for transformation/filtering pipelines over sequences.
//    Why: They improve readability and reduce temporary containers.
//    Use: Compose views with | and call std::ranges algorithms on the resulting range.
//    Which: C++20
//
//    A projection is an extra argument that transforms each element
//    before the comparator sees it. Avoids writing custom comparators.
//
//    HOW IT WORKS: Projections
//
//    A projection is simply a callable that the algorithm applies
//    to each element BEFORE passing it to the comparator or
//    predicate.  Internally, the algorithm does:
//      compare(projection(a), projection(b))
//    instead of:
//      compare(a, b)
//
//    Example:
//      std::ranges::sort(students, std::ranges::greater{}, &Student::grade);
//    is equivalent to sorting with:
//      compare(a.grade, b.grade)  using greater-than
//
//    Member pointers like &Student::grade are valid callables
//    because std::invoke (which range algorithms use internally)
//    knows how to call a member pointer on an object: it evaluates
//    std::invoke(&Student::grade, s) as s.grade.
//
//    You can use any callable as a projection:
//      - member pointers:   &Student::grade
//      - lambdas:           [](const Student& s) { return s.grade; }
//      - function pointers: a free function that takes Student
//    The default projection is std::identity{}, which returns the
//    element unchanged.
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
