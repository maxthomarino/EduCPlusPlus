/**
 * shared_ptr_example.cpp - Shared Ownership with std::shared_ptr
 *
 * Why:      Some resources have shared ownership where no single owner can
 *           determine when to delete.  shared_ptr uses reference counting
 *           to free the resource when the last owner is destroyed.
 * When:     Use shared_ptr only when ownership is genuinely shared among
 *           multiple owners.  Prefer unique_ptr when a single owner
 *           suffices -- it has zero overhead and clearer semantics.
 * Standard: C++11.  C++20 added std::atomic<std::shared_ptr<T>> for
 *           lock-free concurrent access to shared_ptr itself.
 * Prereqs:  See unique_ptr_example.cpp first -- unique_ptr is simpler and
 *           should be your default smart pointer.
 * Reference: reference/en/cpp/memory/shared_ptr
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: Is shared_ptr thread-safe?
// A: The reference count operations (increment/decrement) are atomic, so it is safe
//    for multiple threads to copy, destroy, or reset different shared_ptr instances
//    that point to the same object. However, the managed object itself is NOT
//    protected -- if two threads call non-const methods on the pointed-to object
//    simultaneously, you still need a mutex. Also, concurrent reads and writes to the
//    same shared_ptr variable (not copies, the exact same variable) are a data race.
//    C++20 introduced std::atomic<std::shared_ptr<T>> for that case.
//
// Q: How does shared_ptr performance compare to unique_ptr?
// A: shared_ptr is more expensive in three ways: (1) it heap-allocates a control
//    block (unless you use make_shared, which merges it with the object), (2) every
//    copy or destruction performs an atomic increment/decrement on the reference
//    count, which involves memory barriers and cache-line synchronisation, and
//    (3) sizeof(shared_ptr) is 2 pointers vs 1 for unique_ptr with default deleter.
//    In tight loops or high-frequency copy paths, this overhead can be measurable.
//    Always prefer unique_ptr unless you genuinely need shared ownership.
//
// Q: Can shared_ptr manage arrays?
// A: Yes. Since C++17, shared_ptr<T[]> is supported and will call delete[] instead
//    of delete. You can also use std::make_shared<T[]>(n) since C++20 to allocate
//    an array of n elements. Before C++17, you had to provide a custom deleter like
//    shared_ptr<T>(new T[n], std::default_delete<T[]>()). However, in most cases
//    you should prefer std::vector<T> over a shared_ptr to an array.
//
// Q: What is enable_shared_from_this and when do I need it?
// A: If an object managed by shared_ptr needs to hand out a shared_ptr to itself
//    (e.g., registering a callback), it cannot simply do shared_ptr<T>(this) --
//    that would create a second control block and cause double-delete. Instead,
//    the class inherits from std::enable_shared_from_this<T>, which stores a
//    weak_ptr internally. Calling shared_from_this() returns a shared_ptr that
//    shares the existing control block. The object MUST already be owned by a
//    shared_ptr before shared_from_this() is called, or the behaviour is undefined
//    (C++17 throws std::bad_weak_ptr).
//
// Q: When should I pass shared_ptr by value vs by reference?
// A: Pass shared_ptr by value only when the callee needs to share ownership (i.e.,
//    it will store a copy). Passing by value increments the reference count, which
//    has an atomic operation cost. If the function just needs to use the object
//    without taking ownership, pass by const reference to shared_ptr, or better yet,
//    pass a raw pointer or reference to the underlying object (via .get() or *ptr).
//    This decouples the function from the ownership mechanism entirely.
//
// =====================================================

#include <iostream>
#include <memory>
#include <format>
#include <vector>

// -----------------------------------------------
// Helper class -- a document that logs its lifetime
// -----------------------------------------------
class Document {
    std::string title_;
public:
    explicit Document(std::string title) : title_(std::move(title)) {
        std::cout << std::format("Document '{}' created\n", title_);
    }
    ~Document() {
        std::cout << std::format("Document '{}' destroyed\n", title_);
    }
    void print() const {
        std::cout << std::format("Document: {}\n", title_);
    }
    const std::string& title() const { return title_; }
};

// -----------------------------------------------
// HOW IT WORKS: HOW SHARED_PTR WORKS INTERNALLY
// -----------------------------------------------
// shared_ptr maintains a *control block* -- a separate heap-allocated
// structure that contains:
//   (a) Strong reference count -- how many shared_ptrs point to the object.
//   (b) Weak reference count   -- how many weak_ptrs observe the object.
//   (c) The deleter function   -- (or default delete) used to destroy the
//       managed object when the strong count reaches 0.
//   (d) The allocator          -- (if specified) used to deallocate memory.
//
// When you copy a shared_ptr, the strong count is atomically incremented.
// Atomic operations are thread-safe, but they do have a cost compared to
// plain integer operations (they involve memory barriers / cache-line
// synchronisation).
//
// When a shared_ptr is destroyed (or reset), the strong count is
// atomically decremented.  When the strong count reaches 0, the managed
// object is destroyed (its destructor runs and its memory may be freed).
//
// The control block itself is destroyed only when BOTH the strong AND
// weak counts reach 0.  This is because weak_ptrs still need the control
// block to check whether the object is alive (via lock() / expired()).
//
// sizeof(shared_ptr<T>) == 2 * sizeof(T*).  It stores two pointers:
// one to the managed object, and one to the control block.
// -----------------------------------------------

// -----------------------------------------------
// 1. Basic shared ownership and reference counting
//
//    Watch out: creating two separate shared_ptrs from the same raw
//    pointer causes double-delete undefined behaviour.  Always use
//    make_shared or copy an existing shared_ptr:
//        auto p = new Widget;
//        std::shared_ptr<Widget> a(p);
//        std::shared_ptr<Widget> b(p);  // BUG: double-delete
// -----------------------------------------------
// -----------------------------------------------
// HOW IT WORKS: HOW MAKE_SHARED OPTIMIZES ALLOCATION
// -----------------------------------------------
// std::make_shared<T>(args...) performs ONE heap allocation for both the
// managed object and the control block.  They are placed in contiguous
// memory (the control block is typically placed right before or after
// the object).
//
// By contrast, shared_ptr<T>(new T(args...)) performs TWO separate heap
// allocations: one for the T object (via new), and one for the control
// block (inside the shared_ptr constructor).
//
// Single allocation advantages:
//   - Better cache locality (object + metadata sit next to each other).
//   - Less allocator overhead (one header instead of two).
//   - Fewer points of failure (one allocation to succeed, not two).
//
// Watch out: with make_shared, the object's memory cannot be freed until
// the LAST weak_ptr is also destroyed, because the object and control
// block share the same allocation -- you cannot free half of it.  With
// separate allocations (shared_ptr<T>(new T)), the object's memory CAN
// be freed as soon as the strong count reaches 0, while the control
// block persists until the weak count also reaches 0.  This matters if
// T is large and weak_ptrs are long-lived.
// -----------------------------------------------
void demonstrate_shared_ownership() {
    std::cout << "--- Shared Ownership ---\n";

    std::shared_ptr<Document> doc1;

    {
        // Create shared document
        auto doc2 = std::make_shared<Document>("Report");
        std::cout << std::format("Reference count: {}\n", doc2.use_count());

        // Share ownership
        doc1 = doc2;
        std::cout << std::format("Reference count: {}\n", doc2.use_count());

        // Store in container (another owner)
        std::vector<std::shared_ptr<Document>> docs;
        docs.push_back(doc2);
        std::cout << std::format("Reference count: {}\n", doc2.use_count());

        // doc2 and vector go out of scope here
    }

    std::cout << std::format("After scope - count: {}\n", doc1.use_count());
    doc1->print();  // Still valid!

    doc1.reset();   // Explicitly release
    std::cout << "Document now destroyed\n";
}

// -----------------------------------------------
// 2. Circular references and std::weak_ptr
//    What: Using weak_ptr to break circular shared_ptr reference cycles that cause memory leaks.
//    When: Whenever two objects hold shared_ptrs to each other (parent-child, observer-subject, graph edges).
//    Why: Circular shared_ptr references prevent the reference count from ever reaching zero, leaking both objects.
//    Use: Make the "back-pointer" side of the relationship a weak_ptr; call lock() to obtain a temporary shared_ptr when access is needed.
//    Which: C++11 (weak_ptr was introduced alongside shared_ptr)
//
//    Watch out: circular references between shared_ptrs cause memory
//    leaks -- the reference count never reaches zero.  Use std::weak_ptr
//    to break cycles.  A weak_ptr observes the resource without
//    contributing to the reference count.
// -----------------------------------------------
// -----------------------------------------------
// HOW IT WORKS: HOW WEAK_PTR AND LOCK() WORK
// -----------------------------------------------
// weak_ptr stores the same two pointers as shared_ptr (one to the
// managed object, one to the control block), but it does NOT increment
// the strong reference count.  Instead, it increments the weak count.
//
// lock() performs an atomic check-and-increment:
//   1. Atomically read the strong count.
//   2. If strong count > 0, atomically increment it and return a new
//      shared_ptr that shares ownership.
//   3. If strong count == 0, the object is already destroyed -- return
//      an empty shared_ptr (nullptr).
// This entire check-and-increment is a single atomic compare-and-swap,
// so it is thread-safe.
//
// expired() checks whether the strong count is 0.  However, do NOT
// use expired() as a guard before lock().  Between the call to expired()
// and the call to lock(), another thread could destroy the last
// shared_ptr, causing a TOCTOU (time-of-check-to-time-of-use) race.
// Always call lock() directly and check the returned shared_ptr:
//     if (auto sp = weak.lock()) { /* use sp */ }
// -----------------------------------------------

// -- BAD: circular reference (would leak if both used shared_ptr) --
// We demonstrate the fix directly: one direction uses weak_ptr.

struct Employee;  // forward declaration

struct Team {
    std::string name;
    std::vector<std::shared_ptr<Employee>> members;  // Team owns Employees

    explicit Team(std::string n) : name(std::move(n)) {
        std::cout << std::format("Team '{}' created\n", name);
    }
    ~Team() {
        std::cout << std::format("Team '{}' destroyed\n", name);
    }
};

struct Employee {
    std::string name;
    std::weak_ptr<Team> team;  // weak_ptr breaks the cycle!

    explicit Employee(std::string n) : name(std::move(n)) {
        std::cout << std::format("Employee '{}' created\n", name);
    }
    ~Employee() {
        std::cout << std::format("Employee '{}' destroyed\n", name);
    }

    void show_team() const {
        // weak_ptr must be locked (promoted to shared_ptr) before use
        if (auto t = team.lock()) {
            std::cout << std::format("{} belongs to team '{}'\n",
                                    name, t->name);
        } else {
            std::cout << std::format("{}'s team has been disbanded\n", name);
        }
    }
};

void demonstrate_weak_ptr() {
    std::cout << "\n--- weak_ptr breaks circular references ---\n";
    {
        auto team = std::make_shared<Team>("Engineering");
        auto alice = std::make_shared<Employee>("Alice");
        auto bob   = std::make_shared<Employee>("Bob");

        // Team -> Employees (shared_ptr)
        team->members.push_back(alice);
        team->members.push_back(bob);

        // Employees -> Team (weak_ptr -- does NOT increase ref count)
        alice->team = team;
        bob->team   = team;

        std::cout << std::format("Team ref count: {}\n", team.use_count());
        // Count is 1 (only the local `team` variable), because
        // weak_ptrs do not contribute to the count.

        alice->show_team();
        bob->show_team();

        // Everything is destroyed cleanly when the scope ends.
    }
    std::cout << "All resources freed -- no leaks!\n";
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Use std::make_shared<T>(...) to create shared_ptrs -- it is
//    exception-safe and performs a single allocation for the object
//    and control block together.
// 2. Prefer unique_ptr by default; only use shared_ptr when you truly
//    need multiple owners for the same resource.
// 3. Circular shared_ptr references cause leaks.  Break cycles with
//    std::weak_ptr on the "back-pointer" side of the relationship.
// 4. To use a weak_ptr, call .lock() to obtain a temporary shared_ptr.
//    Always check the result -- the resource may already be gone.
// 5. Never construct two independent shared_ptrs from the same raw
//    pointer.  This leads to double-delete undefined behaviour.
// -----------------------------------------------

int main() {
    // 1. Basic shared ownership
    demonstrate_shared_ownership();

    // 2. weak_ptr and circular reference prevention
    demonstrate_weak_ptr();

    return 0;
}
