/**
 * lambda_examples.cpp - Lambda Expressions in C++
 * 
 * Lambdas are anonymous functions defined inline.
 * Syntax: [captures](params) -> return_type { body }
 */

#include <iostream>
#include <format>
#include <vector>
#include <algorithm>
#include <functional>

int main() {
    // Basic lambda
    auto greet = [] { std::cout << "Hello!\n"; };
    greet();
    
    // Lambda with parameters
    auto add = [](int a, int b) { return a + b; };
    std::cout << std::format("5 + 3 = {}\n", add(5, 3));
    
    // Capture by value [=]
    int multiplier = 10;
    auto times = [multiplier](int x) { return x * multiplier; };
    std::cout << std::format("7 * 10 = {}\n", times(7));
    
    // Capture by reference [&]
    int counter = 0;
    auto increment = [&counter] { ++counter; };
    increment();
    increment();
    std::cout << std::format("Counter: {}\n", counter);
    
    // Mixed captures
    int a = 1, b = 2;
    auto mixed = [a, &b] { b += a; };  // a by value, b by ref
    mixed();
    std::cout << std::format("b = {}\n", b);
    
    // Mutable lambda (modify captured values)
    int x = 0;
    auto mutable_lambda = [x]() mutable { return ++x; };
    std::cout << std::format("Call 1: {}\n", mutable_lambda());
    std::cout << std::format("Call 2: {}\n", mutable_lambda());
    std::cout << std::format("Original x: {}\n", x);  // Still 0!
    
    // Generic lambda (C++14+)
    auto print = [](const auto& value) {
        std::cout << value << '\n';
    };
    print(42);
    print("Hello");
    print(3.14);
    
    // Lambda with STL algorithms
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};
    
    std::sort(nums.begin(), nums.end(), 
              [](int a, int b) { return a > b; });  // Descending
    
    std::cout << "Sorted descending: ";
    std::for_each(nums.begin(), nums.end(), 
                  [](int n) { std::cout << n << ' '; });
    std::cout << '\n';
    
    // Immediately invoked lambda
    auto result = [](int n) {
        int sum = 0;
        for (int i = 1; i <= n; ++i) sum += i;
        return sum;
    }(10);
    std::cout << std::format("Sum 1-10: {}\n", result);
    
    return 0;
}
