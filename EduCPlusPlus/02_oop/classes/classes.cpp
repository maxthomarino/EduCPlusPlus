/**
 * classes.cpp - Classes and Encapsulation in C++
 *
 * Why it exists:  Classes bundle data and the operations on that data into
 *                 a single unit, enforcing invariants through access control.
 *                 Encapsulation lets you change internal representation without
 *                 breaking client code.
 * When to use:    Whenever you need to enforce invariants on a group of related
 *                 data members, or when the abstraction benefits from hiding its
 *                 implementation details behind a public interface.
 * Standard:       C++20 (uses std::format, [[nodiscard]])
 * Prerequisites:  Basic C++ syntax, functions, references, move semantics
 * Reference:      reference/en/cpp/language/classes
 *
 * Demonstrates: constructors, member initializer lists, access specifiers,
 * const methods, static members, operator overloading, and the Rule of Five.
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: What is the difference between a struct and a class in C++?
// A: The only language difference is the default access level: struct
//    members are public by default, while class members are private.
//    By convention, struct is used for plain data aggregates and class
//    for types that enforce invariants through encapsulation.
//
// Q: When should I use getters and setters instead of public members?
// A: Use getters/setters when you need to enforce invariants (e.g.,
//    a radius must be positive), provide a stable API while the internal
//    representation may change, or add side effects like logging. If the
//    type is a simple data holder with no invariants, public members
//    (or a struct) are perfectly fine.
//
// Q: What are friend functions and when should I use them?
// A: A friend function has access to a class's private and protected
//    members even though it is not a member itself. Use friends for
//    operator overloads that need access to internals (like operator<<)
//    or for tightly coupled helper functions. Overusing friend weakens
//    encapsulation, so keep the friend list small.
//
// Q: What guidelines should I follow for operator overloading?
// A: Overload operators only when the meaning is obvious and intuitive
//    (e.g., + for vector addition). Implement compound assignment (+=)
//    as a member and build the binary operator (+) on top of it. Never
//    overload &&, ||, or the comma operator because their short-circuit
//    and sequencing semantics cannot be preserved for overloads.
//
// Q: What is the Rule of Five and when does it apply?
// A: If you define any of the destructor, copy constructor, copy
//    assignment, move constructor, or move assignment operator, you
//    should define all five to ensure correct resource management.
//    It applies whenever your class directly manages a raw resource
//    (raw pointer, file handle, socket). If your class only holds
//    RAII types like std::string or std::unique_ptr, prefer the
//    Rule of Zero and let the compiler generate everything.
//
// =====================================================

#include <iostream>
#include <format>
#include <string>
#include <cmath>
#include <numbers>
#include <algorithm>

// -----------------------------------------------
// 1. Basic class with encapsulation
//    What: Encapsulation bundles data with the operations that act on it, hiding internal state behind a public interface.
//    When: Use this when a group of data members has invariants that must be maintained by controlled access.
//    Why: It lets you change the internal representation without breaking client code that uses the public API.
//    Use: Make data members private, expose only the operations clients need, and validate inputs in those operations.
//    Which: C++98+
//
//    Private data + public interface = information hiding.
//
//    Watch out: Comparing floating-point values with == is almost always
//    wrong. Two doubles that "should" be equal after arithmetic often
//    differ by a tiny rounding error. Prefer an epsilon-based comparison
//    (std::abs(a - b) < epsilon) for real-world code.
// -----------------------------------------------
class Point {
private:
    double x_;
    double y_;

public:
    // Default constructor
    Point() : x_(0.0), y_(0.0) {}

    // Parameterized constructor with member initializer list
    // (preferred over assignment in the body -- more efficient)
    Point(double x, double y) : x_(x), y_(y) {}

    // Const member functions: promise not to modify the object
    [[nodiscard]] double x() const { return x_; }
    [[nodiscard]] double y() const { return y_; }

    [[nodiscard]] double distance_to(const Point& other) const {
        double dx = x_ - other.x_;
        double dy = y_ - other.y_;
        return std::sqrt(dx * dx + dy * dy);
    }

    // Operator overloading: add two points
    Point operator+(const Point& other) const {
        return Point(x_ + other.x_, y_ + other.y_);
    }

    // Equality comparison (C++20 defaulted <=> is even simpler)
    bool operator==(const Point& other) const {
        return x_ == other.x_ && y_ == other.y_;
    }
};

// -----------------------------------------------
// 2. Class with static members and constructor delegation
//    What: Static members belong to the class itself, and delegating constructors forward to another constructor of the same class.
//    When: Use static members for class-wide state (e.g., instance counts) and delegating constructors to avoid duplicating init logic.
//    Why: Static members avoid globals while keeping shared state scoped, and delegation eliminates redundant initialization code.
//    Use: Define static members in one translation unit (or use inline static in C++17+), and chain constructors via delegation.
//    Which: C++98+ for static members; C++11 for delegating constructors
//
//    Watch out: Static members of different translation units have no
//    guaranteed initialization order (the "static initialization order
//    fiasco"). If one static depends on another from a different .cpp
//    file, you may read uninitialized data. Use a function-local static
//    (Meyers' singleton) or inline variables (C++17) to avoid this.
// -----------------------------------------------
class Circle {
    Point center_;
    double radius_;

    // Static member: shared across all instances
    static int instance_count_;

public:
    // Constructor delegation: one constructor calls another
    Circle() : Circle(Point(), 1.0) {}

    Circle(Point center, double radius)
        : center_(center), radius_(radius) {
        ++instance_count_;
    }

    ~Circle() { --instance_count_; }

    [[nodiscard]] double area() const {
        return std::numbers::pi * radius_ * radius_;
    }

    [[nodiscard]] double circumference() const {
        return 2.0 * std::numbers::pi * radius_;
    }

    [[nodiscard]] bool contains(const Point& p) const {
        return center_.distance_to(p) <= radius_;
    }

    // Static method: access without an instance
    static int count() { return instance_count_; }
};

// Define static member outside the class
int Circle::instance_count_ = 0;

// -----------------------------------------------
// 3. Rule of Five -- managing resources correctly
//    What: Constructors and special members define object initialization and ownership behavior.
//    When: Use this when class invariants and resource semantics must be explicit.
//    Why: It prevents lifetime bugs and makes copy/move behavior predictable.
//    Use: Define/default/delete special members to match ownership intent.
//    Which: C++98+ (major additions in C++11 and later)
//
//    If you define any of: destructor, copy ctor, copy assignment,
//    move ctor, move assignment -- define ALL of them.
//
//    Watch out: Prefer the Rule of Zero when possible. If your class
//    only holds members that already manage themselves (std::string,
//    std::vector, std::unique_ptr, etc.), the compiler-generated
//    special members do the right thing and you need write none of
//    the five. Reserve the Rule of Five for classes that directly
//    manage a raw resource (raw pointer, file handle, etc.).
// -----------------------------------------------
class DynamicArray {
    int* data_;
    std::size_t size_;

public:
    // Constructor
    explicit DynamicArray(std::size_t size)
        : data_(new int[size]{}), size_(size) {}

    // Destructor
    ~DynamicArray() {
        delete[] data_;
    }

    // Copy constructor (deep copy)
    DynamicArray(const DynamicArray& other)
        : data_(new int[other.size_]), size_(other.size_) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    // Copy assignment operator (copy-and-swap idiom)
    DynamicArray& operator=(DynamicArray other) {
        std::swap(data_, other.data_);
        std::swap(size_, other.size_);
        return *this;
    }

    // Move constructor (steal resources)
    DynamicArray(DynamicArray&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    // Move assignment
    DynamicArray& operator=(DynamicArray&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }

    // Accessors
    int& operator[](std::size_t idx) { return data_[idx]; }
    const int& operator[](std::size_t idx) const { return data_[idx]; }
    [[nodiscard]] std::size_t size() const { return size_; }
};

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Always use member initializer lists -- they initialize directly
//    instead of default-constructing then assigning, which is both
//    faster and required for const/reference members.
// 2. Mark every method that does not modify the object as const;
//    this enables calling it on const references and communicates
//    intent.
// 3. Prefer the Rule of Zero (let smart pointers and containers
//    manage resources). Fall back to the Rule of Five only when your
//    class directly owns a raw resource.
// 4. Static members belong to the class, not to any instance. Define
//    them in exactly one translation unit to avoid linker errors
//    (or use inline static in C++17+).
// 5. Use [[nodiscard]] on getters and pure computations so the
//    compiler warns if the caller accidentally ignores the result.
// -----------------------------------------------

int main() {
    // Point class
    Point a(3.0, 4.0);
    Point b(6.0, 8.0);
    Point c = a + b;

    std::cout << std::format("a = ({}, {})\n", a.x(), a.y());
    std::cout << std::format("a + b = ({}, {})\n", c.x(), c.y());
    std::cout << std::format("Distance a->b = {:.2f}\n", a.distance_to(b));

    // Circle class with static member
    {
        Circle c1;
        Circle c2(Point(1, 1), 5.0);
        std::cout << std::format("Circles alive: {}\n", Circle::count());
        std::cout << std::format("Area: {:.2f}\n", c2.area());
        std::cout << std::format("Contains (2,2)? {}\n",
                                  c2.contains(Point(2, 2)));
    }
    std::cout << std::format("Circles alive after scope: {}\n", Circle::count());

    // DynamicArray: Rule of Five in action
    DynamicArray arr(5);
    for (std::size_t i = 0; i < arr.size(); ++i) {
        arr[i] = static_cast<int>(i * 10);
    }

    DynamicArray copy = arr;              // Copy constructor
    DynamicArray moved = std::move(arr);  // Move constructor

    std::cout << std::format("copy[2] = {}\n", copy[2]);
    std::cout << std::format("moved[4] = {}\n", moved[4]);

    return 0;
}
