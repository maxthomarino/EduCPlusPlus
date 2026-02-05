/**
 * spaceship_operator.cpp - Three-Way Comparison (C++20)
 * 
 * The <=> operator returns ordering information in one operation.
 * Auto-generates ==, !=, <, >, <=, >= when defaulted!
 */

#include <iostream>
#include <format>
#include <compare>
#include <string>
#include <set>

// Simple struct with defaulted spaceship
struct Point {
    int x, y;
    
    // This one line gives us ALL comparison operators!
    auto operator<=>(const Point&) const = default;
};

// Custom spaceship implementation
class Version {
    int major_, minor_, patch_;
    
public:
    Version(int major, int minor, int patch)
        : major_(major), minor_(minor), patch_(patch) {}
    
    // Custom three-way comparison
    std::strong_ordering operator<=>(const Version& other) const {
        if (auto cmp = major_ <=> other.major_; cmp != 0) return cmp;
        if (auto cmp = minor_ <=> other.minor_; cmp != 0) return cmp;
        return patch_ <=> other.patch_;
    }
    
    // Need to explicitly default == for custom <=>
    bool operator==(const Version&) const = default;
    
    std::string to_string() const {
        return std::format("{}.{}.{}", major_, minor_, patch_);
    }
};

// Comparison categories demo
void explain_ordering() {
    // strong_ordering: exactly one of <, ==, > is true (most types)
    // weak_ordering: equivalent values may not be identical
    // partial_ordering: allows incomparable values (like NaN)
    
    double a = 1.0, b = 2.0, nan = std::nan("");
    
    auto result = a <=> b;  // partial_ordering (doubles)
    if (result < 0) std::cout << "a < b\n";
    
    // NaN is unordered with everything
    auto nan_cmp = nan <=> 1.0;
    if (nan_cmp == std::partial_ordering::unordered) {
        std::cout << "NaN is unordered!\n";
    }
}

int main() {
    // Point with defaulted <=>
    Point p1{1, 2}, p2{1, 3}, p3{1, 2};
    
    std::cout << std::format("p1 == p3: {}\n", p1 == p3);
    std::cout << std::format("p1 < p2: {}\n", p1 < p2);
    std::cout << std::format("p2 > p1: {}\n", p2 > p1);
    
    // Works in containers automatically!
    std::set<Point> points = {{1,2}, {3,4}, {1,1}};
    std::cout << "Sorted points: ";
    for (const auto& p : points) {
        std::cout << std::format("({},{}) ", p.x, p.y);
    }
    std::cout << '\n';
    
    // Version with custom <=>
    Version v1{2, 0, 0}, v2{1, 9, 9}, v3{2, 0, 1};
    
    std::cout << std::format("\n{} > {}: {}\n", 
                             v1.to_string(), v2.to_string(), v1 > v2);
    std::cout << std::format("{} < {}: {}\n",
                             v1.to_string(), v3.to_string(), v1 < v3);
    
    // Direct use of <=> result
    auto cmp = v1 <=> v2;
    if (cmp > 0) std::cout << "v1 is newer\n";
    else if (cmp < 0) std::cout << "v2 is newer\n";
    else std::cout << "Same version\n";
    
    explain_ordering();
    
    return 0;
}
