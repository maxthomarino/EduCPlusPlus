/**
 * coroutines.cpp - C++20 Coroutines
 *
 * WHY THEY EXIST: Traditional functions run to completion once called.
 *                 Coroutines can *suspend* execution at well-defined points
 *                 and be *resumed* later, enabling lazy generators, async I/O,
 *                 and cooperative multitasking -- all with code that reads
 *                 like straightforward sequential logic.
 *
 * WHEN TO USE:    Lazy sequences (generate values on demand), asynchronous
 *                 pipelines (co_await network/file I/O), and any workflow
 *                 that benefits from suspend/resume without OS-level threads.
 *
 * HOW IT WORKS:   A function becomes a coroutine if its body contains
 *                 co_yield, co_return, or co_await.  The compiler transforms
 *                 it into a state machine backed by a heap-allocated coroutine
 *                 frame.  A user-provided promise_type controls how values
 *                 are produced and how the coroutine lifecycle behaves.
 *
 * STANDARD:       C++20  (headers <coroutine>)
 * PREREQUISITES:  Templates, move semantics, RAII, iterators
 * REFERENCE:      reference/en/cpp/language/coroutines
 *                 reference/en/cpp/coroutine
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: What is the difference between a coroutine and a thread?
// A: A thread is an OS-level execution context with its own stack, scheduled
//    preemptively by the kernel. A coroutine is a compiler-generated state
//    machine that suspends and resumes cooperatively in user space -- it does
//    not require a separate stack or OS scheduling. Coroutines are much
//    cheaper to create and switch, but they cannot run in true parallelism
//    on their own.
//
// Q: What is the difference between co_await and co_yield?
// A: co_yield expr is shorthand for co_await promise.yield_value(expr) -- it
//    produces a value and suspends. co_await expr suspends the coroutine until
//    the awaited object (an "awaitable") signals that the result is ready.
//    co_yield is for generators (producing values); co_await is for async
//    workflows (waiting on I/O, timers, etc.).
//
// Q: Do coroutines always allocate on the heap?
// A: By default, the coroutine frame is heap-allocated. However, the compiler
//    may apply HALO (Heap Allocation eLision Optimization) to eliminate the
//    allocation when it can prove the coroutine's lifetime is bounded by the
//    caller. You can also provide a custom operator new in the promise_type
//    to control or pool allocations.
//
// Q: How does generator performance compare to hand-written iterators?
// A: With optimizations enabled, a generator coroutine typically compiles down
//    to code comparable to a hand-rolled state machine. The suspend/resume
//    overhead is small (saving/restoring a few registers). The main cost risk
//    is the heap allocation of the coroutine frame, which HALO may or may not
//    eliminate depending on the compiler and call context.
//
// =====================================================

#include <iostream>
#include <format>
#include <coroutine>
#include <optional>
#include <string>
#include <vector>
#include <cstdint>

// -----------------------------------------------
// 1. Generator<T>: a coroutine that yields values lazily
//    What: Coroutines suspend and resume execution via compiler-generated state machines.
//    When: Use this for generators and asynchronous workflows.
//    Why: They express asynchronous control flow without callback nesting.
//    Use: Define promise/awaiter support and use co_await, co_yield, or co_return.
//    Which: C++20
//
//    This is the return type of coroutine functions.
//
//    Watch out: C++20 coroutines provide the language
//    mechanics (co_await, co_yield, co_return) but NOT
//    a library of coroutine types.  You must write or
//    import a promise_type yourself (or wait for
//    std::generator in C++23).
//
//    Watch out: a coroutine frame is heap-allocated by
//    default.  The compiler may optimize this away
//    (HALO -- Heap Allocation eLision Optimization)
//    but it is not guaranteed.
// -----------------------------------------------
template<typename T>
class Generator {
public:
    // The promise_type is required by the coroutine machinery.
    // It controls how values are produced and how the coroutine behaves.
    struct promise_type {
        T current_value;

        // What to return when the coroutine is first called
        Generator get_return_object() {
            return Generator{
                std::coroutine_handle<promise_type>::from_promise(*this)
            };
        }

        // Suspend immediately on creation (lazy start)
        std::suspend_always initial_suspend() { return {}; }

        // Suspend at the end (so we can detect completion)
        std::suspend_always final_suspend() noexcept { return {}; }

        // Handle co_yield: store the value and suspend
        std::suspend_always yield_value(T value) {
            current_value = std::move(value);
            return {};
        }

        void return_void() {}

        void unhandled_exception() {
            std::terminate();
        }
    };

    // ---- Iterator interface for range-for support ----
    struct iterator {
        std::coroutine_handle<promise_type> handle;
        bool done;

        iterator& operator++() {
            handle.resume();
            done = handle.done();
            return *this;
        }

        T operator*() const {
            return handle.promise().current_value;
        }

        bool operator!=(const iterator& other) const {
            return done != other.done;
        }
    };

    iterator begin() {
        handle_.resume();  // Advance to first co_yield
        return {handle_, handle_.done()};
    }

    iterator end() {
        return {handle_, true};
    }

    // ---- Lifecycle management ----
    explicit Generator(std::coroutine_handle<promise_type> h) : handle_(h) {}

    ~Generator() {
        if (handle_) handle_.destroy();
    }

    // Move-only (coroutine handles are unique resources)
    Generator(Generator&& other) noexcept : handle_(other.handle_) {
        other.handle_ = nullptr;
    }

    Generator& operator=(Generator&& other) noexcept {
        if (this != &other) {
            if (handle_) handle_.destroy();
            handle_ = other.handle_;
            other.handle_ = nullptr;
        }
        return *this;
    }

    Generator(const Generator&) = delete;
    Generator& operator=(const Generator&) = delete;

    // Manual next() for non-range-for usage
    std::optional<T> next() {
        if (!handle_ || handle_.done()) return std::nullopt;
        handle_.resume();
        if (handle_.done()) return std::nullopt;
        return handle_.promise().current_value;
    }

private:
    std::coroutine_handle<promise_type> handle_;
};

// -----------------------------------------------
// 2. Generator coroutines: functions that co_yield values
//    What: Coroutines suspend and resume execution via compiler-generated state machines.
//    When: Use this for generators and asynchronous workflows.
//    Why: They express asynchronous control flow without callback nesting.
//    Use: Define promise/awaiter support and use co_await, co_yield, or co_return.
//    Which: C++20
//
// -----------------------------------------------

// Infinite sequence of natural numbers
Generator<int> naturals(int start = 0) {
    while (true) {
        co_yield start++;  // Suspend and produce a value
    }
}

// Fibonacci sequence (infinite)
Generator<std::uint64_t> fibonacci() {
    std::uint64_t a = 0, b = 1;
    while (true) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}

// Finite generator: range of values
Generator<int> range(int start, int end, int step = 1) {
    for (int i = start; i < end; i += step) {
        co_yield i;
    }
    // Coroutine completes here (no more co_yield)
}

// String tokenizer as a coroutine
Generator<std::string> split(std::string text, char delimiter) {
    std::string token;
    for (char c : text) {
        if (c == delimiter) {
            if (!token.empty()) {
                co_yield token;
                token.clear();
            }
        } else {
            token += c;
        }
    }
    if (!token.empty()) {
        co_yield token;
    }
}

// Filter: only yield values matching a predicate
Generator<int> filter_even(Generator<int> source) {
    for (int n : source) {
        if (n % 2 == 0) {
            co_yield n;
        }
    }
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. A coroutine is any function whose body contains co_yield, co_return,
//    or co_await.  The compiler rewrites it into a resumable state machine.
// 2. C++20 provides the *language* primitives but no standard coroutine
//    types.  You must supply a promise_type (or use std::generator in C++23).
// 3. Coroutine frames are heap-allocated by default.  The compiler may
//    elide the allocation (HALO) but this is not guaranteed.
// 4. Generators (co_yield) are the simplest coroutine pattern: produce
//    values lazily, consumed via range-for or an explicit next() call.
// 5. Coroutines compose naturally -- a generator can consume another
//    generator, building lazy processing pipelines.
// -----------------------------------------------

int main() {
    // ---- Range generator ----
    std::cout << "--- range(0, 10, 2) ---\n";
    for (int n : range(0, 10, 2)) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // ---- Fibonacci (take first 15) ----
    std::cout << "\n--- Fibonacci (first 15) ---\n";
    int count = 0;
    for (auto n : fibonacci()) {
        std::cout << n << ' ';
        if (++count >= 15) break;  // Stop the infinite generator
    }
    std::cout << '\n';

    // ---- String tokenizer ----
    std::cout << "\n--- String Split ---\n";
    for (const auto& token : split("hello,world,from,coroutines", ',')) {
        std::cout << std::format("[{}] ", token);
    }
    std::cout << '\n';

    // ---- Composing generators ----
    std::cout << "\n--- Even numbers from range(0,20) ---\n";
    for (int n : filter_even(range(0, 20))) {
        std::cout << n << ' ';
    }
    std::cout << '\n';

    // ---- Manual iteration with next() ----
    std::cout << "\n--- Manual next() ---\n";
    auto gen = naturals(100);
    for (int i = 0; i < 5; ++i) {
        if (auto val = gen.next()) {
            std::cout << std::format("next() = {}\n", *val);
        }
    }

    return 0;
}
