import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 1482,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question: "What does the Rule of Three state in C++?",
    options: [
      "If a class needs a custom destructor, copy constructor, or copy assignment operator, it likely needs all three of them",
      "If a class defines three or more member variables, it must also provide three corresponding accessor functions for them",
      "Every class should limit its public interface to at most three special member functions to maintain a clean design",
      "A class hierarchy should never exceed three levels of inheritance to prevent issues with object slicing and complexity",
    ],
    correctIndex: 0,
    explanation:
      "The Rule of Three states that if a class needs to define any one of the destructor, copy constructor, or copy assignment operator, it almost certainly needs to define all three. This is because if a class manages a resource (like dynamic memory), all three functions need coordinated logic to handle that resource correctly.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1483,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question: "What does the Rule of Five extend the Rule of Three to include?",
    options: [
      "A default constructor and a conversion operator that work alongside the three original special member functions",
      "A swap function and a virtual destructor that supplement the three existing special member functions in the class",
      "A move constructor and a move assignment operator added to the three special member functions from the Rule of Three",
      "An allocator function and a factory method that complement the three originally required special member functions",
    ],
    correctIndex: 2,
    explanation:
      "The Rule of Five extends the Rule of Three to include the move constructor and move assignment operator, which were introduced in C++11. If a class manages resources and defines copy operations and a destructor, it should also define move operations to enable efficient transfers of ownership.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1484,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question: "What does the Rule of Zero recommend for class design?",
    options: [
      "Every class should explicitly define all five special member functions using the default keyword for maximum clarity",
      "Classes should declare all special member functions as deleted to prevent the compiler from generating any of them",
      "Classes should define at least the destructor explicitly and let the compiler generate all the remaining operations",
      "Classes should avoid declaring any special member functions by using RAII types that manage resources automatically",
    ],
    correctIndex: 3,
    explanation:
      "The Rule of Zero advises that classes should not define custom destructors, copy/move constructors, or copy/move assignment operators. Instead, they should use RAII wrapper types like std::unique_ptr, std::shared_ptr, and std::string to manage resources, letting the compiler-generated defaults handle everything correctly.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1485,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question:
      "Which set of special member functions does the Rule of Three specifically address?",
    options: [
      "The default constructor, the move constructor, and the destructor that handle object creation and teardown",
      "The destructor, the copy constructor, and the copy assignment operator that manage resource duplication",
      "The move constructor, the move assignment operator, and the destructor that enable transfer semantics",
      "The default constructor, the copy constructor, and the move constructor that handle different initialization",
    ],
    correctIndex: 1,
    explanation:
      "The Rule of Three addresses the destructor, copy constructor, and copy assignment operator. These three functions are responsible for managing the lifecycle of a resource: cleanup on destruction, duplication on copy construction, and duplication on copy assignment. If one needs custom logic, the others almost always do too.",
    link: "https://www.learncpp.com/cpp-tutorial/the-rule-of-three-and-the-rule-of-zero/",
  },
  {
    id: 1486,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question: "When did the Rule of Five become relevant in C++?",
    options: [
      "With C++11, because move semantics were introduced along with move constructors and move assignment operators",
      "With C++03, because template metaprogramming enabled automatic generation of all special member functions",
      "With C++17, because structured bindings required classes to provide all five special member function types",
      "With C++98, because the language initially defined five different categories of special member function types",
    ],
    correctIndex: 0,
    explanation:
      "The Rule of Five became relevant with C++11, which introduced move semantics. Before C++11, only the Rule of Three existed (destructor, copy constructor, copy assignment). C++11 added the move constructor and move assignment operator, expanding the set of special member functions to five.",
    link: "https://en.cppreference.com/w/cpp/language/move_constructor",
  },
  {
    id: 1487,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question:
      "Which technique does the Rule of Zero rely on to avoid writing custom special member functions?",
    options: [
      "Declaring all special member functions as deleted so the compiler prevents any copying or moving of objects",
      "Using virtual inheritance and abstract base classes to delegate resource management to a parent class level",
      "Using RAII wrapper types like std::unique_ptr and std::string that handle their own resource cleanup work",
      "Writing explicit template specializations for each special member function to automate code generation",
    ],
    correctIndex: 2,
    explanation:
      "The Rule of Zero works by composing classes from RAII types that already manage their own resources. When all members are self-managing types like std::unique_ptr, std::vector, and std::string, the compiler-generated special member functions automatically do the right thing.",
    link: "https://www.learncpp.com/cpp-tutorial/the-rule-of-three-and-the-rule-of-zero/",
  },
  {
    id: 1488,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question: "How many special member functions are involved in the Rule of Five?",
    options: [
      "Three, which are the destructor, the copy constructor, and the copy assignment operator as defined in C++98",
      "Four, which are the copy constructor, copy assignment, move constructor, and the move assignment operator",
      "Six, which are the default constructor, destructor, copy and move constructors, and both assignment operators",
      "Five, which are the destructor, copy constructor, copy assignment, move constructor, and move assignment",
    ],
    correctIndex: 3,
    explanation:
      "The Rule of Five covers exactly five special member functions: the destructor, copy constructor, copy assignment operator, move constructor, and move assignment operator. Note that the default constructor is not part of the Rule of Five, even though it is also a special member function.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1489,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question:
      "Which of the following is NOT one of the five special member functions referenced by the Rule of Five?",
    options: [
      "The copy assignment operator that assigns one object's data to an already existing object of the same type",
      "The default constructor that creates an object without arguments when no initializer values are provided",
      "The move constructor that transfers resources from a temporary rvalue object to a newly constructed object",
      "The destructor that performs cleanup and releases resources when an object reaches the end of its lifetime",
    ],
    correctIndex: 1,
    explanation:
      "The default constructor is not part of the Rule of Five. The five special member functions in the Rule of Five are: destructor, copy constructor, copy assignment operator, move constructor, and move assignment operator. The default constructor is a separate special member function with its own generation rules.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1490,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question:
      "What common problem arises when a class manages a raw pointer but only defines a destructor?",
    options: [
      "The default copy constructor performs a shallow copy, causing two objects to delete the same memory location",
      "The compiler refuses to compile the class because defining a destructor requires a matching copy constructor",
      "The move constructor is automatically deleted by the compiler, preventing any transfer of ownership entirely",
      "The destructor is called multiple times on a single object because the compiler generates duplicate cleanup code",
    ],
    correctIndex: 0,
    explanation:
      "When a class manages a raw pointer and only defines a destructor, the compiler-generated copy constructor performs a shallow (memberwise) copy. This means two objects end up pointing to the same memory. When both are destroyed, the same memory is deleted twice, causing undefined behavior. This is exactly the scenario the Rule of Three is designed to prevent.",
    link: "https://www.learncpp.com/cpp-tutorial/shallow-vs-deep-copying/",
  },
  {
    id: 1491,
    difficulty: "Easy",
    topic: "C++ Idioms",
    question:
      "Which standard library type can replace a raw owning pointer to follow the Rule of Zero?",
    options: [
      "std::shared_mutex, which wraps a raw pointer and adds thread-safe reference counting for shared ownership",
      "std::optional, which manages a raw pointer internally and provides automatic cleanup on scope exit events",
      "std::unique_ptr, which automatically deletes the managed object and eliminates the need for a custom destructor",
      "std::reference_wrapper, which takes ownership of a raw pointer and releases it when the wrapper is destroyed",
    ],
    correctIndex: 2,
    explanation:
      "std::unique_ptr is a smart pointer that automatically deletes the object it manages when it goes out of scope. By replacing raw owning pointers with std::unique_ptr, a class no longer needs a custom destructor, which means it can follow the Rule of Zero and rely entirely on compiler-generated special member functions.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr",
  },
  {
    id: 1492,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "What happens if you define a custom destructor but not a copy constructor in a pre-C++11 class that manages raw memory?",
    options: [
      "The compiler will refuse to compile the class because the Rule of Three is enforced as a mandatory language rule",
      "The compiler generates a move constructor instead of a copy constructor to provide optimal transfer semantics",
      "The class becomes completely noncopyable, and any attempt to copy an instance will result in a link time error",
      "The compiler still generates a default copy constructor that performs a memberwise shallow copy of all fields",
    ],
    correctIndex: 3,
    explanation:
      "In C++ (including pre-C++11), defining a destructor does not prevent the compiler from generating a default copy constructor. The generated copy constructor performs a memberwise copy, which for raw pointers means a shallow copy. This is dangerous because two objects will share the same resource, leading to double-free bugs when both are destroyed.",
    link: "https://en.cppreference.com/w/cpp/language/copy_constructor",
  },
  {
    id: 1493,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "What problem does the following class have according to the Rule of Three?",
    code: `class Buffer {\n    int* data;\n    size_t size;\npublic:\n    Buffer(size_t n) : data(new int[n]), size(n) {}\n    ~Buffer() { delete[] data; }\n};`,
    options: [
      "Copying a Buffer leads to a double delete because the compiler-generated copy constructor copies the raw pointer",
      "The destructor uses delete[] incorrectly and should use delete instead because data points to a single integer",
      "The constructor fails to initialize the array elements to zero, leading to undefined behavior on first access",
      "The size member should be declared as const to prevent accidental modification after the Buffer is constructed",
    ],
    correctIndex: 0,
    explanation:
      "The class defines a destructor that deletes the array, but it does not define a copy constructor or copy assignment operator. The compiler-generated versions perform shallow copies, so copying a Buffer makes two objects point to the same array. When both are destroyed, the same memory is deleted twice, causing undefined behavior.",
    link: "https://www.learncpp.com/cpp-tutorial/the-rule-of-three-and-the-rule-of-zero/",
  },
  {
    id: 1494,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "Why does declaring a user-defined destructor prevent the compiler from implicitly generating move operations?",
    options: [
      "Because the C++ standard requires destructors and move operations to share the same access specifier in a class",
      "Because the standard assumes that custom cleanup logic implies move operations need special handling as well",
      "Because move operations are only generated for classes that derive from std::movable as a required base class",
      "Because the compiler treats the destructor as a template function that conflicts with move operation signatures",
    ],
    correctIndex: 1,
    explanation:
      "The C++ standard takes the conservative position that if a class has a user-defined destructor, it is managing some resource that requires special care. Therefore, the compiler does not generate move operations, as a naive memberwise move might leave the source object in a state where the destructor causes problems. This is part of the reasoning behind the Rule of Five.",
    link: "https://en.cppreference.com/w/cpp/language/move_constructor",
  },
  {
    id: 1495,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question: "What is missing from this class according to the Rule of Five?",
    code: `class Resource {\n    int* ptr;\npublic:\n    Resource() : ptr(new int(0)) {}\n    ~Resource() { delete ptr; }\n    Resource(const Resource& o) : ptr(new int(*o.ptr)) {}\n    Resource& operator=(const Resource& o) {\n        if (this != &o) { delete ptr; ptr = new int(*o.ptr); }\n        return *this;\n    }\n};`,
    options: [
      "A default constructor that takes no parameters and initializes the pointer member to nullptr for safety checks",
      "A virtual destructor that enables proper cleanup when the class is used as a base class in a hierarchy design",
      "A move constructor and a move assignment operator that transfer ownership instead of performing deep copies",
      "A swap member function and a friend declaration for the non-member swap that enables copy-and-swap idiom",
    ],
    correctIndex: 2,
    explanation:
      "This class follows the Rule of Three (destructor, copy constructor, copy assignment) but is missing the two move operations required by the Rule of Five: a move constructor and a move assignment operator. Without them, all transfers of Resource objects will use the slower copy path instead of efficiently moving ownership.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1496,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "What is the copy-and-swap idiom, and how does it relate to implementing the Rule of Three or Five?",
    options: [
      "It replaces the destructor with a swap call that exchanges resources with a temporary, avoiding explicit deletion",
      "It combines the copy constructor and destructor into a single function to reduce the total number of members",
      "It eliminates the need for a copy constructor by using std::swap to move elements directly between two objects",
      "It implements the copy assignment operator by creating a copy via the copy constructor and then swapping contents",
    ],
    correctIndex: 3,
    explanation:
      "The copy-and-swap idiom is an elegant way to implement the copy assignment operator. The parameter is taken by value (invoking the copy constructor), and then the newly created copy is swapped with the current object. This provides a strong exception guarantee: if the copy fails, the original object is left unchanged. The old resources are cleaned up when the parameter's destructor runs.",
    link: "https://stackoverflow.com/questions/3279543/what-is-the-copy-and-swap-idiom",
  },
  {
    id: 1497,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question: "What happens when function f() returns?",
    code: `class Handle {\n    int* p;\npublic:\n    Handle(int v) : p(new int(v)) {}\n    ~Handle() { delete p; }\n};\n\nvoid f() {\n    Handle a(5);\n    Handle b = a;\n}`,
    options: [
      "Undefined behavior occurs because both a and b attempt to delete the same dynamically allocated integer object",
      "Only object a is destroyed because b holds a null pointer after the implicit copy constructor runs on the object",
      "A compilation error occurs because the copy constructor is implicitly deleted when a custom destructor is defined",
      "Nothing harmful happens because the compiler detects the shallow copy and generates a deep copy automatically",
    ],
    correctIndex: 0,
    explanation:
      "Handle defines a destructor but no copy constructor, so the compiler generates a default copy constructor that copies the raw pointer. After Handle b = a, both a and b point to the same int. When f() returns, both destructors run and attempt to delete the same memory, causing undefined behavior (double free). This is the classic Rule of Three violation.",
    link: "https://www.learncpp.com/cpp-tutorial/the-rule-of-three-and-the-rule-of-zero/",
  },
  {
    id: 1498,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "When would you explicitly write = default for a special member function instead of omitting it entirely?",
    options: [
      "When you want to delete the function so the compiler prevents it from being called by any external client code",
      "When another special member was declared and you need to restore the compiler-generated version of a function",
      "When you want the function to be pure virtual so that derived classes are required to provide their own version",
      "When you want the function to throw an exception instead of performing the standard default member operations",
    ],
    correctIndex: 1,
    explanation:
      "Explicitly defaulting a special member function with = default is useful when another user-declared special member function would otherwise suppress its implicit generation. For example, declaring a destructor suppresses implicit move operations. By writing the move constructor and move assignment as = default, you restore the compiler-generated versions while still having a custom destructor.",
    link: "https://en.cppreference.com/w/cpp/language/default_constructor",
  },
  {
    id: 1499,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question: "What is the effect of this class definition?",
    code: `class Widget {\n    Widget(const Widget&) = delete;\n    Widget& operator=(const Widget&) = delete;\npublic:\n    Widget() = default;\n    ~Widget() = default;\n};`,
    options: [
      "Widget objects can be copied but not moved because the deleted declarations only affect copy assignment syntax",
      "Widget objects cannot be created at all because deleting copy operations also deletes the default constructor",
      "Widget objects cannot be copied or moved because declaring copy operations suppresses move generation entirely",
      "Widget objects can be both copied and moved because the default keyword overrides the deleted declarations",
    ],
    correctIndex: 2,
    explanation:
      "Deleting the copy constructor and copy assignment operator prevents copying. Additionally, because these are user-declared copy operations, the compiler will not implicitly generate move operations either. The result is that Widget objects can be default-constructed and destroyed, but they cannot be copied or moved.",
    link: "https://en.cppreference.com/w/cpp/language/move_constructor",
  },
  {
    id: 1500,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "What does declaring a destructor as = default accomplish compared to not declaring one at all?",
    options: [
      "It makes the destructor virtual so that derived classes can override it with their own custom cleanup logic",
      "It forces the compiler to generate the destructor in a separate translation unit to reduce header file bloat",
      "It has no practical effect because the compiler always generates an identical destructor in every situation",
      "It is user-declared, which suppresses implicit generation of the move constructor and move assignment operator",
    ],
    correctIndex: 3,
    explanation:
      "Even though = default produces the same destructor body the compiler would generate, declaring it explicitly makes it user-declared. A user-declared destructor suppresses the implicit generation of move operations. This is a subtle but important distinction: a class with ~MyClass() = default; will not have implicit move operations, while a class with no destructor declaration will.",
    link: "https://en.cppreference.com/w/cpp/language/destructor",
  },
  {
    id: 1501,
    difficulty: "Medium",
    topic: "C++ Idioms",
    question:
      "What happens when you attempt to move an object whose class defines a copy constructor but no move constructor?",
    options: [
      "The copy constructor is called instead because the compiler falls back to copying when no move is available",
      "A compilation error occurs because the compiler cannot implicitly convert a move request into a copy operation",
      "The object is left in a partially moved state because the compiler generates a trivial move as a fallback",
      "The program compiles but crashes at runtime because the temporary is destroyed before the copy fully completes",
    ],
    correctIndex: 0,
    explanation:
      "When a class has a user-declared copy constructor, the compiler does not implicitly generate a move constructor. However, attempting to move such an object does not cause an error. Instead, the copy constructor is selected because an rvalue can bind to a const lvalue reference. The object is copied rather than moved, which is safe but potentially less efficient.",
    link: "https://en.cppreference.com/w/cpp/language/move_constructor",
  },
  {
    id: 1502,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question: "What is the problem with the move assignment operator in this class?",
    code: `class Buffer {\n    int* data;\n    size_t len;\npublic:\n    Buffer(size_t n) : data(new int[n]{}), len(n) {}\n    ~Buffer() { delete[] data; }\n    Buffer(Buffer&& o) noexcept : data(o.data), len(o.len) {\n        o.data = nullptr;\n        o.len = 0;\n    }\n    Buffer& operator=(Buffer&& o) noexcept {\n        delete[] data;\n        data = o.data; len = o.len;\n        o.data = nullptr; o.len = 0;\n        return *this;\n    }\n};`,
    options: [
      "It does not set len to zero for the current object before assigning, causing a temporary inconsistency in state",
      "It fails to handle self-assignment, which would delete data and then read from a now-dangling pointer member",
      "It uses noexcept incorrectly because the delete[] call inside the function body can potentially throw exceptions",
      "It should use std::move on o.data instead of directly copying it, since o.data is an lvalue reference to data",
    ],
    correctIndex: 1,
    explanation:
      "If a Buffer is move-assigned to itself (buf = std::move(buf)), the function first deletes data, then reads o.data, which is the same now-deleted pointer. This is undefined behavior. A self-assignment guard (if (this != &o)) or a swap-based implementation would fix this problem.",
    link: "https://en.cppreference.com/w/cpp/language/move_assignment",
  },
  {
    id: 1503,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "Which statement about move operations is correct for these two structs?",
    code: `struct A {\n    ~A() {}\n};\n\nstruct B {\n    B() = default;\n};`,
    options: [
      "Both A and B have compiler-generated move operations because each struct only contains trivially movable members",
      "Neither A nor B has move operations because only classes with explicit constructors can receive move semantics",
      "A has no implicit move operations because of its user-defined destructor, while B retains implicit move operations",
      "B has no implicit move operations because its defaulted constructor suppresses all other implicit declarations",
    ],
    correctIndex: 2,
    explanation:
      "Struct A defines a user-provided destructor (~A() {}), which suppresses the implicit generation of move constructor and move assignment operator. Struct B only has a defaulted default constructor, which does not suppress any other implicit special member functions. Therefore B retains its implicit move operations while A does not.",
    link: "https://en.cppreference.com/w/cpp/language/move_constructor",
  },
  {
    id: 1504,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "Why is it important to mark move constructors and move assignment operators as noexcept?",
    options: [
      "Because the compiler is required to reject any move operation that is not declared noexcept during compilation",
      "Because marking them noexcept allows the compiler to generate faster code by removing all exception table entries",
      "Because without noexcept the move operations are implicitly deleted and the class becomes completely immovable",
      "Because STL containers like std::vector prefer copying over moving if the move operations can potentially throw",
    ],
    correctIndex: 3,
    explanation:
      "STL containers like std::vector need to provide the strong exception guarantee during reallocation. If a move operation might throw, the container cannot safely move elements because a failure partway through would leave the container in an inconsistent state. So it falls back to copying. Declaring move operations noexcept lets the container use the more efficient move path.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec",
  },
  {
    id: 1505,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "Why does the assignment operator in this class take its parameter by value instead of by const reference?",
    code: `class Data {\n    int* arr;\n    size_t sz;\npublic:\n    Data(size_t n) : arr(new int[n]{}), sz(n) {}\n    ~Data() { delete[] arr; }\n    Data(const Data& o) : arr(new int[o.sz]), sz(o.sz) {\n        std::copy(o.arr, o.arr + sz, arr);\n    }\n    friend void swap(Data& a, Data& b) noexcept {\n        using std::swap;\n        swap(a.arr, b.arr);\n        swap(a.sz, b.sz);\n    }\n    Data& operator=(Data o) {\n        swap(*this, o);\n        return *this;\n    }\n};`,
    options: [
      "Taking by value creates the copy upfront, then swap exchanges resources, and old data is cleaned up by the parameter",
      "Taking by value is required by the C++ standard for any assignment operator that participates in overload resolution",
      "Taking by value prevents the need for a destructor because the parameter object automatically releases its own memory",
      "Taking by value allows the compiler to skip the copy construction entirely and directly assign each field one by one",
    ],
    correctIndex: 0,
    explanation:
      "This is the copy-and-swap idiom. Taking the parameter by value means the copy constructor runs to create the copy. Then swap exchanges the internals of the current object with the copy. After the swap, the parameter holds the old data and destroys it when it goes out of scope. This provides a strong exception guarantee: if the copy fails, the original object is unchanged.",
    link: "https://stackoverflow.com/questions/3279543/what-is-the-copy-and-swap-idiom",
  },
  {
    id: 1506,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "Which rule does this class follow, and why are copy operations deleted?",
    code: `class FileHandle {\n    int fd;\npublic:\n    explicit FileHandle(const char* path);\n    ~FileHandle() { if (fd >= 0) close(fd); }\n    FileHandle(FileHandle&& o) noexcept : fd(o.fd) { o.fd = -1; }\n    FileHandle& operator=(FileHandle&& o) noexcept {\n        if (this != &o) {\n            if (fd >= 0) close(fd);\n            fd = o.fd;\n            o.fd = -1;\n        }\n        return *this;\n    }\n    FileHandle(const FileHandle&) = delete;\n    FileHandle& operator=(const FileHandle&) = delete;\n};`,
    options: [
      "It follows the Rule of Zero because deleting copy operations eliminates the need for any resource management logic",
      "It follows the Rule of Five because file descriptors are unique resources that cannot be meaningfully duplicated",
      "It follows the Rule of Three because only the destructor and two copy operations need to be explicitly handled here",
      "It follows the Rule of Five because the standard requires all five special members for classes with any destructor",
    ],
    correctIndex: 1,
    explanation:
      "This class follows the Rule of Five: it defines all five special member functions (destructor, copy constructor, copy assignment, move constructor, move assignment). Copy operations are deleted because a file descriptor represents a unique OS resource that cannot be duplicated by simply copying an integer. The class is move-only, allowing ownership transfer but preventing accidental sharing.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three",
  },
  {
    id: 1507,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question: "What is the status of Widget's move operations?",
    code: `struct Widget {\n    std::string name;\n    Widget() = default;\n    Widget(const Widget&) = default;\n    Widget& operator=(const Widget&) = default;\n    ~Widget() = default;\n};`,
    options: [
      "They are implicitly generated because all explicitly defaulted special members count as compiler-provided ones",
      "They are generated but perform memberwise copy instead of memberwise move due to the defaulted declarations",
      "They are not generated because user-declaring copy operations and a destructor suppresses implicit move generation",
      "They are generated as deleted functions that produce a compilation error only if someone attempts to use them",
    ],
    correctIndex: 2,
    explanation:
      "Even though all special member functions are = default, they are still user-declared. A user-declared copy constructor, copy assignment operator, or destructor suppresses the implicit generation of move operations. Widget has all three, so no move constructor or move assignment operator is generated. Attempting to move a Widget will fall back to copying.",
    link: "https://en.cppreference.com/w/cpp/language/move_constructor",
  },
  {
    id: 1508,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question: "What problem does the cleanup function introduce?",
    code: `class Base {\npublic:\n    virtual void process() = 0;\n    // No virtual destructor\n};\n\nclass Derived : public Base {\n    int* data = new int[100];\npublic:\n    void process() override {}\n    ~Derived() { delete[] data; }\n};\n\nvoid cleanup(Base* b) { delete b; }`,
    options: [
      "It causes a compilation error because you cannot delete a pointer to an abstract class with pure virtual methods",
      "It causes a stack overflow because deleting through a base pointer triggers infinite recursion in the destructor",
      "It causes a compilation error because Derived's destructor is private and inaccessible from outside the class",
      "It triggers undefined behavior because deleting via a base pointer without a virtual destructor skips cleanup",
    ],
    correctIndex: 3,
    explanation:
      "Deleting a derived object through a base pointer when the base class does not have a virtual destructor is undefined behavior. In practice, only the Base destructor runs, and Derived's destructor (which calls delete[] data) is never invoked, causing a memory leak at best and undefined behavior at worst. This is why polymorphic base classes should always have a virtual destructor.",
    link: "https://en.cppreference.com/w/cpp/language/destructor",
  },
  {
    id: 1509,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "What advantage does std::exchange provide in the move constructor compared to manual pointer assignment?",
    code: `class UniqueBuffer {\n    int* data;\n    size_t size;\npublic:\n    UniqueBuffer(size_t n) : data(new int[n]{}), size(n) {}\n    ~UniqueBuffer() { delete[] data; }\n    UniqueBuffer(UniqueBuffer&& o) noexcept\n        : data(std::exchange(o.data, nullptr)),\n          size(std::exchange(o.size, 0)) {}\n};`,
    options: [
      "It assigns nullptr to the source member in a single expression, avoiding the need for a separate nullification step",
      "It provides a strong exception guarantee that manual member assignment cannot offer during the move operation",
      "It performs an atomic swap that is safe for concurrent access from multiple threads without any additional locking",
      "It generates more optimized machine code than manual assignment because it uses internal compiler-specific intrinsics",
    ],
    correctIndex: 0,
    explanation:
      "std::exchange(o.data, nullptr) returns the old value of o.data and sets it to nullptr in one expression. This eliminates the need for a separate statement to null out the source pointer after reading it. The code is more concise and less error-prone, as it is impossible to forget the nullification step. It does not provide atomicity or a stronger exception guarantee.",
    link: "https://en.cppreference.com/w/cpp/utility/exchange",
  },
  {
    id: 1510,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "If a class defines copy operations but no move operations, what happens when std::vector reallocates its storage?",
    options: [
      "The vector calls std::terminate because it cannot find valid move operations for the elements it must relocate",
      "The vector uses the copy constructor to relocate elements because implicit move generation was suppressed here",
      "The vector generates temporary move operations at compile time to optimize the reallocation of every element",
      "The vector skips reallocation entirely and instead extends the existing allocation using a platform allocator",
    ],
    correctIndex: 1,
    explanation:
      "When a class has user-declared copy operations, the compiler does not generate implicit move operations. During vector reallocation, std::vector checks whether the element type has a noexcept move constructor. Since there is no move constructor at all, the vector falls back to using the copy constructor to relocate each element, which is safe but potentially slower.",
    link: "https://en.cppreference.com/w/cpp/container/vector",
  },
  {
    id: 1511,
    difficulty: "Hard",
    topic: "C++ Idioms",
    question:
      "Which statement correctly describes why Design A follows the Rule of Zero?",
    code: `// Design A\nclass Document {\n    std::unique_ptr<Page[]> pages;\n    size_t count;\npublic:\n    Document(size_t n)\n        : pages(std::make_unique<Page[]>(n)), count(n) {}\n};`,
    options: [
      "Design A violates the Rule of Zero because std::unique_ptr cannot manage arrays and requires manual deletion code",
      "Design A violates the Rule of Zero because the count member must be replaced with a smart pointer to follow it",
      "Design A correctly applies the Rule of Zero because all resources are managed by RAII types with no custom members",
      "Design A violates the Rule of Zero because it does not explicitly default all five special member function types",
    ],
    correctIndex: 2,
    explanation:
      "Design A follows the Rule of Zero perfectly. The dynamically allocated array is managed by std::unique_ptr<Page[]>, which handles deletion automatically. The size_t member is a plain value type that needs no special handling. Since no member requires manual resource management, the class does not need to declare any custom special member functions.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr",
  },
];
