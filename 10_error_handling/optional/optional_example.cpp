/**
 * optional_example.cpp - std::optional for Nullable Values
 *
 * WHY IT EXISTS:  Before std::optional, functions that might not produce a
 *                 result relied on sentinel values (-1, nullptr, empty string)
 *                 or output parameters.  These conventions are error-prone
 *                 because nothing in the type system enforces checking.
 *                 std::optional<T> makes "might not have a value" explicit in
 *                 the type, so the compiler and the reader both know that the
 *                 absence case must be handled.
 *
 * WHEN TO USE:    Any function that may legitimately have no result to return.
 *                 Prefer std::optional over returning magic values, throwing
 *                 on "not found", or using raw pointers for nullable semantics.
 *
 * STANDARD:       C++17  (header <optional>)
 * PREREQUISITES:  Value semantics, move semantics, std::nullopt
 * REFERENCE:      reference/en/cpp/utility/optional
 * SEE ALSO:       std::expected (C++23) -- like optional but carries an error
 *                 value in the "empty" case.
 */

#include <iostream>
#include <format>
#include <optional>
#include <string>
#include <vector>
#include <map>

// -----------------------------------------------
// Function that might not find a result
//
// Watch out: accessing an empty optional via
// operator* or operator-> is undefined behavior.
// Always check has_value() or use value_or().
// -----------------------------------------------
std::optional<int> find_index(const std::vector<int>& vec, int target) {
    for (size_t i = 0; i < vec.size(); ++i) {
        if (vec[i] == target) {
            return static_cast<int>(i);  // Found!
        }
    }
    return std::nullopt;  // Not found
}

// Optional with complex type
struct User {
    std::string name;
    int age;
};

std::optional<User> find_user(const std::map<int, User>& db, int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}

// Optional for lazy initialization
class Config {
    mutable std::optional<std::string> cached_value_;

public:
    const std::string& get_value() const {
        if (!cached_value_) {
            // Expensive computation, done only once
            cached_value_ = "computed_value";
            std::cout << "(computing...)\n";
        }
        return *cached_value_;
    }
};

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. std::optional<T> replaces sentinel values and nullable pointers with
//    a type-safe wrapper that forces callers to consider the empty case.
// 2. Check before access: use has_value(), operator bool, or value_or()
//    -- dereferencing an empty optional is undefined behavior.
// 3. value_or(default) is the safest and most concise access pattern when
//    a sensible default exists.
// 4. std::optional works well for lazy initialization (compute-on-first-use)
//    and caching patterns.
// 5. For functions that fail with an error reason, consider std::expected<T,E>
//    (C++23) which carries either a value or an error object.
// -----------------------------------------------

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};

    // Check if optional has value
    if (auto idx = find_index(numbers, 30); idx.has_value()) {
        std::cout << std::format("Found 30 at index {}\n", *idx);
    }

    // value_or() for default
    auto idx = find_index(numbers, 99);
    std::cout << std::format("Index of 99: {}\n", idx.value_or(-1));

    // Boolean context
    if (auto found = find_index(numbers, 20)) {
        std::cout << std::format("20 is at index {}\n", *found);
    } else {
        std::cout << "20 not found\n";
    }

    // With complex types
    std::map<int, User> users = {
        {1, {"Alice", 30}},
        {2, {"Bob", 25}}
    };

    if (auto user = find_user(users, 1)) {
        std::cout << std::format("Found: {} (age {})\n",
                                 user->name, user->age);
    }

    if (auto user = find_user(users, 99)) {
        std::cout << "Found user 99\n";
    } else {
        std::cout << "User 99 not found\n";
    }

    // Transforming optionals (C++23 has monadic ops, but we can do:)
    auto double_if_found = [&](int target) -> std::optional<int> {
        if (auto idx = find_index(numbers, target)) {
            return *idx * 2;
        }
        return std::nullopt;
    };

    std::cout << std::format("Double index of 30: {}\n",
                             double_if_found(30).value_or(-1));

    // Lazy initialization
    Config config;
    std::cout << "First call: " << config.get_value() << '\n';
    std::cout << "Second call: " << config.get_value() << '\n';

    // Creating optional in-place
    std::optional<std::vector<int>> opt_vec;
    opt_vec.emplace(5, 42);  // Creates vector of 5 42s in-place
    std::cout << std::format("Vector size: {}\n", opt_vec->size());

    return 0;
}
