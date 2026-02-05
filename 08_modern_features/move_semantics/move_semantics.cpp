/**
 * move_semantics.cpp - Move Semantics in C++
 *
 * Move semantics (C++11) allow transferring ownership of resources
 * instead of copying them. This avoids expensive deep copies.
 *
 * Key concepts:
 *   - lvalue: has a name, persists (e.g., a variable)
 *   - rvalue: temporary, about to be destroyed (e.g., function return)
 *   - std::move: casts an lvalue to an rvalue reference (&&)
 *   - Move constructor / move assignment: steal resources from rvalue
 */

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <utility>
#include <cstring>

// -----------------------------------------------
// 1. A class that manages a heap-allocated buffer
//    to demonstrate copy vs move.
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
template<typename T>
void wrapper(T&& arg) {
    // std::forward<T> passes lvalues as lvalues, rvalues as rvalues
    take_ownership(std::forward<T>(arg));
}

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
