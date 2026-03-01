import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 21,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What does std::move(x) actually do?",
    options: [
      "Deletes x",
      "Swaps x with a temporary",
      "Casts x to an rvalue reference",
      "Moves x to a new memory location",
    ],
    correctIndex: 2,
    explanation:
      "std::move is purely a cast (static_cast<T&&>). It does not move anything by itself. The actual move happens when the result is passed to a move constructor or move assignment operator.",
    link: "https://en.cppreference.com/w/cpp/utility/move.html",
  },
  {
    id: 22,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What is printed?",
    code: `int x = 10;\nauto f = [x]() mutable { x++; return x; };\nf();\nf();\nstd::cout << x;`,
    options: ["11", "Compilation error", "12", "10"],
    correctIndex: 3,
    explanation:
      "x is captured by value. The mutable keyword allows the lambda to modify its internal copy, but the original x is never changed.",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 23,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "Which statement is true about constexpr functions in C++20?",
    options: [
      "They can be evaluated at compile time OR runtime depending on context",
      "They are identical to inline functions in behavior and guarantees",
      "They cannot contain loops, branches, or conditional statements",
      "They are always evaluated at compile time regardless of context",
    ],
    correctIndex: 0,
    explanation:
      "A constexpr function is evaluated at compile time when all arguments are constant expressions and the result is used in a constant context. Otherwise it runs at runtime. In C++20, constexpr functions can contain loops, branches, and even try-catch.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr.html",
  },
  {
    id: 48,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What are x and y?",
    code: `auto [x, y] = std::pair{1, 2};`,
    options: [
      "Copies of the pair's members",
      "Pointers to the pair's members",
      "References to the pair's members",
      "Compilation error",
    ],
    correctIndex: 0,
    explanation:
      "auto [x, y] creates copies by value. To get references, use auto& [x, y]. Structured bindings (C++17) work with std::pair, std::tuple, std::array, and any aggregate type.",
    link: "https://en.cppreference.com/w/cpp/language/structured_binding.html",
  },
  {
    id: 49,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "Does the explicit std::move help or hurt performance?",
    code: `std::string createMessage() {\n    std::string result = "hello";\n    return std::move(result);\n}`,
    options: [
      "No effect -- the compiler ignores std::move on return statements",
      "Helps -- guarantees the string is moved instead of copied",
      "Hurts -- prevents Named Return Value Optimization (NRVO)",
      "Compilation error",
    ],
    correctIndex: 2,
    explanation:
      "NRVO constructs the return value directly in the caller's memory, avoiding both copies and moves. std::move changes the expression from a named variable to an xvalue, which disables NRVO and forces an actual move operation.",
    link: "https://en.cppreference.com/w/cpp/language/copy_elision.html",
  },
  {
    id: 50,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What is the problem?",
    code: `auto makeCounter() {\n    int count = 0;\n    return [&count]() { return ++count; };\n}\n\nauto counter = makeCounter();\ncounter();`,
    options: [
      "Dangling reference",
      "Compilation error",
      "No problem -- the lambda correctly extends the lifetime of count",
      "Lambda cannot capture local variables by reference or by value",
    ],
    correctIndex: 0,
    explanation:
      "The lambda captures count by reference, but count is a local variable that dies at the end of makeCounter. Calling the returned lambda reads a dangling reference (undefined behavior). Capture by value instead.",
    link: "https://www.learncpp.com/cpp-tutorial/lambda-captures/",
  },
  {
    id: 58,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What is printed?",
    code: `std::string a = "hello";\nstd::string b = std::move(a);\nstd::cout << a.size();`,
    options: ["Compilation error", "0", "Undefined behavior", "5"],
    correctIndex: 1,
    explanation:
      "After being moved from, a is in a 'valid but unspecified' state. However, std::string's move constructor is specified to leave the source empty, so a.size() reliably returns 0.",
    link: "https://en.cppreference.com/w/cpp/utility/move.html",
  },
  {
    id: 63,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "If a class's move constructor is NOT marked noexcept, what does std::vector do when it needs to reallocate?",
    options: [
      "Uses the move constructor anyway",
      "Throws std::bad_alloc",
      "Calls std::terminate",
      "Falls back to copying elements instead of moving them",
    ],
    correctIndex: 3,
    explanation:
      "vector must provide the strong exception guarantee during reallocation. If a move constructor could throw mid-reallocation, the original elements would already be in a moved-from state with no way to recover. Copying is safe because the originals remain untouched if an exception occurs.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 67,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "Two lambdas have identical signatures and bodies. Are f and g the same type?",
    code: `auto f = [](int x) { return x * 2; };\nauto g = [](int x) { return x * 2; };`,
    options: [
      "No -- each lambda expression has a unique compiler-generated type",
      "Yes -- they have identical signatures and bodies",
      "It depends on the compiler's optimization level",
      "Yes -- non-capturing lambdas always share the same type",
    ],
    correctIndex: 0,
    explanation:
      "The C++ standard mandates that every lambda expression produces a value of a unique, unnamed closure type, even if two lambdas are textually identical. Both can convert to int(*)(int) since they're non-capturing, but their closure types differ.",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 602,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What are rvalue references (&&) and what problem do they solve?",
    code: `std::string a = "hello";\nstd::string b = std::move(a);  // moves instead of copies`,
    options: [
      "A reference type that can only bind to const-qualified objects and prevents any modification",
      "A reference modifier that prevents any modification of the referenced object, similar to const but enforced at the template-deduction level",
      "An rvalue reference (T&&) binds to temporaries and moved-from objects, enabling move semantics",
      "A double pointer that stores the address of another pointer variable, allowing indirect modification of the original pointer's target",
    ],
    correctIndex: 2,
    explanation:
      "Before C++11, returning a large vector from a function copied the entire contents. With move semantics, the returned vector's internal pointer is transferred (stolen) to the destination -- O(1) instead of O(n). std::move casts an lvalue to an rvalue reference, enabling the move.",
    link: "https://www.learncpp.com/cpp-tutorial/rvalue-references/",
  },
  {
    id: 603,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What is a lambda expression and what does it capture?",
    code: `int multiplier = 3;\nauto fn = [multiplier](int x) { return x * multiplier; };\nfn(10);  // returns 30`,
    options: [
      "A preprocessor macro that generates a standalone function definition at the call site during preprocessing -- the macro expansion produces a regular named function that is visible throughout the translation unit",
      "An anonymous function object defined inline. The capture list [multiplier] specifies which outer variables to capture. [=] captures all by value, [&] captures all by reference, [this] captures the enclosing object",
      "A function pointer with extra syntax sugar that the compiler converts directly into a regular C-style function pointer during compilation -- lambdas have no runtime overhead and no associated object or state",
      "A named function defined inline within another function's body, which can only access global variables and its own parameters -- it does not have access to the enclosing scope's local variables",
    ],
    correctIndex: 1,
    explanation:
      "Lambdas are syntactic sugar for compiler-generated functor classes. The capture becomes a data member, the parameter list and body become operator(). Each lambda has a unique anonymous type. Use auto or std::function to store them. They're essential for STL algorithms, callbacks, and modern C++ idioms.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/",
  },
  {
    id: 604,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What is std::optional and when should you use it?",
    code: `std::optional<int> findIndex(const std::vector<int>& v, int target) {\n    for (int i = 0; i < v.size(); ++i)\n        if (v[i] == target) return i;\n    return std::nullopt;  // not found\n}`,
    options: [
      "A container that holds multiple optional values simultaneously, similar to a variant but allowing all values to be absent",
      "A compile-time check that statically verifies a value exists at every usage site, causing a compilation error if the compiler's flow analysis determines the optional might be empty when accessed",
      "A wrapper that either contains a value of type T or is empty (nullopt). It replaces sentinel values (-1, nullptr) and out-parameters for functions that may not produce a result",
      "An alias for a raw pointer that might be null, providing the same semantics as T* but with a cleaner syntax",
    ],
    correctIndex: 2,
    explanation:
      "optional<T> stores the value inline (no heap allocation). Check with has_value() or implicit bool conversion. Access with value() (throws on empty) or *opt (UB on empty). value_or(default) provides a fallback. It's cleaner and safer than returning -1 or using a bool out-parameter.",
    link: "https://en.cppreference.com/w/cpp/utility/optional.html",
  },
  {
    id: 605,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What are initializer lists and why does C++11 prefer brace initialization?",
    code: `std::vector<int> v = {1, 2, 3, 4, 5};\nstd::map<std::string, int> m = {{\"a\", 1}, {\"b\", 2}};`,
    options: [
      "Initializer lists require including a special header <initializer_list> that is not part of the standard library and must be provided by a third-party package",
      "Brace initialization is significantly slower than parenthesis initialization because the compiler must construct a temporary std::initializer_list object on the heap, copy all elements into it, and then pass it to the constructor",
      "std::initializer_list<T> enables containers to be initialized with {value, value, ...} syntax. Brace initialization also prevents narrowing conversions and avoids the most-vexing parse",
      "Initializer lists are only usable for C-style arrays and cannot be used with STL containers, class constructors, or any other user-defined types",
    ],
    correctIndex: 2,
    explanation:
      "std::initializer_list<T> is a lightweight proxy for a temporary array. Constructors that accept it enable {}-initialization. Brace init also catches narrowing (int x{3.14} is an error) and resolves the most-vexing parse. Caveat: if a class has both initializer_list and regular constructors, {} prefers the initializer_list version.",
    link: "https://en.cppreference.com/w/cpp/utility/initializer_list.html",
  },
  {
    id: 606,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What does the nullptr keyword replace?",
    options: [
      "nullptr is a special memory address that the operating system reserves and marks as non-accessible, causing a hardware trap (segfault) whenever any process attempts to read or write to it",
      "nullptr prevents null pointer dereferences at compile time by making the compiler statically analyze all pointer usage paths and reject any code where a pointer could potentially be null when dereferenced",
      "nullptr is a type-safe null pointer constant of type std::nullptr_t. It replaces NULL and avoids ambiguity: f(0) might call f(int) instead of f(int*), but f(nullptr) always calls f(int*)",
      "It replaces the integer literal 0 in all contexts throughout the language",
    ],
    correctIndex: 2,
    explanation:
      "NULL is typically defined as 0, which is an int. This causes overload resolution issues: f(NULL) calls f(int), not f(int*). nullptr has its own type (std::nullptr_t) that converts to any pointer type but not to integers. Always use nullptr in modern C++.",
    link: "https://en.cppreference.com/w/cpp/language/nullptr.html",
  },
  {
    id: 607,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What is a move constructor and when is it called?",
    code: `class Buffer {\n    int* data;\n    size_t size;\npublic:\n    Buffer(Buffer&& other) noexcept\n        : data(other.data), size(other.size) {\n        other.data = nullptr;\n        other.size = 0;\n    }\n};`,
    options: [
      "A move constructor performs a deep copy of all the object's data including heap-allocated resources, and then explicitly destroys the original object by calling its destructor to free the source's resources",
      "A move constructor transfers ownership of resources from a source (rvalue) to the new object by stealing its internal pointers/handles, then nullifies the source. The source must be left in a valid but unspecified state",
      "Move constructors are only invoked when the programmer explicitly calls std::move()",
      "Move constructors are automatically generated by the compiler for all classes without exception, including classes with user-defined destructors, virtual functions, and non-movable members like std::mutex",
    ],
    correctIndex: 1,
    explanation:
      "The move constructor 'steals' the guts of the source: copy the pointer, set the source's pointer to null. This avoids deep copying -- O(1) instead of O(n). It's called when the source is an rvalue (temporary or std::move'd). Mark it noexcept so std::vector can use it during reallocation.",
    link: "https://www.learncpp.com/cpp-tutorial/move-constructors-and-move-assignment/",
  },
  {
    id: 608,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What are structured bindings (C++17)?",
    code: `auto [x, y, z] = std::tuple{1, 2.0, \"hello\"};\nstd::map<std::string, int> m;\nfor (const auto& [key, value] : m) {\n    std::cout << key << ": " << value;\n}`,
    options: [
      "Structured bindings decompose an object into named parts. They work with tuples, pairs, arrays, and any struct with all public members. The compiler creates hidden references to the individual elements",
      "Structured bindings only work within range-based for loops and cannot be used in standalone variable declarations, function return value decomposition, or any other statement context outside of iteration constructs",
      "Structured bindings always create deep copies of each individual member of the source object, allocating new storage for every binding variable regardless of whether the binding is declared with auto, const auto&, or auto&&",
      "A syntax for destructuring only C-style arrays into individually named variables",
    ],
    correctIndex: 0,
    explanation:
      "Structured bindings bind names to sub-objects. For auto& [k, v] : map, k binds to pair.first, v to pair.second. For structs, they bind to members in declaration order. With auto (no &), they copy; with auto& they reference. This dramatically cleans up code that works with pairs, tuples, and structs.",
    link: "https://en.cppreference.com/w/cpp/language/structured_binding.html",
  },
  {
    id: 609,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What does if constexpr do differently from a regular if?",
    code: `template<typename T>\nstd::string stringify(T val) {\n    if constexpr (std::is_same_v<T, std::string>)\n        return val;\n    else if constexpr (std::is_arithmetic_v<T>)\n        return std::to_string(val);\n    else\n        static_assert(false, "unsupported type");\n}`,
    options: [
      "if constexpr only works with boolean literal values written directly in the source code",
      "if constexpr evaluates the condition at compile time and discards the false branch entirely",
      "The false branch of an if constexpr is still fully compiled, type-checked, and included in the generated object code, but the optimizer removes the unreachable branch during the linking phase as dead code elimination",
      "It's functionally the same as a regular if statement but hints to the optimizer that the condition is likely to be constant, enabling better branch prediction and potentially faster code",
    ],
    correctIndex: 1,
    explanation:
      "In a regular if, both branches must be valid for all types. With if constexpr, the compiler evaluates the condition at compile time and completely discards the false branch -- it's not instantiated. This replaces many SFINAE and tag-dispatch patterns with cleaner, linear code.",
    link: "https://en.cppreference.com/w/cpp/language/if.html",
  },
  {
    id: 610,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What are designated initializers (C++20)?",
    code: `struct Config {\n    int width = 800;\n    int height = 600;\n    bool fullscreen = false;\n    int fps = 60;\n};\n\nConfig cfg = {.width = 1920, .height = 1080, .fullscreen = true};`,
    options: [
      "A way to initialize only specific fields, leaving others at their default values. The designators (.field =) must appear in declaration order",
      "A way to name constructor parameters by prefixing each argument with the parameter name, allowing out-of-order passing in function calls",
      "They work in any order like Python keyword arguments",
      "They replace constructors entirely",
    ],
    correctIndex: 0,
    explanation:
      "Designated initializers let you name which fields you're setting, making code self-documenting. Fields not mentioned keep their default values. Unlike C, C++20 requires designators in declaration order and doesn't support nested designators (.outer.inner). This is ideal for configuration structs.",
    link: "https://en.cppreference.com/w/cpp/language/aggregate_initialization.html",
  },
  {
    id: 611,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What does std::string_view provide over const std::string&?",
    code: `void process(std::string_view sv) { /* read-only access */ }\n\nprocess("hello");              // no allocation (char* → string_view)\nprocess(std::string("hello")); // no copy\nprocess(someString);           // no copy`,
    options: [
      "string_view allocates a separate copy of the string data on the heap, creating an independent owned buffer that remains valid even after the source string is destroyed or modified by other code",
      "string_view is slower but safer than const string& because it performs bounds checking on every character access and throws std::out_of_range for invalid indices, adding overhead compared to raw references",
      "string_view is a mutable reference to a string's internal buffer, allowing direct modification of individual characters without copying the data",
      "string_view is a non-owning, lightweight view that can bind to std::string, C-strings, and substrings without copying or allocating. Unlike const string&, it doesn't require constructing a std::string from a char*",
    ],
    correctIndex: 3,
    explanation:
      "const string& for a char* argument silently constructs a temporary std::string (heap allocation!). string_view just stores a pointer and length -- zero allocation for any input. Caveat: string_view does NOT own the data. Don't return it from a function if the underlying string might be destroyed.",
    link: "https://en.cppreference.com/w/cpp/string/basic_string_view.html",
  },
  {
    id: 612,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What is reference collapsing and why is it essential for perfect forwarding?",
    code: `template<typename T>\nvoid f(T&& arg);  // forwarding reference\n\n// When called with lvalue int x:\n// T = int&, T&& = int& && → collapses to int&\n\n// When called with rvalue 42:\n// T = int, T&& = int&&`,
    options: [
      "Collapsing means the reference qualifier is removed entirely from the type, stripping both & and && to produce a plain non-reference value type",
      "Reference collapsing rules: T& & → T&, T& && → T&, T&& & → T&, T&& && → T&&. Only rvalue + rvalue stays rvalue. This lets T&& serve as a 'universal/forwarding reference' that deduces to lvalue ref for lvalues and rvalue ref for rvalues, enabling std::forward to preserve value category",
      "References can never be combined or nested",
      "Reference collapsing only applies to function return types and has no effect on parameter types, local variable declarations, or template argument deduction",
    ],
    correctIndex: 1,
    explanation:
      "Reference collapsing is the mechanism behind forwarding references. When T is deduced as int& (for an lvalue), T&& becomes int& && which collapses to int&. std::forward<T>(arg) uses this: if T is a reference type, it returns an lvalue; if T is a non-reference type, it returns an rvalue. This is perfect forwarding.",
    link: "https://en.cppreference.com/w/cpp/language/reference.html",
  },
  {
    id: 613,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What is a user-defined literal and how do you create one?",
    code: `constexpr long double operator\"\"_deg(long double deg) {\n    return deg * 3.14159265358979L / 180.0L;\n}\n\nauto angle = 90.0_deg;  // converts degrees to radians`,
    options: [
      "You define operator\"\"_suffix to create a literal suffix. The compiler calls your function at compile time when it encounters a number or string with your suffix. Standard library examples: \"hello\"s (string), 5ms (chrono), 0xFF_u8",
      "User-defined literals are preprocessor macros with special suffix syntax",
      "The suffix must start with a letter rather than an underscore",
      "User-defined literals only work with integer types",
    ],
    correctIndex: 0,
    explanation:
      "UDLs extend the literal system. The function is called with the literal value. Suffixes not starting with _ are reserved for the standard library. The standard defines: \"str\"s (std::string), 42i (complex), 100ms/5s/2h (chrono durations). UDLs make units type-safe: 90_deg, 50_km, 100_ms.",
    link: "https://en.cppreference.com/w/cpp/language/user_literal.html",
  },
  {
    id: 614,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What is the difference between std::move and actually moving?",
    options: [
      "std::move transfers memory ownership at the operating system level by updating the virtual memory page table entries so that the destination process or thread owns the physical pages, avoiding any copying of data between address spaces",
      "std::move does NOT move anything",
      "std::move performs the actual move operation",
      "std::move always invalidates the source object completely, leaving it in an undefined state where any operation including destruction is undefined behavior",
    ],
    correctIndex: 1,
    explanation:
      "std::move is equivalent to static_cast<T&&>(x). It says 'I'm done with this, you may steal its resources.' But the receiving function decides what to do. If there's no move constructor, the copy constructor's const T& binds the rvalue -- and a copy happens. std::move on a const object also results in a copy.",
    link: "https://en.cppreference.com/w/cpp/utility/move.html",
  },
  {
    id: 615,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What is the 'immediately invoked lambda' pattern and when is it useful?",
    code: `const auto config = [&]() {\n    Config c;\n    c.width = parseArg("--width", 800);\n    c.height = parseArg("--height", 600);\n    if (debugMode) c.verbose = true;\n    return c;\n}();  // note the () -- invoked immediately`,
    options: [
      "This pattern always causes a heap allocation because the lambda must capture variables from the enclosing scope, and captured state is stored in a heap-allocated closure object managed by std::function internally",
      "An IIFE defines and calls a lambda in one expression. It's useful for complex initialization of const variables",
      "The trailing () is optional and serves only as documentation of the programmer's intent",
      "It's a function pointer assigned to a variable",
    ],
    correctIndex: 1,
    explanation:
      "Without IIFE, you'd have to declare config as non-const and mutate it, or use a helper function. The IIFE lets you run multi-step initialization logic and bind the result to a const variable. It's essentially a 'let' expression. The lambda is optimized away -- no overhead vs writing the code inline.",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 616,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What are the implications of marking a move constructor noexcept?",
    code: `class Widget {\npublic:\n    Widget(Widget&& other) noexcept;  // why noexcept matters\n};`,
    options: [
      "std::vector check is_nothrow_move_constructible before reallocation. If the move constructor is noexcept, vector moves elements (fast). If it might throw, vector copies them instead. Omitting noexcept can silently degrade performance",
      "noexcept prevents the move constructor from being called in normal application code",
      "noexcept is purely documentation and has no observable effect on program behavior or codegen",
      "noexcept automatically makes the move constructor constexpr as well, allowing it to be evaluated at compile time in constexpr contexts",
    ],
    correctIndex: 0,
    explanation:
      "During vector reallocation, if a move throws midway, some elements are moved and some aren't -- the original vector is corrupted. To preserve the strong guarantee, vector only moves if noexcept. Without noexcept on your move constructor, vector silently falls back to copying every element on every reallocation. Always mark moves noexcept.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 1392,
    difficulty: "Easy",
    topic: "Modern C++",
    question:
      "What does the `auto` keyword do when used in a variable declaration in C++11?",
    options: [
      "It declares the variable as having automatic storage duration within the current function scope",
      "It marks the variable for automatic memory cleanup using the built-in garbage collector system",
      "It instructs the compiler to deduce the variable type from the initializer expression provided",
      "It creates a type alias that automatically updates whenever the assigned value type is changed",
    ],
    correctIndex: 2,
    explanation:
      "The auto keyword tells the compiler to deduce the type of the variable from its initializer. It does not relate to storage duration or garbage collection. For example, auto x = 5; deduces x as int.",
    link: "https://en.cppreference.com/w/cpp/language/auto",
  },
  {
    id: 1393,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What does `nullptr` replace in modern C++?",
    options: [
      "It replaces the use of NULL and the integer 0 as null pointer constants with a type-safe alternative",
      "It replaces raw pointer declarations by automatically converting each of them into smart pointer types",
      "It replaces manual memory deallocation by automatically freeing all of the dynamically allocated objects",
      "It replaces void pointer casts by providing an implicit conversion pathway to any concrete pointer type",
    ],
    correctIndex: 0,
    explanation:
      "nullptr is a keyword that represents a null pointer literal with its own type (std::nullptr_t). It replaces the error-prone practice of using NULL or 0 as null pointer constants, which could be ambiguous in overload resolution.",
    link: "https://en.cppreference.com/w/cpp/language/nullptr",
  },
  {
    id: 1394,
    difficulty: "Easy",
    topic: "Modern C++",
    question:
      "What is the correct syntax for a range-based for loop introduced in C++11?",
    code: `std::vector<int> v = {1, 2, 3};`,
    options: [
      "for (int i = 0; i < v.size(); i++) which iterates using an index counter variable throughout",
      "for (auto it = v.begin(); it != v.end(); it++) which uses iterator-based traversal of elements",
      "foreach (auto x in v) which uses the foreach keyword to traverse all of the stored elements",
      "for (auto x : v) which uses the colon syntax to iterate over each element of the container",
    ],
    correctIndex: 3,
    explanation:
      "The range-based for loop uses the syntax for (declaration : range). It iterates over each element in the container. The foreach keyword does not exist in C++, and the other options show traditional loop styles.",
    link: "https://en.cppreference.com/w/cpp/language/range-for",
  },
  {
    id: 1395,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What does `std::move` actually do to its argument?",
    options: [
      "It physically relocates the object data from one memory address to a completely different memory address",
      "It performs an unconditional cast to an rvalue reference, enabling move semantics to then be applied",
      "It transfers ownership of the underlying resource and then automatically sets the source to nullptr",
      "It swaps the internal contents between two objects and then resets the source object to a blank state",
    ],
    correctIndex: 1,
    explanation:
      "std::move does not actually move anything. It is simply an unconditional cast to an rvalue reference (T&&), which makes the object eligible for move semantics. The actual moving happens when a move constructor or move assignment operator receives the rvalue reference.",
    link: "https://en.cppreference.com/w/cpp/utility/move",
  },
  {
    id: 1396,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What kind of ownership does `std::unique_ptr` provide?",
    options: [
      "Exclusive ownership where only one unique_ptr instance can own the managed object at any given time",
      "Shared ownership where multiple unique_ptr instances are allowed to point to the same managed object",
      "Weak ownership where the unique_ptr does not contribute to any of the reference counting operations",
      "Temporary ownership where the unique_ptr automatically expires after reaching a configurable timeout",
    ],
    correctIndex: 0,
    explanation:
      "std::unique_ptr provides exclusive (sole) ownership of a dynamically allocated object. It cannot be copied, only moved, ensuring that exactly one unique_ptr owns the object at any time. When the unique_ptr is destroyed, the managed object is deleted.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr",
  },
  {
    id: 1397,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What is the purpose of the `override` keyword in C++11?",
    options: [
      "It forces the compiler to generate a default implementation of the virtual function body automatically",
      "It allows a derived class to change the return type of the base class function it is now replacing",
      "It explicitly indicates that a function is meant to override a virtual function in the base class",
      "It prevents further derived classes from providing their own version of that virtual function body",
    ],
    correctIndex: 2,
    explanation:
      "The override keyword explicitly marks a function as overriding a base class virtual function. If the function does not actually override anything (e.g., due to a signature mismatch), the compiler generates an error. This helps catch bugs that would otherwise be silent.",
    link: "https://en.cppreference.com/w/cpp/language/override",
  },
  {
    id: 1398,
    difficulty: "Easy",
    topic: "Modern C++",
    question:
      "What is the primary advantage of using brace initialization (uniform initialization) in C++11?",
    options: [
      "It allows initializing all variables without specifying any type name for the declaration statement",
      "It automatically selects the most efficient constructor overload based on the argument values given",
      "It enables implicit narrowing conversions between numeric types and simplifies all casting operations",
      "It prevents narrowing conversions and provides consistent syntax for every initialization context",
    ],
    correctIndex: 3,
    explanation:
      "Brace initialization (using {}) prevents narrowing conversions (e.g., double to int) that would silently lose data. It also provides a uniform syntax that works for all types: primitives, aggregates, and classes with constructors.",
    link: "https://en.cppreference.com/w/cpp/language/list_initialization",
  },
  {
    id: 1399,
    difficulty: "Easy",
    topic: "Modern C++",
    question:
      "What does the `constexpr` specifier indicate about a function or variable?",
    options: [
      "It declares that the function or variable is only accessible from within a constant expression scope",
      "It indicates that the value or return value can be evaluated and computed at compile time if possible",
      "It declares that the function will be inlined at every call site to reduce the runtime call overhead",
      "It declares that the variable is stored in read-only memory and causes an error if modified anywhere",
    ],
    correctIndex: 1,
    explanation:
      "constexpr tells the compiler that the function or variable can be evaluated at compile time. A constexpr function must satisfy certain constraints (e.g., no undefined behavior), and the compiler may compute the result during compilation rather than at runtime.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr",
  },
  {
    id: 1400,
    difficulty: "Easy",
    topic: "Modern C++",
    question:
      "What does the `final` keyword prevent when applied to a class in C++11?",
    options: [
      "It prevents any other class from inheriting from the class that has been declared as final",
      "It prevents the class from being instantiated directly and requires using a derived subclass",
      "It prevents modification of all data members by making the entire class effectively constant",
      "It prevents the class from being copied or moved by implicitly deleting those operators",
    ],
    correctIndex: 0,
    explanation:
      "When applied to a class, the final keyword prevents any further derivation from that class. Any attempt to inherit from a final class results in a compilation error. It can also be applied to virtual functions to prevent them from being overridden in derived classes.",
    link: "https://en.cppreference.com/w/cpp/language/final",
  },
  {
    id: 1401,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What is a lambda expression in C++11?",
    options: [
      "A named function template that the compiler generates from a prototype specified inline in the code",
      "A macro expansion mechanism that replaces function calls with their body text at preprocessing time",
      "An anonymous function object that can be defined inline and that captures variables from its scope",
      "A coroutine construct that allows functions to suspend their execution and resume at a later point",
    ],
    correctIndex: 2,
    explanation:
      "A lambda expression creates an anonymous function object (closure) that can capture variables from its enclosing scope. The syntax is [capture](params) -> ret { body }. Lambdas are widely used with STL algorithms and for callbacks.",
    link: "https://en.cppreference.com/w/cpp/language/lambda",
  },
  {
    id: 1402,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What do structured bindings, introduced in C++17, allow you to do?",
    code: `auto [x, y] = std::make_pair(1, 2);`,
    options: [
      "Destructure only arrays and C-style structs into named variables at the exact point of declaration",
      "Create type aliases for each member of a class so they can be used as shorter local identifier names",
      "Automatically convert a tuple into a parameter pack so it can be forwarded to some other function",
      "Decompose objects like pairs, tuples, and structs into individually named variables in a single step",
    ],
    correctIndex: 3,
    explanation:
      "Structured bindings allow you to decompose an object (pair, tuple, struct, or array) into individual named variables in a single declaration. They work with any type that supports std::tuple_size and std::get, or has accessible public members.",
    link: "https://en.cppreference.com/w/cpp/language/structured_bindings",
  },
  {
    id: 1403,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What problem does `std::optional<T>`, introduced in C++17, solve?",
    options: [
      "It represents a value that may or may not be present, avoiding the need for any special sentinel values",
      "It enforces that a value must always be initialized before use, thereby preventing undefined behavior",
      "It provides thread-safe access to a shared value by wrapping it with an internal mutex lock guard",
      "It creates a lazy evaluation wrapper that delays construction of the value until it is first accessed",
    ],
    correctIndex: 0,
    explanation:
      "std::optional<T> holds either a value of type T or nothing (std::nullopt). It replaces the need for sentinel values like -1 or nullptr to represent 'no value'. Unlike pointers, it does not involve heap allocation and clearly expresses intent.",
    link: "https://en.cppreference.com/w/cpp/utility/optional",
  },
  {
    id: 1404,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "What is the primary purpose of rvalue references (declared with `&&`) in C++11?",
    options: [
      "They create constant references that can bind to temporaries and also extend the temporary lifetime",
      "They allow functions to restrict their parameters so that they accept only literal values not variables",
      "They enable move semantics by allowing functions to detect and transfer temporary object resources",
      "They provide universal references that can bind to both lvalue and rvalue expression categories",
    ],
    correctIndex: 2,
    explanation:
      "Rvalue references (T&&) enable move semantics by allowing functions to distinguish between temporary objects (rvalues) and persistent objects (lvalues). Move constructors and move assignment operators take rvalue references, enabling efficient resource transfer from temporaries.",
    link: "https://en.cppreference.com/w/cpp/language/reference",
  },
  {
    id: 1405,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "What is the difference between `[=]` and `[&]` in a C++11 lambda capture clause?",
    options: [
      "Capture by value copies only const variables while capture by reference captures all mutable ones",
      "Capture by value copies all accessible local variables while capture by reference aliases them all",
      "Capture by value binds to global variables only while capture by reference binds to local variables",
      "Capture by value creates deep copies of all pointer types while capture by reference shares memory",
    ],
    correctIndex: 1,
    explanation:
      "[=] captures all local variables by value (making copies), while [&] captures all local variables by reference (creating aliases). With [=], modifying a captured variable inside the lambda does not affect the original (unless the lambda is mutable). With [&], changes are reflected in the original.",
    link: "https://en.cppreference.com/w/cpp/language/lambda",
  },
  {
    id: 1406,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "What is the main advantage of using `std::string_view` introduced in C++17?",
    options: [
      "It provides a mutable view into a string that allows efficient in-place modification of each character",
      "It automatically manages the lifetime of the underlying string data using reference counting inside",
      "It converts all string types into a common format that enables cross-platform text encoding support",
      "It provides a lightweight non-owning reference to a string and avoids unnecessary copy operations",
    ],
    correctIndex: 3,
    explanation:
      "std::string_view is a non-owning, read-only reference to a contiguous sequence of characters. It avoids copying string data, making it efficient for passing strings to functions. Since it does not own the data, the underlying string must outlive the string_view.",
    link: "https://en.cppreference.com/w/cpp/string/basic_string_view",
  },
  {
    id: 1407,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "What does `if constexpr` in C++17 do differently from a regular `if` statement?",
    options: [
      "It evaluates the condition at compile time and completely discards the branch that is not taken",
      "It converts both the taken and untaken branch paths into branchless instructions for optimization",
      "It forces the condition to use only constexpr variables and rejects any runtime value arguments",
      "It caches the result of the first evaluation and reuses that same cached result on later calls",
    ],
    correctIndex: 0,
    explanation:
      "if constexpr evaluates the condition at compile time. The branch that is not taken is discarded entirely and does not need to be valid code for the given template arguments. This is especially useful in templates to avoid instantiating code paths that would not compile for certain types.",
    link: "https://en.cppreference.com/w/cpp/language/if",
  },
  {
    id: 1408,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "Why is `std::make_shared<T>(args)` generally preferred over `std::shared_ptr<T>(new T(args))`?",
    options: [
      "It enables the shared pointer to use stack allocation instead of heap allocation for small objects",
      "It allows the shared pointer to bypass reference counting and use garbage collection for cleanup",
      "It combines the control block and object into a single allocation, which improves cache locality",
      "It automatically selects between shared and unique pointer semantics based on context of the usage",
    ],
    correctIndex: 2,
    explanation:
      "std::make_shared performs a single heap allocation for both the object and the control block (which holds the reference count). Using new T separately allocates the object first, then the shared_ptr allocates another block for the control data, resulting in two allocations and worse cache locality.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared",
  },
  {
    id: 1409,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "What does the `noexcept` specifier do when applied to a function in C++11?",
    options: [
      "It causes the compiler to wrap the entire function body in a try-catch block that silently ignores errors",
      "It indicates that the function will not throw exceptions, allowing the compiler to optimize further",
      "It converts all exceptions thrown inside the function into error codes returned to the caller directly",
      "It restricts the function from calling any other functions that have not also been marked as noexcept",
    ],
    correctIndex: 1,
    explanation:
      "noexcept declares that a function will not throw exceptions. If it does throw, std::terminate is called. The compiler can use this guarantee to optimize code, and certain standard library operations (like std::vector reallocation) prefer noexcept move operations for exception safety.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec",
  },
  {
    id: 1410,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What is Class Template Argument Deduction (CTAD), introduced in C++17?",
    code: `std::pair p(1, 2.0); // What feature allows omitting <int, double>?`,
    options: [
      "The compiler deduces template arguments from constructor arguments so you can omit them entirely",
      "The compiler generates a new class specialization based on the types of variables in the context",
      "The compiler replaces the template class with a concrete class matching the nearest overload set",
      "The compiler infers the return type of template member functions from the return value statement",
    ],
    correctIndex: 0,
    explanation:
      "CTAD allows the compiler to deduce class template arguments from the arguments passed to the constructor, so you can write std::pair p(1, 2.0) instead of std::pair<int, double> p(1, 2.0). This works for standard library types and user-defined types with appropriate deduction guides.",
    link: "https://en.cppreference.com/w/cpp/language/class_template_argument_deduction",
  },
  {
    id: 1411,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "What advantage does a scoped enumeration (`enum class`) have over a traditional `enum`?",
    options: [
      "It allows enumerators to hold string values in addition to the underlying integer representation",
      "It generates comparison operators automatically so that enumerators can be sorted by their names",
      "It permits enumerators from different enum types to share the same name in a single enclosing scope",
      "It prevents implicit conversions to integers and keeps enumerator names scoped to the enum itself",
    ],
    correctIndex: 3,
    explanation:
      "enum class (scoped enumeration) has two main advantages: enumerators do not implicitly convert to integers (you must use static_cast), and enumerator names are scoped within the enum (accessed via EnumName::Value), preventing name collisions with other enumerators.",
    link: "https://en.cppreference.com/w/cpp/language/enum",
  },
  {
    id: 1412,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "What problem does `std::forward` solve in the context of perfect forwarding?",
    options: [
      "It prevents argument type decay by preserving array and function types during template forwarding",
      "It forces all arguments into rvalue references to guarantee that move semantics always get applied",
      "It preserves whether an argument was an lvalue or rvalue so the correct overload gets called next",
      "It converts all forwarded arguments to const references to prevent any unintended modifications",
    ],
    correctIndex: 2,
    explanation:
      "std::forward conditionally casts its argument to an rvalue reference only if the original argument was an rvalue. In a forwarding reference (T&&), T is deduced as an lvalue reference for lvalues and as a non-reference for rvalues. std::forward uses this to preserve the original value category when passing to another function.",
    link: "https://en.cppreference.com/w/cpp/utility/forward",
  },
  {
    id: 1413,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "What do fold expressions, introduced in C++17, allow you to do with parameter packs?",
    code: `template<typename... Args>
auto sum(Args... args) { return (... + args); }`,
    options: [
      "They expand parameter packs into recursive template instantiations that process each element in turn",
      "They apply a binary operator across all elements in a parameter pack without writing any recursion",
      "They convert parameter packs into initializer lists that are then passed to a standard library call",
      "They unpack all variadic arguments into separate function calls that each handle a single argument",
    ],
    correctIndex: 1,
    explanation:
      "Fold expressions provide a concise way to apply a binary operator over all elements of a parameter pack. The syntax (... op args) is a left fold, and (args op ...) is a right fold. Before C++17, you needed recursive template instantiation to achieve the same result.",
    link: "https://en.cppreference.com/w/cpp/language/fold",
  },
  {
    id: 1414,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What do user-defined literals in C++11 allow a programmer to create?",
    code: `constexpr long double operator""_deg(long double d) {
  return d * 3.14159265 / 180;
}`,
    options: [
      "Custom suffixes for literals that invoke a specific function to produce a typed value from the input",
      "New fundamental types that can be used in arithmetic expressions alongside built-in numeric types",
      "Compile-time string parsers that convert string literals into structured data at preprocessing time",
      "Overloaded assignment operators that convert raw literals to user-defined class instances implicitly",
    ],
    correctIndex: 0,
    explanation:
      "User-defined literals allow you to define custom suffixes (like _deg, _km, _s) that transform literal values by calling a function. The suffix must start with an underscore. This enables expressive syntax like 90.0_deg or 5_km while being type-safe.",
    link: "https://en.cppreference.com/w/cpp/language/user_literal",
  },
  {
    id: 1415,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "How does `std::any` in C++17 store values of arbitrary types?",
    options: [
      "It stores a void pointer to the original object and relies on the programmer to cast back correctly",
      "It serializes the value into a byte array and deserializes it when the stored value is retrieved",
      "It uses a union of all primitive types combined with a template wrapper for user-defined class types",
      "It uses type erasure to store any copyable type and performs a type check when the value is accessed",
    ],
    correctIndex: 3,
    explanation:
      "std::any uses type erasure internally to store a value of any copy-constructible type. It stores type information alongside the value, and std::any_cast<T> checks this information at runtime, throwing std::bad_any_cast if the types do not match. Small objects may be stored inline (small buffer optimization).",
    link: "https://en.cppreference.com/w/cpp/utility/any",
  },
  {
    id: 1416,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What change did C++17 make to aggregate initialization rules?",
    options: [
      "It allowed aggregates to have virtual functions provided they had no user-declared constructor bodies",
      "It required every aggregate member to provide a default member initializer for the class to qualify",
      "It extended aggregates to include classes with public base classes, enabling direct initialization",
      "It allowed aggregates to contain private data members if all members shared the same access level",
    ],
    correctIndex: 2,
    explanation:
      "C++17 extended the definition of an aggregate to include classes with public, non-virtual base classes. This means you can use aggregate initialization syntax to initialize the base class members directly: struct Derived : Base { int x; }; Derived d{{base_args}, x_val};",
    link: "https://en.cppreference.com/w/cpp/language/aggregate_initialization",
  },
  {
    id: 1417,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "According to the C++11 reference collapsing rules, what does `T& &&` collapse to?",
    options: [
      "It collapses to T&& because the rightmost reference type always takes priority in the combination",
      "It collapses to T& because an lvalue reference in any combination always produces an lvalue result",
      "It causes a compilation error because mixing lvalue and rvalue references is not permitted by rules",
      "It collapses to const T& because the compiler adds const qualification to resolve the ambiguity",
    ],
    correctIndex: 1,
    explanation:
      "The reference collapsing rules state that if either reference is an lvalue reference, the result is an lvalue reference (T&). Only when both are rvalue references (T&& &&) does the result collapse to T&&. This is fundamental to how forwarding references and std::forward work.",
    link: "https://en.cppreference.com/w/cpp/language/reference",
  },
  {
    id: 1418,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "What does `std::invoke` from C++17 provide that a regular function call does not?",
    options: [
      "It enables calling functions asynchronously by wrapping them in a future that runs on another thread",
      "It offers a uniform way to call any callable such as functions, lambdas, and member function pointers",
      "It adds automatic exception handling to every call by wrapping the invocation in a try-catch block",
      "It defers the function call until the return value is actually needed, implementing lazy evaluation",
    ],
    correctIndex: 1,
    explanation:
      "std::invoke provides a uniform calling syntax for all callable types: regular functions, function pointers, member function pointers, member data pointers, lambdas, and function objects. Without it, calling a member function pointer requires special syntax like (obj.*pmf)(args), while std::invoke(pmf, obj, args) works uniformly.",
    link: "https://en.cppreference.com/w/cpp/utility/functional/invoke",
  },
  {
    id: 1419,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "What does guaranteed copy elision in C++17 mean for returning objects by value?",
    options: [
      "The compiler must move the local object to the caller by using an implicit move constructor call",
      "The compiler may choose to either copy or move the return value depending on the optimization flags",
      "The local object must first be constructed and then bit-copied into the return value storage area",
      "The object is constructed directly in the caller storage, so no copy or move constructor is needed",
    ],
    correctIndex: 3,
    explanation:
      "C++17 guarantees that in certain cases (like returning a prvalue), no copy or move occurs at all. The object is constructed directly in the memory where the caller expects it. This means types that are not copyable or movable can still be returned by value from functions.",
    link: "https://en.cppreference.com/w/cpp/language/copy_elision",
  },
  {
    id: 1420,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "What do inline variables, introduced in C++17, allow that was previously difficult?",
    options: [
      "They allow variables to be allocated on the stack instead of the heap, which improves access speed",
      "They allow global variables to be optimized away entirely by the linker when they are never needed",
      "They allow a variable defined in a header to be shared across multiple translation units without error",
      "They allow const member variables to be modified after construction using a special inline accessor",
    ],
    correctIndex: 2,
    explanation:
      "Inline variables allow a variable to be defined in a header file and included in multiple translation units without causing multiple definition errors. The linker ensures only one instance exists. This is especially useful for static data members of classes defined in headers.",
    link: "https://en.cppreference.com/w/cpp/language/inline",
  },
  {
    id: 1421,
    difficulty: "Hard",
    topic: "Modern C++",
    question: "What is the purpose of a user-defined deduction guide in C++17?",
    code: `template<typename T>
MyContainer(T, T) -> MyContainer<T>;`,
    options: [
      "It specifies how the compiler should optimize the generated template code for a given type argument",
      "It tells the compiler how to deduce class template arguments from constructor arguments during CTAD",
      "It provides a fallback constructor that the compiler uses when no matching constructor overload exists",
      "It defines an implicit conversion sequence from one template specialization to a different one overall",
    ],
    correctIndex: 1,
    explanation:
      "A user-defined deduction guide tells the compiler how to map constructor argument types to class template parameters for CTAD. Without a deduction guide, CTAD uses the constructors directly. Deduction guides are needed when the desired template arguments cannot be deduced from the constructors alone.",
    link: "https://en.cppreference.com/w/cpp/language/class_template_argument_deduction",
  },
];
