import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 822,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the `namespace` keyword do in C++?",
    code: `namespace math {\n    double pi = 3.14159;\n    double square(double x) { return x * x; }\n}`,
    options: [
      "It defines a new data type with a fixed size and alignment, similar to how struct works but restricted to primitive types that can be stored in CPU registers",
      "It imports a library from the standard library and makes all of its public symbols available in the current translation unit",
      "It creates a named scope that groups related declarations to prevent name collisions",
      "It declares a variable with block scope that is only visible within the enclosing braces, similar to a local variable inside a function body",
    ],
    correctIndex: 2,
    explanation:
      "Namespaces prevent name collisions in large codebases. Without them, two libraries defining a 'log' function would conflict. You access members with the scope operator (::) or bring them into scope with 'using'. Avoid 'using namespace std;' in headers -- it pollutes the global namespace.",
    link: "https://en.cppreference.com/w/cpp/language/namespace.html",
  },
  {
    id: 823,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What is the difference between `typedef` and `using` for type aliases?",
    code: `typedef std::vector<int> IntVec;      // C-style\nusing IntVec = std::vector<int>;       // Modern C++`,
    options: [
      "typedef works with templates, using does not",
      "typedef is faster at runtime because the compiler optimizes typedef aliases into direct type references, avoiding indirection",
      "They are functionally equivalent for simple aliases, but 'using' supports template aliases while 'typedef' does not",
      "using creates a copy of the type, typedef creates a reference",
    ],
    correctIndex: 2,
    explanation:
      "Both create type aliases: typedef is the legacy C syntax, using is the C++11 syntax. The key advantage of 'using' is template aliases: 'template<typename T> using Vec = std::vector<T>;' -- impossible with typedef. Prefer 'using' in modern C++.",
    link: "https://en.cppreference.com/w/cpp/language/type_alias.html",
  },
  {
    id: 824,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the `volatile` keyword tell the compiler?",
    code: `volatile int hardware_register = 0;`,
    options: [
      "The variable is thread-safe and can be accessed from multiple threads without data races, because the compiler inserts memory barriers automatically",
      "The variable cannot be modified after initialization and acts as a runtime constant, similar to const but with the guarantee that its value is set early",
      "The variable is stored in a CPU register for faster access, bypassing the memory hierarchy so that every read and write goes directly to the register file",
      "The variable's value may change at any time outside the program's control",
    ],
    correctIndex: 3,
    explanation:
      "volatile prevents the compiler from caching the variable in a register or reordering its accesses. Use cases: memory-mapped hardware registers, signal handlers. IMPORTANT: volatile does NOT provide thread safety -- use std::atomic for multithreading.",
    link: "https://en.cppreference.com/w/cpp/language/cv.html",
  },
  {
    id: 825,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does `alignof` return?",
    code: `std::cout << alignof(int) << std::endl;    // typically 4\nstd::cout << alignof(double) << std::endl; // typically 8`,
    options: [
      "The alignment requirement (in bytes) of a type",
      "The padding added to the type by the compiler to ensure proper alignment within structs, calculated as the difference between size and alignment",
      "The size of the type in bytes, including any padding added by the compiler to satisfy the platform's data alignment requirements",
      "The number of bits in the type, counting both the value bits used for magnitude and the sign bit if the type is signed",
    ],
    correctIndex: 0,
    explanation:
      "alignof(T) returns the number of bytes between successive addresses at which objects of type T can be allocated. CPUs access aligned data faster (or require it). int typically needs 4-byte alignment, double needs 8-byte. alignof is a compile-time operator (like sizeof).",
    link: "https://en.cppreference.com/w/cpp/language/alignof.html",
  },
  {
    id: 826,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the `extern` keyword do when applied to a variable declaration?",
    code: `// header.h\nextern int globalCount;  // declaration only\n\n// source.cpp\nint globalCount = 0;     // definition`,
    options: [
      "It declares a variable without defining it",
      "It makes the variable constant and read-only, enforced by the linker placing the symbol in the read-only data segment of the binary",
      "It allocates the variable on the heap with dynamic storage duration that persists until delete is called or the process terminates",
      "It makes the variable local to the current file by giving it internal linkage, preventing other translation units from accessing it",
    ],
    correctIndex: 0,
    explanation:
      "extern says 'this variable exists, but it's defined elsewhere.' Without extern, a variable declaration in a header would create a separate copy in every .cpp file that includes it (ODR violation). extern is also used for 'extern \"C\"' to disable C++ name mangling for C interop.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 827,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the `goto` keyword do, and why is it generally avoided?",
    code: `for (int i = 0; i < n; i++)\n    for (int j = 0; j < m; j++)\n        if (grid[i][j] == target)\n            goto found;\nfound:\n    // handle result`,
    options: [
      "It performs an unconditional jump to a labeled statement",
      "It was removed from C++ in C++11 as part of the language cleanup effort that also deprecated auto_ptr and export templates, and using it in modern code produces a compilation error",
      "It returns from the current function immediately and transfers control back to the caller, optionally passing a return value that is stored in the function's return register by the compiler",
      "It calls a function by name at runtime through a dynamic dispatch table, similar to a virtual function call but using a string-based lookup mechanism to resolve the target address each time",
    ],
    correctIndex: 0,
    explanation:
      "goto jumps to a label within the same function. It creates 'spaghetti code' and is banned by most style guides. The one widely accepted use is breaking out of deeply nested loops where break only exits the innermost loop. An alternative is extracting the nested loops into a function and using return.",
    link: "https://en.cppreference.com/w/cpp/language/goto.html",
  },
  {
    id: 828,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the `const` keyword mean when placed AFTER a member function's parameter list?",
    code: `class Rect {\n    int w, h;\npublic:\n    int area() const { return w * h; }\n};`,
    options: [
      "The function can only be called once per object lifetime",
      "The return value cannot be modified by the caller",
      "The function's parameters are constant and cannot be reassigned within the function body, preventing accidental modification of input values",
      "The function promises not to modify any non-mutable member variables",
    ],
    correctIndex: 3,
    explanation:
      "A const member function receives 'const this', so it cannot modify the object's state (except mutable members). This is essential for const-correctness: if you have a 'const Rect& r', you can only call const member functions on it. Always mark functions const if they don't modify state.",
    link: "https://en.cppreference.com/w/cpp/language/member_functions.html#const-_and_volatile-qualified_member_functions",
  },
  {
    id: 829,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What is the purpose of the `static` keyword inside a function?",
    code: `int counter() {\n    static int count = 0;  // initialized once\n    return ++count;\n}`,
    options: [
      "It gives the variable static storage duration",
      "It makes the variable thread-local so that each thread gets its own independent copy, preventing data races when multiple threads call the same function concurrently",
      "It prevents the variable from being modified after its initial assignment, acting as a runtime const that the compiler enforces by flagging any subsequent write as an error",
      "It makes the variable global and accessible from any function in any translation unit, placing it in the global symbol table with external linkage so the linker can resolve references to it",
    ],
    correctIndex: 0,
    explanation:
      "A static local variable is initialized the first time execution reaches its declaration (thread-safely since C++11) and destroyed at program exit. Unlike local variables, it lives in the data/BSS segment, not the stack. Use cases: lazy singletons, call counters, caching expensive computations.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html#Static_local_variables",
  },
  {
    id: 830,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does `decltype` do?",
    code: `int x = 5;\ndecltype(x) y = 10;        // y is int\ndecltype(x + 0.5) z = 3.0; // z is double`,
    options: [
      "It declares a variable without a type, deferring type deduction to the linker which examines all uses across translation units and selects the most compatible type",
      "It checks if a type is valid at runtime by performing RTTI queries against the expression's operands, returning a type_info reference for dispatch",
      "It yields the type of an expression at compile time without evaluating it",
      "It converts a value to a different type at compile time using implicit conversion rules, similar to static_cast but with automatic target type deduction",
    ],
    correctIndex: 2,
    explanation:
      "decltype inspects the type of an expression at compile time. Unlike auto (which strips references/const), decltype preserves the exact type including references. decltype(auto) combines both: uses decltype rules with auto deduction. Essential for generic code and trailing return types.",
    link: "https://en.cppreference.com/w/cpp/language/decltype.html",
  },
  {
    id: 831,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What is the difference between `constexpr` and `consteval` in C++20?",
    code: `constexpr int square(int x) { return x * x; }  // MAY run at compile time\nconsteval int cube(int x) { return x * x * x; }  // MUST run at compile time`,
    options: [
      "constexpr functions CAN be evaluated at compile time. consteval functions MUST be evaluated at compile time",
      "consteval is slower because it always runs at runtime rather than at compile time, adding overhead from checking whether the function's arguments are constant expressions before falling back to interpretation",
      "They are identical",
      "constexpr only works with integers, consteval works with all types including floating-point, strings, and user-defined classes, making consteval the preferred choice for general-purpose compile-time computation",
    ],
    correctIndex: 0,
    explanation:
      "constexpr: 'may be compile-time.' If called with constexpr arguments in a constexpr context, it runs at compile time; otherwise at runtime. consteval (immediate function): 'must be compile-time.' Every call must produce a compile-time constant. Use consteval for computations that should NEVER happen at runtime (lookup tables, hashing).",
    link: "https://en.cppreference.com/w/cpp/language/consteval.html",
  },
  {
    id: 832,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `constinit` guarantee in C++20?",
    code: `constinit int global = 42;           // OK: constant initialization\nconstinit thread_local int tl = 0;  // OK: also works with thread_local`,
    options: [
      "The variable is always stored in ROM by the linker, which places constinit symbols in a special non-writable section of the executable image that is mapped as read-only at load time",
      "The variable cannot be modified after initialization because constinit implies const, making it a compile-time constant that the compiler places in the read-only data segment of the binary image",
      "The variable is initialized at compile time, preventing the static initialization order fiasco",
      "The variable is initialized lazily on first use rather than at program startup, deferring construction until the first time control flow passes through the declaration statement at runtime",
    ],
    correctIndex: 2,
    explanation:
      "constinit ensures a variable with static/thread-local storage duration is initialized during constant initialization (not dynamic initialization). This prevents the 'static init order fiasco' where globals in different files initialize in undefined order. Unlike constexpr, the variable is NOT const -- it can be mutated later.",
    link: "https://en.cppreference.com/w/cpp/language/constinit.html",
  },
  {
    id: 833,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `inline` actually mean in modern C++ (C++17)?",
    options: [
      "It makes the function run faster by marking it as a hot path hint for the compiler's optimization passes, enabling aggressive loop unrolling, constant propagation, and register allocation for that function",
      "It forces the compiler to inline-expand the function body at every call site, eliminating function call overhead by substituting the function's instructions directly into the caller's code at compile time",
      "It prevents the function from being exported to other translation units by giving it internal linkage, similar to declaring a function as static at namespace scope in traditional C-style code organization",
      "It relaxes the One Definition Rule (ODR)",
    ],
    correctIndex: 3,
    explanation:
      "Historically, inline was an optimization hint. In modern C++, it primarily means 'this may appear in multiple TUs without causing linker errors.' C++17 added inline variables (e.g., inline static members defined in headers). The compiler decides independently whether to actually inline-expand calls.",
    link: "https://en.cppreference.com/w/cpp/language/inline.html",
  },
  {
    id: 834,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What are the THREE different meanings of the `static` keyword depending on context?",
    options: [
      "static only has two meanings: class member and global variable",
      "static means thread-local storage in all contexts, giving each thread its own independent copy of the variable so that concurrent access from multiple threads never causes data races or requires synchronization",
      "(1) Inside a function: persistent local variable. (2) In a class: member shared by all instances. (3) At file/namespace scope: internal linkage",
      "static always means the same thing",
    ],
    correctIndex: 2,
    explanation:
      "Context matters: (1) static local: survives function calls, initialized once. (2) static class member: one copy for the entire class, not per-object. (3) static at file scope: internal linkage -- prevents the symbol from being visible to other .cpp files. The same keyword, three distinct meanings.",
    link: "https://en.cppreference.com/w/cpp/language/static.html",
  },
  {
    id: 835,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `mutable` allow, and what is its primary use case?",
    code: `class Cache {\n    mutable std::unordered_map<int, int> cache_;\npublic:\n    int compute(int x) const {\n        if (auto it = cache_.find(x); it != cache_.end())\n            return it->second;\n        int result = /* expensive */;\n        cache_[x] = result;  // legal: cache_ is mutable\n        return result;\n    }\n};`,
    options: [
      "It allows a member variable to be modified inside a const member function",
      "It makes a variable thread-safe by instructing the compiler to wrap every read and write to the member in an implicit mutex lock/unlock pair, preventing data races when the object is accessed concurrently",
      "It creates a copy of the variable for each function call so that every invocation of the member function operates on an independent snapshot of the mutable field, preventing cross-call data dependencies",
      "It makes a variable volatile, telling the compiler not to cache the member's value in a register and instead reload it from memory on every access to handle hardware-mapped memory or signal handlers",
    ],
    correctIndex: 0,
    explanation:
      "mutable exempts a member from const-correctness. The classic use cases: (1) Caching/memoization in a const getter. (2) mutable std::mutex so const methods can lock it. (3) Debug counters. The rule of thumb: mutable is for state that doesn't affect the object's logical (observable) value.",
    link: "https://en.cppreference.com/w/cpp/language/cv.html#mutable_specifier",
  },
  {
    id: 836,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `explicit` prevent on a constructor or conversion operator?",
    code: `class Meters {\npublic:\n    explicit Meters(double val) : val_(val) {}\nprivate:\n    double val_;\n};\n\nvoid walk(Meters distance);\nwalk(5.0);            // ERROR: no implicit conversion\nwalk(Meters(5.0));    // OK: explicit construction`,
    options: [
      "It makes the constructor private and inaccessible from outside the class, restricting object creation to static factory methods or friend functions that have been granted access to the private section",
      "It prevents implicit conversions",
      "It makes the constructor constexpr so that objects of this type can be constructed at compile time, enabling their use in constant expressions, template parameters, and static_assert declarations",
      "It prevents the constructor from being inherited by derived classes, ensuring that each derived class must define its own constructor even if the base class constructor would be sufficient for initialization",
    ],
    correctIndex: 1,
    explanation:
      "Without explicit, 'walk(5.0)' would silently construct a Meters from the double. This can hide bugs: passing raw numbers where unit types are expected. explicit forces the caller to write Meters(5.0), making intent clear. Always use explicit on single-argument constructors unless implicit conversion is genuinely desired.",
    link: "https://en.cppreference.com/w/cpp/language/explicit.html",
  },
  {
    id: 837,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What is `extern \"C\"` used for?",
    code: `extern "C" {\n    void c_function(int x);\n    int c_global;\n}`,
    options: [
      "It compiles the code as C instead of C++, disabling classes, templates, namespaces, and exceptions within the enclosed block",
      "It enables C-style casts throughout the enclosed block, allowing reinterpret_cast and const_cast semantics via the parenthesized cast syntax from C",
      "It imports C standard library functions like printf, malloc, and strlen into the C++ translation unit, making them available without the std:: prefix",
      "It disables C++ name mangling so C++ code can link with C libraries",
    ],
    correctIndex: 3,
    explanation:
      "C++ mangles function names to support overloading (e.g., foo(int) and foo(double) get different symbols). C doesn't mangle. extern \"C\" tells the C++ compiler to use C linkage (no mangling) for these declarations, enabling interop with C libraries. This is why C headers use #ifdef __cplusplus guards.",
    link: "https://en.cppreference.com/w/cpp/language/language_linkage.html",
  },
  {
    id: 838,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `thread_local` do?",
    code: `thread_local int request_id = 0;\n\nvoid handle_request() {\n    request_id++;  // each thread has its own copy\n}`,
    options: [
      "It restricts the variable to only be read by one thread at a time, using a reader-writer lock so multiple readers can proceed but writers need exclusive access",
      "Each thread gets its own independent copy of the variable",
      "It locks the variable with a mutex automatically on every read and write, providing built-in thread safety without the programmer managing synchronization",
      "It makes the variable shared between all threads in the process, placing it in a global memory region visible to every thread, requiring explicit mutex protection for safety",
    ],
    correctIndex: 1,
    explanation:
      "thread_local gives each thread its own instance, initialized when the thread starts and destroyed when it ends. Use cases: per-thread caches, error codes (like errno), allocators, random number generators. It avoids synchronization overhead since there's no sharing.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html#thread_local",
  },
  {
    id: 839,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What is the difference between `struct` and `class` in C++?",
    options: [
      "Structs can't use inheritance or polymorphism because they lack a vtable pointer, while classes always have a vtable allocated for virtual dispatch even if no virtual functions are declared in the hierarchy",
      "Structs can't have member functions, constructors, destructors, or operator overloads because they are plain-old-data (POD) types inherited from C that only support public data member declarations",
      "The ONLY difference is the default access specifier: struct defaults to public, class defaults to private. They are otherwise identical",
      "Structs are allocated on the stack, classes on the heap",
    ],
    correctIndex: 2,
    explanation:
      "This is one of the most common C++ interview questions. struct and class are the same thing except: (1) struct members are public by default, class members are private. (2) struct inheritance is public by default, class inheritance is private. Convention: use struct for POD/aggregate types, class for types with invariants.",
    link: "https://en.cppreference.com/w/cpp/language/class.html",
  },
  {
    id: 840,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `= delete` do when applied to a function?",
    code: `class NonCopyable {\npublic:\n    NonCopyable() = default;\n    NonCopyable(const NonCopyable&) = delete;\n    NonCopyable& operator=(const NonCopyable&) = delete;\n};`,
    options: [
      "It explicitly prevents the function from being called",
      "It removes the function from memory at runtime by deallocating its code segment after the first call completes, making subsequent calls undefined behavior unless the function is reloaded from the object file",
      "It marks the function for lazy deletion by the garbage collector, which will remove the function's code from the executable image once no active call stack references it, freeing memory for other allocations",
      "It makes the function virtual and adds it to the class's vtable, enabling dynamic dispatch through base class pointers so that derived classes can override the function's behavior with their own implementation",
    ],
    correctIndex: 0,
    explanation:
      "= delete makes a function exist for overload resolution but uncallable. If selected, the compiler emits a clear error. Uses: (1) Non-copyable types (unique ownership). (2) Preventing narrowing: void f(int); void f(double) = delete; (3) Preventing heap allocation: void* operator new(size_t) = delete;",
    link: "https://en.cppreference.com/w/cpp/language/function.html#Deleted_functions",
  },
  {
    id: 841,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `= default` do when applied to a special member function?",
    code: `class Widget {\npublic:\n    Widget() = default;  // compiler-generated default ctor\n    ~Widget() = default; // compiler-generated destructor\n};`,
    options: [
      "It makes the function inline and marked for aggressive optimization by the compiler, hinting that the generated default implementation should be expanded at every call site to eliminate function call overhead",
      "It tells the compiler to generate the default implementation of that special member function",
      "It makes the function do nothing by generating an empty function body that simply returns immediately, which is useful for declaring no-op destructors or constructors that skip all initialization work",
      "It sets all member variables to zero or their default values by generating a constructor body that explicitly initializes each field using value-initialization syntax in the member initializer list of the constructor",
    ],
    correctIndex: 1,
    explanation:
      "Declaring a copy constructor suppresses the implicit move constructor. '= default' lets you bring it back explicitly: 'Widget(Widget&&) = default;'. It's also self-documenting: = default says 'I've considered this function and the compiler's version is correct.' It can also make the function trivial (important for is_trivially_copyable).",
    link: "https://en.cppreference.com/w/cpp/language/function.html#Explicitly-defaulted_functions",
  },
  {
    id: 842,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does the `friend` keyword do?",
    code: `class Matrix {\n    double data_[16];\n    friend Matrix operator*(const Matrix& a, const Matrix& b);\n    friend class Serializer;\n};`,
    options: [
      "It grants a specific function or class access to the private and protected members of this class",
      "It creates a weak reference to another object that doesn't prevent it from being destroyed, allowing the friend class to observe state without extending lifetime",
      "It merges two classes into one by combining their member variables and methods into a single class definition, resolving any name conflicts by giving priority to the declaring class's own members",
      "It makes the class inherit from another class using private inheritance, importing all base class members as private members of the derived class",
    ],
    correctIndex: 0,
    explanation:
      "friend gives access to private members without inheritance. Use cases: (1) Non-member operator overloads (operator<<, operator*). (2) Factory classes. (3) Serialization. (4) Test classes. Use sparingly -- it couples classes tightly. Friendship is not inherited, not transitive, and not reciprocal.",
    link: "https://en.cppreference.com/w/cpp/language/friend.html",
  },
  {
    id: 843,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What is the difference between `using` as a type alias, a using-declaration, and a using-directive?",
    code: `// 1. Type alias\nusing IntVec = std::vector<int>;\n\n// 2. Using-declaration (brings ONE name into scope)\nusing std::cout;\n\n// 3. Using-directive (brings ALL names into scope)\nusing namespace std;`,
    options: [
      "Using-declarations are deprecated in C++20 and will be removed in C++23, replaced by import statements from the modules system that provide better encapsulation and faster compilation times overall",
      "They are all the same thing",
      "The difference is only syntactic sugar",
      "Type alias creates a synonym for a type. Using-declaration imports a single name from a namespace. Using-directive imports ALL names from a namespace",
    ],
    correctIndex: 3,
    explanation:
      "Three distinct uses: (1) Type alias: 'using X = Y;' -- preferred over typedef, supports templates. (2) Using-declaration: 'using std::cout;' -- safe, imports one name. (3) Using-directive: 'using namespace std;' -- dangerous in headers (pollutes scope), acceptable in .cpp files or small scopes. Never put using-directives in headers.",
    link: "https://en.cppreference.com/w/cpp/language/using_declaration.html",
  },
  {
    id: 844,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What does `noexcept` do as both a specifier and an operator?",
    code: `// As specifier: promises no exceptions\nvoid safe() noexcept { /* ... */ }\n\n// As operator: compile-time check\nstatic_assert(noexcept(safe()));         // true\nstatic_assert(!noexcept(std::stoi("1"))); // false`,
    options: [
      "Both forms are identical and interchangeable",
      "As a specifier it disables exceptions for the entire translation unit once applied to any function, while as an operator it counts the number of potential throw-expressions in a given statement or expression",
      "As a specifier it marks a function as non-throwing (std::terminate if violated). As an operator it evaluates to true/false at compile time based on whether an expression can throw",
      "As a specifier it catches exceptions thrown within the function body and silently discards them, while as an operator it re-throws the most recently caught exception from the current catch block's handler",
    ],
    correctIndex: 2,
    explanation:
      "noexcept specifier: 'void f() noexcept;' -- if f throws, std::terminate is called (no stack unwinding). noexcept operator: 'noexcept(expr)' returns true if expr is guaranteed not to throw. Combined: 'void f() noexcept(noexcept(g()))' -- f is noexcept only if g is. This is how move constructors conditionally propagate noexcept.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 845,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What does `alignas` do, and when would you use it?",
    code: `struct alignas(64) CacheLine {\n    int data[16];\n};\n\nalignas(16) float simd_array[4];`,
    options: [
      "It aligns text output to the console by inserting padding characters before the printed value, similar to std::setw but applied at the storage level so the alignment persists across multiple output operations",
      "It pads a struct to a specific size by inserting anonymous bytes between members, which can be used to match the layout of a network protocol packet or a memory-mapped hardware register block exactly",
      "It specifies stricter alignment requirements for a type or variable",
      "It sets the size of a type by adding padding bytes until the total size matches the specified value, which is useful when interoperating with hardware that expects data structures of a particular fixed size",
    ],
    correctIndex: 2,
    explanation:
      "alignas(N) ensures the object's address is a multiple of N. Use cases: (1) alignas(64) to place data on its own cache line (prevents false sharing in multithreading). (2) alignas(16) or alignas(32) for SIMD intrinsics (SSE/AVX require aligned loads). (3) DMA buffers. N must be a power of 2 and ≥ the type's natural alignment.",
    link: "https://en.cppreference.com/w/cpp/language/alignas.html",
  },
  {
    id: 846,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What does `decltype(auto)` deduce differently from plain `auto`?",
    code: `int x = 0;\nint& rx = x;\n\nauto a = rx;            // int (auto strips reference)\ndecltype(auto) b = rx;  // int& (decltype preserves reference)`,
    options: [
      "auto strips top-level references and cv-qualifiers. decltype(auto) preserves the exact type including references and const",
      "auto preserves references, decltype(auto) strips them",
      "They are identical in all cases",
      "decltype(auto) is always a pointer because it deduces the address of the expression's result rather than the value, which is why it is primarily used for returning pointers from factory functions",
    ],
    correctIndex: 0,
    explanation:
      "auto uses template argument deduction rules (strips &, const). decltype(auto) uses decltype rules (preserves everything). This matters in generic wrappers: 'decltype(auto) wrapper() { return inner(); }' -- if inner() returns int&, wrapper returns int&. With plain auto, the reference would be lost.",
    link: "https://en.cppreference.com/w/cpp/language/auto.html",
  },
  {
    id: 847,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What is the `register` keyword's status in modern C++?",
    options: [
      "It's still required for performance-critical code in tight inner loops where the programmer knows better than the compiler which variables should reside in registers for optimal throughput",
      "It was deprecated in C++11 and removed in C++17",
      "It forces the compiler to store the variable in a CPU register, bypassing the memory hierarchy entirely so that every access goes directly to the register file for maximum read and write performance",
      "It was repurposed in C++20 for coroutine registers that store the suspended coroutine's frame pointer, allowing the runtime to resume execution without searching the heap for the frame",
    ],
    correctIndex: 1,
    explanation:
      "In early C/C++, 'register int x;' was a hint to keep x in a CPU register. Modern optimizers allocate registers optimally without hints. C++11 deprecated it, C++17 removed it (using it is ill-formed). If you see it in legacy code, it can be safely deleted.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 848,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What is the difference between `const`, `constexpr`, `consteval`, and `constinit`?",
    options: [
      "const is for variables, the others are for functions only",
      "They all mean the same thing",
      "constexpr and consteval are identical",
      "const: runtime immutability. constexpr: value CAN be computed at compile time. consteval: value MUST be computed at compile time. constinit: variable MUST be initialized at compile time but CAN be modified later",
    ],
    correctIndex: 3,
    explanation:
      "Four levels: const (immutable after init, can be runtime). constexpr (usable in constant expressions, may be compile-time). consteval (C++20, immediate function, always compile-time). constinit (C++20, ensures static/thread-local init is constant, but not const -- can mutate later). Each serves a distinct purpose.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr.html",
  },
  {
    id: 849,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What does `virtual` inheritance solve, and what is its performance cost?",
    code: `struct Base { int x; };\nstruct A : virtual Base {};\nstruct B : virtual Base {};\nstruct Diamond : A, B {};  // only ONE copy of Base`,
    options: [
      "It ensures only one copy of a base class exists in diamond inheritance",
      "It makes inheritance faster by caching vtables in a shared lookup table that all derived classes reference, eliminating the per-object vtable pointer overhead and reducing the total memory footprint of polymorphic objects",
      "It prevents a class from being inherited by marking it as final at the inheritance level, so that any attempt to derive from a virtually inherited class produces a compile error in the derived class declaration",
      "It makes all member functions virtual automatically by inserting a hidden vtable pointer into the base class, enabling dynamic dispatch for every method call even if the functions are not explicitly declared virtual",
    ],
    correctIndex: 0,
    explanation:
      "Without virtual inheritance: Diamond has A::Base and B::Base (two copies -- ambiguous). With virtual: one shared Base. Cost: each path to the virtual base uses an offset stored in the vtable (extra indirection). sizeof is larger (extra vptr). Use when diamond patterns are unavoidable (e.g., iostream hierarchy).",
    link: "https://en.cppreference.com/w/cpp/language/derived_class.html#Virtual_base_classes",
  },
  {
    id: 850,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What does `requires` do in its two forms in C++20?",
    code: `// 1. Requires-clause (constrains a template)\ntemplate<typename T>\n    requires std::integral<T>\nT gcd(T a, T b);\n\n// 2. Requires-expression (tests if code is valid)\ntemplate<typename T>\nconcept Addable = requires(T a, T b) {\n    { a + b } -> std::convertible_to<T>;\n};`,
    options: [
      "A requires-clause constrains a template. A requires-expression is a compile-time predicate that checks if a set of expressions are valid for given types",
      "requires can only be used with concepts, not directly on templates",
      "requires-clauses are runtime checks that evaluate template constraints during program execution, while requires-expressions are compile-time checks that the compiler evaluates during template instantiation only",
      "Both forms are identical",
    ],
    correctIndex: 0,
    explanation:
      "requires-clause: 'template<T> requires Constraint' -- gates the template. If Constraint is false, SFINAE removes it. requires-expression: 'requires(T a) { expr; }' -- evaluates to true/false based on whether the expressions inside are well-formed. You can nest them: 'requires requires(T a) { a + a; }' (requires-clause containing a requires-expression).",
    link: "https://en.cppreference.com/w/cpp/language/requires.html",
  },
  {
    id: 851,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question: "What happens when you call a `noexcept` function that actually throws?",
    code: `void dangerous() noexcept {\n    throw std::runtime_error("oops");\n}`,
    options: [
      "The exception propagates normally",
      "The exception is silently swallowed and execution continues at the statement following the throw, with the noexcept specifier acting as a catch-all handler",
      "The compiler prevents this code from compiling by statically analyzing all execution paths and rejecting any that could reach a throw expression",
      "std::terminate() is called immediately",
    ],
    correctIndex: 3,
    explanation:
      "If a noexcept function throws, the runtime calls std::terminate() (which by default calls std::abort()). The stack may or may not be unwound (implementation-defined). The compiler does NOT prevent this -- it's a runtime contract. This is why noexcept enables optimizations: the compiler can skip generating exception handling code.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 852,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the 'enum' keyword define in C++?",
    code: `enum Color { Red, Green, Blue };`,
    options: [
      "A set of named integer constants grouped under one type",
      "A dynamically allocated array of constant string values",
      "A macro that expands into a series of inline functions",
      "A special template class for storing multiple data types",
    ],
    correctIndex: 0,
    explanation:
      "The 'enum' keyword defines an enumeration, which is a distinct type consisting of a set of named integral constants. In the example, Red=0, Green=1, Blue=2 by default.",
    link: "https://en.cppreference.com/w/cpp/language/enum",
  },
  {
    id: 853,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What is the key difference between 'struct' and 'class' in C++?",
    options: [
      "Structs cannot have member functions but classes always can",
      "Classes support inheritance while structs do not at all",
      "Structs are stack-only while classes are heap-allocated",
      "Default access is public in struct and private in class",
    ],
    correctIndex: 3,
    explanation:
      "In C++, the only fundamental difference between struct and class is the default access specifier: struct members are public by default, while class members are private by default. Both support inheritance, member functions, and all other features.",
    link: "https://www.learncpp.com/cpp-tutorial/structs/",
  },
  {
    id: 854,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What happens when no 'break' statement is used inside a 'switch' case?",
    code: `switch(x) {
  case 1: cout << "A";
  case 2: cout << "B";
  case 3: cout << "C";
}`,
    options: [
      "The compiler rejects code with missing break at each case",
      "Only the first matching case body is executed by default",
      "The program throws a runtime error due to missing break",
      "Execution falls through to subsequent cases until a break",
    ],
    correctIndex: 3,
    explanation:
      "Without a 'break' statement, execution falls through from the matched case into subsequent cases. If x is 1, the output would be 'ABC' because all three cases execute sequentially after the match.",
    link: "https://en.cppreference.com/w/cpp/language/switch",
  },
  {
    id: 855,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the 'goto' keyword do in C++?",
    code: `goto done;
cout << "skipped";
done:
cout << "reached";`,
    options: [
      "It creates a new execution thread starting at a given label",
      "It calls a function at the specified named entry point here",
      "It performs an unconditional jump to a named label location",
      "It triggers an exception handler at the given label target",
    ],
    correctIndex: 2,
    explanation:
      "The 'goto' keyword causes an unconditional jump to the statement marked by the specified label. In the example, 'skipped' is never printed because control jumps directly to the 'done' label.",
    link: "https://en.cppreference.com/w/cpp/language/goto",
  },
  {
    id: 856,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What is the difference between 'break' and 'continue' in a loop?",
    code: `for (int i=0; i<5; i++) {
  if (i==2) continue;
  if (i==4) break;
  cout << i;
}`,
    options: [
      "Continue exits the loop entirely, break skips to next iteration",
      "Break exits the loop entirely, continue skips to next iteration",
      "Break restarts the loop from the beginning of the first element",
      "Continue terminates the program, break returns from a function",
    ],
    correctIndex: 1,
    explanation:
      "The 'break' statement exits the enclosing loop entirely, while 'continue' skips the rest of the current iteration and proceeds to the next one. The output here is '013' -- 2 is skipped by continue, and the loop exits at 4 due to break.",
    link: "https://www.learncpp.com/cpp-tutorial/break-and-continue/",
  },
  {
    id: 857,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "Which block handles an exception thrown by 'throw' in C++?",
    code: `try {
  throw runtime_error("fail");
} catch (const runtime_error& e) {
  cout << e.what();
}`,
    options: [
      "The matching catch block associated with the enclosing try",
      "The nearest enclosing if-else block that checks error codes",
      "The destructor of the object that originally threw the error",
      "The finally block that always executes after the throw fires",
    ],
    correctIndex: 0,
    explanation:
      "When 'throw' is executed, the runtime searches for the nearest enclosing try block with a matching catch handler. C++ does not have a 'finally' keyword -- resource cleanup is handled via RAII and destructors.",
    link: "https://en.cppreference.com/w/cpp/language/try_catch",
  },
  {
    id: 858,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What do the 'new' and 'delete' keywords do in C++?",
    code: `int* p = new int(42);
delete p;`,
    options: [
      "New allocates heap memory and delete frees that memory back",
      "New declares a variable on the stack and delete removes scope",
      "New copies an object into a buffer and delete clears the data",
      "New creates a shared pointer and delete decrements ref count",
    ],
    correctIndex: 0,
    explanation:
      "The 'new' operator allocates memory on the heap and returns a pointer to it, optionally calling a constructor. The 'delete' operator frees that memory and calls the destructor. Failing to call delete leads to memory leaks.",
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  {
    id: 859,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the 'this' pointer refer to inside a member function?",
    code: `class Box {
  int size;
public:
  void set(int size) {
    this->size = size;
  }
};`,
    options: [
      "It points to the most recently created object of that class",
      "It points to the static class definition stored in memory",
      "It points to the parent class instance in the hierarchy chain",
      "It points to the current object on which the method is called",
    ],
    correctIndex: 3,
    explanation:
      "The 'this' pointer is an implicit pointer available in non-static member functions that points to the object on which the function was invoked. It is commonly used to disambiguate member variables from parameters with the same name.",
    link: "https://en.cppreference.com/w/cpp/language/this",
  },
  {
    id: 860,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does the 'return' keyword do in a function?",
    code: `int add(int a, int b) {
  return a + b;
}`,
    options: [
      "It prints the result of the expression to standard output",
      "It exits the function and provides a value back to caller",
      "It pauses function execution until the caller resumes flow",
      "It stores the expression value in a global result variable",
    ],
    correctIndex: 1,
    explanation:
      "The 'return' keyword terminates execution of the current function and optionally returns a value to the caller. In functions with a non-void return type, omitting the return statement leads to undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/language/return",
  },
  {
    id: 861,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "What value does the first enumerator receive by default in a plain 'enum'?",
    code: `enum Fruit { Apple, Banana, Cherry };`,
    options: [
      "The first enumerator gets a random value chosen at compile",
      "The first enumerator is left uninitialized until first used",
      "The first enumerator is assigned the integer value of zero",
      "The first enumerator is assigned the integer value of one",
    ],
    correctIndex: 2,
    explanation:
      "In a C++ enum, the first enumerator is assigned 0 by default, and each subsequent enumerator is one more than the previous. So Apple=0, Banana=1, Cherry=2 unless explicitly overridden.",
    link: "https://en.cppreference.com/w/cpp/language/enum",
  },
  {
    id: 862,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does marking a class as `final` prevent?",
    code: `class Base {};
class Engine final : public Base {
    int rpm_;
public:
    virtual void start() {}
};
class V8 : public Engine {};  // ???`,
    options: [
      "It prevents member functions from being called outside the class, restricting all access to static methods only and disabling construction through any public constructor",
      "It prevents any class from inheriting from it",
      "It prevents the class from being copied or moved by implicitly deleting the copy constructor and move constructor, making instances permanently bound to their storage",
      "It prevents the class from being instantiated directly, making it abstract so only derived classes can create objects of types inheriting from it",
    ],
    correctIndex: 1,
    explanation:
      "Marking a class `final` means no other class can inherit from it. In this example, `class V8 : public Engine` would fail to compile because Engine is final. The compiler can also use this information to devirtualize calls, since no further overrides are possible.",
    link: "https://en.cppreference.com/w/cpp/language/final.html",
  },
  {
    id: 863,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "What happens when you `= delete` a specific overload of a non-member function?",
    code: `void process(int x) { /* handle int */ }
void process(double) = delete;

int main() {
    process(42);    // line A
    process(3.14);  // line B
}`,
    options: [
      "Both lines fail because deleting any overload of a function name causes all overloads with that name to become inaccessible, poisoning the entire function identifier",
      "Line A compiles. Line B fails because overload resolution selects the deleted overload for a double argument, and calling a deleted function is a compilation error",
      "Both lines compile successfully because the deleted overload is simply removed from the overload set, so the double argument implicitly converts to int and calls process(int)",
      "Line A fails and line B compiles because `= delete` inverts the selection logic, making the non-deleted overload unreachable while the deleted overload acts as a fallback",
    ],
    correctIndex: 1,
    explanation:
      "A deleted function still participates in overload resolution. When you call process(3.14), the compiler selects process(double) as the best match, then sees it is deleted and emits an error. This technique is used to prevent implicit conversions -- the int overload works fine, but passing a double is caught at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/function.html#Deleted_functions",
  },
  {
    id: 864,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "What happens when you call a `constexpr` function with a non-constant argument?",
    code: `constexpr int square(int x) { return x * x; }

int main() {
    int n;
    std::cin >> n;
    int result = square(n);  // ???
}`,
    options: [
      "Compilation error because constexpr functions cannot accept runtime values",
      "Undefined behavior because the compiler generates only a compile-time version of the function, and calling it at runtime accesses an invalid code path that was never emitted",
      "The function executes at runtime like a normal function",
      "The compiler silently ignores the constexpr and removes it, then recompiles the function as a regular non-constexpr function with full runtime overhead for all future invocations",
    ],
    correctIndex: 2,
    explanation:
      "A constexpr function CAN run at runtime. When called with non-constant arguments (like user input), it simply executes as a regular function. It is only required to evaluate at compile time when used in a context that demands a constant expression (e.g., array size, template argument, constexpr variable initializer). This is the key difference from consteval.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr.html",
  },
  {
    id: 865,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "In template parameter lists, when does `typename` behave differently from `class`?",
    code: `template<class T>     // version A
void foo(T x);

template<typename T>  // version B
void bar(T x);

template<template<typename> class C>  // version C
void baz(C<int> x);`,
    options: [
      "They are interchangeable for simple type parameters, but in template-template parameters only `class` was allowed",
      "They differ only inside the template body: `typename` enables dependent name lookup for nested types, while `class` enables argument-dependent lookup for nested function calls",
      "They always differ: `class` restricts the parameter to class types only, while `typename` also permits primitive types like int, double, and char as template arguments",
      "They are always identical in all contexts including template-template parameters, dependent names, and nested type aliases",
    ],
    correctIndex: 0,
    explanation:
      "For ordinary type parameters, `typename` and `class` are completely interchangeable. However, before C++17, template-template parameters (like version C) required `class` -- writing `template<template<typename> typename C>` was a syntax error. C++17 relaxed this to allow `typename` there too, but pre-C++17 code must use `class`.",
    link: "https://en.cppreference.com/w/cpp/language/template_parameters.html",
  },
  {
    id: 866,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "What access does a class derived with `protected` inheritance have to the base's `public` members?",
    code: `class Base {
public:
    void api() {}
protected:
    int data_;
};

class Mid : protected Base {};

class Leaf : public Mid {
    void test() {
        api();       // line A
        data_ = 5;   // line B
    }
};`,
    options: [
      "Line A fails but line B compiles: protected inheritance converts public members to private in Mid, while protected members stay protected, so only data_ is reachable from Leaf",
      "Both lines compile: protected inheritance makes the base's public and protected members become protected in Mid, so Leaf inherits them as protected and can access them",
      "Both lines fail: protected inheritance blocks all access to every inherited member, making them inaccessible in the derived class body and also in any further-derived classes",
      "Line A compiles but line B fails: protected inheritance preserves public access for functions only, while data members are always downgraded to private in the derived class hierarchy",
    ],
    correctIndex: 1,
    explanation:
      "Protected inheritance makes public and protected members of the base class become protected in the derived class. So Mid::api() and Mid::data_ are both protected. When Leaf inherits publicly from Mid, it can access protected members of Mid. Both lines compile. External code, however, cannot call Mid::api() because it is no longer public.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class.html",
  },
  {
    id: 867,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "When does `dynamic_cast` return `nullptr` instead of throwing an exception?",
    code: `class Base { virtual void f() {} };
class Derived : public Base {};

Base* bp = new Base();
Derived* dp = dynamic_cast<Derived*>(bp);  // line A
Derived& dr = dynamic_cast<Derived&>(*bp); // line B`,
    options: [
      "dynamic_cast always returns nullptr on failure for both pointers and references, and the programmer must check the result explicitly before using either form of the casted value",
      "For pointers it throws std::bad_cast on failure. For references it returns a default-constructed reference wrapper, because references must always bind to a valid object at initialization",
      "For pointers (line A) it returns nullptr on failure. For references (line B) it throws std::bad_cast, because a reference cannot be null and there is no sentinel value to return",
      "dynamic_cast always throws std::bad_cast on failure regardless of whether the target type is a pointer or a reference, and it never returns nullptr in any situation",
    ],
    correctIndex: 2,
    explanation:
      "dynamic_cast uses RTTI to check the actual type at runtime. When casting pointers, failure returns nullptr (you must check before dereferencing). When casting references, failure throws std::bad_cast since references cannot be null. Line A sets dp to nullptr because bp points to a Base, not a Derived. Line B throws.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 868,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `decltype(auto)` deduce as the return type of this function?",
    code: `int global = 42;

decltype(auto) getRef() {
    return (global);  // note the parentheses
}

int main() {
    getRef() = 100;  // ???
}`,
    options: [
      "The code is ill-formed because decltype(auto) cannot be used with return statements containing parenthesized expressions",
      "The return type is `int&&` because the parenthesized expression is an xvalue, and decltype(auto) deduces rvalue references for any expression that is not a simple variable name",
      "The return type is `int` because decltype(auto) always strips references and cv-qualifiers from the deduced type, treating parenthesized expressions the same as bare identifiers",
      "The return type is `int&` because `decltype((global))` yields `int&`",
    ],
    correctIndex: 3,
    explanation:
      "This is a subtle but important rule: `decltype(x)` where x is an unparenthesized name yields the declared type. But `decltype((x))` where the name is parenthesized yields a reference because `(x)` is treated as an lvalue expression, not an id-expression. With `decltype(auto)`, the return type becomes `int&`, so `getRef() = 100` modifies `global`.",
    link: "https://en.cppreference.com/w/cpp/language/decltype.html",
  },
  {
    id: 869,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "Where can a `requires` clause be placed on a function template, and what happens if two placements are used simultaneously?",
    code: `template<typename T>
    requires std::integral<T>      // placement A
T add(T a, T b)
    requires (sizeof(T) >= 4)     // placement B
{ return a + b; }`,
    options: [
      "Both placements are valid and their constraints are combined with logical AND",
      "Only placement B is valid",
      "Both placements are valid but their constraints are combined with logical OR",
      "Only placement A is valid",
    ],
    correctIndex: 0,
    explanation:
      "C++20 allows a requires clause both after the template-parameter-list and after the function-parameter-list. When both are present, the constraints are conjoined (logical AND). Here, T must be std::integral AND have sizeof >= 4. So int (4 bytes) works, but short (2 bytes) does not, even though short is integral.",
    link: "https://en.cppreference.com/w/cpp/language/constraints.html",
  },
  {
    id: 870,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "What does `co_yield` do inside a coroutine, and how does it differ from `co_return`?",
    code: `generator<int> range(int start, int end) {
    for (int i = start; i < end; ++i)
        co_yield i;   // line A
    co_return;        // line B (optional)
}`,
    options: [
      "co_yield and co_return are identical",
      "co_yield suspends the coroutine and produces a value that can be consumed by the caller, then the coroutine can be resumed later. co_return finishes the coroutine permanently",
      "co_yield terminates the coroutine permanently and returns a value, while co_return suspends it temporarily",
      "co_yield buffers all values internally until co_return is reached, then delivers them all at once to the caller as a complete collection rather than yielding one value at a time",
    ],
    correctIndex: 1,
    explanation:
      "co_yield suspends the coroutine and delivers a value to the caller via the promise object's yield_value() method. The coroutine can be resumed to produce the next value. co_return finalizes the coroutine -- after co_return, the coroutine cannot be resumed. This enables lazy generators that produce values on demand.",
    link: "https://en.cppreference.com/w/cpp/language/coroutines.html",
  },
  {
    id: 871,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What does `if constexpr` do that a regular `if` cannot?",
    code: `template<typename T>
std::string describe(T val) {
    if constexpr (std::is_integral_v<T>)
        return "integer: " + std::to_string(val);
    else if constexpr (std::is_floating_point_v<T>)
        return "float: " + std::to_string(val);
    else
        return val.describe();  // only valid for user types
}`,
    options: [
      "if constexpr evaluates the condition at compile time and discards the not-taken branch entirely, so code in the discarded branch is not instantiated and does not need to be valid for T",
      "if constexpr forces both branches to be compiled and validated for all types, but selects which branch to execute at compile time, producing a compile error if either branch is ill-formed",
      "if constexpr works identically to a regular if statement but is restricted to use inside templates only, where it provides no additional semantics beyond documenting compile-time intent",
      "if constexpr evaluates the condition at runtime but is faster than regular if because the compiler inserts branch prediction hints that optimize the CPU's speculative execution pipeline",
    ],
    correctIndex: 0,
    explanation:
      "if constexpr evaluates its condition at compile time. The key difference from a regular if: the discarded branch is not instantiated for the given template argument. Without if constexpr, calling val.describe() would cause a compilation error when T is int, because int has no describe() method. With if constexpr, that branch is simply dropped.",
    link: "https://en.cppreference.com/w/cpp/language/if.html#Constexpr_if",
  },
  {
    id: 872,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What does `const volatile int* p` mean, and what restrictions does it impose?",
    code: `const volatile int* p = (const volatile int*)0xFF00;
int val = *p;   // read #1
int val2 = *p;  // read #2
// *p = 42;     // attempt to write`,
    options: [
      "const and volatile are contradictory qualifiers that cancel each other out, so the declaration is equivalent to int* p and the compiler is free to optimize or reorder all accesses",
      "The pointer itself is constant and volatile, so p cannot be reassigned and each use of p itself is re-read from memory, but the pointed-to int has no special qualifiers applied",
      "The pointed-to int is both const and volatile: reads cannot be optimized away by the compiler (volatile), but writing through p is forbidden (const). Both reads above must actually occur",
      "The volatile qualifier only applies during multi-threaded access, so in a single-threaded program the compiler may still combine the two reads into one load instruction from memory",
    ],
    correctIndex: 2,
    explanation:
      "const volatile int* means 'pointer to an int that is both const and volatile'. const prevents writing through p (*p = 42 is ill-formed). volatile prevents the compiler from optimizing away or reordering reads -- both reads must generate separate load instructions. The qualifiers are not contradictory: hardware registers are often read-only but change externally.",
    link: "https://en.cppreference.com/w/cpp/language/cv.html",
  },
  {
    id: 873,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What is the difference between `noexcept` as a specifier and `noexcept` as an operator?",
    code: `void f() noexcept;              // form A
void g() noexcept(noexcept(f())); // form B

constexpr bool b = noexcept(f()); // form C
// Note: f() is NOT called in forms B or C`,
    options: [
      "Form A and B are both specifiers, while form C is invalid and will not compile because noexcept can only appear in function declarations and cannot be used as a standalone expression",
      "The operator form (B and C) evaluates f() at runtime in a try block and returns true if no exception was thrown, making it a safe way to test whether functions throw during execution",
      "Form A is the specifier. Forms B and C use the operator, which evaluates the expression at compile time and returns true if it is declared noexcept",
      "All three forms are specifiers",
    ],
    correctIndex: 2,
    explanation:
      "noexcept has two roles: as a specifier (void f() noexcept) it promises the function won't throw. As an operator (noexcept(expr)) it's a compile-time check returning true if expr is non-throwing. The expression is an unevaluated operand -- f() is never called. The conditional form noexcept(noexcept(f())) uses the operator result to conditionally apply the specifier.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept.html",
  },
  {
    id: 874,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "When a base class uses `alignas`, does the derived class inherit that alignment requirement?",
    code: `struct alignas(64) CacheLine {
    int data;
};

struct Derived : CacheLine {
    char extra;
};

static_assert(alignof(CacheLine) == 64);
// What is alignof(Derived)?`,
    options: [
      "The alignment of Derived is implementation-defined with no guarantees",
      "Derived inherits the alignas(64) requirement",
      "Derived gets alignment 65, because the compiler adds the base alignment of 64 to the derived member's natural alignment of 1, computing the total alignment requirement additively",
      "Derived does NOT inherit alignment",
    ],
    correctIndex: 1,
    explanation:
      "Alignment is inherited. The derived class must contain the base sub-object, which requires 64-byte alignment. The effective alignment of a class is the strictest (largest) alignment of all its sub-objects, base classes, and any alignas specifier. Since CacheLine requires 64-byte alignment, Derived also has at least 64-byte alignment.",
    link: "https://en.cppreference.com/w/cpp/language/alignas.html",
  },
  {
    id: 875,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What does `[[no_unique_address]]` allow the compiler to do, and when does it have no effect?",
    code: `struct Empty {};

struct A {
    [[no_unique_address]] Empty e;
    int x;
};

struct B {
    [[no_unique_address]] Empty e1;
    [[no_unique_address]] Empty e2;
    int x;
};
// sizeof(A) = ?   sizeof(B) = ?`,
    options: [
      "sizeof(A) is sizeof(int)+1 and sizeof(B) is sizeof(int)+2 because each empty class always occupies exactly one byte and the no_unique_address attribute cannot change the physical layout",
      "The attribute is purely an optimizer hint with no effect on layout",
      "sizeof(A) equals sizeof(int) because e can share x's address. sizeof(B) is larger than sizeof(int) because e1 and e2 are the same type and must have distinct addresses from each other",
      "Both A and B have sizeof equal to sizeof(int), because the attribute eliminates all empty members from the layout entirely, regardless of type",
    ],
    correctIndex: 2,
    explanation:
      "[[no_unique_address]] lets the compiler give an empty member zero size (overlapping with other members). In A, e can overlap with x, so sizeof(A) == sizeof(int). But in B, e1 and e2 are the same type -- the C++ object model requires distinct objects of the same type to have distinct addresses. So e2 cannot overlap with e1, making B larger.",
    link: "https://en.cppreference.com/w/cpp/language/attributes/no_unique_address.html",
  },
  {
    id: 876,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What is the type of a `u8` string literal in C++20, and why was this a breaking change?",
    code: `auto s1 = u8"hello";        // C++17 vs C++20
const char* p = u8"hello";  // Does this compile in C++20?

// C++17: u8"hello" has type const char[6]
// C++20: u8"hello" has type ???`,
    options: [
      "In C++20, u8 literals remain const char[] but gain a special encoding tag. The assignment to const char* still compiles, and char8_t is just an alias for unsigned char with no type distinction",
      "In C++20, u8 literals become std::u8string objects rather than arrays, so auto deduces std::u8string and the const char* assignment fails because string objects cannot decay to raw pointers",
      "In C++20, u8 literals produce const unsigned char[] and char8_t is simply a typedef for unsigned char. The const char* assignment compiles with an implicit signed-to-unsigned conversion",
      "In C++20, u8 literals are const char8_t[], which is a distinct type from const char[]. The assignment to const char* is ill-formed because char8_t does not implicitly convert to char in C++20",
    ],
    correctIndex: 3,
    explanation:
      "C++20 introduced char8_t as a distinct type. u8 string literals changed from const char[N] to const char8_t[N]. This is a breaking change: code like 'const char* p = u8\"hello\"' that compiled in C++17 becomes ill-formed in C++20 because there is no implicit conversion from char8_t* to char*. char8_t is defined as having the same size/alignment as unsigned char but is a distinct type.",
    link: "https://en.cppreference.com/w/cpp/language/string_literal.html",
  },
  {
    id: 877,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What is the key difference between `constinit` and `constexpr` for variables with static storage duration?",
    code: `constexpr int a = 42;      // OK
constinit int b = 42;      // OK

// Later in the program:
// a = 100;  // Error?
// b = 100;  // Error?

constinit const int c = 42;
constinit thread_local int d = 0;`,
    options: [
      "constinit is for thread_local variables exclusively, while constexpr works for any storage duration. Using constinit on a non-thread_local variable like b above is ill-formed in standard C++20",
      "constexpr makes the variable const and requires compile-time initialization. constinit only requires compile-time initialization but does NOT make the variable const",
      "constinit and constexpr are interchangeable for static duration variables",
      "constexpr variables can only hold literal types, while constinit variables can hold any type including those with non-trivial destructors, as long as the initial value is a constant expression",
    ],
    correctIndex: 1,
    explanation:
      "constexpr on a variable implies const -- the variable cannot be modified. constinit ensures the initializer is a constant expression (preventing the 'static initialization order fiasco') but does NOT imply const. So 'b = 100' is perfectly valid. constinit can be used with static or thread_local storage duration. Both prevent dynamic initialization, but only constexpr prevents mutation.",
    link: "https://en.cppreference.com/w/cpp/language/constinit.html",
  },
  {
    id: 878,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What does the `export` keyword do in C++20 modules, and what can be exported?",
    code: `// mymodule.cppm
export module mymodule;

export int publicFunc() { return 1; }
int internalFunc() { return 2; }

export class Widget { /* ... */ };

export namespace api {
    void doStuff();
}`,
    options: [
      "export makes declarations visible to importers of the module. Non-exported declarations like internalFunc exist in the module but are not reachable by name from importing translation units",
      "export causes the compiler to emit a separate object file for each exported symbol, enabling lazy linking where only the symbols actually used by the importer are linked into the final binary",
      "export is optional syntactic sugar",
      "export can only be applied to functions and classes but not to namespaces or variables",
    ],
    correctIndex: 0,
    explanation:
      "In C++20 modules, export controls visibility. Exported declarations are reachable by name when the module is imported. Non-exported declarations (like internalFunc) are part of the module but invisible to importers -- similar to unnamed-namespace or static linkage in headers. You can export functions, classes, variables, namespaces, and even using-declarations. export applies to the module interface, not the ABI.",
    link: "https://en.cppreference.com/w/cpp/language/modules.html",
  },
  {
    id: 879,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What is the difference between `decltype(x)` and `decltype((x))` when x is a local variable?",
    code: `int x = 42;

decltype(x)   a = x;   // type of a?
decltype((x)) b = x;   // type of b?

a = 100;  // effect on x?
b = 100;  // effect on x?`,
    options: [
      "Both forms produce the same type int because the parentheses around x are redundant and have no semantic effect on decltype's type deduction rules for named variables",
      "decltype(x) yields int and decltype((x)) yields int&& because wrapping x in parentheses converts it into an xvalue expression that binds to rvalue references",
      "decltype(x) yields int and decltype((x)) yields const int& because the parenthesized form creates a temporary copy that binds to a const reference per the language's lifetime rules",
      "decltype(x) yields int. decltype((x)) yields int& because (x) is an lvalue expression, so b is a reference to x and b=100 modifies x",
    ],
    correctIndex: 3,
    explanation:
      "decltype has two rules: (1) if the operand is an unparenthesized id-expression, it yields the declared type. (2) otherwise, it yields a type reflecting the value category: lvalue -> T&, xvalue -> T&&, prvalue -> T. Since x is an lvalue, (x) is also an lvalue expression, so decltype((x)) is int&. This is a famous gotcha -- the extra parentheses change the result from int to int&.",
    link: "https://en.cppreference.com/w/cpp/language/decltype.html",
  },
  {
    id: 880,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "How do `mutable` lambda captures interact with `constexpr` evaluation in C++?",
    code: `auto f = [x = 0]() mutable { return ++x; };
f(); f(); int result = f();  // result = 3

constexpr auto g = [x = 0]() mutable { return ++x; };
// constexpr int val = g();  // Does this compile?`,
    options: [
      "A mutable constexpr lambda can only be called once during constant evaluation",
      "The mutable keyword on a lambda is incompatible with constexpr in all contexts",
      "A mutable lambda can be constexpr, but calling it in a constant expression is ill-formed because the mutation of x violates the requirement that constexpr evaluation must not modify objects created before the evaluation",
      "Both the declaration and the call compile: mutable lambdas in constexpr context create a fresh copy of captured state per constant evaluation, so each constexpr call independently starts with x equal to zero",
    ],
    correctIndex: 2,
    explanation:
      "A lambda can be constexpr even if marked mutable. The constexpr specifier on g is valid. However, calling g() in a constant expression fails: g.operator()() modifies the captured x, which was created outside the constant expression evaluation. Constant expressions cannot modify objects with lifetimes that began outside the evaluation. The lambda object g itself persists between calls, so its state is 'pre-existing'.",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 881,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "The `static` keyword has different meanings in different contexts. What does `static` do in each of these four uses?",
    code: `static int fileVar = 1;         // (1) file scope
void f() {
    static int localVar = 2;    // (2) function scope
}
class C {
    static int memberVar;       // (3) class scope
};
if (static int n = get(); n > 0) {} // (4) if-init`,
    options: [
      "All four uses give internal linkage: (1) limits fileVar to the current translation unit, (2) limits localVar to the enclosing function body, (3) limits memberVar to the class definition, and (4) restricts n to the if-block",
      "(1) prevents the variable from being modified after initialization like const does, (2) makes localVar a compile-time constant evaluated at compilation, (3) allocates memberVar on the stack rather than the heap for faster access, and (4) is purely syntactic sugar with no semantic effect on n",
      "(1) internal linkage only with no effect on lifetime, (2) persistent lifetime across calls but still has external linkage by default, (3) shared across all instances and given external linkage, and (4) n has static storage duration that persists well past the if-block into the surrounding function",
      "(1) internal linkage, (2) static storage duration, (3) one instance shared by all objects, (4) block-scope static storage with lifetime extending beyond the if statement",
    ],
    correctIndex: 3,
    explanation:
      "(1) file-scope static gives internal linkage -- the symbol is invisible to other translation units. (2) function-scope static gives the variable static storage duration: it's initialized once (thread-safely in C++11+) and persists for the program's lifetime. (3) class-scope static means one copy shared across all instances, with external linkage (must be defined in one TU). (4) if-init with static makes n a block-scope variable with static storage duration -- it outlives the if-block.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 882,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "What is the key difference between a `while` loop and a `do-while` loop in C++?",
    options: [
      "A do-while loop always executes its body at least once",
      "A while loop always executes its body at least once",
      "A do-while loop cannot use a boolean condition to stop",
      "A while loop does not support break or continue inside",
    ],
    correctIndex: 0,
    explanation:
      "A do-while loop checks the condition after executing the body, so the body is guaranteed to run at least once. A while loop checks the condition before the body, meaning it may never execute if the condition is initially false.",
    link: "https://www.learncpp.com/cpp-tutorial/do-while-statements/",
  },
  {
    id: 883,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "Which of the following is a valid range-based `for` loop in C++?",
    code: `std::vector<int> v = {1, 2, 3};`,
    options: [
      "for) { cout << i; }",
      "for) { cout << x; }",
      "for (int x : v) { cout << x; }",
      "for (v : int x) { cout << x; }",
    ],
    correctIndex: 2,
    explanation:
      "The range-based for loop syntax is `for (element_declaration : range_expression)`. The form `for (int x : v)` iterates over each element in the vector v, copying each value into x.",
    link: "https://www.learncpp.com/cpp-tutorial/range-based-for-loops-for-each/",
  },
  {
    id: 884,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "What does the `void` keyword mean when used as a function return type in C++?",
    options: [
      "The function returns a null pointer value",
      "The function does not return any value",
      "The function can return any type of value",
      "The function returns zero by default always",
    ],
    correctIndex: 1,
    explanation:
      "When void is used as a return type, it indicates the function does not return a value. A void function executes its statements and then returns control to the caller without producing a result.",
    link: "https://www.learncpp.com/cpp-tutorial/void-functions-non-value-returning-functions/",
  },
  {
    id: 885,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "In C++, what happens when a non-zero integer is implicitly converted to `bool`?",
    code: `int x = 42;
bool b = x;`,
    options: [
      "The program produces a compilation error",
      "The bool variable b is set to false (0)",
      "The bool variable b stores the value 42",
      "The bool variable b is set to true (1)",
    ],
    correctIndex: 3,
    explanation:
      "In C++, any non-zero integer value converts to true when assigned to a bool. Only the value 0 converts to false. So b will hold the value true, which is equivalent to 1.",
    link: "https://www.learncpp.com/cpp-tutorial/boolean-values/",
  },
  {
    id: 886,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "In modern C++, which is the recommended way to represent a null pointer?",
    options: [
      "Use nullptr, which is a type-safe null pointer literal",
      "Use NULL, which is the safest macro for null pointers",
      "Use the integer literal 0 as the null pointer value",
      "All three -- nullptr, NULL, and 0 -- are equivalent",
    ],
    correctIndex: 0,
    explanation:
      "nullptr (introduced in C++11) is the recommended null pointer literal because it has its own type (std::nullptr_t) and cannot be implicitly converted to an integer. NULL is a macro that may be defined as 0 or (void*)0, which can cause ambiguity in overload resolution.",
    link: "https://www.learncpp.com/cpp-tutorial/null-pointers/",
  },
  {
    id: 887,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "What does `const_cast` do in C++?",
    options: [
      "It converts an object from one type to another type safely",
      "It performs a runtime type check before doing a cast",
      "It adds or removes const (or volatile) from a variable",
      "It reinterprets the raw bit pattern of a given object",
    ],
    correctIndex: 2,
    explanation:
      "const_cast is used to add or remove the const (or volatile) qualifier from a variable. It is the only C++ cast that can remove const. It does not change the underlying type of the object.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast",
  },
  {
    id: 888,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question: "Why is `reinterpret_cast` considered dangerous in C++?",
    options: [
      "It always causes a runtime exception when used",
      "It converts bit patterns without any type safety checks",
      "It can only be used on fundamental types like int",
      "It requires explicit compiler flags to be enabled",
    ],
    correctIndex: 1,
    explanation:
      "reinterpret_cast simply reinterprets the underlying bit pattern of one type as another, performing no safety or validity checks. This can easily lead to undefined behavior if the resulting type is incompatible with the original data.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast",
  },
  {
    id: 889,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "What is the correct syntax to declare a simple function template in C++?",
    options: [
      "template T add<T>(T a, T b) { return a + b; }",
      "T add(T a, T b) template<typename T> { return a + b; }",
      "template<typename T> { T add(T a, T b); return a + b; }",
      "template<typename T> T add(T a, T b) { return a + b; }",
    ],
    correctIndex: 3,
    explanation:
      "A function template begins with template<typename T> (or template<class T>), followed by the normal function declaration. The template parameter T can then be used in the return type, parameters, and body of the function.",
    link: "https://www.learncpp.com/cpp-tutorial/function-templates/",
  },
  {
    id: 890,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "What is the default access specifier for members of a `struct` compared to a `class` in C++?",
    options: [
      "Both struct and class default to private access",
      "Both struct and class default to public access",
      "struct defaults to public, class defaults to private",
      "struct defaults to private, class defaults to public",
    ],
    correctIndex: 2,
    explanation:
      "In C++, the only difference between struct and class (aside from the keyword) is the default access level. Members of a struct are public by default, while members of a class are private by default.",
    link: "https://www.learncpp.com/cpp-tutorial/public-and-private-members-and-access-specifiers/",
  },
  {
    id: 891,
    difficulty: "Easy",
    topic: "C++ Keywords",
    question:
      "What happens when an `unsigned int` overflows (goes past its maximum value) in C++?",
    options: [
      "It wraps around to zero via modular arithmetic rules",
      "It triggers undefined behavior like signed overflow does",
      "It throws a std::overflow_error runtime exception",
      "It is clamped at the maximum representable int value",
    ],
    correctIndex: 0,
    explanation:
      "Unsigned integer overflow in C++ is well-defined: the result wraps around using modulo 2^N arithmetic, where N is the number of bits. Signed integer overflow, by contrast, is undefined behavior.",
    link: "https://www.learncpp.com/cpp-tutorial/unsigned-integers-and-why-to-avoid-them/",
  },
  {
    id: 892,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "Why does `volatile` NOT provide thread safety in C++?",
    code: `volatile int counter = 0;

// Thread 1:
counter++;

// Thread 2:
counter++;`,
    options: [
      "volatile forces every access to go through main memory, but the compiler still combines multiple volatile reads into one optimized load instruction",
      "volatile is thread-safe in practice because all modern CPUs implement it with hardware memory barriers",
      "volatile prevents the compiler from optimizing away reads/writes, but it does not insert memory fences or prevent CPU instruction reordering between threads",
      "volatile only applies to reads, not writes",
    ],
    correctIndex: 2,
    explanation:
      "volatile tells the compiler not to optimize away or reorder accesses to the variable at the compiler level. However, it provides no memory ordering guarantees at the CPU level -- hardware can still reorder loads and stores. For thread safety, use std::atomic, which provides both compiler and hardware memory ordering guarantees. The counter++ operation is also non-atomic (read-modify-write), which volatile does nothing to protect.",
    link: "https://en.cppreference.com/w/cpp/language/cv.html",
  },
  {
    id: 893,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "In C++14 and later, which of the following is a valid `constexpr` function?",
    code: `constexpr int sum_to(int n) {
    int total = 0;
    for (int i = 1; i <= n; ++i)
        total += i;
    return total;
}

static_assert(sum_to(5) == 15);`,
    options: [
      "This is valid in C++14+: constexpr functions can contain local variables, loops, and multiple statements as long as the result is computable at compile time",
      "This is invalid because constexpr functions cannot declare local variables",
      "This is invalid because constexpr functions must consist of a single return statement",
      "This compiles but the loop runs at runtime only",
    ],
    correctIndex: 0,
    explanation:
      "C++11 constexpr functions were limited to essentially a single return statement. C++14 relaxed these restrictions significantly, allowing local variables, loops (for, while), if-else branches, and multiple statements. The function can still be evaluated at compile time as long as all inputs are constant expressions. The static_assert proves sum_to(5) is computed at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr.html",
  },
  {
    id: 894,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "How does marking a move constructor `noexcept` affect std::vector performance?",
    code: `class Widget {
public:
    Widget(Widget&& other) noexcept;  // A
    Widget(Widget&& other);           // B -- no noexcept
};`,
    options: [
      "It makes no difference",
      "With noexcept (A), vector::push_back uses move when reallocating; without it (B), vector falls back to copying to maintain the strong exception guarantee",
      "The noexcept version (A) runs faster because the compiler skips generating stack unwinding code, but vector uses it the same way as version (B)",
      "Without noexcept (B), the vector refuses to compile when push_back triggers reallocation",
    ],
    correctIndex: 1,
    explanation:
      "When std::vector reallocates (e.g., during push_back), it must move or copy elements to the new buffer. If moving an element throws, some elements would be in the new buffer and some in the old -- violating the strong exception guarantee. So vector only moves elements if the move constructor is noexcept. Without noexcept, it copies them instead, which can be significantly slower for types like std::string.",
    link: "https://en.cppreference.com/w/cpp/utility/move_if_noexcept.html",
  },
  {
    id: 895,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "Why can a `static` member function NOT access the `this` pointer?",
    code: `class Logger {
    int logLevel;
public:
    static void setDefault() {
        // this->logLevel = 1;  // Error!
    }
};`,
    options: [
      "A static member function does have a this pointer, but it points to a shared global instance",
      "A static member function has access to this, but only if the class has exactly one instance",
      "The compiler hides the this pointer from static functions as an optimization",
      "A static member function belongs to the class, not any instance",
    ],
    correctIndex: 3,
    explanation:
      "Non-static member functions receive a hidden 'this' parameter pointing to the object they are called on. Static member functions are associated with the class itself, not any particular object, so they receive no such hidden parameter. They can be called without an object (Logger::setDefault()), which means there is simply no instance for 'this' to point to. They can only access other static members.",
    link: "https://en.cppreference.com/w/cpp/language/static.html",
  },
  {
    id: 896,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "When is the `mutable` keyword useful on a class data member?",
    code: `class QueryCache {
    mutable std::unordered_map<int, int> cache;
    int computeExpensive(int x) const {
        if (cache.count(x)) return cache[x];
        int result = /* ... */ x * x;
        cache[x] = result;  // OK: cache is mutable
        return result;
    }
};`,
    options: [
      "mutable makes the member thread-safe so it can be accessed from multiple const methods concurrently without needing a mutex or atomic operations",
      "mutable lets the member be modified in constructors only",
      "mutable allows modifying the member even in const member functions",
      "mutable forces the member to be stored on the heap instead of inline in the object, allowing it to be resized and modified after construction finishes",
    ],
    correctIndex: 2,
    explanation:
      "The mutable keyword allows a data member to be modified even when accessed through a const reference or inside a const member function. This is for members that are implementation details, not part of the object's logical (observable) state. Common examples include caches (as shown), mutexes (needed to make const methods thread-safe), and debug/logging counters.",
    link: "https://en.cppreference.com/w/cpp/language/cv.html",
  },
  {
    id: 897,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question: "What error does the `override` specifier help catch at compile time?",
    code: `class Base {
public:
    virtual void process(int x) const;
};

class Derived : public Base {
public:
    void process(int x) override;  // Missing const!
};`,
    options: [
      "override changes the function's linkage to external so that the linker can detect mismatched signatures across translation units at link time",
      "override only documents intent for human readers",
      "override prevents the derived function from being called through a base pointer",
      "override forces a compile error if the function does not actually override a base virtual function",
    ],
    correctIndex: 3,
    explanation:
      "Without 'override', the Derived::process(int) silently creates a new virtual function that hides the base version instead of overriding it. The base function has 'const' but the derived one does not, making them different signatures. The 'override' keyword causes a compile error when the function does not match any virtual function in the base class, catching subtle bugs like mismatched const, different parameter types, or typos in function names.",
    link: "https://en.cppreference.com/w/cpp/language/override.html",
  },
  {
    id: 898,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "Can a `friend` function of a base class access private members of a derived class?",
    code: `class Base {
    int secret = 42;
    friend void peek(Base& b);
};

class Derived : public Base {
    int derivedSecret = 99;
};

void peek(Base& b) {
    b.secret;          // OK
    // b.derivedSecret; // ??
}`,
    options: [
      "No -- friendship is not inherited. peek() can access Base::secret but not Derived::derivedSecret, even when passed a Derived object by reference",
      "Yes -- friendship extends to all derived classes automatically, so peek() can access both Base::secret and Derived::derivedSecret through any reference",
      "It depends on the inheritance type: public inheritance shares friendship with derived classes, but private and protected inheritance do not share it",
      "Yes, but only if the derived class re-declares peek() as a friend",
    ],
    correctIndex: 0,
    explanation:
      "Friendship is not inherited and not transitive in C++. A friend of Base can access Base's private members, but gains no special access to Derived's private members. Even if peek() receives a Derived object (via a Base& reference), it can only access the Base portion's private members. For peek() to access Derived::derivedSecret, Derived would need to independently declare peek() as its own friend.",
    link: "https://en.cppreference.com/w/cpp/language/friend.html",
  },
  {
    id: 899,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "What does C++20's `explicit(bool)` conditional explicit allow you to do?",
    code: `template<typename T>
class Wrapper {
public:
    explicit(!std::is_convertible_v<T, int>)
    Wrapper(T val) : value(val) {}
private:
    T value;
};`,
    options: [
      "explicit(bool) makes the constructor conditionally virtual",
      "It conditionally marks the constructor explicit based on a compile-time boolean",
      "explicit(bool) is a runtime check",
      "It makes the constructor constexpr when the condition is true and non-constexpr when false",
    ],
    correctIndex: 1,
    explanation:
      "C++20's explicit(bool) lets you conditionally apply the explicit specifier based on a compile-time boolean expression. When the condition is false, implicit conversions are allowed; when true, only explicit construction works. This is invaluable for wrapper types like std::pair and std::tuple that should mirror the convertibility of their element types. Before C++20, this required SFINAE or separate overloads.",
    link: "https://en.cppreference.com/w/cpp/language/explicit.html",
  },
  {
    id: 900,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "How do C++17 `inline` variables solve the One Definition Rule (ODR) problem in header files?",
    code: `// config.h (included by multiple .cpp files)
inline int maxRetries = 3;
inline const std::string appName = "MyApp";`,
    options: [
      "inline variables are evaluated at compile time like constexpr",
      "inline variables are given internal linkage, so each translation unit gets its own independent copy",
      "inline variables can appear in multiple translation units and the linker merges them into one definition",
      "inline variables must be defined inside a function body",
    ],
    correctIndex: 2,
    explanation:
      "Before C++17, defining a non-const variable in a header included by multiple .cpp files caused linker errors (multiple definitions). The inline specifier tells the linker that identical definitions across translation units should be merged into a single entity. All TUs share one instance with the same address. This is especially useful for class static members: 'inline static int count = 0;' can be defined directly in the class body.",
    link: "https://en.cppreference.com/w/cpp/language/inline.html",
  },
  {
    id: 901,
    difficulty: "Medium",
    topic: "C++ Keywords",
    question:
      "What is the difference between `auto` and `decltype(auto)` as a function return type?",
    code: `int x = 42;
int& getRef() { return x; }

auto f()           { return getRef(); }  // A
decltype(auto) g() { return getRef(); }  // B`,
    options: [
      "f() returns int, while g() returns int& preserves the exact type including references and cv-qualifiers)",
      "Both return int& because the compiler always deduces the exact return type of getRef() regardless of whether auto or decltype(auto) is used as the return type",
      "f() returns int& and g() returns int",
      "They are identical in behavior",
    ],
    correctIndex: 0,
    explanation:
      "auto applies template argument deduction rules, which strip references and top-level cv-qualifiers. So f() deduces int from the int& returned by getRef(). decltype(auto) applies decltype rules to the return expression, preserving the exact type. Since getRef() returns int&, g() returns int&. This distinction matters for forwarding functions and proxy objects where preserving reference semantics is essential.",
    link: "https://en.cppreference.com/w/cpp/language/auto.html",
  },
  {
    id: 902,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "A class has a `const` member function that modifies a `mutable` counter. Is this function inherently thread-safe?",
    code: `class Widget {
  mutable int accessCount = 0;
public:
  int getData() const {
    ++accessCount;  // legal: mutable
    return 42;
  }
};`,
    options: [
      "Yes -- const methods are read-only by definition so the compiler serializes all access to mutable members",
      "No -- const only means logical constness; mutable members can be modified without any synchronization",
      "Yes -- the mutable keyword implicitly wraps the member in a std::atomic for safe concurrent access",
      "No -- but the compiler emits a warning that is promoted to an error under -Wall and -Wthread-safety",
    ],
    correctIndex: 1,
    explanation:
      "The const qualifier on a member function means logical constness -- it promises not to modify the observable state. However, mutable members bypass this restriction at the language level. No synchronization is provided automatically: concurrent calls to getData() from multiple threads create a data race on accessCount. You must use std::atomic or a mutex to make it safe.",
    link: "https://en.cppreference.com/w/cpp/language/cv",
  },
  {
    id: 903,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "In C++20, when is a `constexpr` destructor allowed, and what does it enable?",
    code: `struct S {
  int* p;
  constexpr S(int v) : p(new int(v)) {}
  constexpr ~S() { delete p; }
};
constexpr int test() {
  S obj(10);
  return *obj.p;
}`,
    options: [
      "It is allowed when the body satisfies constexpr rules, enabling compile-time destruction of objects that use transient dynamic allocation",
      "It requires every data member to be a literal type and only enables trivial destruction at compile time with no dynamic memory support",
      "It is always ill-formed because delete expressions cannot appear inside any constexpr evaluation context per the C++20 standard text",
      "It is allowed only for empty classes with no data members and enables constexpr-compatible polymorphism via virtual destructor dispatch",
    ],
    correctIndex: 0,
    explanation:
      "C++20 permits constexpr destructors and allows new/delete within constant evaluation, provided all allocated memory is deallocated before the evaluation completes (transient allocation). The destructor body itself must satisfy constexpr requirements. This enables types like constexpr containers that perform dynamic memory management entirely at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr",
  },
  {
    id: 904,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What does placement `new` do in this code, and when must you manually call the destructor?",
    code: `alignas(Widget) char buf[sizeof(Widget)];
Widget* w = new (buf) Widget(42);
// ... use w ...
w->~Widget();  // manual destructor call`,
    options: [
      "Placement new allocates memory from buf, and the destructor call is optional because buf's scope handles cleanup automatically",
      "Placement new bypasses the allocator and calls the constructor only, but the destructor is automatically invoked when buf goes out of scope",
      "Placement new constructs an object at the given address without allocating memory, and you must call the destructor explicitly because delete would free buf",
      "Placement new is equivalent to a reinterpret_cast followed by assignment, and the destructor call is only needed when buf is heap-allocated",
    ],
    correctIndex: 2,
    explanation:
      "Placement new constructs an object in pre-existing storage without allocating memory. Since the memory was not obtained via operator new, calling delete would be undefined behavior (it would try to free stack memory). You must explicitly call the destructor to properly clean up the object. The raw memory (buf) is then reclaimed by its own scope or allocator.",
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  {
    id: 905,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "Why is `volatile` NOT a valid replacement for `std::atomic` in multithreaded code?",
    code: `volatile int flag = 0;  // Thread 1 sets flag
// Thread 2 reads flag

// vs.
std::atomic<int> flag2{0};
// Thread 1: flag2.store(1);
// Thread 2: flag2.load();`,
    options: [
      "volatile forces the compiler to use a mutex internally, which is slower than the lock-free guarantees of std::atomic",
      "volatile prevents all compiler optimizations on the variable, making it slower than atomic but equally correct for concurrency",
      "volatile and atomic are interchangeable on x86 platforms but volatile fails only on ARM and other weakly-ordered architectures",
      "volatile prevents compiler reordering of reads/writes to that variable but provides no memory ordering guarantees or atomicity for the CPU",
    ],
    correctIndex: 3,
    explanation:
      "volatile tells the compiler not to optimize away or reorder accesses to the variable, but it says nothing about CPU memory ordering or atomicity. On modern hardware, the CPU can still reorder volatile accesses relative to other memory operations. std::atomic provides both atomicity and configurable memory ordering (seq_cst by default), making it correct for inter-thread communication.",
    link: "https://en.cppreference.com/w/cpp/language/cv",
  },
  {
    id: 906,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What happens if you use `delete` instead of `delete[]` on an array allocated with `new[]`?",
    code: `struct Obj {
  int val;
  ~Obj() { std::cout << "dtor "; }
};
Obj* arr = new Obj[5];
delete arr;  // wrong: should be delete[]`,
    options: [
      "Undefined behavior -- the standard does not specify what happens when delete is mismatched with new[], so any outcome is possible",
      "Only the first element's destructor runs but the memory is fully freed, causing a resource leak but no undefined behavior",
      "The compiler detects the mismatch and automatically promotes delete to delete[] for array allocations at runtime",
      "All five destructors run in reverse order but the deallocation function receives an incorrect size, causing a memory leak",
    ],
    correctIndex: 0,
    explanation:
      "Using delete on memory allocated with new[] (or vice versa) is undefined behavior per the C++ standard. In practice, it may call only one destructor, corrupt the heap metadata, leak memory, or crash -- but no specific outcome is guaranteed. The compiler does not detect this mismatch, and no automatic promotion occurs.",
    link: "https://en.cppreference.com/w/cpp/language/delete",
  },
  {
    id: 907,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "Why is the `typename` keyword mandatory when accessing a dependent type inside a template?",
    code: `template<typename T>
void process() {
  typename T::iterator it;  // typename required
  // Without typename, the compiler assumes
  // T::iterator is a value, not a type.
}`,
    options: [
      "typename is needed because dependent names could collide with global namespace identifiers, and it acts as disambiguation",
      "typename tells the compiler that T::iterator names a type, because dependent names are assumed to be non-types by default",
      "typename is required only when T is a pointer type; for class types the compiler can always deduce that it names a type",
      "typename is syntactic sugar that helps IDEs with code completion but has no effect on the actual compilation of templates",
    ],
    correctIndex: 1,
    explanation:
      "During the first phase of two-phase lookup, the compiler cannot resolve dependent names (names that depend on a template parameter). By default, it assumes a dependent qualified name is a non-type (value or template). The typename keyword explicitly tells the compiler to parse T::iterator as a type name, which is necessary for the declaration to be valid.",
    link: "https://en.cppreference.com/w/cpp/language/dependent_name",
  },
  {
    id: 908,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "What is the key difference between the deprecated `throw()` specification and modern `noexcept`?",
    code: `void old_style() throw();    // C++98, deprecated C++17, removed C++20
void modern() noexcept;      // C++11 and later

// What happens if either function throws?`,
    options: [
      "throw() calls std::unexpected() then std::terminate() while noexcept calls std::terminate() only, but both allow stack unwinding",
      "throw() silently catches and discards the exception while noexcept converts it into a std::error_code return value automatically",
      "throw() is purely advisory with no runtime effect while noexcept generates a compiler error if a throw statement appears in the body",
      "throw() invokes std::unexpected() which may rethrow or terminate, while noexcept calls std::terminate() directly and may skip unwinding",
    ],
    correctIndex: 3,
    explanation:
      "When a function declared throw() throws, std::unexpected() is called, which by default calls std::terminate(). With noexcept, std::terminate() is called directly. Crucially, noexcept allows implementations to skip stack unwinding entirely, which enables better optimizations. The throw() mechanism was removed in C++20 (except throw() being equivalent to noexcept).",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec",
  },
  {
    id: 909,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "How does a generic lambda with `auto` parameters (C++14/20) differ from an explicit function template?",
    code: `auto lam = [](auto x, auto y) { return x + y; };
// vs.
template<typename T, typename U>
auto func(T x, U y) { return x + y; }`,
    options: [
      "The lambda version cannot be overloaded or specialized but the function template can be partially specialized for specific types",
      "The lambda deduces all parameter types as the same type while the function template allows independent type deduction per parameter",
      "They generate equivalent templated call operators, but the lambda creates a unique closure type that cannot be named or forward-declared",
      "The lambda auto parameters are resolved at runtime via type erasure while the function template is fully resolved at compile time only",
    ],
    correctIndex: 2,
    explanation:
      "A generic lambda with auto parameters generates a closure type with a templated operator(). Each auto parameter gets its own independent template parameter, just like the function template. The key difference is that the lambda's type is a unique unnamed class generated by the compiler -- it cannot be forward-declared, named in another context, or used as a template argument without decltype.",
    link: "https://en.cppreference.com/w/cpp/language/lambda",
  },
  {
    id: 910,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "When round-tripping a pointer through `void*`, which cast is guaranteed safe by the standard?",
    code: `int x = 42;
void* vp = static_cast<void*>(&x);

// Option A:
int* a = static_cast<int*>(vp);
// Option B:
int* b = reinterpret_cast<int*>(vp);`,
    options: [
      "static_cast is guaranteed to yield the original pointer value; reinterpret_cast is implementation-defined for void* conversions",
      "reinterpret_cast is the only correct cast for void* because static_cast cannot convert between unrelated pointer types safely",
      "Both casts are guaranteed equivalent for void* round-trips and always produce identical results per the C++ standard text",
      "Neither cast is safe",
    ],
    correctIndex: 0,
    explanation:
      "The standard guarantees that static_cast from T* to void* and back to T* yields the original pointer. For reinterpret_cast, the void* round-trip is specified to work in practice (the standard says the result is the same as static_cast in this case), but static_cast is the idiomatic and directly guaranteed choice. reinterpret_cast is designed for conversions between unrelated pointer types, not void* round-trips.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 911,
    difficulty: "Hard",
    topic: "C++ Keywords",
    question:
      "How do `consteval` and `constexpr` interact? Can a `consteval` function call a `constexpr` one and vice versa?",
    code: `constexpr int square(int x) { return x * x; }
consteval int cube(int x) { return x * square(x); }

constexpr int test() {
  // return cube(3);  // Is this valid?
  return square(3);
}`,
    options: [
      "Neither can call the other because consteval and constexpr are separate evaluation domains with no cross-invocation allowed",
      "constexpr functions can freely call consteval functions because constexpr is a superset that includes compile-time evaluation",
      "Both can call the other without restriction",
      "consteval can call constexpr functions, but constexpr cannot call consteval unless the call itself is a constant expression",
    ],
    correctIndex: 3,
    explanation:
      "A consteval (immediate) function must produce a constant at compile time, so it can call constexpr functions (which are valid in constant expressions). However, a constexpr function may be called at runtime, where consteval functions are forbidden. A constexpr function can only call a consteval function if that specific call is guaranteed to be evaluated as a constant expression (e.g., the result is used in a constant context).",
    link: "https://en.cppreference.com/w/cpp/language/consteval",
  },
];
