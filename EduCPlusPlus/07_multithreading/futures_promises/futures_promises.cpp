/**
 * futures_promises.cpp - Futures and Promises in C++
 *
 * Why:      Manually managing threads and shared state just to return a value
 *           from a background task is complex and error-prone. Futures and
 *           promises provide a clean, one-shot channel for transferring a
 *           value (or exception) between threads without explicit locking.
 * When:     Use std::async for simple fire-and-forget async tasks.
 *           Use std::promise/std::future when a producer thread needs to send
 *           a result to a consumer at an arbitrary point in time.
 * Standard: C++11 introduced std::future, std::promise, and std::async.
 * Prereqs:  std::thread basics, exception handling, move semantics.
 * Reference: reference/en/cpp/thread/future
 *            reference/en/cpp/thread/async
 *            reference/en/cpp/thread/promise
 *
 * Compile with: g++ -std=c++20 -pthread futures_promises.cpp
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: What is the difference between std::async and creating a std::thread?
// A: std::async is a higher-level abstraction that returns a std::future holding
//    the task's return value (or exception). The runtime may pool threads or
//    defer execution. std::thread is lower-level: you manage the thread's
//    lifetime yourself and must use shared state or a promise to retrieve
//    results. Prefer std::async for simple "compute and return" tasks; use
//    std::thread when you need fine-grained control over thread lifetime,
//    affinity, or when the work is long-running and ongoing.
//
// Q: What is std::packaged_task and when would I use it?
// A: std::packaged_task wraps a callable and provides a future for its result,
//    but unlike std::async it does not launch execution automatically. You
//    invoke it manually or pass it to a thread. This is useful for thread pools:
//    you can enqueue packaged_tasks into a work queue and have worker threads
//    execute them, while callers hold futures to retrieve results later.
//
// Q: What does std::launch::deferred do exactly?
// A: With launch::deferred, the task is not executed until someone calls get()
//    or wait() on the returned future. It runs in the calling thread at that
//    point -- no new thread is ever created. This is useful for lazy evaluation:
//    compute the result only if it turns out to be needed. Note that if you
//    never call get() or wait(), the task never runs at all.
//
// Q: What is the fire-and-forget anti-pattern with std::async?
// A: If you discard the future returned by std::async(std::launch::async, ...),
//    the future's destructor blocks until the task completes. This makes the
//    call effectively synchronous, defeating the purpose of async execution.
//    For example: std::async(std::launch::async, slow_fn); // blocks here!
//    Always capture the returned future in a variable and call get() later, or
//    use a detached std::thread if you truly want fire-and-forget (but then you
//    lose exception propagation and result retrieval).
//
// =====================================================

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
// Key Takeaways
// -----------------------------------------------
// 1. std::async with launch::async returns a future whose destructor
//    BLOCKS until the task completes. Discarding the returned future
//    makes the call effectively synchronous.
// 2. Calling future::get() more than once throws std::future_error
//    (error code: no_state). Use std::shared_future for multiple consumers.
// 3. Exceptions thrown inside an async task or promise are captured and
//    re-thrown when you call future::get() -- no special handling needed.
// 4. std::async with launch::deferred runs the task lazily on the first
//    call to get()/wait() -- it never creates a new thread.
// -----------------------------------------------

// -----------------------------------------------
// 1. std::async -- simplest way to run work asynchronously
//    Returns a future that holds the result.
// Watch out: std::async with launch::async returns a future whose
// destructor blocks until the task completes. Discarding the future
// (e.g., not capturing the return value) makes the call synchronous.
// -----------------------------------------------
long long compute_sum(int from, int to) {
    long long sum = 0;
    for (int i = from; i <= to; ++i) sum += i;
    return sum;
}

// -----------------------------------------------
// 2. std::promise / std::future -- manual producer/consumer
// Watch out: calling promise::set_value() more than once, or calling
// it after set_exception(), throws std::future_error. Each promise
// can deliver exactly one result.
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
// Watch out: calling future::get() more than once throws
// std::future_error. Use shared_future for multiple consumers.
// -----------------------------------------------
void wait_and_print(std::shared_future<int> sf, std::string name) {
    int result = sf.get();  // Multiple threads can call .get()
    std::cout << std::format("{} got result: {}\n", name, result);
}

int main() {
    // ---- std::async ----
    std::cout << "--- std::async ---\n";

    // Launch async tasks (launch::async guarantees a new thread)
    auto future1 = std::async(std::launch::async, compute_sum, 1, 50'000);
    auto future2 = std::async(std::launch::async, compute_sum, 50'001, 100'000);

    // Do other work while async tasks run...
    std::cout << "Computing in background...\n";

    // .get() blocks until the result is ready
    long long total = future1.get() + future2.get();
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
