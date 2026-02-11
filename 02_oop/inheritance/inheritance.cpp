/**
 * inheritance.cpp - Inheritance in C++
 *
 * Why it exists:  Inheritance models "is-a" relationships, letting derived
 *                 classes reuse and extend the behaviour of a base class
 *                 without duplicating code.  It is also the foundation for
 *                 runtime polymorphism (virtual dispatch).
 * When to use:    Use public inheritance when a derived type truly IS-A base
 *                 type (Liskov Substitution Principle).  Use protected/private
 *                 inheritance for implementation reuse without exposing the
 *                 base interface.
 * Standard:       C++20 (uses std::format)
 * Prerequisites:  Classes, access specifiers, constructors, virtual functions
 * Reference:      reference/en/cpp/language/derived_class
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
//
//    Watch out: If a class will ever be used as a base for
//    polymorphism, its destructor MUST be virtual. Without it,
//    deleting a derived object through a base pointer is undefined
//    behaviour -- the derived destructor never runs, leaking any
//    resources it owns.
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
// HOW IT WORKS: Inheritance Memory Layout
// -----------------------------------------------
// A derived object contains the complete base sub-object as its first
// portion in memory.  For single inheritance the layout is:
//
//   Dog object in memory:
//   +-------------------------------+
//   | vptr (-> Dog's vtable)        |  \
//   | name_  (std::string)          |   } Animal sub-object
//   | age_   (int)                  |  /
//   +-------------------------------+
//   | breed_ (std::string)          |  <- Dog-specific member
//   +-------------------------------+
//
// Because the Animal sub-object starts at the very beginning of the Dog
// object, an Animal* and a Dog* that point to the same Dog have the same
// numeric address.  This is why upcasting (Dog* -> Animal*) is free —
// no pointer adjustment is needed for single inheritance.  The compiler
// simply reinterprets the same address as a different type.
//
// A consequence of this layout is that
//     sizeof(Dog) >= sizeof(Animal)
// always holds.  Derived can never be smaller than Base, because it
// physically contains the entire Base sub-object plus any additional
// members it declares.
//
// Reference: reference/en/cpp/language/derived_class
// -----------------------------------------------

// -----------------------------------------------
// 2. Public inheritance: "is-a" relationship
//    Dog IS-A Animal.
//
//    Watch out: Always mark overriding methods with the override
//    keyword.  Without it, a small typo in the function signature
//    (wrong parameter type, missing const) silently creates a NEW
//    function instead of overriding the base version.  The override
//    keyword turns that silent bug into a compile-time error.
//
//    HOW IT WORKS: override Checking
//    When the compiler sees the override keyword on a method, it
//    verifies that a virtual function with the EXACT same signature
//    (name, parameter types, const/volatile qualifiers, ref-qualifiers)
//    exists in a base class.  If no matching base virtual function is
//    found, compilation fails immediately.
//
//    Without override, a mismatched signature silently creates a brand-
//    new virtual function in the derived class that hides the base
//    version.  For example:
//        // Base:    virtual void speak() const;
//        // Derived: void speak();          // missing const — NEW function!
//    The derived speak() does NOT override the base speak() const; it
//    hides it.  Calls through a Base* still invoke Base::speak() const.
//    Adding override catches this at compile time:
//        void speak() override;   // ERROR: does not override any base method
//
//    Reference: reference/en/cpp/language/override
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
//
//    Watch out: When two base classes share a common ancestor you
//    get the "diamond problem" -- the derived class holds TWO copies
//    of the shared base, causing ambiguity.  Solve it with virtual
//    inheritance (class B : virtual public A) so only one shared
//    base sub-object exists.  Be aware that virtual inheritance adds
//    a small runtime cost (extra indirection through a vptr) and
//    complicates constructor ordering.
//
//    HOW IT WORKS: The Diamond Problem
//    Without virtual inheritance, each inheritance path creates its
//    own copy of the shared base:
//
//        class A { int x_; };
//        class B : public A {};
//        class C : public A {};
//        class D : public B, public C {};
//
//        D object layout (no virtual inheritance):
//        +---------------------+
//        | B sub-object:       |
//        |   A sub-object (#1) |  <- first copy of A
//        |     x_              |
//        |   [B members]       |
//        +---------------------+
//        | C sub-object:       |
//        |   A sub-object (#2) |  <- second copy of A
//        |     x_              |
//        |   [C members]       |
//        +---------------------+
//
//    Accessing d.x_ is ambiguous — the compiler does not know which
//    copy you mean (B::x_ or C::x_), and you get a compile error.
//
//    With virtual inheritance the compiler shares a single A:
//
//        class B : virtual public A {};
//        class C : virtual public A {};
//        class D : public B, public C {};
//
//        D object layout (virtual inheritance):
//        +---------------------+
//        | B sub-object:       |
//        |   vbase_ptr --------+--> offset to shared A
//        |   [B members]       |
//        +---------------------+
//        | C sub-object:       |
//        |   vbase_ptr --------+--> offset to shared A
//        |   [C members]       |
//        +---------------------+
//        | A sub-object (shared)|  <- single copy of A
//        |   x_                 |
//        +----------------------+
//
//    Each intermediate class (B, C) holds a hidden vbase pointer that
//    the compiler uses to locate the single shared A sub-object at
//    runtime.  Because A's position relative to B or C can vary, the
//    most-derived class (D) is responsible for constructing the virtual
//    base — D's member initializer list must call A's constructor
//    directly, regardless of the inheritance depth.
//
//    Reference: reference/en/cpp/language/derived_class
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

// -----------------------------------------------
// Key Takeaways
// -----------------------------------------------
// 1. Always give polymorphic base classes a virtual destructor;
//    otherwise deleting through a base pointer is undefined behaviour.
// 2. Always use the override keyword on every overriding method so
//    the compiler catches signature mismatches at compile time.
// 3. Public inheritance means "is-a". Use it only when the derived
//    class can truly substitute for the base (Liskov Substitution).
// 4. Prefer composition over inheritance when you only need to reuse
//    implementation, not model a type relationship.
// 5. With multiple inheritance, watch for the diamond problem and
//    apply virtual inheritance when a common base is shared.
// -----------------------------------------------

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
