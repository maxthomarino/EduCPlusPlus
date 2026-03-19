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
];
