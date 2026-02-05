/**
 * polymorphism.cpp - Polymorphism in C++
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

// -----------------------------------------------
// 1. Abstract base class (interface)
//    Pure virtual functions (= 0) make this class abstract.
//    You cannot instantiate Shape directly.
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
