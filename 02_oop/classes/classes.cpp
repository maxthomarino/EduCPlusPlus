/**
 * classes.cpp - Classes and Encapsulation in C++
 *
 * Demonstrates: constructors, member initializer lists, access specifiers,
 * const methods, static members, operator overloading, and the Rule of Five.
 */

#include <iostream>
#include <format>
#include <string>
#include <cmath>

// -----------------------------------------------
// 1. Basic class with encapsulation
//    Private data + public interface = information hiding.
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
        return M_PI * radius_ * radius_;
    }

    [[nodiscard]] double circumference() const {
        return 2.0 * M_PI * radius_;
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
//    If you define any of: destructor, copy ctor, copy assignment,
//    move ctor, move assignment -- define ALL of them.
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
