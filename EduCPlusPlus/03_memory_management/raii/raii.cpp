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

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: What happens if a constructor throws an exception -- does the destructor still run?
// A: No. If a constructor throws, the object is considered never fully constructed,
//    so its destructor is NOT called. However, any member sub-objects or base classes
//    that were already fully constructed before the throw WILL have their destructors
//    called. This means partially acquired resources in already-constructed members
//    are still cleaned up, but any cleanup logic in the failing class's own destructor
//    is skipped. Design constructors so that each resource is held by its own RAII
//    member, ensuring automatic cleanup even on partial construction failure.
//
// Q: Can RAII be used in C, or is it exclusive to C++?
// A: RAII is fundamentally a C++ idiom because it relies on deterministic destructor
//    calls tied to scope exit, which C does not have. In C, the closest approximation
//    is GCC/Clang's __attribute__((cleanup)) extension, which calls a specified
//    function when a local variable goes out of scope. Some projects also simulate
//    RAII with macros and goto-based cleanup chains, but these are fragile and
//    non-standard. True RAII requires language-level constructor/destructor support.
//
// Q: What is the Rule of Zero, and how does it relate to RAII?
// A: The Rule of Zero says that if every data member of your class is itself an RAII
//    type (e.g., std::string, std::vector, std::unique_ptr), then you do not need to
//    write a custom destructor, copy constructor, copy assignment, move constructor,
//    or move assignment operator. The compiler-generated defaults will correctly
//    manage all resources by delegating to each member's own RAII logic. The Rule of
//    Zero is the modern best practice -- only write special member functions when you
//    are implementing a low-level resource wrapper yourself.
//
// Q: Does RAII work for heap-allocated objects (created with new)?
// A: A bare heap object (allocated with new) does NOT get RAII cleanup automatically
//    -- you must call delete yourself, which defeats the purpose. The solution is to
//    wrap the heap allocation in a smart pointer (std::unique_ptr or std::shared_ptr),
//    which is itself a stack-based RAII object. When the smart pointer goes out of
//    scope, its destructor deletes the heap object. This is why modern C++ guidelines
//    say "no naked new" -- always use make_unique or make_shared.
//
// Q: Can RAII manage non-memory resources like network sockets or GPU buffers?
// A: Absolutely. RAII works for any acquire/release resource pair. You write a class
//    whose constructor acquires the resource (opens a socket, allocates a GPU buffer,
//    begins a database transaction) and whose destructor releases it (closes the
//    socket, frees the buffer, commits or rolls back the transaction). The standard
//    library already provides RAII wrappers for files (fstream), locks (lock_guard,
//    scoped_lock), and heap memory (unique_ptr, shared_ptr). For anything else, you
//    write a small custom wrapper following the same pattern.
//
// =====================================================

#include <iostream>
#include <format>
#include <fstream>
#include <mutex>
#include <string>
#include <memory>
#include <stdexcept>
#include <chrono>

// -----------------------------------------------
// HOW IT WORKS: Stack Unwinding
//
// When an exception is thrown, the runtime searches the call stack
// for a matching catch handler.  For each stack frame it passes
// through, it calls the destructors of ALL local objects in that
// frame — in reverse order of construction.  This process is
// called "stack unwinding."
//
// This is WHY RAII works: even if an exception skips over your
// cleanup code (return statements, manual delete calls, etc.),
// the destructor still runs during unwinding.  The runtime does
// not skip destructors — it is required by the standard.
//
// Critical consequence: if a destructor itself throws an exception
// during stack unwinding (while another exception is already "in
// flight"), the C++ runtime calls std::terminate and the program
// is killed immediately.  This is why destructors must not throw.
// -----------------------------------------------

// -----------------------------------------------
// 1. RAII for file handles
//    What: Wrapping file handles in an RAII class so the file closes automatically on scope exit.
//    When: Whenever you open a file and need guaranteed closure, even if exceptions are thrown.
//    Why: Manual fclose/close calls are easily skipped by early returns or exceptions, causing resource leaks.
//    Use: Acquire the file handle in the constructor; close it in the destructor. Delete copy operations.
//    Which: C++98+ (foundational idiom; fstream itself is already RAII)
//
//    The file closes automatically when the object is destroyed,
//    even if an exception is thrown.
//
//    Watch out: destructors must never throw exceptions.  If the
//    close operation can fail, handle it inside the destructor or
//    provide an explicit close() method that the caller can invoke
//    before destruction.
//
//    HOW IT WORKS: RAII Guarantees Cleanup
//
//    The C++ standard guarantees that when an object goes out of
//    scope — whether by reaching the end of a block, an early
//    return, or an exception — its destructor is called.
//
//    This guarantee is unconditional.  There is no garbage
//    collector involved, and no "finally" block is needed.  The
//    compiler inserts the destructor call at every exit point of
//    the enclosing scope automatically.
//
//    The destruction order is always the reverse of construction:
//    the last object constructed in a scope is the first one
//    destroyed.  This matters when resources depend on each other
//    (e.g., a file writer that depends on a database connection).
//
//    This guarantee applies to:
//      - stack objects (local variables)
//      - class member sub-objects (destroyed in reverse declaration order)
//      - elements of standard containers
//    In other words, anything with automatic or member storage
//    duration gets deterministic, guaranteed cleanup.
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
//    What: Using lock_guard/scoped_lock to automatically acquire and release a mutex via RAII.
//    When: Every time you lock a mutex -- never call mutex::lock/unlock manually.
//    Why: If an exception or early return occurs while the mutex is held, manual unlock is skipped, causing deadlocks.
//    Use: Declare a named lock_guard or scoped_lock local variable; the lock is released when it goes out of scope.
//    Which: C++11 (lock_guard), C++17 (scoped_lock for multiple mutexes)
//
//    std::lock_guard and std::scoped_lock are RAII wrappers
//    around mutex::lock / mutex::unlock.
//
//    Watch out: forgetting the variable name creates a temporary
//    that unlocks immediately:
//        std::lock_guard{mtx};   // BUG: unlocks right away
//    Always give the lock_guard a name so it lives until scope end:
//        std::lock_guard lock{mtx};  // Correct
//
//    HOW IT WORKS: scoped_lock vs lock_guard
//
//    lock_guard: locks exactly one mutex on construction and
//    unlocks it on destruction.  It is minimal — no overhead
//    beyond the lock/unlock calls themselves.
//
//    scoped_lock (C++17): can lock MULTIPLE mutexes atomically.
//    Internally it uses a deadlock-avoidance algorithm (via
//    std::lock) that tries different locking orders to prevent
//    two threads from deadlocking on each other's mutexes.
//
//    Rule of thumb:
//      - Use lock_guard when locking a single mutex.
//      - Use scoped_lock when locking 2+ mutexes simultaneously,
//        e.g., std::scoped_lock lock(mtx_a, mtx_b);
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
//    What: Building your own RAII wrapper class for resources the standard library does not cover.
//    When: When you manage a non-standard resource (timers, GPU contexts, C API handles) that needs deterministic cleanup.
//    Why: A custom wrapper centralises acquire/release logic and prevents every call site from repeating cleanup code.
//    Use: Store the resource as a member, acquire in the constructor, release in the destructor, and delete copy operations.
//    Which: C++98+ (the pattern works in any standard; move semantics from C++11 make it more ergonomic)
//
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
//    What: Demonstrating that RAII objects are properly destroyed during stack unwinding when exceptions propagate.
//    When: Whenever code can throw exceptions after acquiring resources -- which is nearly all non-trivial code.
//    Why: Without RAII, exception paths bypass manual cleanup calls, silently leaking resources.
//    Use: Wrap every resource in an RAII object before any operation that might throw; no try/finally needed.
//    Which: C++98+ (stack unwinding and destructor guarantees are part of the core language)
//
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
//    What: Using unique_ptr and shared_ptr as ready-made RAII wrappers for heap-allocated objects.
//    When: Every time you need heap allocation -- replace raw new/delete with make_unique or make_shared.
//    Why: Smart pointers automate delete calls and make ownership semantics explicit in the type system.
//    Use: Use make_unique by default for single ownership; use make_shared only when multiple owners are needed.
//    Which: C++11 (unique_ptr, shared_ptr), C++14 (make_unique)
//
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
