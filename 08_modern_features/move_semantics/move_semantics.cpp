/**
 * move_semantics.cpp - Move Semantics in C++
 *
 * WHY IT EXISTS:  Before C++11 every value transfer was a deep copy.  For objects
 *                 that own heap memory (strings, vectors, buffers) this means
 *                 allocating fresh memory and copying every byte -- even when the
 *                 source is a temporary that is about to be destroyed.  Move
 *                 semantics let you *transfer* (steal) the internal resources of
 *                 the source instead of duplicating them, turning O(n) copies
 *                 into O(1) pointer swaps.
 *
 * WHEN TO USE:    Whenever you pass or return resource-owning objects by value.
 *                 Move constructors / move assignment operators are called
 *                 automatically for temporaries (rvalues) and explicitly via
 *                 std::move for named objects (lvalues) you no longer need.
 *
 * STANDARD:       C++11  (std::move, rvalue references, move special members)
 * PREREQUISITES:  Value categories (lvalue vs rvalue), Rule of Five, RAII
 * REFERENCE:      reference/en/cpp/language/move_constructor
 *                 reference/en/cpp/utility/move
 */

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <utility>
#include <cstring>

// -----------------------------------------------
// HOW IT WORKS: VALUE CATEGORIES
// -----------------------------------------------
// Every expression in C++ has a *value category* that determines
// whether the compiler will copy or move from it.  There are three:
//
//   lvalue  -- "has identity, persists beyond the expression."
//              Variables, dereferenced pointers, array elements.
//              Has a name and an address you can take with &.
//              Example:  int x = 42;   // 'x' is an lvalue
//
//   prvalue -- "pure rvalue, no identity."
//              Temporaries, literals, return-by-value results.
//              About to evaporate at the end of the full-expression.
//              Example:  foo()         // if foo() returns by value
//                        42            // integer literal
//
//   xvalue  -- "eXpiring value -- has identity but you have said goodbye."
//              The result of std::move(x), or a cast to T&&.
//              It still has a name and an address, but you have
//              explicitly marked it as "I no longer need this."
//              Example:  std::move(x)  // x is an xvalue here
//
// The compiler uses the value category to pick the overload:
//   - lvalue   -> copy constructor  (const T&)
//   - prvalue  -> move constructor  (T&&), or copy elision (NRVO)
//   - xvalue   -> move constructor  (T&&)
//
// T&& in a function parameter is an *rvalue reference* -- it can
// bind to rvalues (prvalues and xvalues) but NOT to lvalues.
// This is how the compiler routes temporaries and std::move'd
// objects into the move constructor instead of the copy constructor.
// -----------------------------------------------

// -----------------------------------------------
// 1. A class that manages a heap-allocated buffer
//    to demonstrate copy vs move.
//
//    Watch out: std::move does NOT move -- it casts
//    to an rvalue reference.  The actual move happens
//    in the move constructor / move assignment operator.
// -----------------------------------------------
class Buffer {
    char* data_;
    std::size_t size_;
    std::string name_;

public:
    // Constructor
    Buffer(std::string name, std::size_t size)
        : data_(new char[size]), size_(size), name_(std::move(name)) {
        std::memset(data_, 0, size_);
        std::cout << std::format("  [{}] Constructed ({} bytes)\n", name_, size_);
    }

    // Destructor
    ~Buffer() {
        if (data_) {
            std::cout << std::format("  [{}] Destroyed\n", name_);
        }
        delete[] data_;
    }

    // ---- Copy constructor (expensive: allocates + copies) ----
    Buffer(const Buffer& other)
        : data_(new char[other.size_]),
          size_(other.size_),
          name_(other.name_ + " (copy)") {
        std::memcpy(data_, other.data_, size_);
        std::cout << std::format("  [{}] COPIED ({} bytes allocated)\n",
                                  name_, size_);
    }

    // ---- Move constructor (cheap: just pointer swap) ----
    //
    // HOW IT WORKS: STD::MOVE
    //
    // std::move does NOT move anything.  It is purely a cast:
    //
    //   template<typename T>
    //   constexpr std::remove_reference_t<T>&& move(T&& x) noexcept {
    //       return static_cast<std::remove_reference_t<T>&&>(x);
    //   }
    //
    // Conceptually: T&& move(T& x) { return static_cast<T&&>(x); }
    //
    // All it does is change the value category of 'x' from lvalue to
    // xvalue (eXpiring value).  This makes the expression eligible for
    // binding to T&& parameters, so the compiler selects the move
    // constructor instead of the copy constructor.
    //
    // The *actual* resource transfer (stealing the pointer, nulling the
    // source) happens right here in the move constructor that YOU write.
    //
    // Watch out: after std::move, the source object is in a
    // "valid but unspecified" state.  The C++ standard only guarantees
    // that you can safely destroy it or assign a new value to it.
    // Do NOT read from it expecting any particular contents.
    //
    Buffer(Buffer&& other) noexcept
        : data_(other.data_),           // Steal the pointer
          size_(other.size_),
          name_(std::move(other.name_) + " (moved)") {
        other.data_ = nullptr;          // Leave source in valid empty state
        other.size_ = 0;
        std::cout << std::format("  [{}] MOVED (zero allocation)\n", name_);
    }

    // ---- Copy assignment ----
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            delete[] data_;
            data_ = new char[other.size_];
            size_ = other.size_;
            std::memcpy(data_, other.data_, size_);
            name_ = other.name_ + " (copy=)";
            std::cout << std::format("  [{}] Copy assigned\n", name_);
        }
        return *this;
    }

    // ---- Move assignment ----
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            name_ = std::move(other.name_) + " (move=)";
            other.data_ = nullptr;
            other.size_ = 0;
            std::cout << std::format("  [{}] Move assigned\n", name_);
        }
        return *this;
    }

    [[nodiscard]] std::size_t size() const { return size_; }
    [[nodiscard]] const std::string& name() const { return name_; }
};

// -----------------------------------------------
// 2. Functions demonstrating when moves happen
//
//    Watch out: do NOT std::move the return value
//    of a local variable -- it inhibits NRVO (named
//    return value optimization), making performance
//    WORSE, not better.
// -----------------------------------------------
Buffer create_buffer() {
    Buffer b("factory", 1024);
    return b;  // NRVO (Named Return Value Optimization) may elide the move
}

void take_ownership(Buffer b) {
    std::cout << std::format("  Took ownership of: {}\n", b.name());
    // b is destroyed at end of function
}

// -----------------------------------------------
// 3. std::move with STL containers
//    Moving strings and vectors avoids deep copies.
//
//    Watch out: after std::move, the source object
//    is in a valid-but-unspecified state -- you can
//    assign to it or destroy it, but do NOT read
//    from it expecting any particular value.
// -----------------------------------------------
void stl_move_demo() {
    std::cout << "\n--- STL Move Semantics ---\n";

    std::string source = "Hello, this is a long string that uses heap memory";
    std::cout << std::format("Before move: source = '{}'\n", source);

    std::string dest = std::move(source);  // Pointer swap, O(1)
    std::cout << std::format("After move:  dest = '{}'\n", dest);
    std::cout << std::format("After move:  source = '{}' (valid but unspecified)\n",
                              source);

    // Moving elements into a vector
    std::vector<std::string> names;
    std::string name = "Alice";
    names.push_back(std::move(name));  // Move instead of copy
    names.emplace_back("Bob");         // Construct in-place (even better)

    std::cout << std::format("names: [{}, {}]\n", names[0], names[1]);
}

// -----------------------------------------------
// 4. Perfect forwarding with std::forward
//    Preserves the value category (lvalue/rvalue) of arguments.
// -----------------------------------------------
//
// HOW IT WORKS: PERFECT FORWARDING
//
// In the signature  template<typename T> void wrapper(T&& arg),
// T&& is a "forwarding reference" (sometimes called "universal
// reference") -- NOT an rvalue reference -- because T is being
// deduced by the compiler.
//
// Reference collapsing rules determine what T&& becomes:
//
//   If the caller passes an lvalue (e.g., a named variable):
//     T is deduced as int&
//     T&&  =  int& &&  =  int&          (reference collapsing)
//     -> arg is an lvalue reference
//
//   If the caller passes an rvalue (e.g., std::move(x) or a temp):
//     T is deduced as int
//     T&&  =  int&&                      (no collapsing needed)
//     -> arg is an rvalue reference
//
// The problem: inside the function, 'arg' is always an lvalue
// (because it has a name), regardless of what the caller passed.
// If you just wrote  take_ownership(arg);  it would ALWAYS copy.
//
// std::forward<T>(arg) casts 'arg' back to its original category:
//   - If T = int&  :  forward returns int&   (stays lvalue)
//   - If T = int   :  forward returns int&&  (restored to rvalue)
//
// Without std::forward, the rvalue-ness of the original argument
// is lost the moment it binds to the named parameter 'arg'.
// Forward restores it, enabling the callee (take_ownership) to
// select the move constructor when the caller intended a move.
// -----------------------------------------------
template<typename T>
void wrapper(T&& arg) {
    // std::forward<T> passes lvalues as lvalues, rvalues as rvalues
    take_ownership(std::forward<T>(arg));
}

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Move semantics turn expensive O(n) deep copies into O(1) pointer
//    swaps for resource-owning types (strings, vectors, buffers).
// 2. std::move is just a cast to rvalue reference (T&&).  The actual
//    resource transfer happens inside the move constructor / move
//    assignment operator.
// 3. After std::move, the source is in a valid-but-unspecified state.
//    Only assign to it or destroy it -- do not read its value.
// 4. Do NOT std::move a local return value -- it prevents NRVO.
// 5. Mark move constructors and move assignment operators noexcept so
//    STL containers (e.g. std::vector) can use moves during reallocation.
// -----------------------------------------------

int main() {
    std::cout << "--- Copy vs Move ---\n";

    Buffer original("orig", 1024);

    // Copy: allocates new memory and copies bytes
    std::cout << "\nCopying:\n";
    Buffer copied = original;

    // Move: just steals the pointer (no allocation!)
    std::cout << "\nMoving:\n";
    Buffer moved = std::move(original);
    // 'original' is now in a valid but empty state

    // Return value optimization
    std::cout << "\n--- Return Value (NRVO) ---\n";
    auto buf = create_buffer();

    // Transfer ownership to a function
    std::cout << "\n--- Transfer Ownership ---\n";
    take_ownership(std::move(buf));

    // STL containers
    stl_move_demo();

    // Perfect forwarding
    std::cout << "\n--- Perfect Forwarding ---\n";
    Buffer fwd_buf("forward-me", 512);
    wrapper(std::move(fwd_buf));  // Forwarded as rvalue -> move

    return 0;
}
