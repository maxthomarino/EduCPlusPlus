/**
 * copy_and_move_constructors.cpp - Copy/Move Semantics and the Rule of Five
 *
 * When you write "MyClass b = a;" or "MyClass b = std::move(a);", the compiler
 * needs to know HOW to create 'b' from 'a'. Copy and move constructors define
 * that "how." Without them, the compiler generates member-wise copies/moves —
 * which is wrong for any class that manages raw resources (pointers, handles).
 *
 * HOW THE COMPILER CHOOSES COPY VS MOVE:
 *   - If the source is an lvalue (has a name, persists), the copy constructor
 *     is called. The source survives the operation unchanged.
 *   - If the source is an rvalue (temporary, or after std::move), the move
 *     constructor is called. The source is left in a valid but unspecified
 *     state — you can destroy it or assign to it, but don't read it.
 *   - The compiler prefers move over copy when both are available and the
 *     source is an rvalue.
 *
 * Standard: Copy ctors since C++98. Move ctors since C++11. Copy elision
 *   guaranteed since C++17 (prvalues). NRVO is permitted but not guaranteed.
 * Prerequisites: See constructor_fundamentals.cpp first.
 *                See 08_modern_features/move_semantics/ for std::move details.
 * Reference: reference/en/cpp/language/copy_constructor.html
 *            reference/en/cpp/language/move_constructor.html
 *            reference/en/cpp/language/copy_elision.html
 */

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <utility>
#include <cstring>
#include <memory>
#include <algorithm>

// -----------------------------------------------
// 1. The problem: shallow copy of raw pointers
//
//    HOW THE DEFAULT COPY CONSTRUCTOR WORKS:
//    The compiler-generated copy constructor copies each member by value.
//    For a pointer member, that copies the ADDRESS — not the pointed-to
//    data. Now two objects point to the same memory. When the first one
//    is destroyed, it deletes the memory. The second object now has a
//    dangling pointer → use-after-free → crash or silent corruption.
//
//    This is WHY you need a custom copy constructor for classes that
//    own raw resources.
//
//    Watch out: the default copy constructor is generated even for
//    classes with pointer members. The compiler cannot know whether
//    the pointer means "owns this memory" or "observes this memory."
//    You must decide and implement accordingly.
// -----------------------------------------------

// This class deliberately uses a raw pointer to teach the concept.
// In real code, use std::vector<char> or std::string instead.
class StringBuffer {
    char* data_;
    std::size_t size_;
    std::string label_;

    void log(const char* action) const {
        std::cout << std::format("  [{}] {} ({} bytes at {})\n",
                                  label_, action, size_,
                                  static_cast<const void*>(data_));
    }

public:
    // -----------------------------------------------
    // 2. Constructor — allocates and owns the resource
    // -----------------------------------------------
    StringBuffer(std::string label, const char* text)
        : data_(nullptr),
          size_(std::strlen(text) + 1),
          label_(std::move(label))
    {
        data_ = new char[size_];
        std::memcpy(data_, text, size_);
        log("CONSTRUCTED");
    }

    // -----------------------------------------------
    // 3. Destructor — releases the resource
    //
    //    HOW IT WORKS:
    //    Called automatically when the object goes out of scope (stack),
    //    when delete is called (heap), or during stack unwinding (exception).
    //    The destructor runs the body first, then destroys members in
    //    reverse declaration order, then destroys base classes.
    //
    //    Watch out: if you define a destructor, the compiler will still
    //    generate copy/move operations, but this is DEPRECATED behavior.
    //    If you need a destructor, define all five special members.
    // -----------------------------------------------
    ~StringBuffer() {
        if (data_) {
            log("DESTROYED");
            delete[] data_;
        }
    }

    // -----------------------------------------------
    // 4. Copy constructor — deep copy
    //
    //    HOW IT WORKS:
    //    Allocates NEW memory and copies the contents byte-by-byte.
    //    After the copy, the two objects are fully independent — modifying
    //    one does not affect the other.
    //
    //    WHEN IT IS CALLED:
    //    - MyClass b = a;           (copy initialization)
    //    - MyClass b(a);            (direct initialization)
    //    - f(MyClass param)         (pass by value)
    //    - return local_object;     (if copy elision doesn't apply)
    //
    //    Watch out: the copy constructor takes its argument by
    //    CONST REFERENCE (const MyClass&), not by value. If it took
    //    by value, calling it would require... calling the copy constructor
    //    → infinite recursion. The compiler rejects this.
    // -----------------------------------------------
    StringBuffer(const StringBuffer& other)
        : data_(new char[other.size_]),
          size_(other.size_),
          label_(other.label_ + " (COPY)")
    {
        std::memcpy(data_, other.data_, size_);
        log("COPY-CONSTRUCTED");
    }

    // -----------------------------------------------
    // 5. Copy assignment operator — copy-and-swap idiom
    //
    //    HOW COPY-AND-SWAP WORKS:
    //    (a) The parameter is taken BY VALUE, triggering the copy constructor.
    //    (b) We swap our internals with the parameter's copy.
    //    (c) The parameter (now holding our old data) is destroyed at scope end.
    //
    //    WHY THIS IS ELEGANT:
    //    - Automatically handles self-assignment (swapping with yourself is safe).
    //    - Exception-safe: if the copy (step a) throws, our object is untouched.
    //    - Reuses the copy constructor logic — no code duplication.
    //
    //    Watch out: taking the parameter by value means this function serves
    //    as BOTH copy-assignment and move-assignment (if the caller passes an
    //    rvalue, the parameter is move-constructed instead of copy-constructed).
    // -----------------------------------------------
    StringBuffer& operator=(StringBuffer other) {
        std::swap(data_, other.data_);
        std::swap(size_, other.size_);
        std::swap(label_, other.label_);
        log("ASSIGNED (via swap)");
        return *this;
    }

    // -----------------------------------------------
    // 6. Move constructor — steal resources
    //
    //    HOW IT WORKS:
    //    Instead of allocating new memory, the move constructor STEALS the
    //    pointer from the source object. This is O(1) regardless of data
    //    size. The source is left in a valid-but-empty state (nullptr, size 0)
    //    so its destructor won't double-free.
    //
    //    WHEN IT IS CALLED:
    //    - MyClass b = std::move(a);    (explicit move)
    //    - MyClass b = make_buffer();   (temporary / prvalue)
    //    - return local_object;         (implicit move from local on return)
    //
    //    WHY NOEXCEPT:
    //    Containers like std::vector will only use your move constructor
    //    during reallocation if it is marked noexcept. Otherwise they fall
    //    back to copying (which is safe but slow) because a throwing move
    //    would leave the container in an unrecoverable state.
    //
    //    Watch out: if your move constructor is NOT noexcept, std::vector
    //    will COPY your objects during push_back reallocation — silently
    //    destroying your performance advantage.
    // -----------------------------------------------
    StringBuffer(StringBuffer&& other) noexcept
        : data_(other.data_),
          size_(other.size_),
          label_(std::move(other.label_) + " (MOVED)")
    {
        // Leave the source in a valid empty state
        other.data_ = nullptr;
        other.size_ = 0;
        log("MOVE-CONSTRUCTED");
    }

    // Note: we don't define a separate move-assignment operator because
    // the copy-assignment (by-value parameter) already handles moves.
    // When called with an rvalue, the parameter is move-constructed.

    // -----------------------------------------------
    // Accessors
    // -----------------------------------------------
    const char* data() const { return data_ ? data_ : "(empty)"; }
    std::size_t size() const { return size_; }
    const std::string& label() const { return label_; }
};

// -----------------------------------------------
// 7. Copy elision — the compiler skips the copy entirely
//
//    HOW IT WORKS:
//    When a function returns a local object by value, the compiler
//    can construct the return value directly in the caller's memory,
//    eliminating the copy/move entirely. This is not an optimization
//    you request — the compiler does it automatically.
//
//    TWO FORMS:
//    (a) RVO (Return Value Optimization): returning a prvalue
//        (e.g., return StringBuffer{"x", "hello"};)
//        GUARANTEED since C++17 — the copy/move ctor is never called.
//
//    (b) NRVO (Named RVO): returning a named local variable
//        (e.g., StringBuffer buf{...}; return buf;)
//        PERMITTED but NOT GUARANTEED. All major compilers do it in
//        optimized builds, but you must still have an accessible
//        copy or move constructor.
//
//    Watch out: DO NOT write "return std::move(local);" — this
//    PREVENTS NRVO because std::move changes the expression from
//    a name (eligible for NRVO) to an rvalue reference (not eligible).
//    The compiler already implicitly moves from locals on return.
// -----------------------------------------------
StringBuffer make_buffer(const char* text) {
    StringBuffer buf{"factory", text};
    // DO NOT write: return std::move(buf);  ← inhibits NRVO!
    return buf;  // NRVO: likely constructed directly in caller's memory
}

// -----------------------------------------------
// 8. Rule of Zero / Three / Five
//
//    HOW TO DECIDE:
//
//    RULE OF ZERO (preferred):
//    If your class only holds members that manage themselves (std::string,
//    std::vector, std::unique_ptr), write NONE of the five special members.
//    The compiler-generated ones do the right thing.
//
//    RULE OF THREE (pre-C++11):
//    If you define a destructor, copy constructor, OR copy assignment,
//    define ALL THREE. They are logically coupled — if you need custom
//    destruction, you almost certainly need custom copying.
//
//    RULE OF FIVE (C++11+):
//    If you define any of the five (destructor, copy ctor, copy assign,
//    move ctor, move assign), define ALL FIVE. Defining a destructor
//    suppresses move generation, so you'd lose move semantics silently.
//
//    Watch out: declaring a destructor (even = default) suppresses the
//    implicit move constructor and move assignment operator. Your class
//    will silently fall back to copying everywhere.
// -----------------------------------------------

// RULE OF ZERO — let the members handle everything
class Person {
    std::string name_;                     // self-managing
    std::vector<std::string> hobbies_;     // self-managing
    std::unique_ptr<int> lucky_number_;    // self-managing (move-only)

public:
    Person(std::string name, std::vector<std::string> hobbies, int lucky)
        : name_(std::move(name)),
          hobbies_(std::move(hobbies)),
          lucky_number_(std::make_unique<int>(lucky)) {}

    // No destructor, no copy ctor, no move ctor, no assignments.
    // The compiler generates correct move operations automatically.
    // Copy is implicitly deleted because unique_ptr is not copyable.

    void print() const {
        std::cout << std::format("  Person: {} (lucky: {})\n",
                                  name_, *lucky_number_);
    }
};

// =========================================
// Key Takeaways:
//   1. If your class owns raw resources, implement all five special members
//      (destructor + copy ctor + copy assign + move ctor + move assign).
//   2. Mark move operations noexcept — otherwise std::vector copies instead
//      of moving during reallocation, silently killing performance.
//   3. Never write "return std::move(x);" for local variables — it inhibits
//      copy elision (NRVO). The compiler already moves from locals.
//   4. The copy-and-swap idiom gives you exception-safe, self-assignment-safe
//      copy assignment with zero code duplication.
//   5. Prefer Rule of Zero: use std::string, std::vector, std::unique_ptr
//      instead of raw resources, and let the compiler generate everything.
// =========================================

int main() {
    // ---- Deep copy vs shallow copy ----
    std::cout << "--- Copy Constructor (Deep Copy) ---\n";
    StringBuffer original{"orig", "Hello, World!"};
    StringBuffer copied = original;  // copy ctor → new allocation
    std::cout << std::format("  original: '{}'\n", original.data());
    std::cout << std::format("  copied:   '{}'\n", copied.data());
    // Both exist independently — different memory addresses

    // ---- Move constructor ----
    std::cout << "\n--- Move Constructor (Steal Resources) ---\n";
    StringBuffer moved = std::move(original);  // O(1) pointer steal
    std::cout << std::format("  moved:    '{}'\n", moved.data());
    std::cout << std::format("  original: '{}' (valid but empty)\n", original.data());

    // ---- Copy assignment (copy-and-swap) ----
    std::cout << "\n--- Copy Assignment ---\n";
    StringBuffer target{"target", "old data"};
    target = copied;  // copy-and-swap: copies 'copied', swaps with 'target', destroys old
    std::cout << std::format("  target after assignment: '{}'\n", target.data());

    // ---- Move assignment ----
    std::cout << "\n--- Move Assignment ---\n";
    StringBuffer dest{"dest", "will be replaced"};
    dest = std::move(copied);  // 'copied' move-constructed into param, swapped, destroyed
    std::cout << std::format("  dest after move-assign: '{}'\n", dest.data());

    // ---- Copy elision (NRVO) ----
    std::cout << "\n--- Copy Elision (NRVO) ---\n";
    StringBuffer from_factory = make_buffer("Created by factory");
    std::cout << std::format("  from_factory: '{}'\n", from_factory.data());
    // Notice: likely no COPY or MOVE logged — NRVO built it directly

    // ---- Move into container ----
    std::cout << "\n--- Move Into Container ---\n";
    std::vector<StringBuffer> buffers;
    buffers.reserve(2);  // prevent reallocation to keep output clean
    StringBuffer buf1{"buf1", "first"};
    buffers.push_back(std::move(buf1));  // move into vector
    buffers.emplace_back("buf2", "second");  // construct in-place (no copy/move)
    std::cout << std::format("  buffers[0]: '{}'\n", buffers[0].data());
    std::cout << std::format("  buffers[1]: '{}'\n", buffers[1].data());

    // ---- Rule of Zero ----
    std::cout << "\n--- Rule of Zero ---\n";
    Person alice{"Alice", {"reading", "hiking"}, 7};
    alice.print();
    Person bob = std::move(alice);  // compiler-generated move ctor
    bob.print();
    // alice is now moved-from — don't read her name or hobbies

    std::cout << "\n--- Destruction (reverse order) ---\n";
    return 0;
}
