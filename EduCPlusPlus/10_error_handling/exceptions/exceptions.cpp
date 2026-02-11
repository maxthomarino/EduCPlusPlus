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

// -----------------------------------------------
// HOW EXCEPTION PROPAGATION WORKS:
//
// 1. When `throw expr` executes, the runtime creates an exception object.
//    This object is stored in a special implementation-managed memory area
//    (not on the normal stack), so it survives stack unwinding.
//
// 2. The runtime searches UP the call stack for a try block that has a
//    catch handler whose parameter type matches the thrown object's type.
//
// 3. For every stack frame the runtime exits on the way up, it calls the
//    destructors of all local objects in that frame, in reverse order of
//    construction.  This is called STACK UNWINDING and is the reason RAII
//    works -- resources are released even on the error path.
//
// 4. Matching is done by TYPE: `catch (const T& e)` matches if the thrown
//    object's type IS-A T (exact match, or the thrown type is derived from
//    T).  This uses the same RTTI mechanism as dynamic_cast.
//
// 5. Catch handlers are checked in ORDER -- the FIRST match wins.  This is
//    why you must put more-derived types before their bases:
//      catch (const ConnectionError& e) { ... }   // derived -- check first
//      catch (const DatabaseError& e)   { ... }   // base   -- check second
//    If the base were listed first, the derived handler would never execute.
//
// 6. `catch (...)` matches ANY exception type.  Use it as a last resort
//    (e.g., to log and rethrow) because you lose all type information.
//
// 7. If no matching handler is found in ANY frame on the call stack,
//    std::terminate() is called and the program aborts.
// -----------------------------------------------

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
//
// HOW EXCEPTION MATCHING WORKS:
//    The runtime uses RTTI (the same system that powers dynamic_cast) to
//    compare the thrown exception's type against each catch parameter type.
//    The comparison is a linear search through the catch clauses attached
//    to the enclosing try block; the FIRST matching clause handles it.
//
//    Given the hierarchy below (ConnectionError -> DatabaseError -> runtime_error):
//
//    catch (const ConnectionError& e)
//      - ConnectionError thrown  -> MATCHES (exact)
//      - QueryError thrown       -> no (ConnectionError is not a base of QueryError)
//      - DatabaseError thrown    -> no (ConnectionError is more derived)
//
//    catch (const DatabaseError& e)
//      - ConnectionError thrown  -> MATCHES (ConnectionError IS-A DatabaseError)
//      - QueryError thrown       -> MATCHES (QueryError IS-A DatabaseError)
//      - std::runtime_error thrown -> no (runtime_error is the BASE of DatabaseError)
//
//    This is why ordering matters: if `catch (const DatabaseError&)` were
//    listed before `catch (const ConnectionError&)`, ConnectionError would
//    be caught by the DatabaseError handler and the ConnectionError-specific
//    handler would never execute.
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
//
// HOW NOEXCEPT AFFECTS CODE GENERATION:
//    1. When a function is marked noexcept, the compiler can SKIP generating
//       exception-handling tables (unwind tables / LSDA) for that function.
//       This reduces binary size and can speed up the normal (non-throwing)
//       path because the compiler knows unwinding will never happen here.
//
//    2. For move constructors this matters especially: std::vector checks
//       std::is_nothrow_move_constructible_v<T> at COMPILE TIME when it
//       needs to reallocate.  If true, it moves elements into the new
//       buffer.  If false, it COPIES them instead -- because a move that
//       throws partway through would leave the vector in a corrupted state
//       (some elements moved-from, some not, and the strong exception
//       guarantee would be violated).
//
//    3. If a noexcept function throws anyway, std::terminate() is called
//       IMMEDIATELY -- no stack unwinding occurs, no destructors run.
//       This is by design: the compiler already promised the caller that
//       no exception would escape, so cleanup code may not even exist.
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
//
// HOW EXCEPTION SAFETY LEVELS WORK:
//    C++ defines four levels of exception safety.  Every function you write
//    should provide at least the basic guarantee:
//
//    1. No-throw guarantee (strongest):
//       The operation NEVER throws.  Examples: destructors, swap(),
//       noexcept functions.  This is the only level safe for cleanup code.
//
//    2. Strong guarantee (rollback):
//       If the operation throws, the program state is UNCHANGED -- as if
//       the operation never started.  The classic technique is
//       copy-and-swap: do all work on a temporary copy, then swap (which
//       is no-throw) into the real object.
//
//    3. Basic guarantee (minimum acceptable):
//       If the operation throws, no resources leak and all objects remain
//       in a VALID but potentially MODIFIED state.  The caller cannot
//       assume the original values are preserved, but can safely destroy
//       or reassign the objects.
//
//    4. No guarantee (unacceptable):
//       An exception leaves objects in an INVALID state -- dangling
//       pointers, leaked memory, broken invariants.  Never acceptable
//       in C++ code.
//
//    The Transaction class below demonstrates the strong guarantee via
//    RAII: if do_work() throws, the Transaction destructor rolls back,
//    leaving the system as if the work never happened.
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
