/**
 * optional_example.cpp - std::optional for Nullable Values
 * 
 * Better than returning -1, nullptr, or throwing for "no value".
 * Makes "might not exist" explicit in the type system.
 */

#include <iostream>
#include <format>
#include <optional>
#include <string>
#include <vector>
#include <map>

// Function that might not find a result
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
