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
// 1. Basic shared ownership and reference counting
//
//    Watch out: creating two separate shared_ptrs from the same raw
//    pointer causes double-delete undefined behaviour.  Always use
//    make_shared or copy an existing shared_ptr:
//        auto p = new Widget;
//        std::shared_ptr<Widget> a(p);
//        std::shared_ptr<Widget> b(p);  // BUG: double-delete
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
//
//    Watch out: circular references between shared_ptrs cause memory
//    leaks -- the reference count never reaches zero.  Use std::weak_ptr
//    to break cycles.  A weak_ptr observes the resource without
//    contributing to the reference count.
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
