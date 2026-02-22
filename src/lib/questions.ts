export interface Question {
  id: number;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  link?: string;
}

export const TOPICS = [
  "CS Fundamentals",
  "Operating Systems",
  "Fundamentals",
  "OOP",
  "Memory Management",
  "STL Containers",
  "Algorithms",
  "Templates",
  "Multithreading",
  "Modern C++",
  "C++20 Features",
  "Error Handling",
  "Type Casting",
  "I/O & Filesystem",
  "Build Systems",
  "Variant & Type Traits",
  "Linux Commands",
] as const;

export type Topic = (typeof TOPICS)[number];

export const questions: Question[] = [
  // ── Module 1: Fundamentals ──
  {
    id: 1,
    difficulty: "Easy",
    topic: "Fundamentals",
    question: "What is the output of the following code?",
    code: `int x = 5;\nif (x = 10) {\n    std::cout << x;\n}`,
    options: ["5", "10", "0", "Compilation error"],
    correctIndex: 1,
    explanation:
      "x = 10 is an assignment, not a comparison. It assigns 10 to x and evaluates to 10 (truthy), so the body executes and prints 10.",
    link: "https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/",
  },
  {
    id: 2,
    difficulty: "Medium",
    topic: "Fundamentals",
    question:
      "Given void modify(int& a, int b) { a = 10; b = 20; } and calling with x=1, y=2, what are x and y after the call?",
    code: `void modify(int& a, int b) { a = 10; b = 20; }\n\nint x = 1, y = 2;\nmodify(x, y);`,
    options: ["x=10, y=20", "x=10, y=2", "x=1, y=2", "x=1, y=20"],
    correctIndex: 1,
    explanation:
      "a is passed by reference so the original x is modified. b is passed by value so y is unchanged.",
    link: "https://www.learncpp.com/cpp-tutorial/pass-by-lvalue-reference/",
  },

  // ── Module 2: OOP ──
  {
    id: 3,
    difficulty: "Easy",
    topic: "OOP",
    question: "Which keyword enables runtime polymorphism in C++?",
    options: ["static", "virtual", "override", "abstract"],
    correctIndex: 1,
    explanation:
      "Declaring a member function virtual in the base class enables dynamic dispatch, allowing the correct derived class override to be called through a base pointer or reference.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 4,
    difficulty: "Medium",
    topic: "OOP",
    question:
      "What happens when a Derived object is assigned to a Base variable by value?",
    code: "Base b = derivedObj;",
    options: [
      "Compilation error",
      "Runtime exception",
      "Object slicing — derived-specific data is lost",
      "The Base variable behaves as a Derived object",
    ],
    correctIndex: 2,
    explanation:
      "When copied by value into a Base, only the Base portion is copied. The derived members and virtual dispatch are stripped away.",
    link: "https://www.learncpp.com/cpp-tutorial/object-slicing/",
  },
  {
    id: 5,
    difficulty: "Hard",
    topic: "OOP",
    question: "What is the problem with this code?",
    code: `class Base {\npublic:\n    ~Base() { std::cout << "~Base"; }\n};\n\nclass Derived : public Base {\n    int* data = new int(42);\npublic:\n    ~Derived() { delete data; std::cout << "~Derived"; }\n};\n\nBase* p = new Derived();\ndelete p;`,
    options: [
      "Double deletion of data",
      "Memory leak — Derived destructor is never called",
      "Stack overflow from recursive destruction",
      "No problem; this is correct C++",
    ],
    correctIndex: 1,
    explanation:
      "Without a virtual destructor in Base, deleting through a Base* only calls ~Base(). The Derived destructor never runs, so data is never freed.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-destructors-virtual-assignment-and-overriding-virtualization/",
  },

  // ── Module 3: Memory Management ──
  {
    id: 6,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "Which smart pointer should be your default choice in modern C++?",
    options: [
      "std::shared_ptr",
      "std::unique_ptr",
      "std::weak_ptr",
      "std::auto_ptr",
    ],
    correctIndex: 1,
    explanation:
      "unique_ptr has zero overhead compared to a raw pointer (no reference counting), expresses exclusive ownership clearly, and can be converted to shared_ptr later if needed.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 7,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What happens on the second line?",
    code: `std::unique_ptr<int> a = std::make_unique<int>(42);\nstd::unique_ptr<int> b = a;`,
    options: [
      "b points to a copy of the integer 42",
      "Both a and b point to the same integer",
      "Compilation error",
      "Runtime error — double ownership",
    ],
    correctIndex: 2,
    explanation:
      "unique_ptr is non-copyable. You must use std::move(a) to transfer ownership to b.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 8,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Why is std::make_unique<T>(args...) preferred over std::unique_ptr<T>(new T(args...))?",
    options: [
      "make_unique is faster at runtime",
      "make_unique avoids a potential memory leak from unsequenced evaluation of function arguments (pre-C++17)",
      "make_unique allows the pointer to be copied",
      "make_unique supports custom deleters",
    ],
    correctIndex: 1,
    explanation:
      "Before C++17, if new T succeeded but another argument's evaluation threw, the allocated memory would leak. make_unique wraps the allocation safely.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique.html",
  },

  // ── Module 4: STL Containers ──
  {
    id: 9,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "Which of the following STL containers can insert and delete from both the front and back in O(1)?",
    options: ["vector", "deque", "list", "Both B and C"],
    correctIndex: 3,
    explanation:
      "deque supports O(1) push_front/push_back. list (doubly-linked) supports O(1) insertion/removal at both ends.",
    link: "https://en.cppreference.com/w/cpp/container/deque.html",
  },
  {
    id: 10,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the average-case time complexity of find() in std::unordered_map?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 0,
    explanation:
      "unordered_map uses a hash table, so lookups are O(1) on average. Worst case is O(n) due to hash collisions.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 11,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "Which container should you use if you need fast lookup AND sorted order of keys?",
    options: ["std::unordered_map", "std::map", "std::vector", "std::deque"],
    correctIndex: 1,
    explanation:
      "std::map uses a balanced BST (typically red-black tree), giving O(log n) lookup while maintaining keys in sorted order.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 12,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "Which operation on std::vector invalidates all iterators, pointers, and references to its elements?",
    options: [
      "push_back when size() < capacity()",
      "push_back when size() == capacity()",
      "erase on the last element",
      "clear()",
    ],
    correctIndex: 1,
    explanation:
      "This triggers reallocation, moving all elements to a new memory block and invalidating every existing iterator.",
    link: "https://en.cppreference.com/w/cpp/container/vector.html",
  },

  // ── Module 5: Algorithms ──
  {
    id: 13,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "Why does std::sort not work with std::list?",
    options: [
      "std::list has no iterators",
      "std::list iterators are not random-access",
      "std::list elements are always const",
      "std::list does not support the < operator",
    ],
    correctIndex: 1,
    explanation:
      "std::sort requires random-access iterators for its O(n log n) introsort algorithm. std::list provides only bidirectional iterators. Use list::sort() instead.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 14,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What is the main advantage of C++20 range views over traditional STL algorithms with intermediate containers?",
    options: [
      "They are always faster at runtime",
      "They evaluate lazily, avoiding intermediate copies and allocations",
      "They work on C-style arrays but STL algorithms do not",
      "They are constexpr by default",
    ],
    correctIndex: 1,
    explanation:
      "Views compose into pipelines where each element is processed on-demand. No intermediate vector or container is created between steps.",
    link: "https://en.cppreference.com/w/cpp/ranges.html",
  },

  // ── Module 6: Templates ──
  {
    id: 15,
    difficulty: "Easy",
    topic: "Templates",
    question: "What happens when this code compiles?",
    code: `template<typename T>\nT add(T a, T b) { return a + b; }\n\nauto result = add(1, 2.0);`,
    options: [
      "Returns 3.0 as a double",
      "Returns 3 as an int",
      "Compilation error — ambiguous template deduction",
      "Undefined behavior",
    ],
    correctIndex: 2,
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
      "They make templates faster at runtime",
      "They produce clearer error messages and more readable constraint syntax",
      "They eliminate the need for templates entirely",
      "They allow templates to work with non-type parameters",
    ],
    correctIndex: 1,
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
      "They must be the same type",
      "They can be different integral types (e.g., int and long)",
      "They must both be int",
      "This syntax is invalid in C++20",
    ],
    correctIndex: 1,
    explanation:
      "Each auto is independently deduced. This is equivalent to two separate template parameters each constrained by std::integral.",
    link: "https://en.cppreference.com/w/cpp/language/function_template.html",
  },

  // ── Module 7: Multithreading ──
  {
    id: 18,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::mutex protect against?",
    options: [
      "Deadlocks",
      "Data races on shared mutable state",
      "Memory leaks",
      "Stack overflow",
    ],
    correctIndex: 1,
    explanation:
      "A mutex ensures mutual exclusion: only one thread can hold the lock at a time, preventing concurrent reads and writes that would cause a data race.",
    link: "https://en.cppreference.com/w/cpp/thread/mutex.html",
  },
  {
    id: 19,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "What advantage does std::scoped_lock (C++17) have over std::lock_guard?",
    options: [
      "It is faster due to less overhead",
      "It can lock multiple mutexes simultaneously without deadlock",
      "It supports recursive locking",
      "It does not use RAII",
    ],
    correctIndex: 1,
    explanation:
      "scoped_lock accepts multiple mutexes and uses a deadlock-avoidance algorithm to lock them all safely. lock_guard only locks a single mutex.",
    link: "https://en.cppreference.com/w/cpp/thread/scoped_lock.html",
  },
  {
    id: 20,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "For incrementing a shared integer counter across threads, which approach is preferred?",
    options: [
      "std::mutex with std::lock_guard",
      "std::atomic<int>",
      "volatile int",
      "No synchronization needed for built-in types",
    ],
    correctIndex: 1,
    explanation:
      "For simple read-modify-write operations on a single variable, atomics are more efficient than a mutex. volatile does NOT provide atomicity or memory ordering guarantees in C++.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic.html",
  },

  // ── Module 8: Modern C++ ──
  {
    id: 21,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What does std::move(x) actually do?",
    options: [
      "Moves x to a new memory location",
      "Deletes x",
      "Casts x to an rvalue reference",
      "Swaps x with a temporary",
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
    options: ["12", "11", "10", "Compilation error"],
    correctIndex: 2,
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
      "They are always evaluated at compile time",
      "They can be evaluated at compile time OR runtime depending on context",
      "They cannot contain loops or conditional statements",
      "They are identical to inline functions",
    ],
    correctIndex: 1,
    explanation:
      "A constexpr function is evaluated at compile time when all arguments are constant expressions and the result is used in a constant context. Otherwise it runs at runtime. In C++20, constexpr functions can contain loops, branches, and even try-catch.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr.html",
  },

  // ── Module 9: C++20 Features ──
  {
    id: 24,
    difficulty: "Easy",
    topic: "C++20 Features",
    question:
      "In C++20, what does defaulting operator<=> on a class give you?",
    options: [
      "Only == and !=",
      "Only < and >",
      "All six comparison operators",
      "Only the <=> operator itself",
    ],
    correctIndex: 2,
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
      "std::strong_ordering",
      "std::weak_ordering",
      "std::partial_ordering",
      "Compilation error",
    ],
    correctIndex: 2,
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
      "Nothing — == is automatically generated from <=>",
      "Explicitly default or define operator==",
      "Define all six comparison operators manually",
      "Delete the copy constructor",
    ],
    correctIndex: 1,
    explanation:
      "A defaulted <=> synthesizes ==, but a custom <=> does not. The rationale is that == can often be implemented more efficiently than (a <=> b) == 0.",
    link: "https://en.cppreference.com/w/cpp/language/default_comparisons.html",
  },

  // ── Module 10: Error Handling ──
  {
    id: 27,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What happens if you dereference an empty std::optional with operator*?",
    options: [
      "Returns a default-constructed value",
      "Throws std::bad_optional_access",
      "Undefined behavior",
      "Returns std::nullopt",
    ],
    correctIndex: 2,
    explanation:
      "operator* performs no check. Use .value() for checked access, which throws std::bad_optional_access if the optional is empty.",
    link: "https://en.cppreference.com/w/cpp/utility/optional.html",
  },
  {
    id: 28,
    difficulty: "Medium",
    topic: "Error Handling",
    question:
      "When should you prefer std::optional over throwing an exception?",
    options: [
      "When failure is truly exceptional and unexpected",
      'When "no result" is a normal, expected outcome (e.g., a lookup that may not find a match)',
      "When performance does not matter",
      "When you need to carry a detailed error message",
    ],
    correctIndex: 1,
    explanation:
      "optional communicates that absence is a valid state, not an error. Exceptions should be reserved for truly unexpected failures.",
    link: "https://en.cppreference.com/w/cpp/utility/optional.html",
  },

  // ── Module 11: Type Casting ──
  {
    id: 29,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "Which cast should you use to convert a double to an int?",
    options: [
      "dynamic_cast",
      "const_cast",
      "static_cast",
      "reinterpret_cast",
    ],
    correctIndex: 2,
    explanation:
      "static_cast handles well-defined conversions like numeric type changes. dynamic_cast is for polymorphic class hierarchies, const_cast modifies constness, and reinterpret_cast reinterprets bit patterns.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 30,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "What is required for dynamic_cast to work when downcasting in a class hierarchy?",
    options: [
      "The base class must have at least one virtual function",
      "The derived class must be declared final",
      "RTTI must be disabled",
      "The classes must use multiple inheritance",
    ],
    correctIndex: 0,
    explanation:
      "dynamic_cast relies on RTTI (runtime type information), which is only available for polymorphic types (those with at least one virtual function).",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 31,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the result?",
    code: `const int x = 42;\nint* p = const_cast<int*>(&x);\n*p = 99;\nstd::cout << x;`,
    options: [
      "Prints 99",
      "Prints 42",
      "Undefined behavior",
      "Compilation error",
    ],
    correctIndex: 2,
    explanation:
      "Modifying an object that was originally declared const through a const_cast pointer is undefined behavior. The compiler may have placed x in read-only memory or substituted its value at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },

  // ── Module 12: I/O & Filesystem ──
  {
    id: 32,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "Which header provides std::filesystem::path and directory operations in C++17?",
    options: ["<fstream>", "<filesystem>", "<iostream>", "<cstdio>"],
    correctIndex: 1,
    explanation:
      "The <filesystem> header (C++17) provides std::filesystem::path, directory_iterator, and functions like exists(), create_directory(), and copy().",
    link: "https://en.cppreference.com/w/cpp/filesystem.html",
  },
  {
    id: 33,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      'What is the state of std::cin after extraction when the user types "hello" for an int?',
    code: `int x;\nstd::cin >> x;  // user types "hello"`,
    options: [
      "Good — x is set to 0",
      "Fail — the failbit is set",
      "Bad — an irrecoverable error occurred",
      "EOF — the stream reached end-of-file",
    ],
    correctIndex: 1,
    explanation:
      'The extraction fails because "hello" cannot be parsed as an integer. The failbit is set. You must call cin.clear() and discard the bad input before reading again.',
    link: "https://en.cppreference.com/w/cpp/io/basic_istream/operator_gtgt.html",
  },

  // ── Module 13: Build Systems ──
  {
    id: 34,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is the recommended way to build a CMake project?",
    options: [
      "Run cmake . in the source directory",
      "Create a separate build directory: mkdir build && cd build && cmake ..",
      "Run g++ *.cpp directly",
      "Run make without CMake",
    ],
    correctIndex: 1,
    explanation:
      "Out-of-source builds keep generated files out of the source tree, making the project easier to clean and preventing accidental commits of build artifacts.",
    link: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html",
  },
  {
    id: 35,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "Why should you prefer target_include_directories() over include_directories() in modern CMake?",
    options: [
      "It compiles faster",
      "It scopes include paths to a specific target, preventing leakage to other targets",
      "It only works with the Ninja generator",
      "There is no practical difference",
    ],
    correctIndex: 1,
    explanation:
      "Modern CMake best practice uses target-scoped commands to keep build configurations isolated per target and propagate dependencies explicitly through PUBLIC/PRIVATE/INTERFACE.",
    link: "https://cmake.org/cmake/help/latest/command/target_include_directories.html",
  },

  // ── Module 14: Variant & Type Traits ──
  {
    id: 36,
    difficulty: "Easy",
    topic: "Variant & Type Traits",
    question:
      "What type does v hold after default construction?",
    code: `std::variant<int, std::string> v;`,
    options: ["std::string", "int", "It is empty (valueless)", "Undefined"],
    correctIndex: 1,
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
      "Compiles, but throws std::bad_variant_access at runtime",
      "Undefined behavior",
      "Compilation error",
      "The unhandled types are silently ignored",
    ],
    correctIndex: 2,
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
      "When the set of types is open-ended and expected to grow over time",
      "When the set of types is closed and known at compile time",
      "When you need heap allocation for polymorphism",
      "When you need dynamic dispatch through vtables",
    ],
    correctIndex: 1,
    explanation:
      "variant is ideal for closed type sets: the compiler ensures exhaustive handling via visit, and values are stored inline (no heap allocation). Class hierarchies are better when the type set is open.",
    link: "https://en.cppreference.com/w/cpp/utility/variant.html",
  },

  // ── Bonus: Easy (Q39–Q48) ──
  {
    id: 39,
    difficulty: "Easy",
    topic: "OOP",
    question:
      "A base class declares virtual void speak() const. A derived class writes void speak() override (missing const). What happens?",
    code: `class Animal {\npublic:\n    virtual void speak() const { std::cout << "..."; }\n};\n\nclass Dog : public Animal {\npublic:\n    void speak() override { std::cout << "Woof"; }\n};`,
    options: [
      "Compiles and prints 'Woof' when called through Animal*",
      "Compilation error — override detects a signature mismatch (missing const)",
      "Compiles but silently hides the base version",
      "Runtime error due to incorrect vtable entry",
    ],
    correctIndex: 1,
    explanation:
      "speak() and speak() const are different signatures. The override keyword catches this at compile time. Without override, the derived version would silently hide the base version.",
    link: "https://en.cppreference.com/w/cpp/language/override.html",
  },
  {
    id: 40,
    difficulty: "Easy",
    topic: "OOP",
    question:
      "In a diamond inheritance hierarchy without virtual inheritance, how many copies of the shared base's data members exist?",
    options: ["Zero", "One", "Two", "It depends on the compiler"],
    correctIndex: 2,
    explanation:
      "Without virtual inheritance, each path through the diamond creates its own copy of the base class, causing ambiguity when accessing the base's members.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-base-classes/",
  },
  {
    id: 41,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "What happens when both a and b go out of scope?",
    code: `int* raw = new int(42);\nstd::shared_ptr<int> a(raw);\nstd::shared_ptr<int> b(raw);`,
    options: [
      "The integer is freed once — shared_ptr detects the duplicate",
      "Undefined behavior — double delete",
      "Compilation error",
      "Memory leak — neither frees it",
    ],
    correctIndex: 1,
    explanation:
      "Each shared_ptr creates its own independent control block with ref count 1. When each reaches zero, both try to delete raw. Always use make_shared or copy/move an existing shared_ptr.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr.html",
  },
  {
    id: 42,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "How many heap allocations does std::make_shared<Widget>() perform compared to std::shared_ptr<Widget>(new Widget())?",
    options: [
      "Same — both do 2 allocations",
      "make_shared does 1, shared_ptr(new) does 2",
      "make_shared does 2, shared_ptr(new) does 1",
      "Both do 1 allocation",
    ],
    correctIndex: 1,
    explanation:
      "make_shared allocates the object and the control block (reference counts) in a single memory block. shared_ptr(new Widget()) allocates the object with new and then separately allocates a control block.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared.html",
  },
  {
    id: 43,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "A shared_ptr points to an object with a strong reference count of 1. You create a weak_ptr from it. What is the strong reference count now?",
    options: [
      "2",
      "1",
      "0",
      "Undefined — weak_ptr cannot be created from a shared_ptr",
    ],
    correctIndex: 1,
    explanation:
      "weak_ptr does not increment the strong reference count. It only increments the weak count. This is what allows weak_ptr to break circular reference cycles.",
    link: "https://en.cppreference.com/w/cpp/memory/weak_ptr.html",
  },
  {
    id: 44,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "What is the runtime overhead of std::array<int, 100> compared to int arr[100]?",
    options: [
      "Slightly slower due to bounds checking",
      "Significantly slower due to heap allocation",
      "Zero — std::array is a zero-overhead wrapper",
      "Faster due to compiler optimizations on STL types",
    ],
    correctIndex: 2,
    explanation:
      "std::array is stack-allocated with a compile-time fixed size, just like a C array. It adds no runtime cost while providing .size(), iterators, and other STL container interfaces.",
    link: "https://en.cppreference.com/w/cpp/container/array.html",
  },
  {
    id: 45,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "Why can't you pass &myDeque[0] to a C function that expects a pointer to contiguous memory?",
    options: [
      "deque elements are stored in non-contiguous chunks of memory",
      "deque does not support operator[]",
      "deque stores elements in reverse order",
      "deque elements are always heap-allocated individually",
    ],
    correctIndex: 0,
    explanation:
      "Unlike vector, deque uses multiple fixed-size blocks. Elements are not guaranteed to be contiguous, so pointer arithmetic across elements is invalid.",
    link: "https://en.cppreference.com/w/cpp/container/deque.html",
  },
  {
    id: 46,
    difficulty: "Easy",
    topic: "Algorithms",
    question:
      "What does std::find(v.begin(), v.end(), 42) return if 42 is not in the vector?",
    options: [
      "A null pointer",
      "An iterator to v.end()",
      "Throws std::out_of_range",
      "An iterator to the last element",
    ],
    correctIndex: 1,
    explanation:
      "All STL search algorithms return the past-the-end iterator to signal 'not found.' You must check the result against end() before dereferencing.",
    link: "https://en.cppreference.com/w/cpp/algorithm/find.html",
  },
  {
    id: 47,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What does the noexcept specifier on a function tell the compiler?",
    options: [
      "The function will never be called with invalid arguments",
      "The function is guaranteed not to throw exceptions",
      "The function runs at compile time",
      "The function has no side effects",
    ],
    correctIndex: 1,
    explanation:
      "If a noexcept function does throw, std::terminate is called immediately. The compiler can generate more efficient code for noexcept functions (no need for stack unwinding machinery).",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 48,
    difficulty: "Easy",
    topic: "Modern C++",
    question: "What are x and y?",
    code: `auto [x, y] = std::pair{1, 2};`,
    options: [
      "References to the pair's members",
      "Copies of the pair's members (x=1, y=2)",
      "Pointers to the pair's members",
      "Compilation error — structured bindings don't work with std::pair",
    ],
    correctIndex: 1,
    explanation:
      "auto [x, y] creates copies by value. To get references, use auto& [x, y]. Structured bindings (C++17) work with std::pair, std::tuple, std::array, and any aggregate type.",
    link: "https://en.cppreference.com/w/cpp/language/structured_binding.html",
  },

  // ── Bonus: Medium (Q49–Q58) ──
  {
    id: 49,
    difficulty: "Medium",
    topic: "Modern C++",
    question:
      "Does the explicit std::move help or hurt performance?",
    code: `std::string createMessage() {\n    std::string result = "hello";\n    return std::move(result);\n}`,
    options: [
      "Helps — guarantees the string is moved instead of copied",
      "Hurts — prevents Named Return Value Optimization (NRVO)",
      "No effect — the compiler ignores std::move on return statements",
      "Compilation error — cannot move a local variable in a return statement",
    ],
    correctIndex: 1,
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
      "Lambda can't capture local variables",
      "Dangling reference — count is destroyed when makeCounter returns",
      "Compilation error — lambda must be mutable",
      "No problem — the lambda extends the lifetime of count",
    ],
    correctIndex: 1,
    explanation:
      "The lambda captures count by reference, but count is a local variable that dies at the end of makeCounter. Calling the returned lambda reads a dangling reference (undefined behavior). Capture by value instead.",
    link: "https://www.learncpp.com/cpp-tutorial/lambda-captures/",
  },
  {
    id: 51,
    difficulty: "Medium",
    topic: "Templates",
    question:
      "What does the C++17 left fold expression (... - args) evaluate to when args is the parameter pack (1, 2, 3)?",
    options: [
      "0",
      "-4",
      "2",
      "Compilation error — subtraction is not allowed in fold expressions",
    ],
    correctIndex: 1,
    explanation:
      "A left fold (... - args) associates left-to-right: ((1 - 2) - 3) = (-1 - 3) = -4. Fold expressions require parentheses and the associativity matters for non-commutative operators.",
    link: "https://en.cppreference.com/w/cpp/language/fold.html",
  },
  {
    id: 52,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "Why does std::atomic::compare_exchange_weak sometimes fail even when the current value equals the expected value?",
    options: [
      "It has a built-in random failure rate for testing",
      "On LL/SC architectures (like ARM), the exclusive monitor can be lost spuriously",
      "It checks type identity, not value equality",
      "It always fails the first time as a safety feature",
    ],
    correctIndex: 1,
    explanation:
      "ARM uses Load-Linked/Store-Conditional instead of x86's single compare-and-swap instruction. Context switches or cache evictions can clear the exclusive monitor, causing a spurious failure. Use it in a loop, or use compare_exchange_strong.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange.html",
  },
  {
    id: 53,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "Thread A stores a flag with memory_order_relaxed. Thread B loads the flag with memory_order_relaxed and sees the new value. Can Thread B safely read other data that Thread A wrote before the flag?",
    options: [
      "Yes — seeing the flag guarantees visibility of prior writes",
      "No — relaxed provides no ordering guarantees beyond atomicity",
      "Yes — all atomic operations are sequentially consistent",
      "No — relaxed stores are never visible to other threads",
    ],
    correctIndex: 1,
    explanation:
      "memory_order_relaxed only guarantees that the atomic operation itself is indivisible. It does not establish any happens-before relationship. Use memory_order_release (store) and memory_order_acquire (load) for producer-consumer synchronization.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order.html",
  },
  {
    id: 54,
    difficulty: "Medium",
    topic: "Variant & Type Traits",
    question: "What is the value of std::is_const_v<const int*>?",
    options: [
      "true",
      "false",
      "Compilation error — is_const doesn't work with pointers",
      "Implementation-defined",
    ],
    correctIndex: 1,
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
      "int[5]",
      "int*",
      "std::array<int, 5>",
      "int&",
    ],
    correctIndex: 1,
    explanation:
      "std::decay simulates the type transformations that happen when passing by value: arrays decay to pointers, functions decay to function pointers, and top-level cv-qualifiers are removed.",
    link: "https://en.cppreference.com/w/cpp/types/decay.html",
  },
  {
    id: 56,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the key advantage of v.emplace_back(args...) over v.push_back(T(args...))?",
    options: [
      "emplace_back is thread-safe",
      "emplace_back constructs the object in-place, avoiding a temporary",
      "emplace_back checks bounds before inserting",
      "emplace_back preallocates extra capacity",
    ],
    correctIndex: 1,
    explanation:
      "emplace_back forwards arguments directly to the constructor, building the object in the vector's memory. push_back requires an already-constructed object that is then copied or moved into the container.",
    link: "https://en.cppreference.com/w/cpp/container/vector/emplace_back.html",
  },
  {
    id: 57,
    difficulty: "Medium",
    topic: "C++20 Features",
    question:
      "Where is a C++20 coroutine's state (local variables, suspension point) stored by default?",
    options: [
      "On the calling thread's stack",
      "In a heap-allocated coroutine frame",
      "In thread-local storage",
      "In a static memory pool",
    ],
    correctIndex: 1,
    explanation:
      "When a coroutine is created, the compiler allocates a frame on the heap to hold its local variables and bookkeeping. The compiler may apply Heap Allocation Elision Optimization (HALO) in some cases, but this is not guaranteed.",
    link: "https://en.cppreference.com/w/cpp/language/coroutines.html",
  },
  {
    id: 58,
    difficulty: "Medium",
    topic: "Modern C++",
    question: "What is printed?",
    code: `std::string a = "hello";\nstd::string b = std::move(a);\nstd::cout << a.size();`,
    options: ["5", "0", "Undefined behavior", "Compilation error"],
    correctIndex: 1,
    explanation:
      "After being moved from, a is in a 'valid but unspecified' state. However, std::string's move constructor is specified to leave the source empty, so a.size() reliably returns 0.",
    link: "https://en.cppreference.com/w/cpp/utility/move.html",
  },

  // ── Bonus: Hard (Q59–Q68) ──
  {
    id: 59,
    difficulty: "Hard",
    topic: "OOP",
    question:
      "In a virtual inheritance diamond (D inherits B and C, both virtually inherit from A), which value does A receive?",
    code: `struct A { A(int x); };\nstruct B : virtual A { B() : A(1) {} };\nstruct C : virtual A { C() : A(2) {} };\nstruct D : B, C { D() : A(3), B(), C() {} };`,
    options: [
      "1 — B is listed first in D's inheritance",
      "2 — C is listed second, overriding B",
      "3 — the most-derived class constructs virtual bases",
      "Compilation error — A cannot be constructed from D",
    ],
    correctIndex: 2,
    explanation:
      "With virtual inheritance, B's and C's initializers for A are ignored. The most-derived class (D) is responsible for directly constructing all virtual base classes.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-base-classes/",
  },
  {
    id: 60,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "You use std::make_shared<LargeObject>(). The last shared_ptr is destroyed, but a weak_ptr still exists. When is the memory for LargeObject actually freed?",
    options: [
      "Immediately when the last shared_ptr is destroyed",
      "When the last weak_ptr is also destroyed",
      "At program exit",
      "When weak_ptr::lock() is called and returns nullptr",
    ],
    correctIndex: 1,
    explanation:
      "make_shared allocates the object and the control block in a single memory block. The object's destructor runs when the strong count hits zero, but the memory block cannot be freed until the weak count also reaches zero.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared.html",
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
      "T = int&, arg is int&",
      "T = int, arg is int&",
      "T = int&&, arg is int&&",
    ],
    correctIndex: 1,
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
      "Compilation error — non_existent_method() is not valid",
      "Compiles fine — the else branch is discarded and never checked",
      "Compilation error — both branches must be valid for all types",
      "Runtime error when the else branch executes",
    ],
    correctIndex: 1,
    explanation:
      "if constexpr evaluates the condition at compile time. When T = int, the else branch is entirely discarded during instantiation and is not type-checked. This is the key difference from a regular if.",
    link: "https://en.cppreference.com/w/cpp/language/if.html",
  },
  {
    id: 63,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "If a class's move constructor is NOT marked noexcept, what does std::vector do when it needs to reallocate?",
    options: [
      "Uses the move constructor anyway — it's always faster",
      "Falls back to copying elements instead of moving them",
      "Throws std::bad_alloc",
      "Calls std::terminate",
    ],
    correctIndex: 1,
    explanation:
      "vector must provide the strong exception guarantee during reallocation. If a move constructor could throw mid-reallocation, the original elements would already be in a moved-from state with no way to recover. Copying is safe because the originals remain untouched if an exception occurs.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 64,
    difficulty: "Hard",
    topic: "OOP",
    question:
      "In the copy-and-swap idiom, the assignment operator takes the parameter by value. Why does this also handle move assignment?",
    code: `Widget& operator=(Widget other) {\n    swap(*this, other);\n    return *this;\n}`,
    options: [
      "It doesn't — you still need a separate move assignment operator",
      "When called with an rvalue, other is move-constructed instead of copy-constructed",
      "The compiler automatically converts it to a move assignment operator",
      "swap detects rvalues and avoids copying",
    ],
    correctIndex: 1,
    explanation:
      "When the argument is an rvalue, the by-value parameter other is initialized via the move constructor. When the argument is an lvalue, other is copy-constructed. Either way, you swap with the temporary and let its destructor clean up the old state.",
    link: "https://en.cppreference.com/w/cpp/language/operators.html",
  },
  {
    id: 65,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Which approach is correct for safely promoting a weak_ptr to a shared_ptr in a multithreaded program?",
    options: [
      "if (!wp.expired()) { auto sp = wp.lock(); use(sp); }",
      "auto sp = wp.lock(); if (sp) { use(sp); }",
      "auto sp = std::shared_ptr(wp); use(sp);",
      "if (wp.use_count() > 0) { auto sp = wp.lock(); use(sp); }",
    ],
    correctIndex: 1,
    explanation:
      "lock() atomically checks and promotes in a single operation. Options A and D suffer from a TOCTOU race: the object could be destroyed between the check and the lock() call. Option C throws std::bad_weak_ptr if the object is already destroyed.",
    link: "https://en.cppreference.com/w/cpp/memory/weak_ptr/lock.html",
  },
  {
    id: 66,
    difficulty: "Hard",
    topic: "Variant & Type Traits",
    question:
      "What is the type of std::conditional_t<(sizeof(int) > 4), long long, int>?",
    options: [
      "Always long long",
      "Always int",
      "int on most platforms (where sizeof(int) == 4)",
      "Compilation error — sizeof cannot be used in template arguments",
    ],
    correctIndex: 2,
    explanation:
      "std::conditional_t<Cond, T, F> is a compile-time type-level ternary. When the condition is false (sizeof(int) is 4, not greater than 4), it selects the second type int. sizeof is a constant expression, perfectly valid in template arguments.",
    link: "https://en.cppreference.com/w/cpp/types/conditional.html",
  },
  {
    id: 67,
    difficulty: "Hard",
    topic: "Modern C++",
    question:
      "Two lambdas have identical signatures and bodies. Are f and g the same type?",
    code: `auto f = [](int x) { return x * 2; };\nauto g = [](int x) { return x * 2; };`,
    options: [
      "Yes — they have identical signatures and bodies",
      "No — each lambda expression has a unique compiler-generated type",
      "Yes — non-capturing lambdas always share the same type",
      "It depends on the compiler's optimization level",
    ],
    correctIndex: 1,
    explanation:
      "The C++ standard mandates that every lambda expression produces a value of a unique, unnamed closure type, even if two lambdas are textually identical. Both can convert to int(*)(int) since they're non-capturing, but their closure types differ.",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 68,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "On x86-64, how does std::atomic<int>::fetch_add(1) typically execute at the hardware level?",
    options: [
      "It acquires a kernel mutex, increments, then releases",
      "It disables interrupts on the CPU core during the increment",
      "It uses a single LOCK XADD instruction — no OS involvement",
      "It uses a compare-and-swap loop in software",
    ],
    correctIndex: 2,
    explanation:
      "On x86-64, atomic read-modify-write operations for small types map directly to hardware instructions with the LOCK prefix, which locks the cache line. There are no system calls, no kernel transitions, and no OS-level mutexes.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic/fetch_add.html",
  },

  // ── CS Fundamentals: Easy (Q69–Q78) ──
  {
    id: 69,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "Where are local variables stored during function execution?",
    options: ["Heap", "Stack", "Data segment", "Code segment"],
    correctIndex: 1,
    explanation:
      "Local variables are allocated on the stack when a function is called. The stack provides fast, automatic allocation and deallocation — memory is reclaimed when the function returns.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 70,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "What are the four stages of C/C++ compilation, in order?",
    options: [
      "Compile, link, assemble, preprocess",
      "Preprocess, compile, assemble, link",
      "Preprocess, assemble, compile, link",
      "Link, compile, assemble, preprocess",
    ],
    correctIndex: 1,
    explanation:
      "The preprocessor expands macros and #includes, the compiler translates to assembly, the assembler converts to machine code (object files), and the linker combines object files into an executable.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 71,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What does a compiler do?",
    options: [
      "Executes source code line by line",
      "Translates source code into machine code",
      "Manages memory allocation at runtime",
      "Links object files into an executable",
    ],
    correctIndex: 1,
    explanation:
      "A compiler translates human-readable source code into machine code (or an intermediate representation) that the CPU can execute. This is distinct from an interpreter, which executes code line by line.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 72,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What is the decimal value of the binary number 1010?",
    options: ["8", "10", "12", "5"],
    correctIndex: 1,
    explanation:
      "Binary 1010 = 1×8 + 0×4 + 1×2 + 0×1 = 10 in decimal. Each digit represents a power of 2, from right (2⁰) to left (2³).",
    link: "https://www.learncpp.com/cpp-tutorial/numeral-systems-decimal-binary-hexadecimal-and-octal/",
  },
  {
    id: 73,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "What happens to the contents of RAM when the computer is powered off?",
    options: [
      "They are saved to disk automatically",
      "They persist until overwritten",
      "They are lost — RAM is volatile memory",
      "They are compressed and stored in firmware",
    ],
    correctIndex: 2,
    explanation:
      "RAM (Random Access Memory) is volatile — it requires continuous power to retain data. When the computer shuts down, all RAM contents are lost. Persistent storage (SSD/HDD) retains data without power.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-programming-languages/",
  },
  {
    id: 74,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What does a pointer store?",
    options: [
      "The value of another variable",
      "A memory address",
      "The type of another variable",
      "A copy of another variable",
    ],
    correctIndex: 1,
    explanation:
      "A pointer is a variable that holds the memory address of another value. Dereferencing the pointer accesses the value at that address.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/",
  },
  {
    id: 75,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What is an object file?",
    options: [
      "A file containing C++ class definitions",
      "A fully linked executable ready to run",
      "Machine code from a single translation unit, not yet linked",
      "A compressed archive of source files",
    ],
    correctIndex: 2,
    explanation:
      "An object file (.o or .obj) contains the machine code produced by compiling a single source file. It has unresolved references to symbols defined in other files, which the linker resolves.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 76,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "How many bits are in a byte?",
    options: ["4", "8", "16", "32"],
    correctIndex: 1,
    explanation:
      "A byte consists of 8 bits. A bit is the smallest unit of data (0 or 1). One byte can represent 256 different values (2⁸).",
    link: "https://www.learncpp.com/cpp-tutorial/numeral-systems-decimal-binary-hexadecimal-and-octal/",
  },
  {
    id: 77,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What does the linker produce?",
    options: [
      "Assembly code",
      "Object files",
      "Preprocessed source code",
      "An executable (or library) by combining object files",
    ],
    correctIndex: 3,
    explanation:
      "The linker takes one or more object files, resolves symbol references between them, and produces a final executable or library. It connects function calls to their definitions across translation units.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 78,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "In Boolean logic, what is the result of `true AND false`?",
    options: ["true", "false", "undefined", "null"],
    correctIndex: 1,
    explanation:
      "The AND operator returns true only when both operands are true. Since one operand is false, the result is false.",
    link: "https://www.learncpp.com/cpp-tutorial/boolean-values/",
  },

  // ── CS Fundamentals: Medium (Q79–Q88) ──
  {
    id: 79,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What does a stack frame typically contain?",
    options: [
      "Only the function's source code",
      "Return address, local variables, and function arguments",
      "The entire program's global state",
      "A copy of the heap",
    ],
    correctIndex: 1,
    explanation:
      "Each function call creates a stack frame containing the return address (where to resume after the call), the function's local variables, and its arguments. The frame is destroyed when the function returns.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 80,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "Why is heap allocation generally slower than stack allocation?",
    options: [
      "The heap uses slower memory chips",
      "Heap allocation requires finding a free block and maintaining bookkeeping, while the stack just moves the stack pointer",
      "The heap is always on disk, not in RAM",
      "Heap memory must be initialized to zero by the OS",
    ],
    correctIndex: 1,
    explanation:
      "Stack allocation is a simple pointer adjustment (one instruction). Heap allocation requires the allocator to search for a suitably sized free block, update internal bookkeeping structures, and handle fragmentation.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 81,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What causes a stack overflow?",
    options: [
      "Allocating too much memory with new",
      "Unbounded recursion exhausting the fixed-size call stack",
      "Using too many global variables",
      "Opening too many files simultaneously",
    ],
    correctIndex: 1,
    explanation:
      "The call stack has a fixed size (typically 1–8 MB). Each recursive call adds a new stack frame. Without a base case or with too-deep recursion, the stack frames exhaust the available space, causing a stack overflow.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 82,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "What is the difference between static linking and dynamic linking?",
    options: [
      "Static linking is for C; dynamic linking is for C++",
      "Static linking copies library code into the executable; dynamic linking loads libraries at runtime",
      "Static linking is slower at build time but faster at runtime; dynamic linking is the opposite",
      "There is no practical difference — the terms are interchangeable",
    ],
    correctIndex: 1,
    explanation:
      "Static linking embeds all library code directly into the executable at build time, producing a larger but self-contained binary. Dynamic linking keeps libraries separate (.so/.dll) and loads them at runtime, allowing sharing across programs.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 83,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "How is the integer -1 represented in 8-bit two's complement?",
    options: ["10000001", "11111111", "11111110", "00000001"],
    correctIndex: 1,
    explanation:
      "In two's complement, -1 is all bits set: 11111111 (0xFF). To negate a number, invert all bits and add 1. Inverting 00000001 gives 11111110, plus 1 gives 11111111.",
    link: "https://www.learncpp.com/cpp-tutorial/numeral-systems-decimal-binary-hexadecimal-and-octal/",
  },
  {
    id: 84,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "In a typical process memory layout, which segment stores global and static variables?",
    options: [
      "Stack segment",
      "Code (text) segment",
      "Data segment (and BSS for uninitialized ones)",
      "Heap segment",
    ],
    correctIndex: 2,
    explanation:
      "Global and static variables with explicit initial values go in the data segment. Uninitialized (or zero-initialized) global/static variables go in the BSS segment, which is zeroed at program startup.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 85,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "On a little-endian system, how is the 32-bit value 0x01020304 stored in memory (from lowest address)?",
    options: [
      "01 02 03 04",
      "04 03 02 01",
      "02 01 04 03",
      "03 04 01 02",
    ],
    correctIndex: 1,
    explanation:
      "Little-endian stores the least significant byte (LSB) at the lowest address. For 0x01020304, the LSB is 0x04, so memory reads: 04 03 02 01. x86/x64 processors use little-endian byte order.",
    link: "https://en.wikipedia.org/wiki/Endianness",
  },
  {
    id: 86,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What does the `#include` preprocessor directive do?",
    options: [
      "Imports a compiled module",
      "Textually copies the header file's contents into the source file",
      "Links against an external library",
      "Declares a forward reference to a class",
    ],
    correctIndex: 1,
    explanation:
      "The preprocessor performs a literal text substitution: the #include line is replaced with the entire contents of the specified file. This happens before compilation, which is why include guards or #pragma once are needed to prevent duplicate definitions.",
    link: "https://www.learncpp.com/cpp-tutorial/header-files/",
  },
  {
    id: 87,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "When a function receives a parameter by value, what does it get?",
    options: [
      "A reference to the original variable",
      "A pointer to the original variable",
      "A copy of the original value",
      "Direct access to the caller's memory",
    ],
    correctIndex: 2,
    explanation:
      "Pass by value creates a copy of the argument. Modifications inside the function affect only the copy, not the caller's original. Pass by reference or pointer is needed to modify the original.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-function-parameters-and-arguments/",
  },
  {
    id: 88,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What is undefined behavior?",
    options: [
      "A runtime exception that the program can catch",
      "Code that the compiler rejects with an error",
      "Code whose behavior the language standard does not define — anything can happen",
      "A warning that can be safely ignored",
    ],
    correctIndex: 2,
    explanation:
      "Undefined behavior (UB) means the language standard places no requirements on what happens. The program may crash, produce wrong results, appear to work, or behave differently across compilers. Common causes include null pointer dereference, out-of-bounds access, and signed integer overflow.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },

  // ── CS Fundamentals: Hard (Q89–Q98) ──
  {
    id: 89,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question: "What does virtual memory allow?",
    options: [
      "Programs to execute directly from disk without loading into RAM",
      "Each process to see its own contiguous address space, mapped to physical RAM by the OS",
      "Multiple programs to share the same physical memory addresses",
      "The CPU to operate without any RAM installed",
    ],
    correctIndex: 1,
    explanation:
      "Virtual memory gives each process the illusion of a large, contiguous address space. The OS and hardware (MMU) translate virtual addresses to physical RAM locations, enabling isolation between processes, memory protection, and the ability to use more memory than physically available via paging.",
    link: "https://en.wikipedia.org/wiki/Virtual_memory",
  },
  {
    id: 90,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Why do arrays generally perform better than linked lists for sequential access?",
    options: [
      "Arrays use less total memory",
      "Arrays store elements contiguously, which is cache-friendly; linked list nodes are scattered in memory, causing cache misses",
      "Linked lists require virtual function calls to traverse",
      "Arrays are always allocated on the stack, which is faster",
    ],
    correctIndex: 1,
    explanation:
      "Modern CPUs load data in cache lines (typically 64 bytes). Array elements are contiguous, so accessing one prefetches its neighbors. Linked list nodes are scattered across the heap, causing frequent cache misses and memory stalls.",
    link: "https://en.wikipedia.org/wiki/Locality_of_reference",
  },
  {
    id: 91,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "On most architectures, when a function is called, what happens to the stack pointer?",
    options: [
      "It is incremented to allocate space for the new frame",
      "It is decremented (stack grows downward) to reserve space for the new frame",
      "It remains unchanged — the frame pointer does all the work",
      "It is reset to zero",
    ],
    correctIndex: 1,
    explanation:
      "On x86/x64 and ARM, the stack grows downward (from high addresses to low). The stack pointer is decremented to make room for the new function's local variables and bookkeeping. It is restored when the function returns.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 92,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Why do compilers insert padding bytes between struct members?",
    options: [
      "To make the struct serializable over the network",
      "To align members to their natural boundaries for efficient CPU access",
      "To prevent buffer overflow attacks",
      "To reserve space for future member additions",
    ],
    correctIndex: 1,
    explanation:
      "CPUs access memory most efficiently when data is aligned to its size (e.g., a 4-byte int at an address divisible by 4). Misaligned access can be slower or even cause hardware faults on some architectures. Compilers add padding to ensure each member meets its alignment requirement.",
    link: "https://en.cppreference.com/w/cpp/language/object.html",
  },
  {
    id: 93,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Why does 0.1 + 0.2 not equal exactly 0.3 in IEEE 754 floating point?",
    options: [
      "Floating point arithmetic rounds to the nearest integer",
      "0.1 and 0.2 cannot be represented exactly in binary floating point, so small rounding errors accumulate",
      "The CPU performs floating point math in decimal, causing conversion errors",
      "The result overflows the floating point range",
    ],
    correctIndex: 1,
    explanation:
      "Just as 1/3 cannot be represented exactly in decimal, 0.1 and 0.2 cannot be represented exactly in binary. Each gets rounded to the nearest representable value, and these rounding errors accumulate. The result is 0.30000000000000004, not 0.3.",
    link: "https://en.wikipedia.org/wiki/IEEE_754",
  },
  {
    id: 94,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question: "What is an ABI (Application Binary Interface)?",
    options: [
      "A high-level API for system calls",
      "A specification defining calling conventions, name mangling, and struct layout at the binary level",
      "A debugging interface for inspecting running processes",
      "A standard for source code formatting",
    ],
    correctIndex: 1,
    explanation:
      "An ABI defines how compiled code interacts at the binary level: how function arguments are passed (registers vs. stack), how names are mangled, struct member layout and padding, vtable format, and exception handling mechanisms. ABI compatibility allows code compiled by different compilers or compiler versions to link together.",
    link: "https://en.wikipedia.org/wiki/Application_binary_interface",
  },
  {
    id: 95,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question: "What is a translation unit?",
    options: [
      "A single header file",
      "A source file after preprocessing — with all #includes expanded — the unit the compiler processes",
      "A compiled object file ready for linking",
      "A module partition in C++20",
    ],
    correctIndex: 1,
    explanation:
      "A translation unit is the result of preprocessing a single .cpp file: all #includes are expanded, macros are resolved, and conditional compilation is evaluated. The compiler processes one translation unit at a time, producing one object file.",
    link: "https://en.cppreference.com/w/cpp/language/translation_phases.html",
  },
  {
    id: 96,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question: "What typically causes a segmentation fault (segfault)?",
    options: [
      "Dividing by zero",
      "Accessing memory the process does not own — such as dereferencing a null pointer, freed memory, or an out-of-bounds address",
      "Running out of disk space",
      "Using an uninitialized variable",
    ],
    correctIndex: 1,
    explanation:
      "A segfault occurs when a program tries to access a memory address that the OS has not mapped for that process. Common triggers: null pointer dereference, use-after-free, buffer overflows, and writing to read-only memory. The OS terminates the process to prevent corruption.",
    link: "https://en.wikipedia.org/wiki/Segmentation_fault",
  },
  {
    id: 97,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "What goes wrong if a non-inline function is defined in a header included by multiple .cpp files?",
    options: [
      "Compilation error in each file",
      "The function is silently ignored after the first definition",
      "Multiple definition linker error — violates the One Definition Rule (ODR)",
      "The function is automatically inlined by the compiler",
    ],
    correctIndex: 2,
    explanation:
      "Each .cpp file that includes the header compiles its own copy of the function into its object file. When the linker combines them, it finds multiple definitions of the same symbol and reports an error. Use inline, static, or an anonymous namespace to avoid this, or define the function in a single .cpp file.",
    link: "https://en.cppreference.com/w/cpp/language/definition.html",
  },
  {
    id: 98,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Why are CPU registers faster than RAM?",
    options: [
      "Registers use a different voltage level that is faster to switch",
      "Registers are on the CPU die itself, accessed in ~1 cycle, while RAM requires ~100 cycles through the memory bus",
      "Registers are larger than RAM cells, so they hold more data per access",
      "Registers use optical signaling instead of electrical",
    ],
    correctIndex: 1,
    explanation:
      "Registers are tiny storage locations built directly into the CPU core. They can be read/written in a single clock cycle. RAM sits on separate chips connected via the memory bus, and a cache miss to main memory costs roughly 100+ cycles due to the physical distance and bus latency.",
    link: "https://en.wikipedia.org/wiki/Processor_register",
  },

  // ── CS Fundamentals: Nuanced Easy (Q99–Q108) ──
  {
    id: 99,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "Two threads in the same process each increment a shared global counter without synchronization. Which statement is true?",
    options: [
      "Each thread has its own copy of the counter, so no conflict is possible",
      "Both threads share the same memory space, so the counter may end up with the wrong value due to data races",
      "The OS guarantees that global variable access is atomic",
      "This is only a problem on single-core CPUs where threads are time-sliced",
    ],
    correctIndex: 1,
    explanation:
      "Threads within the same process share the same address space, including global variables and heap memory. Without synchronization, concurrent read-modify-write operations on the counter create a data race, which can produce incorrect results on both single-core (due to interleaving) and multi-core systems (due to caching and reordering). Each thread has its own stack, but heap and global data are shared.",
    link: "https://en.cppreference.com/w/cpp/language/memory_model.html",
  },
  {
    id: 100,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "An 8-bit unsigned integer can store 0 to 255. What is the range of an 8-bit signed integer in two's complement?",
    options: [
      "-127 to 127",
      "-128 to 127",
      "-128 to 128",
      "-255 to 255",
    ],
    correctIndex: 1,
    explanation:
      "In two's complement, one bit pattern (10000000) is used for -128, but there is no +128 because 01111111 is the largest positive value. This asymmetry — one more negative value than positive — is a direct consequence of how two's complement encoding works. The total number of representable values is still 256 (2⁸), just shifted: -128 through +127.",
    link: "https://www.learncpp.com/cpp-tutorial/signed-integers/",
  },
  {
    id: 101,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      'A C-style string is stored as char str[] = "hello". How many bytes does this array actually occupy in memory?',
    options: [
      "5 bytes — one per character",
      "6 bytes — the five characters plus a null terminator '\\0'",
      "8 bytes — rounded up to the nearest word boundary",
      "4 bytes — the size of a pointer on a 32-bit system",
    ],
    correctIndex: 1,
    explanation:
      "C-style strings are null-terminated: the compiler appends a '\\0' byte after the last character. So \"hello\" requires 6 bytes: 'h', 'e', 'l', 'l', 'o', '\\0'. Functions like strlen() return 5 (they count characters until the null terminator), but sizeof(str) returns 6 (the actual memory occupied). Forgetting this extra byte is a common source of buffer overflow bugs.",
    link: "https://www.learncpp.com/cpp-tutorial/c-style-strings/",
  },
  {
    id: 102,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      'Header file "math_utils.h" is included by both "a.cpp" and "b.cpp", and "a.cpp" also includes "b.h" which itself includes "math_utils.h". What do include guards prevent?',
    options: [
      "The header being used by more than one source file",
      "The header's contents being pasted multiple times into the same translation unit",
      "Circular dependencies between source files at link time",
      "The header from being modified by the preprocessor",
    ],
    correctIndex: 1,
    explanation:
      "Include guards (or #pragma once) prevent multiple inclusion within a single translation unit. When a.cpp includes math_utils.h directly and again indirectly through b.h, without guards the preprocessor would paste the header contents twice, causing duplicate definition errors. Include guards do NOT prevent multiple translation units from each including the header — that is normal and expected.",
    link: "https://www.learncpp.com/cpp-tutorial/header-guards/",
  },
  {
    id: 103,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What is wrong with this code?",
    code: "int* p = new int(42);\ndelete p;\nstd::cout << *p;",
    options: [
      "Nothing — delete only marks memory as available, the value 42 is still there",
      "Undefined behavior — p is a dangling pointer after delete, and dereferencing it is illegal",
      "Compilation error — you cannot use cout on a dereferenced pointer",
      "Memory leak — you should set p = nullptr after delete",
    ],
    correctIndex: 1,
    explanation:
      "After delete, the memory pointed to by p is returned to the allocator. The pointer still holds the old address (a dangling pointer), but the memory may have been reused. Dereferencing a dangling pointer is undefined behavior — it might appear to 'work' and print 42 (if the memory hasn't been reused yet), crash, or produce garbage. The fact that it sometimes appears to work is exactly what makes this bug so dangerous.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/",
  },
  {
    id: 104,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "A program compiles without errors but crashes when dividing by a user-provided value of zero. What kind of error is this?",
    options: [
      "Compile-time error — the compiler should have caught the division by zero",
      "Linker error — the division operator was not linked properly",
      "Runtime error — the compiler cannot predict what value the user will enter",
      "Syntax error — division by zero is invalid syntax",
    ],
    correctIndex: 2,
    explanation:
      "The compiler analyzes code structure and types, but it cannot know what value a user will input at runtime. Division by zero with a runtime-determined value is a runtime error. The compiler CAN sometimes warn about compile-time-constant divisions by zero (e.g., x / 0 where 0 is a literal), but when the divisor comes from user input, the error is inherently a runtime problem.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-programming-languages/",
  },
  {
    id: 105,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      'When the linker reports "undefined reference to calculateSum(int, int)", what data structure is it consulting to find that function?',
    options: [
      "The call stack",
      "The symbol table — a mapping of names to addresses in each object file",
      "The virtual memory page table",
      "The compiler's abstract syntax tree (AST)",
    ],
    correctIndex: 1,
    explanation:
      "Each object file contains a symbol table listing the names of functions and variables it defines (with addresses) and references (without addresses, marked as undefined). The linker's job is to match undefined references in one object file to definitions in another. When no object file provides a definition for a referenced symbol, you get an 'undefined reference' error.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 106,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "Function foo() allocates an int on the stack and another on the heap. When foo() returns without calling delete, which memory is automatically reclaimed?",
    code: "void foo() {\n    int stackVar = 10;\n    int* heapVar = new int(20);\n    // foo returns without calling delete\n}",
    options: [
      "Both — the OS reclaims all memory when a function returns",
      "Neither — all memory in C++ must be manually freed",
      "Only stackVar — heap memory requires explicit delete (or a smart pointer)",
      "Only heapVar — stack memory persists until the program ends",
    ],
    correctIndex: 2,
    explanation:
      "Stack memory is managed automatically by the CPU: the stack pointer is adjusted when a function returns, effectively reclaiming all local variables. Heap memory persists until explicitly freed with delete (or free). In this code, heapVar leaks because no delete is called and no smart pointer manages the allocation. This is exactly why RAII and smart pointers exist in modern C++.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 107,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "A byte in memory has the hex value 0xFF. What is its decimal value, and how many bits are set to 1?",
    options: [
      "Decimal 15, with 4 bits set",
      "Decimal 255, with 8 bits set",
      "Decimal 256, with 8 bits set",
      "Decimal 255, with 4 bits set",
    ],
    correctIndex: 1,
    explanation:
      "Each hex digit represents 4 bits (a nibble). F in hex = 1111 in binary = 15 in decimal. 0xFF = 0xF × 16 + 0xF = 15 × 16 + 15 = 255. In binary, 0xFF = 11111111 — all 8 bits are set. This is also the maximum value for an unsigned byte. A common mistake is confusing 0xF (one nibble, 4 bits) with 0xFF (one full byte, 8 bits).",
    link: "https://www.learncpp.com/cpp-tutorial/numeral-systems-decimal-binary-hexadecimal-and-octal/",
  },
  {
    id: 108,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      'When we say a CPU has a "64-bit word size," what does that primarily determine?',
    options: [
      "The CPU can only address 64 bytes of RAM",
      "The width of the CPU's general-purpose registers and the natural data size it processes in one operation",
      "The CPU clock speed is 64 GHz",
      "Each byte in memory is 64 bits instead of 8 bits",
    ],
    correctIndex: 1,
    explanation:
      "Word size refers to the width of the CPU's registers and data paths. A 64-bit CPU has 64-bit registers, can perform arithmetic on 64-bit values in a single instruction, and typically has a 64-bit address bus (enabling a theoretical address space of 2⁶⁴ bytes). This does NOT change the definition of a byte (always 8 bits) or clock speed. It directly affects the size of pointers, which is why sizeof(void*) is 8 on 64-bit systems.",
    link: "https://en.wikipedia.org/wiki/Word_(computer_architecture)",
  },

  // ── CS Fundamentals: Nuanced Medium (Q109–Q118) ──
  {
    id: 109,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "Adding 1 to the maximum value of an unsigned int is well-defined (it wraps to 0), but adding 1 to the maximum value of a signed int is undefined behavior. Why does the C++ standard treat them differently?",
    options: [
      "Signed overflow causes a hardware trap on all CPUs, so it must be undefined",
      "The standard defines unsigned arithmetic as modular (mod 2^N) to support bit manipulation, but leaves signed overflow undefined so compilers can optimize assuming it never happens",
      "Signed integers use a different circuit in the ALU that cannot handle overflow",
      "It's a historical accident — both should be well-defined, and C++23 fixes this",
    ],
    correctIndex: 1,
    explanation:
      "The C++ standard deliberately makes signed overflow undefined so compilers can reason that 'x + 1 > x' is always true for signed x, enabling loop optimizations and range analysis. Unsigned integers are defined to wrap modulo 2^N because bitwise operations, hashing, and cryptography depend on predictable wrapping. This is a language design choice, not a hardware limitation — most CPUs use two's complement for both and would wrap identically at the hardware level.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },
  {
    id: 110,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A modern CPU has L1, L2, and L3 caches. L1 is the fastest but smallest. Why not just make L1 very large?",
    options: [
      "L1 is volatile and would lose data if made larger",
      "A larger cache requires more time to search and longer wire distances, increasing latency — which defeats the purpose of L1",
      "L1 cache memory is a different, more expensive type of silicon that cannot be manufactured in large quantities",
      "The CPU instruction set only supports addressing a small L1 cache",
    ],
    correctIndex: 1,
    explanation:
      "Cache speed is fundamentally limited by physical size. A larger cache means more entries to search (associativity overhead) and longer electrical paths on the die, both of which increase access latency. L1 is kept small (typically 32–64 KB) to achieve 1-cycle access. L2 is larger (256 KB–1 MB) but slower (5–10 cycles). L3 is shared across cores, larger still (several MB), and slower (30–40 cycles). This hierarchy trades capacity for speed at each level.",
    link: "https://en.wikipedia.org/wiki/CPU_cache",
  },
  {
    id: 111,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A program accesses a virtual memory address for the first time. The OS handles a page fault and the program continues normally. What happened?",
    options: [
      "The program tried to access invalid memory, but the OS silently ignored the error",
      "The page was not yet mapped to physical RAM — the OS allocated a physical page, mapped it, and resumed the program (a soft/minor page fault)",
      "The CPU detected a hardware error in RAM and switched to a backup memory module",
      "The compiler generated incorrect addresses, and the OS fixed them at runtime",
    ],
    correctIndex: 1,
    explanation:
      "Modern operating systems use demand paging: virtual pages are not backed by physical RAM until first accessed. When a program touches an unmapped page, the CPU raises a page fault. The OS handles it by allocating a physical frame, updating the page table, and restarting the instruction. This is a 'soft' (or minor) page fault — completely normal and expected. A 'hard' (major) page fault occurs when the data must be read from disk (e.g., from swap). A segfault, by contrast, happens when the access is genuinely illegal.",
    link: "https://en.wikipedia.org/wiki/Page_fault",
  },
  {
    id: 112,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What does this code print?",
    code: "#define SQUARE(x) x * x\n\nint result = SQUARE(2 + 3);\nstd::cout << result;",
    options: [
      "25 — (2+3) squared",
      "11 — it expands to 2 + 3 * 2 + 3, and * binds tighter than +",
      "10 — the macro doubles the expression",
      "Compilation error — macros cannot perform arithmetic",
    ],
    correctIndex: 1,
    explanation:
      "The preprocessor performs textual substitution: SQUARE(2 + 3) becomes 2 + 3 * 2 + 3 (not (2+3) * (2+3)). Due to operator precedence, 3 * 2 is evaluated first, giving 2 + 6 + 3 = 11. Fixing this requires parenthesizing both the parameters and the whole expression: #define SQUARE(x) ((x) * (x)). But even then, macros suffer from double evaluation — SQUARE(i++) would increment i twice. This is why inline functions or constexpr functions are strictly preferred in C++.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-preprocessor/",
  },
  {
    id: 113,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A local int variable is declared but not initialized. Reading it is undefined behavior. Why is the result worse than just 'random garbage'?",
    code: "int x;\nif (x > 0) {\n    launchMissiles();\n}",
    options: [
      "The variable always reads as zero because the stack is zeroed on function entry",
      "The compiler may assume the variable has any value that makes the program 'work,' potentially optimizing away the branch entirely or always taking it",
      "The CPU traps on uninitialized memory reads and terminates the program",
      "The variable contains the address of the previous stack frame, which is a security risk but otherwise predictable",
    ],
    correctIndex: 1,
    explanation:
      "Since reading an uninitialized variable is UB, the compiler is free to assume it never happens. In practice, the compiler may optimize as if x has whatever value makes the branch statically decidable, or it may leave it as whatever happened to be in that stack slot. The key insight is that 'garbage' implies a definite (if unknown) value — but UB means the compiler can do anything, including optimizing the branch to always-taken or never-taken. Debug builds often zero the stack, masking this bug.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },
  {
    id: 114,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A CPU has a 5-stage instruction pipeline: Fetch, Decode, Execute, Memory, Writeback. If it takes 1 cycle per stage, how many cycles does it take to complete 100 instructions under ideal conditions (no stalls)?",
    options: [
      "500 cycles — 5 cycles per instruction",
      "104 cycles — 5 cycles to fill the pipeline, then 1 instruction completes per cycle",
      "100 cycles — the pipeline eliminates all overhead",
      "20 cycles — the pipeline processes 5 instructions simultaneously",
    ],
    correctIndex: 1,
    explanation:
      "Pipelining overlaps instruction execution. After the initial 5 cycles to fill the pipeline, one instruction completes every cycle. So 100 instructions take 5 + (100 - 1) = 104 cycles. Without pipelining, it would take 500 cycles. The throughput approaches 1 instruction per cycle as the number of instructions grows, but the latency per individual instruction is still 5 cycles. Pipeline stalls (from branches, data hazards, or cache misses) degrade this ideal throughput.",
    link: "https://en.wikipedia.org/wiki/Instruction_pipelining",
  },
  {
    id: 115,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "Where is the variable count stored in memory?",
    code: "void increment() {\n    static int count = 0;\n    count++;\n    std::cout << count << '\\n';\n}",
    options: [
      "On the stack, in increment()'s stack frame — but it persists between calls",
      "On the heap, allocated by the runtime when the function is first called",
      "In the data segment (or BSS), alongside global variables — it just has function-local scope",
      "In a CPU register, since it is accessed frequently",
    ],
    correctIndex: 2,
    explanation:
      "Static local variables have the lifetime of a global variable but the scope of a local variable. They are stored in the data segment (if initialized to a non-zero value) or BSS segment (if zero-initialized), the same place as global variables. The 'static' keyword here means 'static storage duration' — the variable is initialized once (thread-safely in C++11 and later) and persists for the entire program. It is NOT on the stack, which is why it survives between function calls.",
    link: "https://www.learncpp.com/cpp-tutorial/static-local-variables/",
  },
  {
    id: 116,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A C++ function compiled with one compiler crashes when called from code compiled with a different compiler. The bug is traced to a 'calling convention mismatch.' What does a calling convention specify?",
    options: [
      "The syntax for declaring functions in the source code",
      "How arguments are passed (registers vs stack), who cleans up the stack, and how the return value is delivered",
      "Which C++ standard version the function was compiled with",
      "The maximum number of parameters a function can accept",
    ],
    correctIndex: 1,
    explanation:
      "A calling convention is a low-level protocol for function calls. It specifies: (1) whether arguments go in registers or on the stack, and in what order; (2) whether the caller or callee restores the stack pointer; (3) which registers the callee must preserve; and (4) how the return value is passed back. Common conventions include cdecl (caller cleans stack), stdcall (callee cleans stack, used by Windows APIs), and the System V AMD64 ABI (first 6 integer args in registers). If caller and callee disagree, the stack becomes corrupted.",
    link: "https://en.wikipedia.org/wiki/Calling_convention",
  },
  {
    id: 117,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A long-running server allocates memory with new inside a request handler but never calls delete. The server processes millions of requests per day. What is the practical consequence?",
    options: [
      "No consequence — the OS automatically frees memory that hasn't been accessed recently",
      "The program's memory usage grows without bound until the OS kills it or the system runs out of memory",
      "The leaked memory is automatically reclaimed when the function returns",
      "The memory is leaked but the OS recovers it every few minutes via garbage collection",
    ],
    correctIndex: 1,
    explanation:
      "A memory leak occurs when heap-allocated memory becomes unreachable (no pointer to it) but is never freed. C++ has no garbage collector. The OS does NOT reclaim individual allocations from a running process. Over time, the leaked bytes accumulate. For a long-running server processing millions of requests, even small leaks (a few bytes per request) eventually exhaust available memory, causing the OS to kill the process (OOM killer on Linux) or the system to become unresponsive. The OS reclaims ALL of a process's memory only when the process terminates.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-and-move-semantics/",
  },
  {
    id: 118,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      'File engine.h uses a pointer to class Renderer but never accesses its members. Replacing #include "renderer.h" with a forward declaration class Renderer; compiles successfully. Why does this reduce compile time?',
    options: [
      "Forward declarations are cached by the compiler, while #include is not",
      "The compiler no longer needs to parse renderer.h (and all headers it transitively includes) when compiling files that include engine.h",
      "Forward declarations skip the linking step for that class",
      "Forward declarations make the class constexpr, which is faster to compile",
    ],
    correctIndex: 1,
    explanation:
      "When you #include a header, the preprocessor pastes its entire contents (and everything IT includes) into your translation unit. If renderer.h includes <string>, <vector>, and other headers, that is thousands of lines the compiler must parse. A forward declaration is a single line that tells the compiler 'this class exists' — enough for pointers and references, but not enough to access members or know the class's size. In large codebases, reducing transitive includes this way can dramatically speed up compilation.",
    link: "https://www.learncpp.com/cpp-tutorial/forward-declarations/",
  },

  // ── CS Fundamentals: Nuanced Hard (Q119–Q128) ──
  {
    id: 119,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "A programmer writes a check for signed integer overflow. Why might this check be completely removed by the compiler?",
    code: "int x = some_value();\nint y = x + 1;\nif (y < x) {\n    // overflow detected!\n    handle_overflow();\n}",
    options: [
      "The compiler detects that handle_overflow() has no side effects and removes dead code",
      "Since signed overflow is UB, the compiler assumes it never happens, concludes x + 1 > x is always true, and eliminates the 'impossible' branch entirely",
      "The if-check is optimized into a branchless conditional move, which appears removed but still executes",
      "The compiler inlines handle_overflow() into the main code path, so the branch disappears but the logic remains",
    ],
    correctIndex: 1,
    explanation:
      "Because signed integer overflow is undefined behavior, the compiler is permitted to assume it never occurs. Under this assumption, x + 1 is always greater than x, making the condition y < x always false. The optimizer removes the entire branch as dead code. This is not a bug in the compiler — it is a direct consequence of UB. To safely detect overflow, you must check BEFORE the operation (e.g., if x == INT_MAX) or use compiler builtins like __builtin_add_overflow.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },
  {
    id: 120,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "This loop runs significantly faster when the array is sorted versus unsorted, even though the same number of iterations and additions occur. Why?",
    code: "int sum = 0;\nfor (int i = 0; i < size; i++) {\n    if (data[i] >= 128)\n        sum += data[i];\n}",
    options: [
      "Sorting enables the compiler to use SIMD instructions on the contiguous qualifying elements",
      "When sorted, the branch pattern becomes predictable (all-false then all-true), so the CPU's branch predictor guesses correctly almost every time — unsorted data causes frequent mispredictions that flush the pipeline",
      "Sorted data has better cache locality because qualifying elements are adjacent",
      "The compiler detects the sorted order and replaces the loop with a binary search for the cutoff point",
    ],
    correctIndex: 1,
    explanation:
      "Modern CPUs speculatively execute instructions past branches before knowing the outcome. The branch predictor uses history to guess which way a branch will go. With sorted data, the if-condition is false for all values below 128, then true for all values above — a simple pattern the predictor learns. With unsorted data, the true/false pattern is essentially random, causing ~50% misprediction rate. Each misprediction flushes the pipeline (15–20 wasted cycles on modern CPUs). This is one of the most dramatic examples of how hardware microarchitecture affects algorithm performance.",
    link: "https://en.wikipedia.org/wiki/Branch_predictor",
  },
  {
    id: 121,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "A program accesses memory addresses scattered across many different virtual pages. Performance is poor even though the total data fits in the L2 cache. What is the most likely bottleneck?",
    options: [
      "L1 instruction cache misses from the scattered access pattern",
      "TLB misses — the Translation Lookaside Buffer cannot hold mappings for all the accessed pages, forcing repeated page table walks",
      "Branch mispredictions from the pointer-chasing access pattern",
      "Memory bandwidth saturation from too many concurrent requests",
    ],
    correctIndex: 1,
    explanation:
      "The TLB is a small cache (typically 64–1536 entries) that stores recent virtual-to-physical address translations. When a program accesses many different pages, TLB entries are evicted and must be reloaded by walking the page table — a process that takes 10–100+ cycles even when the page table is in cache. Unlike data cache misses (which depend on total data size), TLB misses depend on the number of DISTINCT PAGES touched. A program can have its data entirely in L2 cache but still suffer from TLB misses if that data is spread across more pages than the TLB can hold.",
    link: "https://en.wikipedia.org/wiki/Translation_lookaside_buffer",
  },
  {
    id: 122,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "A compiler completely removes a loop that computes a result which is never used. Under what principle is this legal?",
    code: "int result = 0;\nfor (int i = 0; i < 1000000; i++) {\n    result += i * i;\n}\n// result is never read after this point",
    options: [
      "The compiler detected dead code and is required by the standard to remove it",
      "The as-if rule: the compiler may transform the program in any way as long as the observable behavior (I/O, volatile accesses, atomic operations) is unchanged",
      "The optimizer has a time limit and skips code that takes too long to analyze",
      "Loop removal is only valid in -O3 mode and is technically non-conforming",
    ],
    correctIndex: 1,
    explanation:
      "The 'as-if' rule (C++ standard [intro.abstract]) states that a conforming compiler only needs to produce the same observable behavior as the abstract machine. Observable behavior is defined as: reads/writes to volatile objects, and I/O operations. Since this loop has no observable side effects (result is never used in I/O, it's not volatile, and the computation involves no UB), the compiler can legally remove it entirely. This same principle allows constant folding, function inlining, instruction reordering, and many other optimizations.",
    link: "https://en.cppreference.com/w/cpp/language/as_if.html",
  },
  {
    id: 123,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "This code reinterprets a float's bits as an int. Despite 'working' in practice, it violates a specific C++ rule. Which one?",
    code: "float f = 3.14f;\nint i = *(int*)&f;  // read float's bits as int",
    options: [
      "The One Definition Rule — float and int are defined in different headers",
      "The strict aliasing rule — accessing an object through a pointer to an unrelated type is undefined behavior",
      "The const-correctness rule — f is not declared const",
      "The sequence point rule — the cast and dereference are unsequenced",
    ],
    correctIndex: 1,
    explanation:
      "The strict aliasing rule (C++ standard [basic.lval]) states that you may only access an object through a pointer/reference of compatible type (same type, signed/unsigned variant, char/byte type, or base class). Casting a float* to int* and dereferencing creates two pointers of incompatible types aliasing the same memory. The compiler may assume they don't alias, leading to misoptimization. The safe alternatives are: memcpy into an int (which compilers optimize to zero overhead), or std::bit_cast<int>(f) in C++20.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast.html",
  },
  {
    id: 124,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "A CPU encounters a conditional branch whose outcome depends on a slow memory load. What does speculative execution allow the CPU to do?",
    options: [
      "Skip the branch entirely and execute both paths simultaneously using SIMD",
      "Begin executing instructions along the predicted branch path BEFORE the condition is resolved, discarding the work if the prediction was wrong",
      "Pause the pipeline and wait for the memory load to complete before proceeding",
      "Ask the OS to prefetch the data needed for the branch condition",
    ],
    correctIndex: 1,
    explanation:
      "Speculative execution allows the CPU to keep its pipeline full by guessing the branch outcome (using the branch predictor) and executing instructions along the predicted path. If the guess is correct, the speculatively computed results are committed normally — a significant performance win. If wrong, the CPU discards the speculative results and restarts from the branch point. This is essential for modern out-of-order CPUs, but it created the Spectre class of security vulnerabilities: speculatively executed instructions can leave observable traces in the cache that leak secret data.",
    link: "https://en.wikipedia.org/wiki/Speculative_execution",
  },
  {
    id: 125,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "These two structs have identical member TYPES but different sizes. Why?",
    code: "struct A { char a; double b; char c; };  // sizeof = 24\nstruct B { double b; char a; char c; };  // sizeof = 16",
    options: [
      "The compiler adds extra members to struct A for backwards compatibility",
      "struct A has more padding: char(1) + 7 pad + double(8) + char(1) + 7 pad = 24, while struct B groups the chars together: double(8) + char(1) + char(1) + 6 pad = 16",
      "struct B is optimized because its members are in alphabetical order",
      "struct A uses 64-bit alignment while struct B uses 32-bit alignment due to declaration order",
    ],
    correctIndex: 1,
    explanation:
      "Compilers insert padding to align each member to its natural boundary. In struct A: char a (1 byte) is followed by 7 bytes of padding so double b starts at offset 8. After double b (8 bytes at offset 8), char c sits at offset 16, followed by 7 bytes of trailing padding to make the struct size a multiple of its alignment (8). Total: 24 bytes. In struct B: double b (8 bytes) starts at offset 0, then both chars fit in the next 2 bytes, with only 6 bytes of trailing padding. Total: 16 bytes. Order members from largest to smallest alignment to minimize padding.",
    link: "https://en.cppreference.com/w/cpp/language/object.html",
  },
  {
    id: 126,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Calling strlen() (a library function) is orders of magnitude faster than calling write() (a system call) for a small string. What makes the system call so much more expensive?",
    options: [
      "write() must encrypt the data before sending it to the kernel",
      "A system call requires a transition from user mode to kernel mode: saving registers, switching privilege levels, executing the kernel handler, and returning — costing hundreds of cycles",
      "Library functions run on the GPU while system calls run on the CPU",
      "write() must allocate heap memory for the kernel buffer, while strlen() only uses the stack",
    ],
    correctIndex: 1,
    explanation:
      "A library function like strlen() executes entirely in user space — it's just a function call (a few cycles for the call, then the loop). A system call like write() requires a privilege transition: the CPU switches from user mode (ring 3) to kernel mode (ring 0) via a special instruction (syscall/sysenter on x86). This involves saving all user-space registers, validating parameters, executing the kernel code, then restoring registers and returning to user space. This context switch overhead is typically 100–1000+ cycles. This is why techniques like buffered I/O (stdio) batch many small writes into fewer system calls.",
    link: "https://en.wikipedia.org/wiki/System_call",
  },
  {
    id: 127,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Two threads update two DIFFERENT variables that happen to be adjacent in memory. Performance is far worse than expected despite no logical data sharing. What is happening?",
    code: "struct Counters {\n    int counterA;  // thread 1 writes this\n    int counterB;  // thread 2 writes this\n};",
    options: [
      "The compiler merged the two variables into one register, causing a data race",
      "False sharing: both variables reside on the same cache line, so each thread's write invalidates the other core's cached copy, causing constant cache coherency traffic",
      "The struct is too small for the allocator, so both threads contend on the allocator lock",
      "The OS schedules both threads on the same core to keep the data local, serializing their execution",
    ],
    correctIndex: 1,
    explanation:
      "CPU caches operate on cache lines (typically 64 bytes), not individual variables. When two variables share a cache line and are written by different cores, each write invalidates the line on the other core. The other core must reload the entire line before its next access. This 'ping-ponging' of cache lines between cores is called false sharing. It's 'false' because the threads aren't logically sharing data — they're only sharing a cache line by accident of memory layout. The fix is to pad the struct so each variable occupies its own cache line (alignas(64) or std::hardware_destructive_interference_size in C++17).",
    link: "https://en.wikipedia.org/wiki/False_sharing",
  },
  {
    id: 128,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Each time a program runs, its stack, heap, and library addresses are at different locations. This is Address Space Layout Randomization (ASLR). What class of attack does it mitigate?",
    options: [
      "SQL injection attacks that target the database through the program",
      "Return-Oriented Programming (ROP) and other exploits that rely on knowing the exact addresses of code or data in memory",
      "Denial-of-service attacks that exhaust memory by running many copies of the program",
      "Side-channel attacks that measure CPU cache timing",
    ],
    correctIndex: 1,
    explanation:
      "Many exploits (buffer overflows, return-to-libc, ROP chains) require the attacker to know the precise memory addresses of target functions or gadgets. Without ASLR, these addresses are the same every time the program runs, making exploitation reliable. ASLR randomizes the base addresses of the stack, heap, executable, and shared libraries on each run, so the attacker cannot predict where code and data reside. It does not prevent the initial vulnerability (e.g., a buffer overflow), but it makes exploitation significantly harder.",
    link: "https://en.wikipedia.org/wiki/Address_space_layout_randomization",
  },

  // ── STL Containers: Easy (Q129–Q145) ──
  {
    id: 129,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What does v.reserve(1000) do?",
    code: `std::vector<int> v;\nv.reserve(1000);`,
    options: [
      "Creates 1000 default-initialized integers in v",
      "Allocates memory for at least 1000 elements without changing v's size",
      "Sets v's size to 1000 and fills with zeros",
      "Limits v so it can never hold more than 1000 elements",
    ],
    correctIndex: 1,
    explanation:
      "reserve() pre-allocates storage so future push_back calls up to that capacity avoid reallocation. It does not change size() or add any elements. Use resize() if you want to actually create elements.",
    link: "https://en.cppreference.com/w/cpp/container/vector/reserve.html",
  },
  {
    id: 130,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "After pushing 5 elements into a default-constructed std::vector<int>, which statement is guaranteed?",
    options: [
      "size() == capacity()",
      "size() == 5 and capacity() >= 5",
      "capacity() == 5",
      "size() > capacity()",
    ],
    correctIndex: 1,
    explanation:
      "size() is always the number of elements actually stored. capacity() is the number of elements the vector can hold before reallocating. capacity() is always >= size(), but the exact capacity depends on the implementation's growth strategy.",
    link: "https://en.cppreference.com/w/cpp/container/vector.html",
  },
  {
    id: 131,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Which container adaptor implements LIFO (last-in, first-out) semantics?",
    options: ["std::queue", "std::stack", "std::priority_queue", "std::deque"],
    correctIndex: 1,
    explanation:
      "std::stack provides push(), pop(), and top() — all operating on the most recently added element. It is a container adaptor that wraps an underlying container (std::deque by default).",
    link: "https://en.cppreference.com/w/cpp/container/stack.html",
  },
  {
    id: 132,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What two guarantees does std::set provide about its elements?",
    options: [
      "Contiguous memory and constant-time lookup",
      "Sorted order and uniqueness (no duplicates)",
      "Insertion order preservation and O(1) access",
      "Thread safety and sorted order",
    ],
    correctIndex: 1,
    explanation:
      "std::set uses a balanced BST (typically red-black tree) to keep elements in sorted order and rejects duplicate insertions. Both insert and find are O(log n).",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 133,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Which container adaptor should you use for a FIFO (first-in, first-out) queue?",
    options: ["std::stack", "std::queue", "std::priority_queue", "std::vector"],
    correctIndex: 1,
    explanation:
      "std::queue provides push() (add to back) and pop()/front() (remove from front), implementing classic FIFO semantics. It wraps std::deque by default.",
    link: "https://en.cppreference.com/w/cpp/container/queue.html",
  },
  {
    id: 134,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the key difference between v.at(i) and v[i] for std::vector?",
    options: [
      "at() is faster because it skips bounds checking",
      "at() throws std::out_of_range if i >= size(); operator[] has undefined behavior",
      "operator[] returns a copy; at() returns a reference",
      "There is no difference — they are aliases",
    ],
    correctIndex: 1,
    explanation:
      "at() performs bounds checking and throws an exception on out-of-range access. operator[] provides no check for performance reasons — accessing an invalid index is undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/container/vector/at.html",
  },
  {
    id: 135,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is std::forward_list, and how does it differ from std::list?",
    options: [
      "forward_list is doubly-linked; list is singly-linked",
      "forward_list is singly-linked (one pointer per node); list is doubly-linked (two pointers per node)",
      "forward_list stores elements contiguously; list does not",
      "forward_list supports random access; list does not",
    ],
    correctIndex: 1,
    explanation:
      "std::forward_list uses one pointer per node (next only), saving memory compared to std::list's two pointers (next and prev). The trade-off is that forward_list can only iterate forward and lacks size(), push_back(), and reverse iteration.",
    link: "https://en.cppreference.com/w/cpp/container/forward_list.html",
  },
  {
    id: 136,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "You insert the values 3, 1, 3, 2, 3 into a std::set<int>. What does the set contain?",
    options: [
      "{3, 1, 3, 2, 3} — insertion order preserved",
      "{1, 2, 3} — sorted and deduplicated",
      "{3, 1, 2} — only the first occurrence of each value",
      "{1, 2, 3, 3, 3} — sorted but not deduplicated",
    ],
    correctIndex: 1,
    explanation:
      "std::set stores only unique elements in sorted order. Duplicate insertions are silently ignored (insert returns a pair where the bool is false for duplicates). Use std::multiset if you need to allow duplicates.",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 137,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "After calling v.clear(), what is true about v?",
    code: `std::vector<int> v = {1, 2, 3, 4, 5};\nv.clear();`,
    options: [
      "v.size() == 0 and v.capacity() == 0",
      "v.size() == 0 but v.capacity() is unchanged (still >= 5)",
      "v.size() == 5 but all elements are zeroed",
      "v is in an unspecified state and cannot be used",
    ],
    correctIndex: 1,
    explanation:
      "clear() destroys all elements and sets size to 0, but does NOT release the allocated memory. The capacity remains at least as large as before. Use shrink_to_fit() after clear() if you want to release memory.",
    link: "https://en.cppreference.com/w/cpp/container/vector/clear.html",
  },
  {
    id: 138,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "Which STL container stores key-value pairs sorted by key and provides O(log n) lookup?",
    options: [
      "std::unordered_map",
      "std::map",
      "std::vector<std::pair>",
      "std::set",
    ],
    correctIndex: 1,
    explanation:
      "std::map is an ordered associative container backed by a balanced BST. Keys are always sorted, and lookup, insertion, and deletion are O(log n). std::unordered_map is O(1) average but does not maintain order.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 139,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the default underlying container of std::priority_queue?",
    options: [
      "std::list",
      "std::deque",
      "std::vector",
      "std::set",
    ],
    correctIndex: 2,
    explanation:
      "std::priority_queue uses std::vector by default as its underlying container. It organizes elements as a max-heap using std::make_heap, std::push_heap, and std::pop_heap internally.",
    link: "https://en.cppreference.com/w/cpp/container/priority_queue.html",
  },
  {
    id: 140,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the time complexity of std::set::find()?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 1,
    explanation:
      "std::set is backed by a balanced BST, so find() performs a binary search through the tree in O(log n) time. For O(1) average lookup, use std::unordered_set.",
    link: "https://en.cppreference.com/w/cpp/container/set/find.html",
  },
  {
    id: 141,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the default underlying container of std::stack?",
    options: ["std::vector", "std::list", "std::deque", "std::array"],
    correctIndex: 2,
    explanation:
      "std::stack uses std::deque by default. You can change this with the second template parameter: std::stack<int, std::vector<int>>. Any container supporting back(), push_back(), and pop_back() can be used.",
    link: "https://en.cppreference.com/w/cpp/container/stack.html",
  },
  {
    id: 142,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Can you iterate over all elements of a std::stack using a range-based for loop?",
    options: [
      "Yes — std::stack provides begin() and end() iterators",
      "No — std::stack only exposes top(), push(), and pop() — no iterators",
      "Yes — but only in reverse order (bottom to top)",
      "Yes — by calling stack::data() to get the underlying array",
    ],
    correctIndex: 1,
    explanation:
      "Container adaptors (std::stack, std::queue, std::priority_queue) intentionally hide the underlying container's interface. They expose only the operations appropriate for their abstraction. If you need iteration, use the underlying container directly.",
    link: "https://en.cppreference.com/w/cpp/container/stack.html",
  },
  {
    id: 143,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is std::span (C++20)?",
    code: `void process(std::span<int> data) {\n    for (int x : data) { /* ... */ }\n}`,
    options: [
      "A container that dynamically allocates a contiguous array",
      "A non-owning view over a contiguous sequence of elements (like a pointer + size)",
      "A replacement for std::vector with better performance",
      "A thread-safe wrapper around std::array",
    ],
    correctIndex: 1,
    explanation:
      "std::span is a lightweight, non-owning reference to a contiguous sequence of objects. It can be created from a std::vector, std::array, C array, or any contiguous range. It does not own or allocate memory.",
    link: "https://en.cppreference.com/w/cpp/container/span.html",
  },
  {
    id: 144,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What does v.front() return on a non-empty vector?",
    options: [
      "An iterator to the first element",
      "A reference to the first element",
      "A copy of the first element",
      "The index of the first element (always 0)",
    ],
    correctIndex: 1,
    explanation:
      "front() returns a reference to the first element, allowing both reading and modification. Calling front() on an empty vector is undefined behavior. Similarly, back() returns a reference to the last element.",
    link: "https://en.cppreference.com/w/cpp/container/vector/front.html",
  },
  {
    id: 145,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Does std::unordered_set maintain any particular order of its elements?",
    options: [
      "Yes — elements are sorted in ascending order",
      "Yes — elements are kept in insertion order",
      "No — the order depends on the hash function and may change after insertions",
      "Yes — elements are sorted by their hash values",
    ],
    correctIndex: 2,
    explanation:
      "std::unordered_set uses a hash table internally. Element order depends on hash values and bucket arrangement, and can change when rehashing occurs (e.g., after insertions that exceed the load factor).",
    link: "https://en.cppreference.com/w/cpp/container/unordered_set.html",
  },

  // ── STL Containers: Medium (Q146–Q164) ──
  {
    id: 146,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "When should you prefer std::set over std::unordered_set?",
    options: [
      "When you need O(1) average lookup",
      "When you need elements in sorted order or need to perform range queries",
      "When you want the fastest possible insertion",
      "When elements do not support the < operator",
    ],
    correctIndex: 1,
    explanation:
      "std::set maintains sorted order, enabling operations like lower_bound(), upper_bound(), and range iteration. std::unordered_set offers O(1) average lookup but no ordering. Choose set when order matters; unordered_set when it doesn't and speed is critical.",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 147,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What happens when you insert a key that already exists in std::map?",
    code: `std::map<std::string, int> m;\nm.insert({"key", 1});\nm.insert({"key", 2});\nstd::cout << m["key"];`,
    options: [
      "Prints 2 — the second insert overwrites the first",
      "Prints 1 — insert does not overwrite existing keys",
      "Prints 0 — duplicate keys cause the value to be zeroed",
      "Compilation error — duplicate keys are not allowed",
    ],
    correctIndex: 1,
    explanation:
      "std::map::insert() is a no-op when the key already exists — it returns an iterator to the existing element and false. Use insert_or_assign() (C++17) or operator[] to overwrite existing values.",
    link: "https://en.cppreference.com/w/cpp/container/map/insert.html",
  },
  {
    id: 148,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What does std::map::operator[] do when accessed with a key that does not exist?",
    code: `std::map<std::string, int> m;\nstd::cout << m["missing"];`,
    options: [
      "Throws std::out_of_range",
      "Returns a default value without modifying the map",
      "Inserts a new element with a value-initialized (zero) value and returns a reference to it",
      "Returns an iterator to end()",
    ],
    correctIndex: 2,
    explanation:
      "operator[] inserts a default-constructed value if the key is absent. This is why it cannot be used on a const map. Use find() or at() (which throws) if you don't want unintended insertion.",
    link: "https://en.cppreference.com/w/cpp/container/map/operator_at.html",
  },
  {
    id: 149,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "You need a key-value store with frequent lookups but don't care about key order. Which container is generally faster?",
    options: [
      "std::map — balanced tree is always faster than hashing",
      "std::unordered_map — O(1) average lookup vs std::map's O(log n)",
      "std::vector<std::pair<K,V>> — linear search is simpler and cache-friendly",
      "std::set<std::pair<K,V>> — it avoids value storage overhead",
    ],
    correctIndex: 1,
    explanation:
      "std::unordered_map uses a hash table for O(1) average-case lookup, insertion, and deletion. std::map uses a balanced BST for O(log n). When key ordering is unnecessary, unordered_map is typically the faster choice.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 150,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the time complexity of inserting an element at the beginning of a std::vector with 10,000 elements?",
    code: `v.insert(v.begin(), 42);`,
    options: [
      "O(1) — same as push_back",
      "O(n) — all existing elements must be shifted right by one position",
      "O(log n) — the vector uses binary search to find the insertion point",
      "O(1) amortized — the vector reserves extra space at the front",
    ],
    correctIndex: 1,
    explanation:
      "Inserting at the front of a vector requires shifting all n existing elements one position to the right. This is O(n). If you need frequent front insertions, use std::deque which supports O(1) push_front().",
    link: "https://en.cppreference.com/w/cpp/container/vector/insert.html",
  },
  {
    id: 151,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What does v.shrink_to_fit() do?",
    code: `std::vector<int> v = {1, 2, 3};\nv.reserve(1000);\nv.shrink_to_fit();`,
    options: [
      "Guarantees that capacity() == size()",
      "Requests the vector to reduce capacity() to match size() — but the request is non-binding",
      "Deletes elements to fit within the current capacity",
      "Does nothing — it is a deprecated no-op",
    ],
    correctIndex: 1,
    explanation:
      "shrink_to_fit() is a non-binding request to reduce capacity to size. The implementation may ignore it. In practice, most implementations do honor the request by reallocating to a smaller buffer.",
    link: "https://en.cppreference.com/w/cpp/container/vector/shrink_to_fit.html",
  },
  {
    id: 152,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "How does std::multimap differ from std::map?",
    options: [
      "multimap uses a hash table instead of a tree",
      "multimap allows multiple entries with the same key",
      "multimap stores values but not keys",
      "multimap does not maintain sorted order",
    ],
    correctIndex: 1,
    explanation:
      "std::multimap allows duplicate keys — multiple key-value pairs can share the same key. It still maintains sorted order by key. Use equal_range() to get all entries for a given key.",
    link: "https://en.cppreference.com/w/cpp/container/multimap.html",
  },
  {
    id: 153,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "By default, std::priority_queue<int> gives you which element first via top()?",
    options: [
      "The smallest (minimum) element",
      "The largest (maximum) element",
      "The most recently pushed element",
      "The least recently pushed element",
    ],
    correctIndex: 1,
    explanation:
      "std::priority_queue uses std::less<T> by default, creating a max-heap. top() returns the largest element. For a min-heap, use std::priority_queue<int, std::vector<int>, std::greater<int>>.",
    link: "https://en.cppreference.com/w/cpp/container/priority_queue.html",
  },
  {
    id: 154,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What makes std::list::splice() unique compared to inserting elements into other containers?",
    options: [
      "It is the only O(n log n) insertion operation in the STL",
      "It transfers nodes from one list to another without copying or moving elements — just pointer reassignment",
      "It inserts elements sorted automatically",
      "It works across different container types",
    ],
    correctIndex: 1,
    explanation:
      "splice() moves list nodes by relinking internal pointers — no element copy/move constructors are called. This is O(1) for single elements or an entire list, and is exclusive to node-based containers.",
    link: "https://en.cppreference.com/w/cpp/container/list/splice.html",
  },
  {
    id: 155,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What happens to iterators when an std::unordered_map rehashes (e.g., after many insertions)?",
    options: [
      "Iterators remain valid — rehashing is transparent",
      "All iterators are invalidated, but references and pointers to elements remain valid",
      "Both iterators and references are invalidated",
      "Only iterators to the newly inserted element are invalidated",
    ],
    correctIndex: 1,
    explanation:
      "Rehashing rearranges which bucket each element lives in, invalidating iterators. However, the elements themselves are not moved in memory, so references and pointers to values remain valid.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 156,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the key behavioral difference between map::insert({k, v}) and map[k] = v?",
    options: [
      "insert is O(n); operator[] is O(log n)",
      "insert does not overwrite an existing key; operator[] always overwrites",
      "insert returns void; operator[] returns a bool",
      "insert requires the key to exist; operator[] creates it if missing",
    ],
    correctIndex: 1,
    explanation:
      "insert() leaves existing entries untouched (no-op on duplicate key). operator[] inserts a default value if the key is missing, then assigns. So m[k] = v always sets the value, while insert only sets it if the key is new.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 157,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What does v.data() return?",
    code: `std::vector<int> v = {10, 20, 30};`,
    options: [
      "An iterator to the first element",
      "A pointer to the underlying contiguous array of elements",
      "A copy of the internal data as a std::array",
      "The total memory used by the vector in bytes",
    ],
    correctIndex: 1,
    explanation:
      "data() returns a raw pointer to the first element of the internal contiguous array. This is useful for interoperating with C APIs that expect a pointer. The pointer is valid as long as the vector is not reallocated.",
    link: "https://en.cppreference.com/w/cpp/container/vector/data.html",
  },
  {
    id: 158,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "How do you create a std::set that stores integers in descending order?",
    options: [
      "std::set<int, std::greater<int>>",
      "std::set<int, std::less<int>>",
      "std::set<int>(std::greater<int>())",
      "std::reverse_set<int>",
    ],
    correctIndex: 0,
    explanation:
      "The second template parameter of std::set is the comparator. std::greater<int> reverses the default std::less<int> ordering, producing descending order. The same technique works for std::map, std::priority_queue, etc.",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 159,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "Before C++20, checking if a key exists in a std::map required m.find(key) != m.end() or m.count(key). What does C++20 add?",
    options: [
      "m.has(key)",
      "m.contains(key)",
      "m.exists(key)",
      "m.check(key)",
    ],
    correctIndex: 1,
    explanation:
      "C++20 added contains() to all associative and unordered associative containers. It returns a bool directly, making code clearer than the find/end idiom. contains() does not insert or modify the container.",
    link: "https://en.cppreference.com/w/cpp/container/map/contains.html",
  },
  {
    id: 160,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What does std::list provide that std::forward_list does not?",
    options: [
      "O(1) push_front",
      "Bidirectional iteration, push_back(), and an O(1) size() function",
      "Contiguous memory storage",
      "Random access via operator[]",
    ],
    correctIndex: 1,
    explanation:
      "std::list is doubly-linked, supporting iteration in both directions, push_back(), and constant-time size() (since C++11). std::forward_list is singly-linked and omits these to minimize per-node memory overhead.",
    link: "https://en.cppreference.com/w/cpp/container/list.html",
  },
  {
    id: 161,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "When two different keys hash to the same bucket in std::unordered_map, how are they stored?",
    options: [
      "The second key replaces the first",
      "They are stored in a linked list (or similar structure) within that bucket — this is called chaining",
      "The map throws std::runtime_error",
      "The second key is placed in the next empty bucket (open addressing)",
    ],
    correctIndex: 1,
    explanation:
      "The C++ standard requires that std::unordered_map use chaining (also called separate chaining) for collision resolution. Each bucket contains a linked list of elements. This is why iterators to existing elements remain valid after insertions (unless rehashing occurs).",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 162,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What advantage does map::try_emplace(key, args...) (C++17) have over map::emplace(key, args...)?",
    options: [
      "try_emplace is always faster due to reduced comparisons",
      "try_emplace does not move-from or construct the value arguments if the key already exists",
      "try_emplace allows multiple values per key",
      "try_emplace returns void instead of a pair",
    ],
    correctIndex: 1,
    explanation:
      "With emplace(), the value arguments may be moved-from even if the insertion fails (key exists). try_emplace guarantees that args... are untouched if the key is already present. This matters when the value is expensive to construct or when args are move-only.",
    link: "https://en.cppreference.com/w/cpp/container/map/try_emplace.html",
  },
  {
    id: 163,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the time complexity of inserting an element in the middle of a std::vector of n elements?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n) — all elements after the insertion point must be shifted",
      "O(n log n)",
    ],
    correctIndex: 2,
    explanation:
      "Inserting in the middle requires shifting all subsequent elements one position to make room. On average, this involves moving n/2 elements, which is O(n). For frequent middle insertions, consider std::list (O(1) insert at a known position).",
    link: "https://en.cppreference.com/w/cpp/container/vector/insert.html",
  },
  {
    id: 164,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "How does std::multiset differ from std::set?",
    options: [
      "multiset uses a hash table instead of a tree",
      "multiset allows multiple elements with the same value",
      "multiset does not keep elements sorted",
      "multiset only works with integer types",
    ],
    correctIndex: 1,
    explanation:
      "std::multiset allows duplicate elements while still maintaining sorted order. Use count() to see how many copies of a value exist, or equal_range() to get iterators to all matching elements.",
    link: "https://en.cppreference.com/w/cpp/container/multiset.html",
  },

  // ── STL Containers: Hard (Q165–Q178) ──
  {
    id: 165,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "What does std::map::extract(key) (C++17) return, and why is it useful?",
    options: [
      "A copy of the value — useful for safely reading and removing in one step",
      "A node handle that owns the extracted element — you can modify the key and reinsert without allocation",
      "An iterator to the next element after the removed one",
      "A std::optional containing the value, or std::nullopt if the key was not found",
    ],
    correctIndex: 1,
    explanation:
      "extract() unlinks a node from the map and returns a node_handle. You can modify the node's key (normally impossible) and reinsert it into the same or another map. No memory allocation or deallocation occurs during the entire process.",
    link: "https://en.cppreference.com/w/cpp/container/map/extract.html",
  },
  {
    id: 166,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "To use a custom type as a key in std::unordered_map, what must you provide?",
    options: [
      "Only operator< for the type",
      "A hash function and an equality operator (operator==) for the type",
      "A comparison function and a swap function",
      "Only a conversion to std::string",
    ],
    correctIndex: 1,
    explanation:
      "std::unordered_map needs a hash function to assign keys to buckets and operator== to handle collisions (determine if two keys in the same bucket are actually equal). You can provide the hash as a template argument or specialize std::hash<T>.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 167,
    difficulty: "Hard",
    topic: "STL Containers",
    question: "Why is std::vector<bool> considered problematic?",
    options: [
      "It does not support push_back() like other vector specializations",
      "It is not a true container — it packs bits and returns proxy objects instead of bool&, breaking generic code",
      "It uses more memory than std::bitset for the same number of booleans",
      "It cannot be resized after construction",
    ],
    correctIndex: 1,
    explanation:
      "std::vector<bool> is a space-optimized specialization that stores one bit per element. Because you can't have a reference to a single bit, operator[] returns a proxy object instead of bool&. This breaks code that expects &v[0] to work or takes references to elements. Prefer std::vector<char> or std::bitset if this matters.",
    link: "https://en.cppreference.com/w/cpp/container/vector_bool.html",
  },
  {
    id: 168,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "In std::unordered_map, two distinct keys end up in the same bucket. How are they distinguished?",
    options: [
      "By comparing their hash values — each key has a unique hash",
      "By calling operator== on the keys — hash collisions mean different keys share a bucket, and equality checks distinguish them",
      "By their insertion order within the bucket",
      "They cannot be distinguished — the second key overwrites the first",
    ],
    correctIndex: 1,
    explanation:
      "A hash collision means two different keys produce the same bucket index. The container traverses the bucket's chain and calls operator== to find the exact key. This is why both a hash function and an equality comparison are required for unordered containers.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 169,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "std::vector::push_back() occasionally triggers a full reallocation. What is its amortized time complexity, and why?",
    options: [
      "O(n) amortized — each push_back copies all elements",
      "O(1) amortized — geometric growth (e.g., doubling) ensures that the average cost per push_back is constant over a sequence of operations",
      "O(log n) amortized — the growth factor is logarithmic",
      "O(1) worst-case — modern allocators guarantee in-place extension",
    ],
    correctIndex: 1,
    explanation:
      "Vectors grow by a constant factor (typically 1.5x or 2x). A reallocation that copies n elements is expensive, but it happens after n insertions since the last reallocation. Spreading the O(n) cost over those n operations gives O(1) per push_back on average.",
    link: "https://en.cppreference.com/w/cpp/container/vector/push_back.html",
  },
  {
    id: 170,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "What does the load factor of an std::unordered_map represent, and what happens when it exceeds max_load_factor()?",
    options: [
      "The ratio of memory used to memory allocated — exceeding it triggers compaction",
      "The ratio of element count to bucket count — exceeding it triggers rehashing, which increases the number of buckets",
      "The number of hash collisions per bucket — exceeding it switches to open addressing",
      "The percentage of empty buckets — exceeding it triggers garbage collection of removed nodes",
    ],
    correctIndex: 1,
    explanation:
      "load_factor() = size() / bucket_count(). When it exceeds max_load_factor() (default 1.0), the container automatically rehashes — allocating more buckets and redistributing elements. This keeps average chain length short, maintaining O(1) average lookup.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map/load_factor.html",
  },
  {
    id: 171,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "Short strings in most std::string implementations avoid heap allocation entirely. What is this optimization called?",
    options: [
      "String interning — short strings share a global pool",
      "Small String Optimization (SSO) — the string object stores short strings inline in its own memory (e.g., in the space normally used for pointer, size, and capacity)",
      "Copy-on-write (COW) — short strings are never copied",
      "Compile-time string evaluation — short literals are constexpr by default",
    ],
    correctIndex: 1,
    explanation:
      "SSO uses the bytes of the string object itself (typically 16–32 bytes depending on implementation) to store short strings without any heap allocation. Only when the string exceeds this internal buffer does the implementation allocate on the heap. This is a major performance win since most strings in practice are short.",
    link: "https://en.cppreference.com/w/cpp/string/basic_string.html",
  },
  {
    id: 172,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "In which scenario is std::deque a better choice than std::vector?",
    options: [
      "When you need guaranteed contiguous memory for C API interop",
      "When you frequently insert and remove elements at both the front and back",
      "When you need random access to be faster than O(1)",
      "When you need iterators that are never invalidated",
    ],
    correctIndex: 1,
    explanation:
      "std::deque supports O(1) push_front() and push_back() without invalidating references to existing elements (unless inserting in the middle). std::vector only has O(1) push_back(). However, deque lacks contiguous memory, so it cannot be passed to C APIs expecting a pointer.",
    link: "https://en.cppreference.com/w/cpp/container/deque.html",
  },
  {
    id: 173,
    difficulty: "Hard",
    topic: "STL Containers",
    question: "What does a.merge(b) do for two std::maps? (C++17)",
    code: `std::map<int,std::string> a = {{1,"one"}, {3,"three"}};\nstd::map<int,std::string> b = {{2,"two"}, {3,"THREE"}};\na.merge(b);`,
    options: [
      "a gets all elements from b; b becomes empty",
      "Nodes from b whose keys don't exist in a are transferred to a; conflicting keys stay in b",
      "b is appended to a, creating duplicate keys",
      "Both maps are cleared and a new merged map is returned",
    ],
    correctIndex: 1,
    explanation:
      "merge() moves nodes (not elements) from b into a. If a key already exists in a, that node stays in b. After the merge, a = {{1,\"one\"}, {2,\"two\"}, {3,\"three\"}} and b = {{3,\"THREE\"}}. No copying, moving, or allocation occurs — only internal pointer relinking.",
    link: "https://en.cppreference.com/w/cpp/container/map/merge.html",
  },
  {
    id: 174,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "Why is iterating over a std::unordered_map with 10,000 elements typically slower than iterating over a std::vector of the same 10,000 elements?",
    options: [
      "unordered_map iterators are more complex objects that require more CPU instructions per increment",
      "unordered_map nodes are scattered across the heap, causing frequent cache misses — vector elements are contiguous and cache-friendly",
      "unordered_map must rehash each element during iteration to verify bucket placement",
      "unordered_map iteration is O(n log n) while vector iteration is O(n)",
    ],
    correctIndex: 1,
    explanation:
      "std::unordered_map is a node-based container — each element is a separately heap-allocated node. Iterating jumps between random memory locations, causing CPU cache misses. std::vector stores elements contiguously, so prefetching fills cache lines efficiently. Both are O(n), but the constant factor differs dramatically.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 175,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "How do you safely erase elements from a std::map while iterating over it?",
    code: `std::map<int,int> m = {{1,10},{2,20},{3,30},{4,40}};\nfor (auto it = m.begin(); it != m.end(); ) {\n    if (it->second > 15)\n        it = m.erase(it);\n    else\n        ++it;\n}`,
    options: [
      "This code has undefined behavior — you cannot erase during iteration",
      "This is correct — erase returns an iterator to the next element, so no iterator is invalidated",
      "You must use std::remove_if before erasing",
      "You must iterate in reverse to safely erase",
    ],
    correctIndex: 1,
    explanation:
      "For associative containers (map, set, etc.), erase() invalidates only the erased iterator. It returns an iterator to the next element (since C++11). The pattern shown — using the return value of erase() — is the idiomatic safe approach.",
    link: "https://en.cppreference.com/w/cpp/container/map/erase.html",
  },
  {
    id: 176,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "std::set::insert() returns a std::pair<iterator, bool>. Why does it return a pair instead of just an iterator?",
    options: [
      "The bool indicates whether the container was reallocated",
      "The bool indicates whether the insertion actually occurred — false means the element was already present",
      "The iterator is to the previous element; the bool indicates if the set was empty",
      "The pair format is a legacy design that cannot be changed due to ABI compatibility",
    ],
    correctIndex: 1,
    explanation:
      "Since std::set rejects duplicates, you need to know whether a new element was actually added (true) or the value already existed (false). The iterator always points to the element with that value, whether newly inserted or previously existing.",
    link: "https://en.cppreference.com/w/cpp/container/set/insert.html",
  },
  {
    id: 177,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "What happens to pointers and references to elements of a std::map when other elements are inserted or erased?",
    options: [
      "They are invalidated — the tree may rebalance and move nodes",
      "They remain valid — node-based containers do not move elements in memory during insertion or erasure of other nodes",
      "Only references are invalidated; pointers remain valid",
      "They are valid only if the map has fewer than 1024 elements",
    ],
    correctIndex: 1,
    explanation:
      "std::map (and all node-based containers like set, list, unordered_map) allocate each element in its own node. Inserting or erasing other elements relinks pointers between nodes but never moves existing nodes in memory. This is a key advantage over contiguous containers like std::vector.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 178,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "The C++ standard guarantees that std::vector elements are stored contiguously. What important consequence does this have?",
    options: [
      "Elements cannot be polymorphic (no virtual dispatch through vector elements)",
      "Pointer arithmetic on vector elements is valid: &v[0] + n == &v[n], and &v[0] can be passed to any C function expecting an array",
      "The vector can never grow beyond the initially allocated capacity",
      "Elements must be trivially copyable",
    ],
    correctIndex: 1,
    explanation:
      "The contiguity guarantee means &v[0] gives you a pointer to a true C-style array. You can pass it to C APIs like memcpy, fwrite, or any function expecting a pointer and size. This is the reason v.data() exists and why vector is the default container for interoperating with C code.",
    link: "https://en.cppreference.com/w/cpp/container/vector.html",
  },

  // ── Operating Systems: Easy (Q179–Q191) ──
  {
    id: 179,
    difficulty: "Easy",
    topic: "Operating Systems",
    question: "What is a process?",
    options: [
      "A program stored on disk",
      "A running instance of a program, with its own address space and resources",
      "A single thread of execution inside the kernel",
      "A function call that has not yet returned",
    ],
    correctIndex: 1,
    explanation:
      "A process is an instance of a program in execution. The OS gives each process its own virtual address space, file descriptor table, and other resources. A program on disk is just a file; it becomes a process when loaded and executed.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf",
  },
  {
    id: 180,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is the key difference between a process and a thread?",
    options: [
      "Threads are faster than processes in every case",
      "Threads within the same process share the same address space; processes do not",
      "A process can only have one thread",
      "Threads do not have their own stack",
    ],
    correctIndex: 1,
    explanation:
      "Threads share the same virtual address space (heap, global variables, code) within a process, but each thread has its own stack and register state. Processes have completely separate address spaces, so one process cannot directly access another's memory.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf",
  },
  {
    id: 181,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "On a POSIX system, which file descriptors are automatically open when a process starts?",
    options: [
      "0 (stdin) only",
      "0 (stdin), 1 (stdout), 2 (stderr)",
      "1 (stdout) and 2 (stderr) only",
      "None — the program must open all file descriptors explicitly",
    ],
    correctIndex: 1,
    explanation:
      "By convention, every POSIX process inherits three open file descriptors: 0 for standard input, 1 for standard output, and 2 for standard error. These are set up by the parent process (usually the shell) before exec.",
    link: "https://man7.org/linux/man-pages/man3/stdin.3.html",
  },
  {
    id: 182,
    difficulty: "Easy",
    topic: "Operating Systems",
    question: "What is a system call?",
    options: [
      "A function call between two user-space libraries",
      "A request from a user-space program to the kernel to perform a privileged operation",
      "A call to main() that starts a program",
      "An interrupt generated by the CPU when it detects an error",
    ],
    correctIndex: 1,
    explanation:
      "A system call is the mechanism by which user-space programs request services from the OS kernel — such as reading files, allocating memory, or creating processes. It involves a controlled transition from user mode to kernel mode.",
    link: "https://man7.org/linux/man-pages/man2/syscalls.2.html",
  },
  {
    id: 183,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is the difference between SIGTERM and SIGKILL?",
    options: [
      "SIGTERM terminates immediately; SIGKILL can be caught",
      "SIGTERM can be caught and handled; SIGKILL cannot be caught and terminates the process unconditionally",
      "They are identical — both kill the process immediately",
      "SIGKILL is sent only by the kernel; SIGTERM is sent only by the user",
    ],
    correctIndex: 1,
    explanation:
      "SIGTERM (signal 15) asks a process to terminate gracefully — the process can catch it, clean up resources, and exit. SIGKILL (signal 9) cannot be caught or ignored; the kernel terminates the process immediately. This is why you should try SIGTERM before resorting to SIGKILL.",
    link: "https://man7.org/linux/man-pages/man7/signal.7.html",
  },
  {
    id: 184,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is a zombie process?",
    options: [
      "A process that consumes 100% of CPU time",
      "A process that has finished executing but whose exit status has not been collected by its parent",
      "A process that has been killed by SIGKILL",
      "A process running in the background with no terminal",
    ],
    correctIndex: 1,
    explanation:
      "When a process exits, its entry remains in the process table until the parent calls wait() to retrieve its exit status. During this time it is a 'zombie' — it uses no CPU or memory but occupies a PID. If the parent never calls wait(), zombies accumulate.",
    link: "https://man7.org/linux/man-pages/man2/waitpid.2.html",
  },
  {
    id: 185,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What does fork() return to the child process?",
    options: [
      "The parent's PID",
      "0",
      "The child's own PID",
      "-1",
    ],
    correctIndex: 1,
    explanation:
      "fork() creates a new child process that is a copy of the parent. It returns the child's PID to the parent and 0 to the child. This lets both processes determine which role they play. On failure, fork() returns -1 to the parent.",
    link: "https://man7.org/linux/man-pages/man2/fork.2.html",
  },
  {
    id: 186,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is the purpose of the exec() family of system calls?",
    options: [
      "To create a new child process",
      "To replace the current process image with a new program",
      "To terminate the current process",
      "To duplicate a file descriptor",
    ],
    correctIndex: 1,
    explanation:
      "exec() replaces the calling process's code, data, and stack with a new program loaded from disk. The PID remains the same. The common pattern is fork() to create a child, then exec() in the child to run a different program — this is how shells launch commands.",
    link: "https://man7.org/linux/man-pages/man3/exec.3.html",
  },
  {
    id: 187,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is a pipe in the context of inter-process communication?",
    options: [
      "A shared file on disk that two processes read and write",
      "A unidirectional byte stream connecting the stdout of one process to the stdin of another",
      "A network socket that connects two processes on different machines",
      "A block of shared memory mapped into two processes",
    ],
    correctIndex: 1,
    explanation:
      "A pipe is a kernel-managed buffer that provides a one-way byte stream between two processes. The shell's '|' operator creates a pipe connecting one command's stdout to the next command's stdin. For bidirectional communication, you need two pipes or a socket.",
    link: "https://man7.org/linux/man-pages/man2/pipe.2.html",
  },
  {
    id: 188,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is preemptive multitasking?",
    options: [
      "The OS allows each process to run until it voluntarily yields the CPU",
      "The OS can forcibly interrupt a running process to schedule another, using a timer interrupt",
      "Multiple processes run simultaneously on a single core",
      "The programmer manually switches between tasks using coroutines",
    ],
    correctIndex: 1,
    explanation:
      "In preemptive multitasking, the OS uses a hardware timer interrupt to periodically regain control of the CPU and decide which process to run next. This prevents any single process from monopolizing the CPU. All modern general-purpose OSes use preemptive scheduling.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf",
  },
  {
    id: 189,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is a context switch?",
    options: [
      "Switching from one source file to another during compilation",
      "The OS saving the state of the current process/thread and restoring the state of another so it can run",
      "A CPU switching from one cache level to another",
      "A function call pushing a new frame onto the stack",
    ],
    correctIndex: 1,
    explanation:
      "A context switch involves saving the CPU registers, program counter, and stack pointer of the current process, then loading those of the next process. It also may involve flushing the TLB and switching page tables. Context switches are necessary for multitasking but have measurable overhead (typically a few microseconds).",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf",
  },
  {
    id: 190,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What does the 'kernel mode' (ring 0) privilege level allow that 'user mode' (ring 3) does not?",
    options: [
      "Running C++ code instead of C code",
      "Direct access to hardware, all memory, and privileged CPU instructions",
      "Using more than one CPU core",
      "Allocating memory on the heap",
    ],
    correctIndex: 1,
    explanation:
      "Kernel mode (ring 0 on x86) can execute privileged instructions, access any physical memory address, and interact directly with hardware devices. User mode is restricted to prevent buggy or malicious programs from crashing the system. System calls provide the controlled gateway between user mode and kernel mode.",
    link: "https://en.wikipedia.org/wiki/Protection_ring",
  },
  {
    id: 191,
    difficulty: "Easy",
    topic: "Operating Systems",
    question:
      "What is an inode in a Unix filesystem?",
    options: [
      "The human-readable name of a file",
      "A data structure that stores a file's metadata (size, permissions, block locations) but not its name",
      "A pointer to the next file in a directory listing",
      "A section of disk reserved for swap space",
    ],
    correctIndex: 1,
    explanation:
      "An inode stores all metadata about a file — ownership, permissions, timestamps, size, and pointers to the data blocks on disk. The filename is stored in the directory entry, which maps a name to an inode number. This is why hard links work: multiple names can point to the same inode.",
    link: "https://man7.org/linux/man-pages/man7/inode.7.html",
  },

  // ── Operating Systems: Medium (Q192–Q209) ──
  {
    id: 192,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "After calling fork(), the parent and child processes have identical memory contents. When one of them writes to a variable, what happens?",
    options: [
      "Both processes see the write — they share the same physical memory",
      "Only the writing process sees the change — the OS uses copy-on-write to duplicate only the modified page",
      "The write causes a segmentation fault because forked memory is read-only",
      "The OS copies the entire address space immediately at the time of the write",
    ],
    correctIndex: 1,
    explanation:
      "Modern OSes implement copy-on-write (COW): after fork(), parent and child share the same physical pages (marked read-only). When either process writes, a page fault occurs and the kernel copies only that page. This makes fork() fast even for large processes, since most pages are never written.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-mechanism.pdf",
  },
  {
    id: 193,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "A multi-level page table (as used on x86-64) splits the virtual address into multiple indices. What is the primary advantage over a single flat page table?",
    options: [
      "Faster lookups — fewer memory accesses per translation",
      "Space efficiency — only page table entries for allocated regions need to exist in memory",
      "It eliminates the need for a TLB",
      "It allows pages to be larger than 4 KB",
    ],
    correctIndex: 1,
    explanation:
      "A flat page table for a 48-bit address space would require millions of entries even if most memory is unused. A multi-level table is sparse: intermediate levels can point to 'not present,' skipping huge unallocated regions. The tradeoff is more memory accesses per walk (up to 4 on x86-64), but the TLB caches recent translations.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf",
  },
  {
    id: 194,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What are the four necessary conditions for deadlock (Coffman conditions)?",
    options: [
      "Mutual exclusion, hold and wait, no preemption, circular wait",
      "Mutual exclusion, starvation, priority inversion, busy waiting",
      "Atomicity, consistency, isolation, durability",
      "Race condition, hold and wait, livelock, starvation",
    ],
    correctIndex: 0,
    explanation:
      "All four conditions must hold simultaneously for deadlock: (1) mutual exclusion — resources cannot be shared, (2) hold and wait — processes hold resources while waiting for others, (3) no preemption — resources cannot be forcibly taken, (4) circular wait — a cycle exists in the resource dependency graph. Breaking any one condition prevents deadlock.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-deadlock.pdf",
  },
  {
    id: 195,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "How does a semaphore differ from a mutex?",
    options: [
      "They are identical — 'semaphore' is just an older name for mutex",
      "A mutex allows only one thread to enter the critical section; a semaphore maintains a count and can allow up to N threads to access a resource concurrently",
      "A semaphore is faster because it uses busy-waiting instead of blocking",
      "A mutex works across processes; a semaphore works only within a single process",
    ],
    correctIndex: 1,
    explanation:
      "A mutex is a binary lock (locked/unlocked). A counting semaphore has an integer value: wait() decrements it (blocking if it would go below zero) and post() increments it. A semaphore initialized to N allows N concurrent accessors — useful for connection pools or bounded buffers. A binary semaphore (N=1) is similar to a mutex but lacks ownership semantics.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf",
  },
  {
    id: 196,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is priority inversion, and why is it a problem?",
    options: [
      "A high-priority thread is blocked waiting for a resource held by a low-priority thread, which is itself preempted by medium-priority threads",
      "A low-priority thread runs before a high-priority thread due to a bug in the scheduler",
      "Two threads of equal priority deadlock each other",
      "The OS inverts the priority of all threads periodically to ensure fairness",
    ],
    correctIndex: 0,
    explanation:
      "Priority inversion occurs when a high-priority task H blocks on a lock held by low-priority task L, while medium-priority tasks preempt L — effectively making H wait for tasks of lower priority. Solutions include priority inheritance (temporarily boosting L's priority to H's level) and priority ceiling protocols. The Mars Pathfinder mission famously encountered this bug.",
    link: "https://en.wikipedia.org/wiki/Priority_inversion",
  },
  {
    id: 197,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is mmap() used for?",
    options: [
      "Allocating memory that is automatically freed when the function returns",
      "Mapping a file or device into the process's virtual address space so it can be accessed like memory",
      "Creating a new process with a copy of the parent's memory",
      "Encrypting a region of memory for secure storage",
    ],
    correctIndex: 1,
    explanation:
      "mmap() asks the kernel to map a file (or anonymous memory) into the process's address space. Reading/writing the mapped region translates to file I/O handled by the kernel via page faults. This avoids explicit read()/write() calls and lets the kernel use the page cache efficiently. It's also used for loading shared libraries and allocating large memory regions.",
    link: "https://man7.org/linux/man-pages/man2/mmap.2.html",
  },
  {
    id: 198,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is the purpose of fsync() after writing to a file?",
    options: [
      "It locks the file to prevent concurrent access",
      "It forces the OS to flush all buffered writes for the file to the physical storage device",
      "It compresses the file data to save disk space",
      "It checks the file for corruption and repairs it",
    ],
    correctIndex: 1,
    explanation:
      "When you call write(), the data typically goes into the OS page cache and is written to disk later (writeback). If the system crashes before writeback, data is lost. fsync() blocks until all dirty pages for that file are written to the storage device. Databases use fsync() (or fdatasync()) to ensure durability of committed transactions.",
    link: "https://man7.org/linux/man-pages/man2/fsync.2.html",
  },
  {
    id: 199,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is thrashing?",
    options: [
      "A CPU running at 100% utilization on useful work",
      "The system spending most of its time swapping pages in and out of memory instead of doing useful work",
      "A disk head moving back and forth due to fragmented files",
      "Multiple threads contending for the same lock",
    ],
    correctIndex: 1,
    explanation:
      "Thrashing occurs when the working set of active processes exceeds available physical memory. The OS constantly evicts pages that are needed again almost immediately, causing a storm of page faults. CPU utilization drops dramatically because processes spend nearly all their time waiting for I/O. Solutions include adding more RAM, reducing the number of processes, or improving data locality.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
  },
  {
    id: 200,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is the difference between a hard link and a symbolic (soft) link?",
    options: [
      "A hard link is a copy of the file; a symbolic link is a shortcut",
      "A hard link is a second directory entry pointing to the same inode; a symbolic link is a separate file that stores a path string",
      "Hard links work across filesystems; symbolic links do not",
      "Symbolic links update automatically when the target file moves; hard links do not",
    ],
    correctIndex: 1,
    explanation:
      "A hard link creates another directory entry referencing the same inode — the file data is shared and the link count increases. Deleting one hard link does not affect the data until the last link is removed. A symbolic link is a separate inode that stores a pathname; if the target is deleted, the symlink becomes a dangling reference. Hard links cannot cross filesystem boundaries.",
    link: "https://man7.org/linux/man-pages/man2/link.2.html",
  },
  {
    id: 201,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What does dup2(oldfd, newfd) do?",
    options: [
      "Creates a new file with the same contents as oldfd",
      "Makes newfd refer to the same open file description as oldfd, closing newfd first if it was open",
      "Swaps the file descriptors oldfd and newfd",
      "Copies the file data from oldfd into the buffer of newfd",
    ],
    correctIndex: 1,
    explanation:
      "dup2() atomically closes newfd (if open) and makes it a copy of oldfd — both now refer to the same underlying file description (same offset, status flags, etc.). This is the mechanism shells use to implement redirection: e.g., dup2(fd, STDOUT_FILENO) makes stdout go to the opened file.",
    link: "https://man7.org/linux/man-pages/man2/dup2.2.html",
  },
  {
    id: 202,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "A program calls printf() but the output does not appear immediately. What is the most likely reason?",
    options: [
      "printf() is a no-op unless you compile with -DPRINTF_ENABLED",
      "stdout is line-buffered (or fully buffered) by the C library, so output is held in a user-space buffer until a newline, buffer full, or fflush()",
      "The kernel delays all I/O until the process exits",
      "The terminal driver discards output that is not followed by a newline",
    ],
    correctIndex: 1,
    explanation:
      "The C standard library buffers stdout output in user space. When connected to a terminal, stdout is typically line-buffered (flushed on newline). When redirected to a file or pipe, it is fully buffered (flushed only when the buffer fills or on fflush/exit). This reduces the number of write() system calls and improves performance.",
    link: "https://man7.org/linux/man-pages/man3/setbuf.3.html",
  },
  {
    id: 203,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is shared memory as an IPC mechanism?",
    options: [
      "Two processes reading and writing the same file on disk",
      "A region of physical memory mapped into the address space of multiple processes, allowing direct read/write access without kernel involvement for each operation",
      "A kernel buffer that copies data from one process to another",
      "A network protocol for transferring data between processes on different machines",
    ],
    correctIndex: 1,
    explanation:
      "Shared memory (e.g., via shm_open() + mmap(), or shmget()) maps the same physical pages into multiple processes' virtual address spaces. Once set up, processes can read and write the shared region without system calls for each access, making it the fastest IPC mechanism. However, processes must use synchronization (mutexes, semaphores) to avoid data races.",
    link: "https://man7.org/linux/man-pages/man7/shm_overview.7.html",
  },
  {
    id: 204,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is the page cache (buffer cache)?",
    options: [
      "A hardware cache inside the CPU for virtual-to-physical translations",
      "A region of RAM managed by the kernel that caches recently accessed file data, reducing disk I/O",
      "A cache of compiled bytecode maintained by the dynamic linker",
      "A user-space buffer allocated by malloc() for file I/O",
    ],
    correctIndex: 1,
    explanation:
      "The kernel keeps recently read (and written) file data in unused RAM as the page cache. Subsequent reads of the same data are served from RAM instead of hitting disk. This is why 'free' memory on Linux is often low — the kernel uses available memory for caching. The page cache is the reason the second read of a file is dramatically faster than the first.",
    link: "https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html",
  },
  {
    id: 205,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What problem does select()/poll()/epoll() solve?",
    options: [
      "They encrypt data sent over network sockets",
      "They allow a single thread to monitor multiple file descriptors for readiness (readable, writable, error) without blocking on each one individually",
      "They increase the maximum number of open files a process can have",
      "They replace the need for TCP/IP in network programming",
    ],
    correctIndex: 1,
    explanation:
      "I/O multiplexing lets a single thread efficiently wait on many file descriptors at once — essential for building high-performance servers. select() and poll() scan all descriptors each call (O(n)); epoll (Linux) and kqueue (BSD/macOS) maintain a kernel data structure and report only ready descriptors (O(1) per event), enabling tens of thousands of concurrent connections.",
    link: "https://man7.org/linux/man-pages/man7/epoll.7.html",
  },
  {
    id: 206,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is a spinlock, and when is it preferred over a mutex that sleeps?",
    options: [
      "A spinlock is always faster than a mutex",
      "A spinlock busy-waits in a loop checking the lock; it is preferred when the expected wait time is very short (nanoseconds) and context-switch overhead would dominate",
      "A spinlock works only in user space; mutexes work only in kernel space",
      "A spinlock can be held by multiple threads simultaneously",
    ],
    correctIndex: 1,
    explanation:
      "A spinlock repeatedly checks (spins on) a flag rather than yielding the CPU. This avoids the overhead of a context switch (~1-10 us) but wastes CPU cycles while waiting. Spinlocks are ideal for very short critical sections (especially in kernel code and on multiprocessors) where the lock holder will release within nanoseconds. For longer waits, a sleeping mutex is more efficient.",
    link: "https://en.wikipedia.org/wiki/Spinlock",
  },
  {
    id: 207,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is demand paging?",
    options: [
      "Loading an entire program into RAM before execution begins",
      "Loading pages into physical memory only when they are first accessed, triggering a page fault that the OS handles transparently",
      "Paging out rarely used data to a dedicated partition on an SSD",
      "Allocating virtual addresses on demand as the program calls malloc()",
    ],
    correctIndex: 1,
    explanation:
      "With demand paging, the OS does not load a program's pages into RAM until they are actually needed. When the CPU accesses an unmapped page, a page fault occurs; the OS then loads the page from disk (or allocates a zero page) and updates the page table. This saves memory and speeds up process startup, since many pages may never be accessed.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf",
  },
  {
    id: 208,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is the difference between a voluntary and an involuntary context switch?",
    options: [
      "Voluntary context switches happen in user space; involuntary ones happen in kernel space",
      "A voluntary switch occurs when a process blocks (e.g., on I/O); an involuntary switch occurs when the OS preempts a running process (e.g., its time slice expired)",
      "Voluntary switches save less state than involuntary ones",
      "There is no difference — both are triggered by the timer interrupt",
    ],
    correctIndex: 1,
    explanation:
      "A voluntary context switch happens when a process cannot continue — it calls read(), sleep(), or waits on a lock. An involuntary switch happens when the scheduler preempts a running process (typically because its time quantum expired). High involuntary context switch rates indicate CPU contention; high voluntary rates indicate I/O-heavy workloads.",
    link: "https://man7.org/linux/man-pages/man1/pidstat.1.html",
  },
  {
    id: 209,
    difficulty: "Medium",
    topic: "Operating Systems",
    question:
      "What is an orphan process, and what happens to it?",
    options: [
      "It is terminated immediately by the kernel",
      "Its parent has exited, so it is re-parented to init (PID 1), which will call wait() on it when it eventually exits",
      "It becomes a zombie and can never be cleaned up",
      "It is moved to a special 'orphan' scheduling queue with lowest priority",
    ],
    correctIndex: 1,
    explanation:
      "When a parent process exits before its children, the orphaned children are adopted by the init process (PID 1) on Unix systems (or a subreaper). Init periodically calls wait() to collect the exit status of its adopted children, preventing them from becoming permanent zombies.",
    link: "https://man7.org/linux/man-pages/man2/waitpid.2.html",
  },

  // ── Operating Systems: Hard (Q210–Q223) ──
  {
    id: 210,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "On x86-64 Linux, a four-level page table is used. A virtual address is split into fields for PML4, PDPT, PD, PT, and offset. How many memory accesses does a TLB miss require to resolve a virtual address (not counting the final data access)?",
    options: [
      "1",
      "2",
      "4",
      "It varies depending on the page size",
    ],
    correctIndex: 2,
    explanation:
      "A TLB miss on x86-64 triggers a page table walk through four levels: PML4 → PDPT → PD → PT, each requiring one memory access to read the entry at that level. That's 4 memory accesses before the physical address is obtained. Huge pages (2 MB or 1 GB) reduce this by stopping the walk earlier, which is one reason they improve performance for large allocations.",
    link: "https://www.kernel.org/doc/html/latest/x86/x86_64/mm.html",
  },
  {
    id: 211,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What are huge pages (large pages), and why do they improve performance for memory-intensive applications?",
    options: [
      "They allow the OS to allocate memory faster by skipping the page table entirely",
      "They reduce TLB misses by mapping larger contiguous regions (e.g., 2 MB instead of 4 KB) with a single TLB entry, and reduce page table depth",
      "They compress memory contents so more data fits in RAM",
      "They bypass the kernel's memory allocator and map physical memory directly",
    ],
    correctIndex: 1,
    explanation:
      "A standard page is 4 KB. A huge page (2 MB or 1 GB on x86-64) covers a much larger region with a single TLB entry, dramatically reducing TLB misses for large working sets. The page table walk is also shorter (3 or 2 levels instead of 4). Databases and virtual machines commonly use huge pages. Linux offers both transparent huge pages (automatic) and hugetlbfs (explicit).",
    link: "https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html",
  },
  {
    id: 212,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "A function registered with signal() or sigaction() runs when a signal is delivered. Why is calling printf() or malloc() from a signal handler considered unsafe?",
    options: [
      "Signal handlers cannot access global variables",
      "printf() and malloc() are not async-signal-safe — they use internal locks and data structures that may be in an inconsistent state if the signal interrupted them mid-operation, risking deadlock or corruption",
      "The kernel disables all standard library functions during signal delivery",
      "Signal handlers run in kernel mode where user-space functions are unavailable",
    ],
    correctIndex: 1,
    explanation:
      "If a signal arrives while the thread is inside malloc() (which holds an internal lock), and the handler also calls malloc(), it will attempt to acquire the same lock — causing a deadlock (or heap corruption). Only a small set of functions are guaranteed async-signal-safe (e.g., write(), _exit()). POSIX explicitly lists these safe functions in the signal-safety man page.",
    link: "https://man7.org/linux/man-pages/man7/signal-safety.7.html",
  },
  {
    id: 213,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is the OOM (Out-Of-Memory) killer in Linux?",
    options: [
      "A user-space daemon that monitors memory usage and sends alerts",
      "A kernel mechanism that selects and kills processes when the system runs critically low on memory, to prevent a complete system hang",
      "A compiler warning that fires when a program allocates too much stack memory",
      "A systemd service that restarts processes that use more than their memory limit",
    ],
    correctIndex: 1,
    explanation:
      "When the kernel cannot free enough memory through normal reclamation (cache eviction, swapping), the OOM killer selects a process to terminate based on a heuristic score (oom_score). This is a last resort to keep the system running. The score favors killing memory-hungry, low-priority processes. You can adjust a process's oom_score_adj to influence this decision.",
    link: "https://www.kernel.org/doc/html/latest/admin-guide/mm/concepts.html",
  },
  {
    id: 214,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is a futex, and why is it central to modern synchronization primitives on Linux?",
    options: [
      "A file-system-based lock that prevents two processes from writing the same file",
      "A 'fast userspace mutex' — an integer in user space that threads can test atomically without entering the kernel, only making a system call when contention actually occurs",
      "A kernel data structure that replaces spinlocks for all in-kernel synchronization",
      "A CPU instruction that atomically locks a cache line",
    ],
    correctIndex: 1,
    explanation:
      "A futex (fast userspace mutex) is an integer in shared memory. In the uncontended case, threads use atomic CPU instructions (like CAS) to acquire the lock entirely in user space — no system call needed. Only when a thread must block (because another thread holds the lock) does it call futex(FUTEX_WAIT) to sleep in the kernel. This hybrid approach makes pthread_mutex, std::mutex, and Go's sync.Mutex fast in the common case.",
    link: "https://man7.org/linux/man-pages/man2/futex.2.html",
  },
  {
    id: 215,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "Linux uses an overcommit strategy for memory allocation. What does this mean, and what is a consequence?",
    options: [
      "The kernel allocates physical memory immediately when malloc() is called, guaranteeing it is available",
      "malloc() can succeed even when there is not enough physical memory to back the allocation; the kernel provides physical pages only on access and may invoke the OOM killer if memory runs out later",
      "The kernel compresses memory to allow more allocations than physical RAM supports",
      "Processes must request memory from a central broker that ensures fair distribution",
    ],
    correctIndex: 1,
    explanation:
      "With overcommit, the kernel grants virtual address space without reserving physical pages. Physical memory is allocated on demand (demand paging). This works well because most programs allocate far more than they use. However, if all processes simultaneously touch their allocations, the kernel may run out of physical memory and invoke the OOM killer. This is why malloc() almost never returns NULL on Linux.",
    link: "https://www.kernel.org/doc/html/latest/admin-guide/sysctl/vm.html",
  },
  {
    id: 216,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is the difference between blocking I/O, non-blocking I/O, and asynchronous I/O?",
    options: [
      "They are three names for the same mechanism",
      "Blocking I/O suspends the calling thread until complete; non-blocking I/O returns immediately with EAGAIN if not ready (the program must poll); async I/O initiates the operation and the kernel notifies the program when it completes",
      "Blocking I/O is for files; non-blocking I/O is for sockets; async I/O is for pipes",
      "Non-blocking I/O requires multiple threads; blocking I/O and async I/O do not",
    ],
    correctIndex: 1,
    explanation:
      "Blocking I/O (the default) puts the thread to sleep until data is available. Non-blocking I/O (O_NONBLOCK) returns EAGAIN/EWOULDBLOCK if the operation would block, requiring the program to retry — typically combined with epoll/select. Async I/O (e.g., io_uring on Linux) submits operations to the kernel and receives completions later, allowing the thread to do other work without polling.",
    link: "https://man7.org/linux/man-pages/man7/aio.7.html",
  },
  {
    id: 217,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "A program forks 1000 worker processes, each with a 100 MB address space. Does this require 100 GB of physical RAM?",
    options: [
      "Yes — each process needs its own physical memory",
      "No — copy-on-write means forked processes share the parent's physical pages until they write; shared libraries and read-only pages are never duplicated",
      "No — the kernel compresses each process's memory to save space",
      "No — only one process runs at a time, so they share the same physical memory by time-slicing",
    ],
    correctIndex: 1,
    explanation:
      "Thanks to COW and shared mappings, forked processes share physical pages for code (text segment), read-only data, and shared libraries. Only pages that are actually modified get private copies. A parent with 100 MB and 1000 children that each modify only 1 MB would use roughly 100 MB (shared) + 1000 × 1 MB (private) ≈ 1.1 GB, not 100 GB.",
    link: "https://man7.org/linux/man-pages/man2/fork.2.html",
  },
  {
    id: 218,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is the working set of a process, and how does it relate to performance?",
    options: [
      "The total amount of virtual memory a process has allocated",
      "The set of pages actively being used during a given time window; if the working set exceeds available physical memory, the process thrashes",
      "The number of CPU instructions executed in the last second",
      "The set of file descriptors currently open by the process",
    ],
    correctIndex: 1,
    explanation:
      "The working set is the subset of a process's pages that it accesses during a recent time interval. If the OS can keep the working set in RAM, page faults are rare and performance is good. If physical memory is too small for all active working sets, the OS evicts pages that are immediately needed again (thrashing). Understanding your working set size helps you optimize data structures for locality.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf",
  },
  {
    id: 219,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is a condition variable, and why must it always be used with a mutex?",
    options: [
      "A condition variable is a boolean flag that threads poll; it does not need a mutex",
      "A condition variable allows threads to sleep until a condition is true; the mutex protects the shared state that defines the condition, preventing the race between checking the condition and going to sleep",
      "A condition variable is a special type of semaphore; the mutex is optional for performance",
      "A condition variable signals the kernel to deliver an interrupt; the mutex prevents nested interrupts",
    ],
    correctIndex: 1,
    explanation:
      "Without a mutex, there is a race condition: Thread A checks the condition (it's false), then Thread B changes the condition and signals, then Thread A sleeps — missing the signal forever. The mutex ensures the condition check and the wait are atomic: the wait atomically releases the mutex and sleeps, and re-acquires it when woken. Spurious wakeups mean you must always re-check the condition in a loop.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf",
  },
  {
    id: 220,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is DMA (Direct Memory Access), and why is it important for I/O performance?",
    options: [
      "DMA allows the CPU to access device registers directly without going through the bus",
      "DMA allows I/O devices to transfer data directly to/from RAM without involving the CPU for each byte, freeing the CPU to do other work during the transfer",
      "DMA is a security feature that prevents devices from writing to kernel memory",
      "DMA is a technique for mapping device memory into user space",
    ],
    correctIndex: 1,
    explanation:
      "Without DMA, the CPU would have to execute a load/store instruction for every byte transferred between a device and memory (programmed I/O), consuming 100% of a core. DMA controllers let devices read/write RAM independently — the CPU initiates the transfer and receives an interrupt when it's complete. This is why modern disk and network I/O barely loads the CPU even at high throughput.",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf",
  },
  {
    id: 221,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "On Linux, what is the difference between a process's virtual memory size (VIRT/VSZ) and its resident set size (RSS)?",
    options: [
      "VIRT is the memory used on disk; RSS is the memory used in RAM",
      "VIRT is the total virtual address space mapped (including unmapped/swapped pages); RSS is the portion actually present in physical RAM right now",
      "VIRT counts shared libraries; RSS does not",
      "They are the same value reported in different units (bytes vs kilobytes)",
    ],
    correctIndex: 1,
    explanation:
      "VIRT (virtual size) includes everything mapped into the process's address space: heap, stack, memory-mapped files, shared libraries — even pages not yet backed by physical memory. RSS (resident set size) counts only the pages currently in RAM. A process can have a VIRT of several GB but an RSS of a few hundred MB. Neither perfectly reflects 'actual' memory usage due to shared pages counted by both.",
    link: "https://man7.org/linux/man-pages/man1/top.1.html",
  },
  {
    id: 222,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "Why is livelock considered different from deadlock, and in what situations does it arise?",
    options: [
      "Livelock is just another name for deadlock with more than two threads",
      "In livelock, threads are not blocked — they keep running and responding to each other's actions, but none makes progress because they continuously change state in a way that prevents forward movement",
      "Livelock occurs only in distributed systems; deadlock occurs only in single-machine systems",
      "Livelock is caused by hardware faults; deadlock is caused by software bugs",
    ],
    correctIndex: 1,
    explanation:
      "In deadlock, threads are blocked and do nothing. In livelock, threads are active — they keep retrying or yielding, but their actions counteract each other so no progress is made. A classic analogy: two people in a hallway keep stepping aside in the same direction. Livelock can arise from overly aggressive deadlock-avoidance schemes (e.g., two threads repeatedly acquiring and releasing locks in response to contention).",
    link: "https://en.wikipedia.org/wiki/Deadlock#Livelock",
  },
  {
    id: 223,
    difficulty: "Hard",
    topic: "Operating Systems",
    question:
      "What is starvation in the context of process scheduling or resource allocation?",
    options: [
      "A process being killed by the OOM killer due to low memory",
      "A process or thread being perpetually denied access to a resource it needs because other higher-priority or more favored processes always get it first",
      "A process consuming all available CPU and starving the OS kernel",
      "A deadlock involving more than two resources",
    ],
    correctIndex: 1,
    explanation:
      "Starvation occurs when a thread or process is indefinitely delayed because resources are always allocated to others. For example, a strict priority scheduler may starve low-priority processes if high-priority processes always run. Solutions include aging (gradually increasing a waiting process's priority), fair scheduling algorithms (like CFS on Linux), and fair locks (FIFO ordering).",
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched-mlfq.pdf",
  },

  // ── Linux Commands: Easy (Q224–Q238) ──
  {
    id: 224,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does the `pwd` command do?",
    options: [
      "Prints the current user's password",
      "Prints the absolute path of the current working directory",
      "Changes to the previous working directory",
      "Lists the contents of the current directory",
    ],
    correctIndex: 1,
    explanation:
      "pwd stands for 'print working directory.' It outputs the full absolute path of the directory you are currently in, e.g., /home/user/projects. This is useful for confirming your location in the filesystem before running other commands.",
    link: "https://man7.org/linux/man-pages/man1/pwd.1.html",
  },
  {
    id: 225,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `ls -a` show that `ls` alone does not?",
    options: [
      "File sizes in human-readable format",
      "Hidden files and directories (those starting with a dot)",
      "Files sorted by modification time",
      "Only directories, not regular files",
    ],
    correctIndex: 1,
    explanation:
      "The -a (all) flag causes ls to include entries whose names begin with a dot (.), which are hidden by default on Unix systems. This includes files like .bashrc, .gitignore, and the special entries . (current directory) and .. (parent directory).",
    link: "https://man7.org/linux/man-pages/man1/ls.1.html",
  },
  {
    id: 226,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `cd -` do?",
    options: [
      "Changes to the root directory",
      "Changes to the home directory",
      "Changes back to the previous working directory",
      "Prints the current directory and stays there",
    ],
    correctIndex: 2,
    explanation:
      "cd - switches to the previous working directory (stored in the $OLDPWD variable) and prints its path. This is a convenient shortcut for toggling between two directories without typing full paths.",
    link: "https://man7.org/linux/man-pages/man1/cd.1p.html",
  },
  {
    id: 227,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does the `cat` command do?",
    options: [
      "Compiles and translates source code",
      "Concatenates files and prints their contents to standard output",
      "Creates a new empty file",
      "Changes file permissions",
    ],
    correctIndex: 1,
    explanation:
      "cat is short for 'concatenate.' When given one file, it prints that file's contents to stdout. When given multiple files, it concatenates them in order. It is one of the most commonly used commands for quickly viewing file contents.",
    link: "https://man7.org/linux/man-pages/man1/cat.1.html",
  },
  {
    id: 228,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What is the difference between `cp` and `mv`?",
    options: [
      "cp copies files (the original remains); mv moves or renames files (the original is removed from the old location)",
      "cp works on files; mv works only on directories",
      "mv creates a symbolic link; cp creates a hard link",
      "There is no difference — they are aliases for the same command",
    ],
    correctIndex: 0,
    explanation:
      "cp creates a duplicate of the file at the destination while leaving the source intact. mv relocates the file (or renames it if the destination is in the same directory). Within the same filesystem, mv is nearly instant because it only updates directory entries rather than copying data.",
    link: "https://man7.org/linux/man-pages/man1/cp.1.html",
  },
  {
    id: 229,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does `rm -r` do, and why should it be used with caution?",
    options: [
      "Removes a single file and prompts for confirmation",
      "Recursively removes a directory and all of its contents — once deleted, files are not easily recoverable",
      "Removes only empty directories",
      "Moves files to a trash folder for later recovery",
    ],
    correctIndex: 1,
    explanation:
      "The -r (recursive) flag tells rm to descend into directories and delete everything inside them. Unlike GUI file managers, rm does not use a trash can — deleted files are gone immediately. Combining -r with -f (force) skips all confirmation prompts, which is especially dangerous.",
    link: "https://man7.org/linux/man-pages/man1/rm.1.html",
  },
  {
    id: 230,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does `mkdir -p path/to/dir` do that `mkdir path/to/dir` does not?",
    options: [
      "Creates the directory with special permissions",
      "Creates all intermediate (parent) directories as needed, and does not error if the directory already exists",
      "Creates a hidden directory",
      "Creates a symbolic link instead of a real directory",
    ],
    correctIndex: 1,
    explanation:
      "Without -p, mkdir fails if any parent directory in the path does not exist. The -p (parents) flag creates the entire path of directories as needed and silently succeeds if the target directory already exists. This is commonly used in build scripts and Makefiles.",
    link: "https://man7.org/linux/man-pages/man1/mkdir.1.html",
  },
  {
    id: 231,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `touch myfile.txt` do if the file does not exist?",
    options: [
      "Opens the file in a text editor",
      "Creates a new empty file named myfile.txt",
      "Prints an error because the file was not found",
      "Creates a directory named myfile.txt",
    ],
    correctIndex: 1,
    explanation:
      "touch creates an empty file if it does not exist. If the file already exists, touch updates its access and modification timestamps without changing its contents. This dual behavior makes it useful for both creating placeholder files and updating timestamps.",
    link: "https://man7.org/linux/man-pages/man1/touch.1.html",
  },
  {
    id: 232,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `head -n 20 file.txt` display?",
    options: [
      "The last 20 lines of file.txt",
      "The first 20 lines of file.txt",
      "Every 20th line of file.txt",
      "20 random lines from file.txt",
    ],
    correctIndex: 1,
    explanation:
      "head outputs the first part of a file. The -n flag specifies the number of lines to display (default is 10). Its counterpart, tail, displays the last N lines. Together they are useful for quickly inspecting the beginning or end of log files and data files.",
    link: "https://man7.org/linux/man-pages/man1/head.1.html",
  },
  {
    id: 233,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does the `man` command do?",
    options: [
      "Manages installed software packages",
      "Displays the manual (documentation) page for a given command",
      "Creates a new user account",
      "Compiles a C program",
    ],
    correctIndex: 1,
    explanation:
      "man (manual) is the built-in documentation system for Unix. Running 'man ls' shows the full documentation for the ls command, including all flags and examples. Man pages are organized into sections (1 for user commands, 2 for system calls, 3 for library functions, etc.).",
    link: "https://man7.org/linux/man-pages/man1/man.1.html",
  },
  {
    id: 234,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does `echo $HOME` print?",
    options: [
      "The literal string '$HOME'",
      "The path to the current user's home directory",
      "The hostname of the machine",
      "The contents of a file named HOME",
    ],
    correctIndex: 1,
    explanation:
      "echo prints its arguments to stdout. When an argument contains $VARIABLE, the shell expands it to the variable's value before echo sees it. $HOME is a standard environment variable containing the current user's home directory path (e.g., /home/alice). To print the literal string '$HOME', use single quotes: echo '$HOME'.",
    link: "https://man7.org/linux/man-pages/man1/echo.1.html",
  },
  {
    id: 235,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `which python3` output?",
    options: [
      "The version number of python3",
      "The full path to the python3 executable that would be run",
      "A list of all files named python3 on the system",
      "The process ID of a running python3 instance",
    ],
    correctIndex: 1,
    explanation:
      "which searches the directories listed in the $PATH environment variable and prints the full path to the first matching executable. This helps you determine which installation of a program will run when you type its name, which is especially useful when multiple versions are installed.",
    link: "https://man7.org/linux/man-pages/man1/which.1.html",
  },
  {
    id: 236,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does the pipe operator `|` do?",
    options: [
      "Writes the output of a command to a file",
      "Connects the standard output of one command to the standard input of the next command",
      "Runs two commands simultaneously in the background",
      "Compares the output of two commands",
    ],
    correctIndex: 1,
    explanation:
      "The pipe (|) takes the stdout of the command on its left and feeds it as stdin to the command on its right. For example, 'ls -l | grep .txt' passes the directory listing through grep to filter for lines containing '.txt'. Pipes are the foundation of the Unix philosophy of composing small tools.",
    link: "https://man7.org/linux/man-pages/man1/bash.1.html",
  },
  {
    id: 237,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What is the difference between `>` and `>>` when redirecting output?",
    options: [
      "> appends to a file; >> overwrites the file",
      "> overwrites (truncates) the file; >> appends to the end of the file",
      "> redirects stderr; >> redirects stdout",
      "There is no difference — they are interchangeable",
    ],
    correctIndex: 1,
    explanation:
      "> creates the file if it doesn't exist and overwrites it if it does (truncating its contents to zero first). >> also creates the file if needed, but appends new output to the end without erasing existing contents. Use >> for log files where you want to accumulate output over time.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Redirections",
  },
  {
    id: 238,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `tail -f /var/log/syslog` do?",
    options: [
      "Prints the first 10 lines of the log file",
      "Prints the last 10 lines and then exits",
      "Prints the last 10 lines and then continues to output new lines as they are appended to the file in real time",
      "Deletes the last 10 lines of the log file",
    ],
    correctIndex: 2,
    explanation:
      "The -f (follow) flag causes tail to keep running after displaying the last lines, watching the file for new data and printing it as it arrives. This is the standard way to monitor log files in real time. Press Ctrl+C to stop following.",
    link: "https://man7.org/linux/man-pages/man1/tail.1.html",
  },

  // ── Linux Commands: Medium (Q239–Q256) ──
  {
    id: 239,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `chmod 755 script.sh` do?",
    options: [
      "Sets the file to read-only for everyone",
      "Gives the owner read/write/execute, and group and others read/execute — the standard permission for executable scripts",
      "Makes the file hidden from all users except root",
      "Changes the file's owner to user ID 755",
    ],
    correctIndex: 1,
    explanation:
      "Octal permissions use three digits (owner, group, others). Each digit is the sum of read (4), write (2), and execute (1). So 7 = rwx, 5 = r-x. 755 means the owner can do anything, while group members and others can read and execute but not modify the file. This is the standard permission for scripts and executables.",
    link: "https://man7.org/linux/man-pages/man1/chmod.1.html",
  },
  {
    id: 240,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `chmod +x script.sh` do, and how does it differ from setting octal permissions?",
    options: [
      "It removes the execute permission from all users",
      "It adds execute permission for all users (owner, group, others) using symbolic notation, modifying only the execute bit and leaving other permissions unchanged",
      "It sets the permissions to exactly 111 (execute-only for everyone)",
      "It only works on files owned by root",
    ],
    correctIndex: 1,
    explanation:
      "Symbolic notation (u/g/o/a and +/-/=) modifies specific permission bits without affecting others. 'chmod +x' is shorthand for 'chmod a+x', adding execute for everyone. In contrast, octal notation (like 755) sets all nine permission bits at once. Symbolic notation is safer when you only want to change one bit.",
    link: "https://man7.org/linux/man-pages/man1/chmod.1.html",
  },
  {
    id: 241,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `grep -rn 'TODO' src/` do?",
    options: [
      "Deletes all lines containing 'TODO' from files in src/",
      "Recursively searches all files under src/ for the pattern 'TODO' and prints matching lines with their file name and line number",
      "Counts the total number of files in src/ that contain 'TODO'",
      "Replaces 'TODO' with an empty string in all files under src/",
    ],
    correctIndex: 1,
    explanation:
      "grep searches files for lines matching a pattern. The -r flag makes it recursive (descending into directories), and -n prepends each match with its line number. Combined with the path argument src/, this searches every file in the source tree — a very common workflow for finding code annotations.",
    link: "https://man7.org/linux/man-pages/man1/grep.1.html",
  },
  {
    id: 242,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `2>/dev/null` do when appended to a command?",
    options: [
      "Redirects standard output to /dev/null, suppressing normal output",
      "Redirects standard error (file descriptor 2) to /dev/null, discarding error messages",
      "Redirects both stdout and stderr to /dev/null",
      "Sends the number 2 as input to /dev/null",
    ],
    correctIndex: 1,
    explanation:
      "File descriptor 2 is stderr. The redirection 2>/dev/null sends all error output to /dev/null (a special file that discards everything written to it). This is useful when you expect some errors and don't want them cluttering your output. To discard both stdout and stderr, use &>/dev/null or >/dev/null 2>&1.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Redirections",
  },
  {
    id: 243,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `wc -l file.txt` output?",
    options: [
      "The number of words in file.txt",
      "The number of lines in file.txt",
      "The number of characters in file.txt",
      "The file size in bytes",
    ],
    correctIndex: 1,
    explanation:
      "wc (word count) counts lines, words, and bytes. The -l flag restricts output to just the line count. This is frequently used in pipelines: for example, 'git log --oneline | wc -l' counts the total number of commits.",
    link: "https://man7.org/linux/man-pages/man1/wc.1.html",
  },
  {
    id: 244,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `sort file.txt | uniq` do, and why must the input be sorted first?",
    options: [
      "Sorts the file and removes all lines, leaving it empty",
      "Sorts the file alphabetically, then removes adjacent duplicate lines — uniq only detects duplicates that are next to each other",
      "Removes all duplicate lines without requiring sorted input",
      "Sorts the file numerically and prints only unique numbers",
    ],
    correctIndex: 1,
    explanation:
      "uniq filters out consecutive identical lines. If duplicates are scattered throughout the file, uniq misses them because it only compares adjacent lines. Sorting first groups identical lines together, making uniq effective. Alternatively, 'sort -u' combines both operations in one step.",
    link: "https://man7.org/linux/man-pages/man1/uniq.1.html",
  },
  {
    id: 245,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `cut -d',' -f2 data.csv` do?",
    options: [
      "Removes the second column from the CSV file",
      "Extracts the second field from each line, using comma as the delimiter",
      "Cuts the file into two equal halves",
      "Replaces all commas with spaces and prints field 2",
    ],
    correctIndex: 1,
    explanation:
      "cut extracts sections from each line of input. -d sets the field delimiter (comma here, tab by default) and -f selects which fields to print. 'cut -d',' -f2' is a quick way to extract a single column from a CSV without a full CSV parser — though it doesn't handle quoted fields containing commas.",
    link: "https://man7.org/linux/man-pages/man1/cut.1.html",
  },
  {
    id: 246,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `ps aux` show?",
    options: [
      "Only the processes owned by the current user",
      "A snapshot of all running processes on the system, with columns for user, PID, CPU%, memory%, and the command",
      "A live-updating view of processes sorted by CPU usage",
      "Only background processes started by the current shell",
    ],
    correctIndex: 1,
    explanation:
      "ps aux shows a snapshot of every process running on the system. 'a' shows processes from all users, 'u' adds the user/owner column and memory/CPU stats, and 'x' includes processes not attached to a terminal. For a live-updating view, use top or htop instead.",
    link: "https://man7.org/linux/man-pages/man1/ps.1.html",
  },
  {
    id: 247,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `tee` do in a pipeline like `make 2>&1 | tee build.log`?",
    options: [
      "It splits the input into two separate files",
      "It reads from stdin and writes to both stdout and the specified file, allowing you to see output on screen while also saving it",
      "It filters out duplicate lines before writing",
      "It compresses the output before writing to the file",
    ],
    correctIndex: 1,
    explanation:
      "tee copies its stdin to both stdout and one or more files simultaneously — like a T-shaped pipe splitter. This lets you watch command output in real time while also capturing it to a log file. Use 'tee -a' to append to the file instead of overwriting.",
    link: "https://man7.org/linux/man-pages/man1/tee.1.html",
  },
  {
    id: 248,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does the `$PATH` environment variable control?",
    options: [
      "The current working directory",
      "A colon-separated list of directories the shell searches, in order, to find executables when you type a command name",
      "The path to the user's home directory",
      "The location where downloaded files are saved",
    ],
    correctIndex: 1,
    explanation:
      "When you type a command like 'python3', the shell searches each directory listed in $PATH from left to right until it finds an executable with that name. This is why installing a program means either placing it in a $PATH directory (like /usr/local/bin) or adding its directory to $PATH. You can see the current value with 'echo $PATH'.",
    link: "https://man7.org/linux/man-pages/man7/environ.7.html",
  },
  {
    id: 249,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `tar -czf archive.tar.gz mydir/` do?",
    options: [
      "Extracts the contents of archive.tar.gz into mydir/",
      "Creates a gzip-compressed tar archive named archive.tar.gz containing all files in mydir/",
      "Lists the contents of an existing archive",
      "Compresses mydir/ in place, replacing it with archive.tar.gz",
    ],
    correctIndex: 1,
    explanation:
      "tar bundles files into a single archive. -c creates a new archive, -z applies gzip compression, and -f specifies the output filename. To extract, use -xzf. The mnemonic 'create zip file' helps remember -czf. tar preserves file permissions, ownership, and directory structure.",
    link: "https://man7.org/linux/man-pages/man1/tar.1.html",
  },
  {
    id: 250,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `df -h` show?",
    options: [
      "The disk usage of each file in the current directory",
      "The amount of free and used disk space on all mounted filesystems, in human-readable units (KB, MB, GB)",
      "The number of files on each filesystem",
      "A list of recently deleted files",
    ],
    correctIndex: 1,
    explanation:
      "df (disk free) reports the total, used, and available space for each mounted filesystem. The -h flag (human-readable) converts raw byte counts to KB, MB, or GB. To see how much space specific files and directories use, use 'du' instead.",
    link: "https://man7.org/linux/man-pages/man1/df.1.html",
  },
  {
    id: 251,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `du -sh *` show when run in a directory?",
    options: [
      "The total disk usage of the entire filesystem",
      "The disk space used by each file and subdirectory in the current directory, summarized and in human-readable format",
      "The number of inodes used by each item",
      "The access time of each file",
    ],
    correctIndex: 1,
    explanation:
      "du (disk usage) calculates the size of files and directories. -s (summarize) shows only the total for each argument instead of listing every file inside, and -h makes the output human-readable. 'du -sh *' is the standard way to find out which directories are consuming the most disk space.",
    link: "https://man7.org/linux/man-pages/man1/du.1.html",
  },
  {
    id: 252,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `find . -name '*.log' -mtime +30` do?",
    options: [
      "Finds all .log files created exactly 30 days ago",
      "Finds all .log files under the current directory that were last modified more than 30 days ago",
      "Finds the 30 largest .log files",
      "Deletes all .log files older than 30 days",
    ],
    correctIndex: 1,
    explanation:
      "find recursively searches directories matching criteria. -name '*.log' matches filenames ending in .log, and -mtime +30 matches files whose data was last modified more than 30 days ago. find only finds files — it does not delete them unless you add -delete or -exec rm {}. This makes it safe for exploratory searches.",
    link: "https://man7.org/linux/man-pages/man1/find.1.html",
  },
  {
    id: 253,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `export MY_VAR=hello` do, and how does it differ from `MY_VAR=hello`?",
    options: [
      "They are identical — both set and export the variable",
      "export makes the variable available to child processes (subshells, scripts, commands launched from this shell); without export, the variable exists only in the current shell",
      "export saves the variable to a file; without export, it only exists in memory",
      "export makes the variable read-only; without export, it can be changed",
    ],
    correctIndex: 1,
    explanation:
      "Without export, a variable is a shell-local variable — child processes don't inherit it. export marks the variable for inclusion in the environment of subsequently launched processes. This is why .bashrc uses 'export PATH=...' — the PATH must be visible to every command the shell launches.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Bourne-Shell-Builtins",
  },
  {
    id: 254,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `curl -o output.html https://example.com` do?",
    options: [
      "Opens the URL in the default web browser",
      "Downloads the content at the URL and saves it to a file named output.html",
      "Uploads output.html to the server at example.com",
      "Pings the server and prints the response time",
    ],
    correctIndex: 1,
    explanation:
      "curl transfers data from or to a server. By default, it prints the response to stdout. The -o flag saves the output to the specified file instead. curl supports many protocols (HTTP, HTTPS, FTP, etc.) and is the standard command-line tool for interacting with web APIs. Use -O (uppercase) to save with the remote filename.",
    link: "https://man7.org/linux/man-pages/man1/curl.1.html",
  },
  {
    id: 255,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does running a command with `&` at the end (e.g., `./server &`) do?",
    options: [
      "Runs the command with elevated privileges",
      "Runs the command in the background, returning control of the terminal to the user immediately",
      "Runs the command and logs all output to a file",
      "Runs the command in a separate virtual terminal",
    ],
    correctIndex: 1,
    explanation:
      "The & operator tells the shell to run the command as a background job. The shell prints the job number and PID, then gives you back the prompt. You can bring it to the foreground with 'fg', list background jobs with 'jobs', or send it back to the background with 'bg'. The process still has its stdout connected to the terminal unless redirected.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Lists",
  },
  {
    id: 256,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `chown alice:developers file.txt` do?",
    options: [
      "Changes the file's permissions to allow alice and the developers group to access it",
      "Changes the file's owner to alice and its group to developers",
      "Creates a new user named alice in the developers group",
      "Copies the file to alice's home directory",
    ],
    correctIndex: 1,
    explanation:
      "chown (change owner) changes the user and/or group ownership of files. The syntax is user:group. This is commonly used after copying files between users or when deploying applications that need to run as a specific user. Changing ownership of files you don't own typically requires root privileges (sudo).",
    link: "https://man7.org/linux/man-pages/man1/chown.1.html",
  },

  // ── Linux Commands: Hard (Q257–Q271) ──
  {
    id: 257,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What is the difference between `cmd1 && cmd2` and `cmd1 ; cmd2`?",
    options: [
      "There is no difference — both always run cmd2 after cmd1",
      "&& runs cmd2 only if cmd1 succeeds (exit code 0); semicolon runs cmd2 regardless of whether cmd1 succeeded or failed",
      "&& runs both commands in parallel; semicolon runs them sequentially",
      "&& pipes the output of cmd1 into cmd2; semicolon does not",
    ],
    correctIndex: 1,
    explanation:
      "&& (logical AND) short-circuits: cmd2 executes only if cmd1 returns exit code 0 (success). This is useful for chaining dependent commands like 'make && make install'. The semicolon simply runs commands sequentially regardless of exit codes. || (logical OR) does the opposite: cmd2 runs only if cmd1 fails.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Lists",
  },
  {
    id: 258,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `find . -name '*.tmp' -exec rm {} +` do, and how does `+` differ from `\\;`?",
    options: [
      "There is no difference between + and \\; — they are interchangeable",
      "+ collects matching filenames and passes as many as possible to each rm invocation (batching), while \\; runs rm once per file found — making + significantly faster for many files",
      "+ runs rm in the background; \\; runs it in the foreground",
      "+ only works with rm; \\; works with any command",
    ],
    correctIndex: 1,
    explanation:
      "With \\;, find runs the command once per matched file (e.g., 1000 files = 1000 rm invocations). With +, find groups files into batches and runs fewer rm invocations, similar to how xargs works. This reduces process creation overhead and can be orders of magnitude faster for large numbers of files.",
    link: "https://man7.org/linux/man-pages/man1/find.1.html",
  },
  {
    id: 259,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `xargs` do, and why is it used with commands like `find`?",
    options: [
      "It sets extra arguments on environment variables",
      "It reads items from stdin and passes them as arguments to a command, converting a stream of input into command-line arguments — useful because many commands don't read filenames from stdin",
      "It runs a command exclusively without any arguments",
      "It validates the arguments passed to a command before executing it",
    ],
    correctIndex: 1,
    explanation:
      "Many commands (rm, cp, chmod) expect filenames as arguments, not on stdin. xargs bridges this gap by reading stdin (one item per line or null-delimited) and appending items as arguments to the given command. 'find . -name '*.o' | xargs rm' is more efficient than 'find -exec rm {} \\;' because xargs batches arguments. Use -0 with 'find -print0' to handle filenames with spaces.",
    link: "https://man7.org/linux/man-pages/man1/xargs.1.html",
  },
  {
    id: 260,
    difficulty: "Hard",
    topic: "Linux Commands",
    question: "What does `sed -i 's/foo/bar/g' file.txt` do?",
    options: [
      "Searches for 'foo' in file.txt and prints matching lines",
      "Replaces every occurrence of 'foo' with 'bar' in file.txt, modifying the file in place",
      "Creates a new file called bar.txt with the contents of foo.txt",
      "Deletes all lines containing 'foo' from file.txt",
    ],
    correctIndex: 1,
    explanation:
      "sed (stream editor) processes text line by line. The 's/foo/bar/g' command substitutes 'foo' with 'bar' — the g flag means globally (all occurrences per line, not just the first). The -i flag edits the file in place rather than printing to stdout. On macOS, -i requires an argument (e.g., -i '' for no backup); on GNU/Linux, -i alone works.",
    link: "https://man7.org/linux/man-pages/man1/sed.1.html",
  },
  {
    id: 261,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `awk '{print $2}' file.txt` do?",
    options: [
      "Prints the second line of file.txt",
      "Prints the second whitespace-delimited field from each line of file.txt",
      "Prints every other line of file.txt",
      "Removes the second column from file.txt",
    ],
    correctIndex: 1,
    explanation:
      "awk splits each input line into fields by whitespace (by default). $1 is the first field, $2 the second, and so on ($0 is the entire line). awk is a full programming language with variables, conditionals, and loops, but it is most commonly used for extracting and transforming columnar data. Use -F to change the field separator (e.g., -F',' for CSV).",
    link: "https://man7.org/linux/man-pages/man1/awk.1p.html",
  },
  {
    id: 262,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does command substitution `$(...)` do in bash?",
    code: "echo \"There are $(ls | wc -l) files here\"",
    options: [
      "It defines a subshell that runs in the background",
      "It runs the enclosed command and replaces the $(...) expression with its stdout output, allowing you to embed command output in strings or arguments",
      "It creates a variable named ... with the command as its value",
      "It suppresses the output of the enclosed command",
    ],
    correctIndex: 1,
    explanation:
      "Command substitution runs the command inside $(...) in a subshell and replaces the expression with its standard output. In the example, $(ls | wc -l) is replaced by the number of files. This is cleaner than the older backtick syntax (`...`) and supports nesting. It is widely used in scripts to capture command output into variables: count=$(wc -l < file.txt).",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Command-Substitution",
  },
  {
    id: 263,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does process substitution `<(...)` do in bash?",
    code: "diff <(sort file1.txt) <(sort file2.txt)",
    options: [
      "It creates a temporary file containing the output of the command",
      "It provides the output of a command as if it were a file (via a named pipe or /dev/fd path), allowing commands that require file arguments to read from a command's output",
      "It redirects the command's output to stdin",
      "It runs the command in a subshell and discards its output",
    ],
    correctIndex: 1,
    explanation:
      "Process substitution <(cmd) runs cmd and presents its output through a special file path (like /dev/fd/63). The parent command receives this path as an argument, so it can open and read it like a regular file. This lets you use commands that expect file arguments with dynamic data. In the example, diff compares two sorted streams without creating temporary files.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Process-Substitution",
  },
  {
    id: 264,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `trap 'rm -f /tmp/mylock' EXIT` do in a bash script?",
    options: [
      "It prevents the script from being killed by any signal",
      "It registers a command to run when the script exits (normally or due to a signal), ensuring cleanup happens even if the script is interrupted",
      "It creates a lock file that prevents other instances from running",
      "It redirects all errors to /tmp/mylock",
    ],
    correctIndex: 1,
    explanation:
      "trap registers a handler for signals or pseudo-signals. EXIT fires when the shell exits for any reason (normal exit, error, SIGTERM, etc.). This is the standard pattern for cleanup in shell scripts — removing temporary files, releasing locks, or restoring settings. You can also trap specific signals: trap 'echo interrupted' INT catches Ctrl+C.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Bourne-Shell-Builtins",
  },
  {
    id: 265,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `scp -r user@host:/var/log/ ./logs/` do?",
    options: [
      "Creates a symbolic link to the remote directory",
      "Recursively copies the /var/log/ directory from the remote host to a local ./logs/ directory over an encrypted SSH connection",
      "Synchronizes the directories, only copying changed files",
      "Mounts the remote directory locally via SSH",
    ],
    correctIndex: 1,
    explanation:
      "scp (secure copy) transfers files between hosts over SSH. -r enables recursive copying of directories. Unlike rsync, scp always copies all files regardless of whether they've changed, making it simpler but less efficient for repeated transfers. For incremental syncs, rsync -avz is preferred. scp is being deprecated in favor of sftp in newer OpenSSH versions.",
    link: "https://man7.org/linux/man-pages/man1/scp.1.html",
  },
  {
    id: 266,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `grep -oP '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' access.log` do?",
    options: [
      "Counts the number of IP addresses in access.log",
      "Prints only the matched IP address patterns (not the full lines) from access.log, using Perl-compatible regex",
      "Replaces all IP addresses with '***' in access.log",
      "Filters out lines that contain IP addresses",
    ],
    correctIndex: 1,
    explanation:
      "-o (only matching) prints just the matched text, not the entire line. -P enables Perl-compatible regular expressions (PCRE), which support \\d for digits. The pattern matches IPv4-like strings (1-3 digits separated by dots). Without -o, grep would print every full line containing an IP. This combination is powerful for extracting specific data from logs.",
    link: "https://man7.org/linux/man-pages/man1/grep.1.html",
  },
  {
    id: 267,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What is a here document (heredoc), and what does this script do?",
    code: "cat <<'EOF'\nHello $USER\nThe date is $(date)\nEOF",
    options: [
      "It prints the text with $USER and $(date) expanded to their values",
      "It prints the text literally without expanding variables or commands, because the delimiter EOF is quoted",
      "It writes the text to a file named EOF",
      "It causes a syntax error because heredocs cannot contain $ characters",
    ],
    correctIndex: 1,
    explanation:
      "A heredoc (<<DELIM ... DELIM) feeds multi-line text as stdin to a command. When the delimiter is quoted ('EOF' or \"EOF\"), the shell does NOT expand variables or command substitutions inside the body — everything is treated as literal text. Without quotes (<<EOF), expansion occurs normally. This distinction is important when generating config files or code that contains $ characters.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Here-Documents",
  },
  {
    id: 268,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `ls *.txt` do if no .txt files exist in the current directory (with default bash settings)?",
    options: [
      "Prints nothing and exits successfully",
      "The literal string '*.txt' is passed to ls, which reports an error because no file named '*.txt' exists",
      "Prints all files in the directory",
      "The shell throws a syntax error before ls runs",
    ],
    correctIndex: 1,
    explanation:
      "By default in bash, if a glob pattern matches nothing, it is passed unexpanded as a literal string to the command. So ls receives the literal argument '*.txt' and reports it doesn't exist. This is a common source of bugs in scripts. The 'nullglob' shell option (shopt -s nullglob) changes this behavior to expand unmatched patterns to nothing instead.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Filename-Expansion",
  },
  {
    id: 269,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What is the difference between `ssh user@host 'cmd'` and `ssh -t user@host 'cmd'`?",
    options: [
      "There is no difference — both allocate a terminal",
      "Without -t, SSH does not allocate a pseudo-terminal (PTY), so interactive programs (vim, top, less) will not work correctly; -t forces PTY allocation",
      "-t enables encryption; without it, the connection is unencrypted",
      "-t runs the command in the background on the remote host",
    ],
    correctIndex: 1,
    explanation:
      "When SSH runs a single command (not an interactive shell), it does not allocate a PTY by default. This means programs that need terminal features (curses, line editing, password prompts) will fail or behave oddly. The -t flag forces a pseudo-terminal allocation. Use -tt to force it even when SSH's stdin isn't a terminal (e.g., in a pipeline).",
    link: "https://man7.org/linux/man-pages/man1/ssh.1.html",
  },
  {
    id: 270,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `set -euo pipefail` at the top of a bash script do?",
    options: [
      "Enables verbose debugging output for every command",
      "Makes the script safer: -e exits on any command failure, -u treats unset variables as errors, -o pipefail makes a pipeline fail if any command in it fails (not just the last one)",
      "Sets the script's encoding to UTF-8",
      "Prevents the script from being run by non-root users",
    ],
    correctIndex: 1,
    explanation:
      "This is the 'strict mode' for bash scripts. -e causes immediate exit on non-zero return codes (instead of silently continuing). -u makes referencing an unset variable an error (instead of expanding to empty string). pipefail propagates failure from any pipeline stage (by default, only the exit code of the last command matters). Together, they catch many common scripting bugs early.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin",
  },
  {
    id: 271,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does this pipeline do?",
    code: "ps aux | awk '{print $11}' | sort | uniq -c | sort -rn | head -10",
    options: [
      "Lists the 10 largest processes by memory usage",
      "Lists the 10 most frequently occurring command names across all running processes, sorted by count in descending order",
      "Shows the 10 oldest running processes",
      "Kills the top 10 CPU-consuming processes",
    ],
    correctIndex: 1,
    explanation:
      "This is a classic Unix pipeline that composes small tools: ps aux lists all processes, awk extracts the 11th field (the command name), sort groups identical names together, uniq -c counts consecutive duplicates, sort -rn sorts numerically in reverse (highest count first), and head -10 takes the top 10. This pattern of 'extract | sort | count | sort | head' is extremely common for quick data analysis on the command line.",
    link: "https://man7.org/linux/man-pages/man1/ps.1.html",
  },
];
