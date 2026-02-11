/**
 * thread_basics.cpp - Creating and Managing Threads
 *
 * Why:      Before C++11, multithreading required platform-specific APIs
 *           (pthreads on POSIX, Win32 threads on Windows). std::thread gives
 *           a portable way to leverage multi-core CPUs for parallel work.
 * When:     Use threads for CPU-bound work or long-running background tasks.
 *           For I/O-bound work, consider std::async or coroutines instead.
 * Standard: C++11 introduced std::thread.
 *           C++20 added std::jthread with automatic joining and cooperative
 *           cancellation via std::stop_token.
 * Prereqs:  Basic understanding of functions, lambdas, and std::ref.
 * Reference: reference/en/cpp/thread/thread
 *            reference/en/cpp/thread/jthread
 *
 * Compile with: g++ -std=c++20 -pthread thread_basics.cpp
 */

#include <iostream>
#include <thread>
#include <format>
#include <vector>
#include <stop_token>

void simple_task(int id) {
    std::cout << std::format("Thread {} starting\n", id);
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    std::cout << std::format("Thread {} finished\n", id);
}

void task_with_result(int id, int& result) {
    result = id * id;
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. std::thread runs a callable in a new OS thread. Always join() or
//    detach() before the thread object is destroyed.
// 2. Pass arguments by value by default; use std::ref() to pass by
//    reference (the thread copies arguments otherwise).
// 3. Prefer std::jthread (C++20) over std::thread: it auto-joins in its
//    destructor and supports cooperative cancellation via stop_token.
// 4. Use std::thread::hardware_concurrency() to query the number of
//    hardware threads and size your thread pools accordingly.
// 5. Lambda threads are convenient but watch captured reference lifetimes.
// -----------------------------------------------

int main() {
    std::cout << std::format("Hardware threads: {}\n",
                             std::thread::hardware_concurrency());

    // -----------------------------------------------
    // 1. Basic thread creation
    // Watch out: a std::thread that goes out of scope without join() or
    // detach() calls std::terminate. Prefer std::jthread (C++20) which
    // auto-joins.
    // -----------------------------------------------
    std::thread t1(simple_task, 1);
    std::thread t2(simple_task, 2);

    // Must join or detach before destructor!
    t1.join();  // Wait for completion
    t2.join();

    // -----------------------------------------------
    // 2. Thread with reference parameter
    // Watch out: std::thread copies its arguments by default. You must
    // wrap references in std::ref(); forgetting this causes a compile
    // error or silent copy.
    // -----------------------------------------------
    int result = 0;
    std::thread t3(task_with_result, 5, std::ref(result));
    t3.join();
    std::cout << std::format("Result: {}\n", result);

    // -----------------------------------------------
    // 3. Lambda threads
    // Watch out: detach() makes the thread independent -- it continues
    // running even after main() returns, potentially accessing destroyed
    // objects. Only detach when the thread is truly self-contained.
    // -----------------------------------------------
    std::vector<std::thread> workers;
    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([i] {
            std::cout << std::format("Lambda worker {} running\n", i);
        });
    }

    for (auto& w : workers) {
        w.join();
    }

    // -----------------------------------------------
    // 4. std::jthread -- C++20 auto-joining thread with cooperative
    //    cancellation via stop_token
    // Watch out: jthread's destructor requests stop AND joins. If your
    // thread ignores the stop_token it will still block until the
    // thread finishes naturally.
    // -----------------------------------------------
    std::cout << "\n--- std::jthread with stop_token ---\n";
    {
        std::jthread worker([](std::stop_token stoken) {
            int count = 0;
            while (!stoken.stop_requested()) {
                std::cout << std::format("jthread working... (iteration {})\n", ++count);
                std::this_thread::sleep_for(std::chrono::milliseconds(50));
            }
            std::cout << "jthread received stop request, exiting cleanly\n";
        });

        // Let the worker run for a bit
        std::this_thread::sleep_for(std::chrono::milliseconds(180));

        // jthread destructor calls request_stop() then join() automatically
        std::cout << "jthread going out of scope (auto-stop + auto-join)\n";
    }

    std::cout << "All threads completed\n";
    return 0;
}
