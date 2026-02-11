/**
 * cmake_explained.cpp - Understanding CMake Through Code
 *
 * This file is a companion to CMakeLists.txt. It's a runnable program
 * that demonstrates how CMake settings translate to compiler behavior.
 * Read this alongside the CMakeLists.txt for a complete picture.
 *
 * HOW TO BUILD THIS FILE:
 *
 *   Method 1: With CMake (recommended)
 *     mkdir build
 *     cd build
 *     cmake .. -G Ninja          (or -G "Unix Makefiles" or omit -G)
 *     cmake --build .
 *     ./cmake_explained          (Linux/Mac)
 *     cmake_explained.exe        (Windows)
 *
 *   Method 2: Direct compilation (what CMake generates internally)
 *     g++ -std=c++20 -Wall -Wextra -o cmake_explained cmake_explained.cpp
 *     cl /std:c++20 /W4 /EHsc cmake_explained.cpp    (MSVC)
 *
 * Prerequisites: None (this is a standalone explanation file).
 */

#include <iostream>
#include <format>

// =====================================================
// WHAT CMAKE DOES BEHIND THE SCENES
// =====================================================
//
// When you write this in CMakeLists.txt:
//
//   cmake_minimum_required(VERSION 3.20)
//   project(MyApp LANGUAGES CXX)
//   set(CMAKE_CXX_STANDARD 20)
//   set(CMAKE_CXX_STANDARD_REQUIRED ON)
//   set(CMAKE_CXX_EXTENSIONS OFF)
//
//   add_executable(my_app main.cpp utils.cpp)
//   target_compile_options(my_app PRIVATE -Wall -Wextra)
//   target_link_libraries(my_app PRIVATE pthread)
//
// CMake generates roughly this compiler command:
//
//   g++ -std=c++20 -Wall -Wextra -o my_app main.cpp utils.cpp -lpthread
//
// But CMake does much MORE than just generate the command:
//
//   1. Dependency tracking: if utils.cpp changes, only utils.o is
//      recompiled, then the final link step reruns. main.o is reused.
//
//   2. Header dependency scanning: if main.cpp #includes "utils.h",
//      and utils.h changes, main.o is rebuilt too. CMake tracks this
//      automatically using compiler-generated dependency files (.d files).
//
//   3. Parallel builds: CMake tells the build tool (Ninja/Make) which
//      files are independent, so main.o and utils.o compile in parallel.
//
//   4. Incremental builds: only changed files are rebuilt. On a large
//      project (thousands of files), this saves minutes of build time.
//
//   5. Cross-platform: the same CMakeLists.txt generates Visual Studio
//      projects on Windows and Makefiles on Linux.
// =====================================================

// =====================================================
// PROJECT STRUCTURE BEST PRACTICES
// =====================================================
//
// A well-organized C++ project typically looks like:
//
//   MyProject/
//   ├── CMakeLists.txt          <- Root build file
//   ├── CMakePresets.json       <- Build presets (optional, CMake 3.21+)
//   ├── README.md
//   ├── .gitignore              <- Include "build/" here!
//   │
//   ├── src/                    <- Implementation files (.cpp)
//   │   ├── CMakeLists.txt      <- Subdirectory build rules
//   │   ├── main.cpp
//   │   └── utils.cpp
//   │
//   ├── include/                <- Public headers (.h / .hpp)
//   │   └── myproject/
//   │       └── utils.hpp
//   │
//   ├── tests/                  <- Test files
//   │   ├── CMakeLists.txt
//   │   └── test_utils.cpp
//   │
//   ├── external/               <- Third-party dependencies
//   │   └── ...
//   │
//   └── build/                  <- Build output (NOT in git)
//       └── ...
//
// Key conventions:
//   - Headers in include/<project_name>/ so #include is unambiguous:
//     #include <myproject/utils.hpp>
//   - Source in src/, tests in tests/, each with their own CMakeLists.txt
//   - build/ is always in .gitignore
//   - Use add_subdirectory() to include sub-CMakeLists.txt files
// =====================================================

// =====================================================
// COMMON CMAKE MISTAKES AND HOW TO AVOID THEM
// =====================================================
//
// MISTAKE 1: Using include_directories() instead of target_include_directories()
//   BAD:  include_directories(include/)           <- affects ALL targets
//   GOOD: target_include_directories(my_lib PUBLIC include/)  <- affects only my_lib
//
// MISTAKE 2: Not setting CXX_STANDARD_REQUIRED
//   BAD:  set(CMAKE_CXX_STANDARD 20)             <- silently falls back if unsupported
//   GOOD: set(CMAKE_CXX_STANDARD 20)
//         set(CMAKE_CXX_STANDARD_REQUIRED ON)     <- error if C++20 not available
//
// MISTAKE 3: Building in the source directory
//   BAD:  cd MyProject && cmake .                 <- pollutes source with build files
//   GOOD: cd MyProject && mkdir build && cd build && cmake ..
//
// MISTAKE 4: Hardcoding compiler paths or flags
//   BAD:  set(CMAKE_CXX_COMPILER /usr/bin/g++-12) <- breaks on other machines
//   GOOD: Let the user choose: cmake .. -DCMAKE_CXX_COMPILER=g++-12
//
// MISTAKE 5: Not using generator expressions for cross-compiler flags
//   BAD:  target_compile_options(app PRIVATE -Wall)    <- fails on MSVC
//   GOOD: target_compile_options(app PRIVATE
//           $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall>
//           $<$<CXX_COMPILER_ID:MSVC>:/W4>
//         )
//
// MISTAKE 6: Forgetting to link threading on Linux
//   The program compiles fine but crashes at runtime with threading.
//   GOOD: find_package(Threads REQUIRED)
//         target_link_libraries(app PRIVATE Threads::Threads)
// =====================================================

int main() {
    std::cout << "=== CMake Build System Explained ===\n\n";

    // --- Show what the compiler set for us ---
    std::cout << "--- Compiler information ---\n";

#if defined(_MSC_VER)
    std::cout << std::format("  Compiler: MSVC {}\n", _MSC_VER);
#elif defined(__clang__)
    std::cout << std::format("  Compiler: Clang {}.{}.{}\n",
                              __clang_major__, __clang_minor__, __clang_patchlevel__);
#elif defined(__GNUC__)
    std::cout << std::format("  Compiler: GCC {}.{}.{}\n",
                              __GNUC__, __GNUC_MINOR__, __GNUC_PATCHLEVEL__);
#else
    std::cout << "  Compiler: Unknown\n";
#endif

    // --- C++ standard version ---
    // __cplusplus is set by the compiler to indicate the standard version.
    // CMake's CMAKE_CXX_STANDARD = 20 translates to -std=c++20 or /std:c++20,
    // which makes the compiler set __cplusplus accordingly.
    std::cout << std::format("  __cplusplus = {}\n", __cplusplus);
    // Expected values:
    //   199711L = C++98/03
    //   201103L = C++11
    //   201402L = C++14
    //   201703L = C++17
    //   202002L = C++20
    //   202302L = C++23

    // Note: MSVC historically reported 199711L regardless of the actual
    // standard unless /Zc:__cplusplus was set. Modern MSVC with /std:c++20
    // should report correctly.

    // --- Build type ---
    // CMake has build types that control optimization:
    //   Debug:          -g -O0        (debuggable, slow)
    //   Release:        -O3 -DNDEBUG  (fast, no asserts)
    //   RelWithDebInfo: -O2 -g        (fast with debug info)
    //   MinSizeRel:     -Os -DNDEBUG  (small binary)
    //
    // Set with: cmake .. -DCMAKE_BUILD_TYPE=Release
    std::cout << "\n--- Build configuration ---\n";
#ifdef NDEBUG
    std::cout << "  Build type: Release (NDEBUG defined, asserts disabled)\n";
#else
    std::cout << "  Build type: Debug (asserts enabled)\n";
#endif

    // --- Platform detection ---
    std::cout << "\n--- Platform ---\n";
#if defined(_WIN32)
    std::cout << "  Platform: Windows\n";
#elif defined(__linux__)
    std::cout << "  Platform: Linux\n";
#elif defined(__APPLE__)
    std::cout << "  Platform: macOS\n";
#else
    std::cout << "  Platform: Unknown\n";
#endif

    // --- Quick build command reference ---
    std::cout << "\n--- Quick reference: building with CMake ---\n";
    std::cout << "  1. mkdir build && cd build\n";
    std::cout << "  2. cmake ..                     (generate build files)\n";
    std::cout << "  3. cmake --build .              (compile everything)\n";
    std::cout << "  4. cmake --build . --target X   (compile just target X)\n";
    std::cout << "  5. ctest                        (run tests)\n";
    std::cout << "  6. cmake --install .            (install to system)\n";

    std::cout << "\n--- Quick reference: useful CMake flags ---\n";
    std::cout << "  cmake .. -G Ninja                    (use Ninja generator)\n";
    std::cout << "  cmake .. -DCMAKE_BUILD_TYPE=Release  (optimize for speed)\n";
    std::cout << "  cmake .. -DCMAKE_CXX_COMPILER=clang++ (choose compiler)\n";
    std::cout << "  cmake .. -DCMAKE_EXPORT_COMPILE_COMMANDS=ON (for IDE/linters)\n";

    return 0;
}
