/**
 * sorting_algorithms.cpp - STL Sorting and Partitioning
 *
 * Demonstrates: sort, stable_sort, partial_sort, nth_element,
 * partition, is_sorted, and custom comparators.
 */

#include <iostream>
#include <format>
#include <vector>
#include <algorithm>
#include <string>
#include <numeric>

// Helper: print a vector
void print(std::string_view label, const std::vector<int>& v) {
    std::cout << label << ": ";
    for (int n : v) std::cout << n << ' ';
    std::cout << '\n';
}

int main() {
    // -----------------------------------------------
    // 1. std::sort -- O(n log n) introsort (quicksort + heapsort)
    //    Sorts the range in-place. Not stable.
    // -----------------------------------------------
    std::cout << "--- std::sort ---\n";
    std::vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6};

    std::sort(nums.begin(), nums.end());
    print("Ascending", nums);

    std::sort(nums.begin(), nums.end(), std::greater<>());
    print("Descending", nums);

    // Custom comparator: sort by absolute distance from 5
    std::sort(nums.begin(), nums.end(), [](int a, int b) {
        return std::abs(a - 5) < std::abs(b - 5);
    });
    print("By distance from 5", nums);

    // -----------------------------------------------
    // 2. std::stable_sort -- preserves relative order of equal elements
    //    Important when sorting by one field while preserving another.
    // -----------------------------------------------
    std::cout << "\n--- std::stable_sort ---\n";
    struct Student {
        std::string name;
        int grade;
    };

    std::vector<Student> students = {
        {"Alice", 90}, {"Bob", 85}, {"Carol", 90},
        {"Dave", 85}, {"Eve", 95}
    };

    std::stable_sort(students.begin(), students.end(),
        [](const Student& a, const Student& b) {
            return a.grade > b.grade;  // Sort by grade descending
        });

    std::cout << "By grade (stable):\n";
    for (const auto& s : students) {
        std::cout << std::format("  {} ({})\n", s.name, s.grade);
    }
    // Alice still comes before Carol (both 90) -- stability preserved

    // -----------------------------------------------
    // 3. std::partial_sort -- sort only the top K elements
    //    O(n log k) -- faster than full sort when k << n.
    // -----------------------------------------------
    std::cout << "\n--- std::partial_sort ---\n";
    std::vector<int> data = {50, 20, 80, 10, 90, 30, 70, 40, 60};

    // Get the top 3 smallest elements in sorted order
    std::partial_sort(data.begin(), data.begin() + 3, data.end());
    print("Top 3 sorted", data);  // First 3 are sorted, rest is unspecified

    // -----------------------------------------------
    // 4. std::nth_element -- find the nth smallest in O(n)
    //    Places the nth element in its correct sorted position.
    //    Elements before it are <= and elements after are >=.
    // -----------------------------------------------
    std::cout << "\n--- std::nth_element ---\n";
    data = {50, 20, 80, 10, 90, 30, 70, 40, 60};

    // Find the median (4th element in 0-indexed for 9 elements)
    std::nth_element(data.begin(), data.begin() + 4, data.end());
    std::cout << std::format("Median: {}\n", data[4]);

    // -----------------------------------------------
    // 5. std::partition -- divide into two groups
    //    Elements satisfying the predicate come first.
    // -----------------------------------------------
    std::cout << "\n--- std::partition ---\n";
    std::vector<int> values = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // Partition: evens first, then odds
    auto pivot = std::partition(values.begin(), values.end(),
        [](int n) { return n % 2 == 0; });

    std::cout << "Evens: ";
    for (auto it = values.begin(); it != pivot; ++it)
        std::cout << *it << ' ';
    std::cout << "\nOdds:  ";
    for (auto it = pivot; it != values.end(); ++it)
        std::cout << *it << ' ';
    std::cout << '\n';

    // -----------------------------------------------
    // 6. Checking if sorted
    // -----------------------------------------------
    std::cout << "\n--- std::is_sorted ---\n";
    std::vector<int> sorted_vec = {1, 2, 3, 4, 5};
    std::vector<int> unsorted_vec = {1, 3, 2, 5, 4};

    std::cout << std::format("sorted_vec sorted? {}\n",
                              std::is_sorted(sorted_vec.begin(), sorted_vec.end()));
    std::cout << std::format("unsorted_vec sorted? {}\n",
                              std::is_sorted(unsorted_vec.begin(), unsorted_vec.end()));

    // Find where sorting breaks
    auto until = std::is_sorted_until(unsorted_vec.begin(), unsorted_vec.end());
    std::cout << std::format("Sorted until position {}\n",
                              std::distance(unsorted_vec.begin(), until));

    return 0;
}
