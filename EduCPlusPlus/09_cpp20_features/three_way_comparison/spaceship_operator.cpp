/**
 * spaceship_operator.cpp - Three-Way Comparison (C++20)
 *
 * Before C++20, making a class fully comparable required writing up to
 * 6 operator overloads (==, !=, <, >, <=, >=) — tedious and error-prone.
 * The three-way comparison operator (<=>), informally "the spaceship",
 * returns an ordering in one operation, and when defaulted, the compiler
 * auto-generates all six relational operators for you.
 *
 * Use defaulted <=> as your first choice for any class that needs
 * comparison. Write a custom <=> only when member-wise comparison
 * is wrong (e.g., case-insensitive strings, semantic versioning).
 *
 * Prerequisites: See 02_oop/classes/ first.
 * Reference: reference/en/cpp/language/operator_comparison.html
 *            reference/en/cpp/language/default_comparisons.html
 *            reference/en/cpp/header/compare.html
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: When should I customize <=> instead of using = default?
// A: Default <=> compares members in declaration order, which works for most
//    value types. Customize it when member-wise comparison is wrong: e.g.,
//    case-insensitive strings, semantic versioning where "1.0.0" < "1.0.1"
//    but you store fields in a different order, or when certain members
//    should be excluded from comparison entirely.
//
// Q: What is the difference between strong, weak, and partial ordering?
// A: strong_ordering means equal values are substitutable (indistinguishable).
//    weak_ordering means equivalent values may differ in some observable way
//    (e.g., case-insensitive strings: "ABC" and "abc" are equivalent but not
//    identical). partial_ordering allows "unordered" results -- some pairs
//    cannot be compared at all (e.g., NaN in floating-point arithmetic).
//
// Q: Is <=> compatible with C++17 code that uses < and ==?
// A: Yes. When you default <=> in C++20, the compiler synthesizes all six
//    relational operators (==, !=, <, >, <=, >=). Code that calls those
//    operators -- including C++17-era comparisons -- works without changes.
//    The spaceship operator itself is only called internally; existing call
//    sites do not need to be rewritten.
//
// Q: Why must I define operator== separately when I write a custom <=>?
// A: For performance. Equality testing can often be optimized (e.g., compare
//    sizes first before element-wise comparison). The compiler will not
//    synthesize == from a custom <=> because it cannot know whether your
//    three-way logic is optimal for the equality case. Defaulting == is
//    fine if member-wise equality is correct.
//
// =====================================================

#include <iostream>
#include <format>
#include <compare>
#include <string>
#include <set>
#include <vector>
#include <algorithm>
#include <cmath>

// -----------------------------------------------
// 1. Defaulted <=> — one line gives you all 6 operators
//    What: operator<=> defines three-way comparison and can synthesize relational operators.
//    When: Use this when types need ordering/equality semantics.
//    Why: It centralizes comparison logic and reduces boilerplate.
//    Use: Default or implement operator<=> and define operator== when needed.
//    Which: C++20
//
//    The compiler compares members in declaration order, just like
//    it does for defaulted constructors.
//
//    Watch out: defaulted <=> also generates a defaulted ==.
//    If you write a custom <=>, you must explicitly default or
//    define == yourself — it is NOT synthesized from <=>.
// -----------------------------------------------
struct Point {
    int x, y;

    // This one line gives us ==, !=, <, >, <=, >= !
    auto operator<=>(const Point&) const = default;
};

// -----------------------------------------------
// 2. Comparison categories
//    What: Comparison categories describe whether ordering is strong, weak, or partial for a type.
//    When: Use this when you need to reason about strong, weak, or partial ordering semantics.
//    Why: Choosing the correct category makes ordering guarantees explicit to generic algorithms.
//    Use: Return `std::strong_ordering`, `std::weak_ordering`, or `std::partial_ordering` as appropriate.
//    Which: C++20
//
//    The return type of <=> tells you about the ordering:
//
//    strong_ordering:  exactly one of <, ==, > is true.
//                      Equal values are indistinguishable (e.g., int).
//    weak_ordering:    equivalent values may not be identical.
//                      (e.g., case-insensitive string comparison).
//    partial_ordering: some values may be unordered (e.g., double
//                      with NaN — NaN is not less than, equal to,
//                      or greater than anything, including itself).
//
//    Watch out: if any member has partial_ordering (like double),
//    the defaulted <=> returns partial_ordering for the whole class.
// -----------------------------------------------

// -----------------------------------------------
// 3. Custom <=> implementation
//    What: operator<=> defines three-way comparison and can synthesize relational operators.
//    When: Use this when types need ordering/equality semantics.
//    Why: It centralizes comparison logic and reduces boilerplate.
//    Use: Default or implement operator<=> and define operator== when needed.
//    Which: C++20
//
//    Write your own when member-wise order is wrong.
//    Return the appropriate ordering category.
//
//    Watch out: when you define a custom <=>, you MUST also
//    define or default operator== separately. The compiler will
//    not synthesize == from your custom <=>.
// -----------------------------------------------
class Version {
    int major_, minor_, patch_;

public:
    Version(int major, int minor, int patch)
        : major_(major), minor_(minor), patch_(patch) {}

    // Custom three-way comparison: compare major first, then minor, then patch
    std::strong_ordering operator<=>(const Version& other) const {
        if (auto cmp = major_ <=> other.major_; cmp != 0) return cmp;
        if (auto cmp = minor_ <=> other.minor_; cmp != 0) return cmp;
        return patch_ <=> other.patch_;
    }

    // Reason: custom <=> does not generate ==; must be explicit
    bool operator==(const Version&) const = default;

    std::string to_string() const {
        return std::format("{}.{}.{}", major_, minor_, patch_);
    }
};

// -----------------------------------------------
// 4. Partial ordering with floating point
//    What: Floating-point comparisons often produce `std::partial_ordering` because NaN is unordered.
//    When: Use this when compared values can be unordered (for example, floating-point NaN cases).
//    Why: NaN semantics mean some values are neither less, equal, nor greater, and code must handle that case.
//    Use: Check `is_ordered()`/equivalent outcomes and avoid assuming total ordering for floating-point data.
//    Which: C++20
//
//    double's <=> returns std::partial_ordering because NaN
//    is unordered relative to every value, including itself.
// -----------------------------------------------
void partial_ordering_demo() {
    std::cout << "\n--- Partial Ordering (double / NaN) ---\n";

    double a = 1.0, b = 2.0, nan = std::nan("");

    auto result = a <=> b;
    if (result < 0) {
        std::cout << std::format("{} < {}\n", a, b);
    }

    auto nan_cmp = nan <=> 1.0;
    if (nan_cmp == std::partial_ordering::unordered) {
        std::cout << "NaN is unordered with everything (including itself)\n";
    }

    // Reason: NaN != NaN is true per IEEE 754; this surprises many beginners
    std::cout << std::format("NaN == NaN? {}\n", nan == nan);
}

// -----------------------------------------------
// 5. Using <=> with containers and algorithms
//    What: operator<=> defines three-way comparison and can synthesize relational operators.
//    When: Use this when types need ordering/equality semantics.
//    Why: It centralizes comparison logic and reduces boilerplate.
//    Use: Default or implement operator<=> and define operator== when needed.
//    Which: C++20
//
//    Classes with defaulted <=> work immediately in
//    std::set, std::map, std::sort, and binary search.
// -----------------------------------------------

// =========================================
// Key Takeaways:
//   1. Default <=> whenever member-wise comparison is correct — one line, six operators.
//   2. A custom <=> requires a separate == definition (default or manual).
//   3. Choose the return type carefully: strong_, weak_, or partial_ordering.
//   4. If any member is a double, the defaulted <=> returns partial_ordering.
//   5. Types with <=> work automatically in std::set, std::sort, etc.
// =========================================

int main() {
    // ---- 1. Defaulted <=> ----
    std::cout << "--- Defaulted <=> ---\n";
    Point p1{1, 2}, p2{1, 3}, p3{1, 2};

    std::cout << std::format("({},{}) == ({},{}): {}\n",
                              p1.x, p1.y, p3.x, p3.y, p1 == p3);
    std::cout << std::format("({},{}) <  ({},{}): {}\n",
                              p1.x, p1.y, p2.x, p2.y, p1 < p2);
    std::cout << std::format("({},{}) >  ({},{}): {}\n",
                              p2.x, p2.y, p1.x, p1.y, p2 > p1);

    // ---- 5. Works in containers automatically ----
    std::cout << "\n--- In Containers ---\n";
    std::set<Point> points = {{3, 4}, {1, 2}, {1, 1}, {2, 0}};
    std::cout << "Points in sorted order: ";
    for (const auto& p : points) {
        std::cout << std::format("({},{}) ", p.x, p.y);
    }
    std::cout << '\n';

    // ---- 3. Custom <=> ----
    std::cout << "\n--- Custom <=> (Version) ---\n";
    Version v1{2, 0, 0}, v2{1, 9, 9}, v3{2, 0, 1};

    std::cout << std::format("{} >  {}: {}\n",
                              v1.to_string(), v2.to_string(), v1 > v2);
    std::cout << std::format("{} <  {}: {}\n",
                              v1.to_string(), v3.to_string(), v1 < v3);
    std::cout << std::format("{} == {}: {}\n",
                              v1.to_string(), v1.to_string(), v1 == v1);

    // Direct use of <=> result
    auto cmp = v1 <=> v2;
    if (cmp > 0) std::cout << std::format("{} is newer\n", v1.to_string());
    else if (cmp < 0) std::cout << std::format("{} is newer\n", v2.to_string());
    else std::cout << "Same version\n";

    // Sort a vector of Versions
    std::vector<Version> versions = {{1,0,0}, {3,2,1}, {2,0,0}, {1,5,3}};
    std::ranges::sort(versions);
    std::cout << "\nVersions sorted: ";
    for (const auto& v : versions) {
        std::cout << v.to_string() << "  ";
    }
    std::cout << '\n';

    // ---- 4. Partial ordering ----
    partial_ordering_demo();

    return 0;
}
