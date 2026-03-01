import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 69,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "Where are local variables stored during function execution?",
    options: ["Code segment", "Heap", "Stack", "Data segment"],
    correctIndex: 2,
    explanation:
      "Local variables are allocated on the stack when a function is called. The stack provides fast, automatic allocation and deallocation -- memory is reclaimed when the function returns.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 70,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "What are the four stages of C/C++ compilation, in order?",
    options: [
      "Preprocess, assemble, compile, link",
      "Link, compile, assemble, preprocess",
      "Preprocess, compile, assemble, link",
      "Compile, link, assemble, preprocess",
    ],
    correctIndex: 2,
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
      "Translates source code into machine code",
      "Manages memory allocation at runtime",
      "Executes source code line by line",
      "Links object files into an executable",
    ],
    correctIndex: 0,
    explanation:
      "A compiler translates human-readable source code into machine code (or an intermediate representation) that the CPU can execute. This is distinct from an interpreter, which executes code line by line.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 72,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What is the decimal value of the binary number 1010?",
    options: ["12", "8", "5", "10"],
    correctIndex: 3,
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
      "They are lost",
      "They persist until overwritten",
      "They are compressed and stored in firmware",
      "They are saved to disk automatically",
    ],
    correctIndex: 0,
    explanation:
      "RAM (Random Access Memory) is volatile -- it requires continuous power to retain data. When the computer shuts down, all RAM contents are lost. Persistent storage (SSD/HDD) retains data without power.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-programming-languages/",
  },
  {
    id: 74,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What does a pointer store?",
    options: [
      "Another variable",
      "A memory address",
      "A type of variable",
      "A data structure",
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
      "A file containing C++ class definitions and their declarations",
      "A compressed archive of multiple source files for distribution",
      "Machine code from a single translation unit, not yet linked",
      "A fully linked executable binary that is ready to be run directly",
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
    options: ["4", "8", "32", "16"],
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
      "An executable (or library) by combining object files",
      "Assembly code from translating high-level source",
      "Preprocessed source code with macros expanded",
      "Object files from compiling individual source files",
    ],
    correctIndex: 0,
    explanation:
      "The linker takes one or more object files, resolves symbol references between them, and produces a final executable or library. It connects function calls to their definitions across translation units.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 78,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "In Boolean logic, what is the result of `true AND false`?",
    options: ["null", "undefined", "false", "true"],
    correctIndex: 2,
    explanation:
      "The AND operator returns true only when both operands are true. Since one operand is false, the result is false.",
    link: "https://www.learncpp.com/cpp-tutorial/boolean-values/",
  },
  {
    id: 79,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What does a stack frame typically contain?",
    options: [
      "Return address, local variables, and function arguments",
      "The entire program's global state and static data",
      "Only the function's machine code instructions",
      "A copy of the heap segment for that function call",
    ],
    correctIndex: 0,
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
      "Heap memory must be initialized to zero by the OS before it is returned to the requesting program",
      "The heap uses slower memory chips located further from the CPU, increasing access latency compared to the stack",
      "The heap is stored on disk and paged into RAM on demand, adding significant latency to every memory access",
      "Heap allocation requires finding a free block and maintaining bookkeeping, while the stack just moves a pointer",
    ],
    correctIndex: 3,
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
      "Unbounded recursion exhausting the fixed-size call stack",
      "Allocating too much memory on the heap by using new excessively",
      "Opening too many files simultaneously via the file system API",
      "Using too many global variables in the program's data section",
    ],
    correctIndex: 0,
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
      "There is no practical difference",
      "Static linking is slower at build time but faster at runtime; dynamic linking is the opposite",
      "Static linking is for C; dynamic linking is for C++",
      "Static linking copies library code into the executable; dynamic linking loads libraries at runtime",
    ],
    correctIndex: 3,
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
    options: ["00000001", "11111111", "10000001", "11111110"],
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
      "Data segment",
      "Heap segment, which stores dynamically allocated",
      "Stack segment, where local variables are allocated",
      "Code (text) segment, which holds executable code",
    ],
    correctIndex: 0,
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
      "04 03 02 01",
      "03 04 01 02",
      "01 02 03 04",
      "02 01 04 03",
    ],
    correctIndex: 0,
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
      "Links against an external library at the preprocessing stage",
      "Textually copies the header file's contents into the source file",
      "Imports a compiled module from the standard library",
      "Declares a forward reference to a class defined elsewhere",
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
      "Direct access to the caller's memory",
      "A copy of the original value",
      "A pointer to the original variable",
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
      "Code that the compiler always rejects with a hard compilation error",
      "A compiler warning that signals poor style but can be safely ignored at runtime",
      "A runtime exception that the program can catch and handle with try/catch",
      "Code whose behavior the language standard does not define",
    ],
    correctIndex: 3,
    explanation:
      "Undefined behavior (UB) means the language standard places no requirements on what happens. The program may crash, produce wrong results, appear to work, or behave differently across compilers. Common causes include null pointer dereference, out-of-bounds access, and signed integer overflow.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },
  {
    id: 89,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question: "What does virtual memory allow?",
    options: [
      "Multiple programs to share the same physical memory addresses without conflicts",
      "Each process to see its own contiguous address space, mapped to physical RAM by the OS",
      "The CPU to operate without any physical RAM installed by using on-die cache instead",
      "Programs to execute directly from disk without needing to be loaded into RAM first",
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
      "Arrays use less total memory per element because they store no per-node pointer overhead unlike linked lists",
      "Arrays store elements contiguously, which is cache-friendly; linked list nodes are scattered, causing cache misses",
      "Linked lists require virtual function calls to traverse each node in the chain, adding dispatch overhead",
      "Arrays are always allocated on the stack, which provides inherently faster access than heap-allocated linked lists",
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
      "It is reset to the base of the stack segment for each new function call",
      "It is decremented to reserve space for the new frame",
      "It remains unchanged",
      "It is incremented to allocate space for the new frame",
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
      "To make the struct directly serializable for network transmission",
      "To reserve space for future member additions without breaking ABI compatibility",
      "To align members to their natural boundaries for efficient CPU access",
      "To prevent buffer overflow attacks by adding guard bytes between fields",
    ],
    correctIndex: 2,
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
      "0.1 and 0.2 cannot be represented exactly in binary floating point, so rounding errors accumulate",
      "The result overflows the representable floating point range and wraps around to a small value",
      "The CPU performs floating point math in decimal internally, introducing binary conversion errors",
      "Floating point arithmetic rounds every result to the nearest integer before storing it",
    ],
    correctIndex: 0,
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
      "A specification defining calling conventions, name mangling, and struct layout at the binary level",
      "A debugging interface for inspecting the internal state of running processes and their memory layout",
      "A standard for source code formatting and naming conventions used consistently across C++ compilers",
      "A high-level API for making system calls from user-space programs in a portable way across platforms",
    ],
    correctIndex: 0,
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
      "A compiled object file that has been assembled into machine code and is ready for the linking stage",
      "A module partition in C++20 that replaces the traditional header-include model used in earlier standards",
      "A single header file that can be included by multiple source files during the preprocessing stage",
      "A source file after preprocessing",
    ],
    correctIndex: 3,
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
      "Using an uninitialized variable",
      "Accessing memory the process does not own",
      "Running out of disk space",
      "Dividing by zero",
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
      "The function is automatically inlined by the compiler to avoid duplication",
      "Multiple definition linker error",
      "The function is silently ignored after the first definition is encountered",
      "Compilation error in each file that includes the header separately",
    ],
    correctIndex: 1,
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
      "Registers use a different voltage level that is inherently faster to switch between states",
      "Registers are physically larger than RAM cells, so they hold more data per individual access",
      "Registers use optical signaling instead of electrical, eliminating propagation delay entirely",
      "Registers are on the CPU die itself, accessed in ~1 cycle, while RAM needs ~100 cycles via the memory bus",
    ],
    correctIndex: 3,
    explanation:
      "Registers are tiny storage locations built directly into the CPU core. They can be read/written in a single clock cycle. RAM sits on separate chips connected via the memory bus, and a cache miss to main memory costs roughly 100+ cycles due to the physical distance and bus latency.",
    link: "https://en.wikipedia.org/wiki/Processor_register",
  },
  {
    id: 99,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "Two threads in the same process each increment a shared global counter without synchronization. Which statement is true?",
    options: [
      "This is only a problem on single-core CPUs where threads are time-sliced rather than running in parallel",
      "Both threads share the same memory space, so the counter may end up with the wrong value due to data races",
      "Each thread has its own private copy of the counter stored in thread-local storage, so no conflict is possible",
      "The OS guarantees that global variable access is atomic and serialized across all threads automatically",
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
      "-255 to 255",
      "-128 to 127",
      "-127 to 127",
      "-128 to 128",
    ],
    correctIndex: 1,
    explanation:
      "In two's complement, one bit pattern (10000000) is used for -128, but there is no +128 because 01111111 is the largest positive value. This asymmetry -- one more negative value than positive -- is a direct consequence of how two's complement encoding works. The total number of representable values is still 256 (2⁸), just shifted: -128 through +127.",
    link: "https://www.learncpp.com/cpp-tutorial/signed-integers/",
  },
  {
    id: 101,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      'A C-style string is stored as char str[] = "hello". How many bytes does this array actually occupy in memory?',
    options: [
      "8 bytes -- rounded up to the nearest word boundary",
      "5 bytes -- one per character",
      "4 bytes -- the size of a pointer on a 32-bit system",
      "6 bytes -- the five characters plus a null terminator '\\0'",
    ],
    correctIndex: 3,
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
      "The header from being modified or transformed by the preprocessor during compilation",
      "The header's contents being pasted multiple times into the same translation unit",
      "The header being included and used by more than one separate source file in the project",
      "Circular dependencies between the compiled source files at link time causing linker errors",
    ],
    correctIndex: 1,
    explanation:
      "Include guards (or #pragma once) prevent multiple inclusion within a single translation unit. When a.cpp includes math_utils.h directly and again indirectly through b.h, without guards the preprocessor would paste the header contents twice, causing duplicate definition errors. Include guards do NOT prevent multiple translation units from each including the header -- that is normal and expected.",
    link: "https://www.learncpp.com/cpp-tutorial/header-guards/",
  },
  {
    id: 103,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question: "What is wrong with this code?",
    code: "int* p = new int(42);\ndelete p;\nstd::cout << *p;",
    options: [
      "Undefined behavior",
      "Memory leak -- you should always set p = nullptr after calling delete to avoid future issues",
      "Compilation error",
      "Nothing -- delete only marks memory as available; the value 42 may still be readable from the address",
    ],
    correctIndex: 0,
    explanation:
      "After delete, the memory pointed to by p is returned to the allocator. The pointer still holds the old address (a dangling pointer), but the memory may have been reused. Dereferencing a dangling pointer is undefined behavior -- it might appear to 'work' and print 42 (if the memory hasn't been reused yet), crash, or produce garbage. The fact that it sometimes appears to work is exactly what makes this bug so dangerous.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/",
  },
  {
    id: 104,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      "A program compiles without errors but crashes when dividing by a user-provided value of zero. What kind of error is this?",
    options: [
      "Runtime error -- the compiler cannot predict what value the user will enter",
      "Compile-time error",
      "Syntax error -- division by zero is invalid syntax",
      "Linker error -- the division operator was not linked properly",
    ],
    correctIndex: 0,
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
      "The compiler's abstract syntax tree (AST)",
      "The call stack -- a runtime structure tracking nested function invocations and their return addresses",
      "The virtual memory page table",
      "The symbol table",
    ],
    correctIndex: 3,
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
      "Only stackVar -- heap memory requires explicit delete",
      "Neither -- all memory allocated in C++ must be manually freed by the programmer",
      "Only heapVar -- stack memory persists until the program ends its main execution",
      "Both -- the OS reclaims all memory when a function returns its control to the caller",
    ],
    correctIndex: 0,
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
      "Each hex digit represents 4 bits (a nibble). F in hex = 1111 in binary = 15 in decimal. 0xFF = 0xF × 16 + 0xF = 15 × 16 + 15 = 255. In binary, 0xFF = 11111111 -- all 8 bits are set. This is also the maximum value for an unsigned byte. A common mistake is confusing 0xF (one nibble, 4 bits) with 0xFF (one full byte, 8 bits).",
    link: "https://www.learncpp.com/cpp-tutorial/numeral-systems-decimal-binary-hexadecimal-and-octal/",
  },
  {
    id: 108,
    difficulty: "Easy",
    topic: "CS Fundamentals",
    question:
      'When we say a CPU has a "64-bit word size," what does that primarily determine?',
    options: [
      "The CPU clock speed is locked at 64 GHz, matching the number of bits in the word size one-to-one",
      "The width of the CPU's general-purpose registers and the natural data size it processes in one operation",
      "Each byte in memory is 64 bits instead of 8 bits, giving every addressable location more data capacity",
      "The CPU can only address 64 bytes of RAM, restricting total available memory to a tiny contiguous region",
    ],
    correctIndex: 1,
    explanation:
      "Word size refers to the width of the CPU's registers and data paths. A 64-bit CPU has 64-bit registers, can perform arithmetic on 64-bit values in a single instruction, and typically has a 64-bit address bus (enabling a theoretical address space of 2⁶⁴ bytes). This does NOT change the definition of a byte (always 8 bits) or clock speed. It directly affects the size of pointers, which is why sizeof(void*) is 8 on 64-bit systems.",
    link: "https://en.wikipedia.org/wiki/Word_(computer_architecture)",
  },
  {
    id: 109,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "Adding 1 to the maximum value of an unsigned int is well-defined (it wraps to 0), but adding 1 to the maximum value of a signed int is undefined behavior. Why does the C++ standard treat them differently?",
    options: [
      "Signed overflow causes a hardware trap on all CPUs, so the standard must leave the behavior undefined to remain portable across different processor platforms",
      "The standard defines unsigned arithmetic as modular (mod 2^N) to support bit manipulation, but leaves signed overflow undefined so compilers can optimize assuming it never happens",
      "Signed integers use a different circuit in the ALU that physically cannot handle overflow, unlike the unsigned addition hardware unit which wraps around naturally",
      "It's a historical accident from the original C standard",
    ],
    correctIndex: 1,
    explanation:
      "The C++ standard deliberately makes signed overflow undefined so compilers can reason that 'x + 1 > x' is always true for signed x, enabling loop optimizations and range analysis. Unsigned integers are defined to wrap modulo 2^N because bitwise operations, hashing, and cryptography depend on predictable wrapping. This is a language design choice, not a hardware limitation -- most CPUs use two's complement for both and would wrap identically at the hardware level.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },
  {
    id: 110,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A modern CPU has L1, L2, and L3 caches. L1 is the fastest but smallest. Why not just make L1 very large?",
    options: [
      "L1 is volatile and would lose data if made larger, so the hardware designers deliberately keep it small to reduce corruption risk",
      "L1 cache memory is a different, more expensive type of silicon that cannot be manufactured in large quantities due to yield constraints",
      "The CPU instruction set only supports addressing a small L1 cache, so enlarging it would require changing the entire ISA",
      "A larger cache requires more time to search and longer wire distances, increasing latency",
    ],
    correctIndex: 3,
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
      "The page was not yet mapped to physical RAM",
      "The program tried to access invalid memory, but the OS silently ignored the error and returned zeroed bytes to the process",
      "The compiler generated incorrect virtual addresses, and the OS patched them at runtime by adjusting the page table entries",
      "The CPU detected a hardware error in RAM and transparently switched to a backup memory module via ECC correction",
    ],
    correctIndex: 0,
    explanation:
      "Modern operating systems use demand paging: virtual pages are not backed by physical RAM until first accessed. When a program touches an unmapped page, the CPU raises a page fault. The OS handles it by allocating a physical frame, updating the page table, and restarting the instruction. This is a 'soft' (or minor) page fault -- completely normal and expected. A 'hard' (major) page fault occurs when the data must be read from disk (e.g., from swap). A segfault, by contrast, happens when the access is genuinely illegal.",
    link: "https://en.wikipedia.org/wiki/Page_fault",
  },
  {
    id: 112,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question: "What does this code print?",
    code: "#define SQUARE(x) x * x\n\nint result = SQUARE(2 + 3);\nstd::cout << result;",
    options: [
      "11 -- it expands to 2 + 3 * 2 + 3, and * binds tighter than +",
      "25 -- the macro evaluates (2+3) as a group first, then squares the result",
      "10 -- the macro doubles the argument, yielding 2 * (2 + 3) = 10",
      "Compilation error",
    ],
    correctIndex: 0,
    explanation:
      "The preprocessor performs textual substitution: SQUARE(2 + 3) becomes 2 + 3 * 2 + 3 (not (2+3) * (2+3)). Due to operator precedence, 3 * 2 is evaluated first, giving 2 + 6 + 3 = 11. Fixing this requires parenthesizing both the parameters and the whole expression: #define SQUARE(x) ((x) * (x)). But even then, macros suffer from double evaluation -- SQUARE(i++) would increment i twice. This is why inline functions or constexpr functions are strictly preferred in C++.",
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
      "The compiler may assume the variable has any value that makes the program 'work,' potentially optimizing away the branch entirely or always taking it",
      "The variable always contains whatever bytes were left by the previous stack frame, making its value unpredictable but fully deterministic",
      "The variable always reads as zero because the compiler inserts a memset to zero the entire stack frame on each function entry",
      "The CPU raises a hardware trap on uninitialized memory reads, and the OS terminates the program with a diagnostic message",
    ],
    correctIndex: 0,
    explanation:
      "Since reading an uninitialized variable is UB, the compiler is free to assume it never happens. In practice, the compiler may optimize as if x has whatever value makes the branch statically decidable, or it may leave it as whatever happened to be in that stack slot. The key insight is that 'garbage' implies a definite (if unknown) value -- but UB means the compiler can do anything, including optimizing the branch to always-taken or never-taken. Debug builds often zero the stack, masking this bug.",
    link: "https://en.cppreference.com/w/cpp/language/ub.html",
  },
  {
    id: 114,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A CPU has a 5-stage instruction pipeline: Fetch, Decode, Execute, Memory, Writeback. If it takes 1 cycle per stage, how many cycles does it take to complete 100 instructions under ideal conditions (no stalls)?",
    options: [
      "100 cycles -- the pipeline completely eliminates per-stage overhead after the first instruction",
      "20 cycles -- the 5-stage pipeline processes 5 instructions simultaneously every cycle",
      "500 cycles -- each instruction takes 5 cycles sequentially and pipelining adds no benefit",
      "104 cycles -- 5 cycles to fill the pipeline, then 1 instruction completes per cycle",
    ],
    correctIndex: 3,
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
      "On the stack, in increment()'s stack frame",
      "In the data segment (or BSS), alongside global variables",
      "On the heap, allocated by the runtime library when the function is first called during execution",
      "In a CPU register, since the compiler detects it is accessed frequently and promotes it from memory",
    ],
    correctIndex: 1,
    explanation:
      "Static local variables have the lifetime of a global variable but the scope of a local variable. They are stored in the data segment (if initialized to a non-zero value) or BSS segment (if zero-initialized), the same place as global variables. The 'static' keyword here means 'static storage duration' -- the variable is initialized once (thread-safely in C++11 and later) and persists for the entire program. It is NOT on the stack, which is why it survives between function calls.",
    link: "https://www.learncpp.com/cpp-tutorial/static-local-variables/",
  },
  {
    id: 116,
    difficulty: "Medium",
    topic: "CS Fundamentals",
    question:
      "A C++ function compiled with one compiler crashes when called from code compiled with a different compiler. The bug is traced to a 'calling convention mismatch.' What does a calling convention specify?",
    options: [
      "The maximum number of parameters a function can accept, which varies between different compiler implementations",
      "How arguments are passed, who cleans up the stack, and how the return value is delivered",
      "The syntax for declaring and defining functions, including return types, parameter lists, and default argument values",
      "Which C++ standard version the function was compiled with, determining name mangling and available language features",
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
      "The memory is leaked but the OS recovers it every few minutes via garbage collection",
      "The program's memory usage grows without bound until the OS kills it or the system runs out of memory",
      "The leaked memory is automatically reclaimed when the function returns",
      "No consequence -- the OS automatically frees memory that hasn't been accessed recently",
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
      "The compiler no longer needs to parse renderer.h when compiling files that include engine.h",
      "Forward declarations are cached by the compiler in a precompiled symbol table, while #include forces a full re-parse each time",
      "Forward declarations convert the class into a constexpr type, which the compiler can evaluate entirely at compile time",
      "Forward declarations allow the linker to skip symbol resolution for that class, reducing the number of passes required",
    ],
    correctIndex: 0,
    explanation:
      "When you #include a header, the preprocessor pastes its entire contents (and everything IT includes) into your translation unit. If renderer.h includes <string>, <vector>, and other headers, that is thousands of lines the compiler must parse. A forward declaration is a single line that tells the compiler 'this class exists' -- enough for pointers and references, but not enough to access members or know the class's size. In large codebases, reducing transitive includes this way can dramatically speed up compilation.",
    link: "https://www.learncpp.com/cpp-tutorial/forward-declarations/",
  },
  {
    id: 119,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "A programmer writes a check for signed integer overflow. Why might this check be completely removed by the compiler?",
    code: "int x = some_value();\nint y = x + 1;\nif (y < x) {\n    // overflow detected!\n    handle_overflow();\n}",
    options: [
      "The compiler detects that handle_overflow() has no observable side effects, classifies it as dead code, and removes the entire branch",
      "The compiler inlines handle_overflow() directly into the main code path, so the visible branch disappears but the logic still runs",
      "Since signed overflow is UB, the compiler assumes it never happens, concludes x + 1 > x is always true, and eliminates the 'impossible' branch entirely",
      "The if-check is optimized into a branchless conditional move instruction, which appears removed in the source but still executes",
    ],
    correctIndex: 2,
    explanation:
      "Because signed integer overflow is undefined behavior, the compiler is permitted to assume it never occurs. Under this assumption, x + 1 is always greater than x, making the condition y < x always false. The optimizer removes the entire branch as dead code. This is not a bug in the compiler -- it is a direct consequence of UB. To safely detect overflow, you must check BEFORE the operation (e.g., if x == INT_MAX) or use compiler builtins like __builtin_add_overflow.",
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
      "The compiler detects the sorted order at compile time and replaces the conditional loop with a binary search to find the cutoff index, dramatically reducing the number of iterations required",
      "Sorted data has dramatically better cache locality because all qualifying elements are grouped together in adjacent memory locations, effectively eliminating cache line misses during summation",
      "Sorting enables the compiler to auto-vectorize the loop with SIMD instructions, processing multiple qualifying elements per cycle since they are stored contiguously in memory",
      "When sorted, the branch pattern becomes predictable, so the CPU's branch predictor guesses correctly almost every time",
    ],
    correctIndex: 3,
    explanation:
      "Modern CPUs speculatively execute instructions past branches before knowing the outcome. The branch predictor uses history to guess which way a branch will go. With sorted data, the if-condition is false for all values below 128, then true for all values above -- a simple pattern the predictor learns. With unsorted data, the true/false pattern is essentially random, causing ~50% misprediction rate. Each misprediction flushes the pipeline (15–20 wasted cycles on modern CPUs). This is one of the most dramatic examples of how hardware microarchitecture affects algorithm performance.",
    link: "https://en.wikipedia.org/wiki/Branch_predictor",
  },
  {
    id: 121,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "A program accesses memory addresses scattered across many different virtual pages. Performance is poor even though the total data fits in the L2 cache. What is the most likely bottleneck?",
    options: [
      "TLB misses",
      "Memory bandwidth saturation from too many concurrent read requests overwhelming the memory controller's queues",
      "Branch mispredictions from the pointer-chasing access pattern that the CPU's predictor cannot learn effectively",
      "L1 instruction cache misses from the scattered access pattern causing frequent code fetch stalls in the pipeline",
    ],
    correctIndex: 0,
    explanation:
      "The TLB is a small cache (typically 64–1536 entries) that stores recent virtual-to-physical address translations. When a program accesses many different pages, TLB entries are evicted and must be reloaded by walking the page table -- a process that takes 10–100+ cycles even when the page table is in cache. Unlike data cache misses (which depend on total data size), TLB misses depend on the number of DISTINCT PAGES touched. A program can have its data entirely in L2 cache but still suffer from TLB misses if that data is spread across more pages than the TLB can hold.",
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
      "The optimizer has an internal time budget and skips code that takes too long to analyze, dropping it from the output entirely",
      "Loop removal is only valid under -O3 and technically non-conforming",
      "The compiler detected dead code and the standard requires conforming implementations to remove all unreachable or unused computations",
      "The as-if rule: the compiler may transform the program in any way as long as the observable behavior is unchanged",
    ],
    correctIndex: 3,
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
      "The strict aliasing rule",
      "The const-correctness rule",
      "The One Definition Rule",
      "The sequence point rule",
    ],
    correctIndex: 0,
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
      "Ask the OS to issue a prefetch request for the data needed for the branch condition, reducing stall time significantly",
      "Pause the entire instruction pipeline and wait for the memory load to complete before proceeding with any further execution",
      "Skip the branch entirely and execute both paths simultaneously using SIMD vectorization to cover all possible outcomes",
      "Begin executing instructions along the predicted branch path BEFORE the condition is resolved, discarding the work if the prediction was wrong",
    ],
    correctIndex: 3,
    explanation:
      "Speculative execution allows the CPU to keep its pipeline full by guessing the branch outcome (using the branch predictor) and executing instructions along the predicted path. If the guess is correct, the speculatively computed results are committed normally -- a significant performance win. If wrong, the CPU discards the speculative results and restarts from the branch point. This is essential for modern out-of-order CPUs, but it created the Spectre class of security vulnerabilities: speculatively executed instructions can leave observable traces in the cache that leak secret data.",
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
      "struct A has more padding: char(1) + 7 pad + double(8) + char(1) + 7 pad = 24, while struct B groups the chars together: double(8) + char(1) + char(1) + 6 pad = 16",
      "struct B is smaller because its members are in alphabetical order, which the compiler recognizes as a special packing optimization hint",
      "struct A uses 64-bit alignment while struct B defaults to 32-bit alignment, because the first declared member determines the alignment",
      "The compiler inserts hidden members into struct A to maintain backwards compatibility with older ABI versions that expected a larger layout",
    ],
    correctIndex: 0,
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
      "write() must allocate a separate heap buffer in kernel space and copy all user data into it for processing, while strlen() operates entirely on the stack with no allocation",
      "A system call requires a transition from user mode to kernel mode: saving registers, switching privilege levels, executing the kernel handler, and returning",
      "write() must encrypt all outgoing data before sending it to the kernel to ensure secure transfer between user space and kernel space, adding significant overhead per call",
      "Library functions like strlen() execute on the GPU via compute shaders for parallel processing, while system calls like write() run exclusively on the CPU's main execution core",
    ],
    correctIndex: 1,
    explanation:
      "A library function like strlen() executes entirely in user space -- it's just a function call (a few cycles for the call, then the loop). A system call like write() requires a privilege transition: the CPU switches from user mode (ring 3) to kernel mode (ring 0) via a special instruction (syscall/sysenter on x86). This involves saving all user-space registers, validating parameters, executing the kernel code, then restoring registers and returning to user space. This context switch overhead is typically 100–1000+ cycles. This is why techniques like buffered I/O (stdio) batch many small writes into fewer system calls.",
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
      "The OS scheduler places both threads on the same physical core to maximize data locality, inadvertently serializing their execution",
      "The struct is too small for the system allocator's minimum block size, so both threads contend on the allocator's internal lock",
      "The compiler merged the two adjacent variables into a single register for optimization, causing both threads to contend on the same storage",
      "False sharing: both variables reside on the same cache line, so each thread's write invalidates the other core's cached copy, causing constant cache coherency traffic",
    ],
    correctIndex: 3,
    explanation:
      "CPU caches operate on cache lines (typically 64 bytes), not individual variables. When two variables share a cache line and are written by different cores, each write invalidates the line on the other core. The other core must reload the entire line before its next access. This 'ping-ponging' of cache lines between cores is called false sharing. It's 'false' because the threads aren't logically sharing data -- they're only sharing a cache line by accident of memory layout. The fix is to pad the struct so each variable occupies its own cache line (alignas(64) or std::hardware_destructive_interference_size in C++17).",
    link: "https://en.wikipedia.org/wiki/False_sharing",
  },
  {
    id: 128,
    difficulty: "Hard",
    topic: "CS Fundamentals",
    question:
      "Each time a program runs, its stack, heap, and library addresses are at different locations. This is Address Space Layout Randomization (ASLR). What class of attack does it mitigate?",
    options: [
      "Denial-of-service attacks that exhaust system memory by spawning many copies of the program to consume all resources",
      "SQL injection attacks that target the database through improperly sanitized user input in the program's query layer",
      "Return-Oriented Programming (ROP) and other exploits that rely on knowing the exact addresses of code or data in memory",
      "Side-channel attacks that exploit CPU cache timing differences to infer secret values from a co-located process",
    ],
    correctIndex: 2,
    explanation:
      "Many exploits (buffer overflows, return-to-libc, ROP chains) require the attacker to know the precise memory addresses of target functions or gadgets. Without ASLR, these addresses are the same every time the program runs, making exploitation reliable. ASLR randomizes the base addresses of the stack, heap, executable, and shared libraries on each run, so the attacker cannot predict where code and data reside. It does not prevent the initial vulnerability (e.g., a buffer overflow), but it makes exploitation significantly harder.",
    link: "https://en.wikipedia.org/wiki/Address_space_layout_randomization",
  },
];
