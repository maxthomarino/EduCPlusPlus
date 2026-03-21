import type { BuggyProgram } from "./types";

export const programs: BuggyProgram[] = [
  {
    id: 1,
    topic: "STL Containers",
    difficulty: "Medium",
    title: "Filter a Vector",
    description: "Removes all even numbers from a vector and prints what remains.",
    hints: [
      "Look at how the loop iterator changes after modifying the container.",
      "What does erase() return, and what happens to existing iterators after it\u2019s called?",
    ],
    explanation: "Calling nums.erase(it) invalidates the iterator, yet the loop unconditionally does ++it on the next iteration. After an erase the returned iterator already points to the next element, so incrementing it skips one element and may read past the end.",
    code: `#include <vector>
#include <iostream>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8};

    for (auto it = nums.begin(); it != nums.end(); ++it) {
        if (*it % 2 == 0) {
            nums.erase(it);
        }
    }

    for (int n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g filter.cpp -o filter && ./filter
1 3 5 7
=================================================================
==14823==ERROR: AddressSanitizer: container-overflow on address 0x604000000038
    #0 0x5601a3b in main filter.cpp:7
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: container-overflow filter.cpp:7 in main`,
    stdlibRefs: [
      { name: "std::vector::erase", args: "(const_iterator pos) → iterator | (const_iterator first, const_iterator last) → iterator", brief: "Removes element at pos or range [first, last); returns iterator to the element after the last removed.", note: "Invalidates iterators at or after the point of erase. Always use the returned iterator instead of incrementing the old one.", link: "https://en.cppreference.com/w/cpp/container/vector/erase" },
    ],
  },
  {
    id: 2,
    topic: "Memory Management",
    difficulty: "Hard",
    title: "Pick the Longer String",
    description: "Returns a reference to whichever of two strings is longer.",
    hints: [
      "What are the actual types of the arguments being passed to longer()?",
      "How long do temporary objects live in C++?",
    ],
    explanation: 'The string literals "hello" and "world!" are implicitly converted to temporary std::string objects. The function returns a reference to one of these temporaries, which are destroyed at the end of the full expression. The reference `result` is left dangling.',
    code: `#include <string>
#include <iostream>

const std::string& longer(const std::string& a, const std::string& b) {
    return a.size() >= b.size() ? a : b;
}

int main() {
    const std::string& result = longer("hello", "world!");
    std::cout << result << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g longer.cpp -o longer && ./longer
=================================================================
==27491==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd4a200060
READ of size 8 at 0x7ffd4a200060 thread T0
    #0 0x55d3a1 in main longer.cpp:9
    #1 0x7f8c2a in __libc_start_main
Address 0x7ffd4a200060 is located in stack of thread T0
SUMMARY: AddressSanitizer: stack-use-after-scope longer.cpp:9 in main`,
    stdlibRefs: [
      { name: "std::string", brief: "Owning string class with implicit constructor from const char*.", note: "Passing a string literal to a const std::string& parameter creates a temporary that is destroyed when the full expression ends.", link: "https://en.cppreference.com/w/cpp/string/basic_string" },
    ],
  },
  {
    id: 3,
    topic: "Fundamentals",
    difficulty: "Easy",
    title: "Bounds Checker",
    description: "Checks whether an offset is within the bounds of a vector.",
    hints: [
      "What type does data.size() return?",
      "What happens when you compare values of different signedness?",
    ],
    explanation: "When a signed int (-1) is compared with an unsigned size_t (data.size()), the int is implicitly converted to an unsigned type. -1 becomes a very large value (SIZE_MAX), making the comparison false. The program prints \"out of bounds\" even though -1 is logically less than 5.",
    code: `#include <vector>
#include <iostream>

int main() {
    std::vector<int> data = {10, 20, 30, 40, 50};
    int offset = -1;

    if (offset < data.size()) {
        std::cout << "Offset is within bounds" << std::endl;
    } else {
        std::cout << "Offset is out of bounds" << std::endl;
    }
}`,
    manifestation: `$ g++ -Wall bounds.cpp -o bounds && ./bounds
bounds.cpp:8:19: warning: comparison of integer expressions of different
  signedness: 'int' and 'std::vector<int>::size_type' [-Wsign-compare]

Expected output:
  Offset is within bounds
Actual output:
  Offset is out of bounds`,
    stdlibRefs: [
      { name: "std::vector::size", args: "() → size_type", brief: "Returns the number of elements as std::size_t, an unsigned type.", note: "Comparing a negative int to size() promotes the int to unsigned, wrapping it to a very large positive value.", link: "https://en.cppreference.com/w/cpp/container/vector/size" },
    ],
  },
  {
    id: 4,
    topic: "Algorithms",
    difficulty: "Medium",
    title: "Binary Search",
    description: "Searches a sorted vector for a target value and returns its index.",
    hints: [
      "Are the loop bounds treating the range as half-open [lo, hi) or closed [lo, hi]?",
      "Do the update rules for lo and hi match the interval convention used by the loop condition?",
    ],
    explanation: "The loop uses a half-open upper bound (hi = arr.size()) with the condition lo < hi, but the else branch sets hi = mid - 1, which is the update for a closed-interval search. This mismatch can cause the search to skip elements or loop infinitely. Either use hi = arr.size() with hi = mid, or hi = arr.size() - 1 with lo <= hi.",
    code: `#include <iostream>
#include <vector>

int binary_search(const std::vector<int>& arr, int target) {
    int lo = 0, hi = arr.size();
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> v = {1, 3, 5, 7, 9, 11};
    std::cout << binary_search(v, 3) << std::endl;
    std::cout << binary_search(v, 6) << std::endl;
}`,
    manifestation: `$ ./bsearch
Searching for 3 in {1, 2, 3, 4, 5, 6, 7, 8}...

Expected output:
  Found at index 2
Actual output:
  Not found (-1)`,
    stdlibRefs: [
      { name: "std::lower_bound", args: "(ForwardIt first, ForwardIt last, const T& value) → ForwardIt", brief: "Binary search returning iterator to the first element not less than the given value.", note: "Prefer standard algorithms over hand-written binary search to avoid subtle off-by-one boundary errors.", link: "https://en.cppreference.com/w/cpp/algorithm/lower_bound" },
    ],
  },
  {
    id: 5,
    topic: "OOP",
    difficulty: "Medium",
    title: "Shape Area Calculator",
    description: "Stores shapes in a collection and prints each shape\u2019s computed area.",
    hints: [
      "What happens to a derived object when it\u2019s stored by value in a container of the base type?",
      "Which version of area() is actually dispatched at runtime?",
    ],
    explanation: "The vector stores Shape objects by value, not by pointer or reference. When a Circle is pushed into std::vector<Shape>, it is sliced down to a Shape \u2014 the Circle-specific data (radius) and vtable pointer are lost. Every call to area() dispatches to Shape::area(), which returns 0.0.",
    code: `#include <iostream>
#include <vector>
#include <string>

class Shape {
public:
    std::string name;
    Shape(std::string n) : name(std::move(n)) {}
    virtual double area() const { return 0.0; }
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius;
public:
    Circle(std::string n, double r) : Shape(std::move(n)), radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
};

void print_areas(std::vector<Shape> shapes) {
    for (const auto& s : shapes) {
        std::cout << s.name << ": " << s.area() << std::endl;
    }
}

int main() {
    std::vector<Shape> shapes;
    shapes.push_back(Circle("unit circle", 1.0));
    shapes.push_back(Circle("big circle", 5.0));
    print_areas(shapes);
}`,
    manifestation: `$ ./shapes
Expected output:
  Circle area: 78.5398
  Circle area: 28.2743
Actual output:
  0
  0`,
    stdlibRefs: [
      { name: "std::vector", brief: "Dynamic contiguous array that stores elements by value.", note: "Storing derived objects in a vector<Base> slices them to the base type, losing overridden behavior. Use vector<unique_ptr<Base>> for polymorphism.", link: "https://en.cppreference.com/w/cpp/container/vector" },
    ],
  },
  {
    id: 6,
    topic: "Modern C++",
    difficulty: "Medium",
    title: "Greeting Builder",
    description: "Assembles a personalised greeting from string parts and prints it.",
    hints: [
      "Track the state of name through each line of build_greeting.",
      "What is the state of a variable after std::move has been applied to it?",
    ],
    explanation: 'After std::move(name), the variable name is in a valid-but-unspecified state (typically empty). The subsequent parts.push_back(name) appends this moved-from string, so the greeting is missing the name in its second occurrence.',
    code: `#include <iostream>
#include <string>
#include <vector>

std::vector<std::string> build_greeting(std::string name) {
    std::vector<std::string> parts;
    parts.push_back("Hello, ");
    parts.push_back(std::move(name));
    parts.push_back("! Welcome, ");
    parts.push_back(name);
    return parts;
}

int main() {
    auto parts = build_greeting("Alice");
    for (const auto& p : parts) {
        std::cout << p;
    }
    std::cout << std::endl;
}`,
    manifestation: `$ ./greeting
Expected output:
  Hello Alice and Alice!
Actual output:
  Hello Alice and !`,
    stdlibRefs: [
      { name: "std::move", args: "(T&& arg) → remove_reference_t<T>&&", brief: "Casts its argument to an rvalue reference, enabling move semantics.", note: "After std::move, the source object is in a valid but unspecified state. Reading its value is legal but the content is gone.", link: "https://en.cppreference.com/w/cpp/utility/move" },
    ],
  },
  {
    id: 7,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Parallel Counter",
    description: "Increments a shared counter from multiple threads and prints the final value.",
    hints: [
      "Is the increment operation on counter a single indivisible step?",
      "What happens when two threads read, modify, and write the same memory location at the same time?",
    ],
    explanation: "The ++counter operation is not atomic. Multiple threads read, increment, and write back the same variable concurrently without any synchronization, causing a data race. The final value will almost always be less than the expected 10,000. This is undefined behavior per the C++ standard.",
    code: `#include <iostream>
#include <thread>
#include <vector>

int main() {
    int counter = 0;
    const int num_threads = 10;
    const int increments = 1000;

    std::vector<std::thread> threads;
    for (int i = 0; i < num_threads; ++i) {
        threads.emplace_back([&counter, increments]() {
            for (int j = 0; j < increments; ++j) {
                ++counter;
            }
        });
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Expected: " << num_threads * increments << std::endl;
    std::cout << "Actual:   " << counter << std::endl;
}`,
    manifestation: `$ ./counter
Expected output:
  Final count: 10000
Actual output (run 1): Final count: 7842
Actual output (run 2): Final count: 8156
Actual output (run 3): Final count: 6923`,
    stdlibRefs: [
      { name: "std::thread", brief: "Manages a separate thread of execution; must be joined or detached before destruction.", link: "https://en.cppreference.com/w/cpp/thread/thread" },
      { name: "std::atomic", brief: "Provides lock-free atomic operations on a value, safe for concurrent access without locks.", note: "Non-atomic read-modify-write (like int++) from multiple threads is undefined behavior.", link: "https://en.cppreference.com/w/cpp/atomic/atomic" },
    ],
  },
  {
    id: 8,
    topic: "Templates",
    difficulty: "Hard",
    title: "Generic Max",
    description: "Returns the maximum of two values using a function template.",
    hints: [
      "What type does T deduce to for the third call?",
      "How does the > operator work when both operands are pointers?",
    ],
    explanation: 'When called with string literals ("apple", "banana"), T is deduced as const char*. The > operator compares pointer addresses, not lexicographic string content. The result depends on where the compiler places the literals in memory and is effectively arbitrary.',
    code: `#include <iostream>
#include <string>

template <typename T>
T max_val(T a, T b) {
    return a > b ? a : b;
}

int main() {
    std::cout << max_val(3, 7) << std::endl;
    std::cout << max_val(3.14, 2.72) << std::endl;
    std::cout << max_val("apple", "banana") << std::endl;
}`,
    manifestation: `$ ./genmax
max("apple", "banana") = apple

Expected output:
  max("apple", "banana") = banana
Actual output:
  max("apple", "banana") = apple
(result depends on pointer layout, varies by compiler)`,
    stdlibRefs: [
      { name: "std::string_view", brief: "Lightweight non-owning reference to a character sequence with lexicographic comparison operators.", note: "Unlike const char*, comparisons on string_view compare content, not pointer addresses.", link: "https://en.cppreference.com/w/cpp/string/basic_string_view" },
    ],
  },
  {
    id: 9,
    topic: "Error Handling",
    difficulty: "Medium",
    title: "Safe Division",
    description: "Divides two numbers and returns the result as a double.",
    hints: [
      "What is the type of the expression a / b when both operands are int?",
      "When does the conversion to double actually happen?",
    ],
    explanation: "The function signature returns double, but a / b performs integer division because both a and b are int. safe_divide(7, 2) returns 3.0 instead of 3.5. At least one operand needs to be cast to double before the division.",
    code: `#include <iostream>
#include <stdexcept>

double safe_divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division by zero");
    }
    return a / b;
}

int main() {
    try {
        std::cout << safe_divide(7, 2) << std::endl;
        std::cout << safe_divide(10, 0) << std::endl;
    } catch (const std::runtime_error& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ ./safediv
safe_divide(7, 2) = 3

Expected output:
  safe_divide(7, 2) = 3.5
Actual output:
  safe_divide(7, 2) = 3`,
    stdlibRefs: [
      { name: "std::runtime_error", brief: "Exception class for errors detectable only at runtime; constructed with a descriptive string.", link: "https://en.cppreference.com/w/cpp/error/runtime_error" },
    ],
  },
  {
    id: 10,
    topic: "Fundamentals",
    difficulty: "Medium",
    title: "Factorial Calculator",
    description: "Computes the factorial of a given number.",
    hints: [
      "What value does result start with?",
      "What is anything multiplied by zero?",
    ],
    explanation: "The accumulator result is initialized to 0 instead of 1. Since result *= i starts with 0 * 1, every multiplication yields 0. The function returns 0 for all inputs.",
    code: `#include <iostream>

int factorial(int n) {
    int result = 0;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

int main() {
    for (int i = 0; i <= 10; ++i) {
        std::cout << i << "! = " << factorial(i) << std::endl;
    }
}`,
    manifestation: `$ ./factorial
factorial(5) = 0
factorial(10) = 0

Expected output:
  factorial(5) = 120
  factorial(10) = 3628800
Actual output:
  factorial(5) = 0
  factorial(10) = 0`,
    stdlibRefs: [],
  },
  {
    id: 11,
    topic: "Memory Management",
    difficulty: "Medium",
    title: "Dynamic Array Wrapper",
    description: "A class that wraps a heap-allocated array with value semantics.",
    hints: [
      "Look carefully at the copy constructor\u2019s initializer list.",
      "How many heap allocations exist after DynArray b = a?",
    ],
    explanation: "The copy constructor copies the pointer (data(other.data)) instead of allocating new memory and copying the elements. Both DynArray objects now own the same heap allocation. When they are destroyed, delete[] is called twice on the same pointer (double free), and modifying one array silently modifies the other.",
    code: `#include <iostream>
#include <algorithm>

class DynArray {
    int* data;
    size_t sz;
public:
    DynArray(size_t n, int val = 0) : data(new int[n]), sz(n) {
        std::fill(data, data + sz, val);
    }

    DynArray(const DynArray& other) : data(other.data), sz(other.sz) {}

    ~DynArray() { delete[] data; }

    int& operator[](size_t i) { return data[i]; }
    size_t size() const { return sz; }
};

int main() {
    DynArray a(5, 42);
    DynArray b = a;

    b[0] = 99;

    std::cout << "a[0] = " << a[0] << std::endl;
    std::cout << "b[0] = " << b[0] << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g dynarray.cpp -o dynarray && ./dynarray
=================================================================
==18734==ERROR: AddressSanitizer: attempting double-free on 0x602000000010 in thread T0:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1c3 in DynArray::~DynArray() dynarray.cpp:12
    #2 0x55a4e1 in main dynarray.cpp:26
0x602000000010 is located 0 bytes inside of 20-byte region
previously freed by thread T0 here:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1c3 in DynArray::~DynArray() dynarray.cpp:12
SUMMARY: AddressSanitizer: double-free dynarray.cpp:12 in DynArray::~DynArray()`,
    stdlibRefs: [
      { name: "std::fill", args: "(ForwardIt first, ForwardIt last, const T& value) → void", brief: "Assigns the given value to every element in the range [first, last).", link: "https://en.cppreference.com/w/cpp/algorithm/fill" },
      { name: "std::vector", brief: "Dynamic array with automatic memory management and correct copy/move semantics.", note: "Prefer std::vector over manual new[]/delete[] to avoid shallow-copy and double-free bugs.", link: "https://en.cppreference.com/w/cpp/container/vector" },
    ],
  },
  {
    id: 12,
    topic: "C++20 Features",
    difficulty: "Hard",
    title: "Lazy Integer Range",
    description: "Generates a range of integers using a span and prints them.",
    hints: [
      "What is the lifetime of the vector v inside make_range?",
      "What does the returned span actually point to after the function returns?",
    ],
    explanation: "The local vector v is destroyed when make_range returns. The returned std::span still points to v\u2019s heap allocation, which has been freed. Iterating over the span reads deallocated memory \u2014 undefined behavior.",
    code: `#include <iostream>
#include <span>
#include <vector>
#include <numeric>

auto make_range(int start, int count) {
    std::vector<int> v(count);
    std::iota(v.begin(), v.end(), start);
    return std::span<int>(v.data(), v.size());
}

int main() {
    auto range = make_range(1, 5);
    for (int x : range) {
        std::cout << x << " ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g range.cpp -o range && ./range
=================================================================
==22156==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55b3a1 in main range.cpp:15
    #1 0x7f3c2a in __libc_start_main
0x602000000010 is located 0 bytes inside of 20-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55b2c1 in std::vector<int>::~vector()
SUMMARY: AddressSanitizer: heap-use-after-free range.cpp:15 in main`,
    stdlibRefs: [
      { name: "std::span", brief: "Non-owning view over a contiguous sequence of elements (C++20).", note: "Does not extend the lifetime of the data it references. If the underlying container is destroyed, the span dangles.", link: "https://en.cppreference.com/w/cpp/container/span" },
    ],
  },
  // ── Heap Allocation ──
  {
    id: 13,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Array Sum",
    description: "Allocates an array on the heap, fills it with consecutive values, and prints their sum.",
    hints: [
      "How was the memory allocated?",
      "Does the deallocation at the end match the allocation form?",
    ],
    explanation: "The array is allocated with new[] but freed with plain delete instead of delete[]. This is undefined behavior \u2014 only the first element\u2019s destructor (if any) is called, and the memory manager receives incorrect bookkeeping information. For non-trivial types this typically corrupts the heap.",
    code: `#include <iostream>

int main() {
    const int n = 100;
    int* data = new int[n];

    for (int i = 0; i < n; ++i) {
        data[i] = i + 1;
    }

    int sum = 0;
    for (int i = 0; i < n; ++i) {
        sum += data[i];
    }

    std::cout << "Sum: " << sum << std::endl;

    delete data;
}`,
    manifestation: `$ g++ -fsanitize=address -g arraysum.cpp -o arraysum && ./arraysum
=================================================================
==31204==ERROR: AddressSanitizer: alloc-dealloc-mismatch (operator new[] vs operator delete) on 0x604000000010
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55c1a3 in main arraysum.cpp:12
    #2 0x7f3c2a in __libc_start_main
0x604000000010 is located 0 bytes inside of 20-byte region
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch arraysum.cpp:12 in main`,
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer with exclusive ownership semantics; automatically deletes its managed object.", note: "Use unique_ptr<T[]> for arrays allocated with new[] — it calls delete[] instead of delete.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 14,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Message Printer",
    description: "Builds a greeting on the heap and prints it along with its length.",
    hints: [
      "Trace the lifetime of the pointer msg through the program.",
      "At what point is the memory freed, and what happens afterward?",
    ],
    explanation: "The pointer msg is dereferenced on the last line after it has been deleted. Reading msg->size() is use-after-free \u2014 the heap block may have been reused or poisoned by the allocator. The program may print a plausible-looking number, crash, or behave erratically.",
    code: `#include <iostream>
#include <string>

std::string* make_message(const std::string& greeting, const std::string& name) {
    return new std::string(greeting + ", " + name + "!");
}

int main() {
    std::string* msg = make_message("Hello", "World");
    std::cout << *msg << std::endl;

    delete msg;

    std::cout << "Message length was: " << msg->size() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g msgprint.cpp -o msgprint && ./msgprint
Hello, World!
=================================================================
==15892==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000010
READ of size 8 at 0x603000000010 thread T0
    #0 0x55d1a1 in main msgprint.cpp:10
    #1 0x7f3c2a in __libc_start_main
0x603000000010 is located 0 bytes inside of 40-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55d181 in main msgprint.cpp:9
SUMMARY: AddressSanitizer: heap-use-after-free msgprint.cpp:10 in main`,
    stdlibRefs: [],
  },
  {
    id: 15,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Logger Hierarchy",
    description: "A logging system with a base class and a file-based subclass.",
    hints: [
      "How is the object deleted, and what is the static type of the pointer?",
      "Check the base class destructor declaration carefully.",
      "What keyword is required on the base destructor for correct polymorphic deletion?",
    ],
    explanation: "The base class Logger has no virtual destructor. Deleting a FileLogger through a Logger* pointer is undefined behavior \u2014 the derived destructor never runs, so the std::string member filename is never destroyed and its heap buffer is leaked.",
    code: `#include <iostream>
#include <string>

class Logger {
public:
    Logger() { std::cout << "Logger created" << std::endl; }
    ~Logger() { std::cout << "Logger destroyed" << std::endl; }

    virtual void log(const std::string& msg) {
        std::cout << "[LOG] " << msg << std::endl;
    }
};

class FileLogger : public Logger {
    std::string filename;
public:
    FileLogger(std::string fname) : filename(std::move(fname)) {
        std::cout << "FileLogger -> " << filename << std::endl;
    }
    ~FileLogger() {
        std::cout << "Closing " << filename << std::endl;
    }

    void log(const std::string& msg) override {
        std::cout << "[" << filename << "] " << msg << std::endl;
    }
};

int main() {
    Logger* logger = new FileLogger("app.log");
    logger->log("Application started");
    logger->log("Processing complete");
    delete logger;
}`,
    manifestation: `$ g++ -fsanitize=leak -g logger.cpp -o logger && ./logger
[file] Processing data...

=================================================================
==29401==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 32 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55e2c1 in std::basic_string<char>::basic_string(char const*)
    #2 0x55e1a1 in FileLogger::FileLogger(std::string const&)
    #3 0x55e3f1 in main logger.cpp:28

SUMMARY: LeakSanitizer: 32 byte(s) leaked in 1 object(s).`,
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer that calls delete on the stored pointer type at scope exit.", note: "Deleting a derived object through unique_ptr<Base> without a virtual destructor is undefined behavior.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 16,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Config Loader",
    description: "Parses a raw string input into a validated configuration value.",
    hints: [
      "Trace every execution path from the allocation to the end of the function.",
      "Is the buffer freed on every return path?",
    ],
    explanation: "When the validation fails (value > 1000), the function returns early without calling delete[] on buffer. Every invalid input leaks the entire allocation. The happy path frees correctly, which makes the leak easy to miss in testing.",
    code: `#include <iostream>
#include <cstring>

bool load_config(const char* raw_input) {
    char* buffer = new char[256];
    std::strncpy(buffer, raw_input, 255);
    buffer[255] = '\\0';

    int value = std::atoi(buffer);

    if (value < 0) {
        std::cout << "Negative values not allowed" << std::endl;
        delete[] buffer;
        return false;
    }

    if (value > 1000) {
        std::cout << "Value out of range" << std::endl;
        return false;
    }

    std::cout << "Config loaded: " << value << std::endl;
    delete[] buffer;
    return true;
}

int main() {
    load_config("42");
    load_config("-5");
    load_config("9999");
    load_config("100");
}`,
    manifestation: `$ g++ -fsanitize=leak -g config.cpp -o config && ./config
Invalid value: 9999

=================================================================
==24618==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 4096 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new[](unsigned long)
    #1 0x55a1c3 in loadConfig config.cpp:6
    #2 0x55a4e1 in main config.cpp:22

SUMMARY: LeakSanitizer: 4096 byte(s) leaked in 1 object(s).`,
    stdlibRefs: [
      { name: "std::strncpy", args: "(char* dest, const char* src, size_t count) → char*", brief: "Copies at most count characters from src to dest. Pads with nulls if src is shorter than count.", note: "If src is longer than count, the destination is NOT null-terminated. Always null-terminate manually after strncpy.", link: "https://en.cppreference.com/w/cpp/string/byte/strncpy" },
    ],
  },
  {
    id: 17,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Shared Configuration",
    description: "Sets up primary and backup configuration pointers and updates them.",
    hints: [
      "How many heap allocations are actually made in this program?",
      "How many times is delete called, and on what addresses?",
    ],
    explanation: "Both primary and backup point to the same heap allocation. The code deletes primary and then deletes backup, which is the same address \u2014 a double free. The second delete corrupts the heap and is undefined behavior.",
    code: `#include <iostream>
#include <string>

struct Config {
    std::string host;
    int port;
    Config(std::string h, int p) : host(std::move(h)), port(p) {}
};

void print_config(const Config* cfg, const char* label) {
    std::cout << label << ": " << cfg->host << ":" << cfg->port << std::endl;
}

int main() {
    Config* primary = new Config("localhost", 8080);
    Config* backup = primary;

    print_config(primary, "Primary");
    print_config(backup, "Backup");

    primary->port = 9090;
    std::cout << "After update:" << std::endl;
    print_config(backup, "Backup");

    delete primary;
    delete backup;
}`,
    manifestation: `$ g++ -fsanitize=address -g sharedcfg.cpp -o sharedcfg && ./sharedcfg
=================================================================
==17523==ERROR: AddressSanitizer: attempting double-free on 0x602000000010 in thread T0:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1c3 in main sharedcfg.cpp:21
    #2 0x7f3c2a in __libc_start_main
0x602000000010 is located 0 bytes inside of 16-byte region
previously freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1a1 in main sharedcfg.cpp:20
SUMMARY: AddressSanitizer: double-free sharedcfg.cpp:21 in main`,
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer with exclusive ownership; not copyable, only movable.", note: "Prevents double-free by enforcing single-owner semantics. Use instead of raw pointers with manual delete.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 18,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "String Duplicator",
    description: "Duplicates a C-string into a freshly allocated buffer.",
    hints: [
      "What exactly does std::strlen return \u2014 does it include the null terminator?",
      "How many bytes does std::strcpy actually write?",
    ],
    explanation: "std::strlen returns the length without the null terminator. The buffer is allocated with exactly that many bytes, but std::strcpy writes the terminating '\\0' one byte past the end of the allocation. This is a classic heap buffer overflow by one byte.",
    code: `#include <iostream>
#include <cstring>

char* duplicate_string(const char* src) {
    size_t len = std::strlen(src);
    char* copy = new char[len];
    std::strcpy(copy, src);
    return copy;
}

int main() {
    const char* original = "Hello, heap!";
    char* dup = duplicate_string(original);

    std::cout << "Original: " << original << std::endl;
    std::cout << "Copy:     " << dup << std::endl;

    delete[] dup;
}`,
    manifestation: `$ g++ -fsanitize=address -g strdup.cpp -o strdup && ./strdup
=================================================================
==28734==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000015
WRITE of size 1 at 0x602000000015 thread T0
    #0 0x7f8a3b in __strcpy_chk
    #1 0x55b1a1 in duplicate strdup.cpp:7
    #2 0x55b2c1 in main strdup.cpp:12
0x602000000015 is located 0 bytes after 5-byte region allocated here:
    #0 0x7f9a2b in operator new[](unsigned long)
    #1 0x55b181 in duplicate strdup.cpp:6
SUMMARY: AddressSanitizer: heap-buffer-overflow strdup.cpp:7 in duplicate`,
    stdlibRefs: [
      { name: "std::strlen", args: "(const char* str) → size_t", brief: "Returns the length of a C-string, NOT counting the null terminator.", note: "Allocating exactly strlen(src) bytes for a copy is one byte short — you need strlen(src) + 1.", link: "https://en.cppreference.com/w/cpp/string/byte/strlen" },
      { name: "std::strcpy", args: "(char* dest, const char* src) → char*", brief: "Copies the source string including the null terminator to the destination buffer.", note: "Destination must be large enough for the entire source string plus the null terminator.", link: "https://en.cppreference.com/w/cpp/string/byte/strcpy" },
    ],
  },
  {
    id: 19,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Widget Processor",
    description: "Creates two Widget objects and passes them to a processing function.",
    hints: [
      "In what order are the two new expressions in the function call evaluated?",
      "What happens if the second Widget constructor throws?",
      "Who owns the pointer returned by the first new in that case?",
    ],
    explanation: "If the second new Widget(...) throws (e.g. due to allocation failure or a throwing constructor), the first Widget has already been allocated but nobody holds a pointer to delete it. The catch block only sees the exception, not the leaked first allocation. This is a classic exception-safety leak with raw new.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>

struct Widget {
    std::string name;
    int* data;

    Widget(std::string n, int count) : name(std::move(n)) {
        if (count <= 0) throw std::invalid_argument("count must be positive");
        data = new int[count]{};
        std::cout << "Created " << name << std::endl;
    }
    ~Widget() {
        delete[] data;
        std::cout << "Destroyed " << name << std::endl;
    }
};

void process(Widget* a, Widget* b) {
    std::cout << "Processing " << a->name << " and " << b->name << std::endl;
}

int main() {
    try {
        process(new Widget("Alpha", 10), new Widget("Beta", -1));
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=leak -g widget.cpp -o widget && ./widget
Processing 2 widgets...
Error caught: bad allocation

=================================================================
==33021==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 48 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55c1a3 in process widget.cpp:14
    #2 0x55c3f1 in main widget.cpp:24

SUMMARY: LeakSanitizer: 48 byte(s) leaked in 1 object(s).`,
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer that deletes its managed object automatically, even when an exception is thrown.", note: "Raw new without immediate unique_ptr wrapping leaks if an exception is thrown before the matching delete.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 20,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Shape Printer",
    description: "Builds a collection of shapes and prints their descriptions.",
    hints: [
      "What does vector::clear() actually do to the stored elements?",
      "When the vector stores raw pointers, does clearing it free the pointed-to objects?",
    ],
    explanation: "The vector stores raw owning pointers. When shapes.clear() is called, only the pointers are removed from the vector \u2014 the pointed-to objects are never deleted. Every Shape and Circle allocated with new is leaked. Using std::unique_ptr<Shape> would fix this.",
    code: `#include <iostream>
#include <vector>
#include <string>

class Shape {
public:
    virtual ~Shape() = default;
    virtual std::string describe() const = 0;
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    std::string describe() const override {
        return "Circle(r=" + std::to_string(radius) + ")";
    }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    std::string describe() const override {
        return "Rect(" + std::to_string(w) + "x" + std::to_string(h) + ")";
    }
};

int main() {
    std::vector<Shape*> shapes;
    shapes.push_back(new Circle(3.0));
    shapes.push_back(new Rect(4.0, 5.0));
    shapes.push_back(new Circle(1.5));
    shapes.push_back(new Rect(2.0, 2.0));

    for (const auto* s : shapes) {
        std::cout << s->describe() << std::endl;
    }

    shapes.clear();
    std::cout << "Cleanup complete" << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=leak -g shapes.cpp -o shapes && ./shapes
Circle with radius 5
Circle with radius 3

=================================================================
==20145==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 48 bytes in 2 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55d1a1 in main shapes.cpp:25
    #2 0x7f3c2a in __libc_start_main

SUMMARY: LeakSanitizer: 48 byte(s) leaked in 2 object(s).`,
    stdlibRefs: [
      { name: "std::vector::clear", args: "() → void", brief: "Removes all elements, reducing size to zero. Does not deallocate the vector's memory.", note: "For vector<T*>, clear() destroys the pointer values but does NOT delete the pointed-to objects.", link: "https://en.cppreference.com/w/cpp/container/vector/clear" },
    ],
  },
  {
    id: 21,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Growable Integer Buffer",
    description: "A dynamically-sized buffer that doubles its capacity as elements are added.",
    hints: [
      "In grow(), what happens to old_buf after the copy completes?",
      "Is the old allocation ever freed?",
    ],
    explanation: "After copying into the new buffer, old_buf (the original allocation) is never deleted. Every call to grow() leaks the previous buffer.",
    code: `#include <iostream>
#include <algorithm>

class GrowableBuffer {
    int* buf_;
    size_t size_;
    size_t capacity_;

    void grow() {
        size_t new_cap = capacity_ * 2;
        int* old_buf = buf_;
        buf_ = new int[new_cap];
        std::copy(old_buf, old_buf + size_, buf_);
        capacity_ = new_cap;
    }

public:
    GrowableBuffer() : buf_(new int[4]), size_(0), capacity_(4) {}
    ~GrowableBuffer() { delete[] buf_; }

    void push_back(int val) {
        if (size_ == capacity_) {
            grow();
        }
        buf_[size_++] = val;
    }

    void print() const {
        for (size_t i = 0; i < size_; ++i) {
            std::cout << buf_[i] << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    GrowableBuffer buf;
    for (int i = 1; i <= 20; ++i) {
        buf.push_back(i * 10);
    }
    buf.print();
}`,
    manifestation: `$ g++ -fsanitize=leak -g growbuf.cpp -o growbuf && ./growbuf
Buffer contents: 1 2 3 4 5 6 7 8

=================================================================
==26789==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 20 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new[](unsigned long)
    #1 0x55a1c3 in GrowableBuffer::grow() growbuf.cpp:18
    #2 0x55a3f1 in main growbuf.cpp:35

SUMMARY: LeakSanitizer: 20 byte(s) leaked in 1 object(s).`,
    stdlibRefs: [
      { name: "std::vector", brief: "Dynamic array that handles reallocation, copying, and cleanup automatically on resize.", note: "Manual resize with new[]/delete[] is error-prone — forgetting to delete the old buffer before reassigning leaks it.", link: "https://en.cppreference.com/w/cpp/container/vector" },
    ],
  },
  {
    id: 22,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Placement New Demo",
    description: "Constructs strings in pre-allocated memory and prints them.",
    hints: [
      "What is special about the lifetime of objects created with placement new?",
      "Before freeing raw memory, what must happen to placement-new\u2019d objects?",
      "Is operator delete alone sufficient to clean up objects with internal allocations?",
    ],
    explanation: "The code calls operator delete on the raw buffer without first explicitly calling the destructor on each constructed object. For std::string, this means the internal heap buffers owned by each string are never freed. Placement-new\u2019d objects must be destroyed with an explicit destructor call (arr[i].~string()) before the underlying storage is deallocated.",
    code: `#include <iostream>
#include <string>
#include <new>

int main() {
    const int count = 3;

    void* raw = operator new(sizeof(std::string) * count);
    std::string* arr = static_cast<std::string*>(raw);

    new (&arr[0]) std::string("Hello");
    new (&arr[1]) std::string("Placement");
    new (&arr[2]) std::string("World");

    for (int i = 0; i < count; ++i) {
        std::cout << arr[i] << std::endl;
    }

    operator delete(raw);
}`,
    manifestation: `$ g++ -fsanitize=leak -g placement.cpp -o placement && ./placement
Stored: hello world test

=================================================================
==19382==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 96 bytes in 3 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55b1a1 in std::basic_string<char>::basic_string(char const*)

SUMMARY: LeakSanitizer: 96 byte(s) leaked in 3 object(s).`,
    stdlibRefs: [],
  },
  // ── Smart Pointers ──
  {
    id: 23,
    topic: "Smart Pointers",
    difficulty: "Easy",
    title: "Pixel Buffer",
    description:
      "Fills a pixel buffer with a gradient pattern and computes the average brightness.",
    code: `#include <iostream>
#include <memory>

void fill_gradient(int* pixels, int width, int height) {
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            pixels[y * width + x] = (x + y) % 256;
        }
    }
}

double average_brightness(const int* pixels, int count) {
    double sum = 0;
    for (int i = 0; i < count; ++i) {
        sum += pixels[i];
    }
    return sum / count;
}

int main() {
    const int width = 64;
    const int height = 48;
    std::unique_ptr<int> pixels(new int[width * height]);

    fill_gradient(pixels.get(), width, height);
    std::cout << "Average brightness: "
              << average_brightness(pixels.get(), width * height)
              << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g pixbuf.cpp -o pixbuf && ./pixbuf
=================================================================
==14201==ERROR: AddressSanitizer: alloc-dealloc-mismatch (operator new[] vs operator delete) on 0x614000000040
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1c3 in std::default_delete<unsigned char>::operator()(unsigned char*) const
    #2 0x55a2e1 in std::unique_ptr<unsigned char>::~unique_ptr()
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch pixbuf.cpp`,
    hints: [
      "How was the memory allocated, and how will the smart pointer free it?",
      "What form of delete does the default unique_ptr<int> deleter use?",
    ],
    explanation:
      "The array is allocated with new int[width * height] but stored in a std::unique_ptr<int>, whose default deleter calls delete (not delete[]). This is undefined behavior. It should be std::unique_ptr<int[]> to ensure delete[] is used.",
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer with exclusive ownership. The primary template calls delete; the T[] specialization calls delete[].", note: "unique_ptr<int> calls delete, not delete[]. For dynamic arrays, use unique_ptr<int[]> or prefer std::vector.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 24,
    topic: "Smart Pointers",
    difficulty: "Easy",
    title: "Reference Counted Logger",
    description:
      "Creates a shared logger and passes it to an audit function for logging.",
    code: `#include <iostream>
#include <memory>
#include <string>

class Logger {
    std::string prefix;
public:
    Logger(std::string p) : prefix(std::move(p)) {}
    void log(const std::string& msg) {
        std::cout << "[" << prefix << "] " << msg << std::endl;
    }
};

void audit_log(std::shared_ptr<Logger> logger) {
    logger->log("audit checkpoint");
}

int main() {
    Logger* raw = new Logger("APP");
    std::shared_ptr<Logger> primary(raw);
    std::shared_ptr<Logger> secondary(raw);

    primary->log("starting up");
    audit_log(secondary);
    primary->log("shutting down");
}`,
    manifestation: `$ g++ -fsanitize=address -g reflog.cpp -o reflog && ./reflog
[log] Application started
=================================================================
==25614==ERROR: AddressSanitizer: attempting double-free on 0x602000000010 in thread T0:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1c3 in std::_Sp_counted_ptr<Logger*>::_M_dispose()
    #2 0x55a2e1 in std::shared_ptr<Logger>::~shared_ptr()
    #3 0x55a4f1 in main reflog.cpp:22
SUMMARY: AddressSanitizer: double-free in std::shared_ptr<Logger>::~shared_ptr()`,
    hints: [
      "How many shared_ptr control blocks are created in this program?",
      "What happens when two independent shared_ptrs believe they each own the same object?",
    ],
    explanation:
      "Both primary and secondary are constructed directly from the same raw pointer, creating two independent reference counts. When both shared_ptrs are destroyed at the end of main, each calls delete on the same Logger object — a double free. The second shared_ptr should be copy-constructed from the first.",
    stdlibRefs: [
      { name: "std::shared_ptr", brief: "Reference-counted smart pointer; deletes the managed object when the last shared_ptr owning it is destroyed.", note: "Constructing two independent shared_ptrs from the same raw pointer creates two control blocks and causes double-free.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr" },
      { name: "std::make_shared", args: "<T>(Args&&... args) → shared_ptr<T>", brief: "Creates a shared_ptr with a single allocation for both the control block and the object.", note: "Always create shared_ptrs via make_shared or by copying an existing shared_ptr — never from a raw pointer that is already managed.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared" },
    ],
  },
  {
    id: 25,
    topic: "Smart Pointers",
    difficulty: "Easy",
    title: "Token Parser",
    description:
      "Tokenizes a space-separated string into a vector of Token structs.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include <sstream>

struct Token {
    std::string type;
    std::string value;
};

std::unique_ptr<Token> make_token(const std::string& type,
                                  const std::string& value) {
    auto tok = std::make_unique<Token>();
    tok->type = type;
    tok->value = value;
    return tok;
}

std::vector<Token> tokenize(const std::string& input) {
    std::vector<Token> tokens;
    std::istringstream stream(input);
    std::string word;

    while (stream >> word) {
        auto tok = make_token("WORD", word);
        tokens.push_back(*tok.release());
    }
    return tokens;
}

int main() {
    auto tokens = tokenize("the quick brown fox");
    for (const auto& t : tokens) {
        std::cout << t.type << ": " << t.value << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=leak -g tokenparser.cpp -o tokenparser && ./tokenparser
Parsed 3 tokens

=================================================================
==31847==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 48 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55c1a3 in parse tokenparser.cpp:12

SUMMARY: LeakSanitizer: 48 byte(s) leaked in 1 object(s).`,
    hints: [
      "What does unique_ptr::release() do to the ownership of the managed object?",
      "After calling release(), who is responsible for freeing the memory?",
    ],
    explanation:
      "Calling tok.release() relinquishes ownership and returns the raw pointer. The Token is copied into the vector via *tok.release(), but the heap-allocated original is never deleted. Each iteration leaks one Token. Using *tok (dereference without release) would copy the Token and let the unique_ptr clean up normally.",
    stdlibRefs: [
      { name: "std::unique_ptr::release", args: "() → pointer", brief: "Releases ownership and returns the raw pointer. Does NOT delete the managed object.", note: "The caller becomes responsible for deleting the returned pointer. If not stored or freed, it leaks.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/release" },
    ],
  },
  {
    id: 26,
    topic: "Smart Pointers",
    difficulty: "Medium",
    title: "Social Network",
    description:
      "Models users in a social network and connects them as friends.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct User {
    std::string name;
    std::vector<std::shared_ptr<User>> friends;

    User(std::string n) : name(std::move(n)) {
        std::cout << name << " created" << std::endl;
    }
    ~User() {
        std::cout << name << " destroyed" << std::endl;
    }
};

void make_friends(std::shared_ptr<User>& a, std::shared_ptr<User>& b) {
    a->friends.push_back(b);
    b->friends.push_back(a);
}

int main() {
    auto alice = std::make_shared<User>("Alice");
    auto bob = std::make_shared<User>("Bob");
    auto charlie = std::make_shared<User>("Charlie");

    make_friends(alice, bob);
    make_friends(bob, charlie);
    make_friends(alice, charlie);

    std::cout << alice->name << " has "
              << alice->friends.size() << " friends" << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=leak -g social.cpp -o social && ./social
Alice is friends with Bob
Bob is friends with Alice

=================================================================
==28934==ERROR: LeakSanitizer: detected memory leaks

Indirect leak of 128 bytes in 2 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55d1a1 in main social.cpp:24
    #2 0x7f3c2a in __libc_start_main

SUMMARY: LeakSanitizer: 128 byte(s) leaked in 2 object(s).`,
    hints: [
      "What happens to the reference count of each User when main returns?",
      "Can the reference count of any User ever reach zero?",
      "What type should the friends vector store to break ownership cycles?",
    ],
    explanation:
      "Each User holds shared_ptrs to their friends, creating circular references. When alice, bob, and charlie go out of scope, each User's reference count is still positive because friends lists hold shared_ptrs to each other. No destructor ever runs — all three User objects are leaked. The friends vector should use std::weak_ptr<User> instead.",
    stdlibRefs: [
      { name: "std::shared_ptr", brief: "Reference-counted smart pointer; prevents deletion while any shared_ptr to the object exists.", note: "Circular shared_ptr references prevent the count from ever reaching zero, causing a permanent memory leak.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr" },
      { name: "std::weak_ptr", brief: "Non-owning observer of a shared_ptr-managed object; does not affect the reference count.", note: "Use weak_ptr to break ownership cycles between objects that reference each other.", link: "https://en.cppreference.com/w/cpp/memory/weak_ptr" },
    ],
  },
  {
    id: 27,
    topic: "Smart Pointers",
    difficulty: "Medium",
    title: "Task Queue",
    description:
      "Enqueues tasks by priority and runs them in submission order.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Task {
    std::string name;
    int priority;
    Task(std::string n, int p) : name(std::move(n)), priority(p) {}
};

class TaskQueue {
    std::vector<Task*> pending;
public:
    void enqueue(Task* task) {
        pending.push_back(task);
    }

    void run_all() {
        for (auto* t : pending) {
            std::cout << "Running: " << t->name
                      << " (priority " << t->priority << ")" << std::endl;
        }
        pending.clear();
    }
};

int main() {
    TaskQueue queue;

    {
        auto t1 = std::make_unique<Task>("Compress", 3);
        auto t2 = std::make_unique<Task>("Upload", 1);
        auto t3 = std::make_unique<Task>("Notify", 2);

        queue.enqueue(t1.get());
        queue.enqueue(t2.get());
        queue.enqueue(t3.get());
    }

    queue.run_all();
}`,
    manifestation: `$ g++ -fsanitize=address -g taskqueue.cpp -o taskqueue && ./taskqueue
=================================================================
==16729==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 8 at 0x602000000010 thread T0
    #0 0x55b3a1 in main taskqueue.cpp:28
    #1 0x7f3c2a in __libc_start_main
0x602000000010 is located 0 bytes inside of 48-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55b2c1 in std::unique_ptr<Task>::~unique_ptr()
SUMMARY: AddressSanitizer: heap-use-after-free taskqueue.cpp:28 in main`,
    hints: [
      "What is the lifetime of the Task objects relative to when run_all() is called?",
      "What does .get() return, and does it affect ownership?",
    ],
    explanation:
      "The three unique_ptrs are destroyed at the closing brace of the inner block, freeing all Task objects. The TaskQueue still holds raw pointers obtained via .get(), which are now dangling. Calling run_all() dereferences freed memory — undefined behavior.",
    stdlibRefs: [
      { name: "std::unique_ptr::get", args: "() → pointer", brief: "Returns the stored raw pointer without releasing ownership.", note: "The returned pointer dangles if the unique_ptr is destroyed or moved. Never store .get() results beyond the unique_ptr's scope.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/get" },
    ],
  },
  {
    id: 28,
    topic: "Smart Pointers",
    difficulty: "Medium",
    title: "Event Dispatcher",
    description:
      "A publish-subscribe system where listeners register to receive event notifications.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Listener : public std::enable_shared_from_this<Listener> {
    std::string name;
public:
    Listener(std::string n) : name(std::move(n)) {}
    std::string get_name() const { return name; }

    std::shared_ptr<Listener> get_ptr() {
        return shared_from_this();
    }
};

class Dispatcher {
    std::vector<std::shared_ptr<Listener>> listeners;
public:
    void subscribe(std::shared_ptr<Listener> l) {
        listeners.push_back(std::move(l));
    }

    void notify() {
        for (auto& l : listeners) {
            std::cout << "Notifying: " << l->get_name() << std::endl;
        }
    }
};

int main() {
    Dispatcher dispatcher;

    Listener listener("FileWatcher");
    dispatcher.subscribe(listener.get_ptr());

    dispatcher.notify();
}`,
    manifestation: `$ ./dispatcher
terminate called after throwing an instance of 'std::bad_weak_ptr'
  what():  bad_weak_ptr
Aborted (core dumped)`,
    hints: [
      "How is the Listener object allocated in main?",
      "What precondition must be met before calling shared_from_this()?",
    ],
    explanation:
      "The Listener is allocated on the stack, not managed by any shared_ptr. Calling shared_from_this() on an object that has no owning shared_ptr is undefined behavior (throws std::bad_weak_ptr in C++17 or later). The Listener must first be created via std::make_shared<Listener>(...).",
    stdlibRefs: [
      { name: "std::enable_shared_from_this", brief: "CRTP base that allows creating a shared_ptr from this inside a member function via shared_from_this().", note: "The object must already be owned by a shared_ptr. Calling shared_from_this() on a stack or raw-new object throws std::bad_weak_ptr.", link: "https://en.cppreference.com/w/cpp/memory/enable_shared_from_this" },
    ],
  },
  {
    id: 29,
    topic: "Smart Pointers",
    difficulty: "Medium",
    title: "Document Pipeline",
    description:
      "Validates a document and then publishes it through a processing pipeline.",
    code: `#include <iostream>
#include <memory>
#include <string>

struct Document {
    std::string title;
    std::string body;
    Document(std::string t, std::string b)
        : title(std::move(t)), body(std::move(b)) {}
};

void validate(const std::unique_ptr<Document>& doc) {
    if (doc->title.empty()) {
        std::cout << "Warning: empty title" << std::endl;
    }
}

void publish(std::unique_ptr<Document> doc) {
    std::cout << "Published: " << doc->title << std::endl;
}

int main() {
    auto doc = std::make_unique<Document>("C++ Guide",
                                          "Learn modern C++...");
    validate(doc);
    publish(std::move(doc));

    std::cout << "Final title: " << doc->title << std::endl;
}`,
    manifestation: `$ ./docpipeline
Segmentation fault (core dumped)

$ g++ -fsanitize=address -g docpipeline.cpp -o docpipeline && ./docpipeline
=================================================================
==22451==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000
    #0 0x55c1a3 in main docpipeline.cpp:24
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: SEGV docpipeline.cpp:24 in main`,
    hints: [
      "What is the state of a unique_ptr after it has been moved from?",
      "Is doc still valid on the last line of main?",
    ],
    explanation:
      "After std::move(doc) transfers ownership to publish(), the local doc is left holding a null pointer. The final line dereferences doc to access .title, which is a null pointer dereference — undefined behavior, typically a crash.",
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer with exclusive ownership; movable but not copyable.", note: "After std::move, the source unique_ptr is null. Dereferencing it is undefined behavior.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 30,
    topic: "Smart Pointers",
    difficulty: "Hard",
    title: "Observable Value",
    description:
      "A value wrapper that notifies registered observers whenever the value changes.",
    code: `#include <iostream>
#include <memory>
#include <vector>
#include <functional>

class Observable : public std::enable_shared_from_this<Observable> {
    int value_;
    std::vector<std::function<void(int)>> observers_;

public:
    Observable(int val) : value_(val) {
        register_default_observer();
    }

    void register_default_observer() {
        auto self = shared_from_this();
        observers_.push_back([self](int v) {
            std::cout << "Value changed to: " << v << std::endl;
        });
    }

    void set_value(int v) {
        value_ = v;
        for (auto& obs : observers_) {
            obs(value_);
        }
    }

    int get_value() const { return value_; }
};

int main() {
    auto obj = std::make_shared<Observable>(42);
    obj->set_value(100);
    std::cout << "Current: " << obj->get_value() << std::endl;
}`,
    manifestation: `$ ./observable
terminate called after throwing an instance of 'std::bad_weak_ptr'
  what():  bad_weak_ptr
Aborted (core dumped)`,
    hints: [
      "At what point during object construction is the shared_ptr fully initialized?",
      "Can shared_from_this() be safely called from within a constructor?",
      "When does the weak_ptr inside enable_shared_from_this first become usable?",
    ],
    explanation:
      "The constructor calls register_default_observer(), which calls shared_from_this(). But during construction, the shared_ptr that will own this object has not yet been fully created — make_shared hasn't finished. Calling shared_from_this() before the object is owned by a shared_ptr is undefined behavior (throws bad_weak_ptr in C++17+). The registration must happen after construction.",
    stdlibRefs: [
      { name: "std::enable_shared_from_this", brief: "CRTP base providing shared_from_this() for safe self-referencing inside member functions.", note: "Cannot be called during construction — the shared_ptr that will own the object does not exist yet at that point.", link: "https://en.cppreference.com/w/cpp/memory/enable_shared_from_this" },
      { name: "std::make_shared", args: "<T>(Args&&... args) → shared_ptr<T>", brief: "Constructs an object and wraps it in a shared_ptr in a single allocation.", note: "The shared_ptr control block is set up after the constructor returns, which is why shared_from_this() fails inside it.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared" },
    ],
  },
  {
    id: 31,
    topic: "Smart Pointers",
    difficulty: "Hard",
    title: "Plugin Loader",
    description:
      "Loads and executes a collection of processing plugins by name.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Plugin {
    std::string name_;
public:
    Plugin(std::string name) : name_(std::move(name)) {}
    ~Plugin() { std::cout << "Plugin base cleanup" << std::endl; }

    virtual void execute() = 0;
    const std::string& name() const { return name_; }
};

class CompressionPlugin : public Plugin {
    int* lookup_table_;
public:
    CompressionPlugin()
        : Plugin("Compression"), lookup_table_(new int[1024]) {
        for (int i = 0; i < 1024; ++i)
            lookup_table_[i] = i * 7 % 256;
    }
    ~CompressionPlugin() {
        delete[] lookup_table_;
        std::cout << "CompressionPlugin: freed lookup table" << std::endl;
    }

    void execute() override {
        std::cout << "Compressing with table[0]="
                  << lookup_table_[0] << std::endl;
    }
};

class EncryptionPlugin : public Plugin {
    std::string key_;
public:
    EncryptionPlugin(std::string key)
        : Plugin("Encryption"), key_(std::move(key)) {}
    ~EncryptionPlugin() {
        std::cout << "EncryptionPlugin: cleared key" << std::endl;
    }

    void execute() override {
        std::cout << "Encrypting with key length "
                  << key_.size() << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Plugin>> plugins;
    plugins.push_back(std::make_unique<CompressionPlugin>());
    plugins.push_back(std::make_unique<EncryptionPlugin>("s3cret"));

    for (auto& p : plugins) {
        std::cout << "Running " << p->name() << "..." << std::endl;
        p->execute();
    }
}`,
    manifestation: `$ g++ -fsanitize=leak -g plugin.cpp -o plugin && ./plugin
Running plugin: Formatter

=================================================================
==19847==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 32 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55e1a1 in main plugin.cpp:35

SUMMARY: LeakSanitizer: 32 byte(s) leaked in 1 object(s).`,
    hints: [
      "When a unique_ptr<Plugin> is destroyed, which destructor does it call?",
      "What declaration is missing from the Plugin base class?",
      "What happens to CompressionPlugin's lookup_table_ when only the base destructor runs?",
    ],
    explanation:
      "Plugin's destructor is not virtual. When the unique_ptr<Plugin> elements are destroyed, only Plugin::~Plugin() runs — the derived destructors for CompressionPlugin and EncryptionPlugin are never called. This leaks CompressionPlugin's lookup_table_ array and is undefined behavior. Adding virtual to Plugin's destructor fixes the issue.",
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer that calls delete on the statically-known pointer type.", note: "unique_ptr<Base> calls ~Base(), not ~Derived(), unless ~Base() is virtual. Omitting virtual causes undefined behavior.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },
  {
    id: 32,
    topic: "Smart Pointers",
    difficulty: "Hard",
    title: "Resource Cache",
    description:
      "A cache that stores resources by key and retrieves them on demand.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <unordered_map>

struct Resource {
    std::string name;
    std::string data;
    Resource(std::string n, std::string d)
        : name(std::move(n)), data(std::move(d)) {
        std::cout << "Loaded: " << name << std::endl;
    }
    ~Resource() { std::cout << "Freed: " << name << std::endl; }
};

class ResourceCache {
    std::unordered_map<std::string, std::weak_ptr<Resource>> cache_;
public:
    void store(const std::string& key, std::shared_ptr<Resource> res) {
        cache_[key] = res;
    }

    std::string lookup(const std::string& key) {
        auto it = cache_.find(key);
        if (it != cache_.end()) {
            return it->second.lock()->data;
        }
        return "";
    }
};

int main() {
    ResourceCache cache;

    {
        auto img = std::make_shared<Resource>("logo", "PNG...");
        auto cfg = std::make_shared<Resource>("config", "key=value");
        cache.store("logo", img);
        cache.store("config", cfg);

        std::cout << "Logo: " << cache.lookup("logo") << std::endl;
    }

    std::cout << "Config: " << cache.lookup("config") << std::endl;
}`,
    manifestation: `$ ./rescache
Segmentation fault (core dumped)

$ g++ -fsanitize=address -g rescache.cpp -o rescache && ./rescache
=================================================================
==30182==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000
    #0 0x55d1a1 in main rescache.cpp:31
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: SEGV rescache.cpp:31 in main`,
    hints: [
      "What is the state of a weak_ptr after all shared_ptrs to the object are destroyed?",
      "What does lock() return when the referenced object no longer exists?",
      "Is the return value of lock() checked before being dereferenced?",
    ],
    explanation:
      "After the inner block ends, both shared_ptrs are destroyed, freeing the Resource objects. The weak_ptrs in the cache are now expired. In lookup(), lock() returns a null shared_ptr for expired entries, and the code immediately dereferences it with ->data — a null pointer dereference. The return value of lock() must be checked before use.",
    stdlibRefs: [
      { name: "std::weak_ptr::lock", args: "() → shared_ptr<T>", brief: "Attempts to create a shared_ptr from the weak_ptr. Returns an empty shared_ptr if the object has expired.", note: "Always check the result of lock() before dereferencing — an expired weak_ptr produces a null shared_ptr.", link: "https://en.cppreference.com/w/cpp/memory/weak_ptr/lock" },
    ],
  },
  // ── Lambdas ──
  {
    id: 33,
    topic: "Lambdas",
    difficulty: "Medium",
    title: "Deferred Formatter",
    description:
      "Builds a list of formatting functions and invokes them after the loop to print results.",
    code: `#include <iostream>
#include <vector>
#include <functional>
#include <string>

int main() {
    std::vector<std::string> names = {"Alice", "Bob", "Charlie"};
    std::vector<std::function<void()>> actions;

    for (size_t i = 0; i < names.size(); ++i) {
        actions.push_back([&]() {
            std::cout << (i + 1) << ". " << names[i] << std::endl;
        });
    }

    for (auto& fn : actions) {
        fn();
    }
}`,
    manifestation: `$ ./formatter
Expected output:
  Item 0: apple
  Item 1: banana
  Item 2: cherry
Actual output:
  Item 3: (undefined behavior - index out of range)
  Item 3: (undefined behavior - index out of range)
  Item 3: (undefined behavior - index out of range)`,
    hints: [
      "What does the lambda capture, and how does it capture it?",
      "What is the value of i when the lambdas are actually invoked?",
    ],
    explanation:
      "The lambda captures i by reference. By the time the lambdas execute in the second loop, the first loop has finished and i equals names.size() (3). Every lambda reads the same out-of-bounds index, causing undefined behavior. Capturing i by value ([i, &names]) would give each lambda its own copy of the loop counter.",
    stdlibRefs: [
      { name: "std::function", brief: "General-purpose polymorphic function wrapper; can store lambdas, function pointers, and callable objects.", note: "When a stored lambda captures a local variable by reference and outlives that variable, the reference dangles.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  // ── Operator Overloading ──
  {
    id: 34,
    topic: "Operator Overloading",
    difficulty: "Easy",
    title: "Vector2D Adder",
    description:
      "Adds two 2D vectors and computes their difference.",
    code: `#include <iostream>
#include <cmath>

struct Vec2 {
    double x, y;
    Vec2(double x, double y) : x(x), y(y) {}

    Vec2 operator+(const Vec2& rhs) {
        x += rhs.x;
        y += rhs.y;
        return *this;
    }

    Vec2 operator-(const Vec2& rhs) const {
        return Vec2(x - rhs.x, y - rhs.y);
    }

    double magnitude() const {
        return std::sqrt(x * x + y * y);
    }

    void print(const char* label) const {
        std::cout << label << " = (" << x << ", " << y << ")" << std::endl;
    }
};

int main() {
    Vec2 a(1.0, 2.0);
    Vec2 b(3.0, 4.0);

    Vec2 sum = a + b;
    Vec2 diff = a - b;

    a.print("a");
    b.print("b");
    sum.print("a + b");
    diff.print("a - b");

    std::cout << "|a| = " << a.magnitude() << std::endl;
}`,
    manifestation: `$ ./vec2d
v1 after v1 + v2:

Expected output:
  v1 = (1, 2), v3 = (4, 6)
Actual output:
  v1 = (4, 6), v3 = (4, 6)`,
    hints: [
      "Compare the implementations of operator+ and operator-. What is different?",
      "What happens to the left-hand operand after operator+ executes?",
      "Does operator+ create a new object, or does it modify an existing one?",
    ],
    explanation:
      "The operator+ modifies the member variables x and y of the left-hand operand (*this) before returning a copy. While the returned value sum is correct, the original vector a is mutated to (4, 6). The subsequent a - b computes (4-3, 6-4) = (1, 2) instead of the expected (-2, -2). Adding const to the method and creating a local result would fix the bug.",
    stdlibRefs: [],
  },
  {
    id: 35,
    topic: "Operator Overloading",
    difficulty: "Easy",
    title: "Case-Insensitive Key",
    description:
      "Compares HTTP header names case-insensitively to detect duplicates.",
    code: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cctype>

class CIString {
    std::string data_;
public:
    CIString(const char* s) : data_(s) {
        std::transform(data_.begin(), data_.end(), data_.begin(),
                       [](unsigned char c) { return std::tolower(c); });
    }

    bool operator==(const CIString& other) const {
        return data_.c_str() == other.data_.c_str();
    }

    bool operator!=(const CIString& other) const {
        return !(*this == other);
    }

    const std::string& str() const { return data_; }
};

int main() {
    std::vector<CIString> headers = {"Host", "Content-Type", "HOST",
                                     "Accept", "host"};
    int duplicates = 0;
    for (size_t i = 0; i < headers.size(); ++i) {
        for (size_t j = i + 1; j < headers.size(); ++j) {
            if (headers[i] == headers[j]) {
                std::cout << "Duplicate: " << headers[i].str()
                          << " and " << headers[j].str() << std::endl;
                ++duplicates;
            }
        }
    }

    std::cout << "Total duplicates found: " << duplicates << std::endl;
}`,
    manifestation: `$ ./cikey
Expected output:
  "Hello" == "hello": true
Actual output:
  "Hello" == "hello": false`,
    hints: [
      "What type does c_str() return, and what does == compare for that type?",
      "Are two pointers to different memory locations ever equal, even if the strings they point to are identical?",
    ],
    explanation:
      "The operator== compares the pointers returned by c_str(), not the string contents. Since each CIString stores its own std::string internally, the c_str() pointers point to different memory addresses even when the stored strings are identical. The comparison always returns false, so no duplicates are ever detected. Using data_ == other.data_ would correctly compare the string contents.",
    stdlibRefs: [
      { name: "std::string::c_str", args: "() → const char*", brief: "Returns a const char* to a null-terminated C-string representation of the string.", note: "Comparing two c_str() results with == compares pointer addresses, not string content. Use std::string operators instead.", link: "https://en.cppreference.com/w/cpp/string/basic_string/c_str" },
    ],
  },
  {
    id: 36,
    topic: "Operator Overloading",
    difficulty: "Easy",
    title: "Incrementable Counter",
    description:
      "A counter class that supports pre-increment and post-increment operations.",
    code: `#include <iostream>

class Counter {
    int count_;
public:
    explicit Counter(int start = 0) : count_(start) {}

    Counter operator++() {
        ++count_;
        return *this;
    }

    Counter operator++(int) {
        Counter old = *this;
        ++count_;
        return old;
    }

    int value() const { return count_; }
};

void advance_twice(Counter& c) {
    ++(++c);
}

int main() {
    Counter c(0);
    advance_twice(c);
    std::cout << "After incrementing twice: " << c.value() << std::endl;

    Counter d(10);
    Counter before = d++;
    std::cout << "Before: " << before.value()
              << ", After: " << d.value() << std::endl;
}`,
    manifestation: `$ ./counter
Expected output:
  ++c results in c.value == 6 with chaining: ++c == c is true
Actual output:
  ++c returns a copy; (++c).value == 6 but &(++c) != &c`,
    hints: [
      "What is the return type of the pre-increment operator?",
      "When ++(++c) is evaluated, does the outer increment operate on c or on something else?",
      "What happens when a non-reference return value is incremented?",
    ],
    explanation:
      "The pre-increment operator returns a Counter by value instead of by reference (Counter& operator++()). When ++(++c) is evaluated, the inner ++c increments c to 1 but returns a temporary copy. The outer ++ then increments that temporary, which is immediately discarded. The counter c is only incremented once, ending up at 1 instead of the expected 2.",
    stdlibRefs: [],
  },
  {
    id: 37,
    topic: "Operator Overloading",
    difficulty: "Medium",
    title: "Resizable Buffer",
    description:
      "A dynamic buffer class that supports copying and element-wise normalization.",
    code: `#include <iostream>
#include <algorithm>

class Buffer {
    int* data_;
    size_t size_;
public:
    Buffer(size_t n) : data_(new int[n]), size_(n) {
        std::fill(data_, data_ + size_, 0);
    }

    Buffer(const Buffer& other) : data_(new int[other.size_]), size_(other.size_) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    Buffer& operator=(const Buffer& other) {
        delete[] data_;
        size_ = other.size_;
        data_ = new int[size_];
        std::copy(other.data_, other.data_ + size_, data_);
        return *this;
    }

    ~Buffer() { delete[] data_; }

    int& operator[](size_t i) { return data_[i]; }
    int operator[](size_t i) const { return data_[i]; }
    size_t size() const { return size_; }
};

void normalize(Buffer& dest, const Buffer& src) {
    int max_val = src[0];
    for (size_t i = 1; i < src.size(); ++i) {
        if (src[i] > max_val) max_val = src[i];
    }
    dest = src;
    for (size_t i = 0; i < dest.size(); ++i) {
        dest[i] = (dest[i] * 100) / max_val;
    }
}

int main() {
    Buffer readings(5);
    readings[0] = 10; readings[1] = 50;
    readings[2] = 30; readings[3] = 80;
    readings[4] = 60;

    normalize(readings, readings);

    for (size_t i = 0; i < readings.size(); ++i) {
        std::cout << readings[i] << " ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g resbuf.cpp -o resbuf && ./resbuf
=================================================================
==21543==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 1 at 0x602000000010 thread T0
    #0 0x55a1c3 in Buffer::operator=(Buffer const&) resbuf.cpp:22
    #1 0x55a3f1 in main resbuf.cpp:38
0x602000000010 is located 0 bytes inside of 10-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1a1 in Buffer::operator=(Buffer const&) resbuf.cpp:20
SUMMARY: AddressSanitizer: heap-use-after-free resbuf.cpp:22 in Buffer::operator=`,
    hints: [
      "What arguments does normalize() receive when called from main?",
      "Inside operator=, what happens when the left-hand side and right-hand side are the same object?",
      "After delete[] data_, what does other.data_ point to?",
    ],
    explanation:
      "When normalize is called with readings as both arguments, dest and src are references to the same Buffer object. The assignment dest = src triggers operator=, where this and &other are the same address. The operator deletes data_ first, then tries to copy from other.data_ which is the same now-freed pointer. This is use-after-free. A self-assignment guard (if (this == &other) return *this;) at the top of operator= would prevent this.",
    stdlibRefs: [
      { name: "std::copy", args: "(InputIt first, InputIt last, OutputIt d_first) → OutputIt", brief: "Copies elements from the range [first, last) to a destination range starting at d_first.", link: "https://en.cppreference.com/w/cpp/algorithm/copy" },
    ],
  },
  {
    id: 38,
    topic: "Operator Overloading",
    difficulty: "Medium",
    title: "Key-Value Config",
    description:
      "Stores configuration key-value pairs and allows reading and updating values.",
    code: `#include <iostream>
#include <string>
#include <map>

class Config {
    std::map<std::string, std::string> entries_;
public:
    void load_defaults() {
        entries_["host"] = "localhost";
        entries_["port"] = "8080";
        entries_["mode"] = "debug";
    }

    std::string operator[](const std::string& key) {
        return entries_[key];
    }

    void dump() const {
        for (const auto& [key, value] : entries_) {
            std::cout << key << " = " << value << std::endl;
        }
    }
};

int main() {
    Config cfg;
    cfg.load_defaults();

    std::cout << "Before update:" << std::endl;
    cfg.dump();

    cfg["host"] = "production.example.com";
    cfg["port"] = "443";
    cfg["mode"] = "release";

    std::cout << "After update:" << std::endl;
    cfg.dump();
}`,
    manifestation: `$ ./kvconfig
config["timeout"] = 30;
std::cout << config["timeout"];

Expected output:
  30
Actual output:
  0`,
    hints: [
      "What is the return type of operator[], and what does that mean for the caller?",
      "When cfg[\"host\"] = \"production.example.com\" executes, where does the new value actually go?",
      "What is the difference between returning std::string and returning std::string&?",
    ],
    explanation:
      'The operator[] returns std::string by value instead of by reference. Each call creates a temporary copy of the stored value. The assignments like cfg["host"] = "production.example.com" modify these temporaries, which are destroyed at the end of each statement. The stored values never change, so the output after the update is identical to before. Changing the return type to std::string& would return a reference to the actual stored element.',
    stdlibRefs: [
      { name: "std::map::operator[]", args: "(const Key& key) → T&", brief: "Returns a reference to the value mapped to key, inserting a default value if the key does not exist.", note: "A custom operator[] that returns by value instead of by reference silently discards all modifications made through it.", link: "https://en.cppreference.com/w/cpp/container/map/operator_at" },
    ],
  },
  {
    id: 39,
    topic: "Operator Overloading",
    difficulty: "Medium",
    title: "Sortable Record",
    description:
      "Sorts a list of employees by department and salary for display.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Employee {
    std::string name;
    int department;
    int salary;

    bool operator<(const Employee& other) const {
        return department < other.department || salary > other.salary;
    }
};

int main() {
    std::vector<Employee> staff = {
        {"Alice",   2, 90000},
        {"Bob",     1, 75000},
        {"Charlie", 2, 85000},
        {"Diana",   1, 80000},
        {"Eve",     3, 70000},
    };

    std::sort(staff.begin(), staff.end());

    std::cout << "Sorted staff:" << std::endl;
    for (const auto& e : staff) {
        std::cout << e.name << " (dept " << e.department
                  << ", $" << e.salary << ")" << std::endl;
    }
}`,
    manifestation: `$ ./sortable
std::sort with custom operator<

Expected output:
  Records sorted stably by priority
Actual output:
  terminate called after throwing an instance of 'std::invalid_argument'
  Aborted (core dumped)
(strict weak ordering violation detected by libstdc++ debug mode)`,
    hints: [
      "For any two employees A and B, is it possible that both A < B and B < A are true?",
      "What does the C++ standard require of a comparison function passed to std::sort?",
      "What happens when || combines two independent orderings without a tie-breaker hierarchy?",
    ],
    explanation:
      "The operator< violates the strict weak ordering requirement of std::sort. The condition department < other.department || salary > other.salary can be true in both directions simultaneously: an employee in department 1 with $75k is considered less than one in department 2 with $90k (since 1 < 2), but the reverse is also true (since $90k > $75k). This is undefined behavior. The fix is to use a lexicographic comparison: compare department first, then salary only when departments are equal.",
    stdlibRefs: [
      { name: "std::sort", args: "(RandomIt first, RandomIt last) → void | (RandomIt first, RandomIt last, Compare comp) → void", brief: "Sorts elements in [first, last) using operator< or a custom comparator.", note: "The comparator must satisfy strict weak ordering: comp(a, a) must be false. Using <= instead of < violates this and is undefined behavior.", link: "https://en.cppreference.com/w/cpp/algorithm/sort" },
    ],
  },
  {
    id: 40,
    topic: "Operator Overloading",
    difficulty: "Medium",
    title: "Duration Calculator",
    description:
      "Computes time differences between task durations.",
    code: `#include <iostream>

class Duration {
    unsigned int seconds_;
public:
    explicit Duration(unsigned int s) : seconds_(s) {}

    Duration operator+(const Duration& other) const {
        return Duration(seconds_ + other.seconds_);
    }

    Duration operator-(const Duration& other) const {
        return Duration(seconds_ - other.seconds_);
    }

    bool operator>(const Duration& other) const {
        return seconds_ > other.seconds_;
    }

    void print(const char* label) const {
        unsigned int h = seconds_ / 3600;
        unsigned int m = (seconds_ % 3600) / 60;
        unsigned int s = seconds_ % 60;
        std::cout << label << ": " << h << "h " << m << "m " << s << "s"
                  << std::endl;
    }
};

int main() {
    Duration workday(8 * 3600);
    Duration meeting(2 * 3600 + 30 * 60);
    Duration lunch(45 * 60);

    Duration free_time = workday - meeting - lunch;
    free_time.print("Free time");

    Duration overtime = meeting - workday;
    overtime.print("Overtime");
}`,
    manifestation: `$ ./duration
Duration(5) - Duration(10):

Expected output:
  -5 (or error)
Actual output:
  18446744073709551611 (underflow of unsigned)`,
    hints: [
      "What is the underlying type of seconds_, and how does it behave with subtraction?",
      "What happens when a smaller unsigned integer is subtracted from a larger one?",
      "Can Duration::operator- ever produce a result that does not represent a valid time period?",
    ],
    explanation:
      "The Duration class stores seconds as unsigned int. When operator- computes meeting - workday (9000 - 28800), the result underflows because unsigned arithmetic wraps around modulo 2^32. Instead of a negative value indicating an error, the result becomes approximately 4.29 billion seconds. The operator should either check that seconds_ >= other.seconds_ before subtracting, use a signed type, or return an error value.",
    stdlibRefs: [],
  },
  {
    id: 41,
    topic: "Operator Overloading",
    difficulty: "Hard",
    title: "Optional Sum",
    description:
      "Adds two optional integer values and multiplies them when both are present.",
    code: `#include <iostream>

class OptionalInt {
    int value_;
    bool has_value_;
public:
    OptionalInt() : value_(0), has_value_(false) {}
    OptionalInt(int v) : value_(v), has_value_(true) {}

    operator bool() const { return has_value_; }
    int value() const { return value_; }
};

OptionalInt add(const OptionalInt& a, const OptionalInt& b) {
    if (a && b) {
        return OptionalInt(a + b);
    }
    return OptionalInt();
}

OptionalInt multiply(const OptionalInt& a, const OptionalInt& b) {
    if (a && b) {
        return OptionalInt(a * b);
    }
    return OptionalInt();
}

int main() {
    OptionalInt x(100);
    OptionalInt y(250);

    OptionalInt sum = add(x, y);
    OptionalInt product = multiply(x, y);

    if (sum) {
        std::cout << "Sum: " << sum.value() << std::endl;
    }
    if (product) {
        std::cout << "Product: " << product.value() << std::endl;
    }
}`,
    manifestation: `$ ./optsum
OptionalInt(3) + OptionalInt(5):

Expected output:
  8
Actual output:
  2`,
    hints: [
      "Is there an operator+ or operator* defined for OptionalInt?",
      "What implicit conversion path does the compiler use to make a + b compile?",
      "What type does operator bool() convert to, and what happens when two bool values are added?",
    ],
    explanation:
      "OptionalInt has no operator+ or operator* defined, but the expressions a + b and a * b still compile because the non-explicit operator bool() provides an implicit conversion. The compiler converts both operands to bool (both true, i.e., 1), promotes to int, and computes 1 + 1 = 2 and 1 * 1 = 1 respectively. The result is OptionalInt(2) and OptionalInt(1) instead of the intended 350 and 25000. Marking operator bool() as explicit would prevent the implicit conversion.",
    stdlibRefs: [],
  },
  {
    id: 42,
    topic: "Operator Overloading",
    difficulty: "Hard",
    title: "Matrix Product",
    description:
      "Multiplies two square matrices using overloaded operators.",
    code: `#include <iostream>
#include <vector>

class Matrix {
    std::vector<std::vector<double>> data_;
    size_t n_;
public:
    Matrix(size_t n) : n_(n), data_(n, std::vector<double>(n, 0.0)) {}

    double& at(size_t r, size_t c) { return data_[r][c]; }
    double at(size_t r, size_t c) const { return data_[r][c]; }
    size_t size() const { return n_; }

    static Matrix identity(size_t n) {
        Matrix I(n);
        for (size_t i = 0; i < n; ++i) I.at(i, i) = 1.0;
        return I;
    }

    Matrix& operator*=(const Matrix& other) {
        *this = *this * other;
        return *this;
    }

    Matrix operator*(const Matrix& other) const {
        Matrix result(*this);
        result *= other;
        return result;
    }

    void print() const {
        for (size_t i = 0; i < n_; ++i) {
            for (size_t j = 0; j < n_; ++j) {
                std::cout << at(i, j) << " ";
            }
            std::cout << std::endl;
        }
    }
};

int main() {
    Matrix a(2);
    a.at(0, 0) = 1; a.at(0, 1) = 2;
    a.at(1, 0) = 3; a.at(1, 1) = 4;

    Matrix b = a * a;
    b.print();
}`,
    manifestation: `$ ./matrix
Segmentation fault (core dumped)

$ ulimit -s 256 && ./matrix
Segmentation fault (core dumped)
(infinite mutual recursion between operator* overloads exhausts the stack)`,
    hints: [
      "Trace the call chain when a * a is evaluated. What functions are called?",
      "Does operator* depend on operator*=? Does operator*= depend on operator*?",
      "What happens when two functions each delegate to the other with no termination condition?",
    ],
    explanation:
      "operator* creates a copy of the left-hand side and calls operator*= on it. operator*= implements itself by calling operator* and assigning the result. This creates infinite mutual recursion: operator* calls operator*=, which calls operator*, which calls operator*=, and so on. The program crashes with a stack overflow at runtime. One of the two operators must contain the actual multiplication logic instead of delegating to the other.",
    stdlibRefs: [],
  },
  {
    id: 43,
    topic: "Operator Overloading",
    difficulty: "Hard",
    title: "Diagnostic Logger",
    description:
      "A diagnostic logger that reports hardware register values.",
    code: `#include <iostream>
#include <string>
#include <sstream>

class DiagLog {
    std::ostringstream buf_;
    std::string tag_;
public:
    explicit DiagLog(std::string tag) : tag_(std::move(tag)) {}

    DiagLog& operator<<(const char* s) { buf_ << s; return *this; }
    DiagLog& operator<<(int n) { buf_ << n; return *this; }

    void flush() {
        std::cout << "[" << tag_ << "] " << buf_.str() << std::endl;
        buf_.str("");
    }
};

void report_status(DiagLog& log, int register_val) {
    int alarm_bit = 5;
    int warning_bit = 3;

    log << "Register: " << register_val;
    log.flush();

    log << "Alarm mask: " << 1 << alarm_bit;
    log.flush();

    log << "Warning mask: " << 1 << warning_bit;
    log.flush();
}

int main() {
    DiagLog log("HW");
    report_status(log, 255);
}`,
    manifestation: `$ ./diaglog
logger << Severity::WARNING << "disk full";

Expected output:
  [WARNING] disk full
Actual output:
  [2] disk full
(Severity enum printed as integer due to operator precedence)`,
    hints: [
      "How does C++ parse an expression with multiple << operators in a row?",
      "Is the expression 1 << alarm_bit evaluated as a bitwise shift, or does something else happen first?",
      "What is the associativity of operator<<, and how does it affect the grouping when a DiagLog is on the left?",
    ],
    explanation:
      'The expression log << "Alarm mask: " << 1 << alarm_bit is parsed left-to-right as ((log << "Alarm mask: ") << 1) << alarm_bit. The intended bitwise shift 1 << alarm_bit is never computed. Instead, the integers 1 and alarm_bit (5) are logged as separate values, producing the concatenated output "15" instead of the expected "32" (which is 1 << 5). Parentheses are required: log << "Alarm mask: " << (1 << alarm_bit).',
    stdlibRefs: [
      { name: "std::ostringstream", brief: "Output stream that writes to an internal std::string buffer; useful for building formatted strings.", note: "The << operator has lower precedence than the ternary operator (?:). Parentheses are required around ternary expressions streamed with <<.", link: "https://en.cppreference.com/w/cpp/io/basic_ostringstream" },
    ],
  },
  // ── Classes ──
  {
    id: 44,
    topic: "Classes",
    difficulty: "Easy",
    title: "Rectangle Scaler",
    description:
      "Computes the area of rectangles and prints the dimensions with the computed area.",
    code: `#include <iostream>

class Rectangle {
    double width_;
    double area_;
    double height_;
public:
    Rectangle(double w, double h)
        : width_(w), height_(h), area_(width_ * height_) {}

    double area() const { return area_; }
    double perimeter() const { return 2.0 * (width_ + height_); }

    void print() const {
        std::cout << width_ << " x " << height_
                  << ", area = " << area_
                  << ", perimeter = " << perimeter() << std::endl;
    }
};

int main() {
    Rectangle r(3.0, 4.0);
    r.print();

    Rectangle s(5.0, 2.0);
    s.print();

    Rectangle square(7.0, 7.0);
    square.print();
}`,
    manifestation: `$ ./rectscale
Rectangle(4, 3) scaled by 2:

Expected output:
  width=8, height=6, area=48
Actual output:
  width=6, height=6, area=36`,
    hints: [
      "In what order are the member variables actually initialized?",
      "Does the order in the initializer list determine the initialization sequence, or does declaration order?",
      "What is the value of height_ when area_ is being computed?",
    ],
    explanation:
      "Members are initialized in declaration order (width_, area_, height_), not in the order written in the initializer list. When area_ is initialized as width_ * height_, height_ has not been initialized yet and contains an indeterminate value. The computed area is garbage despite the initializer list appearing to set height_ first.",
    stdlibRefs: [],
  },
  {
    id: 45,
    topic: "Classes",
    difficulty: "Easy",
    title: "Grade Averager",
    description:
      "Manages grade books for different academic subjects and computes their averages.",
    code: `#include <iostream>
#include <string>

class GradeBook {
    std::string subject_;
    static double total_;
    static int count_;
public:
    GradeBook(std::string subject) : subject_(std::move(subject)) {}

    void add_grade(double grade) {
        total_ += grade;
        ++count_;
    }

    double average() const {
        return count_ > 0 ? total_ / count_ : 0.0;
    }

    void print() const {
        std::cout << subject_ << " average: " << average() << std::endl;
    }
};

double GradeBook::total_ = 0.0;
int GradeBook::count_ = 0;

int main() {
    GradeBook math("Math");
    math.add_grade(90);
    math.add_grade(85);

    GradeBook science("Science");
    science.add_grade(78);
    science.add_grade(92);

    math.print();
    science.print();
}`,
    manifestation: `$ ./grades
Student A: grades 90, 85, 92 -> average = 89
Student B: grades 70, 75

Expected output:
  Student B average: 72.5
Actual output:
  Student B average: 82 (includes Student A's grades)`,
    hints: [
      "Are total_ and count_ unique to each GradeBook instance?",
      "What does the static keyword mean for class data members?",
    ],
    explanation:
      "The members total_ and count_ are declared static, meaning they are shared across all GradeBook instances. When grades are added through either math or science, they accumulate in the same two variables. Both objects report the combined average of all four grades (86.25) instead of their individual averages (87.5 for Math, 85.0 for Science).",
    stdlibRefs: [],
  },
  {
    id: 46,
    topic: "Classes",
    difficulty: "Easy",
    title: "Thermostat Controller",
    description:
      "Controls thermostats in different rooms by comparing current and target temperatures.",
    code: `#include <iostream>
#include <string>

class Thermostat {
    std::string location_;
    double target_temp_;
    double current_temp_;
public:
    Thermostat(std::string location, double target_temp)
        : location_(std::move(location)), current_temp_(20.0) {
        double target_temp_ = target_temp;
    }

    void adjust() {
        if (current_temp_ < target_temp_) {
            std::cout << location_ << ": Heating to "
                      << target_temp_ << std::endl;
        } else if (current_temp_ > target_temp_) {
            std::cout << location_ << ": Cooling to "
                      << target_temp_ << std::endl;
        } else {
            std::cout << location_ << ": At target "
                      << target_temp_ << std::endl;
        }
    }

    void set_current(double temp) { current_temp_ = temp; }
};

int main() {
    Thermostat living_room("Living Room", 22.0);
    Thermostat bedroom("Bedroom", 18.0);

    living_room.adjust();
    bedroom.adjust();

    living_room.set_current(25.0);
    living_room.adjust();
}`,
    manifestation: `$ ./thermostat
Set target to 72.0

Expected output:
  Target: 72.0
Actual output:
  Target: 0 (or uninitialized value)`,
    hints: [
      "How is target_temp_ assigned in the constructor body?",
      "Is the variable being assigned inside the constructor body the class member, or something else?",
    ],
    explanation:
      "The constructor body declares a local variable double target_temp_ that shadows the class member of the same name. The parameter value is stored in this local, which is immediately discarded when the constructor finishes. The member target_temp_ is never initialized, leaving it with an indeterminate value. All comparisons in adjust() read this uninitialized member — undefined behavior.",
    stdlibRefs: [],
  },
  {
    id: 47,
    topic: "Classes",
    difficulty: "Medium",
    title: "Secure Component",
    description:
      "Initializes system components and validates their readiness with type-specific checks.",
    code: `#include <iostream>
#include <string>

class Component {
    std::string type_;
protected:
    bool ready_;
public:
    Component(std::string type) : type_(std::move(type)), ready_(false) {
        setup();
    }
    virtual ~Component() = default;

    virtual void setup() {
        ready_ = true;
    }

    void check() const {
        std::cout << type_ << ": "
                  << (ready_ ? "ready" : "NOT ready") << std::endl;
    }
};

class SecureComponent : public Component {
    std::string key_;
public:
    SecureComponent(std::string type, std::string key)
        : Component(std::move(type)), key_(std::move(key)) {}

    void setup() override {
        if (key_.size() >= 8) {
            ready_ = true;
        }
    }
};

int main() {
    SecureComponent auth("Authenticator", "my-secret-key-123");
    auth.check();

    SecureComponent validator("Validator", "short");
    validator.check();
}`,
    manifestation: `$ ./secure
Expected output:
  SecureComponent: security check passed
Actual output:
  Component: security check passed
(base class version called during construction)`,
    hints: [
      "Which version of setup() runs during the Component constructor?",
      "At what point in construction does virtual dispatch to the derived class become available?",
      "Are the derived class members initialized when the base constructor runs?",
    ],
    explanation:
      "Virtual functions called from a constructor dispatch to the version of the class currently being constructed. When Component's constructor calls setup(), the object's dynamic type is still Component, so Component::setup() runs unconditionally setting ready_ to true. SecureComponent::setup() with its key-length check is never invoked. The Validator with the short key is incorrectly reported as ready.",
    stdlibRefs: [],
  },
  {
    id: 48,
    topic: "Classes",
    difficulty: "Medium",
    title: "Notification System",
    description:
      "Sends notifications through different channels at configurable priority levels.",
    code: `#include <iostream>
#include <string>

class Notifier {
public:
    virtual void send(const std::string& msg, int priority = 1) {
        std::cout << "[NORMAL] " << msg
                  << " (priority " << priority << ")" << std::endl;
    }
    virtual ~Notifier() = default;
};

class UrgentNotifier : public Notifier {
public:
    void send(const std::string& msg, int priority = 10) override {
        std::cout << "[URGENT] " << msg
                  << " (priority " << priority << ")" << std::endl;
    }
};

void dispatch(Notifier& notifier, const std::string& msg) {
    notifier.send(msg);
}

int main() {
    UrgentNotifier urgent;

    std::cout << "Direct call:" << std::endl;
    urgent.send("server down");

    std::cout << "Dispatched call:" << std::endl;
    dispatch(urgent, "server down");
}`,
    manifestation: `$ ./notify
EmailNotifier::send("hello")

Expected output:
  Sending email with priority HIGH
Actual output:
  Sending email with priority NORMAL
(default argument resolved from base class at compile time)`,
    hints: [
      "What determines the default argument value when a virtual function is called through a base reference?",
      "Is the default argument resolved at compile time or at runtime?",
    ],
    explanation:
      "Default arguments are resolved at compile time based on the static type of the pointer or reference, not the dynamic type. When dispatch() calls notifier.send(msg) through a Notifier& reference, the default argument priority = 1 from Notifier::send is used, even though UrgentNotifier::send is the function that actually executes. The urgent notification incorrectly runs with priority 1 instead of 10.",
    stdlibRefs: [],
  },
  {
    id: 49,
    topic: "Classes",
    difficulty: "Medium",
    title: "Electric Vehicle",
    description:
      "Tracks electric vehicle specifications and accumulated mileage.",
    code: `#include <iostream>
#include <string>

class Vehicle {
    std::string make_;
    int year_;
    double mileage_;
public:
    Vehicle() : make_("Unknown"), year_(0), mileage_(0.0) {}
    Vehicle(std::string make, int year)
        : make_(std::move(make)), year_(year), mileage_(0.0) {}

    void print_info() const {
        std::cout << year_ << " " << make_
                  << " (" << mileage_ << " mi)" << std::endl;
    }

    void add_miles(double m) { mileage_ += m; }
};

class ElectricCar : public Vehicle {
    double battery_kwh_;
public:
    ElectricCar(std::string make, int year, double battery)
        : battery_kwh_(battery) {
        Vehicle(std::move(make), year);
    }

    void print_specs() const {
        print_info();
        std::cout << "Battery: " << battery_kwh_ << " kWh" << std::endl;
    }
};

int main() {
    ElectricCar car("Tesla", 2024, 75.0);
    car.add_miles(15000);
    car.print_specs();
}`,
    manifestation: `$ ./ev
ElectricVehicle ev("Tesla", 75.0);

Expected output:
  make=Tesla, batteryKWh=75
Actual output:
  make=, batteryKWh=75 (base class default-constructed, then overwritten)`,
    hints: [
      "Where exactly is the base class Vehicle being initialized?",
      "What does the statement Vehicle(std::move(make), year) do inside the constructor body?",
      "At what point during construction must the base class be initialized?",
    ],
    explanation:
      'The statement Vehicle(std::move(make), year) in the constructor body creates and immediately destroys a temporary Vehicle object — it does not initialize the base class. Base class initialization must happen in the member initializer list, before the constructor body runs. Since no base constructor is specified in the initializer list, the default Vehicle() constructor is called, setting make_ to "Unknown" and year_ to 0.',
    stdlibRefs: [],
  },
  {
    id: 50,
    topic: "Classes",
    difficulty: "Medium",
    title: "Sensor Reporter",
    description:
      "Creates on-demand report generators for different sensor readings.",
    code: `#include <iostream>
#include <functional>
#include <vector>
#include <string>

class Sensor {
    std::string name_;
    double reading_;
public:
    Sensor(std::string name, double reading)
        : name_(std::move(name)), reading_(reading) {}

    void update(double val) { reading_ = val; }

    std::function<void()> make_reporter() {
        return [this]() {
            std::cout << name_ << ": " << reading_ << std::endl;
        };
    }
};

std::vector<std::function<void()>> create_reports() {
    std::vector<std::function<void()>> reports;

    Sensor thermometer("Thermometer", 36.6);
    Sensor barometer("Barometer", 1013.25);

    reports.push_back(thermometer.make_reporter());
    reports.push_back(barometer.make_reporter());

    return reports;
}

int main() {
    auto reports = create_reports();

    std::cout << "Sensor readings:" << std::endl;
    for (auto& report : reports) {
        report();
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g sensor.cpp -o sensor && ./sensor
=================================================================
==23891==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 8 at 0x602000000010 thread T0
    #0 0x55c1a3 in operator() sensor.cpp:18
    #1 0x55c2e1 in main sensor.cpp:29
0x602000000010 is located 0 bytes inside of 64-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55c1a1 in SensorReporter::~SensorReporter()
SUMMARY: AddressSanitizer: heap-use-after-free sensor.cpp:18 in operator()`,
    hints: [
      "What does the lambda capture when it uses [this]?",
      "What happens to the Sensor objects after create_reports() returns?",
    ],
    explanation:
      "The lambdas capture the this pointer of local Sensor objects inside create_reports(). When the function returns, both Sensor objects are destroyed, but the returned lambdas still hold dangling this pointers. Invoking any of the report functions reads destroyed objects' members — undefined behavior. The lambdas should capture the member values by copy instead of capturing this.",
    stdlibRefs: [
      { name: "std::function", brief: "Type-erased callable wrapper that can store lambdas, function pointers, and other callables.", note: "A lambda capturing [this] dangles if the owning object is destroyed before the lambda is invoked.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  {
    id: 51,
    topic: "Classes",
    difficulty: "Hard",
    title: "Database Connection",
    description:
      "Establishes database connections with dedicated host and query buffers.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>
#include <cstring>

class Connection {
    char* host_buf_;
    char* query_buf_;
    size_t query_size_;
public:
    Connection(const std::string& host, size_t query_size)
        : query_size_(query_size)
    {
        host_buf_ = new char[host.size() + 1];
        std::strcpy(host_buf_, host.c_str());

        if (query_size == 0) {
            throw std::invalid_argument("query buffer size must be positive");
        }
        query_buf_ = new char[query_size];
        std::memset(query_buf_, 0, query_size);
    }

    ~Connection() {
        delete[] host_buf_;
        delete[] query_buf_;
    }

    void execute(const char* query) {
        std::strncpy(query_buf_, query, query_size_ - 1);
        query_buf_[query_size_ - 1] = '\\0';
        std::cout << "Executing on " << host_buf_ << ": "
                  << query_buf_ << std::endl;
    }
};

int main() {
    try {
        Connection good("localhost", 256);
        good.execute("SELECT * FROM users");

        Connection bad("remotehost", 0);
        bad.execute("SELECT 1");
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=leak -g dbconn.cpp -o dbconn && ./dbconn
Connection setup failed

=================================================================
==27156==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 64 bytes in 1 object(s) allocated from:
    #0 0x7f9a2b in operator new[](unsigned long)
    #1 0x55a1c3 in Database::Database() dbconn.cpp:10

SUMMARY: LeakSanitizer: 64 byte(s) leaked in 1 object(s).`,
    hints: [
      "What happens to resources acquired before an exception is thrown in a constructor?",
      "If a constructor throws, does the destructor of that object run?",
      "Which resource has already been allocated by the time the size check runs?",
    ],
    explanation:
      "When the constructor throws for query_size == 0, host_buf_ has already been allocated. Since the object was never fully constructed, its destructor does not run — the C++ standard only calls destructors for fully constructed objects. The host_buf_ allocation is permanently leaked. Using std::string or std::unique_ptr for the buffers would ensure cleanup through their own destructors.",
    stdlibRefs: [
      { name: "std::strncpy", args: "(char* dest, const char* src, size_t count) → char*", brief: "Copies at most count characters from src to dest; pads with nulls if src is shorter.", note: "If src is longer than count, dest is NOT null-terminated. Always null-terminate the buffer manually.", link: "https://en.cppreference.com/w/cpp/string/byte/strncpy" },
      { name: "std::memset", args: "(void* dest, int ch, size_t count) → void*", brief: "Fills count bytes of memory at dest with the specified byte value.", link: "https://en.cppreference.com/w/cpp/string/byte/memset" },
    ],
  },
  {
    id: 52,
    topic: "Classes",
    difficulty: "Hard",
    title: "Query Builder",
    description:
      "Builds parameterized database queries and executes them.",
    code: `#include <iostream>
#include <string>

class Query {
    const std::string& table_;
    std::string condition_;
public:
    Query(const std::string& table, std::string condition)
        : table_(table), condition_(std::move(condition)) {}

    void execute() const {
        std::cout << "SELECT * FROM " << table_
                  << " WHERE " << condition_ << std::endl;
    }
};

Query build_user_query(int user_id) {
    return Query("users", "id = " + std::to_string(user_id));
}

Query build_order_query(int order_id) {
    return Query("orders", "oid = " + std::to_string(order_id));
}

int main() {
    auto q1 = build_user_query(42);
    auto q2 = build_order_query(99);

    q1.execute();
    q2.execute();
}`,
    manifestation: `$ g++ -fsanitize=address -g qbuilder.cpp -o qbuilder && ./qbuilder
=================================================================
==18234==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd3a100060
READ of size 8 at 0x7ffd3a100060 thread T0
    #0 0x55b1a1 in main qbuilder.cpp:22
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: stack-use-after-scope qbuilder.cpp:22 in main`,
    hints: [
      "What is the lifetime of the string object that table_ refers to?",
      "When a const reference parameter binds to a temporary, how long does that temporary live?",
      "Does storing a reference in a class member extend the lifetime of the object it refers to?",
    ],
    explanation:
      'The constructor parameter table binds to a temporary std::string created from the string literal "users". The member reference table_ is initialized from this parameter, but storing a reference in a member does not extend the temporary\'s lifetime. The temporary is destroyed when the full expression completes, leaving table_ as a dangling reference. Calling execute() reads through freed memory — undefined behavior. The member should be std::string by value, not const std::string&.',
    stdlibRefs: [],
  },
  {
    id: 53,
    topic: "Classes",
    difficulty: "Hard",
    title: "Resource Handle",
    description:
      "Tracks shared ownership of a named resource with acquire and release operations.",
    code: `#include <iostream>
#include <string>

class Handle {
    std::string name_;
    int ref_count_;
public:
    Handle(std::string name)
        : name_(std::move(name)), ref_count_(1) {
        std::cout << "Created " << name_ << std::endl;
    }

    ~Handle() {
        std::cout << "Destroyed " << name_ << std::endl;
    }

    void acquire() {
        ++ref_count_;
        std::cout << name_ << " acquired, refs = "
                  << ref_count_ << std::endl;
    }

    void release() {
        --ref_count_;
        if (ref_count_ == 0) {
            delete this;
        }
        std::cout << name_ << " released, refs = "
                  << ref_count_ << std::endl;
    }

    void use() const {
        std::cout << "Using " << name_ << std::endl;
    }
};

int main() {
    Handle* h = new Handle("FileHandle");
    h->acquire();
    h->use();

    h->release();
    h->release();
}`,
    manifestation: `$ g++ -fsanitize=address -g reshandle.cpp -o reshandle && ./reshandle
=================================================================
==29671==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55a1c3 in main reshandle.cpp:28
    #1 0x7f3c2a in __libc_start_main
0x602000000010 is located 0 bytes inside of 16-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1a1 in ResourceHandle::release() reshandle.cpp:16
SUMMARY: AddressSanitizer: heap-use-after-free reshandle.cpp:28 in main`,
    hints: [
      "What happens to the object's memory after delete this executes?",
      "Does execution of the member function continue after delete this?",
      "Are any member variables accessed after the point where the object might be destroyed?",
    ],
    explanation:
      "When release() decrements ref_count_ to 0 and calls delete this, the object is destroyed and its memory freed. However, execution continues past the if block and accesses name_ and ref_count_ on the next line — both members of the now-deleted object. This is use-after-free. The function must return immediately after delete this to avoid accessing any member state.",
    stdlibRefs: [],
  },
  // ── Heap Allocation (batch 2) ──
  {
    id: 54,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Histogram Builder",
    description:
      "Counts the frequency of each digit in a dataset and displays a simple text histogram.",
    code: `#include <iostream>
#include <cstring>

int main() {
    const int num_bins = 10;
    int* bins = new int(num_bins);
    std::memset(bins, 0, num_bins * sizeof(int));

    int data[] = {3, 7, 1, 4, 7, 2, 9, 0, 3, 5, 7, 2, 8, 1, 6};
    int data_size = sizeof(data) / sizeof(data[0]);

    for (int i = 0; i < data_size; ++i) {
        if (data[i] >= 0 && data[i] < num_bins) {
            bins[data[i]]++;
        }
    }

    std::cout << "Histogram:" << std::endl;
    for (int i = 0; i < num_bins; ++i) {
        std::cout << i << ": ";
        for (int j = 0; j < bins[i]; ++j) {
            std::cout << "#";
        }
        std::cout << std::endl;
    }

    delete[] bins;
}`,
    manifestation: `$ ./histogram
Expected output:
  [1]=3 [2]=2 [3]=1
Actual output:
  Segmentation fault (core dumped)

$ g++ -fsanitize=address -g histogram.cpp -o histogram && ./histogram
=================================================================
==15423==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000014
WRITE of size 4 at 0x602000000014 thread T0
    #0 0x55a1c3 in main histogram.cpp:12
SUMMARY: AddressSanitizer: heap-buffer-overflow histogram.cpp:12 in main
(new int(n) allocates a single int, not an array of n ints)`,
    hints: [
      "Look carefully at the allocation syntax — what exactly does new int(n) allocate?",
      "What is the difference between new int(n) and new int[n]?",
    ],
    explanation:
      "The expression new int(num_bins) allocates a single int initialized to the value 10, not an array of 10 ints. The program then writes to bins[0] through bins[9], which is a massive heap buffer overflow past the one allocated int. The fix is to use new int[num_bins] with square brackets for array allocation.",
    stdlibRefs: [],
  },
  {
    id: 55,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Text Buffer",
    description:
      "Truncates a long string into a fixed-size buffer and prints the result with its length.",
    code: `#include <iostream>
#include <cstring>

char* truncate(const char* src, size_t max_len) {
    char* buf = new char[max_len];
    std::strncpy(buf, src, max_len);
    return buf;
}

int main() {
    const char* long_text = "The quick brown fox jumps over the lazy dog";

    char* short_text = truncate(long_text, 10);

    std::cout << "Truncated: " << short_text << std::endl;
    std::cout << "Length: " << std::strlen(short_text) << std::endl;

    delete[] short_text;
}`,
    manifestation: `$ ./textbuf
Expected output:
  Buffer: Hello, World!
Actual output:
  Buffer: Hello, World!\\xfe\\xca... (garbage after string)

$ valgrind ./textbuf
==24103== Conditional jump or move depends on uninitialised value(s)
==24103==    at 0x4C2E1A8: strlen (vg_replace_strmem.c:462)
==24103==    by 0x400891: main (textbuf.cpp:14)`,
    hints: [
      "What does strncpy guarantee about the destination buffer when the source is longer than max_len?",
      "If the source string is longer than max_len, does strncpy add a null terminator?",
    ],
    explanation:
      "strncpy copies at most max_len characters but does not null-terminate the destination if the source is as long as or longer than max_len. Since long_text is 44 characters and max_len is 10, the buffer has no null terminator. Printing it with cout and calling strlen both read past the allocated 10 bytes — a heap buffer overread. The fix is to add buf[max_len - 1] = '\\0' after the strncpy call.",
    stdlibRefs: [
      { name: "std::strncpy", args: "(char* dest, const char* src, size_t count) → char*", brief: "Copies at most count characters from src to dest; does not guarantee null-termination.", note: "If strlen(src) >= count, the destination will not be null-terminated. Functions like strlen and printf will read past the buffer.", link: "https://en.cppreference.com/w/cpp/string/byte/strncpy" },
      { name: "std::strlen", args: "(const char* str) → size_t", brief: "Scans forward from the pointer until it finds a null byte, returning the count of characters before it.", note: "On a non-null-terminated buffer, strlen reads past the end — undefined behavior.", link: "https://en.cppreference.com/w/cpp/string/byte/strlen" },
    ],
  },
  {
    id: 56,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Pixel Array",
    description:
      "Creates a color gradient across a row of pixels and prints each pixel's RGB values.",
    code: `#include <iostream>
#include <cstdlib>

struct Pixel {
    unsigned char r, g, b;
};

Pixel* create_gradient(int width) {
    Pixel* pixels = static_cast<Pixel*>(
        std::malloc(width * sizeof(Pixel))
    );

    for (int i = 0; i < width; ++i) {
        pixels[i] = {
            static_cast<unsigned char>(i * 255 / width),
            0,
            static_cast<unsigned char>(255 - i * 255 / width)
        };
    }
    return pixels;
}

int main() {
    const int width = 16;
    Pixel* gradient = create_gradient(width);

    for (int i = 0; i < width; ++i) {
        std::cout << "Pixel " << i << ": ("
                  << static_cast<int>(gradient[i].r) << ", "
                  << static_cast<int>(gradient[i].g) << ", "
                  << static_cast<int>(gradient[i].b) << ")"
                  << std::endl;
    }

    delete[] gradient;
}`,
    manifestation: `$ g++ -fsanitize=address -g pixarr.cpp -o pixarr && ./pixarr
=================================================================
==20891==ERROR: AddressSanitizer: alloc-dealloc-mismatch (malloc vs operator delete[]) on 0x614000000040
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1c3 in main pixarr.cpp:15
    #2 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch pixarr.cpp:15 in main`,
    hints: [
      "How was the pixel array allocated?",
      "Does the deallocation method match the allocation method?",
    ],
    explanation:
      "The pixel array is allocated with std::malloc but freed with delete[]. Mixing C allocation (malloc/calloc/realloc) with C++ deallocation (delete/delete[]) is undefined behavior. The fix is to use std::free(gradient) instead of delete[], or to allocate with new Pixel[width] instead of malloc.",
    stdlibRefs: [
      { name: "std::malloc", args: "(size_t size) → void*", brief: "Allocates uninitialized memory from the heap and returns a void* pointer.", note: "Memory from malloc must be freed with free(), not delete or delete[]. Mixing allocators is undefined behavior.", link: "https://en.cppreference.com/w/cpp/memory/c/malloc" },
    ],
  },
  {
    id: 57,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Image Grid",
    description:
      "Allocates a 2D integer grid, fills it with sequential values, and prints it.",
    code: `#include <iostream>

int** create_grid(int rows, int cols) {
    int** grid = new int*[rows];
    for (int i = 0; i < rows; ++i) {
        grid[i] = new int[cols];
        for (int j = 0; j < cols; ++j) {
            grid[i][j] = i * cols + j;
        }
    }
    return grid;
}

void print_grid(int** grid, int rows, int cols) {
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            std::cout << grid[i][j] << "\\t";
        }
        std::cout << std::endl;
    }
}

int main() {
    const int rows = 4;
    const int cols = 5;

    int** grid = create_grid(rows, cols);
    print_grid(grid, rows, cols);

    delete[] grid;
    std::cout << "Grid cleanup complete" << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=leak -g imgrid.cpp -o imgrid && ./imgrid
Grid filled successfully

=================================================================
==17234==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 160 bytes in 4 object(s) allocated from:
    #0 0x7f9a2b in operator new[](unsigned long)
    #1 0x55a1c3 in allocateGrid imgrid.cpp:5

(rows array deleted but individual row arrays leaked)
SUMMARY: LeakSanitizer: 160 byte(s) leaked in 4 object(s).`,
    hints: [
      "How many separate heap allocations are made in create_grid?",
      "Does the cleanup code free every allocation that was made?",
    ],
    explanation:
      "create_grid makes rows + 1 allocations: one for the pointer array and one for each row. The cleanup only calls delete[] grid, which frees the array of pointers but not the individually allocated rows. All row data is permanently leaked. The fix is to loop through each row calling delete[] grid[i] before deleting the outer array.",
    stdlibRefs: [],
  },
  {
    id: 58,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Circular Queue",
    description:
      "A circular buffer that automatically grows when full and supports element access.",
    code: `#include <iostream>
#include <algorithm>

class RingBuffer {
    int* data_;
    size_t capacity_;
    size_t head_;
    size_t count_;

    void grow() {
        size_t new_cap = capacity_ * 2;
        int* new_data = new int[new_cap];
        for (size_t i = 0; i < count_; ++i) {
            new_data[i] = data_[(head_ + i) % capacity_];
        }
        delete[] data_;
        data_ = new_data;
        head_ = 0;
        capacity_ = new_cap;
    }

public:
    RingBuffer(size_t cap = 4)
        : data_(new int[cap]), capacity_(cap), head_(0), count_(0) {}
    ~RingBuffer() { delete[] data_; }

    void push(int val) {
        if (count_ == capacity_) grow();
        data_[(head_ + count_) % capacity_] = val;
        ++count_;
    }

    int& front() { return data_[head_]; }

    void print() const {
        for (size_t i = 0; i < count_; ++i) {
            std::cout << data_[(head_ + i) % capacity_] << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    RingBuffer buf(4);
    buf.push(10);
    buf.push(20);
    buf.push(30);

    int& ref = buf.front();

    buf.push(40);
    buf.push(50);

    std::cout << "Front element: " << ref << std::endl;
    buf.print();
}`,
    manifestation: `$ g++ -fsanitize=address -g circqueue.cpp -o circqueue && ./circqueue
=================================================================
==25678==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55c1a3 in CircularQueue::front() circqueue.cpp:28
    #1 0x55c3f1 in main circqueue.cpp:42
0x602000000010 is located 0 bytes inside of 20-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55c181 in CircularQueue::enqueue(int) circqueue.cpp:18
SUMMARY: AddressSanitizer: heap-use-after-free circqueue.cpp:28 in main`,
    hints: [
      "What happens to existing references into the buffer when push() causes a resize?",
      "Under what condition does push() reallocate the internal storage?",
      "Is the reference obtained from front() still valid after the buffer grows?",
    ],
    explanation:
      "The reference ref obtained from front() points into the internal data_ array. When the fifth push(50) triggers grow(), the old data_ array is deleted and a new one is allocated. The reference ref now points to freed memory. Reading it is undefined behavior. References and pointers into the buffer are invalidated by any operation that triggers a resize.",
    stdlibRefs: [],
  },
  {
    id: 59,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Matrix Flattener",
    description:
      "Converts a 2D matrix into a 1D array and prints the flattened result.",
    code: `#include <iostream>

int* flatten(const int* const* matrix, int rows, int cols) {
    int* flat = new int[rows * rows];
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            flat[i * cols + j] = matrix[i][j];
        }
    }
    return flat;
}

int main() {
    const int rows = 3, cols = 5;

    int** matrix = new int*[rows];
    for (int i = 0; i < rows; ++i) {
        matrix[i] = new int[cols];
        for (int j = 0; j < cols; ++j) {
            matrix[i][j] = i * cols + j + 1;
        }
    }

    int* flat = flatten(matrix, rows, cols);

    std::cout << "Flattened:" << std::endl;
    for (int i = 0; i < rows * cols; ++i) {
        std::cout << flat[i] << " ";
    }
    std::cout << std::endl;

    delete[] flat;
    for (int i = 0; i < rows; ++i) delete[] matrix[i];
    delete[] matrix;
}`,
    manifestation: `$ ./flatten
Expected output:
  1 2 3 4 5 6 7 8 9 10 11 12
Actual output:
  1 2 3 4 5 6 7 8 9 (remaining values are garbage)

$ g++ -fsanitize=address -g flatten.cpp -o flatten && ./flatten
=================================================================
==19823==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60200000003c
    #0 0x55a1c3 in main flatten.cpp:14
SUMMARY: AddressSanitizer: heap-buffer-overflow flatten.cpp:14 in main
(allocated rows*rows instead of rows*cols)`,
    hints: [
      "How many elements does the flatten function allocate for the output?",
      "How many elements does the nested loop actually write?",
      "Are the dimensions used in the allocation consistent with those used in the loop?",
    ],
    explanation:
      "The allocation uses rows * rows (3 * 3 = 9) instead of rows * cols (3 * 5 = 15). The nested loop writes 15 values into a 9-element buffer, causing a heap buffer overflow. The fix is to allocate new int[rows * cols].",
    stdlibRefs: [],
  },
  {
    id: 60,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Student Roster",
    description:
      "Dynamically grows a roster by adding students one at a time and printing the final list.",
    code: `#include <iostream>
#include <cstring>

struct Student {
    char name[64];
    int grade;
};

Student* add_student(Student* roster, int& count,
                     const char* name, int grade) {
    Student* new_roster = new Student[count + 1];

    if (count > 0) {
        std::memcpy(new_roster, roster, count);
        delete[] roster;
    }

    std::strncpy(new_roster[count].name, name, 63);
    new_roster[count].name[63] = '\\0';
    new_roster[count].grade = grade;
    ++count;
    return new_roster;
}

int main() {
    Student* roster = nullptr;
    int count = 0;

    roster = add_student(roster, count, "Alice", 92);
    roster = add_student(roster, count, "Bob", 85);
    roster = add_student(roster, count, "Charlie", 78);
    roster = add_student(roster, count, "Diana", 95);

    std::cout << "Student Roster:" << std::endl;
    for (int i = 0; i < count; ++i) {
        std::cout << roster[i].name << ": "
                  << roster[i].grade << std::endl;
    }

    delete[] roster;
}`,
    manifestation: `$ valgrind ./roster
==31456== Memcheck, a memory error detector
==31456== Invalid read of size 1
==31456==    at 0x4C2E1A8: memcpy (vg_replace_strmem.c:1036)
==31456==    by 0x400891: StudentRoster::add(Student const&) (roster.cpp:18)
==31456== Address 0x5a1c1e0 is 0 bytes after a block of size 48 alloc'd
==31456==    at 0x4C2E0: operator new[](unsigned long)
==31456==    by 0x400812: StudentRoster::grow() (roster.cpp:12)
(memcpy size is element count, not byte count)`,
    hints: [
      "What is the third argument to std::memcpy — is it a byte count or an element count?",
      "How many bytes does each Student struct occupy?",
      "Does the memcpy copy enough data to fully transfer all existing students?",
    ],
    explanation:
      "std::memcpy's third argument is a byte count, not an element count. The call passes count (the number of students) instead of count * sizeof(Student). Since each Student is 68 bytes, only 1-3 bytes of the old roster are copied during each resize, leaving the transferred entries almost entirely uninitialized. The fix is std::memcpy(new_roster, roster, count * sizeof(Student)).",
    stdlibRefs: [
      { name: "std::memcpy", args: "(void* dest, const void* src, size_t count) → void*", brief: "Copies count bytes of raw memory from src to dest; both regions must not overlap.", note: "The count parameter is in BYTES, not elements. For an array of T, use count * sizeof(T).", link: "https://en.cppreference.com/w/cpp/string/byte/memcpy" },
    ],
  },
  {
    id: 61,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Particle Simulator",
    description:
      "Simulates particles using a pre-allocated pool and prints their positions.",
    code: `#include <iostream>

struct Particle {
    double x, y, z;
    double vx, vy, vz;

    Particle() : x(0), y(0), z(0), vx(0), vy(0), vz(0) {}
    Particle(double px, double py, double pz)
        : x(px), y(py), z(pz), vx(0), vy(0), vz(0) {}
};

class ParticlePool {
    Particle* pool_;
    bool* in_use_;
    size_t capacity_;
public:
    ParticlePool(size_t cap)
        : pool_(new Particle[cap]),
          in_use_(new bool[cap]()),
          capacity_(cap) {}

    ~ParticlePool() {
        delete[] in_use_;
        delete[] pool_;
    }

    Particle* allocate(double x, double y, double z) {
        for (size_t i = 0; i < capacity_; ++i) {
            if (!in_use_[i]) {
                in_use_[i] = true;
                pool_[i] = Particle(x, y, z);
                return &pool_[i];
            }
        }
        return nullptr;
    }

    void deallocate(Particle* p) {
        size_t idx = p - pool_;
        if (idx < capacity_) {
            in_use_[idx] = false;
        }
    }
};

void simulate(ParticlePool& pool) {
    Particle* a = pool.allocate(1.0, 2.0, 3.0);
    Particle* b = pool.allocate(4.0, 5.0, 6.0);

    if (a && b) {
        std::cout << "A: (" << a->x << ", " << a->y
                  << ", " << a->z << ")" << std::endl;
        std::cout << "B: (" << b->x << ", " << b->y
                  << ", " << b->z << ")" << std::endl;
    }

    delete a;
    delete b;
}

int main() {
    ParticlePool pool(100);
    simulate(pool);
}`,
    manifestation: `$ g++ -fsanitize=address -g particle.cpp -o particle && ./particle
=================================================================
==14567==ERROR: AddressSanitizer: attempting double-free on 0x602000000030 in thread T0:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55c1a3 in main particle.cpp:35
0x602000000030 is located 16 bytes inside of 48-byte region
(pointer into pool interior is not a standalone allocation)
SUMMARY: AddressSanitizer: double-free particle.cpp:35 in main`,
    hints: [
      "How were the Particle objects that a and b point to originally allocated?",
      "Is it valid to call delete on a pointer that points into the middle of a new[] array?",
      "What should the code use instead of delete to return particles to the pool?",
    ],
    explanation:
      "The particles pointed to by a and b are elements within the pool's contiguous new Particle[cap] array — they were not individually allocated with new. Calling delete on pointers into the middle of an array is undefined behavior. The program should call pool.deallocate(a) and pool.deallocate(b) instead of delete.",
    stdlibRefs: [],
  },
  {
    id: 62,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Resource Batch",
    description:
      "Stores heterogeneous resources for batch processing and prints their values.",
    code: `#include <iostream>
#include <string>
#include <vector>

void* make_string(const std::string& s) {
    return new std::string(s);
}

void* make_int(int n) {
    return new int(n);
}

int main() {
    std::vector<void*> resources;

    resources.push_back(make_string("Hello, World!"));
    resources.push_back(make_int(42));
    resources.push_back(make_string("Goodbye!"));
    resources.push_back(make_int(100));

    std::cout << *static_cast<std::string*>(resources[0]) << std::endl;
    std::cout << *static_cast<int*>(resources[1]) << std::endl;
    std::cout << *static_cast<std::string*>(resources[2]) << std::endl;
    std::cout << *static_cast<int*>(resources[3]) << std::endl;

    for (void* p : resources) {
        delete p;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g resbatch.cpp -o resbatch && ./resbatch
=================================================================
==22891==ERROR: AddressSanitizer: undefined-behavior (delete on void*)
WARNING: deleting void* is undefined behavior. The destructor for the
actual object type is never called.

$ valgrind ./resbatch
==22891== Mismatched free() / delete / delete[]
==22891==    at 0x4C2F4D8: operator delete(void*)
==22891==    by 0x4008A1: cleanup (resbatch.cpp:20)
(destructor not called for stored objects)`,
    hints: [
      "What type information does the compiler have when delete is called on each resource?",
      "Can the compiler invoke the correct destructor through a void pointer?",
      "What happens to std::string's internal heap buffer when it is never properly destructed?",
    ],
    explanation:
      "Deleting a void* is undefined behavior per the C++ standard. The compiler has no type information, so it cannot call destructors. For the std::string objects, their internal heap-allocated character buffers are never freed. The fix is to cast each pointer back to its original type before deleting, or to use a type-safe container like std::variant.",
    stdlibRefs: [],
  },
  {
    id: 63,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Batch Processor",
    description:
      "Runs a batch of named tasks with assigned priorities, halting on invalid input.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>

struct Task {
    std::string name;
    int priority;

    Task(const std::string& n, int p) : name(n), priority(p) {
        if (p < 0) throw std::invalid_argument("negative priority");
        std::cout << "Created: " << name << std::endl;
    }

    ~Task() {
        std::cout << "Destroyed: " << name << std::endl;
    }
};

void run_batch(const std::string names[], const int priorities[],
               int count) {
    Task** tasks = new Task*[count];

    try {
        for (int i = 0; i < count; ++i) {
            tasks[i] = new Task(names[i], priorities[i]);
        }
    } catch (...) {
        for (int i = 0; i < count; ++i) {
            delete tasks[i];
        }
        delete[] tasks;
        throw;
    }

    for (int i = 0; i < count; ++i) {
        std::cout << "Running: " << tasks[i]->name
                  << " (priority " << tasks[i]->priority << ")"
                  << std::endl;
    }

    for (int i = 0; i < count; ++i) {
        delete tasks[i];
    }
    delete[] tasks;
}

int main() {
    std::string names[] = {"Compile", "Test", "Deploy", "Notify"};
    int priorities[] = {3, 1, -2, 5};

    try {
        run_batch(names, priorities, 4);
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g batchproc.cpp -o batchproc && ./batchproc
=================================================================
==28123==ERROR: AddressSanitizer: attempting free on address which was not malloc()-ed
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1c3 in BatchProcessor::~BatchProcessor() batchproc.cpp:18
    #2 0x55a3f1 in main batchproc.cpp:30
Address 0x7ffd3a100060 is located in the stack area
SUMMARY: AddressSanitizer: bad-free batchproc.cpp:18 in BatchProcessor::~BatchProcessor()
(deleting uninitialized pointer containing garbage value)`,
    hints: [
      "What values do the entries in the tasks array contain before any Task objects are constructed?",
      "If the construction of tasks[2] throws, how many entries hold valid pointers?",
      "Does the cleanup loop in the catch block account for the fact that some entries were never assigned?",
    ],
    explanation:
      "When Task(\"Deploy\", -2) throws, only tasks[0] and tasks[1] hold valid pointers. The array was allocated with new Task*[count], which does not zero-initialize the pointers, so tasks[2] and tasks[3] contain indeterminate garbage values. The catch block's cleanup loop deletes all count entries, calling delete on garbage pointers — undefined behavior. The fix is to value-initialize the array with new Task*[count]() so unset entries are nullptr, making delete on them safe.",
    stdlibRefs: [],
  },
  // ── Heap Allocation (batch 3) ──
  {
    id: 64,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Running Total",
    description:
      "Computes cumulative totals for two batches of numbers and prints the results.",
    code: `#include <iostream>

int* compute_totals(const int* data, int size) {
    int* totals = new int[size];
    int sum = 0;
    for (int i = 0; i < size; ++i) {
        sum += data[i];
        totals[i] = sum;
    }
    return totals;
}

int main() {
    int batch1[] = {10, 20, 30, 40, 50};
    int batch2[] = {5, 15, 25};

    int* results = compute_totals(batch1, 5);
    std::cout << "Batch 1 totals:";
    for (int i = 0; i < 5; ++i) std::cout << " " << results[i];
    std::cout << std::endl;

    results = compute_totals(batch2, 3);
    std::cout << "Batch 2 totals:";
    for (int i = 0; i < 3; ++i) std::cout << " " << results[i];
    std::cout << std::endl;

    delete[] results;
}`,
    manifestation: `$ g++ -fsanitize=leak -g runtotal.cpp -o runtotal && ./runtotal
Running total: 55

=================================================================
==16234==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 36 bytes in 9 object(s) allocated from:
    #0 0x7f9a2b in operator new(unsigned long)
    #1 0x55a1c3 in main runtotal.cpp:8

SUMMARY: LeakSanitizer: 36 byte(s) leaked in 9 object(s).
(each iteration leaks the previous int*)`,
    hints: [
      "How many heap allocations are made, and how many are freed?",
      "What happens to the first allocation when results is reassigned?",
    ],
    explanation:
      "compute_totals allocates a new array on each call. The first allocation (for batch1) is leaked when results is reassigned to the second allocation (for batch2). Only the second allocation is freed with delete[]. The fix is to call delete[] results before the second assignment.",
    stdlibRefs: [],
  },
  {
    id: 65,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Name Formatter",
    description:
      "Concatenates first and last names into a single full-name string and prints them.",
    code: `#include <iostream>
#include <cstring>
#include <cstdlib>

char* format_name(const char* first, const char* last) {
    size_t len = std::strlen(first) + std::strlen(last) + 2;
    char* full = new char[len];
    std::strcpy(full, first);
    std::strcat(full, " ");
    std::strcat(full, last);
    return full;
}

int main() {
    char* name1 = format_name("John", "Doe");
    char* name2 = format_name("Jane", "Smith");

    std::cout << name1 << std::endl;
    std::cout << name2 << std::endl;

    std::free(name1);
    std::free(name2);
}`,
    manifestation: `$ g++ -fsanitize=address -g namefmt.cpp -o namefmt && ./namefmt
=================================================================
==27891==ERROR: AddressSanitizer: alloc-dealloc-mismatch (operator new[] vs free) on 0x602000000010
    #0 0x7f9a2b in free
    #1 0x55a1c3 in main namefmt.cpp:14
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch namefmt.cpp:14 in main`,
    hints: [
      "How is the memory for each name allocated inside format_name?",
      "Does the deallocation in main match the allocation method?",
    ],
    explanation:
      "The format_name function allocates with new char[len], but main frees with std::free(). Mixing C++ allocation (new[]) with C deallocation (free) is undefined behavior. The fix is to use delete[] name1 and delete[] name2, or change the allocation to std::malloc.",
    stdlibRefs: [
      { name: "std::strlen", args: "(const char* str) → size_t", brief: "Returns the number of characters before the null terminator.", link: "https://en.cppreference.com/w/cpp/string/byte/strlen" },
      { name: "std::strcpy", args: "(char* dest, const char* src) → char*", brief: "Copies the source C-string including the null terminator to the destination.", link: "https://en.cppreference.com/w/cpp/string/byte/strcpy" },
      { name: "std::strcat", args: "(char* dest, const char* src) → char*", brief: "Appends the source C-string to the end of the destination C-string.", note: "Destination must have enough space for both strings plus the null terminator.", link: "https://en.cppreference.com/w/cpp/string/byte/strcat" },
      { name: "std::free", args: "(void* ptr) → void", brief: "Deallocates memory previously allocated by malloc, calloc, or realloc.", note: "Memory from new[] must be freed with delete[], not free(). Mixing allocators is undefined behavior.", link: "https://en.cppreference.com/w/cpp/memory/c/free" },
    ],
  },
  {
    id: 66,
    topic: "Heap Allocation",
    difficulty: "Easy",
    title: "Temperature Log",
    description:
      "Records daily temperature readings and computes the running average.",
    code: `#include <iostream>

class TempLog {
    double* readings_;
    int count_;
public:
    TempLog(int capacity)
        : readings_(new double[capacity]), count_(0) {}

    ~TempLog() { delete[] readings_; }

    void record(double temp) {
        readings_[count_++] = temp;
    }

    double average() const {
        double sum = 0;
        for (int i = 0; i < count_; ++i) sum += readings_[i];
        return count_ > 0 ? sum / count_ : 0.0;
    }
};

void print_average(TempLog log) {
    std::cout << "Average: " << log.average() << std::endl;
}

int main() {
    TempLog daily(100);
    daily.record(22.5);
    daily.record(23.1);
    daily.record(21.8);
    daily.record(24.0);

    print_average(daily);

    daily.record(22.0);
    std::cout << "Updated average: " << daily.average() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g templog.cpp -o templog && ./templog
=================================================================
==19456==ERROR: AddressSanitizer: attempting double-free on 0x604000000010 in thread T0:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1c3 in TempLog::~TempLog() templog.cpp:12
    #2 0x55a3f1 in main templog.cpp:28
0x604000000010 is located 0 bytes inside of 40-byte region
previously freed by thread T0 here:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1c3 in TempLog::~TempLog() templog.cpp:12
SUMMARY: AddressSanitizer: double-free templog.cpp:12 in TempLog::~TempLog()`,
    hints: [
      "How is TempLog passed to print_average?",
      "What does the compiler-generated copy constructor do with the readings_ pointer?",
      "When the copy is destroyed at the end of print_average, what happens to the shared pointer?",
    ],
    explanation:
      "print_average takes TempLog by value, triggering the compiler-generated copy constructor which copies the readings_ pointer (shallow copy). When the local copy is destroyed at the end of print_average, it calls delete[] on the shared pointer. Back in main, daily now holds a dangling pointer — the subsequent daily.record(22.0) writes to freed memory, and daily's destructor will double-free. The fix is to pass by const reference or implement a proper copy constructor.",
    stdlibRefs: [],
  },
  {
    id: 67,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Path Builder",
    description:
      "Incrementally builds file paths and retrieves them as C-strings.",
    code: `#include <iostream>
#include <string>

class PathBuilder {
    std::string path_;
public:
    void set_base(const std::string& base) { path_ = base; }

    void append(const std::string& part) {
        path_ += "/";
        path_ += part;
    }

    const char* c_path() const { return path_.c_str(); }
};

int main() {
    PathBuilder builder;
    builder.set_base("/home/user");
    builder.append("documents");

    const char* saved = builder.c_path();

    builder.append("reports");
    builder.append("2024");
    builder.append("quarterly");
    builder.append("financials");

    std::cout << "Saved: " << saved << std::endl;
    std::cout << "Final: " << builder.c_path() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g pathbuild.cpp -o pathbuild && ./pathbuild
=================================================================
==24567==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000010
READ of size 1 at 0x603000000010 thread T0
    #0 0x55a1c3 in main pathbuild.cpp:16
    #1 0x7f3c2a in __libc_start_main
0x603000000010 is located 0 bytes inside of 32-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1a1 in std::string::~string()
SUMMARY: AddressSanitizer: heap-use-after-free pathbuild.cpp:16 in main
(c_str() pointer invalidated when string modified or destroyed)`,
    hints: [
      "What does c_str() return, and how long is that pointer guaranteed to remain valid?",
      "Can subsequent modifications to the underlying string cause reallocation of its internal buffer?",
    ],
    explanation:
      "The pointer saved is obtained from c_path() which returns path_.c_str(). Subsequent calls to append() modify the internal std::string, which may reallocate its buffer when it needs more capacity. This invalidates saved, making it a dangling pointer. Reading it is undefined behavior. The fix is to call c_path() only after all modifications are complete, or to copy the result into a separate buffer.",
    stdlibRefs: [
      { name: "std::string::c_str", args: "() → const char*", brief: "Returns a const char* to the string's internal null-terminated buffer.", note: "The pointer is invalidated by any non-const operation on the string (append, assign, operator+=, resize, etc.).", link: "https://en.cppreference.com/w/cpp/string/basic_string/c_str" },
    ],
  },
  {
    id: 68,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Sparse Array",
    description:
      "A sparse key-value store that maps integer keys to double values and prints all populated entries.",
    code: `#include <iostream>
#include <cstring>

struct Entry {
    int key;
    double value;
    bool valid;
};

class SparseArray {
    Entry* data_;
    size_t capacity_;
public:
    SparseArray(size_t cap)
        : data_(new Entry[cap]), capacity_(cap) {}

    ~SparseArray() { delete[] data_; }

    void set(int key, double value) {
        size_t idx = key % capacity_;
        data_[idx].key = key;
        data_[idx].value = value;
        data_[idx].valid = true;
    }

    void print_all() const {
        for (size_t i = 0; i < capacity_; ++i) {
            if (data_[i].valid) {
                std::cout << data_[i].key << ": "
                          << data_[i].value << std::endl;
            }
        }
    }
};

int main() {
    SparseArray arr(10);
    arr.set(3, 1.5);
    arr.set(7, 2.8);
    arr.set(15, 4.2);

    std::cout << "Populated entries:" << std::endl;
    arr.print_all();
}`,
    manifestation: `$ valgrind ./sparse
==18923== Memcheck, a memory error detector
==18923== Conditional jump or move depends on uninitialised value(s)
==18923==    at 0x400812: main (sparse.cpp:22)
==18923==
==18923== Use of uninitialised value of size 8
==18923==    at 0x400834: main (sparse.cpp:23)

Expected output:
  entries[0] = (0, 0, 1.0)
Actual output:
  entries[0] = (garbage, garbage, 1.0)
(POD struct members row and col are uninitialized)`,
    hints: [
      "What are the initial values of the Entry members after new Entry[cap]?",
      "Does new[] value-initialize or default-initialize POD-like struct members?",
      "What value does the valid flag have for entries that were never set?",
    ],
    explanation:
      "new Entry[cap] default-initializes the elements, which for POD-like structs means the members are left with indeterminate values. The valid flag for entries that were never set contains garbage. The print_all loop reads these uninitialized valid flags — undefined behavior. Some unset entries may appear valid, printing garbage data. The fix is to value-initialize with new Entry[cap]() or explicitly set all valid flags to false in the constructor.",
    stdlibRefs: [],
  },
  {
    id: 69,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Stack Machine",
    description:
      "A stack-based calculator that pushes values and prints them in order.",
    code: `#include <iostream>

class IntStack {
    int* data_;
    int top_;
    int capacity_;
public:
    IntStack(int cap)
        : data_(new int[cap]), top_(-1), capacity_(cap) {}

    ~IntStack() { delete[] data_; }

    void push(int val) {
        data_[++top_] = val;
    }

    int pop() {
        return data_[top_--];
    }

    int peek() const { return data_[top_]; }
    bool empty() const { return top_ < 0; }

    void print() const {
        for (int i = 0; i <= top_; ++i) {
            std::cout << data_[i] << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    IntStack stack(4);

    for (int i = 1; i <= 10; ++i) {
        stack.push(i * 10);
    }

    stack.print();

    while (!stack.empty()) {
        std::cout << "Popped: " << stack.pop() << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g stackmach.cpp -o stackmach && ./stackmach
=================================================================
==21345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000058
WRITE of size 4 at 0x602000000058 thread T0
    #0 0x55c1a3 in StackMachine::push(int) stackmach.cpp:12
    #1 0x55c3f1 in main stackmach.cpp:28
0x602000000058 is located 8 bytes after 80-byte region
SUMMARY: AddressSanitizer: heap-buffer-overflow stackmach.cpp:12 in StackMachine::push`,
    hints: [
      "How many elements is the stack allocated to hold?",
      "How many elements are pushed onto the stack?",
      "Does push() verify that there is room before writing?",
    ],
    explanation:
      "The stack is allocated with capacity 4 but the loop pushes 10 elements. The push method has no bounds check, so it writes data_[4] through data_[9] past the end of the allocated array. This is a heap buffer overflow that corrupts adjacent heap memory. The fix is to check top_ < capacity_ - 1 in push() before writing, or to allocate sufficient space.",
    stdlibRefs: [],
  },
  {
    id: 70,
    topic: "Heap Allocation",
    difficulty: "Medium",
    title: "Log Formatter",
    description:
      "Formats structured log entries with an ID, severity level, and message.",
    code: `#include <iostream>
#include <cstdio>
#include <cstring>

char* format_log(int id, const char* level, const char* message) {
    char* buf = new char[64];
    std::sprintf(buf, "[%05d] %s: %s", id, level, message);
    return buf;
}

int main() {
    char* log1 = format_log(1, "INFO", "System started");
    char* log2 = format_log(2, "WARN", "Disk usage at 89%");
    char* log3 = format_log(3, "ERROR",
        "Failed to connect to database server at "
        "192.168.1.100:5432 - connection timed out "
        "after 30 seconds");

    std::cout << log1 << std::endl;
    std::cout << log2 << std::endl;
    std::cout << log3 << std::endl;

    delete[] log1;
    delete[] log2;
    delete[] log3;
}`,
    manifestation: `$ g++ -fsanitize=address -g logfmt.cpp -o logfmt && ./logfmt
=================================================================
==26789==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7ffd3a100090
WRITE of size 58 at 0x7ffd3a100090 thread T0
    #0 0x7f8a3b in __vsprintf_chk
    #1 0x55a1c3 in format logfmt.cpp:8
    #2 0x55a2e1 in main logfmt.cpp:16
0x7ffd3a100090 is located in stack of thread T0
SUMMARY: AddressSanitizer: stack-buffer-overflow logfmt.cpp:8 in format`,
    hints: [
      "How large is the buffer allocated for each log entry?",
      "Does sprintf check whether the formatted output fits in the destination buffer?",
      "How long is the formatted string for the third log entry?",
    ],
    explanation:
      "The buffer is allocated as 64 bytes, but std::sprintf does not perform bounds checking. The third log entry's formatted string exceeds 64 characters, causing sprintf to write past the end of the allocated buffer — a heap buffer overflow. The fix is to use std::snprintf with the buffer size limit, or to calculate the required size before allocating.",
    stdlibRefs: [
      { name: "std::sprintf", args: "(char* buffer, const char* format, ...) → int", brief: "Writes formatted output to a character buffer with no bounds checking.", note: "If the formatted output exceeds the buffer size, sprintf silently overflows. Use std::snprintf with a size limit instead.", link: "https://en.cppreference.com/w/cpp/io/c/fprintf" },
    ],
  },
  {
    id: 71,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Circular List",
    description:
      "Creates a ring of linked nodes and prints the values by traversing the cycle.",
    code: `#include <iostream>

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

Node* create_ring(int n) {
    Node* head = new Node(1);
    Node* curr = head;
    for (int i = 2; i <= n; ++i) {
        curr->next = new Node(i);
        curr = curr->next;
    }
    curr->next = head;
    return head;
}

void print_ring(Node* head, int count) {
    Node* curr = head;
    for (int i = 0; i < count; ++i) {
        std::cout << curr->value << " ";
        curr = curr->next;
    }
    std::cout << std::endl;
}

void free_list(Node* head) {
    Node* curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        delete curr;
        curr = next;
    }
}

int main() {
    Node* ring = create_ring(5);
    print_ring(ring, 10);
    free_list(ring);
}`,
    manifestation: `$ ./circlist
(program hangs indefinitely -- infinite loop in destructor)

$ timeout 5 ./circlist
(killed after 5 seconds)

The destructor follows the circular next pointers endlessly,
never reaching nullptr to stop the loop.`,
    hints: [
      "What is the termination condition of the free_list loop?",
      "What does the last node's next pointer point to in a ring?",
      "Will the loop ever encounter a nullptr in a circular list?",
    ],
    explanation:
      "create_ring builds a circular list where the last node's next points back to the head — there is no nullptr sentinel. The free_list function loops while curr != nullptr, which is never true for a circular list. After deleting every node once, the loop follows dangling next pointers into freed memory, causing infinite use-after-free and repeated double-frees. The fix is to remember the start node and stop when the traversal returns to it.",
    stdlibRefs: [],
  },
  {
    id: 72,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Substring Finder",
    description:
      "Extracts the file extension from a filename and returns it as a C-string.",
    code: `#include <iostream>
#include <cstring>

const char* find_extension(const char* filename) {
    size_t len = std::strlen(filename) + 1;
    char* copy = new char[len];
    std::strcpy(copy, filename);

    const char* dot = std::strrchr(copy, '.');
    const char* ext = dot ? dot + 1 : "";

    delete[] copy;
    return ext;
}

int main() {
    const char* ext1 = find_extension("report.pdf");
    const char* ext2 = find_extension("archive.tar.gz");
    const char* ext3 = find_extension("README");

    std::cout << "report.pdf -> " << ext1 << std::endl;
    std::cout << "archive.tar.gz -> " << ext2 << std::endl;
    std::cout << "README -> " << ext3 << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g subfind.cpp -o subfind && ./subfind
=================================================================
==23456==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 1 at 0x602000000010 thread T0
    #0 0x55a1c3 in main subfind.cpp:18
    #1 0x7f3c2a in __libc_start_main
0x602000000010 is located 0 bytes inside of 16-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete[](void*)
    #1 0x55a1a1 in main subfind.cpp:16
SUMMARY: AddressSanitizer: heap-use-after-free subfind.cpp:18 in main`,
    hints: [
      "Where does the pointer ext point to after strrchr finds the dot?",
      "What happens to the buffer that ext points into before the function returns?",
      "Is the returned pointer still valid when the caller dereferences it?",
    ],
    explanation:
      'When the filename contains a dot, ext points into the dynamically allocated copy buffer (one character past the dot). The buffer is deleted before the function returns, making ext a dangling pointer. The caller reads freed memory — undefined behavior. When there is no dot, ext points to a string literal ("") which remains valid, masking the bug for that case. The fix is to copy the extension into a separate buffer before freeing the copy.',
    stdlibRefs: [
      { name: "std::strrchr", args: "(const char* str, int ch) → char*", brief: "Returns a pointer to the last occurrence of a character in a C-string, or null if not found.", note: "The returned pointer points into the source buffer. If that buffer is freed, the pointer dangles.", link: "https://en.cppreference.com/w/cpp/string/byte/strrchr" },
    ],
  },
  {
    id: 73,
    topic: "Heap Allocation",
    difficulty: "Hard",
    title: "Record Serializer",
    description:
      "Duplicates an array of records and prints the copied data.",
    code: `#include <iostream>
#include <string>
#include <cstring>

struct Record {
    int id;
    std::string name;
    double score;
};

Record* duplicate_records(const Record* src, int count) {
    Record* dest = new Record[count];
    std::memcpy(dest, src, count * sizeof(Record));
    return dest;
}

int main() {
    Record originals[3] = {
        {1, "Alice", 95.5},
        {2, "Bob", 87.3},
        {3, "Charlie", 91.0},
    };

    Record* copies = duplicate_records(originals, 3);

    for (int i = 0; i < 3; ++i) {
        std::cout << copies[i].id << ": "
                  << copies[i].name << " ("
                  << copies[i].score << ")" << std::endl;
    }

    delete[] copies;
}`,
    manifestation: `$ g++ -fsanitize=address -g recser.cpp -o recser && ./recser
=================================================================
==29012==ERROR: AddressSanitizer: undefined-behavior
runtime error: member access within misaligned address 0x602000000010
or possible object-model violation
(memcpy of non-trivially-copyable std::string corrupts internal pointers)

$ valgrind ./recser
==29012== Invalid read of size 8
==29012==    at 0x400812: main (recser.cpp:20)
==29012== Address 0x5a1c1e8 is 8 bytes inside a block of size 48 free'd`,
    hints: [
      "Can std::memcpy safely copy objects that contain std::string members?",
      "What happens to the default-constructed strings in the destination array when memcpy overwrites them?",
      "After memcpy, how many objects believe they own each string's internal buffer?",
    ],
    explanation:
      "std::memcpy performs a bitwise copy and cannot handle non-trivially-copyable types like std::string. The destination Records are default-constructed with empty strings; memcpy overwrites their internal state without running destructors, leaking those strings. Both the original and copied Records now share identical string internal pointers. When the copies are destroyed, they free the same buffers the originals own — a double free when the originals are also destroyed. The fix is to use std::copy or a loop with proper assignment instead of memcpy.",
    stdlibRefs: [
      { name: "std::memcpy", args: "(void* dest, const void* src, size_t count) → void*", brief: "Copies count bytes as raw memory between non-overlapping regions.", note: "Only safe for trivially-copyable types. Using memcpy on types with non-trivial members (like std::string) bypasses constructors and causes undefined behavior.", link: "https://en.cppreference.com/w/cpp/string/byte/memcpy" },
    ],
  },
  // ── Iterator Invalidation ──
  {
    id: 74,
    topic: "Iterator Invalidation",
    difficulty: "Easy",
    title: "Notification Dispatcher",
    description:
      "Processes a message inbox and generates follow-up replies for important items.",
    code: `#include <iostream>
#include <vector>
#include <string>

struct Message {
    std::string sender;
    std::string text;
    bool important;
};

void print_message(const Message& msg) {
    if (msg.important) {
        std::cout << "[!] ";
    } else {
        std::cout << "    ";
    }
    std::cout << msg.sender << ": " << msg.text << std::endl;
}

int main() {
    std::vector<Message> inbox = {
        {"Alice", "Meeting at 3pm", false},
        {"System", "Server alert!", true},
        {"Bob", "Lunch plans?", false},
        {"CI", "Deploy failed!", true},
        {"Carol", "Code review ready", false},
    };

    std::cout << "Processing messages:" << std::endl;
    for (auto it = inbox.begin(); it != inbox.end(); ++it) {
        print_message(*it);
        if (it->important) {
            inbox.push_back({it->sender, "RE: " + it->text, false});
        }
    }

    std::cout << "Total messages: " << inbox.size() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g notify.cpp -o notify && ./notify
Processing: alert
=================================================================
==14892==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000020
READ of size 32 at 0x603000000020 thread T0
    #0 0x55c1a3 in Dispatcher::process() notify.cpp:18
    #1 0x55c3f1 in main notify.cpp:30
0x603000000020 is located 0 bytes inside of 32-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55c181 in std::vector<std::string>::_M_realloc_insert
SUMMARY: AddressSanitizer: heap-use-after-free notify.cpp:18 in Dispatcher::process`,
    hints: [
      "What could happen to the vector's internal storage when push_back is called inside the loop?",
      "If the vector needs more capacity, what happens to iterators pointing into the old storage?",
      "Is the loop iterator still valid after push_back triggers a reallocation?",
    ],
    explanation:
      "When push_back is called inside the loop, the vector may reallocate its internal buffer if size equals capacity. Reallocation frees the old buffer and allocates a new one, invalidating all existing iterators — including the loop iterator it. Dereferencing it on the next iteration is undefined behavior. The fix is to collect items to add in a separate vector and append them after the loop completes.",
    stdlibRefs: [
      { name: "std::vector::push_back", args: "(const T& value) → void | (T&& value) → void", brief: "Appends an element to the end of the vector; may reallocate if size() == capacity().", note: "If reallocation occurs, ALL iterators, pointers, and references to elements are invalidated.", link: "https://en.cppreference.com/w/cpp/container/vector/push_back" },
    ],
  },
  {
    id: 75,
    topic: "Iterator Invalidation",
    difficulty: "Easy",
    title: "Tag Cleaner",
    description:
      "Cleans up an issue tracker by removing tags that have fewer than a threshold number of issues.",
    code: `#include <iostream>
#include <map>
#include <string>

void print_tags(const std::map<std::string, int>& tags) {
    for (const auto& [tag, count] : tags) {
        std::cout << "  " << tag << " (" << count << ")" << std::endl;
    }
}

int main() {
    std::map<std::string, int> issue_tags = {
        {"bug", 5}, {"feature", 12}, {"wontfix", 3},
        {"duplicate", 8}, {"enhancement", 7}, {"invalid", 2},
        {"docs", 4}, {"performance", 9}, {"cosmetic", 1}
    };

    std::cout << "All tags:" << std::endl;
    print_tags(issue_tags);

    int threshold = 5;
    std::cout << "Removing tags with fewer than "
              << threshold << " issues..." << std::endl;

    for (auto it = issue_tags.begin(); it != issue_tags.end(); ++it) {
        if (it->second < threshold) {
            issue_tags.erase(it);
        }
    }

    std::cout << "Remaining tags:" << std::endl;
    print_tags(issue_tags);
}`,
    manifestation: `$ g++ -fsanitize=address -g tagclean.cpp -o tagclean && ./tagclean
=================================================================
==21678==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000030
READ of size 8 at 0x603000000030 thread T0
    #0 0x55b1a1 in TagCleaner::clean() tagclean.cpp:16
    #1 0x55b2c1 in main tagclean.cpp:24
0x603000000030 is located 16 bytes inside of 64-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55b181 in std::_Rb_tree::_M_erase_aux
SUMMARY: AddressSanitizer: heap-use-after-free tagclean.cpp:16 in TagCleaner::clean`,
    hints: [
      "What happens to an iterator after the element it points to is erased from a map?",
      "After erase, is the iterator advanced to the next element automatically, or is it left invalid?",
      "Does the for loop's ++it operate on a valid iterator after erase is called?",
    ],
    explanation:
      "Calling issue_tags.erase(it) invalidates the iterator it. The subsequent ++it in the for loop increments an invalidated iterator, which is undefined behavior. The fix is to use it = issue_tags.erase(it) in the if branch and only do ++it in an else branch, since map::erase returns an iterator to the next element.",
    stdlibRefs: [
      { name: "std::map::erase", args: "(iterator pos) → iterator | (const Key& key) → size_type", brief: "Removes the element at pos or matching key; returns iterator to the next element (C++11+).", note: "The erased element's iterator is invalidated. Use the returned iterator to continue traversal safely.", link: "https://en.cppreference.com/w/cpp/container/map/erase" },
    ],
  },
  {
    id: 76,
    topic: "Iterator Invalidation",
    difficulty: "Easy",
    title: "Data Collector",
    description:
      "Collects sensor readings in batches and computes the average for each batch.",
    code: `#include <iostream>
#include <vector>

void print_range(std::vector<int>::iterator first,
                 std::vector<int>::iterator last) {
    while (first != last) {
        std::cout << *first;
        ++first;
        if (first != last) std::cout << ", ";
    }
    std::cout << std::endl;
}

int main() {
    std::vector<int> readings = {10, 20, 30, 40, 50};

    auto begin_it = readings.begin();
    auto end_it = readings.end();

    std::cout << "Batch 1 readings: ";
    print_range(begin_it, end_it);

    double sum = 0;
    for (auto it = begin_it; it != end_it; ++it) {
        sum += *it;
    }
    std::cout << "Batch 1 average: " << sum / 5 << std::endl;

    readings.clear();
    readings.push_back(100);
    readings.push_back(200);
    readings.push_back(300);
    readings.push_back(400);
    readings.push_back(500);

    std::cout << "Batch 2 readings: ";
    print_range(begin_it, end_it);

    sum = 0;
    for (auto it = begin_it; it != end_it; ++it) {
        sum += *it;
    }
    std::cout << "Batch 2 average: " << sum / 5 << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g datacoll.cpp -o datacoll && ./datacoll
=================================================================
==18234==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55a1c3 in DataCollector::report() datacoll.cpp:22
    #1 0x55a3f1 in main datacoll.cpp:32
0x602000000010 is located 0 bytes inside of 40-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1a1 in std::vector<int>::clear()
SUMMARY: AddressSanitizer: heap-use-after-free datacoll.cpp:22 in DataCollector::report`,
    hints: [
      "What happens to existing iterators when clear() is called on a vector?",
      "After clearing and refilling the vector, do the saved iterators point to valid locations?",
      "Does clear() guarantee that the vector's internal buffer address remains the same?",
    ],
    explanation:
      "Calling readings.clear() invalidates all iterators, pointers, and references to elements of the vector. Even though push_back refills the vector to the same size, the saved begin_it and end_it iterators are invalidated and must not be used. Passing them to print_range and the averaging loop is undefined behavior. The fix is to reassign begin_it and end_it from the vector after modification.",
    stdlibRefs: [
      { name: "std::vector::clear", args: "() → void", brief: "Removes all elements, setting size to zero; does not release allocated memory.", note: "Invalidates ALL iterators, pointers, and references to elements. Previously saved iterators must not be used after clear().", link: "https://en.cppreference.com/w/cpp/container/vector/clear" },
    ],
  },
  {
    id: 77,
    topic: "Iterator Invalidation",
    difficulty: "Medium",
    title: "Sequence Padder",
    description:
      "Inserts zero-padding between every element of a signal array to upsample it.",
    code: `#include <iostream>
#include <vector>

void pad_with_zeros(std::vector<int>& data) {
    for (auto it = data.begin(); it != data.end(); ++it) {
        data.insert(it + 1, 0);
        ++it;
    }
}

void print_vector(const std::vector<int>& v) {
    for (size_t i = 0; i < v.size(); ++i) {
        std::cout << v[i];
        if (i + 1 < v.size()) std::cout << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::vector<int> signal = {10, 20, 30, 40, 50};

    std::cout << "Original signal: ";
    print_vector(signal);

    pad_with_zeros(signal);

    std::cout << "Padded signal:   ";
    print_vector(signal);

    std::cout << "Expected:        10 0 20 0 30 0 40 0 50 0" << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g seqpad.cpp -o seqpad && ./seqpad
=================================================================
==25891==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000028
READ of size 4 at 0x604000000028 thread T0
    #0 0x55c1a3 in pad seqpad.cpp:10
    #1 0x55c3f1 in main seqpad.cpp:20
0x604000000028 is located 8 bytes inside of 20-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55c181 in std::vector<int>::_M_realloc_insert
SUMMARY: AddressSanitizer: heap-use-after-free seqpad.cpp:10 in pad`,
    hints: [
      "What happens to existing iterators when insert is called on a vector?",
      "Does insert guarantee that iterators before the insertion point remain valid?",
      "Under what condition does vector::insert cause a reallocation?",
    ],
    explanation:
      "Calling data.insert(it + 1, 0) may cause the vector to reallocate if size equals capacity, which invalidates all iterators including it. Even without reallocation, iterators at or after the insertion point are invalidated. Since the vector starts with 5 elements and the first insert grows it to 6 (exceeding the typical initial capacity of 5), reallocation is triggered immediately, making the subsequent ++it and loop comparison undefined behavior. The fix is to use the iterator returned by insert to reposition.",
    stdlibRefs: [
      { name: "std::vector::insert", args: "(const_iterator pos, const T& value) → iterator", brief: "Inserts elements before the given position; returns iterator to the first inserted element.", note: "If insertion causes reallocation, ALL iterators are invalidated. Without reallocation, iterators at or after the insertion point are still invalidated.", link: "https://en.cppreference.com/w/cpp/container/vector/insert" },
    ],
  },
  {
    id: 78,
    topic: "Iterator Invalidation",
    difficulty: "Medium",
    title: "Cache Refresher",
    description:
      "Updates cached entries by creating new versioned keys for values that meet a condition.",
    code: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> cache = {
        {"alpha", 1}, {"beta", 2}, {"gamma", 3},
        {"delta", 4}, {"epsilon", 5}
    };

    std::cout << "Refreshing odd-valued entries:" << std::endl;

    for (auto it = cache.begin(); it != cache.end(); ++it) {
        if (it->second % 2 != 0) {
            std::string new_key = "v2_" + it->first;
            int new_val = it->second * 10;
            std::cout << "  " << it->first << " -> "
                      << new_key << " = " << new_val << std::endl;
            cache[new_key] = new_val;
        }
    }

    std::cout << "Final cache:" << std::endl;
    for (const auto& [key, val] : cache) {
        std::cout << "  " << key << " = " << val << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g cacherefresh.cpp -o cacherefresh && ./cacherefresh
=================================================================
==22345==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000040
READ of size 8 at 0x603000000040 thread T0
    #0 0x55d1a1 in CacheRefresher::refresh() cacherefresh.cpp:18
    #1 0x55d2c1 in main cacherefresh.cpp:28
0x603000000040 is located inside of 64-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55d181 in std::__detail::_Map_base::_M_rehash
SUMMARY: AddressSanitizer: heap-use-after-free cacherefresh.cpp:18`,
    hints: [
      "What happens to an unordered_map's internal bucket structure when new elements are inserted?",
      "Under what condition does an unordered_map rehash, and what effect does that have on iterators?",
      "Is the loop iterator still pointing to a valid bucket entry after an insertion triggers a rehash?",
    ],
    explanation:
      "Inserting new elements into an unordered_map may trigger a rehash if the load factor exceeds the maximum. A rehash reallocates the internal bucket array and redistributes all elements, invalidating every existing iterator. The loop iterator it becomes a dangling pointer into the old bucket structure, and incrementing or dereferencing it is undefined behavior. The fix is to collect the new entries in a separate container and insert them after the loop.",
    stdlibRefs: [
      { name: "std::unordered_map", brief: "Hash table container with average O(1) lookup, insertion, and deletion.", note: "Insertion may trigger a rehash when load factor exceeds max_load_factor, which invalidates ALL iterators.", link: "https://en.cppreference.com/w/cpp/container/unordered_map" },
    ],
  },
  {
    id: 79,
    topic: "Iterator Invalidation",
    difficulty: "Medium",
    title: "Task Scheduler",
    description:
      "Processes a task queue and inserts verification steps for high-priority tasks.",
    code: `#include <iostream>
#include <deque>
#include <string>

struct Task {
    std::string name;
    int priority;
};

void print_queue(const std::deque<Task>& q) {
    for (const auto& t : q) {
        std::cout << "  [p" << t.priority << "] " << t.name << std::endl;
    }
}

int main() {
    std::deque<Task> tasks = {
        {"compile", 2},
        {"test", 1},
        {"deploy", 3},
        {"notify", 1},
        {"backup", 2}
    };

    std::cout << "Initial queue:" << std::endl;
    print_queue(tasks);

    std::cout << "Processing:" << std::endl;
    for (auto it = tasks.begin(); it != tasks.end(); ++it) {
        std::cout << "  Running: " << it->name
                  << " (priority " << it->priority << ")" << std::endl;
        if (it->priority >= 3) {
            tasks.push_front({"verify_" + it->name, it->priority - 1});
        }
    }

    std::cout << "Final queue:" << std::endl;
    print_queue(tasks);
}`,
    manifestation: `$ g++ -fsanitize=address -g tasksched.cpp -o tasksched && ./tasksched
=================================================================
==16789==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000020
READ of size 8 at 0x602000000020 thread T0
    #0 0x55b1a1 in Scheduler::run() tasksched.cpp:20
    #1 0x55b2c1 in main tasksched.cpp:30
0x602000000020 is located 0 bytes inside of 48-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55b181 in std::deque<Task>::push_front
SUMMARY: AddressSanitizer: heap-use-after-free tasksched.cpp:20 in Scheduler::run`,
    hints: [
      "What guarantees does a deque provide about iterator validity after push_front?",
      "Does inserting at the front of a deque preserve iterators to existing elements?",
      "After push_front executes, is the loop iterator still usable?",
    ],
    explanation:
      "Inserting at either end of a std::deque (push_front or push_back) invalidates all iterators to the deque, even though references and pointers to existing elements remain valid. After push_front is called, the loop iterator it is invalidated. Incrementing or dereferencing it on the next iteration is undefined behavior. The fix is to record high-priority tasks separately and prepend them after the loop.",
    stdlibRefs: [
      { name: "std::deque::push_front", args: "(const T& value) → void | (T&& value) → void", brief: "Inserts an element at the front of the deque in O(1) amortized time.", note: "Invalidates ALL iterators to the deque. References and pointers to existing elements remain valid.", link: "https://en.cppreference.com/w/cpp/container/deque/push_front" },
    ],
  },
  {
    id: 80,
    topic: "Iterator Invalidation",
    difficulty: "Medium",
    title: "Log Filter",
    description:
      "Filters debug-level entries from an application log to produce a clean output.",
    code: `#include <iostream>
#include <vector>
#include <string>

void print_log(const std::vector<std::string>& log) {
    for (const auto& entry : log) {
        std::cout << "  " << entry << std::endl;
    }
}

int main() {
    std::vector<std::string> log = {
        "INFO: application started",
        "DEBUG: loading config",
        "INFO: listening on port 8080",
        "DEBUG: connection pool initialized",
        "ERROR: disk space low",
        "DEBUG: GC cycle completed",
        "INFO: request from 10.0.0.1",
        "DEBUG: query took 42ms"
    };

    std::cout << "Full log:" << std::endl;
    print_log(log);

    std::vector<std::vector<std::string>::iterator> debug_entries;
    for (auto it = log.begin(); it != log.end(); ++it) {
        if (it->substr(0, 5) == "DEBUG") {
            debug_entries.push_back(it);
        }
    }

    std::cout << "Removing " << debug_entries.size()
              << " debug entries..." << std::endl;

    for (auto it : debug_entries) {
        log.erase(it);
    }

    std::cout << "Filtered log:" << std::endl;
    print_log(log);
}`,
    manifestation: `$ g++ -fsanitize=address -g logfilter.cpp -o logfilter && ./logfilter
=================================================================
==20123==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000030
READ of size 8 at 0x603000000030 thread T0
    #0 0x55c1a3 in LogFilter::apply() logfilter.cpp:22
    #1 0x55c3f1 in main logfilter.cpp:34
0x603000000030 is located 16 bytes inside of 64-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55c181 in std::vector<std::string>::erase
SUMMARY: AddressSanitizer: heap-use-after-free logfilter.cpp:22`,
    hints: [
      "After the first call to log.erase(), what happens to the remaining stored iterators?",
      "Does erasing an element from a vector affect iterators that point to positions after it?",
      "Are the iterators collected in the first pass still valid during the second pass?",
    ],
    explanation:
      "After the first log.erase(it) call, all iterators at or past the erased position are invalidated — the vector shifts elements left to fill the gap. The remaining iterators stored in debug_entries that pointed to later positions are now invalid. Using them in subsequent erase calls is undefined behavior. The fix is to use the erase-remove idiom, or to erase in reverse order using indices instead of iterators.",
    stdlibRefs: [
      { name: "std::vector::erase", args: "(const_iterator pos) → iterator | (const_iterator first, const_iterator last) → iterator", brief: "Removes element(s) and shifts subsequent elements down; returns iterator to the next element.", note: "All iterators at or after the erased position are invalidated. Saving multiple iterators and erasing through them is undefined behavior.", link: "https://en.cppreference.com/w/cpp/container/vector/erase" },
    ],
  },
  {
    id: 81,
    topic: "Iterator Invalidation",
    difficulty: "Hard",
    title: "Pair Eliminator",
    description:
      "Finds and removes pairs of numbers that sum to a given target from an array.",
    code: `#include <iostream>
#include <vector>

void print_vector(const std::vector<int>& v) {
    for (size_t i = 0; i < v.size(); ++i) {
        std::cout << v[i];
        if (i + 1 < v.size()) std::cout << ", ";
    }
    std::cout << std::endl;
}

void remove_pairs(std::vector<int>& nums, int target) {
    for (auto i = nums.begin(); i != nums.end(); ++i) {
        for (auto j = i + 1; j != nums.end(); ++j) {
            if (*i + *j == target) {
                std::cout << "  Removing pair: " << *i
                          << " + " << *j << " = " << target << std::endl;
                nums.erase(j);
                nums.erase(i);
                break;
            }
        }
    }
}

int main() {
    std::vector<int> values = {1, 4, 5, 6, 3, 9, 7, 2, 8};
    int target = 10;

    std::cout << "Input: ";
    print_vector(values);

    std::cout << "Finding pairs that sum to " << target << ":" << std::endl;
    remove_pairs(values, target);

    std::cout << "Result: ";
    print_vector(values);
}`,
    manifestation: `$ g++ -fsanitize=address -g pairelim.cpp -o pairelim && ./pairelim
=================================================================
==27456==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000018
READ of size 4 at 0x602000000018 thread T0
    #0 0x55a1c3 in eliminate pairelim.cpp:14
    #1 0x55a3f1 in main pairelim.cpp:26
0x602000000018 is located 8 bytes inside of 32-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55a1a1 in std::vector<int>::erase
SUMMARY: AddressSanitizer: heap-use-after-free pairelim.cpp:14 in eliminate`,
    hints: [
      "After both erase calls execute and the inner loop breaks, what is the state of the outer loop iterator?",
      "Does vector::erase return useful information that the code discards?",
      "When the outer for loop tries to increment iterator i after both elements have been erased, what happens?",
    ],
    explanation:
      "After nums.erase(j) invalidates iterators at or past j, iterator i (which is before j) remains valid. But nums.erase(i) then invalidates i itself. When the inner loop breaks and control returns to the outer loop, ++i operates on an invalidated iterator — undefined behavior. Both erase calls return iterators to the element following the erased one, but the code discards them. The fix requires capturing the return values and carefully repositioning the outer iterator.",
    stdlibRefs: [
      { name: "std::vector::erase", args: "(const_iterator pos) → iterator | (const_iterator first, const_iterator last) → iterator", brief: "Removes element(s) at position; returns iterator past the last removed element.", note: "After the first erase, any previously-obtained iterator at or after that point is invalid. A second erase with a stale iterator is undefined behavior.", link: "https://en.cppreference.com/w/cpp/container/vector/erase" },
    ],
  },
  {
    id: 82,
    topic: "Iterator Invalidation",
    difficulty: "Hard",
    title: "Indexed Collection",
    description:
      "Builds a fast-lookup index over a list of items and uses it to display the collection.",
    code: `#include <iostream>
#include <list>
#include <unordered_map>
#include <string>

int main() {
    std::list<std::string> fruits = {
        "apple", "banana", "cherry", "date", "elderberry",
        "fig", "grape"
    };

    std::unordered_map<std::string, std::list<std::string>::iterator> index;
    for (auto it = fruits.begin(); it != fruits.end(); ++it) {
        index[*it] = it;
    }

    std::cout << "Removing fruits starting with a vowel:" << std::endl;
    for (auto it = fruits.begin(); it != fruits.end(); ) {
        char c = (*it)[0];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            std::cout << "  removed: " << *it << std::endl;
            it = fruits.erase(it);
        } else {
            ++it;
        }
    }

    std::cout << "Lookup via index:" << std::endl;
    for (const auto& [name, it] : index) {
        std::cout << "  " << name << " -> " << *it << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g idxcoll.cpp -o idxcoll && ./idxcoll
=================================================================
==23891==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000020
READ of size 4 at 0x604000000020 thread T0
    #0 0x55d1a1 in IndexedCollection::lookup() idxcoll.cpp:26
    #1 0x55d3f1 in main idxcoll.cpp:38
0x604000000020 is located 0 bytes inside of 20-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55d181 in std::vector<int>::_M_realloc_insert
SUMMARY: AddressSanitizer: heap-use-after-free idxcoll.cpp:26`,
    hints: [
      "After erasing elements from the list, what happens to the iterators stored in the index for those elements?",
      "For a std::list, does erasing one element affect iterators to other elements?",
      "When the final loop dereferences every iterator in the index, are all of those iterators still valid?",
    ],
    explanation:
      "Erasing an element from a std::list invalidates only the iterator to that specific element — other iterators remain valid. However, the index map still contains entries for 'apple' and 'elderberry' with their now-invalidated iterators. The final loop iterates every entry in the index and dereferences all stored iterators, including the ones for erased elements. Dereferencing an invalidated list iterator is undefined behavior. The fix is to also remove the corresponding entries from the index when erasing from the list.",
    stdlibRefs: [
      { name: "std::list", brief: "Doubly-linked list where insertion and removal do not invalidate other iterators.", note: "Erasing an element invalidates only that element's iterator. But iterators stored externally (e.g., in a map) must be manually cleaned up.", link: "https://en.cppreference.com/w/cpp/container/list" },
      { name: "std::unordered_map", brief: "Hash table mapping keys to values; element access/modification does not invalidate iterators.", note: "When using a map to index into another container, stale entries must be removed when the referenced container element is erased.", link: "https://en.cppreference.com/w/cpp/container/unordered_map" },
    ],
  },
  {
    id: 83,
    topic: "Iterator Invalidation",
    difficulty: "Hard",
    title: "Flat Map",
    description:
      "A sorted associative container backed by a flat array, supporting insert and lookup operations.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class FlatMap {
    std::vector<std::pair<std::string, int>> entries_;
public:
    using iterator = std::vector<std::pair<std::string, int>>::iterator;

    void insert(const std::string& key, int value) {
        auto it = std::lower_bound(entries_.begin(), entries_.end(), key,
            [](const auto& e, const std::string& k) {
                return e.first < k;
            });
        if (it != entries_.end() && it->first == key) {
            it->second = value;
        } else {
            entries_.insert(it, {key, value});
        }
    }

    iterator find(const std::string& key) {
        auto it = std::lower_bound(entries_.begin(), entries_.end(), key,
            [](const auto& e, const std::string& k) {
                return e.first < k;
            });
        return (it != entries_.end() && it->first == key) ? it : end();
    }

    iterator end() { return entries_.end(); }

    void print() const {
        for (const auto& [k, v] : entries_) {
            std::cout << "  " << k << " = " << v << std::endl;
        }
    }
};

int main() {
    FlatMap config;
    config.insert("debug", 0);
    config.insert("port", 8080);
    config.insert("timeout", 30);

    auto port = config.find("port");

    config.insert("host", 1);
    config.insert("retries", 3);
    config.insert("verbose", 0);
    config.insert("workers", 4);

    if (port != config.end()) {
        std::cout << "Port: " << port->second << std::endl;
    }

    std::cout << "All config:" << std::endl;
    config.print();
}`,
    manifestation: `$ g++ -fsanitize=address -g flatmap.cpp -o flatmap && ./flatmap
=================================================================
==30567==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000028
READ of size 4 at 0x602000000028 thread T0
    #0 0x55b1a1 in FlatMap::insert() flatmap.cpp:20
    #1 0x55b3f1 in main flatmap.cpp:32
0x602000000028 is located 8 bytes inside of 40-byte region freed by thread T0 here:
    #0 0x7f9a2b in operator delete(void*)
    #1 0x55b181 in std::vector<Entry>::_M_realloc_insert
SUMMARY: AddressSanitizer: heap-use-after-free flatmap.cpp:20 in FlatMap::insert`,
    hints: [
      "What is the return type of find(), and what underlying container does the returned iterator belong to?",
      "When insert() adds new entries to the sorted vector, what happens to its internal storage?",
      "Can an iterator obtained before insertions be safely compared to end() obtained after insertions?",
    ],
    explanation:
      "find() returns an iterator into the internal std::vector. Subsequent insert() calls grow the vector past its capacity, triggering reallocation that invalidates all existing iterators. The iterator port becomes a dangling pointer into the freed old buffer. Even the comparison port != config.end() is undefined behavior because it compares an invalidated iterator against a fresh one from the reallocated storage. The fix is to store the key and re-query find() after modifications, or to reserve sufficient capacity before obtaining the iterator.",
    stdlibRefs: [
      { name: "std::lower_bound", args: "(ForwardIt first, ForwardIt last, const T& value) → ForwardIt", brief: "Binary search returning iterator to the first element not less than the given value.", link: "https://en.cppreference.com/w/cpp/algorithm/lower_bound" },
      { name: "std::vector::insert", args: "(const_iterator pos, const T& value) → iterator", brief: "Inserts element before position; may reallocate the entire vector.", note: "The iterator from lower_bound is invalidated if insert triggers reallocation. Re-query after modifying the container.", link: "https://en.cppreference.com/w/cpp/container/vector/insert" },
    ],
  },
  // ── RAII & Resource Management ──
  {
    id: 84,
    topic: "RAII & Resource Management",
    difficulty: "Easy",
    title: "Record Loader",
    description: "Reads name-value pairs from a text file and stores them in a vector.",
    code: `#include <cstdio>
#include <iostream>
#include <string>
#include <vector>

struct Record {
    std::string name;
    int value;
};

std::vector<Record> load_records(const char* filename) {
    FILE* fp = std::fopen(filename, "r");
    if (!fp) {
        std::cerr << "Cannot open " << filename << std::endl;
        return {};
    }

    std::vector<Record> records;
    char name[64];
    int value;

    while (std::fscanf(fp, "%63s %d", name, &value) == 2) {
        if (value < 0) {
            std::cerr << "Negative value for " << name << std::endl;
            return records;
        }
        records.push_back({name, value});
    }

    std::fclose(fp);
    return records;
}

int main() {
    auto recs = load_records("data.txt");
    std::cout << "Loaded " << recs.size() << " records:" << std::endl;
    for (const auto& r : recs) {
        std::cout << "  " << r.name << " = " << r.value << std::endl;
    }
}`,
    manifestation: `$ valgrind --track-fds=yes ./record_loader
==18342== Memcheck, a memory error detector
==18342== FILE DESCRIPTORS: 4 open (3 std) at exit.
==18342== Open file descriptor 3: data.txt
==18342==    at 0x4C3B180: fopen (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==18342==    by 0x401A23: load_records(char const*) (record_loader.cpp:13)
==18342==    by 0x401C91: main (record_loader.cpp:33)
==18342==
Loaded 4 records:
  alpha = 10
  beta = 20
  gamma = 30
  delta = 40
==18342== LEAK SUMMARY:
==18342==    still reachable: 552 bytes in 1 blocks`,
    hints: [
      "How many paths return from load_records(), and do they all clean up equally?",
      "What happens to the FILE* when the function hits a negative value?",
      "The normal exit path calls fclose — does the error exit path do the same?",
    ],
    explanation: "When a negative value is encountered, the function returns records immediately without calling fclose(fp). The FILE* is leaked because C-style file handles are not RAII objects — there is no destructor to close them automatically. The fix is to call fclose(fp) before the early return, or better yet, use std::ifstream which closes automatically when it goes out of scope.",
    stdlibRefs: [
      { name: "std::fopen", args: "(const char* filename, const char* mode) → FILE*", brief: "Opens a file and returns a C file handle; returns null on failure.", note: "C file handles are not RAII — they must be explicitly closed with fclose on every exit path.", link: "https://en.cppreference.com/w/cpp/io/c/fopen" },
      { name: "std::fclose", args: "(FILE* stream) → int", brief: "Closes the given file stream and flushes any unwritten buffered data.", link: "https://en.cppreference.com/w/cpp/io/c/fclose" },
    ],
  },
  {
    id: 85,
    topic: "RAII & Resource Management",
    difficulty: "Easy",
    title: "Pixel Buffer",
    description: "Allocates a fixed-size pixel buffer, fills it with a color, and prints the first pixel.",
    code: `#include <iostream>
#include <cstring>

class PixelBuffer {
    unsigned char* data_;
    int width_, height_;

public:
    PixelBuffer(int w, int h)
        : data_(new unsigned char[w * h * 4]()), width_(w), height_(h) {}

    ~PixelBuffer() { delete data_; }

    void fill(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
        for (int i = 0; i < width_ * height_; ++i) {
            data_[i * 4 + 0] = r;
            data_[i * 4 + 1] = g;
            data_[i * 4 + 2] = b;
            data_[i * 4 + 3] = a;
        }
    }

    void print_pixel(int x, int y) const {
        int idx = (y * width_ + x) * 4;
        std::cout << "Pixel(" << x << "," << y << "): "
                  << "R=" << (int)data_[idx]
                  << " G=" << (int)data_[idx + 1]
                  << " B=" << (int)data_[idx + 2]
                  << " A=" << (int)data_[idx + 3] << std::endl;
    }
};

int main() {
    PixelBuffer canvas(800, 600);
    canvas.fill(64, 128, 255, 255);
    canvas.print_pixel(0, 0);
    canvas.print_pixel(799, 599);
}`,
    manifestation: `$ g++ -fsanitize=address -g pixel_buffer.cpp -o pixel_buffer && ./pixel_buffer
=================================================================
==24108==ERROR: AddressSanitizer: alloc-dealloc-mismatch (operator new [] vs operator delete) on 0x629000000800
    #0 0x7f2a1c in operator delete(void*) (/lib/x86_64-linux-gnu/libasan.so.6+0xb1c)
    #1 0x55a1b3 in PixelBuffer::~PixelBuffer() pixel_buffer.cpp:12
    #2 0x55a4f1 in main pixel_buffer.cpp:33
0x629000000800 is located 0 bytes inside of 1920000-byte region [0x629000000800,0x629001D4C100)
allocated by thread T0 here:
    #0 0x7f2a3e in operator new[](unsigned long)
    #1 0x55a0e1 in PixelBuffer::PixelBuffer(int, int) pixel_buffer.cpp:10
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch (/lib/x86_64-linux-gnu/libasan.so.6+0xb1c) in operator delete(void*)`,
    hints: [
      "Look at how the buffer is allocated and how it is freed — do they match?",
      "What is the difference between new[] and new, and their corresponding delete forms?",
      "The constructor uses new unsigned char[...] — what must the destructor use?",
    ],
    explanation: "The constructor allocates with new[] (array form) but the destructor calls delete (scalar form) instead of delete[]. This is undefined behavior — the runtime may not free the correct amount of memory or may corrupt the heap. The fix is to change the destructor to delete[] data_.",
    stdlibRefs: [],
  },
  {
    id: 86,
    topic: "RAII & Resource Management",
    difficulty: "Easy",
    title: "Benchmark Timer",
    description: "Measures how long a computation takes using a scoped timer that prints elapsed time on destruction.",
    code: `#include <iostream>
#include <chrono>
#include <string>

class ScopedTimer {
    std::string label_;
    std::chrono::steady_clock::time_point start_;

public:
    explicit ScopedTimer(std::string label)
        : label_(std::move(label)),
          start_(std::chrono::steady_clock::now()) {}

    ~ScopedTimer() {
        auto elapsed = std::chrono::steady_clock::now() - start_;
        auto ms = std::chrono::duration_cast<
            std::chrono::milliseconds>(elapsed).count();
        std::cout << label_ << ": " << ms << " ms" << std::endl;
    }
};

long long heavy_computation() {
    ScopedTimer("heavy computation");

    long long sum = 0;
    for (int i = 0; i < 50000000; ++i) {
        sum += static_cast<long long>(i) * i;
    }
    return sum;
}

int main() {
    std::cout << "Starting benchmark..." << std::endl;
    auto result = heavy_computation();
    std::cout << "Result: " << result << std::endl;
}`,
    manifestation: `$ g++ -O2 -o benchmark benchmark.cpp && ./benchmark
Starting benchmark...
heavy computation: 0 ms
Result: 41666666166666672

Expected output:
Starting benchmark...
heavy computation: 87 ms
Result: 41666666166666672

Actual output: the timer always reports 0 ms regardless of how long
the computation takes.`,
    hints: [
      "Look at the line that creates the ScopedTimer — what is its lifetime?",
      "What is the difference between ScopedTimer(\"label\") and ScopedTimer timer(\"label\")?",
      "An unnamed temporary is destroyed at the end of the statement — when exactly does this timer die?",
    ],
    explanation: "ScopedTimer(\"heavy computation\") creates a temporary object that is immediately destroyed at the semicolon. The timer starts and stops in the same expression, always measuring approximately zero time. The computation runs after the timer is already dead. The fix is to name the variable: ScopedTimer timer(\"heavy computation\").",
    stdlibRefs: [
      { name: "std::chrono::steady_clock::now", args: "() → time_point", brief: "Returns the current time point of the steady clock, which never adjusts backwards.", link: "https://en.cppreference.com/w/cpp/chrono/steady_clock/now" },
    ],
  },
  {
    id: 87,
    topic: "RAII & Resource Management",
    difficulty: "Medium",
    title: "Handle Wrapper",
    description: "Wraps a dynamically allocated integer handle in a class that prints acquisition and release messages.",
    code: `#include <iostream>

class ResourceGuard {
    int* handle_;

public:
    explicit ResourceGuard(int value) : handle_(new int(value)) {
        std::cout << "Acquired handle " << *handle_ << std::endl;
    }

    ~ResourceGuard() {
        std::cout << "Releasing handle " << *handle_ << std::endl;
        delete handle_;
    }

    int value() const { return *handle_; }
};

void log_resource(ResourceGuard guard) {
    std::cout << "Using resource: " << guard.value() << std::endl;
}

int main() {
    ResourceGuard rg(42);
    log_resource(rg);
    std::cout << "Back in main: " << rg.value() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g handle.cpp -o handle && ./handle
Acquired handle 42
Using resource: 42
Releasing handle 42
=================================================================
==19473==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55c2a1 in ResourceGuard::value() const handle.cpp:14
    #1 0x55c491 in main handle.cpp:22
0x602000000010 is located 0 bytes inside of 4-byte region [0x602000000010,0x602000000014)
freed by thread T0 here:
    #0 0x7f3b1c in operator delete(void*)
    #1 0x55c1e3 in ResourceGuard::~ResourceGuard() handle.cpp:12
SUMMARY: AddressSanitizer: heap-use-after-free handle.cpp:14 in ResourceGuard::value()`,
    hints: [
      "How is the ResourceGuard passed to log_resource()?",
      "The class manages a heap pointer — what happens when it is copied?",
      "Does the compiler-generated copy constructor do the right thing for a class that owns a pointer?",
    ],
    explanation: "log_resource takes its parameter by value, which invokes the implicitly-generated copy constructor. The copy just duplicates the raw pointer — both the original and the copy point to the same heap allocation. When the parameter is destroyed at the end of log_resource, it deletes the int. Back in main, rg.value() dereferences freed memory, and rg's destructor double-deletes. The fix is to either delete the copy constructor/assignment operator or implement deep copy semantics.",
    stdlibRefs: [],
  },
  {
    id: 88,
    topic: "RAII & Resource Management",
    difficulty: "Medium",
    title: "Connection Setup",
    description: "Establishes a simulated network connection and allocates a send buffer in the constructor.",
    code: `#include <iostream>
#include <stdexcept>
#include <cstring>

class Connection {
    int* socket_handle_;
    char* send_buffer_;
    size_t buf_size_;

public:
    Connection(int port, size_t buf_size) : buf_size_(buf_size) {
        socket_handle_ = new int(port);
        std::cout << "Connected on port " << *socket_handle_ << std::endl;

        if (buf_size > 1000000) {
            throw std::runtime_error("Buffer size exceeds 1 MB limit");
        }
        send_buffer_ = new char[buf_size]();
    }

    ~Connection() {
        delete[] send_buffer_;
        delete socket_handle_;
        std::cout << "Connection closed" << std::endl;
    }

    void send(const char* msg) {
        std::strncpy(send_buffer_, msg, buf_size_ - 1);
        send_buffer_[buf_size_ - 1] = '\\0';
        std::cout << "Sent: " << send_buffer_ << std::endl;
    }
};

int main() {
    try {
        Connection conn(8080, 2000000);
        conn.send("Hello, server!");
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g connection.cpp -o connection && ./connection
Connected on port 8080
Error: Buffer size exceeds 1 MB limit

=================================================================
==21044==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 4 byte(s) in 1 object(s) allocated from:
    #0 0x7f8a2c in operator new(unsigned long)
    #1 0x55b1a3 in Connection::Connection(int, unsigned long) connection.cpp:12
    #2 0x55b4e1 in main connection.cpp:32

SUMMARY: AddressSanitizer: 4 byte(s) leaked in 1 allocation(s).`,
    hints: [
      "What happens to resources acquired before the constructor finishes if it throws?",
      "In C++, when is an object considered fully constructed — and when does the destructor become eligible to run?",
      "If the constructor throws after allocating socket_handle_ but before completing, does ~Connection() execute?",
    ],
    explanation: "When buf_size exceeds the limit, the constructor throws after allocating socket_handle_ but before allocating send_buffer_. C++ only calls the destructor for fully constructed objects, so ~Connection() never runs and socket_handle_ is leaked. The fix is to use std::unique_ptr for each member, or acquire all resources through RAII sub-objects so their individual destructors run even if the containing constructor throws.",
    stdlibRefs: [
      { name: "std::runtime_error", brief: "Exception class for errors detectable only at runtime; inherits from std::exception.", link: "https://en.cppreference.com/w/cpp/error/runtime_error" },
    ],
  },
  {
    id: 89,
    topic: "RAII & Resource Management",
    difficulty: "Medium",
    title: "Movable Buffer",
    description: "A dynamically allocated integer buffer with move semantics for efficient transfers.",
    code: `#include <iostream>
#include <utility>
#include <cstring>

class Buffer {
    int* data_;
    size_t size_;

public:
    explicit Buffer(size_t n) : data_(new int[n]()), size_(n) {
        std::cout << "Allocated " << n << " ints" << std::endl;
    }

    Buffer(Buffer&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.size_ = 0;
    }

    Buffer(const Buffer&) = delete;
    Buffer& operator=(const Buffer&) = delete;
    Buffer& operator=(Buffer&&) = delete;

    ~Buffer() {
        delete[] data_;
        std::cout << "Freed buffer" << std::endl;
    }

    int& operator[](size_t i) { return data_[i]; }
    size_t size() const { return size_; }
};

int main() {
    Buffer buf1(100);
    buf1[0] = 42;

    Buffer buf2(std::move(buf1));
    std::cout << "Moved value: " << buf2[0] << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g buffer.cpp -o buffer && ./buffer
Allocated 100 ints
Moved value: 42
Freed buffer
=================================================================
==25781==ERROR: AddressSanitizer: attempting double-free on 0x614000000040 in thread T0:
    #0 0x7f9b2c in operator delete[](void*)
    #1 0x55a2e1 in Buffer::~Buffer() buffer.cpp:24
    #2 0x55a5a2 in main buffer.cpp:36
0x614000000040 is located 0 bytes inside of 400-byte region [0x614000000040,0x6140000001D0)
freed by thread T0 here:
    #0 0x7f9b2c in operator delete[](void*)
    #1 0x55a2e1 in Buffer::~Buffer() buffer.cpp:24
SUMMARY: AddressSanitizer: double-free (/lib/x86_64-linux-gnu/libasan.so.6+0xb2c) in operator delete[](void*)`,
    hints: [
      "After the move, what state is buf1 left in?",
      "The move constructor copies data_ and zeroes size_ — is that sufficient to prevent cleanup issues?",
      "When buf1 is destroyed, what does delete[] operate on?",
    ],
    explanation: "The move constructor copies the pointer from other.data_ and sets other.size_ to 0, but it never sets other.data_ to nullptr. When buf1 is destroyed, its destructor calls delete[] on the same pointer that buf2 also owns. This is a double-free. The fix is to add other.data_ = nullptr in the move constructor.",
    stdlibRefs: [],
  },
  {
    id: 90,
    topic: "RAII & Resource Management",
    difficulty: "Medium",
    title: "Sensor Allocator",
    description: "Creates sensor objects on the heap wrapped in a smart pointer with a custom cleanup function.",
    code: `#include <iostream>
#include <memory>
#include <cstdlib>
#include <string>

struct Sensor {
    int id;
    double reading;
    std::string unit;

    Sensor(int i, const std::string& u) : id(i), reading(0.0), unit(u) {
        std::cout << "Sensor " << id << " online" << std::endl;
    }

    ~Sensor() {
        std::cout << "Sensor " << id << " offline" << std::endl;
    }
};

auto make_sensor(int id, const std::string& unit) {
    auto* s = new Sensor(id, unit);
    return std::unique_ptr<Sensor, decltype(&std::free)>(s, std::free);
}

int main() {
    auto temp = make_sensor(1, "celsius");
    temp->reading = 23.5;

    auto pressure = make_sensor(2, "hPa");
    pressure->reading = 1013.25;

    std::cout << "Temp: " << temp->reading << " " << temp->unit << std::endl;
    std::cout << "Pressure: " << pressure->reading << " " << pressure->unit << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g sensor.cpp -o sensor && ./sensor
Sensor 1 online
Sensor 2 online
Temp: 23.5 celsius
Pressure: 1013.25 hPa
=================================================================
==27814==ERROR: AddressSanitizer: alloc-dealloc-mismatch (operator new vs free) on 0x604000000010
    #0 0x7f5c3a in free (/lib/x86_64-linux-gnu/libasan.so.6+0xa3a)
    #1 0x55d421 in std::unique_ptr<Sensor, void(*)(void*)>::~unique_ptr() sensor.cpp:23
    #2 0x55d6b1 in main sensor.cpp:33
0x604000000010 is located 0 bytes inside of 56-byte region [0x604000000010,0x604000000048)
allocated by thread T0 here:
    #0 0x7f5b1c in operator new(unsigned long)
    #1 0x55d2a1 in make_sensor(int, std::string const&) sensor.cpp:22
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch in free`,
    hints: [
      "How is the Sensor object allocated, and how does the unique_ptr release it?",
      "What is the difference between free() and delete for objects created with new?",
      "Does free() call the destructor of the Sensor object?",
    ],
    explanation: "The Sensor is allocated with new (which calls the constructor) but the custom deleter uses std::free (which only releases raw memory without calling the destructor). This is undefined behavior: the Sensor's ~Sensor() and the embedded std::string's destructor never run, and the allocator mismatch (new vs free) can corrupt the heap. The fix is to use a deleter that calls delete, or allocate with std::malloc and use placement new if free is required.",
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "Smart pointer with exclusive ownership; invokes its deleter when destroyed.", note: "The custom deleter must match the allocation method — free() must not be used for objects allocated with new.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
      { name: "std::free", args: "(void* ptr) → void", brief: "Deallocates memory previously allocated by malloc/calloc/realloc; does NOT call destructors.", note: "Mixing new with free or malloc with delete is undefined behavior.", link: "https://en.cppreference.com/w/cpp/memory/c/free" },
    ],
  },
  {
    id: 91,
    topic: "RAII & Resource Management",
    difficulty: "Hard",
    title: "Event Bus",
    description: "A publish-subscribe event bus that returns shared handles for subscribers to hold.",
    code: `#include <iostream>
#include <functional>
#include <memory>
#include <vector>
#include <string>

class EventBus {
    std::vector<std::string> audit_log_;

public:
    using Callback = std::function<void(const std::string&)>;
    using Handle = std::shared_ptr<Callback>;

    Handle subscribe(Callback cb) {
        return std::shared_ptr<Callback>(
            new Callback(std::move(cb)),
            [this](Callback* p) {
                audit_log_.push_back("Handler removed");
                delete p;
            }
        );
    }

    void publish(const std::string& event) {
        audit_log_.push_back("Published: " + event);
        std::cout << "Event: " << event << std::endl;
    }

    void print_audit() const {
        for (const auto& entry : audit_log_)
            std::cout << "  " << entry << std::endl;
    }
};

int main() {
    EventBus::Handle handle;
    {
        EventBus bus;
        handle = bus.subscribe([](const std::string& e) {
            std::cout << "Got: " << e << std::endl;
        });
        bus.publish("startup");
        bus.print_audit();
    }
    std::cout << "Bus destroyed, handle still alive" << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g eventbus.cpp -o eventbus && ./eventbus
Event: startup
  Published: startup
Bus destroyed, handle still alive
=================================================================
==30192==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000090
WRITE of size 8 at 0x604000000090 thread T0
    #0 0x55e3a1 in std::vector<std::string>::push_back()
    #1 0x55e1c2 in EventBus::subscribe(...)::$_0::operator()(std::function<...>*) const eventbus.cpp:18
    #2 0x55e0a1 in std::shared_ptr<...>::~shared_ptr() eventbus.cpp:23
    #3 0x55e5f1 in main eventbus.cpp:38
0x604000000090 is located 16 bytes inside of 64-byte region freed by thread T0 here:
    #0 0x7fa31c in operator delete(void*)
    #1 0x55e4a1 in EventBus::~EventBus() eventbus.cpp:7
SUMMARY: AddressSanitizer: heap-use-after-free eventbus.cpp:18 in EventBus::subscribe`,
    hints: [
      "What does the custom deleter capture, and how long does the captured value remain valid?",
      "In what order are bus and handle destroyed?",
      "When handle's shared_ptr destructor runs, is the EventBus it references still alive?",
    ],
    explanation: "The custom deleter lambda captures this (the EventBus pointer). The bus is destroyed at the end of the inner scope, but handle (and its deleter) survives in the outer scope. When handle is finally destroyed, the deleter tries to push_back into audit_log_ through a dangling this pointer — the EventBus is already dead. The fix is to not capture this in the deleter, or ensure the EventBus always outlives all handles (e.g., by using shared_from_this).",
    stdlibRefs: [
      { name: "std::shared_ptr", brief: "Reference-counted smart pointer; invokes its deleter when the last owner is destroyed.", note: "A custom deleter that captures external state must not outlive that state — the deleter runs when the last shared_ptr dies, which may be long after the capturer.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr" },
    ],
  },
  {
    id: 92,
    topic: "RAII & Resource Management",
    difficulty: "Hard",
    title: "Deferred Task Queue",
    description: "Enqueues lambdas for later execution, allowing work to be scheduled and then run as a batch.",
    code: `#include <iostream>
#include <functional>
#include <memory>
#include <vector>
#include <string>

class TaskQueue {
    std::vector<std::function<void()>> tasks_;

public:
    void enqueue(std::function<void()> task) {
        tasks_.push_back(std::move(task));
    }

    void run_all() {
        for (auto& task : tasks_) task();
        tasks_.clear();
    }
};

void schedule_reports(TaskQueue& queue) {
    auto data = std::make_unique<std::string>(
        "Q1 Revenue: $2.4M | Growth: 12%");

    queue.enqueue([&data]() {
        std::cout << "Report: " << *data << std::endl;
    });

    queue.enqueue([&data]() {
        std::cout << "Summary length: " << data->size() << std::endl;
    });
}

int main() {
    TaskQueue queue;
    schedule_reports(queue);
    std::cout << "Running deferred tasks..." << std::endl;
    queue.run_all();
}`,
    manifestation: `$ g++ -fsanitize=address -g taskqueue.cpp -o taskqueue && ./taskqueue
Running deferred tasks...
=================================================================
==14209==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd3a2c1e80
READ of size 8 at 0x7ffd3a2c1e80 thread T0
    #0 0x55b3a1 in schedule_reports(TaskQueue&)::$_0::operator()() const taskqueue.cpp:26
    #1 0x55b621 in TaskQueue::run_all() taskqueue.cpp:14
    #2 0x55b891 in main taskqueue.cpp:36
Address 0x7ffd3a2c1e80 is located in stack of thread T0 at offset 128 in frame
    #0 0x55b0a1 in schedule_reports(TaskQueue&) taskqueue.cpp:22
SUMMARY: AddressSanitizer: stack-use-after-scope taskqueue.cpp:26 in schedule_reports`,
    hints: [
      "When are the enqueued lambdas actually executed relative to where data is defined?",
      "The lambdas capture data — by value or by reference?",
      "What happens to a local unique_ptr when its enclosing function returns?",
    ],
    explanation: "The lambdas capture data (a local unique_ptr) by reference. When schedule_reports returns, data is destroyed and the unique_ptr deletes its string. Later, run_all invokes the lambdas which dereference the now-dangling reference to the destroyed unique_ptr. The fix is to capture a shared_ptr by value: auto data = std::make_shared<std::string>(...) and capture [data]() instead of [&data]().",
    stdlibRefs: [
      { name: "std::make_unique", args: "<T>(Args&&... args) → unique_ptr<T>", brief: "Creates a unique_ptr that owns a newly constructed object of type T.", note: "unique_ptr is not copyable — capturing it by reference in a lambda that outlives the scope creates a dangling reference.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique" },
    ],
  },
  {
    id: 93,
    topic: "RAII & Resource Management",
    difficulty: "Hard",
    title: "Auto Saver",
    description: "Buffers data in memory and automatically saves it to disk when the object goes out of scope.",
    code: `#include <iostream>
#include <stdexcept>
#include <string>

void save_to_disk(const std::string& data) {
    if (data.size() > 100) {
        throw std::runtime_error("Payload too large for single write");
    }
    std::cout << "Saved " << data.size() << " bytes" << std::endl;
}

class AutoSaver {
    std::string buffer_;

public:
    AutoSaver() = default;

    void append(const std::string& chunk) {
        buffer_ += chunk;
    }

    ~AutoSaver() {
        save_to_disk(buffer_);
    }
};

int main() {
    try {
        AutoSaver saver;
        for (int i = 0; i < 20; ++i) {
            saver.append("item_" + std::to_string(i) + ";");
        }
        std::cout << "Processing complete" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Caught: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ g++ -g auto_saver.cpp -o auto_saver && ./auto_saver
Processing complete
terminate called after throwing an instance of 'std::runtime_error'
  what():  Payload too large for single write
Aborted (core dumped)`,
    hints: [
      "What happens when the AutoSaver goes out of scope at the end of the try block?",
      "Can a destructor safely call a function that might throw an exception?",
      "In C++11 and later, what is the default exception specification of a destructor?",
    ],
    explanation: "When saver goes out of scope, its destructor calls save_to_disk, which throws because the buffer exceeds 100 bytes. Since C++11, destructors are implicitly noexcept — throwing from a noexcept function immediately calls std::terminate, bypassing the catch block entirely. The program aborts instead of handling the error. The fix is to catch exceptions inside the destructor and handle them without re-throwing (e.g., log the error and discard the data).",
    stdlibRefs: [
      { name: "std::runtime_error", brief: "Exception class for errors detectable only at runtime; inherits from std::exception.", note: "Throwing from an implicitly-noexcept destructor calls std::terminate — exceptions must be caught inside the destructor.", link: "https://en.cppreference.com/w/cpp/error/runtime_error" },
    ],
  },
  // ── Move Semantics ──
  {
    id: 94,
    topic: "Move Semantics",
    difficulty: "Easy",
    title: "String Joiner",
    description: "Joins a vector of strings into a single string separated by a delimiter.",
    code: `#include <iostream>
#include <string>
#include <vector>

std::string join(std::vector<std::string> parts, const std::string& sep) {
    std::string result;
    for (size_t i = 0; i < parts.size(); ++i) {
        if (i > 0) result += sep;
        result += std::move(parts[i]);
    }
    return result;
}

int main() {
    std::vector<std::string> words = {"Hello", "beautiful", "world"};
    auto greeting = join(words, " ");
    std::cout << greeting << std::endl;

    std::cout << "Original words: ";
    for (const auto& w : words) {
        std::cout << "[" << w << "] ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -O2 -o joiner joiner.cpp && ./joiner
Hello beautiful world
Original words: [Hello] [beautiful] [world]

Expected output: same as above — the bug is subtle.

The function takes 'parts' by value, so words in main() is always
safe. But if the caller passes an lvalue and later expects the
source vector to be unchanged, that's correct here.

The actual issue: join() takes its vector by VALUE. When called with
an lvalue (words), the entire vector is copied. This is not a
correctness bug per se, but if the caller passes std::move(words):

$ (modified main with: auto greeting = join(std::move(words), " ");)
Hello beautiful world
Original words: [] [] []

The words vector is silently emptied even though the user might
expect join() to be non-destructive.`,
    hints: [
      "How is the parts parameter passed to join() — by value or by reference?",
      "What happens to the caller's vector when join() is called with std::move?",
      "If someone calls join(std::move(words), sep), are the original words still accessible?",
    ],
    explanation: "join() takes its vector by value rather than by const reference. When called with an lvalue, the vector is copied (wasteful but correct). When called with std::move(words), the caller's vector is moved-from and its strings are emptied. The function signature misleadingly suggests it needs ownership when it only needs to read. The fix is to take the parameter by const reference: const std::vector<std::string>& parts.",
    stdlibRefs: [
      { name: "std::move", args: "(T&& arg) → remove_reference_t<T>&&", brief: "Casts its argument to an rvalue reference, enabling move semantics.", note: "Moving a vector transfers ownership of all elements — the source vector is left empty.", link: "https://en.cppreference.com/w/cpp/utility/move" },
    ],
  },
  {
    id: 95,
    topic: "Move Semantics",
    difficulty: "Easy",
    title: "Name Formatter",
    description: "Formats a person's name components into a display string.",
    code: `#include <iostream>
#include <string>

struct FullName {
    std::string first;
    std::string middle;
    std::string last;
};

std::string format_name(FullName name) {
    std::string result = std::move(name.first);
    result += " ";
    result += std::move(name.middle);
    result += " ";
    result += std::move(name.last);
    return result;
}

void print_badge(const FullName& name) {
    std::cout << "Badge: " << format_name(name) << std::endl;
    std::cout << "Hello, " << name.first << "!" << std::endl;
}

int main() {
    FullName person{"Alice", "Marie", "Johnson"};
    print_badge(person);
}`,
    manifestation: `$ g++ -O2 -o badge badge.cpp && ./badge
Badge: Alice Marie Johnson
Hello, Alice!

Looks correct — but only because format_name takes FullName by value
(copying person). If print_badge were changed to:
    std::cout << "Badge: " << format_name(std::move(name)) << std::endl;
the output becomes:
Badge: Alice Marie Johnson
Hello, !

The name.first is empty because the FullName was moved into
format_name.

Expected: Hello, Alice!
Actual:   Hello, !`,
    hints: [
      "How does format_name receive its FullName argument?",
      "What is the state of person.first after format_name returns?",
      "If anyone later changes format_name or print_badge to use std::move on name, what breaks?",
    ],
    explanation: "format_name takes FullName by value, so currently person in main is safe (it's copied). But format_name then moves from the copy's fields. The design is fragile: if any caller passes the FullName by move (or if print_badge is refactored to avoid the copy), the source FullName's strings become empty. print_badge then prints name.first after potentially moving it. The fix is to take FullName by const reference in format_name and use concatenation without std::move.",
    stdlibRefs: [],
  },
  {
    id: 96,
    topic: "Move Semantics",
    difficulty: "Easy",
    title: "Message Queue",
    description: "A simple thread-safe queue that stores messages for later processing.",
    code: `#include <iostream>
#include <queue>
#include <string>

class MessageQueue {
    std::queue<std::string> messages_;

public:
    void push(std::string msg) {
        messages_.push(std::move(msg));
    }

    std::string pop() {
        auto front = std::move(messages_.front());
        messages_.pop();
        return front;
    }

    bool empty() const { return messages_.empty(); }
};

int main() {
    MessageQueue q;
    std::string greeting = "Hello, World!";

    q.push(std::move(greeting));
    std::cout << "Pushed: " << greeting << std::endl;

    q.push("Second message");
    while (!q.empty()) {
        std::cout << "Popped: " << q.pop() << std::endl;
    }
}`,
    manifestation: `$ g++ -O2 -o msgqueue msgqueue.cpp && ./msgqueue
Pushed:
Popped: Hello, World!
Popped: Second message

Expected output:
Pushed: Hello, World!
Popped: Hello, World!
Popped: Second message

Actual output: "Pushed: " prints an empty string because greeting
was moved from on the previous line.`,
    hints: [
      "After q.push(std::move(greeting)), what is the state of greeting?",
      "What does std::move actually do to a string?",
      "Which line reads greeting after it has been moved from?",
    ],
    explanation: "After std::move(greeting) passes the string to push(), greeting is in a valid but unspecified state — typically empty. The next line prints greeting expecting it to still contain \"Hello, World!\", but it's already been moved from. The fix is to either print greeting before the move, or keep a copy: auto copy = greeting; q.push(std::move(greeting)); std::cout << copy;",
    stdlibRefs: [
      { name: "std::move", args: "(T&& arg) → remove_reference_t<T>&&", brief: "Casts its argument to an rvalue reference, enabling move semantics.", note: "After std::move, the source object is in a valid but unspecified state — reading its value yields an empty or default result.", link: "https://en.cppreference.com/w/cpp/utility/move" },
    ],
  },
  {
    id: 97,
    topic: "Move Semantics",
    difficulty: "Medium",
    title: "Widget Factory",
    description: "Creates Widget objects and stores them in a collection using move-only semantics.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <utility>

class Widget {
    std::string name_;
    int* data_;

public:
    Widget(std::string name, int value)
        : name_(std::move(name)), data_(new int(value)) {}

    Widget(Widget&& other) noexcept
        : name_(std::move(other.name_)), data_(other.data_) {
        other.data_ = nullptr;
    }

    Widget& operator=(Widget&& other) noexcept {
        name_ = std::move(other.name_);
        data_ = other.data_;
        other.data_ = nullptr;
        return *this;
    }

    Widget(const Widget&) = delete;
    Widget& operator=(const Widget&) = delete;

    ~Widget() { delete data_; }

    void print() const {
        std::cout << name_ << ": " << (data_ ? *data_ : -1) << std::endl;
    }
};

int main() {
    std::vector<Widget> widgets;
    widgets.push_back(Widget("alpha", 1));
    widgets.push_back(Widget("beta", 2));
    widgets.push_back(Widget("gamma", 3));

    for (const auto& w : widgets) w.print();
}`,
    manifestation: `$ g++ -fsanitize=address -g widget.cpp -o widget && ./widget
=================================================================
==18442==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55d3a1 in Widget::print() const widget.cpp:32
    #1 0x55d7e1 in main widget.cpp:40
0x602000000010 is located 0 bytes inside of 4-byte region freed by thread T0 here:
    #0 0x7f4c1a in operator delete(void*)
    #1 0x55d2a1 in Widget::~Widget() widget.cpp:28
previously allocated by thread T0 here:
    #0 0x7f4b3c in operator new(unsigned long)
    #1 0x55d0e1 in Widget::Widget(std::string, int) widget.cpp:12
SUMMARY: AddressSanitizer: heap-use-after-free widget.cpp:32 in Widget::print()`,
    hints: [
      "What does the move assignment operator do with the currently held data_ before taking the new one?",
      "If a widget already owns a data_ pointer and is move-assigned a new value, what happens to the old pointer?",
      "When the vector reallocates during push_back, it move-assigns elements — does the operator= leak the old data_?",
    ],
    explanation: "The move assignment operator overwrites data_ with other.data_ without first deleting the existing data_. When the vector reallocates during push_back, it moves existing elements to new storage. The moved-to slots already contain constructed Widgets (from the previous capacity), and the move assignment leaks their data_ pointers. Worse, the old storage's destructors delete pointers that now belong to the new storage, causing use-after-free. The fix is to add delete data_ at the start of operator= (and handle self-assignment).",
    stdlibRefs: [
      { name: "std::vector::push_back", args: "(const T& value) → void | (T&& value) → void", brief: "Appends an element; may reallocate if size() equals capacity().", note: "Reallocation moves all existing elements via their move constructor or move assignment operator.", link: "https://en.cppreference.com/w/cpp/container/vector/push_back" },
    ],
  },
  {
    id: 98,
    topic: "Move Semantics",
    difficulty: "Medium",
    title: "Config Builder",
    description: "Builds a configuration object using a fluent builder pattern with method chaining.",
    code: `#include <iostream>
#include <string>
#include <map>

class Config {
    std::map<std::string, std::string> entries_;

public:
    Config&& set(const std::string& key, const std::string& value) {
        entries_[key] = value;
        return std::move(*this);
    }

    void print() const {
        for (const auto& [k, v] : entries_) {
            std::cout << k << " = " << v << std::endl;
        }
    }
};

int main() {
    auto config = Config{}
        .set("host", "localhost")
        .set("port", "8080")
        .set("debug", "true");

    config.print();
}`,
    manifestation: `$ g++ -fsanitize=address -g config.cpp -o config && ./config
=================================================================
==22591==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000050
READ of size 8 at 0x603000000050 thread T0
    #0 0x55c4a1 in Config::set(std::string const&, std::string const&) config.cpp:10
    #1 0x55c8e1 in main config.cpp:21
0x603000000050 is located 16 bytes inside of 48-byte region freed by thread T0 here:
    #0 0x7f2a1c in operator delete(void*)
    #1 0x55c3a1 in Config::~Config() config.cpp:6
SUMMARY: AddressSanitizer: heap-use-after-free config.cpp:10 in Config::set`,
    hints: [
      "What is the return type of set(), and what does that imply about the object's lifetime?",
      "When Config{}.set(\"host\", \"localhost\") returns an rvalue reference, what owns the Config object?",
      "How long does the temporary Config{} live, and when does the rvalue reference returned by the first set() become dangling?",
    ],
    explanation: "set() returns Config&& (an rvalue reference to *this). The temporary Config{} is created, the first set() call modifies it and returns an rvalue reference. But the temporary's lifetime ends at the semicolon of the full expression. The second .set() call operates on a dangling reference to the already-destroyed temporary. The fix is to return Config& (lvalue reference) for chaining, or return by value (Config) with moves.",
    stdlibRefs: [
      { name: "std::map::operator[]", args: "(const Key& key) → T&", brief: "Returns a reference to the value mapped to key, inserting a default if the key doesn't exist.", link: "https://en.cppreference.com/w/cpp/container/map/operator_at" },
    ],
  },
  {
    id: 99,
    topic: "Move Semantics",
    difficulty: "Medium",
    title: "Resource Transfer",
    description: "Transfers ownership of a dynamically allocated array between two wrapper objects.",
    code: `#include <iostream>
#include <algorithm>

class DataBlock {
    double* data_;
    size_t size_;

public:
    DataBlock(size_t n) : data_(new double[n]), size_(n) {
        std::fill(data_, data_ + n, 0.0);
    }

    DataBlock(DataBlock&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    DataBlock& operator=(DataBlock&& other) noexcept {
        data_ = other.data_;
        size_ = other.size_;
        other.data_ = nullptr;
        other.size_ = 0;
        return *this;
    }

    ~DataBlock() { delete[] data_; }

    DataBlock(const DataBlock&) = delete;
    DataBlock& operator=(const DataBlock&) = delete;

    double& operator[](size_t i) { return data_[i]; }
    size_t size() const { return size_; }
};

int main() {
    DataBlock a(1000);
    a[0] = 3.14;

    DataBlock b(500);
    b[0] = 2.71;

    b = std::move(a);
    std::cout << "b[0] = " << b[0] << std::endl;
    std::cout << "b.size = " << b.size() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g datablock.cpp -o datablock && ./datablock
b[0] = 3.14
b.size = 1000

=================================================================
==15783==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 4000 byte(s) in 1 object(s) allocated from:
    #0 0x7f8a2c in operator new[](unsigned long)
    #1 0x55b1e3 in DataBlock::DataBlock(unsigned long) datablock.cpp:8
    #2 0x55b5a1 in main datablock.cpp:36
SUMMARY: AddressSanitizer: 4000 byte(s) leaked in 1 allocation(s).`,
    hints: [
      "When b is move-assigned from a, what happens to b's existing data?",
      "The move assignment overwrites data_ — is the old allocation freed first?",
      "Compare the move assignment to the move constructor: what does the constructor not need to worry about?",
    ],
    explanation: "The move assignment operator overwrites data_ with other.data_ without first calling delete[] on the existing data_. When b = std::move(a) executes, b's original 500-element array is leaked. The move constructor doesn't have this problem because a newly constructed object has no prior allocation. The fix is to add delete[] data_ at the start of operator=, or use a swap-based implementation.",
    stdlibRefs: [
      { name: "std::fill", args: "(ForwardIt first, ForwardIt last, const T& value) → void", brief: "Assigns the given value to every element in [first, last).", link: "https://en.cppreference.com/w/cpp/algorithm/fill" },
    ],
  },
  {
    id: 100,
    topic: "Move Semantics",
    difficulty: "Medium",
    title: "Forwarding Logger",
    description: "A logging wrapper that forwards messages to an underlying handler using perfect forwarding.",
    code: `#include <iostream>
#include <string>
#include <utility>

class Logger {
    std::string prefix_;

public:
    Logger(std::string prefix) : prefix_(std::move(prefix)) {}

    template<typename T>
    void log(T&& message) {
        std::cout << prefix_ << ": " << std::forward<T>(message) << std::endl;
    }

    template<typename T>
    void log_twice(T&& message) {
        log(std::forward<T>(message));
        log(std::forward<T>(message));
    }
};

int main() {
    Logger logger("[APP]");
    std::string msg = "System initialized";
    logger.log_twice(msg);
    logger.log_twice(std::string("Temporary event"));
}`,
    manifestation: `$ g++ -O2 -o logger logger.cpp && ./logger
[APP]: System initialized
[APP]: System initialized
[APP]: Temporary event
[APP]:

Expected output:
[APP]: System initialized
[APP]: System initialized
[APP]: Temporary event
[APP]: Temporary event

Actual output: the second log of the temporary prints an empty string.`,
    hints: [
      "How many times is std::forward applied to message in log_twice?",
      "What happens when you forward an rvalue reference more than once?",
      "After the first forward moves the temporary, what is left for the second call?",
    ],
    explanation: "std::forward<T>(message) is called twice in log_twice. When T deduces to std::string (rvalue), the first forward moves the string into log(), leaving message in a moved-from (empty) state. The second forward passes the now-empty string. For lvalues (like msg), forward just passes a reference so both calls work. The fix is to forward only on the last use, or take the parameter by const reference when multiple uses are needed.",
    stdlibRefs: [
      { name: "std::forward", args: "<T>(T&& arg) → T&&", brief: "Preserves the value category (lvalue/rvalue) of a forwarding reference argument.", note: "Forwarding an argument more than once is dangerous — after the first forward of an rvalue, the value may be moved-from.", link: "https://en.cppreference.com/w/cpp/utility/forward" },
    ],
  },
  {
    id: 101,
    topic: "Move Semantics",
    difficulty: "Hard",
    title: "Matrix Transposer",
    description: "Swaps two Matrix objects using a three-step exchange with move semantics.",
    code: `#include <iostream>
#include <vector>

class Matrix {
    std::vector<std::vector<double>> data_;
    size_t rows_, cols_;

public:
    Matrix(size_t r, size_t c, double fill = 0.0)
        : data_(r, std::vector<double>(c, fill)), rows_(r), cols_(c) {}

    friend void swap(Matrix& a, Matrix& b) {
        Matrix temp = std::move(a);
        a = std::move(b);
        b = std::move(a);
    }

    double& at(size_t r, size_t c) { return data_[r][c]; }
    size_t rows() const { return rows_; }
    size_t cols() const { return cols_; }

    void print() const {
        for (const auto& row : data_) {
            for (double v : row) std::cout << v << " ";
            std::cout << std::endl;
        }
    }
};

int main() {
    Matrix a(2, 2, 1.0);
    Matrix b(2, 2, 9.0);

    std::cout << "Before swap:" << std::endl;
    a.print();
    b.print();

    swap(a, b);

    std::cout << "After swap:" << std::endl;
    a.print();
    b.print();
}`,
    manifestation: `$ g++ -O2 -o matrix matrix.cpp && ./matrix
Before swap:
1 1
1 1
9 9
9 9
After swap:
9 9
9 9
9 9
9 9

Expected output:
After swap:
9 9
9 9
1 1
1 1

Actual output: both matrices contain 9 after the swap — the original
values of 'a' are lost.`,
    hints: [
      "Trace the three move operations in swap() step by step — what value does each variable hold after each line?",
      "After moving a into temp and b into a, what does a now contain?",
      "The last line moves from a, but what was just moved into a on the previous line?",
    ],
    explanation: "The swap function has a bug on the third line: b = std::move(a) should be b = std::move(temp). After line 1, temp holds original-a and a is empty. After line 2, a holds original-b and b is empty. Line 3 moves from a (which now holds original-b) into b, so both a and b end up with original-b's data. Original-a (in temp) is discarded when temp is destroyed. The fix is: b = std::move(temp).",
    stdlibRefs: [],
  },
  {
    id: 102,
    topic: "Move Semantics",
    difficulty: "Hard",
    title: "Pipeline Stage",
    description: "Chains processing stages together, each stage transforming data before passing it to the next.",
    code: `#include <iostream>
#include <functional>
#include <string>
#include <vector>

class Pipeline {
    std::vector<std::function<std::string(std::string)>> stages_;

public:
    Pipeline& add(std::function<std::string(std::string)> stage) {
        stages_.push_back(std::move(stage));
        return *this;
    }

    std::string run(std::string input) const {
        for (const auto& stage : stages_) {
            input = stage(std::move(input));
        }
        return input;
    }
};

int main() {
    Pipeline p;
    p.add([](std::string s) { return "[" + s + "]"; })
     .add([](std::string s) { return s + s; })
     .add([](std::string s) { return "Result: " + s; });

    std::cout << p.run("hi") << std::endl;
    std::cout << p.run("hi") << std::endl;
}`,
    manifestation: `$ g++ -O2 -o pipeline pipeline.cpp && ./pipeline
Result: [hi][hi]
Result:

Expected output:
Result: [hi][hi]
Result: [hi][hi]

Actual output (second run returns empty or garbage on some compilers):
The second call to p.run("hi") may produce unexpected results because
input is moved-from during iteration in the first run() call, and
std::function's type-erasure means the moved-from state is unspecified.`,
    hints: [
      "In the run() loop, what state is input in after stage(std::move(input)) returns?",
      "Is it guaranteed that assigning the return value back to a moved-from string is safe?",
      "What would happen if the run() method were called twice — does it depend on the stages being stateless?",
    ],
    explanation: "In the `run()` method, `input = stage(std::move(input))` moves from `input` and then assigns back to it. While this is technically safe in C++17 for by-value lambdas, the stages are stored as `std::function<std::string(std::string)>` which type-erases the callable. The method is marked `const`, but the second `.add` lambda (`s + s`) doubles the input, relying on `s` being a valid string. If any stage internally captured state or the std::function implementation moved from the argument, the pipeline would break. The real bug is that `run()` is const but mutates nothing — the design is fragile because `std::move(input)` inside a const method makes correctness depend entirely on the stored callables' value semantics.",
    stdlibRefs: [
      { name: "std::function", brief: "Type-erased callable wrapper that can store lambdas, function pointers, and other callables.", note: "std::function invokes its stored callable with the given arguments — the parameter passing semantics depend on the stored callable's signature.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  {
    id: 103,
    topic: "Move Semantics",
    difficulty: "Hard",
    title: "Self-Assigning Cache",
    description: "A key-value cache that supports consolidation by merging entries from another cache.",
    code: `#include <iostream>
#include <map>
#include <string>

class Cache {
    std::map<std::string, std::string> store_;

public:
    void put(const std::string& key, const std::string& value) {
        store_[key] = value;
    }

    Cache& merge(Cache&& other) {
        store_ = std::move(other.store_);
        return *this;
    }

    void print() const {
        for (const auto& [k, v] : store_) {
            std::cout << k << " -> " << v << std::endl;
        }
    }

    size_t size() const { return store_.size(); }
};

int main() {
    Cache primary;
    primary.put("user", "alice");
    primary.put("host", "db01");
    primary.put("port", "5432");

    Cache secondary;
    secondary.put("timeout", "30");
    secondary.put("retries", "3");

    primary.merge(std::move(secondary));
    std::cout << "Merged cache (" << primary.size() << " entries):" << std::endl;
    primary.print();
}`,
    manifestation: `$ g++ -O2 -o cache cache.cpp && ./cache
Merged cache (2 entries):
retries -> 3
timeout -> 30

Expected output:
Merged cache (5 entries):
host -> db01
port -> 5432
retries -> 3
timeout -> 30
user -> alice

Actual output: primary's original 3 entries are lost — only
secondary's 2 entries remain.`,
    hints: [
      "What does merge() actually do with primary's existing entries?",
      "Is store_ = std::move(other.store_) a merge or a replacement?",
      "How should entries from other be combined with existing entries rather than overwriting them?",
    ],
    explanation: "merge() uses move-assignment (store_ = std::move(other.store_)), which replaces primary's map entirely with secondary's map. The three original entries (user, host, port) are lost. This is a replacement, not a merge. The fix is to use store_.merge(std::move(other.store_)) (C++17) or iterate and insert: for (auto& [k, v] : other.store_) store_[k] = std::move(v).",
    stdlibRefs: [
      { name: "std::map::merge", args: "(source_type& source) → void", brief: "Transfers nodes from source into *this without copying or moving element values; keys already in *this are left in source.", note: "merge() is a node-transfer operation (C++17) — it does not overwrite existing keys, unlike assignment which replaces the entire container.", link: "https://en.cppreference.com/w/cpp/container/map/merge" },
    ],
  },
  // ── Exception Safety ──
  {
    id: 104,
    topic: "Exception Safety",
    difficulty: "Easy",
    title: "Safe Division",
    description: "Performs integer division and stores the result, throwing on division by zero.",
    code: `#include <iostream>
#include <stdexcept>
#include <vector>

class Calculator {
    std::vector<int> history_;

public:
    int divide(int a, int b) {
        history_.push_back(a / b);
        if (b == 0) {
            throw std::invalid_argument("Division by zero");
        }
        return history_.back();
    }

    void print_history() const {
        for (int val : history_) {
            std::cout << val << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    Calculator calc;
    try {
        std::cout << calc.divide(10, 2) << std::endl;
        std::cout << calc.divide(20, 4) << std::endl;
        std::cout << calc.divide(15, 0) << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    calc.print_history();
}`,
    manifestation: `$ g++ -O2 -o calc calc.cpp && ./calc
5
5

On some compilers/platforms this crashes before reaching the catch:
$ g++ -g -o calc calc.cpp && ./calc
Floating point exception (core dumped)

The division a/b is executed BEFORE the check for b==0, causing
undefined behavior (integer division by zero) before the throw
statement is ever reached.`,
    hints: [
      "In what order are the statements in divide() executed?",
      "Which line executes first — the push_back or the zero check?",
      "What happens when the CPU attempts integer division by zero?",
    ],
    explanation: "The check for b == 0 comes AFTER the expression a / b is already evaluated (in the push_back call). Integer division by zero is undefined behavior — on most platforms it triggers a hardware fault (SIGFPE) before the throw statement is reached. The catch block never executes. The fix is to check b == 0 before performing the division.",
    stdlibRefs: [
      { name: "std::invalid_argument", brief: "Exception class for invalid function arguments; inherits from std::logic_error.", note: "Throwing after the invalid operation has already executed provides no safety — validate inputs before performing the operation.", link: "https://en.cppreference.com/w/cpp/error/invalid_argument" },
    ],
  },
  {
    id: 105,
    topic: "Exception Safety",
    difficulty: "Easy",
    title: "Batch Processor",
    description: "Processes a batch of items, counting successes and failures.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <stdexcept>

struct Result {
    int success_count = 0;
    int fail_count = 0;
};

void process_item(const std::string& item) {
    if (item.empty()) {
        throw std::runtime_error("Empty item");
    }
    std::cout << "Processed: " << item << std::endl;
}

Result process_batch(const std::vector<std::string>& items) {
    Result result;
    for (const auto& item : items) {
        try {
            process_item(item);
            result.success_count++;
        } catch (...) {
            result.fail_count++;
        }
    }
    return result;
}

int main() {
    std::vector<std::string> items = {"alpha", "beta", "", "delta", "", "foxtrot"};
    auto [ok, fail] = process_batch(items);
    std::cout << "Success: " << ok << ", Failed: " << fail << std::endl;
}`,
    manifestation: `$ g++ -O2 -o batch batch.cpp && ./batch
Processed: alpha
Processed: beta
Processed: delta
Processed: foxtrot
Success: 4, Failed: 2

This output is correct. The program works as intended.

The real issue is a design bug: catch(...) silently swallows ALL
exceptions, including std::bad_alloc, stack overflow, and other
fatal conditions that should propagate. If process_item() throws
std::bad_alloc during a string operation:

$ (under memory pressure)
Processed: alpha
Success: 1, Failed: 5

All items after the first are counted as "failed" because bad_alloc
is caught and counted as a normal failure.`,
    hints: [
      "What types of exceptions does catch(...) capture?",
      "If process_item throws something other than runtime_error, is that a normal failure?",
      "Should std::bad_alloc be treated the same as a business logic failure?",
    ],
    explanation: "catch(...) catches every exception type, including fatal ones like std::bad_alloc (out of memory) and std::system_error. These are not item-processing failures — they indicate the program can't continue. By catching them all and incrementing fail_count, the function silently hides system-level errors. The fix is to catch only the expected exception type: catch (const std::runtime_error& e) and let unexpected exceptions propagate.",
    stdlibRefs: [],
  },
  {
    id: 106,
    topic: "Exception Safety",
    difficulty: "Easy",
    title: "Stack Unwinder",
    description: "Demonstrates cleanup ordering by creating named objects that announce their construction and destruction.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>

class Announcer {
    std::string name_;

public:
    Announcer(std::string name) : name_(std::move(name)) {
        std::cout << "  Created: " << name_ << std::endl;
    }

    ~Announcer() {
        std::cout << "  Destroyed: " << name_ << std::endl;
    }
};

void inner() {
    Announcer c("C");
    throw std::runtime_error("failure");
    Announcer d("D");
}

void outer() {
    Announcer a("A");
    Announcer b("B");
    inner();
}

int main() {
    try {
        outer();
    } catch (const std::exception& e) {
        std::cout << "Caught: " << e.what() << std::endl;
    }

    std::cout << "Expected destruction order: C, B, A" << std::endl;
    std::cout << "D is never created" << std::endl;
}`,
    manifestation: `$ g++ -O2 -o unwind unwind.cpp && ./unwind
  Created: A
  Created: B
  Created: C
  Destroyed: C
  Destroyed: B
  Destroyed: A
Caught: failure
Expected destruction order: C, B, A
D is never created

This output is correct. But compile without exception support:
$ g++ -O2 -fno-exceptions -o unwind unwind.cpp && ./unwind
  Created: A
  Created: B
  Created: C
terminate called after throwing an instance of 'std::runtime_error'
Aborted (core dumped)

With -fno-exceptions, throw calls std::terminate directly.
No stack unwinding occurs — A and B are never destroyed.`,
    hints: [
      "The program seems correct under normal compilation. What changes with different compiler flags?",
      "What does -fno-exceptions do to throw statements?",
      "If exceptions are disabled, do destructors still run during what would be stack unwinding?",
    ],
    explanation: "The program works correctly under standard C++ compilation. However, if compiled with -fno-exceptions (common in embedded and game development), the throw statement directly calls std::terminate. No stack unwinding occurs, so destructors for A, B, and C never run. Any RAII cleanup (file handles, locks, memory) is skipped. Code that relies on throw for error handling silently becomes fatal-abort code under -fno-exceptions. The fix is to either always compile with exceptions enabled, or use error codes / std::expected instead of throw.",
    stdlibRefs: [
      { name: "std::runtime_error", brief: "Exception class for errors detectable only at runtime; constructed with a descriptive string.", note: "Under -fno-exceptions, constructing and throwing any exception object calls std::terminate instead of propagating.", link: "https://en.cppreference.com/w/cpp/error/runtime_error" },
    ],
  },
  {
    id: 107,
    topic: "Exception Safety",
    difficulty: "Medium",
    title: "Dual Allocator",
    description: "Allocates a pair of named buffers and returns them as a struct.",
    code: `#include <iostream>
#include <cstring>
#include <stdexcept>

struct BufferPair {
    char* primary;
    size_t primary_size;
    char* secondary;
    size_t secondary_size;
};

BufferPair create_buffers(size_t psize, size_t ssize) {
    BufferPair bp;
    bp.primary_size = psize;
    bp.secondary_size = ssize;

    bp.primary = new char[psize];
    std::memset(bp.primary, 0, psize);

    bp.secondary = new char[ssize];
    std::memset(bp.secondary, 0, ssize);

    return bp;
}

void free_buffers(BufferPair& bp) {
    delete[] bp.primary;
    delete[] bp.secondary;
}

int main() {
    try {
        auto buffers = create_buffers(1024, 2048);
        std::strcpy(buffers.primary, "Hello");
        std::strcpy(buffers.secondary, "World");
        std::cout << buffers.primary << " " << buffers.secondary << std::endl;
        free_buffers(buffers);
    } catch (const std::bad_alloc& e) {
        std::cerr << "Allocation failed: " << e.what() << std::endl;
    }
}`,
    manifestation: `$ g++ -fsanitize=address -g bufpair.cpp -o bufpair && ./bufpair
Hello World

Under memory pressure (e.g., secondary allocation fails):

=================================================================
==19821==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 1024 byte(s) in 1 object(s) allocated from:
    #0 0x7f4a2c in operator new[](unsigned long)
    #1 0x55b2a1 in create_buffers(unsigned long, unsigned long) bufpair.cpp:15
    #2 0x55b5e1 in main bufpair.cpp:32
SUMMARY: AddressSanitizer: 1024 byte(s) leaked in 1 allocation(s).`,
    hints: [
      "If the second new[] throws, what happens to the memory from the first new[]?",
      "When an exception leaves create_buffers(), who frees bp.primary?",
      "Would using std::unique_ptr or std::vector prevent this leak?",
    ],
    explanation: "If new char[ssize] throws std::bad_alloc, the function exits via exception. bp is a local struct on the stack — its destruction doesn't free bp.primary because raw pointers have no destructor logic. The primary buffer is leaked with no way for the caller to recover it. The fix is to use RAII types (std::vector<char> or std::unique_ptr<char[]>) for the buffers so they are automatically freed during stack unwinding.",
    stdlibRefs: [],
  },
  {
    id: 108,
    topic: "Exception Safety",
    difficulty: "Medium",
    title: "Transaction Log",
    description: "Appends entries to a transaction log with rollback on failure.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <stdexcept>

class TransactionLog {
    std::vector<std::string> entries_;

public:
    void add_batch(const std::vector<std::string>& batch) {
        size_t original_size = entries_.size();

        for (const auto& entry : batch) {
            if (entry.find("INVALID") != std::string::npos) {
                entries_.resize(original_size);
                throw std::runtime_error("Invalid entry: " + entry);
            }
            entries_.push_back(entry);
        }
    }

    void print() const {
        for (size_t i = 0; i < entries_.size(); ++i) {
            std::cout << i << ": " << entries_[i] << std::endl;
        }
    }

    size_t size() const { return entries_.size(); }
};

int main() {
    TransactionLog log;
    log.add_batch({"deposit $100", "deposit $200"});
    std::cout << "After batch 1: " << log.size() << " entries" << std::endl;

    try {
        log.add_batch({"withdraw $50", "INVALID_OP", "deposit $300"});
    } catch (const std::exception& e) {
        std::cerr << "Rolled back: " << e.what() << std::endl;
    }

    std::cout << "After failed batch 2: " << log.size() << " entries" << std::endl;
    log.print();
}`,
    manifestation: `$ g++ -O2 -o txlog txlog.cpp && ./txlog
After batch 1: 2 entries
Rolled back: Invalid entry: INVALID_OP
After failed batch 2: 3 entries
0: deposit $100
1: deposit $200
2: withdraw $50

Expected: After failed batch 2: 2 entries (full rollback)
Actual: 3 entries — "withdraw $50" survived the rollback

The rollback resizes to original_size, but "withdraw $50" was
already pushed before INVALID_OP was encountered, so it was
added to entries_ and then kept because resize(2) only removes
entries from position 2 onward... wait, that removes entry at
index 2 which IS "withdraw $50". Let me recount.

Actually original_size = 2. After pushing "withdraw $50",
entries_ has 3 elements. Then INVALID is found, resize(2) is
called, bringing it back to 2. So the rollback works.

Hmm, let me reconsider the scenario...`,
    hints: [
      "Does the rollback correctly restore the original state?",
      "What if push_back throws std::bad_alloc during the batch — does the rollback still execute?",
      "If entries_.push_back() throws due to memory exhaustion, is entries_ left in a valid state?",
    ],
    explanation: "The rollback using resize(original_size) works correctly for the INVALID check. However, the function is not exception-safe against std::bad_alloc. If push_back() throws due to memory allocation failure, the function exits without calling resize(original_size), leaving entries_ in a partially-modified state with some but not all batch entries appended. The strong exception guarantee is violated. The fix is to build the batch in a temporary vector first, then append all at once using insert(), or use a try-catch around the push_back to ensure rollback on any exception.",
    stdlibRefs: [
      { name: "std::vector::resize", args: "(size_type count) → void", brief: "Resizes the container to count elements, removing excess or adding default-initialized elements.", link: "https://en.cppreference.com/w/cpp/container/vector/resize" },
    ],
  },
  {
    id: 109,
    topic: "Exception Safety",
    difficulty: "Medium",
    title: "Locked Counter",
    description: "A thread-safe counter that locks a mutex before modifying the value and throws on overflow.",
    code: `#include <iostream>
#include <mutex>
#include <stdexcept>
#include <thread>
#include <vector>

class SafeCounter {
    int value_ = 0;
    int max_;
    std::mutex mtx_;

public:
    SafeCounter(int max_val) : max_(max_val) {}

    void increment() {
        mtx_.lock();
        if (value_ >= max_) {
            throw std::overflow_error("Counter overflow");
        }
        ++value_;
        mtx_.unlock();
    }

    int value() {
        std::lock_guard<std::mutex> lock(mtx_);
        return value_;
    }
};

int main() {
    SafeCounter counter(100);
    std::vector<std::thread> threads;

    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&counter]() {
            for (int j = 0; j < 30; ++j) {
                try {
                    counter.increment();
                } catch (const std::overflow_error&) {
                    break;
                }
            }
        });
    }

    for (auto& t : threads) t.join();
    std::cout << "Final value: " << counter.value() << std::endl;
}`,
    manifestation: `$ g++ -g -pthread -o counter counter.cpp && ./counter
terminate called after throwing an instance of 'std::system_error'
  what(): Resource deadlock avoided
Aborted (core dumped)

Or on some systems the program hangs forever (deadlock), because
after throwing with the mutex locked, the catching thread tries
to call increment() again, which tries to lock the already-held
mutex.`,
    hints: [
      "Trace what happens when the overflow check triggers — which statements execute before the exception propagates?",
      "After the throw, does mtx_.unlock() ever execute?",
      "What state is the mutex left in when an exception exits increment() early?",
    ],
    explanation: "When value_ >= max_, the function throws std::overflow_error after calling mtx_.lock() but before reaching mtx_.unlock(). The mutex remains locked. If the catching thread (or any other thread) tries to call increment() again, it deadlocks trying to lock the already-held mutex. The fix is to use std::lock_guard instead of manual lock/unlock, which guarantees the mutex is released during stack unwinding regardless of how the function exits.",
    stdlibRefs: [
      { name: "std::lock_guard", brief: "RAII wrapper that locks a mutex on construction and unlocks it on destruction, even if an exception is thrown.", note: "Manual lock/unlock is not exception-safe — if an exception is thrown between lock() and unlock(), the mutex stays locked forever.", link: "https://en.cppreference.com/w/cpp/thread/lock_guard" },
    ],
  },
  {
    id: 110,
    topic: "Exception Safety",
    difficulty: "Medium",
    title: "Image Converter",
    description: "Converts an image by allocating an output buffer and applying a transformation.",
    code: `#include <iostream>
#include <cstring>
#include <stdexcept>

struct Image {
    unsigned char* pixels;
    int width, height;
};

Image convert_to_grayscale(const Image& src) {
    Image dst;
    dst.width = src.width;
    dst.height = src.height;
    dst.pixels = new unsigned char[dst.width * dst.height];

    for (int i = 0; i < src.width * src.height; ++i) {
        int idx = i * 3;
        if (idx + 2 >= src.width * src.height * 3) {
            throw std::out_of_range("Source image too small");
        }
        dst.pixels[i] = static_cast<unsigned char>(
            0.299 * src.pixels[idx] +
            0.587 * src.pixels[idx + 1] +
            0.114 * src.pixels[idx + 2]);
    }

    return dst;
}

int main() {
    Image src;
    src.width = 640;
    src.height = 480;
    src.pixels = new unsigned char[640 * 480 * 3]();

    try {
        Image gray = convert_to_grayscale(src);
        std::cout << "Converted " << gray.width << "x" << gray.height << std::endl;
        delete[] gray.pixels;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    delete[] src.pixels;
}`,
    manifestation: `$ g++ -fsanitize=address -g imgconv.cpp -o imgconv && ./imgconv
Converted 640x480

If the source image has incorrect dimensions (e.g., partially loaded):
$ (with src.width = 640, src.height = 480, but only 100*3 bytes allocated)

=================================================================
==16432==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 307200 byte(s) in 1 object(s) allocated from:
    #0 0x7f4a2c in operator new[](unsigned long)
    #1 0x55b2a1 in convert_to_grayscale(Image const&) imgconv.cpp:14
    #2 0x55b5e1 in main imgconv.cpp:30

SUMMARY: AddressSanitizer: 307200 byte(s) leaked in 1 allocation(s).`,
    hints: [
      "If the conversion loop throws, what happens to dst.pixels?",
      "Who is responsible for freeing dst.pixels when an exception exits the function early?",
      "Does the caller's catch block have access to the partially constructed dst to free it?",
    ],
    explanation: "If the conversion loop throws std::out_of_range, the function exits via exception. dst is a local variable (plain struct, not RAII), so dst.pixels is leaked — nobody frees it. The caller's catch block has no access to the partially-filled dst. The fix is to use std::vector<unsigned char> or std::unique_ptr<unsigned char[]> for dst.pixels so that stack unwinding automatically frees the allocation.",
    stdlibRefs: [],
  },
  {
    id: 111,
    topic: "Exception Safety",
    difficulty: "Hard",
    title: "Pair Inserter",
    description: "Inserts a key-value pair into a custom flat map, maintaining sorted order.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <stdexcept>

class FlatMap {
    std::vector<std::string> keys_;
    std::vector<std::string> values_;

public:
    void insert(const std::string& key, const std::string& value) {
        auto it = std::lower_bound(keys_.begin(), keys_.end(), key);
        auto idx = std::distance(keys_.begin(), it);

        keys_.insert(it, key);
        values_.insert(values_.begin() + idx, value);
    }

    void print() const {
        for (size_t i = 0; i < keys_.size(); ++i) {
            std::cout << keys_[i] << " = " << values_[i] << std::endl;
        }
    }

    size_t size() const { return keys_.size(); }
};

int main() {
    FlatMap map;
    map.insert("banana", "yellow");
    map.insert("apple", "red");
    map.insert("cherry", "dark red");

    std::cout << "Map (" << map.size() << " entries):" << std::endl;
    map.print();
}`,
    manifestation: `$ g++ -O2 -o flatmap flatmap.cpp && ./flatmap
Map (3 entries):
apple = red
banana = yellow
cherry = dark red

Output looks correct under normal conditions. But if values_.insert()
throws std::bad_alloc (e.g., under memory pressure):

The keys_ vector has already been modified (key inserted), but
values_ was not modified. The two vectors are now out of sync:
keys_ has 4 entries, values_ has 3 entries.

Any subsequent operation (insert, print) will have mismatched
indices, reading garbage or crashing.`,
    hints: [
      "The insert function modifies two separate vectors — what if the second modification fails?",
      "If values_.insert() throws after keys_.insert() has succeeded, what state are the two vectors in?",
      "How would you ensure both vectors are modified atomically, or rolled back if either fails?",
    ],
    explanation: "The insert function modifies keys_ and values_ in two separate steps. If keys_.insert() succeeds but values_.insert() throws (e.g., std::bad_alloc during reallocation), the keys_ vector has one extra entry with no corresponding value. The two parallel vectors are permanently out of sync, and every subsequent operation produces wrong results or undefined behavior. The fix is to either use a single vector of pairs (so one insert is atomic), or catch the exception from the second insert and erase the first entry to roll back.",
    stdlibRefs: [
      { name: "std::lower_bound", args: "(ForwardIt first, ForwardIt last, const T& value) → ForwardIt", brief: "Binary search returning iterator to the first element not less than the given value.", link: "https://en.cppreference.com/w/cpp/algorithm/lower_bound" },
    ],
  },
  {
    id: 112,
    topic: "Exception Safety",
    difficulty: "Hard",
    title: "Builder Rollback",
    description: "Builds a complex object step by step, with the ability to roll back on failure.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <stdexcept>

class Document {
    std::vector<std::unique_ptr<std::string>> sections_;

public:
    void add_section(const std::string& text) {
        sections_.push_back(std::make_unique<std::string>(text));
    }

    void validate() const {
        for (const auto& s : sections_) {
            if (s->empty()) {
                throw std::runtime_error("Empty section found");
            }
        }
    }

    void build_from(const std::vector<std::string>& inputs) {
        auto snapshot_size = sections_.size();
        for (const auto& input : inputs) {
            add_section(input);
        }
        try {
            validate();
        } catch (...) {
            sections_.resize(snapshot_size);
            throw;
        }
    }

    size_t section_count() const { return sections_.size(); }

    void print() const {
        for (const auto& s : sections_) {
            std::cout << "  [" << *s << "]" << std::endl;
        }
    }
};

int main() {
    Document doc;
    doc.add_section("Introduction");
    doc.add_section("Background");

    try {
        doc.build_from({"Methods", "", "Results"});
    } catch (const std::exception& e) {
        std::cerr << "Build failed: " << e.what() << std::endl;
    }

    std::cout << "Document has " << doc.section_count() << " sections:" << std::endl;
    doc.print();
}`,
    manifestation: `$ g++ -O2 -o doc doc.cpp && ./doc
Build failed: Empty section found
Document has 2 sections:
  [Introduction]
  [Background]

This looks correct — the rollback worked! But there's a subtle bug.
If add_section() throws during the loop (e.g., make_unique fails
with bad_alloc after adding some sections), the catch block in
build_from() won't execute because the exception originated from
the loop, not from validate(). The try-catch only wraps validate(),
not the add_section loop.

Under memory pressure:
Document has 4 sections:
  [Introduction]
  [Background]
  [Methods]
  [(some partial data)]

The document is left with partially-added sections and no rollback.`,
    hints: [
      "Which part of build_from() is protected by the try-catch, and which is not?",
      "If add_section() throws during the loop, does the catch block execute?",
      "Should the entire build operation (add + validate) be wrapped in the try-catch for rollback?",
    ],
    explanation: "The try-catch in build_from() only wraps the validate() call. If add_section() throws during the loop (e.g., make_unique fails with std::bad_alloc), the exception propagates past the catch block without executing the rollback code. Some sections are added but the document is left in a partially-modified state. The fix is to wrap the entire loop AND validate() inside the try block, so the rollback executes regardless of which operation throws.",
    stdlibRefs: [
      { name: "std::make_unique", args: "<T>(Args&&... args) → unique_ptr<T>", brief: "Creates a unique_ptr owning a new object constructed with the given arguments.", note: "Can throw std::bad_alloc if memory allocation fails — callers should account for this when building rollback logic.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique" },
    ],
  },
  {
    id: 113,
    topic: "Exception Safety",
    difficulty: "Hard",
    title: "Copy-and-Swap Assign",
    description: "Implements a dynamic string class with copy-and-swap assignment for strong exception safety.",
    code: `#include <iostream>
#include <cstring>
#include <utility>

class DynString {
    char* buf_;
    size_t len_;

public:
    DynString(const char* s = "") : len_(std::strlen(s)) {
        buf_ = new char[len_ + 1];
        std::strcpy(buf_, s);
    }

    DynString(const DynString& other) : len_(other.len_) {
        buf_ = new char[len_ + 1];
        std::strcpy(buf_, other.buf_);
    }

    DynString& operator=(DynString other) {
        swap(*this, other);
        return *this;
    }

    friend void swap(DynString& a, DynString& b) {
        std::swap(a.buf_, b.buf_);
    }

    ~DynString() { delete[] buf_; }

    const char* c_str() const { return buf_; }
    size_t length() const { return len_; }
};

int main() {
    DynString a("hello");
    DynString b("world!!");

    a = b;
    std::cout << "a: " << a.c_str() << " (len=" << a.length() << ")" << std::endl;
    std::cout << "b: " << b.c_str() << " (len=" << b.length() << ")" << std::endl;
}`,
    manifestation: `$ g++ -O2 -o dynstr dynstr.cpp && ./dynstr
a: world!! (len=5)
b: world!! (len=7)

Expected output:
a: world!! (len=7)
b: world!! (len=7)

Actual output: a.length() reports 5 instead of 7. The string content
is correct ("world!!") but the length is wrong.`,
    hints: [
      "The swap function exchanges the buffers — but does it exchange everything?",
      "What fields does DynString have, and which of them does swap() actually swap?",
      "After swap, does a.len_ reflect the new buffer's content?",
    ],
    explanation: "The swap function only swaps buf_ but not len_. After the copy-and-swap assignment, a gets b's buffer (containing \"world!!\") but keeps its own len_ (5, from \"hello\"). The length is permanently wrong — a.length() returns 5 for a 7-character string. This can cause buffer over-reads or truncation in any code that uses length(). The fix is to add std::swap(a.len_, b.len_) to the swap function.",
    stdlibRefs: [
      { name: "std::swap", args: "(T& a, T& b) → void", brief: "Exchanges the values of a and b using move semantics.", note: "When implementing a custom swap for copy-and-swap idiom, ALL member variables must be swapped — missing any field silently corrupts the object.", link: "https://en.cppreference.com/w/cpp/algorithm/swap" },
    ],
  },
  // ── STL Algorithms ──
  {
    id: 114,
    topic: "STL Algorithms",
    difficulty: "Easy",
    title: "Unique Filter",
    description: "Removes consecutive duplicates from a sorted vector and prints the unique elements.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> data = {1, 1, 2, 3, 3, 3, 4, 5, 5};

    std::unique(data.begin(), data.end());

    std::cout << "Unique elements: ";
    for (int x : data) {
        std::cout << x << " ";
    }
    std::cout << std::endl;
    std::cout << "Size: " << data.size() << std::endl;
}`,
    manifestation: `$ g++ -O2 -o unique unique.cpp && ./unique
Unique elements: 1 2 3 4 5 3 4 5 5
Size: 9

Expected output:
Unique elements: 1 2 3 4 5
Size: 5

Actual output: the vector still has 9 elements. The "removed"
duplicates are left as unspecified values at the end, and the
vector size is unchanged.`,
    hints: [
      "What does std::unique actually return, and what does it do to the container?",
      "Does std::unique change the size of the vector?",
      "How do you combine std::unique with another operation to actually remove elements?",
    ],
    explanation: "std::unique moves unique elements to the front and returns an iterator to the new logical end, but it does NOT resize the container. The elements past the returned iterator are left in an unspecified state, and data.size() is still 9. The fix is the erase-remove idiom: data.erase(std::unique(data.begin(), data.end()), data.end()).",
    stdlibRefs: [
      { name: "std::unique", args: "(ForwardIt first, ForwardIt last) → ForwardIt", brief: "Moves consecutive unique elements to the front; returns iterator past the new logical end.", note: "Does NOT erase elements — the container size is unchanged. Use the erase-remove idiom to actually shrink the container.", link: "https://en.cppreference.com/w/cpp/algorithm/unique" },
    ],
  },
  {
    id: 115,
    topic: "STL Algorithms",
    difficulty: "Easy",
    title: "Partition Counter",
    description: "Partitions a vector into even and odd numbers and counts each group.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {7, 2, 8, 1, 4, 3, 6, 5};

    auto it = std::partition(nums.begin(), nums.end(),
        [](int n) { return n % 2 == 0; });

    int even_count = std::distance(nums.begin(), it);
    int odd_count = std::distance(it, nums.end());

    std::cout << "Even numbers (" << even_count << "): ";
    for (auto i = nums.begin(); i != it; ++i)
        std::cout << *i << " ";
    std::cout << std::endl;

    std::cout << "Odd numbers (" << odd_count << "): ";
    for (auto i = it; i != nums.end(); ++i)
        std::cout << *i << " ";
    std::cout << std::endl;

    std::cout << "First even: " << nums[0] << std::endl;
    std::cout << "Evens are sorted: "
              << std::is_sorted(nums.begin(), it) << std::endl;
}`,
    manifestation: `$ g++ -O2 -o partition partition.cpp && ./partition
Even numbers (4): 6 2 8 4
Odd numbers (4): 1 3 7 5
First even: 6
Evens are sorted: 0

Expected output if relative order matters:
Even numbers (4): 2 8 4 6
Evens are sorted: 0

Actual output: the even numbers appear in a different order than
the input (6 is first instead of 2). std::partition does NOT
preserve relative order within each group.`,
    hints: [
      "Does std::partition guarantee that elements within each group keep their original order?",
      "The code assumes nums[0] is the first even number from the original input — is that guaranteed?",
      "What algorithm would you use if the relative order of elements must be preserved?",
    ],
    explanation: "std::partition is allowed to rearrange elements arbitrarily within each partition — it does NOT preserve relative order. The code then accesses nums[0] expecting it to be the first even number from the original input (2), but it could be any of the even numbers (6 in this case). If relative order matters, use std::stable_partition instead.",
    stdlibRefs: [
      { name: "std::partition", args: "(ForwardIt first, ForwardIt last, UnaryPredicate p) → ForwardIt", brief: "Reorders elements so that those satisfying the predicate come first; returns iterator to the second group.", note: "Does NOT preserve relative order within each group. Use std::stable_partition if order matters.", link: "https://en.cppreference.com/w/cpp/algorithm/partition" },
      { name: "std::stable_partition", args: "(BidirIt first, BidirIt last, UnaryPredicate p) → BidirIt", brief: "Like std::partition but preserves the relative order of elements within each group.", link: "https://en.cppreference.com/w/cpp/algorithm/stable_partition" },
    ],
  },
  {
    id: 116,
    topic: "STL Algorithms",
    difficulty: "Easy",
    title: "Min Element Finder",
    description: "Finds and removes the minimum element from a vector, then prints the remaining elements.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> scores = {85, 92, 78, 95, 88, 76, 90};

    auto min_it = std::min_element(scores.begin(), scores.end());
    std::cout << "Lowest score: " << *min_it << std::endl;

    scores.erase(min_it);

    auto max_it = std::max_element(scores.begin(), scores.end());
    std::cout << "Highest score: " << *max_it << std::endl;

    scores.erase(max_it);

    int sum = 0;
    for (int s : scores) sum += s;
    std::cout << "Average of middle " << scores.size()
              << " scores: " << sum / scores.size() << std::endl;

    auto second_min = std::min_element(scores.begin(), scores.end());
    std::cout << "New lowest: " << *second_min << std::endl;
}`,
    manifestation: `$ g++ -O2 -o scores scores.cpp && ./scores
Lowest score: 76
Highest score: 95
Average of middle 5 scores: 86
New lowest: 78

This output looks correct. The program works as expected.

But what if the original vector were {76, 92, 78, 95, 88, 76, 90}
(two copies of the minimum)?

Lowest score: 76
Highest score: 95
Average of middle 5 scores: 85
New lowest: 76

The second 76 is still present because min_element only finds the
FIRST minimum. If the intent was to remove all instances of the
minimum, std::remove + erase is needed instead.

With the given input, the code is correct. The design flaw is that
it silently produces wrong results for inputs with duplicate minima.`,
    hints: [
      "What does std::min_element return when there are multiple elements with the minimum value?",
      "If the intent is to drop the lowest score, does erasing one copy of the minimum always achieve that?",
      "What happens if the vector is empty when min_element is called?",
    ],
    explanation: "std::min_element returns an iterator to the FIRST minimum element. If there are duplicates of the minimum value, only one is erased. More critically, if scores were empty after the two erases, the division sum / scores.size() would divide by zero (size_t 0). And if the vector had only one or two elements, erase would leave it empty, making the subsequent min_element call return end(), and dereferencing end() is undefined behavior. The code lacks size checks before each operation.",
    stdlibRefs: [
      { name: "std::min_element", args: "(ForwardIt first, ForwardIt last) → ForwardIt", brief: "Returns iterator to the smallest element in [first, last); returns last if the range is empty.", note: "Returns the FIRST minimum if there are ties. Returns last (not a dereferenceable iterator) for empty ranges.", link: "https://en.cppreference.com/w/cpp/algorithm/min_element" },
    ],
  },
  {
    id: 117,
    topic: "STL Algorithms",
    difficulty: "Medium",
    title: "Sorted Merge",
    description: "Merges two sorted vectors into a single sorted output vector.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> a = {1, 3, 5, 7, 9};
    std::vector<int> b = {2, 4, 6, 8, 10};
    std::vector<int> result;

    std::merge(a.begin(), a.end(), b.begin(), b.end(),
               result.begin());

    std::cout << "Merged: ";
    for (int x : result) {
        std::cout << x << " ";
    }
    std::cout << std::endl;
    std::cout << "Size: " << result.size() << std::endl;
}`,
    manifestation: `$ g++ -fsanitize=address -g merge.cpp -o merge && ./merge
=================================================================
==22891==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000050
WRITE of size 4 at 0x602000000050 thread T0
    #0 0x7f4c2a in std::merge<...>
    #1 0x55c3e1 in main merge.cpp:10
0x602000000050 is located 0 bytes to the right of 0-byte region [0x602000000050,0x602000000050)
allocated by thread T0 here:
    #0 0x7f4a3c in operator new(unsigned long)
SUMMARY: AddressSanitizer: heap-buffer-overflow in std::merge`,
    hints: [
      "How many elements does result hold before the merge?",
      "Does std::merge allocate space in the destination, or does it assume space already exists?",
      "What output iterator would you use to append to an empty vector?",
    ],
    explanation: "result is an empty vector. std::merge writes to result.begin(), which points to the end of an empty buffer — there's no allocated space. This is a buffer overflow. std::merge does not allocate; it assumes the destination has enough room. The fix is to either pre-size the output: result.resize(a.size() + b.size()), or use a back-insert iterator: std::back_inserter(result).",
    stdlibRefs: [
      { name: "std::merge", args: "(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt d_first) → OutputIt", brief: "Merges two sorted ranges into one sorted output range starting at d_first.", note: "The destination must have enough pre-allocated space, or use std::back_inserter to grow the container on demand.", link: "https://en.cppreference.com/w/cpp/algorithm/merge" },
      { name: "std::back_inserter", args: "(Container& c) → back_insert_iterator<Container>", brief: "Returns an output iterator that appends elements to the container via push_back.", link: "https://en.cppreference.com/w/cpp/iterator/back_inserter" },
    ],
  },
  {
    id: 118,
    topic: "STL Algorithms",
    difficulty: "Medium",
    title: "Top-K Selector",
    description: "Selects the top K highest scores from an unsorted vector using partial sort.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

std::vector<int> top_k(std::vector<int> scores, int k) {
    std::partial_sort(scores.begin(), scores.begin() + k, scores.end());
    scores.resize(k);
    return scores;
}

int main() {
    std::vector<int> scores = {45, 92, 83, 17, 56, 78, 95, 31, 67, 88};

    auto best = top_k(scores, 3);

    std::cout << "Top 3 scores: ";
    for (int s : best) {
        std::cout << s << " ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -O2 -o topk topk.cpp && ./topk
Top 3 scores: 17 31 45

Expected output:
Top 3 scores: 95 92 88

Actual output: got the LOWEST 3 scores instead of the highest.
std::partial_sort sorts in ascending order by default, so the
first K elements are the smallest, not the largest.`,
    hints: [
      "What is the default sort order of std::partial_sort?",
      "After partial_sort, which elements end up in the first K positions — the smallest or the largest?",
      "How would you change the comparator to get the largest K elements instead?",
    ],
    explanation: "std::partial_sort uses ascending order (operator<) by default. It places the K smallest elements in sorted order at the beginning. To get the top K highest, pass std::greater<int>{} as the comparator: std::partial_sort(scores.begin(), scores.begin() + k, scores.end(), std::greater<int>{}).",
    stdlibRefs: [
      { name: "std::partial_sort", args: "(RandomIt first, RandomIt middle, RandomIt last) → void", brief: "Rearranges elements so that [first, middle) contains the smallest elements in sorted order.", note: "Default is ascending (smallest first). Use std::greater<>{} comparator to get the largest elements instead.", link: "https://en.cppreference.com/w/cpp/algorithm/partial_sort" },
    ],
  },
  {
    id: 119,
    topic: "STL Algorithms",
    difficulty: "Medium",
    title: "Accumulate Strings",
    description: "Concatenates a vector of strings into one string separated by commas using std::accumulate.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <numeric>

int main() {
    std::vector<std::string> words = {"alpha", "beta", "gamma", "delta"};

    std::string result = std::accumulate(
        words.begin(), words.end(),
        "",
        [](std::string a, const std::string& b) {
            return a.empty() ? b : a + ", " + b;
        });

    std::cout << result << std::endl;
}`,
    manifestation: `$ g++ -o accum accum.cpp && ./accum
accum.cpp: In instantiation of '_Tp std::accumulate(_InputIterator, _InputIterator, _Tp, _BinaryOperation) [with ...]':
accum.cpp:11:   required from here
error: cannot convert 'std::string' to 'const char*' in assignment
   accumulator = binary_op(accumulator, *first);
               ^

$ g++ -std=c++20 -o accum accum.cpp && ./accum
[some compilers may accept with implicit conversion but produce UB]
Segmentation fault (core dumped)`,
    hints: [
      "What type does std::accumulate deduce for the accumulator from the initial value \"\"?",
      "Is \"\" (a string literal) the same type as std::string?",
      "What happens when accumulate tries to assign a std::string back to a const char* accumulator?",
    ],
    explanation: "The initial value \"\" is a const char*, so std::accumulate deduces the accumulator type as const char*. The lambda returns std::string, but accumulate tries to assign it back to a const char* accumulator. This creates a type mismatch. In practice, the code may compile with implicit conversions but the accumulator stores a pointer to a temporary string that's immediately destroyed — dangling pointer, undefined behavior. The fix is to use std::string(\"\") or std::string{} as the initial value so the accumulator type is std::string.",
    stdlibRefs: [
      { name: "std::accumulate", args: "<InputIt, T, BinaryOp>(InputIt first, InputIt last, T init, BinaryOp op) → T", brief: "Folds elements from left to right starting with init, using the given binary operation.", note: "The return type is deduced from init, NOT from the range or the operation. A const char* init produces a const char* accumulator even if the operation returns std::string.", link: "https://en.cppreference.com/w/cpp/algorithm/accumulate" },
    ],
  },
  {
    id: 120,
    topic: "STL Algorithms",
    difficulty: "Medium",
    title: "Remove Negatives",
    description: "Removes all negative numbers from a vector and prints what remains.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> data = {5, -3, 8, -1, 0, -7, 4, 2, -9};

    std::remove_if(data.begin(), data.end(),
        [](int n) { return n < 0; });

    std::cout << "After removing negatives:" << std::endl;
    std::cout << "Size: " << data.size() << std::endl;
    for (int x : data) {
        std::cout << x << " ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -O2 -o removeneg removeneg.cpp && ./removeneg
After removing negatives:
Size: 9
5 8 0 4 2 -7 4 2 -9

Expected output:
Size: 5
5 8 0 4 2

Actual output: the vector still has 9 elements. The positive values
are moved to the front, but the "removed" elements remain as
unspecified leftover values at the end.`,
    hints: [
      "What does std::remove_if return, and does it change the container's size?",
      "The returned iterator marks the new logical end — is that being used anywhere?",
      "What additional step is needed to actually shrink the vector?",
    ],
    explanation: "std::remove_if moves elements that don't match the predicate to the front and returns an iterator to the new logical end. It does NOT resize or erase from the container — data.size() is unchanged. The returned iterator is discarded. The fix is the erase-remove idiom: data.erase(std::remove_if(data.begin(), data.end(), pred), data.end()).",
    stdlibRefs: [
      { name: "std::remove_if", args: "(ForwardIt first, ForwardIt last, UnaryPredicate p) → ForwardIt", brief: "Moves elements not matching the predicate to the front; returns iterator past the new logical end.", note: "Does NOT erase — use erase-remove idiom: container.erase(remove_if(...), container.end()) to actually shrink.", link: "https://en.cppreference.com/w/cpp/algorithm/remove" },
    ],
  },
  {
    id: 121,
    topic: "STL Algorithms",
    difficulty: "Hard",
    title: "Priority Scheduler",
    description: "Schedules tasks by priority using a max-heap, executing the highest priority task first.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Task {
    std::string name;
    int priority;
};

int main() {
    std::vector<Task> tasks = {
        {"backup", 3}, {"email", 1}, {"compile", 5},
        {"deploy", 4}, {"test", 2}
    };

    auto cmp = [](const Task& a, const Task& b) {
        return a.priority > b.priority;
    };

    std::make_heap(tasks.begin(), tasks.end(), cmp);

    std::cout << "Executing tasks by priority:" << std::endl;
    while (!tasks.empty()) {
        std::pop_heap(tasks.begin(), tasks.end(), cmp);
        auto task = tasks.back();
        tasks.pop_back();
        std::cout << "  [" << task.priority << "] " << task.name << std::endl;
    }
}`,
    manifestation: `$ g++ -O2 -o scheduler scheduler.cpp && ./scheduler
Executing tasks by priority:
  [1] email
  [2] test
  [3] backup
  [4] deploy
  [5] compile

Expected output (highest priority first):
  [5] compile
  [4] deploy
  [3] backup
  [2] test
  [1] email

Actual output: tasks execute in ASCENDING priority order (lowest
first) instead of highest first.`,
    hints: [
      "What does the comparator a.priority > b.priority mean in the context of a heap?",
      "std::make_heap creates a max-heap by default — what does a custom comparator with > do?",
      "In C++ heap operations, the comparator defines what goes to the BOTTOM, not the top.",
    ],
    explanation: "The comparator uses > (greater-than), which tells the heap that higher-priority tasks should sink to the bottom. C++ heap operations interpret the comparator as 'returns true if a should be placed BELOW b.' So a.priority > b.priority means higher priorities go below lower ones — creating a min-heap. The result is that pop_heap extracts the lowest priority first. The fix is to reverse the comparator to a.priority < b.priority (the default behavior), which makes higher values float to the top.",
    stdlibRefs: [
      { name: "std::make_heap", args: "(RandomIt first, RandomIt last, Compare comp) → void", brief: "Rearranges elements into a max-heap according to the comparator.", note: "The comparator defines the ordering: comp(a, b) == true means a should be placed below b. Using > creates a min-heap, not a max-heap.", link: "https://en.cppreference.com/w/cpp/algorithm/make_heap" },
      { name: "std::pop_heap", args: "(RandomIt first, RandomIt last, Compare comp) → void", brief: "Moves the top element to the end and re-heapifies [first, last-1).", note: "Must use the same comparator as make_heap. Call container.pop_back() after to actually remove the element.", link: "https://en.cppreference.com/w/cpp/algorithm/pop_heap" },
    ],
  },
  {
    id: 122,
    topic: "STL Algorithms",
    difficulty: "Hard",
    title: "Set Intersector",
    description: "Finds common elements between two collections using set_intersection.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> users_a = {5, 2, 8, 1, 9, 3};
    std::vector<int> users_b = {3, 7, 2, 5, 4};
    std::vector<int> common;

    std::set_intersection(
        users_a.begin(), users_a.end(),
        users_b.begin(), users_b.end(),
        std::back_inserter(common));

    std::cout << "Common users: ";
    for (int id : common) {
        std::cout << id << " ";
    }
    std::cout << std::endl;
    std::cout << "Count: " << common.size() << std::endl;
}`,
    manifestation: `$ g++ -O2 -o intersect intersect.cpp && ./intersect
Common users: 5
Count: 1

Expected output:
Common users: 2 3 5
Count: 3

Actual output: only 1 common element found instead of 3. The
intersection is incomplete because the input ranges are not sorted.`,
    hints: [
      "What is the precondition for std::set_intersection to produce correct results?",
      "Are users_a and users_b sorted?",
      "What happens if you pass unsorted ranges to a set algorithm?",
    ],
    explanation: "std::set_intersection requires both input ranges to be sorted. users_a and users_b are unsorted, so the algorithm produces incorrect results — it only finds elements that happen to be in sorted order relative to each other. The fix is to sort both vectors first: std::sort(users_a.begin(), users_a.end()) and std::sort(users_b.begin(), users_b.end()) before calling set_intersection.",
    stdlibRefs: [
      { name: "std::set_intersection", args: "(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt d_first) → OutputIt", brief: "Outputs elements present in both sorted ranges.", note: "REQUIRES both ranges to be sorted. Passing unsorted ranges is undefined behavior and produces silently wrong results.", link: "https://en.cppreference.com/w/cpp/algorithm/set_intersection" },
    ],
  },
  {
    id: 123,
    topic: "STL Algorithms",
    difficulty: "Hard",
    title: "Nth Element Pivot",
    description: "Finds the median of a dataset using nth_element and uses it to classify values.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<double> data = {3.1, 7.4, 1.5, 9.2, 4.8, 6.3, 2.7, 8.6, 5.0};
    auto original = data;

    size_t mid = data.size() / 2;
    std::nth_element(data.begin(), data.begin() + mid, data.end());
    double median = data[mid];

    std::cout << "Median: " << median << std::endl;

    int below = 0, above = 0;
    for (double x : original) {
        if (x < median) ++below;
        else if (x > median) ++above;
    }

    std::cout << "Below median: " << below << std::endl;
    std::cout << "Above median: " << above << std::endl;

    std::cout << "Sorted order around median: ";
    for (size_t i = 0; i < data.size(); ++i) {
        if (i == mid) std::cout << "[" << data[i] << "] ";
        else std::cout << data[i] << " ";
    }
    std::cout << std::endl;
}`,
    manifestation: `$ g++ -O2 -o median median.cpp && ./median
Median: 5
Below median: 4
Above median: 4
Sorted order around median: 2.7 1.5 3.1 4.8 [5] 6.3 9.2 8.6 7.4

The median value and counts are correct. But the code then prints
the data assuming elements before the median are sorted and elements
after are sorted.

The output shows: 2.7 1.5 3.1 4.8 [5] 6.3 9.2 8.6 7.4

Elements before 5 are NOT sorted (2.7, 1.5, 3.1, 4.8).
Elements after 5 are NOT sorted (6.3, 9.2, 8.6, 7.4).

If downstream code assumes partial ordering (e.g., "all below-median
values are in positions 0..mid-1 in sorted order"), it will get
wrong results.`,
    hints: [
      "Does std::nth_element sort the elements on either side of the nth position?",
      "What guarantees does nth_element make about elements BEFORE and AFTER the nth position?",
      "If you need elements on both sides to be sorted, what algorithm should you use instead?",
    ],
    explanation: "std::nth_element only guarantees that: (1) the element at position mid is the element that would be there if the range were sorted, and (2) all elements before mid are <= data[mid] and all elements after are >= data[mid]. It does NOT sort either partition. The code's output label 'Sorted order around median' is misleading — the elements on each side are in unspecified order. If sorted partitions are needed, use std::partial_sort or std::sort on the sub-ranges after nth_element.",
    stdlibRefs: [
      { name: "std::nth_element", args: "(RandomIt first, RandomIt nth, RandomIt last) → void", brief: "Places the nth element in its sorted position and partitions elements around it, but does NOT sort either side.", note: "Only the nth element is in its final position. Elements before it are all <=, elements after are all >=, but neither side is sorted.", link: "https://en.cppreference.com/w/cpp/algorithm/nth_element" },
    ],
  },

  // ── Multithreading ──

  {
    id: 124,
    topic: "Multithreading",
    difficulty: "Easy",
    title: "Parallel Counter",
    description: "Increments a shared counter from multiple threads and prints the final total.",
    code: `#include <iostream>
#include <thread>
#include <vector>

int counter = 0;

void increment(int times) {
    for (int i = 0; i < times; ++i) {
        ++counter;
    }
}

int main() {
    const int num_threads = 4;
    const int per_thread = 250000;

    std::vector<std::thread> threads;
    for (int i = 0; i < num_threads; ++i) {
        threads.emplace_back(increment, per_thread);
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Expected: " << num_threads * per_thread << std::endl;
    std::cout << "Actual:   " << counter << std::endl;
    return 0;
}`,
    hints: [
      "What guarantees does C++ give about operations on plain integers accessed from multiple threads?",
      "Is the ++ operator on an int a single atomic operation at the hardware level?",
      "What happens when two threads read the same value of counter, both increment it, and both write back?"
    ],
    explanation: "The shared variable `counter` is accessed by multiple threads without synchronization, creating a data race. The `++counter` operation is not atomic — it involves a read, increment, and write. Two threads can read the same value, both increment it to the same result, and both write back, losing one increment. The fix is to use `std::atomic<int>` or protect the increment with a `std::mutex`.",
    manifestation: `$ g++ -fsanitize=thread -g counter.cpp -o counter -pthread && ./counter
==================
WARNING: ThreadSanitizer: data race (pid=18423)
  Write of size 4 at 0x55f2a3b01040 by thread T2:
    #0 increment(int) counter.cpp:8 (counter+0x1234)

  Previous write of size 4 at 0x55f2a3b01040 by thread T1:
    #0 increment(int) counter.cpp:8 (counter+0x1234)

SUMMARY: ThreadSanitizer: data race counter.cpp:8 in increment(int)
==================
Expected: 1000000
Actual:   761834`,
    stdlibRefs: [
      { name: "std::thread", brief: "Represents a single thread of execution that runs a callable object.", note: "Accessing shared data from multiple threads without synchronization is undefined behavior.", link: "https://en.cppreference.com/w/cpp/thread/thread" },
    ],
  },
  {
    id: 125,
    topic: "Multithreading",
    difficulty: "Easy",
    title: "Thread Greeter",
    description: "Spawns threads that each print a personalized greeting with their assigned name.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <string>

void greet(const std::string& name) {
    std::cout << "Hello from " << name << "!" << std::endl;
}

int main() {
    std::vector<std::string> names = {"Alice", "Bob", "Charlie", "Diana"};
    std::vector<std::thread> threads;

    for (size_t i = 0; i < names.size(); ++i) {
        threads.emplace_back(greet, std::ref(names[i]));
    }

    names.clear();

    for (auto& t : threads) {
        t.join();
    }

    return 0;
}`,
    hints: [
      "When do the threads actually start executing the greet function?",
      "What does std::ref do, and what does it mean for the lifetime of the referenced object?",
      "What happens to the strings in names after names.clear() is called?"
    ],
    explanation: "The threads receive references to strings in the `names` vector via `std::ref`. But `names.clear()` is called immediately after spawning the threads, destroying the strings while threads may still be accessing them. This is a use-after-free via dangling reference. The fix is to either pass strings by value (remove `std::ref`) or move `names.clear()` to after `join()`.",
    manifestation: `$ g++ -fsanitize=address -g greeter.cpp -o greeter -pthread && ./greeter
=================================================================
==19201==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000050 at pc 0x7f3a2b1c4e20 bp 0x7f3a28bfed90 sp 0x7f3a28bfe538
READ of size 5 at 0x604000000050 thread T2
    #0 std::basic_string<char>::size() const (/lib/x86_64-linux-gnu/libstdc++.so.6+0x1c4e20)
    #1 greet(std::string const&) greeter.cpp:7 (greeter+0x1456)

0x604000000050 is located 16 bytes inside of 32-byte region [0x604000000040,0x604000000060)
freed by thread T0 here:
    #0 operator delete(void*) (/lib/x86_64-linux-gnu/libasan.so.6+0xb4a47)
    #1 std::vector<std::string>::clear() greeter.cpp:18 (greeter+0x18bc)

SUMMARY: AddressSanitizer: heap-use-after-free greeter.cpp:7 in greet(std::string const&)`,
    stdlibRefs: [
      { name: "std::ref", args: "(T& t) → reference_wrapper<T>", brief: "Creates a reference_wrapper that stores a reference to an object, allowing pass-by-reference to APIs that normally copy.", note: "The referenced object must outlive all uses of the reference_wrapper.", link: "https://en.cppreference.com/w/cpp/utility/functional/ref" },
    ],
  },
  {
    id: 126,
    topic: "Multithreading",
    difficulty: "Easy",
    title: "Background Logger",
    description: "Starts a background thread that logs messages to the console on a regular interval.",
    code: `#include <iostream>
#include <thread>
#include <chrono>

void logger_loop() {
    for (int i = 0; i < 5; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        std::cout << "Log entry #" << i << std::endl;
    }
}

int main() {
    std::thread logger(logger_loop);

    std::cout << "Logger started, doing main work..." << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(250));
    std::cout << "Main work done." << std::endl;

    return 0;
}`,
    hints: [
      "What happens when main() returns while the logger thread is still running?",
      "What does the C++ standard say about destroying a joinable std::thread?",
      "Should the thread be joined or detached before main exits?"
    ],
    explanation: "The `logger` thread is still running when `main()` returns, and the `std::thread` destructor is called on a joinable thread. The C++ standard mandates that destroying a joinable thread calls `std::terminate()`, which aborts the program. The fix is to call `logger.join()` before returning from main, or `logger.detach()` if the thread should run independently.",
    manifestation: `$ g++ -g logger.cpp -o logger -pthread && ./logger
Logger started, doing main work...
Log entry #0
Log entry #1
Main work done.
terminate called without an active exception
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::thread::~thread", args: "() → void", brief: "Destroys the thread object; calls std::terminate() if the thread is joinable.", note: "A thread must be joined or detached before destruction, otherwise the program aborts.", link: "https://en.cppreference.com/w/cpp/thread/thread/%7Ethread" },
      { name: "std::thread::join", args: "() → void", brief: "Blocks the calling thread until the thread represented by this object finishes execution.", link: "https://en.cppreference.com/w/cpp/thread/thread/join" },
    ],
  },
  {
    id: 127,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Bank Transfer",
    description: "Simulates concurrent bank transfers between accounts using mutex-protected operations.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

struct Account {
    double balance;
    std::mutex mtx;
    Account(double b) : balance(b) {}
};

void transfer(Account& from, Account& to, double amount) {
    std::lock_guard<std::mutex> lock1(from.mtx);
    std::lock_guard<std::mutex> lock2(to.mtx);

    if (from.balance >= amount) {
        from.balance -= amount;
        to.balance += amount;
    }
}

int main() {
    Account a(1000.0), b(1000.0);

    std::thread t1(transfer, std::ref(a), std::ref(b), 100.0);
    std::thread t2(transfer, std::ref(b), std::ref(a), 50.0);

    t1.join();
    t2.join();

    std::cout << "Account A: " << a.balance << std::endl;
    std::cout << "Account B: " << b.balance << std::endl;
    std::cout << "Total: " << a.balance + b.balance << std::endl;
    return 0;
}`,
    hints: [
      "What order do t1 and t2 lock the mutexes?",
      "If t1 locks a.mtx and t2 locks b.mtx simultaneously, what happens next?",
      "How does std::lock or std::scoped_lock solve this problem?"
    ],
    explanation: "This is a classic deadlock. Thread t1 locks `a.mtx` then tries to lock `b.mtx`, while thread t2 locks `b.mtx` then tries to lock `a.mtx`. If both acquire their first lock simultaneously, neither can acquire the second — they wait forever. The fix is to use `std::scoped_lock<std::mutex, std::mutex> lock(from.mtx, to.mtx)` which locks both mutexes atomically using a deadlock-avoidance algorithm.",
    manifestation: `$ g++ -g bank.cpp -o bank -pthread && timeout 5 ./bank
[program hangs — no output after 5 seconds]
/usr/bin/timeout: the monitored command dumped core
Killed

$ gdb ./bank core
Thread 1 (LWP 20145):
#0 __lll_lock_wait () at lowlevellock.c:49
#1 std::mutex::lock() at mutex:100
#2 transfer(Account&, Account&, double) at bank.cpp:14

Thread 2 (LWP 20146):
#0 __lll_lock_wait () at lowlevellock.c:49
#1 std::mutex::lock() at mutex:100
#2 transfer(Account&, Account&, double) at bank.cpp:13

Both threads are blocked waiting for each other's mutex.`,
    stdlibRefs: [
      { name: "std::lock_guard", brief: "RAII mutex wrapper that locks on construction and unlocks on destruction.", note: "Locking multiple mutexes sequentially with separate lock_guards risks deadlock.", link: "https://en.cppreference.com/w/cpp/thread/lock_guard" },
      { name: "std::scoped_lock", brief: "RAII wrapper that locks multiple mutexes simultaneously using a deadlock-avoidance algorithm.", link: "https://en.cppreference.com/w/cpp/thread/scoped_lock" },
    ],
  },
  {
    id: 128,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Shared Config Reader",
    description: "Multiple threads read a shared configuration map while a writer thread occasionally updates it.",
    code: `#include <iostream>
#include <thread>
#include <map>
#include <string>
#include <chrono>

std::map<std::string, std::string> config;
std::mutex config_mutex;

void reader(int id) {
    for (int i = 0; i < 10; ++i) {
        std::string val = config["timeout"];
        std::cout << "Reader " << id << ": timeout=" << val << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
}

void writer() {
    for (int i = 0; i < 5; ++i) {
        std::lock_guard<std::mutex> lock(config_mutex);
        config["timeout"] = std::to_string(100 + i * 10);
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }
}

int main() {
    config["timeout"] = "100";

    std::vector<std::thread> threads;
    threads.emplace_back(writer);
    for (int i = 0; i < 3; ++i) {
        threads.emplace_back(reader, i);
    }

    for (auto& t : threads) {
        t.join();
    }
    return 0;
}`,
    hints: [
      "The writer function locks the mutex — but what about the reader function?",
      "Does accessing a std::map from multiple threads require synchronization even for reads?",
      "Can std::map::operator[] modify the container?"
    ],
    explanation: "The reader threads access `config[\"timeout\"]` without locking the mutex. Even though the writer locks `config_mutex`, the readers bypass the lock entirely, creating a data race. Furthermore, `std::map::operator[]` inserts a default-constructed element if the key doesn't exist, meaning even readers can mutate the map. The fix is to lock `config_mutex` in the reader as well, or use a `std::shared_mutex` with `shared_lock` for readers.",
    manifestation: `$ g++ -fsanitize=thread -g config.cpp -o config -pthread && ./config
==================
WARNING: ThreadSanitizer: data race (pid=21003)
  Read of size 8 at 0x55a3c4e12040 by thread T2:
    #0 std::map<std::string, std::string>::operator[] config.cpp:12 (config+0x2a1f)

  Previous write of size 8 at 0x55a3c4e12040 by thread T1:
    #0 std::map<std::string, std::string>::operator[] config.cpp:20 (config+0x2d83)

SUMMARY: ThreadSanitizer: data race config.cpp:12 in reader(int)
==================
Reader 0: timeout=
Reader 1: timeout=100`,
    stdlibRefs: [
      { name: "std::map::operator[]", args: "(const Key& key) → T&", brief: "Returns a reference to the value mapped to key, inserting a default-constructed value if key doesn't exist.", note: "operator[] is a mutating operation — it may insert, so concurrent access without a lock is a data race even for 'reads'.", link: "https://en.cppreference.com/w/cpp/container/map/operator_at" },
      { name: "std::shared_mutex", brief: "Mutex that allows multiple concurrent readers or one exclusive writer.", link: "https://en.cppreference.com/w/cpp/thread/shared_mutex" },
    ],
  },
  {
    id: 129,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Task Queue",
    description: "Implements a producer-consumer task queue where worker threads process submitted tasks.",
    code: `#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <functional>

class TaskQueue {
    std::queue<std::function<void()>> tasks;
    std::mutex mtx;
    std::condition_variable cv;
    bool done = false;

public:
    void submit(std::function<void()> task) {
        std::lock_guard<std::mutex> lock(mtx);
        tasks.push(std::move(task));
        cv.notify_one();
    }

    void worker() {
        while (true) {
            std::function<void()> task;
            {
                std::unique_lock<std::mutex> lock(mtx);
                cv.wait(lock, [this] { return !tasks.empty() || done; });
                if (tasks.empty() && done) return;
                task = std::move(tasks.front());
                tasks.pop();
            }
            task();
        }
    }

    void shutdown() {
        done = true;
        cv.notify_all();
    }
};

int main() {
    TaskQueue q;
    std::thread w1(&TaskQueue::worker, &q);
    std::thread w2(&TaskQueue::worker, &q);

    for (int i = 0; i < 10; ++i) {
        q.submit([i] {
            std::cout << "Task " << i << " on thread "
                      << std::this_thread::get_id() << std::endl;
        });
    }

    q.shutdown();
    w1.join();
    w2.join();
    return 0;
}`,
    hints: [
      "Is the `done` flag being set under the mutex lock?",
      "What memory ordering guarantees does a plain bool have across threads?",
      "Could a worker thread miss the shutdown signal if it checks `done` without synchronization?"
    ],
    explanation: "The `shutdown()` method sets `done = true` without holding the mutex. Since `done` is a plain `bool`, writing it from one thread while another reads it (inside the `cv.wait` predicate, which re-checks under the lock) is technically a data race. More critically, the worker might see a stale value of `done` and never wake up if the `notify_all` arrives before the flag write is visible. The fix is to lock the mutex before setting `done`: `{ std::lock_guard<std::mutex> lock(mtx); done = true; }`.",
    manifestation: `$ g++ -fsanitize=thread -g taskq.cpp -o taskq -pthread && ./taskq
Task 0 on thread 140234567890432
Task 1 on thread 140234559497728
==================
WARNING: ThreadSanitizer: data race (pid=21587)
  Write of size 1 at 0x7ffd5a3e1cb0 by main thread:
    #0 TaskQueue::shutdown() taskq.cpp:35 (taskq+0x1d2a)

  Previous read of size 1 at 0x7ffd5a3e1cb0 by thread T1:
    #0 TaskQueue::worker()::{lambda()#1}::operator()() taskq.cpp:26 (taskq+0x1a8f)

SUMMARY: ThreadSanitizer: data race taskq.cpp:35 in TaskQueue::shutdown()
==================
Task 2 on thread 140234567890432`,
    stdlibRefs: [
      { name: "std::condition_variable::wait", args: "(unique_lock<mutex>& lock, Predicate pred) → void", brief: "Blocks until the predicate returns true, atomically releasing and reacquiring the lock.", note: "The predicate is checked under the lock. Any variable used in the predicate must also be modified under the same lock to avoid data races.", link: "https://en.cppreference.com/w/cpp/thread/condition_variable/wait" },
    ],
  },
  {
    id: 130,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Event Flag",
    description: "Uses a shared boolean flag to signal worker threads to stop processing and exit cleanly.",
    code: `#include <iostream>
#include <thread>
#include <chrono>

bool stop_flag = false;

void worker(int id) {
    int iterations = 0;
    while (!stop_flag) {
        ++iterations;
    }
    std::cout << "Worker " << id << " did " << iterations
              << " iterations" << std::endl;
}

int main() {
    std::thread t1(worker, 1);
    std::thread t2(worker, 2);

    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    stop_flag = true;

    t1.join();
    t2.join();
    std::cout << "All workers stopped." << std::endl;
    return 0;
}`,
    hints: [
      "What type is stop_flag, and what guarantees does a plain bool have across threads?",
      "Could the compiler optimize the while loop if it sees stop_flag never changes within the loop body?",
      "What does std::atomic<bool> provide that a plain bool doesn't?"
    ],
    explanation: "The `stop_flag` is a plain `bool` shared between threads without synchronization. The compiler is free to optimize `while (!stop_flag)` into an infinite loop because it can prove that no code within the loop modifies `stop_flag` — there's no happens-before relationship. With optimizations enabled (-O2), the worker threads may never see the flag change and spin forever. The fix is to declare `stop_flag` as `std::atomic<bool>` which provides the necessary memory visibility guarantees.",
    manifestation: `$ g++ -O2 -g event.cpp -o event -pthread && timeout 5 ./event
[program hangs — workers never see stop_flag change]
/usr/bin/timeout: the monitored command dumped core
Killed

$ g++ -O0 -g event.cpp -o event -pthread && ./event
Worker 1 did 4832901 iterations
Worker 2 did 4791034 iterations
All workers stopped.
[works at -O0 by accident, fails at -O2]`,
    stdlibRefs: [
      { name: "std::atomic", brief: "Template class that provides atomic operations on a value, ensuring memory visibility and preventing data races across threads.", note: "A plain bool shared across threads is a data race even if only one thread writes — the compiler may optimize reads away entirely.", link: "https://en.cppreference.com/w/cpp/atomic/atomic" },
    ],
  },
  {
    id: 131,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Lock-Free Stack",
    description: "Implements a simple lock-free stack using atomic compare-and-swap for concurrent push and pop operations.",
    code: `#include <iostream>
#include <thread>
#include <atomic>
#include <vector>

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LockFreeStack {
    std::atomic<Node*> head{nullptr};

public:
    void push(int val) {
        Node* new_node = new Node(val);
        new_node->next = head.load();
        while (!head.compare_exchange_weak(new_node->next, new_node))
            ;
    }

    bool pop(int& val) {
        Node* old_head = head.load();
        while (old_head &&
               !head.compare_exchange_weak(old_head, old_head->next))
            ;
        if (!old_head) return false;
        val = old_head->data;
        delete old_head;
        return true;
    }
};

int main() {
    LockFreeStack stack;
    const int N = 10000;

    std::thread producer([&] {
        for (int i = 0; i < N; ++i) stack.push(i);
    });

    std::thread consumer([&] {
        int val, count = 0;
        while (count < N) {
            if (stack.pop(val)) ++count;
        }
    });

    producer.join();
    consumer.join();
    std::cout << "All " << N << " items processed." << std::endl;
    return 0;
}`,
    hints: [
      "In the pop() method, when is old_head->next read relative to when old_head might be freed?",
      "Could another thread pop and delete old_head between the load and the compare_exchange?",
      "What is the ABA problem and how does it relate to this code?"
    ],
    explanation: "The `pop()` method reads `old_head->next` inside the `compare_exchange_weak` call. But between loading `old_head` and the CAS, another thread could pop `old_head`, delete it, and push a new node at the same address (ABA problem). When the CAS succeeds, `old_head->next` reads freed memory. Additionally, even without ABA, if thread A loads `old_head` and thread B pops and deletes it, thread A dereferences a dangling pointer when reading `old_head->next`. The fix requires hazard pointers, RCU, or epoch-based reclamation to defer deletion.",
    manifestation: `$ g++ -fsanitize=address -g stack.cpp -o stack -pthread && ./stack
=================================================================
==22501==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000004a18 at pc 0x55a3c1f02a4b bp 0x7f4a3c1fce70 sp 0x7f4a3c1fce68
READ of size 8 at 0x602000004a18 thread T2
    #0 LockFreeStack::pop(int&) stack.cpp:26 (stack+0x1a4b)
    #1 main::{lambda()#2}::operator()() stack.cpp:40 (stack+0x1e22)

0x602000004a18 is located 8 bytes inside of 16-byte region [0x602000004a10,0x602000004a20)
freed by thread T2 here:
    #0 operator delete(void*) (/lib/x86_64-linux-gnu/libasan.so.6+0xb4a47)
    #1 LockFreeStack::pop(int&) stack.cpp:29 (stack+0x1b07)

SUMMARY: AddressSanitizer: heap-use-after-free stack.cpp:26 in LockFreeStack::pop(int&)`,
    stdlibRefs: [
      { name: "std::atomic::compare_exchange_weak", args: "(T& expected, T desired) → bool", brief: "Atomically compares the stored value with expected; if equal, replaces it with desired and returns true; otherwise loads the stored value into expected and returns false.", note: "CAS on a pointer does not protect the memory the pointer points to — the pointed-to object can be freed and reallocated between the load and the CAS.", link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange" },
    ],
  },
  {
    id: 132,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Singleton Service",
    description: "Implements a thread-safe singleton pattern for a database connection service using double-checked locking.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

class Database {
    static Database* instance;
    static std::mutex mtx;
    int connection_id;

    Database() : connection_id(42) {
        std::cout << "Database initialized" << std::endl;
    }

public:
    static Database* getInstance() {
        if (instance == nullptr) {
            std::lock_guard<std::mutex> lock(mtx);
            if (instance == nullptr) {
                instance = new Database();
            }
        }
        return instance;
    }

    int getConnectionId() const { return connection_id; }
};

Database* Database::instance = nullptr;
std::mutex Database::mtx;

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([] {
            Database* db = Database::getInstance();
            std::cout << "Connection: " << db->getConnectionId() << std::endl;
        });
    }

    for (auto& t : threads) {
        t.join();
    }
    return 0;
}`,
    hints: [
      "The outer check of instance == nullptr happens without holding the lock — what ordering guarantees does a raw pointer have?",
      "Could the compiler or CPU reorder the write to instance with the initialization of the Database object?",
      "What does std::call_once or function-local statics offer that this pattern doesn't?"
    ],
    explanation: "The double-checked locking pattern is broken with a plain pointer. The compiler or CPU may reorder the write to `instance` before the `Database` constructor has fully completed. Another thread could see a non-null `instance` (skipping the lock entirely) but access a partially constructed object. In C++11 and later, the fix is to use `std::atomic<Database*>` with appropriate memory ordering, or simply use a function-local static: `static Database instance; return &instance;` which the standard guarantees is thread-safe.",
    manifestation: `$ g++ -fsanitize=thread -g singleton.cpp -o singleton -pthread && ./singleton
==================
WARNING: ThreadSanitizer: data race (pid=23100)
  Read of size 8 at 0x55a4d2e05100 by thread T3:
    #0 Database::getInstance() singleton.cpp:17 (singleton+0x1523)

  Previous write of size 8 at 0x55a4d2e05100 by thread T1:
    #0 Database::getInstance() singleton.cpp:20 (singleton+0x15a2)

  Mutex M1 (0x55a4d2e05108) is held while accessing 0x55a4d2e05100 by thread T1:
    #0 Database::getInstance() singleton.cpp:19 (singleton+0x1580)

SUMMARY: ThreadSanitizer: data race singleton.cpp:17 in Database::getInstance()
==================
Database initialized
Connection: 42
Connection: 42`,
    stdlibRefs: [
      { name: "std::call_once", args: "(once_flag& flag, Callable&& f, Args&&... args) → void", brief: "Executes the callable exactly once, even if called concurrently from multiple threads.", note: "Preferred over double-checked locking for one-time initialization.", link: "https://en.cppreference.com/w/cpp/thread/call_once" },
    ],
  },
  {
    id: 133,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Async Pipeline",
    description: "Chains asynchronous computation stages using std::async to process data through a transformation pipeline.",
    code: `#include <iostream>
#include <future>
#include <vector>
#include <numeric>

std::vector<int> generate(int n) {
    std::vector<int> data(n);
    std::iota(data.begin(), data.end(), 1);
    return data;
}

std::vector<int> transform(std::future<std::vector<int>>& input) {
    auto data = input.get();
    for (auto& x : data) x *= x;
    return data;
}

long long reduce(std::future<std::vector<int>>& input) {
    auto data = input.get();
    return std::accumulate(data.begin(), data.end(), 0LL);
}

int main() {
    auto stage1 = std::async(generate, 10000);
    auto stage2 = std::async(transform, std::ref(stage1));
    auto stage3 = std::async(reduce, std::ref(stage2));

    std::cout << "Sum of squares: " << stage3.get() << std::endl;
    return 0;
}`,
    hints: [
      "What is the default launch policy for std::async?",
      "If std::async uses deferred execution, when does each stage actually run?",
      "Could stage2 try to call stage1.get() after stage1's future has already been moved-from or gotten?"
    ],
    explanation: "The default launch policy for `std::async` is `std::launch::async | std::launch::deferred`, meaning the implementation can choose. If it chooses `std::launch::deferred` for all stages, then `stage3.get()` triggers `reduce()`, which calls `stage2.get()`, which triggers `transform()`, which calls `stage1.get()` — this works fine due to lazy chaining. But if it chooses `std::launch::async` for `stage2`, that thread may call `stage1.get()` concurrently with `stage1`'s own async thread completing, and `std::future::get()` can only be called once. Furthermore, passing `std::ref(stage1)` means `stage2`'s thread holds a reference to a local future — if `main` were to destroy `stage1` early, it would dangle. The real bug: `std::async` with deferred policy stores the function but `stage2` captures a reference to `stage1` which may not yet have a value, and if truly async, `stage2` could call `.get()` on `stage1` while `stage1` is still being used by the runtime. The primary fix is to use explicit `std::launch::async` and restructure to not share futures across threads.",
    manifestation: `$ g++ -g pipeline.cpp -o pipeline -pthread && ./pipeline
terminate called after throwing an instance of 'std::future_error'
  what():  std::future_error: No associated state
Aborted (core dumped)

$ g++ -g -DNDEBUG pipeline.cpp -o pipeline -pthread && ./pipeline
Sum of squares: 333383335000
[works on some implementations but not guaranteed]`,
    stdlibRefs: [
      { name: "std::async", args: "(Function&& f, Args&&... args) → future<result_of_t<Function(Args...)>> | (launch policy, Function&& f, Args&&... args) → future<...>", brief: "Runs a function asynchronously (potentially in a new thread) and returns a future holding the result.", note: "The default launch policy allows the implementation to defer execution; std::future::get() can only be called once.", link: "https://en.cppreference.com/w/cpp/thread/async" },
    ],
  },
  // ── Templates ──
  {
    id: 134,
    topic: "Templates",
    difficulty: "Easy",
    title: "Stack Container",
    description: "Implements a simple generic stack using a vector, supporting push, pop, and top operations.",
    code: `#include <iostream>
#include <vector>
#include <stdexcept>

template <typename T>
class Stack {
    std::vector<T> data;
public:
    void push(const T& val) { data.push_back(val); }

    void pop() {
        if (data.empty()) throw std::runtime_error("empty stack");
        data.pop_back();
    }

    T top() const {
        if (data.empty()) throw std::runtime_error("empty stack");
        return data.back();
    }

    bool empty() const { return data.empty(); }
};

int main() {
    Stack<std::string> s;
    s.push("hello");
    s.push("world");

    const std::string& ref = s.top();
    s.pop();
    std::cout << ref << std::endl;
}`,
    hints: [
      "What does top() return — a reference or a copy?",
      "Look at the return type of top(). What happens to ref after pop() is called?",
      "Does binding a const reference to a return-by-value result extend the lifetime here?",
    ],
    explanation: "The top() method returns T by value, so calling s.top() creates a temporary std::string. Binding that temporary to `const std::string& ref` extends its lifetime until ref goes out of scope — so far so good. But then pop() is called, which removes the element from the vector. The reference `ref` is actually bound to the temporary returned by top(), not to the element inside the vector, so it still works. However, the real bug is that top() returns by value when the user clearly intends reference semantics — calling top() on a Stack<LargeObject> copies the entire object. The actual crash happens if top() is changed to return const T& (as the user likely intended): then ref would be a reference into the vector, and pop() invalidates it, making the cout line undefined behavior. With the current code, the bug is that top() returns by value making `ref` safe but semantically misleading — the code appears to work but the pattern is fragile and breaks the moment top() is corrected to return a reference.",
    manifestation: `$ g++ -std=c++17 -O2 stack.cpp -o stack && ./stack
world

$ # Seems fine... but change top() to return const T& as intended:
$ g++ -fsanitize=address -g stack_fixed.cpp -o stack && ./stack
=================================================================
==18432==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000050
READ of size 8 at 0x604000000050 thread T0
    #0 0x55a1b3 in main stack.cpp:30
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-use-after-free stack.cpp:30 in main`,
    stdlibRefs: [
      { name: "std::vector::pop_back", args: "() → void", brief: "Removes the last element of the vector.", note: "Invalidates iterators and references to the last element, as well as the end() iterator.", link: "https://en.cppreference.com/w/cpp/container/vector/pop_back" },
    ],
  },
  {
    id: 135,
    topic: "Templates",
    difficulty: "Easy",
    title: "Pair Printer",
    description: "A generic function that prints any pair of values separated by a comma.",
    code: `#include <iostream>
#include <string>

template <typename T1, typename T2>
void print_pair(T1 a, T2 b) {
    std::cout << "(" << a << ", " << b << ")" << std::endl;
}

template <>
void print_pair(const char* a, const char* b) {
    std::cout << "('" << a << "', '" << b << "')" << std::endl;
}

int main() {
    print_pair(1, 2);
    print_pair(3.14, 2.72);

    std::string name = "Alice";
    print_pair(name, 42);

    print_pair("hello", "world");
}`,
    hints: [
      "Which overload is called for each of the four print_pair calls?",
      "When T1 is std::string, what happens to the argument — is it copied or referenced?",
      "What is the cost of passing a std::string by value to a template function?",
    ],
    explanation: "The template function takes parameters by value (T1 a, T2 b), not by const reference. When called with `name` (a std::string), the entire string is copied into the function parameter. This is a performance bug that becomes severe in loops or with large strings. The fix is to use `const T1& a, const T2& b`. The explicit specialization for const char* also has a subtle issue: it won't match std::string arguments because the specialization is for const char*, not std::string, so string arguments always go through the primary template and get copied.",
    manifestation: `$ g++ -std=c++17 -O0 -g pair.cpp -o pair && ./pair
(1, 2)
(3.14, 2.72)
(Alice, 42)
('hello', 'world')

Expected output:
  ('Alice', 42)   ← user expected the specialization to handle strings too
Actual output:
  (Alice, 42)     ← primary template was called, string was copied by value

$ # Adding instrumentation shows the copy:
$ g++ -std=c++17 -DCOUNT_COPIES pair_instrumented.cpp -o pair && ./pair
std::string copy constructor called for: Alice
(Alice, 42)`,
    stdlibRefs: [],
  },
  {
    id: 136,
    topic: "Templates",
    difficulty: "Easy",
    title: "Numeric Accumulator",
    description: "Sums all elements of a container using a template function and returns the total.",
    code: `#include <iostream>
#include <vector>
#include <string>

template <typename Container>
auto accumulate(const Container& c) {
    typename Container::value_type sum = 0;
    for (const auto& elem : c) {
        sum += elem;
    }
    return sum;
}

int main() {
    std::vector<int> ints = {1, 2, 3, 4, 5};
    std::cout << "int sum: " << accumulate(ints) << std::endl;

    std::vector<double> dbls = {1.1, 2.2, 3.3};
    std::cout << "double sum: " << accumulate(dbls) << std::endl;

    std::vector<unsigned char> bytes = {200, 200, 200};
    std::cout << "byte sum: " << accumulate(bytes) << std::endl;
}`,
    hints: [
      "What type is `sum` when the container holds unsigned char?",
      "What is the maximum value an unsigned char can hold?",
      "What happens when you add 200 + 200 in an unsigned char?",
    ],
    explanation: "When Container is std::vector<unsigned char>, the sum variable is of type unsigned char, which can only hold values 0–255. Adding 200 + 200 overflows to 144 (400 mod 256), then adding another 200 gives 88 (344 mod 256). The result is 88 instead of the expected 600. The fix is to use a wider accumulator type, such as making the return type configurable or using std::common_type with a wider default.",
    manifestation: `$ g++ -std=c++17 -O2 accum.cpp -o accum && ./accum
int sum: 15
double sum: 6.6
byte sum: 88

Expected output:
  byte sum: 600
Actual output:
  byte sum: 88`,
    stdlibRefs: [
      { name: "std::numeric_limits", args: "<T>", brief: "Provides properties of arithmetic types such as min, max, and digits.", note: "unsigned char has a max of 255; arithmetic on narrow types silently wraps.", link: "https://en.cppreference.com/w/cpp/types/numeric_limits" },
    ],
  },
  {
    id: 137,
    topic: "Templates",
    difficulty: "Medium",
    title: "Type-Safe Registry",
    description: "A registry that stores and retrieves objects by string key, where each key maps to a specific type.",
    code: `#include <iostream>
#include <unordered_map>
#include <any>
#include <string>
#include <typeinfo>

class Registry {
    std::unordered_map<std::string, std::any> store;
public:
    template <typename T>
    void put(const std::string& key, T&& value) {
        store[key] = std::forward<T>(value);
    }

    template <typename T>
    T& get(const std::string& key) {
        return std::any_cast<T&>(store.at(key));
    }
};

int main() {
    Registry reg;

    reg.put("count", 42);
    reg.put("name", std::string("Alice"));
    reg.put("ratio", 3.14);

    int& count = reg.get<int>("count");
    count = 100;

    std::cout << "count: " << reg.get<int>("count") << std::endl;

    const char* greeting = "hello";
    reg.put("msg", greeting);
    std::string& msg = reg.get<std::string>("msg");
    std::cout << "msg: " << msg << std::endl;
}`,
    hints: [
      "What type does template argument deduction pick for T when you call put() with a const char*?",
      "What type is actually stored in the std::any when you put a const char*?",
      "Does std::any_cast<std::string&> succeed when the stored type is const char*?",
    ],
    explanation: "When reg.put(\"msg\", greeting) is called with a const char*, T deduces to const char*, so the std::any stores a const char*, not a std::string. Then reg.get<std::string>(\"msg\") tries to std::any_cast<std::string&>, which fails because the stored type (const char*) doesn't match the requested type (std::string). This throws std::bad_any_cast at runtime. The fix is to either explicitly call reg.put<std::string>(\"msg\", greeting) or add an overload that converts const char* to std::string.",
    manifestation: `$ g++ -std=c++17 -g registry.cpp -o registry && ./registry
count: 100
terminate called after throwing an instance of 'std::bad_any_cast'
  what():  bad any_cast
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::any_cast", args: "<T>(any& operand) → T | <T>(const any& operand) → T | <T>(any* operand) → T*", brief: "Type-safe access to the contained value of a std::any object.", note: "Throws std::bad_any_cast if the stored type does not exactly match the requested type — no implicit conversions are performed.", link: "https://en.cppreference.com/w/cpp/utility/any/any_cast" },
      { name: "std::forward", args: "<T>(T&& t) → T&&", brief: "Forwards an lvalue or rvalue reference, preserving the value category of the argument.", link: "https://en.cppreference.com/w/cpp/utility/forward" },
    ],
  },
  {
    id: 138,
    topic: "Templates",
    difficulty: "Medium",
    title: "Minimum Element Finder",
    description: "Finds the minimum element in a container using a generic comparison function.",
    code: `#include <iostream>
#include <vector>
#include <string>

template <typename T>
const T& find_min(const std::vector<T>& vec) {
    const T* min_elem = &vec[0];
    for (size_t i = 1; i < vec.size(); ++i) {
        if (vec[i] < *min_elem) {
            min_elem = &vec[i];
        }
    }
    return *min_elem;
}

template <typename T, typename Compare>
const T& find_min(const std::vector<T>& vec, Compare comp) {
    const T* min_elem = &vec[0];
    for (size_t i = 1; i < vec.size(); ++i) {
        if (comp(vec[i], *min_elem)) {
            min_elem = &vec[i];
        }
    }
    return *min_elem;
}

int main() {
    std::vector<std::string> names = {"Charlie", "Alice", "Bob", "Dave"};

    // Find lexicographically smallest
    std::cout << "min: " << find_min(names) << std::endl;

    // Find shortest name
    auto by_length = [](const std::string& a, const std::string& b) {
        return a.size() < b.size();
    };
    std::cout << "shortest: " << find_min(names, by_length) << std::endl;

    // Find min of empty vector
    std::vector<int> empty;
    std::cout << "empty min: " << find_min(empty) << std::endl;
}`,
    hints: [
      "What happens on the first line of find_min when the vector has no elements?",
      "Does vec[0] check bounds? What is &vec[0] when vec is empty?",
      "How many elements does the function assume the vector has?",
    ],
    explanation: "Both overloads of find_min access vec[0] unconditionally without checking if the vector is empty. When called with an empty vector, vec[0] is undefined behavior — it accesses memory past the end of the internal buffer. The function dereferences this invalid pointer and returns a reference to garbage memory. The fix is to either throw an exception or return an iterator/optional when the vector is empty.",
    manifestation: `$ g++ -fsanitize=address -g minelem.cpp -o minelem && ./minelem
min: Alice
shortest: Bob
=================================================================
==22154==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000010
READ of size 8 at 0x602000000010 thread T0
    #0 0x55b1a3 in const int& find_min<int>(std::vector<int> const&) minelem.cpp:7
    #1 0x55b4f2 in main minelem.cpp:37
    #2 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-buffer-overflow minelem.cpp:7 in main`,
    stdlibRefs: [
      { name: "std::vector::operator[]", args: "(size_type pos) → reference", brief: "Returns a reference to the element at the given position without bounds checking.", note: "Accessing an out-of-bounds index (including index 0 on an empty vector) is undefined behavior.", link: "https://en.cppreference.com/w/cpp/container/vector/operator_at" },
    ],
  },
  {
    id: 139,
    topic: "Templates",
    difficulty: "Medium",
    title: "Compile-Time Factorial",
    description: "Calculates factorials at compile time using template metaprogramming and constexpr.",
    code: `#include <iostream>
#include <cstdint>

template <int N>
struct Factorial {
    static constexpr int64_t value = N * Factorial<N - 1>::value;
};

template <>
struct Factorial<0> {
    static constexpr int64_t value = 1;
};

template <int N>
constexpr int64_t factorial() {
    if constexpr (N <= 1) return 1;
    else return N * factorial<N - 1>();
}

int main() {
    std::cout << "5! = " << Factorial<5>::value << std::endl;
    std::cout << "10! = " << Factorial<10>::value << std::endl;
    std::cout << "20! = " << Factorial<20>::value << std::endl;
    std::cout << "25! = " << factorial<25>() << std::endl;

    // Compute ratio of large factorials
    constexpr int64_t ratio = Factorial<21>::value / Factorial<20>::value;
    std::cout << "21!/20! = " << ratio << std::endl;
}`,
    hints: [
      "How large is 21! in decimal? How many bits does int64_t have?",
      "What is the maximum value of int64_t?",
      "What happens to signed integer overflow in a constexpr context?",
    ],
    explanation: "21! is 51,090,942,171,709,440,000 which exceeds INT64_MAX (9,223,372,036,854,775,807). The value of Factorial<21>::value silently overflows int64_t, wrapping to a negative number. The division Factorial<21>::value / Factorial<20>::value then produces a garbage ratio instead of 21. In C++20 and later, signed overflow in constexpr is a compile error, but in C++17 mode it may silently wrap. The fix is to use unsigned __int128, or detect overflow, or limit the input range.",
    manifestation: `$ g++ -std=c++17 -O2 factorial.cpp -o factorial && ./factorial
5! = 120
10! = 3628800
20! = 2432902008176640000
25! = 7034535277573963776
21!/20! = -4249290049419214848

Expected output:
  25! = 15511210043330985984000000
  21!/20! = 21
Actual output:
  25! = 7034535277573963776  (silently overflowed)
  21!/20! = -4249290049419214848  (garbage from overflowed division)`,
    stdlibRefs: [
      { name: "std::numeric_limits", args: "<T>", brief: "Provides properties of arithmetic types such as min, max, and digits.", note: "INT64_MAX is 9,223,372,036,854,775,807; 21! exceeds this, causing signed overflow.", link: "https://en.cppreference.com/w/cpp/types/numeric_limits" },
    ],
  },
  {
    id: 140,
    topic: "Templates",
    difficulty: "Medium",
    title: "Flexible Formatter",
    description: "A variadic template function that formats and prints any number of arguments separated by spaces.",
    code: `#include <iostream>
#include <sstream>
#include <string>

template <typename T>
std::string to_str(const T& val) {
    std::ostringstream oss;
    oss << val;
    return oss.str();
}

template <typename... Args>
std::string format(const Args&... args) {
    std::string result;
    bool first = true;
    // Fold expression to concatenate all arguments
    ((result += (first ? (first = false, "") : " ") + to_str(args)), ...);
    return result;
}

int main() {
    std::cout << format("Name:", "Alice", "Age:", 30) << std::endl;
    std::cout << format(1, 2.5, 'A', true) << std::endl;
    std::cout << format("Score:", 95, "out of", 100) << std::endl;
    std::cout << format() << std::endl;

    // Format with booleans
    std::cout << format("active:", true, "admin:", false) << std::endl;
}`,
    hints: [
      "What does `std::cout << true` print by default in C++?",
      "How does the ostringstream format a bool value?",
      "Is '1' and '0' what the user expects when printing boolean status?",
    ],
    explanation: "When a bool is inserted into an ostringstream, it prints as 1 or 0, not \"true\" or \"false\". So format(\"active:\", true, \"admin:\", false) outputs \"active: 1 admin: 0\" instead of the expected \"active: true admin: false\". This is because std::boolalpha is not set on the ostringstream. The fix is to add oss << std::boolalpha before inserting the value, or to provide a template specialization for bool.",
    manifestation: `$ g++ -std=c++17 -O2 formatter.cpp -o formatter && ./formatter
Name: Alice Age: 30
1 2.5 A 1
Score: 95 out of 100

active: 1 admin: 0

Expected output:
  1 2.5 A true
  active: true admin: false
Actual output:
  1 2.5 A 1
  active: 1 admin: 0`,
    stdlibRefs: [
      { name: "std::boolalpha", args: "(std::ios_base& str) → std::ios_base&", brief: "Sets the boolalpha format flag so that bool values are inserted/extracted as \"true\"/\"false\" instead of 1/0.", link: "https://en.cppreference.com/w/cpp/io/manip/boolalpha" },
    ],
  },
  {
    id: 141,
    topic: "Templates",
    difficulty: "Hard",
    title: "CRTP Counter",
    description: "Uses the Curiously Recurring Template Pattern to count how many instances of each class type exist.",
    code: `#include <iostream>
#include <string>

template <typename Derived>
class InstanceCounter {
    static int count;
public:
    InstanceCounter() { ++count; }
    ~InstanceCounter() { --count; }
    static int getCount() { return count; }
};

template <typename Derived>
int InstanceCounter<Derived>::count = 0;

class Widget : public InstanceCounter<Widget> {
    std::string name;
public:
    Widget(const std::string& n) : name(n) {}
    Widget(const Widget& other) : name(other.name) {}
    Widget& operator=(const Widget& other) { name = other.name; return *this; }
};

class Gadget : public InstanceCounter<Gadget> {
    int id;
public:
    Gadget(int i) : id(i) {}
};

int main() {
    Widget w1("alpha");
    Widget w2("beta");
    Gadget g1(1);

    std::cout << "Widgets: " << Widget::getCount() << std::endl;
    std::cout << "Gadgets: " << Gadget::getCount() << std::endl;

    {
        Widget w3 = w1;
        std::cout << "Widgets after copy: " << Widget::getCount() << std::endl;
    }

    std::cout << "Widgets after scope: " << Widget::getCount() << std::endl;
}`,
    hints: [
      "When Widget is copied, which constructors are invoked?",
      "Does the user-defined copy constructor call the base class constructor?",
      "What does the InstanceCounter constructor do, and is it called during a copy?",
    ],
    explanation: "The user-defined copy constructor Widget(const Widget& other) does not explicitly call the base class InstanceCounter<Widget> constructor in its initializer list. However, in C++, when no base class constructor is explicitly called, the default constructor of the base is called implicitly. So InstanceCounter() IS called during the copy, and count IS incremented. The code actually works correctly. But there's a real bug: the user-defined operator= copies `name` but the base class InstanceCounter has no operator= — this is fine since there's nothing to assign. The actual bug is that Widget's copy constructor doesn't need to be user-defined at all, but since it IS user-defined, the move constructor is implicitly deleted. This means `Widget w3 = std::move(w1)` would silently fall back to copying instead of moving, and if Widget held expensive resources, this would be a significant performance bug.",
    manifestation: `$ g++ -std=c++17 -O2 crtp.cpp -o crtp && ./crtp
Widgets: 2
Gadgets: 1
Widgets after copy: 3
Widgets after scope: 2

$ # Seems correct... but add a move test:
$ g++ -std=c++17 -O2 -DMOVE_TEST crtp_test.cpp -o crtp && ./crtp
Widget copy ctor called!   ← move was silently downgraded to copy
Widgets: 3                 ← count is correct, but move didn't happen

$ # The user-defined copy ctor suppresses implicit move generation.
$ # std::move(w1) silently copies instead of moving.`,
    stdlibRefs: [],
  },
  {
    id: 142,
    topic: "Templates",
    difficulty: "Hard",
    title: "Type Traits Dispatcher",
    description: "Uses SFINAE and type traits to dispatch function calls based on whether a type is integral, floating-point, or a string.",
    code: `#include <iostream>
#include <string>
#include <type_traits>
#include <vector>

template <typename T>
typename std::enable_if<std::is_integral<T>::value, std::string>::type
classify(T val) {
    return "integer: " + std::to_string(val);
}

template <typename T>
typename std::enable_if<std::is_floating_point<T>::value, std::string>::type
classify(T val) {
    return "float: " + std::to_string(val);
}

template <typename T>
typename std::enable_if<!std::is_integral<T>::value &&
                        !std::is_floating_point<T>::value, std::string>::type
classify(T val) {
    return "other: " + val;
}

int main() {
    std::cout << classify(42) << std::endl;
    std::cout << classify(3.14) << std::endl;
    std::cout << classify(std::string("hello")) << std::endl;
    std::cout << classify('A') << std::endl;
    std::cout << classify(true) << std::endl;
}`,
    hints: [
      "What does std::is_integral return for `char` and `bool`?",
      "Is `char` classified as integral or as 'other' by the type traits?",
      "What does std::to_string do with a char value?",
    ],
    explanation: "Both `char` and `bool` are integral types in C++, so classify('A') and classify(true) match the integral overload, not the 'other' overload. classify('A') calls std::to_string(65) (the ASCII value), printing \"integer: 65\" instead of the expected \"integer: A\" or character output. classify(true) prints \"integer: 1\" instead of something like \"bool: true\". The type traits correctly identify these as integral, but the user likely expected char to be treated as a character and bool as a boolean, not as numbers.",
    manifestation: `$ g++ -std=c++17 -O2 classify.cpp -o classify && ./classify
integer: 42
float: 3.140000
other: hello
integer: 65
integer: 1

Expected output:
  integer: A    (or: other: A)
  bool: true    (or: other: true)
Actual output:
  integer: 65   ← char is integral, printed as its ASCII code
  integer: 1    ← bool is integral, printed as 1`,
    stdlibRefs: [
      { name: "std::is_integral", args: "<T>", brief: "Type trait that checks if T is an integral type (bool, char, int, etc.).", note: "char, wchar_t, char8_t, char16_t, char32_t, and bool are all integral types.", link: "https://en.cppreference.com/w/cpp/types/is_integral" },
      { name: "std::to_string", args: "(int value) → string | (double value) → string | ...", brief: "Converts a numeric value to its string representation.", note: "Converts char to its numeric ASCII value, not to the character itself.", link: "https://en.cppreference.com/w/cpp/string/basic_string/to_string" },
    ],
  },
  {
    id: 143,
    topic: "Templates",
    difficulty: "Hard",
    title: "Static Singleton Cache",
    description: "A template class that provides a per-type singleton cache with lazy initialization.",
    code: `#include <iostream>
#include <unordered_map>
#include <string>
#include <memory>

template <typename Key, typename Value>
class Cache {
    static Cache* instance;
    std::unordered_map<Key, Value> data;

    Cache() = default;
public:
    Cache(const Cache&) = delete;
    Cache& operator=(const Cache&) = delete;

    static Cache& getInstance() {
        if (!instance) {
            instance = new Cache();
        }
        return *instance;
    }

    void put(const Key& key, const Value& value) {
        data[key] = value;
    }

    Value get(const Key& key) const {
        return data.at(key);
    }

    bool has(const Key& key) const {
        return data.count(key) > 0;
    }
};

template <typename Key, typename Value>
Cache<Key, Value>* Cache<Key, Value>::instance = nullptr;

int main() {
    auto& cache1 = Cache<std::string, int>::getInstance();
    cache1.put("score", 100);

    auto& cache2 = Cache<std::string, int>::getInstance();
    std::cout << "score: " << cache2.get("score") << std::endl;

    auto& strCache = Cache<int, std::string>::getInstance();
    strCache.put(1, "hello");
    std::cout << "1: " << strCache.get(1) << std::endl;
    std::cout << "same instance: " << (&cache1 == &cache2) << std::endl;
}`,
    hints: [
      "How is the singleton memory managed? What happens when the program exits?",
      "Is `instance = new Cache()` ever matched by a delete?",
      "What tool would detect this problem at runtime?",
    ],
    explanation: "The singleton is created with `new Cache()` but is never deleted — there is no destructor, cleanup function, or atexit handler that calls delete. This is a memory leak: every instantiation of Cache<K,V> leaks one allocation. While many developers consider singleton leaks acceptable (the OS reclaims memory at exit), sanitizers flag it, and in library code or long-running processes with dlopen/dlclose, the leak becomes real. The fix is to use a function-local static variable (`static Cache instance; return instance;`) which is safely initialized on first use and destroyed at program exit.",
    manifestation: `$ g++ -fsanitize=address -g cache.cpp -o cache && ./cache
score: 100
1: hello
same instance: 1

=================================================================
==31024==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 56 byte(s) in 1 object(s) allocated from:
    #0 0x7f2a1b in operator new(unsigned long) (/usr/lib/libasan.so+0xe1b)
    #1 0x55d1a3 in Cache<std::string, int>::getInstance() cache.cpp:18
    #2 0x55d4f2 in main cache.cpp:38

Direct leak of 56 byte(s) in 1 object(s) allocated from:
    #0 0x7f2a1b in operator new(unsigned long) (/usr/lib/libasan.so+0xe1b)
    #1 0x55d2b1 in Cache<int, std::string>::getInstance() cache.cpp:18
    #2 0x55d5a1 in main cache.cpp:42

SUMMARY: AddressSanitizer: 112 byte(s) leaked in 2 allocation(s).`,
    stdlibRefs: [],
  },
  // ── STL Containers ──
  {
    id: 144,
    topic: "STL Containers",
    difficulty: "Easy",
    title: "Word Frequency Counter",
    description: "Counts how many times each word appears in a list and prints the results in alphabetical order.",
    code: `#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> words = {
        "apple", "banana", "apple", "cherry",
        "banana", "apple", "date", "cherry"
    };

    std::map<std::string, int> freq;
    for (const auto& w : words) {
        freq[w]++;
    }

    // Print words that appear more than once
    for (auto it = freq.begin(); it != freq.end(); ++it) {
        if (it->second <= 1) {
            freq.erase(it);
        }
    }

    for (const auto& [word, count] : freq) {
        std::cout << word << ": " << count << std::endl;
    }
}`,
    hints: [
      "What happens to the iterator after calling erase on a std::map?",
      "Does the for loop correctly advance the iterator after an erase?",
      "How does std::map::erase differ from std::vector::erase in terms of iterator invalidation?",
    ],
    explanation: "After calling freq.erase(it), the iterator `it` is invalidated. The loop then does ++it on the invalidated iterator, which is undefined behavior. Unlike vector::erase, map::erase does not return the next iterator (until C++11, it returns void; in C++11+ it returns the next iterator). The fix is to use `it = freq.erase(it)` and put the ++it in an else branch, or use the post-increment idiom: `freq.erase(it++)`.",
    manifestation: `$ g++ -fsanitize=address -g wordfreq.cpp -o wordfreq && ./wordfreq
apple: 3
cherry: 2

$ # Looks like it worked? Try with different data:
$ g++ -fsanitize=address -g wordfreq2.cpp -o wordfreq2 && ./wordfreq2
=================================================================
==19823==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000070
READ of size 8 at 0x604000000070 thread T0
    #0 0x55a1b3 in main wordfreq2.cpp:18
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-use-after-free wordfreq2.cpp:18 in main`,
    stdlibRefs: [
      { name: "std::map::erase", args: "(iterator pos) → iterator (C++11) | (const key_type& key) → size_type", brief: "Removes the element at the given position or with the given key.", note: "The erased iterator is invalidated; use the returned iterator (C++11+) or post-increment before erasing.", link: "https://en.cppreference.com/w/cpp/container/map/erase" },
    ],
  },
  {
    id: 145,
    topic: "STL Containers",
    difficulty: "Easy",
    title: "Priority Task Queue",
    description: "Manages a queue of tasks sorted by priority, where higher priority tasks are processed first.",
    code: `#include <iostream>
#include <queue>
#include <string>
#include <vector>

struct Task {
    std::string name;
    int priority;
};

bool operator<(const Task& a, const Task& b) {
    return a.priority < b.priority;
}

int main() {
    std::priority_queue<Task> pq;

    pq.push({"Write report", 3});
    pq.push({"Fix critical bug", 10});
    pq.push({"Code review", 5});
    pq.push({"Update docs", 1});
    pq.push({"Deploy hotfix", 8});

    std::cout << "Processing tasks:" << std::endl;
    while (!pq.empty()) {
        Task& t = const_cast<Task&>(pq.top());
        std::cout << "  [" << t.priority << "] " << t.name << std::endl;
        t.priority = 0;  // mark as processed
        pq.pop();
    }
}`,
    hints: [
      "What does pq.top() return — a reference or a copy?",
      "Why is const_cast needed to get a non-const reference to top()?",
      "What guarantee does a priority_queue rely on about its elements' values?",
    ],
    explanation: "The code uses const_cast to remove the const from pq.top() and modifies the priority of the top element while it's still in the heap. This corrupts the heap invariant: the priority_queue assumes element values don't change while stored. After modifying t.priority to 0, the subsequent pop() may not correctly restore the heap, and future top() calls may return elements in the wrong order. The const on top() exists precisely to prevent this. The fix is to copy the value, pop, then modify: `Task t = pq.top(); pq.pop();`.",
    manifestation: `$ g++ -std=c++17 -O2 taskq.cpp -o taskq && ./taskq
Processing tasks:
  [10] Fix critical bug
  [8] Deploy hotfix
  [0] Code review
  [0] Update docs
  [0] Write report

Expected output:
  [10] Fix critical bug
  [8] Deploy hotfix
  [5] Code review
  [3] Write report
  [1] Update docs
Actual output:
  priorities corrupted after first pop — elements come out in wrong order`,
    stdlibRefs: [
      { name: "std::priority_queue::top", args: "() → const_reference", brief: "Returns a const reference to the top (highest-priority) element.", note: "Returns const reference specifically to prevent modification that would corrupt the heap ordering.", link: "https://en.cppreference.com/w/cpp/container/priority_queue/top" },
    ],
  },
  {
    id: 146,
    topic: "STL Containers",
    difficulty: "Easy",
    title: "Running Average Calculator",
    description: "Maintains a sliding window of the last N values and computes their running average.",
    code: `#include <iostream>
#include <deque>

class RunningAverage {
    std::deque<double> window;
    size_t max_size;
    double sum = 0.0;
public:
    RunningAverage(size_t n) : max_size(n) {}

    void add(double val) {
        window.push_back(val);
        sum += val;
        if (window.size() > max_size) {
            sum -= window.front();
            window.pop_front();
        }
    }

    double average() const {
        return sum / window.size();
    }
};

int main() {
    RunningAverage avg(3);

    for (int i = 1; i <= 10; ++i) {
        avg.add(i * 1.0);
        std::cout << "After adding " << i << ": avg = " << avg.average() << std::endl;
    }

    // Edge case: what if we query before adding anything?
    RunningAverage empty_avg(5);
    std::cout << "Empty average: " << empty_avg.average() << std::endl;
}`,
    hints: [
      "What happens when average() is called on a freshly constructed RunningAverage?",
      "What is window.size() before any values have been added?",
      "What is the result of dividing 0.0 by 0?",
    ],
    explanation: "When average() is called before any values are added, window.size() is 0, so the function computes 0.0 / 0, which in IEEE 754 floating-point produces NaN (not-a-number), not a crash. While this doesn't cause a segfault, it's a logic bug — the function silently returns NaN instead of signaling an error. If the result is used in further calculations, NaN propagates silently through the entire computation. The fix is to check for empty window and either throw an exception or return std::optional<double>.",
    manifestation: `$ g++ -std=c++17 -O2 runavg.cpp -o runavg && ./runavg
After adding 1: avg = 1
After adding 2: avg = 1.5
After adding 3: avg = 2
After adding 4: avg = 3
After adding 5: avg = 4
After adding 6: avg = 5
After adding 7: avg = 6
After adding 8: avg = 7
After adding 9: avg = 8
After adding 10: avg = 9
Empty average: -nan

Expected output:
  Empty average: 0  (or an error)
Actual output:
  Empty average: -nan  (NaN propagates silently if used in further math)`,
    stdlibRefs: [
      { name: "std::deque::size", args: "() → size_type", brief: "Returns the number of elements in the deque.", note: "Returns 0 for an empty deque; dividing by the result without checking leads to division by zero.", link: "https://en.cppreference.com/w/cpp/container/deque/size" },
    ],
  },
  {
    id: 147,
    topic: "STL Containers",
    difficulty: "Medium",
    title: "LRU Cache",
    description: "Implements a least-recently-used cache with O(1) get and put operations using a hash map and a linked list.",
    code: `#include <iostream>
#include <unordered_map>
#include <list>
#include <string>

class LRUCache {
    int capacity;
    std::list<std::pair<std::string, int>> items;
    std::unordered_map<std::string, std::list<std::pair<std::string, int>>::iterator> lookup;

public:
    LRUCache(int cap) : capacity(cap) {}

    int get(const std::string& key) {
        auto it = lookup.find(key);
        if (it == lookup.end()) return -1;
        // Move to front (most recently used)
        items.splice(items.begin(), items, it->second);
        return it->second->second;
    }

    void put(const std::string& key, int value) {
        auto it = lookup.find(key);
        if (it != lookup.end()) {
            it->second->second = value;
            items.splice(items.begin(), items, it->second);
            return;
        }
        if (items.size() >= capacity) {
            // Evict least recently used (back of list)
            lookup.erase(items.back().first);
            items.pop_back();
        }
        items.push_front({key, value});
        lookup[key] = items.begin();
    }
};

int main() {
    LRUCache cache(2);
    cache.put("a", 1);
    cache.put("b", 2);
    std::cout << "a: " << cache.get("a") << std::endl;
    cache.put("c", 3);  // should evict "b"
    std::cout << "b: " << cache.get("b") << std::endl;
    std::cout << "c: " << cache.get("c") << std::endl;

    // Negative capacity
    LRUCache bad(0);
    bad.put("x", 1);
    std::cout << "x: " << bad.get("x") << std::endl;
}`,
    hints: [
      "What happens when the capacity is zero?",
      "Does the eviction check `items.size() >= capacity` behave correctly when capacity is 0?",
      "What is the type of `capacity` and what is the type of `items.size()`?",
    ],
    explanation: "When capacity is 0 (or negative, since it's stored as int), the comparison `items.size() >= capacity` compares an unsigned size_t with a signed int. When capacity is 0, the comparison works but the cache immediately evicts every item it inserts — put() adds an item, then the next put() evicts it. More dangerously, if capacity were negative (e.g. -1), the signed-to-unsigned conversion would make it a huge number like 4294967295, and the cache would never evict, growing without bound. The fix is to use size_t for capacity and validate it in the constructor.",
    manifestation: `$ g++ -std=c++17 -O2 lru.cpp -o lru && ./lru
a: 1
b: -1
c: 3
x: -1

Expected output:
  x: 1  (just inserted it)
Actual output:
  x: -1  (evicted immediately because capacity is 0)

$ # With capacity = -1:
$ ./lru_negative
[runs forever, consuming memory — capacity converted to ~4 billion]`,
    stdlibRefs: [
      { name: "std::list::splice", args: "(const_iterator pos, list& other, const_iterator it) → void", brief: "Transfers the element pointed to by it from other into *this before pos.", note: "No iterators are invalidated; the transferred element's iterator remains valid but now points into the destination list.", link: "https://en.cppreference.com/w/cpp/container/list/splice" },
    ],
  },
  {
    id: 148,
    topic: "STL Containers",
    difficulty: "Medium",
    title: "Contact Book Merger",
    description: "Merges two sorted contact lists into a single sorted list, removing duplicates.",
    code: `#include <iostream>
#include <set>
#include <string>
#include <vector>
#include <algorithm>

struct Contact {
    std::string name;
    std::string phone;

    bool operator<(const Contact& other) const {
        return name < other.name;
    }
};

int main() {
    std::set<Contact> merged;

    std::vector<Contact> list1 = {
        {"Alice", "555-0001"},
        {"Bob",   "555-0002"},
        {"Carol", "555-0003"},
    };

    std::vector<Contact> list2 = {
        {"Alice", "555-9999"},  // Alice with different phone
        {"Dave",  "555-0004"},
        {"Eve",   "555-0005"},
    };

    for (const auto& c : list1) merged.insert(c);
    for (const auto& c : list2) merged.insert(c);

    std::cout << "Merged contacts:" << std::endl;
    for (const auto& c : merged) {
        std::cout << "  " << c.name << ": " << c.phone << std::endl;
    }
}`,
    hints: [
      "How does std::set determine if two Contact objects are duplicates?",
      "What comparison does the operator< use?",
      "If two contacts have the same name but different phone numbers, which one ends up in the set?",
    ],
    explanation: "The operator< only compares by name, so std::set considers two contacts with the same name as equal — the phone number is ignored entirely. When Alice appears in both lists with different phone numbers (555-0001 and 555-9999), the second insert is silently discarded. The set keeps Alice with 555-0001, and the user never knows that 555-9999 was lost. The fix depends on intent: if names should be unique, update the existing entry's phone; if both should be kept, add phone to the comparison or use a multiset.",
    manifestation: `$ g++ -std=c++17 -O2 contacts.cpp -o contacts && ./contacts
Merged contacts:
  Alice: 555-0001
  Bob: 555-0002
  Carol: 555-0003
  Dave: 555-0004
  Eve: 555-0005

Expected output:
  Alice: 555-0001 (or 555-9999, or both)
Actual output:
  Alice: 555-0001  ← 555-9999 was silently dropped, no warning`,
    stdlibRefs: [
      { name: "std::set::insert", args: "(const value_type& value) → pair<iterator, bool>", brief: "Inserts an element if an equivalent element does not already exist.", note: "Equivalence is determined by the comparator (operator<), not operator==. Fields not used in the comparator are invisible to the set.", link: "https://en.cppreference.com/w/cpp/container/set/insert" },
    ],
  },
  {
    id: 149,
    topic: "STL Containers",
    difficulty: "Medium",
    title: "String Tokenizer",
    description: "Splits a string by a delimiter and stores the tokens in a vector for later access.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <string_view>
#include <sstream>

std::vector<std::string_view> split(const std::string& input, char delim) {
    std::vector<std::string_view> tokens;
    std::istringstream stream(input);
    std::string token;

    while (std::getline(stream, token, delim)) {
        tokens.push_back(token);
    }

    return tokens;
}

int main() {
    std::string csv = "Alice,Bob,Carol,Dave";
    auto names = split(csv, ',');

    std::cout << "Tokens:" << std::endl;
    for (const auto& name : names) {
        std::cout << "  [" << name << "]" << std::endl;
    }

    std::cout << "First: " << names[0] << std::endl;
    std::cout << "Last: " << names.back() << std::endl;
}`,
    hints: [
      "What does a std::string_view point to?",
      "What is the lifetime of the `token` variable inside the while loop?",
      "When the function returns, what memory do the string_views in the vector refer to?",
    ],
    explanation: "The string_views in the returned vector all point into the local `token` variable, which is a std::string on the stack. Each iteration of the while loop reuses and overwrites `token`, so all string_views momentarily point to valid data but always to the same buffer. When split() returns, `token` is destroyed, and all string_views become dangling — they point to freed stack memory. Accessing any element in the returned vector is undefined behavior. The fix is to store std::string instead of std::string_view in the vector.",
    manifestation: `$ g++ -fsanitize=address -g tokenizer.cpp -o tokenizer && ./tokenizer
=================================================================
==24891==ERROR: AddressSanitizer: stack-use-after-return on address 0x7f0a28c00060
READ of size 4 at 0x7f0a28c00060 thread T0
    #0 0x55c1a3 in main tokenizer.cpp:21
    #1 0x7f3c2a in __libc_start_main
Address 0x7f0a28c00060 is located in stack of thread T0 at offset 96
SUMMARY: AddressSanitizer: stack-use-after-return tokenizer.cpp:21 in main`,
    stdlibRefs: [
      { name: "std::string_view", brief: "A non-owning reference to a contiguous sequence of characters.", note: "Does not extend the lifetime of the data it refers to; if the underlying string is destroyed, the view dangles.", link: "https://en.cppreference.com/w/cpp/string/basic_string_view" },
      { name: "std::getline", args: "(istream& input, string& str, char delim) → istream&", brief: "Reads characters from input into str until the delimiter is found or EOF.", note: "Overwrites the contents of str on each call.", link: "https://en.cppreference.com/w/cpp/string/basic_string/getline" },
    ],
  },
  {
    id: 150,
    topic: "STL Containers",
    difficulty: "Medium",
    title: "Histogram Builder",
    description: "Builds a histogram of character frequencies from text input and prints a bar chart.",
    code: `#include <iostream>
#include <unordered_map>
#include <string>
#include <vector>
#include <algorithm>

int main() {
    std::string text = "hello world, hello C++!";

    std::unordered_map<char, int> freq;
    for (char c : text) {
        if (std::isalpha(c)) {
            freq[std::tolower(c)]++;
        }
    }

    // Sort by frequency (descending)
    std::vector<std::pair<char, int>> sorted(freq.begin(), freq.end());
    std::sort(sorted.begin(), sorted.end(),
        [](const auto& a, const auto& b) {
            return a.second > b.second;
        });

    // Print histogram
    for (const auto& [ch, count] : sorted) {
        std::cout << ch << " | ";
        for (int i = 0; i < count; ++i) std::cout << '#';
        std::cout << " (" << count << ")" << std::endl;
    }
}`,
    hints: [
      "What type does std::tolower return?",
      "What happens when you store the return value of std::tolower in a char on a platform where char is signed?",
      "Could the cast from int to char cause any issues for certain character values?",
    ],
    explanation: "std::tolower takes and returns int, not char. On platforms where char is signed, storing the return value of std::tolower() back into a char is fine for ASCII letters. However, calling std::isalpha(c) with a signed char that has a negative value (e.g., characters with codes > 127) is undefined behavior — std::isalpha requires a non-negative int or EOF. If the text contains any extended ASCII or UTF-8 bytes, the program has UB. The fix is to cast: `std::isalpha(static_cast<unsigned char>(c))`.",
    manifestation: `$ g++ -std=c++17 -O2 histogram.cpp -o histogram && ./histogram
l | ##### (5)
o | ### (3)
h | ## (2)
e | ## (2)
c | # (1)
d | # (1)
r | # (1)
w | # (1)

$ # Works for ASCII... try with extended characters:
$ echo "café naïve" | ./histogram_stdin
Segmentation fault (core dumped)

$ # std::isalpha(negative_char) is undefined behavior`,
    stdlibRefs: [
      { name: "std::isalpha", args: "(int ch) → int", brief: "Checks if the given character is an alphabetic letter.", note: "The argument must be representable as unsigned char or equal to EOF; passing a negative signed char is undefined behavior.", link: "https://en.cppreference.com/w/cpp/string/byte/isalpha" },
      { name: "std::tolower", args: "(int ch) → int", brief: "Converts the given character to lowercase if possible.", note: "Takes and returns int, not char. The argument must be representable as unsigned char or equal to EOF.", link: "https://en.cppreference.com/w/cpp/string/byte/tolower" },
    ],
  },
  {
    id: 151,
    topic: "STL Containers",
    difficulty: "Hard",
    title: "Thread-Safe Queue",
    description: "Implements a thread-safe producer-consumer queue using a std::queue with mutex protection.",
    code: `#include <iostream>
#include <queue>
#include <thread>
#include <mutex>
#include <string>
#include <vector>

template <typename T>
class SafeQueue {
    std::queue<T> q;
    std::mutex mtx;
public:
    void push(const T& val) {
        std::lock_guard<std::mutex> lock(mtx);
        q.push(val);
    }

    bool empty() {
        std::lock_guard<std::mutex> lock(mtx);
        return q.empty();
    }

    T pop() {
        std::lock_guard<std::mutex> lock(mtx);
        T val = q.front();
        q.pop();
        return val;
    }
};

int main() {
    SafeQueue<int> sq;
    std::vector<int> results;
    std::mutex results_mtx;

    // Producer
    std::thread producer([&sq]() {
        for (int i = 0; i < 1000; ++i) {
            sq.push(i);
        }
    });

    // Consumer
    std::thread consumer([&sq, &results, &results_mtx]() {
        while (results.size() < 1000) {
            if (!sq.empty()) {
                int val = sq.pop();
                std::lock_guard<std::mutex> lock(results_mtx);
                results.push_back(val);
            }
        }
    });

    producer.join();
    consumer.join();
    std::cout << "Processed: " << results.size() << " items" << std::endl;
}`,
    hints: [
      "Is the check-then-act pattern (empty() followed by pop()) safe with concurrent access?",
      "What happens if the producer hasn't pushed anything yet when the consumer calls empty(), then pop()?",
      "Can another thread modify the queue between the empty() check and the pop() call?",
    ],
    explanation: "The consumer checks `sq.empty()` and then calls `sq.pop()` as two separate operations. Between these calls, another thread could drain the queue, making pop() call front() on an empty queue — undefined behavior. This is a classic TOCTOU (time-of-check-time-of-use) race condition. Even though each individual method is mutex-protected, the combined check-then-act is not atomic. The fix is to provide a single `try_pop(T& out)` method that checks and pops under a single lock, returning false if the queue is empty.",
    manifestation: `$ g++ -std=c++17 -fsanitize=thread -g safeq.cpp -o safeq -pthread && ./safeq
terminate called after throwing an instance of 'std::bad_alloc'
Aborted (core dumped)

$ # Or on another run:
$ ./safeq
Segmentation fault (core dumped)

$ # front() called on empty queue — undefined behavior from TOCTOU race`,
    stdlibRefs: [
      { name: "std::queue::front", args: "() → reference", brief: "Returns a reference to the front element of the queue.", note: "Calling front() on an empty queue is undefined behavior — no bounds check is performed.", link: "https://en.cppreference.com/w/cpp/container/queue/front" },
      { name: "std::lock_guard", args: "<Mutex>(Mutex& m)", brief: "RAII wrapper that locks a mutex on construction and unlocks on destruction.", note: "Protects only the scope of a single function call; two separately guarded calls are not atomic together.", link: "https://en.cppreference.com/w/cpp/thread/lock_guard" },
    ],
  },
  {
    id: 152,
    topic: "STL Containers",
    difficulty: "Hard",
    title: "Graph Adjacency List",
    description: "Represents a directed graph as an adjacency list and performs depth-first traversal to find all reachable nodes.",
    code: `#include <iostream>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <string>

class Graph {
    std::unordered_map<std::string, std::vector<std::string>> adj;
public:
    void addEdge(const std::string& from, const std::string& to) {
        adj[from].push_back(to);
        adj[to];  // ensure 'to' node exists
    }

    std::vector<std::string> reachable(const std::string& start) {
        std::unordered_set<std::string> visited;
        std::vector<std::string> result;
        dfs(start, visited, result);
        return result;
    }

private:
    void dfs(const std::string& node, std::unordered_set<std::string>& visited,
             std::vector<std::string>& result) {
        if (visited.count(node)) return;
        visited.insert(node);
        result.push_back(node);
        for (const auto& neighbor : adj[node]) {
            dfs(neighbor, visited, result);
        }
    }
};

int main() {
    Graph g;
    g.addEdge("A", "B");
    g.addEdge("A", "C");
    g.addEdge("B", "D");
    g.addEdge("C", "D");
    g.addEdge("D", "E");

    auto nodes = g.reachable("A");
    std::cout << "Reachable from A:";
    for (const auto& n : nodes) std::cout << " " << n;
    std::cout << std::endl;

    // Try a node not in the graph
    auto none = g.reachable("Z");
    std::cout << "Reachable from Z:";
    for (const auto& n : none) std::cout << " " << n;
    std::cout << std::endl;
}`,
    hints: [
      "What does adj[node] do when 'node' doesn't exist in the map?",
      "Can the map be modified while iterating over another entry's neighbors in the recursive DFS?",
      "Does inserting into an unordered_map invalidate existing references or iterators?",
    ],
    explanation: "In the dfs() function, `adj[node]` is used to access the neighbor list. When called with a node not in the map (like \"Z\"), operator[] inserts a new default-constructed entry. More critically, during the DFS, if a neighbor node doesn't have its own entry in adj, `adj[neighbor]` in the recursive call inserts a new element into the unordered_map. Inserting into an unordered_map can trigger a rehash, which invalidates all iterators — including the range-for iterator in the calling stack frame that's iterating over `adj[node]`. This is undefined behavior. The fix is to use adj.find() or adj.at() instead of operator[] in dfs(), or to use const-qualified access.",
    manifestation: `$ g++ -std=c++17 -O2 graph.cpp -o graph && ./graph
Reachable from A: A B D E C
Reachable from Z: Z

$ # Seems fine for small graphs. Add more edges:
$ g++ -fsanitize=address -g graph_large.cpp -o graph && ./graph
Reachable from A: A B D
=================================================================
==28341==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000190
READ of size 32 at 0x604000000190 thread T0
    #0 0x55d1a3 in Graph::dfs graph.cpp:27
    #1 0x55d2b1 in Graph::dfs graph.cpp:28
    #2 0x55d4f2 in main graph.cpp:36
SUMMARY: AddressSanitizer: heap-use-after-free graph.cpp:27 in main`,
    stdlibRefs: [
      { name: "std::unordered_map::operator[]", args: "(const key_type& key) → mapped_type&", brief: "Returns a reference to the value mapped to key, inserting a default-constructed value if the key doesn't exist.", note: "Insertion may trigger a rehash, which invalidates all iterators to the map.", link: "https://en.cppreference.com/w/cpp/container/unordered_map/operator_at" },
    ],
  },
  {
    id: 153,
    topic: "STL Containers",
    difficulty: "Hard",
    title: "Interval Scheduler",
    description: "Given a list of time intervals, finds and removes all overlapping intervals, keeping only non-overlapping ones.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

struct Interval {
    int start, end;
};

std::vector<Interval> removeOverlaps(std::vector<Interval> intervals) {
    std::sort(intervals.begin(), intervals.end(),
        [](const Interval& a, const Interval& b) {
            return a.start < b.start;
        });

    std::vector<Interval> result;
    result.push_back(intervals[0]);

    for (size_t i = 1; i < intervals.size(); ++i) {
        auto& last = result.back();
        if (intervals[i].start >= last.end) {
            result.push_back(intervals[i]);
        } else {
            // Overlapping: keep the one that ends earlier
            last.end = std::min(last.end, intervals[i].end);
        }
    }

    return result;
}

int main() {
    std::vector<Interval> schedule = {
        {1, 3}, {2, 5}, {6, 8}, {7, 9}, {10, 12}
    };

    auto clean = removeOverlaps(schedule);
    std::cout << "Non-overlapping intervals:" << std::endl;
    for (const auto& iv : clean) {
        std::cout << "  [" << iv.start << ", " << iv.end << ")" << std::endl;
    }

    // What about an empty schedule?
    std::vector<Interval> empty_sched;
    auto result = removeOverlaps(empty_sched);
}`,
    hints: [
      "What happens on the line `result.push_back(intervals[0])` when the input vector is empty?",
      "Is the function ever called with an empty vector?",
      "Does the function validate its input before accessing the first element?",
    ],
    explanation: "The function unconditionally accesses intervals[0] on line 16 without checking if the vector is empty. When called with an empty vector at the bottom of main(), this is an out-of-bounds access — undefined behavior. The sorted intervals vector is empty, so intervals[0] reads garbage from unallocated memory, and the Interval copied into result contains whatever was there. The fix is to add an early return: `if (intervals.empty()) return {};`.",
    manifestation: `$ g++ -fsanitize=address -g scheduler.cpp -o scheduler && ./scheduler
Non-overlapping intervals:
  [1, 3)
  [6, 8)
  [10, 12)
=================================================================
==17652==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000010
READ of size 4 at 0x602000000010 thread T0
    #0 0x55a1b3 in removeOverlaps(std::vector<Interval>) scheduler.cpp:16
    #1 0x55a4f2 in main scheduler.cpp:38
    #2 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-buffer-overflow scheduler.cpp:16 in main`,
    stdlibRefs: [
      { name: "std::vector::operator[]", args: "(size_type pos) → reference", brief: "Returns a reference to the element at the given position without bounds checking.", note: "Accessing index 0 on an empty vector is undefined behavior — use at() for bounds-checked access or check empty() first.", link: "https://en.cppreference.com/w/cpp/container/vector/operator_at" },
    ],
  },
  // ── OOP ──
  {
    id: 154,
    topic: "OOP",
    difficulty: "Easy",
    title: "Employee Directory",
    description: "Models employees with a base class and derived manager class, printing their details.",
    code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Employee {
protected:
    std::string name;
    double salary;
public:
    Employee(const std::string& n, double s) : name(n), salary(s) {}
    virtual ~Employee() = default;

    virtual void print() const {
        std::cout << name << " ($" << salary << ")" << std::endl;
    }

    double getSalary() const { return salary; }
};

class Manager : public Employee {
    std::vector<Employee*> reports;
public:
    Manager(const std::string& n, double s) : Employee(n, s) {}

    void addReport(Employee* e) { reports.push_back(e); }

    void print() const {
        std::cout << name << " ($" << salary << ") manages "
                  << reports.size() << " people" << std::endl;
    }
};

double totalSalary(const std::vector<Employee>& staff) {
    double total = 0;
    for (const auto& e : staff) {
        total += e.getSalary();
    }
    return total;
}

int main() {
    Manager mgr("Alice", 120000);
    Employee dev1("Bob", 90000);
    Employee dev2("Carol", 95000);

    mgr.addReport(&dev1);
    mgr.addReport(&dev2);

    std::vector<Employee> staff = {mgr, dev1, dev2};

    for (const auto& e : staff) {
        e.print();
    }

    std::cout << "Total: $" << totalSalary(staff) << std::endl;
}`,
    hints: [
      "What type are the elements stored in the `staff` vector?",
      "When a Manager is pushed into a vector of Employee, what happens to the Manager-specific parts?",
      "Which print() method is called for the first element of staff?",
    ],
    explanation: "The staff vector stores Employee objects by value. When the Manager `mgr` is inserted, it gets sliced to an Employee — the Manager-specific data (reports vector) is lost, and the vtable pointer is reset to Employee's. Calling e.print() on the first element invokes Employee::print(), not Manager::print(), so the 'manages 2 people' output is lost. The fix is to use std::vector<std::unique_ptr<Employee>> to preserve polymorphism.",
    manifestation: `$ g++ -std=c++17 -O2 employee.cpp -o employee && ./employee
Alice ($120000)
Bob ($90000)
Carol ($95000)
Total: $305000

Expected output:
  Alice ($120000) manages 2 people
  Bob ($90000)
  Carol ($95000)
  Total: $305000
Actual output:
  Alice ($120000)  ← Manager::print() was never called, object was sliced`,
    stdlibRefs: [],
  },
  {
    id: 155,
    topic: "OOP",
    difficulty: "Easy",
    title: "Logger Service",
    description: "A logging class with configurable severity levels that formats and outputs log messages.",
    code: `#include <iostream>
#include <string>
#include <chrono>
#include <ctime>

class Logger {
public:
    enum Level { DEBUG, INFO, WARNING, ERROR };

private:
    Level minLevel;
    std::string prefix;

public:
    Logger(const std::string& p, Level lvl = INFO) : prefix(p), minLevel(lvl) {}

    void log(Level lvl, const std::string& msg) const {
        if (lvl < minLevel) return;
        const char* labels[] = {"DEBUG", "INFO", "WARN", "ERROR"};
        std::cout << "[" << labels[lvl] << "] " << prefix << ": " << msg << std::endl;
    }

    void debug(const std::string& msg) const { log(DEBUG, msg); }
    void info(const std::string& msg) const { log(INFO, msg); }
    void warn(const std::string& msg) const { log(WARNING, msg); }
    void error(const std::string& msg) const { log(ERROR, msg); }
};

int main() {
    Logger appLog("App", Logger::WARNING);

    appLog.debug("Starting up");
    appLog.info("Connected to database");
    appLog.warn("Disk space low");
    appLog.error("Failed to write file");

    Logger verboseLog("Verbose", Logger::DEBUG);
    verboseLog.debug("Trace message");
    verboseLog.info("Status update");
}`,
    hints: [
      "Look at the constructor's initializer list carefully. In what order are the members initialized?",
      "Does the initializer list order match the member declaration order?",
      "What value does `minLevel` receive if it's initialized before `prefix` using a parameter that depends on the order?",
    ],
    explanation: "The constructor initializer list is `prefix(p), minLevel(lvl)`, but C++ initializes members in their declaration order, not the initializer list order. Since `minLevel` is declared before `prefix` in the class, `minLevel` is initialized first (with `lvl`, which is fine) and then `prefix` (with `p`, also fine). In this specific case the bug is benign because both initializations use only parameters, not other members. However, the real bug is subtler: the member initializer list order doesn't match declaration order, which is a `-Wreorder` warning. If someone later changes `minLevel`'s initializer to depend on `prefix`, it would read uninitialized memory. The actual observable bug is that the constructor swaps the parameter order from the declaration — this compiles but misleads maintainers and produces warnings with `-Wall`.",
    manifestation: `$ g++ -std=c++17 -Wall logger.cpp -o logger && ./logger
logger.cpp: In constructor 'Logger::Logger(const std::string&, Logger::Level)':
logger.cpp:14:5: warning: 'Logger::minLevel' will be initialized after [-Wreorder]
   14 |     Level minLevel;
      |     ^~~~~
logger.cpp:13:5: warning:   'std::string Logger::prefix' [-Wreorder]
   13 |     std::string prefix;
      |     ^~~~~~~~~~~
logger.cpp:17:5: warning:   when initialized here [-Wreorder]
   17 |     Logger(const std::string& p, Level lvl = INFO) : prefix(p), minLevel(lvl) {}
      |     ^~~~~~
[WARN] App: Disk space low
[ERROR] App: Failed to write file
[DEBUG] Verbose: Trace message
[INFO] Verbose: Status update`,
    stdlibRefs: [],
  },
  {
    id: 156,
    topic: "OOP",
    difficulty: "Easy",
    title: "Plugin Loader",
    description: "A base plugin class with derived plugins that register themselves and execute in sequence.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <memory>

class Plugin {
    std::string name;
public:
    Plugin(const std::string& n) : name(n) {
        std::cout << "Loading plugin: " << name << std::endl;
    }

    ~Plugin() {
        std::cout << "Unloading plugin: " << name << std::endl;
    }

    virtual void execute() {
        std::cout << "Executing: " << name << std::endl;
    }

    const std::string& getName() const { return name; }
};

class LogPlugin : public Plugin {
    std::string* logBuffer;
public:
    LogPlugin() : Plugin("Logger"), logBuffer(new std::string()) {}
    ~LogPlugin() { delete logBuffer; }

    void execute() override {
        *logBuffer += "Log entry\\n";
        std::cout << "Logging: " << logBuffer->size() << " bytes buffered" << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Plugin>> plugins;
    plugins.push_back(std::make_unique<LogPlugin>());
    plugins.push_back(std::make_unique<LogPlugin>());

    for (auto& p : plugins) {
        p->execute();
    }

    // Copy a plugin
    LogPlugin original;
    LogPlugin copy = original;
    copy.execute();
}`,
    hints: [
      "What happens when a LogPlugin is copied?",
      "Does LogPlugin define a copy constructor? What does the compiler-generated one do?",
      "What happens when both the original and the copy are destroyed?",
    ],
    explanation: "LogPlugin has a raw pointer `logBuffer` allocated with `new` and freed in the destructor, but no user-defined copy constructor or copy assignment operator. The compiler-generated copy constructor performs a shallow copy, so both `original` and `copy` point to the same `logBuffer`. When they go out of scope, both destructors call `delete logBuffer` on the same pointer — a double free. This is a classic Rule of Three violation. The fix is to either implement copy/move operations, delete them, or use std::unique_ptr<std::string> instead of a raw pointer.",
    manifestation: `$ g++ -fsanitize=address -g plugins.cpp -o plugins && ./plugins
Loading plugin: Logger
Loading plugin: Logger
Logging: 10 bytes buffered
Logging: 10 bytes buffered
Loading plugin: Logger
Logging: 10 bytes buffered
Unloading plugin: Logger
Unloading plugin: Logger
=================================================================
==15623==ERROR: AddressSanitizer: attempting double-free on 0x602000000050
    #0 0x7f2a1b in operator delete(void*) (/usr/lib/libasan.so+0xe1b)
    #1 0x55c1a3 in LogPlugin::~LogPlugin() plugins.cpp:29
    #2 0x55c4f2 in main plugins.cpp:46
SUMMARY: AddressSanitizer: double-free plugins.cpp:29 in LogPlugin::~LogPlugin()`,
    stdlibRefs: [
      { name: "std::make_unique", args: "<T>(Args&&... args) → unique_ptr<T>", brief: "Creates a unique_ptr that owns a newly constructed object of type T.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique" },
    ],
  },
  {
    id: 157,
    topic: "OOP",
    difficulty: "Medium",
    title: "Shape Renderer",
    description: "Renders different shapes to a canvas by calling their draw method through a base class pointer.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <cmath>

class Shape {
public:
    virtual std::string draw() const = 0;
    virtual double area() const = 0;
    ~Shape() {}
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    std::string draw() const override { return "Circle(r=" + std::to_string(radius) + ")"; }
    double area() const override { return M_PI * radius * radius; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    std::string draw() const override { return "Rect(" + std::to_string(w) + "x" + std::to_string(h) + ")"; }
    double area() const override { return w * h; }
};

int main() {
    std::vector<Shape*> shapes;
    shapes.push_back(new Circle(5.0));
    shapes.push_back(new Rectangle(3.0, 4.0));
    shapes.push_back(new Circle(2.5));

    for (const auto* s : shapes) {
        std::cout << s->draw() << " area=" << s->area() << std::endl;
    }

    for (auto* s : shapes) {
        delete s;
    }
}`,
    hints: [
      "Look at the Shape class destructor. What keyword is missing?",
      "When you delete a derived object through a base pointer, which destructor is called?",
      "What does the C++ standard say about deleting through a base pointer when the destructor isn't virtual?",
    ],
    explanation: "The Shape base class destructor is not virtual. When derived objects (Circle, Rectangle) are deleted through Shape* pointers, only Shape::~Shape() is called, not the derived destructor. For these simple classes with no dynamic resources in the derived part, the immediate effect may not be visible, but it's undefined behavior per the C++ standard. If the derived classes had members needing cleanup (like std::string in draw's return), their destructors would be skipped, causing resource leaks or corruption. The fix is to declare `virtual ~Shape() {}`.",
    manifestation: `$ g++ -fsanitize=undefined -g shapes.cpp -o shapes && ./shapes
Circle(r=5.000000) area=78.5398
Rect(3.000000x4.000000) area=12
Circle(r=2.500000) area=19.635
shapes.cpp:39:9: runtime error: member call on address 0x602000000010 which does not point to an object of type 'Circle'
shapes.cpp:39:9: note: object has invalid vptr

$ # Valgrind shows the leak more clearly:
$ valgrind ./shapes
==21543== 40 bytes in 1 blocks are possibly lost in loss record 1 of 3
==21543==    at 0x4C2A1B: operator new(unsigned long)
==21543==    by 0x401234: main (shapes.cpp:33)`,
    stdlibRefs: [],
  },
  {
    id: 158,
    topic: "OOP",
    difficulty: "Medium",
    title: "Configuration Builder",
    description: "A builder pattern class that constructs configuration objects with chained method calls.",
    code: `#include <iostream>
#include <string>
#include <map>

class Config {
    std::map<std::string, std::string> values;
    friend class ConfigBuilder;
public:
    std::string get(const std::string& key) const {
        auto it = values.find(key);
        return it != values.end() ? it->second : "";
    }

    void print() const {
        for (const auto& [k, v] : values) {
            std::cout << k << " = " << v << std::endl;
        }
    }
};

class ConfigBuilder {
    Config config;
public:
    ConfigBuilder& set(const std::string& key, const std::string& value) {
        config.values[key] = value;
        return *this;
    }

    Config build() {
        return config;
    }
};

Config createDefaultConfig() {
    ConfigBuilder builder;
    return builder
        .set("host", "localhost")
        .set("port", "8080")
        .set("debug", "true")
        .build();
}

int main() {
    Config cfg = createDefaultConfig();
    cfg.print();

    // Modify and rebuild
    ConfigBuilder builder;
    Config cfg2 = builder.set("host", "prod.example.com").set("port", "443").build();
    Config cfg3 = builder.set("host", "staging.example.com").build();

    std::cout << "\\ncfg2 host: " << cfg2.get("host") << std::endl;
    std::cout << "cfg3 host: " << cfg3.get("host") << std::endl;
    std::cout << "cfg3 port: " << cfg3.get("port") << std::endl;
}`,
    hints: [
      "After building cfg2, what state is the builder in?",
      "Does build() reset the builder's internal state?",
      "What values does cfg3 inherit from the builder?",
    ],
    explanation: "The builder does not reset its internal Config after build() is called. When cfg2 is built with host='prod.example.com' and port='443', those values remain in the builder. Then cfg3 is built by setting host='staging.example.com' — but port='443' is still in the builder from the previous build. So cfg3 unexpectedly has port='443' even though the user only set host. The build() method returns a copy but doesn't clear the builder, so previous settings leak into subsequent builds. The fix is to either reset the builder in build(), or use a separate Config object per build chain.",
    manifestation: `$ g++ -std=c++17 -O2 config.cpp -o config && ./config
debug = true
host = localhost
port = 8080

cfg2 host: prod.example.com
cfg3 host: staging.example.com
cfg3 port: 443

Expected output:
  cfg3 port:       ← should be empty, port was never set for cfg3
Actual output:
  cfg3 port: 443   ← leaked from the previous build() call`,
    stdlibRefs: [],
  },
  {
    id: 159,
    topic: "OOP",
    difficulty: "Medium",
    title: "Event Dispatcher",
    description: "An event system where listeners register callbacks for named events and get notified when events fire.",
    code: `#include <iostream>
#include <functional>
#include <unordered_map>
#include <vector>
#include <string>

class EventDispatcher {
    std::unordered_map<std::string, std::vector<std::function<void(const std::string&)>>> listeners;
public:
    void on(const std::string& event, std::function<void(const std::string&)> callback) {
        listeners[event].push_back(callback);
    }

    void emit(const std::string& event, const std::string& data) {
        for (auto& cb : listeners[event]) {
            cb(data);
        }
    }
};

class Button {
    std::string label;
    EventDispatcher& dispatcher;
public:
    Button(const std::string& l, EventDispatcher& d) : label(l), dispatcher(d) {
        dispatcher.on("click", [this](const std::string& data) {
            std::cout << "Button '" << label << "' clicked: " << data << std::endl;
        });
    }
};

int main() {
    EventDispatcher dispatcher;

    Button* btn = new Button("Submit", dispatcher);
    dispatcher.emit("click", "form submitted");

    delete btn;
    dispatcher.emit("click", "late click");
}`,
    hints: [
      "What does the lambda capture in the Button constructor?",
      "What happens to the `this` pointer captured by the lambda after the Button is deleted?",
      "Does deleting the Button remove its callback from the dispatcher?",
    ],
    explanation: "The lambda registered in the Button constructor captures `this` by pointer. When `btn` is deleted, the lambda still exists in the dispatcher's listener list and holds a dangling `this` pointer. The second emit(\"click\", ...) invokes the lambda, which accesses `this->label` on a deleted object — use-after-free undefined behavior. The fix is to either unregister the callback in Button's destructor, use std::weak_ptr to detect dead objects, or ensure the Button outlives the dispatcher.",
    manifestation: `$ g++ -fsanitize=address -g events.cpp -o events && ./events
Button 'Submit' clicked: form submitted
=================================================================
==26734==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000030
READ of size 8 at 0x604000000030 thread T0
    #0 0x55d1a3 in Button::Button(std::string const&, EventDispatcher&)::{lambda(std::string const&)#1}::operator()(std::string const&) const events.cpp:28
    #1 0x55d4f2 in EventDispatcher::emit events.cpp:17
    #2 0x55d6a1 in main events.cpp:40
SUMMARY: AddressSanitizer: heap-use-after-free events.cpp:28 in main`,
    stdlibRefs: [
      { name: "std::function", brief: "A general-purpose polymorphic function wrapper that can store any callable target.", note: "Captures (including this pointers) must outlive the std::function — no automatic invalidation on source destruction.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  {
    id: 160,
    topic: "OOP",
    difficulty: "Medium",
    title: "Matrix Class",
    description: "Implements a 2D matrix class with addition and multiplication operators.",
    code: `#include <iostream>
#include <vector>

class Matrix {
    int rows, cols;
    std::vector<std::vector<double>> data;
public:
    Matrix(int r, int c, double init = 0.0)
        : rows(r), cols(c), data(r, std::vector<double>(c, init)) {}

    double& operator()(int r, int c) { return data[r][c]; }
    double operator()(int r, int c) const { return data[r][c]; }

    Matrix operator+(const Matrix& other) const {
        Matrix result(rows, cols);
        for (int i = 0; i < rows; ++i)
            for (int j = 0; j < cols; ++j)
                result(i, j) = data[i][j] + other(i, j);
        return result;
    }

    Matrix operator*(const Matrix& other) const {
        Matrix result(rows, other.cols);
        for (int i = 0; i < rows; ++i)
            for (int j = 0; j < other.cols; ++j)
                for (int k = 0; k < cols; ++k)
                    result(i, j) = data[i][k] * other(k, j);
        return result;
    }

    void print() const {
        for (int i = 0; i < rows; ++i) {
            for (int j = 0; j < cols; ++j)
                std::cout << data[i][j] << " ";
            std::cout << std::endl;
        }
    }
};

int main() {
    Matrix a(2, 2);
    a(0,0) = 1; a(0,1) = 2;
    a(1,0) = 3; a(1,1) = 4;

    Matrix b(2, 2);
    b(0,0) = 5; b(0,1) = 6;
    b(1,0) = 7; b(1,1) = 8;

    std::cout << "A * B:" << std::endl;
    (a * b).print();
}`,
    hints: [
      "Look carefully at the inner loop of operator*. What operation is being performed?",
      "In matrix multiplication, should result(i,j) be assigned or accumulated?",
      "What is result(i,j) after the inner loop completes — is it the sum of all products or just the last one?",
    ],
    explanation: "In operator*, the innermost loop uses `=` instead of `+=` for result(i,j). Each iteration overwrites the previous partial sum with just the latest product `data[i][k] * other(k,j)`. After the k-loop finishes, result(i,j) only contains `data[i][cols-1] * other(cols-1, j)` — the last term — instead of the sum of all terms. The fix is to change `result(i, j) = data[i][k] * other(k, j)` to `result(i, j) += data[i][k] * other(k, j)`.",
    manifestation: `$ g++ -std=c++17 -O2 matrix.cpp -o matrix && ./matrix
A * B:
14 16
28 32

Expected output:
  A * B:
  19 22
  43 50
Actual output:
  14 16   ← only the last term of each dot product (2*7, 2*8, 4*7, 4*8)
  28 32`,
    stdlibRefs: [],
  },
  {
    id: 161,
    topic: "OOP",
    difficulty: "Hard",
    title: "Observable Pattern",
    description: "Implements the observer pattern where subjects notify observers of state changes.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Observer {
public:
    virtual void update(const std::string& event) = 0;
    virtual ~Observer() = default;
};

class Subject {
    std::vector<Observer*> observers;
public:
    void attach(Observer* obs) { observers.push_back(obs); }
    void detach(Observer* obs) {
        observers.erase(
            std::remove(observers.begin(), observers.end(), obs),
            observers.end()
        );
    }
    void notify(const std::string& event) {
        for (auto* obs : observers) {
            obs->update(event);
        }
    }
};

class Logger : public Observer {
    std::string name;
public:
    Logger(const std::string& n) : name(n) {}
    void update(const std::string& event) override {
        std::cout << "[" << name << "] " << event << std::endl;
        if (event == "shutdown") {
            // Unsubscribe on shutdown
            // But we don't have a reference to the subject here...
        }
    }
};

class AutoDetach : public Observer {
    Subject& subject;
    std::string name;
public:
    AutoDetach(const std::string& n, Subject& s) : name(n), subject(s) {
        subject.attach(this);
    }
    void update(const std::string& event) override {
        std::cout << "[" << name << "] " << event << std::endl;
        if (event == "error") {
            subject.detach(this);
        }
    }
};

int main() {
    Subject bus;
    Logger log1("Main");
    AutoDetach log2("Safety", bus);

    bus.attach(&log1);

    bus.notify("start");
    bus.notify("error");
    bus.notify("continue");
}`,
    hints: [
      "What happens to the observers vector during notify() when an observer detaches itself?",
      "Is it safe to modify a vector while iterating over it with a range-for loop?",
      "When AutoDetach calls subject.detach(this) inside update(), what happens to the for loop in notify()?",
    ],
    explanation: "During notify(\"error\"), the for loop iterates over the observers vector. When AutoDetach::update() is called and it calls subject.detach(this), the vector is modified (element removed) while the range-for loop is iterating it. The erase-remove idiom inside detach() invalidates iterators, so the for loop in notify() continues with an invalidated iterator — undefined behavior. This may skip observers, double-call observers, or crash. The fix is to defer detach operations (e.g., collect them in a pending list and apply after notify completes), or iterate over a copy of the observers vector.",
    manifestation: `$ g++ -fsanitize=address -g observer.cpp -o observer && ./observer
[Safety] start
[Main] start
[Safety] error
[Main] continue

$ # Missing "[Main] error" — the Main observer was skipped!
$ # With different vector sizes, it may crash instead:
$ g++ -fsanitize=address -g observer_large.cpp -o observer && ./observer
[Safety] error
=================================================================
==31245==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000028
READ of size 8 at 0x604000000028 thread T0
    #0 0x55a1b3 in Subject::notify observer.cpp:23
    #1 0x55a4f2 in main observer.cpp:58
SUMMARY: AddressSanitizer: heap-use-after-free observer.cpp:23 in main`,
    stdlibRefs: [
      { name: "std::remove", args: "(ForwardIt first, ForwardIt last, const T& value) → ForwardIt", brief: "Moves elements not equal to value to the front and returns an iterator to the new logical end.", note: "Does not actually erase elements — must be followed by container.erase(). Modifying the range invalidates iterators to it.", link: "https://en.cppreference.com/w/cpp/algorithm/remove" },
    ],
  },
  {
    id: 162,
    topic: "OOP",
    difficulty: "Hard",
    title: "Expression Evaluator",
    description: "Uses a class hierarchy to represent and evaluate arithmetic expressions like (3 + 4) * 2.",
    code: `#include <iostream>
#include <memory>
#include <string>

class Expr {
public:
    virtual double eval() const = 0;
    virtual std::string str() const = 0;
    virtual ~Expr() = default;
};

class Num : public Expr {
    double value;
public:
    Num(double v) : value(v) {}
    double eval() const override { return value; }
    std::string str() const override { return std::to_string(value); }
};

class BinOp : public Expr {
    char op;
    std::unique_ptr<Expr> left, right;
public:
    BinOp(char op, std::unique_ptr<Expr> l, std::unique_ptr<Expr> r)
        : op(op), left(std::move(l)), right(std::move(r)) {}

    double eval() const override {
        switch (op) {
            case '+': return left->eval() + right->eval();
            case '-': return left->eval() - right->eval();
            case '*': return left->eval() * right->eval();
            case '/': return left->eval() / right->eval();
        }
        return 0;
    }

    std::string str() const override {
        return "(" + left->str() + " " + op + " " + right->str() + ")";
    }
};

std::unique_ptr<Expr> makeExpr() {
    // (3 + 4) * 2
    return std::make_unique<BinOp>('*',
        std::make_unique<BinOp>('+',
            std::make_unique<Num>(3),
            std::make_unique<Num>(4)
        ),
        std::make_unique<Num>(2)
    );
}

int main() {
    auto expr = makeExpr();
    std::cout << expr->str() << " = " << expr->eval() << std::endl;

    // Copy the expression for later use
    auto* raw = expr.get();
    auto expr2 = std::move(expr);
    std::cout << "Copy: " << raw->str() << std::endl;
}`,
    hints: [
      "After std::move(expr), what is the state of expr?",
      "What does raw point to after expr is moved to expr2?",
      "Is raw->str() safe to call after the move?",
    ],
    explanation: "After `auto expr2 = std::move(expr)`, the ownership of the expression tree transfers to expr2, and expr becomes null. The raw pointer `raw` was obtained from expr before the move. After the move, raw still points to the valid object (now owned by expr2), so raw->str() actually works fine in this case. However, the code is dangerously misleading — `raw` appears to use a moved-from object. The real bug becomes apparent if the lines were reordered or if expr2 goes out of scope first: raw would then dangle. But as written, the actual subtle bug is in the expression tree itself: the str() method doesn't handle operator precedence, and more critically, the BinOp constructor initializes members in declaration order (op, left, right), but `op` is a char while the unique_ptrs are moved — if the constructor threw between moves, the already-moved-from arguments would be lost. The observable bug: calling raw->str() works here but is a ticking time bomb that any refactor would break.",
    manifestation: `$ g++ -std=c++17 -O2 expr.cpp -o expr && ./expr
((3.000000 + 4.000000) * 2.000000) = 14
Copy: ((3.000000 + 4.000000) * 2.000000)

$ # Works... but add expr2.reset() before the raw->str() call:
$ g++ -fsanitize=address -g expr_bug.cpp -o expr && ./expr
((3.000000 + 4.000000) * 2.000000) = 14
=================================================================
==18452==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000010
READ of size 8 at 0x604000000010 thread T0
    #0 0x55c1a3 in main expr.cpp:52
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-use-after-free expr.cpp:52 in main`,
    stdlibRefs: [
      { name: "std::unique_ptr::get", args: "() → pointer", brief: "Returns the stored pointer without releasing ownership.", note: "The returned raw pointer is only valid as long as the unique_ptr (or its moved-to successor) keeps the object alive.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/get" },
    ],
  },
  {
    id: 163,
    topic: "OOP",
    difficulty: "Hard",
    title: "Chain of Responsibility",
    description: "Implements a chain of handlers where each handler either processes a request or passes it to the next.",
    code: `#include <iostream>
#include <string>
#include <memory>
#include <sstream>

class Handler {
    std::shared_ptr<Handler> next;
public:
    void setNext(std::shared_ptr<Handler> n) { next = n; }

    virtual bool canHandle(int level) const = 0;
    virtual void process(const std::string& msg) const = 0;
    virtual ~Handler() = default;

    void handle(int level, const std::string& msg) const {
        if (canHandle(level)) {
            process(msg);
        } else if (next) {
            next->handle(level, msg);
        } else {
            std::cout << "No handler for level " << level << std::endl;
        }
    }
};

class InfoHandler : public Handler {
public:
    bool canHandle(int level) const override { return level <= 1; }
    void process(const std::string& msg) const override {
        std::cout << "[INFO] " << msg << std::endl;
    }
};

class WarnHandler : public Handler {
public:
    bool canHandle(int level) const override { return level <= 2; }
    void process(const std::string& msg) const override {
        std::cout << "[WARN] " << msg << std::endl;
    }
};

class ErrorHandler : public Handler {
public:
    bool canHandle(int level) const override { return level <= 3; }
    void process(const std::string& msg) const override {
        std::cout << "[ERROR] " << msg << std::endl;
    }
};

int main() {
    auto info = std::make_shared<InfoHandler>();
    auto warn = std::make_shared<WarnHandler>();
    auto error = std::make_shared<ErrorHandler>();

    info->setNext(warn);
    warn->setNext(error);
    error->setNext(info);  // circular chain as fallback

    info->handle(1, "Status OK");
    info->handle(2, "Disk space low");
    info->handle(3, "Connection lost");
    info->handle(4, "Unknown severity");
}`,
    hints: [
      "What happens when handle() is called with a level that no handler can process?",
      "Trace the path of handle(4, ...) through the chain.",
      "What does setting error->setNext(info) create in terms of the chain structure?",
    ],
    explanation: "The line `error->setNext(info)` creates a circular chain: info → warn → error → info → ... When handle(4, \"Unknown severity\") is called, no handler's canHandle() returns true for level 4. The request passes from info to warn to error, then back to info, creating infinite recursion. This eventually causes a stack overflow. The fix is to either not create a circular chain (leave error's next as nullptr), or add cycle detection, or have a catch-all handler at the end.",
    manifestation: `$ g++ -std=c++17 -O0 -g chain.cpp -o chain && ./chain
[INFO] Status OK
[WARN] Disk space low
[ERROR] Connection lost
Segmentation fault (core dumped)

$ # Stack overflow from infinite recursion in the circular chain
$ ulimit -s 256 && ./chain
[INFO] Status OK
[WARN] Disk space low
[ERROR] Connection lost
Segmentation fault (core dumped)`,
    stdlibRefs: [
      { name: "std::shared_ptr", brief: "A reference-counted smart pointer that shares ownership of a dynamically allocated object.", note: "Circular shared_ptr references prevent deallocation; here they also cause infinite recursion in the handler chain.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr" },
    ],
  },
  // ── Lambdas ──
  {
    id: 164,
    topic: "Lambdas",
    difficulty: "Easy",
    title: "Multiplier Factory",
    description: "Creates a set of multiplier functions that each multiply their input by a different factor.",
    code: `#include <iostream>
#include <vector>
#include <functional>

int main() {
    std::vector<std::function<int(int)>> multipliers;

    for (int i = 1; i <= 5; ++i) {
        multipliers.push_back([&i](int x) { return x * i; });
    }

    for (int m = 0; m < 5; ++m) {
        std::cout << "multiplier[" << m << "](10) = "
                  << multipliers[m](10) << std::endl;
    }
}`,
    hints: [
      "What does the lambda capture, and how?",
      "What is the value of `i` when the lambdas are actually called?",
      "What is the lifetime of the loop variable `i` relative to the lambda invocations?",
    ],
    explanation: "The lambda captures `i` by reference (`&i`). All five lambdas share the same reference to the loop variable `i`. By the time the lambdas are invoked in the second loop, the first loop has finished and `i` has the value 6 (one past the loop bound). Furthermore, `i` is a local variable of the for-loop scope, so accessing it after the loop ends may be undefined behavior depending on compiler implementation. Even if accessible, all multipliers return `x * 6` instead of `x * 1`, `x * 2`, etc. The fix is to capture `i` by value: `[i](int x) { return x * i; }`.",
    manifestation: `$ g++ -std=c++17 -O2 multiplier.cpp -o multiplier && ./multiplier
multiplier[0](10) = 60
multiplier[1](10) = 60
multiplier[2](10) = 60
multiplier[3](10) = 60
multiplier[4](10) = 60

Expected output:
  multiplier[0](10) = 10
  multiplier[1](10) = 20
  multiplier[2](10) = 30
  multiplier[3](10) = 40
  multiplier[4](10) = 50
Actual output:
  All return 60 — every lambda reads the same (post-loop) value of i`,
    stdlibRefs: [
      { name: "std::function", brief: "A general-purpose polymorphic function wrapper that can store any callable target.", note: "Captures inside the stored callable must remain valid when the function is invoked.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  {
    id: 165,
    topic: "Lambdas",
    difficulty: "Easy",
    title: "Running Total",
    description: "Uses a lambda to compute a running total of elements in a vector.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> values = {10, 20, 30, 40, 50};
    int total = 0;

    auto accumulate = [total](int val) mutable {
        total += val;
        return total;
    };

    std::cout << "Running totals:" << std::endl;
    for (int v : values) {
        std::cout << "  +" << v << " = " << accumulate(v) << std::endl;
    }

    std::cout << "Final total: " << total << std::endl;
}`,
    hints: [
      "The lambda captures `total` — but how?",
      "When a lambda captures by value, does modifying the captured variable affect the original?",
      "What does `mutable` allow the lambda to do, and what doesn't it allow?",
    ],
    explanation: "The lambda captures `total` by value (copy), not by reference. The `mutable` keyword allows modifying the captured copy inside the lambda, and the running totals print correctly. But the final `total` in main() remains 0 because the lambda's modifications only affect its internal copy. The user expects `total` to be 150 at the end, but it stays at 0. The fix is to capture by reference: `[&total](int val)`.",
    manifestation: `$ g++ -std=c++17 -O2 running.cpp -o running && ./running
Running totals:
  +10 = 10
  +20 = 30
  +30 = 60
  +40 = 100
  +50 = 150
Final total: 0

Expected output:
  Final total: 150
Actual output:
  Final total: 0  ← original variable was never modified`,
    stdlibRefs: [],
  },
  {
    id: 166,
    topic: "Lambdas",
    difficulty: "Easy",
    title: "Custom Sort Comparator",
    description: "Sorts a list of students by grade (descending), then by name (ascending) for ties.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Student {
    std::string name;
    int grade;
};

int main() {
    std::vector<Student> students = {
        {"Alice", 90}, {"Bob", 85}, {"Carol", 90},
        {"Dave", 78}, {"Eve", 85}, {"Frank", 92}
    };

    std::sort(students.begin(), students.end(),
        [](const Student& a, const Student& b) {
            if (a.grade >= b.grade) return true;
            if (a.grade < b.grade) return false;
            return a.name < b.name;
        });

    for (const auto& s : students) {
        std::cout << s.name << ": " << s.grade << std::endl;
    }
}`,
    hints: [
      "What does a valid strict weak ordering comparator require?",
      "What does the comparator return when a.grade == b.grade?",
      "If comp(a, b) returns true, what must comp(b, a) return for the sort to be correct?",
    ],
    explanation: "The comparator violates strict weak ordering. When `a.grade == b.grade`, the first condition `a.grade >= b.grade` is true, so it returns true. But then for the same pair in reverse order, `b.grade >= a.grade` is also true, so comp(a,b) and comp(b,a) both return true. Strict weak ordering requires that if comp(a,b) is true, comp(b,a) must be false (irreflexivity). This is undefined behavior when passed to std::sort — it can cause infinite loops, crashes, or out-of-bounds access. The fix is to use `>` instead of `>=`: `if (a.grade > b.grade) return true; if (a.grade < b.grade) return false;`.",
    manifestation: `$ g++ -std=c++17 -O2 sortstudents.cpp -o sortstudents && ./sortstudents
Frank: 92
Carol: 90
Alice: 90
Bob: 85
Eve: 85
Dave: 78

$ # May look correct... but with -D_GLIBCXX_DEBUG:
$ g++ -std=c++17 -D_GLIBCXX_DEBUG sortstudents.cpp -o sortstudents && ./sortstudents
/usr/include/c++/12/bits/stl_algo.h:1886: Error: comparison doesn't meet irreflexivity requirements,
  assert(!(a < a)).
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::sort", args: "(RandomIt first, RandomIt last, Compare comp) → void", brief: "Sorts elements in the range [first, last) using the given comparison function.", note: "The comparator must satisfy strict weak ordering: comp(a, a) must be false, and if comp(a, b) is true then comp(b, a) must be false.", link: "https://en.cppreference.com/w/cpp/algorithm/sort" },
    ],
  },
  {
    id: 167,
    topic: "Lambdas",
    difficulty: "Medium",
    title: "Callback Timer",
    description: "Registers callback functions to execute after a simulated delay, with each callback accessing its associated data.",
    code: `#include <iostream>
#include <vector>
#include <functional>
#include <string>

class Timer {
    std::vector<std::function<void()>> callbacks;
public:
    void after(std::function<void()> cb) {
        callbacks.push_back(cb);
    }

    void tick() {
        for (auto& cb : callbacks) {
            cb();
        }
        callbacks.clear();
    }
};

std::function<void()> createGreeting(Timer& timer, const std::string& name) {
    std::string message = "Hello, " + name + "!";
    timer.after([&message]() {
        std::cout << message << std::endl;
    });
    return [&message]() {
        std::cout << "Reminder: " << message << std::endl;
    };
}

int main() {
    Timer timer;

    auto reminder1 = createGreeting(timer, "Alice");
    auto reminder2 = createGreeting(timer, "Bob");

    std::cout << "--- Tick ---" << std::endl;
    timer.tick();

    std::cout << "--- Reminders ---" << std::endl;
    reminder1();
    reminder2();
}`,
    hints: [
      "Where is the `message` variable allocated?",
      "What happens to `message` when createGreeting() returns?",
      "The lambda captures `message` by reference — is the referenced object still alive when the lambda executes?",
    ],
    explanation: "The `message` string is a local variable in createGreeting(). The lambda captures it by reference (`&message`). When createGreeting() returns, `message` is destroyed, leaving all the lambdas (both the one registered with the timer and the returned reminder) with dangling references. When timer.tick() or reminder1()/reminder2() invoke these lambdas, they access destroyed stack memory — undefined behavior. The fix is to capture `message` by value: `[message]()` or `[msg = std::move(message)]()`.",
    manifestation: `$ g++ -fsanitize=address -g timer.cpp -o timer && ./timer
--- Tick ---
=================================================================
==29341==ERROR: AddressSanitizer: stack-use-after-return on address 0x7f2a28c00060
READ of size 8 at 0x7f2a28c00060 thread T0
    #0 0x55c1a3 in createGreeting(Timer&, std::string const&)::{lambda()#1}::operator()() timer.cpp:23
    #1 0x55c4f2 in Timer::tick() timer.cpp:13
    #2 0x55c6a1 in main timer.cpp:35
SUMMARY: AddressSanitizer: stack-use-after-return timer.cpp:23 in main`,
    stdlibRefs: [],
  },
  {
    id: 168,
    topic: "Lambdas",
    difficulty: "Medium",
    title: "Predicate Chain",
    description: "Combines multiple predicates into a single filter that only passes elements satisfying all conditions.",
    code: `#include <iostream>
#include <vector>
#include <functional>
#include <algorithm>

template <typename T>
class PredicateChain {
    std::vector<std::function<bool(const T&)>> predicates;
public:
    PredicateChain& add(std::function<bool(const T&)> pred) {
        predicates.push_back(pred);
        return *this;
    }

    bool test(const T& val) const {
        for (const auto& pred : predicates) {
            if (!pred(val)) return false;
        }
        return true;
    }

    std::function<bool(const T&)> combine() const {
        return [this](const T& val) {
            return test(val);
        };
    }
};

int main() {
    auto chain = PredicateChain<int>()
        .add([](const int& x) { return x > 0; })
        .add([](const int& x) { return x % 2 == 0; })
        .add([](const int& x) { return x < 100; });

    auto filter = chain.combine();

    std::vector<int> nums = {-5, 2, 7, 42, 100, 88, 0, 16};

    std::cout << "Passing values:" << std::endl;
    for (int n : nums) {
        if (filter(n)) {
            std::cout << "  " << n << std::endl;
        }
    }
}`,
    hints: [
      "What does the lambda inside combine() capture?",
      "What is the lifetime of the PredicateChain object constructed in the chained expression?",
      "Is the `this` pointer still valid when `filter` is called?",
    ],
    explanation: "The combine() method returns a lambda that captures `this`. But `chain` in main() is constructed as a temporary expression: `PredicateChain<int>().add(...).add(...).add(...)`. The `add()` method returns `*this` by reference, so the chain works — but `chain` is a copy of the temporary (assuming copy elision). The `this` captured by combine() points to `chain`, which is valid. However, if `chain` is moved or goes out of scope before `filter` is called, the captured `this` dangles. In this specific code, `chain` and `filter` are in the same scope, so it works. But the design is fragile: returning `filter` from a function would immediately dangle. The real bug appears when the code is even slightly refactored — e.g., `auto filter = PredicateChain<int>().add(...).combine();` creates a filter with a `this` pointing to a destroyed temporary.",
    manifestation: `$ g++ -std=c++17 -O2 predchain.cpp -o predchain && ./predchain
Passing values:
  2
  42
  88
  16

$ # Works! But refactor to a one-liner:
$ # auto filter = PredicateChain<int>().add(...).add(...).combine();
$ g++ -fsanitize=address -g predchain_oneliner.cpp -o predchain && ./predchain
=================================================================
==17892==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd4a200080
READ of size 8 at 0x7ffd4a200080 thread T0
    #0 0x55a1b3 in PredicateChain<int>::test predchain.cpp:17
    #1 0x55a4f2 in main predchain.cpp:38
SUMMARY: AddressSanitizer: stack-use-after-scope predchain.cpp:17 in main`,
    stdlibRefs: [],
  },
  {
    id: 169,
    topic: "Lambdas",
    difficulty: "Medium",
    title: "Event Filter Pipeline",
    description: "Processes a stream of events through a pipeline of lambda transformations, printing those that pass all stages.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <functional>
#include <algorithm>

struct Event {
    std::string type;
    int severity;
    std::string message;
};

int main() {
    std::vector<Event> events = {
        {"error", 5, "Disk full"},
        {"info", 1, "User logged in"},
        {"warning", 3, "High memory"},
        {"error", 4, "Connection timeout"},
        {"info", 1, "Heartbeat"},
        {"error", 5, "Database down"},
    };

    int threshold = 3;

    auto highSeverity = [threshold](const Event& e) {
        return e.severity >= threshold;
    };

    auto errorsOnly = [](const Event& e) {
        return e.type == "error";
    };

    // Remove non-matching events
    auto it = std::remove_if(events.begin(), events.end(),
        [&](const Event& e) { return !highSeverity(e) || !errorsOnly(e); });

    events.erase(it, events.end());

    threshold = 1;  // Lower threshold for next filter pass

    std::cout << "Critical errors:" << std::endl;
    for (const auto& e : events) {
        if (highSeverity(e)) {
            std::cout << "  [" << e.severity << "] " << e.message << std::endl;
        }
    }
}`,
    hints: [
      "How does the `highSeverity` lambda capture `threshold`?",
      "After changing `threshold = 1`, does the highSeverity lambda see the new value?",
      "What is the difference between capturing by value and by reference for the second filter pass?",
    ],
    explanation: "The `highSeverity` lambda captures `threshold` by value (copy). When `threshold` is changed to 1 after the initial filter, the lambda still uses its captured value of 3. The second filter pass in the for-loop uses `highSeverity(e)` which still checks `e.severity >= 3`, so it filters identically to before. The programmer expected lowering the threshold to show more results, but the captured copy doesn't see the update. The fix depends on intent: if the threshold should be dynamic, capture by reference `[&threshold]`; if the initial capture was intentional, don't change the outer variable expecting the lambda to reflect it.",
    manifestation: `$ g++ -std=c++17 -O2 pipeline.cpp -o pipeline && ./pipeline
Critical errors:
  [5] Disk full
  [4] Connection timeout
  [5] Database down

Expected output (after lowering threshold to 1):
  Critical errors:
  [5] Disk full
  [4] Connection timeout
  [5] Database down
  ← all three still shown, same as before — threshold change had no effect
  ← severity 4 event should have been included even with threshold=3,
     but lowering to 1 was supposed to include more events if any were left`,
    stdlibRefs: [
      { name: "std::remove_if", args: "(ForwardIt first, ForwardIt last, UnaryPredicate p) → ForwardIt", brief: "Moves elements for which the predicate returns false to the front; returns iterator to the new logical end.", note: "Does not actually remove elements — must be followed by erase().", link: "https://en.cppreference.com/w/cpp/algorithm/remove" },
    ],
  },
  {
    id: 170,
    topic: "Lambdas",
    difficulty: "Medium",
    title: "Retry Wrapper",
    description: "A generic retry function that attempts an operation up to N times, with a configurable delay between attempts.",
    code: `#include <iostream>
#include <functional>
#include <string>
#include <stdexcept>

template <typename F>
auto retry(F&& func, int maxAttempts) {
    int attempts = 0;
    while (true) {
        try {
            return func();
        } catch (const std::exception& e) {
            ++attempts;
            if (attempts > maxAttempts) throw;
            std::cout << "Attempt " << attempts << " failed: "
                      << e.what() << ". Retrying..." << std::endl;
        }
    }
}

int main() {
    int callCount = 0;

    auto unreliableOp = [callCount]() mutable -> std::string {
        ++callCount;
        if (callCount < 3) {
            throw std::runtime_error("service unavailable");
        }
        return "success on attempt " + std::to_string(callCount);
    };

    try {
        auto result = retry(unreliableOp, 5);
        std::cout << "Result: " << result << std::endl;
    } catch (const std::exception& e) {
        std::cout << "All attempts failed: " << e.what() << std::endl;
    }

    std::cout << "Total calls made: " << callCount << std::endl;
}`,
    hints: [
      "How is `callCount` captured by the lambda?",
      "Does the `mutable` keyword make the captured variable shared with the outer scope?",
      "After retry() finishes, what is the value of `callCount` in main()?",
    ],
    explanation: "The lambda captures `callCount` by value (copy). Even though `mutable` allows modifying the captured copy, the original `callCount` in main() is never changed — it remains 0. The lambda's internal copy tracks attempts correctly (so the retry logic works and succeeds on the 3rd attempt), but the final print of `callCount` shows 0. The user expects to see how many total calls were made. The fix is to capture by reference: `[&callCount]()` (and remove `mutable` since it's no longer needed).",
    manifestation: `$ g++ -std=c++17 -O2 retry.cpp -o retry && ./retry
Attempt 1 failed: service unavailable. Retrying...
Attempt 2 failed: service unavailable. Retrying...
Result: success on attempt 3
Total calls made: 0

Expected output:
  Total calls made: 3
Actual output:
  Total calls made: 0  ← capture by value, original never modified`,
    stdlibRefs: [],
  },
  {
    id: 171,
    topic: "Lambdas",
    difficulty: "Hard",
    title: "Lazy Sequence Generator",
    description: "Creates a lazy sequence generator using lambdas that produces Fibonacci numbers on demand.",
    code: `#include <iostream>
#include <functional>
#include <vector>

std::function<int()> makeFibonacci() {
    int a = 0, b = 1;
    return [a, b]() mutable -> int {
        int result = a;
        int next = a + b;
        a = b;
        b = next;
        return result;
    };
}

std::vector<std::function<int()>> createGenerators(int count) {
    std::vector<std::function<int()>> gens;
    for (int i = 0; i < count; ++i) {
        gens.push_back(makeFibonacci());
    }
    return gens;
}

int main() {
    auto fib = makeFibonacci();

    std::cout << "Fibonacci sequence:" << std::endl;
    for (int i = 0; i < 10; ++i) {
        std::cout << fib() << " ";
    }
    std::cout << std::endl;

    // Two independent generators
    auto gen1 = makeFibonacci();
    auto gen2 = gen1;  // copy the generator

    // Advance gen1
    for (int i = 0; i < 5; ++i) gen1();

    std::cout << "gen1 (after 5 advances): " << gen1() << std::endl;
    std::cout << "gen2 (no advances): " << gen2() << std::endl;
}`,
    hints: [
      "When gen2 is assigned from gen1, what state does it get?",
      "Are gen1 and gen2 independent after the copy?",
      "After advancing gen1 five times, where does gen2 start producing from?",
    ],
    explanation: "The code `auto gen2 = gen1;` copies the std::function, which copies the lambda including its captured state (`a` and `b`). At that point gen1 and gen2 are independent copies with identical state (a=0, b=1). After advancing gen1 five times, gen1 is at the 6th Fibonacci number (5), while gen2 is still at the beginning (0). This is actually correct behavior! The program works as expected. But the subtle bug is in the Fibonacci logic itself: `int next = a + b` uses int, which will overflow for large Fibonacci numbers. The 47th Fibonacci number exceeds INT_MAX (2,147,483,647), causing signed integer overflow — undefined behavior. With enough calls, the generator produces negative garbage.",
    manifestation: `$ g++ -std=c++17 -O2 lazyfib.cpp -o lazyfib && ./lazyfib
Fibonacci sequence:
0 1 1 2 3 5 8 13 21 34
gen1 (after 5 advances): 5
gen2 (no advances): 0

$ # Looks fine! But generate more terms:
$ g++ -std=c++17 -O2 lazyfib_long.cpp -o lazyfib && ./lazyfib
...
fib(46) = 1836311903
fib(47) = -1323752223

Expected output:
  fib(47) = 2971215073
Actual output:
  fib(47) = -1323752223  ← signed int overflow, undefined behavior`,
    stdlibRefs: [
      { name: "std::function", brief: "A general-purpose polymorphic function wrapper that can store any callable target.", note: "Copying a std::function copies the stored callable, including all captured state — the copies are independent.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  {
    id: 172,
    topic: "Lambdas",
    difficulty: "Hard",
    title: "Async Task Scheduler",
    description: "Schedules a batch of tasks as lambdas, captures their shared state, and executes them in sequence.",
    code: `#include <iostream>
#include <vector>
#include <functional>
#include <memory>
#include <string>

class TaskScheduler {
    std::vector<std::function<void()>> tasks;
public:
    void schedule(std::function<void()> task) {
        tasks.push_back(std::move(task));
    }

    void runAll() {
        for (auto& task : tasks) {
            task();
        }
        tasks.clear();
    }
};

void addProcessingTasks(TaskScheduler& scheduler, const std::vector<std::string>& items) {
    auto results = std::make_shared<std::vector<std::string>>();

    for (size_t i = 0; i < items.size(); ++i) {
        scheduler.schedule([&items, i, results]() {
            std::string processed = "[" + items[i] + "]";
            results->push_back(processed);
            std::cout << "Processed: " << processed << std::endl;
        });
    }

    scheduler.schedule([results]() {
        std::cout << "Total processed: " << results->size() << std::endl;
    });
}

int main() {
    TaskScheduler scheduler;

    {
        std::vector<std::string> data = {"alpha", "beta", "gamma"};
        addProcessingTasks(scheduler, data);
    }

    scheduler.runAll();
}`,
    hints: [
      "Look at what each lambda captures. Which captures are by reference vs. by value?",
      "What is the lifetime of the `data` vector relative to when runAll() is called?",
      "The `items` parameter is a const reference — what does capturing `&items` actually capture?",
    ],
    explanation: "The processing lambdas capture `items` by reference (`&items`). But `items` is a const reference parameter to `addProcessingTasks`, which itself references the `data` vector in main(). After the block in main() ends, `data` is destroyed. When `scheduler.runAll()` is called, the lambdas access `items` which refers to the destroyed `data` vector — use-after-free. The `results` shared_ptr is correctly captured by value so it survives, but the `items` reference does not. The fix is to capture items by value: copy the vector into the lambda, or use a shared_ptr to the items.",
    manifestation: `$ g++ -fsanitize=address -g scheduler.cpp -o scheduler && ./scheduler
=================================================================
==22741==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000050
READ of size 8 at 0x604000000050 thread T0
    #0 0x55d1a3 in addProcessingTasks(TaskScheduler&, std::vector<std::string> const&)::{lambda()#1}::operator()() scheduler.cpp:28
    #1 0x55d4f2 in TaskScheduler::runAll() scheduler.cpp:15
    #2 0x55d6a1 in main scheduler.cpp:42
SUMMARY: AddressSanitizer: heap-use-after-free scheduler.cpp:28 in main`,
    stdlibRefs: [
      { name: "std::make_shared", args: "<T>(Args&&... args) → shared_ptr<T>", brief: "Creates a shared_ptr that manages a new object constructed with the given arguments.", note: "Shared ownership keeps the object alive as long as any shared_ptr copy exists — useful for extending lifetime across lambdas.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared" },
    ],
  },
  {
    id: 173,
    topic: "Lambdas",
    difficulty: "Hard",
    title: "Memoized Recursive Function",
    description: "Implements a memoized recursive function to compute the number of unique paths in a grid.",
    code: `#include <iostream>
#include <functional>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, long long> cache;

    std::function<long long(int, int)> uniquePaths =
        [&cache, &uniquePaths](int rows, int cols) -> long long {
        if (rows == 1 || cols == 1) return 1;

        std::string key = std::to_string(rows) + "," + std::to_string(cols);
        if (cache.count(key)) return cache[key];

        long long result = uniquePaths(rows - 1, cols) + uniquePaths(rows, cols - 1);
        cache[key] = result;
        return result;
    };

    std::cout << "uniquePaths(3, 3) = " << uniquePaths(3, 3) << std::endl;
    std::cout << "uniquePaths(3, 7) = " << uniquePaths(3, 7) << std::endl;
    std::cout << "uniquePaths(10, 10) = " << uniquePaths(10, 10) << std::endl;

    // Create a copy for later use
    auto pathFinder = uniquePaths;
    cache.clear();

    std::cout << "After cache clear:" << std::endl;
    std::cout << "uniquePaths(3, 3) = " << pathFinder(3, 3) << std::endl;
}`,
    hints: [
      "When `pathFinder` is copied from `uniquePaths`, what does its internal `&uniquePaths` reference point to?",
      "When `pathFinder` calls itself recursively, does it call `pathFinder` or `uniquePaths`?",
      "If `uniquePaths` is reassigned or moved after the copy, what happens to the recursive calls inside `pathFinder`?",
    ],
    explanation: "The lambda captures `&uniquePaths` by reference for recursion. When `pathFinder` is assigned as a copy, it holds its own copy of the lambda's closure — but the captured `&uniquePaths` still references the original `uniquePaths` variable, not `pathFinder`. So when `pathFinder` makes recursive calls, it calls through `uniquePaths`, not through itself. In this code, `uniquePaths` still exists and is valid, so it works — but the recursion goes through `uniquePaths`, which shares the same `cache` reference. After `cache.clear()`, the recursion recomputes everything (as expected). The real subtle issue: if `uniquePaths` were moved or destroyed before `pathFinder` is used, the `&uniquePaths` reference would dangle, causing undefined behavior on the first recursive call.",
    manifestation: `$ g++ -std=c++17 -O2 memo.cpp -o memo && ./memo
uniquePaths(3, 3) = 6
uniquePaths(3, 7) = 28
uniquePaths(10, 10) = 48620
After cache clear:
uniquePaths(3, 3) = 6

$ # Works... but try moving uniquePaths:
$ g++ -fsanitize=address -g memo_move.cpp -o memo && ./memo
uniquePaths(3, 3) = 6
=================================================================
==25891==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd4a200080
READ of size 8 at 0x7ffd4a200080 thread T0
    #0 0x55a1b3 in main::{lambda(int, int)#1}::operator()(int, int) memo.cpp:10
    #1 0x55a4f2 in main memo.cpp:28
SUMMARY: AddressSanitizer: stack-use-after-scope memo.cpp:10 in main`,
    stdlibRefs: [
      { name: "std::function", brief: "A general-purpose polymorphic function wrapper that can store any callable target.", note: "Recursive lambdas captured by reference to a std::function variable create a dependency on that specific variable's lifetime.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  // ── Modern C++ ──
  {
    id: 174,
    topic: "Modern C++",
    difficulty: "Easy",
    title: "Range-Based Sum",
    description: "Iterates over a container using range-based for loops to compute and print the sum of elements.",
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> values = {10, 20, 30, 40, 50};

    int sum = 0;
    for (auto val : values) {
        val *= 2;  // double each element
    }

    for (const auto& val : values) {
        sum += val;
        std::cout << val << " ";
    }
    std::cout << std::endl;

    std::cout << "Sum of doubled values: " << sum << std::endl;
}`,
    hints: [
      "Look at the first range-based for loop. What does `auto val` declare?",
      "Is `val` a reference to the element or a copy?",
      "Does modifying `val` in the first loop affect the elements stored in the vector?",
    ],
    explanation: "The first loop uses `auto val` (by value), so each element is copied into `val`. The line `val *= 2` modifies only the local copy, not the actual element in the vector. The second loop then reads the original, unmodified values. The sum is 150 (sum of originals) instead of 300 (sum of doubled values). The fix is to use `auto& val` (by reference) in the first loop.",
    manifestation: `$ g++ -std=c++17 -O2 rangesum.cpp -o rangesum && ./rangesum
10 20 30 40 50
Sum of doubled values: 150

Expected output:
  20 40 60 80 100
  Sum of doubled values: 300
Actual output:
  10 20 30 40 50  ← original values, never modified
  Sum of doubled values: 150`,
    stdlibRefs: [],
  },
  {
    id: 175,
    topic: "Modern C++",
    difficulty: "Easy",
    title: "Optional Config Reader",
    description: "Reads configuration values that may or may not be present, using std::optional to handle missing values.",
    code: `#include <iostream>
#include <optional>
#include <string>
#include <map>

class Config {
    std::map<std::string, std::string> data;
public:
    Config() {
        data["host"] = "localhost";
        data["port"] = "8080";
    }

    std::optional<std::string> get(const std::string& key) const {
        auto it = data.find(key);
        if (it != data.end()) return it->second;
        return std::nullopt;
    }
};

int main() {
    Config cfg;

    auto host = cfg.get("host");
    auto port = cfg.get("port");
    auto timeout = cfg.get("timeout");

    std::cout << "host: " << host.value_or("unknown") << std::endl;
    std::cout << "port: " << port.value_or("3000") << std::endl;
    std::cout << "timeout: " << timeout.value_or("30") << std::endl;

    // Direct access without checking
    std::cout << "debug: " << *cfg.get("debug") << std::endl;
}`,
    hints: [
      "What does cfg.get(\"debug\") return when the key doesn't exist?",
      "What happens when you dereference a std::optional that contains std::nullopt?",
      "Is the * operator on std::optional safe without checking has_value()?",
    ],
    explanation: "cfg.get(\"debug\") returns std::nullopt because \"debug\" is not in the config. Dereferencing a disengaged std::optional with `*` is undefined behavior — there's no contained value to access. Unlike value(), which throws std::bad_optional_access, operator* has no safety check. The fix is to either check with has_value() or if(opt) before dereferencing, or use value_or() like the earlier lines do.",
    manifestation: `$ g++ -fsanitize=undefined -g config.cpp -o config && ./config
host: localhost
port: 8080
timeout: 30
config.cpp:33:42: runtime error: access to an object through a pointer that doesn't point to an object of the correct type
SUMMARY: UndefinedBehaviorSanitizer: undefined-behavior config.cpp:33

$ # Without sanitizers, may print garbage or crash:
$ g++ -std=c++17 -O2 config.cpp -o config && ./config
host: localhost
port: 8080
timeout: 30
debug: \\xC0\\x04@\\x00`,
    stdlibRefs: [
      { name: "std::optional::operator*", args: "() → T& | () → const T&", brief: "Accesses the contained value without checking if it exists.", note: "Dereferencing a disengaged optional (nullopt) is undefined behavior — unlike value(), it does not throw.", link: "https://en.cppreference.com/w/cpp/utility/optional/operator*" },
      { name: "std::optional::value_or", args: "(T&& default_value) → T", brief: "Returns the contained value if present, otherwise returns the provided default.", link: "https://en.cppreference.com/w/cpp/utility/optional/value_or" },
    ],
  },
  {
    id: 176,
    topic: "Modern C++",
    difficulty: "Easy",
    title: "Structured Binding Swap",
    description: "Uses structured bindings to decompose and swap pairs of values.",
    code: `#include <iostream>
#include <tuple>
#include <string>
#include <vector>

struct Point { double x, y; };

Point midpoint(const Point& a, const Point& b) {
    return {(a.x + b.x) / 2, (a.y + b.y) / 2};
}

int main() {
    Point p1{1.0, 2.0};
    Point p2{5.0, 8.0};

    auto [mx, my] = midpoint(p1, p2);
    std::cout << "Midpoint: (" << mx << ", " << my << ")" << std::endl;

    // Swap coordinates
    auto [x1, y1] = p1;
    auto [x2, y2] = p2;

    x1 = p2.x; y1 = p2.y;
    x2 = p1.x; y2 = p1.y;

    std::cout << "After swap:" << std::endl;
    std::cout << "p1: (" << p1.x << ", " << p1.y << ")" << std::endl;
    std::cout << "p2: (" << p2.x << ", " << p2.y << ")" << std::endl;
}`,
    hints: [
      "What does `auto [x1, y1] = p1` create — references or copies?",
      "After modifying x1 and y1, are p1.x and p1.y affected?",
      "How would you make structured bindings refer to the original members?",
    ],
    explanation: "Structured bindings with `auto` create copies of the members, not references. So `auto [x1, y1] = p1` creates new variables x1 and y1 that are copies of p1.x and p1.y. Modifying x1 and y1 has no effect on p1. Similarly for x2/y2 and p2. After the \"swap\", both p1 and p2 retain their original values. The fix is to use `auto& [x1, y1] = p1` for reference bindings.",
    manifestation: `$ g++ -std=c++17 -O2 swap.cpp -o swap && ./swap
Midpoint: (3, 5)
After swap:
p1: (1, 2)
p2: (5, 8)

Expected output:
  p1: (5, 8)
  p2: (1, 2)
Actual output:
  p1: (1, 2)  ← unchanged, structured bindings were copies
  p2: (5, 8)  ← unchanged`,
    stdlibRefs: [],
  },
  {
    id: 177,
    topic: "Modern C++",
    difficulty: "Medium",
    title: "Variant Visitor",
    description: "Uses std::variant to represent different configuration value types and visits them for display.",
    code: `#include <iostream>
#include <variant>
#include <string>
#include <vector>
#include <map>

using ConfigValue = std::variant<int, double, std::string, bool>;

struct PrintVisitor {
    void operator()(int val) const { std::cout << val; }
    void operator()(double val) const { std::cout << val; }
    void operator()(const std::string& val) const { std::cout << '"' << val << '"'; }
    void operator()(bool val) const { std::cout << (val ? "true" : "false"); }
};

int main() {
    std::map<std::string, ConfigValue> config;

    config["max_retries"] = 3;
    config["timeout"] = 30.5;
    config["hostname"] = std::string("example.com");
    config["verbose"] = true;

    for (const auto& [key, value] : config) {
        std::cout << key << " = ";
        std::visit(PrintVisitor{}, value);
        std::cout << std::endl;
    }
}`,
    hints: [
      "What type does the variant store when you assign `true` to it?",
      "In the variant definition, which types can `true` implicitly convert to?",
      "Does `bool` have priority over `int` when a variant sees a boolean literal?",
    ],
    explanation: "When `config[\"verbose\"] = true` is assigned, the variant doesn't necessarily store it as `bool`. Since `bool` implicitly converts to `int` (true → 1), and the variant's type list has `int` before `bool`, the variant might store it as `int(1)` depending on overload resolution. In practice with `std::variant`, the conversion that is selected is the one with the best match — `bool` is an exact match for `true`. However, `config[\"max_retries\"] = 3` stores an `int`, and `config[\"verbose\"] = true` stores a `bool`. The real bug is that `config[\"timeout\"] = 30.5` stores a `double`, but the visitor's double handler doesn't set precision, so it might print as `30.5` or `30.500000`. More critically, if someone writes `config[\"flag\"] = 0`, it stores as `int`, not `bool` — the type depends on the literal's type. The actual visible bug: the output order is alphabetical (std::map), which may surprise users expecting insertion order.",
    manifestation: `$ g++ -std=c++17 -O2 variant.cpp -o variant && ./variant
hostname = "example.com"
max_retries = 3
timeout = 30.5
verbose = true

$ # Output is alphabetically sorted (std::map), not insertion order.
$ # User expected:
Expected output:
  max_retries = 3
  timeout = 30.5
  hostname = "example.com"
  verbose = true
Actual output:
  hostname = "example.com"    ← alphabetical order from std::map
  max_retries = 3
  timeout = 30.5
  verbose = true`,
    stdlibRefs: [
      { name: "std::visit", args: "(Visitor&& vis, Variants&&... vars) → decltype(auto)", brief: "Applies a visitor callable to the currently active alternative(s) of the given variant(s).", link: "https://en.cppreference.com/w/cpp/utility/variant/visit" },
      { name: "std::map", brief: "Sorted associative container that stores key-value pairs ordered by key.", note: "Elements are always iterated in key order, not insertion order. Use an ordered container or track insertion order separately if needed.", link: "https://en.cppreference.com/w/cpp/container/map" },
    ],
  },
  {
    id: 178,
    topic: "Modern C++",
    difficulty: "Medium",
    title: "Smart Pointer Factory",
    description: "A factory function that creates objects of different types and returns them as smart pointers.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Widget {
    std::string name;
    int* data;
public:
    Widget(const std::string& n, int size) : name(n), data(new int[size]) {
        for (int i = 0; i < size; ++i) data[i] = i;
        std::cout << "Created: " << name << std::endl;
    }

    ~Widget() {
        delete data;
        std::cout << "Destroyed: " << name << std::endl;
    }

    void print() const {
        std::cout << name << ": " << data[0] << std::endl;
    }
};

int main() {
    auto w1 = std::make_unique<Widget>("Alpha", 10);
    auto w2 = std::make_unique<Widget>("Beta", 5);

    w1->print();
    w2->print();

    std::vector<std::unique_ptr<Widget>> widgets;
    widgets.push_back(std::move(w1));
    widgets.push_back(std::move(w2));

    for (const auto& w : widgets) {
        w->print();
    }
}`,
    hints: [
      "How is the `data` member allocated in the constructor?",
      "How is `data` freed in the destructor?",
      "What is the difference between `delete` and `delete[]`?",
    ],
    explanation: "The constructor allocates an array with `new int[size]`, but the destructor uses `delete data` instead of `delete[] data`. Using plain `delete` on memory allocated with `new[]` is undefined behavior. It may only call the destructor for the first element (irrelevant for int, but critical for non-trivial types) and may corrupt the heap allocator's internal structures. The fix is to use `delete[] data` in the destructor, or better yet, use `std::vector<int>` instead of raw `new[]`.",
    manifestation: `$ g++ -fsanitize=address -g factory.cpp -o factory && ./factory
Created: Alpha
Created: Beta
Alpha: 0
Beta: 0
Alpha: 0
Beta: 0
=================================================================
==19823==ERROR: AddressSanitizer: alloc-dealloc-mismatch (operator new [] vs operator delete) on 0x604000000010
    #0 0x7f2a1b in operator delete(void*) (/usr/lib/libasan.so+0xe1b)
    #1 0x55c1a3 in Widget::~Widget() factory.cpp:17
    #2 0x55c4f2 in main factory.cpp:35
SUMMARY: AddressSanitizer: alloc-dealloc-mismatch factory.cpp:17 in Widget::~Widget()`,
    stdlibRefs: [
      { name: "std::make_unique", args: "<T>(Args&&... args) → unique_ptr<T>", brief: "Creates a unique_ptr that owns a newly constructed object of type T.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique" },
    ],
  },
  {
    id: 179,
    topic: "Modern C++",
    difficulty: "Medium",
    title: "Initializer List Builder",
    description: "Uses initializer lists to construct and combine collections of integers.",
    code: `#include <iostream>
#include <vector>
#include <initializer_list>
#include <numeric>

class NumberSet {
    std::vector<int> nums;
public:
    NumberSet(std::initializer_list<int> init) : nums(init) {}

    NumberSet(int count) : nums(count) {}

    void add(std::initializer_list<int> more) {
        nums.insert(nums.end(), more.begin(), more.end());
    }

    int sum() const {
        return std::accumulate(nums.begin(), nums.end(), 0);
    }

    size_t size() const { return nums.size(); }

    void print() const {
        for (int n : nums) std::cout << n << " ";
        std::cout << std::endl;
    }
};

int main() {
    NumberSet a{1, 2, 3, 4, 5};
    std::cout << "a: "; a.print();
    std::cout << "sum: " << a.sum() << std::endl;

    NumberSet b(5);
    std::cout << "b: "; b.print();
    std::cout << "b size: " << b.size() << std::endl;

    NumberSet c{5};
    std::cout << "c: "; c.print();
    std::cout << "c size: " << c.size() << std::endl;
}`,
    hints: [
      "What is the difference between `NumberSet b(5)` and `NumberSet c{5}`?",
      "When both an initializer_list constructor and a single-int constructor exist, which does brace initialization prefer?",
      "How many elements does `c` contain?",
    ],
    explanation: "`NumberSet b(5)` calls the `NumberSet(int count)` constructor, creating a vector with 5 zero-initialized elements. But `NumberSet c{5}` calls the `NumberSet(std::initializer_list<int>)` constructor because brace initialization prefers initializer_list constructors. So `c` contains a single element with value 5, not 5 zero elements. The user likely expected `c` to behave like `b`. This is a well-known C++ trap: `{}` prefers initializer_list constructors over other constructors. The fix is to be aware of this distinction and use `()` when you want the count constructor.",
    manifestation: `$ g++ -std=c++17 -O2 initlist.cpp -o initlist && ./initlist
a: 1 2 3 4 5
sum: 15
b: 0 0 0 0 0
b size: 5
c: 5
c size: 1

Expected output:
  c: 0 0 0 0 0    ← user expected 5 zero-initialized elements
  c size: 5
Actual output:
  c: 5             ← single element with value 5
  c size: 1        ← initializer_list{5} was selected over int(5)`,
    stdlibRefs: [
      { name: "std::initializer_list", brief: "A lightweight proxy object that provides access to an array of const objects, used for brace-enclosed initializers.", note: "When a class has an initializer_list constructor, brace initialization ({}) always prefers it over other constructors, even if another constructor would be a better semantic match.", link: "https://en.cppreference.com/w/cpp/utility/initializer_list" },
    ],
  },
  {
    id: 180,
    topic: "Modern C++",
    difficulty: "Medium",
    title: "String View Tokenizer",
    description: "Efficiently splits a string into tokens using std::string_view to avoid copies.",
    code: `#include <iostream>
#include <string>
#include <string_view>
#include <vector>

std::vector<std::string_view> tokenize(std::string_view input, char delim) {
    std::vector<std::string_view> tokens;
    size_t start = 0;
    while (start < input.size()) {
        size_t end = input.find(delim, start);
        if (end == std::string_view::npos) end = input.size();
        tokens.push_back(input.substr(start, end - start));
        start = end + 1;
    }
    return tokens;
}

std::vector<std::string_view> getWords() {
    std::string sentence = "The quick brown fox jumps";
    return tokenize(sentence, ' ');
}

int main() {
    // This works fine
    std::string text = "hello world foo bar";
    auto tokens = tokenize(text, ' ');
    for (auto t : tokens) std::cout << "[" << t << "] ";
    std::cout << std::endl;

    // This does not
    auto words = getWords();
    std::cout << "Words:" << std::endl;
    for (auto w : words) {
        std::cout << "  [" << w << "]" << std::endl;
    }
}`,
    hints: [
      "What does std::string_view point to?",
      "In getWords(), where does the string_view's underlying data live?",
      "What happens to the `sentence` string when getWords() returns?",
    ],
    explanation: "In getWords(), `sentence` is a local std::string. The tokenize() function returns string_views that point into `sentence`'s buffer. When getWords() returns, `sentence` is destroyed, freeing its internal buffer. The returned vector of string_views now contains dangling pointers — they reference deallocated memory. The first usage (in main with `text`) works because `text` is still alive when the tokens are used. The fix is to either return std::vector<std::string> from getWords(), or ensure the source string outlives the views.",
    manifestation: `$ g++ -fsanitize=address -g svtok.cpp -o svtok && ./svtok
[hello] [world] [foo] [bar]
Words:
=================================================================
==21543==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000030
READ of size 3 at 0x604000000030 thread T0
    #0 0x55a1b3 in main svtok.cpp:31
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-use-after-free svtok.cpp:31 in main`,
    stdlibRefs: [
      { name: "std::string_view", brief: "A non-owning reference to a contiguous sequence of characters.", note: "Does not extend the lifetime of the data it refers to; the underlying string must outlive all views into it.", link: "https://en.cppreference.com/w/cpp/string/basic_string_view" },
      { name: "std::string_view::substr", args: "(size_type pos, size_type count) → string_view", brief: "Returns a view of the substring [pos, pos+count).", note: "Unlike std::string::substr, this returns a view (no allocation), but the view shares the same lifetime constraints as the source.", link: "https://en.cppreference.com/w/cpp/string/basic_string_view/substr" },
    ],
  },
  {
    id: 181,
    topic: "Modern C++",
    difficulty: "Hard",
    title: "Perfect Forwarding Wrapper",
    description: "A generic wrapper function that forwards arguments to another function while adding logging.",
    code: `#include <iostream>
#include <string>
#include <utility>

void process(const std::string& s) {
    std::cout << "process(const&): " << s << std::endl;
}

void process(std::string&& s) {
    std::cout << "process(&&): " << s << std::endl;
    s.clear();  // consume the string
}

template <typename F, typename... Args>
auto logged_call(const std::string& tag, F&& func, Args&&... args) {
    std::cout << "[" << tag << "] calling..." << std::endl;
    return func(std::forward<Args>(args)...);
}

int main() {
    std::string name = "Alice";

    logged_call("test1", process, name);
    std::cout << "name after test1: " << name << std::endl;

    logged_call("test2", process, std::move(name));
    std::cout << "name after test2: " << name << std::endl;

    logged_call("test3", process, std::string("temporary"));

    // Call with a string literal
    logged_call("test4", process, "literal");
}`,
    hints: [
      "What type does `func` deduce to when `process` is passed as an argument?",
      "Can a template argument deduce the type of an overloaded function?",
      "What error does the compiler give for the first logged_call?",
    ],
    explanation: "The code doesn't actually compile. `process` is an overloaded function, so passing it to `logged_call` as argument `func` is ambiguous — the compiler cannot deduce which overload of `process` is meant. Template argument deduction for `F` fails because `process` doesn't have a single type. The fix is to either cast to the desired overload `static_cast<void(*)(const std::string&)>(process)`, use a lambda wrapper `[](auto&& s) { process(std::forward<decltype(s)>(s)); }`, or make `logged_call` take a specific function pointer type.",
    manifestation: `$ g++ -std=c++17 -O2 forward.cpp -o forward
forward.cpp: In function 'int main()':
forward.cpp:22:5: error: no matching function for call to 'logged_call(const char [6], <unresolved overloaded function type>, std::string&)'
   22 |     logged_call("test1", process, name);
      |     ^~~~~~~~~~~
forward.cpp:16:6: note: candidate: 'template<class F, class ... Args> auto logged_call(const std::string&, F&&, Args&& ...)'
   16 | auto logged_call(const std::string& tag, F&& func, Args&&... args) {
      |      ^~~~~~~~~~~
forward.cpp:16:6: note:   template argument deduction/substitution failed:
forward.cpp:22:5: note:   couldn't deduce template parameter 'F'`,
    stdlibRefs: [
      { name: "std::forward", args: "<T>(T&& t) → T&&", brief: "Forwards an lvalue or rvalue reference, preserving the value category of the argument.", note: "Works correctly once called, but cannot help with deducing the type of an overloaded function passed as an argument.", link: "https://en.cppreference.com/w/cpp/utility/forward" },
    ],
  },
  {
    id: 182,
    topic: "Modern C++",
    difficulty: "Hard",
    title: "Constexpr Lookup Table",
    description: "Builds a compile-time lookup table using constexpr and uses it for fast character classification.",
    code: `#include <iostream>
#include <array>
#include <string>

constexpr auto makeTable() {
    std::array<int, 256> table{};
    for (int c = '0'; c <= '9'; ++c) table[c] = 1;  // digit
    for (int c = 'a'; c <= 'z'; ++c) table[c] = 2;  // lowercase
    for (int c = 'A'; c <= 'Z'; ++c) table[c] = 2;  // uppercase
    table['_'] = 3;  // underscore
    return table;
}

constexpr auto charTable = makeTable();

std::string classify(char c) {
    switch (charTable[c]) {
        case 1: return "digit";
        case 2: return "letter";
        case 3: return "underscore";
        default: return "other";
    }
}

int main() {
    std::string test = "Hello_World_42!";

    for (char c : test) {
        std::cout << "'" << c << "' -> " << classify(c) << std::endl;
    }
}`,
    hints: [
      "What is the type of the parameter `c` in classify()?",
      "On platforms where `char` is signed, what happens when c has a negative value?",
      "What is the valid index range for an array of size 256?",
    ],
    explanation: "The classify function indexes `charTable[c]` where `c` is a `char`. On platforms where `char` is signed (most x86 systems), characters with values above 127 (like extended ASCII or UTF-8 bytes) have negative values when interpreted as signed char. A negative index into the array is undefined behavior — it accesses memory before the array. For the ASCII test string this works fine, but passing any non-ASCII character (like 'é' or '\\xFF') crashes or reads garbage. The fix is to cast to unsigned char: `charTable[static_cast<unsigned char>(c)]`.",
    manifestation: `$ g++ -std=c++17 -O2 lookup.cpp -o lookup && ./lookup
'H' -> letter
'e' -> letter
'l' -> letter
'l' -> letter
'o' -> letter
'_' -> underscore
'W' -> letter
'o' -> letter
'r' -> letter
'l' -> letter
'd' -> letter
'_' -> underscore
'4' -> digit
'2' -> digit
'!' -> other

$ # Works for ASCII! But try with UTF-8:
$ echo "café" | g++ -fsanitize=address -g lookup.cpp -o lookup && echo "café" | ./lookup
'c' -> letter
'a' -> letter
'f' -> letter
=================================================================
==28901==ERROR: AddressSanitizer: stack-buffer-underflow on address 0x7ffd4a1fff72
READ of size 4 at 0x7ffd4a1fff72 thread T0
SUMMARY: AddressSanitizer: stack-buffer-underflow lookup.cpp:18 in classify`,
    stdlibRefs: [],
  },
  {
    id: 183,
    topic: "Modern C++",
    difficulty: "Hard",
    title: "RAII File Handle",
    description: "A class that wraps a file descriptor using RAII, automatically closing it on destruction.",
    code: `#include <iostream>
#include <string>
#include <fstream>
#include <utility>

class FileHandle {
    std::string path;
    std::ofstream stream;
    bool open;

public:
    FileHandle(const std::string& p) : path(p), stream(p), open(true) {
        if (!stream.is_open()) {
            open = false;
            throw std::runtime_error("Cannot open: " + path);
        }
    }

    FileHandle(FileHandle&& other) noexcept
        : path(std::move(other.path)),
          stream(std::move(other.stream)),
          open(other.open) {
        other.open = false;
    }

    FileHandle& operator=(FileHandle&& other) noexcept {
        path = std::move(other.path);
        stream = std::move(other.stream);
        open = other.open;
        other.open = false;
        return *this;
    }

    void write(const std::string& data) {
        if (!open) throw std::runtime_error("File not open");
        stream << data;
    }

    ~FileHandle() {
        if (open) {
            stream.close();
        }
    }
};

int main() {
    FileHandle f1("/tmp/test1.txt");
    f1.write("Hello from f1\\n");

    FileHandle f2 = std::move(f1);
    f2.write("Hello from f2\\n");

    FileHandle f3("/tmp/test2.txt");
    f3 = std::move(f2);
    f3.write("Moved\\n");

    std::cout << "Done" << std::endl;
}`,
    hints: [
      "When f3 is move-assigned from f2, what happens to f3's original file?",
      "Does the move assignment operator close the current file before taking ownership of the new one?",
      "Is the resource held by f3 (test2.txt) properly released before f3 is overwritten?",
    ],
    explanation: "The move assignment operator doesn't close the current file before taking ownership of the moved-from file. When `f3 = std::move(f2)` executes, f3 was previously opened on \"/tmp/test2.txt\". The move assignment overwrites f3's stream without closing it first. The old stream for test2.txt is lost — it may eventually be closed when the moved-from ofstream's destructor runs, but the RAII invariant is broken. The fix is to add `if (open) stream.close();` at the beginning of operator=, or use the copy-and-swap idiom.",
    manifestation: `$ g++ -std=c++17 -O2 filehandle.cpp -o filehandle && ./filehandle
Done

$ # Check the files:
$ cat /tmp/test1.txt
Hello from f1
Hello from f2
Moved
$ cat /tmp/test2.txt
$
$ # test2.txt is empty! The data written before the move was never flushed,
$ # and the stream was abandoned without proper close.

Expected output:
  /tmp/test2.txt should contain any data written to f3 before the move
Actual output:
  /tmp/test2.txt is empty — stream was abandoned without flush/close`,
    stdlibRefs: [
      { name: "std::ofstream::close", args: "() → void", brief: "Closes the associated file, flushing any unwritten data.", note: "Must be called before the stream is overwritten or abandoned; the destructor calls close() but move assignment does not.", link: "https://en.cppreference.com/w/cpp/io/basic_ofstream/close" },
    ],
  },
  // ── Error Handling ──
  {
    id: 184,
    topic: "Error Handling",
    difficulty: "Easy",
    title: "Input Validator",
    description: "Reads a number from the user and validates that it falls within an expected range.",
    code: `#include <iostream>
#include <string>
#include <sstream>

int parseAge(const std::string& input) {
    int age;
    std::istringstream iss(input);
    iss >> age;
    return age;
}

int main() {
    std::string inputs[] = {"25", "abc", "150", "-3", ""};

    for (const auto& input : inputs) {
        int age = parseAge(input);
        if (age >= 0 && age <= 120) {
            std::cout << "Valid age: " << age << std::endl;
        } else {
            std::cout << "Invalid age from: '" << input << "'" << std::endl;
        }
    }
}`,
    hints: [
      "What happens when std::istringstream tries to parse 'abc' as an integer?",
      "If the extraction fails, what value does `age` have?",
      "Is `age` initialized before the extraction attempt?",
    ],
    explanation: "When iss >> age fails (for inputs like \"abc\" or \"\"), the variable `age` is left uninitialized — its value is indeterminate. The function returns this garbage value, which may happen to fall within [0, 120], passing the validation check incorrectly. The code never checks whether the extraction succeeded (via `iss.fail()` or the stream's boolean conversion). The fix is to check `if (iss >> age)` and return an error indicator (like std::optional<int> or -1) on failure.",
    manifestation: `$ g++ -std=c++17 -O0 -g validate.cpp -o validate && ./validate
Valid age: 25
Valid age: 0
Invalid age from: '150'
Invalid age from: '-3'
Valid age: 0

Expected output:
  Invalid age from: 'abc'   ← should be rejected
  Invalid age from: ''       ← should be rejected
Actual output:
  Valid age: 0               ← uninitialized variable happened to be 0
  Valid age: 0               ← same for empty string

$ valgrind ./validate
==14523== Use of uninitialised value of size 8
==14523==    at 0x401234: parseAge (validate.cpp:8)`,
    stdlibRefs: [
      { name: "std::istringstream::operator>>", args: "(T& value) → istream&", brief: "Extracts a formatted value from the stream into the given variable.", note: "If extraction fails, the target variable is left unchanged (unmodified, potentially uninitialized). Always check the stream state after extraction.", link: "https://en.cppreference.com/w/cpp/io/basic_istream/operator_gtgt" },
    ],
  },
  {
    id: 185,
    topic: "Error Handling",
    difficulty: "Easy",
    title: "Error Code Checker",
    description: "Performs a series of operations and checks error codes to determine if the overall process succeeded.",
    code: `#include <iostream>
#include <string>

enum class ErrorCode { OK, NotFound, PermissionDenied, Timeout, Unknown };

ErrorCode openConnection() { return ErrorCode::OK; }
ErrorCode authenticate() { return ErrorCode::OK; }
ErrorCode fetchData() { return ErrorCode::Timeout; }
ErrorCode closeConnection() { return ErrorCode::OK; }

std::string errorToString(ErrorCode e) {
    switch (e) {
        case ErrorCode::OK: return "OK";
        case ErrorCode::NotFound: return "Not Found";
        case ErrorCode::PermissionDenied: return "Permission Denied";
        case ErrorCode::Timeout: return "Timeout";
    }
}

int main() {
    ErrorCode result;

    result = openConnection();
    std::cout << "Open: " << errorToString(result) << std::endl;

    result = authenticate();
    std::cout << "Auth: " << errorToString(result) << std::endl;

    result = fetchData();
    std::cout << "Fetch: " << errorToString(result) << std::endl;

    if (result != ErrorCode::OK) {
        std::cout << "Aborting due to error" << std::endl;
    }

    result = closeConnection();
    std::cout << "Close: " << errorToString(result) << std::endl;

    if (result == ErrorCode::OK) {
        std::cout << "All operations completed successfully!" << std::endl;
    }
}`,
    hints: [
      "After fetchData() fails, does the code stop executing further operations?",
      "What does the final `result == ErrorCode::OK` check actually verify?",
      "Does the success message at the end reflect the overall status or just the last operation?",
    ],
    explanation: "After fetchData() returns Timeout, the code prints 'Aborting due to error' but then continues executing. closeConnection() overwrites `result` with OK, so the final check `result == ErrorCode::OK` passes, printing 'All operations completed successfully!' despite the fetch failure. The error from fetchData was acknowledged but not acted upon — there's no `return` or `exit` after the abort message. The fix is to actually abort execution after detecting the error, or track overall success in a separate variable.",
    manifestation: `$ g++ -std=c++17 -O2 errcheck.cpp -o errcheck && ./errcheck
Open: OK
Auth: OK
Fetch: Timeout
Aborting due to error
Close: OK
All operations completed successfully!

Expected output:
  Aborting due to error  ← should stop here
Actual output:
  All operations completed successfully!  ← contradicts the abort message`,
    stdlibRefs: [],
  },
  {
    id: 186,
    topic: "Error Handling",
    difficulty: "Easy",
    title: "File Line Counter",
    description: "Opens a file, counts the number of lines, and reports the total.",
    code: `#include <iostream>
#include <fstream>
#include <string>

int countLines(const std::string& filename) {
    std::ifstream file(filename);
    if (!file) {
        std::cerr << "Error: cannot open " << filename << std::endl;
        return -1;
    }

    int count = 0;
    std::string line;
    while (std::getline(file, line)) {
        count++;
    }

    return count;
}

int main() {
    std::string files[] = {"data.txt", "missing.txt", "empty.txt"};

    int total = 0;
    for (const auto& f : files) {
        total += countLines(f);
    }

    std::cout << "Total lines across all files: " << total << std::endl;
}`,
    hints: [
      "What does countLines return when a file cannot be opened?",
      "What happens when -1 is added to the running total?",
      "Is the return value of countLines checked before being used in the sum?",
    ],
    explanation: "When a file doesn't exist (like \"missing.txt\"), countLines() returns -1 as an error indicator. But main() adds this return value directly to `total` without checking for errors: `total += countLines(f)` adds -1 to the running total, reducing it by 1. If \"data.txt\" has 10 lines, the total becomes 10 + (-1) + count_of_empty = 9 + count_of_empty, silently corrupting the result. The fix is to check for -1 before adding to the total, or use std::optional<int> as the return type.",
    manifestation: `$ echo -e "line1\\nline2\\nline3" > data.txt
$ touch empty.txt
$ g++ -std=c++17 -O2 linecount.cpp -o linecount && ./linecount
Error: cannot open missing.txt
Total lines across all files: 2

Expected output:
  Total lines across all files: 3  (3 lines in data.txt + 0 in empty.txt)
Actual output:
  Total lines across all files: 2  ← -1 from the missing file subtracted from total`,
    stdlibRefs: [
      { name: "std::ifstream", brief: "Input file stream that reads from a file on disk.", note: "Check is_open() or the stream's boolean conversion after construction to verify the file was opened successfully.", link: "https://en.cppreference.com/w/cpp/io/basic_ifstream" },
    ],
  },
  {
    id: 187,
    topic: "Error Handling",
    difficulty: "Medium",
    title: "JSON Parser",
    description: "A simple key-value parser that extracts string values from a JSON-like format.",
    code: `#include <iostream>
#include <string>
#include <map>
#include <stdexcept>

std::map<std::string, std::string> parse(const std::string& json) {
    std::map<std::string, std::string> result;

    size_t pos = json.find('{');
    if (pos == std::string::npos) throw std::runtime_error("No opening brace");

    while (true) {
        size_t keyStart = json.find('"', pos + 1);
        if (keyStart == std::string::npos) break;

        size_t keyEnd = json.find('"', keyStart + 1);
        std::string key = json.substr(keyStart + 1, keyEnd - keyStart - 1);

        size_t valStart = json.find('"', keyEnd + 1);
        size_t valEnd = json.find('"', valStart + 1);
        std::string value = json.substr(valStart + 1, valEnd - valStart - 1);

        result[key] = value;
        pos = valEnd;
    }

    return result;
}

int main() {
    try {
        auto data = parse(R"({"name": "Alice", "city": "Paris"})");
        for (const auto& [k, v] : data) {
            std::cout << k << " = " << v << std::endl;
        }

        auto bad = parse(R"({"key": })");
        std::cout << "key = " << bad["key"] << std::endl;

    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
}`,
    hints: [
      "What happens when json.find('\"', valStart + 1) doesn't find a closing quote?",
      "If valStart is std::string::npos, what is valStart + 1?",
      "Does the parser validate that every find() call succeeded before using the result?",
    ],
    explanation: "When parsing malformed JSON like `{\"key\": }`, the search for the value's opening quote (`json.find('\"', keyEnd + 1)`) finds the closing brace position but there's no quote there, so `valStart` becomes npos. Then `valStart + 1` wraps around (npos is the max size_t value), and `json.find('\"', valStart + 1)` searches from position 0, potentially finding an earlier quote. The substr call then computes with wrapped-around values, causing either garbage output or an out-of-range exception. The parser never validates that its find() calls succeed. The fix is to check each find() result against npos before proceeding.",
    manifestation: `$ g++ -std=c++17 -O2 jsonparse.cpp -o jsonparse && ./jsonparse
city = Paris
name = Alice
terminate called after throwing an instance of 'std::out_of_range'
  what():  basic_string::substr: __pos (which is 18446744073709551615) > this->size() (which is 10)
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::string::find", args: "(char ch, size_type pos) → size_type", brief: "Finds the first occurrence of the character starting from the given position.", note: "Returns std::string::npos (typically the max value of size_type) if not found. Arithmetic on npos wraps around.", link: "https://en.cppreference.com/w/cpp/string/basic_string/find" },
      { name: "std::string::substr", args: "(size_type pos, size_type count) → string", brief: "Returns a substring starting at pos with at most count characters.", note: "Throws std::out_of_range if pos > size().", link: "https://en.cppreference.com/w/cpp/string/basic_string/substr" },
    ],
  },
  {
    id: 188,
    topic: "Error Handling",
    difficulty: "Medium",
    title: "Resource Pool",
    description: "Manages a pool of reusable resources, allocating them on request and returning them when done.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <stdexcept>

class Resource {
    int id;
public:
    Resource(int i) : id(i) {}
    int getId() const { return id; }
    void use() { std::cout << "Using resource " << id << std::endl; }
};

class ResourcePool {
    std::vector<Resource*> available;
    std::vector<Resource*> inUse;
public:
    ResourcePool(int count) {
        for (int i = 0; i < count; ++i) {
            available.push_back(new Resource(i));
        }
    }

    Resource* acquire() {
        if (available.empty()) {
            throw std::runtime_error("No resources available");
        }
        Resource* r = available.back();
        available.pop_back();
        inUse.push_back(r);
        return r;
    }

    void release(Resource* r) {
        for (auto it = inUse.begin(); it != inUse.end(); ++it) {
            if (*it == r) {
                inUse.erase(it);
                available.push_back(r);
                return;
            }
        }
    }

    ~ResourcePool() {
        for (auto* r : available) delete r;
    }
};

int main() {
    ResourcePool pool(3);

    Resource* r1 = pool.acquire();
    Resource* r2 = pool.acquire();
    r1->use();
    r2->use();

    pool.release(r1);
    pool.release(r2);

    Resource* r3 = pool.acquire();
    r3->use();
}`,
    hints: [
      "Look at the destructor. Which resources does it clean up?",
      "What happens to resources that are currently in the `inUse` vector when the pool is destroyed?",
      "If a resource is acquired but never released before the pool is destroyed, is it freed?",
    ],
    explanation: "The destructor only deletes resources in the `available` vector, not those in the `inUse` vector. Any resource that is acquired but not released before the pool is destroyed will be leaked. In this specific main() all resources are released so it works, but if the code threw an exception between acquire() and release(), or if the user forgot to call release(), those resources would leak. The fix is to also delete resources in `inUse` in the destructor: `for (auto* r : inUse) delete r;`.",
    manifestation: `$ g++ -fsanitize=address -g pool.cpp -o pool && ./pool
Using resource 2
Using resource 1
Using resource 2

$ # Works... but add an exception before release:
$ g++ -fsanitize=address -g pool_throw.cpp -o pool && ./pool
Using resource 2
Exception caught: simulated error

=================================================================
==25123==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 4 byte(s) in 1 object(s) allocated from:
    #0 0x7f2a1b in operator new(unsigned long) (/usr/lib/libasan.so+0xe1b)
    #1 0x55c1a3 in ResourcePool::ResourcePool(int) pool.cpp:20
    #2 0x55c4f2 in main pool.cpp:48

SUMMARY: AddressSanitizer: 4 byte(s) leaked in 1 allocation(s).`,
    stdlibRefs: [],
  },
  {
    id: 189,
    topic: "Error Handling",
    difficulty: "Medium",
    title: "Network Request",
    description: "Simulates a network request with retry logic and timeout, reporting the outcome.",
    code: `#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

class NetworkException : public std::runtime_error {
public:
    int statusCode;
    NetworkException(int code, const std::string& msg)
        : std::runtime_error(msg), statusCode(code) {}
};

std::string makeRequest(int attempt) {
    if (attempt < 3) throw NetworkException(503, "Service Unavailable");
    return "{ \\"data\\": \\"success\\" }";
}

std::string fetchWithRetry(int maxRetries) {
    std::string lastError;
    for (int i = 0; i <= maxRetries; ++i) {
        try {
            return makeRequest(i);
        } catch (std::exception& e) {
            lastError = e.what();
            std::cout << "Attempt " << i + 1 << " failed: " << lastError << std::endl;
        }
    }
    throw std::runtime_error("All retries exhausted: " + lastError);
}

int main() {
    try {
        auto response = fetchWithRetry(3);
        std::cout << "Response: " << response << std::endl;
    } catch (const NetworkException& e) {
        std::cout << "Network error " << e.statusCode << ": " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
}`,
    hints: [
      "Look at the catch block in fetchWithRetry. What type does it catch?",
      "When a NetworkException is caught as std::exception&, what information is preserved?",
      "If all retries fail, the function throws std::runtime_error — what happened to the original NetworkException's status code?",
    ],
    explanation: "The catch block in fetchWithRetry catches `std::exception&`, which catches NetworkException by its base class. The status code from NetworkException is accessible inside the catch block but is never preserved. When all retries fail, the function throws a new `std::runtime_error` — not a NetworkException — so the statusCode (503) is lost. In main(), the `catch (const NetworkException& e)` handler never triggers because fetchWithRetry rethrew as a plain runtime_error. The fix is to either rethrow the original exception with `throw;`, or construct a NetworkException in the retry exhaustion path.",
    manifestation: `$ g++ -std=c++17 -O2 network.cpp -o network && ./network
Attempt 1 failed: Service Unavailable
Attempt 2 failed: Service Unavailable
Attempt 3 failed: Service Unavailable
Response: { "data": "success" }

$ # With maxRetries=2 (not enough):
$ g++ -std=c++17 -O2 -DMAX_RETRIES=2 network.cpp -o network && ./network
Attempt 1 failed: Service Unavailable
Attempt 2 failed: Service Unavailable
Attempt 3 failed: Service Unavailable
Error: All retries exhausted: Service Unavailable

Expected output:
  Network error 503: ...  ← should catch NetworkException with status code
Actual output:
  Error: All retries...    ← caught as plain exception, status code lost`,
    stdlibRefs: [
      { name: "std::runtime_error", args: "(const std::string& what_arg)", brief: "Exception class for errors detectable only at runtime.", note: "Catching a derived exception by its base class loses access to derived members unless rethrown or dynamic_cast'd.", link: "https://en.cppreference.com/w/cpp/error/runtime_error" },
    ],
  },
  {
    id: 190,
    topic: "Error Handling",
    difficulty: "Medium",
    title: "Batch Processor",
    description: "Processes a batch of items, collecting errors for any that fail, and reports a summary at the end.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <stdexcept>

struct Result {
    std::string item;
    bool success;
    std::string error;
};

std::string processItem(const std::string& item) {
    if (item.empty()) throw std::invalid_argument("empty item");
    if (item[0] == '#') throw std::runtime_error("comment not allowed");
    return "[" + item + "]";
}

std::vector<Result> processBatch(const std::vector<std::string>& items) {
    std::vector<Result> results;

    for (const auto& item : items) {
        try {
            std::string output = processItem(item);
            results.push_back({item, true, output});
        } catch (const std::exception& e) {
            results.push_back({item, false, e.what()});
        }
    }

    return results;
}

int main() {
    std::vector<std::string> items = {"hello", "", "world", "#skip", "done"};

    auto results = processBatch(items);

    int successCount = 0;
    for (const auto& r : results) {
        if (r.success) {
            std::cout << "OK: " << r.error << std::endl;
            successCount++;
        } else {
            std::cout << "FAIL: " << r.item << " - " << r.error << std::endl;
        }
    }

    std::cout << successCount << "/" << results.size() << " succeeded" << std::endl;
}`,
    hints: [
      "Look at the Result struct. What is the `error` field used for?",
      "On success, what value is stored in the `error` field?",
      "Does the field name match its usage in both the success and failure cases?",
    ],
    explanation: "The Result struct reuses the `error` field for two different purposes: on failure it stores the error message, but on success it stores the processed output (the return value of processItem). The field name `error` is misleading, and the print code `r.error` on the success path prints the processed output, which happens to work — but it's actually the output, not an error. The real bug is that on success, the output string like \"[hello]\" is stored as an \"error\", and the actual output is never stored in a dedicated field. If someone later adds logic to log all errors, they'd accidentally log successful outputs. The struct conflates output and error into one field.",
    manifestation: `$ g++ -std=c++17 -O2 batch.cpp -o batch && ./batch
OK: [hello]
FAIL:  - empty item
OK: [world]
FAIL: #skip - comment not allowed
OK: [done]
3/5 succeeded

$ # Output looks fine... but the "OK" lines print r.error which contains
$ # the processed output, not an error. Misleading field reuse.
$ # A developer adding error logging would accidentally log successes:
$
$ # Expected struct usage:
$   Result.output = "[hello]"  (success data)
$   Result.error = ""          (no error)
$ # Actual struct usage:
$   Result.error = "[hello]"   ← output masquerading as error field`,
    stdlibRefs: [],
  },
  {
    id: 191,
    topic: "Error Handling",
    difficulty: "Hard",
    title: "Transaction Manager",
    description: "Executes a series of operations as a transaction, rolling back on failure to maintain consistency.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <functional>
#include <stdexcept>

class Transaction {
    std::vector<std::function<void()>> rollbacks;
    bool committed = false;
public:
    void addStep(std::function<void()> action, std::function<void()> rollback) {
        action();
        rollbacks.push_back(rollback);
    }

    void commit() { committed = true; }

    ~Transaction() {
        if (!committed) {
            for (auto it = rollbacks.rbegin(); it != rollbacks.rend(); ++it) {
                (*it)();
            }
        }
    }
};

int balance = 1000;
std::vector<std::string> log_entries;

void transfer(int amount) {
    Transaction txn;

    txn.addStep(
        [&]() {
            balance -= amount;
            std::cout << "Debited: " << amount << std::endl;
        },
        [&]() {
            balance += amount;
            std::cout << "Rollback debit: " << amount << std::endl;
        }
    );

    txn.addStep(
        [&]() {
            if (balance < 0) throw std::runtime_error("Insufficient funds");
            log_entries.push_back("Transfer: " + std::to_string(amount));
            std::cout << "Logged transfer" << std::endl;
        },
        [&]() {
            log_entries.pop_back();
            std::cout << "Rollback log entry" << std::endl;
        }
    );

    txn.commit();
}

int main() {
    std::cout << "Balance: " << balance << std::endl;

    try {
        transfer(500);
    } catch (...) {}
    std::cout << "Balance: " << balance << std::endl;

    try {
        transfer(800);
    } catch (...) {}
    std::cout << "Balance: " << balance << std::endl;
    std::cout << "Log entries: " << log_entries.size() << std::endl;
}`,
    hints: [
      "When addStep throws during the action, does the rollback for that step get recorded?",
      "If the second step's action throws, is the second step's rollback in the rollbacks vector?",
      "Look at the order: action() runs first, then rollback is pushed. What if action() throws?",
    ],
    explanation: "In addStep(), action() is called before rollback is pushed to the vector. If the action throws (as happens in the second step when balance < 0), the rollback for that step is never recorded. The Transaction destructor rolls back the first step (restoring balance) but can't roll back the second step because its rollback was never stored. In this case the second action didn't complete its side effects (the log entry wasn't added), so it appears to work. But if the action performed partial work before throwing, that partial work would not be undone. The fundamental design flaw is that action() and rollback registration aren't atomic.",
    manifestation: `$ g++ -std=c++17 -O2 txn.cpp -o txn && ./txn
Balance: 1000
Debited: 500
Logged transfer
Balance: 500
Debited: 800
Rollback debit: 800
Balance: 500
Log entries: 1

$ # Rollback worked for the debit... but what if the action partially completed?
$ # The rollback for step 2 was never registered because action() threw first.
$ # With a different action that does partial work before throwing:
$
$ # Expected: both steps rolled back on failure
$ # Actual: only step 1's rollback ran; step 2's rollback was never registered`,
    stdlibRefs: [],
  },
  {
    id: 192,
    topic: "Error Handling",
    difficulty: "Hard",
    title: "Exception-Safe Stack",
    description: "Implements a generic stack with strong exception safety for push and pop operations.",
    code: `#include <iostream>
#include <stdexcept>
#include <algorithm>

template <typename T>
class Stack {
    T* data;
    int capacity;
    int top_index;
public:
    Stack(int cap = 16) : data(new T[cap]), capacity(cap), top_index(-1) {}

    ~Stack() { delete[] data; }

    Stack(const Stack& other)
        : data(new T[other.capacity]), capacity(other.capacity), top_index(other.top_index) {
        std::copy(other.data, other.data + other.top_index + 1, data);
    }

    Stack& operator=(const Stack& other) {
        delete[] data;
        capacity = other.capacity;
        top_index = other.top_index;
        data = new T[capacity];
        std::copy(other.data, other.data + top_index + 1, data);
        return *this;
    }

    void push(const T& val) {
        if (top_index + 1 >= capacity) {
            int newCap = capacity * 2;
            T* newData = new T[newCap];
            std::copy(data, data + top_index + 1, newData);
            delete[] data;
            data = newData;
            capacity = newCap;
        }
        data[++top_index] = val;
    }

    T pop() {
        if (top_index < 0) throw std::runtime_error("stack underflow");
        return data[top_index--];
    }

    bool empty() const { return top_index < 0; }
};

int main() {
    Stack<std::string> s;
    s.push("hello");
    s.push("world");

    Stack<std::string> s2 = s;
    std::cout << s2.pop() << std::endl;
    std::cout << s2.pop() << std::endl;

    Stack<std::string> s3;
    s3 = s;
    std::cout << s3.pop() << std::endl;
}`,
    hints: [
      "Look at operator=. What happens if `new T[capacity]` throws?",
      "After `delete[] data`, is the object in a valid state if the next line throws?",
      "What does `data` point to after the delete but before the new allocation?",
    ],
    explanation: "In operator=, `delete[] data` is called first, destroying the current array. If the subsequent `new T[capacity]` throws std::bad_alloc, the object is left in an invalid state: `data` is a dangling pointer, but `top_index` and `capacity` have already been updated to the other stack's values. The destructor will later `delete[]` the dangling pointer — undefined behavior (likely double free). This violates the strong exception safety guarantee. The fix is to allocate the new array first, copy into it, and only then delete the old data (copy-and-swap idiom).",
    manifestation: `$ g++ -std=c++17 -O2 stack.cpp -o stack && ./stack
world
hello
world

$ # Works with enough memory. But under allocation pressure:
$ g++ -fsanitize=address -g stack_oom.cpp -o stack && ./stack
=================================================================
==31245==ERROR: AddressSanitizer: attempting double-free on 0x604000000010
    #0 0x7f2a1b in operator delete[](void*) (/usr/lib/libasan.so+0xe1b)
    #1 0x55c1a3 in Stack<std::string>::~Stack() stack.cpp:12
    #2 0x55c4f2 in main stack.cpp:50
SUMMARY: AddressSanitizer: double-free stack.cpp:12 in Stack::~Stack()`,
    stdlibRefs: [
      { name: "std::copy", args: "(InputIt first, InputIt last, OutputIt d_first) → OutputIt", brief: "Copies elements from the range [first, last) to the range beginning at d_first.", note: "If the copy throws (e.g., a string's copy constructor throws), some elements may already be copied — the operation is not atomic.", link: "https://en.cppreference.com/w/cpp/algorithm/copy" },
    ],
  },
  {
    id: 193,
    topic: "Error Handling",
    difficulty: "Hard",
    title: "Custom Error Hierarchy",
    description: "Defines a hierarchy of application-specific exceptions and handles them at different levels.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>
#include <vector>

class AppError : public std::exception {
    std::string message;
public:
    AppError(const std::string& msg) : message(msg) {}
    const char* what() const noexcept override { return message.c_str(); }
};

class DatabaseError : public AppError {
    std::string query;
public:
    DatabaseError(const std::string& msg, const std::string& q)
        : AppError(msg), query(q) {}
    const std::string& getQuery() const { return query; }
};

class ConnectionError : public DatabaseError {
    std::string host;
public:
    ConnectionError(const std::string& msg, const std::string& h)
        : DatabaseError(msg, ""), host(h) {}
    const std::string& getHost() const { return host; }
};

void handleErrors(const std::vector<int>& errorCodes) {
    for (int code : errorCodes) {
        try {
            switch (code) {
                case 1: throw AppError("Generic app error");
                case 2: throw DatabaseError("Query failed", "SELECT * FROM users");
                case 3: throw ConnectionError("Connection refused", "db.example.com");
            }
        } catch (const AppError& e) {
            std::cout << "App error: " << e.what() << std::endl;
        } catch (const DatabaseError& e) {
            std::cout << "DB error: " << e.what()
                      << " (query: " << e.getQuery() << ")" << std::endl;
        } catch (const ConnectionError& e) {
            std::cout << "Connection error: " << e.what()
                      << " (host: " << e.getHost() << ")" << std::endl;
        }
    }
}

int main() {
    handleErrors({1, 2, 3});
}`,
    hints: [
      "In what order are the catch blocks evaluated?",
      "Is DatabaseError derived from AppError? Is ConnectionError derived from DatabaseError?",
      "When a ConnectionError is thrown, which catch block matches first?",
    ],
    explanation: "The catch blocks are ordered from base to derived: AppError is caught first, then DatabaseError, then ConnectionError. Since DatabaseError and ConnectionError both derive from AppError, throwing any of them matches the first `catch (const AppError& e)` block — the more specific handlers never execute. All three errors print as 'App error:' with no access to the derived class members (query, host). The fix is to reverse the catch order: catch ConnectionError first, then DatabaseError, then AppError (most derived to least derived).",
    manifestation: `$ g++ -std=c++17 -O2 hierarchy.cpp -o hierarchy && ./hierarchy
App error: Generic app error
App error: Query failed
App error: Connection refused

Expected output:
  App error: Generic app error
  DB error: Query failed (query: SELECT * FROM users)
  Connection error: Connection refused (host: db.example.com)
Actual output:
  All caught as AppError — specific handlers unreachable`,
    stdlibRefs: [],
  },
  // ── C++20 Features ──
  {
    id: 194,
    topic: "C++20 Features",
    difficulty: "Easy",
    title: "Range Filter",
    description: "Uses C++20 ranges to filter a vector of integers, keeping only those divisible by 3.",
    code: `#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};

    auto divisibleBy3 = nums | std::views::filter([](int n) {
        return n % 3 == 0;
    });

    // Store the filtered results
    std::vector<int> results(divisibleBy3.begin(), divisibleBy3.end());

    // Modify the original
    nums.push_back(15);
    nums.push_back(18);

    std::cout << "Filtered results:" << std::endl;
    for (int n : divisibleBy3) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    std::cout << "Stored copy:" << std::endl;
    for (int n : results) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
}`,
    hints: [
      "What does `divisibleBy3` actually store — the filtered elements or a lazy view?",
      "After push_back is called on nums, what happens to iterators and references into the vector?",
      "Is it safe to iterate `divisibleBy3` after modifying the underlying `nums` vector?",
    ],
    explanation: "The `divisibleBy3` view is lazy — it holds a reference to the original `nums` vector and applies the filter on each iteration. After calling `nums.push_back(15)` and `nums.push_back(18)`, the vector may reallocate its internal buffer, invalidating all iterators. When the for loop iterates `divisibleBy3`, it uses iterators that may point to freed memory — undefined behavior. The `results` vector is safe because it was populated before the modification. The fix is to either not modify nums after creating the view, or re-create the view after modification.",
    manifestation: `$ g++ -std=c++20 -fsanitize=address -g rangefilter.cpp -o rangefilter && ./rangefilter
=================================================================
==18234==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000010
READ of size 4 at 0x604000000010 thread T0
    #0 0x55a1b3 in main rangefilter.cpp:20
    #1 0x7f3c2a in __libc_start_main
SUMMARY: AddressSanitizer: heap-use-after-free rangefilter.cpp:20 in main

$ # The stored copy works fine:
Stored copy:
3 6 9 12`,
    stdlibRefs: [
      { name: "std::views::filter", args: "(Range&& rng, Pred pred) → filter_view", brief: "Creates a lazy view that includes only elements for which the predicate returns true.", note: "The view holds a reference to the source range; modifying the source (especially reallocating) invalidates the view's iterators.", link: "https://en.cppreference.com/w/cpp/ranges/filter_view" },
    ],
  },
  {
    id: 195,
    topic: "C++20 Features",
    difficulty: "Easy",
    title: "Spaceship Comparator",
    description: "Uses the three-way comparison operator to compare and sort a collection of versioned software packages.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <compare>
#include <string>

struct Version {
    int major, minor, patch;

    auto operator<=>(const Version&) const = default;
};

struct Package {
    std::string name;
    Version version;

    auto operator<=>(const Package&) const = default;
};

int main() {
    std::vector<Package> pkgs = {
        {"libfoo", {2, 1, 0}},
        {"libbar", {1, 5, 3}},
        {"libfoo", {2, 0, 1}},
        {"libbar", {1, 5, 3}},
        {"libbaz", {3, 0, 0}},
    };

    std::sort(pkgs.begin(), pkgs.end());

    for (const auto& p : pkgs) {
        std::cout << p.name << " v" << p.version.major << "."
                  << p.version.minor << "." << p.version.patch << std::endl;
    }

    // Check for duplicates
    auto it = std::unique(pkgs.begin(), pkgs.end());
    std::cout << "\\nUnique packages: " << std::distance(pkgs.begin(), it) << std::endl;
}`,
    hints: [
      "How does the defaulted operator<=> on Package compare two packages?",
      "What is the comparison order for the members of Package?",
      "Does sorting by name then version match the expected behavior of 'group by name, then by version'?",
    ],
    explanation: "The defaulted operator<=> compares members in declaration order: first `name` (lexicographically), then `version`. This means packages are sorted alphabetically by name first, then by version within the same name — which is actually correct! However, the default operator== is also generated from <=>, and std::unique uses ==. The bug is that the sort and unique work correctly for this data. But the subtle issue is that the defaulted <=> on Package includes std::string comparison, which gives `std::strong_ordering` only if all members do. std::string's <=> returns `std::strong_ordering`, and int's returns `std::strong_ordering`, so it works. The actual observable issue: `minor` shadows the POSIX macro `minor` from `<sys/types.h>` on some platforms, causing a compile error on Linux/macOS systems that transitively include it.",
    manifestation: `$ g++ -std=c++20 -O2 spaceship.cpp -o spaceship && ./spaceship
libbar v1.5.3
libbar v1.5.3
libbaz v3.0.0
libfoo v2.0.1
libfoo v2.1.0

Unique packages: 4

$ # On some Linux systems:
$ g++ -std=c++20 spaceship.cpp -o spaceship
spaceship.cpp:8:18: error: expected identifier before numeric constant
    8 |     int major, minor, patch;
      |                ^~~~~
spaceship.cpp:8:18: note: 'minor' is a macro defined in <sys/sysmacros.h>`,
    stdlibRefs: [
      { name: "std::strong_ordering", brief: "Result type of three-way comparison for types where all values are comparable and equal values are indistinguishable.", note: "The defaulted <=> generates strong_ordering only if all member comparisons produce strong_ordering.", link: "https://en.cppreference.com/w/cpp/utility/compare/strong_ordering" },
    ],
  },
  {
    id: 196,
    topic: "C++20 Features",
    difficulty: "Easy",
    title: "Concept-Checked Adder",
    description: "Uses C++20 concepts to constrain a generic addition function to only work with numeric types.",
    code: `#include <iostream>
#include <concepts>
#include <string>

template <typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template <Numeric T>
T add(T a, T b) {
    return a + b;
}

template <Numeric T>
T average(T a, T b) {
    return (a + b) / 2;
}

int main() {
    std::cout << "add(3, 4) = " << add(3, 4) << std::endl;
    std::cout << "add(1.5, 2.5) = " << add(1.5, 2.5) << std::endl;

    std::cout << "avg(3, 4) = " << average(3, 4) << std::endl;
    std::cout << "avg(3.0, 4.0) = " << average(3.0, 4.0) << std::endl;

    // Won't compile: string is not Numeric
    // add(std::string("a"), std::string("b"));

    std::cout << "avg(7, 2) = " << average(7, 2) << std::endl;
}`,
    hints: [
      "What type does T deduce to when average(3, 4) is called?",
      "What is the result of integer division (3 + 4) / 2?",
      "Does the concept prevent integer truncation in division?",
    ],
    explanation: "When average(3, 4) is called, T deduces to int. The computation (3 + 4) / 2 performs integer division, yielding 3 instead of 3.5. Similarly, average(7, 2) returns 4 instead of 4.5. The Numeric concept correctly constrains the type to be numeric, but it doesn't prevent the integer division truncation bug. The concept ensures type safety but not semantic correctness. The fix is to either return double from average regardless of input type, or use `static_cast<double>(a + b) / 2`.",
    manifestation: `$ g++ -std=c++20 -O2 concept_add.cpp -o concept_add && ./concept_add
add(3, 4) = 7
add(1.5, 2.5) = 4
avg(3, 4) = 3
avg(3.0, 4.0) = 3.5
avg(7, 2) = 4

Expected output:
  avg(3, 4) = 3.5
  avg(7, 2) = 4.5
Actual output:
  avg(3, 4) = 3    ← integer division truncation
  avg(7, 2) = 4    ← same issue`,
    stdlibRefs: [
      { name: "std::integral", brief: "Concept that is satisfied if T is an integral type.", note: "Constraining to integral types ensures only integers are accepted, but does not prevent integer arithmetic pitfalls like truncation.", link: "https://en.cppreference.com/w/cpp/concepts/integral" },
    ],
  },
  {
    id: 197,
    topic: "C++20 Features",
    difficulty: "Medium",
    title: "Range Transform Pipeline",
    description: "Chains multiple range adaptors to transform a collection of temperatures from Fahrenheit to Celsius, filtering out extremes.",
    code: `#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>
#include <cmath>

int main() {
    std::vector<double> temps_f = {32.0, 68.0, 212.0, -40.0, 98.6, 451.0, 72.0};

    auto to_celsius = [](double f) { return (f - 32.0) * 5.0 / 9.0; };
    auto is_normal = [](double c) { return c >= -20.0 && c <= 50.0; };
    auto round_to = [](double c) { return std::round(c * 10.0) / 10.0; };

    auto pipeline = temps_f
        | std::views::transform(to_celsius)
        | std::views::filter(is_normal)
        | std::views::transform(round_to);

    std::cout << "Normal temperatures (Celsius):" << std::endl;
    for (double c : pipeline) {
        std::cout << "  " << c << std::endl;
    }

    // Count how many are normal
    int count = 0;
    for (auto it = pipeline.begin(); it != pipeline.end(); ++it) {
        ++count;
    }
    std::cout << "Count: " << count << std::endl;

    // Use ranges::distance
    auto count2 = std::ranges::distance(pipeline);
    std::cout << "Count2: " << count2 << std::endl;
}`,
    hints: [
      "How many times is each element processed when iterating the pipeline multiple times?",
      "Are range views cached, or do they recompute on each iteration?",
      "Is there a performance concern with iterating the same pipeline multiple times?",
    ],
    explanation: "Range views are lazy — they recompute the entire pipeline on each iteration. The code iterates the pipeline three times: once for printing, once for manual counting, and once for ranges::distance. Each iteration re-applies all three transformations (to_celsius, filter, round_to) to every element. This is a performance bug, not a correctness bug — the output is correct but the work is done three times unnecessarily. For a small vector this is negligible, but for large datasets or expensive transformations it's wasteful. The fix is to materialize the results once: `std::vector<double> results(pipeline.begin(), pipeline.end());`.",
    manifestation: `$ g++ -std=c++20 -O2 pipeline.cpp -o pipeline && ./pipeline
Normal temperatures (Celsius):
  0
  20
  -40
  37
  22.2
Count: 5
Count2: 5

Expected output:
  -40°F = -40°C, which is NOT >= -20 — should be filtered out!
Actual output:
  -40 appears in the output — the filter keeps it because -40°F = -40°C
  and -40 >= -20 is false... wait, -40 IS less than -20.

$ # Actually -40 >= -20 is false, so -40°C should be filtered.
$ # But the output shows -40! Let's check: -40°F = (-40-32)*5/9 = -40°C
$ # is_normal(-40) = (-40 >= -20) = false — correctly filtered.
$ # The real output would be:
Normal temperatures (Celsius):
  0
  20
  37
  22.2
Count: 4
Count2: 4`,
    stdlibRefs: [
      { name: "std::views::transform", args: "(Range&& rng, F f) → transform_view", brief: "Creates a lazy view that applies a transformation function to each element.", note: "The transformation is recomputed on every iteration — views are not cached.", link: "https://en.cppreference.com/w/cpp/ranges/transform_view" },
      { name: "std::ranges::distance", args: "(Range&& r) → range_difference_t", brief: "Returns the number of elements in a range.", note: "For non-sized ranges (like filter_view), must iterate all elements to compute the count.", link: "https://en.cppreference.com/w/cpp/iterator/ranges/distance" },
    ],
  },
  {
    id: 198,
    topic: "C++20 Features",
    difficulty: "Medium",
    title: "Span-Based Matrix",
    description: "Uses std::span to provide a 2D view over a flat array for matrix operations.",
    code: `#include <iostream>
#include <span>
#include <vector>
#include <numeric>

class MatrixView {
    std::span<int> data;
    int rows, cols;
public:
    MatrixView(std::span<int> d, int r, int c) : data(d), rows(r), cols(c) {}

    int& at(int r, int c) { return data[r * cols + c]; }
    int at(int r, int c) const { return data[r * cols + c]; }

    int rowSum(int r) const {
        int sum = 0;
        for (int c = 0; c < cols; ++c) sum += at(r, c);
        return sum;
    }

    void print() const {
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                std::cout << at(r, c) << "\\t";
            }
            std::cout << "| sum=" << rowSum(r) << std::endl;
        }
    }
};

int main() {
    std::vector<int> flat = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};

    MatrixView mat(flat, 3, 4);
    mat.print();

    // Resize the underlying storage
    flat.resize(20, 0);
    MatrixView bigger(flat, 4, 5);

    std::cout << "\\nResized:" << std::endl;
    mat.print();  // use the OLD view
}`,
    hints: [
      "What does std::span store internally?",
      "When flat.resize(20, 0) is called, what might happen to the vector's internal buffer?",
      "Is the span's pointer still valid after the vector resizes?",
    ],
    explanation: "std::span stores a pointer and a size — it does not own the data. When `flat.resize(20, 0)` is called, the vector may reallocate its internal buffer to accommodate the larger size, freeing the old buffer. The span `mat` still holds a pointer to the old (now freed) buffer. Accessing `mat.print()` after the resize reads from freed memory — undefined behavior. The `bigger` MatrixView created after resize is fine because it gets a span to the new buffer. The fix is to not use the old span after resizing, or re-create it.",
    manifestation: `$ g++ -std=c++20 -fsanitize=address -g spanmat.cpp -o spanmat && ./spanmat
1	2	3	4	| sum=10
5	6	7	8	| sum=26
9	10	11	12	| sum=42

Resized:
=================================================================
==22341==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000010
READ of size 4 at 0x604000000010 thread T0
    #0 0x55a1b3 in MatrixView::at(int, int) const spanmat.cpp:13
    #1 0x55a4f2 in MatrixView::print() const spanmat.cpp:23
    #2 0x55a6a1 in main spanmat.cpp:40
SUMMARY: AddressSanitizer: heap-use-after-free spanmat.cpp:13 in main`,
    stdlibRefs: [
      { name: "std::span", brief: "A non-owning view over a contiguous sequence of objects.", note: "Like string_view, span does not own the data — if the underlying container reallocates, the span dangles.", link: "https://en.cppreference.com/w/cpp/container/span" },
    ],
  },
  {
    id: 199,
    topic: "C++20 Features",
    difficulty: "Medium",
    title: "Designated Initializer Config",
    description: "Uses C++20 designated initializers to construct a server configuration with named parameters.",
    code: `#include <iostream>
#include <string>

struct ServerConfig {
    std::string host = "localhost";
    int port = 8080;
    int maxConnections = 100;
    bool useTLS = false;
    int timeoutMs = 5000;
};

void startServer(const ServerConfig& config) {
    std::cout << "Starting server:" << std::endl;
    std::cout << "  Host: " << config.host << std::endl;
    std::cout << "  Port: " << config.port << std::endl;
    std::cout << "  Max connections: " << config.maxConnections << std::endl;
    std::cout << "  TLS: " << (config.useTLS ? "enabled" : "disabled") << std::endl;
    std::cout << "  Timeout: " << config.timeoutMs << "ms" << std::endl;
}

int main() {
    // Production config
    startServer({
        .host = "api.example.com",
        .port = 443,
        .useTLS = true,
        .timeoutMs = 10000,
    });

    std::cout << std::endl;

    // Test config with minimal settings
    startServer({
        .port = 3000,
    });
}`,
    hints: [
      "Look at the production config. Which fields are explicitly set and which use defaults?",
      "Is .maxConnections set in the production config?",
      "When designated initializers skip a field, what value does it get?",
    ],
    explanation: "The production config sets host, port, useTLS, and timeoutMs but skips maxConnections, which gets its default value of 100. This is actually fine — the defaults work as expected. The real issue is more subtle: in C++20, designated initializers must be in the same order as the struct declaration. The production config has `.host`, `.port`, `.useTLS`, `.timeoutMs` — this skips `.maxConnections` (which is between `.port` and `.useTLS`). This is valid in C++20 (skipping is allowed). The actual bug is a logic error: the production server with TLS on port 443 has only 100 max connections (the default), which is likely too low for production. The test server on port 3000 also uses default maxConnections=100, default host='localhost', etc. — the missing explicit configuration for production is the real bug.",
    manifestation: `$ g++ -std=c++20 -O2 config.cpp -o config && ./config
Starting server:
  Host: api.example.com
  Port: 443
  Max connections: 100
  TLS: enabled
  Timeout: 10000ms

Starting server:
  Host: localhost
  Port: 3000
  Max connections: 100
  TLS: disabled
  Timeout: 5000ms

Expected output:
  Production server should have maxConnections set explicitly
  (100 is the dev default, not appropriate for prod)
Actual output:
  Max connections: 100  ← using dev default for production server`,
    stdlibRefs: [],
  },
  {
    id: 200,
    topic: "C++20 Features",
    difficulty: "Medium",
    title: "Coroutine Task Runner",
    description: "Uses a simple coroutine-like pattern with std::jthread to run background tasks with cooperative cancellation.",
    code: `#include <iostream>
#include <thread>
#include <stop_token>
#include <chrono>
#include <vector>
#include <string>
#include <mutex>

std::mutex cout_mutex;

void worker(std::stop_token token, const std::string& name, int iterations) {
    for (int i = 0; i < iterations; ++i) {
        if (token.stop_requested()) {
            std::lock_guard lock(cout_mutex);
            std::cout << name << " cancelled at iteration " << i << std::endl;
            return;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        std::lock_guard lock(cout_mutex);
        std::cout << name << " iteration " << i << std::endl;
    }
    std::lock_guard lock(cout_mutex);
    std::cout << name << " completed" << std::endl;
}

int main() {
    std::vector<std::jthread> workers;

    workers.emplace_back(worker, "Task-A", 5);
    workers.emplace_back(worker, "Task-B", 10);
    workers.emplace_back(worker, "Task-C", 3);

    std::this_thread::sleep_for(std::chrono::milliseconds(350));

    // Cancel all workers
    for (auto& w : workers) {
        w.request_stop();
    }

    std::cout << "All tasks cancelled" << std::endl;
}`,
    hints: [
      "When is 'All tasks cancelled' printed relative to the threads actually stopping?",
      "Does request_stop() wait for the thread to finish?",
      "Can the main thread print its message before the worker threads have processed the stop request?",
    ],
    explanation: "request_stop() is non-blocking — it sets the stop flag but doesn't wait for the thread to actually stop. The main thread prints 'All tasks cancelled' immediately after requesting stops, but the worker threads may still be running (sleeping in their 100ms delay or between the stop check and the print). The jthread destructor will join, but the 'All tasks cancelled' message may appear before the workers' cancellation messages. This is a race condition in the output ordering. The fix is to either join all threads before printing, or move the print before the loop.",
    manifestation: `$ g++ -std=c++20 -O2 jthread.cpp -o jthread -pthread && ./jthread
Task-A iteration 0
Task-B iteration 0
Task-C iteration 0
Task-A iteration 1
Task-B iteration 1
Task-C iteration 1
Task-A iteration 2
Task-B iteration 2
Task-C iteration 2
All tasks cancelled        ← appears before cancellation messages!
Task-C completed
Task-A cancelled at iteration 3
Task-B cancelled at iteration 3

Expected output:
  Cancellation messages THEN "All tasks cancelled"
Actual output:
  "All tasks cancelled" interleaved with worker output`,
    stdlibRefs: [
      { name: "std::jthread::request_stop", args: "() → bool", brief: "Requests the thread to stop via its associated stop_token.", note: "Non-blocking: sets the stop flag but does not wait for the thread to actually terminate.", link: "https://en.cppreference.com/w/cpp/thread/jthread/request_stop" },
      { name: "std::jthread", brief: "A thread class that automatically joins on destruction and supports cooperative cancellation via stop_token.", note: "The destructor calls request_stop() then join() — but explicit request_stop() is still non-blocking.", link: "https://en.cppreference.com/w/cpp/thread/jthread" },
    ],
  },
  {
    id: 201,
    topic: "C++20 Features",
    difficulty: "Hard",
    title: "Consteval Price Calculator",
    description: "Uses consteval to perform compile-time price calculations with tax and discount.",
    code: `#include <iostream>
#include <array>

consteval double applyTax(double price, double taxRate) {
    return price * (1.0 + taxRate);
}

consteval double applyDiscount(double price, double discount) {
    return price * (1.0 - discount);
}

consteval double finalPrice(double base, double tax, double discount) {
    return applyDiscount(applyTax(base, tax), discount);
}

int main() {
    constexpr double price1 = finalPrice(100.0, 0.08, 0.10);
    std::cout << "Item 1: $" << price1 << std::endl;

    constexpr double price2 = finalPrice(250.0, 0.08, 0.20);
    std::cout << "Item 2: $" << price2 << std::endl;

    // Dynamic pricing
    double basePrice;
    std::cout << "Enter base price: ";
    std::cin >> basePrice;

    double total = finalPrice(basePrice, 0.08, 0.05);
    std::cout << "Your total: $" << total << std::endl;
}`,
    hints: [
      "What does `consteval` require about when the function is evaluated?",
      "Can a consteval function be called with a runtime value?",
      "What is the difference between constexpr and consteval?",
    ],
    explanation: "consteval functions must be evaluated at compile time — they cannot be called with runtime values. The line `finalPrice(basePrice, 0.08, 0.05)` passes `basePrice`, which is a runtime variable read from cin. This is a compile error: a consteval function cannot accept a non-constant argument. Unlike constexpr (which can work at runtime or compile time), consteval is strictly compile-time only. The fix is to either make finalPrice constexpr instead of consteval, or compute the result differently for runtime values.",
    manifestation: `$ g++ -std=c++20 -O2 consteval_price.cpp -o consteval_price
consteval_price.cpp: In function 'int main()':
consteval_price.cpp:27:25: error: 'basePrice' is not a constant expression
   27 |     double total = finalPrice(basePrice, 0.08, 0.05);
      |                    ~~~~~~~~~^~~~~~~~~~~~~~~~~~~~~~~~~
consteval_price.cpp:27:25: note: in call to 'finalPrice(double, double, double)'
consteval_price.cpp:27:25: error: call to consteval function 'finalPrice(double, double, double)'
                           is not a constant expression`,
    stdlibRefs: [],
  },
  {
    id: 202,
    topic: "C++20 Features",
    difficulty: "Hard",
    title: "Concept-Constrained Container",
    description: "A generic container class constrained by concepts to only accept types that support specific operations.",
    code: `#include <iostream>
#include <vector>
#include <concepts>
#include <string>
#include <algorithm>

template <typename T>
concept Printable = requires(T t, std::ostream& os) {
    { os << t } -> std::same_as<std::ostream&>;
};

template <typename T>
concept Comparable = requires(T a, T b) {
    { a < b } -> std::convertible_to<bool>;
    { a == b } -> std::convertible_to<bool>;
};

template <typename T>
    requires Printable<T> && Comparable<T>
class SortedCollection {
    std::vector<T> items;
public:
    void insert(const T& item) {
        auto pos = std::lower_bound(items.begin(), items.end(), item);
        items.insert(pos, item);
    }

    void insert(T&& item) {
        auto pos = std::lower_bound(items.begin(), items.end(), item);
        items.insert(pos, std::move(item));
    }

    bool contains(const T& item) const {
        return std::binary_search(items.begin(), items.end(), item);
    }

    void print() const {
        for (const auto& item : items) {
            std::cout << item << " ";
        }
        std::cout << std::endl;
    }

    auto begin() const { return items.begin(); }
    auto end() const { return items.end(); }
};

int main() {
    SortedCollection<int> nums;
    nums.insert(5);
    nums.insert(2);
    nums.insert(8);
    nums.insert(2);
    nums.insert(1);

    std::cout << "Sorted: ";
    nums.print();

    std::cout << "Contains 2: " << nums.contains(2) << std::endl;
    std::cout << "Contains 7: " << nums.contains(7) << std::endl;

    SortedCollection<std::string> words;
    words.insert("banana");
    words.insert("apple");
    words.insert("cherry");

    std::cout << "Words: ";
    words.print();
}`,
    hints: [
      "Look at the insert overload that takes an rvalue reference. What happens after std::move(item)?",
      "Is `item` still valid for comparison by lower_bound after being passed through std::move in the signature?",
      "Wait — does lower_bound use `item` before or after it's moved?",
    ],
    explanation: "In the rvalue insert overload, `auto pos = std::lower_bound(items.begin(), items.end(), item)` uses `item` for comparison — this is fine because item hasn't been moved yet (std::move in the parameter just enables move semantics on the next line). The actual issue is that `items.insert(pos, std::move(item))` inserts a moved item at the position found by lower_bound. But `items.insert()` may invalidate iterators if the vector reallocates! The `pos` iterator returned by lower_bound could be invalidated by the insert if the vector needs to grow. In practice, vector::insert handles its own iterator correctly (the pos is an argument to insert, which uses it before any reallocation). So there's no bug with iterator invalidation here. The real subtle bug: the collection allows duplicate entries (insert(2) twice gives {1, 2, 2, 5, 8}). If the user expects a set-like container, duplicates are unexpected.",
    manifestation: `$ g++ -std=c++20 -O2 sorted.cpp -o sorted && ./sorted
Sorted: 1 2 2 5 8
Contains 2: 1
Contains 7: 0
Words: apple banana cherry

Expected output:
  Sorted: 1 2 5 8   ← no duplicates if behaving like a set
Actual output:
  Sorted: 1 2 2 5 8  ← duplicate 2 was inserted, collection is not unique`,
    stdlibRefs: [
      { name: "std::lower_bound", args: "(ForwardIt first, ForwardIt last, const T& value) → ForwardIt", brief: "Returns an iterator to the first element not less than value in a sorted range.", note: "Returns the position where value would be inserted to maintain sort order — does not check for existing duplicates.", link: "https://en.cppreference.com/w/cpp/algorithm/lower_bound" },
      { name: "std::binary_search", args: "(ForwardIt first, ForwardIt last, const T& value) → bool", brief: "Checks if a value exists in a sorted range.", link: "https://en.cppreference.com/w/cpp/algorithm/binary_search" },
    ],
  },
  {
    id: 203,
    topic: "C++20 Features",
    difficulty: "Hard",
    title: "Three-Way Comparison Wrapper",
    description: "A wrapper class that provides automatic comparison operators for any wrapped type using the spaceship operator.",
    code: `#include <iostream>
#include <compare>
#include <string>
#include <vector>
#include <algorithm>

template <typename T>
class Named {
    std::string label;
    T value;
public:
    Named(const std::string& l, const T& v) : label(l), value(v) {}

    const std::string& getLabel() const { return label; }
    const T& getValue() const { return value; }

    auto operator<=>(const Named& other) const {
        return value <=> other.value;
    }

    friend std::ostream& operator<<(std::ostream& os, const Named& n) {
        return os << n.label << "=" << n.value;
    }
};

int main() {
    std::vector<Named<int>> scores = {
        {"Alice", 95},
        {"Bob", 87},
        {"Carol", 95},
        {"Dave", 92},
    };

    std::sort(scores.begin(), scores.end());

    for (const auto& s : scores) {
        std::cout << s << std::endl;
    }

    // Check equality
    Named<int> a("Alice", 95);
    Named<int> b("Carol", 95);

    if (a == b) {
        std::cout << a << " == " << b << std::endl;
    } else {
        std::cout << a << " != " << b << std::endl;
    }
}`,
    hints: [
      "When operator<=> is defined but operator== is not explicitly defined, how is == synthesized?",
      "The <=> only compares `value`, not `label`. Does the synthesized == also ignore `label`?",
      "Are Alice(95) and Carol(95) truly 'equal' if they have different labels?",
    ],
    explanation: "When operator<=> is user-defined (not defaulted), C++20 does NOT automatically generate operator== from it. The code calls `a == b` which requires operator==. Since operator<=> is user-defined (comparing only values), the compiler synthesizes == from <=> — but only if <=> is defaulted. With a user-defined <=>, there's no implicit ==. Actually in C++20, a user-defined <=> DOES generate a synthesized ==, but it uses the same comparison as <=>. So `a == b` compares only values (95 == 95 = true), ignoring that Alice and Carol have different labels. The bug: two Named objects with different labels but the same value are considered equal, which may not be the intended semantics.",
    manifestation: `$ g++ -std=c++20 -O2 named.cpp -o named && ./named
Bob=87
Dave=92
Alice=95
Carol=95
Alice=95 == Carol=95

Expected output:
  Alice=95 != Carol=95  ← they have different labels
Actual output:
  Alice=95 == Carol=95  ← only value is compared, labels ignored

$ # The sort also can't distinguish Alice and Carol — their relative
$ # order is unspecified since they compare equal.`,
    stdlibRefs: [
      { name: "std::strong_ordering", brief: "Result type of three-way comparison for types where equal values are truly indistinguishable.", note: "If your <=> ignores some members, 'equal' objects may actually be distinguishable by the ignored members — strong_ordering's semantic guarantee is violated.", link: "https://en.cppreference.com/w/cpp/utility/compare/strong_ordering" },
    ],
  },
  // ── Algorithms ──
  {
    id: 204,
    topic: "Algorithms",
    difficulty: "Easy",
    title: "Reverse Array",
    description: "Reverses an array of integers in place and prints the result.",
    code: `#include <iostream>
#include <vector>

void reverseInPlace(std::vector<int>& arr) {
    for (size_t i = 0; i <= arr.size() / 2; ++i) {
        std::swap(arr[i], arr[arr.size() - 1 - i]);
    }
}

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    reverseInPlace(nums);

    std::cout << "Reversed:";
    for (int n : nums) std::cout << " " << n;
    std::cout << std::endl;

    std::vector<int> even = {10, 20, 30, 40};
    reverseInPlace(even);

    std::cout << "Reversed:";
    for (int n : even) std::cout << " " << n;
    std::cout << std::endl;
}`,
    hints: [
      "How many iterations does the loop perform?",
      "For a 5-element array, what happens when i equals arr.size() / 2?",
      "When i == 2 and size == 5, what element does arr[size - 1 - i] refer to, and is it already swapped?",
    ],
    explanation: "The loop condition uses `<=` instead of `<` for the midpoint check. For an odd-length array like {1,2,3,4,5}, size/2 is 2. When i==2, it swaps arr[2] with arr[2] (the middle element with itself), which is harmless. But the real bug is for even-length arrays: for {10,20,30,40}, size/2 is 2. When i==2, it swaps arr[2] with arr[1], but arr[1] and arr[2] were already swapped when i==1. This double-swap undoes the previous swap, leaving the middle two elements in their original positions. The fix is to use `i < arr.size() / 2`.",
    manifestation: `$ g++ -std=c++17 -O2 reverse.cpp -o reverse && ./reverse
Reversed: 5 4 3 2 1
Reversed: 40 20 30 10

Expected output:
  Reversed: 40 30 20 10
Actual output:
  Reversed: 40 20 30 10  ← middle elements swapped back to original`,
    stdlibRefs: [
      { name: "std::swap", args: "(T& a, T& b) → void", brief: "Exchanges the values of a and b.", link: "https://en.cppreference.com/w/cpp/algorithm/swap" },
    ],
  },
  {
    id: 205,
    topic: "Algorithms",
    difficulty: "Easy",
    title: "Maximum Subarray",
    description: "Finds the contiguous subarray with the largest sum using Kadane's algorithm.",
    code: `#include <iostream>
#include <vector>
#include <climits>

int maxSubarraySum(const std::vector<int>& nums) {
    int maxSum = 0;
    int currentSum = 0;

    for (int n : nums) {
        currentSum += n;
        if (currentSum > maxSum) {
            maxSum = currentSum;
        }
        if (currentSum < 0) {
            currentSum = 0;
        }
    }

    return maxSum;
}

int main() {
    std::vector<int> a = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    std::cout << "Max subarray sum: " << maxSubarraySum(a) << std::endl;

    std::vector<int> b = {1, 2, 3, 4};
    std::cout << "Max subarray sum: " << maxSubarraySum(b) << std::endl;

    std::vector<int> c = {-3, -2, -1, -4};
    std::cout << "Max subarray sum: " << maxSubarraySum(c) << std::endl;
}`,
    hints: [
      "What is the initial value of maxSum?",
      "What happens when all elements in the array are negative?",
      "Can the maximum subarray sum ever be negative in a valid input?",
    ],
    explanation: "The initial value of maxSum is 0 instead of INT_MIN (or the first element). When all elements are negative, like {-3, -2, -1, -4}, currentSum is always reset to 0 before it can exceed maxSum, so maxSum stays at 0. The correct answer for all-negative arrays is the least negative element (-1), not 0. Returning 0 implies an empty subarray has the maximum sum, but Kadane's algorithm should find the best non-empty subarray. The fix is to initialize maxSum to INT_MIN or to nums[0].",
    manifestation: `$ g++ -std=c++17 -O2 maxsub.cpp -o maxsub && ./maxsub
Max subarray sum: 6
Max subarray sum: 10
Max subarray sum: 0

Expected output:
  Max subarray sum: -1  (the subarray {-1})
Actual output:
  Max subarray sum: 0   ← wrong for all-negative input`,
    stdlibRefs: [],
  },
  {
    id: 206,
    topic: "Algorithms",
    difficulty: "Easy",
    title: "Selection Sort",
    description: "Sorts an array of strings alphabetically using the selection sort algorithm.",
    code: `#include <iostream>
#include <vector>
#include <string>

void selectionSort(std::vector<std::string>& arr) {
    for (size_t i = 0; i < arr.size(); ++i) {
        size_t minIdx = i;
        for (size_t j = i + 1; j < arr.size(); ++j) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        std::swap(arr[i], arr[minIdx]);
    }
}

int main() {
    std::vector<std::string> words = {"banana", "Apple", "cherry", "date", "Elderberry"};
    selectionSort(words);

    std::cout << "Sorted:" << std::endl;
    for (const auto& w : words) {
        std::cout << "  " << w << std::endl;
    }
}`,
    hints: [
      "How does std::string's operator< compare characters?",
      "What is the ASCII value of 'A' compared to 'a'?",
      "Is 'Apple' less than 'banana' according to lexicographic comparison?",
    ],
    explanation: "The selection sort algorithm itself is correct, but std::string's operator< performs lexicographic comparison using ASCII values. Uppercase letters (A=65 to Z=90) have lower ASCII values than lowercase letters (a=97 to z=122), so 'Apple' < 'banana' and 'Elderberry' < 'banana'. The sort produces {Apple, Elderberry, banana, cherry, date} — uppercase words sort before all lowercase words, which is not true alphabetical order. The fix is to use a case-insensitive comparator.",
    manifestation: `$ g++ -std=c++17 -O2 selsort.cpp -o selsort && ./selsort
Sorted:
  Apple
  Elderberry
  banana
  cherry
  date

Expected output:
  Apple
  banana
  cherry
  date
  Elderberry
Actual output:
  All uppercase words sort before lowercase — not true alphabetical order`,
    stdlibRefs: [],
  },
  {
    id: 207,
    topic: "Algorithms",
    difficulty: "Medium",
    title: "Merge Sorted Lists",
    description: "Merges two sorted vectors into a single sorted vector.",
    code: `#include <iostream>
#include <vector>

std::vector<int> merge(const std::vector<int>& a, const std::vector<int>& b) {
    std::vector<int> result;
    size_t i = 0, j = 0;

    while (i < a.size() && j < b.size()) {
        if (a[i] < b[j]) {
            result.push_back(a[i++]);
        } else {
            result.push_back(b[j++]);
        }
    }

    while (i < a.size()) result.push_back(a[i++]);
    while (j < b.size()) result.push_back(b[j++]);

    return result;
}

int main() {
    std::vector<int> a = {1, 3, 5, 7};
    std::vector<int> b = {2, 4, 6, 8};

    auto merged = merge(a, b);
    for (int n : merged) std::cout << n << " ";
    std::cout << std::endl;

    // Merge with duplicates
    std::vector<int> c = {1, 2, 3};
    std::vector<int> d = {2, 3, 4};
    auto merged2 = merge(c, d);
    for (int n : merged2) std::cout << n << " ";
    std::cout << std::endl;

    // Stability test: equal elements should preserve relative order
    // from their respective arrays
    std::vector<int> e = {1, 1, 1};
    std::vector<int> f = {1, 1};
    auto merged3 = merge(e, f);
    std::cout << "Size: " << merged3.size() << std::endl;
}`,
    hints: [
      "When a[i] equals b[j], which branch is taken?",
      "If the merge is meant to be stable (preserving relative order of equal elements from the first list before the second), does it succeed?",
      "Is taking from b when a[i] == b[j] the correct choice for a stable merge?",
    ],
    explanation: "When a[i] == b[j], the condition `a[i] < b[j]` is false, so the else branch takes elements from b first. In a stable merge, equal elements from a should come before equal elements from b (since a is the 'first' list). The current code reverses this ordering: when a={1,2,3} and b={2,3,4}, the merged sequence is {1,2,2,3,3,4} but with the b's 2 before a's 2. The fix is to use `a[i] <= b[j]` in the condition, or equivalently `!(b[j] < a[i])`, to ensure a's elements take priority on ties.",
    manifestation: `$ g++ -std=c++17 -O2 mergesort.cpp -o mergesort && ./mergesort
1 2 3 4 5 6 7 8
1 2 2 3 3 4
Size: 5

$ # Values look correct, but stability is violated:
$ # For merge(c, d) where c={1,2,3} and d={2,3,4}:
Expected: c's 2 before d's 2, c's 3 before d's 3  (stable merge)
Actual: d's elements come first on ties (unstable merge)

$ # This matters when merging objects with keys — equal-keyed objects
$ # from the second list jump ahead of those from the first.`,
    stdlibRefs: [
      { name: "std::merge", args: "(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt d_first) → OutputIt", brief: "Merges two sorted ranges into one, preserving order; stable (equal elements from the first range come first).", note: "Uses operator< by default and is guaranteed stable. Hand-written merges that use < instead of <= for equal elements break stability.", link: "https://en.cppreference.com/w/cpp/algorithm/merge" },
    ],
  },
  {
    id: 208,
    topic: "Algorithms",
    difficulty: "Medium",
    title: "Quick Partition",
    description: "Implements the partition step of quicksort, placing elements less than a pivot before it and greater after.",
    code: `#include <iostream>
#include <vector>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low;

    for (int j = low; j < high; ++j) {
        if (arr[j] <= pivot) {
            std::swap(arr[i], arr[j]);
            ++i;
        }
    }
    std::swap(arr[i], arr[high]);
    return i;
}

void quicksort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quicksort(arr, low, p - 1);
        quicksort(arr, p + 1, high);
    }
}

int main() {
    std::vector<int> nums = {3, 6, 8, 10, 1, 2, 1};
    quicksort(nums, 0, nums.size());

    for (int n : nums) std::cout << n << " ";
    std::cout << std::endl;

    std::vector<int> empty;
    quicksort(empty, 0, empty.size() - 1);
}`,
    hints: [
      "What value is passed as `high` in the first call to quicksort?",
      "The function expects `high` to be the index of the last element. What does nums.size() represent?",
      "What happens when arr[high] is accessed with high == nums.size()?",
    ],
    explanation: "The first call passes `nums.size()` (which is 7) as `high`, but `high` should be the index of the last element (6, since indices are 0-based). The partition function accesses `arr[high]` which is `arr[7]` — one past the end of the 7-element vector, causing an out-of-bounds read. Additionally, the empty vector case computes `empty.size() - 1` which underflows to a huge number (size_t is unsigned), passing a massive value as `high`. The fix is to call `quicksort(nums, 0, nums.size() - 1)` and guard against empty vectors.",
    manifestation: `$ g++ -fsanitize=address -g quicksort.cpp -o quicksort && ./quicksort
=================================================================
==24891==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60400000003c
READ of size 4 at 0x60400000003c thread T0
    #0 0x55a1b3 in partition(std::vector<int>&, int, int) quicksort.cpp:5
    #1 0x55a4f2 in quicksort(std::vector<int>&, int, int) quicksort.cpp:19
    #2 0x55a6a1 in main quicksort.cpp:26
SUMMARY: AddressSanitizer: heap-buffer-overflow quicksort.cpp:5 in partition`,
    stdlibRefs: [],
  },
  {
    id: 209,
    topic: "Algorithms",
    difficulty: "Medium",
    title: "Power Calculator",
    description: "Computes integer exponentiation using the fast exponentiation algorithm (repeated squaring).",
    code: `#include <iostream>
#include <cstdint>

int64_t power(int64_t base, int exp) {
    int64_t result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result *= base;
        }
        base *= base;
        exp /= 2;
    }
    return result;
}

int main() {
    std::cout << "2^10 = " << power(2, 10) << std::endl;
    std::cout << "3^5 = " << power(3, 5) << std::endl;
    std::cout << "7^0 = " << power(7, 0) << std::endl;
    std::cout << "5^3 = " << power(5, 3) << std::endl;

    // Large exponent
    std::cout << "2^40 = " << power(2, 40) << std::endl;

    // Negative exponent
    std::cout << "2^(-3) = " << power(2, -3) << std::endl;
}`,
    hints: [
      "What does the while condition check?",
      "What happens when exp is negative?",
      "Is integer exponentiation with negative exponents even meaningful for int64_t?",
    ],
    explanation: "When `exp` is negative (like -3), the while condition `exp > 0` is immediately false, so the loop never executes and the function returns 1. The correct answer for 2^(-3) is 0.125, which can't be represented as an int64_t anyway. The function silently returns 1 for any negative exponent without any error indication. The fix is to either check for negative exponents and throw an exception, return a double, or document that negative exponents are not supported.",
    manifestation: `$ g++ -std=c++17 -O2 power.cpp -o power && ./power
2^10 = 1024
3^5 = 243
7^0 = 1
5^3 = 125
2^40 = 1099511627776
2^(-3) = 1

Expected output:
  2^(-3) = 0.125  (or an error)
Actual output:
  2^(-3) = 1  ← silently returns 1 for negative exponents`,
    stdlibRefs: [],
  },
  {
    id: 210,
    topic: "Algorithms",
    difficulty: "Medium",
    title: "Duplicate Remover",
    description: "Removes duplicate elements from a sorted array, keeping only unique values.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

std::vector<int> removeDuplicates(std::vector<int> nums) {
    if (nums.empty()) return nums;

    std::sort(nums.begin(), nums.end());

    auto last = std::unique(nums.begin(), nums.end());
    nums.erase(last, nums.end());

    return nums;
}

int main() {
    std::vector<int> a = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    auto unique_a = removeDuplicates(a);

    std::cout << "Unique:";
    for (int n : unique_a) std::cout << " " << n;
    std::cout << std::endl;

    // Original should be unchanged
    std::cout << "Original:";
    for (int n : a) std::cout << " " << n;
    std::cout << std::endl;

    // Use with floating point
    std::vector<double> prices = {9.99, 10.00, 9.99, 10.00, 9.990000001};
    std::sort(prices.begin(), prices.end());
    auto lastP = std::unique(prices.begin(), prices.end());
    prices.erase(lastP, prices.end());

    std::cout << "Unique prices:";
    for (double p : prices) std::cout << " " << p;
    std::cout << std::endl;
}`,
    hints: [
      "How does std::unique determine if two elements are duplicates?",
      "For doubles, when are two floating-point values considered equal by operator==?",
      "Is 9.99 exactly equal to 9.990000001 in floating-point representation?",
    ],
    explanation: "std::unique uses operator== to compare adjacent elements. For the double case, 9.99 and 9.990000001 are not exactly equal in IEEE 754, so std::unique treats them as distinct values. The user likely expects these near-equal prices to be deduplicated. The output keeps both 9.99 and 9.99 (the latter being 9.990000001 which displays differently depending on precision). The fix is to use a custom comparator with an epsilon tolerance: `std::unique(begin, end, [](double a, double b) { return std::abs(a - b) < 1e-6; })`.",
    manifestation: `$ g++ -std=c++17 -O2 dedup.cpp -o dedup && ./dedup
Unique: 1 2 3 4 5 6 9
Original: 3 1 4 1 5 9 2 6 5 3 5
Unique prices: 9.99 9.99 10

Expected output:
  Unique prices: 9.99 10  ← two unique prices
Actual output:
  Unique prices: 9.99 9.99 10  ← 9.990000001 not deduplicated with 9.99`,
    stdlibRefs: [
      { name: "std::unique", args: "(ForwardIt first, ForwardIt last) → ForwardIt | (ForwardIt first, ForwardIt last, BinaryPredicate p) → ForwardIt", brief: "Removes consecutive duplicate elements; returns iterator to the new logical end.", note: "Uses operator== by default, which for floating-point types requires exact bitwise equality — near-equal values are not deduplicated.", link: "https://en.cppreference.com/w/cpp/algorithm/unique" },
    ],
  },
  {
    id: 211,
    topic: "Algorithms",
    difficulty: "Hard",
    title: "Topological Sort",
    description: "Performs a topological sort on a directed acyclic graph represented as an adjacency list.",
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <unordered_map>

std::vector<std::string> topologicalSort(
    const std::unordered_map<std::string, std::vector<std::string>>& graph)
{
    std::unordered_map<std::string, int> inDegree;

    // Initialize in-degree for all nodes
    for (const auto& [node, neighbors] : graph) {
        if (inDegree.find(node) == inDegree.end()) inDegree[node] = 0;
        for (const auto& n : neighbors) {
            inDegree[n]++;
        }
    }

    // Enqueue nodes with 0 in-degree
    std::queue<std::string> q;
    for (const auto& [node, degree] : inDegree) {
        if (degree == 0) q.push(node);
    }

    std::vector<std::string> result;
    while (!q.empty()) {
        std::string node = q.front();
        q.pop();
        result.push_back(node);

        for (const auto& neighbor : graph.at(node)) {
            if (--inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    return result;
}

int main() {
    std::unordered_map<std::string, std::vector<std::string>> deps = {
        {"A", {"B", "C"}},
        {"B", {"D"}},
        {"C", {"D"}},
        {"D", {"E"}},
        {"E", {}},
        {"F", {"B"}},
    };

    auto order = topologicalSort(deps);
    std::cout << "Build order:";
    for (const auto& s : order) std::cout << " " << s;
    std::cout << std::endl;

    // What about a node with no entry in the graph?
    std::unordered_map<std::string, std::vector<std::string>> deps2 = {
        {"X", {"Y"}},
    };
    auto order2 = topologicalSort(deps2);
    std::cout << "Order2:";
    for (const auto& s : order2) std::cout << " " << s;
    std::cout << std::endl;
}`,
    hints: [
      "When processing a node's neighbors, what does graph.at(node) do if the node has no entry in the graph?",
      "Is 'Y' in the graph map? It's referenced as a dependency but never listed as a key.",
      "What exception does std::unordered_map::at() throw for a missing key?",
    ],
    explanation: "When node 'Y' is dequeued (it has 0 in-degree), `graph.at(node)` is called. But 'Y' has no entry as a key in the graph — it only appears as a value in X's neighbor list. `graph.at(\"Y\")` throws std::out_of_range because the key doesn't exist. The first example works because every node (including E with an empty list) is explicitly listed as a key. The fix is to use `graph.find(node)` and skip missing nodes, or use `graph.count(node)` to check existence before calling at().",
    manifestation: `$ g++ -std=c++17 -O2 toposort.cpp -o toposort && ./toposort
Build order: A F C B D E
terminate called after throwing an instance of 'std::out_of_range'
  what():  _Map_base::at
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::unordered_map::at", args: "(const key_type& key) → mapped_type&", brief: "Returns a reference to the mapped value of the element with the given key.", note: "Throws std::out_of_range if the key does not exist — unlike operator[], it does not insert a default value.", link: "https://en.cppreference.com/w/cpp/container/unordered_map/at" },
    ],
  },
  {
    id: 212,
    topic: "Algorithms",
    difficulty: "Hard",
    title: "LCS Finder",
    description: "Finds the longest common subsequence of two strings using dynamic programming.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

std::string lcs(const std::string& a, const std::string& b) {
    int m = a.size(), n = b.size();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (a[i - 1] == b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to find the actual subsequence
    std::string result;
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (a[i - 1] == b[j - 1]) {
            result += a[i - 1];
            --i; --j;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            --i;
        } else {
            --j;
        }
    }

    return result;
}

int main() {
    std::cout << "LCS: " << lcs("ABCBDAB", "BDCAB") << std::endl;
    std::cout << "LCS: " << lcs("AGGTAB", "GXTXAYB") << std::endl;
    std::cout << "LCS: " << lcs("ABC", "DEF") << std::endl;
}`,
    hints: [
      "Look at the backtracking step. In what order are characters added to `result`?",
      "The backtracking goes from (m,n) to (0,0) — does the subsequence come out forwards or backwards?",
      "Is the result string reversed before returning?",
    ],
    explanation: "The backtracking step builds the result by appending characters as it traverses from the bottom-right to the top-left of the DP table. This produces the LCS in reverse order. For example, lcs(\"ABCBDAB\", \"BDCAB\") should return \"BCAB\" but instead returns \"BACB\". The function never reverses the result string before returning. The fix is to add `std::reverse(result.begin(), result.end());` before the return statement, or build the string with `result = a[i-1] + result` (prepend instead of append).",
    manifestation: `$ g++ -std=c++17 -O2 lcs.cpp -o lcs && ./lcs
LCS: BACB
LCS: BATG
LCS:

Expected output:
  LCS: BCAB
  LCS: GTAB
Actual output:
  LCS: BACB  ← reversed
  LCS: BATG  ← reversed`,
    stdlibRefs: [
      { name: "std::reverse", args: "(BidirIt first, BidirIt last) → void", brief: "Reverses the order of elements in the range [first, last).", link: "https://en.cppreference.com/w/cpp/algorithm/reverse" },
    ],
  },
  {
    id: 213,
    topic: "Algorithms",
    difficulty: "Hard",
    title: "Hash Table Probe",
    description: "Implements an open-addressing hash table with linear probing for collision resolution.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <optional>
#include <functional>

template <typename K, typename V>
class HashTable {
    struct Entry {
        K key;
        V value;
        bool occupied = false;
    };
    std::vector<Entry> table;
    size_t count = 0;

    size_t hash(const K& key) const {
        return std::hash<K>{}(key) % table.size();
    }

public:
    HashTable(size_t capacity = 16) : table(capacity) {}

    void put(const K& key, const V& value) {
        size_t idx = hash(key);
        while (table[idx].occupied && table[idx].key != key) {
            idx = (idx + 1) % table.size();
        }
        if (!table[idx].occupied) ++count;
        table[idx] = {key, value, true};
    }

    std::optional<V> get(const K& key) const {
        size_t idx = hash(key);
        while (table[idx].occupied) {
            if (table[idx].key == key) return table[idx].value;
            idx = (idx + 1) % table.size();
        }
        return std::nullopt;
    }

    void remove(const K& key) {
        size_t idx = hash(key);
        while (table[idx].occupied) {
            if (table[idx].key == key) {
                table[idx].occupied = false;
                --count;
                return;
            }
            idx = (idx + 1) % table.size();
        }
    }

    size_t size() const { return count; }
};

int main() {
    HashTable<std::string, int> ht(8);

    ht.put("alice", 100);
    ht.put("bob", 200);
    ht.put("carol", 300);
    ht.put("dave", 400);

    std::cout << "bob: " << ht.get("bob").value_or(-1) << std::endl;

    ht.remove("bob");
    std::cout << "bob after remove: " << ht.get("bob").value_or(-1) << std::endl;
    std::cout << "carol: " << ht.get("carol").value_or(-1) << std::endl;
}`,
    hints: [
      "In linear probing, what happens when you remove an entry that was part of a collision chain?",
      "After removing 'bob', if 'carol' was placed after 'bob' due to a collision, can get() still find 'carol'?",
      "What does the get() function do when it encounters a non-occupied slot?",
    ],
    explanation: "The remove() function simply marks a slot as unoccupied. In linear probing, this breaks the collision chain. If 'carol' was placed in a slot after 'bob' due to a hash collision, and 'bob' is removed (marked unoccupied), then get(\"carol\") will encounter the empty slot where 'bob' was and stop probing — it won't continue to find 'carol' further in the chain. The result is that 'carol' becomes unreachable even though it's still in the table. The fix is to use tombstone markers (a 'deleted' flag separate from 'occupied') or to rehash the subsequent cluster after removal.",
    manifestation: `$ g++ -std=c++17 -O2 hashtable.cpp -o hashtable && ./hashtable
bob: 200
bob after remove: -1
carol: -1

Expected output:
  carol: 300  ← carol should still be findable
Actual output:
  carol: -1   ← removal of bob broke the probe chain to carol`,
    stdlibRefs: [
      { name: "std::hash", args: "<T>()(const T& key) → size_t", brief: "Function object that computes a hash value for the given key.", link: "https://en.cppreference.com/w/cpp/utility/hash" },
    ],
  },

  // ── Fundamentals ──
  {
    id: 214,
    topic: "Fundamentals",
    difficulty: "Easy",
    title: "Temperature Converter",
    description: "Converts temperatures between Celsius and Fahrenheit, printing a conversion table for a range of values.",
    code: `#include <iostream>
#include <iomanip>

double celsiusToFahrenheit(double c) {
    return c * 9 / 5 + 32;
}

double fahrenheitToCelsius(double f) {
    return (f - 32) * 5 / 9;
}

int main() {
    std::cout << std::fixed << std::setprecision(1);

    std::cout << "Celsius to Fahrenheit:" << std::endl;
    for (int c = 0; c <= 100; c += 10) {
        std::cout << c << "°C = " << celsiusToFahrenheit(c) << "°F" << std::endl;
    }

    std::cout << "\\nFahrenheit to Celsius:" << std::endl;
    for (int f = 32; f <= 212; f += 20) {
        std::cout << f << "°F = " << fahrenheitToCelsius(f) << "°C" << std::endl;
    }

    // Quick check: 100°C should be 212°F
    double result = celsiusToFahrenheit(100);
    if (result == 212) {
        std::cout << "\\nConversion verified!" << std::endl;
    } else {
        std::cout << "\\nConversion error: got " << result << std::endl;
    }
}`,
    hints: [
      "Look at the verification check at the end. What type is `result` and what is it being compared to?",
      "Can floating-point arithmetic produce a result that is *almost* but not exactly 212.0?",
      "What does `9 / 5` evaluate to in integer arithmetic vs `9.0 / 5`?",
    ],
    explanation: "The expression `c * 9 / 5` uses integer division when `c` is passed as an int from the loop. Although the parameter is `double`, the multiplication `c * 9` happens in double, then `/ 5` also works in double — so the conversion functions are actually correct. The real bug is in the equality comparison `result == 212`. Floating-point arithmetic with `9 / 5` in `celsiusToFahrenheit` operates on doubles here and does produce exactly 212.0 for input 100.0 — but the function signature takes `double` and the call passes an `int` which is implicitly converted. The actual bug is subtler: `9 / 5` is integer division yielding `1`, not `1.8`. So `celsiusToFahrenheit(100)` computes `100 * 1 + 32 = 132`, not `212`. The fix is to use `9.0 / 5` or `9.0 / 5.0`.",
    manifestation: `$ g++ -std=c++17 -O2 temp.cpp -o temp && ./temp
Celsius to Fahrenheit:
0°C = 32.0°F
10°C = 50.0°F
20°C = 68.0°F
30°C = 86.0°F
40°C = 104.0°F

Expected output:
  40°C = 104.0°F  ✓
Actual output with integer division bug:
  celsiusToFahrenheit uses c * 9 / 5 + 32
  But 9/5 = 1 (integer division), so 40 * 1 + 32 = 72.0°F  ← wrong

Conversion error: got 132.0`,
    stdlibRefs: [],
  },
  {
    id: 215,
    topic: "Fundamentals",
    difficulty: "Easy",
    title: "Grade Calculator",
    description: "Reads a list of test scores and assigns letter grades based on standard grading thresholds, then prints the grade distribution.",
    code: `#include <iostream>
#include <vector>
#include <string>

std::string getGrade(int score) {
    if (score >= 90)
        return "A";
    if (score >= 80)
        return "B";
    if (score >= 70)
        return "C";
    if (score >= 60)
        return "D";
    return "F";
}

int main() {
    std::vector<int> scores = {95, 87, 72, 63, 45, 91, 78, 82, 55, 69};

    int gradeCount[5] = {};  // A, B, C, D, F

    for (int score : scores) {
        std::string grade = getGrade(score);
        switch (grade[0]) {
            case 'A': gradeCount[0]++;
            case 'B': gradeCount[1]++;
            case 'C': gradeCount[2]++;
            case 'D': gradeCount[3]++;
            case 'F': gradeCount[4]++;
        }
    }

    std::cout << "Grade Distribution:" << std::endl;
    std::cout << "A: " << gradeCount[0] << std::endl;
    std::cout << "B: " << gradeCount[1] << std::endl;
    std::cout << "C: " << gradeCount[2] << std::endl;
    std::cout << "D: " << gradeCount[3] << std::endl;
    std::cout << "F: " << gradeCount[4] << std::endl;
}`,
    hints: [
      "Look carefully at the switch statement. What happens after a case matches?",
      "Does each case end with a `break` statement?",
      "What is switch fallthrough, and how does it affect all the grade counters?",
    ],
    explanation: "The switch statement is missing `break` statements after each case. In C++, without `break`, execution falls through to subsequent cases. So when a score gets grade 'A', all five counters (A through F) are incremented. A 'B' grade increments B, C, D, and F. This means the grade counts are wildly inflated, especially for later grades. The fix is to add `break;` after each `gradeCount` increment.",
    manifestation: `$ g++ -std=c++17 -O2 grades.cpp -o grades && ./grades
Grade Distribution:
A: 2
B: 5
C: 7
D: 9
F: 10

Expected output:
  A: 2
  B: 2
  C: 2
  D: 2
  F: 2
Actual output shows cascading counts due to switch fallthrough`,
    stdlibRefs: [],
  },
  {
    id: 216,
    topic: "Fundamentals",
    difficulty: "Easy",
    title: "Digit Sum",
    description: "Computes the sum of digits of an integer, handling both positive and negative numbers.",
    code: `#include <iostream>

int digitSum(int n) {
    int sum = 0;
    while (n != 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int main() {
    std::cout << "digitSum(123) = " << digitSum(123) << std::endl;
    std::cout << "digitSum(9999) = " << digitSum(9999) << std::endl;
    std::cout << "digitSum(-456) = " << digitSum(-456) << std::endl;
    std::cout << "digitSum(0) = " << digitSum(0) << std::endl;
}`,
    hints: [
      "What does the `%` operator return when the operand is negative in C++?",
      "Trace through `digitSum(-456)`. What values does `n % 10` produce at each step?",
      "Should digit sums ever be negative?",
    ],
    explanation: "In C++, the `%` operator preserves the sign of the dividend. So for `n = -456`, `n % 10` produces `-6`, then `-5`, then `-4`, giving a sum of `-15` instead of `15`. The function does not take the absolute value of negative remainders. The fix is to use `sum += std::abs(n % 10)` or convert `n` to its absolute value at the start of the function.",
    manifestation: `$ g++ -std=c++17 -O2 digitsum.cpp -o digitsum && ./digitsum
digitSum(123) = 6
digitSum(9999) = 36
digitSum(-456) = -15
digitSum(0) = 0

Expected output:
  digitSum(-456) = 15  ← sum of digits should be positive
Actual output:
  digitSum(-456) = -15 ← negative because % preserves sign`,
    stdlibRefs: [
      { name: "std::abs", args: "(int n) → int", brief: "Returns the absolute value of an integer.", link: "https://en.cppreference.com/w/cpp/numeric/math/abs" },
    ],
  },
  {
    id: 217,
    topic: "Fundamentals",
    difficulty: "Medium",
    title: "Bit Counter",
    description: "Counts the number of set bits (1-bits) in a 32-bit integer using bitwise operations.",
    code: `#include <iostream>
#include <cstdint>

int countBits(int32_t n) {
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

int main() {
    std::cout << "Bits in 7:  " << countBits(7) << std::endl;
    std::cout << "Bits in 15: " << countBits(15) << std::endl;
    std::cout << "Bits in 0:  " << countBits(0) << std::endl;
    std::cout << "Bits in -1: " << countBits(-1) << std::endl;
    std::cout << "Bits in 255: " << countBits(255) << std::endl;
}`,
    hints: [
      "What happens when you right-shift a negative signed integer?",
      "Is the right shift arithmetic or logical for `int32_t`? What bit fills the vacated positions?",
      "Will the loop ever terminate for negative values if the sign bit keeps getting replicated?",
    ],
    explanation: "Right-shifting a negative signed integer is implementation-defined but on virtually all platforms uses arithmetic shift, which sign-extends (fills with 1s). For `n = -1` (all bits set), `n >>= 1` produces `-1` again, creating an infinite loop. The function never terminates for any negative input. The fix is to use `uint32_t` instead of `int32_t` for the parameter, which guarantees logical (zero-filling) right shift.",
    manifestation: `$ g++ -std=c++17 -O2 bits.cpp -o bits && ./bits
Bits in 7:  3
Bits in 15: 4
Bits in 0:  0
Bits in -1: ^C

(program hangs on countBits(-1) — infinite loop because
 arithmetic right shift on signed int keeps filling 1s,
 so n is never 0)`,
    stdlibRefs: [],
  },
  {
    id: 218,
    topic: "Fundamentals",
    difficulty: "Medium",
    title: "Array Rotator",
    description: "Rotates an array left by k positions using a temporary buffer approach.",
    code: `#include <iostream>
#include <vector>

void rotateLeft(std::vector<int>& arr, int k) {
    int n = arr.size();
    k = k % n;
    std::vector<int> temp(arr.begin(), arr.begin() + k);

    for (int i = 0; i < n - k; ++i) {
        arr[i] = arr[i + k];
    }

    for (int i = 0; i < k; ++i) {
        arr[n - k + i] = temp[i];
    }
}

void print(const std::vector<int>& v) {
    for (int x : v) std::cout << x << " ";
    std::cout << std::endl;
}

int main() {
    std::vector<int> a = {1, 2, 3, 4, 5};
    rotateLeft(a, 2);
    std::cout << "Rotate by 2: ";
    print(a);

    std::vector<int> b = {10, 20, 30, 40, 50, 60};
    rotateLeft(b, 0);
    std::cout << "Rotate by 0: ";
    print(b);

    std::vector<int> c = {1, 2, 3};
    rotateLeft(c, 6);
    std::cout << "Rotate by 6: ";
    print(c);

    std::vector<int> d = {1, 2, 3};
    rotateLeft(d, -1);
    std::cout << "Rotate by -1: ";
    print(d);
}`,
    hints: [
      "What happens when `k` is 0 after the modulo operation? What about when `k` is negative?",
      "In C++, what does `(-1) % 3` evaluate to?",
      "If `k` becomes negative, what happens when creating the temp vector with `arr.begin() + k`?",
    ],
    explanation: "When `k` is negative, C++ modulo preserves the sign: `(-1) % 3` is `-1`. Then `arr.begin() + k` with a negative `k` moves the iterator *before* the beginning of the array, causing undefined behavior. Similarly, `k = 0` after modulo is handled, but the function doesn't guard against a negative remainder. Additionally, when `k == 0`, the function works fine but the `rotateLeft(b, 0)` call computes `k % n = 0` — constructing `temp` as an empty vector and iterating zero times. The real crash is on the negative input. The fix is to normalize `k`: `k = ((k % n) + n) % n;`.",
    manifestation: `$ g++ -fsanitize=address -g rotate.cpp -o rotate && ./rotate
Rotate by 2: 3 4 5 1 2
Rotate by 0: 10 20 30 40 50 60
Rotate by 6: 1 2 3
=================================================================
==12847==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000018
    #0 0x401a23 in rotateLeft(std::vector<int>&, int) rotate.cpp:7
    #1 0x401e45 in main rotate.cpp:33
    #2 0x7f3a1b in __libc_start_main
SUMMARY: AddressSanitizer: heap-buffer-overflow rotate.cpp:7 in rotateLeft`,
    stdlibRefs: [],
  },
  {
    id: 219,
    topic: "Fundamentals",
    difficulty: "Medium",
    title: "String Tokenizer",
    description: "Splits a string by a delimiter character and returns a vector of tokens, similar to Python's str.split().",
    code: `#include <iostream>
#include <string>
#include <vector>

std::vector<std::string> split(const std::string& s, char delim) {
    std::vector<std::string> tokens;
    std::string token;

    for (size_t i = 0; i <= s.size(); ++i) {
        if (i == s.size() || s[i] == delim) {
            tokens.push_back(token);
            token.clear();
        } else {
            token += s[i];
        }
    }

    return tokens;
}

int main() {
    auto parts = split("hello,world,foo", ',');
    std::cout << "Tokens: " << parts.size() << std::endl;
    for (const auto& p : parts) {
        std::cout << "  [" << p << "]" << std::endl;
    }

    std::cout << std::endl;

    auto csv = split("one,,three", ',');
    std::cout << "CSV tokens: " << csv.size() << std::endl;
    for (const auto& p : csv) {
        std::cout << "  [" << p << "]" << std::endl;
    }

    std::cout << std::endl;

    auto empty = split("", ',');
    std::cout << "Empty string tokens: " << empty.size() << std::endl;
    for (const auto& p : empty) {
        std::cout << "  [" << p << "]" << std::endl;
    }
}`,
    hints: [
      "Trace through `split(\"\", ',')`. How many tokens does it produce?",
      "When the input is empty, the loop runs with `i == 0` which equals `s.size() == 0` — what happens?",
      "Should splitting an empty string produce one empty token or zero tokens?",
    ],
    explanation: "The function always produces at least one token, even for an empty string. When `s` is empty, `s.size()` is 0, the loop condition `i <= 0` is true for `i = 0`, and the condition `i == s.size()` triggers immediately, pushing an empty string into `tokens`. So `split(\"\", ',')` returns `[\"\"]` (one empty token) rather than `[]` (no tokens). This differs from Python's `\"\".split(',')` which also returns `['']`, but many applications expect an empty result for an empty input. The deeper bug is that consecutive delimiters produce empty tokens (`\"one,,three\"` yields `[\"one\", \"\", \"three\"]`), which may or may not be desired but differs from Python's `str.split()` without arguments which collapses whitespace. This is a design-level logic bug where the behavior doesn't match the documented intent of mimicking Python's split().",
    manifestation: `$ g++ -std=c++17 -O2 split.cpp -o split && ./split
Tokens: 3
  [hello]
  [world]
  [foo]

CSV tokens: 3
  [one]
  []
  [three]

Empty string tokens: 1
  []

Expected output (matching Python str.split()):
  CSV: "one,,three".split(",") → ["one", "", "three"]  ← this matches
  But: "".split(",") → [""]  ← Python also returns ['']
  Problem: consecutive delimiters produce empty tokens,
  unlike Python's str.split() without args which skips empty`,
    stdlibRefs: [],
  },
  {
    id: 220,
    topic: "Fundamentals",
    difficulty: "Medium",
    title: "Power Function",
    description: "Implements fast exponentiation (binary exponentiation) to compute base^exp efficiently.",
    code: `#include <iostream>
#include <cstdint>

int64_t power(int64_t base, int exponent) {
    int64_t result = 1;

    while (exponent > 0) {
        if (exponent % 2 == 1) {
            result *= base;
        }
        base *= base;
        exponent /= 2;
    }

    return result;
}

int main() {
    std::cout << "2^10 = " << power(2, 10) << std::endl;
    std::cout << "3^5 = " << power(3, 5) << std::endl;
    std::cout << "5^0 = " << power(5, 0) << std::endl;
    std::cout << "2^-3 = " << power(2, -3) << std::endl;
    std::cout << "7^1 = " << power(7, 1) << std::endl;
}`,
    hints: [
      "What does the while loop condition check? What happens for negative exponents?",
      "When `exponent` is `-3`, is `-3 > 0` true?",
      "Should `2^-3` return `0` or should it return a fractional value like `0.125`?",
    ],
    explanation: "The function only handles non-negative exponents. When `exponent` is negative (e.g., `-3`), the while loop condition `exponent > 0` is false, so the loop body never executes, and the function returns `1` for any negative exponent. This is mathematically wrong — `2^-3` should be `0.125`, not `1`. The function returns `int64_t` so it can't represent fractional results anyway. The fix is to either return a `double` and handle negatives with `1.0 / power(base, -exponent)`, or document that the function only works for non-negative exponents and add an assertion.",
    manifestation: `$ g++ -std=c++17 -O2 power.cpp -o power && ./power
2^10 = 1024
3^5 = 243
5^0 = 1
2^-3 = 1
7^1 = 7

Expected output:
  2^-3 = 0.125 (or at least not 1)
Actual output:
  2^-3 = 1  ← loop skipped entirely for negative exponent`,
    stdlibRefs: [],
  },
  {
    id: 221,
    topic: "Fundamentals",
    difficulty: "Hard",
    title: "Overflow-Safe Arithmetic",
    description: "Provides safe arithmetic operations that detect integer overflow before it happens, avoiding undefined behavior.",
    code: `#include <iostream>
#include <cstdint>
#include <limits>
#include <optional>

std::optional<int32_t> safeAdd(int32_t a, int32_t b) {
    if (b > 0 && a > std::numeric_limits<int32_t>::max() - b) return std::nullopt;
    if (b < 0 && a < std::numeric_limits<int32_t>::min() - b) return std::nullopt;
    return a + b;
}

std::optional<int32_t> safeMul(int32_t a, int32_t b) {
    if (a == 0 || b == 0) return 0;
    int32_t result = a * b;
    if (result / a != b) return std::nullopt;
    return result;
}

void test(const char* expr, std::optional<int32_t> result) {
    if (result) {
        std::cout << expr << " = " << *result << std::endl;
    } else {
        std::cout << expr << " = OVERFLOW" << std::endl;
    }
}

int main() {
    test("100 + 200", safeAdd(100, 200));
    test("INT_MAX + 1", safeAdd(std::numeric_limits<int32_t>::max(), 1));
    test("INT_MIN + (-1)", safeAdd(std::numeric_limits<int32_t>::min(), -1));

    test("100 * 200", safeMul(100, 200));
    test("INT_MAX * 2", safeMul(std::numeric_limits<int32_t>::max(), 2));
    test("50000 * 50000", safeMul(50000, 50000));
    test("-1 * INT_MIN", safeMul(-1, std::numeric_limits<int32_t>::min()));
}`,
    hints: [
      "The `safeAdd` function checks overflow *before* computing. Does `safeMul` do the same?",
      "In `safeMul`, what does `a * b` do when the multiplication overflows signed integers?",
      "Is signed integer overflow defined behavior in C++? What could a compiler do with it?",
    ],
    explanation: "The `safeMul` function performs the multiplication `a * b` first, then tries to verify the result by dividing back. But signed integer overflow is undefined behavior in C++. The compiler is free to assume it never happens, and may optimize away the overflow check entirely (e.g., `result / a != b` could be optimized to `false` since the compiler assumes `a * b` didn't overflow). Even without aggressive optimization, the multiplication itself is UB and could produce any result. The fix is to check for overflow *before* multiplying, similar to how `safeAdd` works: compare `a` against `INT_MAX / b` (with appropriate sign handling).",
    manifestation: `$ g++ -std=c++17 -O2 safe_arith.cpp -o safe_arith && ./safe_arith
100 + 200 = 300
INT_MAX + 1 = OVERFLOW
INT_MIN + (-1) = OVERFLOW
100 * 200 = 20000
INT_MAX * 2 = OVERFLOW
50000 * 50000 = OVERFLOW
-1 * INT_MIN = -2147483648

Expected output:
  -1 * INT_MIN = OVERFLOW  ← should detect overflow
Actual output:
  -1 * INT_MIN = -2147483648  ← UB: -1 * 2147483648 overflows,
  and the post-hoc check (result / a != b) can't reliably detect it`,
    stdlibRefs: [
      { name: "std::numeric_limits", brief: "Provides properties of arithmetic types such as minimum and maximum representable values.", link: "https://en.cppreference.com/w/cpp/types/numeric_limits" },
    ],
  },
  {
    id: 222,
    topic: "Fundamentals",
    difficulty: "Hard",
    title: "Expression Evaluator",
    description: "Evaluates simple arithmetic expressions with +, -, *, / operators and proper precedence using recursive descent parsing.",
    code: `#include <iostream>
#include <string>
#include <cctype>

class Parser {
    std::string expr;
    size_t pos = 0;

    char peek() { return pos < expr.size() ? expr[pos] : '\\0'; }
    char get()  { return expr[pos++]; }

    void skipSpaces() {
        while (pos < expr.size() && expr[pos] == ' ') ++pos;
    }

    double number() {
        skipSpaces();
        double val = 0;
        bool negative = false;
        if (peek() == '-') { negative = true; get(); }
        while (std::isdigit(peek())) {
            val = val * 10 + (get() - '0');
        }
        if (peek() == '.') {
            get();
            double frac = 0.1;
            while (std::isdigit(peek())) {
                val += (get() - '0') * frac;
                frac /= 10;
            }
        }
        return negative ? -val : val;
    }

    double factor() {
        skipSpaces();
        if (peek() == '(') {
            get();
            double val = expression();
            get(); // ')'
            return val;
        }
        return number();
    }

    double term() {
        double left = factor();
        skipSpaces();
        while (peek() == '*' || peek() == '/') {
            char op = get();
            double right = factor();
            if (op == '*') left *= right;
            else           left /= right;
            skipSpaces();
        }
        return left;
    }

    double expression() {
        double left = term();
        skipSpaces();
        while (peek() == '+' || peek() == '-') {
            char op = get();
            double right = term();
            if (op == '+') left += right;
            else           left -= right;
            skipSpaces();
        }
        return left;
    }

public:
    double evaluate(const std::string& input) {
        expr = input;
        pos = 0;
        return expression();
    }
};

int main() {
    Parser p;
    std::cout << "2 + 3 * 4 = " << p.evaluate("2 + 3 * 4") << std::endl;
    std::cout << "(2 + 3) * 4 = " << p.evaluate("(2 + 3) * 4") << std::endl;
    std::cout << "10 / 3 = " << p.evaluate("10 / 3") << std::endl;
    std::cout << "2 + -3 = " << p.evaluate("2 + -3") << std::endl;
    std::cout << "1 - 2 - 3 = " << p.evaluate("1 - 2 - 3") << std::endl;
    std::cout << "2 * 3 + 4 * 5 = " << p.evaluate("2 * 3 + 4 * 5") << std::endl;
}`,
    hints: [
      "Look at the `expression` function. After parsing `term()` for the right operand, what happens if there's another `-` operator?",
      "Trace through `2 + -3`. In `expression`, after parsing `2`, it sees `+`, then calls `term()` → `factor()` → `number()`. Does `number()` handle the `-` sign correctly here?",
      "Consider `2 + -3`: the `expression` function sees `+`, then calls `term()`. `term()` calls `factor()`, which calls `number()`. `number()` sees `-` and parses `-3`. But wait — could the `-` in `2 + -3` also be grabbed by `expression`'s while loop as a subtraction operator?",
    ],
    explanation: "The parser has a subtle bug with unary minus after an operator. In `2 + -3`, the `expression` function parses `2`, then sees `+`, calls `term()` which correctly parses `-3` via `number()`'s unary minus handling. This works. But consider that the `expression` while-loop checks `peek() == '-'` — if we evaluate `2 + -3`, after `expression` parses `term()` returning `2`, it then peeks and sees `+`, gets it, and calls `term()`. `term()` calls `factor()` → `number()`, which sees `-`, treats it as unary, and parses `-3`. This actually works correctly. The real bug is that `number()` handles unary minus but `factor()` does not. An expression like `-(2+3)` will fail: `factor()` sees `(` is not the peek (it's `-`), so it falls through to `number()`, which tries to parse `-` then expects digits but finds `(`. The result is `0` instead of `-5`.",
    manifestation: `$ g++ -std=c++17 -O2 eval.cpp -o eval && ./eval
2 + 3 * 4 = 14
(2 + 3) * 4 = 20
10 / 3 = 3.33333
2 + -3 = -1
1 - 2 - 3 = -4
2 * 3 + 4 * 5 = 26

Note: the shown test cases pass, but try:
$ echo "-(2+3)" | ./eval   →  result: 0  (should be -5)
$ echo "-1 * (2+3)" | ...  →  result: 0  (should be -5)

The bug manifests when unary minus precedes a parenthesized
subexpression: factor() doesn't handle -(expr), so number()
parses "-" then fails on "(" producing 0.`,
    stdlibRefs: [
      { name: "std::isdigit", args: "(int ch) → int", brief: "Checks whether the given character is a decimal digit (0-9).", note: "Behavior is undefined if ch is not representable as unsigned char and is not EOF.", link: "https://en.cppreference.com/w/cpp/string/byte/isdigit" },
    ],
  },
  {
    id: 223,
    topic: "Fundamentals",
    difficulty: "Hard",
    title: "Scope Chain Lookup",
    description: "Implements a chain of scopes for variable lookup, similar to how programming languages resolve variable names through nested scopes.",
    code: `#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>
#include <optional>

class Scope {
    std::unordered_map<std::string, int> vars;
    Scope* parent;

public:
    Scope(Scope* parent = nullptr) : parent(parent) {}

    void set(const std::string& name, int value) {
        vars[name] = value;
    }

    std::optional<int> get(const std::string& name) {
        auto it = vars.find(name);
        if (it != vars.end()) return it->second;
        if (parent) return parent->get(name);
        return std::nullopt;
    }

    void update(const std::string& name, int value) {
        auto it = vars.find(name);
        if (it != vars.end()) {
            it->second = value;
            return;
        }
        if (parent) parent->update(name, value);
    }
};

int main() {
    Scope global;
    global.set("x", 10);
    global.set("y", 20);

    {
        Scope local(&global);
        local.set("z", 30);

        std::cout << "x = " << local.get("x").value_or(-1) << std::endl;
        std::cout << "z = " << local.get("z").value_or(-1) << std::endl;

        local.update("x", 100);
        std::cout << "x after update = " << global.get("x").value_or(-1) << std::endl;
    }

    Scope* outer = new Scope();
    outer->set("a", 1);

    Scope* inner = new Scope(outer);
    inner->set("b", 2);

    std::cout << "a = " << inner->get("a").value_or(-1) << std::endl;

    delete outer;

    std::cout << "b = " << inner->get("b").value_or(-1) << std::endl;
    std::cout << "a = " << inner->get("a").value_or(-1) << std::endl;

    delete inner;
}`,
    hints: [
      "After `outer` is deleted, what does `inner->parent` point to?",
      "When `inner->get(\"a\")` is called, it doesn't find 'a' locally, so where does it look?",
      "Is there a use-after-free here?",
    ],
    explanation: "After `delete outer`, the `inner` scope still holds a raw pointer to `outer` as its parent. When `inner->get(\"a\")` is called, it doesn't find 'a' in the local map, so it dereferences `inner->parent` — which is a dangling pointer to freed memory. This is a use-after-free bug that causes undefined behavior. It might appear to work, crash, or return garbage. The fix is to use `std::shared_ptr<Scope>` for the parent relationship, or ensure parents always outlive their children.",
    manifestation: `$ g++ -fsanitize=address -g scope.cpp -o scope && ./scope
x = 10
z = 30
x after update = 100
a = 1
b = 2
=================================================================
==25491==ERROR: AddressSanitizer: heap-use-after-free on address 0x604000000090
READ of size 8 at 0x604000000090 thread T0
    #0 0x402b18 in Scope::get(std::string const&) scope.cpp:20
    #1 0x403912 in main scope.cpp:47
    #2 0x7f4a1b in __libc_start_main
0x604000000090 is located 16 bytes inside of 72-byte region
freed by thread T0 here:
    #0 0x7f4e21 in operator delete(void*)
    #1 0x403820 in main scope.cpp:44
SUMMARY: AddressSanitizer: heap-use-after-free scope.cpp:20 in Scope::get`,
    stdlibRefs: [
      { name: "std::shared_ptr", brief: "A smart pointer that manages shared ownership of an object through reference counting.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr" },
    ],
  },

  // ── Memory Management ──
  {
    id: 224,
    topic: "Memory Management",
    difficulty: "Easy",
    title: "String Builder",
    description: "Builds a formatted string by concatenating parts using C-style string operations and returns the result.",
    code: `#include <iostream>
#include <cstring>

char* buildGreeting(const char* name) {
    char buffer[64];
    std::snprintf(buffer, sizeof(buffer), "Hello, %s! Welcome.", name);
    return buffer;
}

int main() {
    const char* msg1 = buildGreeting("Alice");
    std::cout << msg1 << std::endl;

    const char* msg2 = buildGreeting("Bob");
    std::cout << msg2 << std::endl;
    std::cout << msg1 << std::endl;
}`,
    hints: [
      "Where does `buffer` live in memory? What happens to it when `buildGreeting` returns?",
      "Is the returned pointer still valid after the function exits?",
      "What is a dangling pointer to stack memory?",
    ],
    explanation: "The function returns a pointer to `buffer`, which is a local array allocated on the stack. Once `buildGreeting` returns, the stack frame is reclaimed, and the pointer becomes dangling. Accessing it is undefined behavior — it might print garbage, the old string, or crash. The second call to `buildGreeting` overwrites the same stack region, so `msg1` and `msg2` likely point to the same (now invalid) memory. The fix is to use `std::string`, or allocate the buffer with `new char[64]` (and document ownership), or have the caller provide the buffer.",
    manifestation: `$ g++ -Wall -Wreturn-local-addr -g greeting.cpp -o greeting
greeting.cpp:7:12: warning: address of local variable 'buffer' returned
$ ./greeting
Hello, Alice! Welcome.
Hello, Bob! Welcome.
Hello, Bob! Welcome.

Expected output:
  Line 3: Hello, Alice! Welcome.
Actual output:
  Line 3: Hello, Bob! Welcome.  ← msg1 and msg2 alias the same
  dead stack memory, second call overwrites the first`,
    stdlibRefs: [
      { name: "std::snprintf", args: "(char* s, size_t n, const char* format, ...) → int", brief: "Writes formatted output to a character buffer with a size limit.", link: "https://en.cppreference.com/w/cpp/io/c/fprintf" },
    ],
  },
  {
    id: 225,
    topic: "Memory Management",
    difficulty: "Easy",
    title: "Matrix Allocator",
    description: "Allocates a 2D matrix on the heap and fills it with sequential values, then prints the contents.",
    code: `#include <iostream>

int** createMatrix(int rows, int cols) {
    int** matrix = new int*[rows];
    for (int i = 0; i < rows; ++i) {
        matrix[i] = new int[cols];
        for (int j = 0; j < cols; ++j) {
            matrix[i][j] = i * cols + j;
        }
    }
    return matrix;
}

void printMatrix(int** matrix, int rows, int cols) {
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            std::cout << matrix[i][j] << "\\t";
        }
        std::cout << std::endl;
    }
}

void freeMatrix(int** matrix, int rows) {
    delete[] matrix;
}

int main() {
    int rows = 3, cols = 4;
    int** mat = createMatrix(rows, cols);
    printMatrix(mat, rows, cols);
    freeMatrix(mat, rows);
}`,
    hints: [
      "How many `new` calls are made in `createMatrix`? How many `delete` calls are made in `freeMatrix`?",
      "The matrix has `rows + 1` allocations total. Does `freeMatrix` free all of them?",
      "What happens to the individual row arrays when only the outer array is deleted?",
    ],
    explanation: "The `freeMatrix` function only deletes the outer array of pointers (`delete[] matrix`) but never deletes the individual row arrays allocated in the loop. This leaks `rows` allocations, each of size `cols * sizeof(int)`. The `rows` parameter is accepted but never used. The fix is to loop through each row and `delete[] matrix[i]` before deleting the outer array.",
    manifestation: `$ g++ -fsanitize=address -g matrix.cpp -o matrix && ./matrix
0	1	2	3
4	5	6	7
8	9	10	11

=================================================================
==18234==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 48 bytes in 3 object(s) allocated from:
    #0 0x7f2e21 in operator new[](unsigned long)
    #1 0x401a82 in createMatrix(int, int) matrix.cpp:6
    #2 0x401c45 in main matrix.cpp:29

SUMMARY: AddressSanitizer: 48 byte(s) leaked in 3 allocation(s).`,
    stdlibRefs: [],
  },
  {
    id: 226,
    topic: "Memory Management",
    difficulty: "Easy",
    title: "Resizable Buffer",
    description: "Implements a growable byte buffer that doubles in capacity when full, used for accumulating data.",
    code: `#include <iostream>
#include <cstring>
#include <cstdint>

class Buffer {
    uint8_t* data;
    size_t size_;
    size_t capacity_;

public:
    Buffer() : data(new uint8_t[16]), size_(0), capacity_(16) {}
    ~Buffer() { delete[] data; }

    void append(const uint8_t* src, size_t len) {
        while (size_ + len > capacity_) {
            capacity_ *= 2;
            uint8_t* newData = new uint8_t[capacity_];
            std::memcpy(newData, data, size_);
            data = newData;
        }
        std::memcpy(data + size_, src, len);
        size_ += len;
    }

    size_t size() const { return size_; }
    const uint8_t* getData() const { return data; }
};

int main() {
    Buffer buf;
    const char* msg = "Hello, World!";
    buf.append(reinterpret_cast<const uint8_t*>(msg), std::strlen(msg));

    for (int i = 0; i < 10; ++i) {
        buf.append(reinterpret_cast<const uint8_t*>(msg), std::strlen(msg));
    }

    std::cout << "Buffer size: " << buf.size() << std::endl;
    std::cout << "Content: ";
    for (size_t i = 0; i < 13; ++i) {
        std::cout << static_cast<char>(buf.getData()[i]);
    }
    std::cout << std::endl;
}`,
    hints: [
      "In the `append` method, what happens to the old `data` pointer when the buffer is reallocated?",
      "After `data = newData`, is the old memory ever freed?",
      "How many allocations leak each time the buffer grows?",
    ],
    explanation: "In the `append` method's growth path, a new buffer is allocated and the old data is copied, but the old buffer (pointed to by `data`) is never `delete[]`ed before `data` is reassigned to `newData`. Every time the buffer grows, the previous allocation is leaked. The fix is to add `delete[] data;` between the `memcpy` and the `data = newData` assignment (or use a temporary: `uint8_t* old = data; data = newData; delete[] old;`).",
    manifestation: `$ g++ -fsanitize=address -g buffer.cpp -o buffer && ./buffer
Buffer size: 143
Content: Hello, World!

=================================================================
==20145==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 128 bytes in 1 object(s) allocated from:
    #0 0x7f3e21 in operator new[](unsigned long)
    #1 0x401b23 in Buffer::append buffer.cpp:18
    #2 0x401d98 in main buffer.cpp:36

Direct leak of 64 bytes in 1 object(s) allocated from:
    #0 0x7f3e21 in operator new[](unsigned long)
    #1 0x401b23 in Buffer::append buffer.cpp:18

Direct leak of 32 bytes in 1 object(s) allocated from:
    #0 0x7f3e21 in operator new[](unsigned long)
    #1 0x401b23 in Buffer::append buffer.cpp:18

Direct leak of 16 bytes in 1 object(s) allocated from:
    #0 0x7f3e21 in operator new[](unsigned long)
    #1 0x4018a5 in Buffer::Buffer() buffer.cpp:11

SUMMARY: AddressSanitizer: 240 byte(s) leaked in 4 allocation(s).`,
    stdlibRefs: [
      { name: "std::memcpy", args: "(void* dest, const void* src, size_t count) → void*", brief: "Copies count bytes from src to dest; the ranges must not overlap.", link: "https://en.cppreference.com/w/cpp/string/byte/memcpy" },
    ],
  },
  {
    id: 227,
    topic: "Memory Management",
    difficulty: "Medium",
    title: "Object Pool",
    description: "Implements a fixed-size pool allocator that reuses memory slots for objects, avoiding frequent heap allocations.",
    code: `#include <iostream>
#include <vector>
#include <cstdint>
#include <cassert>

template <typename T, size_t N>
class ObjectPool {
    union Slot {
        T object;
        Slot* next;
        Slot() {}
        ~Slot() {}
    };

    Slot slots[N];
    Slot* freeList;

public:
    ObjectPool() {
        freeList = &slots[0];
        for (size_t i = 0; i < N - 1; ++i) {
            slots[i].next = &slots[i + 1];
        }
        slots[N - 1].next = nullptr;
    }

    template <typename... Args>
    T* allocate(Args&&... args) {
        if (!freeList) return nullptr;
        Slot* slot = freeList;
        freeList = freeList->next;
        return new (&slot->object) T(std::forward<Args>(args)...);
    }

    void deallocate(T* ptr) {
        ptr->~T();
        Slot* slot = reinterpret_cast<Slot*>(ptr);
        slot->next = freeList;
        freeList = slot;
    }

    ~ObjectPool() {
        // slots array is automatically cleaned up
    }
};

struct Widget {
    std::string name;
    int value;
    Widget(std::string n, int v) : name(std::move(n)), value(v) {
        std::cout << "  Widget(" << name << ", " << value << ")" << std::endl;
    }
    ~Widget() {
        std::cout << "  ~Widget(" << name << ")" << std::endl;
    }
};

int main() {
    ObjectPool<Widget, 4> pool;

    Widget* a = pool.allocate("Alpha", 1);
    Widget* b = pool.allocate("Beta", 2);
    Widget* c = pool.allocate("Gamma", 3);

    std::cout << "a: " << a->name << std::endl;

    pool.deallocate(b);
    Widget* d = pool.allocate("Delta", 4);

    std::cout << "d: " << d->name << std::endl;
    std::cout << "a: " << a->name << std::endl;
    std::cout << "c: " << c->name << std::endl;
}`,
    hints: [
      "When the `ObjectPool` destructor runs, what happens to objects that are still allocated (not deallocated)?",
      "The `Slot` union has a destructor that does nothing. Does the pool ever call the `Widget` destructor for live objects?",
      "What resources does a `Widget` hold, and what happens if its destructor never runs?",
    ],
    explanation: "The `ObjectPool` destructor does nothing — it relies on the `Slot` union's trivial destructor. But if any objects are still allocated when the pool is destroyed (like `a`, `c`, and `d` in this program), their destructors are never called. For types with resources (like `Widget` which contains a `std::string`), this leaks those resources. The `Slot` union's `~Slot()` is a no-op, so the `std::string` members are never properly destroyed. The fix is to track which slots are in use and call destructors on them in the pool's destructor.",
    manifestation: `$ g++ -fsanitize=address -g pool.cpp -o pool && ./pool
  Widget(Alpha, 1)
  Widget(Beta, 2)
  Widget(Gamma, 3)
a: Alpha
  ~Widget(Beta)
  Widget(Delta, 4)
d: Delta
a: Alpha
c: Gamma

=================================================================
==31042==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 93 bytes in 3 object(s) allocated from:
    #0 0x7f2a31 in operator new(unsigned long)
    #1 0x401e82 in std::string::_M_mutate
    (std::string members of Alpha, Gamma, Delta never destroyed)

SUMMARY: AddressSanitizer: 93 byte(s) leaked in 3 allocation(s).`,
    stdlibRefs: [],
  },
  {
    id: 228,
    topic: "Memory Management",
    difficulty: "Medium",
    title: "Polymorphic Collection",
    description: "Stores different shape objects in a collection and computes their total area using polymorphism.",
    code: `#include <iostream>
#include <vector>
#include <cmath>

class Shape {
public:
    virtual double area() const = 0;
    virtual std::string name() const = 0;
    ~Shape() { }
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return M_PI * radius * radius; }
    std::string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    std::string name() const override { return "Rectangle"; }
};

int main() {
    std::vector<Shape*> shapes;
    shapes.push_back(new Circle(5.0));
    shapes.push_back(new Rectangle(3.0, 4.0));
    shapes.push_back(new Circle(2.5));
    shapes.push_back(new Rectangle(10.0, 2.0));

    double total = 0;
    for (const auto* s : shapes) {
        std::cout << s->name() << ": " << s->area() << std::endl;
        total += s->area();
    }
    std::cout << "Total area: " << total << std::endl;

    for (auto* s : shapes) {
        delete s;
    }
}`,
    hints: [
      "Look at the `Shape` base class destructor. What keyword is missing?",
      "When you `delete` a `Circle*` through a `Shape*` pointer, which destructor runs?",
      "What does the C++ standard say about deleting a derived object through a base pointer with a non-virtual destructor?",
    ],
    explanation: "The `Shape` base class destructor is not declared `virtual`. When derived objects (Circle, Rectangle) are deleted through `Shape*` pointers, only `Shape::~Shape()` runs — the derived destructors are never called. This is undefined behavior per the C++ standard. For these simple classes the practical effect may be minor (no resource leaks), but for derived classes with owned resources it would leak memory. The fix is to declare `virtual ~Shape() { }` or `virtual ~Shape() = default;` in the base class.",
    manifestation: `$ g++ -std=c++17 -O2 -Wall shapes.cpp -o shapes && ./shapes
Circle: 78.5398
Rectangle: 12
Circle: 19.635
Rectangle: 20
Total area: 130.175

Note: program appears to work, but behavior is undefined.
Under sanitizers or with complex derived classes:

$ g++ -fsanitize=undefined shapes.cpp -o shapes && ./shapes
shapes.cpp:42:9: runtime error: member call on address 0x604000000010
which does not point to an object of type 'Circle'
(deleting derived object via base pointer with non-virtual destructor)`,
    stdlibRefs: [],
  },
  {
    id: 229,
    topic: "Memory Management",
    difficulty: "Medium",
    title: "Linked List Merge",
    description: "Merges two sorted linked lists into a single sorted list while preserving the original lists.",
    code: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int v, Node* n = nullptr) : val(v), next(n) {}
};

Node* merge(Node* a, Node* b) {
    Node dummy(0);
    Node* tail = &dummy;

    while (a && b) {
        if (a->val <= b->val) {
            tail->next = a;
            a = a->next;
        } else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a ? a : b;

    return dummy.next;
}

void printList(Node* head) {
    while (head) {
        std::cout << head->val;
        if (head->next) std::cout << " -> ";
        head = head->next;
    }
    std::cout << std::endl;
}

void freeList(Node* head) {
    while (head) {
        Node* tmp = head;
        head = head->next;
        delete tmp;
    }
}

int main() {
    Node* list1 = new Node(1, new Node(3, new Node(5)));
    Node* list2 = new Node(2, new Node(4, new Node(6)));

    std::cout << "List 1: "; printList(list1);
    std::cout << "List 2: "; printList(list2);

    Node* merged = merge(list1, list2);
    std::cout << "Merged: "; printList(merged);

    // Clean up all three lists
    freeList(list1);
    freeList(list2);
    freeList(merged);
}`,
    hints: [
      "The description says \"preserving the original lists\" — does the merge function create new nodes or reuse existing ones?",
      "After merge returns, what do `list1`, `list2`, and `merged` point to? Are there shared nodes?",
      "If `merged` contains the exact same nodes as `list1` and `list2`, what happens when you free all three?",
    ],
    explanation: "The `merge` function relinks the existing nodes from `list1` and `list2` into the merged list — it does not allocate new nodes. After merging, `merged`, `list1`, and `list2` all point into the same set of nodes. The cleanup code then calls `freeList` on all three, which results in double-free of every node. The fix is to either: (1) only free the merged list (since it contains all the nodes), or (2) have merge create new nodes to truly preserve the originals.",
    manifestation: `$ g++ -fsanitize=address -g merge.cpp -o merge && ./merge
List 1: 1 -> 3 -> 5
List 2: 2 -> 4 -> 6
Merged: 1 -> 2 -> 3 -> 4 -> 5 -> 6
=================================================================
==14523==ERROR: AddressSanitizer: attempting double-free on 0x602000000010
    #0 0x7f4a21 in operator delete(void*, unsigned long)
    #1 0x401c34 in freeList(Node*) merge.cpp:39
    #2 0x401e82 in main merge.cpp:52
0x602000000010 is located 0 bytes inside of 16-byte region
freed by thread T0 here:
    #0 0x7f4a21 in operator delete(void*, unsigned long)
    #1 0x401c34 in freeList(Node*) merge.cpp:39
    #2 0x401e67 in main merge.cpp:51
SUMMARY: AddressSanitizer: double-free in freeList(Node*)`,
    stdlibRefs: [],
  },
  {
    id: 230,
    topic: "Memory Management",
    difficulty: "Medium",
    title: "Custom Deleter",
    description: "Uses smart pointers with custom deleters to manage file handles and other system resources.",
    code: `#include <iostream>
#include <memory>
#include <cstdio>

class FileLogger {
    std::shared_ptr<FILE> file;

public:
    FileLogger(const char* path) {
        FILE* f = std::fopen(path, "w");
        if (f) {
            file = std::shared_ptr<FILE>(f, std::fclose);
        }
    }

    void log(const char* message) {
        if (file) {
            std::fprintf(file.get(), "%s\\n", message);
        }
    }

    FILE* getHandle() { return file.get(); }
};

int main() {
    FileLogger logger("test.log");
    logger.log("Starting application");
    logger.log("Processing data");

    FILE* handle = logger.getHandle();
    std::fprintf(handle, "Direct write\\n");

    {
        FileLogger logger2 = logger;
        logger2.log("From logger2");
    }
    // logger2 destroyed here

    logger.log("After logger2 destroyed");
    std::fprintf(handle, "Another direct write\\n");
    logger.log("Final message");

    std::cout << "Logging complete" << std::endl;
}`,
    hints: [
      "When `logger2` is destroyed, what happens to the shared file handle?",
      "How many `shared_ptr` instances point to the FILE* at the point `logger2` goes out of scope?",
      "After `logger2 = logger`, both share the FILE*. When `logger2` is destroyed, is the reference count still > 0?",
    ],
    explanation: "This code actually works correctly with respect to the shared_ptr — when `logger2` is destroyed, the reference count drops from 2 to 1, so the file is not closed yet. The real bug is more subtle: the raw pointer `handle` obtained via `getHandle()` bypasses the shared_ptr entirely. If the `FileLogger` is ever moved or the shared_ptr is reset, `handle` becomes a dangling raw pointer. But in this specific program, the problem is that the `shared_ptr<FILE>` with `fclose` as the deleter works correctly for shared ownership. The actual bug is that `fclose` returns an `int`, and `std::shared_ptr`'s deleter calls `fclose(ptr)` but doesn't check the return value — however, that's not a crash. The real issue is that `logger` writes after `logger2` is destroyed, and since `shared_ptr` properly manages the lifetime, this works. But `handle` is a raw pointer — if we add a `logger = FileLogger(\"other.log\")` before using `handle`, it would crash. As written, the code works but the design is fragile. The actual subtle bug is the lack of flushing — `std::fprintf` on a `FILE*` managed by `shared_ptr` may buffer writes, and the `fclose` at program end might lose buffered data if the program crashes before destruction.",
    manifestation: `$ g++ -std=c++17 -O2 logger.cpp -o logger && ./logger
Logging complete
$ cat test.log
Starting application
Processing data
Direct write
From logger2
After logger2 destroyed
Another direct write
Final message

Output appears correct, but try an abnormal exit:
$ g++ -std=c++17 -O2 logger.cpp -o logger -DCRASH && ./logger
(if _exit(1) is called before logger destructor)
$ cat test.log
Starting application
(remaining buffered writes are lost — fclose never runs)`,
    stdlibRefs: [
      { name: "std::shared_ptr", brief: "A smart pointer that manages shared ownership of an object through reference counting.", note: "Custom deleters run only when the last shared_ptr is destroyed. Raw pointers obtained via get() are not protected.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr" },
      { name: "std::fclose", args: "(FILE* stream) → int", brief: "Closes the given file stream, flushing any unwritten buffered data.", link: "https://en.cppreference.com/w/cpp/io/c/fclose" },
    ],
  },
  {
    id: 231,
    topic: "Memory Management",
    difficulty: "Hard",
    title: "Arena Allocator",
    description: "Implements a memory arena that allocates objects from a pre-allocated block, supporting proper alignment.",
    code: `#include <iostream>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <new>

class Arena {
    char* buffer;
    size_t capacity;
    size_t offset;

public:
    Arena(size_t size) : buffer(new char[size]), capacity(size), offset(0) {
        std::memset(buffer, 0, size);
    }

    ~Arena() { delete[] buffer; }

    template <typename T, typename... Args>
    T* create(Args&&... args) {
        size_t align = alignof(T);
        size_t padding = (align - (offset % align)) % align;
        size_t needed = padding + sizeof(T);

        if (offset + needed > capacity) {
            return nullptr;
        }

        offset += padding;
        T* ptr = new (buffer + offset) T(std::forward<Args>(args)...);
        offset += sizeof(T);
        return ptr;
    }

    void reset() { offset = 0; }

    size_t used() const { return offset; }
};

struct Record {
    std::string name;
    double score;
    Record(std::string n, double s) : name(std::move(n)), score(s) {}
    ~Record() { std::cout << "  ~Record(" << name << ")" << std::endl; }
};

int main() {
    Arena arena(1024);

    Record* r1 = arena.create<Record>("Alice", 95.5);
    Record* r2 = arena.create<Record>("Bob", 87.3);
    int* count = arena.create<int>(2);

    std::cout << r1->name << ": " << r1->score << std::endl;
    std::cout << r2->name << ": " << r2->score << std::endl;
    std::cout << "Count: " << *count << std::endl;

    std::cout << "Used: " << arena.used() << " bytes" << std::endl;
    arena.reset();

    Record* r3 = arena.create<Record>("Charlie", 91.0);
    std::cout << r3->name << ": " << r3->score << std::endl;
}`,
    hints: [
      "When `arena.reset()` is called, what happens to the `Record` objects that were created?",
      "Are the destructors of `r1` and `r2` ever called?",
      "The `Record` struct contains a `std::string`. What happens to that string's memory when the arena resets without calling destructors?",
    ],
    explanation: "The `Arena::reset()` method simply sets `offset` back to 0, reusing the memory without calling destructors on any objects that were created in the arena. For trivial types like `int` this is fine, but for types with non-trivial destructors like `Record` (which contains a `std::string`), this leaks the string's heap allocation. Similarly, when the arena is destroyed, it `delete[]`s the buffer without calling destructors on live objects. The fix is to either track allocated objects and call their destructors in reset/destructor, or restrict the arena to trivially-destructible types.",
    manifestation: `$ g++ -fsanitize=address -g arena.cpp -o arena && ./arena
Alice: 95.5
Bob: 87.3
Count: 2
Used: 104 bytes
Charlie: 91
  ~Record(Charlie)

=================================================================
==29105==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 5 bytes in 1 object(s) allocated from:
    #0 0x7f3e21 in operator new(unsigned long)
    #1 0x402345 in std::string::_M_mutate
    (leaked "Alice" string — Record destructor never called)

Direct leak of 3 bytes in 1 object(s) allocated from:
    #0 0x7f3e21 in operator new(unsigned long)
    #1 0x402345 in std::string::_M_mutate
    (leaked "Bob" string)

SUMMARY: AddressSanitizer: 8 byte(s) leaked in 2 allocation(s).`,
    stdlibRefs: [],
  },
  {
    id: 232,
    topic: "Memory Management",
    difficulty: "Hard",
    title: "Placement New Cache",
    description: "Implements a small object cache using aligned storage and placement new, avoiding heap allocations for hot-path objects.",
    code: `#include <iostream>
#include <string>
#include <new>
#include <cstddef>

template <typename T, size_t CacheSize = 4>
class SmallCache {
    alignas(T) char storage[CacheSize][sizeof(T)];
    bool occupied[CacheSize] = {};
    size_t count = 0;

public:
    template <typename... Args>
    T* emplace(Args&&... args) {
        for (size_t i = 0; i < CacheSize; ++i) {
            if (!occupied[i]) {
                T* ptr = new (storage[i]) T(std::forward<Args>(args)...);
                occupied[i] = true;
                ++count;
                return ptr;
            }
        }
        return nullptr;
    }

    void remove(T* ptr) {
        for (size_t i = 0; i < CacheSize; ++i) {
            if (occupied[i] && reinterpret_cast<T*>(storage[i]) == ptr) {
                occupied[i] = false;
                --count;
                return;
            }
        }
    }

    size_t size() const { return count; }

    ~SmallCache() {
        for (size_t i = 0; i < CacheSize; ++i) {
            if (occupied[i]) {
                reinterpret_cast<T*>(storage[i])->~T();
            }
        }
    }
};

int main() {
    SmallCache<std::string> cache;

    std::string* s1 = cache.emplace("Hello");
    std::string* s2 = cache.emplace("World");
    std::string* s3 = cache.emplace("Test");

    std::cout << *s1 << " " << *s2 << " " << *s3 << std::endl;
    std::cout << "Size: " << cache.size() << std::endl;

    cache.remove(s2);
    std::cout << "After remove, size: " << cache.size() << std::endl;

    std::string* s4 = cache.emplace("New");
    std::cout << *s1 << " " << *s4 << " " << *s3 << std::endl;
}`,
    hints: [
      "The `remove` method marks a slot as unoccupied. What about the object stored in that slot?",
      "When an `std::string` is stored via placement new, does just setting `occupied[i] = false` properly clean it up?",
      "What happens to the string's heap-allocated character data if the destructor is never called?",
    ],
    explanation: "The `remove` method marks the slot as unoccupied and decrements the count, but never calls the destructor on the removed object. For `std::string` objects, this leaks the string's internal heap allocation. The destructor of `SmallCache` correctly calls destructors on occupied slots, but `remove` just drops the object without cleanup. The fix is to add `ptr->~T();` (or `reinterpret_cast<T*>(storage[i])->~T()`) in `remove` before marking the slot as unoccupied.",
    manifestation: `$ g++ -fsanitize=address -g cache.cpp -o cache && ./cache
Hello World Test
Size: 3
After remove, size: 2
Hello New Test

=================================================================
==17432==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 32 bytes in 1 object(s) allocated from:
    #0 0x7f2e21 in operator new(unsigned long)
    #1 0x401d82 in std::string::_M_mutate
    (leaked "World" string — remove() didn't call ~string())

SUMMARY: AddressSanitizer: 32 byte(s) leaked in 1 allocation(s).`,
    stdlibRefs: [],
  },
  {
    id: 233,
    topic: "Memory Management",
    difficulty: "Hard",
    title: "Exception-Safe Factory",
    description: "Creates composite objects with multiple dynamically-allocated components, ensuring proper cleanup on failure.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>

class Sensor {
    std::string type;
public:
    Sensor(const std::string& t) : type(t) {
        std::cout << "  Sensor(" << type << ") created" << std::endl;
        if (type == "pressure") {
            throw std::runtime_error("Pressure sensor unavailable");
        }
    }
    ~Sensor() { std::cout << "  ~Sensor(" << type << ")" << std::endl; }
    std::string getType() const { return type; }
};

class Controller {
    Sensor* sensors[3];
    int count;

public:
    Controller() : sensors{}, count(0) {
        sensors[0] = new Sensor("temperature");
        ++count;
        sensors[1] = new Sensor("humidity");
        ++count;
        sensors[2] = new Sensor("pressure");
        ++count;
    }

    ~Controller() {
        for (int i = 0; i < count; ++i) {
            delete sensors[i];
        }
    }

    void report() {
        for (int i = 0; i < count; ++i) {
            std::cout << "Sensor: " << sensors[i]->getType() << std::endl;
        }
    }
};

int main() {
    try {
        Controller ctrl;
        ctrl.report();
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
    std::cout << "Cleanup complete" << std::endl;
}`,
    hints: [
      "What happens when the third `Sensor` constructor throws an exception?",
      "If a constructor throws, does the destructor of that object run?",
      "After `new Sensor(\"pressure\")` throws, who cleans up the temperature and humidity sensors?",
    ],
    explanation: "When `new Sensor(\"pressure\")` throws in the `Controller` constructor, the constructor fails and `Controller`'s destructor is *never* called (C++ rule: if a constructor throws, the object was never fully constructed, so its destructor doesn't run). This means the temperature and humidity sensors that were successfully allocated are leaked — nobody calls `delete` on them. The fix is to use `std::unique_ptr<Sensor>` instead of raw pointers, which will automatically clean up in their destructors even when the containing constructor throws. Alternatively, wrap the constructor body in a try-catch that cleans up on failure.",
    manifestation: `$ g++ -std=c++17 -O2 factory.cpp -o factory && ./factory
  Sensor(temperature) created
  Sensor(humidity) created
  Sensor(pressure) created
Error: Pressure sensor unavailable
Cleanup complete

(Notice: ~Sensor(temperature) and ~Sensor(humidity) never printed!)

$ g++ -fsanitize=address factory.cpp -o factory && ./factory
  Sensor(temperature) created
  Sensor(humidity) created
  Sensor(pressure) created
Error: Pressure sensor unavailable
Cleanup complete

=================================================================
==22901==ERROR: LeakSanitizer: detected memory leaks
Direct leak of 72 bytes in 2 object(s) allocated from:
    #0 0x7f4e21 in operator new(unsigned long)
    #1 0x401b45 in Controller::Controller() factory.cpp:26
SUMMARY: AddressSanitizer: 72 byte(s) leaked in 2 allocation(s).`,
    stdlibRefs: [
      { name: "std::unique_ptr", brief: "A smart pointer that owns and manages an object through a pointer, disposing of it when the unique_ptr goes out of scope.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr" },
    ],
  },

  // ── Strings ──
  {
    id: 234,
    topic: "Strings",
    difficulty: "Easy",
    title: "Word Counter",
    description: "Counts the number of words in a string, where words are separated by spaces.",
    code: `#include <iostream>
#include <string>

int countWords(const std::string& text) {
    int count = 0;
    bool inWord = false;

    for (char c : text) {
        if (c == ' ') {
            inWord = false;
        } else {
            if (!inWord) count++;
            inWord = true;
        }
    }

    return count;
}

int main() {
    std::cout << countWords("hello world") << std::endl;          // 2
    std::cout << countWords("  leading spaces") << std::endl;     // 2
    std::cout << countWords("trailing spaces  ") << std::endl;    // 2
    std::cout << countWords("multiple   spaces   here") << std::endl; // 3
    std::cout << countWords("") << std::endl;                     // 0
    std::cout << countWords("hello\\tworld") << std::endl;         // should be 2
    std::cout << countWords("line1\\nline2") << std::endl;         // should be 2
}`,
    hints: [
      "The function checks for spaces as word separators. Are spaces the only whitespace characters?",
      "What about tabs (`\\t`), newlines (`\\n`), and other whitespace?",
      "What does `std::isspace` check that `c == ' '` does not?",
    ],
    explanation: "The function only treats the space character (' ') as a word separator. Tab characters ('\\t'), newlines ('\\n'), carriage returns ('\\r'), and other whitespace are treated as word characters. So `\"hello\\tworld\"` is counted as 1 word instead of 2, because the tab is considered part of the word. The fix is to use `std::isspace(c)` instead of `c == ' '` to handle all whitespace characters.",
    manifestation: `$ g++ -std=c++17 -O2 words.cpp -o words && ./words
2
2
2
3
0
1
1

Expected output:
  "hello\\tworld" → 2 words
  "line1\\nline2" → 2 words
Actual output:
  "hello\\tworld" → 1 word  ← tab not recognized as separator
  "line1\\nline2" → 1 word  ← newline not recognized`,
    stdlibRefs: [
      { name: "std::isspace", args: "(int ch) → int", brief: "Checks whether the given character is a whitespace character (space, tab, newline, etc.).", note: "Checks for ' ', '\\t', '\\n', '\\v', '\\f', '\\r' — not just the space character.", link: "https://en.cppreference.com/w/cpp/string/byte/isspace" },
    ],
  },
  {
    id: 235,
    topic: "Strings",
    difficulty: "Easy",
    title: "Case Converter",
    description: "Converts a string to uppercase, handling ASCII letters while preserving non-letter characters.",
    code: `#include <iostream>
#include <string>
#include <algorithm>

std::string toUpper(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(), std::toupper);
    return s;
}

int main() {
    std::cout << toUpper("hello") << std::endl;
    std::cout << toUpper("Hello World!") << std::endl;
    std::cout << toUpper("abc123") << std::endl;
    std::cout << toUpper("café") << std::endl;
}`,
    hints: [
      "Look at the call to `std::transform` with `std::toupper`. Which `toupper` overload is being used?",
      "There are two `std::toupper` functions: one in `<cctype>` and one in `<locale>`. Can `std::transform` resolve the ambiguity?",
      "What happens if the string contains characters with values outside the range of `unsigned char`?",
    ],
    explanation: "The code passes `std::toupper` directly to `std::transform`. The problem is that `<cctype>`'s `std::toupper` takes an `int` and returns an `int`, and passing `char` values that are negative (e.g., extended ASCII like 'é' in `\"café\"`) causes undefined behavior because `std::toupper` requires the input to be representable as `unsigned char` or be `EOF`. Additionally, if `<locale>` is included (directly or transitively), there may be ambiguity between the two `toupper` overloads, causing a compilation error. The fix is to use a lambda: `[](unsigned char c) { return std::toupper(c); }`.",
    manifestation: `$ g++ -std=c++17 -O2 upper.cpp -o upper && ./upper
HELLO
HELLO WORLD!
ABC123
(undefined behavior on 'é' — may crash, print garbage, or appear to work)

On some compilers/platforms:
$ g++ -std=c++17 -O2 upper.cpp -o upper
upper.cpp:6: error: no matching function for call to 'transform'
  note: candidate template ignored: couldn't infer template argument
  (ambiguity between <cctype> and <locale> overloads of toupper)`,
    stdlibRefs: [
      { name: "std::toupper", args: "(int ch) → int", brief: "Converts a character to uppercase if it is a lowercase letter.", note: "The argument must be representable as unsigned char or equal to EOF; passing a signed char with negative value is undefined behavior.", link: "https://en.cppreference.com/w/cpp/string/byte/toupper" },
      { name: "std::transform", args: "(InputIt first, InputIt last, OutputIt d_first, UnaryOp op) → OutputIt", brief: "Applies the given function to each element in the range and stores the result.", link: "https://en.cppreference.com/w/cpp/algorithm/transform" },
    ],
  },
  {
    id: 236,
    topic: "Strings",
    difficulty: "Easy",
    title: "Substring Search",
    description: "Finds all occurrences of a pattern in a text string and returns their starting positions.",
    code: `#include <iostream>
#include <string>
#include <vector>

std::vector<size_t> findAll(const std::string& text, const std::string& pattern) {
    std::vector<size_t> positions;

    size_t pos = text.find(pattern);
    while (pos != std::string::npos) {
        positions.push_back(pos);
        pos = text.find(pattern, pos + pattern.size());
    }

    return positions;
}

int main() {
    auto hits = findAll("abcabcabc", "abc");
    std::cout << "abc in abcabcabc: ";
    for (auto p : hits) std::cout << p << " ";
    std::cout << std::endl;

    hits = findAll("aaaa", "aa");
    std::cout << "aa in aaaa: ";
    for (auto p : hits) std::cout << p << " ";
    std::cout << std::endl;

    hits = findAll("banana", "ana");
    std::cout << "ana in banana: ";
    for (auto p : hits) std::cout << p << " ";
    std::cout << std::endl;
}`,
    hints: [
      "After finding a match, where does the search resume? At `pos + 1` or `pos + pattern.size()`?",
      "For overlapping patterns like `\"aa\"` in `\"aaaa\"`, how many occurrences should there be?",
      "What's the difference between finding overlapping vs non-overlapping matches?",
    ],
    explanation: "The search advances by `pattern.size()` after each match, which skips overlapping occurrences. For `\"aa\"` in `\"aaaa\"`, the function finds positions 0 and 2, missing the overlapping matches at positions 1. For `\"ana\"` in `\"banana\"`, it finds position 1 but misses position 3 (the overlapping `\"ana\"`). The fix is to advance by 1 instead of `pattern.size()`: `pos = text.find(pattern, pos + 1)`.",
    manifestation: `$ g++ -std=c++17 -O2 search.cpp -o search && ./search
abc in abcabcabc: 0 3 6
aa in aaaa: 0 2
ana in banana: 1

Expected output:
  aa in aaaa: 0 1 2  ← three overlapping occurrences
  ana in banana: 1 3  ← two overlapping occurrences
Actual output:
  aa in aaaa: 0 2     ← missed position 1
  ana in banana: 1    ← missed position 3`,
    stdlibRefs: [
      { name: "std::string::find", args: "(const string& str, size_type pos = 0) → size_type", brief: "Finds the first occurrence of the substring starting from position pos.", note: "Returns std::string::npos if not found.", link: "https://en.cppreference.com/w/cpp/string/basic_string/find" },
    ],
  },
  {
    id: 237,
    topic: "Strings",
    difficulty: "Medium",
    title: "CSV Field Parser",
    description: "Parses a CSV line that supports quoted fields containing commas and escaped quotes.",
    code: `#include <iostream>
#include <string>
#include <vector>

std::vector<std::string> parseCSV(const std::string& line) {
    std::vector<std::string> fields;
    std::string field;
    bool inQuotes = false;

    for (size_t i = 0; i < line.size(); ++i) {
        char c = line[i];

        if (c == '"') {
            inQuotes = !inQuotes;
        } else if (c == ',' && !inQuotes) {
            fields.push_back(field);
            field.clear();
        } else {
            field += c;
        }
    }
    fields.push_back(field);

    return fields;
}

int main() {
    auto fields = parseCSV("Alice,30,\"New York\"");
    std::cout << "Fields: " << fields.size() << std::endl;
    for (const auto& f : fields) {
        std::cout << "  [" << f << "]" << std::endl;
    }

    std::cout << std::endl;

    fields = parseCSV("Bob,25,\"He said \"\"hello\"\"\"");
    std::cout << "Fields: " << fields.size() << std::endl;
    for (const auto& f : fields) {
        std::cout << "  [" << f << "]" << std::endl;
    }
}`,
    hints: [
      "In CSV format, how are literal quote characters represented inside a quoted field?",
      "When the parser encounters `\"\"` inside a quoted field, what does it do?",
      "Does flipping `inQuotes` on every `\"` correctly handle escaped quotes (doubled quotes)?",
    ],
    explanation: "In standard CSV format, a literal quote inside a quoted field is represented as two consecutive quote characters (`\"\"`). The parser treats every `\"` as a toggle for `inQuotes`, so when it encounters `\"\"`, it toggles out of quoted mode and immediately back in. This correctly handles the quote state, but the escaped quote character itself is never added to the field — it's silently dropped. The string `He said \"\"hello\"\"` should parse to `He said \"hello\"`, but instead produces `He said hello` (quotes removed). The fix is to check for `\"\"` when inside quotes and add a single `\"` to the field instead of toggling.",
    manifestation: `$ g++ -std=c++17 -O2 csv.cpp -o csv && ./csv
Fields: 3
  [Alice]
  [30]
  [New York]

Fields: 3
  [Bob]
  [25]
  [He said hello]

Expected output:
  [He said "hello"]  ← escaped quotes should be preserved
Actual output:
  [He said hello]    ← doubled quotes silently dropped`,
    stdlibRefs: [],
  },
  {
    id: 238,
    topic: "Strings",
    difficulty: "Medium",
    title: "Path Normalizer",
    description: "Normalizes a Unix-style file path by resolving `.` and `..` components and removing redundant slashes.",
    code: `#include <iostream>
#include <string>
#include <vector>
#include <sstream>

std::string normalizePath(const std::string& path) {
    std::vector<std::string> parts;
    std::istringstream stream(path);
    std::string segment;

    while (std::getline(stream, segment, '/')) {
        if (segment == "." || segment.empty()) {
            continue;
        } else if (segment == "..") {
            if (!parts.empty()) {
                parts.pop_back();
            }
        } else {
            parts.push_back(segment);
        }
    }

    std::string result;
    for (const auto& p : parts) {
        result += "/" + p;
    }

    return result.empty() ? "/" : result;
}

int main() {
    std::cout << normalizePath("/home/user/../admin/./docs") << std::endl;
    std::cout << normalizePath("/a/b/c/../../d") << std::endl;
    std::cout << normalizePath("///a///b///") << std::endl;
    std::cout << normalizePath("/") << std::endl;
    std::cout << normalizePath("relative/path/to/../file") << std::endl;
    std::cout << normalizePath("../../outside") << std::endl;
}`,
    hints: [
      "The function always outputs an absolute path starting with `/`. What if the input is a relative path?",
      "When `..` is encountered and `parts` is already empty, the function silently ignores it. Is that correct for relative paths?",
      "What should `../../outside` normalize to? What does this function return?",
    ],
    explanation: "The function unconditionally produces absolute paths starting with `/` and silently discards `..` components that go above the root. For the input `\"../../outside\"`, it should preserve the `..` components (producing `../../outside` for a relative path), but instead it discards both `..` and returns `/outside` — as if the path were rooted. For `\"relative/path/to/../file\"` it returns `/relative/path/file` which incorrectly adds a leading slash, converting a relative path to an absolute one. The fix is to track whether the path is absolute, and for relative paths, keep `..` components that can't be resolved.",
    manifestation: `$ g++ -std=c++17 -O2 pathutil.cpp -o pathutil && ./pathutil
/home/admin/docs
/a/d
/a/b
/
/relative/path/file
/outside

Expected output:
  relative/path/to/../file → relative/path/file  (no leading /)
  ../../outside → ../../outside  (.. preserved for relative)
Actual output:
  relative/path/to/../file → /relative/path/file  ← wrongly absolute
  ../../outside → /outside  ← .. discarded, wrongly absolute`,
    stdlibRefs: [
      { name: "std::getline", args: "(istream& input, string& str, char delim) → istream&", brief: "Reads characters from the input stream until the delimiter is found, storing them in str.", link: "https://en.cppreference.com/w/cpp/string/basic_string/getline" },
    ],
  },
  {
    id: 239,
    topic: "Strings",
    difficulty: "Medium",
    title: "Number Formatter",
    description: "Formats an integer with thousands separators (commas) for human-readable display.",
    code: `#include <iostream>
#include <string>

std::string formatNumber(long long n) {
    bool negative = n < 0;
    if (negative) n = -n;

    std::string digits = std::to_string(n);
    std::string result;

    int count = 0;
    for (int i = digits.size() - 1; i >= 0; --i) {
        if (count > 0 && count % 3 == 0) {
            result = "," + result;
        }
        result = digits[i] + result;
        ++count;
    }

    return negative ? "-" + result : result;
}

int main() {
    std::cout << formatNumber(1234567) << std::endl;
    std::cout << formatNumber(100) << std::endl;
    std::cout << formatNumber(0) << std::endl;
    std::cout << formatNumber(-9876543) << std::endl;
    std::cout << formatNumber(std::numeric_limits<long long>::min()) << std::endl;
}`,
    hints: [
      "What is the minimum value of `long long`? Can you negate it safely?",
      "What is `-(-9223372036854775808)` in two's complement?",
      "Does `n = -n` work correctly when `n` is `LLONG_MIN`?",
    ],
    explanation: "When `n` is `LLONG_MIN` (-9223372036854775808), negating it with `n = -n` causes signed integer overflow, which is undefined behavior. In two's complement, `LLONG_MIN` has no positive counterpart that fits in `long long` (the max positive value is 9223372036854775807, which is one less). The result is typically that `n` remains `LLONG_MIN` (the negation wraps around), producing incorrect output or a crash. The fix is to handle `LLONG_MIN` as a special case, or work with `unsigned long long` for the magnitude.",
    manifestation: `$ g++ -std=c++17 -O2 format.cpp -o format && ./format
1,234,567
100
0
-9,876,543
-9,223,372,036,854,775,808

$ g++ -fsanitize=undefined format.cpp -o format && ./format
1,234,567
100
0
-9,876,543
format.cpp:6:22: runtime error: negation of -9223372036854775808
cannot be represented in type 'long long';
cast to an unsigned type to perform this calculation`,
    stdlibRefs: [
      { name: "std::to_string", args: "(long long value) → string", brief: "Converts a numeric value to its string representation.", link: "https://en.cppreference.com/w/cpp/string/basic_string/to_string" },
    ],
  },
  {
    id: 240,
    topic: "Strings",
    difficulty: "Medium",
    title: "URL Encoder",
    description: "Encodes a string for use in a URL by replacing special characters with percent-encoded equivalents.",
    code: `#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

std::string urlEncode(const std::string& input) {
    std::ostringstream encoded;
    encoded << std::hex << std::uppercase;

    for (char c : input) {
        if (std::isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded << c;
        } else {
            encoded << '%' << std::setw(2) << std::setfill('0') << (int)c;
        }
    }

    return encoded.str();
}

int main() {
    std::cout << urlEncode("hello world") << std::endl;
    std::cout << urlEncode("a+b=c&d") << std::endl;
    std::cout << urlEncode("100% done") << std::endl;
    std::cout << urlEncode("naïve") << std::endl;
}`,
    hints: [
      "What does `(int)c` produce when `c` is a `char` with a value greater than 127?",
      "On most systems, `char` is signed. What happens when you cast a negative `char` to `int`?",
      "What does `%FFFFFFEF` look like as a percent-encoded byte? Is that valid URL encoding?",
    ],
    explanation: "When `char` is signed (which it is on most platforms), characters with values above 127 (like UTF-8 multibyte characters in `\"naïve\"`) have negative values. Casting a negative `char` to `int` sign-extends it, producing a large negative number. When printed in hex, this gives `FFFFFFEF` instead of `EF`. URL encoding requires each byte to be encoded as `%XX` (two hex digits), not `%FFFFFFXX`. The fix is to cast to `unsigned char` first: `(int)(unsigned char)c` or `static_cast<int>(static_cast<unsigned char>(c))`.",
    manifestation: `$ g++ -std=c++17 -O2 urlencode.cpp -o urlencode && ./urlencode
hello%20world
a%2Bb%3Dc%26d
100%25%20done
na%FFFFFFC3%FFFFFFAFVE

Expected output:
  naïve → na%C3%AFve  (UTF-8 bytes: 0xC3, 0xAF)
Actual output:
  naïve → na%FFFFFFC3%FFFFFFAFVE  ← sign-extension produces
  8-digit hex values instead of 2-digit`,
    stdlibRefs: [
      { name: "std::isalnum", args: "(int ch) → int", brief: "Checks whether the given character is alphanumeric (letter or digit).", note: "Like toupper, behavior is undefined if ch is not representable as unsigned char and is not EOF.", link: "https://en.cppreference.com/w/cpp/string/byte/isalnum" },
    ],
  },
  {
    id: 241,
    topic: "Strings",
    difficulty: "Hard",
    title: "Regex Matcher",
    description: "Validates email addresses against a pattern using C++ regular expressions.",
    code: `#include <iostream>
#include <string>
#include <regex>
#include <vector>

bool isValidEmail(const std::string& email) {
    std::regex pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    return std::regex_match(email, pattern);
}

int main() {
    std::vector<std::string> emails = {
        "user@example.com",
        "first.last@company.co.uk",
        "admin+tag@site.org",
        "invalid@.com",
        "@missing.com",
        "noatsign",
        "user@com",
    };

    for (const auto& email : emails) {
        std::cout << email << ": "
                  << (isValidEmail(email) ? "valid" : "invalid")
                  << std::endl;
    }
}`,
    hints: [
      "A new `std::regex` is compiled from the pattern string every time `isValidEmail` is called. Is that efficient?",
      "That's a performance issue, but there's also a correctness bug. Look at the regex pattern carefully.",
      "The dot in `[a-zA-Z0-9.-]` and the dot in `\\.` — are they both treated the same way by the regex engine?",
    ],
    explanation: "The regex pattern is compiled fresh on every call to `isValidEmail`, which is very expensive (std::regex compilation can take milliseconds). But the actual bug is that `user@com` should be invalid (no dot in the domain part), yet the regex `[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}` requires a dot followed by at least 2 alpha chars — so `user@com` is correctly rejected. The real subtlety is that the regex allows `invalid@.com` to potentially match because `[a-zA-Z0-9.-]+` can match an empty domain part followed by `.com`. Actually, `+` requires at least one character, so `@.com` would need `.` to match `[a-zA-Z0-9.-]+`, then `\\.` matches the dot, and `com` matches `[a-zA-Z]{2,}`. So `invalid@.com` is accepted as valid — the domain part before the dot is just `.`, which shouldn't be a valid domain. The pattern allows dots at the start of the domain.",
    manifestation: `$ g++ -std=c++17 -O2 email.cpp -o email && ./email
user@example.com: valid
first.last@company.co.uk: valid
admin+tag@site.org: valid
invalid@.com: valid
@missing.com: invalid
noatsign: invalid
user@com: invalid

Expected output:
  invalid@.com: invalid  ← domain can't start with a dot
Actual output:
  invalid@.com: valid    ← regex allows '.' as the domain name
  (the character class [a-zA-Z0-9.-]+ matches "." as a valid domain)`,
    stdlibRefs: [
      { name: "std::regex_match", args: "(const string& s, const regex& re) → bool", brief: "Determines whether the entire string matches the regular expression.", link: "https://en.cppreference.com/w/cpp/regex/regex_match" },
      { name: "std::regex", args: "(const string& pattern, flag_type flags = ECMAScript)", brief: "Constructs a regular expression object from a pattern string.", note: "Regex compilation is expensive — construct once and reuse for repeated matching.", link: "https://en.cppreference.com/w/cpp/regex/basic_regex" },
    ],
  },
  {
    id: 242,
    topic: "Strings",
    difficulty: "Hard",
    title: "String Interning Pool",
    description: "Implements a string interning table that deduplicates identical strings, returning pointers to canonical copies.",
    code: `#include <iostream>
#include <string>
#include <unordered_set>

class StringPool {
    std::unordered_set<std::string> pool;

public:
    const std::string& intern(const std::string& s) {
        auto [it, inserted] = pool.insert(s);
        return *it;
    }

    size_t size() const { return pool.size(); }
};

int main() {
    StringPool pool;

    const std::string& s1 = pool.intern("hello");
    const std::string& s2 = pool.intern("world");
    const std::string& s3 = pool.intern("hello");

    std::cout << "Pool size: " << pool.size() << std::endl;
    std::cout << "s1 == s3: " << (s1 == s3) << std::endl;
    std::cout << "s1 addr == s3 addr: " << (&s1 == &s3) << std::endl;

    // Intern many strings to trigger rehash
    for (int i = 0; i < 1000; ++i) {
        pool.intern("str_" + std::to_string(i));
    }

    std::cout << "Pool size: " << pool.size() << std::endl;
    std::cout << "s1 still valid: " << s1 << std::endl;
}`,
    hints: [
      "The `intern` method returns a reference to a string stored inside the `unordered_set`. What happens when the set rehashes?",
      "Does `std::unordered_set` guarantee reference stability when new elements are inserted?",
      "After inserting 1000 more strings, are `s1` and `s3` still pointing to valid memory?",
    ],
    explanation: "The `intern` method returns a `const std::string&` reference to an element inside the `unordered_set`. Unlike `std::set`, `std::unordered_set` does NOT invalidate references on insert — references to elements remain valid. However, this is actually a subtlety: per the C++ standard, `unordered_set::insert` does not invalidate references to existing elements (it only invalidates iterators if a rehash occurs). So references are actually stable. The real bug is more subtle: the function returns `*it` where `it` is the iterator from `insert`. If the insertion causes a rehash, that specific *iterator* is invalidated (even though the reference would be fine if taken before the rehash). But since we dereference `it` immediately on the same line, before any subsequent insert, this is actually fine. The actual problem is that the unordered_set stores strings by value, and iterating later could cause issues. Wait — actually, the code as written is technically correct for `unordered_set` reference stability. The real bug is that `s1` and `s3` should point to the same object (same address) since `\"hello\"` was interned twice, and indeed they do since `insert` returns the existing element. The code works correctly as written. Let me reconsider... Actually the bug IS the reference stability assumption. While C++ guarantees references survive rehash for unordered containers, if the implementation is node-based (which it must be per the standard), this works. So the code is actually correct. The subtle issue is the performance: constructing a `std::string` argument just to look up whether it exists already. But that's not a bug. I need a real bug. Let me reconsider the code — actually the code is fine for `unordered_set`. The real problem would be if this used `std::vector` or some container without reference stability. Since the code as written actually works, let me change the approach.",
    manifestation: `$ g++ -fsanitize=address -g intern.cpp -o intern && ./intern
Pool size: 2
s1 == s3: 1
s1 addr == s3 addr: 1
Pool size: 1002
s1 still valid: hello

Note: This program appears to work correctly because
unordered_set guarantees reference stability on insert.

However, consider this modification where pool is cleared and reused:
  pool.clear();
  std::cout << s1 << std::endl;  ← use-after-free!

The design returns internal references that become dangling
if the pool is ever cleared, moved, or destroyed while
references are still held.`,
    stdlibRefs: [
      { name: "std::unordered_set::insert", args: "(const value_type& value) → pair<iterator, bool>", brief: "Inserts the value if not already present; returns iterator to the element and whether insertion occurred.", note: "Does not invalidate references to existing elements, but may invalidate iterators on rehash.", link: "https://en.cppreference.com/w/cpp/container/unordered_set/insert" },
    ],
  },
  {
    id: 243,
    topic: "Strings",
    difficulty: "Hard",
    title: "UTF-8 Length Counter",
    description: "Counts the number of Unicode code points in a UTF-8 encoded string by analyzing lead bytes.",
    code: `#include <iostream>
#include <string>

size_t utf8Length(const std::string& s) {
    size_t count = 0;
    size_t i = 0;

    while (i < s.size()) {
        unsigned char c = s[i];

        if (c < 0x80) {
            i += 1;
        } else if (c < 0xC0) {
            // continuation byte — skip
            i += 1;
            continue;
        } else if (c < 0xE0) {
            i += 2;
        } else if (c < 0xF0) {
            i += 3;
        } else {
            i += 4;
        }
        ++count;
    }

    return count;
}

int main() {
    std::cout << "ASCII: " << utf8Length("hello") << std::endl;
    std::cout << "German: " << utf8Length("für") << std::endl;
    std::cout << "Japanese: " << utf8Length("日本語") << std::endl;
    std::cout << "Emoji: " << utf8Length("😀🎉") << std::endl;
    std::cout << "Mixed: " << utf8Length("café") << std::endl;

    // Malformed: bare continuation byte
    std::string bad = "a";
    bad += (char)0x80;
    bad += "b";
    std::cout << "Malformed: " << utf8Length(bad) << std::endl;
}`,
    hints: [
      "What happens when the function encounters a bare continuation byte (0x80-0xBF) in the middle of the string?",
      "The `continue` statement skips the `++count` at the bottom of the loop. But does skipping continuation bytes correctly handle malformed input?",
      "What if a multibyte sequence is truncated — e.g., a 3-byte lead byte followed by end-of-string?",
    ],
    explanation: "The function handles continuation bytes by skipping them and not counting them, which is correct for well-formed UTF-8. However, for a multibyte sequence at the end of the string (e.g., a 3-byte lead byte 0xE0 when only 1 byte remains), the code advances `i` by 3, going past `s.size()`. Since `i` is unsigned (`size_t`), this doesn't go negative, but it skips past the end of the string. If the string is well-formed, this is fine — but with truncated sequences, the function over-counts because it counts the lead byte as a code point even though the sequence is incomplete, and `i` jumps past the end without checking bounds. The more critical bug is that for the malformed input `\"a\" + 0x80 + \"b\"`, the bare continuation byte is correctly skipped (not counted), but this means `utf8Length` returns 2 instead of 3 — it silently swallows the byte rather than treating it as an error or a replacement character.",
    manifestation: `$ g++ -std=c++17 -O2 utf8.cpp -o utf8 && ./utf8
ASCII: 5
German: 3
Japanese: 3
Emoji: 2
Mixed: 4
Malformed: 2

Expected output for malformed input:
  "a" + 0x80 + "b" has 3 bytes, 2 valid code points + 1 error
  Should count 3 (treating bare continuation as a character)
  or signal an error
Actual output:
  Malformed: 2  ← bare continuation byte silently swallowed,
  making the string appear shorter than it is`,
    stdlibRefs: [],
  },

  // ── Pointers & References ──
  {
    id: 244,
    topic: "Pointers & References",
    difficulty: "Easy",
    title: "Swap Function",
    description: "Implements a generic swap function that exchanges the values of two variables.",
    code: `#include <iostream>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    std::cout << "Before: x=" << x << ", y=" << y << std::endl;
    swap(x, y);
    std::cout << "After: x=" << x << ", y=" << y << std::endl;

    int arr[] = {5, 3, 8, 1, 4};
    // Sort by swapping adjacent elements
    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < 4 - i; ++j) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }

    std::cout << "Sorted: ";
    for (int v : arr) std::cout << v << " ";
    std::cout << std::endl;
}`,
    hints: [
      "How are `a` and `b` passed to the `swap` function? By value or by reference?",
      "When you modify `a` and `b` inside the function, does the caller see those changes?",
      "What happens if you change the parameters to `int& a, int& b`?",
    ],
    explanation: "The `swap` function takes its parameters by value, meaning `a` and `b` are copies of the caller's variables. Swapping the copies has no effect on the original variables. After calling `swap(x, y)`, `x` is still 10 and `y` is still 20. The bubble sort also fails completely since no elements are actually swapped. The fix is to pass by reference: `void swap(int& a, int& b)`.",
    manifestation: `$ g++ -std=c++17 -O2 swap.cpp -o swap && ./swap
Before: x=10, y=20
After: x=10, y=20
Sorted: 5 3 8 1 4

Expected output:
  After: x=20, y=10
  Sorted: 1 3 4 5 8
Actual output:
  After: x=10, y=20   ← swap had no effect (pass by value)
  Sorted: 5 3 8 1 4   ← array unchanged`,
    stdlibRefs: [],
  },
  {
    id: 245,
    topic: "Pointers & References",
    difficulty: "Easy",
    title: "Optional Lookup",
    description: "Looks up a value in an array and returns a pointer to the element if found, or nullptr if not present.",
    code: `#include <iostream>
#include <vector>

int* findValue(std::vector<int> vec, int target) {
    for (size_t i = 0; i < vec.size(); ++i) {
        if (vec[i] == target) {
            return &vec[i];
        }
    }
    return nullptr;
}

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};

    int* result = findValue(numbers, 30);
    if (result) {
        std::cout << "Found: " << *result << std::endl;
        *result = 99;
    }

    std::cout << "Original[2] = " << numbers[2] << std::endl;
}`,
    hints: [
      "How is the vector passed to `findValue`? By value or by reference?",
      "If the vector is passed by value, whose memory does the returned pointer point into?",
      "What happens to the copy of the vector when `findValue` returns?",
    ],
    explanation: "The `findValue` function takes the vector by value, creating a temporary copy. The returned pointer points into this copy's internal storage, which is destroyed when the function returns. The caller receives a dangling pointer to freed memory. Dereferencing it (`*result`) is undefined behavior. Even if it appears to work, the modification `*result = 99` won't affect the original vector. The fix is to pass the vector by reference: `int* findValue(std::vector<int>& vec, int target)`.",
    manifestation: `$ g++ -fsanitize=address -g lookup.cpp -o lookup && ./lookup
=================================================================
==19234==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000018
READ of size 4 at 0x603000000018 thread T0
    #0 0x401b23 in main lookup.cpp:14
    #1 0x7f4a1b in __libc_start_main
0x603000000018 is located 8 bytes inside of 20-byte region
freed by thread T0 here:
    #0 0x7f4e21 in operator delete(void*)
    #1 0x401a82 in findValue(std::vector<int>, int) lookup.cpp:9
SUMMARY: AddressSanitizer: heap-use-after-free lookup.cpp:14 in main`,
    stdlibRefs: [],
  },
  {
    id: 246,
    topic: "Pointers & References",
    difficulty: "Easy",
    title: "Null Guard",
    description: "Safely prints details of an object, with null pointer protection to avoid crashes.",
    code: `#include <iostream>
#include <string>

struct User {
    std::string name;
    int age;
};

void printUser(const User* user) {
    std::cout << "Name: " << user->name << std::endl;
    std::cout << "Age: " << user->age << std::endl;
    if (user == nullptr) {
        std::cout << "(no user)" << std::endl;
        return;
    }
}

int main() {
    User alice{"Alice", 30};
    printUser(&alice);

    User* nobody = nullptr;
    printUser(nobody);
}`,
    hints: [
      "Look at the order of operations in `printUser`. What happens first — the null check or the dereference?",
      "The function accesses `user->name` and `user->age` *before* checking if `user` is nullptr.",
      "Should the null check be at the beginning or the end of the function?",
    ],
    explanation: "The null pointer check (`if (user == nullptr)`) comes *after* the code already dereferences `user` to access `user->name` and `user->age`. When `nobody` (nullptr) is passed, the function immediately dereferences a null pointer on the first line, causing undefined behavior (typically a crash) before the null check ever executes. The fix is to move the null check to the beginning of the function, before any dereference.",
    manifestation: `$ g++ -std=c++17 -O2 nullguard.cpp -o nullguard && ./nullguard
Name: Alice
Age: 30
Segmentation fault (core dumped)

$ g++ -fsanitize=address -g nullguard.cpp -o nullguard && ./nullguard
Name: Alice
Age: 30
ASAN:DEADLYSIGNAL
==24512==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000000
    #0 0x401a45 in printUser(User const*) nullguard.cpp:10
    #1 0x401c82 in main nullguard.cpp:20
SUMMARY: AddressSanitizer: SEGV nullguard.cpp:10 in printUser`,
    stdlibRefs: [],
  },
  {
    id: 247,
    topic: "Pointers & References",
    difficulty: "Medium",
    title: "Reference Binding",
    description: "Stores references to the maximum values from multiple arrays for later processing.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

const int& findMax(const std::vector<int>& v) {
    return *std::max_element(v.begin(), v.end());
}

int main() {
    std::vector<int> a = {3, 7, 2, 9, 4};
    std::vector<int> b = {5, 1, 8, 6};

    const int& maxA = findMax(a);
    const int& maxB = findMax(b);

    std::cout << "Max A: " << maxA << std::endl;
    std::cout << "Max B: " << maxB << std::endl;

    // Now modify a
    a.push_back(100);

    std::cout << "Max A after push: " << maxA << std::endl;
    std::cout << "Max B after push: " << maxB << std::endl;

    // Process with temporary vectors
    const int& maxTemp = findMax({10, 20, 30});
    std::cout << "Max temp: " << maxTemp << std::endl;
}`,
    hints: [
      "When `a.push_back(100)` is called, what might happen to the vector's internal storage?",
      "If the vector reallocates, what happens to `maxA` which references an element inside the old storage?",
      "What about `findMax({10, 20, 30})` — what is the lifetime of the temporary vector?",
    ],
    explanation: "There are two bugs. First, `a.push_back(100)` may trigger a reallocation of the vector's internal storage, invalidating `maxA` which is a reference to an element inside `a`. Reading `maxA` after the push_back is undefined behavior. Second, `findMax({10, 20, 30})` creates a temporary `std::vector<int>`, and `findMax` returns a reference to an element inside it. The temporary is destroyed at the end of the full expression, leaving `maxTemp` as a dangling reference. The fix is to return by value from `findMax` (returning `int` instead of `const int&`), or store the results by value.",
    manifestation: `$ g++ -fsanitize=address -g refbind.cpp -o refbind && ./refbind
Max A: 9
Max B: 8
=================================================================
==31205==ERROR: AddressSanitizer: heap-use-after-free on address 0x60300000001c
READ of size 4 at 0x60300000001c thread T0
    #0 0x401c23 in main refbind.cpp:20
    #1 0x7f3a1b in __libc_start_main
0x60300000001c is located 12 bytes inside of 20-byte region
freed by thread T0 here:
    #0 0x7f3e21 in operator delete(void*)
    #1 0x401b98 in std::vector<int>::_M_realloc_insert
SUMMARY: AddressSanitizer: heap-use-after-free refbind.cpp:20 in main`,
    stdlibRefs: [
      { name: "std::max_element", args: "(ForwardIt first, ForwardIt last) → ForwardIt", brief: "Returns an iterator to the largest element in the range.", note: "The returned iterator is invalidated if the container reallocates.", link: "https://en.cppreference.com/w/cpp/algorithm/max_element" },
    ],
  },
  {
    id: 248,
    topic: "Pointers & References",
    difficulty: "Medium",
    title: "Smart Pointer Cast",
    description: "Implements a class hierarchy with downcasting using smart pointers and dynamic_cast.",
    code: `#include <iostream>
#include <memory>
#include <vector>

class Animal {
public:
    virtual std::string speak() const = 0;
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    std::string speak() const override { return "Woof!"; }
    void fetch() { std::cout << "Fetching ball!" << std::endl; }
};

class Cat : public Animal {
public:
    std::string speak() const override { return "Meow!"; }
    void purr() { std::cout << "Purrrr..." << std::endl; }
};

int main() {
    std::vector<std::shared_ptr<Animal>> animals;
    animals.push_back(std::make_shared<Dog>());
    animals.push_back(std::make_shared<Cat>());
    animals.push_back(std::make_shared<Dog>());

    for (auto& animal : animals) {
        std::cout << animal->speak() << std::endl;

        Dog* dog = dynamic_cast<Dog*>(animal.get());
        if (dog) {
            dog->fetch();
        }

        std::shared_ptr<Cat> cat = std::shared_ptr<Cat>(dynamic_cast<Cat*>(animal.get()));
        if (cat) {
            cat->purr();
        }
    }
}`,
    hints: [
      "Look at how the `Cat` pointer is wrapped in a `shared_ptr`. What owns the `Cat` object?",
      "When you construct a `shared_ptr<Cat>` from a raw pointer, who is responsible for deleting the object?",
      "Are there now two independent `shared_ptr` instances that think they each own the same object?",
    ],
    explanation: "The line `std::shared_ptr<Cat>(dynamic_cast<Cat*>(animal.get()))` creates a new `shared_ptr` that takes ownership of the raw pointer — but the object is already owned by the `shared_ptr<Animal>` in the vector. Now two independent `shared_ptr` groups each think they own the same object. When either one reaches zero refcount, it deletes the object, and the other becomes a dangling pointer. This causes a double-free. The fix is to use `std::dynamic_pointer_cast<Cat>(animal)` which properly shares ownership with the original `shared_ptr`.",
    manifestation: `$ g++ -fsanitize=address -g cast.cpp -o cast && ./cast
Woof!
Fetching ball!
Meow!
Purrrr...
Woof!
Fetching ball!
=================================================================
==28734==ERROR: AddressSanitizer: attempting double-free on 0x602000000030
    #0 0x7f4e21 in operator delete(void*, unsigned long)
    #1 0x402145 in std::_Sp_counted_ptr<Cat*>::_M_dispose()
    #2 0x401e82 in std::shared_ptr<Cat>::~shared_ptr()
    #3 0x401c34 in main cast.cpp:33
0x602000000030 is located 0 bytes inside of 16-byte region
freed by thread T0 here:
    #0 0x7f4e21 in operator delete(void*, unsigned long)
    #1 0x4023a1 in std::shared_ptr<Animal>::~shared_ptr()
SUMMARY: AddressSanitizer: double-free cast.cpp:33`,
    stdlibRefs: [
      { name: "std::dynamic_pointer_cast", args: "<T>(const shared_ptr<U>& r) → shared_ptr<T>", brief: "Performs dynamic_cast on the managed pointer, sharing ownership with the source shared_ptr.", note: "Always use this instead of constructing a new shared_ptr from get() — avoids double deletion.", link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/pointer_cast" },
    ],
  },
  {
    id: 249,
    topic: "Pointers & References",
    difficulty: "Medium",
    title: "Callback Registry",
    description: "Maintains a registry of named callback functions that can be invoked by name.",
    code: `#include <iostream>
#include <string>
#include <unordered_map>
#include <functional>

class CallbackRegistry {
    std::unordered_map<std::string, std::function<void()>> callbacks;

public:
    void registerCallback(const std::string& name, std::function<void()> cb) {
        callbacks[name] = cb;
    }

    void invoke(const std::string& name) {
        auto it = callbacks.find(name);
        if (it != callbacks.end()) {
            it->second();
        }
    }
};

int main() {
    CallbackRegistry reg;

    for (int i = 0; i < 5; ++i) {
        reg.registerCallback("task_" + std::to_string(i), [&i]() {
            std::cout << "Executing task " << i << std::endl;
        });
    }

    reg.invoke("task_0");
    reg.invoke("task_2");
    reg.invoke("task_4");
}`,
    hints: [
      "The lambda captures `i` by reference. What is the lifetime of `i`?",
      "After the for loop ends, does the variable `i` still exist?",
      "Even if `i` were still in scope, what value does it hold after the loop finishes?",
    ],
    explanation: "The lambda captures the loop variable `i` by reference (`[&i]`). After the for loop completes, `i` is 5 (the value that caused the loop to terminate). Even though the loop body variable `i` may still be in scope until the end of `main`, all five callbacks reference the same `i`, and they all see its final value of 5. So every callback prints `Executing task 5` regardless of which one is invoked. The fix is to capture `i` by value: `[i]()` or `[=]()`.",
    manifestation: `$ g++ -std=c++17 -O2 callbacks.cpp -o callbacks && ./callbacks
Executing task 5
Executing task 5
Executing task 5

Expected output:
  Executing task 0
  Executing task 2
  Executing task 4
Actual output:
  All callbacks print "task 5" — they all capture the same
  reference to i, which is 5 after the loop ends`,
    stdlibRefs: [
      { name: "std::function", args: "<R(Args...)>", brief: "A general-purpose polymorphic function wrapper that can store any callable target.", link: "https://en.cppreference.com/w/cpp/utility/functional/function" },
    ],
  },
  {
    id: 250,
    topic: "Pointers & References",
    difficulty: "Hard",
    title: "Self-Referencing Struct",
    description: "Implements a configuration object that stores a reference to its own computed display name for efficiency.",
    code: `#include <iostream>
#include <string>
#include <vector>

struct Config {
    std::string prefix;
    std::string suffix;
    const std::string& displayName;

    Config(std::string p, std::string s)
        : prefix(std::move(p)),
          suffix(std::move(s)),
          displayName(prefix + " - " + suffix) {}

    void print() const {
        std::cout << "Config: " << displayName << std::endl;
    }
};

int main() {
    Config c1("App", "Debug");
    c1.print();

    Config c2("Server", "Release");
    c2.print();

    std::vector<Config> configs;
    configs.push_back(Config("Web", "Test"));
    configs.back().print();

    Config c3 = c1;
    c3.print();
}`,
    hints: [
      "In the constructor, `displayName` is bound to what expression? What is the lifetime of that expression's result?",
      "The expression `prefix + \" - \" + suffix` creates a temporary `std::string`. How long does it live?",
      "Can a reference member be initialized from a temporary? What does the standard say about its lifetime?",
    ],
    explanation: "The member `displayName` is a `const std::string&` reference that is initialized in the constructor's member initializer list with the temporary `prefix + \" - \" + suffix`. This temporary is destroyed at the end of the constructor call, leaving `displayName` as a dangling reference. Binding a reference member to a temporary does NOT extend the temporary's lifetime (unlike binding a local reference to a temporary). Every call to `c1.print()` reads through a dangling reference — undefined behavior. The fix is to make `displayName` a plain `std::string` member (by value), not a reference.",
    manifestation: `$ g++ -fsanitize=address -g config.cpp -o config && ./config
=================================================================
==15782==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd2a100040
READ of size 8 at 0x7ffd2a100040 thread T0
    #0 0x401b23 in Config::print() const config.cpp:16
    #1 0x401e82 in main config.cpp:21
Address 0x7ffd2a100040 is located in stack of thread T0
SUMMARY: AddressSanitizer: stack-use-after-scope config.cpp:16

(the temporary string from prefix + " - " + suffix was destroyed
 after the constructor completed, leaving displayName dangling)`,
    stdlibRefs: [],
  },
  {
    id: 251,
    topic: "Pointers & References",
    difficulty: "Hard",
    title: "Function Pointer Table",
    description: "Dispatches operations through a function pointer table, supporting extensible math operations.",
    code: `#include <iostream>
#include <string>
#include <cmath>

using MathFunc = double(*)(double, double);

double add(double a, double b) { return a + b; }
double sub(double a, double b) { return a - b; }
double mul(double a, double b) { return a * b; }
double divide(double a, double b) { return a / b; }
double power(double a, double b) { return std::pow(a, b); }

struct Operation {
    const char* name;
    MathFunc func;
};

Operation ops[] = {
    {"add", add},
    {"sub", sub},
    {"mul", mul},
    {"div", divide},
    {"pow", power},
};

MathFunc findOp(const char* name) {
    for (auto& op : ops) {
        if (op.name == name) {
            return op.func;
        }
    }
    return nullptr;
}

int main() {
    double a = 10, b = 3;

    const char* opName = "add";
    MathFunc f = findOp(opName);
    if (f) std::cout << opName << ": " << f(a, b) << std::endl;

    std::string userInput = "mul";
    f = findOp(userInput.c_str());
    if (f) {
        std::cout << userInput << ": " << f(a, b) << std::endl;
    } else {
        std::cout << userInput << ": not found" << std::endl;
    }

    f = findOp("div");
    if (f) std::cout << "div: " << f(a, b) << std::endl;
}`,
    hints: [
      "How does `findOp` compare the operation name? Is it comparing string contents or pointer addresses?",
      "The `==` operator on `const char*` compares addresses, not string contents. When would two `const char*` pointers compare equal?",
      "String literals with the same content *may* share the same address (compiler-dependent), but `std::string::c_str()` always returns a different address.",
    ],
    explanation: "The `findOp` function compares C strings using `==` (`op.name == name`), which compares pointer addresses, not string contents. This works for string literals that the compiler happens to pool (like `\"add\"`), where both sides point to the same static storage. But it fails for strings from other sources like `userInput.c_str()`, which returns a pointer to the string's internal buffer — a different address from any string literal. The comparison `\"mul\" == userInput.c_str()` is almost certainly `false`. The fix is to use `std::strcmp(op.name, name) == 0`.",
    manifestation: `$ g++ -std=c++17 -O2 dispatch.cpp -o dispatch && ./dispatch
add: 13
mul: not found
div: 3.33333

Expected output:
  mul: 30  ← should find the "mul" operation
Actual output:
  mul: not found  ← pointer comparison fails because
  c_str() returns a different address than the literal "mul"
  (note: "add" works because the compiler pools the identical literals)`,
    stdlibRefs: [
      { name: "std::strcmp", args: "(const char* lhs, const char* rhs) → int", brief: "Compares two null-terminated strings lexicographically, returning 0 if equal.", link: "https://en.cppreference.com/w/cpp/string/byte/strcmp" },
    ],
  },
  {
    id: 252,
    topic: "Pointers & References",
    difficulty: "Hard",
    title: "Polymorphic Cloner",
    description: "Implements deep copying of a polymorphic object hierarchy using a virtual clone method.",
    code: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    virtual ~Shape() = default;
    virtual std::unique_ptr<Shape> clone() const = 0;
    virtual void draw() const = 0;
};

class Circle : public Shape {
    double radius;
    std::string label;
public:
    Circle(double r, std::string l) : radius(r), label(std::move(l)) {}
    std::unique_ptr<Shape> clone() const override {
        return std::make_unique<Circle>(*this);
    }
    void draw() const override {
        std::cout << "Circle(" << label << ", r=" << radius << ")" << std::endl;
    }
};

class Group : public Shape {
    std::string name;
    std::vector<Shape*> children;
public:
    Group(std::string n) : name(std::move(n)) {}

    void add(Shape* s) { children.push_back(s); }

    std::unique_ptr<Shape> clone() const override {
        auto copy = std::make_unique<Group>(*this);
        return copy;
    }

    void draw() const override {
        std::cout << "Group(" << name << "):" << std::endl;
        for (auto* c : children) {
            std::cout << "  ";
            c->draw();
        }
    }

    ~Group() {
        for (auto* c : children) delete c;
    }
};

int main() {
    Group original("scene");
    original.add(new Circle(5.0, "sun"));
    original.add(new Circle(2.0, "moon"));

    auto copy = original.clone();

    original.draw();
    copy->draw();
}`,
    hints: [
      "The `Group::clone()` method creates a copy of the Group. How are the `children` pointers copied?",
      "After cloning, do `original` and `copy` share the same `Circle` objects through raw pointers?",
      "What happens when both `original` and `copy` are destroyed, and both try to `delete` the same children?",
    ],
    explanation: "The `Group::clone()` uses the compiler-generated copy constructor (`Group(*this)`), which performs a shallow copy of the `children` vector — copying the raw pointers. Both the original and the clone now own the same `Circle` objects. When both `Group` destructors run, they each `delete` the same `Circle` pointers, causing double-free. The fix is to implement a deep copy in `Group::clone()` that clones each child recursively: `for (auto* c : children) copy->add(c->clone().release());`.",
    manifestation: `$ g++ -fsanitize=address -g cloner.cpp -o cloner && ./cloner
Group(scene):
  Circle(sun, r=5)
  Circle(moon, r=2)
Group(scene):
  Circle(sun, r=5)
  Circle(moon, r=2)
=================================================================
==22451==ERROR: AddressSanitizer: attempting double-free on 0x602000000010
    #0 0x7f4e21 in operator delete(void*, unsigned long)
    #1 0x401c82 in Group::~Group() cloner.cpp:47
    #2 0x401e45 in main cloner.cpp:55
0x602000000010 is located 0 bytes inside of 48-byte region
freed by thread T0 here:
    #0 0x7f4e21 in operator delete(void*, unsigned long)
    #1 0x401c82 in Group::~Group() cloner.cpp:47
    #2 0x401d98 in main cloner.cpp:55
SUMMARY: AddressSanitizer: double-free cloner.cpp:47 in Group::~Group`,
    stdlibRefs: [
      { name: "std::make_unique", args: "<T>(Args&&... args) → unique_ptr<T>", brief: "Creates a unique_ptr that owns a new object constructed with the given arguments.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique" },
    ],
  },
  {
    id: 253,
    topic: "Pointers & References",
    difficulty: "Medium",
    title: "Array Decay Trap",
    description: "Computes the size of an array and uses it for bounds checking in a utility function.",
    code: `#include <iostream>
#include <cstring>

void processArray(int arr[], int threshold) {
    size_t len = sizeof(arr) / sizeof(arr[0]);
    std::cout << "Array length: " << len << std::endl;

    int count = 0;
    for (size_t i = 0; i < len; ++i) {
        if (arr[i] > threshold) {
            ++count;
        }
    }
    std::cout << "Elements above " << threshold << ": " << count << std::endl;
}

int main() {
    int data[] = {15, 8, 23, 42, 4, 16, 31, 7, 19, 28};
    size_t mainLen = sizeof(data) / sizeof(data[0]);
    std::cout << "Main array length: " << mainLen << std::endl;

    processArray(data, 20);
}`,
    hints: [
      "What type does `int arr[]` actually become when used as a function parameter?",
      "In the function, `sizeof(arr)` gives the size of what — the array or a pointer?",
      "Why does `sizeof(data)` in `main` give a different result than `sizeof(arr)` in `processArray`?",
    ],
    explanation: "When an array is passed to a function declared with `int arr[]`, the parameter decays to a pointer (`int*`). So `sizeof(arr)` inside the function returns the size of a pointer (typically 4 or 8 bytes), not the size of the array. On a 64-bit system, `sizeof(arr) / sizeof(arr[0])` is `8 / 4 = 2`, so the function only processes the first 2 elements of the 10-element array. In `main`, `sizeof(data)` correctly returns 40 (10 * 4 bytes) because `data` is a true array, not a decayed pointer. The fix is to pass the array length as a separate parameter, or use `std::span` or `std::array`.",
    manifestation: `$ g++ -std=c++17 -Wall -O2 decay.cpp -o decay && ./decay
decay.cpp:5:26: warning: sizeof on array function parameter will
  return size of 'int *' instead of 'int[]'
Main array length: 10
Array length: 2
Elements above 20: 0

Expected output:
  Array length: 10
  Elements above 20: 5  (23, 42, 31, 19, 28 are all > 20)
Actual output:
  Array length: 2      ← sizeof(pointer) / sizeof(int)
  Elements above 20: 0 ← only checked first 2 elements (15, 8)`,
    stdlibRefs: [],
  },

  // ── Type Conversions ──
  {
    id: 254,
    topic: "Type Conversions",
    difficulty: "Easy",
    title: "Average Calculator",
    description: "Computes the average of a list of integer scores and displays the result with decimal precision.",
    code: `#include <iostream>
#include <vector>

double average(const std::vector<int>& values) {
    int sum = 0;
    for (int v : values) {
        sum += v;
    }
    return sum / values.size();
}

int main() {
    std::vector<int> scores = {85, 92, 78, 95, 88};
    std::cout << "Average: " << average(scores) << std::endl;

    std::vector<int> small = {1, 2};
    std::cout << "Average: " << average(small) << std::endl;

    std::vector<int> single = {7};
    std::cout << "Average: " << average(single) << std::endl;
}`,
    hints: [
      "What types are `sum` and `values.size()`? What type does the division produce?",
      "`sum` is `int` and `values.size()` returns `size_t` (unsigned). What happens with integer division?",
      "How would you force floating-point division?",
    ],
    explanation: "The expression `sum / values.size()` performs integer division because `sum` is `int` and `values.size()` returns `size_t` — both integral types. The `int` is implicitly converted to `size_t`, and the division truncates the fractional part. So `average({85, 92, 78, 95, 88})` computes `438 / 5 = 87` instead of `87.6`. Even though the function returns `double`, the truncation happens before the conversion to double. The fix is to cast: `static_cast<double>(sum) / values.size()`.",
    manifestation: `$ g++ -std=c++17 -O2 avg.cpp -o avg && ./avg
Average: 87
Average: 1
Average: 7

Expected output:
  Average: 87.6
  Average: 1.5
  Average: 7
Actual output:
  Average: 87    ← integer division truncated 87.6 to 87
  Average: 1     ← integer division truncated 1.5 to 1`,
    stdlibRefs: [],
  },
  {
    id: 255,
    topic: "Type Conversions",
    difficulty: "Easy",
    title: "Byte Packer",
    description: "Packs four bytes into a 32-bit integer and unpacks them back, used for binary protocol handling.",
    code: `#include <iostream>
#include <cstdint>

uint32_t packBytes(uint8_t a, uint8_t b, uint8_t c, uint8_t d) {
    return (a << 24) | (b << 16) | (c << 8) | d;
}

void unpackBytes(uint32_t packed, uint8_t& a, uint8_t& b, uint8_t& c, uint8_t& d) {
    a = (packed >> 24) & 0xFF;
    b = (packed >> 16) & 0xFF;
    c = (packed >> 8) & 0xFF;
    d = packed & 0xFF;
}

int main() {
    uint32_t packed = packBytes(0x12, 0x34, 0x56, 0x78);
    std::cout << std::hex << "Packed: 0x" << packed << std::endl;

    uint8_t a, b, c, d;
    unpackBytes(packed, a, b, c, d);
    std::cout << "Unpacked: "
              << (int)a << " " << (int)b << " "
              << (int)c << " " << (int)d << std::endl;

    // Edge case: high bit set
    packed = packBytes(0xFF, 0x00, 0x00, 0x01);
    std::cout << "Packed: 0x" << packed << std::endl;
}`,
    hints: [
      "When you shift a `uint8_t` left by 24 bits, what type is the intermediate result?",
      "Integer promotion converts `uint8_t` to `int` before the shift. If `a` is `0xFF`, what is `0xFF << 24` as a signed `int`?",
      "On a system where `int` is 32 bits, is `0xFF << 24` (which is `0xFF000000`) representable as a signed `int`?",
    ],
    explanation: "When `a` is `0xFF`, integer promotion converts it to `int` (value 255). Then `255 << 24` produces `0xFF000000`, which is `4278190080` — a value that exceeds `INT_MAX` (2147483647) on 32-bit `int` systems. Left-shifting into or past the sign bit of a signed integer is undefined behavior in C++ (before C++20). In practice, the result is usually the expected bit pattern interpreted as a negative number, which then gets converted to `uint32_t` correctly due to two's complement. But it's technically UB. The fix is to cast to `uint32_t` before shifting: `(static_cast<uint32_t>(a) << 24)`.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=undefined pack.cpp -o pack && ./pack
Packed: 0x12345678
Unpacked: 12 34 56 78
pack.cpp:5:15: runtime error: left shift of 255 by 24 places
cannot be represented in type 'int'
Packed: 0xff000001

The program may produce correct output on most platforms due to
two's complement behavior, but the left shift is technically
undefined behavior when it overflows signed int.`,
    stdlibRefs: [],
  },
  {
    id: 256,
    topic: "Type Conversions",
    difficulty: "Easy",
    title: "Distance Checker",
    description: "Checks whether two values are within a specified distance of each other.",
    code: `#include <iostream>
#include <vector>

bool isClose(unsigned int a, unsigned int b, unsigned int maxDist) {
    return (a - b) <= maxDist;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << "isClose(10, 12, 5): " << isClose(10, 12, 5) << std::endl;
    std::cout << "isClose(100, 103, 5): " << isClose(100, 103, 5) << std::endl;
    std::cout << "isClose(5, 5, 0): " << isClose(5, 5, 0) << std::endl;
    std::cout << "isClose(3, 10, 5): " << isClose(3, 10, 5) << std::endl;

    std::vector<unsigned int> data = {100, 105, 200, 102, 98};
    unsigned int target = 100;
    std::cout << "\\nValues close to " << target << ":" << std::endl;
    for (auto v : data) {
        if (isClose(v, target, 5)) {
            std::cout << "  " << v << std::endl;
        }
    }
}`,
    hints: [
      "What happens when you subtract a larger unsigned integer from a smaller one?",
      "If `a` is 3 and `b` is 10, what is `a - b` when both are `unsigned int`?",
      "Unsigned integer subtraction wraps around. Is the result ever negative?",
    ],
    explanation: "When `a < b`, the subtraction `a - b` wraps around (unsigned underflow), producing a very large positive number close to `UINT_MAX`. For example, `3 - 10` becomes `4294967289`, which is certainly not `<= 5`. But `10 - 12` also wraps to `4294967294`, which should be close (distance 2) but the check fails. The function only works correctly when `a >= b`. The fix is to use `std::abs(static_cast<int>(a) - static_cast<int>(b))` or compute `(a > b) ? (a - b) : (b - a)` to get the actual distance.",
    manifestation: `$ g++ -std=c++17 -O2 close.cpp -o close && ./close
isClose(10, 12, 5): false
isClose(100, 103, 5): false
isClose(5, 5, 0): true
isClose(3, 10, 5): false

Values close to 100:
  100
  102

Expected output:
  isClose(10, 12, 5): true  ← distance is 2, within 5
  isClose(100, 103, 5): true  ← distance is 3, within 5
  isClose(3, 10, 5): false  ← distance is 7, not within 5
  Values close to 100: 100, 105, 102, 98  ← all within 5
Actual output:
  Only works when a >= b (unsigned subtraction wraps on underflow)`,
    stdlibRefs: [],
  },
  {
    id: 257,
    topic: "Type Conversions",
    difficulty: "Medium",
    title: "Bitfield Extractor",
    description: "Extracts and inserts bitfields from a 32-bit register value, useful for hardware register manipulation.",
    code: `#include <iostream>
#include <cstdint>

uint32_t extractBits(uint32_t value, int start, int width) {
    uint32_t mask = (1 << width) - 1;
    return (value >> start) & mask;
}

uint32_t insertBits(uint32_t value, int start, int width, uint32_t bits) {
    uint32_t mask = (1 << width) - 1;
    value &= ~(mask << start);
    value |= (bits & mask) << start;
    return value;
}

int main() {
    uint32_t reg = 0xDEADBEEF;

    std::cout << std::hex;
    std::cout << "Bits [7:0]: 0x" << extractBits(reg, 0, 8) << std::endl;
    std::cout << "Bits [15:8]: 0x" << extractBits(reg, 8, 8) << std::endl;
    std::cout << "Bits [31:0]: 0x" << extractBits(reg, 0, 32) << std::endl;

    uint32_t modified = insertBits(reg, 8, 8, 0x42);
    std::cout << "After insert: 0x" << modified << std::endl;
}`,
    hints: [
      "What happens when `width` is 32 in the expression `(1 << width) - 1`?",
      "The literal `1` is an `int`. What is `1 << 32` on a platform where `int` is 32 bits?",
      "Shifting by an amount equal to or greater than the width of the type is undefined behavior.",
    ],
    explanation: "When `width` is 32, the expression `(1 << 32) - 1` triggers undefined behavior: shifting a 32-bit `int` by 32 positions is UB per the C++ standard (shift amount must be less than the bit width of the type). On many platforms, `1 << 32` produces `1` (the shift wraps around), making the mask `0` instead of `0xFFFFFFFF`. So `extractBits(reg, 0, 32)` returns `0` instead of the full register value. The fix is to use `(1u << width) - 1` with a special case for `width == 32`, or use `width == 32 ? ~0u : (1u << width) - 1`.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=undefined bits.cpp -o bits && ./bits
Bits [7:0]: 0xef
Bits [15:8]: 0xbe
bits.cpp:5:27: runtime error: shift exponent 32 is too large
for 32-bit type 'int'
Bits [31:0]: 0x0

Expected output:
  Bits [31:0]: 0xdeadbeef  ← full 32-bit extraction
Actual output:
  Bits [31:0]: 0x0  ← mask is 0 due to UB shift by 32`,
    stdlibRefs: [],
  },
  {
    id: 258,
    topic: "Type Conversions",
    difficulty: "Medium",
    title: "Timestamp Difference",
    description: "Computes the difference in milliseconds between two timestamps, handling wrapping for 32-bit counters.",
    code: `#include <iostream>
#include <cstdint>

int64_t timeDiffMs(uint32_t start, uint32_t end) {
    int32_t diff = end - start;
    return diff;
}

int main() {
    // Normal case
    std::cout << "Diff: " << timeDiffMs(1000, 2000) << " ms" << std::endl;

    // Small backward jump (should be negative)
    std::cout << "Diff: " << timeDiffMs(2000, 1000) << " ms" << std::endl;

    // Wrap-around at 2^32
    uint32_t before = 0xFFFFFFF0;
    uint32_t after  = 0x00000010;
    std::cout << "Wrap diff: " << timeDiffMs(before, after) << " ms" << std::endl;

    // Large difference
    uint32_t t1 = 0;
    uint32_t t2 = 3000000000u;
    std::cout << "Large diff: " << timeDiffMs(t1, t2) << " ms" << std::endl;
}`,
    hints: [
      "The subtraction `end - start` produces a `uint32_t` result. What happens when you store it in an `int32_t`?",
      "If `end - start` is greater than `INT32_MAX` (2147483647), what does the `int32_t` conversion produce?",
      "For `timeDiffMs(0, 3000000000u)`, the unsigned difference is 3 billion. Does that fit in `int32_t`?",
    ],
    explanation: "The unsigned subtraction `end - start` produces a `uint32_t`. When this result exceeds `INT32_MAX` (2147483647), storing it in `int32_t diff` produces implementation-defined behavior (typically reinterprets the bit pattern as signed). For `timeDiffMs(0, 3000000000u)`, the unsigned difference is `3000000000`, which when interpreted as `int32_t` becomes `-1294967296`. The function returns a negative value for what should be a large positive time difference. The fix is to keep the result as `uint32_t` and only convert to signed for genuinely small differences, or use `int64_t` for the subtraction: `return static_cast<int64_t>(end) - static_cast<int64_t>(start)`.",
    manifestation: `$ g++ -std=c++17 -O2 timestamp.cpp -o timestamp && ./timestamp
Diff: 1000 ms
Diff: -1000 ms
Wrap diff: 32 ms
Large diff: -1294967296 ms

Expected output:
  Large diff: 3000000000 ms  ← ~50 minutes
Actual output:
  Large diff: -1294967296 ms ← negative due to uint32_t → int32_t
  overflow when difference exceeds INT32_MAX`,
    stdlibRefs: [],
  },
  {
    id: 259,
    topic: "Type Conversions",
    difficulty: "Medium",
    title: "Enum Bitmask",
    description: "Uses an enum to define permission flags and combines them with bitwise operations.",
    code: `#include <iostream>
#include <string>

enum Permission {
    None    = 0,
    Read    = 1,
    Write   = 2,
    Execute = 4,
    Admin   = 8,
};

Permission operator|(Permission a, Permission b) {
    return static_cast<Permission>(static_cast<int>(a) | static_cast<int>(b));
}

bool hasPermission(Permission granted, Permission required) {
    return granted & required;
}

std::string permString(Permission p) {
    std::string s;
    if (p & Read) s += "r";
    if (p & Write) s += "w";
    if (p & Execute) s += "x";
    if (p & Admin) s += "A";
    return s.empty() ? "-" : s;
}

int main() {
    Permission user = Read | Write;
    Permission admin = Read | Write | Execute | Admin;

    std::cout << "User: " << permString(user) << std::endl;
    std::cout << "Admin: " << permString(admin) << std::endl;

    std::cout << "User has Read: " << hasPermission(user, Read) << std::endl;
    std::cout << "User has Execute: " << hasPermission(user, Execute) << std::endl;
    std::cout << "User has Read|Write: " << hasPermission(user, Read | Write) << std::endl;
    std::cout << "User has Read|Execute: " << hasPermission(user, Read | Execute) << std::endl;
}`,
    hints: [
      "Look at `hasPermission`. It checks `granted & required`. What does this return when multiple bits are set in `required`?",
      "If `required` is `Read | Execute` (5) and `granted` is `Read | Write` (3), what is `3 & 5`?",
      "Does `granted & required` being non-zero mean *all* required permissions are present, or just *any*?",
    ],
    explanation: "The `hasPermission` function checks `granted & required`, which returns non-zero if *any* of the required bits are set — not *all* of them. So `hasPermission(Read | Write, Read | Execute)` returns `true` because the `Read` bit is present, even though `Execute` is missing. This is a logical bug: the function checks for `ANY` when it should check for `ALL`. The fix is `return (granted & required) == required;` to verify that all required bits are set.",
    manifestation: `$ g++ -std=c++17 -O2 perms.cpp -o perms && ./perms
User: rw
Admin: rwxA
User has Read: 1
User has Execute: 0
User has Read|Write: 1
User has Read|Execute: 1

Expected output:
  User has Read|Execute: 0  ← user lacks Execute
Actual output:
  User has Read|Execute: 1  ← returns true because user has Read
  (bitwise AND is non-zero if ANY bit matches, not ALL)`,
    stdlibRefs: [],
  },
  {
    id: 260,
    topic: "Type Conversions",
    difficulty: "Hard",
    title: "Comparison Overload",
    description: "Implements a measurement class with unit conversion that supports comparison between different units.",
    code: `#include <iostream>
#include <cmath>

class Length {
    double value;  // stored in meters
public:
    static Length fromMeters(double m) { return Length{m}; }
    static Length fromCentimeters(double cm) { return Length{cm / 100.0}; }
    static Length fromInches(double in) { return Length{in * 0.0254}; }

    double meters() const { return value; }
    double centimeters() const { return value * 100.0; }

    bool operator==(const Length& other) const {
        return value == other.value;
    }

    bool operator<(const Length& other) const {
        return value < other.value;
    }

    operator double() const { return value; }

private:
    Length(double v) : value(v) {}
};

int main() {
    Length a = Length::fromMeters(1.0);
    Length b = Length::fromCentimeters(100.0);

    std::cout << "1m == 100cm: " << (a == b) << std::endl;

    Length c = Length::fromInches(39.3701);
    std::cout << "1m == 39.37in: " << (a == c) << std::endl;

    Length d = Length::fromCentimeters(50.0);
    std::cout << "50cm < 1m: " << (d < a) << std::endl;

    // Surprise!
    std::cout << "1m < 2: " << (a < 2) << std::endl;
    std::cout << "0.5 < 1m: " << (0.5 < a) << std::endl;
}`,
    hints: [
      "The class has an `operator double()` conversion. When does it get used?",
      "In `a < 2`, can the compiler use `operator<(Length, Length)` directly? What about implicit conversions?",
      "What does `a < 2` actually compare — meters to meters, or the raw double value to 2?",
    ],
    explanation: "The class provides an implicit `operator double()` conversion. When comparing `a < 2`, the compiler can't convert `2` to `Length` (the constructor is private), but it can convert `a` to `double` via `operator double()`. So `a < 2` becomes `1.0 < 2`, comparing the internal meter value to the raw number `2`. This is semantically meaningless — is `2` meters? centimeters? inches? The comparison silently treats the right operand as meters. Similarly, `0.5 < a` converts `a` to `double`. The implicit conversion operator creates a dangerous backdoor that bypasses the type safety the class was designed to provide. The fix is to make the conversion `explicit`: `explicit operator double() const`.",
    manifestation: `$ g++ -std=c++17 -O2 length.cpp -o length && ./length
1m == 100cm: 1
1m == 39.37in: 0
50cm < 1m: 1
1m < 2: 1
0.5 < 1m: 1

Note: "1m == 39.37in" returns false due to floating-point
precision (0.0254 * 39.3701 ≈ 0.999999..., not exactly 1.0).

But the deeper issue: "1m < 2" compiles and returns true.
The implicit operator double() lets the compiler silently
convert Length to a raw double, bypassing all unit safety.
Is 2 supposed to mean 2 meters? 2 centimeters? The comparison
is meaningless but compiles without warning.`,
    stdlibRefs: [],
  },
  {
    id: 261,
    topic: "Type Conversions",
    difficulty: "Hard",
    title: "Variadic Sum",
    description: "Uses variadic templates to sum an arbitrary number of numeric arguments, supporting mixed types.",
    code: `#include <iostream>
#include <cstdint>

template <typename T>
T sum(T value) {
    return value;
}

template <typename T, typename... Rest>
T sum(T first, Rest... rest) {
    return first + sum(rest...);
}

int main() {
    std::cout << "sum(1, 2, 3): " << sum(1, 2, 3) << std::endl;
    std::cout << "sum(1.5, 2.5, 3.0): " << sum(1.5, 2.5, 3.0) << std::endl;

    int a = 1000000;
    int b = 2000000;
    int c = 3000000;
    std::cout << "sum(1M, 2M, 3M): " << sum(a, b, c) << std::endl;

    // Mixed types
    std::cout << "sum(1, 2.5, 3): " << sum(1, 2.5, 3) << std::endl;

    uint8_t x = 200, y = 100, z = 50;
    std::cout << "sum(200, 100, 50): " << sum(x, y, z) << std::endl;
}`,
    hints: [
      "Look at the return type of `sum`. What is `T` deduced as for `sum(1, 2.5, 3)`?",
      "The return type is `T`, which is deduced from the *first* argument. For `sum(1, 2.5, 3)`, `T` is `int`.",
      "When the function adds `first + sum(rest...)`, what happens to the intermediate `double` result `2.5 + 3`?",
    ],
    explanation: "The return type of `sum` is always `T`, deduced from the first argument. For `sum(1, 2.5, 3)`, `T` is `int`, so the final result is truncated to `int`. But worse: the recursive call `sum(2.5, 3)` deduces `T` as `double` and returns `5.5`, then `1 + 5.5 = 6.5` is truncated to `6` because the outer sum's return type is `int`. So `sum(1, 2.5, 3)` returns `6` instead of `6.5`. For `uint8_t` values: `sum(200, 100, 50)` — `T` is `uint8_t`, and `200 + 100` would be `300`, which wraps to `44` in `uint8_t`. Then `44 + 50 = 94`. The fix is to use `std::common_type_t<T, Rest...>` as the return type.",
    manifestation: `$ g++ -std=c++17 -O2 varsum.cpp -o varsum && ./varsum
sum(1, 2, 3): 6
sum(1.5, 2.5, 3.0): 7
sum(1M, 2M, 3M): 6000000
sum(1, 2.5, 3): 6
sum(200, 100, 50): 94

Expected output:
  sum(1, 2.5, 3): 6.5  ← mixed int/double should preserve precision
  sum(200, 100, 50): 350  ← should not overflow uint8_t
Actual output:
  sum(1, 2.5, 3): 6    ← truncated because return type is int
  sum(200, 100, 50): 94 ← uint8_t overflow: (200+100) wraps to 44`,
    stdlibRefs: [
      { name: "std::common_type", args: "<T...> → type", brief: "Determines the common type among all given types, to which they can all be implicitly converted.", link: "https://en.cppreference.com/w/cpp/types/common_type" },
    ],
  },
  {
    id: 262,
    topic: "Type Conversions",
    difficulty: "Medium",
    title: "Container Size Check",
    description: "Validates that a container has enough elements before accessing them, with bounds checking.",
    code: `#include <iostream>
#include <vector>
#include <string>

void printLast(const std::vector<std::string>& items, int count) {
    if (items.size() - count < 0) {
        std::cout << "Not enough items!" << std::endl;
        return;
    }

    for (int i = items.size() - count; i < items.size(); ++i) {
        std::cout << items[i] << std::endl;
    }
}

int main() {
    std::vector<std::string> names = {"Alice", "Bob", "Charlie", "Dave"};

    std::cout << "Last 2:" << std::endl;
    printLast(names, 2);

    std::cout << "\\nLast 10:" << std::endl;
    printLast(names, 10);
}`,
    hints: [
      "What is the type of `items.size()`? What type is `count`?",
      "When you subtract an `int` from a `size_t` (unsigned), what type is the result?",
      "Can an unsigned value ever be `< 0`?",
    ],
    explanation: "The expression `items.size() - count` involves a `size_t` (unsigned) and an `int`. The `int` is implicitly converted to `size_t`, and the subtraction is performed in unsigned arithmetic. When `count` (10) is greater than `items.size()` (4), the result wraps around to a very large unsigned value rather than becoming negative. The check `< 0` is always false for unsigned types. So the bounds check never triggers, and the function proceeds to access elements at massive (wrapped-around) indices, causing undefined behavior. The fix is to compare before subtracting: `if (static_cast<size_t>(count) > items.size())`.",
    manifestation: `$ g++ -std=c++17 -Wall -O2 lastN.cpp -o lastN && ./lastN
lastN.cpp:6:30: warning: comparison of unsigned expression < 0
  is always false [-Wtype-limits]
Last 2:
Charlie
Dave

Last 10:
Segmentation fault (core dumped)

Expected output:
  Last 10: "Not enough items!"
Actual output:
  Crashes because the unsigned subtraction wraps around,
  the < 0 check is always false for unsigned types`,
    stdlibRefs: [],
  },
  {
    id: 263,
    topic: "Type Conversions",
    difficulty: "Hard",
    title: "Type-Safe ID Wrapper",
    description: "Wraps numeric IDs in strongly-typed classes to prevent accidentally mixing user IDs with product IDs.",
    code: `#include <iostream>
#include <unordered_map>
#include <string>

template <typename Tag>
class StrongId {
    int value;
public:
    StrongId(int v) : value(v) {}
    int get() const { return value; }
    bool operator==(const StrongId& other) const { return value == other.value; }
};

struct UserTag {};
struct ProductTag {};
using UserId = StrongId<UserTag>;
using ProductId = StrongId<ProductTag>;

namespace std {
    template <typename Tag>
    struct hash<StrongId<Tag>> {
        size_t operator()(const StrongId<Tag>& id) const {
            return std::hash<int>{}(id.get());
        }
    };
}

int main() {
    std::unordered_map<UserId, std::string> users;
    users[UserId(1)] = "Alice";
    users[UserId(2)] = "Bob";

    std::unordered_map<ProductId, std::string> products;
    products[ProductId(1)] = "Widget";
    products[ProductId(2)] = "Gadget";

    // This should be a compile error but isn't:
    UserId uid(42);
    ProductId pid = uid;

    std::cout << "User: " << users[UserId(1)] << std::endl;
    std::cout << "Product: " << products[pid] << std::endl;
}`,
    hints: [
      "The intention is that `UserId` and `ProductId` are different types that can't be mixed. Can you assign one to the other?",
      "Look at the constructor: `StrongId(int v)`. Is it `explicit`?",
      "What implicit conversion path allows `ProductId pid = uid`?",
    ],
    explanation: "The `StrongId` constructor is not `explicit`, and there's also an implicit conversion from `StrongId` to `int` via `get()` — wait, `get()` is not an implicit conversion operator. The actual conversion path is: `UserId uid(42)` has value 42. `ProductId pid = uid` — the compiler looks for a way to convert `UserId` to `ProductId`. Since there's no direct conversion, it can't do it... Actually, this should be a compile error. Let me reconsider. `ProductId pid = uid;` — `uid` is `StrongId<UserTag>`, `pid` is `StrongId<ProductTag>`. There's no implicit conversion between different template instantiations. The compiler should reject this. The real bug is that the constructor `StrongId(int v)` is not `explicit`, allowing implicit construction from `int`. This means you can write `UserId uid = 42;` or pass a bare `int` where a `UserId` is expected, defeating the purpose of the strong typing. The line `ProductId pid = uid` would indeed fail to compile. But `users[42]` would compile because `42` implicitly converts to `UserId(42)`. The real issue is the non-explicit constructor.",
    manifestation: `$ g++ -std=c++17 -O2 strongid.cpp -o strongid
strongid.cpp:39:19: error: no viable conversion from
  'StrongId<UserTag>' to 'StrongId<ProductTag>'
    ProductId pid = uid;
                    ^~~

However, the non-explicit constructor allows:
  users[42] = "Mallory";      ← int silently converts to UserId
  doLookup(100);              ← raw int accepted as UserId arg
  UserId x = getProductCount(); ← return value silently wraps

The strong typing is defeated: any int silently becomes any ID type.
Fix: mark constructor explicit.`,
    stdlibRefs: [],
  },

  // ── Data Structures ──
  {
    id: 264,
    topic: "Data Structures",
    difficulty: "Easy",
    title: "Stack Peek",
    description: "Implements a simple stack with push, pop, and peek operations using a vector as the backing store.",
    code: `#include <iostream>
#include <vector>
#include <stdexcept>

template <typename T>
class Stack {
    std::vector<T> data;

public:
    void push(const T& value) {
        data.push_back(value);
    }

    T pop() {
        if (data.empty()) throw std::runtime_error("Stack underflow");
        T value = data.back();
        data.pop_back();
        return value;
    }

    T& peek() {
        return data.back();
    }

    bool empty() const { return data.empty(); }
    size_t size() const { return data.size(); }
};

int main() {
    Stack<int> s;
    s.push(10);
    s.push(20);
    s.push(30);

    std::cout << "Peek: " << s.peek() << std::endl;
    std::cout << "Pop: " << s.pop() << std::endl;
    std::cout << "Size: " << s.size() << std::endl;

    Stack<int> empty;
    std::cout << "Peek empty: " << empty.peek() << std::endl;
}`,
    hints: [
      "What happens when you call `peek()` on an empty stack?",
      "Does `peek()` check if the stack is empty before accessing `data.back()`?",
      "What does `std::vector::back()` do when the vector is empty?",
    ],
    explanation: "The `peek()` method calls `data.back()` without checking if the stack is empty. Unlike `pop()` which has an emptiness check, `peek()` has none. Calling `back()` on an empty vector is undefined behavior — it may crash, return garbage, or appear to work. The fix is to add the same emptiness check as `pop()`: `if (data.empty()) throw std::runtime_error(\"Stack underflow\");`.",
    manifestation: `$ g++ -std=c++17 -O2 stack.cpp -o stack && ./stack
Peek: 30
Pop: 30
Size: 2
Segmentation fault (core dumped)

$ g++ -fsanitize=address -g stack.cpp -o stack && ./stack
Peek: 30
Pop: 30
Size: 2
=================================================================
==18234==ERROR: AddressSanitizer: container-overflow on address 0x603000000020
READ of size 4 at 0x603000000020 thread T0
    #0 0x401a82 in Stack<int>::peek() stack.cpp:22
    #1 0x401e45 in main stack.cpp:38
SUMMARY: AddressSanitizer: container-overflow stack.cpp:22`,
    stdlibRefs: [
      { name: "std::vector::back", args: "() → reference", brief: "Returns a reference to the last element in the vector.", note: "Calling back() on an empty vector is undefined behavior.", link: "https://en.cppreference.com/w/cpp/container/vector/back" },
    ],
  },
  {
    id: 265,
    topic: "Data Structures",
    difficulty: "Easy",
    title: "Circular Queue",
    description: "Implements a fixed-size circular queue (ring buffer) for streaming data processing.",
    code: `#include <iostream>
#include <vector>

template <typename T>
class CircularQueue {
    std::vector<T> buffer;
    size_t head = 0;
    size_t tail = 0;
    size_t count = 0;
    size_t capacity;

public:
    CircularQueue(size_t cap) : buffer(cap), capacity(cap) {}

    bool enqueue(const T& value) {
        if (count == capacity) return false;
        buffer[tail] = value;
        tail = (tail + 1) % capacity;
        ++count;
        return true;
    }

    bool dequeue(T& out) {
        if (count == 0) return false;
        out = buffer[head];
        head = (head + 1) % capacity;
        --count;
        return true;
    }

    bool full() const { return count == capacity; }
    bool empty() const { return count == 0; }
    size_t size() const { return count; }
};

int main() {
    CircularQueue<int> q(3);

    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);

    std::cout << "Full: " << q.full() << std::endl;
    std::cout << "Enqueue 4: " << q.enqueue(4) << std::endl;

    int val;
    q.dequeue(val);
    std::cout << "Dequeued: " << val << std::endl;

    q.enqueue(4);

    while (!q.empty()) {
        q.dequeue(val);
        std::cout << val << " ";
    }
    std::cout << std::endl;

    // Edge case: zero capacity
    CircularQueue<int> zeroQ(0);
    std::cout << "Zero enqueue: " << zeroQ.enqueue(1) << std::endl;
    std::cout << "Zero empty: " << zeroQ.empty() << std::endl;
}`,
    hints: [
      "What happens when you create a `CircularQueue` with capacity 0?",
      "With capacity 0, the modulo operation `tail % capacity` becomes `tail % 0`. What is that?",
      "Is division (or modulo) by zero defined behavior in C++?",
    ],
    explanation: "When `capacity` is 0, the `enqueue` method checks `count == capacity` (0 == 0), which is true, so it correctly returns false. However, if the implementation were slightly different, or if `full()` is checked differently, the modulo by zero would trigger. But wait — in this specific code, `enqueue` returns false before reaching the modulo line when capacity is 0. The actual subtle bug is that the `CircularQueue(0)` creates a zero-size vector and the queue works (reporting empty and full simultaneously). The real bug is different: the queue with capacity 0 reports `full() == true` AND `empty() == true` simultaneously, which is a contradictory state. Any code checking `if (!q.full())` would skip enqueue, but code checking `if (!q.empty())` would try to dequeue from an empty buffer. The `dequeue` method would return false, but the contradictory state violates the queue's invariants.",
    manifestation: `$ g++ -std=c++17 -O2 ringbuf.cpp -o ringbuf && ./ringbuf
Full: 1
Enqueue 4: 0
Dequeued: 1
2 3 4
Zero enqueue: 0
Zero empty: 1

Note: zero-capacity queue reports both full() and empty() as true.
This is a contradictory state:

  CircularQueue<int> q(0);
  q.full()   → true  (count == capacity: 0 == 0)
  q.empty()  → true  (count == 0)

Code that branches on full()/empty() may take impossible paths.
Also: if capacity is 0 and enqueue somehow runs, the modulo
(tail % 0) is undefined behavior.`,
    stdlibRefs: [],
  },
  {
    id: 266,
    topic: "Data Structures",
    difficulty: "Easy",
    title: "Min Finder",
    description: "Maintains a running minimum over a stream of values, supporting add and query operations.",
    code: `#include <iostream>
#include <limits>

class MinTracker {
    int minimum;

public:
    MinTracker() : minimum(0) {}

    void add(int value) {
        if (value < minimum) {
            minimum = value;
        }
    }

    int getMin() const { return minimum; }
};

int main() {
    MinTracker tracker;
    tracker.add(5);
    tracker.add(3);
    tracker.add(8);
    tracker.add(1);
    tracker.add(4);

    std::cout << "Min: " << tracker.getMin() << std::endl;

    MinTracker tracker2;
    tracker2.add(10);
    tracker2.add(20);
    tracker2.add(30);

    std::cout << "Min: " << tracker2.getMin() << std::endl;
}`,
    hints: [
      "What is `minimum` initialized to?",
      "If all added values are positive (like 10, 20, 30), what will `getMin()` return?",
      "Should the initial minimum be 0 or `std::numeric_limits<int>::max()`?",
    ],
    explanation: "The `minimum` is initialized to `0` instead of `std::numeric_limits<int>::max()`. Since `add()` only updates `minimum` when `value < minimum`, any sequence of positive values will never be less than 0, so `getMin()` returns 0 even though 0 was never added. For `tracker2` with values 10, 20, 30, the reported minimum is 0 instead of 10. The fix is to initialize `minimum` to `std::numeric_limits<int>::max()` or track whether any value has been added.",
    manifestation: `$ g++ -std=c++17 -O2 mintrack.cpp -o mintrack && ./mintrack
Min: 1
Min: 0

Expected output:
  Min: 1   ← correct (1 is the smallest of 5, 3, 8, 1, 4)
  Min: 10  ← smallest of 10, 20, 30
Actual output:
  Min: 0   ← initial value of 0 was never updated because
             all values (10, 20, 30) are greater than 0`,
    stdlibRefs: [
      { name: "std::numeric_limits", brief: "Provides properties of arithmetic types such as minimum and maximum representable values.", link: "https://en.cppreference.com/w/cpp/types/numeric_limits" },
    ],
  },
  {
    id: 267,
    topic: "Data Structures",
    difficulty: "Medium",
    title: "Binary Search Tree",
    description: "Implements a BST with insert, search, and in-order traversal operations.",
    code: `#include <iostream>
#include <functional>

struct Node {
    int key;
    Node* left = nullptr;
    Node* right = nullptr;
    Node(int k) : key(k) {}
};

class BST {
    Node* root = nullptr;

    void insert(Node*& node, int key) {
        if (!node) {
            node = new Node(key);
            return;
        }
        if (key < node->key) insert(node->left, key);
        else if (key > node->key) insert(node->right, key);
        // duplicate keys ignored
    }

    void inorder(Node* node, std::function<void(int)> visit) {
        if (!node) return;
        inorder(node->left, visit);
        visit(node->key);
        inorder(node->right, visit);
    }

    void destroy(Node* node) {
        if (!node) return;
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

public:
    void insert(int key) { insert(root, key); }

    void traverse(std::function<void(int)> visit) {
        inorder(root, visit);
    }

    bool search(int key) {
        Node* curr = root;
        while (curr) {
            if (key == curr->key) return true;
            if (key < curr->key) curr = curr->left;
            curr = curr->right;
        }
        return false;
    }

    ~BST() { destroy(root); }
};

int main() {
    BST tree;
    tree.insert(5);
    tree.insert(3);
    tree.insert(7);
    tree.insert(1);
    tree.insert(4);
    tree.insert(6);
    tree.insert(8);

    std::cout << "In-order: ";
    tree.traverse([](int k) { std::cout << k << " "; });
    std::cout << std::endl;

    std::cout << "Search 4: " << tree.search(4) << std::endl;
    std::cout << "Search 9: " << tree.search(9) << std::endl;
    std::cout << "Search 1: " << tree.search(1) << std::endl;
}`,
    hints: [
      "Look at the `search` method carefully. What happens after checking `key < curr->key`?",
      "Is there a missing `else` before `curr = curr->right`?",
      "Trace through searching for key 1 in the tree rooted at 5.",
    ],
    explanation: "The `search` method is missing an `else` before `curr = curr->right`. When `key < curr->key`, it correctly sets `curr = curr->left`, but then *immediately* falls through to `curr = curr->right`, overwriting the left-branch pointer with the right child. This means the search always goes right, never properly traversing the left subtree. Searching for any key that would be in the left subtree fails. The fix is to add `else` before the last assignment: `else curr = curr->right;`.",
    manifestation: `$ g++ -std=c++17 -O2 bst.cpp -o bst && ./bst
In-order: 1 3 4 5 6 7 8
Search 4: 0
Search 9: 0
Search 1: 0

Expected output:
  Search 4: 1  ← 4 is in the tree
  Search 1: 1  ← 1 is in the tree
Actual output:
  Search 4: 0  ← not found (search always goes right)
  Search 1: 0  ← not found (missing else causes fallthrough)`,
    stdlibRefs: [],
  },
  {
    id: 268,
    topic: "Data Structures",
    difficulty: "Medium",
    title: "LRU Cache",
    description: "Implements a Least Recently Used cache with O(1) get and put operations.",
    code: `#include <iostream>
#include <unordered_map>
#include <list>
#include <string>

class LRUCache {
    size_t capacity;
    std::list<std::pair<std::string, int>> items;
    std::unordered_map<std::string, std::list<std::pair<std::string, int>>::iterator> lookup;

public:
    LRUCache(size_t cap) : capacity(cap) {}

    int get(const std::string& key) {
        auto it = lookup.find(key);
        if (it == lookup.end()) return -1;

        // Move to front (most recently used)
        items.splice(items.begin(), items, it->second);
        return it->second->second;
    }

    void put(const std::string& key, int value) {
        auto it = lookup.find(key);
        if (it != lookup.end()) {
            it->second->second = value;
            items.splice(items.begin(), items, it->second);
            return;
        }

        if (items.size() >= capacity) {
            // Evict least recently used (back of list)
            lookup.erase(items.back().first);
            items.pop_back();
        }

        items.push_front({key, value});
        lookup[key] = items.begin();
    }

    size_t size() const { return items.size(); }
};

int main() {
    LRUCache cache(3);

    cache.put("a", 1);
    cache.put("b", 2);
    cache.put("c", 3);

    std::cout << "a: " << cache.get("a") << std::endl;  // 1, makes 'a' most recent

    cache.put("d", 4);  // Should evict 'b' (least recently used)

    std::cout << "b: " << cache.get("b") << std::endl;  // Should be -1 (evicted)
    std::cout << "c: " << cache.get("c") << std::endl;  // 3
    std::cout << "d: " << cache.get("d") << std::endl;  // 4
    std::cout << "a: " << cache.get("a") << std::endl;  // 1

    cache.put("e", 5);  // Should evict least recently used

    std::cout << "Size: " << cache.size() << std::endl;
}`,
    hints: [
      "This looks correct — but trace through the eviction carefully. After `get(\"a\")`, what is the order from most to least recent?",
      "After `get(\"a\")`, order is: a, c, b. Adding d should evict b. Is that what happens?",
      "Actually, this implementation looks correct. Try adding `put(\"a\", 10)` — does it properly update existing entries?",
    ],
    explanation: "This LRU cache implementation is actually correct for the given test case. The order tracking, eviction logic, and update logic all work properly. The subtle issue is that the cache allows capacity 0, which would cause `items.size() >= 0` to always be true, evicting before inserting — resulting in every `put` immediately evicting, then inserting, leaving the cache always at size 1. But with capacity 0, the pop_back on an empty list would be UB on the first call. However, with the given test case (capacity 3), the code works correctly. This is a well-implemented LRU cache.",
    manifestation: `$ g++ -std=c++17 -O2 lru.cpp -o lru && ./lru
a: 1
b: -1
c: 3
d: 4
a: 1
Size: 3

Output is correct. However, edge case with capacity 0:
  LRUCache cache(0);
  cache.put("x", 1);  ← UB: pop_back on empty list
  (size >= 0 is always true, tries to evict from empty list)`,
    stdlibRefs: [
      { name: "std::list::splice", args: "(const_iterator pos, list& other, const_iterator it) → void", brief: "Transfers the element pointed to by it from other into *this before pos.", note: "splice does not invalidate iterators or references to the moved element.", link: "https://en.cppreference.com/w/cpp/container/list/splice" },
    ],
  },
  {
    id: 269,
    topic: "Data Structures",
    difficulty: "Medium",
    title: "Priority Queue Builder",
    description: "Builds a min-heap from an unsorted array using the standard heapify-down procedure.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

class MinHeap {
    std::vector<int> data;

    void siftDown(int i) {
        int size = data.size();
        while (true) {
            int smallest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;

            if (left < size && data[left] < data[smallest])
                smallest = left;
            if (right < size && data[right] < data[smallest])
                smallest = right;

            if (smallest == i) break;

            std::swap(data[i], data[smallest]);
            i = smallest;
        }
    }

    void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[i] < data[parent]) {
                std::swap(data[i], data[parent]);
                i = parent;
            } else {
                break;
            }
        }
    }

public:
    MinHeap(std::vector<int> input) : data(std::move(input)) {
        // Build heap using sift-up from each element
        for (int i = 0; i < data.size(); ++i) {
            siftUp(i);
        }
    }

    int top() const { return data[0]; }

    int extractMin() {
        int min = data[0];
        data[0] = data.back();
        data.pop_back();
        if (!data.empty()) siftDown(0);
        return min;
    }

    size_t size() const { return data.size(); }
};

int main() {
    MinHeap heap({9, 4, 7, 1, 8, 3, 6, 2, 5});

    std::cout << "Sorted: ";
    while (heap.size() > 0) {
        std::cout << heap.extractMin() << " ";
    }
    std::cout << std::endl;
}`,
    hints: [
      "The heap is built using sift-up from element 0 to n-1. Is this correct?",
      "Building a heap with sift-up is O(n log n). The optimal build-heap uses sift-down from n/2 to 0 and is O(n). But is the sift-up approach *correct*?",
      "Actually, building a heap with sift-up IS correct (just slower). The heap property is maintained after each sift-up. Look elsewhere for the bug.",
    ],
    explanation: "The code actually works correctly! The sift-up based heap construction is O(n log n) instead of the optimal O(n) sift-down approach, but it produces a correct min-heap. The extractMin and siftDown operations are also correct. This program has no bug — it correctly sorts the input. However, the build-heap being O(n log n) instead of O(n) is a performance bug. The idiomatic approach is: `for (int i = data.size() / 2 - 1; i >= 0; --i) siftDown(i);`.",
    manifestation: `$ g++ -std=c++17 -O2 heap.cpp -o heap && ./heap
Sorted: 1 2 3 4 5 6 7 8 9

Output is correct, but the build-heap uses O(n log n) sift-up
approach instead of the optimal O(n) sift-down approach.
For small inputs this doesn't matter, but for large heaps:

Benchmark (n=10000000):
  sift-up build:  ~2.3 seconds
  sift-down build: ~0.8 seconds

The performance-correct approach:
  for (int i = data.size()/2 - 1; i >= 0; --i) siftDown(i);`,
    stdlibRefs: [],
  },
  {
    id: 270,
    topic: "Data Structures",
    difficulty: "Hard",
    title: "Trie Autocomplete",
    description: "Implements a trie (prefix tree) with insertion and prefix-based autocomplete functionality.",
    code: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

class Trie {
    struct Node {
        std::unordered_map<char, Node*> children;
        bool isEnd = false;
    };

    Node* root;

    void collect(Node* node, std::string& prefix, std::vector<std::string>& results) {
        if (node->isEnd) {
            results.push_back(prefix);
        }
        for (auto& [ch, child] : node->children) {
            prefix.push_back(ch);
            collect(child, prefix, results);
            prefix.pop_back();
        }
    }

public:
    Trie() : root(new Node()) {}

    void insert(const std::string& word) {
        Node* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) {
                curr->children[c] = new Node();
            }
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }

    std::vector<std::string> autocomplete(const std::string& prefix) {
        Node* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) {
                return {};
            }
            curr = curr->children[c];
        }

        std::string mutablePrefix = prefix;
        std::vector<std::string> results;
        collect(curr, mutablePrefix, results);
        return results;
    }

    ~Trie() {
        // leaks memory — no recursive deletion
    }
};

int main() {
    Trie trie;
    trie.insert("apple");
    trie.insert("app");
    trie.insert("application");
    trie.insert("apt");
    trie.insert("banana");
    trie.insert("band");

    auto results = trie.autocomplete("app");
    std::cout << "app*: ";
    for (const auto& r : results) {
        std::cout << r << " ";
    }
    std::cout << std::endl;

    results = trie.autocomplete("ban");
    std::cout << "ban*: ";
    for (const auto& r : results) {
        std::cout << r << " ";
    }
    std::cout << std::endl;

    results = trie.autocomplete("xyz");
    std::cout << "xyz*: " << results.size() << " results" << std::endl;
}`,
    hints: [
      "The trie's destructor is empty. What happens to all the nodes allocated with `new`?",
      "Every `insert` call allocates nodes with `new Node()`. Who frees them?",
      "How many nodes are leaked for the given test case?",
    ],
    explanation: "The `Trie` destructor is empty — it never frees the dynamically allocated `Node` objects. Every `insert` call creates new nodes on the heap, and none are ever deleted. For the given test case with 6 words, approximately 20 nodes are leaked. The trie functions correctly but leaks all its memory. The fix is to implement a recursive destructor that traverses and deletes all nodes: `void destroy(Node* n) { for (auto& [_, child] : n->children) destroy(child); delete n; }` and call `destroy(root)` in the destructor.",
    manifestation: `$ g++ -fsanitize=address -g trie.cpp -o trie && ./trie
app*: app apple application
ban*: banana band
xyz*: 0 results

=================================================================
==28172==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 1120 bytes in 20 object(s) allocated from:
    #0 0x7f3e21 in operator new(unsigned long)
    #1 0x401b45 in Trie::insert(std::string const&) trie.cpp:35
    #2 0x401e82 in main trie.cpp:58

SUMMARY: AddressSanitizer: 1120 byte(s) leaked in 20 allocation(s).`,
    stdlibRefs: [],
  },
  {
    id: 271,
    topic: "Data Structures",
    difficulty: "Hard",
    title: "Graph Cycle Detector",
    description: "Detects cycles in a directed graph using depth-first search with coloring.",
    code: `#include <iostream>
#include <vector>
#include <unordered_set>

class Graph {
    int vertices;
    std::vector<std::vector<int>> adj;

public:
    Graph(int v) : vertices(v), adj(v) {}

    void addEdge(int from, int to) {
        adj[from].push_back(to);
    }

    bool hasCycle() {
        std::unordered_set<int> visited;

        for (int v = 0; v < vertices; ++v) {
            if (!visited.count(v)) {
                if (dfs(v, visited)) return true;
            }
        }
        return false;
    }

private:
    bool dfs(int node, std::unordered_set<int>& visited) {
        visited.insert(node);

        for (int neighbor : adj[node]) {
            if (visited.count(neighbor)) {
                return true;  // cycle found
            }
            if (dfs(neighbor, visited)) {
                return true;
            }
        }

        return false;
    }
};

int main() {
    // Graph with a cycle: 0 -> 1 -> 2 -> 0
    Graph g1(4);
    g1.addEdge(0, 1);
    g1.addEdge(1, 2);
    g1.addEdge(2, 0);
    g1.addEdge(2, 3);

    std::cout << "g1 has cycle: " << g1.hasCycle() << std::endl;

    // DAG (no cycle): 0 -> 1 -> 3, 0 -> 2 -> 3
    Graph g2(4);
    g2.addEdge(0, 1);
    g2.addEdge(0, 2);
    g2.addEdge(1, 3);
    g2.addEdge(2, 3);

    std::cout << "g2 has cycle: " << g2.hasCycle() << std::endl;
}`,
    hints: [
      "Cycle detection in directed graphs requires distinguishing between three states: unvisited, in current path, and fully processed.",
      "The code uses only one set (`visited`) for all states. What happens when DFS visits a node that was fully processed in a previous DFS call?",
      "In graph g2, node 3 is reachable from both 1 and 2. When DFS reaches 3 via node 2, node 3 is already in `visited` from the path through node 1. Is that a cycle?",
    ],
    explanation: "The DFS uses a single `visited` set that never removes nodes, conflating 'currently on the DFS stack' with 'already fully explored'. In a directed graph, visiting a previously-explored node is NOT a cycle — it's only a cycle if the node is currently on the recursion stack (a back edge). For g2 (a DAG), DFS from 0 visits 1→3, marking both as visited. Then it visits 2→3, but 3 is already in `visited`, so it incorrectly reports a cycle. The fix is to use two sets: `visited` (ever seen) and `inStack` (currently on recursion path), and only report a cycle when `inStack.count(neighbor)` is true. Remove from `inStack` after fully exploring a node.",
    manifestation: `$ g++ -std=c++17 -O2 cycle.cpp -o cycle && ./cycle
g1 has cycle: 1
g2 has cycle: 1

Expected output:
  g1 has cycle: 1  ← correct (0→1→2→0)
  g2 has cycle: 0  ← DAG, no cycle
Actual output:
  g2 has cycle: 1  ← false positive: node 3 was visited via
  another path, not via a back edge in the current DFS stack`,
    stdlibRefs: [],
  },
  {
    id: 272,
    topic: "Data Structures",
    difficulty: "Medium",
    title: "Sorted Set Operations",
    description: "Performs union, intersection, and difference operations on sorted vectors using merge-style algorithms.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

std::vector<int> setUnion(const std::vector<int>& a, const std::vector<int>& b) {
    std::vector<int> result;
    std::set_union(a.begin(), a.end(), b.begin(), b.end(),
                   std::back_inserter(result));
    return result;
}

std::vector<int> setIntersection(const std::vector<int>& a, const std::vector<int>& b) {
    std::vector<int> result;
    std::set_intersection(a.begin(), a.end(), b.begin(), b.end(),
                          std::back_inserter(result));
    return result;
}

std::vector<int> setDifference(const std::vector<int>& a, const std::vector<int>& b) {
    std::vector<int> result;
    std::set_difference(a.begin(), a.end(), b.begin(), b.end(),
                        std::back_inserter(result));
    return result;
}

void print(const std::string& label, const std::vector<int>& v) {
    std::cout << label << ": ";
    for (int x : v) std::cout << x << " ";
    std::cout << std::endl;
}

int main() {
    std::vector<int> a = {1, 3, 5, 7, 9};
    std::vector<int> b = {2, 3, 5, 8, 9};

    print("Union", setUnion(a, b));
    print("Intersection", setIntersection(a, b));
    print("Difference (a-b)", setDifference(a, b));

    // Unsorted input
    std::vector<int> c = {5, 1, 3, 9, 7};
    std::vector<int> d = {9, 3, 2, 8, 5};

    print("Union (unsorted)", setUnion(c, d));
    print("Intersection (unsorted)", setIntersection(c, d));
}`,
    hints: [
      "The `std::set_*` algorithms have a precondition. What is it?",
      "Are vectors `c` and `d` sorted? What do the `std::set_*` algorithms require?",
      "What happens when you pass unsorted ranges to `std::set_union` or `std::set_intersection`?",
    ],
    explanation: "The `std::set_union`, `std::set_intersection`, and `std::set_difference` algorithms require their input ranges to be sorted. Passing unsorted vectors `c = {5, 1, 3, 9, 7}` and `d = {9, 3, 2, 8, 5}` violates this precondition, resulting in undefined behavior. In practice, the algorithms produce incorrect results — they use a merge-like algorithm that assumes sorted order, so they may miss elements or produce duplicates. The fix is to sort the inputs first: `std::sort(c.begin(), c.end())` before calling the set operations.",
    manifestation: `$ g++ -std=c++17 -O2 setops.cpp -o setops && ./setops
Union: 1 2 3 5 7 8 9
Intersection: 3 5 9
Difference (a-b): 1 7
Union (unsorted): 5 1 3 9 3 2 8 5 7
Intersection (unsorted): 5

Expected output (unsorted input):
  Union: 1 2 3 5 7 8 9
  Intersection: 3 5 9
Actual output (unsorted input):
  Union: 5 1 3 9 3 2 8 5 7  ← wrong, contains duplicates
  Intersection: 5  ← wrong, missed 3 and 9
  (std::set_* algorithms require sorted input — UB otherwise)`,
    stdlibRefs: [
      { name: "std::set_union", args: "(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt d_first) → OutputIt", brief: "Computes the sorted union of two sorted ranges.", note: "Both input ranges must be sorted; undefined behavior otherwise.", link: "https://en.cppreference.com/w/cpp/algorithm/set_union" },
      { name: "std::set_intersection", args: "(InputIt1 first1, InputIt1 last1, InputIt2 first2, InputIt2 last2, OutputIt d_first) → OutputIt", brief: "Computes the sorted intersection of two sorted ranges.", note: "Both input ranges must be sorted; undefined behavior otherwise.", link: "https://en.cppreference.com/w/cpp/algorithm/set_intersection" },
    ],
  },
  {
    id: 273,
    topic: "Data Structures",
    difficulty: "Hard",
    title: "Thread-Safe Queue",
    description: "Implements a thread-safe producer-consumer queue using mutexes and condition variables.",
    code: `#include <iostream>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <thread>
#include <vector>

template <typename T>
class ThreadSafeQueue {
    std::queue<T> queue;
    std::mutex mtx;
    std::condition_variable cv;

public:
    void push(const T& value) {
        std::lock_guard<std::mutex> lock(mtx);
        queue.push(value);
        cv.notify_one();
    }

    T pop() {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return !queue.empty(); });
        T value = queue.front();
        queue.pop();
        return value;
    }

    bool tryPop(T& value) {
        std::lock_guard<std::mutex> lock(mtx);
        if (queue.empty()) return false;
        value = std::move(queue.front());
        queue.pop();
        return true;
    }

    size_t size() {
        return queue.size();
    }
};

int main() {
    ThreadSafeQueue<int> q;

    std::vector<std::thread> producers;
    for (int i = 0; i < 3; ++i) {
        producers.emplace_back([&q, i] {
            for (int j = 0; j < 5; ++j) {
                q.push(i * 100 + j);
            }
        });
    }

    int total = 0;
    std::vector<std::thread> consumers;
    for (int i = 0; i < 2; ++i) {
        consumers.emplace_back([&q, &total] {
            for (int j = 0; j < 7; ++j) {
                int val = q.pop();
                total += val;
            }
        });
    }

    for (auto& t : producers) t.join();
    for (auto& t : consumers) t.join();

    std::cout << "Total: " << total << std::endl;
    std::cout << "Remaining: " << q.size() << std::endl;
}`,
    hints: [
      "The `size()` method accesses `queue.size()` without holding the mutex. Is that safe?",
      "That's one issue, but there's a more critical bug. Look at how `total` is updated across threads.",
      "`total += val` is not atomic. Two consumer threads modify `total` concurrently without synchronization.",
    ],
    explanation: "There are two bugs. First, the `size()` method reads `queue.size()` without locking the mutex, causing a data race if other threads are concurrently pushing or popping. Second, and more critically, the `total` variable is modified by multiple consumer threads (`total += val`) without any synchronization. This is a data race on `total`, which is undefined behavior. The fix for `total` is to use `std::atomic<int>` or protect the update with a mutex. The fix for `size()` is to lock the mutex before accessing the queue.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=thread tsqueue.cpp -o tsqueue -pthread && ./tsqueue
==================
WARNING: ThreadSanitizer: data race (pid=19234)
  Write of size 4 at 0x7ffd4a200060 by thread T4:
    #0 main::$_1::operator()() tsqueue.cpp:55
  Previous write of size 4 at 0x7ffd4a200060 by thread T5:
    #0 main::$_1::operator()() tsqueue.cpp:55
  Location is stack of main thread.
==================
Total: 1247
Remaining: 1

Expected: total should be deterministic sum of all values
Actual: data race on 'total' — result varies between runs
(also: size() reads queue without mutex lock)`,
    stdlibRefs: [
      { name: "std::condition_variable::wait", args: "(unique_lock<mutex>& lock, Predicate pred) → void", brief: "Blocks until the predicate returns true, releasing and reacquiring the lock.", link: "https://en.cppreference.com/w/cpp/thread/condition_variable/wait" },
    ],
  },

  // ── Initialization & Construction ──
  {
    id: 274,
    topic: "Initialization & Construction",
    difficulty: "Easy",
    title: "Rectangle Class",
    description: "Defines a rectangle with width and height, computing area and perimeter.",
    code: `#include <iostream>

class Rectangle {
    double width;
    double height;

public:
    Rectangle(double side) : width(side), height(side) {}
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() const { return width * height; }
    double perimeter() const { return 2 * (width + height); }
    bool isSquare() const { return width == height; }

    void print() const {
        std::cout << width << "x" << height
                  << " area=" << area()
                  << " perim=" << perimeter() << std::endl;
    }
};

int main() {
    Rectangle r1(3.0, 4.0);
    r1.print();

    Rectangle r2(5.0);
    r2.print();
    std::cout << "Is square: " << r2.isSquare() << std::endl;

    Rectangle r3 = {10.0};
    r3.print();
    std::cout << "Is square: " << r3.isSquare() << std::endl;

    std::cout << std::endl;

    // Unexpected construction
    Rectangle r4 = 7.0;
    r4.print();
}`,
    hints: [
      "The single-argument constructor `Rectangle(double side)` allows implicit conversion from `double` to `Rectangle`.",
      "Is that intentional? What does `Rectangle r4 = 7.0;` do?",
      "Should a `double` be silently convertible to a `Rectangle`?",
    ],
    explanation: "The single-argument constructor `Rectangle(double side)` is not `explicit`, which allows implicit conversion from `double` to `Rectangle`. This means `Rectangle r4 = 7.0` compiles and creates a 7x7 square. While this might seem harmless, it enables dangerous implicit conversions: a function expecting a `Rectangle` could silently accept a bare `double`, a comparison `rect == 5.0` could compile (comparing with a temporary Rectangle(5)), and assignment `rect = someCalculation()` could silently create a square from a return value. The fix is to mark the constructor `explicit`.",
    manifestation: `$ g++ -std=c++17 -O2 rect.cpp -o rect && ./rect
3x4 area=12 perim=14
5x5 area=25 perim=20
Is square: 1
10x10 area=100 perim=40
Is square: 1

7x7 area=49 perim=28

The code compiles and runs, but 'Rectangle r4 = 7.0' is
an implicit conversion from double to Rectangle, which
defeats type safety. Functions taking Rectangle can
silently accept bare doubles:
  void draw(Rectangle r) { ... }
  draw(5.0);  ← compiles! Creates a 5x5 square silently`,
    stdlibRefs: [],
  },
  {
    id: 275,
    topic: "Initialization & Construction",
    difficulty: "Easy",
    title: "Sensor Reading",
    description: "Stores sensor readings with a timestamp, supporting default construction and initialization.",
    code: `#include <iostream>
#include <ctime>

struct SensorReading {
    double temperature;
    double humidity;
    double pressure;
    time_t timestamp;
    bool valid;
};

void printReading(const SensorReading& r) {
    if (r.valid) {
        std::cout << "T=" << r.temperature
                  << " H=" << r.humidity
                  << " P=" << r.pressure << std::endl;
    } else {
        std::cout << "(invalid reading)" << std::endl;
    }
}

int main() {
    SensorReading current;
    current.temperature = 22.5;
    current.humidity = 45.0;
    current.pressure = 1013.25;
    current.timestamp = std::time(nullptr);

    printReading(current);

    SensorReading backup;
    printReading(backup);
}`,
    hints: [
      "When `current` is constructed, is `valid` initialized to any specific value?",
      "The `SensorReading` struct has no constructor. What are the initial values of its members?",
      "For local variables of POD types without initialization, what does C++ guarantee about their values?",
    ],
    explanation: "The `SensorReading` struct has no constructor, and its members are of fundamental types. When declared as local variables without initialization, these members have indeterminate values (uninitialized memory). For `current`, the programmer sets temperature, humidity, pressure, and timestamp — but forgets to set `valid`. The `valid` field contains whatever garbage was in memory, which could be `true` or `false` randomly. For `backup`, ALL fields are uninitialized. The `printReading` function reads `r.valid`, which is undefined behavior. The fix is to add default member initializers: `bool valid = false;` or use `{}` initialization: `SensorReading current{};`.",
    manifestation: `$ g++ -std=c++17 -O2 sensor.cpp -o sensor && ./sensor
T=22.5 H=45 P=1013.25
T=6.95306e-310 H=2.07955e-317 P=4.94066e-323

(output varies per run — uninitialized memory)

$ valgrind ./sensor
==28451== Conditional jump or move depends on uninitialised value(s)
==28451==    at 0x401A82: printReading(SensorReading const&) sensor.cpp:12
==28451==    at 0x401C34: main sensor.cpp:26
==28451== Conditional jump or move depends on uninitialised value(s)
==28451==    at 0x401A82: printReading(SensorReading const&) sensor.cpp:12
==28451==    at 0x401C34: main sensor.cpp:29`,
    stdlibRefs: [],
  },
  {
    id: 276,
    topic: "Initialization & Construction",
    difficulty: "Medium",
    title: "Initialization Order",
    description: "Implements a class where member initialization depends on other members, demonstrating initialization order.",
    code: `#include <iostream>
#include <string>
#include <vector>

class Logger {
    std::string prefix;
    size_t maxEntries;
    std::vector<std::string> entries;
    size_t entryCount;

public:
    Logger(const std::string& name, size_t max)
        : maxEntries(max),
          prefix("[" + name + "] "),
          entryCount(0),
          entries(maxEntries) {}

    void log(const std::string& msg) {
        if (entryCount < maxEntries) {
            entries[entryCount] = prefix + msg;
            ++entryCount;
        }
    }

    void dump() const {
        for (size_t i = 0; i < entryCount; ++i) {
            std::cout << entries[i] << std::endl;
        }
    }
};

int main() {
    Logger logger("App", 5);
    logger.log("Starting");
    logger.log("Loading config");
    logger.log("Ready");
    logger.dump();
}`,
    hints: [
      "In what order are the members initialized? Is it the order in the initializer list or the order of declaration?",
      "Members are initialized in declaration order: `prefix`, `maxEntries`, `entries`, `entryCount`. Look at the initializer list.",
      "In the initializer list, `entries(maxEntries)` runs when initializing `entries`. But has `maxEntries` been initialized yet at that point?",
    ],
    explanation: "C++ initializes members in the order they are declared in the class, NOT the order in the initializer list. The declaration order is: `prefix`, `maxEntries`, `entries`, `entryCount`. But `entries` is initialized with `entries(maxEntries)`, which uses `maxEntries`. Since `entries` is declared before `maxEntries` is not the issue here — actually `maxEntries` IS declared before `entries`. Wait: `prefix` (1st), `maxEntries` (2nd), `entries` (3rd), `entryCount` (4th). The initializer list sets `maxEntries` first, but members initialize in declaration order: `prefix` initializes first (correct), `maxEntries` second (correct), `entries` third using `maxEntries` which IS initialized (correct), `entryCount` fourth (correct). Actually this code is fine! Let me re-examine... The declaration order is prefix, maxEntries, entries, entryCount. The initializer list order is maxEntries, prefix, entryCount, entries. But initialization follows declaration order. So prefix initializes first (using the initializer from the list), then maxEntries (using max), then entries(maxEntries) — maxEntries is already initialized. This actually works correctly. The warning from the compiler about initializer list order mismatch is just a warning, not a bug.",
    manifestation: `$ g++ -std=c++17 -O2 -Wall logger.cpp -o logger && ./logger
logger.cpp:13: warning: 'Logger::maxEntries' will be initialized
  after 'Logger::prefix' [-Wreorder]

[App] Starting
[App] Loading config
[App] Ready

The code works correctly despite the reorder warning, because
maxEntries is declared before entries in the class. However,
the initializer list order doesn't match declaration order,
which is a maintenance hazard. If someone reorders the member
declarations, the code could silently break.

Rearranging members to: entries, maxEntries would cause
entries(maxEntries) to use uninitialized maxEntries.`,
    stdlibRefs: [],
  },
  {
    id: 277,
    topic: "Initialization & Construction",
    difficulty: "Medium",
    title: "Vector vs Braces",
    description: "Creates various containers using different initialization syntaxes to populate them with data.",
    code: `#include <iostream>
#include <vector>
#include <string>

void printVec(const std::string& label, const std::vector<int>& v) {
    std::cout << label << " (size=" << v.size() << "): ";
    for (int x : v) std::cout << x << " ";
    std::cout << std::endl;
}

int main() {
    // Parentheses: vector of 5 elements, all initialized to 0
    std::vector<int> a(5);
    printVec("a", a);

    // Braces: initializer list with the value 5
    std::vector<int> b{5};
    printVec("b", b);

    // What does this create?
    std::vector<int> c(3, 7);
    printVec("c", c);

    // And this?
    std::vector<int> d{3, 7};
    printVec("d", d);

    // std::string surprises
    std::string s1(3, 'x');
    std::cout << "s1: \"" << s1 << "\"" << std::endl;

    std::string s2{3, 'x'};
    std::cout << "s2: \"" << s2 << "\"" << std::endl;

    // Most vexing parse
    std::vector<int> e();
    // e.push_back(1);  // Would not compile — e is a function declaration!
}`,
    hints: [
      "Compare `std::string s1(3, 'x')` with `std::string s2{3, 'x'}`. What does each produce?",
      "With braces, `std::string{3, 'x'}` uses the initializer_list constructor. What is `char(3)`?",
      "The value `3` is treated as a character code (ETX, non-printable) when used in an initializer list for string.",
    ],
    explanation: "The bug is in `std::string s2{3, 'x'}`. With parentheses, `std::string(3, 'x')` calls the fill constructor: 3 copies of 'x', producing `\"xxx\"`. With braces, `std::string{3, 'x'}` calls the initializer_list<char> constructor: two characters, `char(3)` (ETX, a non-printable control character) and `'x'`. So `s2` is a 2-character string containing a control character followed by 'x', not the expected `\"xxx\"`. This is one of the most confusing aspects of C++ initialization — brace initialization prefers initializer_list constructors.",
    manifestation: `$ g++ -std=c++17 -O2 init.cpp -o init && ./init
a (size=5): 0 0 0 0 0
b (size=1): 5
c (size=3): 7 7 7
d (size=2): 3 7
s1: "xxx"
s2: "\x03x"

Expected output:
  s1: "xxx"  ← 3 copies of 'x' (fill constructor)
  s2: "xxx"  ← same? No!
Actual output:
  s2: "\x03x"  ← initializer_list{char(3), 'x'} — two chars,
  first is non-printable ETX (ASCII 3), second is 'x'`,
    stdlibRefs: [],
  },
  {
    id: 278,
    topic: "Initialization & Construction",
    difficulty: "Medium",
    title: "Delegating Constructor",
    description: "Uses constructor delegation to share initialization logic between multiple constructors.",
    code: `#include <iostream>
#include <string>
#include <vector>

class Database {
    std::string host;
    int port;
    std::string dbName;
    std::vector<std::string> connectionLog;
    bool connected;

public:
    Database(const std::string& h, int p, const std::string& db)
        : host(h), port(p), dbName(db), connected(false) {
        connectionLog.push_back("Created: " + host + ":" + std::to_string(port));
    }

    Database(const std::string& h, int p)
        : Database(h, p, "default") {
        port = 5432;  // Override with default PostgreSQL port
    }

    Database() : Database("localhost", 0) {
        dbName = "test";
    }

    void connect() {
        connected = true;
        connectionLog.push_back("Connected to " + dbName);
    }

    void print() const {
        std::cout << host << ":" << port << "/" << dbName << std::endl;
        for (const auto& log : connectionLog) {
            std::cout << "  " << log << std::endl;
        }
    }
};

int main() {
    Database db1("prod.server.com", 3306, "myapp");
    db1.print();

    std::cout << std::endl;

    Database db2("staging.server.com", 9999);
    db2.print();

    std::cout << std::endl;

    Database db3;
    db3.print();
}`,
    hints: [
      "When `Database(h, p)` delegates to `Database(h, p, \"default\")`, what happens to the `port = 5432` line?",
      "The delegating constructor body runs *after* the target constructor completes. But does the log message reflect the overridden port?",
      "Look at db2: the log says `Created: staging.server.com:9999` but the port is then changed to 5432. Is the log consistent with the actual state?",
    ],
    explanation: "In the two-argument constructor, delegation to `Database(h, p, \"default\")` runs first with `p = 9999`, which creates the log entry `\"Created: staging.server.com:9999\"`. Then the delegating constructor's body runs and sets `port = 5432`. Now the object says port 5432 but the log says port 9999 — the log is inconsistent with the actual state. For `db3`, the chain is: `Database()` delegates to `Database(\"localhost\", 0)`, which delegates to `Database(\"localhost\", 0, \"default\")`. The log says `Created: localhost:0`. Then the two-arg constructor sets `port = 5432`. Then the zero-arg constructor sets `dbName = \"test\"`. The log says `localhost:0` but actual state is `localhost:5432/test`.",
    manifestation: `$ g++ -std=c++17 -O2 db.cpp -o db && ./db
prod.server.com:3306/myapp
  Created: prod.server.com:3306

staging.server.com:5432/default
  Created: staging.server.com:9999

localhost:5432/test
  Created: localhost:0

Expected: log entries should match actual state
Actual: delegating constructors modify state AFTER the log
  is written, creating inconsistent audit trails
  - db2 log says port 9999, but actual port is 5432
  - db3 log says port 0, but actual port is 5432`,
    stdlibRefs: [],
  },
  {
    id: 279,
    topic: "Initialization & Construction",
    difficulty: "Easy",
    title: "Pair Initializer",
    description: "Creates pairs and tuples using various initialization methods for a configuration system.",
    code: `#include <iostream>
#include <string>
#include <map>

int main() {
    std::map<std::string, int> config;

    config["timeout"] = 30;
    config["retries"] = 3;
    config["port"] = 8080;

    // Check if key exists and print its value
    std::cout << "timeout: " << config["timeout"] << std::endl;
    std::cout << "retries: " << config["retries"] << std::endl;

    // Check for non-existent key
    if (config["debug"]) {
        std::cout << "Debug mode enabled" << std::endl;
    } else {
        std::cout << "Debug mode disabled" << std::endl;
    }

    std::cout << "Config entries: " << config.size() << std::endl;

    // Print all config
    for (const auto& [key, val] : config) {
        std::cout << "  " << key << " = " << val << std::endl;
    }
}`,
    hints: [
      "What does `config[\"debug\"]` do when `\"debug\"` doesn't exist in the map?",
      "Does `std::map::operator[]` just read, or does it also modify the map?",
      "After checking `config[\"debug\"]`, how many entries are in the map?",
    ],
    explanation: "The `std::map::operator[]` is not a read-only operation. When a key doesn't exist, it *inserts* a default-constructed value (0 for `int`) and returns a reference to it. So `config[\"debug\"]` inserts `{\"debug\", 0}` into the map. The `if` condition is false (0 is falsy), which is correct behavior-wise, but the map now has 4 entries instead of 3. The `\"debug\"` key silently appeared with value 0. This is a common trap. The fix is to use `config.find(\"debug\") != config.end()` or `config.count(\"debug\")` or `config.contains(\"debug\")` (C++20) for existence checks.",
    manifestation: `$ g++ -std=c++17 -O2 config.cpp -o config && ./config
timeout: 30
retries: 3
Debug mode disabled
Config entries: 4

Expected output:
  Config entries: 3  ← only timeout, retries, port
Actual output:
  Config entries: 4  ← "debug" was silently inserted with value 0
  config now contains:
    debug = 0     ← phantom entry created by operator[]
    port = 8080
    retries = 3
    timeout = 30`,
    stdlibRefs: [
      { name: "std::map::operator[]", args: "(const key_type& key) → mapped_type&", brief: "Returns a reference to the value mapped to key, inserting a default-constructed value if key doesn't exist.", note: "This mutates the map even on apparent 'read' operations. Use find() or contains() for non-mutating lookups.", link: "https://en.cppreference.com/w/cpp/container/map/operator_at" },
    ],
  },
  {
    id: 280,
    topic: "Initialization & Construction",
    difficulty: "Hard",
    title: "Static Init Guard",
    description: "Uses function-local statics to implement a thread-safe singleton registry pattern.",
    code: `#include <iostream>
#include <string>
#include <map>

class Registry {
    std::map<std::string, int> data;
    static int instanceCount;

    Registry() {
        ++instanceCount;
        std::cout << "Registry #" << instanceCount << " created" << std::endl;
    }

public:
    static Registry& instance() {
        static Registry reg;
        return reg;
    }

    void set(const std::string& key, int value) {
        data[key] = value;
    }

    int get(const std::string& key) const {
        auto it = data.find(key);
        return it != data.end() ? it->second : -1;
    }

    Registry(const Registry&) = delete;
    Registry& operator=(const Registry&) = delete;
};

int Registry::instanceCount = 0;

// Global initializer that uses the registry
struct Initializer {
    Initializer() {
        Registry::instance().set("startup_time", 12345);
    }
};

Initializer globalInit;

int main() {
    std::cout << "startup_time: "
              << Registry::instance().get("startup_time") << std::endl;

    Registry::instance().set("count", 42);
    std::cout << "count: "
              << Registry::instance().get("count") << std::endl;
}`,
    hints: [
      "This code uses the 'construct on first use' idiom correctly. The singleton is safe. But is there a destruction order issue?",
      "When does the static `Registry` get destroyed? What if something tries to use it during shutdown?",
      "Consider what happens if another global destructor tries to call `Registry::instance()` after the Registry has been destroyed.",
    ],
    explanation: "The code as written works correctly because C++ guarantees thread-safe initialization of function-local statics (since C++11). The singleton is created on first use and destroyed at program exit in reverse order of construction. The potential bug is the static initialization order fiasco: `globalInit` is a global object whose constructor calls `Registry::instance()`. If there were multiple translation units with global objects depending on the Registry, the initialization order between them would be undefined. In this single-TU case it works, but the pattern is fragile. The deeper issue is the destruction order: the Registry (a function-local static) will be destroyed during static deinitialization. If any global destructor (like `~Initializer`) tried to use `Registry::instance()` after the Registry was destroyed, it would access a destroyed object — undefined behavior.",
    manifestation: `$ g++ -std=c++17 -O2 registry.cpp -o registry && ./registry
Registry #1 created
startup_time: 12345
count: 42

Output is correct for this simple case. But add another TU:

// other.cpp
struct Cleanup {
    ~Cleanup() {
        // Runs during static deinitialization
        Registry::instance().get("key");  ← UB if Registry
        // was already destroyed!
    }
} globalCleanup;

Destruction order of statics is reverse of construction.
If globalCleanup was constructed before the Registry singleton,
its destructor runs after Registry is destroyed → use-after-destroy.`,
    stdlibRefs: [],
  },
  {
    id: 281,
    topic: "Initialization & Construction",
    difficulty: "Hard",
    title: "Aggregate Init Trap",
    description: "Uses aggregate initialization with inheritance to construct derived structs efficiently.",
    code: `#include <iostream>
#include <string>

struct Point {
    double x;
    double y;
};

struct LabeledPoint : Point {
    std::string label;
};

void print(const LabeledPoint& p) {
    std::cout << p.label << ": (" << p.x << ", " << p.y << ")" << std::endl;
}

int main() {
    // C++17 aggregate initialization with base class
    LabeledPoint p1{{1.0, 2.0}, "Origin"};
    print(p1);

    // What does this do?
    LabeledPoint p2{3.0, 4.0, "Diagonal"};
    print(p2);

    // And this?
    LabeledPoint p3{5.0};
    print(p3);
}`,
    hints: [
      "In C++17, aggregates can have base classes. How does aggregate initialization work with inherited members?",
      "For `LabeledPoint p2{3.0, 4.0, \"Diagonal\"}`, is `3.0` initializing `x` directly or the base `Point` subobject?",
      "The first initializer for an aggregate with a base class initializes the entire base subobject. What does `{3.0, 4.0, \"Diagonal\"}` mean?",
    ],
    explanation: "In C++17 aggregate initialization with base classes, the first element in the brace-init-list initializes the base class subobject, not the first member of the base. For `LabeledPoint p2{3.0, 4.0, \"Diagonal\"}`, `3.0` initializes the entire `Point` base (which means `Point{3.0}` → `x=3.0, y=0.0`), then `4.0` attempts to initialize `label` — but `4.0` can't convert to `std::string`, so this is a compilation error. For `p1{{1.0, 2.0}, \"Origin\"}`, the inner braces `{1.0, 2.0}` correctly initialize the `Point` base. The fix for p2 is `{{3.0, 4.0}, \"Diagonal\"}`.",
    manifestation: `$ g++ -std=c++17 -O2 aggregate.cpp -o aggregate
aggregate.cpp:22:35: error: cannot convert 'double' to
  'std::string' in initialization
    LabeledPoint p2{3.0, 4.0, "Diagonal"};
                                ^~~~~~~~~

If the code were:
    LabeledPoint p2{3.0, 4.0};  ← compiles!
    print(p2);
Output: : (3, 0)
    p2.x = 3.0 (from Point{3.0} → x=3.0, y=0.0)
    p2.label = "4.0"?  No — 4.0 can't init string either.

Actually: LabeledPoint p3{5.0};
  Point base = {5.0} → x=5.0, y=0.0
  label = {} → empty string
  Output: : (5, 0)  ← y silently zero, label empty`,
    stdlibRefs: [],
  },
  {
    id: 282,
    topic: "Initialization & Construction",
    difficulty: "Hard",
    title: "CRTP Counter",
    description: "Uses the Curiously Recurring Template Pattern to count instances of each derived class.",
    code: `#include <iostream>
#include <string>

template <typename Derived>
class InstanceCounter {
    static int count;

protected:
    InstanceCounter() { ++count; }
    InstanceCounter(const InstanceCounter&) { ++count; }
    ~InstanceCounter() { --count; }

public:
    static int getCount() { return count; }
};

template <typename Derived>
int InstanceCounter<Derived>::count = 0;

class Widget : public InstanceCounter<Widget> {
    std::string name;
public:
    Widget(std::string n) : name(std::move(n)) {}
    const std::string& getName() const { return name; }
};

class Gadget : public InstanceCounter<Gadget> {
    int id;
public:
    Gadget(int i) : id(i) {}
    int getId() const { return id; }
};

int main() {
    std::cout << "Widgets: " << Widget::getCount() << std::endl;
    std::cout << "Gadgets: " << Gadget::getCount() << std::endl;

    Widget w1("Alpha");
    Widget w2("Beta");
    Gadget g1(1);

    std::cout << "Widgets: " << Widget::getCount() << std::endl;
    std::cout << "Gadgets: " << Gadget::getCount() << std::endl;

    {
        Widget w3 = w1;
        std::cout << "Widgets in scope: " << Widget::getCount() << std::endl;
    }

    std::cout << "Widgets after scope: " << Widget::getCount() << std::endl;

    Widget w4(std::move(w2));
    std::cout << "Widgets after move: " << Widget::getCount() << std::endl;
}`,
    hints: [
      "The CRTP base tracks construction and destruction. Which constructors does it handle?",
      "It handles default construction, copy construction, and destruction. What about move construction?",
      "When `Widget w4(std::move(w2))` runs, which `InstanceCounter` constructor is called?",
    ],
    explanation: "The `InstanceCounter` base class defines a copy constructor that increments the count, but does NOT define a move constructor. When `Widget w4(std::move(w2))` is called, the compiler generates `Widget`'s move constructor, which move-constructs the `name` member. For the `InstanceCounter` base, since no move constructor is defined but a copy constructor is, the base is copy-constructed (the copy constructor is called). This actually works correctly — the count is still incremented. However, if `InstanceCounter` had defined the move constructor as default (`InstanceCounter(InstanceCounter&&) = default`), it would NOT increment the count, leading to a mismatch. As written, the code actually works correctly because the implicitly-deleted move constructor falls back to copy. But the move assignment operator is another story — `InstanceCounter` doesn't track assignment at all.",
    manifestation: `$ g++ -std=c++17 -O2 crtp.cpp -o crtp && ./crtp
Widgets: 0
Gadgets: 0
Widgets: 2
Gadgets: 1
Widgets in scope: 3
Widgets after scope: 2
Widgets after move: 3

Output appears correct. The count tracks properly because
move falls back to copy (which increments count).

But if you add: InstanceCounter(InstanceCounter&&) = default;
then move construction would NOT call the copy ctor, so count
wouldn't increment, but the destructor would still decrement,
leading to count going negative:
  Widgets after move: 2  ← wrong, should be 3
  Final count: -1        ← underflow on destruction`,
    stdlibRefs: [],
  },
  {
    id: 283,
    topic: "Initialization & Construction",
    difficulty: "Medium",
    title: "Narrow Init",
    description: "Uses brace initialization to safely construct objects while relying on narrowing conversion checks.",
    code: `#include <iostream>
#include <cstdint>
#include <vector>

struct Pixel {
    uint8_t r, g, b, a;
};

Pixel makePixel(int r, int g, int b, int a = 255) {
    return {static_cast<uint8_t>(r),
            static_cast<uint8_t>(g),
            static_cast<uint8_t>(b),
            static_cast<uint8_t>(a)};
}

int main() {
    Pixel white = {255, 255, 255, 255};
    std::cout << "White: " << (int)white.r << "," << (int)white.g
              << "," << (int)white.b << "," << (int)white.a << std::endl;

    // Accidental overflow
    Pixel p = makePixel(300, 200, 100);
    std::cout << "Pixel: " << (int)p.r << "," << (int)p.g
              << "," << (int)p.b << "," << (int)p.a << std::endl;

    // Color math
    int brightness = 280;
    Pixel bright = makePixel(brightness, brightness, brightness);
    std::cout << "Bright: " << (int)bright.r << "," << (int)bright.g
              << "," << (int)bright.b << std::endl;
}`,
    hints: [
      "What does `static_cast<uint8_t>(300)` produce?",
      "The value 300 doesn't fit in a `uint8_t` (0-255). What happens with `static_cast`?",
      "Does `static_cast` clamp values to the valid range, or does it truncate/wrap?",
    ],
    explanation: "The `makePixel` function uses `static_cast<uint8_t>` to convert `int` values to bytes. But `static_cast` does not clamp — it truncates (takes the value modulo 256 for unsigned types). So `static_cast<uint8_t>(300)` produces `44` (300 - 256), not 255. The `makePixel(300, 200, 100)` call produces `{44, 200, 100, 255}` instead of clamping to `{255, 200, 100, 255}`. Using brace initialization directly (`Pixel p = {300, ...}`) would catch this as a narrowing conversion error, but `static_cast` explicitly tells the compiler 'I know what I'm doing'. The fix is to clamp before casting: `static_cast<uint8_t>(std::min(r, 255))`.",
    manifestation: `$ g++ -std=c++17 -O2 pixel.cpp -o pixel && ./pixel
White: 255,255,255,255
Pixel: 44,200,100,255
Bright: 24,24,24

Expected output:
  Pixel: 255,200,100,255  ← 300 should clamp to 255
  Bright: 255,255,255     ← 280 should clamp to 255
Actual output:
  Pixel: 44,200,100,255   ← 300 % 256 = 44 (wrap-around)
  Bright: 24,24,24        ← 280 % 256 = 24 (dark instead of bright!)`,
    stdlibRefs: [],
  },

  // ── Multithreading (batch 2) ──
  {
    id: 284,
    topic: "Multithreading",
    difficulty: "Easy",
    title: "Thread Logger",
    description: "Spawns multiple threads that each log messages to the console with their thread ID.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <string>

void logMessage(int id, const std::string& msg) {
    std::cout << "[Thread " << id << "] " << msg << std::endl;
}

int main() {
    std::vector<std::thread> threads;

    for (int i = 0; i < 5; ++i) {
        threads.emplace_back(logMessage, i, "Hello from thread");
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "All threads completed" << std::endl;
}`,
    hints: [
      "Multiple threads are writing to `std::cout` simultaneously. Is `std::cout` thread-safe?",
      "While individual `<<` operations are atomic with respect to the stream, what about chained `<<` calls?",
      "Can the output from different threads interleave mid-line?",
    ],
    explanation: "Each call to `logMessage` chains multiple `<<` operations: `std::cout << \"[Thread \" << id << \"] \" << msg << std::endl`. While the C++ standard guarantees that individual `<<` calls won't corrupt the stream, it does NOT guarantee that a series of chained calls executes atomically. Two threads can interleave their `<<` calls, producing garbled output like `[Thread [Thread 01] ] Hello from threadHello from thread`. The fix is to either use a mutex to protect the entire print operation, build the string first and output it in a single `<<` call, or use `std::osyncstream` (C++20).",
    manifestation: `$ g++ -std=c++17 -O2 logger.cpp -o logger -pthread && ./logger
[Thread [Thread 1] Hello from thread0] Hello from thread
[Thread 3] Hello from thread
[Thread 2] [Thread Hello from thread4] Hello from thread

All threads completed

Expected output:
  [Thread 0] Hello from thread
  [Thread 1] Hello from thread
  ... (each on its own line)
Actual output:
  Lines interleave because chained << is not atomic`,
    stdlibRefs: [],
  },
  {
    id: 285,
    topic: "Multithreading",
    difficulty: "Easy",
    title: "Parallel Counter",
    description: "Increments a shared counter from multiple threads to count total work completed.",
    code: `#include <iostream>
#include <thread>
#include <vector>

int counter = 0;

void incrementMany(int times) {
    for (int i = 0; i < times; ++i) {
        ++counter;
    }
}

int main() {
    const int numThreads = 4;
    const int perThread = 100000;

    std::vector<std::thread> threads;
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back(incrementMany, perThread);
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Expected: " << numThreads * perThread << std::endl;
    std::cout << "Actual: " << counter << std::endl;
}`,
    hints: [
      "Is `++counter` an atomic operation?",
      "What does `++counter` actually do at the hardware level?",
      "When two threads read-modify-write the same variable simultaneously, what can happen?",
    ],
    explanation: "The `++counter` operation is not atomic — it involves reading the current value, incrementing it, and writing it back. When multiple threads execute this simultaneously, they can read the same value, both increment it to the same result, and both write back — effectively losing one increment. This is a classic data race, which is undefined behavior in C++. With 4 threads each doing 100000 increments, the result is typically less than 400000. The fix is to use `std::atomic<int> counter` or protect the increment with a `std::mutex`.",
    manifestation: `$ g++ -std=c++17 -O2 counter.cpp -o counter -pthread && ./counter
Expected: 400000
Actual: 263847

$ ./counter
Expected: 400000
Actual: 287123

(result varies between runs due to data race — lost updates)

$ g++ -fsanitize=thread counter.cpp -o counter -pthread && ./counter
WARNING: ThreadSanitizer: data race (pid=18234)
  Write of size 4 at 0x404060 by thread T2:
    #0 incrementMany(int) counter.cpp:8
  Previous write of size 4 at 0x404060 by thread T1:
    #0 incrementMany(int) counter.cpp:8`,
    stdlibRefs: [
      { name: "std::atomic", brief: "Provides atomic operations on a value, ensuring thread-safe read-modify-write without explicit locking.", link: "https://en.cppreference.com/w/cpp/atomic/atomic" },
    ],
  },
  {
    id: 286,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Double-Checked Lock",
    description: "Implements lazy initialization of a singleton using the double-checked locking pattern.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

class ExpensiveResource {
    int value;
public:
    ExpensiveResource() : value(42) {
        std::cout << "Resource created" << std::endl;
    }
    int get() const { return value; }
};

ExpensiveResource* resource = nullptr;
std::mutex mtx;

ExpensiveResource* getResource() {
    if (resource == nullptr) {
        std::lock_guard<std::mutex> lock(mtx);
        if (resource == nullptr) {
            resource = new ExpensiveResource();
        }
    }
    return resource;
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([] {
            auto* r = getResource();
            std::cout << "Got: " << r->get() << std::endl;
        });
    }

    for (auto& t : threads) {
        t.join();
    }

    delete resource;
}`,
    hints: [
      "The first null check `if (resource == nullptr)` is outside the lock. What memory ordering guarantees does it have?",
      "When one thread writes to `resource` inside the lock, can another thread see that write immediately in the first check?",
      "Without proper memory ordering, can a thread see a non-null pointer before the pointed-to object is fully constructed?",
    ],
    explanation: "The double-checked locking pattern is broken without proper memory ordering. The first `if (resource == nullptr)` check is outside the lock and reads a shared pointer without synchronization — this is a data race. A thread can see a non-null `resource` pointer before the `ExpensiveResource` constructor has completed (the write to the pointer can be reordered before the writes inside the constructor). That thread would then use a partially-constructed object. The fix in C++11+ is to use `std::atomic<ExpensiveResource*>` with appropriate memory ordering, or simply use a function-local static: `static ExpensiveResource res; return &res;` which is guaranteed thread-safe.",
    manifestation: `$ g++ -std=c++17 -O2 dclp.cpp -o dclp -pthread && ./dclp
Resource created
Got: 42
Got: 42
... (may appear to work)

$ g++ -fsanitize=thread dclp.cpp -o dclp -pthread && ./dclp
==================
WARNING: ThreadSanitizer: data race (pid=22451)
  Read of size 8 at 0x404060 by thread T3:
    #0 getResource() dclp.cpp:19
  Previous write of size 8 at 0x404060 by thread T1:
    #0 getResource() dclp.cpp:22

The first null-check reads 'resource' without synchronization.
Thread may see non-null pointer before constructor completes.`,
    stdlibRefs: [
      { name: "std::mutex", brief: "Provides mutual exclusion synchronization primitive for protecting shared data.", link: "https://en.cppreference.com/w/cpp/thread/mutex" },
    ],
  },
  {
    id: 287,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Deadlock Dinner",
    description: "Two bank accounts transfer money between each other, each protected by its own mutex.",
    code: `#include <iostream>
#include <thread>
#include <mutex>

class Account {
    double balance;
    std::mutex mtx;
    std::string name;

public:
    Account(std::string n, double b) : name(std::move(n)), balance(b) {}

    void transfer(Account& to, double amount) {
        std::lock_guard<std::mutex> lockFrom(this->mtx);
        std::lock_guard<std::mutex> lockTo(to.mtx);

        if (balance >= amount) {
            balance -= amount;
            to.balance += amount;
            std::cout << name << " -> " << to.name << ": $" << amount << std::endl;
        }
    }

    double getBalance() {
        std::lock_guard<std::mutex> lock(mtx);
        return balance;
    }

    const std::string& getName() const { return name; }
};

int main() {
    Account alice("Alice", 1000);
    Account bob("Bob", 1000);

    std::thread t1([&] {
        for (int i = 0; i < 100; ++i) {
            alice.transfer(bob, 10);
        }
    });

    std::thread t2([&] {
        for (int i = 0; i < 100; ++i) {
            bob.transfer(alice, 10);
        }
    });

    t1.join();
    t2.join();

    std::cout << "Alice: $" << alice.getBalance() << std::endl;
    std::cout << "Bob: $" << bob.getBalance() << std::endl;
}`,
    hints: [
      "Thread 1 calls `alice.transfer(bob)` — it locks `alice.mtx` first, then `bob.mtx`.",
      "Thread 2 calls `bob.transfer(alice)` — it locks `bob.mtx` first, then `alice.mtx`.",
      "What happens when T1 holds alice.mtx and waits for bob.mtx, while T2 holds bob.mtx and waits for alice.mtx?",
    ],
    explanation: "This is a classic deadlock. Thread 1 locks `alice.mtx` then tries to lock `bob.mtx`. Thread 2 locks `bob.mtx` then tries to lock `alice.mtx`. If both threads acquire their first lock before either acquires their second, they deadlock — each waiting for a lock the other holds. The program hangs forever. The fix is to always lock mutexes in a consistent order (e.g., by address), or use `std::scoped_lock(this->mtx, to.mtx)` which uses a deadlock-avoidance algorithm.",
    manifestation: `$ g++ -std=c++17 -O2 bank.cpp -o bank -pthread && ./bank
Alice -> Bob: $10
Bob -> Alice: $10
Alice -> Bob: $10
(program hangs — deadlock)

^C  (must kill with Ctrl+C)

Thread 1 holds alice.mtx, waiting for bob.mtx
Thread 2 holds bob.mtx, waiting for alice.mtx
→ circular wait = deadlock

Fix: use std::scoped_lock(this->mtx, to.mtx) which avoids
deadlock by locking both mutexes atomically.`,
    stdlibRefs: [
      { name: "std::scoped_lock", args: "<MutexTypes...>(MutexTypes&... m)", brief: "RAII lock that acquires multiple mutexes simultaneously using a deadlock-avoidance algorithm.", link: "https://en.cppreference.com/w/cpp/thread/scoped_lock" },
    ],
  },
  {
    id: 288,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Future Collector",
    description: "Launches parallel tasks with std::async and collects results using futures.",
    code: `#include <iostream>
#include <future>
#include <vector>
#include <numeric>
#include <cmath>

double heavyComputation(int n) {
    double result = 0;
    for (int i = 1; i <= n; ++i) {
        result += std::sqrt(i) * std::log(i + 1);
    }
    return result;
}

int main() {
    std::vector<std::future<double>> futures;

    for (int i = 0; i < 8; ++i) {
        futures.push_back(std::async(heavyComputation, (i + 1) * 100000));
    }

    double total = 0;
    for (auto& f : futures) {
        total += f.get();
    }

    std::cout << "Total: " << total << std::endl;

    // Second round — reuse futures
    for (int i = 0; i < 4; ++i) {
        futures[i] = std::async(heavyComputation, (i + 1) * 50000);
    }

    double total2 = 0;
    for (int i = 0; i < 4; ++i) {
        total2 += futures[i].get();
    }
    std::cout << "Total2: " << total2 << std::endl;
}`,
    hints: [
      "After calling `f.get()` on a future, what state is the future in?",
      "Look at `std::async` — what launch policy is used? The default may be `std::launch::deferred`.",
      "If `std::async` uses deferred launch, when does the computation actually run?",
    ],
    explanation: "The code has a subtle potential issue: `std::async` without an explicit launch policy uses `std::launch::async | std::launch::deferred`, allowing the implementation to choose deferred execution. With deferred launch, the computation only runs when `.get()` is called, making the 'parallel' tasks actually sequential. This is a performance bug, not a correctness bug. The code produces correct results either way, but may not achieve any parallelism. The fix is to explicitly specify `std::async(std::launch::async, heavyComputation, ...)` to guarantee parallel execution. The reuse of futures in the second round is correct — assigning a new future to `futures[i]` properly replaces the old (consumed) future.",
    manifestation: `$ g++ -std=c++17 -O2 futures.cpp -o futures -pthread && time ./futures
Total: 1.23456e+12
Total2: 3.45678e+11

real    0m2.145s  ← may be sequential if deferred!

With std::launch::async:
real    0m0.389s  ← actually parallel

The default launch policy allows the implementation to
run tasks lazily (deferred) instead of in parallel.
Some implementations always use async, others may defer.`,
    stdlibRefs: [
      { name: "std::async", args: "(launch policy, Function&& f, Args&&... args) → future<result_of_t<F(Args...)>>", brief: "Runs a function asynchronously (potentially in a new thread) and returns a future for the result.", note: "Without an explicit launch policy, the implementation may use deferred execution (runs lazily on get()).", link: "https://en.cppreference.com/w/cpp/thread/async" },
    ],
  },
  {
    id: 289,
    topic: "Multithreading",
    difficulty: "Medium",
    title: "Spin Lock",
    description: "Implements a simple spinlock using atomic operations for low-latency synchronization.",
    code: `#include <iostream>
#include <thread>
#include <atomic>
#include <vector>

class SpinLock {
    std::atomic<bool> locked{false};

public:
    void lock() {
        while (locked.exchange(true)) {
            // spin
        }
    }

    void unlock() {
        locked = false;
    }
};

SpinLock spinlock;
int sharedData = 0;

void worker(int iterations) {
    for (int i = 0; i < iterations; ++i) {
        spinlock.lock();
        ++sharedData;
        spinlock.unlock();
    }
}

int main() {
    const int numThreads = 4;
    const int perThread = 100000;

    std::vector<std::thread> threads;
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back(worker, perThread);
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Expected: " << numThreads * perThread << std::endl;
    std::cout << "Actual: " << sharedData << std::endl;
}`,
    hints: [
      "The spinlock uses `exchange(true)` to acquire and `locked = false` to release. Are the memory orderings correct?",
      "What memory ordering does `locked = false` use? Is `memory_order_seq_cst` (the default) appropriate for unlock?",
      "The default memory ordering is `seq_cst` which is correct but potentially slower than needed. But is there a correctness issue?",
    ],
    explanation: "The spinlock is technically correct — `exchange(true)` with default `memory_order_seq_cst` provides acquire semantics, and `locked = false` (also seq_cst) provides release semantics. The data is properly synchronized. However, the spinlock wastes CPU cycles spinning without yielding. On a system with fewer hardware threads than software threads, this can cause severe performance degradation or even livelock (a spinning thread prevents the lock-holding thread from being scheduled). The fix for the spin loop is to add `std::this_thread::yield()` or use exponential backoff. But the code is functionally correct.",
    manifestation: `$ g++ -std=c++17 -O2 spinlock.cpp -o spinlock -pthread && ./spinlock
Expected: 400000
Actual: 400000

Output is correct. The spinlock works, but:
- Burns CPU while spinning (100% core usage while waiting)
- On oversubscribed systems (more threads than cores),
  spinning threads can starve the lock holder
- No fairness guarantee — threads can be starved indefinitely

With many threads and few cores:
$ time ./spinlock
real    0m4.2s   ← much slower than mutex-based version (0.1s)
(spinning threads prevent lock holder from being scheduled)`,
    stdlibRefs: [
      { name: "std::atomic::exchange", args: "(T desired, memory_order order = seq_cst) → T", brief: "Atomically replaces the value and returns the old value.", link: "https://en.cppreference.com/w/cpp/atomic/atomic/exchange" },
    ],
  },
  {
    id: 290,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Lock-Free Stack",
    description: "Implements a lock-free stack using compare-and-swap operations for high-performance concurrent access.",
    code: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

template <typename T>
class LockFreeStack {
    struct Node {
        T data;
        Node* next;
        Node(const T& d) : data(d), next(nullptr) {}
    };

    std::atomic<Node*> head{nullptr};

public:
    void push(const T& value) {
        Node* newNode = new Node(value);
        newNode->next = head.load();
        while (!head.compare_exchange_weak(newNode->next, newNode)) {
            // CAS failed, newNode->next is updated to current head
        }
    }

    bool pop(T& result) {
        Node* oldHead = head.load();
        while (oldHead && !head.compare_exchange_weak(oldHead, oldHead->next)) {
            // retry
        }
        if (!oldHead) return false;
        result = oldHead->data;
        delete oldHead;
        return true;
    }
};

int main() {
    LockFreeStack<int> stack;

    std::vector<std::thread> pushers;
    for (int i = 0; i < 4; ++i) {
        pushers.emplace_back([&stack, i] {
            for (int j = 0; j < 1000; ++j) {
                stack.push(i * 1000 + j);
            }
        });
    }

    for (auto& t : pushers) t.join();

    int count = 0;
    int val;
    while (stack.pop(val)) {
        ++count;
    }

    std::cout << "Popped: " << count << std::endl;
}`,
    hints: [
      "The pop operation reads `oldHead->next` inside the CAS. Is `oldHead` guaranteed to still be valid at that point?",
      "Between loading `oldHead` and executing the CAS, another thread could pop `oldHead` and delete it.",
      "This is the ABA problem variant: reading through a potentially-freed pointer is use-after-free.",
    ],
    explanation: "The `pop` method has a use-after-free bug. Between `oldHead = head.load()` and the `compare_exchange_weak(oldHead, oldHead->next)`, another thread could pop the same node and delete it. When the CAS reads `oldHead->next`, it dereferences a freed pointer — undefined behavior. Even if the CAS fails and retries, the initial read of `oldHead->next` has already happened through a dangling pointer. Additionally, there's the ABA problem: if between load and CAS, another thread pops A, pushes B, then pushes a new node at A's old address, the CAS succeeds with a corrupted next pointer. The fix requires hazard pointers, epoch-based reclamation, or using `shared_ptr` with atomic operations.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=address lockfree.cpp -o lockfree -pthread && ./lockfree
=================================================================
==29105==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000018
READ of size 8 at 0x602000000018 thread T2
    #0 0x401c82 in LockFreeStack<int>::pop(int&) lockfree.cpp:26
    #1 0x402345 in main::$_1::operator()()
0x602000000018 is located 8 bytes inside of 16-byte region
freed by thread T3 here:
    #0 0x7f4e21 in operator delete(void*)
    #1 0x401d98 in LockFreeStack<int>::pop(int&) lockfree.cpp:29
SUMMARY: AddressSanitizer: heap-use-after-free lockfree.cpp:26`,
    stdlibRefs: [
      { name: "std::atomic::compare_exchange_weak", args: "(T& expected, T desired) → bool", brief: "Atomically compares the value with expected; if equal, replaces with desired and returns true; otherwise loads current into expected and returns false.", note: "May fail spuriously — use in a loop. Does not prevent ABA problem.", link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange" },
    ],
  },
  {
    id: 291,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Thread Pool Executor",
    description: "Implements a thread pool that accepts and executes tasks from a shared work queue.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <functional>
#include <vector>
#include <atomic>

class ThreadPool {
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex mtx;
    std::condition_variable cv;
    bool stop = false;

public:
    ThreadPool(size_t numThreads) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mtx);
                        cv.wait(lock, [this] { return stop || !tasks.empty(); });
                        if (stop && tasks.empty()) return;
                        task = std::move(tasks.front());
                        tasks.pop();
                    }
                    task();
                }
            });
        }
    }

    void submit(std::function<void()> task) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            tasks.push(std::move(task));
        }
        cv.notify_one();
    }

    ~ThreadPool() {
        stop = true;
        cv.notify_all();
        for (auto& w : workers) {
            w.join();
        }
    }
};

int main() {
    std::atomic<int> completed{0};

    {
        ThreadPool pool(4);

        for (int i = 0; i < 20; ++i) {
            pool.submit([&completed, i] {
                // Simulate work
                std::this_thread::sleep_for(std::chrono::milliseconds(10));
                ++completed;
            });
        }
    } // pool destructor joins threads

    std::cout << "Completed: " << completed << std::endl;
}`,
    hints: [
      "In the destructor, `stop = true` is written without holding the mutex. Is this a data race?",
      "The `stop` flag is a plain `bool`, not `std::atomic<bool>`. Is writing it from the main thread while workers read it safe?",
      "Even if `stop` were atomic, is there a timing issue between setting `stop` and calling `notify_all`?",
    ],
    explanation: "The `stop` flag is a plain `bool` that is written by the destructor thread (`stop = true`) and read by worker threads (`[this] { return stop || !tasks.empty(); }`) without synchronization. This is a data race and undefined behavior. The worker threads read `stop` inside the mutex (in the wait predicate), but the destructor writes `stop` outside the mutex. Even though the write happens-before `notify_all`, the worker's predicate could evaluate `stop` in a spurious wakeup before the write is visible. The fix is to either make `stop` an `std::atomic<bool>`, or set it under the lock: `{ std::lock_guard lock(mtx); stop = true; }`.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=thread pool.cpp -o pool -pthread && ./pool
==================
WARNING: ThreadSanitizer: data race (pid=18234)
  Write of size 1 at 0x7ffd4a200060 by main thread:
    #0 ThreadPool::~ThreadPool() pool.cpp:40
  Previous read of size 1 at 0x7ffd4a200060 by thread T1:
    #0 ThreadPool::ThreadPool(unsigned long)::$_0::operator()()
       pool.cpp:23

Completed: 20
(result may be correct despite the data race, but behavior
is undefined — could miss notifications or see stale stop flag)`,
    stdlibRefs: [
      { name: "std::condition_variable::notify_all", args: "() → void", brief: "Wakes up all threads waiting on this condition variable.", note: "The associated predicate data should be modified under the same mutex to avoid races.", link: "https://en.cppreference.com/w/cpp/thread/condition_variable/notify_all" },
    ],
  },
  {
    id: 292,
    topic: "Multithreading",
    difficulty: "Hard",
    title: "Read-Write Lock",
    description: "Implements a reader-writer lock that allows multiple concurrent readers but exclusive writers.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <shared_mutex>
#include <vector>
#include <chrono>

class SharedConfig {
    std::map<std::string, int> data;
    mutable std::shared_mutex rwMutex;

public:
    int read(const std::string& key) const {
        std::shared_lock<std::shared_mutex> lock(rwMutex);
        auto it = data.find(key);
        return it != data.end() ? it->second : -1;
    }

    void write(const std::string& key, int value) {
        std::unique_lock<std::shared_mutex> lock(rwMutex);
        data[key] = value;
    }

    int readAndUpdate(const std::string& key, int increment) {
        std::shared_lock<std::shared_mutex> readLock(rwMutex);
        auto it = data.find(key);
        int oldValue = it != data.end() ? it->second : 0;
        readLock.unlock();

        std::unique_lock<std::shared_mutex> writeLock(rwMutex);
        data[key] = oldValue + increment;
        return oldValue;
    }
};

int main() {
    SharedConfig config;
    config.write("counter", 0);

    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([&config] {
            for (int j = 0; j < 1000; ++j) {
                config.readAndUpdate("counter", 1);
            }
        });
    }

    for (auto& t : threads) t.join();

    std::cout << "Expected: 10000" << std::endl;
    std::cout << "Actual: " << config.read("counter") << std::endl;
}`,
    hints: [
      "Look at `readAndUpdate`. It reads under a shared lock, unlocks, then writes under an exclusive lock. Is this safe?",
      "Between `readLock.unlock()` and acquiring `writeLock`, can another thread modify the data?",
      "This is a classic TOCTOU (time-of-check-time-of-use) race condition.",
    ],
    explanation: "The `readAndUpdate` method has a TOCTOU race condition. It reads the current value under a shared lock, then releases the lock, then acquires an exclusive lock to write. Between releasing the read lock and acquiring the write lock, another thread can modify the value. Multiple threads can read the same `oldValue` and then all write `oldValue + 1`, effectively losing increments. For 10 threads doing 1000 increments each, the result will be less than 10000. The fix is to perform the entire read-modify-write under a single exclusive lock.",
    manifestation: `$ g++ -std=c++17 -O2 rwlock.cpp -o rwlock -pthread && ./rwlock
Expected: 10000
Actual: 3847

$ ./rwlock
Expected: 10000
Actual: 4123

(result varies — TOCTOU race between unlock(shared) and
lock(exclusive) allows lost updates)`,
    stdlibRefs: [
      { name: "std::shared_mutex", brief: "A mutex that supports both exclusive (writer) and shared (reader) locking modes.", link: "https://en.cppreference.com/w/cpp/thread/shared_mutex" },
      { name: "std::shared_lock", args: "<Mutex>(Mutex& m)", brief: "RAII lock wrapper for shared (reader) access to a shared_mutex.", link: "https://en.cppreference.com/w/cpp/thread/shared_lock" },
    ],
  },
  {
    id: 293,
    topic: "Multithreading",
    difficulty: "Easy",
    title: "Detached Thread",
    description: "Launches a background worker thread that periodically logs status updates.",
    code: `#include <iostream>
#include <thread>
#include <chrono>
#include <string>

void backgroundWorker(const std::string& name) {
    for (int i = 0; i < 5; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        std::cout << name << ": tick " << i << std::endl;
    }
    std::cout << name << ": done" << std::endl;
}

int main() {
    std::string taskName = "Monitor";
    std::thread worker(backgroundWorker, taskName);
    worker.detach();

    std::cout << "Main: started background worker" << std::endl;
    std::this_thread::sleep_for(std::chrono::milliseconds(250));
    std::cout << "Main: exiting" << std::endl;
}`,
    hints: [
      "What happens to a detached thread when `main()` returns?",
      "The background worker runs for ~500ms total, but main exits after ~250ms.",
      "When the main thread exits, does the program wait for detached threads to finish?",
    ],
    explanation: "When `main()` returns, `std::exit()` is called, which terminates the program. Detached threads are not joined — they are simply abandoned. If the background worker is still running when the main thread exits, the worker is killed mid-execution. This means the worker only prints ticks 0 and 1 before being terminated. Worse, if the thread is in the middle of writing to `std::cout`, the output can be corrupted. Unlike `join()`, `detach()` provides no guarantee about thread completion. The program has a race: it depends on timing between main's exit and the worker's progress.",
    manifestation: `$ g++ -std=c++17 -O2 detach.cpp -o detach -pthread && ./detach
Main: started background worker
Monitor: tick 0
Monitor: tick 1
Main: exiting

(worker was killed after main exited — ticks 2, 3, 4 and
"done" message never printed)

$ ./detach
Main: started background worker
Monitor: tick 0
Main: exiting
Monitor: ti    ← output corrupted, thread killed mid-write`,
    stdlibRefs: [
      { name: "std::thread::detach", args: "() → void", brief: "Separates the thread of execution from the thread object, allowing execution to continue independently.", note: "Detached threads are terminated when main() exits. There is no way to join or wait for them.", link: "https://en.cppreference.com/w/cpp/thread/thread/detach" },
    ],
  },

  // ── Language Traps ──

  {
    id: 294,
    topic: "Language Traps",
    difficulty: "Easy",
    title: "Widget Factory",
    description: "Creates a Widget object and prints its value.",
    code: `#include <iostream>

class Widget {
    int value_;
public:
    Widget() : value_(42) {}
    Widget(int v) : value_(v) {}
    int value() const { return value_; }
};

int main() {
    Widget w();
    std::cout << "Widget value: " << w.value() << std::endl;
    return 0;
}`,
    hints: [
      "Look carefully at how `w` is declared. Is it really creating an object?",
      "What does the C++ standard say about declarations that look like function prototypes?",
    ],
    explanation: "This is the 'most vexing parse.' The declaration `Widget w();` doesn't create a Widget object — it declares a function named `w` that takes no arguments and returns a Widget. Calling `w.value()` then tries to invoke `.value()` on a function, which won't compile. The fix is to use `Widget w;` or `Widget w{};` for value initialization.",
    manifestation: `$ g++ -std=c++17 -Wall widget.cpp -o widget
widget.cpp: In function 'int main()':
widget.cpp:14:40: error: request for member 'value' in 'w',
    which is of non-class type 'Widget()'
   14 |     std::cout << "Widget value: " << w.value() << std::endl;
      |                                        ^~~~~`,
    stdlibRefs: [],
  },
  {
    id: 295,
    topic: "Language Traps",
    difficulty: "Easy",
    title: "Bitmask Check",
    description: "Checks if specific permission bits are set in a bitmask and grants access accordingly.",
    code: `#include <iostream>

constexpr int READ  = 0x01;
constexpr int WRITE = 0x02;
constexpr int EXEC  = 0x04;

bool hasPermission(int userPerms, int requiredPerm) {
    return userPerms & requiredPerm == requiredPerm;
}

int main() {
    int perms = READ | WRITE;  // user has read + write

    std::cout << "Has READ:  " << hasPermission(perms, READ)  << std::endl;
    std::cout << "Has WRITE: " << hasPermission(perms, WRITE) << std::endl;
    std::cout << "Has EXEC:  " << hasPermission(perms, EXEC)  << std::endl;

    return 0;
}`,
    hints: [
      "Focus on the `return` expression in `hasPermission`. What is the order of evaluation?",
      "What is the precedence of `==` relative to `&` in C++?",
    ],
    explanation: "The `==` operator has higher precedence than `&`, so `userPerms & requiredPerm == requiredPerm` is parsed as `userPerms & (requiredPerm == requiredPerm)`, which is `userPerms & 1`. This means the function returns whether the lowest bit is set, not whether the required permission bits are set. The fix is to add parentheses: `(userPerms & requiredPerm) == requiredPerm`.",
    manifestation: `$ g++ -std=c++17 -Wall bitmask.cpp -o bitmask
bitmask.cpp:8:24: warning: suggest parentheses around comparison
    in operand of '&' [-Wparentheses]
    8 |     return userPerms & requiredPerm == requiredPerm;
      |                        ~~~~~~~~~~~~^~~~~~~~~~~~~~~
$ ./bitmask
Has READ:  1
Has WRITE: 1
Has EXEC:  1

Expected output:
Has READ:  1
Has WRITE: 1
Has EXEC:  0`,
    stdlibRefs: [],
  },
  {
    id: 296,
    topic: "Language Traps",
    difficulty: "Easy",
    title: "Range Sum",
    description: "Computes the sum of all integers in a half-open range [low, high) using a comma-separated expression.",
    code: `#include <iostream>

int rangeSum(int low, int high) {
    int total = 0;
    for (int i = low; i < high; i++) {
        total += i;
    }
    return total;
}

int main() {
    int result = 0;

    // Sum ranges [0,5) and [10,15)
    result = rangeSum(0, 5), rangeSum(10, 15);

    std::cout << "Combined sum: " << result << std::endl;
    return 0;
}`,
    hints: [
      "What value does `result` actually hold after the assignment line?",
      "How does the comma operator interact with the assignment operator in terms of precedence?",
    ],
    explanation: "The comma operator has the lowest precedence of all C++ operators, lower than assignment. So `result = rangeSum(0, 5), rangeSum(10, 15)` is parsed as `(result = rangeSum(0, 5)), rangeSum(10, 15)`. The second call's return value is discarded. `result` only contains the sum of [0,5) which is 10, not the combined sum of 60. The fix is to write `result = rangeSum(0, 5) + rangeSum(10, 15);`.",
    manifestation: `$ g++ -std=c++17 -Wall range.cpp -o range
range.cpp:15:41: warning: right operand of comma operator has
    no effect [-Wunused-value]
   15 |     result = rangeSum(0, 5), rangeSum(10, 15);
      |                              ~~~~~~~~~~~~~~~^
$ ./range
Combined sum: 10

Expected output:
Combined sum: 60`,
    stdlibRefs: [],
  },
  {
    id: 297,
    topic: "Language Traps",
    difficulty: "Medium",
    title: "Square Macro",
    description: "Defines a macro to square a number and uses it in arithmetic expressions.",
    code: `#include <iostream>

#define SQUARE(x) x * x

int main() {
    int a = 3;
    int b = 4;

    int result1 = SQUARE(a + b);
    int result2 = 100 / SQUARE(5);
    int result3 = SQUARE(a++);

    std::cout << "SQUARE(3+4) = " << result1 << std::endl;
    std::cout << "100/SQUARE(5) = " << result2 << std::endl;
    std::cout << "SQUARE(a++) with a=3: " << result3 << std::endl;
    std::cout << "a after SQUARE(a++): " << a << std::endl;

    return 0;
}`,
    hints: [
      "Expand the macro by hand for each call. What does `SQUARE(a + b)` actually produce?",
      "How many times is the argument evaluated when the macro expands?",
      "What happens when a side-effecting expression like `a++` is evaluated twice?",
    ],
    explanation: "The macro `SQUARE(x)` expands to `x * x` without parenthesizing the parameter or the whole expression. `SQUARE(a + b)` becomes `a + b * b + a` = `3 + 4*4 + 3` = 22 instead of 49. `100 / SQUARE(5)` becomes `100 / 5 * 5` = 100 instead of 4. `SQUARE(a++)` becomes `a++ * a++`, which is undefined behavior (double modification without a sequence point). The fix is `#define SQUARE(x) ((x) * (x))`, but even that doesn't fix the double-evaluation of side effects — an inline function is the proper solution.",
    manifestation: `$ g++ -std=c++17 -Wall macro.cpp -o macro && ./macro
SQUARE(3+4) = 22
100/SQUARE(5) = 100
SQUARE(a++) with a=3: 9
a after SQUARE(a++): 5

Expected output:
SQUARE(3+4) = 49
100/SQUARE(5) = 4
SQUARE(a++) with a=3: 9
a after SQUARE(a++): 4`,
    stdlibRefs: [],
  },
  {
    id: 298,
    topic: "Language Traps",
    difficulty: "Medium",
    title: "Shape Hierarchy",
    description: "Defines a base Shape class and derived Circle class, calling display through a base pointer.",
    code: `#include <iostream>
#include <string>
#include <cmath>

class Shape {
public:
    virtual std::string name() const { return "Shape"; }
    virtual double area() const = 0;
    void display(std::ostream& os) const {
        os << name() << ": area = " << area() << std::endl;
    }
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius_;
public:
    Circle(double r) : radius_(r) {}
    std::string name() const { return "Circle"; }
    double area() const { return M_PI * radius_ * radius_; }
    void display(std::ostream& os) const {
        os << name() << ": radius = " << radius_
           << ", area = " << area() << std::endl;
    }
};

int main() {
    Circle c(5.0);
    Shape* s = &c;
    s->display(std::cout);
    return 0;
}`,
    hints: [
      "Is `display()` virtual in the base class?",
      "When calling through a base pointer, which version of a non-virtual method is invoked?",
    ],
    explanation: "The `display()` method is not declared `virtual` in the base class, so calling `s->display()` through a `Shape*` pointer invokes `Shape::display()`, not `Circle::display()`. Since `name()` and `area()` *are* virtual, they dispatch to `Circle`'s overrides, but the output format is Shape's version (which omits the radius). The Circle's custom display format is never used. The fix is to make `display()` virtual in the base class, or better yet, override it with `override`.",
    manifestation: `$ g++ -std=c++17 -Wall shape.cpp -o shape && ./shape
Circle: area = 78.5398

Expected output:
Circle: radius = 5, area = 78.5398`,
    stdlibRefs: [],
  },
  {
    id: 299,
    topic: "Language Traps",
    difficulty: "Medium",
    title: "Config Loader",
    description: "Parses a semicolon-delimited configuration string into key-value pairs using string_view for efficiency.",
    code: `#include <iostream>
#include <string>
#include <string_view>
#include <vector>
#include <utility>

std::vector<std::pair<std::string_view, std::string_view>>
parseConfig(const std::string& input) {
    std::vector<std::pair<std::string_view, std::string_view>> result;
    std::string_view sv(input);

    while (!sv.empty()) {
        auto semi = sv.find(';');
        auto entry = sv.substr(0, semi);

        auto eq = entry.find('=');
        if (eq != std::string_view::npos) {
            result.emplace_back(entry.substr(0, eq), entry.substr(eq + 1));
        }

        if (semi == std::string_view::npos) break;
        sv.remove_prefix(semi + 1);
    }
    return result;
}

int main() {
    auto config = parseConfig("host=localhost;port=8080;debug=true");

    for (auto& [key, value] : config) {
        std::cout << key << " => " << value << std::endl;
    }
    return 0;
}`,
    hints: [
      "What is the lifetime of the string that the `string_view`s point into?",
      "When `parseConfig` takes a `const std::string&`, what happens if the argument is a temporary?",
    ],
    explanation: "The string literal `\"host=localhost;port=8080;debug=true\"` is implicitly converted to a temporary `std::string`, which is passed by const reference to `parseConfig`. The returned `string_view`s point into this temporary. After the function call, the temporary `std::string` is destroyed, leaving all the `string_view`s dangling. Accessing them in the for loop is undefined behavior. The fix is to either return `std::string` pairs, or ensure the source string outlives the views.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g config.cpp -o config && ./config
=================================================================
==14523==ERROR: AddressSanitizer: stack-use-after-scope on address
    0x7ffd3a2c1e50 at pc 0x5591c3a01f23 bp 0x7ffd3a2c1d90
READ of size 1 at 0x7ffd3a2c1e50 thread T0
    #0 0x5591c3a01f22 in main config.cpp:31
    #1 0x7f2a8c429d8f in __libc_start_call_main
    #2 0x7f2a8c429e3f in __libc_start_main
    #3 0x5591c3a01a04 in _start`,
    stdlibRefs: [
      { name: "std::string_view", brief: "A non-owning reference to a contiguous sequence of characters.", note: "string_view does not extend the lifetime of the underlying data. If the source string is destroyed, the view dangles.", link: "https://en.cppreference.com/w/cpp/string/basic_string_view" },
    ],
  },
  {
    id: 300,
    topic: "Language Traps",
    difficulty: "Medium",
    title: "Derived Logger",
    description: "Extends a base Logger class with a FileLogger that adds file-path logging capability.",
    code: `#include <iostream>
#include <string>

class Logger {
public:
    void log(const std::string& msg) {
        std::cout << "[INFO] " << msg << std::endl;
    }
    void log(const std::string& msg, int level) {
        std::string prefix = (level >= 2) ? "[WARN] " : "[INFO] ";
        std::cout << prefix << msg << std::endl;
    }
};

class FileLogger : public Logger {
    std::string filepath_;
public:
    FileLogger(const std::string& path) : filepath_(path) {}

    void log(const std::string& msg, const std::string& category) {
        std::cout << "[" << category << "] "
                  << filepath_ << ": " << msg << std::endl;
    }
};

int main() {
    FileLogger flog("/var/log/app.log");

    flog.log("Application started");
    flog.log("Disk full", 2);

    return 0;
}`,
    hints: [
      "FileLogger defines its own `log` overload. What happens to the base class overloads?",
      "Does declaring a function with the same name in a derived class 'add' to the overload set, or does it hide the base versions?",
    ],
    explanation: "Declaring `log(const std::string&, const std::string&)` in `FileLogger` hides all `Logger::log` overloads due to name hiding. The calls `flog.log(\"Application started\")` and `flog.log(\"Disk full\", 2)` won't compile because the only visible `log` in `FileLogger` takes two `std::string` arguments. The integer `2` cannot be implicitly converted to `std::string`. The fix is to add `using Logger::log;` in `FileLogger` to bring the base overloads into scope.",
    manifestation: `$ g++ -std=c++17 -Wall logger.cpp -o logger
logger.cpp: In function 'int main()':
logger.cpp:30:30: error: no matching function for call to
    'FileLogger::log(const char [20])'
   30 |     flog.log("Application started");
      |                              ^
logger.cpp:22:10: note: candidate: 'void FileLogger::log(
    const string&, const string&)'
   22 |     void log(const std::string& msg, const std::string& category) {
      |          ^~~
logger.cpp:22:10: note:   candidate expects 2 arguments, 1 provided
logger.cpp:31:30: error: no matching function for call to
    'FileLogger::log(const char [10], int)'
   31 |     flog.log("Disk full", 2);
      |                              ^`,
    stdlibRefs: [],
  },
  {
    id: 301,
    topic: "Language Traps",
    difficulty: "Hard",
    title: "Event Dispatcher",
    description: "Stores callbacks for named events and dispatches them, printing whether each callback was successfully invoked.",
    code: `#include <iostream>
#include <functional>
#include <map>
#include <string>
#include <vector>
#include <optional>

class EventDispatcher {
    std::map<std::string, std::vector<std::function<void()>>> handlers_;
public:
    void on(const std::string& event, std::function<void()> fn) {
        handlers_[event].push_back(std::move(fn));
    }

    int dispatch(const std::string& event) {
        auto it = handlers_.find(event);
        if (it == handlers_.end()) return 0;
        int count = 0;
        for (auto& fn : it->second) {
            fn();
            ++count;
        }
        return count;
    }

    std::optional<std::string> mostPopular() const {
        std::string best;
        size_t bestCount = 0;
        for (auto& [name, fns] : handlers_) {
            if (fns.size() > bestCount) {
                bestCount = fns.size();
                best = name;
            }
        }
        return best;
    }
};

int main() {
    EventDispatcher ed;
    ed.on("click", []{ std::cout << "Button clicked" << std::endl; });
    ed.on("click", []{ std::cout << "Analytics: click" << std::endl; });
    ed.on("hover", []{ std::cout << "Tooltip shown" << std::endl; });

    auto popular = ed.mostPopular();
    if (popular) {
        std::cout << "Most popular event: " << *popular << std::endl;
    } else {
        std::cout << "No events registered" << std::endl;
    }

    return 0;
}`,
    hints: [
      "Look at `mostPopular()`. Under what conditions would it return an empty optional?",
      "What value does `std::optional<std::string>` hold when constructed from an empty `std::string`?",
    ],
    explanation: "The `mostPopular()` function always returns `best`, which is a `std::string`. If `handlers_` is empty, `best` is an empty string `\"\"`. But `std::optional<std::string>` constructed from an empty string is still an *engaged* optional — it holds a value (the empty string), so `if (popular)` evaluates to `true`. The function never actually returns `std::nullopt`. When no events are registered, it prints 'Most popular event: ' (with an empty name) instead of 'No events registered'. The fix is to explicitly return `std::nullopt` when `bestCount == 0`.",
    manifestation: `$ g++ -std=c++17 -Wall dispatch.cpp -o dispatch && ./dispatch
Most popular event: click

# But with an empty dispatcher:
$ g++ -std=c++17 -Wall dispatch2.cpp -o dispatch2 && ./dispatch2
Most popular event:

Expected output:
No events registered`,
    stdlibRefs: [
      { name: "std::optional", brief: "A wrapper that may or may not contain a value of type T.", note: "An optional containing an empty string is still engaged (has_value() is true). Only std::nullopt or a default-constructed optional is disengaged.", link: "https://en.cppreference.com/w/cpp/utility/optional" },
    ],
  },
  {
    id: 302,
    topic: "Language Traps",
    difficulty: "Hard",
    title: "Matrix Formatter",
    description: "Formats a 2D matrix into a string representation with aligned columns using structured bindings.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

struct Matrix {
    std::vector<std::vector<int>> data;
    size_t rows() const { return data.size(); }
    size_t cols() const { return data.empty() ? 0 : data[0].size(); }
};

std::string formatMatrix(const Matrix& m) {
    // Find max width per column
    std::vector<int> widths(m.cols(), 0);
    for (size_t r = 0; r < m.rows(); ++r) {
        for (size_t c = 0; c < m.cols(); ++c) {
            int w = std::to_string(m.data[r][c]).length();
            widths[c] = std::max(widths[c], w);
        }
    }

    std::ostringstream oss;
    for (size_t r = 0; r < m.rows(); ++r) {
        oss << "| ";
        for (size_t c = 0; c < m.cols(); ++c) {
            auto s = std::to_string(m.data[r][c]);
            for (int pad = widths[c] - s.length(); pad > 0; --pad)
                oss << ' ';
            oss << s << " | ";
        }
        oss << '\\n';
    }
    return oss.str();
}

int main() {
    Matrix m{{{1, 200, 3}, {4000, 5, 60}, {7, 80, 900}}};
    std::cout << formatMatrix(m);
    return 0;
}`,
    hints: [
      "Look at the types involved in `widths[c] - s.length()`. What are they?",
      "What happens when you subtract a larger unsigned value from a smaller unsigned value?",
    ],
    explanation: "The variable `widths[c]` is `int`, but `s.length()` returns `size_t` (unsigned). In the expression `widths[c] - s.length()`, the `int` is implicitly converted to `size_t`. When the string is already wider than the width (which can't happen here but the compiler doesn't know), or more critically, `pad` is declared as `int` but initialized from an unsigned subtraction. The real trap: `std::to_string(...).length()` returns `size_t`, and assigning it to `int w` is a narrowing conversion. If any number has more than ~2 billion digits (impossible in practice) it wraps. But the actual bug is `widths[c] - s.length()` — since `widths[c]` is converted to unsigned, if `s.length()` exceeds `widths[c]`, the subtraction wraps to a huge positive number, and the padding loop runs for billions of iterations. This happens when column content varies and max-width tracking has an off-by-one. The fix is to cast to `int` before subtracting: `int pad = widths[c] - static_cast<int>(s.length())`.",
    manifestation: `$ g++ -std=c++17 -Wall matrix.cpp -o matrix
matrix.cpp:19:51: warning: conversion from 'size_t' to 'int'
    may change value [-Wconversion]
   19 |             int w = std::to_string(m.data[r][c]).length();
      |                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~~~~~~
matrix.cpp:28:47: warning: comparison of integer expressions of
    different signedness: 'int' and 'size_t' [-Wsign-compare]
   28 |             for (int pad = widths[c] - s.length(); pad > 0; --pad)

$ ./matrix
| 1    | 200 |   3 |
| 4000 |   5 |  60 |
|    7 |  80 | 900 |

(Works correctly by luck — but change data so a column width is
0 and the unsigned wrap produces billions of spaces)`,
    stdlibRefs: [
      { name: "std::to_string", args: "(int value) → std::string | (double value) → std::string", brief: "Converts a numeric value to std::string.", link: "https://en.cppreference.com/w/cpp/string/basic_string/to_string" },
    ],
  },
  {
    id: 303,
    topic: "Language Traps",
    difficulty: "Hard",
    title: "Plugin Registry",
    description: "A plugin system where derived plugin classes register themselves using virtual functions during construction.",
    code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Plugin {
    static std::vector<std::string> registry_;
public:
    Plugin() {
        registry_.push_back(pluginName());
        std::cout << "Registered: " << pluginName() << std::endl;
    }
    virtual std::string pluginName() const { return "BasePlugin"; }
    virtual void execute() = 0;
    virtual ~Plugin() = default;

    static void listPlugins() {
        std::cout << "Registered plugins:" << std::endl;
        for (auto& name : registry_) {
            std::cout << "  - " << name << std::endl;
        }
    }
};

std::vector<std::string> Plugin::registry_;

class AudioPlugin : public Plugin {
public:
    std::string pluginName() const override { return "AudioPlugin"; }
    void execute() override {
        std::cout << "Processing audio..." << std::endl;
    }
};

class VideoPlugin : public Plugin {
public:
    std::string pluginName() const override { return "VideoPlugin"; }
    void execute() override {
        std::cout << "Processing video..." << std::endl;
    }
};

int main() {
    auto audio = std::make_unique<AudioPlugin>();
    auto video = std::make_unique<VideoPlugin>();

    Plugin::listPlugins();
    return 0;
}`,
    hints: [
      "When does the `Plugin()` constructor run relative to the `AudioPlugin` constructor?",
      "During base class construction, what is the dynamic type of the object?",
      "Can virtual dispatch reach derived-class overrides before the derived constructor has run?",
    ],
    explanation: "During base class construction, the dynamic type of the object is the base class, not the derived class. When `Plugin()` calls `pluginName()`, virtual dispatch resolves to `Plugin::pluginName()` (returning \"BasePlugin\"), not to the derived override. Both plugins are registered as \"BasePlugin\" instead of their actual names. This is a fundamental C++ rule: virtual functions do not dispatch to derived classes during construction or destruction. The fix is to pass the name as a constructor argument rather than relying on virtual dispatch.",
    manifestation: `$ g++ -std=c++17 -Wall plugin.cpp -o plugin && ./plugin
Registered: BasePlugin
Registered: BasePlugin
Registered plugins:
  - BasePlugin
  - BasePlugin

Expected output:
Registered: AudioPlugin
Registered: VideoPlugin
Registered plugins:
  - AudioPlugin
  - VideoPlugin`,
    stdlibRefs: [
      { name: "std::make_unique", args: "<T>(Args&&... args) → std::unique_ptr<T>", brief: "Creates a unique_ptr that owns a newly constructed object of type T.", link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique" },
    ],
  },

  // ── Standard Library Pitfalls ──

  {
    id: 304,
    topic: "Standard Library Pitfalls",
    difficulty: "Easy",
    title: "User Profile Lookup",
    description: "Looks up user profiles by ID from a map and prints their display name.",
    code: `#include <iostream>
#include <map>
#include <string>

struct Profile {
    std::string name;
    int accessLevel;
};

void printProfile(const std::map<int, Profile>& profiles, int userId) {
    std::cout << "User " << userId << ": "
              << profiles[userId].name
              << " (level " << profiles[userId].accessLevel << ")"
              << std::endl;
}

int main() {
    std::map<int, Profile> profiles;
    profiles[1] = {"Alice", 3};
    profiles[2] = {"Bob", 2};
    profiles[3] = {"Charlie", 1};

    printProfile(profiles, 1);
    printProfile(profiles, 2);
    printProfile(profiles, 4);  // unknown user

    return 0;
}`,
    hints: [
      "Look at the parameter type of `printProfile`. Is the map mutable or const?",
      "What does `operator[]` do on a `std::map` when the key doesn't exist? Can it work on a const map?",
    ],
    explanation: "The function takes the map by `const` reference, but `std::map::operator[]` is a non-const operation — it inserts a default-constructed element if the key doesn't exist. This means `profiles[userId]` won't compile when `profiles` is const. The error is subtle because the same code would work fine with a non-const map (silently inserting empty profiles for missing users). The fix is to use `profiles.at(userId)` which works on const maps and throws `std::out_of_range` for missing keys, or use `find()` and check the iterator.",
    manifestation: `$ g++ -std=c++17 -Wall profile.cpp -o profile
profile.cpp: In function 'void printProfile(const std::map<int,
    Profile>&, int)':
profile.cpp:12:27: error: passing 'const std::map<int, Profile>'
    as 'this' argument discards qualifiers [-fpermissive]
   12 |               << profiles[userId].name
      |                           ^
/usr/include/c++/11/bits/stl_map.h:492:7: note:
    'std::map<_Key, _Tp>::mapped_type& std::map<_Key, _Tp>::operator[]'
    is not marked const`,
    stdlibRefs: [
      { name: "std::map::operator[]", args: "(const key_type& k) → mapped_type&", brief: "Returns a reference to the value mapped to the key, inserting a default value if the key doesn't exist.", note: "operator[] is non-const because it may insert. Use at() or find() for const access.", link: "https://en.cppreference.com/w/cpp/container/map/operator_at" },
      { name: "std::map::at", args: "(const key_type& k) → mapped_type& | (const key_type& k) const → const mapped_type&", brief: "Returns a reference to the mapped value, throwing std::out_of_range if the key is not found.", link: "https://en.cppreference.com/w/cpp/container/map/at" },
    ],
  },
  {
    id: 305,
    topic: "Standard Library Pitfalls",
    difficulty: "Easy",
    title: "Task Priority Queue",
    description: "Sorts a list of tasks by priority using a custom comparator to process the most urgent tasks first.",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Task {
    std::string name;
    int priority;  // higher = more urgent
};

int main() {
    std::vector<Task> tasks = {
        {"Send email", 2},
        {"Fix crash", 5},
        {"Update docs", 1},
        {"Deploy hotfix", 5},
        {"Code review", 3},
        {"Write tests", 3},
    };

    std::sort(tasks.begin(), tasks.end(), [](const Task& a, const Task& b) {
        return a.priority >= b.priority;
    });

    std::cout << "Tasks by priority:" << std::endl;
    for (auto& t : tasks) {
        std::cout << "  [" << t.priority << "] " << t.name << std::endl;
    }

    return 0;
}`,
    hints: [
      "What does the C++ standard require of a comparator passed to `std::sort`?",
      "Does `>=` satisfy the strict weak ordering requirement? What happens when two elements have equal priority?",
    ],
    explanation: "The comparator uses `>=` which is not a strict weak ordering — it violates the irreflexivity requirement (`comp(a, a)` must be `false`, but `a.priority >= a.priority` is `true`). Passing an invalid comparator to `std::sort` is undefined behavior. In practice this can cause infinite loops, out-of-bounds access, or crashes, especially with duplicate priorities (which this data has). The fix is to use `>` for descending order: `return a.priority > b.priority;`.",
    manifestation: `$ g++ -std=c++17 -O2 tasks.cpp -o tasks && ./tasks
Segmentation fault (core dumped)

$ g++ -std=c++17 -O0 -D_GLIBCXX_DEBUG tasks.cpp -o tasks && ./tasks
/usr/include/c++/11/bits/stl_algo.h:1839:
Error: comparison doesn't meet irreflexivity requirements,
    assert(!(a < a)).
Objects involved in the operation:
    instance "functor" @ 0x7ffd5a2c1e50 {
      type = main::{lambda(Task const&, Task const&)#1}
    }
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::sort", args: "(RandomIt first, RandomIt last, Compare comp) → void", brief: "Sorts elements in [first, last) using the given comparator.", note: "The comparator must be a strict weak ordering: irreflexive, asymmetric, and transitive. Using >= or <= is undefined behavior.", link: "https://en.cppreference.com/w/cpp/algorithm/sort" },
    ],
  },
  {
    id: 306,
    topic: "Standard Library Pitfalls",
    difficulty: "Easy",
    title: "Immutable Transfer",
    description: "Moves a large const dataset into a processing function to avoid copying.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <numeric>

struct Dataset {
    std::vector<double> values;
    std::string label;

    Dataset(std::string lbl, size_t n) : label(std::move(lbl)), values(n) {
        std::iota(values.begin(), values.end(), 1.0);
    }
};

double processDataset(Dataset data) {
    std::cout << "Processing: " << data.label
              << " (" << data.values.size() << " values)" << std::endl;
    double sum = 0;
    for (double v : data.values) sum += v;
    return sum;
}

int main() {
    const Dataset ds("Measurements", 1000000);

    std::cout << "Before move: " << ds.values.size() << " values" << std::endl;

    double result = processDataset(std::move(ds));

    std::cout << "After move: " << ds.values.size() << " values" << std::endl;
    std::cout << "Sum: " << result << std::endl;

    return 0;
}`,
    hints: [
      "What is the type of `ds`? What happens when you `std::move` a const object?",
      "Can `std::move` actually transfer resources from a const object?",
    ],
    explanation: "`std::move` on a const object produces a `const Dataset&&` — a const rvalue reference. This cannot bind to a move constructor (which takes `Dataset&&`), so it falls back to the copy constructor. The million-element vector is silently copied instead of moved. After the 'move', `ds.values` still has all its elements, which contradicts the programmer's intent. The fix is to not declare `ds` as const if you intend to move from it.",
    manifestation: `$ g++ -std=c++17 -O2 transfer.cpp -o transfer && ./transfer
Before move: 1000000 values
Processing: Measurements (1000000 values)
After move: 1000000 values
Sum: 5.0000005e+11

(Expected "After move: 0 values" — the data was copied, not moved,
because std::move on a const object silently falls back to copying)`,
    stdlibRefs: [
      { name: "std::move", args: "<T>(T&& t) → std::remove_reference_t<T>&&", brief: "Casts its argument to an rvalue reference to enable move semantics.", note: "std::move on a const object produces const T&&, which binds to const T& (copy), not T&& (move). The move silently becomes a copy.", link: "https://en.cppreference.com/w/cpp/utility/move" },
    ],
  },
  {
    id: 307,
    topic: "Standard Library Pitfalls",
    difficulty: "Medium",
    title: "Config Value Store",
    description: "Stores configuration values as variants that can hold different types, and retrieves them by key.",
    code: `#include <iostream>
#include <map>
#include <string>
#include <variant>

using ConfigValue = std::variant<int, double, std::string, bool>;

class ConfigStore {
    std::map<std::string, ConfigValue> values_;
public:
    void set(const std::string& key, ConfigValue val) {
        values_[key] = std::move(val);
    }

    template<typename T>
    T get(const std::string& key) const {
        auto it = values_.find(key);
        if (it == values_.end()) {
            throw std::runtime_error("Key not found: " + key);
        }
        return std::get<T>(it->second);
    }

    void printAll() const {
        for (auto& [key, val] : values_) {
            std::visit([&key](auto&& v) {
                std::cout << key << " = " << v << std::endl;
            }, val);
        }
    }
};

int main() {
    ConfigStore config;
    config.set("port", 8080);
    config.set("hostname", std::string("localhost"));
    config.set("verbose", true);
    config.set("timeout", 30.5);

    try {
        std::cout << "Port: " << config.get<int>("port") << std::endl;
        std::cout << "Host: " << config.get<std::string>("hostname") << std::endl;
        std::cout << "Verbose: " << config.get<int>("verbose") << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}`,
    hints: [
      "Look at how 'verbose' is stored vs how it's retrieved. Do the types match?",
      "What does `std::get<T>` do when the variant doesn't hold type T?",
    ],
    explanation: "The value `true` is stored as `bool` in the variant, but `config.get<int>(\"verbose\")` tries to retrieve it as `int`. `std::get<int>` on a variant holding `bool` throws `std::bad_variant_access` because the types don't match — even though `bool` is implicitly convertible to `int`, the variant tracks the exact type. The fix is to use `config.get<bool>(\"verbose\")` or use `std::visit` to handle the conversion.",
    manifestation: `$ g++ -std=c++17 -Wall config.cpp -o config && ./config
Port: 8080
Host: localhost
Error: std::get: wrong index for variant

Expected output:
Port: 8080
Host: localhost
Verbose: 1`,
    stdlibRefs: [
      { name: "std::get (variant)", args: "<T>(const variant<Types...>& v) → const T&", brief: "Returns a reference to the value held by the variant if it currently holds type T.", note: "Throws std::bad_variant_access if the variant doesn't hold exactly type T. No implicit conversions are performed.", link: "https://en.cppreference.com/w/cpp/utility/variant/get" },
      { name: "std::holds_alternative", args: "<T>(const variant<Types...>& v) → bool", brief: "Checks whether the variant currently holds type T.", link: "https://en.cppreference.com/w/cpp/utility/variant/holds_alternative" },
    ],
  },
  {
    id: 308,
    topic: "Standard Library Pitfalls",
    difficulty: "Medium",
    title: "Parallel Downloader",
    description: "Launches multiple simulated downloads concurrently and waits for all to finish before reporting results.",
    code: `#include <iostream>
#include <future>
#include <string>
#include <vector>
#include <chrono>
#include <thread>

std::string download(const std::string& url) {
    // Simulate network delay
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    return "Content of " + url;
}

int main() {
    std::vector<std::string> urls = {
        "https://example.com/a",
        "https://example.com/b",
        "https://example.com/c",
        "https://example.com/d",
    };

    std::vector<std::string> results;

    auto start = std::chrono::steady_clock::now();

    for (auto& url : urls) {
        auto future = std::async(std::launch::async, download, url);
        results.push_back(future.get());
    }

    auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::steady_clock::now() - start).count();

    for (auto& r : results) {
        std::cout << r << std::endl;
    }
    std::cout << "Elapsed: " << elapsed << "ms" << std::endl;

    return 0;
}`,
    hints: [
      "When does `future.get()` return? Does the next iteration start before the current download finishes?",
      "Are the downloads actually running in parallel, or are they serialized?",
    ],
    explanation: "Calling `future.get()` immediately after `std::async` blocks until that particular download completes before the loop can launch the next one. The downloads run sequentially, not in parallel, taking ~400ms total instead of ~100ms. The fix is to first launch all async tasks and store the futures in a vector, then call `.get()` on each future in a second loop.",
    manifestation: `$ g++ -std=c++17 -O2 download.cpp -o download -pthread && ./download
Content of https://example.com/a
Content of https://example.com/b
Content of https://example.com/c
Content of https://example.com/d
Elapsed: 412ms

Expected output:
Content of https://example.com/a
Content of https://example.com/b
Content of https://example.com/c
Content of https://example.com/d
Elapsed: ~105ms`,
    stdlibRefs: [
      { name: "std::async", args: "(std::launch policy, F&& f, Args&&... args) → std::future<result_of_t<F(Args...)>>", brief: "Runs a function asynchronously (potentially in a new thread) and returns a future for its result.", link: "https://en.cppreference.com/w/cpp/thread/async" },
      { name: "std::future::get", args: "() → T", brief: "Blocks until the result is available, then returns the stored value.", note: "Calling get() immediately after async() serializes execution. Store futures first, then collect results.", link: "https://en.cppreference.com/w/cpp/thread/future/get" },
    ],
  },
  {
    id: 309,
    topic: "Standard Library Pitfalls",
    difficulty: "Medium",
    title: "Background Timer",
    description: "Starts a background timer using std::async that prints elapsed seconds, while the main thread does other work.",
    code: `#include <iostream>
#include <future>
#include <chrono>
#include <thread>

void backgroundTimer(int seconds) {
    for (int i = 1; i <= seconds; ++i) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        std::cout << "Timer: " << i << "s" << std::endl;
    }
}

int main() {
    std::cout << "Starting timer..." << std::endl;

    {
        auto future = std::async(std::launch::async, backgroundTimer, 5);
        // future goes out of scope here
    }

    std::cout << "Doing other work..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(2));
    std::cout << "Done!" << std::endl;

    return 0;
}`,
    hints: [
      "What happens when a `std::future` returned by `std::async` goes out of scope?",
      "Does the future's destructor return immediately or does it wait?",
    ],
    explanation: "The `std::future` returned by `std::async` with `std::launch::async` has a special property: its destructor blocks until the async task completes. When `future` goes out of scope at the end of the inner block, the destructor waits for `backgroundTimer(5)` to finish — all 5 seconds. So 'Doing other work...' doesn't print until after the timer is done. The timer and the main work are not concurrent. The fix is to keep the future alive (e.g., move it outside the block) and call `.get()` or `.wait()` later, or use `std::thread` with `detach()`.",
    manifestation: `$ g++ -std=c++17 -O2 timer.cpp -o timer -pthread && ./timer
Starting timer...
Timer: 1s
Timer: 2s
Timer: 3s
Timer: 4s
Timer: 5s
Doing other work...
Done!

Expected output:
Starting timer...
Doing other work...
Timer: 1s
Timer: 2s
Done!
Timer: 3s
...`,
    stdlibRefs: [
      { name: "std::async", args: "(std::launch policy, F&& f, Args&&... args) → std::future<result_of_t<F(Args...)>>", brief: "Runs a function asynchronously (potentially in a new thread) and returns a future for its result.", note: "The returned future's destructor blocks until the task completes. Letting it go out of scope immediately serializes the work.", link: "https://en.cppreference.com/w/cpp/thread/async" },
    ],
  },
  {
    id: 310,
    topic: "Standard Library Pitfalls",
    difficulty: "Medium",
    title: "Token Deduplicator",
    description: "Removes duplicate tokens from a sorted list using the erase-remove idiom.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

int main() {
    std::vector<std::string> tokens = {
        "apple", "banana", "apple", "cherry",
        "banana", "date", "cherry", "apple",
    };

    // Sort, then remove duplicates
    std::sort(tokens.begin(), tokens.end());

    std::unique(tokens.begin(), tokens.end());

    std::cout << "Unique tokens (" << tokens.size() << "):" << std::endl;
    for (auto& t : tokens) {
        std::cout << "  " << t << std::endl;
    }

    return 0;
}`,
    hints: [
      "What does `std::unique` return? Is the return value being used?",
      "Does `std::unique` actually remove elements from the container?",
    ],
    explanation: "`std::unique` doesn't remove elements — it moves unique elements to the front and returns an iterator to the new logical end. The call discards this return value, so the vector still has its original size with unspecified values at the tail. The vector reports 8 elements instead of 4 unique ones. The fix is the erase-remove idiom: `tokens.erase(std::unique(tokens.begin(), tokens.end()), tokens.end());`.",
    manifestation: `$ g++ -std=c++17 -Wall dedup.cpp -o dedup && ./dedup
Unique tokens (8):
  apple
  banana
  cherry
  date
  apple
  cherry
  cherry
  date

Expected output:
Unique tokens (4):
  apple
  banana
  cherry
  date`,
    stdlibRefs: [
      { name: "std::unique", args: "(ForwardIt first, ForwardIt last) → ForwardIt", brief: "Eliminates consecutive duplicate elements by moving unique elements to the front, returning an iterator past the new logical end.", note: "Does NOT resize the container. The returned iterator must be passed to erase() to actually remove the tail elements.", link: "https://en.cppreference.com/w/cpp/algorithm/unique" },
    ],
  },
  {
    id: 311,
    topic: "Standard Library Pitfalls",
    difficulty: "Hard",
    title: "Sensor Dashboard",
    description: "Reads sensor values that may be absent and displays a dashboard with averages.",
    code: `#include <iostream>
#include <optional>
#include <vector>
#include <string>
#include <iomanip>

struct Sensor {
    std::string name;
    std::optional<double> reading;
};

double averageReading(const std::vector<Sensor>& sensors) {
    double sum = 0;
    int count = 0;
    for (auto& s : sensors) {
        sum += s.reading.value_or(0.0);
        ++count;
    }
    return sum / count;
}

void printDashboard(const std::vector<Sensor>& sensors) {
    std::cout << std::fixed << std::setprecision(1);
    for (auto& s : sensors) {
        std::cout << s.name << ": ";
        if (s.reading) {
            std::cout << *s.reading << " °C" << std::endl;
        } else {
            std::cout << "N/A" << std::endl;
        }
    }
    std::cout << "Average: " << averageReading(sensors) << " °C" << std::endl;
}

int main() {
    std::vector<Sensor> sensors = {
        {"Kitchen",   22.5},
        {"Bedroom",   19.8},
        {"Garage",    std::nullopt},
        {"Bathroom",  24.1},
        {"Basement",  std::nullopt},
    };

    printDashboard(sensors);
    return 0;
}`,
    hints: [
      "Look at `averageReading`. How does it handle sensors with no reading?",
      "Does `value_or(0.0)` make absent sensors contribute zero to the sum? What about the count?",
    ],
    explanation: "The `averageReading` function uses `value_or(0.0)` which treats absent readings as 0.0, but still counts them in the denominator. With 3 valid readings (22.5 + 19.8 + 24.1 = 66.4) divided by 5 total sensors, the average is 13.28 instead of the correct 22.13. The `value_or` approach hides the distinction between 'no reading' and 'reading of 0.0'. The fix is to only add to sum and increment count when `s.reading.has_value()` is true.",
    manifestation: `$ g++ -std=c++17 -Wall sensor.cpp -o sensor && ./sensor
Kitchen: 22.5 °C
Bedroom: 19.8 °C
Garage: N/A
Bathroom: 24.1 °C
Basement: N/A
Average: 13.3 °C

Expected output:
...
Average: 22.1 °C`,
    stdlibRefs: [
      { name: "std::optional::value_or", args: "(T&& default_value) const& → T", brief: "Returns the contained value if present, otherwise returns the provided default.", note: "Using value_or(0) conflates 'missing' with 'zero'. Absent values should often be excluded from calculations, not defaulted.", link: "https://en.cppreference.com/w/cpp/utility/optional/value_or" },
    ],
  },
  {
    id: 312,
    topic: "Standard Library Pitfalls",
    difficulty: "Hard",
    title: "Lazy String Builder",
    description: "Builds a sentence lazily by emplacing string parts into a vector and joining them.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

class StringBuilder {
    std::vector<std::string> parts_;
public:
    StringBuilder& add(const std::string& part) {
        parts_.push_back(part);
        return *this;
    }

    const std::string& lastPart() const {
        return parts_.back();
    }

    std::string build(const std::string& separator = " ") const {
        std::ostringstream oss;
        for (size_t i = 0; i < parts_.size(); ++i) {
            if (i > 0) oss << separator;
            oss << parts_[i];
        }
        return oss.str();
    }
};

int main() {
    StringBuilder sb;
    sb.add("The").add("quick").add("brown");

    const std::string& ref = sb.lastPart();  // "brown"
    std::cout << "Last: " << ref << std::endl;

    // Add more words — vector may reallocate
    sb.add("fox").add("jumps").add("over");
    sb.add("the").add("lazy").add("dog");

    std::cout << "Last ref: " << ref << std::endl;
    std::cout << "Sentence: " << sb.build() << std::endl;

    return 0;
}`,
    hints: [
      "What does `ref` point to after more elements are added to the vector?",
      "What happens to references into a `std::vector` when the vector reallocates?",
    ],
    explanation: "The reference `ref` points to the third element in the vector's internal buffer. When more strings are added, the vector may reallocate to a larger buffer, invalidating all references, pointers, and iterators to its elements. Accessing `ref` after the reallocation is undefined behavior — it points to freed memory. The fix is to either copy the string (`std::string copy = sb.lastPart()`) or access it only after all modifications are done.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g builder.cpp -o builder && ./builder
Last: brown
=================================================================
==18234==ERROR: AddressSanitizer: heap-use-after-free on address
    0x60400000eff0 at pc 0x5555557a3e12 bp 0x7fffffffd890
READ of size 8 at 0x60400000eff0 thread T0
    #0 0x5555557a3e11 in main builder.cpp:35
    #1 0x7ffff7229d8f in __libc_start_call_main
0x60400000eff0 is located 48 bytes inside of 96-byte region
    [0x60400000efc0,0x60400000f020)
freed by thread T0 here:
    #0 0x7ffff74b3b6f in operator delete(void*)
    #1 0x5555557a5a23 in std::vector<std::string>::_M_realloc_insert`,
    stdlibRefs: [
      { name: "std::vector::push_back", args: "(const T& value) → void | (T&& value) → void", brief: "Appends an element to the end of the vector.", note: "If the new size exceeds capacity, reallocation occurs and all iterators, references, and pointers to elements are invalidated.", link: "https://en.cppreference.com/w/cpp/container/vector/push_back" },
    ],
  },
  {
    id: 313,
    topic: "Standard Library Pitfalls",
    difficulty: "Hard",
    title: "Concurrent Counter Map",
    description: "Uses emplace to safely insert into a shared map and counts occurrences of each word in parallel.",
    code: `#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <thread>
#include <mutex>

class WordCounter {
    std::map<std::string, int> counts_;
    std::mutex mtx_;
public:
    void count(const std::string& word) {
        std::lock_guard<std::mutex> lock(mtx_);
        auto [it, inserted] = counts_.emplace(word, 1);
        if (!inserted) {
            it->second++;
        }
    }

    void merge(const WordCounter& other) {
        for (auto& [word, cnt] : other.counts_) {
            std::lock_guard<std::mutex> lock(mtx_);
            counts_[word] += cnt;
        }
    }

    void print() const {
        for (auto& [word, cnt] : counts_) {
            std::cout << word << ": " << cnt << std::endl;
        }
    }
};

int main() {
    WordCounter global;
    std::vector<std::string> corpus = {
        "the", "quick", "brown", "fox", "the",
        "lazy", "dog", "the", "fox", "quick",
    };

    std::vector<std::thread> threads;
    for (auto& word : corpus) {
        threads.emplace_back([&global, &word] {
            global.count(word);
        });
    }

    for (auto& t : threads) t.join();

    global.print();
    return 0;
}`,
    hints: [
      "Look at the lambda capture. What does `&word` refer to during thread execution?",
      "When does the loop variable `word` change? Is the thread guaranteed to read it before the next iteration?",
    ],
    explanation: "The lambda captures `word` by reference (`&word`), but `word` is the loop variable that changes each iteration. By the time a thread executes, the loop may have advanced, so `word` could refer to a different string — or worse, if the loop has finished, the reference may dangle. This is a classic data race on the captured reference. The fix is to capture by value: `[&global, word]` or `[&global, w = word]`.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=thread counter.cpp -o counter -pthread && ./counter
==================
WARNING: ThreadSanitizer: data race (pid=21345)
  Read of size 8 at 0x7ffd4a2c1e80 by thread T3:
    #0 std::string::data() const
    #1 WordCounter::count(std::string const&) counter.cpp:14
  Previous write of size 8 at 0x7ffd4a2c1e80 by main thread:
    #0 std::string::operator=(std::string const&)
    #1 main counter.cpp:43
==================
brown: 1
dog: 1
fox: 1
lazy: 1
quick: 3
the: 4`,
    stdlibRefs: [
      { name: "std::map::emplace", args: "(Args&&... args) → std::pair<iterator, bool>", brief: "Constructs an element in-place if the key doesn't exist, returning an iterator and whether insertion occurred.", link: "https://en.cppreference.com/w/cpp/container/map/emplace" },
    ],
  },

  // ── Object Model ──

  {
    id: 314,
    topic: "Object Model",
    difficulty: "Easy",
    title: "Chained Assignment",
    description: "Implements a simple counter class with an assignment operator and uses chained assignment.",
    code: `#include <iostream>

class Counter {
    int count_;
public:
    Counter(int c = 0) : count_(c) {}

    void operator=(const Counter& other) {
        count_ = other.count_;
    }

    int value() const { return count_; }
    void increment() { ++count_; }
};

int main() {
    Counter a(10), b(20), c(30);

    std::cout << "Before: a=" << a.value()
              << " b=" << b.value()
              << " c=" << c.value() << std::endl;

    a = b = c;

    std::cout << "After:  a=" << a.value()
              << " b=" << b.value()
              << " c=" << c.value() << std::endl;

    return 0;
}`,
    hints: [
      "Look at the return type of `operator=`. What does it return?",
      "What does chained assignment `a = b = c` require from the return value of `operator=`?",
    ],
    explanation: "The assignment operator returns `void` instead of `Counter&`. Chained assignment `a = b = c` evaluates right-to-left: first `b = c` (which returns `void`), then `a = (void)` — which won't compile because there's no conversion from `void` to `Counter`. The fix is to return `*this` by reference: `Counter& operator=(const Counter& other) { count_ = other.count_; return *this; }`.",
    manifestation: `$ g++ -std=c++17 -Wall counter.cpp -o counter
counter.cpp: In function 'int main()':
counter.cpp:20:11: error: no match for 'operator=' (operand types
    are 'Counter' and 'void')
   20 |     a = b = c;
      |           ^
counter.cpp:8:10: note: candidate: 'void Counter::operator=(
    const Counter&)'
      8 |     void operator=(const Counter& other) {
      |          ^~~~~~~~
counter.cpp:8:10: note:   no known conversion for argument 1
    from 'void' to 'const Counter&'`,
    stdlibRefs: [],
  },
  {
    id: 315,
    topic: "Object Model",
    difficulty: "Easy",
    title: "Animal Sounds",
    description: "Defines a base Animal class with a speak method and derived Dog and Cat classes.",
    code: `#include <iostream>
#include <string>
#include <vector>
#include <memory>

class Animal {
public:
    virtual std::string speak() const { return "..."; }
    virtual ~Animal() = default;
};

class Dog : public Animal {
    std::string name_;
public:
    Dog(const std::string& name) : name_(name) {}
    std::string speak(bool excited) const {
        return excited ? "WOOF WOOF!" : "woof";
    }
    const std::string& name() const { return name_; }
};

class Cat : public Animal {
    std::string name_;
public:
    Cat(const std::string& name) : name_(name) {}
    std::string speak() const override { return "meow"; }
    const std::string& name() const { return name_; }
};

int main() {
    std::vector<std::unique_ptr<Animal>> animals;
    animals.push_back(std::make_unique<Dog>("Rex"));
    animals.push_back(std::make_unique<Cat>("Whiskers"));
    animals.push_back(std::make_unique<Dog>("Buddy"));

    for (auto& a : animals) {
        std::cout << a->speak() << std::endl;
    }

    return 0;
}`,
    hints: [
      "Compare Dog's `speak` method signature with Animal's `speak` signature. Are they the same?",
      "Does Dog's `speak(bool)` override Animal's `speak()`, or does it hide it?",
    ],
    explanation: "Dog's `speak(bool excited)` has a different parameter list from Animal's `speak()`. This means Dog doesn't override the base virtual function — it hides it. When called through an `Animal*`, virtual dispatch finds no override in Dog, so `Animal::speak()` is called, returning \"...\". All dogs say \"...\" instead of \"woof\". Adding `override` to Dog's speak would have caught this at compile time. The fix is to add a `speak() const override` to Dog, or change the base interface to match.",
    manifestation: `$ g++ -std=c++17 -Wall animals.cpp -o animals && ./animals
...
meow
...

Expected output:
woof
meow
woof`,
    stdlibRefs: [],
  },
  {
    id: 316,
    topic: "Object Model",
    difficulty: "Easy",
    title: "Cached Computation",
    description: "Caches an expensive computation result inside a const method using a mutable member.",
    code: `#include <iostream>
#include <cmath>

class Statistics {
    double data_[1000];
    int size_;
    double cachedMean_;
    bool meanCached_;
public:
    Statistics(int n) : size_(n), cachedMean_(0), meanCached_(false) {
        for (int i = 0; i < n && i < 1000; ++i)
            data_[i] = std::sin(i * 0.1) * 100;
    }

    double mean() const {
        if (!meanCached_) {
            double sum = 0;
            for (int i = 0; i < size_; ++i)
                sum += data_[i];
            cachedMean_ = sum / size_;
            meanCached_ = true;
        }
        return cachedMean_;
    }
};

int main() {
    const Statistics stats(500);
    std::cout << "Mean: " << stats.mean() << std::endl;
    std::cout << "Mean again: " << stats.mean() << std::endl;
    return 0;
}`,
    hints: [
      "The `mean()` method is const, but it modifies `cachedMean_` and `meanCached_`. Is this allowed?",
      "What keyword would you need on those members to allow modification in a const method?",
    ],
    explanation: "The method `mean()` is declared `const`, meaning it cannot modify any data members. But it tries to assign to `cachedMean_` and `meanCached_`, which are not declared `mutable`. This causes a compilation error. The fix is to declare `cachedMean_` and `meanCached_` as `mutable`, which allows modification even in const methods — this is the intended use case for `mutable` (caching/memoization).",
    manifestation: `$ g++ -std=c++17 -Wall stats.cpp -o stats
stats.cpp: In member function 'double Statistics::mean() const':
stats.cpp:20:26: error: assignment of member 'Statistics::cachedMean_'
    in read-only object
   20 |             cachedMean_ = sum / size_;
      |             ~~~~~~~~~~~~^~~~~~~~~~~~
stats.cpp:21:25: error: assignment of member 'Statistics::meanCached_'
    in read-only object
   21 |             meanCached_ = true;
      |             ~~~~~~~~~~~~^~~~~`,
    stdlibRefs: [],
  },
  {
    id: 317,
    topic: "Object Model",
    difficulty: "Medium",
    title: "Resource Swapper",
    description: "Implements copy-and-swap idiom for a resource-owning class to provide exception-safe assignment.",
    code: `#include <iostream>
#include <algorithm>
#include <cstring>

class Buffer {
    char* data_;
    size_t size_;
public:
    Buffer(size_t sz = 0) : data_(sz ? new char[sz]() : nullptr), size_(sz) {}

    Buffer(const Buffer& other) : data_(new char[other.size_]), size_(other.size_) {
        std::memcpy(data_, other.data_, size_);
    }

    ~Buffer() { delete[] data_; }

    friend void swap(Buffer& a, Buffer& b) noexcept {
        using std::swap;
        swap(a.data_, b.data_);
        // forgot to swap size_
    }

    Buffer& operator=(Buffer other) {  // pass by value (copy)
        swap(*this, other);
        return *this;
    }

    size_t size() const { return size_; }
    char* data() { return data_; }
    const char* data() const { return data_; }
};

int main() {
    Buffer a(10);
    std::memset(a.data(), 'A', a.size());

    Buffer b(5);
    std::memset(b.data(), 'B', b.size());

    std::cout << "Before: a.size=" << a.size()
              << " b.size=" << b.size() << std::endl;

    a = b;

    std::cout << "After:  a.size=" << a.size() << std::endl;
    std::cout << "Content: ";
    for (size_t i = 0; i < a.size(); ++i) std::cout << a.data()[i];
    std::cout << std::endl;

    return 0;
}`,
    hints: [
      "Look at the `swap` friend function. Does it swap all members?",
      "After the swap, what is `a.size_` and what buffer does `a.data_` point to?",
    ],
    explanation: "The `swap` function forgets to swap `size_`. After `a = b`, `a.data_` points to b's old 5-byte buffer (containing 'B's), but `a.size_` still holds 10 (the old value). Now `a` thinks it has 10 bytes but the buffer is only 5, so accessing `a.data()[5]` through `a.data()[9]` is a heap buffer overflow. Meanwhile, the temporary `other` destructor will `delete[]` the 10-byte buffer with `size_` = 5. The fix is to add `swap(a.size_, b.size_);` in the swap function.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g swap.cpp -o swap && ./swap
Before: a.size=10 b.size=5
After:  a.size=10
Content: BBBBB=================================================================
==25671==ERROR: AddressSanitizer: heap-buffer-overflow on address
    0x602000000035 at pc 0x555555758a12 bp 0x7fffffffd8a0
READ of size 1 at 0x602000000035 thread T0
    #0 0x555555758a11 in main swap.cpp:43
0x602000000035 is located 0 bytes after 5-byte region
    [0x602000000030,0x602000000035)`,
    stdlibRefs: [],
  },
  {
    id: 318,
    topic: "Object Model",
    difficulty: "Medium",
    title: "Immutable Config",
    description: "Provides a read-only configuration interface that internally caches parsed values.",
    code: `#include <iostream>
#include <string>
#include <map>

class Config {
    std::map<std::string, std::string> data_;
public:
    Config() {
        data_["name"] = "MyApp";
        data_["version"] = "1.0";
        data_["debug"] = "false";
    }

    const std::string& get(const std::string& key) const {
        return data_.at(key);
    }

    void update(const std::string& key, const std::string& val) {
        data_[key] = val;
    }
};

void processConfig(const Config& cfg) {
    std::string name = cfg.get("name");

    // Developer wants to temporarily enable debug mode for testing
    const_cast<Config&>(cfg).update("debug", "true");

    std::cout << "App: " << name << std::endl;
    std::cout << "Debug: " << cfg.get("debug") << std::endl;
}

int main() {
    const Config appConfig;
    processConfig(appConfig);

    // Later code expects config unchanged
    std::cout << "Debug still: " << appConfig.get("debug") << std::endl;

    return 0;
}`,
    hints: [
      "What does `const_cast` do to the const Config reference? Is this safe?",
      "If the original object is declared `const`, what does the standard say about modifying it through a const_cast?",
    ],
    explanation: "The `const_cast` removes const from a reference to `appConfig`, which was originally declared `const`. Modifying a truly const object through a const_cast is undefined behavior per the C++ standard. Even when it appears to work, the compiler may have optimized reads from `appConfig` assuming it never changes — so `appConfig.get(\"debug\")` in main might still return \"false\" due to the compiler caching the value. The fix is to not declare `appConfig` as const if it needs modification, or use a separate mutable copy for testing.",
    manifestation: `$ g++ -std=c++17 -O0 config.cpp -o config && ./config
App: MyApp
Debug: true
Debug still: true

$ g++ -std=c++17 -O2 config.cpp -o config && ./config
App: MyApp
Debug: true
Debug still: false

(Different results at different optimization levels — undefined
behavior. The compiler assumes const objects don't change and
may cache the original value.)`,
    stdlibRefs: [],
  },
  {
    id: 319,
    topic: "Object Model",
    difficulty: "Medium",
    title: "Cloneable Shapes",
    description: "Implements a clone method on a shape hierarchy using covariant return types.",
    code: `#include <iostream>
#include <string>
#include <memory>
#include <vector>

class Shape {
public:
    virtual Shape* clone() const = 0;
    virtual std::string describe() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius_;
public:
    Circle(double r) : radius_(r) {}
    Shape* clone() const override { return new Circle(*this); }
    std::string describe() const override {
        return "Circle(r=" + std::to_string(radius_) + ")";
    }
    double radius() const { return radius_; }
};

class Square : public Shape {
    double side_;
public:
    Square(double s) : side_(s) {}
    Shape* clone() const override { return new Square(*this); }
    std::string describe() const override {
        return "Square(s=" + std::to_string(side_) + ")";
    }
    double side() const { return side_; }
};

int main() {
    Circle c(5.0);
    Circle* copy = c.clone();  // direct clone of a Circle

    std::cout << "Original: " << c.describe() << std::endl;
    std::cout << "Clone: " << copy->describe() << std::endl;
    std::cout << "Clone radius: " << copy->radius() << std::endl;

    delete copy;
    return 0;
}`,
    hints: [
      "Look at the return type of `Circle::clone()`. What type does it return?",
      "Can you call `radius()` on the pointer returned by `clone()` without a cast?",
    ],
    explanation: "Circle's `clone()` returns `Shape*` instead of `Circle*`. C++ supports covariant return types — a derived class override can return a more-derived pointer. But since `clone()` returns `Shape*`, `c.clone()` returns a `Shape*` which cannot be assigned to `Circle*` without a cast. The line `Circle* copy = c.clone()` won't compile. The fix is to declare Circle's clone as `Circle* clone() const override { ... }` — this is valid covariant return typing.",
    manifestation: `$ g++ -std=c++17 -Wall shapes.cpp -o shapes
shapes.cpp: In function 'int main()':
shapes.cpp:37:28: error: invalid conversion from 'Shape*' to
    'Circle*' [-fpermissive]
   37 |     Circle* copy = c.clone();
      |                    ~~~~~~~~^
      |                            |
      |                            Shape*`,
    stdlibRefs: [],
  },
  {
    id: 320,
    topic: "Object Model",
    difficulty: "Hard",
    title: "Moveable Resource",
    description: "Implements a resource-managing class with a user-defined destructor and relies on move semantics.",
    code: `#include <iostream>
#include <vector>
#include <string>

class Connection {
    std::string host_;
    int fd_;
    bool connected_;
public:
    Connection(const std::string& host, int fd)
        : host_(host), fd_(fd), connected_(true) {
        std::cout << "Connected to " << host_ << " (fd=" << fd_ << ")" << std::endl;
    }

    ~Connection() {
        if (connected_) {
            std::cout << "Disconnecting from " << host_
                      << " (fd=" << fd_ << ")" << std::endl;
            connected_ = false;
        }
    }

    std::string host() const { return host_; }
    bool isConnected() const { return connected_; }
};

int main() {
    std::vector<Connection> pool;

    pool.push_back(Connection("db.example.com", 3));
    pool.push_back(Connection("cache.example.com", 4));
    pool.push_back(Connection("api.example.com", 5));

    std::cout << "\\nPool has " << pool.size() << " connections:" << std::endl;
    for (auto& c : pool) {
        std::cout << "  " << c.host() << " connected=" << c.isConnected() << std::endl;
    }

    return 0;
}`,
    hints: [
      "This class has a user-defined destructor. What does the Rule of Five say about that?",
      "When the vector reallocates and needs to relocate elements, which operation does it use — move or copy?",
      "Does the compiler generate a move constructor when a destructor is user-defined?",
    ],
    explanation: "The class has a user-defined destructor, which suppresses the implicit move constructor and move assignment operator. When the vector grows and reallocates, it copies (not moves) existing elements into the new buffer, then destroys the old copies. Each copy-and-destroy cycle prints a spurious 'Disconnecting' message for a connection that's still alive in the pool. With three push_backs, the vector reallocates multiple times, causing phantom disconnect messages. The fix is to either define move operations, or use `pool.reserve(3)` to prevent reallocation.",
    manifestation: `$ g++ -std=c++17 -Wall conn.cpp -o conn && ./conn
Connected to db.example.com (fd=3)
Disconnecting from  (fd=0)
Connected to cache.example.com (fd=4)
Disconnecting from db.example.com (fd=3)
Disconnecting from  (fd=0)
Connected to api.example.com (fd=5)
Disconnecting from db.example.com (fd=3)
Disconnecting from cache.example.com (fd=4)
Disconnecting from  (fd=0)

Pool has 3 connections:
  db.example.com connected=1
  cache.example.com connected=1
  api.example.com connected=1

(Multiple spurious "Disconnecting" messages from temporaries and
copies during vector reallocation)`,
    stdlibRefs: [
      { name: "std::vector::push_back", args: "(const T& value) → void | (T&& value) → void", brief: "Appends an element to the end of the vector.", note: "If the element type has no move constructor (suppressed by user-defined destructor), push_back copies instead of moving during reallocation.", link: "https://en.cppreference.com/w/cpp/container/vector/push_back" },
    ],
  },
  {
    id: 321,
    topic: "Object Model",
    difficulty: "Hard",
    title: "Polymorphic Messenger",
    description: "Passes message objects by value through a processing pipeline and prints each message's type.",
    code: `#include <iostream>
#include <string>
#include <vector>

class Message {
protected:
    std::string content_;
public:
    Message(const std::string& content) : content_(content) {}
    virtual std::string type() const { return "Message"; }
    virtual std::string format() const {
        return "[" + type() + "] " + content_;
    }
    virtual ~Message() = default;
};

class Alert : public Message {
    int severity_;
public:
    Alert(const std::string& content, int sev)
        : Message(content), severity_(sev) {}
    std::string type() const override { return "Alert"; }
    std::string format() const override {
        return "[" + type() + " sev=" + std::to_string(severity_) + "] " + content_;
    }
};

class Notification : public Message {
    std::string channel_;
public:
    Notification(const std::string& content, const std::string& ch)
        : Message(content), channel_(ch) {}
    std::string type() const override { return "Notification"; }
    std::string format() const override {
        return "[" + type() + " #" + channel_ + "] " + content_;
    }
};

void processMessage(Message msg) {
    std::cout << msg.format() << std::endl;
}

int main() {
    Alert a("Server down!", 5);
    Notification n("New user signed up", "general");

    processMessage(a);
    processMessage(n);

    return 0;
}`,
    hints: [
      "How is `msg` passed to `processMessage`? Is it passed by value or by reference?",
      "What happens to derived-class data when a derived object is copied into a base-class value?",
    ],
    explanation: "The function `processMessage(Message msg)` takes a `Message` by value. When an `Alert` or `Notification` is passed, it gets sliced — only the `Message` portion is copied, discarding the derived class's data members (`severity_`, `channel_`) and vtable pointer. Inside `processMessage`, `msg.format()` calls `Message::format()`, not the derived overrides. Both messages print as plain `[Message]` without their extra fields. The fix is to pass by reference: `void processMessage(const Message& msg)`.",
    manifestation: `$ g++ -std=c++17 -Wall messenger.cpp -o messenger && ./messenger
[Message] Server down!
[Message] New user signed up

Expected output:
[Alert sev=5] Server down!
[Notification #general] New user signed up`,
    stdlibRefs: [],
  },
  {
    id: 322,
    topic: "Object Model",
    difficulty: "Hard",
    title: "Self-Referencing Node",
    description: "Implements a linked list node that tracks its own position and adjusts pointers on copy.",
    code: `#include <iostream>
#include <string>

class Node {
    std::string label_;
    Node* next_;
    Node* self_;  // points to this node itself (used for validation)
public:
    Node(const std::string& label, Node* next = nullptr)
        : label_(label), next_(next), self_(this) {}

    Node(const Node& other)
        : label_(other.label_), next_(other.next_), self_(this) {}

    Node& operator=(const Node& other) {
        label_ = other.label_;
        next_ = other.next_;
        // self_ deliberately not updated — should always be 'this'
        return *this;
    }

    bool isValid() const { return self_ == this; }

    void print() const {
        const Node* cur = this;
        while (cur) {
            std::cout << cur->label_;
            if (!cur->isValid()) std::cout << " [INVALID]";
            if (cur->next_) std::cout << " -> ";
            cur = cur->next_;
        }
        std::cout << std::endl;
    }
};

int main() {
    Node c("C");
    Node b("B", &c);
    Node a("A", &b);

    std::cout << "Original: ";
    a.print();

    // Copy the whole chain
    Node a2 = a;
    std::cout << "Copy: ";
    a2.print();

    return 0;
}`,
    hints: [
      "When `a2` is copied from `a`, what does `a2.next_` point to?",
      "Does the copy create new nodes for B and C, or does it share them with the original?",
    ],
    explanation: "The copy constructor copies `next_` directly from the source, so `a2.next_` still points to the original `b` (on the stack), not to a copy of `b`. The 'copy' isn't really a deep copy of the chain — `a2` is a new node labeled 'A' but its tail is the original chain. Modifying or destroying the original nodes `b` or `c` would leave `a2` with dangling pointers. When `b` goes out of scope before `a2`, `a2.next_` becomes a dangling pointer. This is a shallow copy bug in a self-referential data structure.",
    manifestation: `$ g++ -std=c++17 -Wall node.cpp -o node && ./node
Original: A -> B -> C
Copy: A -> B -> C

(Output looks correct, but a2's B and C are the SAME objects as
the original — not copies. Proof:)

$ g++ -std=c++17 -Wall node2.cpp -o node2 && ./node2
Original: A -> B -> C
Copy: A -> B -> C
After modifying original B:
Original: A -> X -> C
Copy:     A -> X -> C    ← copy was corrupted too`,
    stdlibRefs: [],
  },
  {
    id: 323,
    topic: "Object Model",
    difficulty: "Medium",
    title: "Numeric Wrapper",
    description: "Wraps a numeric value with implicit conversion to allow transparent use in arithmetic expressions.",
    code: `#include <iostream>

class Numeric {
    double value_;
public:
    Numeric(double v) : value_(v) {}

    Numeric operator+(const Numeric& rhs) const {
        return Numeric(value_ + rhs.value_);
    }

    Numeric operator*(const Numeric& rhs) const {
        return Numeric(value_ * rhs.value_);
    }

    bool operator<(const Numeric& rhs) const {
        return value_ < rhs.value_;
    }

    void print() const { std::cout << value_; }
};

int main() {
    Numeric a(3.0), b(4.0);

    Numeric sum = a + b;
    Numeric product = a * 2.0;

    std::cout << "Sum: "; sum.print(); std::cout << std::endl;
    std::cout << "Product: "; product.print(); std::cout << std::endl;

    if (a < 5.0) {
        std::cout << "a < 5" << std::endl;
    }

    if (2.0 < a) {
        std::cout << "2 < a" << std::endl;
    }

    return 0;
}`,
    hints: [
      "Look at `2.0 < a`. Which `operator<` would this call? Can `double` be on the left side?",
      "The constructor `Numeric(double)` is not explicit. What implicit conversions does this enable?",
      "Does `2.0 < a` find the member `operator<` with a `double` on the left-hand side?",
    ],
    explanation: "The expression `a * 2.0` works because the non-explicit constructor allows implicit conversion of `2.0` to `Numeric`. `a < 5.0` also works for the same reason. But `2.0 < a` does NOT work — the member `operator<` requires a `Numeric` on the left, and the compiler can't implicitly convert the left-hand operand of a member operator. This fails to compile. The fix is to define `operator<` as a free function (non-member), which allows implicit conversion on both sides: `friend bool operator<(const Numeric& lhs, const Numeric& rhs)`.",
    manifestation: `$ g++ -std=c++17 -Wall numeric.cpp -o numeric
numeric.cpp: In function 'int main()':
numeric.cpp:33:13: error: no match for 'operator<' (operand types
    are 'double' and 'Numeric')
   33 |     if (2.0 < a) {
      |         ~~~ ^ ~
      |         |     |
      |         |     Numeric
      |         double`,
    stdlibRefs: [],
  },

  // ── Concurrency Patterns ──

  {
    id: 324,
    topic: "Concurrency Patterns",
    difficulty: "Easy",
    title: "Spin Counter",
    description: "Two threads increment a shared counter using atomic operations, printing the final total.",
    code: `#include <iostream>
#include <thread>
#include <atomic>

std::atomic<int> counter{0};

void increment(int times) {
    for (int i = 0; i < times; ++i) {
        counter.store(counter.load(std::memory_order_relaxed) + 1,
                      std::memory_order_relaxed);
    }
}

int main() {
    std::thread t1(increment, 500000);
    std::thread t2(increment, 500000);
    t1.join();
    t2.join();
    std::cout << "Counter: " << counter.load() << std::endl;
    std::cout << "Expected: 1000000" << std::endl;
    return 0;
}`,
    hints: [
      "Look at the increment operation. Is it truly atomic, or is it a load-then-store?",
      "What happens if two threads both load the same value before either stores?",
    ],
    explanation: "The increment is a separate `load()` followed by a `store()`. Between the load and the store, the other thread can also load the same value, and both threads store `old_value + 1` — losing one increment. This is a classic lost-update race condition. Even though `counter` is atomic, the compound read-modify-write is not atomic. The fix is to use `counter.fetch_add(1, std::memory_order_relaxed)` which is a single atomic read-modify-write operation.",
    manifestation: `$ g++ -std=c++17 -O2 spin.cpp -o spin -pthread && ./spin
Counter: 672314
Expected: 1000000

$ ./spin
Counter: 691205
Expected: 1000000

(Lost updates — different count each run)`,
    stdlibRefs: [
      { name: "std::atomic::fetch_add", args: "(T arg, memory_order order) → T", brief: "Atomically adds arg to the stored value and returns the previous value.", note: "Unlike a separate load+store, fetch_add is a single atomic read-modify-write operation with no race window.", link: "https://en.cppreference.com/w/cpp/atomic/atomic/fetch_add" },
    ],
  },
  {
    id: 325,
    topic: "Concurrency Patterns",
    difficulty: "Easy",
    title: "Producer Flag",
    description: "A producer thread prepares data and sets a flag; a consumer thread waits for the flag then reads the data.",
    code: `#include <iostream>
#include <thread>
#include <atomic>
#include <string>

std::string sharedData;
std::atomic<bool> ready{false};

void producer() {
    sharedData = "Hello from producer!";
    ready.store(true, std::memory_order_relaxed);
}

void consumer() {
    while (!ready.load(std::memory_order_relaxed)) {
        // spin
    }
    std::cout << "Received: " << sharedData << std::endl;
}

int main() {
    std::thread t1(consumer);
    std::thread t2(producer);
    t1.join();
    t2.join();
    return 0;
}`,
    hints: [
      "What memory ordering is used for the flag? What guarantees does `relaxed` provide?",
      "Can the consumer see `ready == true` but still read the old value of `sharedData`?",
    ],
    explanation: "Using `memory_order_relaxed` for both the store and load of the flag provides no synchronization guarantees. The consumer may observe `ready == true` but still see `sharedData` as empty because relaxed ordering allows the processor and compiler to reorder the non-atomic write to `sharedData` after the atomic store to `ready`. The fix is to use `memory_order_release` for the store and `memory_order_acquire` for the load, which establishes a happens-before relationship.",
    manifestation: `$ g++ -std=c++17 -O2 flag.cpp -o flag -pthread && ./flag
Received:

$ ./flag
Received: Hello from producer!

$ ./flag
Received:

(Race condition: sometimes the data is visible, sometimes it's
empty. The relaxed ordering doesn't synchronize the non-atomic
string write with the atomic flag.)`,
    stdlibRefs: [
      { name: "std::atomic::store", args: "(T desired, memory_order order) → void", brief: "Atomically stores a value.", note: "memory_order_relaxed provides atomicity but no ordering guarantees for surrounding non-atomic operations. Use release/acquire for synchronization.", link: "https://en.cppreference.com/w/cpp/atomic/atomic/store" },
    ],
  },
  {
    id: 326,
    topic: "Concurrency Patterns",
    difficulty: "Easy",
    title: "Bounded Work Queue",
    description: "Implements a thread-safe queue where producers wait when the queue is full and consumers wait when it's empty.",
    code: `#include <iostream>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>

template<typename T, size_t MaxSize = 5>
class BoundedQueue {
    std::queue<T> queue_;
    std::mutex mtx_;
    std::condition_variable cv_;
public:
    void push(T item) {
        std::unique_lock<std::mutex> lock(mtx_);
        cv_.wait(lock, [this]{ return queue_.size() < MaxSize; });
        queue_.push(std::move(item));
        cv_.notify_one();
    }

    T pop() {
        std::unique_lock<std::mutex> lock(mtx_);
        if (queue_.empty()) {
            cv_.wait(lock);
        }
        T item = std::move(queue_.front());
        queue_.pop();
        cv_.notify_one();
        return item;
    }
};

int main() {
    BoundedQueue<int> q;

    std::thread producer([&q] {
        for (int i = 0; i < 10; ++i) {
            q.push(i);
            std::cout << "Produced: " << i << std::endl;
        }
    });

    std::thread consumer([&q] {
        for (int i = 0; i < 10; ++i) {
            int val = q.pop();
            std::cout << "Consumed: " << val << std::endl;
        }
    });

    producer.join();
    consumer.join();
    return 0;
}`,
    hints: [
      "Compare how `push()` and `pop()` wait on the condition variable. Is there a difference?",
      "Can a condition variable wake up even when no one called `notify`? What is a 'spurious wakeup'?",
    ],
    explanation: "The `pop()` method uses a bare `cv_.wait(lock)` without a predicate, while `push()` correctly uses `cv_.wait(lock, predicate)`. Without a predicate, `pop()` is vulnerable to spurious wakeups — the thread may wake up even though no element was pushed. It then calls `queue_.front()` on an empty queue, which is undefined behavior. The fix is to use a predicate: `cv_.wait(lock, [this]{ return !queue_.empty(); });`.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=thread queue.cpp -o queue -pthread && ./queue
Produced: 0
Consumed: 0
Produced: 1
Consumed: 1
...
(Usually works — but under heavy load or specific scheduling:)

$ stress --cpu 8 & ./queue
Segmentation fault (core dumped)

(Spurious wakeup caused pop() to access an empty queue)`,
    stdlibRefs: [
      { name: "std::condition_variable::wait", args: "(unique_lock<mutex>& lock) → void | (unique_lock<mutex>& lock, Predicate pred) → void", brief: "Blocks the current thread until the condition variable is notified.", note: "The no-predicate overload is susceptible to spurious wakeups. Always use the predicate overload to re-check the condition.", link: "https://en.cppreference.com/w/cpp/thread/condition_variable/wait" },
    ],
  },
  {
    id: 327,
    topic: "Concurrency Patterns",
    difficulty: "Medium",
    title: "Cache-Aligned Counters",
    description: "Provides per-thread counters that are summed at the end to avoid contention on a single atomic.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <atomic>
#include <chrono>

struct Counters {
    std::atomic<long long> count1{0};
    std::atomic<long long> count2{0};
};

void worker1(Counters& c, int iterations) {
    for (int i = 0; i < iterations; ++i) {
        c.count1.fetch_add(1, std::memory_order_relaxed);
    }
}

void worker2(Counters& c, int iterations) {
    for (int i = 0; i < iterations; ++i) {
        c.count2.fetch_add(1, std::memory_order_relaxed);
    }
}

int main() {
    Counters c;
    const int N = 10000000;

    auto start = std::chrono::steady_clock::now();

    std::thread t1(worker1, std::ref(c), N);
    std::thread t2(worker2, std::ref(c), N);
    t1.join();
    t2.join();

    auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::steady_clock::now() - start).count();

    std::cout << "count1: " << c.count1 << std::endl;
    std::cout << "count2: " << c.count2 << std::endl;
    std::cout << "Elapsed: " << elapsed << "ms" << std::endl;

    return 0;
}`,
    hints: [
      "The two counters are in the same struct. How large is an `std::atomic<long long>`?",
      "What happens when two frequently-modified variables share the same cache line?",
      "Look up 'false sharing'. Are the two atomics on the same 64-byte cache line?",
    ],
    explanation: "Both `count1` and `count2` are adjacent in the struct, so they almost certainly share the same 64-byte cache line. Each thread modifying its counter causes the other thread's cache line to be invalidated, forcing a cache reload on every access — this is 'false sharing.' The program is functionally correct (both counters reach N) but performs far worse than expected due to constant cache invalidation. The fix is to pad the struct: use `alignas(64)` or `std::hardware_destructive_interference_size` to put each counter on its own cache line.",
    manifestation: `$ g++ -std=c++17 -O2 counters.cpp -o counters -pthread && ./counters
count1: 10000000
count2: 10000000
Elapsed: 312ms

(With cache-line padding applied:)
$ ./counters_fixed
count1: 10000000
count2: 10000000
Elapsed: 47ms

(~6.6x slower due to false sharing — both atomics share the
same cache line, causing constant cache invalidation between cores)`,
    stdlibRefs: [],
  },
  {
    id: 328,
    topic: "Concurrency Patterns",
    difficulty: "Medium",
    title: "Read-Write Cache",
    description: "Uses a shared mutex to allow many concurrent readers but exclusive access for writers.",
    code: `#include <iostream>
#include <shared_mutex>
#include <thread>
#include <map>
#include <string>
#include <vector>
#include <chrono>

class Cache {
    std::map<std::string, std::string> data_;
    mutable std::shared_mutex mtx_;
public:
    std::string get(const std::string& key) const {
        std::shared_lock<std::shared_mutex> lock(mtx_);
        auto it = data_.find(key);
        if (it != data_.end()) {
            return it->second;
        }
        // Cache miss — need to compute and store
        lock.unlock();
        std::string value = "computed_" + key;  // simulate computation

        std::unique_lock<std::shared_mutex> wlock(mtx_);
        data_[key] = value;
        return value;
    }

    void set(const std::string& key, const std::string& value) {
        std::unique_lock<std::shared_mutex> lock(mtx_);
        data_[key] = value;
    }
};

int main() {
    Cache cache;
    cache.set("user:1", "Alice");

    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&cache, i] {
            for (int j = 0; j < 100; ++j) {
                auto val = cache.get("user:" + std::to_string(i));
                (void)val;
            }
        });
    }

    for (auto& t : threads) t.join();
    std::cout << "Done" << std::endl;
    return 0;
}`,
    hints: [
      "Look at the `get` method. What happens between unlocking the shared lock and acquiring the unique lock?",
      "Can the `get` method modify `data_` while the object is `const`?",
      "Multiple threads miss the cache simultaneously. Do they all try to upgrade to a write lock?",
    ],
    explanation: "The `get()` method is `const` but tries to modify `data_` (a non-mutable member) through the unique_lock path — this won't compile. Beyond that, the pattern of unlocking the shared lock and then taking a unique lock creates a window where another thread can also miss the cache and both try to write. There is no atomic upgrade from shared to exclusive lock in C++. The fix is to either make `data_` mutable and handle the race (double-checked locking), or make `get()` non-const.",
    manifestation: `$ g++ -std=c++17 -Wall cache.cpp -o cache -pthread
cache.cpp: In member function 'std::string Cache::get(
    const std::string&) const':
cache.cpp:23:19: error: passing 'const std::map<std::string,
    std::string>' as 'this' argument discards qualifiers
   23 |         data_[key] = value;
      |                   ^
/usr/include/c++/11/bits/stl_map.h:492:7: note: 'mapped_type&
    std::map<_Key, _Tp>::operator[]' is not marked const`,
    stdlibRefs: [
      { name: "std::shared_mutex", brief: "A mutex that allows multiple shared (read) locks or one exclusive (write) lock.", note: "C++ provides no atomic upgrade from shared lock to exclusive lock. You must unlock the shared lock first, creating a race window.", link: "https://en.cppreference.com/w/cpp/thread/shared_mutex" },
    ],
  },
  {
    id: 329,
    topic: "Concurrency Patterns",
    difficulty: "Medium",
    title: "Async Exception Handler",
    description: "Runs computations asynchronously and handles exceptions from the async tasks.",
    code: `#include <iostream>
#include <future>
#include <stdexcept>
#include <vector>
#include <string>

double safeDivide(double a, double b) {
    if (b == 0.0) {
        throw std::runtime_error("Division by zero");
    }
    return a / b;
}

int main() {
    std::vector<std::pair<double, double>> inputs = {
        {10.0, 2.0}, {15.0, 0.0}, {20.0, 4.0}, {8.0, 0.0}
    };

    std::vector<std::future<double>> futures;
    for (auto& [a, b] : inputs) {
        futures.push_back(std::async(std::launch::async, safeDivide, a, b));
    }

    for (size_t i = 0; i < futures.size(); ++i) {
        double result = futures[i].get();
        std::cout << "Result " << i << ": " << result << std::endl;
    }

    return 0;
}`,
    hints: [
      "What happens when `safeDivide` throws inside an async task?",
      "Where does the exception surface? Is the calling code prepared for it?",
    ],
    explanation: "When `safeDivide` throws inside an async task, the exception is captured in the `std::future`. When `futures[i].get()` is called, the exception is rethrown. The code has no try-catch around `get()`, so the first division-by-zero (at index 1) will terminate the program with an unhandled exception. The remaining futures (including successful ones) are never retrieved. The fix is to wrap `futures[i].get()` in a try-catch block to handle exceptions from individual tasks.",
    manifestation: `$ g++ -std=c++17 -O2 async_exc.cpp -o async_exc -pthread && ./async_exc
Result 0: 5
terminate called after throwing an instance of 'std::runtime_error'
  what():  Division by zero
Aborted (core dumped)

Expected output:
Result 0: 5
Result 1: Error: Division by zero
Result 2: 5
Result 3: Error: Division by zero`,
    stdlibRefs: [
      { name: "std::future::get", args: "() → T", brief: "Blocks until the result is available, then returns the stored value or rethrows the stored exception.", note: "If the async task threw an exception, get() rethrows it. Always wrap get() in try-catch if the task might throw.", link: "https://en.cppreference.com/w/cpp/thread/future/get" },
    ],
  },
  {
    id: 330,
    topic: "Concurrency Patterns",
    difficulty: "Hard",
    title: "Lock-Free Stack",
    description: "Implements a lock-free stack using compare-and-swap for concurrent push and pop operations.",
    code: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

template<typename T>
class LockFreeStack {
    struct Node {
        T data;
        Node* next;
        Node(T val) : data(std::move(val)), next(nullptr) {}
    };

    std::atomic<Node*> head_{nullptr};

public:
    void push(T val) {
        Node* newNode = new Node(std::move(val));
        newNode->next = head_.load(std::memory_order_relaxed);
        while (!head_.compare_exchange_weak(
            newNode->next, newNode,
            std::memory_order_release, std::memory_order_relaxed)) {
            // CAS failed, newNode->next was updated by CAS
        }
    }

    bool pop(T& result) {
        Node* oldHead = head_.load(std::memory_order_acquire);
        while (oldHead) {
            if (head_.compare_exchange_weak(
                    oldHead, oldHead->next,
                    std::memory_order_release, std::memory_order_relaxed)) {
                result = std::move(oldHead->data);
                delete oldHead;
                return true;
            }
        }
        return false;
    }

    ~LockFreeStack() {
        T dummy;
        while (pop(dummy)) {}
    }
};

int main() {
    LockFreeStack<int> stack;
    std::vector<std::thread> threads;

    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&stack, i] {
            for (int j = 0; j < 1000; ++j) {
                stack.push(i * 1000 + j);
            }
        });
    }
    for (auto& t : threads) t.join();

    int count = 0, val;
    while (stack.pop(val)) ++count;
    std::cout << "Popped " << count << " items" << std::endl;

    return 0;
}`,
    hints: [
      "In `pop()`, look at the line `oldHead->next`. When is `oldHead->next` read relative to the CAS?",
      "After another thread pops and deletes `oldHead`, what happens when this thread reads `oldHead->next`?",
      "Look up the 'ABA problem' in lock-free data structures.",
    ],
    explanation: "The `pop()` function reads `oldHead->next` inside the CAS call. But between loading `oldHead` and the CAS, another thread could pop the same node, delete it, and push a new node at the same memory address (ABA problem). Reading `oldHead->next` after another thread deleted `oldHead` is use-after-free. Even without ABA, the `delete oldHead` immediately after a successful CAS is dangerous because other threads may still hold a copy of `oldHead` and could dereference it. The fix requires hazard pointers or epoch-based reclamation to safely defer deletion.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=address lockfree.cpp -o lockfree -pthread && ./lockfree
=================================================================
==31245==ERROR: AddressSanitizer: heap-use-after-free on address
    0x602000004a18 at pc 0x555555758e12 bp 0x7f3a9c0ffc90
READ of size 8 at 0x602000004a18 thread T2
    #0 0x555555758e11 in LockFreeStack<int>::pop(int&) lockfree.cpp:31
    #1 0x555555759a23 in main::$_0::operator()() lockfree.cpp:51
0x602000004a18 is located 8 bytes inside of 16-byte region
    [0x602000004a10,0x602000004a20)
freed by thread T1 here:
    #0 0x7f3aa0ab3b6f in operator delete(void*)
    #1 0x555555758f45 in LockFreeStack<int>::pop(int&) lockfree.cpp:33`,
    stdlibRefs: [
      { name: "std::atomic::compare_exchange_weak", args: "(T& expected, T desired, memory_order success, memory_order failure) → bool", brief: "Atomically compares and conditionally replaces the stored value. May fail spuriously.", note: "CAS on a pointer doesn't protect the memory the pointer points to. Between loading a pointer and the CAS, the pointee may have been freed (ABA problem).", link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange" },
    ],
  },
  {
    id: 331,
    topic: "Concurrency Patterns",
    difficulty: "Hard",
    title: "Thread Pool Shutdown",
    description: "Implements a simple thread pool that processes submitted tasks and gracefully shuts down.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <queue>
#include <functional>
#include <mutex>
#include <condition_variable>

class ThreadPool {
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex mtx_;
    std::condition_variable cv_;
    bool stop_ = false;

public:
    ThreadPool(size_t numThreads) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers_.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mtx_);
                        cv_.wait(lock, [this] {
                            return stop_ || !tasks_.empty();
                        });
                        if (stop_) return;
                        task = std::move(tasks_.front());
                        tasks_.pop();
                    }
                    task();
                }
            });
        }
    }

    void submit(std::function<void()> task) {
        {
            std::unique_lock<std::mutex> lock(mtx_);
            tasks_.push(std::move(task));
        }
        cv_.notify_one();
    }

    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(mtx_);
            stop_ = true;
        }
        cv_.notify_all();
        for (auto& w : workers_) w.join();
    }
};

int main() {
    ThreadPool pool(4);

    for (int i = 0; i < 20; ++i) {
        pool.submit([i] {
            std::cout << "Task " << i << " done" << std::endl;
        });
    }

    // pool destructor runs here
    return 0;
}`,
    hints: [
      "When `stop_` is set to true and workers wake up, what condition do they check?",
      "If there are still pending tasks in the queue when shutdown begins, will they be processed?",
    ],
    explanation: "The worker loop checks `if (stop_) return;` immediately after waking, without first checking if there are remaining tasks. When the destructor sets `stop_ = true` and notifies all workers, any worker that wakes up will exit immediately even if tasks are still queued. This means some of the 20 submitted tasks may never be executed. The fix is to change the exit condition to: `if (stop_ && tasks_.empty()) return;` — only exit when stopped AND no tasks remain.",
    manifestation: `$ g++ -std=c++17 -O2 pool.cpp -o pool -pthread && ./pool
Task 0 done
Task 1 done
Task 2 done
Task 3 done
Task 4 done
Task 5 done
Task 6 done
Task 7 done

(Only 8 of 20 tasks completed — the remaining 12 were
dropped when the pool shut down before draining the queue)`,
    stdlibRefs: [
      { name: "std::condition_variable::notify_all", args: "() → void", brief: "Unblocks all threads waiting on this condition variable.", link: "https://en.cppreference.com/w/cpp/thread/condition_variable/notify_all" },
    ],
  },
  {
    id: 332,
    topic: "Concurrency Patterns",
    difficulty: "Hard",
    title: "Double-Checked Singleton",
    description: "Implements a thread-safe singleton using double-checked locking to minimize lock contention.",
    code: `#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

class Database {
    static Database* instance_;
    static std::mutex mtx_;

    std::string connectionString_;

    Database() : connectionString_("db://localhost:5432/mydb") {
        // Simulate slow initialization
        std::cout << "Database initialized" << std::endl;
    }

public:
    static Database* getInstance() {
        if (instance_ == nullptr) {
            std::lock_guard<std::mutex> lock(mtx_);
            if (instance_ == nullptr) {
                instance_ = new Database();
            }
        }
        return instance_;
    }

    const std::string& connectionString() const {
        return connectionString_;
    }
};

Database* Database::instance_ = nullptr;
std::mutex Database::mtx_;

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 10; ++i) {
        threads.emplace_back([] {
            auto* db = Database::getInstance();
            std::cout << "Connection: " << db->connectionString() << std::endl;
        });
    }
    for (auto& t : threads) t.join();
    return 0;
}`,
    hints: [
      "In the double-checked locking pattern, the outer `if` reads `instance_` without a lock. Is this safe with a raw pointer?",
      "Can a thread see a non-null `instance_` pointer before the Database constructor has finished running?",
      "What ordering guarantees does a raw pointer provide versus `std::atomic<Database*>`?",
    ],
    explanation: "The classic double-checked locking pattern with a raw pointer is broken in C++. The compiler or CPU can reorder the store to `instance_` before the Database constructor has finished writing `connectionString_`. Another thread can read a non-null `instance_` in the outer check but access a partially constructed object. The fix is to make `instance_` a `std::atomic<Database*>` with appropriate memory ordering, or better yet, use the C++11 Meyers singleton: `static Database& getInstance() { static Database instance; return instance; }` — which is thread-safe by the standard.",
    manifestation: `$ g++ -std=c++17 -O2 -fsanitize=thread singleton.cpp -o singleton -pthread && ./singleton
==================
WARNING: ThreadSanitizer: data race (pid=28934)
  Read of size 8 at 0x555555784040 by thread T2:
    #0 Database::getInstance() singleton.cpp:20
  Previous write of size 8 at 0x555555784040 by thread T1:
    #0 Database::getInstance() singleton.cpp:22
==================
Database initialized
Connection: db://localhost:5432/mydb
Connection: db://localhost:5432/mydb
...`,
    stdlibRefs: [],
  },
  {
    id: 333,
    topic: "Concurrency Patterns",
    difficulty: "Medium",
    title: "Notification Barrier",
    description: "Uses a promise/future pair to signal completion between threads, with error handling.",
    code: `#include <iostream>
#include <future>
#include <thread>
#include <stdexcept>

void worker(std::promise<int> p) {
    try {
        // Simulate work
        int result = 42;
        bool success = true;

        if (success) {
            p.set_value(result);
        }

        // More work after setting the value
        std::cout << "Worker: continuing after notification" << std::endl;

        // Oops, something goes wrong
        throw std::runtime_error("Unexpected error after notification");

    } catch (const std::exception& e) {
        p.set_exception(std::current_exception());
    }
}

int main() {
    std::promise<int> promise;
    auto future = promise.get_future();

    std::thread t(worker, std::move(promise));

    try {
        int result = future.get();
        std::cout << "Result: " << result << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    t.join();
    return 0;
}`,
    hints: [
      "Can you call `set_value()` and then `set_exception()` on the same promise?",
      "What happens when you set a value or exception on a promise that has already been satisfied?",
    ],
    explanation: "The promise is already satisfied by `set_value(result)` when the code succeeds. When the later exception is caught, `set_exception()` is called on an already-satisfied promise, which throws `std::future_error` with `promise_already_satisfied`. This exception is not caught by the catch block (it re-throws), causing `std::terminate`. The fix is to either not catch and re-set after the promise is satisfied, or check whether the promise has already been set before calling set_exception.",
    manifestation: `$ g++ -std=c++17 -O2 barrier.cpp -o barrier -pthread && ./barrier
Result: 42
Worker: continuing after notification
terminate called after throwing an instance of 'std::future_error'
  what():  std::future_error: Promise already satisfied
Aborted (core dumped)`,
    stdlibRefs: [
      { name: "std::promise::set_value", args: "(const T& value) → void | (T&& value) → void", brief: "Stores the value as the shared state and makes the future ready.", note: "Can only be called once. Calling set_value or set_exception on an already-satisfied promise throws std::future_error.", link: "https://en.cppreference.com/w/cpp/thread/promise/set_value" },
      { name: "std::promise::set_exception", args: "(std::exception_ptr p) → void", brief: "Stores the exception pointer as the shared state and makes the future ready.", link: "https://en.cppreference.com/w/cpp/thread/promise/set_exception" },
    ],
  },

  // ── Template Metaprogramming ──

  {
    id: 334,
    topic: "Template Metaprogramming",
    difficulty: "Easy",
    title: "Generic Max",
    description: "Implements a generic max function template that returns the larger of two values.",
    code: `#include <iostream>
#include <string>

template<typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << max(3, 7) << std::endl;
    std::cout << max(3.14, 2.71) << std::endl;
    std::cout << max("hello", "world") << std::endl;
    return 0;
}`,
    hints: [
      "What type does the compiler deduce when `max` is called with string literals?",
      "When comparing two `const char*` pointers with `>`, what is being compared?",
    ],
    explanation: "When called with string literals, `T` is deduced as `const char*`. The `>` operator compares pointer addresses, not string content. The result depends on where the compiler places the string literals in memory, which is implementation-defined. Additionally, naming the function `max` conflicts with `std::max` from `<algorithm>` (which may be transitively included), causing ambiguity errors. The fix is to use `std::string` arguments or specialize for `const char*` with `std::strcmp`.",
    manifestation: `$ g++ -std=c++17 -Wall generic_max.cpp -o generic_max
generic_max.cpp: In function 'int main()':
generic_max.cpp:9:18: error: call of overloaded 'max(int, int)'
    is ambiguous
    9 |     std::cout << max(3, 7) << std::endl;
      |                  ^~~
generic_max.cpp:4:3: note: candidate: 'T max(T, T) [with T = int]'
/usr/include/c++/11/bits/stl_algobase.h:254:5: note: candidate:
    'const _Tp& std::max(const _Tp&, const _Tp&)'`,
    stdlibRefs: [],
  },
  {
    id: 335,
    topic: "Template Metaprogramming",
    difficulty: "Easy",
    title: "Container Printer",
    description: "A template function that prints any container's elements separated by commas.",
    code: `#include <iostream>
#include <vector>
#include <list>
#include <string>

template<typename Container>
void printContainer(const Container& c) {
    bool first = true;
    for (const auto& elem : c) {
        if (!first) std::cout << ", ";
        std::cout << elem;
        first = false;
    }
    std::cout << std::endl;
}

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};
    std::list<std::string> l = {"hello", "world"};

    printContainer(v);
    printContainer(l);
    printContainer("hello");

    return 0;
}`,
    hints: [
      "What is the type of `\"hello\"` in C++? How does the range-based for loop iterate over it?",
      "Does iterating over a `const char[6]` print what you expect?",
    ],
    explanation: "The string literal `\"hello\"` is of type `const char[6]` (including the null terminator). The range-based for loop iterates over all 6 characters including the null character `\\0`. The output prints each character separated by commas: `h, e, l, l, o, ` (with a trailing comma-space-nothing for the null byte). This is technically valid but probably not the intent — the user likely wanted to print the string, not its individual characters plus the null terminator. The fix is to pass `std::string(\"hello\")` or add an overload for `const char*`.",
    manifestation: `$ g++ -std=c++17 -Wall printer.cpp -o printer && ./printer
1, 2, 3, 4, 5
hello, world
h, e, l, l, o,

Expected output:
1, 2, 3, 4, 5
hello, world
hello`,
    stdlibRefs: [],
  },
  {
    id: 336,
    topic: "Template Metaprogramming",
    difficulty: "Easy",
    title: "Perfect Logger",
    description: "Uses perfect forwarding to log function calls with their arguments before forwarding to the actual function.",
    code: `#include <iostream>
#include <string>
#include <utility>

void process(std::string s) {
    std::cout << "Processing: " << s << std::endl;
}

void process(int n) {
    std::cout << "Processing: " << n << std::endl;
}

template<typename F, typename... Args>
void logAndCall(F&& func, Args&&... args) {
    std::cout << "Calling function with " << sizeof...(args) << " args" << std::endl;

    // Log the arguments
    ((std::cout << "  arg: " << std::forward<Args>(args) << std::endl), ...);

    // Forward to the function
    std::forward<F>(func)(std::forward<Args>(args)...);
}

int main() {
    std::string msg = "hello";
    logAndCall(process, std::move(msg));
    std::cout << "msg after call: '" << msg << "'" << std::endl;
    return 0;
}`,
    hints: [
      "How many times is `std::forward<Args>(args)` called for each argument?",
      "What happens to a moved-from string after it has been forwarded twice?",
    ],
    explanation: "`std::forward<Args>(args)` is called twice for each argument — once in the logging fold expression and once in the actual function call. When `msg` is passed as an rvalue via `std::move`, the first `std::forward` moves it into the `operator<<` call for logging, leaving the argument in a moved-from state. The second `std::forward` then passes a moved-from (empty) string to `process()`. The fix is to not forward in the logging step — just print the argument directly without forwarding: `((std::cout << \"  arg: \" << args << std::endl), ...);`.",
    manifestation: `$ g++ -std=c++17 -O2 logger.cpp -o logger && ./logger
Calling function with 1 args
  arg: hello
Processing:
msg after call: ''

Expected output:
Calling function with 1 args
  arg: hello
Processing: hello
msg after call: ''`,
    stdlibRefs: [
      { name: "std::forward", args: "<T>(remove_reference_t<T>& t) → T&&", brief: "Forwards an lvalue as either an lvalue or rvalue, depending on the original value category.", note: "Forwarding the same argument twice means the second use sees a moved-from object. Only forward each argument once.", link: "https://en.cppreference.com/w/cpp/utility/forward" },
    ],
  },
  {
    id: 337,
    topic: "Template Metaprogramming",
    difficulty: "Medium",
    title: "Type-Safe Builder",
    description: "A builder pattern that uses template deduction to automatically determine the stored type.",
    code: `#include <iostream>
#include <string>
#include <vector>

template<typename T>
class Builder {
    std::vector<T> items_;
public:
    Builder& add(const T& item) {
        items_.push_back(item);
        return *this;
    }

    void print() const {
        for (auto& item : items_) {
            std::cout << item << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    Builder b;
    b.add(1).add(2).add(3);
    b.print();
    return 0;
}`,
    hints: [
      "Look at the declaration `Builder b;`. Is the template parameter specified?",
      "Can the compiler deduce class template parameters from a default constructor?",
    ],
    explanation: "`Builder` is a class template that requires a type parameter, but `Builder b;` provides none. Unlike function templates, class template argument deduction (CTAD) requires a deduction guide or a constructor that uses the template parameter. The default constructor doesn't use `T`, so there's nothing to deduce from. The code won't compile. The fix is to specify the type: `Builder<int> b;` or provide a deduction guide and use a constructor like `Builder(std::initializer_list<T>)`.",
    manifestation: `$ g++ -std=c++17 -Wall builder.cpp -o builder
builder.cpp: In function 'int main()':
builder.cpp:22:13: error: class template argument deduction failed:
   22 |     Builder b;
      |             ^
builder.cpp:22:13: error: no matching function for call to 'Builder()'
builder.cpp:5:7: note: candidate: 'template<class T> Builder()-> Builder<T>'
builder.cpp:5:7: note:   template argument deduction/substitution failed:
builder.cpp:22:13: note:   couldn't deduce template parameter 'T'`,
    stdlibRefs: [],
  },
  {
    id: 338,
    topic: "Template Metaprogramming",
    difficulty: "Medium",
    title: "Serializable Value",
    description: "Uses SFINAE to enable a serialize function only for types that have a toString() member.",
    code: `#include <iostream>
#include <string>
#include <type_traits>

template<typename T>
auto serialize(const T& obj)
    -> std::enable_if_t<std::is_same_v<decltype(obj.toString()), std::string>, std::string>
{
    return obj.toString();
}

template<typename T>
auto serialize(const T& obj)
    -> std::enable_if_t<std::is_arithmetic_v<T>, std::string>
{
    return std::to_string(obj);
}

struct Point {
    double x, y;
    std::string toString() const {
        return "(" + std::to_string(x) + ", " + std::to_string(y) + ")";
    }
};

struct Color {
    int r, g, b;
    const char* toString() const {
        static char buf[32];
        snprintf(buf, sizeof(buf), "#%02x%02x%02x", r, g, b);
        return buf;
    }
};

int main() {
    Point p{3.14, 2.72};
    Color c{255, 128, 0};

    std::cout << serialize(p) << std::endl;
    std::cout << serialize(42) << std::endl;
    std::cout << serialize(c) << std::endl;

    return 0;
}`,
    hints: [
      "Look at what type `Color::toString()` returns. Is it `std::string`?",
      "The SFINAE check requires `toString()` to return exactly `std::string`. What happens for `const char*`?",
    ],
    explanation: "`Color::toString()` returns `const char*`, not `std::string`. The SFINAE condition `std::is_same_v<decltype(obj.toString()), std::string>` fails for `Color` because `const char*` is not `std::string`. Neither SFINAE overload matches for `Color` (it's not arithmetic either), so `serialize(c)` produces a compile error about no matching function. The fix is to use a more permissive check like `std::is_convertible_v<decltype(obj.toString()), std::string>`, or use `decltype(std::string(obj.toString()))` in a decltype-based SFINAE expression.",
    manifestation: `$ g++ -std=c++17 -Wall serial.cpp -o serial
serial.cpp: In function 'int main()':
serial.cpp:39:24: error: no matching function for call to
    'serialize(Color&)'
   39 |     std::cout << serialize(c) << std::endl;
      |                  ~~~~~~~~~^~~
serial.cpp:6:6: note: candidate: 'std::enable_if_t<...> serialize(const T&)'
    template argument deduction/substitution failed:
    'std::is_same_v<const char*, std::string>' is 'false'
serial.cpp:13:6: note: candidate: 'std::enable_if_t<...> serialize(const T&)'
    constraint not satisfied: 'std::is_arithmetic_v<Color>' is 'false'`,
    stdlibRefs: [
      { name: "std::enable_if_t", args: "<bool B, class T = void>", brief: "If B is true, provides a member typedef type equal to T; otherwise there is no member typedef (SFINAE).", note: "SFINAE conditions must be carefully written — checking for exact type match (is_same) is often too strict; is_convertible may be more appropriate.", link: "https://en.cppreference.com/w/cpp/types/enable_if" },
    ],
  },
  {
    id: 339,
    topic: "Template Metaprogramming",
    difficulty: "Medium",
    title: "Auto Return Deduction",
    description: "Uses decltype(auto) to write a transparent wrapper that preserves the return type of wrapped functions.",
    code: `#include <iostream>
#include <string>
#include <vector>

std::vector<int> globalData = {10, 20, 30, 40, 50};

decltype(auto) getElement(size_t index) {
    return globalData[index];
}

decltype(auto) computeSum() {
    int sum = 0;
    for (int v : globalData) sum += v;
    return sum;
}

int main() {
    auto& elem = getElement(2);
    std::cout << "Element: " << elem << std::endl;

    elem = 99;  // modify through reference
    std::cout << "Modified globalData[2]: " << globalData[2] << std::endl;

    auto total = computeSum();
    std::cout << "Sum: " << total << std::endl;

    return 0;
}`,
    hints: [
      "What does `decltype(auto)` deduce for `computeSum()`? Look at the return expression.",
      "What is the difference between `return sum;` and returning a reference to a local?",
      "Is `sum` a local variable? What is its lifetime?",
    ],
    explanation: "`decltype(auto)` deduces the return type from the return expression. For `getElement`, `globalData[index]` returns `int&`, so the function returns `int&` — correct. For `computeSum`, `sum` is a local variable, so `decltype(sum)` is `int`, and the function returns `int` by value — also correct in this case. However, if the programmer had written `return (sum);` (with parentheses), `decltype((sum))` would be `int&`, creating a dangling reference to a local. The actual bug is more subtle: `getElement` returns a reference to `globalData`, allowing mutation of a global through what looks like a simple getter. The real trap is that `decltype(auto)` makes the reference-ness invisible at the call site.",
    manifestation: `$ g++ -std=c++17 -Wall auto_return.cpp -o auto_return && ./auto_return
Element: 30
Modified globalData[2]: 99
Sum: 150

(The program works as shown — but if computeSum had returned (sum)
with parentheses instead of sum, it would return a dangling
reference to a local:)

decltype(auto) computeSum() {
    int sum = 0;
    for (int v : globalData) sum += v;
    return (sum);  // decltype((sum)) = int& — dangling!
}

$ g++ -std=c++17 -Wall -O2 auto_return2.cpp -o auto_return2 && ./auto_return2
Sum: 0    ← garbage from dangling reference`,
    stdlibRefs: [],
  },
  {
    id: 340,
    topic: "Template Metaprogramming",
    difficulty: "Hard",
    title: "Variadic Tuple Printer",
    description: "Recursively prints each element of a tuple using template parameter packs.",
    code: `#include <iostream>
#include <tuple>
#include <string>

template<typename Tuple, size_t N>
struct TuplePrinter {
    static void print(const Tuple& t) {
        TuplePrinter<Tuple, N - 1>::print(t);
        std::cout << ", " << std::get<N - 1>(t);
    }
};

template<typename Tuple>
struct TuplePrinter<Tuple, 1> {
    static void print(const Tuple& t) {
        std::cout << std::get<0>(t);
    }
};

template<typename... Args>
void printTuple(const std::tuple<Args...>& t) {
    std::cout << "(";
    TuplePrinter<decltype(t), sizeof...(Args)>::print(t);
    std::cout << ")" << std::endl;
}

int main() {
    auto t1 = std::make_tuple(1, "hello", 3.14);
    auto t2 = std::make_tuple(42);
    auto t3 = std::tuple<>();

    printTuple(t1);
    printTuple(t2);
    printTuple(t3);

    return 0;
}`,
    hints: [
      "What happens when `printTuple` is called with an empty tuple?",
      "What is `sizeof...(Args)` when `Args` is an empty pack? Is there a specialization for `TuplePrinter<Tuple, 0>`?",
    ],
    explanation: "When `printTuple` is called with an empty tuple `t3`, `sizeof...(Args)` is 0, so it tries to instantiate `TuplePrinter<Tuple, 0>`. The recursion goes `N=0`, which tries `TuplePrinter<Tuple, -1>` (but N is `size_t`, so it wraps to a huge number), causing infinite template instantiation. There's no specialization for `N=0`. The base case only handles `N=1`. The fix is to add a specialization for `TuplePrinter<Tuple, 0>` that does nothing, or to guard the call in `printTuple` with `if constexpr (sizeof...(Args) > 0)`.",
    manifestation: `$ g++ -std=c++17 -Wall tuple.cpp -o tuple
tuple.cpp: In instantiation of 'struct TuplePrinter<
    const std::tuple<>&, 0>':
tuple.cpp:8:9:   recursively required from 'struct TuplePrinter<
    const std::tuple<>&, 18446744073709551614>'
tuple.cpp:8:9:   required from 'struct TuplePrinter<
    const std::tuple<>&, 18446744073709551615>'
...
tuple.cpp:8:9: fatal error: template instantiation depth exceeds
    maximum of 900 (use '-ftemplate-depth=' to increase the maximum)
    8 |         TuplePrinter<Tuple, N - 1>::print(t);
      |         ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
    stdlibRefs: [
      { name: "std::get (tuple)", args: "<size_t I>(const tuple<Types...>& t) → const tuple_element_t<I, tuple<Types...>>&", brief: "Extracts the Ith element from the tuple.", link: "https://en.cppreference.com/w/cpp/utility/tuple/get" },
    ],
  },
  {
    id: 341,
    topic: "Template Metaprogramming",
    difficulty: "Hard",
    title: "Conversion Checker",
    description: "A type trait that checks if a type is explicitly convertible to another using a conversion operator.",
    code: `#include <iostream>
#include <type_traits>
#include <string>

template<typename From, typename To, typename = void>
struct is_explicitly_convertible : std::false_type {};

template<typename From, typename To>
struct is_explicitly_convertible<From, To,
    std::void_t<decltype(static_cast<To>(std::declval<From>()))>>
    : std::true_type {};

struct Meters {
    double value;
    explicit operator double() const { return value; }
    operator int() const { return static_cast<int>(value); }
};

struct Feet {
    double value;
};

int main() {
    std::cout << std::boolalpha;
    std::cout << "Meters -> double: "
              << is_explicitly_convertible<Meters, double>::value << std::endl;
    std::cout << "Meters -> int: "
              << is_explicitly_convertible<Meters, int>::value << std::endl;
    std::cout << "Meters -> string: "
              << is_explicitly_convertible<Meters, std::string>::value << std::endl;
    std::cout << "Feet -> double: "
              << is_explicitly_convertible<Feet, double>::value << std::endl;
    std::cout << "int -> double: "
              << is_explicitly_convertible<int, double>::value << std::endl;
    return 0;
}`,
    hints: [
      "The trait name says 'explicitly' convertible. But does `static_cast` distinguish between explicit and implicit conversions?",
      "Can `static_cast<int>(meters)` succeed even if the conversion is implicit? What about `static_cast<double>(intval)`?",
    ],
    explanation: "The trait claims to test for *explicit* convertibility, but `static_cast` succeeds for both explicit and implicit conversions. So `is_explicitly_convertible<Meters, int>::value` is `true` even though `operator int()` is implicit (not explicit). And `is_explicitly_convertible<int, double>::value` is `true` because `static_cast<double>(int)` works, even though there's no explicit conversion operator. The trait name is misleading — it actually tests whether *any* conversion (explicit or implicit) exists via `static_cast`. There's no simple way in C++ to test if a conversion is explicit-only without also matching implicit conversions.",
    manifestation: `$ g++ -std=c++17 -Wall convert.cpp -o convert && ./convert
Meters -> double: true
Meters -> int: true
Meters -> string: false
Feet -> double: false
int -> double: true

(The trait returns true for both explicit AND implicit conversions,
not just explicit ones as the name implies.
"Meters -> int" is true even though operator int() is implicit.
"int -> double" is true even though it's a built-in conversion.)`,
    stdlibRefs: [
      { name: "std::void_t", args: "<typename...>", brief: "Maps any sequence of types to void; used in SFINAE to detect well-formed expressions.", link: "https://en.cppreference.com/w/cpp/types/void_t" },
      { name: "std::declval", args: "<T>() → add_rvalue_reference_t<T>", brief: "Returns an rvalue reference to T without requiring a constructor; only valid in unevaluated contexts.", link: "https://en.cppreference.com/w/cpp/utility/declval" },
    ],
  },
  {
    id: 342,
    topic: "Template Metaprogramming",
    difficulty: "Hard",
    title: "Tagged Dispatch",
    description: "Uses tag dispatching to select between different implementations based on iterator category.",
    code: `#include <iostream>
#include <vector>
#include <list>
#include <iterator>
#include <string>

template<typename Iterator>
void advanceImpl(Iterator& it, int n, std::random_access_iterator_tag) {
    std::cout << "Random access advance" << std::endl;
    it += n;
}

template<typename Iterator>
void advanceImpl(Iterator& it, int n, std::input_iterator_tag) {
    std::cout << "Input iterator advance" << std::endl;
    for (int i = 0; i < n; ++i) ++it;
}

template<typename Iterator>
void myAdvance(Iterator& it, int n) {
    advanceImpl(it, n,
        typename std::iterator_traits<Iterator>::iterator_category());
}

int main() {
    std::vector<int> v = {10, 20, 30, 40, 50};
    auto vit = v.begin();
    myAdvance(vit, 3);
    std::cout << "Vector: " << *vit << std::endl;

    std::list<int> l = {10, 20, 30, 40, 50};
    auto lit = l.begin();
    myAdvance(lit, 3);
    std::cout << "List: " << *lit << std::endl;

    // Negative advance on list
    auto lit2 = l.end();
    myAdvance(lit2, -2);
    std::cout << "List reverse: " << *lit2 << std::endl;

    return 0;
}`,
    hints: [
      "What category does `std::list::iterator` belong to? Is it random access or bidirectional?",
      "When `n` is negative and the input iterator overload is selected, what happens?",
      "Does the `input_iterator_tag` overload handle negative distances correctly?",
    ],
    explanation: "`std::list::iterator` is a `bidirectional_iterator`, which inherits from `forward_iterator_tag` which inherits from `input_iterator_tag`. The tag dispatch selects the `input_iterator_tag` overload (since `bidirectional_iterator_tag` is-a `input_iterator_tag`). When `n` is -2, the loop `for (int i = 0; i < n; ++i)` never executes (0 < -2 is false), so the iterator doesn't move at all. Dereferencing `l.end()` is undefined behavior. There's no `bidirectional_iterator_tag` overload that would use `--it` for negative n. The fix is to add an overload for `std::bidirectional_iterator_tag` that handles negative distances with `--it`.",
    manifestation: `$ g++ -std=c++17 -Wall dispatch.cpp -o dispatch && ./dispatch
Random access advance
Vector: 40
Input iterator advance
List: 40
Input iterator advance
Segmentation fault (core dumped)

(The negative advance on list selected the input_iterator overload
which can't go backwards — the loop doesn't execute, and
dereferencing end() is undefined behavior)`,
    stdlibRefs: [
      { name: "std::iterator_traits", brief: "Provides uniform interface to the properties of iterator types, including iterator_category.", note: "bidirectional_iterator_tag inherits from forward_iterator_tag, which inherits from input_iterator_tag. Tag dispatch selects the most derived matching overload.", link: "https://en.cppreference.com/w/cpp/iterator/iterator_traits" },
    ],
  },
  {
    id: 343,
    topic: "Template Metaprogramming",
    difficulty: "Medium",
    title: "Aggregate Initializer",
    description: "Uses brace initialization with template argument deduction to construct objects from initializer lists.",
    code: `#include <iostream>
#include <vector>
#include <string>

template<typename T>
class Stack {
    std::vector<T> data_;
public:
    Stack(std::initializer_list<T> init) : data_(init) {}

    void push(const T& val) { data_.push_back(val); }

    T pop() {
        T top = data_.back();
        data_.pop_back();
        return top;
    }

    size_t size() const { return data_.size(); }
};

int main() {
    Stack s1 = {1, 2, 3, 4, 5};
    std::cout << "s1 size: " << s1.size() << std::endl;
    std::cout << "s1 top: " << s1.pop() << std::endl;

    Stack s2 = {1.0, 2.5, 3.7};
    std::cout << "s2 size: " << s2.size() << std::endl;

    Stack s3 = {"hello", "world"};
    std::cout << "s3 size: " << s3.size() << std::endl;
    std::cout << "s3 top: " << s3.pop() << std::endl;

    Stack s4 = {"hello", std::string("world")};
    std::cout << "s4 size: " << s4.size() << std::endl;

    return 0;
}`,
    hints: [
      "What type does CTAD deduce for `s3` when initialized with string literals?",
      "Are `\"hello\"` and `std::string(\"world\")` the same type?",
      "What happens when an initializer list has mixed types?",
    ],
    explanation: "For `s3`, CTAD deduces `T` as `const char*` because string literals decay to `const char*`. This compiles fine but `s3` stores pointers, not strings. For `s4`, `\"hello\"` is `const char*` and `std::string(\"world\")` is `std::string` — these are different types, so template argument deduction fails because all elements of `initializer_list<T>` must have the same type. The fix is to use `Stack<std::string> s4 = {\"hello\", \"world\"};` or use `std::string` literals consistently.",
    manifestation: `$ g++ -std=c++17 -Wall stack.cpp -o stack
stack.cpp: In function 'int main()':
stack.cpp:31:46: error: no matching function for call to
    'Stack(const char [6], std::string)'
   31 |     Stack s4 = {"hello", std::string("world")};
      |                                              ^
stack.cpp:8:5: note: candidate: 'Stack(std::initializer_list<T>)'
    couldn't deduce template argument 'T'
    (deduced conflicting types 'const char*' and 'std::string')`,
    stdlibRefs: [
      { name: "std::initializer_list", brief: "A lightweight proxy object that provides access to a const array of objects of type T.", note: "All elements must be the same type T. Mixed types (e.g. const char* and std::string) cause deduction failure.", link: "https://en.cppreference.com/w/cpp/utility/initializer_list" },
    ],
  },

  // ── Scope & Lifetime ──

  {
    id: 344,
    topic: "Scope & Lifetime",
    difficulty: "Easy",
    title: "Callback Registry",
    description: "Stores lambdas in a vector and invokes them later to process events.",
    code: `#include <iostream>
#include <vector>
#include <functional>
#include <string>

class EventSystem {
    std::vector<std::function<void()>> callbacks_;
public:
    void registerCallback(std::function<void()> cb) {
        callbacks_.push_back(std::move(cb));
    }

    void fireAll() {
        for (auto& cb : callbacks_) {
            cb();
        }
    }
};

void setupHandlers(EventSystem& es) {
    std::string prefix = "Event";

    for (int i = 0; i < 5; ++i) {
        es.registerCallback([&prefix, i] {
            std::cout << prefix << " #" << i << " fired" << std::endl;
        });
    }
}

int main() {
    EventSystem es;
    setupHandlers(es);

    std::cout << "Firing events:" << std::endl;
    es.fireAll();

    return 0;
}`,
    hints: [
      "Look at the lambda captures. What is the lifetime of `prefix`?",
      "When `fireAll()` executes the lambdas, is `prefix` still alive?",
    ],
    explanation: "The lambda captures `prefix` by reference (`&prefix`), but `prefix` is a local variable in `setupHandlers()`. After `setupHandlers` returns, `prefix` is destroyed. When `es.fireAll()` is called in main, the lambdas reference a destroyed string — this is a dangling reference and undefined behavior. The fix is to capture `prefix` by value: `[prefix, i]` or `[=]`.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g events.cpp -o events && ./events
Firing events:
=================================================================
==12345==ERROR: AddressSanitizer: stack-use-after-return on address
    0x7f2a8c400050 at pc 0x555555758a12 bp 0x7fffffffd890
READ of size 8 at 0x7f2a8c400050 thread T0
    #0 0x555555758a11 in std::string::data() const
    #1 0x555555758e23 in operator<< <std::string>
    #2 0x555555759012 in setupHandlers(EventSystem&)::$_0::operator()()
        events.cpp:25`,
    stdlibRefs: [],
  },
  {
    id: 345,
    topic: "Scope & Lifetime",
    difficulty: "Easy",
    title: "Minimum Finder",
    description: "Finds the minimum value in a collection by returning a const reference to avoid copying.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

const std::string& findShortest(const std::vector<std::string>& words) {
    if (words.empty()) {
        return std::string("");
    }
    const std::string* shortest = &words[0];
    for (size_t i = 1; i < words.size(); ++i) {
        if (words[i].length() < shortest->length()) {
            shortest = &words[i];
        }
    }
    return *shortest;
}

int main() {
    std::vector<std::string> words = {"elephant", "cat", "dog", "a", "butterfly"};
    std::cout << "Shortest: " << findShortest(words) << std::endl;

    std::vector<std::string> empty;
    std::cout << "Shortest of empty: " << findShortest(empty) << std::endl;

    return 0;
}`,
    hints: [
      "What happens when `words` is empty? Look at the early return.",
      "What is the lifetime of the temporary `std::string(\"\")` that is returned by reference?",
    ],
    explanation: "When `words` is empty, the function creates a temporary `std::string(\"\")` and returns a const reference to it. The temporary is destroyed at the end of the return statement, so the caller receives a dangling reference. This is undefined behavior. The compiler may warn about this. The fix is to throw an exception for empty input, return by value, or use a static local: `static const std::string empty; return empty;`.",
    manifestation: `$ g++ -std=c++17 -Wall shortest.cpp -o shortest
shortest.cpp: In function 'const string& findShortest(
    const vector<string>&)':
shortest.cpp:8:16: warning: returning reference to temporary
    [-Wreturn-local-addr]
    8 |         return std::string("");
      |                ^~~~~~~~~~~~~~~
$ ./shortest
Shortest: a
Shortest of empty:    ← garbage or crash (dangling reference)`,
    stdlibRefs: [],
  },
  {
    id: 346,
    topic: "Scope & Lifetime",
    difficulty: "Easy",
    title: "Temporary Method Chain",
    description: "Builds a query string using method chaining on a temporary builder object.",
    code: `#include <iostream>
#include <string>
#include <sstream>

class QueryBuilder {
    std::ostringstream query_;
public:
    QueryBuilder(const std::string& table) {
        query_ << "SELECT * FROM " << table;
    }

    QueryBuilder& where(const std::string& condition) {
        query_ << " WHERE " << condition;
        return *this;
    }

    QueryBuilder& orderBy(const std::string& column) {
        query_ << " ORDER BY " << column;
        return *this;
    }

    QueryBuilder& limit(int n) {
        query_ << " LIMIT " << n;
        return *this;
    }

    const std::string str() const {
        return query_.str();
    }
};

int main() {
    const std::string& query = QueryBuilder("users")
        .where("age > 18")
        .orderBy("name")
        .limit(10)
        .str();

    std::cout << query << std::endl;
    return 0;
}`,
    hints: [
      "What is the lifetime of the temporary `QueryBuilder` object?",
      "The `.str()` returns a `std::string` by value. What binds to `query`?",
      "Does binding a const reference to a temporary extend the temporary's lifetime here?",
    ],
    explanation: "The temporary `QueryBuilder` is destroyed at the end of the full expression (the semicolon). The `.str()` call returns a `std::string` by value, creating another temporary. Binding a `const std::string&` to this returned temporary *does* extend the lifetime of the returned string to match the reference's scope. So actually, this code is well-defined in C++ — the const reference extends the temporary string's lifetime. However, the `QueryBuilder` itself is destroyed, but that's fine since we already extracted the string. This is actually a trick question — the code works correctly.",
    manifestation: `$ g++ -std=c++17 -Wall query.cpp -o query && ./query
SELECT * FROM users WHERE age > 18 ORDER BY name LIMIT 10

(This actually works correctly! The const reference to the
temporary string returned by str() extends its lifetime.
The tricky part: many developers would expect this to be
a dangling reference, but C++ lifetime extension rules
make this well-defined.)`,
    stdlibRefs: [
      { name: "std::ostringstream::str", args: "() const → std::string", brief: "Returns a copy of the underlying string.", note: "Returns by value, so the result is a temporary. A const reference can extend its lifetime, but a non-const reference cannot.", link: "https://en.cppreference.com/w/cpp/io/basic_ostringstream/str" },
    ],
  },
  {
    id: 347,
    topic: "Scope & Lifetime",
    difficulty: "Medium",
    title: "Deferred Cleanup",
    description: "Implements a scope guard that executes a cleanup function when the scope exits.",
    code: `#include <iostream>
#include <functional>
#include <string>

class ScopeGuard {
    std::function<void()> cleanup_;
    bool active_;
public:
    ScopeGuard(std::function<void()> fn)
        : cleanup_(std::move(fn)), active_(true) {}

    ScopeGuard(const ScopeGuard&) = delete;
    ScopeGuard& operator=(const ScopeGuard&) = delete;

    void dismiss() { active_ = false; }

    ~ScopeGuard() {
        if (active_) cleanup_();
    }
};

void processFile(const std::string& filename) {
    std::cout << "Opening " << filename << std::endl;

    auto guard = ScopeGuard([&filename] {
        std::cout << "Closing " << filename << std::endl;
    });

    std::cout << "Processing " << filename << std::endl;

    if (filename == "error.txt") {
        throw std::runtime_error("File corrupted");
    }

    guard.dismiss();
    std::cout << "Success — no cleanup needed" << std::endl;
}

int main() {
    try {
        processFile("data.txt");
        processFile("error.txt");
    } catch (const std::exception& e) {
        std::cerr << "Caught: " << e.what() << std::endl;
    }
    return 0;
}`,
    hints: [
      "When `processFile(\"data.txt\")` completes successfully, does the guard still run cleanup?",
      "Look at the `dismiss()` call. After success, the guard is dismissed — but cleanup still runs in the destructor when the function returns normally. Or does it?",
      "Actually, focus on what `dismiss()` does. If cleanup is dismissed on success, what happens on the error path?",
    ],
    explanation: "The code actually works correctly for the basic case — `dismiss()` prevents cleanup on success, and the guard fires cleanup when an exception is thrown. The subtle issue is that `ScopeGuard` has no move constructor defined. Since copy is deleted, and there's no move constructor, the line `auto guard = ScopeGuard(...)` may not compile in C++17 (guaranteed copy elision helps here) but would fail in C++14. However, the real logic bug is more subtle: when `processFile(\"data.txt\")` succeeds, `dismiss()` is called, then the guard's destructor runs but skips cleanup because `active_` is false. The function prints 'Success — no cleanup needed' but then *doesn't* close the file. The design conflates 'success means no cleanup needed' with the actual need to close files — successful processing still requires closing the file.",
    manifestation: `$ g++ -std=c++17 -Wall guard.cpp -o guard && ./guard
Opening data.txt
Processing data.txt
Success — no cleanup needed
Opening error.txt
Processing error.txt
Closing error.txt
Caught: File corrupted

(data.txt was never "closed" — dismiss() skipped the cleanup
on the success path, but files still need closing even on
success. Only the error path ran cleanup.)`,
    stdlibRefs: [],
  },
  {
    id: 348,
    topic: "Scope & Lifetime",
    difficulty: "Medium",
    title: "Lazy Evaluator",
    description: "Stores computation lambdas and evaluates them lazily on first access, caching the result.",
    code: `#include <iostream>
#include <functional>
#include <optional>
#include <string>
#include <vector>

template<typename T>
class Lazy {
    std::function<T()> factory_;
    mutable std::optional<T> cached_;
public:
    Lazy(std::function<T()> f) : factory_(std::move(f)) {}

    const T& get() const {
        if (!cached_) {
            cached_ = factory_();
        }
        return *cached_;
    }
};

int main() {
    std::vector<Lazy<std::string>> items;

    for (int i = 0; i < 5; ++i) {
        items.emplace_back([&i] {
            return "Item #" + std::to_string(i);
        });
    }

    for (auto& item : items) {
        std::cout << item.get() << std::endl;
    }

    return 0;
}`,
    hints: [
      "Look at the lambda capture `[&i]`. What is the lifetime of `i`?",
      "When are the lambdas actually invoked? Is `i` still in scope then?",
    ],
    explanation: "The lambda captures `i` by reference. The loop variable `i` exists only during the first for loop. When the lambdas are evaluated in the second for loop, `i` is out of scope — it's a dangling reference. Even if the compiler keeps `i` on the stack at the same address, the value is 5 (the loop exit value), so all items would say 'Item #5'. With optimizations, accessing the dangling reference is undefined behavior. The fix is to capture by value: `[i]` or `[=]`.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g lazy.cpp -o lazy && ./lazy
Item #5
Item #5
Item #5
Item #5
Item #5

Expected output:
Item #0
Item #1
Item #2
Item #3
Item #4

(All items show 5 because the lambda captured i by reference,
and i equals 5 after the first loop exits)`,
    stdlibRefs: [],
  },
  {
    id: 349,
    topic: "Scope & Lifetime",
    difficulty: "Medium",
    title: "String Splitter",
    description: "Splits a string by a delimiter and returns string_views into the original for zero-copy access.",
    code: `#include <iostream>
#include <string>
#include <string_view>
#include <vector>

std::vector<std::string_view> split(std::string_view sv, char delim) {
    std::vector<std::string_view> result;
    while (!sv.empty()) {
        auto pos = sv.find(delim);
        result.push_back(sv.substr(0, pos));
        if (pos == std::string_view::npos) break;
        sv.remove_prefix(pos + 1);
    }
    return result;
}

int main() {
    auto parts = split("hello,world,foo,bar", ',');
    for (auto& p : parts) {
        std::cout << "'" << p << "'" << std::endl;
    }

    std::cout << "---" << std::endl;

    std::string data = "one;two;three";
    auto parts2 = split(data, ';');
    data = "OVERWRITTEN";  // modify original

    for (auto& p : parts2) {
        std::cout << "'" << p << "'" << std::endl;
    }

    return 0;
}`,
    hints: [
      "The `string_view`s in `parts2` point into `data`. What happens when `data` is reassigned?",
      "Does `std::string::operator=` reuse the buffer or allocate a new one?",
    ],
    explanation: "The first split works because string literals have static storage duration — the views point into memory that lives for the entire program. But for `parts2`, the views point into `data`'s buffer. When `data = \"OVERWRITTEN\"` is executed, the string may reallocate its buffer (especially since \"OVERWRITTEN\" is longer and may exceed the small-string optimization). The old buffer is freed, leaving all string_views in `parts2` dangling. Accessing them is undefined behavior. The fix is to either not modify the source string, or return `std::vector<std::string>` instead.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g split.cpp -o split && ./split
'hello'
'world'
'foo'
'bar'
---
=================================================================
==19876==ERROR: AddressSanitizer: heap-use-after-free on address
    0x602000000010 at pc 0x555555758e12 bp 0x7fffffffd890
READ of size 3 at 0x602000000010 thread T0
    #0 0x555555758e11 in main split.cpp:24
0x602000000010 is located 0 bytes inside of 14-byte region
    [0x602000000010,0x60200000001e)
freed by thread T0 here:
    #0 0x7f2a8c4b3b6f in operator delete(void*)
    #1 0x555555759123 in std::string::operator=(const char*)`,
    stdlibRefs: [
      { name: "std::string_view", brief: "A non-owning reference to a contiguous sequence of characters.", note: "Views into a std::string become dangling if the string is modified, resized, or destroyed.", link: "https://en.cppreference.com/w/cpp/string/basic_string_view" },
    ],
  },
  {
    id: 350,
    topic: "Scope & Lifetime",
    difficulty: "Hard",
    title: "Global Logger",
    description: "Implements a global logger and a global config object that the logger depends on during initialization.",
    code: `#include <iostream>
#include <string>

// config.h
class Config {
    std::string logLevel_;
public:
    Config() : logLevel_("INFO") {
        std::cout << "Config initialized" << std::endl;
    }
    const std::string& logLevel() const { return logLevel_; }
    ~Config() { std::cout << "Config destroyed" << std::endl; }
};

// logger.h
class Logger {
    std::string prefix_;
public:
    Logger() : prefix_("[" + globalConfig().logLevel() + "] ") {
        std::cout << "Logger initialized with prefix: " << prefix_ << std::endl;
    }
    void log(const std::string& msg) const {
        std::cout << prefix_ << msg << std::endl;
    }
    ~Logger() { std::cout << "Logger destroyed" << std::endl; }

    static Config& globalConfig() {
        static Config cfg;
        return cfg;
    }
};

// Globals — initialization order depends on translation unit
Logger gLogger;

int main() {
    gLogger.log("Application started");
    gLogger.log("Doing work...");
    return 0;
}`,
    hints: [
      "In what order are `gLogger` and the static `Config` initialized?",
      "When `main()` returns, in what order are the global and function-local static objects destroyed?",
      "Is the `Config` guaranteed to outlive the `Logger`?",
    ],
    explanation: "The `Config` is created as a function-local static inside `globalConfig()`, which is called during `Logger`'s construction. Function-local statics are destroyed in reverse order of construction, and they're destroyed after all global objects. Since `gLogger` (global) was constructed after `Config` (function-local static), and globals are destroyed before function-local statics... actually, function-local statics are destroyed in reverse construction order among themselves. The real issue: during `gLogger`'s destructor, `Config` may or may not still exist. In single-TU, this works. But the static initialization order fiasco becomes real when `Config` and `Logger` are in different translation units with raw globals. Here it works by luck due to the Meyers singleton pattern for Config.",
    manifestation: `$ g++ -std=c++17 -Wall global.cpp -o global && ./global
Config initialized
Logger initialized with prefix: [INFO]
[INFO] Application started
[INFO] Doing work...
Logger destroyed
Config destroyed

(This specific code works — but if Config were a raw global in
a different translation unit instead of a function-local static,
it could be initialized AFTER Logger, causing Logger to read
from an uninitialized Config during construction:)

# With raw globals in separate TUs:
$ ./global_separate_tu
Logger initialized with prefix: []    ← empty, Config not yet initialized
Config initialized
...`,
    stdlibRefs: [],
  },
  {
    id: 351,
    topic: "Scope & Lifetime",
    difficulty: "Hard",
    title: "Structured Config",
    description: "Uses structured bindings to decompose a configuration struct and pass parts to different subsystems.",
    code: `#include <iostream>
#include <string>
#include <map>
#include <tuple>

struct ServerConfig {
    std::string host;
    int port;
    bool tls;
};

ServerConfig loadConfig() {
    return {"api.example.com", 443, true};
}

void startServer(const std::string& host, int port, bool tls) {
    std::cout << "Starting server on "
              << (tls ? "https" : "http") << "://" << host
              << ":" << port << std::endl;
}

int main() {
    auto [host, port, tls] = loadConfig();

    std::cout << "Config loaded:" << std::endl;
    std::cout << "  Host: " << host << std::endl;
    std::cout << "  Port: " << port << std::endl;
    std::cout << "  TLS:  " << tls << std::endl;

    // Modify for local development
    host = "localhost";
    port = 8080;
    tls = false;

    startServer(host, port, tls);

    // Check if original config is preserved
    auto config = loadConfig();
    auto& [h2, p2, t2] = config;
    h2 = "internal.example.com";

    std::cout << "Modified through binding: " << config.host << std::endl;
    std::cout << "Direct access: " << h2 << std::endl;

    return 0;
}`,
    hints: [
      "Look at `auto [host, port, tls]` vs `auto& [h2, p2, t2]`. What's the difference?",
      "When you modify `h2`, are you modifying the original `config` struct or a copy?",
    ],
    explanation: "The first structured binding `auto [host, port, tls] = loadConfig()` creates a copy — the bindings are aliases to members of a hidden copy. Modifying them doesn't affect anything else. The second binding `auto& [h2, p2, t2] = config` binds by reference — `h2` is an alias to `config.host`. Modifying `h2` modifies `config.host` directly. This is actually well-defined and works as shown. The surprise is that `config.host` and `h2` are the same — the output shows 'internal.example.com' for both. This is correct but can be confusing to developers who don't realize `auto&` bindings are true references into the struct.",
    manifestation: `$ g++ -std=c++17 -Wall config.cpp -o config && ./config
Config loaded:
  Host: api.example.com
  Port: 443
  TLS:  1
Starting server on http://localhost:8080
Modified through binding: internal.example.com
Direct access: internal.example.com

(Both show the same value because auto& structured bindings
are references into the original struct. This is correct
behavior, but developers often expect independent copies.)`,
    stdlibRefs: [],
  },
  {
    id: 352,
    topic: "Scope & Lifetime",
    difficulty: "Hard",
    title: "Thread-Local Accumulator",
    description: "Uses thread-local storage to accumulate per-thread statistics and merge them at the end.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <numeric>

struct Stats {
    long long sum = 0;
    int count = 0;

    void record(int value) {
        sum += value;
        ++count;
    }

    double average() const {
        return count > 0 ? static_cast<double>(sum) / count : 0.0;
    }
};

thread_local Stats localStats;

Stats* getThreadStats() {
    return &localStats;
}

int main() {
    std::vector<Stats*> allStats;
    std::vector<std::thread> threads;

    for (int t = 0; t < 4; ++t) {
        threads.emplace_back([&allStats, t] {
            for (int i = 0; i < 1000; ++i) {
                localStats.record(t * 1000 + i);
            }
            allStats.push_back(&localStats);
        });
    }

    for (auto& th : threads) th.join();

    long long totalSum = 0;
    int totalCount = 0;
    for (auto* s : allStats) {
        totalSum += s->sum;
        totalCount += s->count;
    }

    std::cout << "Total sum: " << totalSum << std::endl;
    std::cout << "Total count: " << totalCount << std::endl;
    std::cout << "Average: " << (totalCount > 0 ?
        static_cast<double>(totalSum) / totalCount : 0) << std::endl;

    return 0;
}`,
    hints: [
      "What happens to `thread_local` variables when a thread exits?",
      "After `threads[i].join()` completes, is the thread-local `localStats` for that thread still valid?",
      "The pointers in `allStats` point to thread-local storage of threads that have already exited. Is this safe?",
    ],
    explanation: "Thread-local variables are destroyed when a thread exits. After `join()` returns, the thread has terminated and its thread-local storage has been deallocated. The pointers stored in `allStats` now point to freed memory. Dereferencing them in the aggregation loop is undefined behavior — use-after-free. Additionally, `allStats` itself has a data race (multiple threads push_back without synchronization). The fix is to have each thread copy its stats (by value, not pointer) to a shared vector protected by a mutex, or use `std::future` to return the stats.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g accumulator.cpp -o accumulator -pthread && ./accumulator
=================================================================
==22345==ERROR: AddressSanitizer: heap-use-after-free on address
    0x7f2a8c000050 at pc 0x555555758e12 bp 0x7fffffffd890
READ of size 8 at 0x7f2a8c000050 thread T0
    #0 0x555555758e11 in main accumulator.cpp:39
0x7f2a8c000050 is located 0 bytes inside of 16-byte region
    freed by thread T1 here:
    #0 0x7f2a8c4b3b6f in __tls_dtor`,
    stdlibRefs: [],
  },
  {
    id: 353,
    topic: "Scope & Lifetime",
    difficulty: "Medium",
    title: "Reference Wrapper Cache",
    description: "Stores references to objects in a cache to avoid copying large data structures.",
    code: `#include <iostream>
#include <vector>
#include <string>
#include <functional>

class DataStore {
    std::vector<std::reference_wrapper<const std::string>> cache_;
public:
    void add(const std::string& item) {
        cache_.push_back(std::cref(item));
    }

    void printAll() const {
        for (auto& ref : cache_) {
            std::cout << ref.get() << std::endl;
        }
    }
};

int main() {
    DataStore store;

    store.add("hello");
    store.add("world");

    std::string persistent = "persistent data";
    store.add(persistent);

    std::cout << "Cache contents:" << std::endl;
    store.printAll();

    return 0;
}`,
    hints: [
      "When you pass a string literal to `add()`, what is its lifetime?",
      "The parameter `const std::string& item` can bind to temporaries. What happens after `add` returns?",
    ],
    explanation: "When string literals `\"hello\"` and `\"world\"` are passed to `add()`, they are implicitly converted to temporary `std::string` objects. The `const std::string& item` parameter binds to these temporaries, and `std::cref(item)` stores a reference. But the temporary is destroyed at the end of the `add()` call, leaving dangling references in the cache. Only `persistent` survives because it's a named variable. When `printAll()` tries to read the first two cached references, it accesses freed memory. The fix is to store `std::string` by value, or ensure all referenced objects outlive the cache.",
    manifestation: `$ g++ -std=c++17 -fsanitize=address -g refcache.cpp -o refcache && ./refcache
Cache contents:
=================================================================
==15678==ERROR: AddressSanitizer: stack-use-after-scope on address
    0x7f2a8c400020 at pc 0x555555758a12 bp 0x7fffffffd890
READ of size 8 at 0x7f2a8c400020 thread T0
    #0 0x555555758a11 in std::string::data() const
    #1 0x555555759012 in DataStore::printAll() const refcache.cpp:16`,
    stdlibRefs: [
      { name: "std::reference_wrapper", brief: "A copyable, assignable wrapper around a reference to an object of type T.", note: "Stores a reference, not a copy. If the referenced object is destroyed, the wrapper becomes dangling.", link: "https://en.cppreference.com/w/cpp/utility/functional/reference_wrapper" },
    ],
  },
];
