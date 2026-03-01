import type { Question } from "./types";

export const questions: Question[] = [
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
      "The classes must use multiple inheritance for dynamic_cast",
      "RTTI must be disabled in the compiler settings for downcasting",
      "The derived class must be declared final to enable RTTI checks",
      "The base class must have at least one virtual function",
    ],
    correctIndex: 3,
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
      "Undefined behavior",
      "Prints 42",
      "Compilation error",
      "Prints 99",
    ],
    correctIndex: 0,
    explanation:
      "Modifying an object that was originally declared const through a const_cast pointer is undefined behavior. The compiler may have placed x in read-only memory or substituted its value at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },
  {
    id: 497,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What are the four named cast operators in C++?",
    options: [
      "implicit_cast, explicit_cast, checked_cast, unchecked_cast",
      "static_cast, dynamic_cast, const_cast, reinterpret_cast",
      "int_cast, float_cast, ptr_cast, ref_cast",
      "safe_cast, unsafe_cast, type_cast, bit_cast",
    ],
    correctIndex: 1,
    explanation:
      "static_cast: compile-time checked conversions (int↔double, base↔derived). dynamic_cast: runtime-checked downcasts (with RTTI). const_cast: add/remove const. reinterpret_cast: bit-level reinterpretation (pointer↔int). Each makes the intent clear and limits what conversions are possible.",
    link: "https://en.cppreference.com/w/cpp/language/explicit_cast.html",
  },
  {
    id: 498,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "When do you use static_cast?",
    code: `double pi = 3.14159;\nint truncated = static_cast<int>(pi);  // 3`,
    options: [
      "Only for pointer casts between related types in an inheritance hierarchy, not for any numeric or value conversions. It checks the relationship at compile time using RTTI metadata embedded in the vtable of polymorphic classes",
      "For casting away const or volatile qualifiers from a pointer or reference",
      "For casting between unrelated pointer types such as int* to double* or Base* to an unrelated OtherClass*. It performs a bitwise reinterpretation of the pointer value without validating type compatibility at compile time",
      "For well-defined conversions the compiler can verify at compile time: numeric type conversions, upcasts, void* to typed pointer, and explicit conversions that would otherwise be implicit",
    ],
    correctIndex: 3,
    explanation:
      "static_cast handles 'natural' conversions: int↔double, enum↔int, derived*→base*, void*→T*. It's checked at compile time -- it won't let you cast between unrelated types. It's the most common and safest named cast. Use it whenever possible over C-style casts.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 499,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does const_cast do?",
    code: `void legacyApi(char* str);\n\nconst char* msg = "hello";\nlegacyApi(const_cast<char*>(msg));`,
    options: [
      "Converts between integer types such as int to long or unsigned to signed, performing sign extension or truncation as needed. It handles widening and narrowing of integral values at compile time",
      "Adds or removes const (or volatile) from a type. It does NOT change the underlying object",
      "Casts the pointer to a different unrelated type, reinterpreting the bit pattern of the address to match the target pointer type. This bypasses all compile-time type checks and aliasing rules",
      "Creates a const copy of the variable and returns it by value, leaving the original object unchanged and fully mutable. The copy is constructed using the type's copy constructor",
    ],
    correctIndex: 1,
    explanation:
      "const_cast is the only cast that can remove const. It's used to interface with legacy C APIs that take non-const pointers but don't modify the data. If the underlying object was declared const, actually writing through the cast pointer is UB.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },
  {
    id: 500,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "Why are C-style casts like (int)x discouraged in C++?",
    code: `double d = 3.14;\nint x = (int)d;  // C-style cast`,
    options: [
      "They are slower at runtime because the C-style cast inserts a type-checking branch that validates the conversion dynamically. The runtime inspects the object's RTTI metadata to confirm the cast is safe before returning the result",
      "They cause compilation warnings on all compilers and are treated as errors when compiling with -Wall -Werror or /W4 /WX flags. The standard mandates that implementations emit at least one diagnostic for every C-style cast expression",
      "They don't work in C++",
      "C-style casts try static_cast, const_cast, and reinterpret_cast in sequence, picking the first that works. This makes them dangerous",
    ],
    correctIndex: 3,
    explanation:
      "A C-style cast can do anything -- including removing const and reinterpreting bits -- with no indication of which conversion occurred. Named casts make your intent explicit and limit the possible conversions, making code safer and easier to audit (you can grep for reinterpret_cast to find dangerous casts).",
    link: "https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/",
  },
  {
    id: 501,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does dynamic_cast return when a pointer downcast fails?",
    code: `Base* b = new Base();\nDerived* d = dynamic_cast<Derived*>(b);`,
    options: [
      "nullptr -- the cast fails because b does not actually point to a Derived object",
      "A pointer to a default-constructed Derived created automatically by the runtime",
      "Throws std::bad_cast",
      "Undefined behavior",
    ],
    correctIndex: 0,
    explanation:
      "dynamic_cast checks RTTI at runtime. For pointer casts, failure returns nullptr. For reference casts, failure throws std::bad_cast. Always check the result of pointer dynamic_casts before using them.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 502,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "When is reinterpret_cast appropriate to use?",
    options: [
      "For low-level bit reinterpretations: pointer↔integer, pointer↔pointer of unrelated types. The result is implementation-defined and bypasses the type system",
      "For upcasting in class hierarchies, converting a derived class pointer to a base class pointer with full runtime type checking. The cast queries the vtable at runtime to verify the relationship between the source and target types before adjusting the pointer",
      "For converting strings to numbers, parsing the character data and producing the equivalent integer or floating-point value. The cast lexically analyzes the character sequence and constructs the numeric result using the standard decimal-to-binary conversion algorithm",
      "For all numeric conversions such as int to double, float to int, and unsigned to signed",
    ],
    correctIndex: 0,
    explanation:
      "reinterpret_cast performs no value transformation -- it just tells the compiler to treat the bits as a different type. Common uses: converting to/from void* or uintptr_t, interfacing with hardware registers, or implementing serialization. It's the most dangerous cast and should be rare in application code.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast.html",
  },
  {
    id: 503,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is an implicit conversion sequence and when does it happen?",
    code: `void print(double x) { std::cout << x; }\nprint(42);  // int → double implicit conversion`,
    options: [
      "The compiler automatically applies conversions when the types don't match. Up to one user-defined conversion is allowed in a chain. These are silent and can cause surprising behavior",
      "Implicit conversions only happen with pointers, not with numeric types or user-defined types. The compiler applies pointer decay and base-class conversions automatically but requires explicit casts for all arithmetic promotions and narrowing conversions",
      "Implicit conversions never happen in C++",
      "Implicit conversions always lose data",
    ],
    correctIndex: 0,
    explanation:
      "C++ allows implicit: int→double, char→int (promotion), derived*→base*, T→bool, and single-argument constructors not marked explicit. The compiler applies up to one user-defined conversion in a sequence. This can cause bugs -- like int converting to bool converting to a class with a bool constructor.",
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion.html",
  },
  {
    id: 504,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is a cross-cast and which cast operator can perform it?",
    code: `class A { virtual ~A() {} };\nclass B { virtual ~B() {} };\nclass C : public A, public B {};\n\nA* a = new C();\nB* b = dynamic_cast<B*>(a);  // cross-cast`,
    options: [
      "static_cast can perform cross-casts because it computes the pointer offset between sibling bases at compile time using class layout information. The compiler calculates the exact byte offset between the two base sub-objects during compilation",
      "Cross-casts require reinterpret_cast because the compiler cannot determine the relationship between unrelated base classes at compile time. The cast blindly reinterprets the pointer bits without adjusting for sub-object offsets within the derived class",
      "Cross-casts are impossible in C++",
      "A cross-cast converts between two sibling base classes (A* → B*) through the most-derived type (C). Only dynamic_cast can do this because it uses RTTI to find the full object and navigate to the other base sub-object",
    ],
    correctIndex: 3,
    explanation:
      "Given A* pointing to a C object, converting to B* requires knowing the full type at runtime to find B's sub-object offset. static_cast can't do this (A and B are unrelated). dynamic_cast uses RTTI: it finds the complete C object (via offset-to-top) and adjusts the pointer to B's sub-object.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 505,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What does static_cast do when downcasting, and why is it dangerous?",
    code: `Base* b = getObject();  // might be Base or Derived\nDerived* d = static_cast<Derived*>(b);  // no runtime check`,
    options: [
      "It returns nullptr if the cast is invalid, providing a safe way to attempt a downcast without risking undefined behavior. The caller must check the return value before dereferencing the resulting pointer",
      "It trusts the programmer and adjusts the pointer at compile time with no runtime check. If b doesn't actually point to a Derived, the cast succeeds but using d is undefined behavior",
      "It always throws std::bad_cast on invalid downcasts, ensuring that incorrect type conversions are caught at runtime. The exception carries a message describing the source and target types to aid debugging",
      "It performs a runtime check like dynamic_cast, querying the object's RTTI metadata through the vtable to verify the actual derived type before allowing the downcast. If the check fails, it returns nullptr",
    ],
    correctIndex: 1,
    explanation:
      "static_cast downcasts are unchecked. The compiler applies an offset adjustment assuming the pointer really points to a Derived. If it doesn't, you get UB (corrupted this pointer). Use static_cast only when you're certain of the type; use dynamic_cast when uncertain.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 506,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is std::bit_cast (C++20) and how does it differ from reinterpret_cast?",
    code: `float f = 1.0f;\nuint32_t bits = std::bit_cast<uint32_t>(f);  // 0x3F800000`,
    options: [
      "They are identical",
      "bit_cast is slower because it copies memory byte-by-byte using memcpy, while reinterpret_cast is zero-cost since it only changes the pointer type. The runtime overhead of the byte copy makes bit_cast unsuitable for hot loops where performance matters",
      "bit_cast copies the bytes from one type into another, producing a well-defined result when both types are the same size and trivially copyable. Unlike reinterpret_cast, bit_cast is safe, constexpr-compatible, and the recommended way to do type punning",
      "reinterpret_cast is safer because it's an older, battle-tested feature with well-defined semantics that have been stable since C++98. Two decades of compiler optimizations have made reinterpret_cast's behavior fully predictable, whereas bit_cast is too new to trust",
    ],
    correctIndex: 2,
    explanation:
      "bit_cast performs a byte-level copy (equivalent to memcpy into the destination type). It's well-defined, constexpr, and doesn't violate strict aliasing. reinterpret_cast pointer casts and dereferencing violate strict aliasing (UB). bit_cast is the modern, safe alternative for type punning.",
    link: "https://en.cppreference.com/w/cpp/numeric/bit_cast.html",
  },
  {
    id: 507,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What does static_cast do to a void* and why must you be careful?",
    code: `Derived d;\nBase* bp = &d;\nvoid* vp = bp;                             // points to Base sub-object\nDerived* dp = static_cast<Derived*>(vp);   // WRONG?`,
    options: [
      "void* cannot be cast to a typed pointer",
      "static_cast<Derived*>(vp) interprets the void* as pointing to a Derived without adjusting the pointer. But vp holds Base*'s address, which may differ from Derived*'s if there's an offset. You must cast back to the exact same type that was cast to void*",
      "This crashes at runtime because static_cast on void* triggers an access violation when the runtime validates the pointer type. The operating system's memory protection detects the invalid cast and raises a segmentation fault before the pointer can be dereferenced",
      "This is always safe",
    ],
    correctIndex: 1,
    explanation:
      "void* strips type information -- including any pointer adjustment that occurred during base↔derived conversion. The roundtrip must use the same type: cast to void* from Base*, cast back to Base*, then static_cast to Derived*. Going directly from void* to Derived* skips the pointer adjustment, causing UB.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 508,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "Is it legal to modify a const-qualified object through const_cast?",
    code: `const int x = 10;\nint* p = const_cast<int*>(&x);\n*p = 20;\nstd::cout << x;`,
    options: [
      "Prints 20 -- const_cast makes the modification safe by telling the compiler to treat the memory as writable for this operation. The cast removes the read-only protection and allows subsequent stores to succeed without undefined behavior",
      "Undefined behavior",
      "Compilation error",
      "Always prints 10 but the modification is silently ignored",
    ],
    correctIndex: 1,
    explanation:
      "const_cast legally removes the const qualifier from a pointer/reference, but writing through it to a truly const object is UB. The compiler is allowed to assume const objects never change, enabling constant folding. Modifying x may appear to work but the compiler may still use the original value 10.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },
  {
    id: 509,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What does the noexcept operator have to do with type traits and casting decisions?",
    code: `template<typename T>\nvoid moveOrCopy(T& dest, T& src) {\n    if constexpr (std::is_nothrow_move_constructible_v<T>) {\n        dest = std::move(src);  // safe to move\n    } else {\n        dest = src;  // fallback to copy\n    }\n}`,
    options: [
      "Type traits like is_nothrow_move_constructible query noexcept specifications at compile time, enabling generic code to choose between move and copy. This is how std::vector decides whether to move or copy during reallocation",
      "noexcept has nothing to do with casting or type traits",
      "Type traits only work with dynamic_cast",
      "noexcept automatically adds static_cast to all move operations, wrapping each move constructor call in a static_cast to the target type. This ensures that move semantics preserve the exact type through the cast, preventing implicit conversions during moves",
    ],
    correctIndex: 0,
    explanation:
      "The noexcept specification is queryable at compile time via the noexcept operator and type traits. std::vector::push_back checks is_nothrow_move_constructible: if the move constructor is noexcept, it moves elements during reallocation (faster). Otherwise, it copies (preserving the strong exception guarantee).",
    link: "https://en.cppreference.com/w/cpp/types/is_move_constructible.html",
  },
  {
    id: 510,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the safe way to cast a pointer to an integer and back?",
    code: `int* p = &someInt;\nuintptr_t addr = reinterpret_cast<uintptr_t>(p);\nint* q = reinterpret_cast<int*>(addr);`,
    options: [
      "reinterpret_cast to/from uintptr_t (or intptr_t) is the correct way. uintptr_t is guaranteed to be large enough to hold any pointer. The roundtrip is implementation-defined but works on all mainstream platforms. Avoid using int or long",
      "Pointer-to-integer conversion is always undefined behavior",
      "Use std::bit_cast for pointer-to-integer and integer-to-pointer conversions, because bit_cast provides well-defined byte-level copying for all type pairs. It copies the raw pointer bytes into the integer representation and back, guaranteeing a lossless roundtrip",
      "Use static_cast for pointer-to-integer and integer-to-pointer conversions, because static_cast validates that the integer type is large enough at compile time. The compiler checks sizeof(uintptr_t) against sizeof(void*) and rejects the cast if it would truncate",
    ],
    correctIndex: 0,
    explanation:
      "uintptr_t (from <cstdint>) is an unsigned integer type guaranteed to hold a pointer value. reinterpret_cast between a pointer and uintptr_t is well-defined. Using int or unsigned long can truncate the pointer on 64-bit platforms (where pointers are 8 bytes but long may be 4).",
    link: "https://en.cppreference.com/w/cpp/types/integer.html",
  },
  {
    id: 511,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What happens with implicit conversions in overload resolution?",
    code: `void f(int x)    { std::cout << "int"; }\nvoid f(double x) { std::cout << "double"; }\nvoid f(long x)   { std::cout << "long"; }\n\nf(3.14f);  // float argument`,
    options: [
      "Calls f(double)",
      "Calls f(int) -- float always converts to int first because integer types have higher priority than floating-point types in overload resolution. The standard ranks integral destinations above floating-point destinations when the source is floating-point",
      "Compilation error",
      "Ambiguous -- multiple conversions are equally good, so the compiler reports an error because float-to-double and float-to-int have the same rank. Both are classified as standard conversions in the overload resolution ranking and neither is preferred",
    ],
    correctIndex: 0,
    explanation:
      "Overload resolution ranks conversions. float→double is a floating-point promotion (standard promotion). float→int and float→long are standard conversions (lower rank). Promotions are always preferred over conversions. If two conversions had equal rank, it would be ambiguous.",
    link: "https://en.cppreference.com/w/cpp/language/overload_resolution.html",
  },
  {
    id: 1062,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What happens when you assign an int to a double variable in C++?",
    code: `int x = 7;
double d = x;`,
    options: [
      "The compiler performs an implicit conversion, promoting the int value to a double automatically with no data loss",
      "The code fails to compile because C++ requires an explicit cast for every conversion between different numeric types",
      "The int is truncated to fit the smaller double format, potentially discarding the least-significant bits of the value",
      "The behavior is undefined because mixing int and double without a cast violates the strict type-safety rules of C++",
    ],
    correctIndex: 0,
    explanation:
      "Assigning an int to a double is a safe implicit widening conversion. The compiler automatically promotes the integer value to double with no data loss, because double can represent all int values. No explicit cast is needed.",
    link: "https://www.learncpp.com/cpp-tutorial/implicit-type-conversion/",
  },
  {
    id: 1063,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does static_cast<int>(3.9) evaluate to?",
    code: `double val = 3.9;
int result = static_cast<int>(val);`,
    options: [
      "4 -- static_cast rounds floating-point values to the nearest integer using standard rounding rules before converting",
      "3 -- static_cast truncates the fractional part, converting toward zero without any rounding applied to the value",
      "A compilation error because static_cast cannot convert between double and int",
      "3.0 -- the cast has no effect since the compiler stores the result as a double even when assigned to an int variable",
    ],
    correctIndex: 1,
    explanation:
      "static_cast<int> on a floating-point value truncates toward zero, discarding the fractional part. So 3.9 becomes 3 and -3.9 would become -3. This is the same behavior as a C-style cast but makes the intent explicit.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1064,
    difficulty: "Easy",
    topic: "Type Casting",
    question:
      "Why is the C-style cast syntax (type)expr generally discouraged in modern C++?",
    code: `double pi = 3.14;
int n = (int)pi;  // C-style cast`,
    options: [
      "C-style casts run slower because they insert a runtime type-check that inspects the object before performing the conversion",
      "C-style casts are rejected by all modern compilers when compiling in C++17 mode or later",
      "C-style casts can silently combine static_cast, const_cast, and reinterpret_cast, making it hard to see what conversion occurs",
      "C-style casts always cause undefined behavior because they bypass the compiler's type system and corrupt the stack frame",
    ],
    correctIndex: 2,
    explanation:
      "A C-style cast tries static_cast, then const_cast, then reinterpret_cast, picking the first that compiles. This hides the programmer's intent and can silently do a dangerous reinterpret_cast. Named casts make the intent explicit and are easier to search for in code.",
    link: "https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/",
  },
  {
    id: 1065,
    difficulty: "Easy",
    topic: "Type Casting",
    question:
      "What is the risk of using static_cast to downcast a base pointer to a derived pointer?",
    code: `struct Base { virtual ~Base() {} };
struct Derived : Base { int extra; };

Base* b = new Base();
Derived* d = static_cast<Derived*>(b);`,
    options: [
      "It always throws std::bad_cast at runtime if the object is not actually a Derived instance, preventing misuse automatically",
      "The compiler rejects the cast and emits an error because static_cast cannot convert between pointers in a class hierarchy",
      "It succeeds but creates a deep copy of the Base object and then constructs a new Derived object from that copied data safely",
      "It compiles without error but does no runtime check",
    ],
    correctIndex: 3,
    explanation:
      "static_cast trusts the programmer and performs no runtime type check. If the object pointed to is not actually a Derived, accessing the pointer leads to undefined behavior. Use dynamic_cast when you need a safe runtime-checked downcast.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1066,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What is the purpose of const_cast in C++?",
    code: `void legacy(char* s);
const char* msg = "hello";
legacy(const_cast<char*>(msg));`,
    options: [
      "It adds or removes const (or volatile) from a pointer or reference so you can pass data to APIs that lack const-correctness",
      "It converts a pointer to a completely unrelated type by reinterpreting the stored address bits as the new pointer type",
      "It performs a runtime-checked downcast on polymorphic types, returning nullptr if the object type does not match the target",
      "It converts numeric types such as int to double or float to int, performing truncation or widening as needed at compile time",
    ],
    correctIndex: 0,
    explanation:
      "const_cast is the only named cast that can add or remove const or volatile qualifiers. It is commonly used to interface with legacy C functions that take non-const pointers but do not modify the data. Modifying a truly const object through the result is undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },
  {
    id: 1067,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What is a narrowing conversion in C++?",
    code: `double big = 1e18;
int n = big;  // narrowing: double to int`,
    options: [
      "A conversion that always succeeds but rounds the result to the nearest representable value in the destination type safely",
      "A conversion where the destination type cannot represent all values of the source type, potentially losing data silently",
      "Any conversion that changes the signedness of an integer, such as converting unsigned int to signed int or vice versa only",
      "A conversion that the compiler rejects outright",
    ],
    correctIndex: 1,
    explanation:
      "A narrowing conversion is one where the destination type cannot represent all possible values from the source. Examples: double to int, long long to int, int to unsigned. C++11 brace initialization {} forbids narrowing conversions, but traditional initialization still allows them with a potential warning.",
    link: "https://www.learncpp.com/cpp-tutorial/implicit-type-conversion/",
  },
  {
    id: 1068,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does dynamic_cast require in order to work on a class hierarchy?",
    code: `struct Base { virtual ~Base() {} };
struct Derived : Base {};
Base* b = new Derived();
Derived* d = dynamic_cast<Derived*>(b);`,
    options: [
      "The base class must have a template parameter",
      "The classes must be in the same translation unit",
      "The base class must be polymorphic so RTTI information is available at runtime",
      "The derived class must use the friend keyword to grant the base class access",
    ],
    correctIndex: 2,
    explanation:
      "dynamic_cast uses Runtime Type Information (RTTI) to verify downcasts at runtime. RTTI is only generated for polymorphic types -- classes with at least one virtual function. Without a virtual function, dynamic_cast on pointers to that class will not compile.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 1069,
    difficulty: "Easy",
    topic: "Type Casting",
    question:
      "What happens to a char value when it is used in an arithmetic expression with an int?",
    code: `char c = 'A';  // ASCII 65
int result = c + 1;`,
    options: [
      "The int is demoted to char first, then both operands are added as single-byte values before the result is widened back",
      "The compiler rejects the expression because char and int are incompatible types that cannot appear in the same operation",
      "The char is treated as a string literal and concatenated with the integer, producing a string such as \"A1\" at runtime",
      "The char undergoes integer promotion to int before the addition, so the operation is performed entirely in int arithmetic",
    ],
    correctIndex: 3,
    explanation:
      "C++ integer promotion rules convert types smaller than int (char, short, bool) to int before arithmetic operations. So 'A' (65) is promoted to int, added to 1, yielding 66. This is an implicit conversion that happens automatically in every arithmetic expression.",
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion.html",
  },
  {
    id: 1070,
    difficulty: "Easy",
    topic: "Type Casting",
    question:
      "Which values are considered false when implicitly converted to bool in C++?",
    code: `int a = 0;
double b = 0.0;
int* p = nullptr;
if (!a && !b && !p)
    std::cout << "all falsy";`,
    options: [
      "Zero (0), 0.0, and null pointers convert to false",
      "Only the literal keyword false converts to false",
      "Negative numbers convert to false while positive numbers convert to true",
      "All integer values below 1 convert to false, meaning both 0 and all negative integers are treated as falsy values",
    ],
    correctIndex: 0,
    explanation:
      "In C++, the values that convert to false are: integer 0, floating-point 0.0, null pointers (nullptr), and null pointer-to-members. Everything else -- including negative numbers, non-zero values, and valid pointers -- converts to true.",
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion.html",
  },
  {
    id: 1071,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What is the purpose of static_cast<void>(expr) in C++ code?",
    code: `[[nodiscard]] int computeValue();
static_cast<void>(computeValue());`,
    options: [
      "It converts the expression result to a void pointer, storing the address so the garbage collector can track the allocation",
      "It calls the expression and then deletes the returned object automatically, acting as a shorthand for manual memory cleanup",
      "It explicitly discards the return value, suppressing compiler warnings about ignoring a [[nodiscard]] function's result",
      "It prevents the function from executing by casting the call to void, effectively turning the statement into a no-op entirely",
    ],
    correctIndex: 2,
    explanation:
      "Casting to void is a standard idiom for deliberately ignoring a return value. When a function is marked [[nodiscard]], the compiler warns if you discard its result. Using static_cast<void>() tells both the compiler and human readers that you intentionally chose to ignore the value.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1072,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What happens when dynamic_cast fails on a pointer versus a reference?",
    code: `class Base { virtual ~Base() {} };
class Derived : public Base {};

Base* bp = new Base();
Derived* dp = dynamic_cast<Derived*>(bp);  // pointer cast

Base& br = *bp;
Derived& dr = dynamic_cast<Derived&>(br);  // reference cast`,
    options: [
      "Pointer failure returns nullptr; reference failure throws std::bad_cast. Because references cannot be null, there is no way to signal failure inline, so the runtime throws an exception instead of returning an error value",
      "Both pointer and reference casts return nullptr when the target type is wrong. The caller must check the return value for null regardless of whether the source operand is a pointer or a reference to the base class",
      "Both pointer and reference casts throw std::bad_cast on failure. There is no nullptr return path for either form because the standard mandates exception-based error reporting for all dynamic_cast operations",
      "Pointer failure throws std::runtime_error; reference failure returns a default-constructed object. The runtime constructs a temporary of the target type as a fallback when the reference cast cannot find the requested subobject",
    ],
    correctIndex: 0,
    explanation:
      "dynamic_cast has two failure modes depending on the operand. For pointers, a failed downcast returns nullptr -- you must check before dereferencing. For references, since there is no null reference, it throws std::bad_cast. This distinction is fundamental to writing correct dynamic_cast code.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 1073,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "When is reinterpret_cast legitimately needed in production C++ code?",
    options: [
      "For low-level tasks like serialization, hardware register access, or interfacing with C APIs that pass data through void pointers. It reinterprets the bit pattern without any value transformation or runtime checking",
      "For downcasting in polymorphic class hierarchies, since reinterpret_cast queries RTTI at runtime to verify the type before adjusting the pointer offset. This makes it the safest cast for navigating inheritance trees",
      "For converting between numeric types like int to double, because reinterpret_cast preserves the exact bit pattern during arithmetic conversions. The cast reinterprets the integer bits as an IEEE 754 floating-point value directly",
      "For removing const qualifiers from pointers when calling legacy C functions that lack const annotations. The cast strips const while preserving the pointer value so the function can accept it",
    ],
    correctIndex: 0,
    explanation:
      "reinterpret_cast is for low-level operations where you need to treat a chunk of memory as a different type: serializing structs to byte arrays, accessing memory-mapped hardware registers, or converting between pointer and integer types. It performs no value transformation and is implementation-defined.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast.html",
  },
  {
    id: 1074,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "What is the key tradeoff between static_cast and dynamic_cast when downcasting a base pointer to a derived pointer?",
    code: `class Base { virtual ~Base() {} };
class Derived : public Base { int extra; };

Base* b = getObject();
Derived* d1 = static_cast<Derived*>(b);   // option A
Derived* d2 = dynamic_cast<Derived*>(b);  // option B`,
    options: [
      "static_cast is always safer because the compiler rejects invalid downcasts at compile time. It analyzes the full program to verify that b truly points to Derived, whereas dynamic_cast skips this compile-time analysis entirely",
      "dynamic_cast is always faster because it avoids computing pointer offsets. The runtime shortcut lets it skip the adjustment that static_cast must compute, making dynamic_cast the better default choice for all situations",
      "They are identical in behavior",
      "static_cast is faster but trusts the programmer blindly",
    ],
    correctIndex: 3,
    explanation:
      "static_cast downcasts adjust the pointer at compile time with zero overhead but no safety net -- if the object is not actually the target type, you get undefined behavior. dynamic_cast queries the RTTI at runtime, adding overhead but providing safety: nullptr on failure for pointers, std::bad_cast for references.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1075,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "What happens when you use const_cast to modify an object that was originally declared const?",
    code: `const int x = 42;
int* p = const_cast<int*>(&x);
*p = 99;
std::cout << x;`,
    options: [
      "It prints 99 reliably because const_cast fully removes the const restriction, giving the pointer unrestricted write access. The compiler treats the pointed-to memory as mutable from that point forward in the program",
      "It always prints 42 because the compiler caches const values in a register and never rereads them from memory. The underlying memory may change, but the compiler-optimized read always returns the original compile-time constant",
      "It causes a compile-time error because const_cast cannot cast away const on fundamental types like int. The cast operator only works on pointers to class types where const is applied to member functions",
      "It is undefined behavior",
    ],
    correctIndex: 3,
    explanation:
      "const_cast legally removes const from a pointer or reference, but writing through it to an object that was declared const is undefined behavior per the standard. The compiler may place the value in read-only memory, fold it as a compile-time constant, or do anything else. const_cast is only safe for objects that are not originally const.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },
  {
    id: 1076,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "What does marking a conversion operator as explicit do in C++11 and later?",
    code: `class Ratio {
    int num, den;
public:
    Ratio(int n, int d) : num(n), den(d) {}
    explicit operator double() const {
        return static_cast<double>(num) / den;
    }
};`,
    options: [
      "The explicit keyword has no effect on conversion operators",
      "It prevents the conversion from being used implicitly in assignments and function calls. You must write static_cast<double>(r) or use direct initialization; however, contextual conversions to bool are still allowed",
      "It makes the conversion operator private, accessible only inside member functions of the same class. External code cannot invoke the conversion at all, whether through implicit conversion or explicit cast syntax",
      "It forces the compiler to emit a runtime check verifying the conversion will not lose precision. If the denominator is zero or the result overflows double, the program throws std::overflow_error automatically",
    ],
    correctIndex: 1,
    explanation:
      "An explicit conversion operator cannot be invoked implicitly -- you must use static_cast, direct initialization, or a C-style cast. This prevents surprising silent conversions. The one exception is contextual conversion to bool (e.g., in if-conditions), which is allowed even when operator bool() is explicit.",
    link: "https://en.cppreference.com/w/cpp/language/cast_operator.html",
  },
  {
    id: 1077,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "When both a converting constructor and a conversion operator can achieve the same conversion, which one does the compiler prefer?",
    code: `struct A {
    operator int() const { return 1; }  // conversion operator
};

struct B {
    B(int x) {}  // converting constructor
};

A a;
B b = a;  // A -> int -> B: which path?`,
    options: [
      "Both paths are equally valid (A::operator int then B::B(int)), forming a single user-defined conversion sequence. If both a direct constructor from A and this two-step path exist, the call is ambiguous and the compiler rejects it",
      "The compiler always prefers the conversion operator on the source type over any constructor on the destination type. Source-side conversions are ranked higher than destination-side conversions in every case",
      "The compiler always prefers the converting constructor and ignores the conversion operator entirely. Constructors have higher priority than conversion operators in the overload resolution ranking rules",
      "The compiler tries the converting constructor first and falls back to the conversion operator only if the constructor is marked explicit. The explicit keyword acts as a priority switch between the two mechanisms",
    ],
    correctIndex: 0,
    explanation:
      "C++ allows at most one user-defined conversion in an implicit conversion sequence. Here, A::operator int() followed by B::B(int) forms one such sequence. If B also had B(const A&), that would be another. When multiple paths exist, overload resolution picks the best match -- or flags it as ambiguous if no path is strictly better.",
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion.html",
  },
  {
    id: 1078,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "What is the rule for safely round-tripping a pointer through void* using static_cast?",
    code: `int x = 42;
void* vp = static_cast<void*>(&x);
int* ip = static_cast<int*>(vp);  // round-trip

Derived d;
Base* bp = &d;
void* vp2 = static_cast<void*>(bp);
Derived* dp = static_cast<Derived*>(vp2);  // safe?`,
    options: [
      "You can cast from void* to any type freely because the compiler stores hidden type metadata alongside the void pointer. The runtime uses this metadata to adjust the address and verify the target type automatically",
      "You must always use dynamic_cast to convert from void* because static_cast cannot operate on void pointers at all. The language prohibits static_cast from producing or consuming void* in any context",
      "You must cast back to the exact same type that was originally cast to void*. In the second example, vp2 holds a Base* address, so casting to Derived* may produce the wrong address if Base has an offset within Derived",
      "Round-tripping through void* is always undefined behavior regardless of the types involved. The C++ standard forbids storing typed pointers in void* because the conversion erases alignment and size information",
    ],
    correctIndex: 2,
    explanation:
      "When you cast a pointer to void* and back, you must cast back to the exact same type. vp2 stores the address of the Base sub-object of d. If Base is at an offset within Derived (e.g., with virtual inheritance), static_cast<Derived*>(vp2) gets the wrong address. You should cast bp back to Base* first, then use dynamic_cast or static_cast for the downcast.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1079,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "How do implicit and explicit conversions between enums and integers work in C++?",
    code: `enum Color { Red, Green, Blue };
enum class Shape { Circle, Square, Triangle };

int a = Red;                             // line 1
int b = Shape::Circle;                   // line 2
int c = static_cast<int>(Shape::Circle); // line 3`,
    options: [
      "All three lines compile successfully because both unscoped and scoped enums convert to int implicitly. The enum class keyword only affects name scoping, not the implicit conversion rules for the underlying type",
      "Line 1 compiles, line 2 fails, and line 3 compiles",
      "All three lines fail to compile because enum-to-int conversion always requires static_cast in C++11 and later. The language removed implicit enum conversions to prevent accidental mixing of enumerator values with integers",
      "Lines 1 and 2 both fail while line 3 compiles, because all enum types",
    ],
    correctIndex: 1,
    explanation:
      "Unscoped enums (enum Color) implicitly convert to their underlying integer type -- line 1 is fine. Scoped enums (enum class Shape) do not implicitly convert to int -- line 2 is a compile error. You need static_cast to explicitly convert a scoped enum to int, as in line 3. This was a deliberate design choice to make scoped enums type-safe.",
    link: "https://en.cppreference.com/w/cpp/language/enum.html",
  },
  {
    id: 1080,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "How do you safely handle a failed dynamic_cast to a reference type?",
    code: `class Base { virtual ~Base() {} };
class Derived : public Base {};

void process(Base& obj) {
    try {
        Derived& d = dynamic_cast<Derived&>(obj);
        // use d
    } catch (const std::bad_cast& e) {
        // handle failure
    }
}`,
    options: [
      "You should check if the reference is null after the cast, the same way you would check a pointer. If dynamic_cast fails on a reference, it sets the result to a special null reference that you can test with an if-statement",
      "dynamic_cast on references never fails",
      "You wrap the cast in a try-catch block and catch std::bad_cast. Since references cannot be null, there is no way to signal failure via a return value, so the runtime throws an exception when the cast is invalid",
      "You must use the nothrow version: dynamic_cast<Derived&>(std::nothrow, obj), which returns a reference to a static sentinel object when the cast fails. The sentinel has all members zeroed out to indicate the failure",
    ],
    correctIndex: 2,
    explanation:
      "Because C++ references cannot be null, dynamic_cast<Derived&>(obj) cannot return a failure sentinel. Instead, it throws std::bad_cast (defined in <typeinfo>) when the object is not of the target type. The standard idiom is to wrap the reference cast in a try-catch block, as shown in the code.",
    link: "https://en.cppreference.com/w/cpp/types/bad_cast.html",
  },
  {
    id: 1081,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "Can you implicitly convert one struct type to another struct type with the same member layout in C++?",
    code: `struct Point2D { double x; double y; };
struct Vec2D   { double x; double y; };

Point2D p = {1.0, 2.0};
Vec2D v = p;  // does this compile?`,
    options: [
      "Yes, C++ performs structural typing",
      "Yes, but only if both structs are declared in the same translation unit. The compiler matches member layouts within a single file, but cannot verify structural equivalence across separate compilation units or header files",
      "No, C++ uses nominal typing",
      "No, but you can use reinterpret_cast between them safely because the standard guarantees identical layout means identical memory representation. The cast reinterprets the bytes and is always well-defined for layout-compatible types",
    ],
    correctIndex: 2,
    explanation:
      "C++ is a nominally-typed language: type identity comes from the type's name, not its structure. Point2D and Vec2D are entirely separate types even though their members match. You must explicitly define a conversion path -- a constructor like Vec2D(const Point2D&), a conversion operator, or a free function. reinterpret_cast between them is technically undefined behavior.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-structs-members-and-member-selection/",
  },
  {
    id: 1082,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What happens when this code runs? Consider the strict aliasing rule.",
    code: `#include <cstdint>

float f = 3.14f;
uint32_t bits = *reinterpret_cast<uint32_t*>(&f);
std::cout << bits;`,
    options: [
      "It is undefined behavior",
      "It prints the IEEE 754 bit pattern of 3.14f as an unsigned integer value",
      "It triggers a compilation error because reinterpret_cast cannot convert float* to uint32_t*",
      "It prints 3 because reinterpret_cast truncates the float value to its integer component",
    ],
    correctIndex: 0,
    explanation:
      "The strict aliasing rule (C++ [basic.lval]) forbids accessing an object through a pointer to an unrelated type. Although reinterpret_cast compiles, dereferencing the resulting uint32_t* to read a float object is undefined behavior. The compiler may optimize based on the assumption that a uint32_t* and float* never alias. Use std::bit_cast or std::memcpy for well-defined type punning.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast.html",
  },
  {
    id: 1083,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "Which statement about std::bit_cast (C++20) is correct given this code?",
    code: `#include <bit>
#include <cstdint>

float f = 1.0f;
auto bits = std::bit_cast<uint32_t>(f);
// bits == 0x3F800000`,
    options: [
      "bit_cast performs a runtime memcpy and is slower than reinterpret_cast for this conversion",
      "bit_cast requires the source and destination to be the same size, trivially copyable types",
      "bit_cast can convert between types of different sizes if the destination is larger than source",
      "bit_cast is just syntactic sugar for reinterpret_cast and has the same aliasing constraints",
    ],
    correctIndex: 1,
    explanation:
      "std::bit_cast requires both source and destination types to be the same size and trivially copyable. Unlike reinterpret_cast, bit_cast is well-defined and does not violate strict aliasing. It is constexpr-friendly, meaning the compiler can evaluate it at compile time. It is not equivalent to reinterpret_cast, which would cause UB for type punning, and it cannot convert between differently sized types.",
    link: "https://en.cppreference.com/w/cpp/numeric/bit_cast.html",
  },
  {
    id: 1084,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "In this diamond hierarchy with virtual inheritance, what does the dynamic_cast return?",
    code: `struct Base { virtual ~Base() = default; };
struct Left : virtual Base {};
struct Right : virtual Base {};
struct Diamond : Left, Right {};

Diamond d;
Left* lp = &d;
Right* rp = dynamic_cast<Right*>(lp);`,
    options: [
      "rp is nullptr because Left and Right are unrelated sibling classes in the hierarchy",
      "The cast fails at compile time because Left* cannot be dynamically cast to Right*",
      "rp points to the Right subobject of d",
      "rp is nullptr because virtual inheritance blocks cross-casting between sibling bases",
    ],
    correctIndex: 2,
    explanation:
      "dynamic_cast can perform cross-casts between sibling classes in a hierarchy when the most-derived object contains both types. Here, lp points to a Diamond object which has both Left and Right subobjects. The runtime uses RTTI to find the Right subobject within the complete Diamond object. Virtual inheritance actually enables a single shared Base, making the diamond well-formed.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 1085,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "A C-style cast (Type)expr tries multiple C++ casts in a defined order. Which sequence is correct?",
    code: `struct B { virtual ~B() = default; };
struct D : B { int x = 42; };

B* bp = new D();
D* dp = (D*)bp;  // What does the C-style cast resolve to?`,
    options: [
      "dynamic_cast, then static_cast, then const_cast, and finally reinterpret_cast in order",
      "static_cast, then reinterpret_cast, then dynamic_cast, and const_cast is never attempted",
      "reinterpret_cast first, then static_cast, then const_cast, and dynamic_cast is never tried",
      "const_cast, then static_cast, then static_cast, then reinterpret_cast",
    ],
    correctIndex: 3,
    explanation:
      "Per the C++ standard [expr.cast], a C-style cast tries in order: (1) const_cast, (2) static_cast followed by const_cast, (3) static_cast alone, (4) reinterpret_cast, (5) reinterpret_cast followed by const_cast. It never tries dynamic_cast. In this case, static_cast can perform the downcast, so (D*)bp behaves like static_cast<D*>(bp) -- which does not perform a runtime check. This is one reason C-style casts are discouraged.",
    link: "https://en.cppreference.com/w/cpp/language/explicit_cast.html",
  },
  {
    id: 1086,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What does const_cast do with the volatile qualifier in this code?",
    code: `volatile int sensor = 100;
int* p = const_cast<int*>(&sensor);
int val = *p;`,
    options: [
      "It compiles, but reading *p is undefined behavior since the object was declared volatile",
      "Compilation error",
      "It compiles and is well-defined",
      "It compiles and prints 100",
    ],
    correctIndex: 0,
    explanation:
      "const_cast can remove both const and volatile qualifiers, so the code compiles. However, accessing a volatile-declared object through a non-volatile glvalue is undefined behavior per [basic.lval], just like modifying a const-declared object through a non-const pointer. The volatile qualifier guarantees that every access is observable; bypassing it breaks that contract and the compiler's assumption about observable behavior.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast.html",
  },
  {
    id: 1087,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "What does static_cast<Derived&>(*this) accomplish in this CRTP pattern?",
    code: `template <typename Derived>
struct Base {
  void interface() {
    static_cast<Derived&>(*this).impl();
  }
};
struct Widget : Base<Widget> {
  void impl() { std::cout << "Widget"; }
};
Widget w;
w.interface();`,
    options: [
      "It performs a runtime-checked downcast equivalent to dynamic_cast with a safety guarantee",
      "It triggers a compile error because you cannot static_cast a base reference to a derived type",
      "It causes undefined behavior because Base has no virtual functions for safe downcasting",
      "It is a compile-time-resolved downcast that enables static polymorphism without vtables",
    ],
    correctIndex: 3,
    explanation:
      "In CRTP, the base class is templated on the derived class. When interface() is called on a Widget object, *this is actually a Widget, so static_cast<Derived&>(*this) is a valid downcast. This pattern provides compile-time polymorphism -- the compiler resolves the call to Widget::impl() without needing a vtable. It is well-defined because the actual object is of the derived type, satisfying static_cast's precondition.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1088,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "Which statement is correct about using static_cast between unrelated pointer types?",
    code: `struct A { int a; };
struct B { double b; };

A obj;
// Attempt 1: B* bp1 = static_cast<B*>(&obj);
// Attempt 2: void* vp = static_cast<void*>(&obj);
//            B* bp2 = static_cast<B*>(vp);`,
    options: [
      "Attempt 1 compiles and is well-defined; Attempt 2 fails because void* loses type information",
      "Attempt 1 fails to compile; Attempt 2 compiles but dereferencing bp2 is undefined behavior",
      "Both attempts compile and produce the same result",
      "Both attempts fail to compile because static_cast forbids all unrelated pointer conversions",
    ],
    correctIndex: 1,
    explanation:
      "static_cast between unrelated class pointer types is ill-formed -- Attempt 1 does not compile. However, any pointer can be converted to void* via static_cast, and void* can be converted back to any pointer type. Attempt 2 compiles, but dereferencing bp2 is undefined behavior because the void* round-trip lost the original type -- bp2 does not actually point to a B object, violating the precondition of static_cast from void*.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast.html",
  },
  {
    id: 1089,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "Which of these type-punning methods is well-defined in standard C++?",
    code: `float f = 3.14f;

// Method A: union
union { float fl; uint32_t ui; } u;
u.fl = f; uint32_t a = u.ui;

// Method B: memcpy
uint32_t b;
std::memcpy(&b, &f, sizeof(b));

// Method C: bit_cast (C++20)
auto c = std::bit_cast<uint32_t>(f);`,
    options: [
      "All three methods (A, B, C) are well-defined in C++; the union approach is the most portable",
      "Only method A (union) is well-defined; memcpy and bit_cast both violate strict aliasing rules",
      "Methods B (memcpy) and C (bit_cast) are well-defined; method A (union) is UB in standard C++",
      "Only method C (bit_cast) is well-defined; both union type punning and memcpy cause UB in C++",
    ],
    correctIndex: 2,
    explanation:
      "In C++, reading a union member other than the last one written is undefined behavior (unlike C, where it is implementation-defined). std::memcpy is well-defined because it copies raw bytes without violating aliasing rules -- both source and destination are accessed through char-like types internally. std::bit_cast (C++20) is also well-defined and provides a constexpr-friendly, type-safe alternative. The union approach, while commonly used, is technically UB in C++.",
    link: "https://en.cppreference.com/w/cpp/numeric/bit_cast.html",
  },
  {
    id: 1090,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "How does the functional-style cast int(x) differ from the C-style cast (int)x?",
    code: `double x = 3.99;
int a = int(x);     // functional-style cast
int b = (int)x;     // C-style cast

struct S { int val; };
// int c = int(someStruct);  // Would this work?`,
    options: [
      "int(x) only works with single-word type names and calls constructors; (int)x can use any type",
      "They are always identical",
      "int(x) is equivalent to static_cast<int>(x) while (int)x follows the C-style resolution order",
      "int(x) is safer because it only permits explicit conversions; (int)x can silently reinterpret",
    ],
    correctIndex: 0,
    explanation:
      "A functional-style cast Type(expr) is defined as equivalent to (Type)expr, but it can only be used with simple type specifiers (single-word type names or typedef names). It cannot be used with multi-word types like unsigned long or pointer types like int*. For a single argument, it behaves identically to the C-style cast, going through the same resolution order. Its key limitation is syntactic, not semantic -- it requires a single-token type name.",
    link: "https://en.cppreference.com/w/cpp/language/explicit_cast.html",
  },
  {
    id: 1091,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "Which overload does the compiler select, and why?",
    code: `void process(double d)  { std::cout << "double"; }
void process(long l)    { std::cout << "long"; }
void process(char* p)   { std::cout << "char*"; }

process(0);`,
    options: [
      "It calls process(char*) because 0 is a null pointer constant that converts to any pointer type",
      "It is ambiguous and fails to compile",
      "It calls process(long) because 0 is an int, and int-to-long is an integral promotion over others",
      "It calls process(double) because arithmetic conversions are preferred over pointer conversions",
    ],
    correctIndex: 1,
    explanation:
      "The integer literal 0 can be implicitly converted to double (floating-point conversion), to long (integral conversion), and to char* (null pointer conversion). All three are standard conversion sequences of the same rank (Conversion rank, not Promotion). Since no conversion is better than the others per the overload resolution ranking rules, the call is ambiguous and the program is ill-formed. Note that int-to-long is an integral conversion, not a promotion (promotion only goes to int or unsigned int).",
    link: "https://en.cppreference.com/w/cpp/language/overload_resolution.html",
  },

  // ── Type Casting (Q1512–Q1541) ──
  {
    id: 1512,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does static_cast do in C++?",
    options: [
      "It performs a compile-time checked conversion between related types",
      "It performs a runtime checked conversion using RTTI polymorphism",
      "It removes const or volatile qualifiers from a variable type",
      "It reinterprets the underlying bit pattern of one type as another",
    ],
    correctIndex: 0,
    explanation:
      "static_cast performs well-defined, compile-time conversions between related types such as numeric promotions, pointer upcasts in class hierarchies, and explicit conversions. It does not use RTTI and does not change constness or reinterpret bits.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1513,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "Which cast operator should be used to convert an int to a double?",
    options: [
      "reinterpret_cast because it converts between unrelated types directly",
      "dynamic_cast because it safely checks the conversion at runtime",
      "const_cast because it adjusts the type qualifier of the value",
      "static_cast because it handles well-defined numeric conversions",
    ],
    correctIndex: 3,
    explanation:
      "static_cast is the correct choice for numeric conversions like int to double. These are well-defined implicit conversions that static_cast makes explicit. dynamic_cast is for polymorphic hierarchies, const_cast is for constness, and reinterpret_cast is for low-level bit reinterpretation.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1514,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What is the purpose of dynamic_cast in C++?",
    options: [
      "It converts between numeric types like int and double at compile time",
      "It safely casts pointers or references within a polymorphic hierarchy",
      "It removes the const qualifier from a pointer to allow modification",
      "It reinterprets the raw bit pattern of a pointer to a different type",
    ],
    correctIndex: 1,
    explanation:
      "dynamic_cast is designed to safely cast pointers and references within polymorphic class hierarchies. It uses RTTI to verify the cast at runtime, returning nullptr for pointer casts or throwing std::bad_cast for reference casts if the conversion is invalid.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1515,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does const_cast do in C++?",
    options: [
      "It converts a value from one numeric type to another numeric type",
      "It performs a runtime-checked downcast in a class hierarchy safely",
      "It reinterprets the memory layout of one type as a different type",
      "It adds or removes const or volatile qualifiers from an expression",
    ],
    correctIndex: 3,
    explanation:
      "const_cast is the only C++ cast that can add or remove the const and volatile qualifiers from a type. It cannot change the underlying type itself. Modifying an originally const object through const_cast results in undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast",
  },
  {
    id: 1516,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What is the role of reinterpret_cast in C++?",
    options: [
      "It performs safe runtime-checked conversions within class hierarchies",
      "It handles standard numeric conversions between arithmetic types only",
      "It converts the bit pattern of a pointer or value to an unrelated type",
      "It removes the const qualifier from a pointer to a constant object",
    ],
    correctIndex: 2,
    explanation:
      "reinterpret_cast performs low-level reinterpretation of the bit pattern of one type as another. It is typically used for pointer-to-integer conversions or casting between unrelated pointer types. The result is implementation-defined and should be used with caution.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast",
  },
  {
    id: 1517,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "Why are C++ named casts preferred over C-style casts?",
    options: [
      "Named casts run faster than C-style casts due to compiler optimizations",
      "Named casts make the programmer's intent explicit and are easier to find",
      "C-style casts cannot perform numeric conversions between built-in types",
      "C-style casts always produce undefined behavior in modern C++ compilers",
    ],
    correctIndex: 1,
    explanation:
      "C++ named casts are preferred because they clearly express the programmer's intent, making code more readable and easier to search for in code reviews. C-style casts can silently perform any combination of static_cast, const_cast, and reinterpret_cast, hiding potentially dangerous conversions.",
    link: "https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/",
  },
  {
    id: 1518,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What is an implicit conversion in C++?",
    options: [
      "A conversion that the compiler performs automatically without a cast",
      "A conversion that requires a static_cast to be written by the coder",
      "A conversion that only works with pointers in polymorphic hierarchies",
      "A conversion that reinterprets the bit pattern without changing value",
    ],
    correctIndex: 0,
    explanation:
      "An implicit conversion is one the compiler performs automatically when a value of one type is used in a context that expects another compatible type. Common examples include int to double, derived pointer to base pointer, and array to pointer decay.",
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion",
  },
  {
    id: 1519,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "Which of the following is a valid use of static_cast?",
    code: `double pi = 3.14159;
int truncated = /* cast here */;`,
    options: [
      "int truncated = dynamic_cast<int>(pi) to safely check the conversion",
      "int truncated = const_cast<int>(pi) to remove the const from a double",
      "int truncated = static_cast<int>(pi) to explicitly truncate the value",
      "int truncated = reinterpret_cast<int>(pi) to reinterpret as an integer",
    ],
    correctIndex: 2,
    explanation:
      "static_cast<int>(pi) explicitly converts the double to int, truncating the fractional part. dynamic_cast only works with polymorphic pointers and references. const_cast only modifies cv-qualifiers. reinterpret_cast cannot convert between floating-point and integer types.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1520,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What happens when dynamic_cast fails on a pointer type?",
    options: [
      "It throws a std::bad_cast exception to signal the invalid conversion",
      "It causes undefined behavior and potentially crashes the application",
      "It triggers a compile-time error because the cast cannot be validated",
      "It returns a nullptr to indicate that the conversion was not valid",
    ],
    correctIndex: 3,
    explanation:
      "When dynamic_cast fails on a pointer, it returns nullptr rather than throwing an exception. This allows the programmer to check the result before using the pointer. When dynamic_cast fails on a reference, it throws std::bad_cast instead, since references cannot be null.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1521,
    difficulty: "Easy",
    topic: "Type Casting",
    question: "What does a C-style cast like (int)3.14 do in C++?",
    options: [
      "It only removes const qualifiers like const_cast does in every case",
      "It tries static_cast first, then const_cast, then reinterpret_cast",
      "It always performs a safe runtime-checked cast like dynamic_cast does",
      "It only works with pointer types and fails on arithmetic conversions",
    ],
    correctIndex: 1,
    explanation:
      "A C-style cast in C++ tries the named casts in a specific order: it first attempts a const_cast, then a static_cast, then static_cast followed by const_cast, then reinterpret_cast, and finally reinterpret_cast followed by const_cast. This makes it powerful but potentially dangerous since it can silently perform unsafe conversions.",
    link: "https://en.cppreference.com/w/cpp/language/explicit_cast",
  },
  {
    id: 1522,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is the result of this code?",
    code: `float f = 3.14f;
int i = static_cast<int>(f);
std::cout << i;`,
    options: [
      "It prints 3 because static_cast truncates the fractional part of the float",
      "It prints 4 because static_cast rounds the float to the nearest integer",
      "It prints 3.14 because static_cast preserves the original floating value",
      "It causes a compilation error because float cannot be cast to int safely",
    ],
    correctIndex: 0,
    explanation:
      "static_cast<int>(f) truncates the decimal part, converting 3.14f to 3. C++ numeric conversions from floating-point to integer always truncate toward zero, they do not round to the nearest integer.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1523,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "When is static_cast used for pointer conversions in a class hierarchy?",
    options: [
      "Only for upcasting from derived to base, and it performs runtime checks",
      "For both upcasting and downcasting, but without any runtime type checks",
      "Only for downcasting from base to derived, and it always throws on error",
      "For casting between completely unrelated class types without restriction",
    ],
    correctIndex: 1,
    explanation:
      "static_cast can perform both upcasts and downcasts in a class hierarchy, but it does not perform any runtime type checking. Upcasts are always safe, but downcasts are only valid if the object actually is of the target type. If the object is not the right type, the behavior is undefined.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1524,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is the output of this code?",
    code: `struct Base { virtual ~Base() {} };
struct Derived : Base { int x = 42; };

Base* b = new Base();
Derived* d = dynamic_cast<Derived*>(b);
std::cout << (d == nullptr ? "null" : "valid");`,
    options: [
      "It prints valid because dynamic_cast always succeeds on related types",
      "It causes undefined behavior because b does not point to a Derived obj",
      "It prints null because b does not actually point to a Derived object",
      "It fails to compile because Base and Derived are not related by a cast",
    ],
    correctIndex: 2,
    explanation:
      "Since b points to a Base object and not a Derived object, the dynamic_cast fails and returns nullptr. dynamic_cast checks the runtime type using RTTI and safely returns nullptr when the pointed-to object is not of the target type.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1525,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What happens when dynamic_cast fails on a reference type?",
    options: [
      "It returns a null reference that can be checked with a comparison",
      "It causes undefined behavior and may corrupt the program state",
      "It silently produces a default-constructed object of the target type",
      "It throws a std::bad_cast exception because references cannot be null",
    ],
    correctIndex: 3,
    explanation:
      "Since references cannot be null, a failed dynamic_cast on a reference throws a std::bad_cast exception instead of returning nullptr. This is the key difference from pointer-based dynamic_cast, which returns nullptr on failure.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1526,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is a narrowing conversion in C++?",
    options: [
      "A conversion that widens a smaller type into a larger type with no loss",
      "A conversion that changes constness of a variable without altering type",
      "A conversion that casts between unrelated pointer types using low level",
      "A conversion that may lose data, such as converting double to int value",
    ],
    correctIndex: 3,
    explanation:
      "A narrowing conversion is one where the destination type cannot represent all values of the source type, potentially losing information. Examples include double to int, long to short, and int to char. C++11 brace initialization prohibits narrowing conversions.",
    link: "https://en.cppreference.com/w/cpp/language/list_initialization",
  },
  {
    id: 1527,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is the output of this code?",
    code: `int x = 65;
char c = static_cast<char>(x);
std::cout << c;`,
    options: [
      "It prints 65 because static_cast preserves the original integer value",
      "It causes undefined behavior because int cannot be safely cast to char",
      "It prints A because 65 is the ASCII code for the uppercase letter A",
      "It fails to compile because static_cast does not allow int to char cast",
    ],
    correctIndex: 2,
    explanation:
      "static_cast<char>(65) converts the integer 65 to its corresponding ASCII character, which is 'A'. When a char is printed with std::cout, it displays the character rather than the numeric value. This is a well-defined conversion via static_cast.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1528,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "Which scenario correctly requires the use of const_cast?",
    options: [
      "Calling a legacy C function that takes a non-const char pointer with a const string",
      "Converting a floating-point number to an integer type for arithmetic truncation only",
      "Downcasting a base class pointer to a derived class pointer in a class hierarchy",
      "Reinterpreting an integer value as a pointer for low-level memory-mapped hardware",
    ],
    correctIndex: 0,
    explanation:
      "const_cast is typically needed when interfacing with legacy APIs that do not use const-correct signatures. If a C function takes char* but you have a const char*, you can use const_cast to remove the const qualifier, provided the function does not actually modify the string.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast",
  },
  {
    id: 1529,
    difficulty: "Medium",
    topic: "Type Casting",
    question:
      "What is the difference between static_cast and a C-style cast for downcasting?",
    options: [
      "static_cast performs a runtime check while C-style cast does not check at all",
      "C-style cast can silently apply reinterpret_cast while static_cast cannot do so",
      "static_cast only works on references while C-style cast only works on pointers",
      "There is no difference because both produce exactly the same compiled machine code",
    ],
    correctIndex: 1,
    explanation:
      "A key danger of C-style casts is that they can silently fall through to reinterpret_cast if static_cast fails, potentially performing a dangerous bit-level reinterpretation. static_cast will produce a compile error instead, making it safer for downcasts in class hierarchies.",
    link: "https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/",
  },
  {
    id: 1530,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "What is the purpose of the explicit keyword on a constructor?",
    options: [
      "It allows the constructor to accept any number of arguments at runtime",
      "It forces the constructor to perform a dynamic_cast on all its arguments",
      "It prevents the compiler from using the constructor for implicit conversions",
      "It makes the constructor virtual so derived classes can override it later",
    ],
    correctIndex: 2,
    explanation:
      "Marking a constructor as explicit prevents the compiler from using it for implicit type conversions. Without explicit, a single-argument constructor can be invoked implicitly to convert one type to another, which can lead to surprising and unintended conversions.",
    link: "https://en.cppreference.com/w/cpp/language/explicit",
  },
  {
    id: 1531,
    difficulty: "Medium",
    topic: "Type Casting",
    question: "Which statement about conversion operators is correct?",
    code: `struct Wrapper {
    int val;
    operator int() const { return val; }
};`,
    options: [
      "The operator int function allows Wrapper to be implicitly converted to int",
      "The operator int function requires an explicit static_cast to trigger always",
      "Conversion operators must always return void and modify the object in place",
      "Conversion operators cannot be defined for built-in types like int or double",
    ],
    correctIndex: 0,
    explanation:
      "A conversion operator like operator int() allows the class to be implicitly converted to the target type. When a Wrapper object is used where an int is expected, the compiler automatically calls this operator. To prevent implicit use, the operator can be marked explicit.",
    link: "https://en.cppreference.com/w/cpp/language/cast_operator",
  },
  {
    id: 1532,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the output of this code?",
    code: `struct Base { virtual ~Base() = default; };
struct A : Base {};
struct B : Base {};

A a;
Base& ref = a;
B& b = dynamic_cast<B&>(ref);`,
    options: [
      "It compiles and b is a valid reference to the A object stored in ref",
      "It causes undefined behavior because A and B are unrelated leaf classes",
      "It throws std::bad_cast because ref does not actually refer to a B obj",
      "It fails to compile because dynamic_cast cannot be used with references",
    ],
    correctIndex: 2,
    explanation:
      "Since ref actually refers to an A object and not a B object, the dynamic_cast to B& fails at runtime. Because this is a reference cast and not a pointer cast, it throws a std::bad_cast exception rather than returning nullptr.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1533,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the result of this code?",
    code: `const int original = 100;
int* ptr = const_cast<int*>(&original);
*ptr = 200;
std::cout << original;`,
    options: [
      "It prints 200 because const_cast allows the modification of any object",
      "It prints 100 because the compiler substituted the value at compile time",
      "It always prints 0 because writing through const_cast resets the memory",
      "It is undefined behavior because the original object was declared const",
    ],
    correctIndex: 3,
    explanation:
      "Modifying an object that was originally declared const through a const_cast pointer is undefined behavior according to the C++ standard. The compiler may have placed original in read-only memory, substituted its value at compile time, or produced any other result.",
    link: "https://en.cppreference.com/w/cpp/language/const_cast",
  },
  {
    id: 1534,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "What does reinterpret_cast guarantee about round-trip pointer conversions?",
    options: [
      "Converting a pointer to an integer and back always yields the same pointer value",
      "Converting between any two pointer types always preserves the pointed-to object",
      "It guarantees that the converted value is valid for dereferencing in all contexts",
      "There are no guarantees at all because reinterpret_cast is always fully undefined",
    ],
    correctIndex: 0,
    explanation:
      "The C++ standard guarantees that a pointer converted to an integer type of sufficient size via reinterpret_cast, and then converted back, yields the original pointer value. However, dereferencing a reinterpret_cast pointer to an unrelated type generally violates strict aliasing rules.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast",
  },
  {
    id: 1535,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the strict aliasing rule and how does it relate to casts?",
    options: [
      "It requires that all casts use static_cast to be considered valid in standard C++",
      "It forbids accessing an object through a pointer of a different type with exceptions",
      "It mandates that dynamic_cast must always be used when casting between class types",
      "It prevents const_cast from being used on objects that are stored in static memory",
    ],
    correctIndex: 1,
    explanation:
      "The strict aliasing rule states that accessing an object through a pointer or reference of an incompatible type is undefined behavior. Exceptions include accessing through a char or unsigned char pointer, or through a type that is part of the object's class hierarchy. reinterpret_cast can easily violate this rule.",
    link: "https://en.cppreference.com/w/cpp/language/reinterpret_cast",
  },
  {
    id: 1536,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the output of this code?",
    code: `struct Base {
    virtual void greet() { std::cout << "Base"; }
    virtual ~Base() = default;
};
struct Derived : Base {
    void greet() override { std::cout << "Derived"; }
};

Derived d;
Base* bp = static_cast<Base*>(&d);
bp->greet();`,
    options: [
      "It prints Base because static_cast converts to the base type statically",
      "It prints Derived because virtual dispatch uses the actual object type",
      "It causes undefined behavior because static_cast should not be used here",
      "It fails to compile because static_cast cannot upcast pointer types ever",
    ],
    correctIndex: 1,
    explanation:
      "Even though bp is a Base pointer obtained via static_cast, virtual dispatch still occurs because greet is virtual. The actual object is a Derived, so Derived::greet is called. static_cast for upcasts is always safe and does not affect virtual dispatch behavior.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1537,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "What happens when you use static_cast to downcast to the wrong derived type?",
    code: `struct Base { virtual ~Base() = default; };
struct A : Base { int a = 1; };
struct B : Base { int b = 2; };

A a;
Base* bp = &a;
B* wrong = static_cast<B*>(bp);`,
    options: [
      "wrong is nullptr because static_cast detects the type mismatch at runtime",
      "wrong points to valid memory but using it is undefined behavior in standard C++",
      "It throws std::bad_cast because the actual object type does not match the target",
      "It fails to compile because static_cast cannot downcast between sibling classes",
    ],
    correctIndex: 1,
    explanation:
      "static_cast does not perform runtime type checking. It compiles successfully because B derives from Base, making the downcast syntactically valid. However, since bp actually points to an A object and not a B object, the resulting pointer is invalid and using it is undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1538,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the purpose of dynamic_cast with void* as the target type?",
    options: [
      "It converts any pointer to void* and returns the address of the most-derived object",
      "It performs a standard upcast to the void base class that all C++ objects inherit from",
      "It deletes the object and returns a void pointer to the freed memory for reallocation",
      "It is illegal because dynamic_cast cannot target void* and produces a compiler error",
    ],
    correctIndex: 0,
    explanation:
      "dynamic_cast<void*> is a special case that returns a pointer to the most-derived object. This is useful when you need the actual starting address of the complete object regardless of which base class subobject you currently have a pointer to.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1539,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "Which statement about cross-casting with dynamic_cast is correct?",
    code: `struct Base1 { virtual ~Base1() = default; };
struct Base2 { virtual ~Base2() = default; };
struct Multi : Base1, Base2 {};

Multi m;
Base1* b1 = &m;
Base2* b2 = dynamic_cast<Base2*>(b1);`,
    options: [
      "The cross-cast fails at compile time because Base1 and Base2 are unrelated classes",
      "The cross-cast returns nullptr because dynamic_cast cannot navigate between siblings",
      "The cross-cast succeeds and b2 points to the Base2 subobject of the Multi instance",
      "The cross-cast compiles but always causes undefined behavior for multiple inheritance",
    ],
    correctIndex: 2,
    explanation:
      "dynamic_cast can perform cross-casts in multiple inheritance hierarchies. Since b1 points to a Multi object and Multi inherits from both Base1 and Base2, dynamic_cast can navigate from the Base1 subobject to the Base2 subobject at runtime using RTTI.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1540,
    difficulty: "Hard",
    topic: "Type Casting",
    question:
      "What is a safe alternative to reinterpret_cast for type-punning in C++20?",
    options: [
      "Using memcpy to copy bytes between objects of different types into proper storage",
      "Using static_cast to convert between unrelated types with a compile-time check only",
      "Using dynamic_cast to safely check the runtime type before reinterpreting the object",
      "Using std::bit_cast to reinterpret the object representation as a different type value",
    ],
    correctIndex: 3,
    explanation:
      "std::bit_cast, introduced in C++20, provides a safe and well-defined way to reinterpret the object representation of one type as another. Unlike reinterpret_cast, it does not violate strict aliasing rules and requires that both types are trivially copyable and the same size.",
    link: "https://en.cppreference.com/w/cpp/numeric/bit_cast",
  },
  {
    id: 1541,
    difficulty: "Hard",
    topic: "Type Casting",
    question: "What is the output of this code?",
    code: `struct Base { virtual ~Base() = default; };
struct Mid : virtual Base {};
struct Leaf : Mid {};

Leaf leaf;
Base* bp = &leaf;
Mid* mp = static_cast<Mid*>(bp);`,
    options: [
      "mp is a valid pointer to the Mid subobject of the Leaf instance in memory",
      "The code fails to compile because static_cast cannot downcast from a virtual base",
      "mp is nullptr because static_cast detects the virtual base mismatch at runtime",
      "The code compiles but produces undefined behavior due to the virtual inheritance",
    ],
    correctIndex: 1,
    explanation:
      "static_cast cannot be used to downcast from a virtual base class because the offset from the virtual base to the derived class is not known at compile time. The compiler rejects this cast with an error. dynamic_cast must be used instead because it can resolve virtual base offsets at runtime using RTTI.",
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
];
