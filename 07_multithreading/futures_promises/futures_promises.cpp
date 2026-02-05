/**
 * futures_promises.cpp - Futures and Promises in C++
 *
 * Futures and promises provide a way to transfer a value
 * between threads without explicit locking.
 *   - std::promise: the "producer" sets a value or exception
 *   - std::future: the "consumer" retrieves the value (blocking)
 *   - std::async: high-level wrapper that returns a future
 */

#include <iostream>
#include <format>
#include <future>
#include <thread>
#include <chrono>
#include <numeric>
#include <vector>
#include <stdexcept>

using namespace std::chrono_literals;

// -----------------------------------------------
// 1. std::async -- simplest way to run work asynchronously
//    Returns a future that holds the result.
// -----------------------------------------------
int compute_sum(int from, int to) {
    int sum = 0;
    for (int i = from; i <= to; ++i) sum += i;
    return sum;
}

// -----------------------------------------------
// 2. std::promise / std::future -- manual producer/consumer
// -----------------------------------------------
void producer(std::promise<std::string> promise) {
    std::this_thread::sleep_for(100ms);  // Simulate work
    promise.set_value("Hello from the producer thread!");
}

// -----------------------------------------------
// 3. Exception propagation through futures
//    If the async task throws, the exception is stored
//    in the future and re-thrown on .get().
// -----------------------------------------------
int risky_computation(int x) {
    if (x < 0) {
        throw std::invalid_argument("Negative input not allowed");
    }
    return x * x;
}

// -----------------------------------------------
// 4. std::shared_future -- multiple consumers
//    A regular future can only be .get() once.
//    shared_future allows multiple threads to read the result.
// -----------------------------------------------
void wait_and_print(std::shared_future<int> sf, std::string name) {
    int result = sf.get();  // Multiple threads can call .get()
    std::cout << std::format("{} got result: {}\n", name, result);
}

int main() {
    // ---- std::async ----
    std::cout << "--- std::async ---\n";

    // Launch async tasks (may run in a thread pool)
    auto future1 = std::async(std::launch::async, compute_sum, 1, 50'000);
    auto future2 = std::async(std::launch::async, compute_sum, 50'001, 100'000);

    // Do other work while async tasks run...
    std::cout << "Computing in background...\n";

    // .get() blocks until the result is ready
    int total = future1.get() + future2.get();
    std::cout << std::format("Sum 1..100000 = {}\n", total);

    // ---- std::promise / std::future ----
    std::cout << "\n--- std::promise / std::future ---\n";

    std::promise<std::string> promise;
    std::future<std::string> future = promise.get_future();

    // Producer thread sets the value
    std::thread t(producer, std::move(promise));

    // Consumer (main thread) waits for the value
    std::cout << "Waiting for result...\n";
    std::string result = future.get();  // Blocks until value is set
    std::cout << std::format("Received: {}\n", result);
    t.join();

    // ---- Future status polling ----
    std::cout << "\n--- Future Status ---\n";
    auto slow_future = std::async(std::launch::async, [] {
        std::this_thread::sleep_for(200ms);
        return 42;
    });

    // Check if result is ready without blocking
    while (slow_future.wait_for(50ms) != std::future_status::ready) {
        std::cout << "Still waiting...\n";
    }
    std::cout << std::format("Got: {}\n", slow_future.get());

    // ---- Exception propagation ----
    std::cout << "\n--- Exception Propagation ---\n";
    auto bad_future = std::async(std::launch::async, risky_computation, -5);

    try {
        int val = bad_future.get();  // Re-throws the exception!
        std::cout << std::format("Result: {}\n", val);
    } catch (const std::invalid_argument& e) {
        std::cout << std::format("Caught from future: {}\n", e.what());
    }

    // ---- shared_future ----
    std::cout << "\n--- std::shared_future ---\n";
    std::promise<int> shared_promise;
    std::shared_future<int> sf = shared_promise.get_future().share();

    // Multiple consumers waiting on the same result
    std::thread c1(wait_and_print, sf, "Consumer 1");
    std::thread c2(wait_and_print, sf, "Consumer 2");
    std::thread c3(wait_and_print, sf, "Consumer 3");

    // Produce the result
    shared_promise.set_value(999);

    c1.join();
    c2.join();
    c3.join();

    return 0;
}
