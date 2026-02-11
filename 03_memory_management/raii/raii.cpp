/**
 * raii.cpp - RAII (Resource Acquisition Is Initialization)
 *
 * Why:      Manual new/delete is error-prone: memory leaks on exceptions,
 *           forgotten deletes, double-frees.  RAII eliminates all of these
 *           by tying resource lifetime to object lifetime.
 * When:     Always -- RAII should be the default strategy for managing any
 *           resource: files, sockets, locks, database handles, heap memory.
 * Standard: RAII is a C++ idiom since the very beginning of the language,
 *           but smart pointers (C++11) and std::scoped_lock (C++17) make
 *           it significantly easier to apply in practice.
 * Prereqs:  Basic understanding of constructors, destructors, and scope.
 * Reference: reference/en/cpp/language/raii
 */

#include <iostream>
#include <format>
#include <fstream>
#include <mutex>
#include <string>
#include <memory>
#include <stdexcept>

// -----------------------------------------------
// 1. RAII for file handles
//    The file closes automatically when the object is destroyed,
//    even if an exception is thrown.
//
//    Watch out: destructors must never throw exceptions.  If the
//    close operation can fail, handle it inside the destructor or
//    provide an explicit close() method that the caller can invoke
//    before destruction.
// -----------------------------------------------
class FileWriter {
    std::ofstream file_;
    std::string filename_;

public:
    explicit FileWriter(const std::string& filename)
        : file_(filename), filename_(filename) {
        if (!file_.is_open()) {
            throw std::runtime_error(
                std::format("Failed to open '{}'", filename));
        }
        std::cout << std::format("Opened '{}'\n", filename_);
    }

    // Destructor: automatically closes the file
    ~FileWriter() {
        if (file_.is_open()) {
            file_.close();
            std::cout << std::format("Closed '{}'\n", filename_);
        }
    }

    // Non-copyable (the resource is unique)
    FileWriter(const FileWriter&) = delete;
    FileWriter& operator=(const FileWriter&) = delete;

    void write(std::string_view text) {
        file_ << text;
    }
};

// -----------------------------------------------
// 2. RAII for mutex locks
//    std::lock_guard and std::scoped_lock are RAII wrappers
//    around mutex::lock / mutex::unlock.
//
//    Watch out: forgetting the variable name creates a temporary
//    that unlocks immediately:
//        std::lock_guard{mtx};   // BUG: unlocks right away
//    Always give the lock_guard a name so it lives until scope end:
//        std::lock_guard lock{mtx};  // Correct
// -----------------------------------------------
class ThreadSafeCounter {
    int value_ = 0;
    mutable std::mutex mtx_;

public:
    void increment() {
        // lock_guard locks on construction, unlocks on destruction
        std::lock_guard lock(mtx_);
        ++value_;
        // If an exception were thrown here, the mutex
        // would still be unlocked -- that's the RAII guarantee.
    }

    int get() const {
        std::lock_guard lock(mtx_);
        return value_;
    }
};

// -----------------------------------------------
// 3. Custom RAII wrapper (generic pattern)
//    Acquires a resource and guarantees cleanup.
// -----------------------------------------------
class Timer {
    std::string label_;
    std::chrono::steady_clock::time_point start_;

public:
    explicit Timer(std::string label)
        : label_(std::move(label)),
          start_(std::chrono::steady_clock::now()) {
        std::cout << std::format("[{}] Started\n", label_);
    }

    ~Timer() {
        auto end = std::chrono::steady_clock::now();
        auto ms = std::chrono::duration_cast<std::chrono::microseconds>(
            end - start_).count();
        std::cout << std::format("[{}] Elapsed: {} us\n", label_, ms);
    }

    Timer(const Timer&) = delete;
    Timer& operator=(const Timer&) = delete;
};

// -----------------------------------------------
// 4. RAII and exception safety
//    Even when exceptions fly, resources are cleaned up.
// -----------------------------------------------
void demonstrate_exception_safety() {
    std::cout << "\n--- Exception Safety ---\n";
    try {
        FileWriter writer("raii_test.txt");
        writer.write("Hello from RAII!\n");

        // Simulate an error after resource acquisition
        throw std::runtime_error("Something went wrong!");

        // This line is never reached, but the file is still closed
        writer.write("This is never written\n");
    } catch (const std::exception& e) {
        std::cout << std::format("Caught: {}\n", e.what());
        // FileWriter destructor already ran -- file is safely closed
    }
}

// -----------------------------------------------
// 5. RAII with smart pointers (modern best practice)
//    unique_ptr and shared_ptr are RAII for heap memory.
// -----------------------------------------------
struct Resource {
    std::string name;
    Resource(std::string n) : name(std::move(n)) {
        std::cout << std::format("Resource '{}' acquired\n", name);
    }
    ~Resource() {
        std::cout << std::format("Resource '{}' released\n", name);
    }
};

void demonstrate_smart_pointer_raii() {
    std::cout << "\n--- Smart Pointer RAII ---\n";
    {
        // unique_ptr: single ownership, automatic cleanup
        auto res = std::make_unique<Resource>("Database");
        std::cout << std::format("Using {}\n", res->name);
        // res goes out of scope -> Resource is destroyed
    }
    std::cout << "After scope\n";
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. RAII ties resource lifetime to object lifetime: acquire in the
//    constructor, release in the destructor.  No manual cleanup needed.
// 2. Exception safety comes for free -- when the stack unwinds, every
//    local RAII object's destructor runs, releasing its resource.
// 3. Prefer standard RAII wrappers (unique_ptr, lock_guard, fstream)
//    over writing your own.  Write custom wrappers only for resources
//    the standard library does not cover.
// 4. Destructors must not throw.  If cleanup can fail, provide an
//    explicit close/release method and swallow errors in the destructor.
// 5. Always name your RAII objects -- an unnamed temporary is destroyed
//    at the end of the full-expression, not at the end of the scope.
// -----------------------------------------------

int main() {
    // 1. File RAII
    std::cout << "--- File RAII ---\n";
    {
        FileWriter writer("raii_demo.txt");
        writer.write("Line 1\n");
        writer.write("Line 2\n");
        // Destructor called here -- file closed automatically
    }

    // 2. Timer RAII
    std::cout << "\n--- Timer RAII ---\n";
    {
        Timer t("Computation");
        // Simulate some work
        volatile int sum = 0;
        for (int i = 0; i < 1000000; ++i) sum += i;
    }

    // 3. Exception safety
    demonstrate_exception_safety();

    // 4. Smart pointer RAII
    demonstrate_smart_pointer_raii();

    return 0;
}
