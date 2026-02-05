/**
 * inheritance.cpp - Inheritance in C++
 *
 * Demonstrates: public/protected/private inheritance, base class constructors,
 * method overriding, the 'using' keyword, and multiple inheritance.
 */

#include <iostream>
#include <format>
#include <string>

// -----------------------------------------------
// 1. Base class
//    Represents a generic animal with common attributes.
// -----------------------------------------------
class Animal {
protected:                      // Accessible to derived classes
    std::string name_;
    int age_;

public:
    Animal(std::string name, int age)
        : name_(std::move(name)), age_(age) {
        std::cout << std::format("  Animal '{}' constructed\n", name_);
    }

    virtual ~Animal() {
        std::cout << std::format("  Animal '{}' destroyed\n", name_);
    }

    void info() const {
        std::cout << std::format("Name: {}, Age: {}\n", name_, age_);
    }

    // Virtual method: can be overridden by derived classes
    virtual void speak() const {
        std::cout << std::format("{} makes a sound\n", name_);
    }
};

// -----------------------------------------------
// 2. Public inheritance: "is-a" relationship
//    Dog IS-A Animal.
// -----------------------------------------------
class Dog : public Animal {
    std::string breed_;

public:
    // Call the base class constructor explicitly
    Dog(std::string name, int age, std::string breed)
        : Animal(std::move(name), age), breed_(std::move(breed)) {}

    // Override the base class virtual method
    void speak() const override {
        std::cout << std::format("{} barks! (breed: {})\n", name_, breed_);
    }

    void fetch() const {
        std::cout << std::format("{} fetches the ball!\n", name_);
    }
};

class Cat : public Animal {
public:
    Cat(std::string name, int age)
        : Animal(std::move(name), age) {}

    void speak() const override {
        std::cout << std::format("{} meows!\n", name_);
    }
};

// -----------------------------------------------
// 3. Multilevel inheritance
//    GuideDog -> Dog -> Animal
// -----------------------------------------------
class GuideDog : public Dog {
    std::string owner_;

public:
    GuideDog(std::string name, int age, std::string breed, std::string owner)
        : Dog(std::move(name), age, std::move(breed)), owner_(std::move(owner)) {}

    void guide() const {
        std::cout << std::format("{} guides {}\n", name_, owner_);
    }
};

// -----------------------------------------------
// 4. Multiple inheritance
//    Combine capabilities from two unrelated bases.
// -----------------------------------------------
class Flyable {
public:
    virtual void fly() const {
        std::cout << "Flying!\n";
    }
    virtual ~Flyable() = default;
};

class Swimmable {
public:
    virtual void swim() const {
        std::cout << "Swimming!\n";
    }
    virtual ~Swimmable() = default;
};

// A duck can fly AND swim
class Duck : public Animal, public Flyable, public Swimmable {
public:
    Duck(std::string name, int age)
        : Animal(std::move(name), age) {}

    void speak() const override {
        std::cout << std::format("{} quacks!\n", name_);
    }
};

// -----------------------------------------------
// 5. Protected inheritance and 'using' keyword
// -----------------------------------------------
class Base {
public:
    void public_method() const {
        std::cout << "Base::public_method\n";
    }

protected:
    void protected_method() const {
        std::cout << "Base::protected_method\n";
    }
};

class Derived : protected Base {
public:
    // Re-expose selected base methods with 'using'
    using Base::public_method;

    void call_protected() const {
        protected_method();  // Accessible because we inherit protected
    }
};

int main() {
    std::cout << "--- Single Inheritance ---\n";
    Dog rex("Rex", 5, "German Shepherd");
    rex.info();      // Inherited from Animal
    rex.speak();     // Overridden in Dog
    rex.fetch();     // Dog-specific

    std::cout << "\n--- Multilevel Inheritance ---\n";
    GuideDog buddy("Buddy", 3, "Labrador", "Alice");
    buddy.info();
    buddy.speak();
    buddy.guide();

    std::cout << "\n--- Multiple Inheritance ---\n";
    Duck donald("Donald", 2);
    donald.speak();
    donald.fly();
    donald.swim();

    std::cout << "\n--- Protected Inheritance ---\n";
    Derived d;
    d.public_method();    // OK: re-exposed with 'using'
    d.call_protected();   // OK: calls protected method internally
    // d.protected_method(); // Error: not accessible from outside

    std::cout << "\n--- Destruction order (reverse of construction) ---\n";
    return 0;
}
