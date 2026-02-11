/**
 * constructor_fundamentals.cpp - How Constructors Work in C++
 *
 * A constructor is a special member function the compiler calls automatically
 * whenever an object is created. Its job is to bring the object from raw,
 * uninitialized memory into a valid, usable state. Unlike regular functions,
 * constructors have no return type (not even void) and their name must match
 * the class name exactly.
 *
 * HOW IT WORKS UNDER THE HOOD:
 *   1. The compiler allocates raw storage (stack, heap, or static depending
 *      on how you create the object).
 *   2. Base-class constructors run first, in declaration order.
 *   3. Member sub-objects are initialized in the order they appear in the
 *      class definition — NOT the order in the initializer list.
 *   4. The constructor body executes.
 *   By the time the body runs, all members are already initialized.
 *
 * Standard: Constructors since C++98. Default member initializers (C++11),
 *   delegating constructors (C++11), explicit(bool) (C++20).
 * Prerequisites: See 02_oop/classes/ for basic class structure.
 * Reference: reference/en/cpp/language/constructor.html
 *            reference/en/cpp/language/default_constructor.html
 *            reference/en/cpp/language/initializer_list.html
 */

#include <iostream>
#include <format>
#include <string>
#include <vector>
#include <cassert>

// -----------------------------------------------
// 1. Default constructor
//    What: Constructors and special members define object initialization and ownership behavior.
//    When: Use this when class invariants and resource semantics must be explicit.
//    Why: It prevents lifetime bugs and makes copy/move behavior predictable.
//    Use: Define/default/delete special members to match ownership intent.
//    Which: C++98+ (major additions in C++11 and later)
//
//    A constructor that can be called with no arguments.
//
//    HOW THE COMPILER DECIDES:
//    - If you declare NO constructors at all, the compiler implicitly
//      generates a default constructor that default-initializes each member.
//    - If you declare ANY constructor (even a parameterized one), the
//      compiler does NOT generate a default constructor. You must write
//      one yourself or use "= default".
//    - "= default" asks the compiler to generate it even when you have
//      other constructors. It is trivial if all members are trivial.
//
//    Watch out: default-initialization of built-in types (int, double,
//    pointers) leaves them with indeterminate values — reading them is UB.
//    Always initialize built-in members, either in the initializer list
//    or with default member initializers (see section 3).
// -----------------------------------------------

class Widget {
    int id_;
    std::string name_;
public:
    // Compiler-generated default constructor: id_ is indeterminate (!),
    // name_ is default-constructed to "".
    // We explicitly default it to document intent:
    Widget() = default;

    // Because we declared the constructor above, this parameterized
    // constructor doesn't suppress the default one.
    Widget(int id, std::string name) : id_(id), name_(std::move(name)) {}

    int id() const { return id_; }
    const std::string& name() const { return name_; }
};

// -----------------------------------------------
// 2. Member initializer list — the RIGHT way to initialize
//    What: Constructors and special members define object initialization and ownership behavior.
//    When: Use this when class invariants and resource semantics must be explicit.
//    Why: It prevents lifetime bugs and makes copy/move behavior predictable.
//    Use: Define/default/delete special members to match ownership intent.
//    Which: C++98+ (major additions in C++11 and later)
//
//    HOW IT WORKS:
//    The initializer list appears after the colon (:) in the constructor
//    signature. Each member is initialized DIRECTLY with the value you
//    provide — no default-construction-then-assignment. This matters for:
//
//    (a) Efficiency: without the init list, the member is first
//        default-constructed, then assigned in the body. With the init
//        list, it is constructed once with the right value.
//
//    (b) Correctness: const members and reference members CANNOT be
//        assigned — they MUST be initialized via the init list.
//
//    (c) Order: members are initialized in DECLARATION ORDER in the
//        class, regardless of the order in the init list. Compilers
//        warn about mismatched order (-Wreorder).
//
//    Watch out: if member B's initialization depends on member A,
//    make sure A is declared BEFORE B in the class definition.
//    The init-list order is irrelevant — declaration order rules.
// -----------------------------------------------

class Connection {
    const int id_;               // const: must use init list
    std::string host_;
    int port_;
    std::string connection_string_;  // depends on host_ and port_

public:
    // Members are initialized in declaration order: id_, host_, port_,
    // connection_string_. The init list below happens to match, but even
    // if we reordered it, the actual initialization would follow the
    // class declaration order.
    Connection(int id, std::string host, int port)
        : id_(id),
          host_(std::move(host)),
          port_(port),
          connection_string_(std::format("{}:{}", host_, port_))  // safe: host_ and port_ already initialized
    {
        // By this point, ALL members are fully initialized.
        std::cout << std::format("  Connection {} to {} created\n",
                                  id_, connection_string_);
    }

    // BAD ORDER EXAMPLE (commented out):
    // If connection_string_ were declared BEFORE host_ and port_,
    // this init list would read uninitialized members — UB!
    // The compiler would warn with -Wreorder.

    const std::string& connection_string() const { return connection_string_; }
};

// -----------------------------------------------
// 3. Default member initializers (C++11) — in-class defaults
//    What: Default member initializers define per-member fallback values directly in the class definition.
//    When: Use this when multiple constructors should share the same safe defaults.
//    Why: It removes duplicated initialization code and prevents uninitialized built-in members.
//    Use: Initialize members at declaration and override only the members that differ in specific constructors.
//    Which: C++11
//
//    HOW IT WORKS:
//    You can provide a default value right where the member is declared.
//    If the constructor's init list does not mention that member, the
//    default member initializer is used. If the init list DOES mention
//    it, the init-list value wins and the default is ignored.
//
//    This is the best way to ensure built-in types are never left
//    uninitialized, and it reduces constructor boilerplate when many
//    constructors share the same default values.
//
//    Watch out: default member initializers are evaluated each time
//    a constructor that uses them runs — they are not "shared" or cached.
// -----------------------------------------------

class Config {
    // Default member initializers — safe, readable, no boilerplate
    int timeout_ms_ = 5000;
    int max_retries_ = 3;
    bool verbose_ = false;
    std::string endpoint_ = "localhost";

public:
    // Uses ALL defaults — zero boilerplate
    Config() = default;

    // Overrides only the endpoint; other members use their defaults
    explicit Config(std::string endpoint)
        : endpoint_(std::move(endpoint)) {}

    // Overrides everything
    Config(int timeout, int retries, bool verbose, std::string endpoint)
        : timeout_ms_(timeout),
          max_retries_(retries),
          verbose_(verbose),
          endpoint_(std::move(endpoint)) {}

    void print() const {
        std::cout << std::format("  timeout={}ms retries={} verbose={} endpoint={}\n",
                                  timeout_ms_, max_retries_, verbose_, endpoint_);
    }
};

// -----------------------------------------------
// 4. Delegating constructors (C++11) — one ctor calls another
//    What: Constructors and special members define object initialization and ownership behavior.
//    When: Use this when class invariants and resource semantics must be explicit.
//    Why: It prevents lifetime bugs and makes copy/move behavior predictable.
//    Use: Define/default/delete special members to match ownership intent.
//    Which: C++98+ (major additions in C++11 and later)
//
//    HOW IT WORKS:
//    Instead of initializing members directly, a delegating constructor
//    calls another constructor of the SAME class in its init list.
//    The target constructor runs FIRST (fully initializing the object),
//    then the delegating constructor's body runs.
//
//    This avoids duplicating initialization logic across multiple
//    constructors. The target constructor does the real work; the
//    delegating constructor adds parameter conversion or defaults.
//
//    Watch out: a delegating constructor CANNOT have any other members
//    in its init list — it's either delegation OR direct initialization,
//    never both. This is a compile error:
//      Foo() : Foo(42), x_(0) {}  // ERROR: cannot mix delegation and members
//
//    Watch out: circular delegation (A calls B calls A) is undefined
//    behavior. The compiler may or may not catch it.
// -----------------------------------------------

class Logger {
    std::string prefix_;
    bool enabled_;
    int level_;

public:
    // "Real" constructor — does all the work
    Logger(std::string prefix, bool enabled, int level)
        : prefix_(std::move(prefix)), enabled_(enabled), level_(level) {
        std::cout << std::format("  Logger created: prefix='{}' enabled={} level={}\n",
                                  prefix_, enabled_, level_);
    }

    // Delegating: provide defaults for enabled and level
    explicit Logger(std::string prefix)
        : Logger(std::move(prefix), true, 1) {}  // delegates to the 3-arg ctor

    // Delegating: full default
    Logger() : Logger("DEFAULT") {}  // delegates to the 1-arg, which delegates to the 3-arg

    const std::string& prefix() const { return prefix_; }
};

// -----------------------------------------------
// 5. explicit — preventing implicit conversions
//    What: Constructors and special members define object initialization and ownership behavior.
//    When: Use this when class invariants and resource semantics must be explicit.
//    Why: It prevents lifetime bugs and makes copy/move behavior predictable.
//    Use: Define/default/delete special members to match ownership intent.
//    Which: C++98+ (major additions in C++11 and later)
//
//    HOW IT WORKS:
//    By default, a constructor that takes a single argument can be used
//    as an implicit conversion: f(Widget w) can be called as f(42) if
//    Widget has Widget(int). The explicit keyword disables this —
//    the caller must write f(Widget(42)) or f(Widget{42}).
//
//    WHY THIS MATTERS:
//    Implicit conversions hide bugs. If a function expects a Meters
//    object and you pass a raw int, the compiler silently creates a
//    temporary Meters — possibly with the wrong meaning. explicit
//    forces the caller to be intentional.
//
//    C++20 adds explicit(bool): explicit(true) is the same as explicit,
//    explicit(false) is the same as non-explicit. Useful in templates
//    where you want to conditionally be explicit.
//
//    Watch out: this applies to ANY constructor callable with one
//    argument, including multi-arg constructors with defaults:
//      Foo(int x, int y = 0)  // callable with one arg → can convert
// -----------------------------------------------

class Meters {
    double value_;
public:
    // explicit: prevents "Meters m = 5.0;" and passing a raw double
    // where a Meters is expected
    explicit Meters(double v) : value_(v) {}

    double value() const { return value_; }
};

class Feet {
    double value_;
public:
    explicit Feet(double v) : value_(v) {}
    double value() const { return value_; }
};

// This function requires the caller to be explicit about units
void print_distance(Meters m) {
    std::cout << std::format("  Distance: {:.2f} meters\n", m.value());
}

// -----------------------------------------------
// 6. Initialization syntax — () vs {} vs =
//    What: `()`, `{}`, and `=` select different initialization forms with different conversion and overload rules.
//    When: Use `{}` by default for narrowing safety, and use `()` when constructor overload behavior requires it.
//    Why: The chosen form changes overload resolution, narrowing checks, and `std::initializer_list` selection.
//    Use: Pick the initialization form intentionally based on the constructor and conversion semantics you want.
//    Which: C++11+ (copy elision guarantees strengthened in C++17)
//
//    HOW EACH FORM WORKS:
//
//    (a) Direct initialization:     Widget w(42, "hello");
//        Calls the matching constructor directly. Allows implicit
//        narrowing conversions (double → int).
//
//    (b) List initialization:       Widget w{42, "hello"};
//        Calls the matching constructor, but PREVENTS narrowing
//        conversions (double → int is a compile error). Preferred
//        in modern C++.
//
//    (c) Copy initialization:       Widget w = Widget(42, "hello");
//        Conceptually creates a temporary and copies/moves it, but
//        the compiler always elides the copy (guaranteed since C++17).
//
//    (d) Copy-list-initialization:  Widget w = {42, "hello"};
//        Like (b) but the constructor must not be explicit.
//
//    Watch out: {} with a single std::initializer_list constructor
//    can be surprising. std::vector<int> v{10} creates a vector
//    with ONE element (10), not ten elements. Use () for size:
//    std::vector<int> v(10) creates ten zero-initialized elements.
// -----------------------------------------------

class Temperature {
    double celsius_;
public:
    explicit Temperature(double c) : celsius_(c) {}
    double celsius() const { return celsius_; }
    double fahrenheit() const { return celsius_ * 9.0 / 5.0 + 32.0; }
};

// -----------------------------------------------
// 7. = default vs = delete
//    What: `= default` asks the compiler to generate a function, while `= delete` explicitly forbids one.
//    When: Use these to make construction, copy, and move capabilities match ownership and API constraints.
//    Why: They encode intent in the type and stop invalid operations at compile time.
//    Use: Default operations you want to preserve and delete operations that would violate class invariants.
//    Which: C++11
//
//    HOW THEY WORK:
//    = default: tells the compiler to generate the default
//    implementation even when other constructors suppress it.
//    The generated constructor is trivial if all members are trivial.
//
//    = delete: makes the constructor unusable. Any attempt to call
//    it is a compile error. Use it to prevent specific operations:
//    - Delete copy ctor/assignment to make a class move-only
//    - Delete certain overloads to prevent implicit conversions
//
//    Watch out: = delete participates in overload resolution — the
//    deleted overload is FOUND, then the call is rejected. This is
//    different from not declaring it at all. A deleted function is
//    "declared but forbidden."
// -----------------------------------------------

class Singleton {
public:
    Singleton(const Singleton&) = delete;             // no copying
    Singleton& operator=(const Singleton&) = delete;  // no copy-assignment

    static Singleton& instance() {
        static Singleton s;  // thread-safe since C++11 (magic statics)
        return s;
    }

    void greet() const { std::cout << "  Singleton instance\n"; }

private:
    Singleton() = default;  // only instance() can create one
};

// Prevent calling with bool (would silently convert to int)
class StrictInt {
    int value_;
public:
    explicit StrictInt(int v) : value_(v) {}
    StrictInt(bool) = delete;  // calling StrictInt(true) is now a compile error
    int value() const { return value_; }
};

// =========================================
// Key Takeaways:
//   1. Members are initialized in declaration order, not init-list order.
//      Depend on this. The compiler warns about mismatches (-Wreorder).
//   2. Always use member initializer lists — they avoid double-initialization
//      and are required for const/reference members.
//   3. Use default member initializers (C++11) to set safe defaults and
//      reduce boilerplate across multiple constructors.
//   4. Mark single-argument constructors explicit unless you genuinely
//      want implicit conversion (which is rare).
//   5. Prefer {} initialization in modern C++ — it prevents narrowing
//      conversions and is consistent. Use () only for std::vector size
//      or other std::initializer_list ambiguities.
// =========================================

int main() {
    // ---- 1. Default constructor ----
    std::cout << "--- Default Constructor ---\n";
    Widget w1;            // default: id_ is indeterminate, name_ is ""
    Widget w2{42, "gadget"};
    std::cout << std::format("  w2: id={}, name={}\n", w2.id(), w2.name());

    // ---- 2. Member initializer list & initialization order ----
    std::cout << "\n--- Member Initializer List ---\n";
    Connection conn{1, "database.example.com", 5432};
    std::cout << std::format("  connection_string: {}\n", conn.connection_string());

    // ---- 3. Default member initializers ----
    std::cout << "\n--- Default Member Initializers ---\n";
    Config default_cfg;
    Config custom_endpoint{"api.example.com"};
    Config full_custom{10000, 5, true, "prod.example.com"};

    std::cout << "  default: ";   default_cfg.print();
    std::cout << "  custom:  ";   custom_endpoint.print();
    std::cout << "  full:    ";   full_custom.print();

    // ---- 4. Delegating constructors ----
    std::cout << "\n--- Delegating Constructors ---\n";
    Logger log1;                        // Logger() → Logger("DEFAULT") → Logger("DEFAULT", true, 1)
    Logger log2{"APP"};                 // Logger("APP") → Logger("APP", true, 1)
    Logger log3{"DB", false, 3};        // Direct — no delegation

    // ---- 5. explicit ----
    std::cout << "\n--- explicit Keyword ---\n";
    Meters m{100.0};     // OK: direct list initialization
    // Meters m2 = 100.0; // ERROR: implicit conversion blocked by explicit
    // print_distance(100.0);  // ERROR: can't implicitly convert double to Meters
    print_distance(Meters{100.0});  // OK: explicit construction

    // ---- 6. Initialization syntax ----
    std::cout << "\n--- Initialization Syntax ---\n";
    Temperature t1(100.0);    // direct init: OK
    Temperature t2{100.0};    // list init: OK, prevents narrowing
    // Temperature t3{100};   // NARROWING: int → double, but double accepts int... actually OK
    // Temperature t4 = 100.0; // ERROR: explicit constructor blocks copy-init

    std::cout << std::format("  t1: {:.1f}C = {:.1f}F\n", t1.celsius(), t1.fahrenheit());
    std::cout << std::format("  t2: {:.1f}C = {:.1f}F\n", t2.celsius(), t2.fahrenheit());

    // Demonstrate {} vs () with std::vector
    std::vector<int> ten_zeros(10);     // 10 elements, all 0
    std::vector<int> one_ten{10};       // 1 element with value 10
    std::cout << std::format("  vector(10): size={}\n", ten_zeros.size());
    std::cout << std::format("  vector{{10}}: size={}, [0]={}\n",
                              one_ten.size(), one_ten[0]);

    // ---- 7. = default and = delete ----
    std::cout << "\n--- = default / = delete ---\n";
    Singleton::instance().greet();
    // Singleton s2 = Singleton::instance();  // ERROR: copy deleted

    StrictInt si{42};
    // StrictInt bad{true};  // ERROR: bool overload is deleted
    std::cout << std::format("  StrictInt: {}\n", si.value());

    return 0;
}
