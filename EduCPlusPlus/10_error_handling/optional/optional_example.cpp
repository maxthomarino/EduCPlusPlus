/**
 * optional_example.cpp - std::optional for Nullable Values
 *
 * WHY IT EXISTS:  Before std::optional, functions that might not produce a
 *                 result relied on sentinel values (-1, nullptr, empty string)
 *                 or output parameters.  These conventions are error-prone
 *                 because nothing in the type system enforces checking.
 *                 std::optional<T> makes "might not have a value" explicit in
 *                 the type, so the compiler and the reader both know that the
 *                 absence case must be handled.
 *
 * WHEN TO USE:    Any function that may legitimately have no result to return.
 *                 Prefer std::optional over returning magic values, throwing
 *                 on "not found", or using raw pointers for nullable semantics.
 *
 * STANDARD:       C++17  (header <optional>)
 * PREREQUISITES:  Value semantics, move semantics, std::nullopt
 * REFERENCE:      reference/en/cpp/utility/optional
 * SEE ALSO:       std::expected (C++23) -- like optional but carries an error
 *                 value in the "empty" case.
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: How does std::optional differ from a raw pointer for representing
//    "might not have a value"?
// A: A raw pointer can be null, but it does not own the object it points to
//    and offers no type-level distinction between "nullable" and "always
//    valid."  std::optional owns its value (stored inline, no heap), has
//    value semantics (copyable, movable), and makes the "might be empty"
//    contract explicit in the type signature.
//
// Q: Does std::optional allocate on the heap?
// A: No.  The contained value is stored inside the optional object itself
//    using an internal aligned buffer.  sizeof(optional<T>) is roughly
//    sizeof(T) + sizeof(bool), padded for alignment.  Construction of an
//    empty optional is essentially free.
//
// Q: Why does the standard not allow std::optional<T&>?
// A: References in C++ are not rebindable -- once bound, they always refer
//    to the same object.  An optional reference would need to be
//    "re-seated" on assignment, which contradicts reference semantics.  The
//    committee chose to disallow it rather than introduce confusing
//    behavior.  Use a raw pointer or std::reference_wrapper<T> instead.
//
// Q: When should I use value() versus value_or()?
// A: Use value() when the absence of a value is a logic error that should
//    throw std::bad_optional_access.  Use value_or(default) when you have
//    a sensible fallback and want to avoid branching.  For performance-
//    sensitive paths, check has_value() and dereference with operator* to
//    avoid the exception machinery of value().
//
// =====================================================

// -----------------------------------------------
// HOW OPTIONAL STORES ITS VALUE:
//
// std::optional<T> is laid out roughly as:
//
//    struct optional<T> {
//        bool has_value_;                      // engagement flag
//        aligned_storage_for<T> storage_;      // raw bytes, sizeof(T)
//    };
//
// - When EMPTY: has_value_ is false, storage_ is uninitialized raw bytes.
//   No constructor of T runs -- this is why optional<T> is cheap to
//   default-construct even if T is expensive.
//
// - When ENGAGED: has_value_ is true, and a T object has been constructed
//   in-place inside storage_ (using placement new).
//
// - sizeof(optional<T>) is approximately sizeof(T) + sizeof(bool), rounded
//   up for alignment.  For example, optional<int> is typically 8 bytes
//   (4 for int + 1 for bool + 3 padding).
//
// - NO HEAP ALLOCATION ever occurs -- the value lives entirely inside the
//   optional object itself, on the stack or wherever the optional resides.
//
// - Assignment or emplace() uses placement new to construct T in the
//   internal buffer.  If a T was already engaged, its destructor is called
//   first before constructing the new value.
//
// - reset() or ~optional() calls T's destructor if engaged, then sets the
//   flag to false.  If already empty, it is a no-op.
// -----------------------------------------------

#include <iostream>
#include <format>
#include <optional>
#include <string>
#include <vector>
#include <map>

// -----------------------------------------------
// Function that might not find a result
//
// Watch out: accessing an empty optional via
// operator* or operator-> is undefined behavior.
// Always check has_value() or use value_or().
//
// HOW OPTIONAL RETURN WORKS:
//    - `return static_cast<int>(i)` implicitly constructs an
//      optional<int> containing the value.  This works because
//      optional<T> has a non-explicit constructor that accepts T
//      (or anything convertible to T), so the compiler inserts an
//      implicit conversion:  return optional<int>(static_cast<int>(i));
//
//    - `return std::nullopt` constructs an empty optional.  nullopt_t
//      is a special tag type whose sole purpose is to signal "no value".
//      optional<T> has a constructor that accepts nullopt_t.
//
//    - At the call site, the caller's `optional<int> idx` is constructed
//      directly from the return value.  Thanks to copy elision (guaranteed
//      since C++17), no extra copy or move occurs -- the returned optional
//      is constructed directly in the caller's storage.
// -----------------------------------------------
std::optional<int> find_index(const std::vector<int>& vec, int target) {
    for (size_t i = 0; i < vec.size(); ++i) {
        if (vec[i] == target) {
            return static_cast<int>(i);  // Found!
        }
    }
    return std::nullopt;  // Not found
}

// Optional with complex type
struct User {
    std::string name;
    int age;
};

std::optional<User> find_user(const std::map<int, User>& db, int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}

// Optional for lazy initialization
class Config {
    mutable std::optional<std::string> cached_value_;

public:
    const std::string& get_value() const {
        if (!cached_value_) {
            // Expensive computation, done only once
            cached_value_ = "computed_value";
            std::cout << "(computing...)\n";
        }
        return *cached_value_;
    }
};

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. std::optional<T> replaces sentinel values and nullable pointers with
//    a type-safe wrapper that forces callers to consider the empty case.
// 2. Check before access: use has_value(), operator bool, or value_or()
//    -- dereferencing an empty optional is undefined behavior.
// 3. value_or(default) is the safest and most concise access pattern when
//    a sensible default exists.
// 4. std::optional works well for lazy initialization (compute-on-first-use)
//    and caching patterns.
// 5. For functions that fail with an error reason, consider std::expected<T,E>
//    (C++23) which carries either a value or an error object.
// -----------------------------------------------

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};

    // Check if optional has value
    if (auto idx = find_index(numbers, 30); idx.has_value()) {
        std::cout << std::format("Found 30 at index {}\n", *idx);
    }

    // value_or() for default
    auto idx = find_index(numbers, 99);
    std::cout << std::format("Index of 99: {}\n", idx.value_or(-1));

    // Boolean context
    if (auto found = find_index(numbers, 20)) {
        std::cout << std::format("20 is at index {}\n", *found);
    } else {
        std::cout << "20 not found\n";
    }

    // With complex types
    std::map<int, User> users = {
        {1, {"Alice", 30}},
        {2, {"Bob", 25}}
    };

    if (auto user = find_user(users, 1)) {
        std::cout << std::format("Found: {} (age {})\n",
                                 user->name, user->age);
    }

    if (auto user = find_user(users, 99)) {
        std::cout << "Found user 99\n";
    } else {
        std::cout << "User 99 not found\n";
    }

    // Transforming optionals (C++23 has monadic ops, but we can do:)
    //
    // HOW C++23 MONADIC OPERATIONS WORK:
    //    C++23 adds three member functions that let you chain optional
    //    operations without nested if-checks:
    //
    //    and_then(f):  if engaged, calls f(value) which must return
    //                  optional<U>.  If empty, returns empty optional<U>.
    //                  Use when f itself might fail (returns optional).
    //
    //    transform(f): if engaged, calls f(value) and WRAPS the result
    //                  in optional<U>.  If empty, returns empty optional<U>.
    //                  Use when f always succeeds (returns plain U).
    //
    //    or_else(f):   if EMPTY, calls f() which must return optional<T>.
    //                  If engaged, returns *this unchanged.
    //                  Use to provide a fallback computation.
    //
    //    Example (C++23):
    //      find_index(numbers, 30)
    //          .transform([](int i) { return i * 2; })   // double the index
    //          .or_else([] { return std::optional<int>{0}; }); // default to 0
    //
    //    The lambda below is the pre-C++23 equivalent of .transform():
    auto double_if_found = [&](int target) -> std::optional<int> {
        if (auto idx = find_index(numbers, target)) {
            return *idx * 2;
        }
        return std::nullopt;
    };

    std::cout << std::format("Double index of 30: {}\n",
                             double_if_found(30).value_or(-1));

    // Lazy initialization
    Config config;
    std::cout << "First call: " << config.get_value() << '\n';
    std::cout << "Second call: " << config.get_value() << '\n';

    // Creating optional in-place
    std::optional<std::vector<int>> opt_vec;
    opt_vec.emplace(5, 42);  // Creates vector of 5 42s in-place
    std::cout << std::format("Vector size: {}\n", opt_vec->size());

    return 0;
}
