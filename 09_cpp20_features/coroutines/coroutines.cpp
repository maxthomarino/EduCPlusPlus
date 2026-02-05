/**
 * coroutines.cpp - C++20 Coroutines
 *
 * Coroutines are functions that can suspend and resume execution.
 * They enable lazy evaluation, generators, and async workflows.
 *
 * A function is a coroutine if its body contains:
 *   co_yield  - suspend and produce a value
 *   co_return - complete with a final value
 *   co_await  - suspend until an awaitable completes
 *
 * The coroutine machinery requires a promise_type and a return object.
 * This file implements a Generator<T> that yields values lazily.
 */

#include <iostream>
#include <format>
#include <coroutine>
#include <optional>
#include <string>
#include <vector>
#include <cstdint>

// -----------------------------------------------
// 1. Generator<T>: a coroutine that yields values lazily
//    This is the return type of coroutine functions.
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
