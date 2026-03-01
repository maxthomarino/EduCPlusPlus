import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 34,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is the recommended way to build a CMake project?",
    options: [
      "Create a separate build directory: mkdir build && cd build && cmake ..",
      "Run cmake . in the source directory to generate build files in-place",
      "Run g++ *.cpp directly and let the compiler handle all dependencies",
      "Run make without CMake since Makefiles are auto-generated from headers",
    ],
    correctIndex: 0,
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
      "There is no practical difference",
      "It compiles faster by parallelizing header parsing across targets",
      "It only works with Ninja and requires the Ninja generator to function",
      "It scopes include paths to a specific target, preventing leakage to others",
    ],
    correctIndex: 3,
    explanation:
      "Modern CMake best practice uses target-scoped commands to keep build configurations isolated per target and propagate dependencies explicitly through PUBLIC/PRIVATE/INTERFACE.",
    link: "https://cmake.org/cmake/help/latest/command/target_include_directories.html",
  },
  {
    id: 452,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What are the three main phases of turning C++ source code into an executable?",
    options: [
      "Parsing the source into an AST, interpreting the AST to produce bytecode, and executing the bytecode in a virtual machine",
      "Tokenizing the source into lexemes, optimizing the token stream for performance, and running the result in an interpreter",
      "Write, compile, debug",
      "Preprocessing, compilation, linking",
    ],
    correctIndex: 3,
    explanation:
      "The preprocessor handles #include, #define, and #ifdef directives, producing a translation unit. The compiler translates each TU into an object file (.o/.obj) containing machine code. The linker resolves symbols across object files and libraries to produce the final executable.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 453,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is an object file (.o / .obj)?",
    options: [
      "The compiled machine code for a single translation unit, with unresolved references to external symbols that the linker will fill in",
      "A file that stores runtime objects serialized to disk in binary form, allowing the program to persist its in-memory state between executions",
      "A file containing only header declarations and forward references, with no executable code",
      "A file containing C++ source code in plain text form, ready to be parsed by the preprocessor and compiled into machine code by the compiler frontend",
    ],
    correctIndex: 0,
    explanation:
      "Each .cpp file compiles into one object file containing machine code, data, and a symbol table. External function calls are left as placeholders. The linker resolves these references by connecting them to definitions in other object files or libraries.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 454,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is the difference between a static library (.a / .lib) and a dynamic/shared library (.so / .dll)?",
    options: [
      "A static library is copied into the executable at link time. A dynamic library is loaded at runtime, shared across processes, and can be updated without recompiling",
      "Static libraries are faster at runtime because they avoid all indirection; dynamic libraries are more secure because they support address space layout randomization and code signing",
      "Static libraries can only contain C code compiled with a C compiler; dynamic libraries can contain C++ code with classes, templates, and exceptions using full C++ features",
      "There is no meaningful difference",
    ],
    correctIndex: 0,
    explanation:
      "Static linking copies library code into your executable (larger binary, no runtime dependency). Dynamic linking keeps the library separate -- the OS loads it at runtime. Dynamic libraries save disk/memory (shared across programs) but add a runtime dependency.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 455,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What does CMake do?",
    options: [
      "It is a build system generator",
      "It is a package manager for C++ libraries that downloads, builds, and installs third-party dependencies automatically",
      "It is an IDE for writing C++ code, providing an integrated editor, debugger, and project management interface",
      "It is a compiler that compiles C++ code directly into machine code, similar to GCC or Clang but with a different optimization pipeline",
    ],
    correctIndex: 0,
    explanation:
      "CMake is not a build system itself -- it generates build files for actual build systems (Make, Ninja, MSBuild). This makes it cross-platform: the same CMakeLists.txt can generate Makefiles on Linux and Visual Studio solutions on Windows.",
    link: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html",
  },
  {
    id: 456,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What do header guards prevent?",
    code: `#ifndef MY_HEADER_H\n#define MY_HEADER_H\n\nclass Foo {};\n\n#endif`,
    options: [
      "They prevent the same header from being included multiple times in a single translation unit, which would cause duplicate definition errors",
      "They prevent the header from being modified at runtime by marking the file as read-only in the preprocessor's file table",
      "They encrypt the header contents so that proprietary declarations cannot be read by third-party tools or decompilers",
      "They prevent other files from accessing the header, enforcing encapsulation at the file level similar to private class members",
    ],
    correctIndex: 0,
    explanation:
      "If header.h is #included by both a.h and b.h, and main.cpp includes both, the header would be pasted twice -- causing duplicate class definitions. Header guards (or #pragma once) ensure the contents are included only once per translation unit.",
    link: "https://www.learncpp.com/cpp-tutorial/header-guards/",
  },
  {
    id: 457,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What does this linker error typically mean?",
    code: `undefined reference to 'MyClass::doWork()'`,
    options: [
      "The function has a syntax error in its body that prevents the compiler from generating valid machine code for it, so the object file contains no symbol entry for the function definition",
      "The function was defined but uses an unsupported CPU instruction that the target architecture does not recognize, causing the assembler to reject the generated machine code during the build",
      "The function was declared (in a header) but never defined",
      "The function is private and cannot be accessed from outside the class, so the linker rejects the cross-module reference because access control is enforced at link time in addition to compile time",
    ],
    correctIndex: 2,
    explanation:
      "This is the most common linker error. The compiler saw a declaration and generated a call, but the linker can't find the actual machine code. Common causes: forgot to compile the .cpp, typo in the definition signature, or missing -l flag for an external library.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 458,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What is the difference between Debug and Release build configurations?",
    options: [
      "Debug builds are interpreted by a built-in runtime interpreter that executes the source code line by line for easier debugging; Release builds are compiled to native machine code by the full compiler backend for production use",
      "There is no difference between Debug and Release",
      "Debug uses C; Release uses C++",
      "Debug disables optimizations and includes debug symbols (-O0 -g) for debugging. Release enables optimizations (-O2 or -O3) and strips debug info for performance. Some bugs only appear in Release due to optimizer assumptions",
    ],
    correctIndex: 3,
    explanation:
      "Debug builds are slower but debuggable (you can step through code, inspect variables). Release builds are optimized -- the compiler reorders code, inlines functions, and eliminates dead code. UB that 'works' in Debug may crash in Release because the optimizer exploits UB assumptions.",
    link: "https://cmake.org/cmake/help/latest/variable/CMAKE_BUILD_TYPE.html",
  },
  {
    id: 459,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What does a minimal CMakeLists.txt look like for a single-file project?",
    code: `cmake_minimum_required(VERSION 3.20)\nproject(MyApp LANGUAGES CXX)\nset(CMAKE_CXX_STANDARD 20)\nadd_executable(myapp main.cpp)`,
    options: [
      "add_executable is only for libraries, not executables",
      "cmake_minimum_required is optional",
      "This is incomplete",
      "This is a complete minimal CMake project: it sets the minimum CMake version, names the project, sets C++20, and creates an executable target from main.cpp",
    ],
    correctIndex: 3,
    explanation:
      "cmake_minimum_required sets the policy version. project() names the project. CMAKE_CXX_STANDARD sets the C++ standard. add_executable() creates a build target. This is enough to generate build files: mkdir build && cd build && cmake .. && cmake --build .",
    link: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html",
  },
  {
    id: 460,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What do compiler sanitizers like -fsanitize=address do?",
    options: [
      "They encrypt the binary to prevent reverse engineering, adding obfuscation passes that scramble symbol names and control flow",
      "They instrument the compiled code with runtime checks that detect memory errors and report them with stack traces at runtime",
      "They remove all undefined behavior from the code by inserting safe fallback operations wherever the standard leaves behavior unspecified",
      "They statically analyze the code without running it, producing a report of potential bugs but never modifying the generated binary",
    ],
    correctIndex: 1,
    explanation:
      "AddressSanitizer (ASan) inserts shadow memory checks around every memory access. At runtime, it catches out-of-bounds access, use-after-free, double-free, and memory leaks. ThreadSanitizer (TSan) detects data races. UBSan detects undefined behavior. They slow execution by 2-5x but catch bugs that are otherwise invisible.",
    link: "https://clang.llvm.org/docs/AddressSanitizer.html",
  },
  {
    id: 461,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What is the purpose of target_link_libraries in CMake?",
    code: `find_package(Threads REQUIRED)\nadd_executable(myapp main.cpp)\ntarget_link_libraries(myapp PRIVATE Threads::Threads)`,
    options: [
      "It tells the linker to link the specified libraries to your target, and propagates include paths and compile flags from the library's CMake target. PRIVATE/PUBLIC/INTERFACE control propagation",
      "It creates a new library target from the listed source files and registers it as a build artifact in the current CMake build graph, making it available for other targets to depend on in the project",
      "It copies the library source code into your project directory and recompiles it as part of your build each time, effectively vendoring the dependency into your source tree for maximum reproducibility",
      "It downloads the library from the internet using an embedded package manager built into CMake and caches it in the build directory, similar to how pip or npm fetch dependencies from a remote registry",
    ],
    correctIndex: 0,
    explanation:
      "target_link_libraries connects a target to its dependencies. Modern CMake targets (like Threads::Threads) carry their include dirs, compile definitions, and link flags. PRIVATE means only myapp uses it; PUBLIC would propagate to anything linking against myapp.",
    link: "https://cmake.org/cmake/help/latest/command/target_link_libraries.html",
  },
  {
    id: 462,
    difficulty: "Hard",
    topic: "Build Systems",
    question: "What is the difference between #pragma once and traditional header guards?",
    options: [
      "#pragma once is simpler and can be faster. But it's non-standard and can fail with symlinks or copies of the same file. Header guards are standard and always correct",
      "#pragma once only works on Windows with MSVC",
      "#pragma once is part of the C++11 standard; header guards are a pre-standard technique that is now deprecated and scheduled for removal",
      "They are identical in all respects",
    ],
    correctIndex: 0,
    explanation:
      "#pragma once tells the compiler to include the file at most once. It's cleaner but technically non-standard. Edge case: if the same file exists at two paths (symlinks, copy), the compiler may include it twice. Traditional guards using unique macro names are always reliable but require care with naming.",
    link: "https://en.cppreference.com/w/cpp/preprocessor/include.html",
  },
  {
    id: 463,
    difficulty: "Hard",
    topic: "Build Systems",
    question: "What is the purpose of the 'export' keyword in C++20 modules?",
    code: `// math.cppm\nexport module math;\n\nexport int add(int a, int b) { return a + b; }\nint helper(int x) { return x * 2; }  // not exported`,
    options: [
      "It marks the function for dynamic library export), making it callable from code loaded at runtime via dlopen or LoadLibrary",
      "It makes the declared entity visible to importers of the module. Non-exported entities (like helper) are module-private",
      "It forces the function to be evaluated at compile time, similar to consteval, ensuring the result is embedded as a constant in the importing module",
      "It exports the function to a separate header file automatically, so that non-module code can include the generated header and call the function",
    ],
    correctIndex: 1,
    explanation:
      "C++20 modules replace headers with a new compilation model. export controls visibility: exported names are accessible via import math;. Non-exported names are implementation details. Unlike headers, modules don't leak macros, have faster compilation, and enforce proper encapsulation.",
    link: "https://en.cppreference.com/w/cpp/language/modules.html",
  },
  {
    id: 464,
    difficulty: "Hard",
    topic: "Build Systems",
    question: "What causes the 'multiple definition' linker error and how do you fix it?",
    code: `// helper.h\nint globalVar = 42;  // definition in a header\n\n// a.cpp\n#include "helper.h"\n\n// b.cpp\n#include "helper.h"\n// Linker error: multiple definition of 'globalVar'`,
    options: [
      "This is a compiler error, not a linker error",
      "The fix is to remove the header guards, which are preventing the compiler from merging the two definitions into a single symbol",
      "Each .cpp that includes the header gets its own definition of globalVar. The linker sees two definitions and reports an error. Fix: use inline (C++17), extern with a separate definition, or constexpr/const at namespace scope",
      "Header guards prevent this",
    ],
    correctIndex: 2,
    explanation:
      "Header guards prevent double inclusion within one TU, but each TU still gets one copy. Two TUs = two definitions = ODR violation. Solutions: extern int globalVar; in the header + int globalVar = 42; in one .cpp, or inline int globalVar = 42; (C++17), or constexpr int globalVar = 42; (internal linkage).",
    link: "https://www.learncpp.com/cpp-tutorial/sharing-global-constants-across-multiple-files/",
  },
  {
    id: 465,
    difficulty: "Hard",
    topic: "Build Systems",
    question: "What is link-time optimization (LTO) and what does it enable?",
    options: [
      "LTO defers optimization until link time, when the linker has visibility across ALL translation units. This enables cross-TU inlining, dead code elimination, and devirtualization that are impossible with per-file compilation",
      "LTO optimizes the order of linker sections for faster startup, rearranging code and data segments to minimize page faults during process initialization",
      "An optimization that removes unused #include directives from each translation unit, reducing compilation time and header dependency chains",
      "LTO compresses the final binary for smaller file size by applying LZMA compression to the executable's code and data sections, reducing disk usage and download size at the cost of a decompression step during loading",
    ],
    correctIndex: 0,
    explanation:
      "Normally each .cpp is optimized independently -- the compiler can't inline a function from another file. LTO embeds intermediate representation (IR) in object files. At link time, the linker sees all IR together and applies whole-program optimizations. This can significantly improve performance but increases build times.",
    link: "https://llvm.org/docs/LinkTimeOptimization.html",
  },
  {
    id: 466,
    difficulty: "Hard",
    topic: "Build Systems",
    question: "What does the compilation flag -fPIC do and when is it required?",
    options: [
      "It forces all pointers to be 64-bit wide regardless of the target architecture, ensuring uniform pointer sizes across 32-bit and 64-bit platforms for maximum binary portability between different hardware configurations",
      "It generates Position-Independent Code",
      "It enables profile-guided optimizations that instrument the binary to collect runtime data and feed it back into the next compilation pass, allowing the compiler to make informed decisions about branch prediction and function layout",
      "It enables PIC for macro safety, verifying that all macros expand to valid expressions before compilation proceeds",
    ],
    correctIndex: 1,
    explanation:
      "Shared libraries are loaded at arbitrary addresses (ASLR). -fPIC generates code that uses relative addressing rather than absolute addresses, so it works at any load address. Without -fPIC, the linker would need to patch every address at load time (costly) or it may fail entirely.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html",
  },
  {
    id: 1212,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is the role of a linker in the C++ build process?",
    options: [
      "It combines compiled object files and resolves symbol references into an executable",
      "It translates C++ source code into assembly language for the target architecture",
      "It checks the syntax of source files and reports any grammatical errors that exist",
      "It runs preprocessor directives and expands all macro definitions before compiling",
    ],
    correctIndex: 0,
    explanation:
      "The linker takes one or more object files produced by the compiler and combines them into a single executable or library. It resolves external symbol references, ensuring that function calls and variable references point to the correct definitions.",
    link: "https://en.cppreference.com/w/cpp/language/translation_phases",
  },
  {
    id: 1213,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What does the CMake command add_executable() do?",
    options: [
      "It links an existing library target to a previously defined executable in the project",
      "It defines a new executable target and specifies which source files it is built from",
      "It sets the compiler flags that should be applied when building all project targets",
      "It installs a compiled executable to the system path for global command line access",
    ],
    correctIndex: 1,
    explanation:
      "add_executable(target_name source1.cpp source2.cpp ...) creates a new build target that produces an executable binary. CMake then generates the appropriate build system rules to compile and link the specified source files.",
    link: "https://cmake.org/cmake/help/latest/command/add_executable.html",
  },
  {
    id: 1214,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What file does CMake use as its primary project configuration input?",
    options: [
      "A file named Makefile that contains the direct build rules for each source file",
      "A file named build.ninja that specifies the parallel compilation graph for targets",
      "A file named CMakeLists.txt that describes the project structure and build targets",
      "A file named configure.ac that automates the detection of system build capabilities",
    ],
    correctIndex: 2,
    explanation:
      "CMake reads CMakeLists.txt files to understand the project structure. These files contain commands like project(), add_executable(), and target_link_libraries() that describe how the project should be built.",
    link: "https://cmake.org/cmake/help/latest/manual/cmake-language.7.html",
  },
  {
    id: 1215,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is a header guard and why is it used in C++ header files?",
    options: [
      "It is a compiler flag that optimizes header parsing speed during large project builds",
      "It is a linker directive that prevents duplicate symbol definitions in object files",
      "It is a CMake macro that automatically generates include paths for header directories",
      "It is a preprocessor pattern that prevents the same header from being included twice",
    ],
    correctIndex: 3,
    explanation:
      "Header guards use #ifndef/#define/#endif preprocessor directives to ensure a header file is only processed once per translation unit. Without them, multiple inclusions of the same header can cause redefinition errors.",
    link: "https://www.learncpp.com/cpp-tutorial/header-guards/",
  },
  {
    id: 1216,
    difficulty: "Easy",
    topic: "Build Systems",
    question:
      "What is the purpose of the -o flag when invoking g++ from the command line?",
    options: [
      "It specifies the name of the output file that the compiler or linker will produce",
      "It enables all available optimization levels for maximum runtime performance gains",
      "It turns on all compiler warnings including those that are disabled by default rules",
      "It links the program against the standard C++ library for input and output features",
    ],
    correctIndex: 0,
    explanation:
      "The -o flag tells g++ what to name the output file. For example, g++ main.cpp -o myprogram produces an executable named myprogram instead of the default a.out.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html",
  },
  {
    id: 1217,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What does a Makefile target represent in a Make-based build system?",
    options: [
      "A list of compiler flags that should be used when compiling any source file in project",
      "A file or action to be built along with its dependencies and the commands to produce it",
      "A directory where the final compiled binaries and libraries are placed after the build",
      "An environment variable that stores the path to the project source code root location",
    ],
    correctIndex: 1,
    explanation:
      "A Makefile target typically represents a file to be created or an action to be performed. Each target lists its prerequisites and the recipe commands needed to produce the target from those prerequisites.",
    link: "https://www.gnu.org/software/make/manual/make.html#Rules",
  },
  {
    id: 1218,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What does the g++ -c flag do during compilation?",
    options: [
      "It links object files together into a final executable without running the preprocessor",
      "It runs the preprocessor only and outputs the expanded source without any compilation",
      "It compiles the source file into an object file without performing the linking step",
      "It checks the source code for syntax errors and warnings without producing any output",
    ],
    correctIndex: 2,
    explanation:
      "The -c flag tells g++ to compile and assemble but not link. It produces an object file (.o) for each source file, which can later be linked together into an executable or library.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html",
  },
  {
    id: 1219,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is the difference between a static library and a shared library?",
    options: [
      "Static libraries can only contain template code while shared libraries contain all types",
      "Static libraries are loaded at runtime by the OS while shared libraries are linked at build",
      "Static libraries require CMake to build while shared libraries work with any build system",
      "Static libraries are copied into the executable at link time while shared ones load at runtime",
    ],
    correctIndex: 3,
    explanation:
      "A static library (.a or .lib) is merged directly into the executable during linking, increasing its size. A shared library (.so or .dll) remains separate and is loaded by the operating system when the program runs.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 1220,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What is the purpose of the #include preprocessor directive in C++?",
    options: [
      "It compiles the referenced file separately and links the resulting object into the program",
      "It copies the entire contents of the specified file into the current translation unit source",
      "It creates a symbolic reference to the file that the linker resolves at the final build stage",
      "It registers the file with the build system so that changes trigger automatic recompilation",
    ],
    correctIndex: 1,
    explanation:
      "The #include directive is processed by the preprocessor, which literally replaces the directive with the entire contents of the specified file. This textual inclusion happens before the compiler sees the code.",
    link: "https://en.cppreference.com/w/cpp/preprocessor/include",
  },
  {
    id: 1221,
    difficulty: "Easy",
    topic: "Build Systems",
    question: "What does the -Wall flag do when passed to g++ or clang++?",
    options: [
      "It treats every compiler warning as a fatal error and stops the build immediately",
      "It disables all warnings to produce clean output during the compilation process",
      "It enables all possible warnings including experimental and vendor-specific checks",
      "It enables a standard set of commonly useful warning messages during compilation",
    ],
    correctIndex: 3,
    explanation:
      "Despite its name, -Wall does not enable all warnings. It enables a large, commonly useful subset of warnings. To get more warnings, you can add -Wextra and -Wpedantic.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html",
  },
  {
    id: 1222,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What is the difference between PUBLIC, PRIVATE, and INTERFACE in CMake target_link_libraries()?",
    options: [
      "PUBLIC links only at runtime, PRIVATE links only at compile time, INTERFACE links at both",
      "PUBLIC is for executables only, PRIVATE is for static libraries, INTERFACE is for shared ones",
      "PUBLIC propagates to dependents, PRIVATE is internal only, INTERFACE propagates but is not used by the target itself",
      "PUBLIC means the library is required, PRIVATE means it is optional, INTERFACE means it is header-only always",
    ],
    correctIndex: 2,
    explanation:
      "In modern CMake, PUBLIC means the dependency is used by the target and propagated to anything that links against it. PRIVATE means it is used only by the target. INTERFACE means it is not used by the target itself but is propagated to dependents.",
    link: "https://cmake.org/cmake/help/latest/command/target_link_libraries.html",
  },
  {
    id: 1223,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What advantage does the Ninja build system have over Make for large C++ projects?",
    options: [
      "Ninja is designed for speed with minimal overhead and faster incremental build times",
      "Ninja supports recursive builds natively while Make requires manual subdirectory setup",
      "Ninja can compile source files without needing any prior configuration or build script",
      "Ninja automatically detects all source files in a directory without explicit file listing",
    ],
    correctIndex: 0,
    explanation:
      "Ninja is optimized for speed. It has simpler semantics than Make, avoids re-evaluating rules unnecessarily, and uses efficient data structures for dependency tracking. This makes it significantly faster for incremental builds on large projects.",
    link: "https://ninja-build.org/manual.html",
  },
  {
    id: 1224,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What is a translation unit in C++ and how does it relate to the build process?",
    options: [
      "It is the final linked executable file that results from combining all compiled objects",
      "It is a single source file after preprocessing with all includes expanded and macros resolved",
      "It is a CMake target that represents one logical component within a larger build project",
      "It is the intermediate assembly code generated by the compiler before the assembler runs",
    ],
    correctIndex: 1,
    explanation:
      "A translation unit is the basic unit of compilation in C++. It consists of a single source file plus all the headers and files it includes, after the preprocessor has expanded all directives. Each translation unit is compiled independently into an object file.",
    link: "https://en.cppreference.com/w/cpp/language/translation_phases",
  },
  {
    id: 1225,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What does the CMake command find_package() do when configuring a project?",
    options: [
      "It downloads and compiles the requested package from a remote repository automatically",
      "It creates a new library target from source files found in the system package directory",
      "It generates header files for the package so that the project can include them directly",
      "It searches for an installed library and sets variables or targets for linking against it",
    ],
    correctIndex: 3,
    explanation:
      "find_package() locates an installed library on the system by searching standard paths and using Find modules or package config files. When successful, it typically provides imported targets or variables containing include directories and library paths.",
    link: "https://cmake.org/cmake/help/latest/command/find_package.html",
  },
  {
    id: 1226,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "Why might you use ccache with a C++ build system?",
    options: [
      "It caches previous compilation results and reuses them when the same input is compiled again",
      "It compresses object files to reduce disk space usage during large project build operations",
      "It distributes compilation tasks across multiple machines on a network for parallel building",
      "It validates that compiled binaries match their source code checksums for build verification",
    ],
    correctIndex: 0,
    explanation:
      "ccache is a compiler cache that stores compilation results. When a file is recompiled with the same preprocessed content and flags, ccache returns the cached result instead of invoking the compiler, dramatically speeding up rebuilds.",
    link: "https://ccache.dev/manual/latest.html",
  },
  {
    id: 1227,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What is the One Definition Rule and how does it affect the build process?",
    options: [
      "It requires that every function is defined in exactly one header file for proper compilation",
      "It mandates that each source file can only define one class to keep translation units simple",
      "It states that each entity must have exactly one definition across all translation units linked",
      "It ensures that every library target in CMake contains at most one public header for clarity",
    ],
    correctIndex: 2,
    explanation:
      "The One Definition Rule (ODR) requires that non-inline functions and variables have exactly one definition across the entire program. Violating ODR leads to linker errors or undefined behavior. Inline functions and templates are exceptions, allowing definitions in multiple translation units if they are identical.",
    link: "https://en.cppreference.com/w/cpp/language/definition",
  },
  {
    id: 1228,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What is the purpose of CMake generator expressions like $<TARGET_FILE:tgt>?",
    options: [
      "They define new build targets dynamically at configure time based on platform detection",
      "They provide values that are evaluated at build time rather than during CMake configuration",
      "They generate source code files automatically from template inputs during the build process",
      "They create conditional compilation flags that the preprocessor evaluates in source headers",
    ],
    correctIndex: 1,
    explanation:
      "Generator expressions are evaluated during build system generation or at build time, not during the CMake configure step. This allows values like output paths, compiler IDs, and configuration types to be resolved when the actual build runs.",
    link: "https://cmake.org/cmake/help/latest/manual/cmake-generator-expressions.7.html",
  },
  {
    id: 1229,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What does the -std=c++17 flag specify when passed to g++ or clang++?",
    options: [
      "It tells the compiler to use the C++17 standard for language features and library support",
      "It enables only the experimental C++17 features that are not yet part of the final standard",
      "It optimizes the compiled code specifically for hardware architectures released after 2017",
      "It links the program against the C++17 version of the standard library implementation only",
    ],
    correctIndex: 0,
    explanation:
      "The -std=c++17 flag tells the compiler to compile the code according to the C++17 standard. This enables C++17 language features like structured bindings, if constexpr, and std::optional, while disabling extensions from later standards.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/C-Dialect-Options.html",
  },
  {
    id: 1230,
    difficulty: "Medium",
    topic: "Build Systems",
    question: "What problem does cmake_minimum_required() prevent in a CMake project?",
    options: [
      "It prevents the build from running on operating systems that are older than the specified version",
      "It prevents the compiler from using language standards that are older than a minimum requirement",
      "It prevents using CMake features unavailable in older versions and sets the correct policy defaults",
      "It prevents third-party libraries from being linked if they were built with an incompatible version",
    ],
    correctIndex: 2,
    explanation:
      "cmake_minimum_required(VERSION x.y) ensures the project is built with at least that CMake version. It also sets policy defaults appropriate for that version, which affects how various CMake commands behave. Without it, behavior may vary unpredictably across CMake versions.",
    link: "https://cmake.org/cmake/help/latest/command/cmake_minimum_required.html",
  },
  {
    id: 1231,
    difficulty: "Medium",
    topic: "Build Systems",
    question:
      "What is the effect of the -O2 optimization flag compared to -O0 when compiling with g++?",
    options: [
      "-O2 only removes unused variables while -O0 performs full dead code elimination analysis",
      "-O2 disables all debug information while -O0 generates full debug symbols automatically",
      "-O2 enables link-time optimization across all files while -O0 limits it to single files",
      "-O2 enables many optimizations like inlining and loop unrolling while -O0 disables them all",
    ],
    correctIndex: 3,
    explanation:
      "-O0 means no optimization and is the default, producing code that closely matches the source for easy debugging. -O2 enables a wide range of optimizations including function inlining, loop unrolling, and dead code elimination that improve runtime performance.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html",
  },
  {
    id: 1232,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What is an undefined reference linker error and what typically causes it?",
    options: [
      "It occurs when two object files define the same symbol and the linker cannot choose between them",
      "It occurs when a symbol is declared but its definition is missing from all provided object files",
      "It occurs when a header file is included but the corresponding source file has syntax errors",
      "It occurs when the compiler cannot find a template specialization for the requested type usage",
    ],
    correctIndex: 1,
    explanation:
      "An undefined reference error means the linker found a declaration of a symbol that was used but could not find its definition in any of the object files or libraries provided. Common causes include forgetting to compile a source file or forgetting to link a required library.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/",
  },
  {
    id: 1233,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "How does CMake's FetchContent module differ from using find_package() for dependencies?",
    options: [
      "FetchContent downloads and builds dependencies as part of your project at configure time",
      "FetchContent only searches for pre-installed system packages using standard search paths",
      "FetchContent requires the dependency to provide a CMake config file for proper integration",
      "FetchContent defers dependency resolution to build time and delegates it to the linker step",
    ],
    correctIndex: 0,
    explanation:
      "FetchContent downloads source code from a URL or repository during CMake configuration and makes it available as part of the build. Unlike find_package(), which locates already-installed libraries, FetchContent builds the dependency from source alongside your project.",
    link: "https://cmake.org/cmake/help/latest/module/FetchContent.html",
  },
  {
    id: 1234,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What is link-time optimization and how does it improve compiled code performance?",
    options: [
      "It parallelizes the linking stage across multiple CPU cores to reduce total build duration",
      "It reorders object files in memory to minimize cache misses when loading the final binary",
      "It strips unused debug symbols from the binary to reduce the executable file size on disk",
      "It optimizes across translation unit boundaries by analyzing all object files during linking",
    ],
    correctIndex: 3,
    explanation:
      "Link-time optimization (LTO) allows the compiler to perform optimizations across translation unit boundaries during the linking phase. Normally, optimizations like inlining are limited to a single translation unit. LTO enables cross-file inlining and dead code elimination.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html",
  },
  {
    id: 1235,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What is the purpose of the RPATH setting in a CMake project that uses shared libraries?",
    options: [
      "It specifies the include search path that the preprocessor uses to locate header files",
      "It defines the directory where CMake stores intermediate object files during compilation",
      "It embeds a library search path in the executable so shared libraries are found at runtime",
      "It sets the output directory where the final compiled executable binary will be placed",
    ],
    correctIndex: 2,
    explanation:
      "RPATH is a path embedded in an ELF executable or shared library that tells the dynamic linker where to search for shared libraries at runtime. CMake manages RPATH settings so that executables can find their shared library dependencies without requiring system-wide installation.",
    link: "https://cmake.org/cmake/help/latest/variable/CMAKE_INSTALL_RPATH.html",
  },
  {
    id: 1236,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What is a unity build and what trade-off does it make in the C++ build process?",
    options: [
      "It concatenates multiple source files into one translation unit to reduce total build time",
      "It compiles every source file in complete isolation to maximize build reproducibility results",
      "It distributes compilation across networked machines to parallelize the entire build process",
      "It precompiles all header files into a single binary cache to speed up include resolution",
    ],
    correctIndex: 0,
    explanation:
      "A unity build combines multiple source files into a single translation unit by including them all from one file. This reduces redundant header parsing and can significantly speed up full builds, but may introduce issues with static variables and unnamed namespaces clashing across files.",
    link: "https://cmake.org/cmake/help/latest/variable/CMAKE_UNITY_BUILD.html",
  },
  {
    id: 1237,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "Why can changing a widely-included header file cause very long rebuild times in large projects?",
    options: [
      "The linker must re-resolve all symbol references even if only type declarations were modified",
      "The build system regenerates all Makefiles from scratch whenever any header file is changed",
      "Every translation unit that includes the header must be recompiled due to dependency tracking",
      "The preprocessor rescans every source file in the project to check for new macro definitions",
    ],
    correctIndex: 2,
    explanation:
      "Build systems track header dependencies. When a header changes, every source file that directly or transitively includes it is considered out of date and must be recompiled. For a widely-included header, this can mean recompiling most of the project.",
    link: "https://www.learncpp.com/cpp-tutorial/header-files/",
  },
  {
    id: 1238,
    difficulty: "Hard",
    topic: "Build Systems",
    question: "What does the CMake INTERFACE library type allow you to create?",
    options: [
      "A library that is compiled only when explicitly requested by a dependent target in the project",
      "A header-only library target that carries compile definitions and include paths for dependents",
      "A shared library that exposes its symbols only through a C-compatible application binary interface",
      "A static library that automatically inlines all of its functions into every dependent target",
    ],
    correctIndex: 1,
    explanation:
      "An INTERFACE library in CMake has no compiled source files of its own. It exists purely to carry usage requirements like include directories, compile definitions, and link dependencies that propagate to any target that links against it. This is ideal for header-only libraries.",
    link: "https://cmake.org/cmake/help/latest/command/add_library.html#interface-libraries",
  },
  {
    id: 1239,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What problem do precompiled headers solve and what is their main limitation?",
    options: [
      "They cache linked binaries to skip relinking, but they become invalid after any flag change",
      "They store parsed template instantiations, but they only work with single translation units",
      "They eliminate the need for header guards entirely, but they require a specific file naming rule",
      "They speed up compilation by caching parsed headers, but they must be kept synchronized with usage",
    ],
    correctIndex: 3,
    explanation:
      "Precompiled headers store the parsed state of frequently included headers so the compiler does not reparse them for every translation unit. The main limitation is that they must be kept in sync: if the precompiled header contents do not match what a source file expects, subtle errors can occur.",
    link: "https://cmake.org/cmake/help/latest/command/target_precompile_headers.html",
  },
  {
    id: 1240,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What does the -fsanitize=address compiler flag enable and when should it be used?",
    options: [
      "It enables static analysis that checks source code for potential bugs without running it",
      "It enables AddressSanitizer which detects memory errors like buffer overflows at runtime",
      "It enables automatic memory leak repair by inserting deallocation calls where they are needed",
      "It enables compile-time address validation that verifies pointer arithmetic is always valid",
    ],
    correctIndex: 1,
    explanation:
      "AddressSanitizer (ASan) instruments the compiled code to detect memory errors at runtime, including buffer overflows, use-after-free, and stack-use-after-scope. It is invaluable during development and testing but adds significant runtime overhead.",
    link: "https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html",
  },
  {
    id: 1241,
    difficulty: "Hard",
    topic: "Build Systems",
    question:
      "What is the purpose of the CMAKE_EXPORT_COMPILE_COMMANDS variable in CMake?",
    options: [
      "It exports a list of all linked libraries for each target into a dependency manifest file",
      "It generates a summary of all compiler warnings encountered during the most recent build",
      "It generates a compile_commands.json file that tools like clang-tidy and IDEs can consume",
      "It creates a build log file that records the timestamps and durations of each compile step",
    ],
    correctIndex: 2,
    explanation:
      "Setting CMAKE_EXPORT_COMPILE_COMMANDS to ON causes CMake to generate a compile_commands.json file in the build directory. This JSON compilation database lists the exact compiler invocation for each source file, which is used by clang-tidy, clangd, and other tooling for accurate code analysis.",
    link: "https://cmake.org/cmake/help/latest/variable/CMAKE_EXPORT_COMPILE_COMMANDS.html",
  },
];
