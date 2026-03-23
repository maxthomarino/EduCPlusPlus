/**
 * advanced_constructors.cpp - Inheriting, Converting, Aggregate, and constexpr Constructors
 *
 * Beyond the basics, C++ offers several specialized constructor forms that
 * solve specific problems: inheriting base-class constructors to reduce
 * boilerplate, std::initializer_list for brace-initialization, aggregate
 * initialization for simple structs, designated initializers (C++20) for
 * named fields, and constexpr constructors for compile-time objects.
 *
 * HOW TO CHOOSE:
 *   - If your derived class adds no new state, use inheriting constructors.
 *   - If your class should accept {1, 2, 3} syntax, add an initializer_list ctor.
 *   - If your class is just a bundle of data, make it an aggregate.
 *   - If your object can be fully built at compile time, make the ctor constexpr.
 *
 * Standard: Inheriting ctors (C++11), initializer_list (C++11), aggregate init
 *   (C++98, relaxed C++14/17/20), designated initializers (C++20), constexpr
 *   ctors (C++11, relaxed C++14/20).
 * Prerequisites: See constructor_fundamentals.cpp and copy_and_move_constructors.cpp.
 * Reference: reference/en/cpp/language/using_declaration.html (inheriting ctors)
 *            reference/en/cpp/utility/initializer_list.html
 *            reference/en/cpp/language/aggregate_initialization.html
 *            reference/en/cpp/language/constexpr.html
 */

// =====================================================
// FREQUENTLY ASKED QUESTIONS
// =====================================================
//
// Q: What makes a type an aggregate vs a non-aggregate?
// A: An aggregate has no user-declared constructors, no private or
//    protected non-static data members, no virtual functions, and no
//    virtual/private/protected base classes. In C++20 the rules got
//    stricter: a class with ANY user-declared constructor (including
//    = default or = delete inside the class body) is NOT an aggregate.
//    This means a seemingly innocent "MyStruct() = default;" inside
//    the class removes aggregate status in C++20.
//
// Q: Are designated initializers portable between C and C++?
// A: No. C99 designated initializers allow out-of-order designators
//    and array element designation (e.g., [3] = 5), but C++20
//    designated initializers require designators in declaration order
//    and do not support array element designation. Code using C99-only
//    features will not compile as C++20.
//
// Q: What are the requirements for a constexpr constructor?
// A: In C++14 and later, a constexpr constructor can contain statements
//    (loops, conditionals), but all member types must be literal types,
//    no dynamic allocation is allowed (except C++20 transient allocation),
//    and the constructor must be able to produce a constant expression
//    when given constant arguments. All members must be initialized.
//
// Q: When should I use inheriting constructors vs writing my own?
// A: Use inheriting constructors ("using Base::Base;") when the derived
//    class adds no new data members, or all new members have default
//    member initializers. Write your own constructors when the derived
//    class needs to initialize new members that have no sensible default,
//    or when you need validation logic beyond what the base provides.
//
// =====================================================

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <initializer_list>
#include <array>
#include <numeric>
#include <cassert>
#include <cmath>

// -----------------------------------------------
// 1. Inheriting constructors (C++11) — using Base::Base
//    What: Inheriting constructors import all base-class constructors into a derived class with a single using-declaration.
//    When: Use this when the derived class adds no new uninitialized data members and the base constructors are sufficient.
//    Why: It eliminates boilerplate forwarding constructors that simply pass arguments through to the base.
//    Use: Write "using Base::Base;" in the derived class and ensure any new members have default member initializers.
//    Which: C++11
//
//    HOW IT WORKS:
//    When a derived class adds no new data members (or all new members
//    have default member initializers), you can import ALL constructors
//    from the base class with "using Base::Base;". The compiler generates
//    a derived-class constructor for each base-class constructor that
//    simply forwards the arguments to the base.
//
//    WHAT THE COMPILER GENERATES (conceptually):
//      Derived(int x, string s) : Base(x, s) {}  // for each Base ctor
//
//    WHY IT MATTERS:
//    Without this, a derived class with a 5-argument base would need
//    to manually write forwarding constructors for every combination.
//
//    Watch out: inherited constructors do NOT initialize new members
//    added by the derived class. Use default member initializers for
//    those, or the new members will be left uninitialized (UB for
//    built-in types).
// -----------------------------------------------

class Animal {
protected:
    std::string name_;
    int age_;
public:
    Animal(std::string name, int age)
        : name_(std::move(name)), age_(age) {}

    Animal(std::string name)
        : name_(std::move(name)), age_(0) {}

    void info() const {
        std::cout << std::format("  {}, age {}", name_, age_);
    }
};

class Dog : public Animal {
    std::string breed_ = "Unknown";  // default member initializer — safe!
public:
    using Animal::Animal;  // inherit ALL constructors from Animal

    // Add a constructor that also takes breed
    Dog(std::string name, int age, std::string breed)
        : Animal(std::move(name), age), breed_(std::move(breed)) {}

    void info() const {
        Animal::info();
        std::cout << std::format(", breed: {}\n", breed_);
    }
};

// -----------------------------------------------
// 2. std::initializer_list constructor
//    What: An initializer_list constructor accepts a brace-enclosed list of values of a single type.
//    When: Use this when your class should support brace initialization with a variable number of homogeneous elements (e.g., {1, 2, 3}).
//    Why: It provides natural container-like initialization syntax and is strongly preferred by the compiler during {} overload resolution.
//    Use: Accept std::initializer_list<T> as a constructor parameter; use () instead of {} when you need to bypass it.
//    Which: C++11
//
//    HOW IT WORKS:
//    std::initializer_list<T> is a lightweight wrapper around a temporary
//    array of T. When you write MyClass obj{1, 2, 3}, the compiler creates
//    a temporary array {1, 2, 3} and passes an initializer_list pointing
//    to it. The list is valid only during the constructor call.
//
//    HOW OVERLOAD RESOLUTION WORKS:
//    When you use {} initialization and an initializer_list constructor
//    exists, the compiler STRONGLY PREFERS it over other constructors.
//    This is why std::vector<int>{10} creates a vector with one element
//    (10), not ten elements — the initializer_list ctor wins.
//
//    Watch out: if you provide both a regular constructor and an
//    initializer_list constructor, {} always picks the initializer_list
//    version. Use () to call the regular constructor:
//      MyVec v(5, 0);   // calls MyVec(size_t count, int value)
//      MyVec v{5, 0};   // calls MyVec(initializer_list<int>) with {5, 0}
// -----------------------------------------------

class IntList {
    std::vector<int> data_;
    std::string label_;

public:
    // Regular constructor: create n copies of value
    IntList(std::size_t count, int value, std::string label = "list")
        : data_(count, value), label_(std::move(label)) {}

    // Initializer list constructor: accept {1, 2, 3, ...}
    IntList(std::initializer_list<int> init, std::string label = "list")
        : data_(init), label_(std::move(label))
    {
        std::cout << std::format("  initializer_list ctor called with {} elements\n",
                                  init.size());
    }

    void print() const {
        std::cout << std::format("  [{}]: ", label_);
        for (int n : data_) std::cout << n << ' ';
        std::cout << std::format("(size={})\n", data_.size());
    }
};

// -----------------------------------------------
// 3. Aggregate initialization — no constructor needed
//    What: Aggregate initialization lets you initialize a class with no user-declared constructors directly from a brace-enclosed list of values.
//    When: Use this for simple data-holder types (DTOs, config structs) that have no invariants to enforce.
//    Why: It avoids writing constructors entirely — the compiler initializes members in declaration order from the provided values.
//    Use: Keep the type free of user-declared constructors, private data members, and virtual functions to preserve aggregate status.
//    Which: C++98+ (relaxed in C++14/17; stricter user-declared constructor rules in C++20)
//
//    HOW IT WORKS:
//    An aggregate is a class/struct with:
//      - No user-declared constructors (C++20 relaxes: no user-DECLARED)
//      - No private/protected non-static data members
//      - No virtual functions
//      - No virtual/private/protected base classes
//
//    Aggregates can be initialized with {value1, value2, ...} without
//    any constructor. The compiler initializes members in declaration
//    order. Missing values are value-initialized (zero for built-ins,
//    default-constructed for classes).
//
//    WHY AGGREGATES MATTER:
//    They are the simplest data types — just a bundle of fields.
//    No invariants to enforce, no encapsulation needed. Use them for
//    DTOs, configuration structs, and return types.
//
//    Watch out: adding a user-declared constructor (even = default
//    inside the class body) removes aggregate status. C++20 made this
//    rule STRICTER, not more lenient: any user-declared constructor
//    (including = default inside the class) disqualifies a type as an
//    aggregate. To keep aggregate status, declare no constructors at all.
// -----------------------------------------------

struct Point3D {
    double x;
    double y;
    double z;
    // No constructors — this is an aggregate

    double magnitude() const {
        return std::sqrt(x * x + y * y + z * z);
    }
};

struct Color {
    uint8_t r = 0;
    uint8_t g = 0;
    uint8_t b = 0;
    uint8_t a = 255;  // default alpha: fully opaque
    // Aggregate with default member initializers
};

// -----------------------------------------------
// 4. Designated initializers (C++20) — named field initialization
//    What: Designated initializers let you name aggregate fields directly in brace initialization.
//    When: Use this for aggregate types when naming each initialized field improves clarity and safety.
//    Why: They improve readability and reduce bugs from positional argument ordering mistakes.
//    Use: Initialize aggregates with `.member = value` entries in braces for explicit field intent.
//    Which: C++20
//
//    HOW IT WORKS:
//    When initializing an aggregate, you can name the fields:
//      Point3D p{.x = 1.0, .y = 2.0, .z = 3.0};
//    Un-named fields use their default member initializer or are
//    value-initialized (zero).
//
//    RULES:
//    - Designators must appear in declaration order (unlike C99).
//    - You can skip fields, but you can't reorder them.
//    - Only works with aggregates (no user-declared constructors).
//
//    Watch out: C++ designated initializers are MORE restrictive than
//    C99 designated initializers. You cannot use out-of-order
//    designators or designate array elements. This is because C++
//    guarantees left-to-right evaluation order.
// -----------------------------------------------

struct ServerConfig {
    std::string host = "localhost";
    int port = 8080;
    int max_connections = 100;
    bool tls_enabled = false;
    int timeout_ms = 30000;
};

// -----------------------------------------------
// 5. Converting constructor vs explicit — how implicit conversion works
//    What: A converting constructor is a non-explicit constructor callable with one argument, enabling implicit type conversion to the class type.
//    When: Use a converting (non-explicit) constructor only when implicit conversion is semantically meaningful and safe for callers.
//    Why: Implicit conversions can hide bugs by silently constructing temporaries; explicit prevents this and forces intentional construction.
//    Use: Default to explicit on single-argument constructors; omit it only when the conversion is natural and expected by users of the type.
//    Which: C++98+ (explicit(bool) conditional form added in C++20)
//
//    HOW IMPLICIT CONVERSION HAPPENS:
//    When a function expects type A but receives type B, the compiler
//    looks for a way to convert B → A. If A has a non-explicit
//    constructor that accepts B, the compiler silently creates a
//    temporary A from B. This is called an "implicit converting
//    constructor."
//
//    THE CONVERSION CHAIN:
//    The compiler will apply AT MOST ONE user-defined implicit
//    conversion. So if A(B) exists and B(C) exists, passing a C
//    where A is expected does NOT work — that would require two
//    user-defined conversions.
//
//    Watch out: the conversion creates a TEMPORARY. If a function
//    takes a non-const reference (A&), an implicit conversion
//    won't bind because temporaries can't bind to non-const refs.
//    This is a common source of "no matching function" errors.
// -----------------------------------------------

class Kilometers {
    double value_;
public:
    // NOT explicit — allows implicit conversion from double
    Kilometers(double v) : value_(v) {}
    double value() const { return value_; }
};

class Miles {
    double value_;
public:
    // explicit — prevents accidental implicit conversion
    explicit Miles(double v) : value_(v) {}
    double value() const { return value_; }
};

void log_distance_km(Kilometers km) {
    std::cout << std::format("  Distance: {:.2f} km\n", km.value());
}

void log_distance_mi(Miles mi) {
    std::cout << std::format("  Distance: {:.2f} mi\n", mi.value());
}

// -----------------------------------------------
// 6. constexpr constructors — compile-time objects
//    What: constexpr enables compile-time evaluation when inputs are constant expressions.
//    When: Use this for pure computations or immutable data that can be resolved at compile time.
//    Why: It shifts work from runtime to compile time and can improve safety/performance.
//    Use: Mark eligible functions/objects constexpr and keep them valid for constant evaluation.
//    Which: C++11+ (expanded in later standards)
//
//    HOW IT WORKS:
//    A constexpr constructor allows the class to be used in constant
//    expressions. When you write "constexpr MyClass obj{...};", the
//    ENTIRE object is constructed at compile time and embedded in the
//    binary as constant data — zero runtime cost.
//
//    REQUIREMENTS (C++14+):
//    - The constructor body can have statements (loops, conditionals).
//    - All member types must be literal types (scalars, aggregates,
//      classes with constexpr constructors).
//    - No dynamic allocation (new/delete) unless C++20 transient.
//
//    Watch out: "constexpr MyClass obj{...};" guarantees compile-time.
//    "MyClass obj{...};" with a constexpr constructor does NOT — it
//    might run at runtime. Use constexpr/consteval to force it.
// -----------------------------------------------

class Vec2 {
    double x_, y_;
public:
    constexpr Vec2() : x_(0.0), y_(0.0) {}
    constexpr Vec2(double x, double y) : x_(x), y_(y) {}

    constexpr Vec2 operator+(const Vec2& other) const {
        return {x_ + other.x_, y_ + other.y_};
    }

    constexpr Vec2 operator*(double scalar) const {
        return {x_ * scalar, y_ * scalar};
    }

    constexpr double dot(const Vec2& other) const {
        return x_ * other.x_ + y_ * other.y_;
    }

    constexpr double magnitude_squared() const {
        return x_ * x_ + y_ * y_;
    }

    constexpr double x() const { return x_; }
    constexpr double y() const { return y_; }
};

// Compile-time lookup table built using constexpr constructor
constexpr auto build_unit_vectors() {
    std::array<Vec2, 8> dirs{};
    for (int i = 0; i < 8; ++i) {
        double angle = i * 3.14159265358979 / 4.0;
        // Note: std::cos/sin are not constexpr in C++20 standard,
        // so we use a simple approximation for demonstration
        dirs[i] = Vec2(
            (i == 0 || i == 7 || i == 1) ? 1.0 :
            (i == 3 || i == 4 || i == 5) ? -1.0 : 0.0,
            (i == 1 || i == 2 || i == 3) ? 1.0 :
            (i == 5 || i == 6 || i == 7) ? -1.0 : 0.0
        );
    }
    return dirs;
}

constexpr auto unit_directions = build_unit_vectors();

// -----------------------------------------------
// 7. Conversion operators — the other direction
//    What: Conversion operators define how an object can be converted from your type to another type.
//    When: Use this for domain types that need controlled conversion to another representation.
//    Why: They provide controlled interoperability while keeping conversion intent explicit to callers.
//    Use: Prefer explicit conversion operators and expose only conversions that preserve clear semantics.
//    Which: C++11+ (file discusses C++14, C++20, C++98)
//
//    HOW THEY RELATE TO CONSTRUCTORS:
//    A converting constructor converts FROM another type TO your class.
//    A conversion operator converts FROM your class TO another type.
//    Together they define how your class interacts with the type system.
//
//    operator T() const { return ...; }  — implicit conversion to T
//    explicit operator T() const { return ...; }  — explicit only
//
//    Watch out: implicit conversion operators (non-explicit) can cause
//    surprising overload ambiguity and silent bugs. Always prefer
//    explicit conversion operators. The notable exception is
//    operator bool(), which is almost always explicit.
// -----------------------------------------------

class Percentage {
    double value_;  // 0.0 to 100.0
public:
    explicit Percentage(double v) : value_(v) {}

    // Explicit conversion to double — requires static_cast or if()
    explicit operator double() const { return value_ / 100.0; }

    // Explicit conversion to bool — allows if(pct) but not int x = pct
    explicit operator bool() const { return value_ > 0.0; }

    double value() const { return value_; }
};

// =========================================
// Key Takeaways:
//   1. Use "using Base::Base;" to inherit all base-class constructors
//      when the derived class adds no new uninitialized members.
//   2. An initializer_list constructor is STRONGLY preferred during {}
//      initialization. Use () to bypass it when needed.
//   3. Aggregates are the simplest data types — no constructors needed.
//      Use designated initializers (C++20) for readable initialization.
//   4. constexpr constructors enable compile-time object creation —
//      embed lookup tables and constants directly in the binary.
//   5. Mark constructors and conversion operators explicit unless you
//      intentionally want implicit conversions (which is rare).
// =========================================

int main() {
    // ---- 1. Inheriting constructors ----
    std::cout << "--- Inheriting Constructors ---\n";
    Dog d1{"Rex", 5};           // uses inherited Animal(string, int)
    Dog d2{"Buddy"};            // uses inherited Animal(string)
    Dog d3{"Max", 3, "Husky"};  // uses Dog's own 3-arg ctor
    d1.info();
    d2.info();
    d3.info();

    // ---- 2. std::initializer_list ----
    std::cout << "\n--- std::initializer_list ---\n";
    IntList from_init{1, 2, 3, 4, 5};   // initializer_list ctor
    IntList from_count(5, 0);            // regular ctor: 5 zeros
    from_init.print();
    from_count.print();

    // Gotcha: {} prefers initializer_list
    IntList gotcha{5, 0};  // initializer_list with {5, 0}, NOT 5 zeros!
    gotcha.print();        // prints: 5 0 (size=2)

    // ---- 3. Aggregate initialization ----
    std::cout << "\n--- Aggregate Initialization ---\n";
    Point3D origin{};              // all zeros
    Point3D p{1.0, 2.0, 3.0};     // direct
    std::cout << std::format("  origin: ({},{},{}) magnitude={:.2f}\n",
                              origin.x, origin.y, origin.z, origin.magnitude());
    std::cout << std::format("  p:      ({},{},{}) magnitude={:.2f}\n",
                              p.x, p.y, p.z, p.magnitude());

    // Aggregate with default member initializers
    Color red{255, 0, 0};          // a defaults to 255
    Color semi{128, 128, 128, 50}; // override alpha
    std::cout << std::format("  red:  rgba({},{},{},{})\n", red.r, red.g, red.b, red.a);
    std::cout << std::format("  semi: rgba({},{},{},{})\n", semi.r, semi.g, semi.b, semi.a);

    // ---- 4. Designated initializers (C++20) ----
    std::cout << "\n--- Designated Initializers (C++20) ---\n";
    ServerConfig cfg{
        .host = "prod.example.com",
        .port = 443,
        // .max_connections skipped — uses default 100
        .tls_enabled = true,
        // .timeout_ms skipped — uses default 30000
    };
    std::cout << std::format("  host={} port={} max_conn={} tls={} timeout={}ms\n",
                              cfg.host, cfg.port, cfg.max_connections,
                              cfg.tls_enabled, cfg.timeout_ms);

    // ---- 5. Converting constructors ----
    std::cout << "\n--- Converting vs Explicit Constructors ---\n";

    log_distance_km(42.0);            // OK: implicit Kilometers(42.0)
    log_distance_km(Kilometers{42.0}); // OK: explicit construction

    // log_distance_mi(42.0);          // ERROR: Miles ctor is explicit
    log_distance_mi(Miles{42.0});      // OK: explicit construction

    // ---- 6. constexpr constructors ----
    std::cout << "\n--- constexpr Constructors ---\n";
    constexpr Vec2 a{3.0, 4.0};
    constexpr Vec2 b{1.0, 2.0};
    constexpr Vec2 c = a + b;
    constexpr double d = a.dot(b);

    static_assert(c.x() == 4.0);
    static_assert(c.y() == 6.0);
    static_assert(d == 11.0);

    std::cout << std::format("  ({},{}) + ({},{}) = ({},{})\n",
                              a.x(), a.y(), b.x(), b.y(), c.x(), c.y());

    // Compile-time lookup table
    static_assert(unit_directions[0].x() == 1.0);  // East
    std::cout << std::format("  unit_directions[0] (East):  ({},{})\n",
                              unit_directions[0].x(), unit_directions[0].y());
    std::cout << std::format("  unit_directions[2] (North): ({},{})\n",
                              unit_directions[2].x(), unit_directions[2].y());

    // ---- 7. Conversion operators ----
    std::cout << "\n--- Conversion Operators ---\n";
    Percentage pct{75.0};
    double ratio = static_cast<double>(pct);  // explicit conversion required
    std::cout << std::format("  {}% as ratio: {:.2f}\n", pct.value(), ratio);

    if (pct) {  // explicit operator bool — works in boolean context
        std::cout << "  Percentage is non-zero\n";
    }
    // int x = pct;  // ERROR: no implicit conversion to int

    Percentage zero{0.0};
    if (!zero) {  // operator bool returns false for 0%
        std::cout << "  Zero percentage is falsy\n";
    }

    return 0;
}
