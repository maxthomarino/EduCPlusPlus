# EduCPlusPlus

Educational repository for **Modern C++ (C++20)**.

## Structure

| Folder | Topic |
|--------|-------|
| `01_fundamentals/` | Basics, control flow, functions |
| `02_oop/` | Classes, inheritance, polymorphism, constructors |
| `03_memory_management/` | Smart pointers, RAII |
| `04_stl_containers/` | Vectors, maps, sets, etc. |
| `05_algorithms/` | STL algorithms, ranges |
| `06_templates/` | Function/class templates, concepts |
| `07_multithreading/` | Threads, mutex, futures, atomics |
| `08_modern_features/` | Lambdas, move semantics, constexpr |
| `09_cpp20_features/` | Concepts, ranges, coroutines, spaceship |
| `10_error_handling/` | Exceptions, optional |
| `11_type_casting/` | static_cast, dynamic_cast, const_cast, reinterpret_cast |
| `12_io_and_filesystem/` | File I/O, streams, std::filesystem |
| `13_build_systems/` | CMake tutorial with annotated CMakeLists.txt |
| `14_variant_and_type_traits/` | std::variant, std::visit, type traits, SFINAE |

## Building

All examples use C++20. Compile individually with:

```bash
g++ -std=c++20 -o example example.cpp -pthread
```

Or with MSVC:

```cmd
cl /std:c++20 /EHsc example.cpp
```

Or build everything with CMake (see `13_build_systems/` for a full tutorial):

```bash
mkdir build && cd build
cmake ..
cmake --build .
```

## License

MIT — use freely for learning!
