/**
 * mutex_example.cpp - Protecting Shared Data with Mutexes
 *
 * Why:      Shared mutable state between threads causes data races, which are
 *           undefined behavior in C++. A mutex (mutual exclusion) serializes
 *           access so only one thread touches the data at a time.
 * When:     Use a mutex whenever two or more threads access the same data and
 *           at least one of them writes. For simple counters/flags, consider
 *           std::atomic instead (lower overhead).
 * Standard: C++11 introduced std::mutex, lock_guard, unique_lock.
 *           C++17 added std::scoped_lock for locking multiple mutexes
 *           deadlock-free in a single statement.
 * Prereqs:  std::thread basics, RAII pattern, move semantics.
 * Reference: reference/en/cpp/thread/mutex
 *            reference/en/cpp/thread/lock_guard
 *            reference/en/cpp/thread/scoped_lock
 *
 * Compile with: g++ -std=c++20 -pthread mutex_example.cpp
 */

#include <iostream>
#include <thread>
#include <mutex>
#include <format>
#include <vector>

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Always use RAII wrappers (lock_guard, unique_lock, scoped_lock) --
//    never call raw .lock()/.unlock(). Manual unlock is easy to miss on
//    exceptions or early returns.
// 2. Use std::scoped_lock (C++17) when locking multiple mutexes to
//    avoid deadlock automatically (it uses a deadlock-avoidance algorithm).
// 3. Keep the critical section as short as possible -- lock late, unlock
//    early -- to minimize contention.
// 4. Never lock a std::mutex twice from the same thread -- it is UB.
//    Use std::recursive_mutex if recursion is truly needed.
// -----------------------------------------------

// -----------------------------------------------
// 1. Thread-safe counter using lock_guard
// Watch out: never lock a std::mutex twice from the same thread -- it's
// UB. Use std::recursive_mutex if recursion is needed.
// -----------------------------------------------
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

// -----------------------------------------------
// 2. Bank account with scoped_lock for two-mutex locking
// Watch out: always use RAII wrappers (lock_guard, unique_lock,
// scoped_lock) -- never raw .lock()/.unlock(). Manual lock/unlock is
// easy to get wrong on exceptions or early returns.
// -----------------------------------------------
class BankAccount {
    double balance_ = 0;
    mutable std::mutex mtx_;

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

    // Thread-safe read: must lock even for reads to avoid data races
    double balance() const {
        std::lock_guard lock(mtx_);
        return balance_;
    }
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
