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

## Building

All examples use C++20. Compile with:

```bash
g++ -std=c++20 -o example example.cpp -pthread
```

Or with MSVC:

```cmd
cl /std:c++20 /EHsc example.cpp
```

## License

MIT — use freely for learning!
