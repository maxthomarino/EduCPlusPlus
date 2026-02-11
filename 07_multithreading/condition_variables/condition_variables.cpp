/**
 * condition_variables.cpp - Condition Variables in C++
 *
 * Why:      Busy-waiting (spin loops) waste CPU cycles. Condition variables
 *           let a thread sleep efficiently until another thread signals that
 *           a particular condition has become true.
 * When:     Use for producer-consumer patterns, thread pools, bounded buffers,
 *           or any "wait until condition X" scenario where polling would waste
 *           resources.
 * Standard: C++11 introduced std::condition_variable. It always works in
 *           conjunction with a std::mutex (via std::unique_lock).
 * Prereqs:  std::thread, std::mutex, std::unique_lock, lambda predicates.
 * Reference: reference/en/cpp/thread/condition_variable
 *
 * Pattern:
 *   Producer: lock mutex -> modify shared data -> unlock -> notify
 *   Consumer: lock mutex -> wait(lock, predicate) -> consume data
 *
 * Compile with: g++ -std=c++20 -pthread condition_variables.cpp
 */

#include <iostream>
#include <format>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <string>
#include <chrono>

using namespace std::chrono_literals;

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Always check the condition in a while-loop or use the predicate
//    overload of wait(). Spurious wakeups can occur -- the thread may
//    wake without notify being called.
// 2. You must hold the mutex when modifying the shared state AND when
//    calling wait(), but you should NOT hold it when calling
//    notify_one()/notify_all() (for performance).
// 3. Use notify_one() when only one waiter needs to proceed; use
//    notify_all() when all waiters should re-check the condition.
// 4. condition_variable requires std::unique_lock<std::mutex>. If you
//    need a different lock type, use condition_variable_any.
// -----------------------------------------------

// -----------------------------------------------
// 1. Basic producer-consumer with condition variable
// Watch out: always check the condition in a while loop (or use the
// predicate overload of wait()). Spurious wakeups can occur -- the
// thread may wake without notify being called.
// -----------------------------------------------
class MessageQueue {
    std::queue<std::string> queue_;
    mutable std::mutex mtx_;
    std::condition_variable cv_;
    bool done_ = false;

public:
    // Producer: add a message and notify one waiting consumer
    void push(std::string msg) {
        {
            std::lock_guard lock(mtx_);
            queue_.push(std::move(msg));
        }
        // Notify AFTER releasing the lock for better performance
        cv_.notify_one();
    }

    // Consumer: wait until a message is available
    // Returns empty string when done
    std::string pop() {
        std::unique_lock lock(mtx_);

        // Wait with a predicate to handle spurious wakeups.
        // The lambda is checked on each wakeup; we only proceed
        // when the queue is non-empty OR we're done.
        cv_.wait(lock, [this] { return !queue_.empty() || done_; });

        if (queue_.empty()) return {};  // Shutdown signal

        std::string msg = std::move(queue_.front());
        queue_.pop();
        return msg;
    }

    // Signal that no more messages will be produced
    void shutdown() {
        {
            std::lock_guard lock(mtx_);
            done_ = true;
        }
        cv_.notify_all();  // Wake up ALL waiting consumers
    }
};

// -----------------------------------------------
// 2. Bounded buffer (blocks producer when full)
//    Uses two condition variables: one for "not full",
//    one for "not empty".
// Watch out: you must hold the mutex when modifying the shared state
// AND when calling wait(), but you should NOT hold it when calling
// notify_one()/notify_all() (for performance).
// -----------------------------------------------
template<typename T, std::size_t Capacity>
class BoundedBuffer {
    T buffer_[Capacity];
    std::size_t head_ = 0, tail_ = 0, count_ = 0;

    std::mutex mtx_;
    std::condition_variable not_full_;
    std::condition_variable not_empty_;

public:
    void put(T item) {
        std::unique_lock lock(mtx_);

        // Block until there's room
        not_full_.wait(lock, [this] { return count_ < Capacity; });

        buffer_[tail_] = std::move(item);
        tail_ = (tail_ + 1) % Capacity;
        ++count_;

        lock.unlock();
        not_empty_.notify_one();
    }

    T take() {
        std::unique_lock lock(mtx_);

        // Block until there's data
        not_empty_.wait(lock, [this] { return count_ > 0; });

        T item = std::move(buffer_[head_]);
        head_ = (head_ + 1) % Capacity;
        --count_;

        lock.unlock();
        not_full_.notify_one();
        return item;
    }
};

// -----------------------------------------------
// 3. One-time event notification (like a gate/barrier)
//    Threads wait until a signal is given, then all proceed.
// Watch out: if you notify_all() before any thread calls wait(), the
// notification is not "saved" -- but the predicate (open_ == true)
// ensures late-arriving threads see the gate is already open.
// -----------------------------------------------
class Gate {
    std::mutex mtx_;
    std::condition_variable cv_;
    bool open_ = false;

public:
    void open() {
        {
            std::lock_guard lock(mtx_);
            open_ = true;
        }
        cv_.notify_all();
    }

    void wait() {
        std::unique_lock lock(mtx_);
        cv_.wait(lock, [this] { return open_; });
    }
};

int main() {
    // ---- Producer-Consumer ----
    std::cout << "--- Producer-Consumer ---\n";
    MessageQueue mq;

    // Consumer thread
    std::thread consumer([&mq] {
        while (true) {
            std::string msg = mq.pop();
            if (msg.empty()) break;  // Shutdown
            std::cout << std::format("Received: {}\n", msg);
        }
        std::cout << "Consumer done\n";
    });

    // Producer: send some messages
    for (int i = 1; i <= 5; ++i) {
        mq.push(std::format("Message #{}", i));
        std::this_thread::sleep_for(50ms);
    }
    mq.shutdown();
    consumer.join();

    // ---- Bounded Buffer ----
    std::cout << "\n--- Bounded Buffer (capacity=3) ---\n";
    BoundedBuffer<int, 3> buffer;

    std::thread producer([&buffer] {
        for (int i = 1; i <= 8; ++i) {
            buffer.put(i);
            std::cout << std::format("Produced: {}\n", i);
        }
    });

    std::thread consumer2([&buffer] {
        for (int i = 0; i < 8; ++i) {
            std::this_thread::sleep_for(30ms);  // Slow consumer
            int val = buffer.take();
            std::cout << std::format("Consumed: {}\n", val);
        }
    });

    producer.join();
    consumer2.join();

    // ---- Gate / Barrier ----
    std::cout << "\n--- Gate (start signal) ---\n";
    Gate gate;

    auto worker = [&gate](int id) {
        std::cout << std::format("Worker {} waiting for start signal...\n", id);
        gate.wait();
        std::cout << std::format("Worker {} started!\n", id);
    };

    std::thread w1(worker, 1);
    std::thread w2(worker, 2);
    std::thread w3(worker, 3);

    std::this_thread::sleep_for(100ms);
    std::cout << "Opening the gate!\n";
    gate.open();  // All workers proceed

    w1.join();
    w2.join();
    w3.join();

    return 0;
}
