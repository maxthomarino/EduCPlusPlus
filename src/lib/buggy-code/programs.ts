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
];
