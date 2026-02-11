/**
 * associative_containers.cpp - STL Associative Containers
 *
 * Demonstrates: map, multimap, set, multiset, and custom comparators.
 * Associative containers store elements in sorted order (by key),
 * implemented as balanced binary search trees (typically red-black trees).
 * All lookup, insertion, and erasure operations are O(log n).
 *
 * When to use: choose an associative container when you need elements
 * automatically kept in sorted order, or when you need efficient
 * range queries (e.g., "all keys between X and Y"). If you only need
 * fast lookup without ordering, prefer unordered_map / unordered_set.
 *
 * Standard: map/set since C++98; structured bindings and try_emplace
 *           require C++17; contains() requires C++20.
 * Prerequisites: understanding of iterators, comparison operators, big-O.
 * Reference: reference/en/cpp/container/map
 *            reference/en/cpp/container/set
 */

#include <iostream>
#include <format>
#include <map>
#include <set>
#include <string>

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Associative containers keep elements sorted at all times;
//    iteration always visits elements in comparator order.
// 2. std::map::operator[] silently inserts a default value for
//    missing keys -- use find() or at() for read-only access.
// 3. std::set::insert returns pair<iterator, bool> telling you
//    whether the element was actually added or already existed.
// 4. Custom comparators must satisfy strict weak ordering:
//    irreflexive, asymmetric, transitive. Using <= instead of <
//    is a common bug that leads to undefined behavior.
// -----------------------------------------------

int main() {
    // -----------------------------------------------
    // 1. std::map -- sorted key-value pairs (unique keys)
    //    Keys are always sorted. Lookup is O(log n).
    //
    //    Watch out: operator[] inserts a default-constructed value
    //    if the key doesn't exist. Use .at() or .find() for
    //    read-only access.
    // -----------------------------------------------
    std::cout << "--- std::map ---\n";
    std::map<std::string, int> ages;

    // Insert elements
    ages["Alice"] = 30;
    ages["Bob"] = 25;
    ages.insert({"Carol", 28});
    ages.emplace("Dave", 35);

    // Iterate (always sorted by key)
    for (const auto& [name, age] : ages) {
        std::cout << std::format("{}: {}\n", name, age);
    }

    // Lookup
    if (auto it = ages.find("Bob"); it != ages.end()) {
        std::cout << std::format("Found Bob, age {}\n", it->second);
    }

    // contains() -- C++20
    std::cout << std::format("Has Eve? {}\n", ages.contains("Eve"));

    // try_emplace (C++17): only inserts if key doesn't exist
    ages.try_emplace("Alice", 99);  // Won't overwrite Alice's age
    std::cout << std::format("Alice is still {}\n", ages["Alice"]);

    // Erase
    ages.erase("Dave");
    std::cout << std::format("Size after erase: {}\n", ages.size());

    // -----------------------------------------------
    // 2. std::multimap -- sorted key-value pairs (duplicate keys)
    //    Same key can appear multiple times.
    //
    //    Watch out: multimap has no operator[] -- use insert()
    //    and equal_range().
    // -----------------------------------------------
    std::cout << "\n--- std::multimap ---\n";
    std::multimap<std::string, std::string> courses;
    courses.insert({"Alice", "Math"});
    courses.insert({"Alice", "Physics"});
    courses.insert({"Alice", "CS"});
    courses.insert({"Bob", "Math"});
    courses.insert({"Bob", "Art"});

    // Find all courses for Alice using equal_range
    auto [begin, end] = courses.equal_range("Alice");
    std::cout << "Alice's courses: ";
    for (auto it = begin; it != end; ++it) {
        std::cout << it->second << ' ';
    }
    std::cout << '\n';

    std::cout << std::format("Total entries: {}\n", courses.size());
    std::cout << std::format("Alice's count: {}\n", courses.count("Alice"));

    // -----------------------------------------------
    // 3. std::set -- sorted unique elements
    //    Like a map with only keys. Useful for membership testing.
    //
    //    Watch out: insert() returns a pair<iterator, bool>. The
    //    bool is false when the element already existed -- always
    //    check it if duplicate handling matters.
    // -----------------------------------------------
    std::cout << "\n--- std::set ---\n";
    std::set<int> numbers = {5, 3, 8, 1, 3, 5, 9};  // Duplicates removed!

    std::cout << std::format("Size: {} (duplicates removed)\n", numbers.size());
    std::cout << "Elements: ";
    for (int n : numbers) std::cout << n << ' ';
    std::cout << '\n';

    // Insert and check success
    auto [iter, inserted] = numbers.insert(3);
    std::cout << std::format("Insert 3: {} (already exists)\n",
                              inserted ? "success" : "duplicate");

    auto [iter2, inserted2] = numbers.insert(7);
    std::cout << std::format("Insert 7: {}\n",
                              inserted2 ? "success" : "duplicate");

    // Set operations (requires sorted containers)
    std::set<int> a = {1, 2, 3, 4, 5};
    std::set<int> b = {3, 4, 5, 6, 7};

    // Merge (C++17): move elements from b into a
    std::set<int> merged = a;
    merged.merge(std::set<int>(b));  // Copy b to avoid modifying it

    std::cout << "a | b = ";
    for (int n : merged) std::cout << n << ' ';
    std::cout << '\n';

    // -----------------------------------------------
    // 4. std::multiset -- sorted elements (duplicates allowed)
    // -----------------------------------------------
    std::cout << "\n--- std::multiset ---\n";
    std::multiset<int> ms = {5, 3, 5, 1, 3, 5};

    std::cout << std::format("Size: {} (duplicates kept)\n", ms.size());
    std::cout << std::format("Count of 5: {}\n", ms.count(5));

    std::cout << "Elements: ";
    for (int n : ms) std::cout << n << ' ';
    std::cout << '\n';

    // -----------------------------------------------
    // 5. Custom comparator
    //    Sort in descending order.
    //
    //    Watch out: comparators must satisfy strict weak ordering
    //    (irreflexive, asymmetric, transitive). Using <= instead
    //    of < is undefined behavior and can cause crashes or
    //    infinite loops inside the tree.
    // -----------------------------------------------
    std::cout << "\n--- Custom Comparator ---\n";
    std::set<int, std::greater<>> desc_set = {3, 1, 4, 1, 5, 9};

    std::cout << "Descending: ";
    for (int n : desc_set) std::cout << n << ' ';
    std::cout << '\n';

    return 0;
}
