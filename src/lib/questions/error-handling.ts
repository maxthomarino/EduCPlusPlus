import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 27,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What happens if you dereference an empty std::optional with operator*?",
    options: [
      "Undefined behavior",
      "Returns a default-constructed value",
      "Throws std::bad_optional_access",
      "Returns std::nullopt",
    ],
    correctIndex: 0,
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
      "When you need to carry a detailed error message with context about the failure",
      "When performance is not a concern and stack unwinding overhead is acceptable",
      'When "no result" is a normal, expected outcome (e.g., a lookup that may not find a match)',
      "When failure is truly exceptional and unexpected",
    ],
    correctIndex: 2,
    explanation:
      "optional communicates that absence is a valid state, not an error. Exceptions should be reserved for truly unexpected failures.",
    link: "https://en.cppreference.com/w/cpp/utility/optional.html",
  },
  {
    id: 47,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What does the noexcept specifier on a function tell the compiler?",
    options: [
      "The function has no side effects",
      "The function is guaranteed not to throw exceptions",
      "The function will never be called with invalid arguments",
      "The function runs at compile time",
    ],
    correctIndex: 1,
    explanation:
      "If a noexcept function does throw, std::terminate is called immediately. The compiler can generate more efficient code for noexcept functions (no need for stack unwinding machinery).",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 482,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "What is the basic syntax for throwing and catching an exception in C++?",
    code: `try {\n    throw std::runtime_error("something failed");\n} catch (const std::exception& e) {\n    std::cerr << e.what();\n}`,
    options: [
      "try/catch is syntactic sugar for if/else error checking",
      "throw terminates the program immediately; catch restarts execution from the beginning of main() with the error stored in a global variable. This is how the C++ runtime implements structured error recovery",
      "throw creates an exception object and immediately unwinds the stack until a matching catch block is found. catch receives the exception by reference and handles it",
      "throw sends a signal to the OS like SIGABRT; catch registers a signal handler that intercepts it before the process terminates. The runtime forwards the signal through the kernel's signal dispatch mechanism",
    ],
    correctIndex: 2,
    explanation:
      "throw transfers control to the nearest matching catch block, unwinding the stack along the way (calling destructors for local objects). If no catch matches, std::terminate() is called. Catching by const reference avoids slicing and unnecessary copies.",
    link: "https://www.learncpp.com/cpp-tutorial/exceptions/",
  },
  {
    id: 483,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "What is the standard exception hierarchy in C++?",
    options: [
      "There is no hierarchy",
      "std::string is the base exception class",
      "std::exception is the base. Key derived classes: std::runtime_error, std::logic_error, std::bad_alloc, std::bad_cast",
      "All exceptions inherit from std::error, which provides the error_code() and error_message() virtual methods for all derived types. This base class lives in the <system_error> header and was introduced in C++11",
    ],
    correctIndex: 2,
    explanation:
      "std::exception provides what() (returns error message). runtime_error covers errors detectable only at runtime. logic_error covers programming bugs (out_of_range, invalid_argument). bad_alloc is thrown by new on allocation failure. Catching std::exception& catches all standard exceptions.",
    link: "https://en.cppreference.com/w/cpp/error/exception.html",
  },
  {
    id: 484,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "What does noexcept mean on a function?",
    code: `void safeOp() noexcept {\n    // guaranteed not to throw\n}`,
    options: [
      "The function promises not to throw exceptions. If it does throw, std::terminate() is called immediately",
      "The function is evaluated at compile time and the result is embedded as a constant in the generated machine code",
      "The function is never called at runtime",
      "The function catches all exceptions internally and converts them to error codes that are returned to the caller",
    ],
    correctIndex: 0,
    explanation:
      "noexcept is a contract: the function will not emit exceptions. If it violates this by throwing, the program calls std::terminate(). The compiler can optimize noexcept functions (e.g., vector uses move only if the move constructor is noexcept). Mark destructors, move operations, and swap as noexcept.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 485,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "Why should you catch exceptions by const reference?",
    code: `catch (const std::exception& e)  // good\ncatch (std::exception e)         // bad`,
    options: [
      "It's just a style preference",
      "Catching by value is faster because it avoids the indirection overhead of a reference and keeps the exception data in a register. The copy constructor is optimized out by the compiler through copy elision",
      "Catching by value copies the exception and causes object slicing. Catching by const reference avoids the copy and preserves the full derived type, including its what() message",
      "You can't modify the exception either way, so const makes no difference",
    ],
    correctIndex: 2,
    explanation:
      "If you throw a std::runtime_error and catch by std::exception value, the runtime_error is sliced into a plain std::exception -- you lose the derived class's data. Catching by const& preserves the full object. It also avoids unnecessary copying.",
    link: "https://www.learncpp.com/cpp-tutorial/exceptions-and-inheritance/",
  },
  {
    id: 486,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "What does catch (...) do?",
    code: `try {\n    riskyOperation();\n} catch (...) {\n    std::cerr << "Unknown exception caught\\n";\n}`,
    options: [
      "Catches only std::exception types and their derived classes, ignoring any non-standard exception types like int or const char*",
      "Catches any exception of any type, including non-standard types. It's a catch-all handler but you cannot access the exception object",
      "Catches signals like SIGSEGV and SIGFPE, converting hardware faults into C++ exceptions that can be handled gracefully",
      "Catches compiler errors and syntax mistakes, allowing the program to recover from malformed expressions at runtime",
    ],
    correctIndex: 1,
    explanation:
      "catch (...) matches any thrown type. It's useful as a last resort to prevent unhandled exceptions from crashing the program. However, you can't inspect the exception. Place it after more specific catch blocks. Note: it does NOT catch hardware signals (segfault, etc.).",
    link: "https://en.cppreference.com/w/cpp/language/try_catch.html",
  },
  {
    id: 487,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What are the three exception safety guarantees?",
    options: [
      "No-throw, strong, basic",
      "Memory safety, thread safety, and type safety",
      "Compile-time safety, link-time safety, and run-time safety. These three phases each guard against a different category of defect",
      "Fast, slow, and none",
    ],
    correctIndex: 0,
    explanation:
      "No-throw: guaranteed success (destructors, swap). Strong: atomic -- either fully succeeds or has no effect (copy-and-swap). Basic: no leaks and invariants hold, but partial modifications may be visible. Most functions should provide at least the basic guarantee.",
    link: "https://en.cppreference.com/w/cpp/language/exceptions.html",
  },
  {
    id: 488,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "Why should destructors never throw exceptions?",
    options: [
      "It's a style guideline with no technical reason",
      "Throwing in a destructor is caught by the nearest catch block normally",
      "During stack unwinding, if a destructor throws, std::terminate() is called because C++ cannot handle two exceptions simultaneously. Destructors are implicitly noexcept since C++11",
      "Destructors cannot contain throw statements",
    ],
    correctIndex: 2,
    explanation:
      "If an exception is already propagating (stack unwinding) and a destructor throws a second exception, C++ has no mechanism to handle both. The program terminates. Since C++11, destructors are implicitly noexcept. If a destructor must handle errors, catch them internally and log/swallow them.",
    link: "https://en.cppreference.com/w/cpp/language/destructor.html",
  },
  {
    id: 489,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "How does RAII provide exception safety?",
    code: `void process() {\n    auto file = std::make_unique<File>("data.txt");\n    auto lock = std::lock_guard(mutex);\n    doWork();  // may throw\n}  // file and lock are cleaned up even if doWork() throws`,
    options: [
      "RAII catches exceptions automatically by wrapping every resource acquisition in an implicit try/catch block managed by the compiler. The compiler inserts hidden catch handlers around each resource allocation to ensure the exception is intercepted",
      "RAII is unrelated to exception safety",
      "RAII prevents exceptions from being thrown by pre-validating all operations at construction time and guaranteeing that no errors can occur later. The constructor checks every precondition so that subsequent member function calls never encounter failure conditions",
      "RAII objects acquire resources in constructors and release them in destructors. During stack unwinding, destructors run for all fully-constructed local objects, guaranteeing cleanup even when exceptions are thrown",
    ],
    correctIndex: 3,
    explanation:
      "Without RAII, you'd need manual cleanup in every catch block (error-prone). RAII ensures destructors handle cleanup automatically. This is the foundation of exception-safe C++ -- never manage resources manually when an RAII wrapper exists.",
    link: "https://en.cppreference.com/w/cpp/language/raii.html",
  },
  {
    id: 490,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "How do you create a custom exception class?",
    code: `class FileNotFoundError : public std::runtime_error {\npublic:\n    FileNotFoundError(const std::string& path)\n        : std::runtime_error("File not found: " + path),\n          path_(path) {}\n    const std::string& path() const { return path_; }\nprivate:\n    std::string path_;\n};`,
    options: [
      "Inherit from an appropriate standard exception class, call its constructor with the message, and add any extra context fields. Callers can catch the specific type or any base class",
      "You cannot create custom exceptions in C++",
      "Custom exceptions must be trivially copyable structs with no virtual functions, no constructors, and no heap-allocated members",
      "Custom exceptions must inherit from std::exception directly",
    ],
    correctIndex: 0,
    explanation:
      "Derive from std::runtime_error (or std::logic_error) to get what() for free. Add custom fields for additional context (file path, error code, etc.). Callers can catch FileNotFoundError specifically or catch std::exception& generically.",
    link: "https://www.learncpp.com/cpp-tutorial/exceptions-and-inheritance/",
  },
  {
    id: 491,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What is std::error_code and when would you use it instead of exceptions?",
    options: [
      "std::error_code is only used with std::filesystem and cannot be used with any other part of the standard library or user-defined code. The filesystem library has exclusive ownership of error_code and its associated category infrastructure in the standard",
      "std::error_code is a deprecated C feature carried over from <errno.h> for backward compatibility and should not be used in modern C++ code. The committee has marked it for removal in a future revision of the standard to simplify the error handling model",
      "std::error_code automatically throws exceptions when a non-zero error code is set, acting as a wrapper that converts C-style errors into C++ exceptions. It monitors the stored value and invokes throw whenever the code transitions from zero to a non-zero value",
      "std::error_code holds an integer error code + a category, providing a structured alternative to exceptions for expected failures. Use error codes for anticipated errors in performance-sensitive paths; use exceptions for truly exceptional situations",
    ],
    correctIndex: 3,
    explanation:
      "std::error_code is part of the <system_error> header. Many C++17 APIs (filesystem, networking) offer both a throwing overload and an error_code overload. Error codes avoid the overhead of exception unwinding for expected failures and are commonly used in game engines and low-latency systems.",
    link: "https://en.cppreference.com/w/cpp/error/error_code.html",
  },
  {
    id: 492,
    difficulty: "Hard",
    topic: "Error Handling",
    question: "What does std::exception_ptr enable?",
    code: `std::exception_ptr eptr;\ntry {\n    throw std::runtime_error("oops");\n} catch (...) {\n    eptr = std::current_exception();\n}\n// Later, possibly in another thread:\nif (eptr) std::rethrow_exception(eptr);`,
    options: [
      "It's an alias for std::exception*",
      "It converts exceptions to error codes by extracting the what() message and mapping it to a numeric std::error_code value. The mapping is performed through a lookup table maintained by the standard library's error category system",
      "It captures an exception and allows it to be stored, transported, and rethrown later. This is how std::future propagates exceptions from worker threads back to the calling thread",
      "It prevents exceptions from propagating by catching them at the point of origin and silently discarding them to avoid stack unwinding. The runtime intercepts the throw and destroys the exception object before it can reach a catch block",
    ],
    correctIndex: 2,
    explanation:
      "exception_ptr is a type-erased, reference-counted handle to an exception object. current_exception() captures the active exception. rethrow_exception() throws it again. This enables cross-thread exception transport -- async tasks capture exceptions and rethrow them when the future is accessed.",
    link: "https://en.cppreference.com/w/cpp/error/exception_ptr.html",
  },
  {
    id: 493,
    difficulty: "Hard",
    topic: "Error Handling",
    question: "What is the difference between noexcept(true) and noexcept(expr)?",
    code: `template<typename T>\nvoid swap(T& a, T& b) noexcept(noexcept(T(std::move(a)))) {\n    T temp = std::move(a);\n    a = std::move(b);\n    b = std::move(temp);\n}`,
    options: [
      "They are identical",
      "noexcept(expr) evaluates expr at runtime to decide whether to throw",
      "noexcept(expr) disables exceptions for the expression by wrapping it in a try/catch block that calls std::terminate if an exception escapes. The compiler generates a hidden handler that intercepts any throw and immediately aborts",
      "noexcept(expr) is a compile-time conditional: if expr is true, the function is noexcept. This enables generic code to propagate noexcept guarantees from its type parameters",
    ],
    correctIndex: 3,
    explanation:
      "noexcept(noexcept(T(std::move(a)))) checks at compile time: 'is T's move constructor noexcept?' If yes, swap is noexcept. This is how the standard library conditionally marks functions noexcept based on their template parameter's exception specification.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec.html",
  },
  {
    id: 494,
    difficulty: "Hard",
    topic: "Error Handling",
    question: "How does the copy-and-swap idiom provide the strong exception guarantee for assignment?",
    code: `Widget& Widget::operator=(Widget other) {\n    swap(*this, other);\n    return *this;\n}`,
    options: [
      "The strong guarantee comes from catching exceptions inside operator= and manually restoring the previous state from a saved backup copy. The implementation creates a deep copy of the original state before modification and restores it in the catch block",
      "swap can throw because it performs three move operations, so this idiom is only basically exception-safe with no rollback guarantee. Each move may allocate memory or acquire resources that could fail, leaving the object in a partially swapped state",
      "It doesn't -- assignment can never be strongly exception-safe because modifying an object always involves intermediate states that could be observed. Once you begin writing to a member variable, any exception leaves the object in a partially updated, inconsistent state",
      "The parameter is taken by value. If the copy throws, *this is untouched. swap is noexcept, so it can't fail. The old state is destroyed in other's destructor. If anything throws, it happens during the copy",
    ],
    correctIndex: 3,
    explanation:
      "The key insight: the copy (which may throw) happens in the parameter's construction -- before *this is modified. Once the copy succeeds, swap (noexcept) atomically transfers ownership. If the copy throws, *this remains in its original state. This is the strong guarantee.",
    link: "https://en.cppreference.com/w/cpp/language/operators.html",
  },
  {
    id: 495,
    difficulty: "Hard",
    topic: "Error Handling",
    question: "What is std::nested_exception and when would you use it?",
    code: `try {\n    try {\n        throw std::runtime_error("low-level I/O error");\n    } catch (...) {\n        std::throw_with_nested(std::runtime_error("failed to load config"));\n    }\n} catch (const std::exception& e) {\n    // How to access the nested exception?\n}`,
    options: [
      "std::nested_exception is deprecated in C++20 and replaced by std::expected, which provides a more ergonomic way to chain error information. The committee voted to remove nested_exception because its usage was confusing and dynamic_cast hurt performance",
      "Nested exceptions are automatically printed by what()",
      "throw_with_nested creates an exception that wraps the current exception inside it. You can retrieve the inner exception with dynamic_cast<const std::nested_exception&>(e).rethrow_nested(), enabling exception chaining without losing the original cause",
      "It replaces the original exception with a new one",
    ],
    correctIndex: 2,
    explanation:
      "Exception chaining preserves the causal chain: a high-level error wraps the low-level cause. throw_with_nested captures current_exception() and stores it. To inspect the chain, catch and call rethrow_nested(). This is useful in layered architectures where each layer adds context.",
    link: "https://en.cppreference.com/w/cpp/error/throw_with_nested.html",
  },
  {
    id: 496,
    difficulty: "Hard",
    topic: "Error Handling",
    question: "What is std::expected (C++23) and how does it compare to exceptions?",
    options: [
      "It automatically throws the error as an exception if the caller accesses the value without checking, similar to unchecked exceptions in Java. The value() accessor inspects the stored state and invokes throw with the error object if no valid value is present",
      "It's a replacement for try/catch with identical behavior",
      "std::expected<T, E> holds either a value of type T (success) or an error of type E (failure), similar to Rust's Result<T,E>. It makes error paths explicit in the return type, avoids the overhead of stack unwinding, and forces callers to handle errors",
      "It's a type alias for std::optional<T> that adds a convenience has_error() method but otherwise behaves identically to optional. The error state is represented by std::nullopt, and there is no separate error type parameter because the absence of a value signals failure",
    ],
    correctIndex: 2,
    explanation:
      "expected<T,E> is a sum type: success OR error. Unlike exceptions (which have hidden control flow), errors are explicit in the type signature. Unlike error codes (which can be ignored), the caller must inspect the expected before accessing the value. It's ideal for functions where failure is common and expected.",
    link: "https://en.cppreference.com/w/cpp/utility/expected.html",
  },
  {
    id: 1242,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What keyword is used to signal an error condition by throwing an exception in C++?",
    options: [
      "The throw keyword creates an exception object and begins the stack unwinding process",
      "The catch keyword creates an exception object and begins the stack unwinding process",
      "The raise keyword creates an exception object and begins the stack unwinding process",
      "The error keyword creates an exception object and begins the stack unwinding process",
    ],
    correctIndex: 0,
    explanation:
      "The throw keyword is used to raise an exception in C++. When executed, it creates an exception object and initiates stack unwinding, transferring control to the nearest matching catch handler.",
    link: "https://en.cppreference.com/w/cpp/language/throw",
  },
  {
    id: 1243,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What is the base class for most standard library exception types in C++?",
    options: [
      "std::error_code serves as the root of the standard exception class hierarchy",
      "std::exception serves as the root of the standard exception class hierarchy",
      "std::runtime_error serves as the root of the standard exception class hierarchy",
      "std::logic_error serves as the root of the standard exception class hierarchy",
    ],
    correctIndex: 1,
    explanation:
      "std::exception is the base class from which all standard exception types derive. It provides a virtual what() method that returns a description of the error. std::runtime_error and std::logic_error are derived classes.",
    link: "https://en.cppreference.com/w/cpp/error/exception",
  },
  {
    id: 1244,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "What does the catch(...) syntax do in a try-catch block?",
    options: [
      "It catches only exceptions derived from std::exception and ignores all other types thrown",
      "It catches only integer and string exceptions that are thrown without a class wrapper type",
      "It catches any exception regardless of type, acting as a universal exception handler block",
      "It catches only the most recently thrown exception and silently discards all previous ones",
    ],
    correctIndex: 2,
    explanation:
      "The catch(...) handler, known as a catch-all, matches any thrown exception regardless of its type. It is often used as a last resort to ensure no exception goes unhandled, though it cannot access the exception object directly.",
    link: "https://en.cppreference.com/w/cpp/language/try_catch",
  },
  {
    id: 1245,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What member function does std::exception provide to describe the error?",
    options: [
      "The message() virtual function returns a C-style string describing the exception cause",
      "The describe() virtual function returns a C-style string describing the exception cause",
      "The reason() virtual function returns a C-style string describing the exception cause",
      "The what() virtual function returns a C-style string describing the exception cause",
    ],
    correctIndex: 3,
    explanation:
      "std::exception provides a virtual what() method that returns a const char* description of the error. Derived classes override this to provide specific error messages.",
    link: "https://en.cppreference.com/w/cpp/error/exception/what",
  },
  {
    id: 1246,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What is the difference between std::runtime_error and std::logic_error?",
    options: [
      "runtime_error represents errors detectable only at runtime while logic_error represents programming mistakes",
      "runtime_error is thrown by the compiler during builds while logic_error is thrown during program execution",
      "runtime_error catches all exception types automatically while logic_error catches only typed exceptions",
      "runtime_error requires an error code parameter while logic_error requires only a string message argument",
    ],
    correctIndex: 0,
    explanation:
      "std::runtime_error is for errors that can only be detected during execution, such as file not found or network failure. std::logic_error is for errors resulting from faulty logic that could theoretically be detected before running, such as invalid arguments.",
    link: "https://en.cppreference.com/w/cpp/error/runtime_error",
  },
  {
    id: 1247,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What happens if an exception is thrown but no matching catch handler exists?",
    options: [
      "The exception is silently ignored and the program continues executing from the throw point",
      "The program calls std::terminate which by default aborts the program with an error message",
      "The exception is automatically converted to an integer error code and stored in a global var",
      "The program restarts from the main function and attempts to re-execute from the beginning",
    ],
    correctIndex: 1,
    explanation:
      "If no matching catch handler is found after unwinding the entire call stack, std::terminate() is called. By default, this calls std::abort(), ending the program. You can customize this behavior by installing a custom terminate handler.",
    link: "https://en.cppreference.com/w/cpp/error/terminate",
  },
  {
    id: 1248,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "Why should you catch exceptions by const reference rather than by value?",
    options: [
      "Catching by value is a syntax error that the compiler will reject during compilation",
      "Catching by value causes the exception to be rethrown automatically after the handler runs",
      "Catching by value converts the exception to a different type that loses the error message",
      "Catching by value can cause object slicing if a derived exception type was originally thrown",
    ],
    correctIndex: 3,
    explanation:
      "Catching by value copies the exception object, which can slice off derived class information if the actual exception is a subclass of the caught type. Catching by const reference preserves the full dynamic type and avoids unnecessary copies.",
    link: "https://www.learncpp.com/cpp-tutorial/exceptions-classes-and-inheritance/",
  },
  {
    id: 1249,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What does the noexcept specifier indicate when placed on a function declaration?",
    options: [
      "It tells the compiler to wrap the function body in an implicit try-catch block automatically",
      "It allows the function to throw exceptions but suppresses all warning messages about them",
      "It promises that the function will not throw any exceptions during its normal execution path",
      "It converts any thrown exceptions into error codes that the caller must check after the call",
    ],
    correctIndex: 2,
    explanation:
      "The noexcept specifier declares that a function will not throw exceptions. If an exception does escape a noexcept function, std::terminate() is called. This allows the compiler to optimize based on the guarantee.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec",
  },
  {
    id: 1250,
    difficulty: "Easy",
    topic: "Error Handling",
    question:
      "What does std::out_of_range indicate when thrown by a standard library container?",
    options: [
      "It indicates that the container has run out of available memory for storing new elements",
      "It indicates that an index or key used to access an element was outside the valid range",
      "It indicates that the container iterator has been invalidated by a recent modification call",
      "It indicates that the container was used after being moved from and is in an empty state",
    ],
    correctIndex: 1,
    explanation:
      "std::out_of_range is thrown by functions like std::vector::at() and std::string::at() when the provided index exceeds the valid range. Unlike operator[], at() performs bounds checking and throws this exception on violation.",
    link: "https://en.cppreference.com/w/cpp/error/out_of_range",
  },
  {
    id: 1251,
    difficulty: "Easy",
    topic: "Error Handling",
    question: "What is the purpose of a try block in C++ exception handling?",
    options: [
      "It automatically corrects any errors that occur and continues execution without interruption",
      "It defines a custom error code that can be returned to the calling function upon failure",
      "It defines a region of code where thrown exceptions are monitored for matching catch handlers",
      "It prevents the compiler from generating any error messages for the enclosed code section",
    ],
    correctIndex: 2,
    explanation:
      "A try block marks a section of code that may throw exceptions. If an exception is thrown within the try block, control transfers to the first matching catch handler that follows it. Without a try block, exceptions propagate up the call stack.",
    link: "https://en.cppreference.com/w/cpp/language/try_catch",
  },
  {
    id: 1252,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What is stack unwinding and when does it occur in C++?",
    options: [
      "It is the process of allocating stack frames for nested function calls during normal execution",
      "It is the optimization that removes unused local variables from the stack at compile time",
      "It is the mechanism that copies stack data to the heap when a function returns a large object",
      "It is the process of destroying local objects in reverse order as exceptions propagate upward",
    ],
    correctIndex: 3,
    explanation:
      "Stack unwinding occurs when an exception is thrown. The runtime destroys all local objects in the current scope in reverse order of construction, then moves to the calling function and repeats until a matching catch handler is found.",
    link: "https://en.cppreference.com/w/cpp/language/throw#Stack_unwinding",
  },
  {
    id: 1253,
    difficulty: "Medium",
    topic: "Error Handling",
    question:
      "What does the throw; statement with no operand do inside a catch block?",
    options: [
      "It rethrows the currently caught exception without creating a new copy of the object",
      "It throws a new default-constructed std::exception to replace the currently caught one",
      "It terminates the catch block immediately and resumes execution after the try-catch block",
      "It throws a null exception that signals to the caller that the error has been fully handled",
    ],
    correctIndex: 0,
    explanation:
      "A bare throw; inside a catch block rethrows the exact same exception object that was caught, preserving its original dynamic type. This is useful when you want to perform partial handling and then let a higher-level handler deal with the exception.",
    link: "https://en.cppreference.com/w/cpp/language/throw",
  },
  {
    id: 1254,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "Why should destructors generally be noexcept in C++?",
    options: [
      "Because the compiler silently discards exceptions from destructors without any side effects",
      "Because throwing from a destructor during stack unwinding causes std::terminate to be called",
      "Because destructors cannot syntactically contain throw statements according to the standard",
      "Because exception objects are always destroyed before the destructor of any class is invoked",
    ],
    correctIndex: 1,
    explanation:
      "If a destructor throws while stack unwinding is already in progress from another exception, the program calls std::terminate(). Since C++11, destructors are implicitly noexcept unless explicitly declared otherwise. This makes it critical to ensure destructors never throw.",
    link: "https://en.cppreference.com/w/cpp/language/destructor",
  },
  {
    id: 1255,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What is RAII and how does it relate to exception safety in C++?",
    options: [
      "It is a design pattern that uses global error handlers to manage resource cleanup on failure",
      "It is a compiler optimization that eliminates resource cleanup code when exceptions are disabled",
      "It ties resource lifetime to object lifetime so destructors automatically clean up on exceptions",
      "It is a runtime system that tracks all allocated resources and frees them when exceptions occur",
    ],
    correctIndex: 2,
    explanation:
      "Resource Acquisition Is Initialization (RAII) binds resource management to object lifetime. When an exception causes stack unwinding, destructors of local RAII objects are called automatically, ensuring resources like memory, file handles, and locks are properly released.",
    link: "https://en.cppreference.com/w/cpp/language/raii",
  },
  {
    id: 1256,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What are the three levels of exception safety guarantees in C++?",
    options: [
      "Basic guarantee preserves invariants, strong guarantee rolls back state, nothrow never throws",
      "Weak guarantee catches all errors, medium guarantee logs errors, full guarantee prevents errors",
      "Level one handles runtime errors, level two handles logic errors, level three handles both types",
      "Minimal guarantee frees memory, standard guarantee closes files, complete guarantee does both",
    ],
    correctIndex: 0,
    explanation:
      "The three levels are: basic (invariants preserved, no leaks, but state may change), strong (operation either succeeds completely or has no effect, like a transaction), and nothrow (operation guaranteed not to throw, like destructors and swap).",
    link: "https://en.cppreference.com/w/cpp/language/exceptions#Exception_safety",
  },
  {
    id: 1257,
    difficulty: "Medium",
    topic: "Error Handling",
    question:
      "What does std::current_exception() return and when is it typically used?",
    options: [
      "It returns a reference to the active exception and is used to modify the exception in place",
      "It returns the error code of the active exception and is used for logging in catch handlers",
      "It returns a string description of the active exception and is used for debug output messages",
      "It returns an exception_ptr to the active exception and is used to transport exceptions across threads",
    ],
    correctIndex: 3,
    explanation:
      "std::current_exception() captures the currently handled exception as a std::exception_ptr, which can be stored, copied, and rethrown later using std::rethrow_exception(). This is commonly used to transport exceptions from worker threads to the main thread.",
    link: "https://en.cppreference.com/w/cpp/error/current_exception",
  },
  {
    id: 1258,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What happens if you call std::terminate() in a C++ program?",
    options: [
      "It throws a std::termination_error exception that can be caught by a global handler",
      "It calls the currently installed terminate handler which by default calls std::abort",
      "It gracefully shuts down all threads and flushes all output buffers before exiting",
      "It returns a special error code to the operating system without stopping the program",
    ],
    correctIndex: 1,
    explanation:
      "std::terminate() invokes the currently installed terminate handler function. By default, this handler calls std::abort(), which terminates the program immediately. You can install a custom handler using std::set_terminate() for logging or cleanup.",
    link: "https://en.cppreference.com/w/cpp/error/terminate",
  },
  {
    id: 1259,
    difficulty: "Medium",
    topic: "Error Handling",
    question:
      "How does std::error_code differ from throwing an exception for error reporting?",
    options: [
      "error_code automatically unwinds the stack while exceptions require manual cleanup code",
      "error_code can only represent system errors while exceptions can represent any error type",
      "error_code is a lightweight value type returned from functions while exceptions use stack unwinding",
      "error_code is deprecated in modern C++ while exceptions are the only recommended error approach",
    ],
    correctIndex: 2,
    explanation:
      "std::error_code is a lightweight, non-throwing mechanism for reporting errors. It stores an integer code and a category, and is returned from functions as an output parameter or return value. Unlike exceptions, it has no stack unwinding overhead.",
    link: "https://en.cppreference.com/w/cpp/error/error_code",
  },
  {
    id: 1260,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What is a function try block and where is it most commonly used?",
    options: [
      "It wraps the entire function body including the initializer list in a single try-catch block",
      "It replaces the normal function body with a block that automatically catches all exceptions",
      "It marks a function as safe to call from multiple threads by catching concurrent exceptions",
      "It creates a separate stack frame for exception handling to isolate errors from normal flow",
    ],
    correctIndex: 0,
    explanation:
      "A function try block places the try keyword before the function body and can catch exceptions thrown during member initialization in constructors. This is the only way to catch exceptions from the constructor initializer list.",
    link: "https://en.cppreference.com/w/cpp/language/function-try-block",
  },
  {
    id: 1261,
    difficulty: "Medium",
    topic: "Error Handling",
    question: "What does the noexcept operator do when used in an expression context?",
    options: [
      "It catches any exception thrown by the expression and converts it into a boolean false value",
      "It forces the expression to never throw by wrapping it in an implicit try-catch block around it",
      "It removes the noexcept specifier from a function pointer to allow exceptions to propagate out",
      "It evaluates at compile time whether the given expression is declared as non-throwing or not",
    ],
    correctIndex: 3,
    explanation:
      "The noexcept operator is a compile-time check that returns true if the expression is declared noexcept and false otherwise. This is useful in template code to conditionally mark functions noexcept based on whether their operations can throw.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept",
  },
  {
    id: 1262,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "What is std::nested_exception and how does it help with error handling?",
    options: [
      "It creates a chain of catch blocks that are automatically tried in sequence until one matches",
      "It converts multiple simultaneous exceptions into a single exception with a combined message",
      "It allows capturing a current exception inside a new one to preserve the full error chain context",
      "It provides nested try blocks that each handle a specific exception type from an inner scope",
    ],
    correctIndex: 2,
    explanation:
      "std::nested_exception captures the currently active exception via std::current_exception() and stores it. When combined with std::throw_with_nested(), it allows building exception chains where each level adds context while preserving the original cause.",
    link: "https://en.cppreference.com/w/cpp/error/nested_exception",
  },
  {
    id: 1263,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "Why does throwing an exception from a move constructor potentially violate the strong exception guarantee?",
    options: [
      "The source object may be left in a partially moved-from state that cannot be restored to original",
      "The compiler automatically converts move operations to copies when exceptions are enabled",
      "Move constructors are implicitly noexcept so any throw statement in them is a compilation error",
      "The destination object holds a copy of the data so the source object remains fully unchanged",
    ],
    correctIndex: 0,
    explanation:
      "If a move constructor throws after partially transferring resources, the source object may be in an inconsistent state and the destination is incomplete. This is why containers like std::vector prefer copy over move when the move constructor is not noexcept.",
    link: "https://en.cppreference.com/w/cpp/utility/move_if_noexcept",
  },
  {
    id: 1264,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "How does std::expected from C++23 improve error handling compared to exceptions?",
    options: [
      "It replaces all exception types with integer error codes that are faster to compare and process",
      "It encodes success or failure in the return type so errors are handled without stack unwinding",
      "It automatically retries failed operations a configurable number of times before reporting errors",
      "It provides compile-time error checking that prevents any runtime errors from ever being thrown",
    ],
    correctIndex: 1,
    explanation:
      "std::expected<T, E> holds either a value of type T on success or an error of type E on failure, directly in the return type. This avoids the overhead of stack unwinding and makes error paths explicit in the function signature, similar to Rust's Result type.",
    link: "https://en.cppreference.com/w/cpp/utility/expected",
  },
  {
    id: 1265,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "What problem does std::exception_ptr solve that a simple catch and rethrow cannot?",
    options: [
      "It allows exceptions to be thrown with higher priority so they are caught before other types",
      "It enables exceptions to be serialized to disk and reconstructed in a later program session",
      "It provides type-safe downcasting of exception objects without using dynamic_cast operations",
      "It allows exceptions to be stored and transported across thread boundaries for later rethrowing",
    ],
    correctIndex: 3,
    explanation:
      "std::exception_ptr can hold any exception in a type-erased wrapper that is safely copyable across threads. This is essential for propagating exceptions from std::async, std::future, and thread pools back to the calling thread.",
    link: "https://en.cppreference.com/w/cpp/error/exception_ptr",
  },
  {
    id: 1266,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "What is the copy-and-swap idiom and how does it provide the strong exception guarantee?",
    options: [
      "It performs modifications on a copy first, then swaps with the original using a nothrow swap",
      "It copies the exception object before rethrowing to prevent the original from being destroyed",
      "It swaps the catch block order so the most specific exception types are handled before general",
      "It copies all function arguments into temporary variables to isolate them from thrown exceptions",
    ],
    correctIndex: 0,
    explanation:
      "The copy-and-swap idiom works by: 1) creating a copy of the data (which may throw), 2) modifying the copy, and 3) swapping the copy with the current state using a non-throwing swap. If the copy or modification throws, the original object remains unchanged.",
    link: "https://en.cppreference.com/w/cpp/language/operators#Assignment_operator",
  },
  {
    id: 1267,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "What is the purpose of std::error_category and how does it extend the error code system?",
    options: [
      "It groups exception types into categories so catch blocks can match entire families at once",
      "It assigns severity levels to error codes so the program can prioritize which errors to handle",
      "It defines a domain of error codes with custom messages so different libraries avoid code conflicts",
      "It maps error codes to exception types so error codes can be automatically converted to throws",
    ],
    correctIndex: 2,
    explanation:
      "std::error_category is an abstract base class that defines a category of error codes. Each category provides its own name and message mappings. This prevents conflicts between error codes from different libraries that might use the same integer values.",
    link: "https://en.cppreference.com/w/cpp/error/error_category",
  },
  {
    id: 1268,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "Why does std::vector use move_if_noexcept when reallocating its internal storage?",
    options: [
      "Moving elements is always faster than copying so it uses move unconditionally for performance",
      "It must preserve the strong guarantee so it only moves elements whose move cannot throw",
      "It checks at runtime whether each element was successfully moved before proceeding to the next",
      "It avoids calling destructors on moved-from elements to prevent double-free memory corruption",
    ],
    correctIndex: 1,
    explanation:
      "During reallocation, std::vector must maintain the strong exception guarantee. If a move constructor could throw, a partial move would leave some elements in the old buffer and some in the new one, with no way to recover. Using copy instead is safe because the originals remain intact.",
    link: "https://en.cppreference.com/w/cpp/utility/move_if_noexcept",
  },
  {
    id: 1269,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "What happens when an exception is thrown during the construction of a subobject in a class?",
    options: [
      "The entire object is constructed with default values and the exception is silently suppressed",
      "The compiler inserts retry logic that attempts to reconstruct the failed subobject once more",
      "All subobjects including the failed one have their destructors called in reverse creation order",
      "Only the fully constructed subobjects have their destructors called before the exception propagates",
    ],
    correctIndex: 3,
    explanation:
      "C++ guarantees that destructors are only called for subobjects that were fully constructed. If the third member's constructor throws, the first two members (already constructed) are destroyed in reverse order, but the third and any subsequent members are not.",
    link: "https://en.cppreference.com/w/cpp/language/destructor#Exceptions",
  },
  {
    id: 1270,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "How does std::system_error relate to std::error_code in the C++ error handling system?",
    options: [
      "system_error replaces error_code entirely and should be used instead in all modern C++ code",
      "system_error is a lightweight value type while error_code is the exception class that wraps it",
      "system_error is an exception class that carries an error_code to provide structured error details",
      "system_error converts error_code values into human-readable strings for display purposes only",
    ],
    correctIndex: 2,
    explanation:
      "std::system_error derives from std::runtime_error and carries a std::error_code. This bridges the gap between exception-based and error-code-based error handling, allowing functions that detect system errors to throw exceptions with structured, queryable error information.",
    link: "https://en.cppreference.com/w/cpp/error/system_error",
  },
  {
    id: 1271,
    difficulty: "Hard",
    topic: "Error Handling",
    question:
      "What guarantee does the standard provide about the order of catch handlers being evaluated?",
    options: [
      "Catch handlers are sorted by specificity at compile time so the most derived type is tried first",
      "Catch handlers are evaluated in the order they appear and the first matching handler is selected",
      "Catch handlers are evaluated in reverse order so the last handler in the source code runs first",
      "Catch handlers are evaluated based on the exception type hierarchy from base class to derived",
    ],
    correctIndex: 1,
    explanation:
      "Catch handlers are tried in the order they appear in the source code. The first handler whose type matches the thrown exception is selected. This is why more specific catch handlers should appear before more general ones to avoid unreachable handlers.",
    link: "https://en.cppreference.com/w/cpp/language/try_catch",
  },
];
