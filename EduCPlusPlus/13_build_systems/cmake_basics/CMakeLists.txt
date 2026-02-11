# ==============================================================================
# CMakeLists.txt - CMake Build System Tutorial
#
# CMake is the de facto standard build system generator for C++. It does NOT
# build your code directly — it generates build files for other tools:
#   - On Windows: Visual Studio solutions (.sln) or Ninja files
#   - On Linux:   Makefiles or Ninja files
#   - On macOS:   Xcode projects, Makefiles, or Ninja files
#
# WHY CMAKE:
#   1. Cross-platform: one CMakeLists.txt works on Windows, Linux, macOS
#   2. IDE integration: CLion, VS Code, Visual Studio all understand CMake
#   3. Dependency management: find_package() locates installed libraries
#   4. Out-of-source builds: build artifacts go in a separate directory
#   5. Industry standard: almost every open-source C++ project uses it
#
# BASIC WORKFLOW:
#   1. Write CMakeLists.txt (this file) in your project root
#   2. Create a build directory:    mkdir build && cd build
#   3. Generate build files:        cmake ..
#   4. Build the project:           cmake --build .
#   5. Run the executable:          ./my_program
#
# Or, with modern CMake presets (CMake 3.21+):
#   cmake --preset default
#   cmake --build --preset default
#
# MINIMUM YOU NEED TO KNOW:
#   cmake_minimum_required()  — what CMake version you need
#   project()                 — name your project
#   add_executable()          — define a program to build
#   target_link_libraries()   — link libraries to your program
#
# Reference: https://cmake.org/cmake/help/latest/
# ==============================================================================

# ==============================================================================
# FREQUENTLY ASKED QUESTIONS
# ==============================================================================
#
# Q: What is the difference between CMake and Make?
# A: Make reads a Makefile and executes build commands (compile, link).
#    CMake reads CMakeLists.txt and GENERATES a Makefile (or Ninja file,
#    or Visual Studio project). CMake is a "meta-build system" — it
#    produces the input for the actual build tool.
#
# Q: What is "out-of-source" building?
# A: Building in a separate directory (e.g., build/) instead of the
#    source directory. This keeps generated files (objects, executables)
#    separate from source code, so "git status" stays clean and you can
#    delete the entire build directory to start fresh.
#
# Q: What is a "target"?
# A: A target is something CMake can build: an executable, a library,
#    or a custom command. Think of it as a "build unit" with its own
#    source files, compile flags, and dependencies.
#
# Q: What's the difference between PUBLIC, PRIVATE, and INTERFACE?
# A: These control how properties propagate between targets:
#    PRIVATE   — only affects this target (internal implementation detail)
#    INTERFACE — only affects targets that LINK to this one (API contract)
#    PUBLIC    — affects both this target AND targets that link to it
#    Example: if library A uses Boost internally but doesn't expose it
#    in headers, Boost is a PRIVATE dependency. If A's headers include
#    Boost headers, it's PUBLIC.
#
# Q: What does "modern CMake" mean?
# A: Older CMake used global commands like include_directories() and
#    link_libraries() that affected ALL targets. Modern CMake (3.0+) uses
#    target-specific commands: target_include_directories(),
#    target_link_libraries(), etc. This prevents "action at a distance"
#    where changing one target's settings accidentally breaks another.
#    Rule: never use the non-target commands. Always use target_*.
#
# Q: What is a "generator"?
# A: The tool that CMake produces files for. Common generators:
#    -G "Ninja"                — fast, parallel builds (recommended)
#    -G "Unix Makefiles"       — traditional Make
#    -G "Visual Studio 17 2022" — VS solution files
#    If you don't specify, CMake picks a platform default.
#
# Q: How do I add a third-party library?
# A: Three common methods:
#    1. find_package(LibName) — for system-installed libraries
#    2. FetchContent — downloads and builds from source (CMake 3.11+)
#    3. add_subdirectory(vendor/lib) — if you've vendored the source
#    See the examples below.
# ==============================================================================


# --- 1. Required: minimum CMake version ---
# Always specify this first. It tells CMake which features are available
# and sets default policies. Use the oldest version that supports your needs.
# C++20 support: CMake 3.12+ (for cxx_std_20)
# FetchContent:  CMake 3.11+
# Presets:       CMake 3.21+
cmake_minimum_required(VERSION 3.20)

# --- 2. Required: project declaration ---
# Names the project and optionally specifies languages and version.
# VERSION sets variables like PROJECT_VERSION, PROJECT_VERSION_MAJOR, etc.
project(EduCPlusPlus
    VERSION 1.0.0
    DESCRIPTION "Educational Modern C++ Examples"
    LANGUAGES CXX          # CXX = C++. Could also add C, CUDA, etc.
)

# --- 3. Set the C++ standard ---
# Do this globally OR per-target. Per-target is "more modern CMake"
# but global is fine for a single-standard project.
set(CMAKE_CXX_STANDARD 20)            # Use C++20
set(CMAKE_CXX_STANDARD_REQUIRED ON)   # Error if compiler doesn't support it
set(CMAKE_CXX_EXTENSIONS OFF)         # Don't use GNU extensions (-std=c++20, not -std=gnu++20)

# WHY CMAKE_CXX_EXTENSIONS OFF?
# With extensions ON (default), GCC uses -std=gnu++20 which enables
# compiler-specific features. With OFF, it uses -std=c++20 for
# strict standard compliance. Always use OFF for portable code.


# ==============================================================================
# EXECUTABLE TARGETS
# ==============================================================================

# --- 4. Define executable targets ---
# add_executable(target_name source1.cpp source2.cpp ...)
# Each add_executable creates a separate program.

# Example: a simple single-file executable
add_executable(hello_modern
    ${CMAKE_SOURCE_DIR}/01_fundamentals/basics/hello_modern.cpp
)

# Example: the type casting module
add_executable(casting_operators
    ${CMAKE_SOURCE_DIR}/11_type_casting/casting_operators/casting_operators.cpp
)

# Example: variadic templates
add_executable(variadic_templates
    ${CMAKE_SOURCE_DIR}/06_templates/variadic/variadic_templates.cpp
)

# Example: streams I/O
add_executable(streams
    ${CMAKE_SOURCE_DIR}/12_io_and_filesystem/streams/streams.cpp
)

# Example: filesystem operations
add_executable(filesystem_ops
    ${CMAKE_SOURCE_DIR}/12_io_and_filesystem/filesystem/filesystem_ops.cpp
)

# Example: variant and type traits
add_executable(variant_and_type_traits
    ${CMAKE_SOURCE_DIR}/14_variant_and_type_traits/variant/variant_and_visitors.cpp
)

add_executable(type_traits
    ${CMAKE_SOURCE_DIR}/14_variant_and_type_traits/type_traits/type_traits_guide.cpp
)


# ==============================================================================
# COMPILER WARNINGS (best practice)
# ==============================================================================

# --- 5. Enable warnings ---
# Warnings catch bugs at compile time. Always enable them.
# We define a function to apply warnings to any target.

function(enable_warnings target)
    target_compile_options(${target} PRIVATE
        # MSVC warnings
        $<$<CXX_COMPILER_ID:MSVC>:/W4 /permissive->
        # GCC / Clang warnings
        $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic>
    )
endfunction()

# The $<...> syntax is a "generator expression" — it's evaluated at
# build time, not configure time. $<CXX_COMPILER_ID:MSVC> is true
# only when compiling with MSVC. This makes the CMakeLists.txt
# work on all compilers without #ifdef-style branching.

# Apply warnings to all our targets
enable_warnings(hello_modern)
enable_warnings(casting_operators)
enable_warnings(variadic_templates)
enable_warnings(streams)
enable_warnings(filesystem_ops)
enable_warnings(variant_and_type_traits)
enable_warnings(type_traits)


# ==============================================================================
# THREADING SUPPORT
# ==============================================================================

# --- 6. Find and link the threading library ---
# On Linux, threading requires -pthread. On Windows, it's built-in.
# find_package(Threads) handles this portably.
find_package(Threads REQUIRED)

# For the multithreading examples:
# add_executable(thread_basics
#     ${CMAKE_SOURCE_DIR}/07_multithreading/threads/thread_basics.cpp
# )
# target_link_libraries(thread_basics PRIVATE Threads::Threads)
# enable_warnings(thread_basics)


# ==============================================================================
# LIBRARY TARGETS (how to create and use libraries)
# ==============================================================================

# --- 7. Static library example ---
# A static library (.a on Linux, .lib on Windows) is linked INTO the
# executable at build time. The library's code becomes part of the exe.

# add_library(my_math STATIC
#     src/math/vector.cpp
#     src/math/matrix.cpp
# )
# target_include_directories(my_math PUBLIC include/)
# # PUBLIC means: any target that links my_math automatically gets
# # include/ in its include path.
#
# add_executable(my_app src/main.cpp)
# target_link_libraries(my_app PRIVATE my_math)
# # PRIVATE means: my_app uses my_math, but targets linking my_app
# # don't automatically get my_math.


# --- 8. Shared (dynamic) library example ---
# A shared library (.so on Linux, .dll on Windows) is loaded at runtime.
# Smaller executables, but requires the .so/.dll to be present at runtime.

# add_library(my_plugin SHARED
#     src/plugin/plugin.cpp
# )


# ==============================================================================
# FETCHING DEPENDENCIES (modern approach)
# ==============================================================================

# --- 9. FetchContent — download dependencies at configure time ---
# This is the modern way to add third-party libraries without
# requiring the user to install them separately.

# include(FetchContent)
#
# FetchContent_Declare(
#     fmt                                    # Name we'll use locally
#     GIT_REPOSITORY https://github.com/fmtlib/fmt.git
#     GIT_TAG        10.2.1                  # Always pin a specific version!
# )
# FetchContent_MakeAvailable(fmt)
#
# # Now link against it:
# target_link_libraries(my_app PRIVATE fmt::fmt)
#
# Watch out: FetchContent downloads and builds at CONFIGURE time
# (when you run "cmake .."). This can be slow for large dependencies.
# For production projects, consider vcpkg or Conan for package management.


# ==============================================================================
# INSTALLING (optional: making your project installable)
# ==============================================================================

# --- 10. Install rules ---
# install() tells CMake where to put files when the user runs:
#   cmake --install build/

# install(TARGETS hello_modern
#     RUNTIME DESTINATION bin      # Executables go to <prefix>/bin
# )
# install(FILES README.md
#     DESTINATION share/doc/EduCPlusPlus
# )


# ==============================================================================
# TESTING (optional: integrate with CTest)
# ==============================================================================

# --- 11. Enable testing ---
# enable_testing() activates CTest. After building, run tests with:
#   cd build && ctest

# enable_testing()
# add_test(NAME test_hello COMMAND hello_modern)
# # The test passes if the program exits with code 0.
#
# For a real test framework, use FetchContent to pull in Google Test:
# FetchContent_Declare(
#     googletest
#     GIT_REPOSITORY https://github.com/google/googletest.git
#     GIT_TAG        v1.14.0
# )
# FetchContent_MakeAvailable(googletest)


# ==============================================================================
# SUMMARY: CMake COMMAND REFERENCE (the ones you'll use most)
# ==============================================================================
#
# cmake_minimum_required(VERSION x.y)   — set minimum CMake version
# project(Name VERSION x.y.z)           — declare the project
# add_executable(name src.cpp ...)       — build an executable
# add_library(name STATIC|SHARED src..)  — build a library
# target_link_libraries(target SCOPE lib) — link a library to a target
# target_include_directories(target SCOPE dir) — add include paths
# target_compile_options(target SCOPE flags)   — add compiler flags
# target_compile_definitions(target SCOPE DEF) — add #define macros
# find_package(Lib REQUIRED)             — find an installed library
# FetchContent_Declare / MakeAvailable   — download & build a dependency
# install(TARGETS ...)                   — install rules
# enable_testing() / add_test()          — testing integration
#
# SCOPE = PUBLIC | PRIVATE | INTERFACE
#
# BUILDING (command line):
#   mkdir build && cd build
#   cmake .. -G Ninja              # Generate (Ninja recommended)
#   cmake --build .                # Build all targets
#   cmake --build . --target name  # Build one target
#   ctest                          # Run tests
#   cmake --install .              # Install
# ==============================================================================
