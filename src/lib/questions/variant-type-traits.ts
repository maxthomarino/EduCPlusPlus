import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 36,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question:
      "What type does v hold after default construction?",
    code: `std::variant<int, std::string> v;`,
    options: ["int", "std::string", "It is empty (valueless)", "Undefined"],
    correctIndex: 0,
    explanation:
      "A std::variant is default-constructed to hold the first type in its template parameter list. Here, that is int, which is value-initialized to 0.",
    link: "https://en.cppreference.com/w/cpp/utility/variant.html",
  },
  {
    id: 37,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question:
      "What happens if a std::visit visitor does not handle all types in the variant?",
    options: [
      "Compilation error",
      "The unhandled types are silently ignored",
      "Undefined behavior",
      "Compiles, but throws std::bad_variant_access at runtime",
    ],
    correctIndex: 0,
    explanation:
      "The visitor callable must be invocable with every alternative type in the variant. If any overload is missing, the code fails to compile.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit.html",
  },
  {
    id: 38,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "When should you prefer std::variant over a class hierarchy with virtual functions?",
    options: [
      "When the set of types is closed and known at compile time",
      "When the set of types is open-ended and expected to grow over time",
      "When you need dynamic dispatch through vtables",
      "When you need heap allocation for polymorphism",
    ],
    correctIndex: 0,
    explanation:
      "variant is ideal for closed type sets: the compiler ensures exhaustive handling via visit, and values are stored inline (no heap allocation). Class hierarchies are better when the type set is open.",
    link: "https://en.cppreference.com/w/cpp/utility/variant.html",
  },
  {
    id: 54,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What is the value of std::is_const_v<const int*>?",
    options: [
      "true",
      "Compilation error",
      "false",
      "Implementation-defined",
    ],
    correctIndex: 2,
    explanation:
      "const int* is a 'pointer to const int.' The pointer itself is non-const (you can reassign it). is_const checks whether the top-level type is const. std::is_const_v<int* const> (a const pointer to int) would be true.",
    link: "https://en.cppreference.com/w/cpp/types/is_const.html",
  },
  {
    id: 55,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What is std::decay_t<int[5]>?",
    options: [
      "int&",
      "int*",
      "std::array<int, 5>",
      "int[5]",
    ],
    correctIndex: 1,
    explanation:
      "std::decay simulates the type transformations that happen when passing by value: arrays decay to pointers, functions decay to function pointers, and top-level cv-qualifiers are removed.",
    link: "https://en.cppreference.com/w/cpp/types/decay.html",
  },
  {
    id: 66,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What is the type of std::conditional_t<(sizeof(int) > 4), long long, int>?",
    options: [
      "int on most platforms == 4)",
      "Always long long",
      "Always int",
      "Compilation error",
    ],
    correctIndex: 0,
    explanation:
      "std::conditional_t<Cond, T, F> is a compile-time type-level ternary. When the condition is false (sizeof(int) is 4, not greater than 4), it selects the second type int. sizeof is a constant expression, perfectly valid in template arguments.",
    link: "https://en.cppreference.com/w/cpp/types/conditional.html",
  },
  {
    id: 572,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What is std::variant?",
    code: `std::variant<int, double, std::string> v = 42;\nv = "hello";  // now holds a string\nv = 3.14;    // now holds a double`,
    options: [
      "A container that holds multiple values of different types simultaneously, storing one instance of each alternative type in a tuple-like layout and allowing access to all of them at any time",
      "An alias for std::any that was introduced in C++17 for backwards compatibility \u2014 both types share the same implementation, ABI, and type-erasure mechanism under the hood",
      "A type-safe union that holds exactly one value from a fixed set of types at any time. Unlike a C union, it tracks which type is active and throws if you access the wrong one",
      "A polymorphic base class that provides virtual dispatch for value types, allowing derived classes to override visit() methods and enabling runtime polymorphism without heap allocation",
    ],
    correctIndex: 2,
    explanation:
      "std::variant<int, double, string> can hold an int OR a double OR a string -- never more than one. It knows which type is active (via an index). Accessing the wrong type via std::get throws std::bad_variant_access. It's stack-allocated with no heap overhead.",
    link: "https://en.cppreference.com/w/cpp/utility/variant.html",
  },
  {
    id: 573,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "How do you check which type a variant currently holds?",
    code: `std::variant<int, std::string> v = "hello";\n\nif (std::holds_alternative<std::string>(v)) {\n    std::cout << std::get<std::string>(v);\n}`,
    options: [
      "Use dynamic_cast on the variant to determine its active type, since variant uses a virtual function table internally to track which alternative is currently stored",
      "std::holds_alternative<T>(v) returns true if v currently holds type T. You can also use v.index() to get the zero-based index of the active type",
      "Variants always hold all their listed types simultaneously in a union-like structure, so there is no need to check which one is active",
      "Use typeid() on the variant object and compare the returned std::type_info against each alternative type to determine which one is currently active in the variant",
    ],
    correctIndex: 1,
    explanation:
      "holds_alternative<T> is a compile-time safe check. v.index() returns 0, 1, 2... corresponding to the type list. std::get<T>(v) extracts the value (throws on mismatch). std::get_if<T>(&v) returns a pointer (nullptr on mismatch, no-throw).",
    link: "https://en.cppreference.com/w/cpp/utility/variant/holds_alternative.html",
  },
  {
    id: 574,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What is std::visit and why is it useful with variant?",
    code: `std::variant<int, double, std::string> v = 3.14;\n\nstd::visit([](auto&& val) {\n    std::cout << val;\n}, v);`,
    options: [
      "visit iterates over all types stored in the variant simultaneously and invokes the callable once for each type in the variant's type list, regardless of which alternative is currently active",
      "visit converts the variant's currently held value to a std::string representation by calling the appropriate to_string overload, making it primarily useful for serialization and logging purposes",
      "std::visit calls a callable (visitor) with the currently active value. Using a generic lambda (auto&&), one handler works for all types. The compiler generates a dispatch table",
      "visit replaces the currently held value in the variant with a new value of a different type, effectively changing which alternative is active",
    ],
    correctIndex: 2,
    explanation:
      "std::visit dispatches to the right overload based on the active type. With a generic lambda, you write one handler. With an overloaded visitor (using the overload pattern), you handle each type differently. The compiler generates an efficient jump table -- O(1) dispatch.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit.html",
  },
  {
    id: 575,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What are type traits?",
    code: `static_assert(std::is_integral_v<int>);          // true\nstatic_assert(!std::is_integral_v<double>);       // true\nstatic_assert(std::is_same_v<int, int>);          // true`,
    options: [
      "A way to define custom types by composing primitive type descriptors, allowing you to build complex aggregate types from a trait-specification DSL embedded in template parameters",
      "A debugging tool that prints human-readable type names to std::cerr at runtime, using compiler-specific demangling to convert the mangled typeid().name() output into readable class names",
      "Runtime type checks similar to Java\u2019s instanceof operator \u2014 they query the dynamic type of an object through RTTI and return a boolean indicating whether a safe downcast is possible",
      "Compile-time templates that query properties of types. They evaluate to true/false and enable templates to adapt their behavior based on type characteristics",
    ],
    correctIndex: 3,
    explanation:
      "Type traits (from <type_traits>) are compile-time introspection tools. Property traits: is_integral, is_pointer, is_trivially_copyable. Relationship traits: is_same, is_base_of. Transformation traits: remove_const, add_pointer, decay. They're the foundation for generic programming.",
    link: "https://en.cppreference.com/w/cpp/header/type_traits.html",
  },
  {
    id: 576,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What is the difference between std::variant, std::optional, and std::any?",
    options: [
      "optional is deprecated in C++20 in favor of variant<std::monostate, T>, which provides the same maybe-value semantics with a more uniform API and better integration with std::visit pattern matching",
      "any is faster than both variant and optional because it avoids compile-time type checking overhead, stores values in a pre-allocated type-erased buffer, and uses direct pointer casts instead of tagged unions",
      "They are interchangeable \u2014 all three store a single value with type safety, differ only in naming convention, and the compiler treats variant<T>, optional<T>, and any as equivalent when T is a single type",
      "variant<Ts...>: one value from a closed set of types. optional<T>: either a value of type T or nothing. any: a value of any type. variant is stack-only and type-safe; any may heap-allocate",
    ],
    correctIndex: 3,
    explanation:
      "variant is a closed-set sum type (like a tagged union). optional is a maybe-type (value or empty). any is an open-set type-erased container (like a safe void*). Use variant when you know the possible types. Use optional for nullable values. Use any when the type is truly unknown.",
    link: "https://en.cppreference.com/w/cpp/utility/variant.html",
  },
  {
    id: 577,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What is the 'overload pattern' for visiting variants?",
    code: `template<class... Ts>\nstruct overloaded : Ts... { using Ts::operator()...; };\n\nstd::variant<int, std::string> v = "hello";\nstd::visit(overloaded{\n    [](int i)               { std::cout << "int: " << i; },\n    [](const std::string& s) { std::cout << "str: " << s; },\n}, v);`,
    options: [
      "A utility that inherits from multiple lambdas and exposes all their operator() overloads. Combined with std::visit, it lets you handle each variant type with a separate lambda",
      "A design pattern for managing global state across multiple modules by providing a single overloaded accessor function that returns different static variables depending on the template argument type",
      "A way to overload virtual functions in a class hierarchy, allowing derived classes to provide type-specific behavior that is dispatched dynamically through the vtable at runtime based on the object's type",
      "A way to overload the assignment operator for multiple types simultaneously by using a variadic template that generates one operator= overload for each type specified in the parameter pack",
    ],
    correctIndex: 0,
    explanation:
      "The overloaded struct inherits from each lambda and pulls their operator() into scope with using. CTAD (C++17) deduces the template arguments from the constructor. This gives you clean pattern-matching syntax. C++23 is likely to standardize something similar.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit.html",
  },
  {
    id: 578,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What does std::decay do?",
    code: `std::decay_t<int&>        // → int\nstd::decay_t<const int&>  // → int\nstd::decay_t<int[5]>      // → int*\nstd::decay_t<int(double)> // → int(*)(double)`,
    options: [
      "Removes all qualifiers from a type and makes the resulting type volatile, which is primarily used to prevent the compiler from optimizing away accesses to hardware-mapped memory regions",
      "Converts any type to void, effectively erasing all type information",
      "Removes all template parameters from a specialized type, converting it back to the primary unspecialized template",
      "Applies the same transformations as passing by value: removes references, removes top-level const/volatile, decays arrays to pointers, and decays functions to function pointers",
    ],
    correctIndex: 3,
    explanation:
      "std::decay simulates 'what type would this be if I passed it by value?' References are stripped, const is stripped, arrays become pointers, functions become function pointers. It's used in template metaprogramming when you want the 'natural' stored type.",
    link: "https://en.cppreference.com/w/cpp/types/decay.html",
  },
  {
    id: 579,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What is std::monostate and why is it used with variant?",
    code: `struct NoDefault { NoDefault(int) {} };\n\n// std::variant<NoDefault, int> v;  // ERROR: first type needs default constructor\nstd::variant<std::monostate, NoDefault, int> v;  // OK: monostate is default-constructible`,
    options: [
      "monostate is a type that holds exactly one value of a fixed type, acting as a compile-time constant wrapper similar to std::integral_constant but for any literal type",
      "monostate is an empty type used as the first alternative in a variant when none of the real types are default-constructible. A default-constructed variant holds its first type, so monostate serves as a 'no value' placeholder",
      "monostate is a singleton pattern implementation provided by the standard library",
      "monostate makes the variant thread-safe by internally wrapping all alternative accesses with a std::mutex, ensuring atomic reads and writes without requiring external synchronization",
    ],
    correctIndex: 1,
    explanation:
      "std::variant's default constructor creates the first alternative. If NoDefault has no default constructor, variant<NoDefault, int> can't be default-constructed. Placing monostate first gives variant a valid default state (empty/valueless). monostate is just an empty struct -- all instances are equal.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/monostate.html",
  },
  {
    id: 580,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "How do you use std::conditional to select a type at compile time?",
    code: `template<bool is64bit>\nstruct Platform {\n    using IntType = std::conditional_t<is64bit, int64_t, int32_t>;\n    IntType value;\n};`,
    options: [
      "conditional creates a variant containing both the true-type and false-type alternatives, with the runtime boolean condition determining which alternative is initially active when the variant is constructed",
      "std::conditional<condition, TrueType, FalseType>::type evaluates to TrueType if condition is true, FalseType otherwise. It's a compile-time ternary for types",
      "conditional selects between two values at runtime by evaluating a boolean expression and returning the first value if true or the second if false, similar to the ternary operator but for template contexts",
      "conditional works exactly like a switch statement for types",
    ],
    correctIndex: 1,
    explanation:
      "std::conditional is the type-level ternary operator. conditional<true, A, B>::type is A. conditional<false, A, B>::type is B. It's used extensively in template metaprogramming to select types based on compile-time conditions. conditional_t is the shorthand alias.",
    link: "https://en.cppreference.com/w/cpp/types/conditional.html",
  },
  {
    id: 581,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What does std::is_trivially_copyable tell you and why does it matter?",
    options: [
      "It checks whether a type can be copied at all",
      "It checks whether a type is small enough to fit in a single CPU register, which determines whether the compiler can pass it by value inside a register rather than through the stack during function calls",
      "It checks whether a type has an explicitly user-declared copy constructor as opposed to the compiler-generated default, distinguishing user-provided custom copy logic from the implicit memberwise copy that the compiler synthesizes automatically",
      "It's true when a type can be safely copied with memcpy",
    ],
    correctIndex: 3,
    explanation:
      "Trivially copyable types have no user-defined copy/move constructors, destructors, or virtual functions. Their byte representation IS their value -- memcpy works correctly. This is critical for: writing to files/network, GPU uploads, SIMD operations, and std::atomic (which requires trivially copyable types).",
    link: "https://en.cppreference.com/w/cpp/types/is_trivially_copyable.html",
  },
  {
    id: 582,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question: "What is the 'valueless by exception' state of std::variant?",
    code: `struct Evil {\n    Evil(int) {}\n    Evil(Evil&&) { throw std::runtime_error("oops"); }\n};\n\nstd::variant<std::string, Evil> v = "hello";\ntry {\n    v.emplace<Evil>(42);  // construction succeeds, but...\n    // If move/copy during reassignment throws:\n} catch (...) {\n    // v.valueless_by_exception() may be true!\n}`,
    options: [
      "Valueless variants automatically reset themselves to std::monostate as a built-in recovery mechanism",
      "If an exception is thrown during type-changing assignment, the variant may enter a 'valueless' state where no alternative is active. valueless_by_exception() returns true. Accessing the value in this state is undefined behavior. This is rare but possible with throwing moves",
      "Valueless means the variant has reverted to holding its first alternative type in a default-constructed state after the exception",
      "Variants can never be in an invalid state because the C++ standard guarantees that every type-changing assignment is implemented as a two-phase commit transaction, automatically rolling back to the previous value if construction of the new alternative throws an exception during assignment",
    ],
    correctIndex: 1,
    explanation:
      "During type-changing assignment, the old value is destroyed before the new one is constructed. If the new construction throws, the variant has no valid value. valueless_by_exception() detects this. This is the only 'broken' state in the C++ type system. Design types with noexcept move constructors to prevent this.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/valueless_by_exception.html",
  },
  {
    id: 583,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question: "How does std::common_type work and when is it useful?",
    code: `std::common_type_t<int, double>       // → double\nstd::common_type_t<int, long, float>  // → float`,
    options: [
      "It returns the common base class that all argument types inherit from, traversing the inheritance hierarchy upward until a shared ancestor is found",
      "It returns void if the types provided don't match exactly, since implicit conversions between different arithmetic or user-defined types are not considered during common type computation",
      "It returns the largest type by sizeof among all the arguments, selecting the type that occupies the most bytes in memory",
      "It computes the type that all arguments can implicitly convert to",
    ],
    correctIndex: 3,
    explanation:
      "common_type uses the rules of the ternary operator to find the common type. For int and double, the int is promoted to double. For multiple types, it's applied pairwise. You can specialize common_type for your own types. std::chrono uses it to determine the result type of duration arithmetic.",
    link: "https://en.cppreference.com/w/cpp/types/common_type.html",
  },
  {
    id: 584,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question: "What is tag dispatch and how does it use type traits?",
    code: `template<typename Iter>\nvoid advanceImpl(Iter& it, int n, std::random_access_iterator_tag) {\n    it += n;  // O(1)\n}\n\ntemplate<typename Iter>\nvoid advanceImpl(Iter& it, int n, std::input_iterator_tag) {\n    while (n-- > 0) ++it;  // O(n)\n}\n\ntemplate<typename Iter>\nvoid advance(Iter& it, int n) {\n    advanceImpl(it, n, typename std::iterator_traits<Iter>::iterator_category{});\n}`,
    options: [
      "Tag dispatch creates an empty 'tag' object from a type trait and uses overload resolution to select the optimal implementation at compile time",
      "Tag dispatch requires virtual functions and a class hierarchy",
      "Tag dispatch is a design pattern for adding key-value metadata annotations to function arguments at compile time, which can be queried later through template metaprogramming introspection",
      "Tag dispatch uses RTTI and dynamic_cast to determine the iterator category at runtime, then calls the appropriate implementation through virtual dispatch",
    ],
    correctIndex: 0,
    explanation:
      "The tag (e.g., random_access_iterator_tag) is an empty struct used solely for overload resolution. The compiler selects the right advanceImpl based on the tag type -- entirely at compile time. This was the standard technique before C++20 concepts (which replace tag dispatch with cleaner syntax).",
    link: "https://en.cppreference.com/w/cpp/iterator/iterator_tags.html",
  },
  {
    id: 585,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question: "How can you use std::variant as a state machine?",
    code: `struct Idle {};\nstruct Loading { std::string url; };\nstruct Ready { Data data; };\nstruct Error { std::string message; };\n\nusing State = std::variant<Idle, Loading, Ready, Error>;\n\nState handleEvent(State state, Event event) {\n    return std::visit(overloaded{\n        [&](Idle, StartEvent e)   -> State { return Loading{e.url}; },\n        [&](Loading, DoneEvent e) -> State { return Ready{e.data}; },\n        [&](Loading, FailEvent e) -> State { return Error{e.msg}; },\n        [&](auto, auto)           -> State { return state; },\n    }, state, event);\n}`,
    options: [
      "State machines require inheritance hierarchies with a virtual step() method in the base class",
      "This pattern requires dynamic_cast and a class hierarchy instead",
      "Variants cannot model state machines because they lack transition logic",
      "Each variant alternative represents a state, each carrying only the data relevant to that state. std::visit with multiple variants enables exhaustive state×event handling at compile time. The compiler warns about unhandled combinations",
    ],
    correctIndex: 3,
    explanation:
      "Variant state machines are a powerful pattern: states are types (with their own data), transitions are visit overloads. Benefits over enum-based state machines: each state has only its relevant data (no invalid combinations), the compiler enforces exhaustive handling, and adding a new state produces compilation errors at every unhandled visit.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit.html",
  },
  {
    id: 586,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question: "What does std::conjunction / std::disjunction do?",
    code: `template<typename... Ts>\nusing all_integral = std::conjunction<std::is_integral<Ts>...>;\n\nstatic_assert(all_integral<int, long, char>::value);   // true\nstatic_assert(!all_integral<int, double>::value);       // true`,
    options: [
      "They only work with raw boolean values passed as non-type template parameters, not with type traits",
      "They combine multiple variant types into a single larger variant by concatenating their type lists",
      "They perform bitwise AND/OR operations on the underlying integer representations of the type traits, treating std::true_type as 1 and std::false_type as 0, then converting the result back to a type trait",
      "conjunction<Ts...> short-circuit ANDs multiple type traits. disjunction<Ts...> short-circuit ORs them. Unlike a fold expression with &&, conjunction preserves the failing trait's type for better error messages",
    ],
    correctIndex: 3,
    explanation:
      "std::conjunction and std::disjunction are variadic type traits that combine boolean traits with short-circuit evaluation. conjunction<A,B,C> inherits from the first false_type it finds (or the last type if all are true). Short-circuiting means it won't instantiate B or C if A is false -- avoiding potential compilation errors.",
    link: "https://en.cppreference.com/w/cpp/types/conjunction.html",
  },
  {
    id: 1362,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What does std::is_integral<T>::value evaluate to for the type int?",
    options: [
      "It evaluates to false because int is a primitive type rather than a proper integral class type",
      "It evaluates to a compile-time integer representing the size of the int type in bytes on disk",
      "It evaluates to true because int is one of the built-in integral types recognized by the trait",
      "It evaluates to an enum constant that identifies which specific integral category int belongs to",
    ],
    correctIndex: 2,
    explanation:
      "std::is_integral is a type trait that checks whether a type is an integral type (bool, char, int, long, etc.). For int, it evaluates to true. Since C++17, you can use the shorthand std::is_integral_v<int> instead.",
    link: "https://en.cppreference.com/w/cpp/types/is_integral",
  },
  {
    id: 1363,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What does std::holds_alternative<T>(v) check on a std::variant?",
    options: [
      "It checks whether the variant currently holds a value of the specified type T at this moment",
      "It checks whether the type T is one of the possible types in the variant template parameter list",
      "It checks whether the variant has been initialized with any value since it was first constructed",
      "It checks whether the variant can be safely converted to type T without losing any stored data",
    ],
    correctIndex: 0,
    explanation:
      "std::holds_alternative<T>(v) returns true if the variant v currently contains a value of type T. It is a compile-time safe way to check the active alternative before calling std::get<T>(v).",
    link: "https://en.cppreference.com/w/cpp/utility/variant/holds_alternative",
  },
  {
    id: 1364,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question:
      "What exception does std::get<T>(variant) throw if the variant does not hold type T?",
    options: [
      "It throws std::runtime_error with a message describing the type mismatch that was detected",
      "It throws std::invalid_argument indicating that the requested type is not the active alternative",
      "It throws std::out_of_range indicating that the type index is beyond the valid range of types",
      "It throws std::bad_variant_access indicating that the variant does not hold the requested type",
    ],
    correctIndex: 3,
    explanation:
      "If you call std::get<T>(v) and the variant does not currently hold a value of type T, it throws std::bad_variant_access. To avoid exceptions, use std::get_if<T>(&v) which returns a pointer (nullptr if wrong type).",
    link: "https://en.cppreference.com/w/cpp/utility/variant/get",
  },
  {
    id: 1365,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What does std::is_same<T, U>::value check at compile time?",
    options: [
      "It checks whether type T can be implicitly converted to type U without any data loss at all",
      "It checks whether types T and U are exactly the same type including all qualifiers and refs",
      "It checks whether types T and U have the same size in bytes when stored in memory on the stack",
      "It checks whether types T and U share a common base class in their class inheritance hierarchy",
    ],
    correctIndex: 1,
    explanation:
      "std::is_same<T, U> evaluates to true only if T and U are exactly the same type. Note that const int and int are different types, as are int& and int. Use std::remove_cv and std::remove_reference to strip qualifiers before comparing.",
    link: "https://en.cppreference.com/w/cpp/types/is_same",
  },
  {
    id: 1366,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question:
      "What does the _v suffix mean on type trait names like std::is_integral_v<T>?",
    options: [
      "It is a variable template shorthand that directly gives the bool value without writing ::value",
      "It indicates a volatile-qualified version of the trait that handles volatile types specifically",
      "It indicates a vector version of the trait that can check multiple types in a single expression",
      "It indicates a validated version of the trait that throws an exception if the check is false",
    ],
    correctIndex: 0,
    explanation:
      "Since C++17, type traits provide _v variable template shortcuts. std::is_integral_v<T> is equivalent to std::is_integral<T>::value but is shorter and more readable. Similarly, _t suffixes provide type aliases.",
    link: "https://en.cppreference.com/w/cpp/types/is_integral",
  },
  {
    id: 1367,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What does std::remove_const<T>::type produce when T is const int?",
    options: [
      "It produces const int because remove_const only works on pointer types and not direct types",
      "It produces a compile-time error because const int cannot have its const qualifier removed",
      "It produces int by stripping the top-level const qualifier from the type passed to the trait",
      "It produces volatile int by replacing the const qualifier with a volatile qualifier instead",
    ],
    correctIndex: 2,
    explanation:
      "std::remove_const removes the top-level const qualifier from a type. So remove_const<const int>::type is int. Note it only removes top-level const: remove_const<const int*>::type is still const int* because the const is on the pointed-to type.",
    link: "https://en.cppreference.com/w/cpp/types/remove_cv",
  },
  {
    id: 1368,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What value does std::variant::index() return?",
    options: [
      "It returns the total number of alternative types that the variant can possibly hold at any time",
      "It returns the zero-based index of the type that the variant currently holds as its active value",
      "It returns the memory offset in bytes where the variant stores its currently held value in memory",
      "It returns the hash code of the currently held type for use in unordered containers as a key",
    ],
    correctIndex: 1,
    explanation:
      "index() returns the zero-based position of the currently active type in the variant's template parameter list. For std::variant<int, string, double>, if it holds a string, index() returns 1.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/index",
  },
  {
    id: 1369,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What does std::is_floating_point<T> check about a type?",
    options: [
      "It checks whether the type is a pointer to a floating-point number stored on the heap memory",
      "It checks whether the type supports the addition operator for combining two numeric values",
      "It checks whether the type is an integer type that can be implicitly converted to float safely",
      "It checks whether the type is float, double, or long double including their cv-qualified forms",
    ],
    correctIndex: 3,
    explanation:
      "std::is_floating_point checks if a type is one of the three standard floating-point types: float, double, or long double (including const/volatile variants). It evaluates to false for integral types and user-defined types.",
    link: "https://en.cppreference.com/w/cpp/types/is_floating_point",
  },
  {
    id: 1370,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question:
      "What does std::get_if<T>(variant_ptr) return when the variant holds a different type?",
    options: [
      "It returns nullptr indicating that the variant does not currently hold the requested type value",
      "It returns a default-constructed value of type T as a fallback when the type does not match",
      "It throws std::bad_variant_access because the variant does not contain the requested type now",
      "It returns a pointer to the first alternative type regardless of which type is currently active",
    ],
    correctIndex: 0,
    explanation:
      "std::get_if<T> takes a pointer to a variant and returns a pointer to the held value if it matches type T, or nullptr otherwise. This is the non-throwing alternative to std::get<T>, suitable for checking without exceptions.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/get_if",
  },
  {
    id: 1371,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question: "What does std::is_pointer<T> evaluate to for the type int*?",
    options: [
      "It evaluates to false because int* is a raw pointer and the trait only recognizes smart pointers",
      "It evaluates to the size of the pointer in bytes which varies depending on the target platform",
      "It evaluates to true because int* is a pointer type matching the trait detection criteria exactly",
      "It evaluates to a type alias representing the pointed-to type which in this case would be int",
    ],
    correctIndex: 2,
    explanation:
      "std::is_pointer checks whether a type is a pointer type (including pointers to functions and void). For int*, it evaluates to true. Note that smart pointers like std::shared_ptr are not raw pointers, so the trait returns false for them.",
    link: "https://en.cppreference.com/w/cpp/types/is_pointer",
  },
  {
    id: 1372,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "How does std::visit work with a visitor that uses an overload set?",
    options: [
      "It calls all overloads sequentially and returns the result of the last one that was executed",
      "It selects the correct overload at runtime based on which type the variant currently holds",
      "It requires explicit type casting of the variant before passing it to the visitor function",
      "It calls the visitor once with the variant object itself rather than with the contained value",
    ],
    correctIndex: 1,
    explanation:
      "std::visit applies the visitor callable to the value held by the variant. At runtime, it determines which type is active and dispatches to the appropriate overload. The visitor must handle all possible types or the code will not compile.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit",
  },
  {
    id: 1373,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What does std::decay<T>::type produce and when is it useful?",
    options: [
      "It converts any type to void so it can be used as a placeholder in template parameter lists",
      "It removes all smart pointer wrappers and returns the raw underlying pointed-to type directly",
      "It converts all types to their unsigned equivalents by stripping the signed qualifier from them",
      "It applies array-to-pointer and function-to-pointer conversions and removes top-level cv-qualifiers",
    ],
    correctIndex: 3,
    explanation:
      "std::decay mimics the type transformations that occur when passing arguments by value: arrays decay to pointers, functions decay to function pointers, and top-level const/volatile and references are removed. It is useful for storing values in containers.",
    link: "https://en.cppreference.com/w/cpp/types/decay",
  },
  {
    id: 1374,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What is the overloaded lambda pattern commonly used with std::visit?",
    options: [
      "It combines multiple lambdas into one callable using an overload struct that inherits from each",
      "It uses a switch statement inside a single lambda to dispatch based on the variant index value",
      "It creates a chain of if-else blocks that check each type using dynamic_cast before calling",
      "It wraps each lambda in a std::function and stores them in a vector for sequential invocation",
    ],
    correctIndex: 0,
    explanation:
      "The overloaded pattern uses a helper struct template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; }; that inherits from multiple lambdas. This creates a single visitor with overloaded operator() for each type in the variant.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit",
  },
  {
    id: 1375,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question:
      "What does std::conditional<B, T, F>::type produce depending on the boolean B?",
    options: [
      "It produces a boolean value that equals true when T is convertible to F and false otherwise",
      "It produces a variant type that can hold either T or F depending on a runtime condition value",
      "It produces type T when B is true and type F when B is false as a compile-time type selection",
      "It produces a pair containing both T and F so the caller can choose which to use at runtime",
    ],
    correctIndex: 2,
    explanation:
      "std::conditional is a compile-time type selector. When the boolean condition is true, the nested type is T; when false, it is F. This is useful in template metaprogramming to select between types based on compile-time conditions.",
    link: "https://en.cppreference.com/w/cpp/types/conditional",
  },
  {
    id: 1376,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question:
      "What happens when a std::variant enters the valueless_by_exception state?",
    options: [
      "The variant silently holds a default-constructed value of its first alternative type as fallback",
      "The variant holds no value and any access attempt throws std::bad_variant_access immediately",
      "The variant is automatically destroyed and its memory is released back to the system allocator",
      "The variant resets to the last successfully held value and ignores the exception that occurred",
    ],
    correctIndex: 1,
    explanation:
      "A variant can become valueless_by_exception if an assignment or emplacement throws after destroying the old value but before constructing the new one. In this state, index() returns variant_npos and accessing the value throws std::bad_variant_access.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/valueless_by_exception",
  },
  {
    id: 1377,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question:
      "What does std::is_constructible<T, Args...>::value check at compile time?",
    options: [
      "It checks whether T can be constructed from the given argument types Args in a valid expression",
      "It checks whether T has been explicitly constructed at least once somewhere in the current program",
      "It checks whether T is a class type that has a user-declared constructor rather than a default one",
      "It checks whether the constructor of T is marked noexcept for the given argument types provided",
    ],
    correctIndex: 0,
    explanation:
      "std::is_constructible checks if an object of type T can be constructed from the specified argument types. For example, is_constructible<std::string, const char*>::value is true because std::string has a constructor accepting const char*.",
    link: "https://en.cppreference.com/w/cpp/types/is_constructible",
  },
  {
    id: 1378,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question:
      "How does std::variant compare to a C-style union for type-safe storage?",
    options: [
      "variant uses more memory because it stores all alternative values simultaneously in its buffer",
      "variant is slower at runtime because it uses virtual dispatch to access the stored value inside",
      "variant does not support non-trivial types like std::string while union supports all types freely",
      "variant tracks which type is active and manages construction and destruction automatically",
    ],
    correctIndex: 3,
    explanation:
      "Unlike a C union, std::variant knows which type is currently stored, manages constructors and destructors correctly, and prevents accessing the wrong type. A union does none of this, making it easy to trigger undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/utility/variant",
  },
  {
    id: 1379,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What does std::is_base_of<Base, Derived>::value check?",
    options: [
      "It checks whether Base and Derived are the same type or differ only in their cv-qualifiers",
      "It checks whether Derived can be implicitly converted to Base through a conversion operator",
      "It checks whether Derived is a class that inherits from Base either directly or indirectly",
      "It checks whether Base has a virtual destructor that allows safe polymorphic deletion of Derived",
    ],
    correctIndex: 2,
    explanation:
      "std::is_base_of<Base, Derived> evaluates to true if Derived inherits from Base (directly or through intermediate classes), or if they are the same non-union class type. It works with both public and private inheritance.",
    link: "https://en.cppreference.com/w/cpp/types/is_base_of",
  },
  {
    id: 1380,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question:
      "What does std::common_type<T, U>::type produce for the types int and double?",
    options: [
      "It produces int because int has a smaller size and is considered the more restrictive type here",
      "It produces double because that is the type that both int and double can implicitly convert to",
      "It produces a std::variant<int, double> that can hold either type at runtime without data loss",
      "It produces long double because that is the only type guaranteed to hold both int and double values",
    ],
    correctIndex: 1,
    explanation:
      "std::common_type determines the type that all given types can be implicitly converted to. For int and double, this is double, following the same implicit conversion rules as the ternary operator.",
    link: "https://en.cppreference.com/w/cpp/types/common_type",
  },
  {
    id: 1381,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What does std::is_trivially_copyable<T> tell you about a type?",
    options: [
      "It tells you the type can be safely copied with memcpy and has no custom copy logic at all",
      "It tells you the type has exactly one data member that is a primitive type like int or float",
      "It tells you the type can be constructed without any arguments using a trivial default constructor",
      "It tells you the type occupies exactly one byte of memory and has no padding between its members",
    ],
    correctIndex: 0,
    explanation:
      "A trivially copyable type has no non-trivial copy/move constructors or assignment operators, and no non-trivial destructor. This means memcpy can safely duplicate objects of this type, which is important for serialization and low-level memory operations.",
    link: "https://en.cppreference.com/w/cpp/types/is_trivially_copyable",
  },
  {
    id: 1382,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "How does std::variant implement type-safe storage without dynamic allocation?",
    options: [
      "It uses a union of smart pointers where each pointer type corresponds to one alternative type",
      "It stores a function pointer table that maps type indices to construction and access functions",
      "It allocates a separate stack frame for each alternative type and switches between them at runtime",
      "It uses an aligned union storage sized to the largest alternative plus an index to track the type",
    ],
    correctIndex: 3,
    explanation:
      "std::variant internally uses aligned storage (like std::aligned_union) large enough to hold the largest alternative type, plus a discriminator (index) to track which type is active. This avoids heap allocation while supporting arbitrary types.",
    link: "https://en.cppreference.com/w/cpp/utility/variant",
  },
  {
    id: 1383,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What does std::conjunction<Traits...> provide over simply writing (Traits::value && ...)?",
    options: [
      "It short-circuits so that traits after the first false are not instantiated, saving compile time",
      "It evaluates all traits in parallel using multithreaded template instantiation for faster builds",
      "It provides a runtime error message listing which specific trait in the conjunction was false",
      "It automatically converts the result to a std::bool_constant type for use in template arguments",
    ],
    correctIndex: 0,
    explanation:
      "std::conjunction performs short-circuit evaluation at the template level. Once a trait evaluates to false, remaining traits are not instantiated. This saves compile time and avoids instantiation errors in traits that would be ill-formed for the given types.",
    link: "https://en.cppreference.com/w/cpp/types/conjunction",
  },
  {
    id: 1384,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What problem does std::monostate solve when used as the first type in a std::variant?",
    options: [
      "It provides a thread-safe empty state that prevents data races when the variant is shared",
      "It enables the variant to store temporary values during type transitions between alternatives",
      "It allows default construction of a variant whose first type has no default constructor itself",
      "It marks the variant as immutable so its held value cannot be changed after initial assignment",
    ],
    correctIndex: 2,
    explanation:
      "std::monostate is an empty type with a default constructor. Placing it first in a variant like variant<monostate, NoDefaultCtor> allows the variant to be default-constructed (to monostate) even when other types lack default constructors.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/monostate",
  },
  {
    id: 1385,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What does std::is_nothrow_move_constructible<T> enable the standard library to do?",
    options: [
      "It enables containers to skip calling destructors on moved-from objects to improve performance",
      "It enables containers to use move instead of copy during reallocation for better efficiency",
      "It enables the compiler to eliminate all exception handling code from move constructor calls",
      "It enables containers to allocate move-constructed objects on the stack instead of the heap",
    ],
    correctIndex: 1,
    explanation:
      "When std::is_nothrow_move_constructible is true, containers like std::vector use move operations during reallocation instead of safer but slower copies. This is the same trait checked by std::move_if_noexcept.",
    link: "https://en.cppreference.com/w/cpp/types/is_move_constructible",
  },
  {
    id: 1386,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question: "How does std::visit handle visiting multiple variants simultaneously?",
    options: [
      "It visits each variant sequentially and passes the results as a tuple to the visitor function",
      "It requires all variants to hold the same type and passes them together to a single overload",
      "It creates a separate visitor call for each variant and combines the results using std::reduce",
      "It generates a dispatch table for the Cartesian product of all variant alternatives at compile time",
    ],
    correctIndex: 3,
    explanation:
      "When visiting N variants, std::visit generates a dispatch table covering all possible combinations of active types. For two variants with 3 and 4 types respectively, this creates a 3x4=12 entry table. The visitor must handle all combinations.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit",
  },
  {
    id: 1387,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What is the difference between std::is_convertible<From, To> and std::is_constructible<To, From>?",
    options: [
      "is_convertible checks explicit conversions while is_constructible checks only implicit conversions",
      "is_convertible works only for class types while is_constructible works for all types in the system",
      "is_convertible checks implicit conversion while is_constructible checks if To can be direct-initialized",
      "is_convertible evaluates at runtime while is_constructible evaluates at compile time during parsing",
    ],
    correctIndex: 2,
    explanation:
      "std::is_convertible checks if From can be implicitly converted to To (as if in a return statement). std::is_constructible checks if To can be constructed from From (including explicit constructors). A type with an explicit constructor passes is_constructible but fails is_convertible.",
    link: "https://en.cppreference.com/w/cpp/types/is_convertible",
  },
  {
    id: 1388,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What does std::invoke_result<F, Args...>::type determine at compile time?",
    options: [
      "It determines the return type of calling callable F with arguments of types Args without calling it",
      "It determines whether callable F can be invoked with Args and returns a boolean true or false",
      "It determines the number of arguments that callable F accepts in its parameter list declaration",
      "It determines the exception specification of callable F when invoked with the given argument types",
    ],
    correctIndex: 0,
    explanation:
      "std::invoke_result deduces the return type of invoking a callable F with arguments of types Args. It replaced std::result_of in C++17. It works with function pointers, lambdas, member function pointers, and any callable object.",
    link: "https://en.cppreference.com/w/cpp/types/result_of",
  },
  {
    id: 1389,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What does std::is_trivially_destructible<T> imply about memory management for type T?",
    options: [
      "It implies that objects of type T must be explicitly destroyed by calling their destructor manually",
      "It implies that the destructor is a no-op so objects can be abandoned without cleanup overhead",
      "It implies that type T uses reference counting internally and releases memory when count hits zero",
      "It implies that type T allocates all memory on the stack and never touches the heap for storage",
    ],
    correctIndex: 1,
    explanation:
      "A trivially destructible type has a destructor that performs no action. This means objects of this type can be left without calling the destructor, which is important for optimizations in containers and memory pools that skip destruction for trivial types.",
    link: "https://en.cppreference.com/w/cpp/types/is_destructible",
  },
  {
    id: 1390,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "How can you write a custom type trait that checks if a type has a specific member function?",
    options: [
      "Use dynamic_cast at runtime to test whether the type supports the member function call interface",
      "Use a macro that expands to a static assertion checking the existence of the member at link time",
      "Use typeid to compare the type against a known type that has the member function declared in it",
      "Use std::void_t with a decltype expression that calls the member inside a SFINAE template check",
    ],
    correctIndex: 3,
    explanation:
      "Custom type traits typically use std::void_t with SFINAE. A primary template inherits from std::false_type, and a specialization using void_t<decltype(std::declval<T>().method())> inherits from std::true_type, succeeding only if the member exists.",
    link: "https://en.cppreference.com/w/cpp/types/void_t",
  },
  {
    id: 1391,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What is the purpose of std::aligned_storage and why was it deprecated in C++23?",
    options: [
      "It provided heap-allocated storage for variant types but was replaced by std::variant entirely",
      "It provided thread-safe storage for atomic types but was replaced by std::atomic_ref in C++20",
      "It provided raw aligned memory for placement new but was deprecated due to strict aliasing risks",
      "It provided type-erased storage for any types but was replaced by std::any in the C++17 standard",
    ],
    correctIndex: 2,
    explanation:
      "std::aligned_storage provided a properly aligned, uninitialized block of memory for manual object construction via placement new. It was deprecated in C++23 because using it correctly requires careful handling of strict aliasing rules, and alignas with std::byte arrays is a safer alternative.",
    link: "https://en.cppreference.com/w/cpp/types/aligned_storage",
  },
];
