export interface Question {
  id: number;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export const TOPICS = [
  "CS Fundamentals",
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
  },
];
