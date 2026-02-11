/**
 * exceptions.cpp - Exception Handling in C++
 *
 * WHY IT EXISTS:  Exceptions separate error-handling logic from the normal
 *                 control flow.  They let an error propagate automatically up
 *                 the call stack until a handler is found, so intermediate
 *                 functions do not need to inspect and forward error codes.
 *                 RAII destructors run during stack unwinding, keeping resource
 *                 management safe.
 *
 * WHEN TO USE:    Use exceptions for *exceptional* conditions -- errors that
 *                 cannot be handled locally and must be reported to a caller
 *                 several frames above.  Prefer return values (std::optional,
 *                 std::expected) for expected failure paths (e.g., "not found").
 *
 * STANDARD:       Exceptions exist since C++98.  Modern best practices evolved
 *                 in C++11 (noexcept, std::current_exception) and C++17
 *                 (std::uncaught_exceptions).
 * PREREQUISITES:  RAII, class inheritance, virtual functions
 * REFERENCE:      reference/en/cpp/error/exception
 */

#include <iostream>
#include <format>
#include <stdexcept>
#include <string>
#include <vector>
#include <memory>
#include <fstream>

// -----------------------------------------------
// 1. Standard exception hierarchy
//    std::exception
//     +-- std::logic_error
//     |    +-- std::invalid_argument
//     |    +-- std::out_of_range
//     |    +-- std::domain_error
//     +-- std::runtime_error
//          +-- std::overflow_error
//          +-- std::underflow_error
//          +-- std::system_error
// -----------------------------------------------

// -----------------------------------------------
// 2. Custom exception class
//    Inherit from std::exception or its subclasses.
//
//    Watch out: catch by const reference
//    (catch (const std::exception& e)) to avoid
//    slicing the exception object.  Catching by
//    value would copy-slice a derived exception
//    into its base, losing the extra data.
// -----------------------------------------------
class DatabaseError : public std::runtime_error {
    int error_code_;

public:
    DatabaseError(const std::string& message, int code)
        : std::runtime_error(message), error_code_(code) {}

    int error_code() const { return error_code_; }
};

class ConnectionError : public DatabaseError {
public:
    ConnectionError(const std::string& host)
        : DatabaseError(std::format("Cannot connect to '{}'", host), 1001) {}
};

class QueryError : public DatabaseError {
public:
    QueryError(const std::string& query)
        : DatabaseError(std::format("Invalid query: '{}'", query), 2001) {}
};

// -----------------------------------------------
// 3. Functions that throw
// -----------------------------------------------
double safe_divide(double a, double b) {
    if (b == 0.0) {
        throw std::domain_error("Division by zero");
    }
    return a / b;
}

int safe_access(const std::vector<int>& v, std::size_t index) {
    if (index >= v.size()) {
        throw std::out_of_range(
            std::format("Index {} out of range (size={})", index, v.size()));
    }
    return v[index];
}

// Simulated database operations
void connect_to_db(const std::string& host) {
    if (host == "badhost") {
        throw ConnectionError(host);
    }
    std::cout << std::format("Connected to {}\n", host);
}

void run_query(const std::string& sql) {
    if (sql.empty()) {
        throw QueryError(sql);
    }
    std::cout << std::format("Query executed: {}\n", sql);
}

// -----------------------------------------------
// 4. noexcept: promise that a function won't throw
//    Enables optimizations (move constructors should be noexcept).
//
//    Watch out: throwing in a destructor during
//    stack unwinding calls std::terminate.  Mark
//    destructors noexcept (they are noexcept by
//    default since C++11 -- do not change that).
// -----------------------------------------------
void safe_function() noexcept {
    // If this throws, std::terminate is called.
    // Use noexcept for destructors, move ops, and simple functions.
}

// Conditional noexcept: only noexcept if T's move is noexcept
template<typename T>
void swap_values(T& a, T& b) noexcept(std::is_nothrow_move_constructible_v<T>) {
    T temp = std::move(a);
    a = std::move(b);
    b = std::move(temp);
}

// -----------------------------------------------
// 5. RAII for exception safety
//    Use RAII objects so resources are cleaned up
//    even when exceptions are thrown.
// -----------------------------------------------
class Transaction {
    std::string name_;
    bool committed_ = false;

public:
    explicit Transaction(std::string name)
        : name_(std::move(name)) {
        std::cout << std::format("  Transaction '{}' started\n", name_);
    }

    void commit() {
        committed_ = true;
        std::cout << std::format("  Transaction '{}' committed\n", name_);
    }

    // If not committed, automatically roll back
    ~Transaction() {
        if (!committed_) {
            std::cout << std::format("  Transaction '{}' rolled back!\n", name_);
        }
    }
};

void do_work(bool should_fail) {
    Transaction txn("update_user");

    // Do some work...
    if (should_fail) {
        throw std::runtime_error("Work failed!");
        // Transaction destructor runs -> automatic rollback
    }

    txn.commit();  // Only reached on success
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Exceptions separate error handling from normal flow and propagate
//    errors across arbitrarily many stack frames automatically.
// 2. Always catch exceptions by const reference to avoid object slicing.
// 3. Order catch blocks from most-derived to most-base; the first
//    matching handler wins.
// 4. Mark move constructors/operators and destructors noexcept.  Throwing
//    inside a destructor during stack unwinding calls std::terminate.
// 5. Combine exceptions with RAII: if every resource is owned by an RAII
//    object, stack unwinding guarantees no leaks.
// -----------------------------------------------

int main() {
    // ---- Basic try/catch ----
    std::cout << "--- Basic Exception Handling ---\n";
    try {
        double result = safe_divide(10.0, 0.0);
        std::cout << std::format("Result: {}\n", result);
    } catch (const std::domain_error& e) {
        std::cout << std::format("Domain error: {}\n", e.what());
    }

    // ---- Catch by reference (best practice) ----
    std::cout << "\n--- Out of Range ---\n";
    std::vector<int> nums = {10, 20, 30};
    try {
        int val = safe_access(nums, 5);
        std::cout << std::format("Value: {}\n", val);
    } catch (const std::out_of_range& e) {
        std::cout << std::format("Caught: {}\n", e.what());
    }

    // ---- Custom exception hierarchy ----
    std::cout << "\n--- Custom Exceptions ---\n";
    try {
        connect_to_db("badhost");
    } catch (const ConnectionError& e) {
        std::cout << std::format("Connection failed (code {}): {}\n",
                                  e.error_code(), e.what());
    }

    // ---- Catch base class to handle all derived ----
    std::cout << "\n--- Catching Base Class ---\n";
    try {
        run_query("");
    } catch (const DatabaseError& e) {
        // Catches both ConnectionError and QueryError
        std::cout << std::format("DB error (code {}): {}\n",
                                  e.error_code(), e.what());
    }

    // ---- Multiple catch blocks (order matters: most derived first) ----
    std::cout << "\n--- Multiple Catch Blocks ---\n";
    try {
        throw std::overflow_error("integer overflow");
    } catch (const std::overflow_error& e) {
        std::cout << std::format("Overflow: {}\n", e.what());
    } catch (const std::runtime_error& e) {
        std::cout << std::format("Runtime: {}\n", e.what());
    } catch (const std::exception& e) {
        std::cout << std::format("Exception: {}\n", e.what());
    } catch (...) {
        std::cout << "Unknown exception!\n";
    }

    // ---- RAII and exception safety ----
    std::cout << "\n--- RAII Transaction ---\n";
    try {
        do_work(true);  // Will throw -> automatic rollback
    } catch (const std::exception& e) {
        std::cout << std::format("Caught: {}\n", e.what());
    }

    do_work(false);  // Success -> commit

    // ---- noexcept check ----
    std::cout << "\n--- noexcept ---\n";
    std::cout << std::format("safe_function noexcept? {}\n",
                              noexcept(safe_function()));
    std::cout << std::format("safe_divide noexcept? {}\n",
                              noexcept(safe_divide(1.0, 2.0)));

    return 0;
}
