import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 1092,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "What does automatic storage duration mean in C++?",
    options: [
      "The variable is created at declaration and destroyed when its scope ends",
      "The variable is allocated on the heap and freed by a garbage collector",
      "The variable persists for the lifetime of the program after creation",
      "The variable is shared between threads and freed when all threads end",
    ],
    correctIndex: 0,
    explanation:
      "Automatic storage duration means the variable is created when its declaration is reached and automatically destroyed when execution leaves the enclosing scope, typically the closing brace of the block where it was declared.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 1093,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "Which variables have static storage duration in C++?",
    options: [
      "Local variables declared inside a for-loop body",
      "Global variables and variables declared with static",
      "Variables created with new and freed with delete",
      "Function parameters passed by value or reference",
    ],
    correctIndex: 1,
    explanation:
      "Variables declared at namespace scope (globals) and variables declared with the static keyword have static storage duration. They are initialized before or during program startup and destroyed after main() returns.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 1094,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "What is dynamic storage duration in C++?",
    code: `int* p = new int(42);
// ... use *p ...
delete p;`,
    options: [
      "The object exists until the enclosing block scope ends",
      "The object exists until the thread that created it exits",
      "The object exists until it is explicitly deleted by the programmer",
      "The object exists until the program terminates at end of main",
    ],
    correctIndex: 2,
    explanation:
      "Dynamic storage duration means the object is allocated on the heap with new and lives until the programmer explicitly frees it with delete. Failing to delete it results in a memory leak.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 1095,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "What does the thread_local keyword provide in C++?",
    code: `thread_local int count = 0;`,
    options: [
      "It gives each thread its own independent copy of the variable",
      "It makes the variable shared and visible to every thread",
      "It locks the variable so only one thread can access it at a time",
      "It allocates the variable on the heap using dynamic allocation",
    ],
    correctIndex: 0,
    explanation:
      "A variable declared thread_local has thread storage duration, meaning each thread gets its own separate copy. The copy is created when the thread starts and destroyed when the thread ends.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 1096,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "When is a local variable destroyed in C++?",
    code: `void greet() {
    std::string msg = "hello";
    std::cout << msg;
}  // what happens to msg?`,
    options: [
      "When the garbage collector detects it is no longer referenced",
      "Only when the program terminates and the process memory is freed",
      "At the end of the enclosing scope where it was declared",
      "When the programmer explicitly calls a cleanup function on it",
    ],
    correctIndex: 2,
    explanation:
      "Local variables have automatic storage duration. They are destroyed -- and their destructors called -- when execution exits the scope (the closing brace) in which they were declared.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-local-scope/",
  },
  {
    id: 1097,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "When are global variables with static storage duration initialized?",
    code: `int g = 42;  // namespace scope

int main() {
    std::cout << g;
}`,
    options: [
      "They are initialized the first time a function references them",
      "They are initialized after main() returns during cleanup phase",
      "They are initialized lazily when the thread they belong to starts",
      "They are initialized before main() begins executing the program",
    ],
    correctIndex: 3,
    explanation:
      "Global variables with static storage duration undergo initialization before main() starts. Zero-initialization happens first, then constant initialization, and finally dynamic initialization -- all prior to main().",
    link: "https://en.cppreference.com/w/cpp/language/initialization.html",
  },
  {
    id: 1098,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "What is the key behavior of a static local variable?",
    code: `int counter() {
    static int n = 0;
    return ++n;
}`,
    options: [
      "It is re-created and re-initialized every time the function is called",
      "It is destroyed at the end of the function and recreated on next call",
      "It is allocated on the heap and requires manual deletion after use",
      "It is initialized once on first call and persists across all calls",
    ],
    correctIndex: 3,
    explanation:
      "A static local variable is initialized the first time execution reaches its declaration. After that, it retains its value between function calls and is only destroyed when the program ends.",
    link: "https://www.learncpp.com/cpp-tutorial/static-local-variables/",
  },
  {
    id: 1099,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "How long does an object created with new live in C++?",
    code: `auto* widget = new Widget();
// ... widget is used ...`,
    options: [
      "Until the program terminates and the OS reclaims all process memory",
      "Until the scope where the pointer was declared ends and it is popped",
      "Until delete is called on it or the program ends without freeing it",
      "Until the garbage collector determines it is no longer reachable",
    ],
    correctIndex: 2,
    explanation:
      "Objects allocated with new have dynamic storage duration. They persist in memory until the programmer explicitly calls delete. If delete is never called, the memory leaks until the OS reclaims it at program exit.",
    link: "https://en.cppreference.com/w/cpp/language/new.html",
  },
  {
    id: 1100,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "Can an object's lifetime exceed the scope where it was created?",
    code: `int* makeInt() {
    int* p = new int(7);
    return p;
}`,
    options: [
      "No -- scope and lifetime are identical for all C++ objects",
      "No -- every object is destroyed when its declaring scope ends",
      "Yes -- but only for objects allocated with automatic duration",
      "Yes -- dynamically allocated objects outlive their creation scope",
    ],
    correctIndex: 3,
    explanation:
      "Scope and lifetime are distinct concepts. A dynamically allocated object (created with new) lives until explicitly deleted, which can be well after the scope of the pointer variable that holds its address has ended.",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 1101,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: "When is a temporary object destroyed in C++?",
    code: `std::string result = std::string("Hello") + " World";`,
    options: [
      "At the point where the garbage collector next runs its sweep cycle",
      "At the end of the full expression in which the temporary was created",
      "Only when the function containing the expression returns to caller",
      "When the programmer calls delete on the temporary object explicitly",
    ],
    correctIndex: 1,
    explanation:
      "Temporary objects in C++ are destroyed at the end of the full expression that created them, unless their lifetime is extended by binding to a const reference or an rvalue reference.",
    link: "https://en.cppreference.com/w/cpp/language/lifetime.html",
  },
  {
    id: 1102,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "Two global variables in separate translation units depend on each other's initialization. What is the core issue?",
    code: `// file_a.cpp
extern int b;
int a = b + 1;

// file_b.cpp
extern int a;
int b = a + 1;`,
    options: [
      "The initialization order of globals across translation units is unspecified, so a or b may read zero",
      "The linker will detect the circular dependency and produce a compile-time error for both files",
      "Both variables are zero-initialized first, then both are value-initialized to 1 in sorted order",
      "The compiler picks alphabetical order by filename, so file_a.cpp always initializes variable a first",
    ],
    correctIndex: 0,
    explanation:
      "This is the Static Initialization Order Fiasco (SIOF). The C++ standard does not define the initialization order of non-local static variables across different translation units. One variable may read the other before it has been dynamically initialized, seeing zero instead of the intended value.",
    link: "https://en.cppreference.com/w/cpp/language/initialization.html",
  },
  {
    id: 1103,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "What guarantee does the constinit specifier provide when applied to a variable with static storage duration?",
    code: `constinit int global_count = 42;`,
    options: [
      "It makes the variable immutable after initialization, equivalent to declaring it as const here",
      "It forces the variable to be stored in read-only memory alongside string literals in the binary",
      "It guarantees the variable is initialized at compile time, preventing the static init order fiasco",
      "It ensures the variable is initialized before main only if it has no dynamic dependencies at all",
    ],
    correctIndex: 2,
    explanation:
      "constinit (C++20) ensures that a variable with static or thread-local storage duration is constant-initialized. If the initializer is not a constant expression, the program is ill-formed. This eliminates the risk of the static initialization order fiasco for that variable, but unlike constexpr, the variable remains mutable after initialization.",
    link: "https://en.cppreference.com/w/cpp/language/constinit.html",
  },
  {
    id: 1104,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "What happens to the lifetime of the temporary string object in this code?",
    code: `const std::string& ref = std::string("hello");
std::cout << ref;`,
    options: [
      "The temporary is destroyed immediately and ref becomes a dangling reference before the output",
      "The temporary's lifetime is extended to match the lifetime of the const reference variable ref",
      "The temporary is copied into ref's storage, so ref is not actually a reference to a temporary",
      "The temporary persists until the end of the program because it has static storage duration now",
    ],
    correctIndex: 1,
    explanation:
      "When a temporary is bound to a const lvalue reference, the temporary's lifetime is extended to match the lifetime of the reference. This is a special rule in C++ that prevents the dangling reference problem in this specific case. The temporary string lives as long as ref does.",
    link: "https://en.cppreference.com/w/cpp/language/lifetime.html",
  },
  {
    id: 1105,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "How does a variable declared as both thread_local and static behave inside a function?",
    code: `void countCalls() {
  static thread_local int n = 0;
  ++n;
  std::cout << n << '\n';
}`,
    options: [
      "The variable n is shared across all threads because static always overrides thread_local here",
      "The variable n is reinitialized to zero on every function call regardless of the thread used",
      "The combination is ill-formed and produces a compilation error due to conflicting specifiers",
      "Each thread gets its own persistent copy of n that survives across multiple calls to countCalls",
    ],
    correctIndex: 3,
    explanation:
      "When thread_local is combined with static inside a function, the variable has thread storage duration. Each thread gets its own independent copy of n, and that copy persists across multiple calls to the function within that same thread. The static keyword is implied by thread_local for block-scope variables.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 1106,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "What is the programmer's obligation when using placement new to construct an object in a pre-allocated buffer?",
    code: `alignas(Sensor) unsigned char buf[sizeof(Sensor)];
Sensor* s = new (buf) Sensor("temp");
// ... use s ...
// what must happen before buf is reused?`,
    options: [
      "The destructor must be called explicitly because placement new does not register automatic cleanup",
      "The delete operator must be called on s to free the underlying buffer and destroy the Sensor",
      "Nothing is required because the Sensor is destroyed automatically when buf goes out of scope",
      "The programmer must call std::destroy_at followed by operator delete on the buffer's address",
    ],
    correctIndex: 0,
    explanation:
      "Placement new constructs an object in existing memory without allocating. Since no allocation occurred, calling delete would be wrong. The programmer must explicitly call the destructor (s->~Sensor() or std::destroy_at(s)) to end the object's lifetime. The buffer itself is managed separately.",
    link: "https://en.cppreference.com/w/cpp/language/new.html",
  },
  {
    id: 1107,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "In C++17 and later, what happens to the temporary object in this return statement?",
    code: `Widget makeWidget() {
  return Widget(42);
}

Widget w = makeWidget();`,
    options: [
      "A temporary Widget is constructed, then move-constructed into w, then the temporary is destroyed",
      "A temporary Widget is constructed, then copy-constructed into w if the move constructor is deleted",
      "The Widget is constructed directly into w's storage",
      "The compiler creates the temporary in makeWidget's frame, then memcpy's the bytes into w's slot",
    ],
    correctIndex: 2,
    explanation:
      "C++17 mandates copy elision (guaranteed RVO) for prvalue expressions. The Widget(42) is constructed directly in the storage for w. No temporary object is ever created, no move or copy constructor is called, and the Widget's lifetime begins directly at w's location.",
    link: "https://en.cppreference.com/w/cpp/language/copy_elision.html",
  },
  {
    id: 1108,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "What is wrong with this function and what kind of bug does it introduce?",
    code: `int& getLocal() {
  int x = 42;
  return x;
}

int main() {
  int& ref = getLocal();
  std::cout << ref;
}`,
    options: [
      "The code is valid because x is copied into the reference before the function returns to main",
      "Returning a reference to local x creates a dangling reference",
      "The function fails to compile because non-const references cannot bind to local integer variables",
      "The reference ref is valid but holds a stale value that is always zero after the function returns",
    ],
    correctIndex: 1,
    explanation:
      "The local variable x has automatic storage duration and is destroyed when getLocal() returns. The returned reference refers to memory that no longer holds a valid object. Accessing ref in main() is undefined behavior -- it may appear to work, crash, or produce garbage values.",
    link: "https://en.cppreference.com/w/cpp/language/reference.html",
  },
  {
    id: 1109,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "When is the static member variable Widget::count initialized in this program?",
    code: `// widget.h
class Widget {
public:
  static int count;
  Widget() { ++count; }
};

// widget.cpp
int Widget::count = 0;`,
    options: [
      "It is initialized each time a new Widget object is constructed, resetting count to zero first",
      "It is initialized lazily when Widget::count is first accessed by any function at runtime later",
      "It is initialized the first time the Widget constructor runs, just before incrementing the value",
      "It is initialized before main runs as part of static storage duration initialization of globals",
    ],
    correctIndex: 3,
    explanation:
      "Static member variables have static storage duration. Widget::count is defined at namespace scope in widget.cpp, so it is zero-initialized during static initialization before main() begins. Since the initializer is a constant expression (0), this is constant initialization, which happens at compile/load time.",
    link: "https://en.cppreference.com/w/cpp/language/static.html",
  },
  {
    id: 1110,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "What is the bug in this code that captures a local variable by reference in a lambda?",
    code: `std::function<int()> makeCounter() {
  int n = 0;
  return [&n]() { return ++n; };
}

auto counter = makeCounter();
std::cout << counter();`,
    options: [
      "The lambda captures n by reference, but n is destroyed when makeCounter returns",
      "The lambda fails to compile because std::function cannot store lambdas that capture local variables",
      "The lambda makes a copy of n despite the & syntax, so each call always returns 1 instead of counting",
      "The lambda correctly extends the lifetime of n because std::function manages the captured references",
    ],
    correctIndex: 0,
    explanation:
      "The local variable n has automatic storage duration and is destroyed at the end of makeCounter(). The lambda captures n by reference, creating a dangling reference. Calling counter() after makeCounter returns accesses destroyed storage, which is undefined behavior. Capturing by value ([n] with mutable) would fix this.",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 1111,
    difficulty: "Medium",
    topic: "Storage Durations",
    question:
      "When does the contained std::string object's lifetime end in this std::optional usage?",
    code: `std::optional<std::string> opt = "hello";
std::cout << *opt << '\n';
opt.reset();
std::cout << "done\n";`,
    options: [
      "The string's lifetime ends when opt goes out of scope because reset only marks it as disengaged",
      "The string's lifetime ends at program termination because optional uses static storage internally",
      "The string is destroyed immediately when opt.reset() is called, before the second cout executes",
      "The string is destroyed only if the optional's destructor runs, so reset does not destroy it here",
    ],
    correctIndex: 2,
    explanation:
      "std::optional::reset() disengages the optional and destroys the contained object immediately by calling its destructor. After reset(), the optional is empty and has_value() returns false. The string's lifetime ends right at the reset() call, not when opt itself is destroyed.",
    link: "https://en.cppreference.com/w/cpp/utility/optional/reset.html",
  },
  {
    id: 1112,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "Two translation units each define a namespace-scope variable that depends on the other during dynamic initialization. What does the C++ standard say about the initialization order?",
    code: `// file_a.cpp
extern int b;
int a = b * 2;  // depends on b from file_b.cpp

// file_b.cpp
extern int a;
int b = a + 3;  // depends on a from file_a.cpp`,
    options: [
      "The order is unspecified across translation units, so the values of a and b are indeterminate",
      "The linker always initializes translation units in alphabetical filename order, making it safe",
      "The compiler detects the circular dependency and issues a mandatory diagnostic at compile time",
      "Zero-initialization resolves the cycle because both variables get value 0 before dynamic init",
    ],
    correctIndex: 0,
    explanation:
      "The C++ standard does not define the order of dynamic initialization of non-local variables across translation units. This is the classic 'static initialization order fiasco' -- the result depends on which TU's dynamic initialization runs first, leading to indeterminate values.",
    link: "https://en.cppreference.com/w/cpp/language/initialization#Non-local_variables",
  },
  {
    id: 1113,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "What does the constinit specifier (C++20) guarantee about a variable, and what happens if the guarantee cannot be met?",
    code: `int computeValue();
constinit int x = computeValue();  // computeValue is not constexpr`,
    options: [
      "constinit forces constant initialization; if that is impossible the program compiles but traps at runtime",
      "constinit forces constant initialization; if that is impossible the compiler issues a hard error",
      "constinit makes the variable implicitly constexpr and immutable for the entire duration of the program",
      "constinit defers initialization until first use, similar to a block-scope static local variable",
    ],
    correctIndex: 1,
    explanation:
      "constinit requires that the variable is initialized during the constant initialization phase. If the initializer is not a constant expression, the program is ill-formed and the compiler must emit a diagnostic (error). Unlike constexpr, constinit does not make the variable const.",
    link: "https://en.cppreference.com/w/cpp/language/constinit",
  },
  {
    id: 1114,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "What guarantee does the C++ standard provide about initialization of block-scope static variables in a multithreaded program?",
    code: `Widget& getInstance() {
    static Widget w;  // first call initializes w
    return w;
}`,
    options: [
      "The standard provides no thread-safety guarantees; a mutex must always wrap the static declaration",
      "Initialization is thread-safe only if the constructor is declared noexcept and trivially copyable",
      "Since C++11, the implementation must guarantee that the variable is initialized exactly once safely",
      "Thread safety is guaranteed only when compiling with the -pthread flag or equivalent option",
    ],
    correctIndex: 2,
    explanation:
      "C++11 and later require that if multiple threads attempt to initialize the same block-scope static variable concurrently, exactly one thread performs the initialization and the others block until it completes. This is sometimes called 'magic statics' or the Meyers singleton pattern.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration#Static_local_variables",
  },
  {
    id: 1115,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "What is the destruction order of thread_local objects relative to objects with static storage duration when a thread exits?",
    code: `struct Logger {
    ~Logger() { /* writes to global log */ }
};

Logger& globalLog() {
    static Logger instance;
    return instance;
}

thread_local int perThreadCounter = 0;`,
    options: [
      "thread_local objects in a thread are destroyed before any static-duration objects are destroyed",
      "static objects are always destroyed first, then thread_local objects are destroyed afterward",
      "The standard does not fully specify the interleaving, so using statics in thread_local dtors is risky",
      "thread_local and static objects are destroyed simultaneously in an implementation-defined batch",
    ],
    correctIndex: 2,
    explanation:
      "The standard specifies that thread_local objects are destroyed on thread exit and static objects during program termination, but the relative ordering when a non-main thread's thread_local destructor accesses a static object is not fully guaranteed. Accessing a static object from a thread_local destructor risks use-after-destruction.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration#Storage_duration",
  },
  {
    id: 1116,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "What are the two initialization phases for non-local variables with static storage duration, and in what order do they occur?",
    options: [
      "First dynamic initialization runs all constructors, then constant initialization fixes constexpr values",
      "First zero/constant initialization occurs at compile time or load time, then dynamic initialization runs",
      "First the linker resolves all extern symbols, then the runtime initializes all static variables at once",
      "First value-initialization sets all members to defaults, then aggregate initialization fills in values",
    ],
    correctIndex: 1,
    explanation:
      "Static storage duration variables undergo two phases: (1) static initialization, which includes zero-initialization and constant initialization (performed before any dynamic initialization), followed by (2) dynamic initialization, which executes non-trivial constructors and non-constant initializers.",
    link: "https://en.cppreference.com/w/cpp/language/initialization#Non-local_variables",
  },
  {
    id: 1117,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: "What is the value of globalArr[2] before main() starts executing?",
    code: `// at namespace scope
int globalArr[5];
struct S { int x; double y; };
S globalS;`,
    options: [
      "It is value-initialized to zero only if the array element type has a user-defined default constructor",
      "It is indeterminate because arrays of built-in types are never automatically zero-initialized at all",
      "It depends on the compiler",
      "It is zero because objects with static storage duration are zero-initialized before any other init",
    ],
    correctIndex: 3,
    explanation:
      "All objects with static storage duration are zero-initialized as part of static initialization, which happens before dynamic initialization and before main(). For int arrays, every element is guaranteed to be 0. Similarly, globalS.x is 0 and globalS.y is 0.0.",
    link: "https://en.cppreference.com/w/cpp/language/zero_initialization",
  },
  {
    id: 1118,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "What is the lifetime of the temporary std::string in this code, and is reading from p safe?",
    code: `const char* p = std::string("hello").c_str();
std::cout << p;  // safe or dangling?`,
    options: [
      "The temporary lives until p goes out of scope because c_str() implicitly extends its lifetime",
      "The temporary lives until the end of the enclosing block because it is bound to a const pointer",
      "The temporary is destroyed at the end of the full-expression, so p is a dangling pointer here",
      "The temporary is moved into static storage by the compiler as a small-string optimization step",
    ],
    correctIndex: 2,
    explanation:
      "The temporary std::string is destroyed at the end of the full-expression (the semicolon on line 1). The pointer returned by c_str() becomes dangling immediately. Lifetime extension applies only when a reference (not a pointer) is directly bound to a temporary prvalue.",
    link: "https://en.cppreference.com/w/cpp/language/lifetime#Temporary_object_lifetime",
  },
  {
    id: 1119,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "A namespace-scope variable is declared static. How does this affect its linkage and its storage duration?",
    code: `// in utils.cpp
static int counter = 0;  // namespace-scope static`,
    options: [
      "It has internal linkage restricted to this TU, but its storage duration is still static as usual",
      "It has external linkage visible to other TUs, and static only affects the storage duration here",
      "It has no linkage at all, and it is destroyed when the function returns",
      "It has internal linkage and automatic storage duration, so it is re-created each time the TU loads",
    ],
    correctIndex: 0,
    explanation:
      "The static keyword at namespace scope gives the variable internal linkage, meaning it is not visible to other translation units. Its storage duration remains static (it exists for the entire program). The two meanings of 'static' -- linkage specifier vs. storage duration -- are distinct but both apply here.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration#Linkage",
  },
  {
    id: 1120,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "What happens if the constructor of a block-scope static variable throws an exception?",
    code: `Widget& get() {
    static Widget w(42);  // ctor may throw
    return w;
}

try { get(); } catch (...) {}
try { get(); } catch (...) {}  // second call`,
    options: [
      "The first call throws and the variable is left in a partially constructed, permanent error state",
      "The runtime marks the variable as initialized anyway, so subsequent calls return a default object",
      "A compiler error is emitted because block-scope statics must have a noexcept constructor always",
      "Initialization is reattempted on the next entry to the block, since the variable was never completed",
    ],
    correctIndex: 3,
    explanation:
      "If the initialization of a block-scope static variable throws, the variable is not considered initialized. The next time control passes through the declaration, initialization is attempted again. This continues until the constructor succeeds without throwing.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration#Static_local_variables",
  },
  {
    id: 1121,
    difficulty: "Hard",
    topic: "Storage Durations",
    question:
      "How does constinit differ from constexpr when applied to a variable with static storage duration?",
    code: `constexpr int a = 42;    // constexpr variable
constinit int b = 42;    // constinit variable

void f() {
    ++b;   // is this legal?
    // ++a; // is this legal?
}`,
    options: [
      "constexpr makes the variable const and requires a constant initializer; constinit only requires a constant initializer",
      "constinit makes the variable const and requires a constant initializer; constexpr only requires a constant initializer",
      "Both constexpr and constinit make the variable const, but constinit also allows thread_local storage",
      "Both constexpr and constinit allow mutation after initialization, but constinit skips zero-init phase",
    ],
    correctIndex: 0,
    explanation:
      "constexpr on a variable implies const -- the variable cannot be modified after initialization. constinit only requires that the initializer is a constant expression (preventing dynamic initialization) but does not make the variable const. So ++b is legal but ++a is ill-formed.",
    link: "https://en.cppreference.com/w/cpp/language/constinit",
  },
  {
    id: 1422,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What does automatic storage duration mean for a local variable in C++?`,
    options: [
      "The variable is allocated on the heap and must be manually freed by the programmer when finished",
      "The variable persists for the entire duration of the program and is shared across all function calls",
      "The variable is created when its block is entered and destroyed when the block is exited by control",
      "The variable is stored in a CPU register and cannot have its address taken by any pointer in code",
    ],
    correctIndex: 2,
    explanation: `Automatic storage duration means the variable's lifetime begins when the block containing its definition is entered and ends when that block is exited. Local variables inside functions have automatic storage duration by default.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1423,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `When is a static local variable inside a function initialized?`,
    options: [
      "It is initialized the first time execution reaches its declaration, and only that one time overall",
      "It is initialized each time the function is called, resetting the variable to its initial value each call",
      "It is initialized at program startup before main begins, alongside all other global variable objects",
      "It is initialized at the end of the function on the first call and then persists until program shutdown",
    ],
    correctIndex: 0,
    explanation: `A static local variable is initialized the first time control passes through its declaration. After that, subsequent calls to the function skip the initialization. In C++11 and later, this initialization is guaranteed to be thread-safe.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1424,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `Which keyword gives a variable thread-local storage duration in C++11?`,
    options: [
      "The static keyword, which ensures each thread receives its own isolated copy of the given variable",
      "The volatile keyword, which creates a separate memory location for every thread accessing the value",
      "The register keyword, which allocates the variable in each individual thread's own register context",
      "The thread_local keyword, which creates a separate instance of the variable for each running thread",
    ],
    correctIndex: 3,
    explanation: `The thread_local keyword specifies that each thread gets its own independent copy of the variable. The variable is created when the thread starts and destroyed when the thread ends. It can be combined with static or extern.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1425,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What storage duration do global variables (defined at namespace scope) have in C++?`,
    options: [
      "They have automatic storage duration and are destroyed when the enclosing namespace scope is exited",
      "They have static storage duration and exist for the entire lifetime of the program from start to end",
      "They have dynamic storage duration and are allocated on the heap when the program first begins executing",
      "They have thread-local storage duration and each thread gets its own completely separate copy of the variable",
    ],
    correctIndex: 1,
    explanation: `Variables defined at namespace scope (including global scope) have static storage duration. They are created before main() begins (or before the first use of any entity in their translation unit) and destroyed after main() returns.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1426,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What happens to a variable with automatic storage duration when its enclosing scope exits?`,
    options: [
      "Its destructor is called and the memory it occupied on the stack is reclaimed by the runtime system",
      "It remains in memory but becomes inaccessible, and the garbage collector later reclaims the storage",
      "It is moved to a static memory pool where it can be accessed again if the function is called once more",
      "It is flagged for deferred cleanup and the memory is released when the program terminates completely",
    ],
    correctIndex: 0,
    explanation: `When the scope of an automatic variable ends, its destructor is called (for class types) and the stack memory is reclaimed. This is a fundamental part of RAII in C++, where resources are tied to object lifetimes.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1427,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What storage duration does an object created with the \`new\` expression have?`,
    options: [
      "It has automatic storage duration and is destroyed when the current function scope finishes execution",
      "It has static storage duration and persists for the full lifetime of the running program until shutdown",
      "It has dynamic storage duration and exists until it is explicitly deallocated with a delete expression",
      "It has thread-local storage duration and is destroyed automatically when the creating thread finishes",
    ],
    correctIndex: 2,
    explanation: `Objects created with new have dynamic storage duration. They exist until explicitly destroyed with delete (or delete[] for arrays). Unlike automatic variables, their lifetime is not tied to any scope, which is why smart pointers are recommended to manage them.`,
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  {
    id: 1428,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `Where are objects with dynamic storage duration typically stored in a C++ program?`,
    options: [
      "In the stack frame of the function that called the new expression to create the requested object",
      "In the read-only data segment alongside string literals and other constant values in the program",
      "In the BSS segment that holds all zero-initialized global data when the program is first started up",
      "In the free store, which is commonly referred to as the heap, managed by the memory allocator",
    ],
    correctIndex: 3,
    explanation: `Dynamic storage is allocated from the free store (heap). The heap is a region of memory managed by the runtime allocator. Unlike the stack, heap memory must be explicitly freed. The terms 'free store' and 'heap' are often used interchangeably in C++.`,
    link: "https://en.cppreference.com/w/cpp/memory",
  },
  {
    id: 1429,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What is the default storage duration of a local variable declared inside a function body?`,
    code: `void foo() {
  int x = 10;
}`,
    options: [
      "Static storage duration, meaning the variable persists across multiple calls to the function body",
      "Automatic storage duration, meaning it is created on entry and destroyed on exit of the block scope",
      "Dynamic storage duration, meaning the runtime decides when to allocate and free the variable memory",
      "Thread-local storage duration, meaning each thread that calls the function gets its own copy of it",
    ],
    correctIndex: 1,
    explanation: `Local variables without any storage class specifier have automatic storage duration by default. The variable x is created each time foo() is called and destroyed when the function returns. Its memory lives on the stack.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1430,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What happens to the value of a static local variable between consecutive calls to the same function?`,
    code: `int counter() {
  static int count = 0;
  return ++count;
}`,
    options: [
      "The value is retained between calls because the variable has static storage duration and persists",
      "The value is reset to zero on each call because local variables are always re-initialized on entry",
      "The value is undefined between calls because the memory may be reused by other automatic variables",
      "The value is stored in a temporary file and reloaded from disk each time the function is called again",
    ],
    correctIndex: 0,
    explanation: `A static local variable retains its value between function calls. It is initialized only once (the first time control reaches its declaration) and persists until program termination. In this example, counter() returns 1, 2, 3, etc. on successive calls.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1431,
    difficulty: "Easy",
    topic: "Storage Durations",
    question: `What must be done to properly release memory obtained through dynamic storage allocation in C++?`,
    options: [
      "Call std::free on the pointer, which returns the memory block to the C runtime memory pool directly",
      "Set the pointer to nullptr, which signals the garbage collector to reclaim the associated heap memory",
      "Use the delete expression on the pointer, which calls the destructor and releases the memory back",
      "Let the pointer go out of scope, at which point the runtime automatically frees the heap allocation",
    ],
    correctIndex: 2,
    explanation: `Memory allocated with new must be released with delete (or delete[] for arrays). The delete expression calls the object's destructor and returns the memory to the free store. Failing to do this causes memory leaks. Using std::free on new-allocated memory is undefined behavior.`,
    link: "https://en.cppreference.com/w/cpp/language/delete",
  },
  {
    id: 1432,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `In what order are static local variables in different functions initialized relative to each other?`,
    options: [
      "They are initialized in alphabetical order of the function names that contain each static variable",
      "They are initialized in reverse order of their declaration, starting from the last declared first overall",
      "They are all initialized together at program startup before the main function begins its execution",
      "They are each initialized when control first reaches their declaration inside their own function body",
    ],
    correctIndex: 3,
    explanation: `Unlike global static variables, block-scope static variables are initialized the first time execution reaches their declaration. This means two static local variables in different functions are initialized independently, each when its own function is first called.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1433,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What happens when \`thread_local\` is combined with \`static\` on a local variable inside a function?`,
    code: `void foo() {
  thread_local static int x = 0;
  x++;
}`,
    options: [
      "Each thread gets its own persistent copy of x that retains its value across calls within that thread",
      "The variable x is shared across all threads but protected by an implicit mutex for safe concurrent use",
      "The combination is illegal and produces a compilation error because the two specifiers are in conflict",
      "The variable x is initialized once globally and then copied into each thread when the thread is created",
    ],
    correctIndex: 0,
    explanation: `When thread_local is combined with static on a local variable, each thread gets its own copy that persists across calls to the function. The static is actually redundant here since thread_local on a block-scope variable implies static storage duration within that thread.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1434,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What is the storage duration and lifetime of a temporary object created during expression evaluation?`,
    code: `std::string getName() { return "hello"; }
const std::string& ref = getName();`,
    options: [
      "The temporary has dynamic storage duration and survives until the program explicitly deletes the object",
      "The temporary has automatic storage duration and is destroyed at the very end of the enclosing block",
      "The temporary has automatic storage duration and its lifetime is extended to match the const reference",
      "The temporary has static storage duration and persists in a global pool for the rest of the program run",
    ],
    correctIndex: 2,
    explanation: `Temporaries normally have automatic storage duration and are destroyed at the end of the full-expression. However, when a temporary is bound to a const lvalue reference or an rvalue reference, its lifetime is extended to match the lifetime of the reference. In this case, the temporary string persists until ref goes out of scope.`,
    link: "https://en.cppreference.com/w/cpp/language/lifetime",
  },
  {
    id: 1435,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What effect does the \`static\` keyword have on a variable declared inside a function body?`,
    options: [
      "It makes the variable visible to other functions in the same translation unit by giving it file scope",
      "It changes the storage duration to static, so the variable persists for the entire program lifetime",
      "It allocates the variable on the heap and ensures it is automatically deleted when the program exits",
      "It makes the variable immutable after its first initialization, similar to declaring it as a constant",
    ],
    correctIndex: 1,
    explanation: `The static keyword on a local variable changes its storage duration from automatic to static. The variable is initialized once and retains its value between function calls. Its scope remains local to the function, so it is not visible outside, but it persists for the program's lifetime.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1436,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What does the \`extern\` keyword indicate about a variable's storage duration and definition?`,
    options: [
      "It declares the variable without defining it, indicating the definition exists in another translation unit",
      "It allocates the variable in a special external memory segment that is directly accessible across all processes",
      "It gives the variable thread-local storage duration and makes it visible to every thread in the running program",
      "It changes the variable's storage duration to dynamic and requires that it be explicitly freed at the very end",
    ],
    correctIndex: 0,
    explanation: `extern declares a variable without defining it, indicating that the actual definition (and storage allocation) exists in another translation unit. The variable still has static storage duration. extern is used to share global variables across multiple source files.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1437,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What storage duration does a \`constexpr\` variable declared at block scope have?`,
    code: `void foo() {
  constexpr int limit = 100;
}`,
    options: [
      "It has dynamic storage duration because the compiler allocates all constexpr values on the heap at runtime",
      "It has thread-local storage duration so that each thread can independently evaluate the constant value given",
      "It has static storage duration because all constexpr variables are implicitly treated as having static scope",
      "It has automatic storage duration like any other local variable unless explicitly declared as static too",
    ],
    correctIndex: 3,
    explanation: `A constexpr variable at block scope has automatic storage duration, just like any other local variable. While the value is known at compile time, the storage class is not changed by constexpr. To give it static storage duration, you must explicitly add the static keyword.`,
    link: "https://en.cppreference.com/w/cpp/language/constexpr",
  },
  {
    id: 1438,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `How does declaring a variable in an anonymous namespace affect its storage duration and linkage?`,
    code: `namespace {
  int counter = 0;
}`,
    options: [
      "The variable gets dynamic storage duration and is allocated on the heap each time the namespace block is entered",
      "The variable gets automatic storage duration and is destroyed whenever the enclosing function scope fully exits",
      "The variable gets static storage duration with internal linkage, limiting visibility to its translation unit",
      "The variable gets thread-local storage duration and so each thread receives its own fully independent copy of it",
    ],
    correctIndex: 2,
    explanation: `Variables in an anonymous namespace have static storage duration and internal linkage. This means they exist for the entire program lifetime but are only accessible within the translation unit where they are defined. Anonymous namespaces are the modern C++ replacement for the static keyword at file scope.`,
    link: "https://en.cppreference.com/w/cpp/language/namespace",
  },
  {
    id: 1439,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What is the 'static initialization order fiasco' in C++?`,
    options: [
      "A compiler bug where static variables are sometimes initialized twice if the same header is included twice",
      "The undefined order of initialization of static variables across different translation units in the build",
      "A linker error that occurs when two static variables in the same translation unit share identical name values",
      "A runtime crash caused by static variables being initialized well after main has already started executing",
    ],
    correctIndex: 1,
    explanation: `The static initialization order fiasco refers to the fact that the order of initialization of static variables defined in different translation units is unspecified. If one static variable's initializer depends on another from a different translation unit, the behavior is undefined. The Construct on First Use idiom is a common solution.`,
    link: "https://isocpp.org/wiki/faq/ctors#static-init-order",
  },
  {
    id: 1440,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What guarantee does C++11 provide about the initialization of block-scope static variables in a multithreaded program?`,
    options: [
      "No guarantee is provided and the programmer must use an explicit mutex to protect the initialization code",
      "The initialization is guaranteed to occur exactly once even if multiple threads enter the block together",
      "The variable is initialized separately for each individual thread, giving every thread its own independent version",
      "The initialization is performed during program startup before any threads are created by the application",
    ],
    correctIndex: 1,
    explanation: `C++11 guarantees that block-scope static variables are initialized in a thread-safe manner. If multiple threads attempt to initialize the same static local variable concurrently, only one will perform the initialization while the others block. This is sometimes called 'magic statics'.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1441,
    difficulty: "Medium",
    topic: "Storage Durations",
    question: `What is the storage duration of a string literal like \`"hello"\` in a C++ program?`,
    options: [
      "It has automatic storage duration and is destroyed when the function containing the literal returns to caller",
      "It has dynamic storage duration and the runtime allocates a completely fresh copy each time the literal is used",
      "It has thread-local storage duration and so each thread gets its own private copy of the string data value",
      "It has static storage duration and the array of characters persists for the entire lifetime of the program",
    ],
    correctIndex: 3,
    explanation: `String literals have static storage duration. The compiler places the character array in a read-only data segment, and it exists for the entire duration of the program. This is why it is safe to return a pointer to a string literal from a function.`,
    link: "https://en.cppreference.com/w/cpp/language/string_literal",
  },
  {
    id: 1442,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What storage duration does an object created via placement new in a pre-allocated buffer have?`,
    code: `alignas(Foo) char buffer[sizeof(Foo)];
new (buffer) Foo();`,
    options: [
      "The object inherits dynamic storage duration regardless of where the underlying buffer memory was allocated from",
      "The object inherits the storage duration of the underlying buffer, so it depends on how buffer is declared",
      "The object always has static storage duration because placement new completely bypasses the normal heap allocator",
      "The object has no defined storage duration because placement new creates objects that fall outside the C++ model",
    ],
    correctIndex: 1,
    explanation: `Placement new constructs an object in pre-existing memory without allocating new storage. The object does not have its own storage duration; it exists in the storage provided by the buffer. If the buffer is a local variable (automatic), the object's memory is automatic. If the buffer is static, the memory is static.`,
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  {
    id: 1443,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What is the difference between static initialization and dynamic initialization for global variables?`,
    options: [
      "Static initialization uses the stack for storage while dynamic initialization always uses the heap to store the variable",
      "Static initialization occurs at compile time or program load, while dynamic initialization runs code at startup",
      "Static initialization applies only to built-in integer types while dynamic initialization handles all the class types",
      "Static initialization happens once per thread while dynamic initialization happens exactly once for the whole program",
    ],
    correctIndex: 1,
    explanation: `Static initialization includes zero-initialization and constant initialization, which happen at compile time or program load before any code runs. Dynamic initialization involves executing code (like calling constructors) and happens after static initialization, during program startup. The static initialization order fiasco only applies to dynamic initialization.`,
    link: "https://en.cppreference.com/w/cpp/language/initialization",
  },
  {
    id: 1444,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What does the \`constinit\` specifier introduced in C++20 guarantee about a variable?`,
    options: [
      "It ensures the variable is constant-initialized and prevents accidental dynamic initialization at startup",
      "It makes the variable both constexpr and static, combining compile-time evaluation with static duration",
      "It forces the variable into read-only memory and triggers a runtime error if any code tries to modify it",
      "It guarantees that the variable is initialized before any thread_local variables in the same translation unit",
    ],
    correctIndex: 0,
    explanation: `constinit ensures that a variable with static or thread-local storage duration is constant-initialized (initialized at compile time). Unlike constexpr, constinit does not make the variable const, so it can be modified after initialization. It prevents the static initialization order fiasco by guaranteeing no dynamic initialization occurs.`,
    link: "https://en.cppreference.com/w/cpp/language/constinit",
  },
  {
    id: 1445,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `In what order are thread-local variables destroyed when a thread terminates in C++?`,
    options: [
      "They are destroyed in the order they were first accessed during the thread execution, earliest first",
      "They are destroyed in an implementation-defined order that is not required to be consistent each time",
      "They are all destroyed simultaneously using a single batch deallocation when the thread stack is freed",
      "They are destroyed in reverse order of their construction, similar to how local automatic objects work",
    ],
    correctIndex: 3,
    explanation: `Thread-local variables are destroyed in the reverse order of their construction when a thread exits, following the same principle as automatic variables and static variables at program exit. If thread-local variable A was constructed before B, then B is destroyed before A when the thread terminates.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1446,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What storage duration does a lambda's captured-by-copy variable have inside the closure object?`,
    code: `int x = 42;
auto fn = [x]() { return x; };`,
    options: [
      "The captured copy has dynamic storage duration because the lambda always allocates captures on the heap region",
      "The captured copy has static storage duration and persists for the entire lifetime of the currently running program",
      "The captured copy has the same storage duration as the closure object itself, as it is a data member of it",
      "The captured copy has automatic storage duration tied to the original variable scope, not to the closure object",
    ],
    correctIndex: 2,
    explanation: `A lambda's closure is an unnamed class type, and captured-by-copy variables are non-static data members of that class. Their storage duration is the same as the closure object's. If the closure is a local variable, the captures have automatic duration. If the closure is stored in a static variable, the captures persist accordingly.`,
    link: "https://en.cppreference.com/w/cpp/language/lambda",
  },
  {
    id: 1447,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What distinguishes constant initialization from zero initialization for variables with static storage duration?`,
    options: [
      "Zero initialization sets every byte to zero first, while constant initialization evaluates a constexpr initializer",
      "Constant initialization uses the heap for all storage while zero initialization uses the data segment directly instead",
      "Zero initialization applies only to raw pointer types while constant initialization applies to all of the scalar types",
      "Constant initialization always runs before main starts while zero initialization happens during the dynamic init phase",
    ],
    correctIndex: 0,
    explanation: `For variables with static storage duration, zero initialization sets the variable to zero (or null for pointers) before any other initialization. Constant initialization then evaluates a constant expression initializer if one exists. Both happen before dynamic initialization, but zero initialization happens first.`,
    link: "https://en.cppreference.com/w/cpp/language/zero_initialization",
  },
  {
    id: 1448,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What is the Construct on First Use idiom and what storage duration problem does it solve?`,
    options: [
      "It wraps global objects in unique_ptr to ensure deterministic destruction order at program shutdown time",
      "It replaces global variables with function-local statics to avoid the static initialization order fiasco",
      "It uses thread_local variables to guarantee each thread initializes its own copy before first use of it",
      "It defers all static initialization to the first line of main using explicit constructor calls on each one",
    ],
    correctIndex: 1,
    explanation: `The Construct on First Use idiom replaces global static objects with static local variables inside accessor functions. Since block-scope statics are initialized on first use (and in a thread-safe manner since C++11), this avoids the static initialization order fiasco where globals in different translation units depend on each other.`,
    link: "https://isocpp.org/wiki/faq/ctors#static-init-order-on-first-use",
  },
  {
    id: 1449,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `How do C++17 inline variables solve a storage duration problem that previously existed with header-defined globals?`,
    options: [
      "They change the storage duration from static to automatic so the variable is stack-allocated every single time",
      "They enable the compiler to eliminate all duplicate storage entirely and fold all uses into literal constants",
      "They force each translation unit to use its own completely independent copy with separate storage for isolation",
      "They allow a single definition in a header with external linkage without causing multiple definition errors",
    ],
    correctIndex: 3,
    explanation: `Before C++17, defining a non-const global variable in a header included in multiple translation units caused multiple definition errors. Inline variables solve this by allowing the variable to be defined in a header while the linker ensures only one instance exists, with static storage duration and external linkage.`,
    link: "https://en.cppreference.com/w/cpp/language/inline",
  },
  {
    id: 1450,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `What happens when a variable is declared with both \`static\` and \`thread_local\` at namespace scope?`,
    code: `static thread_local int perThreadCounter = 0;`,
    options: [
      "It causes a compilation error because static and thread_local are mutually exclusive storage specifiers",
      "The variable gets static storage duration with internal linkage and is shared by all running threads",
      "Each thread gets its own copy with internal linkage, so it is not visible in other translation units",
      "The variable is initialized once globally and then each thread gets a read-only snapshot of that value",
    ],
    correctIndex: 2,
    explanation: `When static and thread_local are combined at namespace scope, static controls the linkage (internal) while thread_local controls the storage duration (thread-local). Each thread gets its own copy, and the variable is not accessible from other translation units due to internal linkage.`,
    link: "https://en.cppreference.com/w/cpp/language/storage_duration",
  },
  {
    id: 1451,
    difficulty: "Hard",
    topic: "Storage Durations",
    question: `In what order do the initialization phases occur for a global variable with static storage duration?`,
    code: `inline std::string config = computeDefault();`,
    options: [
      "Constant initialization runs first, then dynamic initialization runs, and zero initialization is skipped",
      "Zero initialization occurs first, then constant initialization if applicable, then dynamic initialization",
      "Dynamic initialization runs first to call the function, then zero initialization clears unused bytes after",
      "All three phases run simultaneously at program startup and the result is determined by whichever finishes",
    ],
    correctIndex: 1,
    explanation: `For variables with static storage duration, initialization proceeds in order: (1) zero initialization sets everything to zero, (2) constant initialization evaluates constexpr initializers if possible, (3) dynamic initialization runs any remaining runtime initializers. For this example, zero init happens first, constant init is not applicable, and then computeDefault() runs during dynamic init.`,
    link: "https://en.cppreference.com/w/cpp/language/initialization",
  },
];
