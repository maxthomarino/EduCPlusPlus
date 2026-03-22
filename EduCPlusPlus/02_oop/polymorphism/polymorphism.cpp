/**
 * polymorphism.cpp - Polymorphism in C++
 *
 * Why it exists:  Polymorphism lets you write code that operates on a base
 *                 type while the correct derived behaviour is selected at
 *                 runtime (virtual dispatch) or compile time (templates/CRTP).
 *                 This is the cornerstone of extensible, open/closed designs.
 * When to use:    Use runtime polymorphism when the concrete type is not known
 *                 until runtime (e.g., plugin systems, heterogeneous containers).
 *                 Use CRTP / static polymorphism when all types are known at
 *                 compile time and you want zero-overhead dispatch.
 * Standard:       C++20 (uses std::format, std::numbers, <memory>)
 * Prerequisites:  Classes, inheritance, virtual functions, templates
 * Reference:      reference/en/cpp/language/virtual
 *
 * Demonstrates: virtual functions, pure virtual (abstract classes),
 * runtime polymorphism via base pointers, dynamic_cast, and CRTP
 * (Curiously Recurring Template Pattern) for static polymorphism.
 */

#include <iostream>
#include <format>
#include <vector>
#include <memory>
#include <string>
#include <numbers>
#include <cmath>

// -----------------------------------------------
// 1. Abstract base class (interface)
//    What: These OOP constructs model interfaces, reuse, and dynamic behavior.
//    When: Use this when types share contracts or behavior across hierarchies.
//    Why: It organizes abstractions and enables polymorphic extension.
//    Use: Define clear base contracts and override behavior intentionally in derived types.
//    Which: C++98+ (with modern refinements)
//
//    Pure virtual functions (= 0) make this class abstract.
//    You cannot instantiate Shape directly.
//
//    Watch out: If you declare a pure virtual destructor
//    (virtual ~Base() = 0;), you still MUST provide a definition
//    for it (e.g., Base::~Base() = default;) because the derived
//    class destructor implicitly calls it.  A missing definition
//    will produce a linker error, not a compiler error, which can
//    be confusing.
// -----------------------------------------------
class Shape {
public:
    virtual ~Shape() = default;

    // Pure virtual: every derived class MUST implement these
    [[nodiscard]] virtual double area() const = 0;
    [[nodiscard]] virtual double perimeter() const = 0;
    [[nodiscard]] virtual std::string name() const = 0;

    // Non-virtual: shared behavior using virtual methods
    void describe() const {
        std::cout << std::format("{}: area={:.2f}, perimeter={:.2f}\n",
                                  name(), area(), perimeter());
    }
};

// -----------------------------------------------
// HOW IT WORKS: Virtual Dispatch (vtable / vptr)
// -----------------------------------------------
// The compiler generates a vtable (virtual method table) for every class
// that declares or inherits virtual functions.  A vtable is a static array
// of function pointers — one slot per virtual function in the class.
//
//   Shape's vtable:       Circle's vtable:
//   +--------------+      +------------------+
//   | ~Shape()     |      | ~Circle()        |
//   | area() = 0   |      | Circle::area()   |
//   | perimeter()=0|      | Circle::perim()  |
//   | name() = 0   |      | Circle::name()   |
//   +--------------+      +------------------+
//
// Every object of a polymorphic class contains a hidden vptr (pointer to
// its class's vtable), typically stored as the first member in the object
// layout.  So sizeof(Circle) = sizeof(vptr) + sizeof(radius_) (plus
// alignment padding).
//
// When you write  shape->area()  the compiler generates code that:
//   1. Follows the vptr inside *shape to reach the vtable.
//   2. Looks up the slot for area() (a fixed offset known at compile time).
//   3. Calls through the function pointer found in that slot.
// This is one extra level of indirection compared to a non-virtual call,
// which is why virtual calls are slightly slower than direct calls.
//
// The vptr is set in the constructor.  During Base construction, the vptr
// points to Base's vtable; only after the Derived constructor body
// completes does the vptr get overwritten to point to Derived's vtable.
// This is WHY calling a virtual function inside a constructor dispatches
// to the Base version, NOT the Derived version — the Derived object is
// not fully constructed yet, so the vptr still references Base's vtable.
//
// Reference: reference/en/cpp/language/virtual
// -----------------------------------------------

// -----------------------------------------------
// 2. Concrete derived classes
// -----------------------------------------------
class Circle : public Shape {
    double radius_;

public:
    explicit Circle(double r) : radius_(r) {}

    [[nodiscard]] double area() const override {
        return std::numbers::pi * radius_ * radius_;
    }

    [[nodiscard]] double perimeter() const override {
        return 2.0 * std::numbers::pi * radius_;
    }

    [[nodiscard]] std::string name() const override {
        return "Circle";
    }

    // Circle-specific method (not in base)
    [[nodiscard]] double diameter() const { return 2.0 * radius_; }
};

class Rectangle : public Shape {
    double width_, height_;

public:
    Rectangle(double w, double h) : width_(w), height_(h) {}

    [[nodiscard]] double area() const override {
        return width_ * height_;
    }

    [[nodiscard]] double perimeter() const override {
        return 2.0 * (width_ + height_);
    }

    [[nodiscard]] std::string name() const override {
        return "Rectangle";
    }
};

class Triangle : public Shape {
    double a_, b_, c_;  // Side lengths

public:
    Triangle(double a, double b, double c) : a_(a), b_(b), c_(c) {}

    [[nodiscard]] double area() const override {
        // Heron's formula
        double s = (a_ + b_ + c_) / 2.0;
        return std::sqrt(s * (s - a_) * (s - b_) * (s - c_));
    }

    [[nodiscard]] double perimeter() const override {
        return a_ + b_ + c_;
    }

    [[nodiscard]] std::string name() const override {
        return "Triangle";
    }
};

// -----------------------------------------------
// 3. Runtime polymorphism in action
//    A function that works with ANY Shape.
//
//    Watch out: Object slicing occurs when you store a derived object
//    by value in a base-typed variable or container (e.g.,
//    std::vector<Shape>). The derived part is "sliced off" and only
//    the base sub-object is copied, silently losing overridden
//    behaviour. Always use pointers or references (typically
//    std::unique_ptr<Base>) to preserve polymorphism.
//
//    HOW IT WORKS: Object Slicing
//    A derived object's memory layout is:
//
//      Circle object:
//      +---------------------------+
//      | vptr (-> Circle's vtable) |   \
//      | [Shape base members]      |    } Shape sub-object (first N bytes)
//      +---------------------------+   /
//      | radius_                   |   <- Circle-specific data
//      +---------------------------+
//
//    When you copy a Circle into a Shape-typed variable:
//        Shape s = my_circle;   // copy constructor of Shape is called
//    only the first N bytes (the Shape sub-object) are copied.  The
//    radius_ field is literally chopped off — it does not exist in s.
//    Crucially, the vptr in the copy is set to Shape's vtable (by
//    Shape's copy constructor), so virtual dispatch on s calls Shape's
//    methods, not Circle's.  The derived behaviour is permanently lost.
// -----------------------------------------------
double total_area(const std::vector<std::unique_ptr<Shape>>& shapes) {
    double sum = 0.0;
    for (const auto& s : shapes) {
        sum += s->area();  // Calls the correct override via vtable
    }
    return sum;
}

// -----------------------------------------------
// 4. CRTP - Static (compile-time) polymorphism
//    No virtual function overhead. The base class
//    "knows" the derived type at compile time.
//
//    Watch out: CRTP can be tricky to read and maintain. In C++23,
//    "deducing this" (explicit object parameters) provides the same
//    compile-time dispatch without the template boilerplate:
//        void print(this const auto& self) { ... }
//    If targeting C++23 or later, prefer deducing this over CRTP.
//
//    HOW IT WORKS: CRTP (Curiously Recurring Template Pattern)
//    When you write  class Coordinate : public Printable<Coordinate>,
//    the compiler instantiates Printable<Coordinate>.  Inside
//    Printable<Coordinate>::print(), the static_cast<const Coordinate&>(*this)
//    is always valid because *this IS a Coordinate (Coordinate inherits
//    from Printable<Coordinate>, so every Printable<Coordinate> object
//    is actually the Coordinate sub-object of a Coordinate instance).
//
//    Because Derived is a template parameter known at compile time, the
//    compiler resolves Derived::to_string() statically — there is no
//    vtable, no vptr, and no pointer indirection at runtime.  In
//    optimized builds (-O2 and above), the call to to_string() is
//    typically inlined directly into print(), yielding zero overhead.
//
//    Reference: reference/en/cpp/language/crtp
// -----------------------------------------------
template <typename Derived>
class Printable {
public:
    void print() const {
        // Calls derived class's to_string() -- resolved at compile time
        const auto& self = static_cast<const Derived&>(*this);
        std::cout << self.to_string() << '\n';
    }
};

class Coordinate : public Printable<Coordinate> {
    int x_, y_;

public:
    Coordinate(int x, int y) : x_(x), y_(y) {}

    [[nodiscard]] std::string to_string() const {
        return std::format("({}, {})", x_, y_);
    }
};

class Color : public Printable<Color> {
    int r_, g_, b_;

public:
    Color(int r, int g, int b) : r_(r), g_(g), b_(b) {}

    [[nodiscard]] std::string to_string() const {
        return std::format("rgb({}, {}, {})", r_, g_, b_);
    }
};

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Runtime polymorphism (virtual dispatch) lets you extend a
//    What: These OOP constructs model interfaces, reuse, and dynamic behavior.
//    When: Use this when types share contracts or behavior across hierarchies.
//    Why: It organizes abstractions and enables polymorphic extension.
//    Use: Define clear base contracts and override behavior intentionally in derived types.
//    Which: C++98+ (with modern refinements)
//
//    system without modifying existing code -- the Open/Closed
//    Principle in action.
// 2. Always store polymorphic objects through pointers or references
//    (preferably std::unique_ptr) to prevent object slicing.
// 3. CRTP gives you polymorphic-style reuse with zero runtime
//    overhead, but C++23 deducing this is the cleaner successor.
// 4. Use dynamic_cast sparingly; frequent downcasting often signals
//    a design that should lean more on virtual methods.  Also note
//    that dynamic_cast requires RTTI, which some projects disable
//    for binary size or performance reasons (-fno-rtti).
// -----------------------------------------------

int main() {
    // ---- Runtime polymorphism ----
    std::cout << "--- Runtime Polymorphism ---\n";

    // Store different shapes through base class pointers
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    shapes.push_back(std::make_unique<Triangle>(3.0, 4.0, 5.0));

    // Polymorphic dispatch: each shape calls its own describe()
    for (const auto& s : shapes) {
        s->describe();
    }

    std::cout << std::format("Total area: {:.2f}\n", total_area(shapes));

    // ---- dynamic_cast for safe downcasting ----
    // Watch out: dynamic_cast relies on RTTI (Run-Time Type Information).
    // Some codebases compile with -fno-rtti to reduce binary size and
    // improve performance, which disables dynamic_cast entirely.
    //
    // HOW IT WORKS: dynamic_cast
    // The compiler stores RTTI (Run-Time Type Information) alongside
    // each class's vtable.  RTTI includes the class name and a list of
    // base classes.  When you write dynamic_cast<Circle*>(raw), the
    // runtime:
    //   1. Follows raw's vptr to find the vtable and its RTTI record.
    //   2. Traverses the RTTI inheritance graph to determine whether
    //      the actual (most-derived) type is, or derives from, Circle.
    //   3a. For pointer casts: returns a correctly adjusted pointer on
    //       success, or nullptr on failure (no exception thrown).
    //   3b. For reference casts (dynamic_cast<Circle&>(ref)): throws
    //       std::bad_cast on failure, because a reference cannot be null.
    //
    // Because it reads the vtable, dynamic_cast requires the source
    // type to be polymorphic (i.e., have at least one virtual function).
    // Attempting dynamic_cast on a non-polymorphic type is a compile error.
    //
    // Reference: reference/en/cpp/language/dynamic_cast
    std::cout << "\n--- dynamic_cast ---\n";
    Shape* raw = shapes[0].get();

    // Try to cast to Circle (should succeed for shapes[0])
    if (auto* circle = dynamic_cast<Circle*>(raw)) {
        std::cout << std::format("Diameter: {:.2f}\n", circle->diameter());
    }

    // Try to cast to Rectangle (should fail for shapes[0])
    if (auto* rect = dynamic_cast<Rectangle*>(raw)) {
        std::cout << "This is a rectangle\n";
    } else {
        std::cout << "Not a rectangle -- dynamic_cast returned nullptr\n";
    }

    // ---- CRTP: static polymorphism ----
    std::cout << "\n--- CRTP (Static Polymorphism) ---\n";
    Coordinate coord(10, 20);
    Color color(255, 128, 0);
    coord.print();  // Calls Coordinate::to_string at compile time
    color.print();  // Calls Color::to_string at compile time

    return 0;
}
