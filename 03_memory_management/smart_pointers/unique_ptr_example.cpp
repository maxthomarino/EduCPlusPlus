/**
 * unique_ptr_example.cpp - Exclusive Ownership with std::unique_ptr
 *
 * Why:      Raw new/delete is unsafe: it is exception-unsafe, easy to leak,
 *           and easy to double-free.  std::unique_ptr provides automatic,
 *           deterministic cleanup with zero runtime overhead compared to a
 *           raw pointer.
 * When:     Use unique_ptr as the *default* smart pointer.  It has no
 *           reference-counting cost.  Only reach for shared_ptr when
 *           ownership is genuinely shared among multiple owners.
 * Standard: C++11 (replaced the deprecated auto_ptr).
 *           C++14 added std::make_unique for safe construction.
 * Prereqs:  See 03_memory_management/raii/ first -- unique_ptr is an RAII
 *           wrapper for heap-allocated objects.
 * Reference: reference/en/cpp/memory/unique_ptr
 */

#include <iostream>
#include <memory>
#include <format>

// -----------------------------------------------
// Helper class -- a resource that logs its lifetime
// -----------------------------------------------
class Resource {
    std::string name_;
public:
    explicit Resource(std::string name) : name_(std::move(name)) {
        std::cout << std::format("Resource '{}' acquired\n", name_);
    }
    ~Resource() {
        std::cout << std::format("Resource '{}' released\n", name_);
    }
    void use() const {
        std::cout << std::format("Using resource '{}'\n", name_);
    }
};

// -----------------------------------------------
// 1. Transferring ownership to a function
//
//    Watch out: unique_ptr cannot be copied -- use std::move() to
//    transfer ownership.  Attempting to copy is a compile error.
// -----------------------------------------------
void transfer_ownership(std::unique_ptr<Resource> res) {
    res->use();
    // res is automatically deleted when function exits
}

// -----------------------------------------------
// 2. Returning unique_ptr from a factory function
//
//    Watch out: never call .release() without assigning the result
//    -- it returns the raw pointer and relinquishes ownership,
//    causing a leak if the return value is not captured.
// -----------------------------------------------
std::unique_ptr<Resource> create_resource(const std::string& name) {
    // No std::move needed -- the compiler applies copy elision / implicit move
    return std::make_unique<Resource>(name);
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Always prefer std::make_unique<T>(...) over new T(...).
//    make_unique is exception-safe and clearly expresses intent.
// 2. unique_ptr is move-only: use std::move() to transfer ownership.
//    After the move, the source pointer is nullptr.
// 3. Pass unique_ptr by value to *transfer* ownership into a function;
//    pass by const reference (or raw pointer/reference) to merely *use*
//    the pointed-to object without taking ownership.
// 4. Returning unique_ptr from a factory function is natural and
//    efficient -- the compiler will move or elide the copy.
// 5. Never call .release() unless you immediately store the raw pointer
//    somewhere that will manage its lifetime (e.g., a C API).
// -----------------------------------------------

int main() {
    // Create with make_unique (preferred)
    auto res1 = std::make_unique<Resource>("Database");
    res1->use();

    // Transfer ownership (move, not copy)
    auto res2 = std::move(res1);
    // res1 is now nullptr!

    if (!res1) {
        std::cout << "res1 is now empty after move\n";
    }

    // Pass ownership to function
    transfer_ownership(std::move(res2));

    // Factory function returning unique_ptr
    auto res3 = create_resource("Network");
    res3->use();
    // res3 cleaned up automatically at end of scope

    std::cout << "Back in main - resources auto-cleaned!\n";
    return 0;
}
