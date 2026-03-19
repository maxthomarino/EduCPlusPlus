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
    hints: [
      "How was the memory allocated, and how will the smart pointer free it?",
      "What form of delete does the default unique_ptr<int> deleter use?",
    ],
    explanation:
      "The array is allocated with new int[width * height] but stored in a std::unique_ptr<int>, whose default deleter calls delete (not delete[]). This is undefined behavior. It should be std::unique_ptr<int[]> to ensure delete[] is used.",
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
    hints: [
      "How many shared_ptr control blocks are created in this program?",
      "What happens when two independent shared_ptrs believe they each own the same object?",
    ],
    explanation:
      "Both primary and secondary are constructed directly from the same raw pointer, creating two independent reference counts. When both shared_ptrs are destroyed at the end of main, each calls delete on the same Logger object — a double free. The second shared_ptr should be copy-constructed from the first.",
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
    hints: [
      "What does unique_ptr::release() do to the ownership of the managed object?",
      "After calling release(), who is responsible for freeing the memory?",
    ],
    explanation:
      "Calling tok.release() relinquishes ownership and returns the raw pointer. The Token is copied into the vector via *tok.release(), but the heap-allocated original is never deleted. Each iteration leaks one Token. Using *tok (dereference without release) would copy the Token and let the unique_ptr clean up normally.",
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
    hints: [
      "What happens to the reference count of each User when main returns?",
      "Can the reference count of any User ever reach zero?",
      "What type should the friends vector store to break ownership cycles?",
    ],
    explanation:
      "Each User holds shared_ptrs to their friends, creating circular references. When alice, bob, and charlie go out of scope, each User's reference count is still positive because friends lists hold shared_ptrs to each other. No destructor ever runs — all three User objects are leaked. The friends vector should use std::weak_ptr<User> instead.",
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
    hints: [
      "What is the lifetime of the Task objects relative to when run_all() is called?",
      "What does .get() return, and does it affect ownership?",
    ],
    explanation:
      "The three unique_ptrs are destroyed at the closing brace of the inner block, freeing all Task objects. The TaskQueue still holds raw pointers obtained via .get(), which are now dangling. Calling run_all() dereferences freed memory — undefined behavior.",
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
    hints: [
      "How is the Listener object allocated in main?",
      "What precondition must be met before calling shared_from_this()?",
    ],
    explanation:
      "The Listener is allocated on the stack, not managed by any shared_ptr. Calling shared_from_this() on an object that has no owning shared_ptr is undefined behavior (throws std::bad_weak_ptr in C++17 or later). The Listener must first be created via std::make_shared<Listener>(...).",
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
    hints: [
      "What is the state of a unique_ptr after it has been moved from?",
      "Is doc still valid on the last line of main?",
    ],
    explanation:
      "After std::move(doc) transfers ownership to publish(), the local doc is left holding a null pointer. The final line dereferences doc to access .title, which is a null pointer dereference — undefined behavior, typically a crash.",
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
    hints: [
      "At what point during object construction is the shared_ptr fully initialized?",
      "Can shared_from_this() be safely called from within a constructor?",
      "When does the weak_ptr inside enable_shared_from_this first become usable?",
    ],
    explanation:
      "The constructor calls register_default_observer(), which calls shared_from_this(). But during construction, the shared_ptr that will own this object has not yet been fully created — make_shared hasn't finished. Calling shared_from_this() before the object is owned by a shared_ptr is undefined behavior (throws bad_weak_ptr in C++17+). The registration must happen after construction.",
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
    hints: [
      "When a unique_ptr<Plugin> is destroyed, which destructor does it call?",
      "What declaration is missing from the Plugin base class?",
      "What happens to CompressionPlugin's lookup_table_ when only the base destructor runs?",
    ],
    explanation:
      "Plugin's destructor is not virtual. When the unique_ptr<Plugin> elements are destroyed, only Plugin::~Plugin() runs — the derived destructors for CompressionPlugin and EncryptionPlugin are never called. This leaks CompressionPlugin's lookup_table_ array and is undefined behavior. Adding virtual to Plugin's destructor fixes the issue.",
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
    hints: [
      "What is the state of a weak_ptr after all shared_ptrs to the object are destroyed?",
      "What does lock() return when the referenced object no longer exists?",
      "Is the return value of lock() checked before being dereferenced?",
    ],
    explanation:
      "After the inner block ends, both shared_ptrs are destroyed, freeing the Resource objects. The weak_ptrs in the cache are now expired. In lookup(), lock() returns a null shared_ptr for expired entries, and the code immediately dereferences it with ->data — a null pointer dereference. The return value of lock() must be checked before use.",
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
    hints: [
      "What does the lambda capture, and how does it capture it?",
      "What is the value of i when the lambdas are actually invoked?",
    ],
    explanation:
      "The lambda captures i by reference. By the time the lambdas execute in the second loop, the first loop has finished and i equals names.size() (3). Every lambda reads the same out-of-bounds index, causing undefined behavior. Capturing i by value ([i, &names]) would give each lambda its own copy of the loop counter.",
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
    hints: [
      "Compare the implementations of operator+ and operator-. What is different?",
      "What happens to the left-hand operand after operator+ executes?",
      "Does operator+ create a new object, or does it modify an existing one?",
    ],
    explanation:
      "The operator+ modifies the member variables x and y of the left-hand operand (*this) before returning a copy. While the returned value sum is correct, the original vector a is mutated to (4, 6). The subsequent a - b computes (4-3, 6-4) = (1, 2) instead of the expected (-2, -2). Adding const to the method and creating a local result would fix the bug.",
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
    hints: [
      "What type does c_str() return, and what does == compare for that type?",
      "Are two pointers to different memory locations ever equal, even if the strings they point to are identical?",
    ],
    explanation:
      "The operator== compares the pointers returned by c_str(), not the string contents. Since each CIString stores its own std::string internally, the c_str() pointers point to different memory addresses even when the stored strings are identical. The comparison always returns false, so no duplicates are ever detected. Using data_ == other.data_ would correctly compare the string contents.",
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
    hints: [
      "What is the return type of the pre-increment operator?",
      "When ++(++c) is evaluated, does the outer increment operate on c or on something else?",
      "What happens when a non-reference return value is incremented?",
    ],
    explanation:
      "The pre-increment operator returns a Counter by value instead of by reference (Counter& operator++()). When ++(++c) is evaluated, the inner ++c increments c to 1 but returns a temporary copy. The outer ++ then increments that temporary, which is immediately discarded. The counter c is only incremented once, ending up at 1 instead of the expected 2.",
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
    hints: [
      "What arguments does normalize() receive when called from main?",
      "Inside operator=, what happens when the left-hand side and right-hand side are the same object?",
      "After delete[] data_, what does other.data_ point to?",
    ],
    explanation:
      "When normalize is called with readings as both arguments, dest and src are references to the same Buffer object. The assignment dest = src triggers operator=, where this and &other are the same address. The operator deletes data_ first, then tries to copy from other.data_ which is the same now-freed pointer. This is use-after-free. A self-assignment guard (if (this == &other) return *this;) at the top of operator= would prevent this.",
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
    hints: [
      "What is the return type of operator[], and what does that mean for the caller?",
      "When cfg[\"host\"] = \"production.example.com\" executes, where does the new value actually go?",
      "What is the difference between returning std::string and returning std::string&?",
    ],
    explanation:
      'The operator[] returns std::string by value instead of by reference. Each call creates a temporary copy of the stored value. The assignments like cfg["host"] = "production.example.com" modify these temporaries, which are destroyed at the end of each statement. The stored values never change, so the output after the update is identical to before. Changing the return type to std::string& would return a reference to the actual stored element.',
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
    hints: [
      "For any two employees A and B, is it possible that both A < B and B < A are true?",
      "What does the C++ standard require of a comparison function passed to std::sort?",
      "What happens when || combines two independent orderings without a tie-breaker hierarchy?",
    ],
    explanation:
      "The operator< violates the strict weak ordering requirement of std::sort. The condition department < other.department || salary > other.salary can be true in both directions simultaneously: an employee in department 1 with $75k is considered less than one in department 2 with $90k (since 1 < 2), but the reverse is also true (since $90k > $75k). This is undefined behavior. The fix is to use a lexicographic comparison: compare department first, then salary only when departments are equal.",
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
    hints: [
      "What is the underlying type of seconds_, and how does it behave with subtraction?",
      "What happens when a smaller unsigned integer is subtracted from a larger one?",
      "Can Duration::operator- ever produce a result that does not represent a valid time period?",
    ],
    explanation:
      "The Duration class stores seconds as unsigned int. When operator- computes meeting - workday (9000 - 28800), the result underflows because unsigned arithmetic wraps around modulo 2^32. Instead of a negative value indicating an error, the result becomes approximately 4.29 billion seconds. The operator should either check that seconds_ >= other.seconds_ before subtracting, use a signed type, or return an error value.",
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
    hints: [
      "Is there an operator+ or operator* defined for OptionalInt?",
      "What implicit conversion path does the compiler use to make a + b compile?",
      "What type does operator bool() convert to, and what happens when two bool values are added?",
    ],
    explanation:
      "OptionalInt has no operator+ or operator* defined, but the expressions a + b and a * b still compile because the non-explicit operator bool() provides an implicit conversion. The compiler converts both operands to bool (both true, i.e., 1), promotes to int, and computes 1 + 1 = 2 and 1 * 1 = 1 respectively. The result is OptionalInt(2) and OptionalInt(1) instead of the intended 350 and 25000. Marking operator bool() as explicit would prevent the implicit conversion.",
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
    hints: [
      "Trace the call chain when a * a is evaluated. What functions are called?",
      "Does operator* depend on operator*=? Does operator*= depend on operator*?",
      "What happens when two functions each delegate to the other with no termination condition?",
    ],
    explanation:
      "operator* creates a copy of the left-hand side and calls operator*= on it. operator*= implements itself by calling operator* and assigning the result. This creates infinite mutual recursion: operator* calls operator*=, which calls operator*, which calls operator*=, and so on. The program crashes with a stack overflow at runtime. One of the two operators must contain the actual multiplication logic instead of delegating to the other.",
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
    hints: [
      "How does C++ parse an expression with multiple << operators in a row?",
      "Is the expression 1 << alarm_bit evaluated as a bitwise shift, or does something else happen first?",
      "What is the associativity of operator<<, and how does it affect the grouping when a DiagLog is on the left?",
    ],
    explanation:
      'The expression log << "Alarm mask: " << 1 << alarm_bit is parsed left-to-right as ((log << "Alarm mask: ") << 1) << alarm_bit. The intended bitwise shift 1 << alarm_bit is never computed. Instead, the integers 1 and alarm_bit (5) are logged as separate values, producing the concatenated output "15" instead of the expected "32" (which is 1 << 5). Parentheses are required: log << "Alarm mask: " << (1 << alarm_bit).',
  },
];
