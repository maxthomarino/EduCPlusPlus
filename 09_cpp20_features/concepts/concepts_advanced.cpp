/**
 * concepts_advanced.cpp - Advanced C++20 Concepts
 *
 * Builds on concepts_intro.cpp (in 06_templates/concepts/).
 * Demonstrates: concept composition, requires expressions,
 * nested requirements, subsumption, and real-world patterns.
 */

#include <iostream>
#include <format>
#include <concepts>
#include <string>
#include <vector>
#include <memory>
#include <type_traits>

// -----------------------------------------------
// 1. requires-expression: test complex requirements
//    Checks if expressions are valid, their types, etc.
// -----------------------------------------------
template<typename T>
concept Printable = requires(T t, std::ostream& os) {
    { os << t } -> std::same_as<std::ostream&>;  // Must support <<
};

template<typename T>
concept Hashable = requires(T t) {
    { std::hash<T>{}(t) } -> std::convertible_to<std::size_t>;
};

// -----------------------------------------------
// 2. Compound requirements with nested requires
// -----------------------------------------------
template<typename T>
concept Serializable = requires(T t) {
    // Simple requirement: expression must be valid
    t.serialize();

    // Compound requirement: check return type
    { t.serialize() } -> std::convertible_to<std::string>;

    // Nested requirement: additional constraint
    requires std::is_default_constructible_v<T>;
};

// Type that satisfies Serializable
struct Config {
    std::string name;
    int value;

    std::string serialize() const {
        return std::format("{}={}", name, value);
    }
};

static_assert(Serializable<Config>);

// -----------------------------------------------
// 3. Concept composition (combining concepts)
// -----------------------------------------------
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<typename T>
concept OrderedNumeric = Numeric<T> && std::totally_ordered<T>;

template<typename T>
concept PrintableNumeric = Numeric<T> && Printable<T>;

// Use composed concept
template<PrintableNumeric T>
void print_numeric(T value) {
    std::cout << std::format("Value: {}\n", value);
}

// -----------------------------------------------
// 4. Concept subsumption (overload resolution)
//    More constrained overloads are preferred.
// -----------------------------------------------
template<typename T>
concept Animal = requires(T t) {
    { t.name() } -> std::convertible_to<std::string>;
};

// More constrained: Animal that also speaks
template<typename T>
concept SpeakingAnimal = Animal<T> && requires(T t) {
    { t.speak() } -> std::convertible_to<std::string>;
};

// Less constrained overload
void describe(const Animal auto& a) {
    std::cout << std::format("Animal: {}\n", a.name());
}

// More constrained overload -- preferred when both match
void describe(const SpeakingAnimal auto& a) {
    std::cout << std::format("{} says: {}\n", a.name(), a.speak());
}

struct Dog {
    std::string name() const { return "Dog"; }
    std::string speak() const { return "Woof!"; }
};

struct Rock {  // Has name() but no speak()
    std::string name() const { return "Rock"; }
};

// -----------------------------------------------
// 5. Real-world pattern: constrained factory
//    Only allows creating objects that are both
//    default-constructible and printable.
// -----------------------------------------------
template<typename T>
concept Creatable = std::default_initializable<T> && requires(T t) {
    { std::format("{}", t.to_string()) };
};

template<typename T>
    requires std::default_initializable<T>
std::unique_ptr<T> make() {
    return std::make_unique<T>();
}

// -----------------------------------------------
// 6. Abbreviated function templates (terse syntax)
//    'auto' with concepts is the cleanest form.
// -----------------------------------------------
// All three are equivalent:
// (a) template<std::integral T> T double_it(T x) { return x * 2; }
// (b) auto double_it(std::integral auto x) { return x * 2; }
// (c) template<typename T> requires std::integral<T> T double_it(T x) { ... }

auto double_it(std::integral auto x) { return x * 2; }

// Multiple constrained auto parameters
auto safe_divide(std::floating_point auto a, std::floating_point auto b) {
    if (b == 0.0) return 0.0;
    return static_cast<double>(a) / static_cast<double>(b);
}

int main() {
    // Printable concept
    static_assert(Printable<int>);
    static_assert(Printable<std::string>);

    // Serializable
    Config cfg{"timeout", 30};
    std::cout << std::format("Serialized: {}\n", cfg.serialize());

    // Composed concepts
    print_numeric(42);
    print_numeric(3.14);
    // print_numeric("hello");  // Error: not Numeric

    // Concept subsumption: compiler picks the more constrained overload
    std::cout << "\n--- Subsumption ---\n";
    Dog dog;
    describe(dog);  // Calls SpeakingAnimal overload (more constrained)

    // Abbreviated syntax
    std::cout << "\n--- Terse Syntax ---\n";
    std::cout << std::format("double_it(21) = {}\n", double_it(21));
    std::cout << std::format("safe_divide(10.0, 3.0) = {:.4f}\n",
                              safe_divide(10.0, 3.0));

    return 0;
}
