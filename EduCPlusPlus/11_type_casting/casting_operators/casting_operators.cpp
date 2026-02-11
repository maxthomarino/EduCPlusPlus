/**
 * casting_operators.cpp - The Four C++ Cast Operators
 *
 * C inherited a single all-powerful cast syntax: (Type)expr. It can do
 * almost anything — strip const, reinterpret bits, traverse class
 * hierarchies — and that's the problem: because it does everything, the
 * compiler can't warn you when you do something dangerous by accident.
 *
 * C++ replaces the C-style cast with four named casts, each with a
 * narrow, well-defined purpose. If you ask for a cast that a specific
 * operator cannot perform, the compiler rejects it. This is by design:
 * the casts are intentionally restricted so the code signals what KIND
 * of conversion you intend.
 *
 *   static_cast      — safe, compile-time checked conversions
 *   dynamic_cast     — runtime-checked downcast in a class hierarchy
 *   const_cast       — add or remove const/volatile qualifiers
 *   reinterpret_cast — raw bit reinterpretation (no conversion)
 *
 * RULE OF THUMB:
 *   Use static_cast for 95% of casts. Reach for the others only when
 *   static_cast cannot do what you need.
 *
 * Prerequisites: Classes, inheritance, virtual functions, pointers.
 * Reference:     reference/en/cpp/language/static_cast.html
 *                reference/en/cpp/language/dynamic_cast.html
 *                reference/en/cpp/language/const_cast.html
 *                reference/en/cpp/language/reinterpret_cast.html
 */

#include <iostream>
#include <format>
#include <string>
#include <cassert>
#include <memory>

// =====================================================
// FREQUENTLY ASKED QUESTIONS (first-timer Q&A)
// =====================================================
//
// Q: Why not just use (int)x like in C?
// A: C-style casts silently fall through a priority list: they try
//    const_cast, then static_cast, then reinterpret_cast, picking
//    whichever first succeeds. You have no control over WHICH kind
//    of conversion actually happens. The named casts make your
//    intent explicit and let the compiler reject unintended casts.
//
// Q: Doesn't casting mean my design is wrong?
// A: Not always, but frequent casting IS a code smell. Common
//    legitimate uses: interfacing with C libraries (void*), numeric
//    conversions, and the rare downcast when you know the dynamic type.
//    If you cast constantly, reconsider your class hierarchy.
//
// Q: Can I use auto instead of casting?
// A: auto deduces types, it doesn't convert them. If a function
//    returns int and you need double, auto gives you int. You still
//    need a cast to change the type of an existing value.
//
// Q: What about std::bit_cast (C++20)?
// A: std::bit_cast<To>(from) is the modern replacement for type-punning
//    with reinterpret_cast. It copies the raw bytes from one type into
//    another, but it's constexpr-safe, well-defined, and requires both
//    types to be trivially copyable and the same size.
//    Use std::bit_cast for "show me the bits" scenarios.
// =====================================================

// -----------------------------------------------
// Class hierarchy for dynamic_cast demonstrations
// -----------------------------------------------
class Animal {
public:
    // virtual destructor is REQUIRED for dynamic_cast.
    // Without at least one virtual function, the class has no vtable,
    // and dynamic_cast has no RTTI (Run-Time Type Information) to use.
    virtual ~Animal() = default;

    virtual std::string speak() const { return "..."; }
    std::string name() const { return name_; }

protected:
    explicit Animal(std::string name) : name_(std::move(name)) {}

private:
    std::string name_;
};

class Dog : public Animal {
public:
    explicit Dog(std::string name) : Animal(std::move(name)) {}
    std::string speak() const override { return "Woof!"; }

    // Dog-specific method — only accessible after downcasting
    void fetch() const {
        std::cout << std::format("  {} fetches the ball!\n", name());
    }
};

class Cat : public Animal {
public:
    explicit Cat(std::string name) : Animal(std::move(name)) {}
    std::string speak() const override { return "Meow!"; }

    void purr() const {
        std::cout << std::format("  {} purrs...\n", name());
    }
};

// -----------------------------------------------
// A legacy C-style API that uses void* (common in C libraries)
// -----------------------------------------------
struct SensorData {
    double temperature;
    double humidity;
};

void process_raw_data(void* data, int type_id) {
    // In real C APIs, void* is the universal "I don't know the type"
    // pointer. You must cast it back to the correct type yourself.
    if (type_id == 1) {
        auto* sensor = static_cast<SensorData*>(data);
        std::cout << std::format("  Temp: {:.1f}°C, Humidity: {:.1f}%\n",
                                  sensor->temperature, sensor->humidity);
    }
}

// -----------------------------------------------
// A function with a const-correct interface that wraps a const-incorrect
// legacy function (the classic const_cast use case)
// -----------------------------------------------
// Imagine this comes from an old C library — it takes char* but
// does NOT actually modify the string. The library just wasn't
// written with const in mind.
void legacy_print(char* message) {
    std::cout << std::format("  Legacy says: {}\n", message);
}

void safe_legacy_print(const std::string& message) {
    // const_cast is justified here because we KNOW legacy_print
    // does not modify the data. We're undoing the const only to
    // satisfy a sloppy C function signature.
    legacy_print(const_cast<char*>(message.c_str()));
}

// =====================================================
// HOW THE COMPILER IMPLEMENTS EACH CAST
// =====================================================
//
// static_cast:
//   The compiler resolves the conversion entirely at COMPILE TIME.
//   For numeric types, it generates the appropriate machine instruction
//   (e.g., cvtsi2sd for int -> double on x86). For class hierarchies,
//   it adjusts the pointer by a compile-time-known offset (the position
//   of the base sub-object within the derived object's memory layout).
//   No runtime check occurs — if the object isn't actually the target
//   type, you get undefined behavior silently.
//
//   Memory layout example (simplified):
//
//     Dog object in memory:
//     [  vtable_ptr  |  Animal::name_  |  Dog-specific data  ]
//     ^                ^
//     |                +-- Animal sub-object starts here
//     +-- Dog* points here
//
//   static_cast<Animal*>(dog_ptr) simply returns dog_ptr + 0 (or
//   a fixed offset if multiple inheritance is involved). It's just
//   pointer arithmetic — no runtime cost.
//
// dynamic_cast:
//   The compiler generates a call to __dynamic_cast() (or the platform
//   equivalent) that inspects the vtable pointer at runtime. The vtable
//   points to the type_info structure for the object's ACTUAL (most-
//   derived) type. The runtime walks the inheritance graph to check
//   whether the cast is valid. If it is, it returns the adjusted pointer;
//   if not, it returns nullptr (for pointers) or throws std::bad_cast
//   (for references).
//
//   This is why dynamic_cast requires the source type to be polymorphic
//   (have at least one virtual function) — without a vtable, there is
//   no type_info to inspect.
//
//   Cost: roughly equivalent to a few virtual function calls. Not free,
//   but not expensive either. Avoid in tight loops if you can.
//
// const_cast:
//   Generates NO machine code at all. const and volatile are compile-time
//   qualifiers that restrict what the programmer can do through that
//   name/pointer. Removing them changes nothing at the machine level.
//   The pointer value is identical before and after const_cast.
//
// reinterpret_cast:
//   Also generates NO machine code in most cases — it just tells the
//   compiler "treat these bits as a different type." The pointer value
//   is unchanged. However, actually USING the result may violate strict
//   aliasing rules and cause undefined behavior. The compiler assumes
//   pointers to unrelated types don't alias, and will optimize based
//   on that assumption. std::bit_cast (C++20) is the safe alternative
//   for reinterpreting bytes.
// =====================================================

int main() {
    // =================================================
    // 1. static_cast — the workhorse cast
    //    What: static_cast performs compile-time checked conversions where rules are known at compile time.
    //    When: Use this for numeric conversions, explicit enum conversions, and safe upcasts.
    //    Why: It makes conversion intent explicit and avoids C-style cast ambiguity.
    //    Use: Write static_cast<T>(expr) only when the conversion is expected and well-defined.
    //    Which: C++98+
    //
    //    Performs well-defined conversions the compiler can verify:
    //    - Numeric conversions (int -> double, double -> int)
    //    - Upcasts in a class hierarchy (Derived* -> Base*)
    //    - Downcasts in a class hierarchy (Base* -> Derived*) —
    //      but WITHOUT runtime checking! You must be sure of the type.
    //    - enum to int and back
    //    - void* to typed pointer
    //
    //    Watch out: static_cast downcast is UNCHECKED. If the object
    //    isn't actually the target type, you get undefined behavior.
    //    Use dynamic_cast if you're not 100% sure of the type.
    // =================================================
    std::cout << "=== 1. static_cast ===\n\n";

    // --- 1a. Numeric conversions ---
    std::cout << "--- 1a. Numeric conversions ---\n";
    int whole = 42;
    double precise = static_cast<double>(whole);
    std::cout << std::format("  int {} -> double {:.1f}\n", whole, precise);

    double pi = 3.14159;
    int truncated = static_cast<int>(pi);
    // Watch out: this TRUNCATES toward zero, it does NOT round.
    // 3.14159 becomes 3, -3.7 becomes -3 (not -4).
    std::cout << std::format("  double {:.5f} -> int {} (truncated, NOT rounded)\n",
                              pi, truncated);

    // Without the cast, the compiler warns about narrowing.
    // static_cast silences the warning AND documents your intent.
    // Compare:
    //   int x = pi;                  // warning: implicit narrowing
    //   int x = static_cast<int>(pi); // explicit: "I know I'm truncating"

    // --- 1b. Enum conversions ---
    std::cout << "\n--- 1b. Enum conversions ---\n";
    enum class Color { Red, Green, Blue };
    Color c = Color::Green;
    int color_value = static_cast<int>(c);
    std::cout << std::format("  Color::Green = {}\n", color_value);

    // And back from int to enum (useful when reading from files/network)
    Color restored = static_cast<Color>(2);
    std::cout << std::format("  static_cast<Color>(2) == Color::Blue? {}\n",
                              restored == Color::Blue);
    // Watch out: the compiler does NOT check that the int value is
    // a valid enumerator. static_cast<Color>(999) compiles fine but
    // produces a Color with no corresponding named value.

    // --- 1c. void* to typed pointer ---
    std::cout << "\n--- 1c. void* to typed pointer ---\n";
    SensorData sensor{22.5, 65.0};
    void* raw_ptr = &sensor;  // Any pointer implicitly converts to void*
    // Getting it back requires a cast:
    auto* typed_ptr = static_cast<SensorData*>(raw_ptr);
    std::cout << std::format("  Temperature: {:.1f}°C\n", typed_ptr->temperature);
    // Watch out: if raw_ptr doesn't actually point to a SensorData,
    // this is undefined behavior. The compiler cannot check the type
    // of a void* — you must track it yourself.

    // --- 1d. Class hierarchy upcast / downcast ---
    std::cout << "\n--- 1d. Hierarchy casts ---\n";
    Dog rex("Rex");
    // Upcast: Dog* -> Animal* (always safe, implicit, but can be explicit)
    Animal* animal_ptr = static_cast<Animal*>(&rex);
    std::cout << std::format("  Upcast: {} says {}\n",
                              animal_ptr->name(), animal_ptr->speak());

    // Downcast: Animal* -> Dog* (safe here because we KNOW it's a Dog)
    Dog* dog_ptr = static_cast<Dog*>(animal_ptr);
    dog_ptr->fetch();
    // If animal_ptr pointed to a Cat, this would be undefined behavior!
    // Use dynamic_cast when unsure.

    // =================================================
    // 2. dynamic_cast — runtime-checked hierarchy cast
    //    What: dynamic_cast performs runtime-checked casts in polymorphic class hierarchies.
    //    When: Use this for downcasts when the dynamic type is uncertain.
    //    Why: It fails safely (nullptr or bad_cast) instead of causing unchecked UB.
    //    Use: Use pointer form and test for nullptr, or reference form inside try/catch.
    //    Which: C++98+
    //
    //    Works ONLY on polymorphic types (classes with at least one
    //    virtual function). Inspects the actual object type at runtime.
    //
    //    For pointers: returns nullptr if the cast is invalid.
    //    For references: throws std::bad_cast if invalid.
    //
    //    Watch out: dynamic_cast has a small runtime cost (RTTI lookup).
    //    Don't use it in performance-critical inner loops. If you know
    //    the type statically, prefer static_cast.
    //
    //    Q: When should I use dynamic_cast vs static_cast for downcasts?
    //    A: Use dynamic_cast when you receive a base pointer from external
    //       code and don't KNOW the derived type. Use static_cast when
    //       you have a guarantee (e.g., a type tag or the code path
    //       ensures the type). In doubt, use dynamic_cast — safety over speed.
    // =================================================
    std::cout << "\n=== 2. dynamic_cast ===\n\n";

    // Create animals and store as base pointers (common pattern)
    std::unique_ptr<Animal> animals[] = {
        std::make_unique<Dog>("Buddy"),
        std::make_unique<Cat>("Whiskers"),
        std::make_unique<Dog>("Max"),
    };

    // --- 2a. Pointer form: returns nullptr on failure ---
    std::cout << "--- 2a. Pointer form (nullptr on failure) ---\n";
    for (const auto& animal : animals) {
        std::cout << std::format("  {} says: {}\n",
                                  animal->name(), animal->speak());

        // Try to downcast to Dog*
        if (Dog* dog = dynamic_cast<Dog*>(animal.get())) {
            // This block ONLY executes if animal is actually a Dog.
            // The pattern "if (auto* p = dynamic_cast<T*>(expr))" is
            // idiomatic C++ — the variable is scoped to the if block.
            dog->fetch();
        }

        // Try to downcast to Cat*
        if (Cat* cat = dynamic_cast<Cat*>(animal.get())) {
            cat->purr();
        }
    }

    // --- 2b. Reference form: throws std::bad_cast on failure ---
    std::cout << "\n--- 2b. Reference form (throws on failure) ---\n";
    Dog buddy("Buddy");
    Animal& animal_ref = buddy;

    try {
        // We know this will succeed, but demonstrating the syntax
        Dog& dog_ref = dynamic_cast<Dog&>(animal_ref);
        std::cout << std::format("  Successfully cast {} to Dog&\n", dog_ref.name());

        // This will throw because buddy is a Dog, not a Cat
        [[maybe_unused]] Cat& cat_ref = dynamic_cast<Cat&>(animal_ref);
    } catch (const std::bad_cast& e) {
        std::cout << std::format("  bad_cast: {} (expected — it's a Dog, not a Cat)\n",
                                  e.what());
    }

    // --- 2c. Cross-casting (multiple inheritance) ---
    // dynamic_cast can also cast between sibling bases in a multiple
    // inheritance hierarchy — something static_cast CANNOT do.
    // We won't demo multiple inheritance here, but know that it's
    // one of dynamic_cast's unique capabilities.

    // =================================================
    // 3. const_cast — add or remove const/volatile
    //    What: const_cast is the only cast that can add or remove const/volatile qualifiers.
    //    When: Use this only for const-correctness interop where underlying data is actually mutable.
    //    Why: It supports rare legacy interfaces while keeping explicit intent.
    //    Use: Never modify an object originally declared const after casting away const.
    //    Which: C++98+
    //
    //    This is the ONLY cast that can change cv-qualifiers.
    //    static_cast cannot add or remove const.
    //
    //    LEGITIMATE USES (rare):
    //    1. Calling a legacy C function that takes non-const but
    //       doesn't actually modify the data.
    //    2. Implementing a const and non-const overload that share
    //       the same logic (the non-const version calls the const
    //       version and const_casts the result — see Scott Meyers).
    //
    //    Watch out: if you const_cast away const and then MODIFY an
    //    object that was originally declared const, it is UNDEFINED
    //    BEHAVIOR. The compiler may have placed it in read-only memory.
    //
    //    Q: Why is modifying a truly-const object undefined behavior?
    //    A: The compiler is allowed to place const objects in ROM (read-
    //       only memory), fold them into constants, or cache their value
    //       in registers. If you write through a const_cast pointer,
    //       the write might not take effect, might crash, or might
    //       silently corrupt other data. Never do this.
    // =================================================
    std::cout << "\n=== 3. const_cast ===\n\n";

    // --- 3a. Calling a legacy API ---
    std::cout << "--- 3a. Legacy C API interop ---\n";
    const std::string message = "Hello from const string";
    safe_legacy_print(message);
    // The string was not modified — const_cast was safe here because
    // legacy_print only reads the data.

    // --- 3b. Avoiding code duplication in const/non-const overloads ---
    std::cout << "\n--- 3b. const/non-const overload pattern ---\n";
    // A class that returns const or non-const access to internal data:
    struct TextBuffer {
        std::string data = "Hello, World!";

        // The const version — does the real work
        const char& char_at(std::size_t i) const {
            // Bounds checking, logging, etc. would go here
            return data[i];
        }

        // The non-const version — delegates to const version to avoid
        // duplicating the bounds-checking logic
        char& char_at(std::size_t i) {
            // 1. Cast 'this' to const to call the const overload
            // 2. const_cast the result back to non-const
            // This is safe because we KNOW 'this' is actually non-const
            // (otherwise the non-const overload wouldn't have been called)
            return const_cast<char&>(
                static_cast<const TextBuffer&>(*this).char_at(i)
            );
        }
    };

    TextBuffer buf;
    buf.char_at(0) = 'J';  // Uses non-const overload
    std::cout << std::format("  Modified buffer: {}\n", buf.data);

    const TextBuffer cbuf;
    char ch = cbuf.char_at(0);  // Uses const overload
    std::cout << std::format("  Const buffer first char: {}\n", ch);

    // --- 3c. DANGER: modifying a truly-const object ---
    // const int original_const = 42;
    // int* bad_ptr = const_cast<int*>(&original_const);
    // *bad_ptr = 99;  // UNDEFINED BEHAVIOR! original_const may be in ROM
    // Don't do this. Ever.
    std::cout << "\n  (Skipping UB demo — modifying a true const is undefined behavior)\n";

    // =================================================
    // 4. reinterpret_cast — raw bit reinterpretation
    //    What: reinterpret_cast reinterprets bits as another type without value conversion.
    //    When: Use this only for low-level tasks like byte views, hardware addresses, or ABI boundaries.
    //    Why: It enables systems-level interop that other casts cannot express.
    //    Use: Prefer safer alternatives (like std::bit_cast) when available and legal.
    //    Which: C++98+ (std::bit_cast in C++20)
    //
    //    Tells the compiler "treat this pointer/value as a completely
    //    different type." No conversion happens — the bits are unchanged.
    //
    //    LEGITIMATE USES:
    //    1. Casting to/from std::byte* or char* for serialization
    //       (this is explicitly allowed by the standard's aliasing rules)
    //    2. Interfacing with hardware registers at specific addresses
    //    3. Implementing type-erased containers (advanced)
    //
    //    Watch out: almost any other use violates the strict aliasing rule
    //    and is undefined behavior. The compiler assumes that pointers of
    //    unrelated types don't point to the same object, and it WILL
    //    optimize based on that assumption (reordering reads/writes,
    //    caching values in registers, etc.).
    //
    //    Q: What is the strict aliasing rule?
    //    A: The rule says: you may only access an object through a pointer
    //       or reference of (a) its actual type, (b) a compatible type,
    //       or (c) char/std::byte/unsigned char. Accessing an int through
    //       a float* is undefined behavior. reinterpret_cast makes it
    //       easy to violate this rule, which is why it should be rare.
    //
    //    Q: Should I use reinterpret_cast or std::bit_cast?
    //    A: Prefer std::bit_cast (C++20) for VALUE conversions (e.g.,
    //       "show me the bits of this float as an int"). Use
    //       reinterpret_cast only for POINTER conversions to char*/byte*
    //       for serialization, or for hardware addresses.
    // =================================================
    std::cout << "\n=== 4. reinterpret_cast ===\n\n";

    // --- 4a. Viewing raw bytes of a value (the safe char* exception) ---
    std::cout << "--- 4a. Viewing raw bytes ---\n";
    float value = 3.14f;
    // Casting to unsigned char* is explicitly allowed by the standard
    auto* bytes = reinterpret_cast<unsigned char*>(&value);
    std::cout << std::format("  float {:.2f} in memory: ", value);
    for (std::size_t i = 0; i < sizeof(float); ++i) {
        std::cout << std::format("{:02x} ", bytes[i]);
    }
    std::cout << '\n';
    // This is how debuggers, serializers, and network code inspect
    // the raw representation of values.

    // --- 4b. Integer <-> pointer (system programming) ---
    std::cout << "\n--- 4b. Integer <-> pointer ---\n";
    int some_value = 42;
    auto address = reinterpret_cast<std::uintptr_t>(&some_value);
    std::cout << std::format("  Address of some_value: {:#x}\n", address);
    // Going back from integer to pointer (useful for hardware registers):
    auto* back_to_ptr = reinterpret_cast<int*>(address);
    std::cout << std::format("  Value at that address: {}\n", *back_to_ptr);
    // This round-trip is guaranteed to work by the standard for uintptr_t.

    // --- 4c. Passing through a C void* callback ---
    std::cout << "\n--- 4c. void* callback (C API pattern) ---\n";
    SensorData reading{23.5, 70.0};
    // C APIs commonly use void* for user data in callbacks
    process_raw_data(&reading, 1);

    // =================================================
    // 5. DECISION GUIDE: Which cast should I use?
    //    What: This section summarizes how to choose the correct cast for each conversion intent.
    //    When: Use this checklist whenever you are about to write an explicit cast.
    //    Why: Choosing the narrowest valid cast reduces undefined behavior risk.
    //    Use: Start with static_cast, escalate only when requirements demand another cast.
    //    Which: Applies across modern C++
    //
    // =================================================
    //
    // Need to convert between numeric types?
    //   -> static_cast<TargetType>(value)
    //
    // Need to upcast Derived* -> Base*?
    //   -> Usually implicit, but static_cast is fine for clarity
    //
    // Need to downcast Base* -> Derived* and you KNOW the type?
    //   -> static_cast<Derived*>(base_ptr)
    //
    // Need to downcast but you're NOT SURE of the actual type?
    //   -> dynamic_cast<Derived*>(base_ptr) and check for nullptr
    //
    // Need to call a C function that takes non-const but doesn't modify?
    //   -> const_cast<char*>(str.c_str())
    //
    // Need to inspect raw bytes or interface with hardware?
    //   -> reinterpret_cast<unsigned char*>(&value)
    //
    // Need to reinterpret bits of a value as another type?
    //   -> std::bit_cast<TargetType>(value)   (C++20, prefer this)
    //
    // None of the above?
    //   -> You probably don't need a cast. Rethink your design.
    //
    // NEVER use C-style casts: (int)x or int(x).
    // They hide the intent and can silently do dangerous things.
    // =================================================

    std::cout << "\n=== Summary ===\n";
    std::cout << "  static_cast      : compile-time checked, safe conversions\n";
    std::cout << "  dynamic_cast     : runtime-checked downcast (needs virtual)\n";
    std::cout << "  const_cast       : add/remove const (use sparingly)\n";
    std::cout << "  reinterpret_cast : raw bit reinterpretation (use rarely)\n";

    return 0;
}
