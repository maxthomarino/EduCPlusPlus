/**
 * ranges_intro.cpp - C++20 Ranges Library
 * 
 * Ranges provide composable, lazy operations on sequences.
 * Much cleaner than iterator pairs!
 */

#include <iostream>
#include <format>
#include <ranges>
#include <vector>
#include <string>
#include <algorithm>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Traditional way (verbose)
    std::cout << "Traditional: ";
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        if (*it % 2 == 0) {
            std::cout << (*it * *it) << ' ';
        }
    }
    std::cout << '\n';
    
    // Ranges way (clean!)
    std::cout << "Ranges: ";
    auto even_squares = numbers 
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });
    
    for (int n : even_squares) {
        std::cout << n << ' ';
    }
    std::cout << '\n';
    
    // Views are lazy - nothing computed until iteration!
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
    
    std::cout << "Taking first 3 numbers > 5, doubled:\n";
    for (int n : pipeline) {
        std::cout << std::format("  got: {}\n", n);
    }
    
    // Useful views
    std::cout << "\nFirst 5: ";
    for (int n : numbers | std::views::take(5)) {
        std::cout << n << ' ';
    }
    
    std::cout << "\nSkip 3: ";
    for (int n : numbers | std::views::drop(3)) {
        std::cout << n << ' ';
    }
    
    std::cout << "\nReversed: ";
    for (int n : numbers | std::views::reverse) {
        std::cout << n << ' ';
    }
    
    // iota: generate sequence
    std::cout << "\niota(1,6): ";
    for (int n : std::views::iota(1, 6)) {
        std::cout << n << ' ';
    }
    
    std::cout << '\n';
    
    // String processing with ranges
    std::string text = "Hello, World!";
    std::cout << "\nUppercase: ";
    for (char c : text | std::views::transform(::toupper)) {
        std::cout << c;
    }
    std::cout << '\n';
    
    return 0;
}
