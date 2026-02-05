/**
 * mutex_example.cpp - Protecting Shared Data
 * 
 * Without mutex: data races and undefined behavior
 * With mutex: safe concurrent access
 */

#include <iostream>
#include <thread>
#include <mutex>
#include <format>
#include <vector>

class Counter {
    int value_ = 0;
    mutable std::mutex mtx_;
    
public:
    // Thread-safe increment
    void increment() {
        std::lock_guard<std::mutex> lock(mtx_);  // RAII lock
        ++value_;
        // lock automatically released here
    }
    
    // Thread-safe read
    int get() const {
        std::lock_guard<std::mutex> lock(mtx_);
        return value_;
    }
};

class BankAccount {
    double balance_ = 0;
    std::mutex mtx_;
    
public:
    explicit BankAccount(double initial) : balance_(initial) {}
    
    void transfer_to(BankAccount& other, double amount) {
        // Lock both accounts to prevent deadlock
        std::scoped_lock lock(mtx_, other.mtx_);  // C++17
        
        if (balance_ >= amount) {
            balance_ -= amount;
            other.balance_ += amount;
            std::cout << std::format("Transferred {:.2f}\n", amount);
        }
    }
    
    double balance() const { return balance_; }
};

int main() {
    // Counter example
    Counter counter;
    std::vector<std::thread> threads;
    
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([&counter] {
            for (int j = 0; j < 1000; ++j) {
                counter.increment();
            }
        });
    }
    
    for (auto& t : threads) t.join();
    
    std::cout << std::format("Final count: {} (expected: 10000)\n", 
                             counter.get());
    
    // Bank transfer example
    BankAccount alice(1000), bob(500);
    
    std::thread t1([&] { alice.transfer_to(bob, 100); });
    std::thread t2([&] { bob.transfer_to(alice, 50); });
    
    t1.join();
    t2.join();
    
    std::cout << std::format("Alice: {:.2f}, Bob: {:.2f}\n",
                             alice.balance(), bob.balance());
    
    return 0;
}
