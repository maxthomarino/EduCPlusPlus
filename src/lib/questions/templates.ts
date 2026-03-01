import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 15,
    difficulty: "Easy",
    topic: "Templates",
    question: "What happens when this code compiles?",
    code: `template<typename T>\nT add(T a, T b) { return a + b; }\n\nauto result = add(1, 2.0);`,
    options: [
      "Returns 3.0 as a double after implicit conversion",
      "Undefined behavior at runtime due to type mismatch",
      "Returns 3 as an int via truncation of the argument",
      "Compilation error",
    ],
    correctIndex: 3,
    explanation:
      "T is deduced as int from the first argument and double from the second. The compiler cannot resolve the conflict.",
    link: "https://en.cppreference.com/w/cpp/language/template_argument_deduction.html",
  },
  {
    id: 16,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What problem do C++20 concepts solve compared to SFINAE?",
    options: [
      "They replace templates entirely with a simpler generic mechanism",
      "They make templates faster at runtime by reducing vtable lookups",
      "They produce clearer error messages and more readable constraint syntax",
      "They allow templates to accept non-type parameters for the first time",
    ],
    correctIndex: 2,
    explanation:
      "SFINAE errors are notoriously unreadable. Concepts let you write template<std::integral T> instead of complex enable_if expressions, and compilers produce direct 'constraint not satisfied' errors.",
    link: "https://en.cppreference.com/w/cpp/language/constraints.html",
  },
  {
    id: 17,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "What is true about the types of a and b?",
    code: "void process(std::integral auto a, std::integral auto b);",
    options: [
      "They must be the same type in all template instantiations",
      "They can be different integral types",
      "This syntax is invalid in C++20 and will not compile",
      "They must both be int, as specified by the standard",
    ],
    correctIndex: 1,
    explanation:
      "Each auto is independently deduced. This is equivalent to two separate template parameters each constrained by std::integral.",
    link: "https://en.cppreference.com/w/cpp/language/function_template.html",
  },
  {
    id: 51,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What does the C++17 left fold expression (... - args) evaluate to when args is the parameter pack (1, 2, 3)?",
    options: [
      "Compilation error",
      "2",
      "-4",
      "0",
    ],
    correctIndex: 2,
    explanation:
      "A left fold (... - args) associates left-to-right: ((1 - 2) - 3) = (-1 - 3) = -4. Fold expressions require parentheses and the associativity matters for non-commutative operators.",
    link: "https://en.cppreference.com/w/cpp/language/fold.html",
  },
  {
    id: 61,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "In a forwarding reference context, if f is called with an lvalue int variable, what type is T deduced as, and what is the type of arg?",
    code: `template<typename T>\nvoid f(T&& arg);`,
    options: [
      "T = int, arg is int&&",
      "T = int, arg is int&",
      "T = int&&, arg is int&&",
      "T = int&, arg is int&",
    ],
    correctIndex: 3,
    explanation:
      "When an lvalue is passed to a forwarding reference, T is deduced as int&. By reference collapsing rules, int& && becomes int&. This is the mechanism that allows std::forward to preserve value category.",
    link: "https://en.cppreference.com/w/cpp/language/reference.html",
  },
  {
    id: 62,
    difficulty: "Hard",
    topic: "Templates",
    question: "What happens when process(42) is called?",
    code: `template<typename T>\nvoid process(T value) {\n    if constexpr (std::is_integral_v<T>) {\n        value += 1;\n    } else {\n        value.non_existent_method();\n    }\n}`,
    options: [
      "Compilation error",
      "Compilation error",
      "Runtime error when the else branch executes",
      "Compiles fine -- the else branch is discarded and never checked",
    ],
    correctIndex: 3,
    explanation:
      "if constexpr evaluates the condition at compile time. When T = int, the else branch is entirely discarded during instantiation and is not type-checked. This is the key difference from a regular if.",
    link: "https://en.cppreference.com/w/cpp/language/if.html",
  },
  {
    id: 557,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is a function template?",
    code: `template<typename T>\nT maximum(T a, T b) {\n    return (a > b) ? a : b;\n}\n\nmaximum(3, 7);       // T = int\nmaximum(3.5, 1.2);  // T = double`,
    options: [
      "A blueprint that the compiler uses to generate type-specific functions on demand. The compiler deduces T from the arguments and creates a concrete function for each distinct type used",
      "A virtual function that adapts to its argument types at runtime by dispatching through a vtable lookup. The runtime selects the appropriate function body from a table of type-specific implementations",
      "A macro that performs text substitution at the preprocessor stage, expanding the template body inline at every call site. The preprocessor replaces each occurrence of T with the actual type name",
      "A function that takes any argument without type checking, similar to a void* parameter that accepts all types. The compiler bypasses all type validation and generates a single function body that operates on raw memory",
    ],
    correctIndex: 0,
    explanation:
      "Templates are compile-time code generation. The compiler instantiates a separate function for each type: maximum<int> and maximum<double> are two distinct functions in the binary. This is static (compile-time) polymorphism -- no runtime overhead.",
    link: "https://www.learncpp.com/cpp-tutorial/function-templates/",
  },
  {
    id: 558,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is a class template?",
    code: `template<typename T>\nclass Stack {\n    std::vector<T> data;\npublic:\n    void push(const T& val) { data.push_back(val); }\n    T pop() { T v = data.back(); data.pop_back(); return v; }\n};\n\nStack<int> intStack;\nStack<std::string> strStack;`,
    options: [
      "A blueprint for generating classes parameterized by types. Stack<int> and Stack<string> are completely separate classes generated by the compiler from the same template",
      "A class that uses void* to store any type, erasing the type information and casting back to the original type when elements are retrieved. There is no compile-time type checking",
      "A class that can only hold primitive types like int, double, char, and bool",
      "A class that inherits from all standard types in the library, gaining the interface of every container and algorithm through multiple inheritance. It acts as a universal base for polymorphic storage",
    ],
    correctIndex: 0,
    explanation:
      "Class templates parameterize a class over types (or non-type values). Each instantiation (Stack<int>, Stack<string>) is a unique, independent class. The STL is built on class templates: vector<T>, map<K,V>, unique_ptr<T>, etc.",
    link: "https://www.learncpp.com/cpp-tutorial/class-templates/",
  },
  {
    id: 559,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is template argument deduction?",
    code: `template<typename T>\nvoid print(const T& val) { std::cout << val; }\n\nprint(42);       // T deduced as int\nprint("hello");  // T deduced as const char*`,
    options: [
      "Template arguments are resolved at runtime by inspecting the dynamic type of each argument passed to the function. The runtime queries RTTI metadata to determine the correct template instantiation to dispatch to",
      "The compiler automatically determines template parameters from the function arguments",
      "The programmer must always specify template arguments explicitly by writing the type in angle brackets at every call site. The compiler provides no mechanism to infer template parameters from the arguments",
      "Deduction only works with fundamental types like int, double, and char",
    ],
    correctIndex: 1,
    explanation:
      "The compiler examines the function call arguments and matches them against the template parameter patterns. For print(42), the argument is int, so T = int. You can explicitly specify when deduction fails or is ambiguous: print<double>(42). Class Template Argument Deduction (CTAD, C++17) extends this to class templates.",
    link: "https://en.cppreference.com/w/cpp/language/template_argument_deduction.html",
  },
  {
    id: 560,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is a non-type template parameter?",
    code: `template<typename T, int N>\nclass FixedArray {\n    T data[N];\npublic:\n    int size() const { return N; }\n};\n\nFixedArray<double, 10> arr;`,
    options: [
      "A parameter that can only be a type, not a value",
      "A parameter that disables type checking for the template, allowing any expression to be used in place of the parameter without compile-time validation",
      "A template parameter that is a value rather than a type. The value must be a compile-time constant. std::array<T, N> uses this pattern",
      "A parameter that is evaluated at runtime by inspecting the function arguments. The template stores the value in a hidden variable initialized when the function is first called",
    ],
    correctIndex: 2,
    explanation:
      "Non-type template parameters can be integers, enums, pointers, references, and (since C++20) floating-point types and literal class types. The value must be known at compile time. FixedArray<double, 10> and FixedArray<double, 20> are completely different types.",
    link: "https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/",
  },
  {
    id: 561,
    difficulty: "Easy",
    topic: "Templates",
    question: "Why must template definitions typically be in header files?",
    options: [
      "Templates don't work in .cpp files",
      "Templates are always inlined, and inline functions must be in headers to satisfy the one-definition rule. The compiler expands every template call inline at the call site, so the full definition must be visible in every translation unit that uses it",
      "The compiler needs to see the full template definition at the point of instantiation to generate code. If the definition is in a .cpp file, other translation units can't see it and instantiation fails with a linker error",
      "Header files are faster to compile because the preprocessor caches their contents after the first inclusion. Subsequent includes reuse the cached parse tree, skipping lexing and parsing entirely for significant build-time savings",
    ],
    correctIndex: 2,
    explanation:
      "Templates are not compiled until instantiated. If maximum<int> is used in main.cpp but the template body is in util.cpp, the compiler compiling main.cpp can't generate the code. The fix: put templates in headers, or use explicit instantiation in the .cpp file for specific types.",
    link: "https://www.learncpp.com/cpp-tutorial/function-templates/",
  },
  {
    id: 562,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is template specialization?",
    code: `template<typename T>\nstd::string typeName() { return "unknown"; }\n\ntemplate<>\nstd::string typeName<int>() { return "int"; }\n\ntemplate<>\nstd::string typeName<double>() { return "double"; }`,
    options: [
      "An error -- you can't define a template function twice with different bodies. The compiler treats the specialized version as a redefinition and rejects it",
      "A template that automatically selects the best type by analyzing the call site arguments. The compiler evaluates all candidate types and picks the most efficient one",
      "A way to restrict which types a template accepts by listing the allowed types explicitly. All other types are rejected at compile time with a clear diagnostic",
      "A way to provide a custom implementation for a specific type. When typeName<int>() is called, the specialized version is used instead of the generic template",
    ],
    correctIndex: 3,
    explanation:
      "Full specialization (template<>) provides a completely custom implementation for a specific type. The compiler prefers the specialization over the generic template. You can also partially specialize class templates (but not function templates -- use overloading instead).",
    link: "https://en.cppreference.com/w/cpp/language/template_specialization.html",
  },
  {
    id: 563,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is partial specialization and what can it apply to?",
    code: `// Primary template\ntemplate<typename T>\nclass Container { /* generic */ };\n\n// Partial specialization for pointers\ntemplate<typename T>\nclass Container<T*> { /* special handling for pointer types */ };`,
    options: [
      "It works for both function templates and class templates equally",
      "It's an incomplete specialization that must be finished later by providing the remaining template parameters in a separate translation unit, similar to how forward declarations work for classes",
      "It partially implements the template body, leaving some methods undefined so that derived classes can fill in the missing pieces",
      "Partial specialization provides a custom implementation for a subset of types matching a pattern. It only works for class templates",
    ],
    correctIndex: 3,
    explanation:
      "Partial specialization matches a pattern rather than a specific type. Container<T*> matches any pointer type. The compiler selects the most specific match. This technique is heavily used in the STL and type traits (e.g., is_pointer<T> vs is_pointer<T*>).",
    link: "https://en.cppreference.com/w/cpp/language/partial_specialization.html",
  },
  {
    id: 564,
    difficulty: "Medium",
    topic: "Templates",
    question: "What are variadic templates?",
    code: `template<typename... Args>\nvoid print(Args... args) {\n    (std::cout << ... << args) << "\\n";\n}`,
    options: [
      "Templates that accept zero or more template parameters. The parameter pack Args... captures all types, and fold expressions (C++17) or recursive expansion process them at compile time",
      "Templates that accept a variable number of arguments at runtime, using an internal std::vector to store each argument passed to the function and iterating over them during execution",
      "Templates that generate different numbers of class members depending on how many type parameters are supplied, adding one data member of each specified type to the class body at compile time",
      "Templates with optional parameters that have default values, allowing the caller to omit trailing arguments just like default function parameters",
    ],
    correctIndex: 0,
    explanation:
      "The ... syntax creates a parameter pack. Args... captures any number of types. args... captures the corresponding values. You can expand them with fold expressions ((cout << ... << args)), recursive function calls, or initializer-list tricks. std::tuple, std::variant, and std::make_unique all use variadic templates.",
    link: "https://en.cppreference.com/w/cpp/language/parameter_pack.html",
  },
  {
    id: 565,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is a fold expression (C++17)?",
    code: `template<typename... Args>\nauto sum(Args... args) {\n    return (args + ...);  // right fold\n}\n\nsum(1, 2, 3, 4);  // 10`,
    options: [
      "A standard library function in <numeric> that reduces a std::vector into a single value by applying a binary operation, essentially an alias for std::reduce with parallel execution policy",
      "A shorthand alias for std::accumulate that was introduced in C++17 to simplify reduction operations",
      "A runtime loop construct that iterates over a container and folds all elements into a single accumulated value, similar to std::accumulate but with a more concise syntax introduced in C++17",
      "A compile-time expansion that applies a binary operator across all elements of a parameter pack. (args + ...) expands to (1 + (2 + (3 + 4))). Four forms: unary/binary left/right folds",
    ],
    correctIndex: 3,
    explanation:
      "Fold expressions replace recursive template tricks for common patterns. (args + ...) is a unary right fold. (... + args) is a unary left fold. (init + ... + args) is a binary left fold. They work with any binary operator: +, *, &&, ||, <<, etc.",
    link: "https://en.cppreference.com/w/cpp/language/fold.html",
  },
  {
    id: 566,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is CTAD (Class Template Argument Deduction)?",
    code: `std::vector v = {1, 2, 3};           // deduced as vector<int>\nstd::pair p = {\"hello\", 42};         // deduced as pair<const char*, int>\nstd::lock_guard lock(mtx);           // deduced from mutex type`,
    options: [
      "CTAD deduces types at runtime using RTTI (typeid) to inspect constructor arguments and select the appropriate template instantiation through dynamic dispatch",
      "CTAD is a C++20-only feature that was not available in C++17",
      "CTAD only works with standard library types because the compiler has built-in deduction rules for std:: containers",
      "C++17's CTAD allows the compiler to deduce class template arguments from constructor arguments, eliminating the need to write explicit template parameters. Deduction guides can customize this behavior",
    ],
    correctIndex: 3,
    explanation:
      "Before CTAD, you had to write std::vector<int> v = {1,2,3} or use make functions (make_pair, make_tuple). CTAD applies the same deduction rules as function templates to constructors. You can write deduction guides to control how your own class templates participate.",
    link: "https://en.cppreference.com/w/cpp/language/class_template_argument_deduction.html",
  },
  {
    id: 567,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is SFINAE and how does it affect overload resolution?",
    code: `template<typename T>\nauto serialize(const T& obj) -> decltype(obj.toString(), std::string())\n{\n    return obj.toString();\n}\n\ntemplate<typename T>\nstd::string serialize(const T& obj) {\n    return std::to_string(obj);\n}`,
    options: [
      "SFINAE causes a hard compilation error when template argument substitution fails, immediately halting the build process and reporting every candidate overload that was considered during resolution",
      "Substitution Failure Is Not An Error: if substituting template arguments makes a declaration invalid doesn't exist), the template is silently removed from the overload set instead of causing a compilation error. This enables compile-time function selection based on type capabilities",
      "SFINAE only applies to return types that are specified using the trailing-return-type syntax with -> decltype(...), and it does not affect function parameters, default template arguments, or any other part of the function declaration",
      "SFINAE was formally deprecated by the C++20 concepts proposal and has been removed from the standard as of C++20",
    ],
    correctIndex: 1,
    explanation:
      "When the compiler tries to instantiate the first serialize with int, decltype(obj.toString()) fails -- but instead of an error, SFINAE removes it from consideration. The second overload wins. This is how enable_if, void_t, and detection idioms work. C++20 concepts are a cleaner replacement but SFINAE is still widely used.",
    link: "https://en.cppreference.com/w/cpp/language/sfinae.html",
  },
  {
    id: 568,
    difficulty: "Hard",
    topic: "Templates",
    question: "How does std::enable_if work?",
    code: `template<typename T, typename = std::enable_if_t<std::is_integral_v<T>>>\nT doubleIt(T val) {\n    return val * 2;\n}\n\ndoubleIt(5);     // OK: int is integral\ndoubleIt(3.14);  // error: double is not integral`,
    options: [
      "enable_if promotes the function to constexpr status by verifying at compile time that every operation within the function body is a valid constant expression, and it emits a static_assert failure if any operation cannot be evaluated at compile time",
      "enable_if evaluates its boolean condition at runtime using RTTI and throws std::bad_typeid if the condition evaluates to false, preventing the function from executing with an unsupported type",
      "enable_if disables exception propagation for the function it guards by wrapping the entire function body in a try-catch block that silently converts all thrown exceptions into std::error_code return values, effectively making the function noexcept without the keyword",
      "enable_if<condition> defines a type member 'type' only when the condition is true. When false, the type doesn't exist, causing a substitution failure (SFINAE) that removes the overload from consideration. enable_if_t is a shorthand for typename enable_if<...>::type",
    ],
    correctIndex: 3,
    explanation:
      "enable_if is the classic SFINAE tool. enable_if<true, T>::type is T. enable_if<false, T>::type doesn't exist -- substitution failure removes the function. Combined with type traits, it gates templates on type properties. C++20 concepts (requires std::integral<T>) are the modern replacement.",
    link: "https://en.cppreference.com/w/cpp/types/enable_if.html",
  },
  {
    id: 569,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is the 'dependent name' problem and when do you need typename?",
    code: `template<typename T>\nvoid print(const T& container) {\n    typename T::const_iterator it = container.begin();\n    // Without 'typename', the compiler doesn't know\n    // T::const_iterator is a type (vs a static member)\n}`,
    options: [
      "Inside a template, names that depend on a template parameter are ambiguous",
      "The typename keyword is entirely optional in all contexts",
      "This disambiguation issue only applies to iterator types obtained from standard library containers",
      "The typename keyword is only needed when declaring template parameters in the template parameter list",
    ],
    correctIndex: 0,
    explanation:
      "The compiler parses templates before instantiation. T::const_iterator could be a static data member, a function, or a type -- the compiler assumes it's NOT a type unless you say typename. This applies to any dependent qualified name. C++20 relaxes this in some contexts (e.g., return types, using declarations).",
    link: "https://en.cppreference.com/w/cpp/language/dependent_name.html",
  },
  {
    id: 570,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is void_t and how is it used for type detection?",
    code: `template<typename, typename = void>\nstruct has_toString : std::false_type {};\n\ntemplate<typename T>\nstruct has_toString<T, std::void_t<decltype(std::declval<T>().toString())>>\n    : std::true_type {};`,
    options: [
      "void_t is a placeholder return type for functions that return void, used exclusively in trailing return type syntax (-> void_t) to explicitly indicate that the function produces no return value when the function signature would otherwise be syntactically ambiguous to the parser",
      "void_t<Args...> maps any valid type arguments to void. In the partial specialization, if T.toString() is a valid expression, void_t succeeds and the specialization (true_type) is selected. If T.toString() is invalid, SFINAE removes the specialization and the primary template (false_type) is selected",
      "void_t only works correctly with pointer types and nullptr_t because the underlying implementation uses reinterpret_cast<void*> to normalize the template argument, and this cast is only well-defined for pointer types according to the standard",
      "void_t converts any type argument to a void* pointer at runtime using reinterpret_cast, providing a type-erased handle that can be stored in a generic heterogeneous container and later cast back to the original type when the actual type is needed for processing",
    ],
    correctIndex: 1,
    explanation:
      "std::void_t (C++17) is just template<typename...> using void_t = void;. Its power comes from SFINAE: if any argument type is invalid, the entire void_t fails, and the partial specialization is discarded. This is the foundation of the detection idiom for checking if a type has certain members, typedefs, or operators.",
    link: "https://en.cppreference.com/w/cpp/types/void_t.html",
  },
  {
    id: 571,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is a template template parameter?",
    code: `template<template<typename> class Container, typename T>\nclass Wrapper {\n    Container<T> data;\npublic:\n    void add(const T& val) { data.push_back(val); }\n};\n\nWrapper<std::vector, int> w;`,
    options: [
      "A nested template that is defined inside the body of another template class, where the inner template can access all of the outer template's type parameters through implicit capture",
      "A template that inherits from another template using the Curiously Recurring Template Pattern (CRTP), where the derived class passes itself as the base class's template argument to enable static polymorphism without virtual dispatch overhead",
      "A syntax error -- the template keyword can only appear once per declaration according to the grammar rules, so writing template<template<...>> is ill-formed and will be rejected by all conforming compilers with a parse error diagnostic",
      "A template parameter that is itself a template. Container is not a type",
    ],
    correctIndex: 3,
    explanation:
      "Template template parameters accept class templates as arguments. This separates the container 'shape' from the element type. Without it, you'd have to pass the fully instantiated type (std::vector<int>), losing the ability to rebind the element type inside the wrapper.",
    link: "https://en.cppreference.com/w/cpp/language/template_parameters.html",
  },
  {
    id: 1302,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is a function template in C++?",
    options: [
      "A function that can only accept integer arguments and returns a fixed type every time",
      "A function that is compiled once and then copied for each call site in the final binary",
      "A function defined inside a class that can only be called on objects of that specific class",
      "A blueprint for creating functions that work with different types specified at compile time",
    ],
    correctIndex: 3,
    explanation:
      "A function template is a pattern that the compiler uses to generate type-specific functions. When you call the template with a specific type, the compiler instantiates a version of the function for that type. This is done at compile time, not runtime.",
    link: "https://en.cppreference.com/w/cpp/language/function_template",
  },
  {
    id: 1303,
    difficulty: "Easy",
    topic: "Templates",
    question:
      "What keyword is used to declare a template parameter that represents a type?",
    options: [
      "The typename keyword declares a template parameter that can be substituted with any type",
      "The typedef keyword declares a template parameter that can be substituted with any type",
      "The typeid keyword declares a template parameter that can be substituted with any type",
      "The typecast keyword declares a template parameter that can be substituted with any type",
    ],
    correctIndex: 0,
    explanation:
      "The typename keyword (or equivalently, class) is used in a template parameter list to declare a type parameter. For example, template<typename T> declares T as a type that will be provided when the template is instantiated.",
    link: "https://en.cppreference.com/w/cpp/language/template_parameters",
  },
  {
    id: 1304,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is template instantiation in C++?",
    options: [
      "It is the process of inheriting template methods from a base class into a derived class object",
      "It is the process where the compiler generates a concrete function or class from a template",
      "It is the process of converting template code into machine language during the linking phase",
      "It is the process of loading template definitions from a shared library at program startup",
    ],
    correctIndex: 1,
    explanation:
      "Template instantiation occurs when the compiler creates a concrete version of a template for specific template arguments. For example, using std::vector<int> causes the compiler to instantiate the vector template with int as the element type.",
    link: "https://en.cppreference.com/w/cpp/language/template_specialization",
  },
  {
    id: 1305,
    difficulty: "Easy",
    topic: "Templates",
    question:
      "What is a class template in C++ and how is it different from a regular class?",
    options: [
      "A class template is a class that can only hold primitive types like int, float, and char values",
      "A class template is an abstract class that requires derived classes to implement all of its methods",
      "A class template is a blueprint parameterized by types that generates concrete classes on demand",
      "A class template is a class that stores its member data using void pointers for type flexibility",
    ],
    correctIndex: 2,
    explanation:
      "A class template defines a family of classes. The compiler generates a specific class when you provide template arguments, such as std::vector<double>. Each instantiation is a distinct type with its own member functions and data layout.",
    link: "https://en.cppreference.com/w/cpp/language/class_template",
  },
  {
    id: 1306,
    difficulty: "Easy",
    topic: "Templates",
    question:
      "What does the compiler do when it encounters a call to a function template?",
    options: [
      "It deduces the template arguments from the function call arguments and generates the function",
      "It calls a generic version of the function that handles all types through a virtual dispatch table",
      "It delays compilation of the function until the program is executed and the types are known then",
      "It replaces the function call with inline assembly instructions specific to the argument type used",
    ],
    correctIndex: 0,
    explanation:
      "Template argument deduction is the process by which the compiler determines the template arguments from the types of the function arguments. After deduction, the compiler instantiates the function for those specific types.",
    link: "https://en.cppreference.com/w/cpp/language/template_argument_deduction",
  },
  {
    id: 1307,
    difficulty: "Easy",
    topic: "Templates",
    question:
      "Why must template definitions typically be placed in header files rather than source files?",
    options: [
      "Because template code runs faster when it is placed in header files due to inlining optimizations",
      "Because the standard requires templates to be declared in headers and forbids source file placement",
      "Because source files cannot contain the template keyword according to the compiler restrictions",
      "Because the compiler needs to see the full definition to instantiate the template in each unit",
    ],
    correctIndex: 3,
    explanation:
      "Templates are instantiated at compile time in each translation unit that uses them. The compiler needs the complete definition, not just a declaration, to generate code for a specific set of template arguments. Placing definitions in headers ensures visibility.",
    link: "https://www.learncpp.com/cpp-tutorial/template-classes/",
  },
  {
    id: 1308,
    difficulty: "Easy",
    topic: "Templates",
    question: "What is a non-type template parameter in C++?",
    options: [
      "It is a parameter that accepts only class types and rejects all primitive or built-in types",
      "It is a template parameter that takes a value such as an integer rather than a type argument",
      "It is a parameter that disables type checking for the template to allow any argument to pass",
      "It is a placeholder that the compiler removes during optimization and replaces with a constant",
    ],
    correctIndex: 1,
    explanation:
      "Non-type template parameters allow templates to be parameterized by values rather than types. For example, template<int N> allows you to write std::array<int, 5> where 5 is a compile-time constant passed as a non-type template argument.",
    link: "https://en.cppreference.com/w/cpp/language/template_parameters#Non-type_template_parameter",
  },
  {
    id: 1309,
    difficulty: "Easy",
    topic: "Templates",
    question:
      "What happens if you explicitly specify template arguments when calling a function template?",
    options: [
      "The compiler ignores the explicit arguments and always deduces the types from the call site",
      "The program compiles but throws a runtime exception if the explicit types do not match the args",
      "The compiler uses the specified types instead of deducing them from the function call arguments",
      "The function becomes a regular non-template function that only accepts those specific type args",
    ],
    correctIndex: 2,
    explanation:
      "You can explicitly specify template arguments using angle brackets, like add<double>(1, 2). This overrides template argument deduction and forces the compiler to use the specified types, which can be useful to resolve ambiguity or force conversions.",
    link: "https://en.cppreference.com/w/cpp/language/template_argument_deduction#Explicit_instantiation",
  },
  {
    id: 1310,
    difficulty: "Easy",
    topic: "Templates",
    question:
      "What is the purpose of the template<> prefix with empty angle brackets?",
    options: [
      "It introduces a full specialization of a previously declared template for specific arguments",
      "It declares a template that takes no parameters and behaves like a regular function or class",
      "It deletes all existing instantiations of the template to force fresh compilation of each one",
      "It marks the template as deprecated so the compiler warns when it is used in new source code",
    ],
    correctIndex: 0,
    explanation:
      "template<> with empty angle brackets introduces an explicit full specialization. This provides a custom implementation of a template for a specific set of template arguments, overriding the general template definition.",
    link: "https://en.cppreference.com/w/cpp/language/template_specialization",
  },
  {
    id: 1311,
    difficulty: "Easy",
    topic: "Templates",
    question: "Can a template have multiple type parameters in C++?",
    options: [
      "No, templates are limited to exactly one type parameter by the C++ standard specification",
      "Yes, but all parameters must be the same type so they share a single deduced type argument",
      "No, multiple parameters require separate template declarations for each individual type used",
      "Yes, you can declare multiple parameters like template<typename T, typename U> in one list",
    ],
    correctIndex: 3,
    explanation:
      "Templates can have any number of parameters, both type and non-type. For example, std::map<Key, Value> uses two type parameters. Each parameter is independently deduced or explicitly specified.",
    link: "https://en.cppreference.com/w/cpp/language/template_parameters",
  },
  {
    id: 1312,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is template specialization and when would you use it?",
    options: [
      "It restricts a template to work only with primitive types by adding a static_assert check",
      "It provides a custom implementation of a template for specific types that need different behavior",
      "It forces the compiler to generate all possible instantiations of a template at build time",
      "It converts a template function into a virtual function for runtime polymorphism dispatch",
    ],
    correctIndex: 1,
    explanation:
      "Template specialization lets you provide an alternative definition for a template when particular types are used. For example, std::vector<bool> is a specialization that stores bits rather than full bool objects.",
    link: "https://en.cppreference.com/w/cpp/language/template_specialization",
  },
  {
    id: 1313,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What is partial template specialization and which template types support it?",
    options: [
      "It specializes only the function body while keeping the original parameter list unchanged always",
      "It specializes templates for a single argument and is available for both functions and classes",
      "It specializes a class template for a subset of its arguments and is not available for functions",
      "It specializes the return type of a template function while keeping the parameters fully generic",
    ],
    correctIndex: 2,
    explanation:
      "Partial specialization provides a custom implementation for a class template when some but not all template arguments match a pattern. C++ allows partial specialization for class templates but not for function templates, where overloading is used instead.",
    link: "https://en.cppreference.com/w/cpp/language/partial_specialization",
  },
  {
    id: 1314,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What is SFINAE and what role does it play in template overload resolution?",
    options: [
      "Substitution Failure Is Not An Error: invalid substitutions silently remove overload candidates",
      "Standard Function Instantiation And Name Evaluation: it names functions during template linking",
      "Static Failure In Named Argument Expressions: it catches type errors at the linking stage only",
      "Selective Function Inclusion After Namespace Expansion: it filters functions by their namespace",
    ],
    correctIndex: 0,
    explanation:
      "SFINAE means that if substituting template arguments into a function template produces an invalid type or expression, the template is simply removed from the overload set rather than causing a compilation error. This enables techniques like std::enable_if.",
    link: "https://en.cppreference.com/w/cpp/language/sfinae",
  },
  {
    id: 1315,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is a variadic template and what syntax does it use?",
    options: [
      "It is a template that accepts exactly two parameters using the pair<T1, T2> syntax declaration",
      "It is a template that only works with variable-length arrays using the VLA[] bracket syntax",
      "It is a template restricted to numeric types using the arithmetic<T...> syntax for constraints",
      "It is a template that accepts zero or more arguments using the typename... parameter pack syntax",
    ],
    correctIndex: 3,
    explanation:
      "Variadic templates use the ... syntax to accept a variable number of template arguments. For example, template<typename... Args> can match any number of type arguments. Parameter packs are expanded using pack expansion syntax.",
    link: "https://en.cppreference.com/w/cpp/language/parameter_pack",
  },
  {
    id: 1316,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What does std::enable_if do and how is it typically used with templates?",
    options: [
      "It enables runtime type identification for template arguments so they can be inspected later",
      "It conditionally enables a template overload based on a compile-time boolean condition value",
      "It enables automatic template argument deduction for functions that normally require explicit args",
      "It enables templates to be exported across translation units without requiring header inclusion",
    ],
    correctIndex: 1,
    explanation:
      "std::enable_if<condition, T> provides a type member T only when the condition is true. When false, substitution fails, triggering SFINAE. This is used to conditionally enable function template overloads based on type traits.",
    link: "https://en.cppreference.com/w/cpp/types/enable_if",
  },
  {
    id: 1317,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What is the difference between implicit and explicit template instantiation?",
    options: [
      "Implicit uses runtime reflection while explicit uses compile-time code generation for templates",
      "Implicit requires the template keyword at the call site while explicit uses angle brackets only",
      "Implicit happens automatically when used while explicit is triggered by a deliberate declaration",
      "Implicit generates debug symbols while explicit generates optimized code without debug information",
    ],
    correctIndex: 2,
    explanation:
      "Implicit instantiation occurs automatically when the compiler encounters a use of a template with specific arguments. Explicit instantiation uses template class MyClass<int>; to force the compiler to generate the code in a specific translation unit, which can reduce compile times.",
    link: "https://en.cppreference.com/w/cpp/language/class_template#Explicit_instantiation",
  },
  {
    id: 1318,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What is a dependent name in template code and why does it require special handling?",
    options: [
      "It is a name whose meaning depends on template parameters and may need typename to disambiguate",
      "It is a name that references a global variable from within a template function body at runtime",
      "It is a function name that is resolved through argument-dependent lookup across all namespaces",
      "It is a name imported from a base class that shadows a local variable in the template function",
    ],
    correctIndex: 0,
    explanation:
      "A dependent name is one whose interpretation depends on a template parameter. The compiler cannot determine whether T::value_type is a type or a value during the first pass, so you must add the typename keyword to indicate it is a type.",
    link: "https://en.cppreference.com/w/cpp/language/dependent_name",
  },
  {
    id: 1319,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is a template alias introduced with the using keyword in C++11?",
    options: [
      "It creates a new template that inherits all members from the original template class hierarchy",
      "It renames a template parameter within the body of a function to improve code readability",
      "It imports all specializations of a template from another namespace into the current one directly",
      "It creates a new name for a template or a partially applied template with some arguments fixed",
    ],
    correctIndex: 3,
    explanation:
      "A template alias defined with using creates a new name for a template, optionally fixing some parameters. For example, template<typename T> using Vec = std::vector<T, MyAllocator<T>>; creates a shorthand that always uses a custom allocator.",
    link: "https://en.cppreference.com/w/cpp/language/type_alias",
  },
  {
    id: 1320,
    difficulty: "Medium",
    topic: "Templates",
    question: "What is two-phase name lookup in C++ template compilation?",
    options: [
      "The compiler resolves all names twice to ensure consistency between debug and release builds",
      "Non-dependent names are resolved at definition time and dependent names at instantiation time",
      "Names are first resolved in the local scope and then in the global scope during compilation",
      "The compiler checks name validity during parsing and again during linking for duplicate symbols",
    ],
    correctIndex: 1,
    explanation:
      "In two-phase lookup, the compiler resolves non-dependent names during the first phase when the template is parsed. Dependent names (those that depend on template parameters) are resolved during the second phase when the template is instantiated with specific arguments.",
    link: "https://en.cppreference.com/w/cpp/language/two-phase_lookup",
  },
  {
    id: 1321,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What does the template keyword do when used inside a template to access a dependent member template?",
    options: [
      "It declares a new nested template inside the current template that overrides the base version",
      "It exports the member template so it can be used from outside the class without qualification",
      "It tells the compiler that the following name is a template rather than a comparison operator",
      "It forces the member template to be instantiated immediately rather than at the point of use",
    ],
    correctIndex: 2,
    explanation:
      "When accessing a dependent member template like obj.template foo<int>(), the template keyword is needed to tell the compiler that the < following foo is the start of template arguments, not a less-than comparison. Without it, the code is parsed incorrectly.",
    link: "https://en.cppreference.com/w/cpp/language/dependent_name#The_template_disambiguator",
  },
  {
    id: 1322,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "What is the Curiously Recurring Template Pattern and what does it achieve?",
    options: [
      "A class derives from a template instantiated with itself to enable static polymorphism at compile time",
      "A template recursively instantiates itself with decreasing arguments to compute values at compile time",
      "A class template uses its own name as a default argument for one of its type parameters in the list",
      "A function template calls itself with different types to generate all possible overload combinations",
    ],
    correctIndex: 0,
    explanation:
      "CRTP involves a class Derived inheriting from Base<Derived>. The base class can call derived class methods through static_cast<Derived*>(this), achieving polymorphism without virtual functions. This is used in libraries like Boost.Operators and std::enable_shared_from_this.",
    link: "https://en.cppreference.com/w/cpp/language/crtp",
  },
  {
    id: 1323,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "How does if constexpr differ from a regular if statement inside a template function?",
    options: [
      "if constexpr evaluates the condition at runtime but optimizes away the unused branch afterward",
      "if constexpr discards the false branch at compile time so it does not need to be valid code",
      "if constexpr requires both branches to type-check correctly even if one is never instantiated",
      "if constexpr is limited to boolean literals while regular if accepts any boolean expression value",
    ],
    correctIndex: 1,
    explanation:
      "if constexpr evaluates its condition at compile time. The branch not taken is discarded entirely and is not instantiated, so it does not need to be valid for the current template arguments. This replaces many SFINAE and tag dispatch patterns.",
    link: "https://en.cppreference.com/w/cpp/language/if#Constexpr_if",
  },
  {
    id: 1324,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "What is a fold expression in C++17 and how does it simplify variadic template code?",
    options: [
      "It folds a parameter pack into a tuple by converting each argument into a tuple element value",
      "It folds a template hierarchy by merging base class methods into the most derived class body",
      "It applies a binary operator to all elements of a parameter pack in a single compact expression",
      "It reduces the compile time of variadic templates by folding identical instantiations together",
    ],
    correctIndex: 2,
    explanation:
      "A fold expression like (args + ...) applies the + operator across all elements of the parameter pack args. C++17 supports four forms: unary left fold, unary right fold, binary left fold, and binary right fold, replacing recursive template expansion patterns.",
    link: "https://en.cppreference.com/w/cpp/language/fold",
  },
  {
    id: 1325,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is template metaprogramming and what makes it Turing-complete?",
    options: [
      "It generates runtime reflection data for templates so they can inspect their own type arguments",
      "It converts template definitions into optimized assembly code using pattern matching at link time",
      "It provides a visual debugging interface for stepping through template instantiation sequences",
      "It uses template instantiation to perform computation at compile time through recursive specialization",
    ],
    correctIndex: 3,
    explanation:
      "Template metaprogramming exploits the fact that template instantiation is Turing-complete. Using recursive template specializations and constexpr, you can compute values, select types, and generate code at compile time. The classic example is computing factorials at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/template_metaprogramming",
  },
  {
    id: 1326,
    difficulty: "Hard",
    topic: "Templates",
    question: "What problem does std::void_t solve in template metaprogramming?",
    options: [
      "It maps any well-formed type arguments to void, enabling simple SFINAE-based type trait detection",
      "It creates a void pointer wrapper that provides type-safe access to erased template type arguments",
      "It converts any template instantiation error into a void return type instead of a compile failure",
      "It provides a placeholder type for unused template parameters to suppress compiler warning messages",
    ],
    correctIndex: 0,
    explanation:
      "std::void_t<T...> is an alias for void that succeeds only if all type arguments are well-formed. It simplifies writing type traits by leveraging SFINAE: if the types in void_t are invalid, the specialization is discarded.",
    link: "https://en.cppreference.com/w/cpp/types/void_t",
  },
  {
    id: 1327,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is the purpose of std::declval<T>() in template metaprogramming?",
    options: [
      "It constructs a temporary object of type T and returns it for use in runtime expressions",
      "It declares a global variable of type T that persists across all template instantiations",
      "It produces an unevaluated reference to T for use in decltype expressions without constructing T",
      "It validates that type T has a default constructor and returns a boolean result at compile time",
    ],
    correctIndex: 2,
    explanation:
      "std::declval<T>() returns a reference to T in unevaluated contexts like decltype and sizeof. It allows examining the result type of expressions involving T without requiring T to be constructible. Calling it in an evaluated context is ill-formed.",
    link: "https://en.cppreference.com/w/cpp/utility/declval",
  },
  {
    id: 1328,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "What is tag dispatch and how does it relate to template function overloading?",
    options: [
      "It uses string tags at runtime to select which template specialization should handle a request",
      "It uses empty struct types as function parameters to select overloads at compile time via traits",
      "It attaches metadata tags to template parameters for reflection and serialization at link time",
      "It dispatches template instantiation requests to different compilation threads for parallel builds",
    ],
    correctIndex: 1,
    explanation:
      "Tag dispatch uses empty tag types (like std::true_type and std::false_type) as additional function parameters to select the correct overload at compile time. A dispatching function calls the appropriate overload by passing a tag derived from a type trait.",
    link: "https://www.learncpp.com/cpp-tutorial/class-template-specialization/",
  },
  {
    id: 1329,
    difficulty: "Hard",
    topic: "Templates",
    question: "What are template template parameters and when are they useful?",
    options: [
      "They are parameters that accept only fully specialized templates with all arguments provided already",
      "They are parameters that allow passing values of any type to a template function at runtime only",
      "They are parameters that duplicate a template definition to create two independent copies of it",
      "They are parameters that accept a template itself as an argument rather than a concrete type value",
    ],
    correctIndex: 3,
    explanation:
      "Template template parameters let you pass an uninstantiated template as a template argument. For example, template<template<typename> class Container> lets you write generic code that works with any single-parameter container template like std::vector or std::list.",
    link: "https://en.cppreference.com/w/cpp/language/template_parameters#Template_template_parameter",
  },
  {
    id: 1330,
    difficulty: "Hard",
    topic: "Templates",
    question:
      "What is explicit instantiation declaration (extern template) and why is it used?",
    options: [
      "It prevents implicit instantiation in the current unit to reduce compile times and code bloat",
      "It exports a template definition to other translation units so they can access it without headers",
      "It forces the compiler to check all possible template instantiations for correctness at once",
      "It marks a template as external linkage so it can be shared across dynamically loaded libraries",
    ],
    correctIndex: 0,
    explanation:
      "extern template class MyClass<int>; tells the compiler not to instantiate that template in the current translation unit. The instantiation must exist in exactly one other unit. This avoids redundant instantiations across many files, reducing compile time and object file size.",
    link: "https://en.cppreference.com/w/cpp/language/class_template#Explicit_instantiation",
  },
  {
    id: 1331,
    difficulty: "Hard",
    topic: "Templates",
    question: "What is expression SFINAE and how does it extend traditional SFINAE?",
    options: [
      "It detects whether an expression throws an exception at runtime and selects an overload based on that",
      "It checks whether an expression compiles faster than a threshold and rejects slow instantiations",
      "It checks whether an arbitrary expression is well-formed in a substituted context beyond just types",
      "It evaluates expressions at compile time and substitutes the result as a non-type template argument",
    ],
    correctIndex: 2,
    explanation:
      "Expression SFINAE extends SFINAE beyond type formation to check whether expressions are valid. For example, decltype(std::declval<T>() + std::declval<U>()) triggers SFINAE if T and U cannot be added. This enables checking for the existence of operators and member functions.",
    link: "https://en.cppreference.com/w/cpp/language/sfinae#Expression_SFINAE",
  },
];
