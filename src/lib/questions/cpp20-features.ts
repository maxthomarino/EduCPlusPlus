import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 24,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "In C++20, what does defaulting operator<=> on a class give you?",
    options: [
      "All six comparison operators",
      "Only the <=> operator itself",
      "Only == and !=",
      "Only < and >",
    ],
    correctIndex: 0,
    explanation:
      "A defaulted <=> also implicitly generates a defaulted ==. Together they synthesize all six: ==, !=, <, >, <=, >=.",
    link: "https://en.cppreference.com/w/cpp/language/default_comparisons.html",
  },
  {
    id: 25,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "If a struct has a double member, what does its defaulted operator<=> return?",
    options: [
      "std::partial_ordering",
      "std::weak_ordering",
      "Compilation error",
      "std::strong_ordering",
    ],
    correctIndex: 0,
    explanation:
      "double uses std::partial_ordering because NaN is not comparable to any value (including itself). The comparison category of the struct is the weakest category among all its members.",
    link: "https://en.cppreference.com/w/cpp/utility/compare/partial_ordering.html",
  },
  {
    id: 26,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "If you write a custom (non-defaulted) operator<=>, what else must you do to get == and !=?",
    options: [
      "Delete the copy constructor",
      "Explicitly default or define operator==",
      "Nothing -- == is automatically generated from <=>",
      "Define all six comparison operators manually",
    ],
    correctIndex: 1,
    explanation:
      "A defaulted <=> synthesizes ==, but a custom <=> does not. The rationale is that == can often be implemented more efficiently than (a <=> b) == 0.",
    link: "https://en.cppreference.com/w/cpp/language/default_comparisons.html",
  },
  {
    id: 57,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "Where is a C++20 coroutine's state (local variables, suspension point) stored by default?",
    options: [
      "In a static memory pool",
      "In thread-local storage",
      "In a heap-allocated coroutine frame",
      "On the calling thread's stack",
    ],
    correctIndex: 2,
    explanation:
      "When a coroutine is created, the compiler allocates a frame on the heap to hold its local variables and bookkeeping. The compiler may apply Heap Allocation Elision Optimization (HALO) in some cases, but this is not guaranteed.",
    link: "https://en.cppreference.com/w/cpp/language/coroutines.html",
  },
  {
    id: 527,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What is the spaceship operator (three-way comparison)?",
    code: `struct Point {\n    int x, y;\n    auto operator<=>(const Point&) const = default;\n};`,
    options: [
      "A bitwise XOR operator that performs an exclusive-or on each bit of two integral operands and produces a bitmask result, commonly used in encryption and hashing algorithms",
      "The <=> operator compares two objects and returns an ordering in a single operation. Defaulting it auto-generates all six comparison operators",
      "An operator that swaps two values in place using a compiler-optimized three-step exchange, replacing the need for a temporary variable or std::swap call",
      "A replacement for the ternary operator that provides multi-branch conditional evaluation with pattern matching and implicit return-type deduction for complex expressions",
    ],
    correctIndex: 1,
    explanation:
      "operator<=> returns std::strong_ordering, std::weak_ordering, or std::partial_ordering. When defaulted, the compiler generates member-wise comparison. This single declaration replaces writing all six comparison operators manually.",
    link: "https://en.cppreference.com/w/cpp/language/operator_comparison.html",
  },
  {
    id: 528,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What is std::span and what problem does it solve?",
    code: `void process(std::span<int> data) {\n    for (int x : data) std::cout << x << " ";\n}\n\nstd::vector<int> v = {1, 2, 3};\nint arr[] = {4, 5, 6};\nprocess(v);\nprocess(arr);`,
    options: [
      "A new Unicode-aware string type that stores UTF-8 internally and provides code-point iteration, normalization, and locale-sensitive comparison out of the box",
      "A non-owning view over a contiguous sequence of elements. It unifies the interface for arrays, vectors, and other contiguous data",
      "A new owning container that replaces vector by adding bounds checking, automatic resizing, and SIMD-optimized iteration",
      "A reference-counted smart pointer specifically designed for heap-allocated arrays, providing automatic deallocation when the last reference is dropped and bounds-checked element access",
    ],
    correctIndex: 1,
    explanation:
      "std::span<T> stores a pointer and a size. It doesn't own the data -- it's a lightweight view. Functions that accept span<int> work with vectors, arrays, and any contiguous range. It prevents the common bug of passing a pointer without its corresponding size.",
    link: "https://en.cppreference.com/w/cpp/container/span.html",
  },
  {
    id: 529,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What are C++20 concepts at a high level?",
    code: `template<typename T>\nconcept Addable = requires(T a, T b) { a + b; };\n\ntemplate<Addable T>\nT add(T a, T b) { return a + b; }`,
    options: [
      "Runtime type checks similar to dynamic_cast that verify template arguments satisfy certain properties before allowing function calls to proceed",
      "Named compile-time predicates that constrain template parameters. They replace SFINAE and enable clear error messages when a type doesn't meet the requirements",
      "A new class definition syntax that replaces struct and class keywords with a concept block, automatically generating constructors, destructors, and comparison operators",
      "A new inheritance mechanism that allows classes to inherit from multiple concepts simultaneously, replacing virtual base classes with compile-time interface contracts",
    ],
    correctIndex: 1,
    explanation:
      "Concepts are boolean predicates evaluated at compile time. They describe what operations a type must support. If a type doesn't satisfy the concept, the compiler gives a clear error (instead of the cryptic template error novels from SFINAE). Standard concepts include std::integral, std::copyable, std::ranges::range.",
    link: "https://en.cppreference.com/w/cpp/language/constraints.html",
  },
  {
    id: 530,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What does std::format provide over printf and string streams?",
    code: `std::string s = std::format("Hello, {}! You are {} years old.", name, age);`,
    options: [
      "Type-safe formatting with Python-like {} placeholders. Unlike printf, it catches type mismatches at compile time. Unlike stringstream, it's concise and fast. Format strings are checked at compile time in C++23",
      "It's a type-safe wrapper around printf that forwards all arguments to snprintf internally, adding overload resolution for std::string but otherwise producing identical output and performance",
      "It's slower than both printf and stringstream because it uses type erasure and virtual dispatch internally to achieve type safety, adding a runtime cost for every formatted argument",
      "It only works with string types (std::string and const char*), not with numeric types",
    ],
    correctIndex: 0,
    explanation:
      "std::format combines the safety of streams (no %d/%s mismatches) with the readability of printf-style format strings. {} placeholders are type-safe. You can specify width, precision, fill: {:.2f}, {:>10}. It's faster than stringstream and safer than printf.",
    link: "https://en.cppreference.com/w/cpp/utility/format/format.html",
  },
  {
    id: 531,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What does the [[likely]] and [[unlikely]] attribute do?",
    code: `if (errorCode == 0) [[likely]] {\n    processNormally();\n} else [[unlikely]] {\n    handleError();\n}`,
    options: [
      "They force the compiler to execute that branch unconditionally, bypassing the condition check and always running the annotated block. The compiler removes the conditional test and generates straight-line code for the marked path",
      "They have no effect",
      "They cause a compilation error if the wrong branch is taken at runtime, acting as a runtime assertion that validates control flow. The compiler inserts a trap instruction in the unlikely path that aborts if reached",
      "They hint to the compiler which branch is more probable, allowing it to optimize instruction layout",
    ],
    correctIndex: 3,
    explanation:
      "[[likely]]/[[unlikely]] are optimization hints. The compiler can arrange machine code so the likely path has fewer jumps (better for the instruction cache and branch predictor). They don't change program behavior -- just performance. Compilers like GCC had __builtin_expect before; these standardize it.",
    link: "https://en.cppreference.com/w/cpp/language/attributes/likely.html",
  },
  {
    id: 532,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "How do C++20 ranges differ from the traditional iterator-pair algorithm style?",
    code: `// Traditional\nstd::sort(v.begin(), v.end());\n\n// Ranges\nstd::ranges::sort(v);\n\n// Composable views\nauto result = v | std::views::filter([](int x) { return x > 0; })\n               | std::views::transform([](int x) { return x * x; });`,
    options: [
      "Ranges are slower because they add abstraction layers that introduce function-call overhead at every pipeline stage. Each view adapter wraps the underlying iterator in a proxy that adds an extra indirection on every access",
      "Ranges accept containers directly, enable lazy composable pipelines with the | operator, provide better error messages via concepts, and add projections for member access",
      "Ranges only work with std::vector",
      "Ranges replace all STL containers with a new set of range-based container types that use lazy evaluation internally. The standard deprecated vector, map, and all other containers in favor of range-based equivalents",
    ],
    correctIndex: 1,
    explanation:
      "Ranges are a major STL overhaul. Views are lazy -- filter|transform creates a pipeline that computes on demand (no intermediate containers). Algorithms accept ranges directly. Concepts constrain inputs clearly. Projections let you sort by a member: ranges::sort(people, {}, &Person::name).",
    link: "https://en.cppreference.com/w/cpp/ranges.html",
  },
  {
    id: 533,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What is a requires clause and how does it constrain templates?",
    code: `template<typename T>\nrequires std::integral<T> || std::floating_point<T>\nT clamp(T val, T lo, T hi) {\n    return (val < lo) ? lo : (val > hi) ? hi : val;\n}`,
    options: [
      "requires generates runtime type checks that inspect the argument's dynamic type via RTTI before dispatching to the function body. The compiler emits code that queries the vtable to verify it satisfies the concept at call time",
      "A requires clause is a compile-time constraint that rejects template instantiations when the boolean concept expression is false. The compiler produces a clear error instead of a wall of template errors",
      "requires is only for variable declarations",
      "requires is a runtime assertion like assert() that evaluates its boolean argument during execution and calls std::terminate if false. It inserts a check at the function entry point that validates the constraint before proceeding",
    ],
    correctIndex: 1,
    explanation:
      "The requires clause gates template instantiation. If T is std::string, neither std::integral nor std::floating_point is satisfied, and the template is rejected with a clear message. You can combine concepts with &&, ||, and !. requires can also appear after the parameter list: auto f(auto x) requires Concept<decltype(x)>.",
    link: "https://en.cppreference.com/w/cpp/language/constraints.html",
  },
  {
    id: 534,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What are the three comparison categories returned by <=>?",
    options: [
      "std::strong_ordering, std::weak_ordering, std::partial_ordering",
      "negative, zero, and positive as members of a std::comparison_result enum class that maps directly to hardware condition flags for efficient branch-free comparison sequences",
      "bool for equality, int for signed ordering, and double for floating-point comparisons \u2014 the compiler selects the return type automatically based on the operand types being compared",
      "less, equal, greater returned as plain integers (-1, 0, 1) just like C\u2019s strcmp and qsort comparison functions, with no additional type safety or category distinctions beyond the numeric value",
    ],
    correctIndex: 0,
    explanation:
      "strong_ordering: equal means substitutable (e.g., integers). weak_ordering: equivalent in the comparison but distinguishable (e.g., case-insensitive strings). partial_ordering: some pairs are incomparable (e.g., NaN vs any float). The compiler selects the weakest category needed.",
    link: "https://en.cppreference.com/w/cpp/utility/compare/strong_ordering.html",
  },
  {
    id: 535,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What are C++20 modules and what problem do they solve?",
    code: `// math.cppm\nexport module math;\nexport int add(int a, int b) { return a + b; }\n\n// main.cpp\nimport math;\nint main() { return add(1, 2); }`,
    options: [
      "Modules replace #include with a compile-once binary interface. They eliminate redundant reparsing of headers, prevent macro leakage, and enforce explicit export of public API. Build times can improve dramatically for large projects",
      "Modules require a special runtime to work because the import statement triggers dynamic loading of module binaries at program startup. The runtime locates the compiled module file on disk and resolves all exported symbols before main()",
      "Modules are the same as namespaces",
      "Modules are only available on Linux because the module binary format (.cppm) uses ELF-specific sections that Windows PE and macOS Mach-O cannot represent. Cross-platform module support requires a binary interface not yet standardized",
    ],
    correctIndex: 0,
    explanation:
      "Headers are textually pasted into every file that includes them, reparsed every time. Modules are compiled once into a binary module interface (BMI). Importing a module reads the BMI -- much faster than re-parsing thousands of header lines. Macros don't leak across module boundaries.",
    link: "https://en.cppreference.com/w/cpp/language/modules.html",
  },
  {
    id: 536,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What does std::jthread add over std::thread?",
    code: `void work(std::stop_token stoken) {\n    while (!stoken.stop_requested()) {\n        doSomething();\n    }\n}\n\nstd::jthread t(work);\n// t automatically joins in its destructor\n// t.request_stop() signals the thread to stop`,
    options: [
      "jthread is a built-in thread pool that manages a fixed number of worker threads and distributes submitted tasks across them using a work-stealing queue for load balancing",
      "jthread automatically joins in its destructor and supports cooperative cancellation via std::stop_token",
      "jthread schedules the callable on the main thread's event loop using a deferred execution model, ensuring all work runs single-threaded for easier debugging and deterministic behavior",
      "jthread is just a type alias for std::thread that was added for naming consistency with std::jfuture and std::jpromise",
    ],
    correctIndex: 1,
    explanation:
      "std::thread calls std::terminate if destroyed while joinable -- a common bug. jthread joins automatically. It also integrates with stop_source/stop_token for cooperative cancellation: request_stop() signals the thread, which can check stop_requested() and exit gracefully.",
    link: "https://en.cppreference.com/w/cpp/thread/jthread.html",
  },
  {
    id: 537,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "How do requires expressions test type capabilities at compile time?",
    code: `template<typename T>\nconcept Printable = requires(T t, std::ostream& os) {\n    { os << t } -> std::convertible_to<std::ostream&>;\n    { t.toString() } -> std::same_as<std::string>;\n    typename T::value_type;\n};`,
    options: [
      "A requires expression is an unevaluated compile-time check. It verifies: simple requirements, compound requirements, type requirements (typename T::X checks the type exists), and nested requirements",
      "requires expressions run the code and check for runtime errors by executing each sub-expression in a sandboxed context. The runtime evaluates every expression inside the requires block and catches any exceptions to determine whether the type satisfies the constraint",
      "requires expressions only check for function existence by looking up the name in the overload set. They do not verify return types, argument counts, or noexcept specs",
      "requires expressions generate SFINAE fallback implementations that the linker selects when the primary template fails. Each sub-expression in the requires block corresponds to an alternative function body that is instantiated only when the primary overload is not viable",
    ],
    correctIndex: 0,
    explanation:
      "requires expressions have four kinds of requirements: simple (expression must compile), compound (expression must compile AND return type must satisfy a concept), type (an associated type must exist), and nested (a boolean constant expression must be true). None of this code actually runs -- it's purely compile-time validation.",
    link: "https://en.cppreference.com/w/cpp/language/requires.html",
  },
  {
    id: 538,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "How do coroutines work at the language level in C++20?",
    code: `generator<int> fibonacci() {\n    int a = 0, b = 1;\n    while (true) {\n        co_yield a;\n        auto next = a + b;\n        a = b;\n        b = next;\n    }\n}`,
    options: [
      "co_yield creates a new OS thread for each yielded value, scheduling them through the kernel's thread pool so that multiple values can be produced and consumed concurrently across CPU cores. The runtime uses the OS scheduler to manage coroutine lifetimes",
      "co_yield terminates the function permanently and deallocates its coroutine frame, returning the final value to the caller. To produce another value you must call the coroutine function again from the beginning, reconstructing the frame and re-executing all statements",
      "A function becomes a coroutine when it uses co_yield, co_await, or co_return. The compiler transforms it into a state machine with a heap-allocated frame. co_yield suspends execution and returns a value; the caller can resume to get the next value. The promise_type customizes behavior",
      "Coroutines are syntactic sugar for callback chains",
    ],
    correctIndex: 2,
    explanation:
      "C++20 coroutines are stackless: the compiler saves local variables in a coroutine frame (heap-allocated by default). The return type's promise_type defines how suspension, resumption, and value delivery work. co_yield suspends and provides a value. co_await suspends and waits for an async result. co_return finishes.",
    link: "https://en.cppreference.com/w/cpp/language/coroutines.html",
  },
  {
    id: 539,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "How does concept subsumption affect overload resolution?",
    code: `template<typename T>\nconcept Drawable = requires(T t) { t.draw(); };\n\ntemplate<typename T>\nconcept ColorDrawable = Drawable<T> && requires(T t) { t.setColor(0); };\n\nvoid render(Drawable auto& obj)      { /* basic */ }\nvoid render(ColorDrawable auto& obj) { /* with color */ }`,
    options: [
      "The first overload always wins because it was declared first in the translation unit. When multiple overloads match, the compiler uses declaration order as a tiebreaker, selecting the earliest viable candidate and ignoring subsequent matches",
      "Ambiguous -- both overloads match a ColorDrawable type, so the compiler reports a hard error because overload resolution cannot distinguish between two equally viable candidates. You must use an explicit cast or tag dispatch to select the overload",
      "The compiler selects the most constrained overload. Because ColorDrawable subsumes Drawable, the ColorDrawable overload is preferred for types that satisfy both",
      "This is a compilation error",
    ],
    correctIndex: 2,
    explanation:
      "C++20's subsumption rules: if concept A includes all constraints of concept B plus additional ones, A is 'more constrained.' When both overloads match, the more constrained one wins. This works because the compiler normalizes constraints into conjunctive/disjunctive normal form and compares atomic constraints.",
    link: "https://en.cppreference.com/w/cpp/language/constraints.html",
  },
  {
    id: 540,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "What is std::ranges::views::zip (C++23) and how do lazy views compose?",
    code: `std::vector<std::string> names = {"Alice", "Bob"};\nstd::vector<int> scores = {95, 87};\n\nfor (auto [name, score] : std::views::zip(names, scores)) {\n    std::cout << name << ": " << score << "\\n";\n}`,
    options: [
      "zip only works when all input containers share the exact same element type, because the resulting tuples must be homogeneous",
      "zip requires all input ranges to have exactly the same size and throws std::length_error at runtime if a size mismatch is detected during iteration, to prevent out-of-bounds access. The iterator checks bounds on every increment and terminates with an exception on overflow",
      "zip creates a lazy view that produces tuples by combining elements from multiple ranges in lockstep. No data is copied",
      "zip eagerly copies both containers into a new std::vector of std::pair objects, allocating memory proportional to the combined input sizes and requiring both ranges to have matching element types. The resulting vector owns copies of every element from both sources",
    ],
    correctIndex: 2,
    explanation:
      "Views are lazy adaptors -- they don't own data or allocate memory. zip iterates multiple ranges simultaneously, yielding tuples of references. The pipeline filter|transform|take processes each element through the chain on demand. This is the key insight: no intermediate vectors are created, making pipelines memory-efficient.",
    link: "https://en.cppreference.com/w/cpp/ranges/zip_view.html",
  },
  {
    id: 541,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "How does constexpr allocation (C++20) work, and what are its limits?",
    code: `constexpr auto makeVector() {\n    std::vector<int> v = {1, 2, 3};\n    return v.size();  // OK: vector used at compile time\n}\nstatic_assert(makeVector() == 3);`,
    options: [
      "C++20 allows dynamic memory allocation during constant evaluation",
      "std::vector cannot be used in constexpr contexts because it relies on dynamic memory allocation which the compile-time evaluator does not support. The constexpr interpreter lacks a heap, so new/delete and any container that uses them are rejected during constant evaluation",
      "Only fixed-size arrays work in constexpr functions because the compiler requires all memory sizes to be known statically. Dynamic containers like vector, string, and list are excluded because their size varies and the evaluator cannot model variable-length storage",
      "constexpr allocation uses a special compile-time heap that persists at runtime, allowing data created during compilation to be accessed by the running program. The compiler embeds the heap contents into the data segment so allocated objects survive past constant evaluation",
    ],
    correctIndex: 0,
    explanation:
      "C++20 permits new/delete during constexpr evaluation, enabling std::vector and std::string at compile time. The key rule: all allocations must be deallocated before the evaluation completes (transient allocations only). You can't return a vector from a consteval function as a runtime value -- but you can compute with one and return the result.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr.html",
  },
  {
    id: 1272,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What does the C++20 std::span type represent?",
    options: [
      "A dynamically resizable container that owns its elements and manages their memory lifetime",
      "A fixed-size array allocated on the heap with automatic bounds checking on every access",
      "A non-owning view over a contiguous sequence of elements such as an array or a vector",
      "A thread-safe wrapper around std::vector that synchronizes all concurrent read and write ops",
    ],
    correctIndex: 2,
    explanation:
      "std::span provides a lightweight, non-owning view over a contiguous sequence of objects. It does not own the data it points to, similar to std::string_view for strings. It can be constructed from arrays, vectors, or any contiguous range.",
    link: "https://en.cppreference.com/w/cpp/container/span",
  },
  {
    id: 1273,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "What new initialization syntax does C++20 designated initializers provide for aggregates?",
    options: [
      "It allows naming specific members during initialization like Point{.x = 1, .y = 2} in order",
      "It allows initializing members in any arbitrary order regardless of their declaration sequence",
      "It allows skipping the constructor entirely and directly writing values into object memory",
      "It allows using string literals as member names to initialize fields dynamically at runtime",
    ],
    correctIndex: 0,
    explanation:
      "C++20 designated initializers let you specify which aggregate members to initialize by name, using the .member = value syntax. Unlike C, C++ requires designators to appear in the same order as the members are declared in the struct.",
    link: "https://en.cppreference.com/w/cpp/language/aggregate_initialization",
  },
  {
    id: 1274,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "What does the C++20 contains() member function do for std::map and std::set?",
    options: [
      "It returns an iterator to the element if found or an end iterator if the element is missing",
      "It returns a boolean indicating whether the container holds an element with the given key",
      "It inserts the element into the container if it is not already present and returns a boolean",
      "It removes the element with the given key from the container and returns whether it existed",
    ],
    correctIndex: 1,
    explanation:
      "contains() is a C++20 convenience method that returns true if the container has an element with the specified key. Before C++20, you had to use find() != end() or count() != 0, which were less readable.",
    link: "https://en.cppreference.com/w/cpp/container/map/contains",
  },
  {
    id: 1275,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What is the purpose of the C++20 std::format library?",
    options: [
      "It provides compile-time string concatenation for building constant expression string values",
      "It converts binary data into human-readable hexadecimal text for debugging output purposes",
      "It validates that string literals conform to a specific encoding format like UTF-8 or ASCII",
      "It provides type-safe string formatting similar to printf but with compile-time format checks",
    ],
    correctIndex: 3,
    explanation:
      "std::format provides Python-style string formatting with type safety. Format strings are checked at compile time, preventing the type mismatches that plague printf. It supports custom formatters and is generally faster than iostream-based formatting.",
    link: "https://en.cppreference.com/w/cpp/utility/format/format",
  },
  {
    id: 1276,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "What does the C++20 starts_with() member function check on a std::string?",
    options: [
      "It checks whether the string begins with a specified prefix and returns true or false",
      "It checks whether the string contains the specified substring at any position within it",
      "It removes the specified prefix from the beginning of the string and returns the result",
      "It inserts the specified prefix at the beginning of the string and returns a new string",
    ],
    correctIndex: 0,
    explanation:
      "C++20 added starts_with() and ends_with() to std::string and std::string_view. starts_with() returns true if the string begins with the given prefix. Previously, this required manual comparison with substr() or find().",
    link: "https://en.cppreference.com/w/cpp/string/basic_string/starts_with",
  },
  {
    id: 1277,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What does the C++20 [[likely]] attribute hint to the compiler?",
    options: [
      "It guarantees that the annotated branch will always be taken during every program execution",
      "It tells the compiler to eliminate the annotated branch entirely as dead unreachable code",
      "It hints that the annotated branch is the common case so the compiler can optimize for it",
      "It forces the compiler to inline all function calls that appear within the annotated branch",
    ],
    correctIndex: 2,
    explanation:
      "[[likely]] and [[unlikely]] are C++20 attributes that provide branch prediction hints. The compiler may use these hints to optimize code layout, placing the likely path in the fast execution path and reducing branch mispredictions.",
    link: "https://en.cppreference.com/w/cpp/language/attributes/likely",
  },
  {
    id: 1278,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "What does the C++20 std::erase_if algorithm do for standard containers?",
    options: [
      "It sorts the container elements so that elements matching the predicate appear at the end",
      "It counts how many elements in the container satisfy the given predicate condition value",
      "It copies elements that do not match the predicate into a new container and returns that",
      "It removes all elements satisfying a predicate from the container in a single function call",
    ],
    correctIndex: 3,
    explanation:
      "std::erase_if is a C++20 uniform erasure function that removes all elements matching a predicate from a container. It replaces the erase-remove idiom for vectors and provides consistent syntax across all standard containers.",
    link: "https://en.cppreference.com/w/cpp/container/vector/erase2",
  },
  {
    id: 1279,
    difficulty: "Easy",
    topic: "C++20 Features",
    question: "What does the C++20 using enum declaration allow you to do?",
    options: [
      "It converts a scoped enum to an unscoped enum permanently for the entire translation unit",
      "It imports all enumerators of a scoped enum into the current scope to use without the prefix",
      "It creates a type alias for the enum so you can refer to it by a shorter name in the code",
      "It merges two separate enum types into a single combined enum with all enumerators together",
    ],
    correctIndex: 1,
    explanation:
      "The using enum declaration in C++20 brings all enumerators of a scoped enum into the current scope. This means you can write Color::Red as just Red within that scope, reducing verbosity while still keeping the enum class type safety.",
    link: "https://en.cppreference.com/w/cpp/language/enum#Using-enum-declaration",
  },
  {
    id: 1280,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "What change did C++20 make to the range-based for loop with an init-statement?",
    options: [
      "It allows declaring a variable in the for loop header like for (auto v = getVec(); auto& e : v)",
      "It allows iterating over multiple containers simultaneously using a comma-separated range list",
      "It allows specifying a step size to skip elements during iteration like for (auto& e : v : 2)",
      "It allows reversing the iteration order automatically using a reverse keyword in the loop head",
    ],
    correctIndex: 0,
    explanation:
      "C++20 added init-statement support to range-based for loops. You can declare and initialize a variable before the range expression, keeping temporary objects alive for the loop duration without leaking them into the enclosing scope.",
    link: "https://en.cppreference.com/w/cpp/language/range-for",
  },
  {
    id: 1281,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "What does the C++20 [[nodiscard]] attribute with a message parameter do?",
    options: [
      "It prevents the function from being called more than once and displays the message on reuse",
      "It warns if the return value is discarded and includes the custom message in the warning text",
      "It marks the function as deprecated and displays the message when the function is referenced",
      "It causes a compilation error if the function is called without assigning its return value",
    ],
    correctIndex: 1,
    explanation:
      "C++20 extended [[nodiscard]] to accept an optional string message. When the return value is discarded, the compiler warning includes this message, helping explain why the return value matters.",
    link: "https://en.cppreference.com/w/cpp/language/attributes/nodiscard",
  },
  {
    id: 1282,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "What are C++20 concepts and what problem do they solve for template programming?",
    options: [
      "They are runtime type checks that validate template arguments when the program is executed",
      "They are compiler plugins that generate template specializations automatically for all types",
      "They are named constraints on template parameters that produce clear errors on violations",
      "They are documentation annotations that have no effect on compilation or type checking logic",
    ],
    correctIndex: 2,
    explanation:
      "Concepts are named sets of requirements that constrain template parameters. They replace SFINAE-based techniques with readable syntax and produce clear, early error messages when a type does not satisfy the required constraints.",
    link: "https://en.cppreference.com/w/cpp/language/constraints",
  },
  {
    id: 1283,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What does the requires clause do when placed on a function template?",
    options: [
      "It tells the linker which object files are required for the function to resolve correctly",
      "It defines a precondition that is checked at runtime and throws if the condition is false",
      "It specifies which header files must be included before the function can be instantiated",
      "It constrains the template so it only participates in overload resolution when the condition holds",
    ],
    correctIndex: 3,
    explanation:
      "A requires clause adds a compile-time constraint to a template. If the constraint is not satisfied for a given set of template arguments, the template is removed from the overload set instead of causing a hard compilation error.",
    link: "https://en.cppreference.com/w/cpp/language/constraints#Requires_clauses",
  },
  {
    id: 1284,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "What is the three-way comparison operator <=> commonly called and what does it return?",
    options: [
      "It is called the spaceship operator and returns an ordering category like strong_ordering",
      "It is called the rocket operator and returns a boolean indicating whether the values are equal",
      "It is called the arrow operator and returns a pointer to the comparison result stored in memory",
      "It is called the bridge operator and returns an integer where negative means less and positive greater",
    ],
    correctIndex: 0,
    explanation:
      "The <=> operator is nicknamed the spaceship operator. It returns one of three ordering types: std::strong_ordering, std::weak_ordering, or std::partial_ordering, which encode whether the left operand is less than, equal to, or greater than the right.",
    link: "https://en.cppreference.com/w/cpp/language/operator_comparison#Three-way_comparison",
  },
  {
    id: 1285,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "How do C++20 ranges differ from the traditional STL algorithm approach?",
    options: [
      "Ranges execute algorithms in parallel by default while traditional algorithms are sequential",
      "Ranges work directly on containers and support lazy composition through views and adaptors",
      "Ranges only support input iterators while traditional algorithms support all iterator categories",
      "Ranges are evaluated at compile time while traditional algorithms are always evaluated at runtime",
    ],
    correctIndex: 1,
    explanation:
      "C++20 ranges can operate directly on containers instead of requiring iterator pairs. They support lazy evaluation through views, which are composable adaptors that transform data without creating intermediate containers.",
    link: "https://en.cppreference.com/w/cpp/ranges",
  },
  {
    id: 1286,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What is a C++20 coroutine and what keywords does it use?",
    options: [
      "It is a parallel execution unit that uses co_start, co_stop, and co_join to manage threads",
      "It is a compile-time function that uses co_eval, co_assert, and co_check for static analysis",
      "It is a suspendable function that uses co_await, co_yield, and co_return for lazy execution",
      "It is a recursive function that uses co_call, co_base, and co_recurse for stack management",
    ],
    correctIndex: 2,
    explanation:
      "C++20 coroutines are functions that can be suspended and resumed. co_await suspends until an awaitable completes, co_yield produces a value and suspends, and co_return completes the coroutine. They enable generators, async I/O, and other lazy patterns.",
    link: "https://en.cppreference.com/w/cpp/language/coroutines",
  },
  {
    id: 1287,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What does std::views::filter do in the C++20 ranges library?",
    options: [
      "It creates a new vector containing only the elements that satisfy the given predicate value",
      "It sorts the range elements so that elements satisfying the predicate come before the others",
      "It counts the number of elements in the range that satisfy the given predicate and returns it",
      "It creates a lazy view that skips elements not satisfying the predicate during iteration only",
    ],
    correctIndex: 3,
    explanation:
      "std::views::filter creates a view adaptor that lazily filters elements. No new container is created; instead, elements that do not match the predicate are simply skipped when the view is iterated. This avoids unnecessary memory allocation.",
    link: "https://en.cppreference.com/w/cpp/ranges/filter_view",
  },
  {
    id: 1288,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "What is the purpose of consteval in C++20 and how does it differ from constexpr?",
    options: [
      "consteval requires the function to be evaluated at compile time while constexpr allows runtime",
      "consteval allows the function to modify global state while constexpr prohibits side effects",
      "consteval permits virtual function calls while constexpr restricts them to non-virtual only",
      "consteval generates inline assembly code while constexpr generates standard machine code output",
    ],
    correctIndex: 0,
    explanation:
      "A consteval function (immediate function) must produce a compile-time constant. Unlike constexpr, which allows both compile-time and runtime evaluation, calling a consteval function in a non-constant context is a compilation error.",
    link: "https://en.cppreference.com/w/cpp/language/consteval",
  },
  {
    id: 1289,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What does constinit guarantee about a variable in C++20?",
    options: [
      "It guarantees the variable is immutable and cannot be modified after its initial assignment",
      "It guarantees the variable is initialized at compile time, preventing static initialization order issues",
      "It guarantees the variable is allocated on the stack rather than in static or global memory segments",
      "It guarantees the variable is visible only within the current translation unit and not exported",
    ],
    correctIndex: 1,
    explanation:
      "constinit ensures a variable with static or thread storage duration is initialized at compile time (constant initialization). Unlike constexpr, the variable itself is not const and can be modified later. It prevents the static initialization order fiasco.",
    link: "https://en.cppreference.com/w/cpp/language/constinit",
  },
  {
    id: 1290,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What does std::views::transform do in the C++20 ranges library?",
    options: [
      "It modifies each element of the underlying container in place by applying the given function",
      "It creates a sorted copy of the range with elements reordered by the transformation function",
      "It creates a lazy view where each element is the result of applying a function to the original",
      "It partitions the range into two groups based on the return value of the transformation call",
    ],
    correctIndex: 2,
    explanation:
      "std::views::transform creates a view that lazily applies a function to each element of the underlying range. The original data is not modified; the transformed values are computed on-the-fly during iteration.",
    link: "https://en.cppreference.com/w/cpp/ranges/transform_view",
  },
  {
    id: 1291,
    difficulty: "Medium",
    topic: "C++20 Features",
    question: "What is the C++20 std::source_location class used for?",
    options: [
      "It stores the URL of the source code repository for runtime version tracking and logging",
      "It provides the filesystem path to the executable binary that is currently running on disk",
      "It records the memory address where a particular variable was allocated during construction",
      "It captures the file name, line number, and function name at the point where it is created",
    ],
    correctIndex: 3,
    explanation:
      "std::source_location replaces the __FILE__, __LINE__, and __func__ preprocessor macros with a proper C++ type. It captures the source file name, line number, column number, and function name at the call site, making it useful for logging and diagnostics.",
    link: "https://en.cppreference.com/w/cpp/utility/source_location",
  },
  {
    id: 1292,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "What is CTAD for aggregates in C++20 and how does it simplify template usage?",
    options: [
      "It deduces class template arguments from aggregate initialization without explicit type params",
      "It automatically generates default constructors for aggregate types that lack user declarations",
      "It converts aggregate types into non-aggregate classes by adding implicit copy constructors",
      "It detects aggregate initialization errors at compile time and reports them as static warnings",
    ],
    correctIndex: 0,
    explanation:
      "C++20 extended class template argument deduction (CTAD) to work with aggregates. For example, std::array arr = {1, 2, 3} can deduce std::array<int, 3> without explicit template arguments, making aggregate template usage more concise.",
    link: "https://en.cppreference.com/w/cpp/language/class_template_argument_deduction",
  },
  {
    id: 1293,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "How does subsumption work when the compiler selects between two constrained function overloads?",
    options: [
      "The compiler selects the overload with the fewest constraints since simpler signatures are preferred",
      "The compiler selects the more constrained overload if its constraints logically imply the other",
      "The compiler rejects the call as ambiguous whenever two overloads have different constraints applied",
      "The compiler selects the overload that was declared first in the source file translation unit order",
    ],
    correctIndex: 1,
    explanation:
      "Subsumption is the partial ordering of constraints. If constraint A implies constraint B (A subsumes B), the overload with constraint A is more constrained and is preferred. This allows writing a general overload and a more specific one without ambiguity.",
    link: "https://en.cppreference.com/w/cpp/language/constraints#Partial_ordering_of_constraints",
  },
  {
    id: 1294,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "What is the difference between std::strong_ordering and std::weak_ordering?",
    options: [
      "strong_ordering allows NaN comparisons while weak_ordering treats NaN as equal to every value",
      "strong_ordering is for floating-point types while weak_ordering is only for integer types in C++",
      "strong_ordering means equal values are indistinguishable while weak_ordering allows equivalent but distinct values",
      "strong_ordering performs comparisons at compile time while weak_ordering defers them until runtime",
    ],
    correctIndex: 2,
    explanation:
      "std::strong_ordering implies substitutability: if a == b, then f(a) == f(b) for any function f. std::weak_ordering allows equivalence without substitutability, meaning two values can compare equal but be distinguishable by some operation, like case-insensitive string comparison.",
    link: "https://en.cppreference.com/w/cpp/utility/compare/strong_ordering",
  },
  {
    id: 1295,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "What is the role of a promise_type in the C++20 coroutine framework?",
    options: [
      "It stores the coroutine arguments so they persist across suspension and resumption points",
      "It manages the thread pool that schedules coroutine resumption on available worker threads",
      "It provides the memory allocator that is used to allocate the coroutine frame on the heap",
      "It controls the coroutine behavior by defining how values are yielded, returned, and awaited",
    ],
    correctIndex: 3,
    explanation:
      "The promise_type is a nested type within the coroutine return type that the compiler uses to manage the coroutine. It defines initial_suspend(), final_suspend(), yield_value(), return_value(), and unhandled_exception(), giving full control over coroutine lifecycle.",
    link: "https://en.cppreference.com/w/cpp/coroutine/coroutine_traits",
  },
  {
    id: 1296,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "What is a requires expression and how is it used to check type properties at compile time?",
    options: [
      "It is a compile-time predicate that tests whether a set of expressions are valid for given types",
      "It is a runtime assertion that throws an exception if the specified type requirements are not met",
      "It is a preprocessor directive that conditionally includes code based on type trait evaluations",
      "It is a linker annotation that verifies all template instantiations satisfy the stated constraints",
    ],
    correctIndex: 0,
    explanation:
      "A requires expression evaluates to true or false at compile time based on whether the enclosed expressions are well-formed for the given types. It can check simple expressions, type requirements, compound requirements with return type constraints, and nested requirements.",
    link: "https://en.cppreference.com/w/cpp/language/requires",
  },
  {
    id: 1297,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "How do C++20 modules improve compilation compared to the traditional header include model?",
    options: [
      "Modules compile headers in parallel across multiple threads while includes are single-threaded",
      "Modules are parsed once and their interface is cached, avoiding redundant reparsing per include",
      "Modules automatically inline all function definitions while includes require explicit inline hints",
      "Modules convert all templates to concrete types at import time while includes defer instantiation",
    ],
    correctIndex: 1,
    explanation:
      "C++20 modules are compiled once into a binary module interface that is imported rather than textually included. This eliminates redundant parsing of the same header across translation units, macro leakage, and include order dependencies.",
    link: "https://en.cppreference.com/w/cpp/language/modules",
  },
  {
    id: 1298,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "What does std::jthread provide over std::thread in C++20?",
    options: [
      "It provides a lock-free message queue for communication between the spawned thread and parent",
      "It provides built-in thread prioritization so high-priority threads are scheduled before others",
      "It provides automatic joining in its destructor and cooperative cancellation via stop tokens",
      "It provides automatic load balancing by distributing work across all available processor cores",
    ],
    correctIndex: 2,
    explanation:
      "std::jthread (joining thread) automatically calls join() in its destructor, preventing the program from terminating if a thread is not joined. It also integrates with std::stop_token for cooperative cancellation, allowing threads to be politely asked to stop.",
    link: "https://en.cppreference.com/w/cpp/thread/jthread",
  },
  {
    id: 1299,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "What is an abbreviated function template in C++20 and how is it written?",
    options: [
      "It uses the template keyword followed by a single type parameter in angle brackets inline",
      "It uses decltype in the parameter list to deduce the template type from the arguments given",
      "It uses the typename keyword directly in the function signature to declare type parameters",
      "It uses auto in the parameter list, making each auto parameter an implicit template parameter",
    ],
    correctIndex: 3,
    explanation:
      "In C++20, using auto in a function parameter list creates an abbreviated function template. Each auto parameter introduces an implicit template parameter, so void f(auto x) is equivalent to template<typename T> void f(T x).",
    link: "https://en.cppreference.com/w/cpp/language/function_template#Abbreviated_function_template",
  },
  {
    id: 1300,
    difficulty: "Hard",
    topic: "C++20 Features",
    question: "What is the purpose of std::counting_semaphore introduced in C++20?",
    options: [
      "It limits concurrent access to a resource by maintaining a count of available permits to acquire",
      "It counts the number of threads currently waiting on a mutex and reports it for diagnostics use",
      "It automatically terminates threads that exceed a configurable maximum execution time limit value",
      "It provides an atomic counter that threads can increment and decrement without lock contention",
    ],
    correctIndex: 0,
    explanation:
      "std::counting_semaphore manages a count of available resources. Threads call acquire() to decrement the count (blocking if zero) and release() to increment it. std::binary_semaphore is a specialization with a maximum count of one.",
    link: "https://en.cppreference.com/w/cpp/thread/counting_semaphore",
  },
  {
    id: 1301,
    difficulty: "Hard",
    topic: "C++20 Features",
    question:
      "What does std::ranges::to from C++23 accomplish that C++20 ranges views cannot do alone?",
    options: [
      "It converts a view into a parallel execution policy so elements are processed concurrently",
      "It materializes a lazy view into an owning container like a vector or set in a single call",
      "It converts a range of one element type into a range of a different type using implicit casts",
      "It validates that all elements in a view satisfy a concept constraint before iteration begins",
    ],
    correctIndex: 1,
    explanation:
      "std::ranges::to (added in C++23 but closely related to C++20 ranges) converts a lazy view pipeline into a concrete owning container. For example, view | std::ranges::to<std::vector>() materializes the view into a vector without manual loops.",
    link: "https://en.cppreference.com/w/cpp/ranges/to",
  },
];
