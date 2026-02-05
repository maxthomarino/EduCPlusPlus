/**
 * thread_basics.cpp - Creating and Managing Threads
 * 
 * Compile with: g++ -std=c++20 -pthread thread_basics.cpp
 */

#include <iostream>
#include <thread>
#include <format>
#include <vector>

void simple_task(int id) {
    std::cout << std::format("Thread {} starting\n", id);
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    std::cout << std::format("Thread {} finished\n", id);
}

void task_with_result(int id, int& result) {
    result = id * id;
}

int main() {
    std::cout << std::format("Hardware threads: {}\n", 
                             std::thread::hardware_concurrency());
    
    // Basic thread creation
    std::thread t1(simple_task, 1);
    std::thread t2(simple_task, 2);
    
    // Must join or detach before destructor!
    t1.join();  // Wait for completion
    t2.join();
    
    // Thread with reference parameter
    int result = 0;
    std::thread t3(task_with_result, 5, std::ref(result));
    t3.join();
    std::cout << std::format("Result: {}\n", result);
    
    // Lambda threads
    std::vector<std::thread> workers;
    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([i] {
            std::cout << std::format("Lambda worker {} running\n", i);
        });
    }
    
    for (auto& w : workers) {
        w.join();
    }
    
    std::cout << "All threads completed\n";
    return 0;
}
