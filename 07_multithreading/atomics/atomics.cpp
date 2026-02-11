/**
 * atomics.cpp - Atomic Operations in C++
 *
 * Why:      Mutexes are heavyweight for simple operations like incrementing a
 *           counter or flipping a flag. Atomic operations provide lock-free,
 *           thread-safe access to individual variables without the overhead of
 *           a mutex (no OS-level blocking, no context switches).
 * When:     Use atomics for simple shared counters, flags, and lock-free data
 *           structures. For complex shared state involving multiple variables,
 *           prefer mutexes -- atomics only protect one variable at a time.
 * Standard: C++11 introduced std::atomic and memory ordering.
 *           C++20 added std::atomic_ref, std::atomic<std::shared_ptr>, and
 *           wait()/notify_one()/notify_all() on atomics.
 * Prereqs:  std::thread basics, understanding of data races and UB.
 * Reference: reference/en/cpp/atomic/atomic
 *            reference/en/cpp/atomic/memory_order
 *
 * Key memory orders (from relaxed to strict):
 *   - relaxed:  no ordering guarantees (fastest)
 *   - acquire:  no reads/writes move before this load
 *   - release:  no reads/writes move after this store
 *   - seq_cst:  full sequential consistency (default, safest)
 *
 * Compile with: g++ -std=c++20 -pthread atomics.cpp
 */

#include <iostream>
#include <format>
#include <atomic>
#include <thread>
#include <vector>
#include <cassert>

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. std::atomic<T> guarantees atomicity for loads, stores, and
//    read-modify-write operations. No mutex needed for single-variable
//    access.
// 2. The default memory order is seq_cst (sequentially consistent) --
//    safest but slowest. Use relaxed only when you need atomicity
//    without inter-thread ordering, and acquire/release for
//    producer-consumer synchronization.
// 3. compare_exchange_weak can fail spuriously (on LL/SC architectures
//    like ARM). Always use it in a loop. compare_exchange_strong never
//    fails spuriously but may be slower in a loop.
// 4. Lock-free data structures are notoriously hard to get right. Simple
//    CAS-based structures suffer from the ABA problem and memory
//    reclamation issues. Prefer well-tested libraries in production.
// -----------------------------------------------

// -----------------------------------------------
// 1. Basic atomic counter
//    No mutex needed -- increment is atomic.
// -----------------------------------------------
void basic_atomic_counter() {
    std::cout << "--- Atomic Counter ---\n";
    std::atomic<int> counter{0};

    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([&counter] {
            for (int j = 0; j < 10'000; ++j) {
                counter.fetch_add(1);  // Atomic increment
                // Equivalent shorthand: ++counter;
            }
        });
    }

    for (auto& t : threads) t.join();

    // Always exactly 100,000 -- no data race
    std::cout << std::format("Counter: {} (expected: 100000)\n",
                              counter.load());
}

// -----------------------------------------------
// 2. Compare-and-swap (CAS)
//    The fundamental building block of lock-free algorithms.
//    Atomically: if value == expected, set to desired; else load current.
// Watch out: compare_exchange_weak can fail spuriously on LL/SC
// architectures (e.g., ARM). Always use it in a loop.
// compare_exchange_strong never fails spuriously but may be slower.
// -----------------------------------------------
void cas_example() {
    std::cout << "\n--- Compare-and-Swap ---\n";
    std::atomic<int> value{100};

    // Try to change 100 -> 200
    int expected = 100;
    bool success = value.compare_exchange_strong(expected, 200);
    std::cout << std::format("CAS 100->200: {} (value={})\n", success, value.load());

    // Try again: expected is 100, but value is now 200 -- fails
    expected = 100;
    success = value.compare_exchange_strong(expected, 300);
    std::cout << std::format("CAS 100->300: {} (value={}, expected updated to {})\n",
                              success, value.load(), expected);
}

// -----------------------------------------------
// 3. Lock-free stack (using CAS)
//    A simple lock-free singly-linked stack.
// Watch out: this simple lock-free stack has the ABA problem -- a
// real implementation needs hazard pointers or epoch-based
// reclamation. Also, delete of old_head in pop() is unsafe if another
// thread still holds a pointer to it.
// -----------------------------------------------
template<typename T>
class LockFreeStack {
    struct Node {
        T data;
        Node* next;
        Node(T d) : data(std::move(d)), next(nullptr) {}
    };

    std::atomic<Node*> head_{nullptr};

public:
    void push(T value) {
        Node* new_node = new Node(std::move(value));
        new_node->next = head_.load();

        // CAS loop: keep trying until we successfully update head
        while (!head_.compare_exchange_weak(new_node->next, new_node)) {
            // On failure, new_node->next is updated to current head
            // automatically -- just retry
        }
    }

    bool pop(T& result) {
        Node* old_head = head_.load();

        while (old_head &&
               !head_.compare_exchange_weak(old_head, old_head->next)) {
            // Retry
        }

        if (!old_head) return false;

        result = std::move(old_head->data);
        delete old_head;
        return true;
    }

    ~LockFreeStack() {
        T dummy;
        while (pop(dummy)) {}
    }
};

// -----------------------------------------------
// 4. std::atomic_flag -- the simplest atomic type
//    Only supports test-and-set / clear. Can build a spinlock.
// -----------------------------------------------
class SpinLock {
    std::atomic_flag flag_ = ATOMIC_FLAG_INIT;

public:
    void lock() {
        // Spin until we acquire the lock
        while (flag_.test_and_set(std::memory_order_acquire)) {
            // Busy-wait (in production, consider yielding or backoff)
        }
    }

    void unlock() {
        flag_.clear(std::memory_order_release);
    }
};

// -----------------------------------------------
// 5. Memory ordering demonstration
//    acquire/release pair ensures proper ordering.
// Watch out: memory_order_relaxed provides no ordering guarantees
// between threads. Only use it when you just need atomicity, not
// synchronization. In the example below, using relaxed instead of
// acquire/release would make the assertion on data unreliable.
// -----------------------------------------------
void memory_ordering_demo() {
    std::cout << "\n--- Memory Ordering ---\n";
    std::atomic<bool> ready{false};
    int data = 0;

    std::thread writer([&] {
        data = 42;                                         // (1) Regular write
        ready.store(true, std::memory_order_release);      // (2) Release: (1) is visible before (2)
    });

    std::thread reader([&] {
        while (!ready.load(std::memory_order_acquire)) {}  // (3) Acquire: sees (2)
        // At this point, data=42 is guaranteed to be visible
        std::cout << std::format("Data: {} (guaranteed 42)\n", data);
    });

    writer.join();
    reader.join();
}

int main() {
    // 1. Basic atomic counter
    basic_atomic_counter();

    // 2. Compare-and-swap
    cas_example();

    // 3. Lock-free stack
    std::cout << "\n--- Lock-Free Stack ---\n";
    LockFreeStack<int> stack;
    {
        std::vector<std::thread> threads;
        for (int i = 0; i < 4; ++i) {
            threads.emplace_back([&stack, i] {
                for (int j = 0; j < 100; ++j) {
                    stack.push(i * 100 + j);
                }
            });
        }
        for (auto& t : threads) t.join();
    }

    int count = 0;
    int val;
    while (stack.pop(val)) ++count;
    std::cout << std::format("Popped {} items (expected: 400)\n", count);

    // 4. Spinlock
    std::cout << "\n--- SpinLock ---\n";
    SpinLock spinlock;
    int shared_counter = 0;

    {
        std::vector<std::thread> threads;
        for (int i = 0; i < 4; ++i) {
            threads.emplace_back([&] {
                for (int j = 0; j < 10'000; ++j) {
                    spinlock.lock();
                    ++shared_counter;
                    spinlock.unlock();
                }
            });
        }
        for (auto& t : threads) t.join();
    }
    std::cout << std::format("SpinLock counter: {} (expected: 40000)\n",
                              shared_counter);

    // 5. Memory ordering
    memory_ordering_demo();

    return 0;
}
