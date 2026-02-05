/**
 * unordered_containers.cpp - STL Unordered (Hash) Containers
 *
 * Demonstrates: unordered_map, unordered_set, unordered_multimap.
 * Hash-based containers provide O(1) average lookup/insert/erase.
 * Elements are NOT sorted -- use when you need speed over order.
 */

#include <iostream>
#include <format>
#include <unordered_map>
#include <unordered_set>
#include <string>

// -----------------------------------------------
// Custom hash function for user-defined types.
// Required to use your type as a key in unordered containers.
// -----------------------------------------------
struct Point {
    int x, y;

    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }
};

// Custom hash: combine hashes of x and y
struct PointHash {
    std::size_t operator()(const Point& p) const {
        // Combine hashes using a common technique
        auto h1 = std::hash<int>{}(p.x);
        auto h2 = std::hash<int>{}(p.y);
        return h1 ^ (h2 << 1);  // Simple hash combine
    }
};

int main() {
    // -----------------------------------------------
    // 1. std::unordered_map -- hash map (O(1) average lookup)
    //    Use instead of std::map when you don't need sorted order.
    // -----------------------------------------------
    std::cout << "--- std::unordered_map ---\n";
    std::unordered_map<std::string, double> prices;

    prices["apple"] = 1.29;
    prices["banana"] = 0.79;
    prices["cherry"] = 3.49;
    prices.emplace("date", 5.99);

    // Lookup
    if (auto it = prices.find("banana"); it != prices.end()) {
        std::cout << std::format("Banana: ${:.2f}\n", it->second);
    }

    // contains() -- C++20
    std::cout << std::format("Has grape? {}\n", prices.contains("grape"));

    // Iterate (order is NOT guaranteed!)
    std::cout << "All prices:\n";
    for (const auto& [item, price] : prices) {
        std::cout << std::format("  {}: ${:.2f}\n", item, price);
    }

    // Hash table internals
    std::cout << std::format("Buckets: {}\n", prices.bucket_count());
    std::cout << std::format("Load factor: {:.2f}\n", prices.load_factor());
    std::cout << std::format("Max load factor: {:.2f}\n",
                              prices.max_load_factor());

    // -----------------------------------------------
    // 2. std::unordered_set -- hash set (unique elements)
    //    O(1) average membership testing.
    // -----------------------------------------------
    std::cout << "\n--- std::unordered_set ---\n";
    std::unordered_set<std::string> seen;

    // Detect duplicates in a stream of words
    std::vector<std::string> words = {
        "hello", "world", "hello", "foo", "world", "bar"
    };

    std::cout << "Unique words: ";
    for (const auto& w : words) {
        auto [it, inserted] = seen.insert(w);
        if (inserted) {
            std::cout << w << ' ';
        }
    }
    std::cout << '\n';
    std::cout << std::format("Total unique: {}\n", seen.size());

    // -----------------------------------------------
    // 3. Using custom types as keys
    //    You must provide a hash function and operator==.
    // -----------------------------------------------
    std::cout << "\n--- Custom Key Type ---\n";
    std::unordered_map<Point, std::string, PointHash> labels;
    labels[{0, 0}] = "origin";
    labels[{1, 0}] = "east";
    labels[{0, 1}] = "north";

    Point query{0, 0};
    if (auto it = labels.find(query); it != labels.end()) {
        std::cout << std::format("({},{}) = {}\n",
                                  query.x, query.y, it->second);
    }

    // -----------------------------------------------
    // 4. std::unordered_multimap -- allows duplicate keys
    // -----------------------------------------------
    std::cout << "\n--- std::unordered_multimap ---\n";
    std::unordered_multimap<std::string, int> scores;
    scores.insert({"Alice", 95});
    scores.insert({"Alice", 87});
    scores.insert({"Alice", 92});
    scores.insert({"Bob", 88});

    // Get all scores for Alice
    auto [begin, end] = scores.equal_range("Alice");
    std::cout << "Alice's scores: ";
    for (auto it = begin; it != end; ++it) {
        std::cout << it->second << ' ';
    }
    std::cout << '\n';

    // -----------------------------------------------
    // 5. Performance comparison note
    // -----------------------------------------------
    std::cout << "\n--- When to use what ---\n";
    std::cout << "unordered_map/set: O(1) avg, use when order doesn't matter\n";
    std::cout << "map/set:           O(log n), use when you need sorted order\n";
    std::cout << "Worst case for unordered: O(n) if many hash collisions\n";

    return 0;
}
