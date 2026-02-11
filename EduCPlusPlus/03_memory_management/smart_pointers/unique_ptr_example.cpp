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
#include <cstdio>

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
// HOW IT WORKS: HOW UNIQUE_PTR WORKS INTERNALLY
// -----------------------------------------------
// unique_ptr is essentially a thin wrapper around a raw pointer.
// sizeof(unique_ptr<T>) == sizeof(T*) when using the default deleter.
// The compiler can optimise unique_ptr usage to generate code identical to
// raw pointer usage -- this means zero overhead in practice.
//
// Exclusive ownership is enforced at compile time: unique_ptr's copy
// constructor and copy assignment operator are explicitly = delete'd.
// Any attempt to copy a unique_ptr is a hard compile error, not a runtime
// check.
//
// Move operations simply swap the internal pointer: the source unique_ptr
// is set to nullptr, and the destination receives the pointer.  There is
// no heap allocation, no reference counting, and the operation is O(1).
//
// The destructor calls delete (or delete[] for unique_ptr<T[]>) on the
// stored pointer if it is not nullptr.  This is the RAII guarantee:
// the resource is freed exactly once, exactly when the unique_ptr goes
// out of scope or is reset.
//
// Custom deleters: unique_ptr<T, Deleter> lets you specify HOW to clean
// up.  For example, you can use fclose for FILE*, or a custom free
// function for C APIs.  Watch out: a stateful deleter (one that stores
// data) increases sizeof(unique_ptr) beyond sizeof(T*), because the
// deleter is stored inside the unique_ptr object itself (via empty-base
// optimisation for stateless deleters like function pointers).
// -----------------------------------------------

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
// -----------------------------------------------
// HOW IT WORKS: HOW MAKE_UNIQUE IS EXCEPTION-SAFE
// -----------------------------------------------
// Consider this call:
//   f(std::unique_ptr<A>(new A), std::unique_ptr<B>(new B));
//
// Before C++17, the compiler was allowed to evaluate sub-expressions in
// any order.  A possible sequence:
//   1. new A            -- allocate A on the heap
//   2. new B            -- allocate B on the heap
//   3. construct unique_ptr<A> from the raw A*
//   4. construct unique_ptr<B> from the raw B*
//
// If step 2 (new B) throws an exception, the memory from step 1 (new A)
// leaks -- no unique_ptr was constructed yet to own it!
//
// std::make_unique<A>() bundles the heap allocation and the unique_ptr
// construction into a single function call.  Because function arguments
// are fully evaluated before the next argument begins, there is no
// window where a raw pointer exists without an owning unique_ptr.
//
// C++17 tightened the evaluation rules so that each function argument
// is fully evaluated before the next one starts, which eliminates the
// interleaving problem.  Even so, make_unique is still preferred for
// clarity: it expresses intent, avoids mentioning new at all, and is
// one fewer place to get the type wrong.
// -----------------------------------------------
std::unique_ptr<Resource> create_resource(const std::string& name) {
    // No std::move needed -- the compiler applies copy elision / implicit move
    return std::make_unique<Resource>(name);
}

// -----------------------------------------------
// 3. Custom deleter example
//    What: Here we wrap a C-style FILE* so that fclose is called automatically when the unique_ptr goes out of scope.
//    When: Here we wrap a C-style FILE* so that fclose is called automatically when the unique_ptr goes out of scope.
//    Why: It improves clarity and helps prevent common correctness mistakes.
//    Use: Follow the code pattern shown in this section and adapt it to your types.
//    Which: C++11+ (file discusses C++14, C++17)
//
//    unique_ptr can manage any resource -- not just heap objects -- by
//    providing a custom deleter.  Here we wrap a C-style FILE* so that
//    fclose is called automatically when the unique_ptr goes out of scope.
// -----------------------------------------------
void demonstrate_custom_deleter() {
    std::cout << "\n--- Custom deleter (FILE*) ---\n";

    // Lambda deleter: closes the file and logs
    auto file_deleter = [](FILE* fp) {
        if (fp) {
            std::cout << std::format("Custom deleter: closing FILE*\n");
            std::fclose(fp);
        }
    };

    // unique_ptr<FILE, decltype(lambda)> -- the deleter type is part of
    // the unique_ptr type.  Because the lambda is stateless (captures
    // nothing), the empty-base optimisation keeps sizeof == sizeof(FILE*).
    {
        auto file = std::unique_ptr<FILE, decltype(file_deleter)>(
            std::fopen("unique_ptr_demo.txt", "w"), file_deleter);

        if (file) {
            std::fputs("Hello from unique_ptr with custom deleter!\n", file.get());
            std::cout << std::format("Wrote to file via unique_ptr<FILE*>\n");
        }
        // file goes out of scope here -> file_deleter is called -> fclose
    }
    std::cout << "File automatically closed by custom deleter\n";
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

    // Custom deleter demonstration
    demonstrate_custom_deleter();

    std::cout << "Back in main - resources auto-cleaned!\n";
    return 0;
}
