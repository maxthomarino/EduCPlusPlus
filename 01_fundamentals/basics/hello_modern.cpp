/**
 * hello_modern.cpp - Modern C++ Hello World
 * 
 * Demonstrates: auto, string_view, format (C++20)
 */

#include <iostream>
#include <string_view>
#include <format>

auto greet(std::string_view name) -> std::string {
    return std::format("Hello, {}! Welcome to Modern C++.", name);
}

int main() {
    auto message = greet("World");
    std::cout << message << '\n';
    
    // Structured bindings with auto
    auto [x, y] = std::pair{10, 20};
    std::cout << std::format("x = {}, y = {}\n", x, y);
    
    return 0;
}
