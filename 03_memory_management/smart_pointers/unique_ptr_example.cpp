/**
 * unique_ptr_example.cpp - Exclusive Ownership
 * 
 * std::unique_ptr owns a resource exclusively.
 * Cannot be copied, only moved.
 */

#include <iostream>
#include <memory>
#include <format>

class Resource {
    std::string name_;
public:
    explicit Resource(std::string name) : name_(std::move(name)) {
        std::cout << std::format("Resource '{}' acquired\n", name_);
    }
    ~Resource() {
        std::cout << std::format("Resource '{}' released\n", name_);
    }
    void use() const {
        std::cout << std::format("Using resource '{}'\n", name_);
    }
};

void transfer_ownership(std::unique_ptr<Resource> res) {
    res->use();
    // res is automatically deleted when function exits
}

int main() {
    // Create with make_unique (preferred)
    auto res1 = std::make_unique<Resource>("Database");
    res1->use();
    
    // Transfer ownership (move, not copy)
    auto res2 = std::move(res1);
    // res1 is now nullptr!
    
    if (!res1) {
        std::cout << "res1 is now empty after move\n";
    }
    
    // Pass ownership to function
    transfer_ownership(std::move(res2));
    
    std::cout << "Back in main - resources auto-cleaned!\n";
    return 0;
}
