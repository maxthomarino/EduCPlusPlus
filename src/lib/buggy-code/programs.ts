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
    hints: [
      "In what order are the member variables actually initialized?",
      "Does the order in the initializer list determine the initialization sequence, or does declaration order?",
      "What is the value of height_ when area_ is being computed?",
    ],
    explanation:
      "Members are initialized in declaration order (width_, area_, height_), not in the order written in the initializer list. When area_ is initialized as width_ * height_, height_ has not been initialized yet and contains an indeterminate value. The computed area is garbage despite the initializer list appearing to set height_ first.",
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
    hints: [
      "Are total_ and count_ unique to each GradeBook instance?",
      "What does the static keyword mean for class data members?",
    ],
    explanation:
      "The members total_ and count_ are declared static, meaning they are shared across all GradeBook instances. When grades are added through either math or science, they accumulate in the same two variables. Both objects report the combined average of all four grades (86.25) instead of their individual averages (87.5 for Math, 85.0 for Science).",
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
    hints: [
      "How is target_temp_ assigned in the constructor body?",
      "Is the variable being assigned inside the constructor body the class member, or something else?",
    ],
    explanation:
      "The constructor body declares a local variable double target_temp_ that shadows the class member of the same name. The parameter value is stored in this local, which is immediately discarded when the constructor finishes. The member target_temp_ is never initialized, leaving it with an indeterminate value. All comparisons in adjust() read this uninitialized member — undefined behavior.",
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
    hints: [
      "Which version of setup() runs during the Component constructor?",
      "At what point in construction does virtual dispatch to the derived class become available?",
      "Are the derived class members initialized when the base constructor runs?",
    ],
    explanation:
      "Virtual functions called from a constructor dispatch to the version of the class currently being constructed. When Component's constructor calls setup(), the object's dynamic type is still Component, so Component::setup() runs unconditionally setting ready_ to true. SecureComponent::setup() with its key-length check is never invoked. The Validator with the short key is incorrectly reported as ready.",
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
    hints: [
      "What determines the default argument value when a virtual function is called through a base reference?",
      "Is the default argument resolved at compile time or at runtime?",
    ],
    explanation:
      "Default arguments are resolved at compile time based on the static type of the pointer or reference, not the dynamic type. When dispatch() calls notifier.send(msg) through a Notifier& reference, the default argument priority = 1 from Notifier::send is used, even though UrgentNotifier::send is the function that actually executes. The urgent notification incorrectly runs with priority 1 instead of 10.",
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
    hints: [
      "Where exactly is the base class Vehicle being initialized?",
      "What does the statement Vehicle(std::move(make), year) do inside the constructor body?",
      "At what point during construction must the base class be initialized?",
    ],
    explanation:
      'The statement Vehicle(std::move(make), year) in the constructor body creates and immediately destroys a temporary Vehicle object — it does not initialize the base class. Base class initialization must happen in the member initializer list, before the constructor body runs. Since no base constructor is specified in the initializer list, the default Vehicle() constructor is called, setting make_ to "Unknown" and year_ to 0.',
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
    hints: [
      "What does the lambda capture when it uses [this]?",
      "What happens to the Sensor objects after create_reports() returns?",
    ],
    explanation:
      "The lambdas capture the this pointer of local Sensor objects inside create_reports(). When the function returns, both Sensor objects are destroyed, but the returned lambdas still hold dangling this pointers. Invoking any of the report functions reads destroyed objects' members — undefined behavior. The lambdas should capture the member values by copy instead of capturing this.",
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
    hints: [
      "What happens to resources acquired before an exception is thrown in a constructor?",
      "If a constructor throws, does the destructor of that object run?",
      "Which resource has already been allocated by the time the size check runs?",
    ],
    explanation:
      "When the constructor throws for query_size == 0, host_buf_ has already been allocated. Since the object was never fully constructed, its destructor does not run — the C++ standard only calls destructors for fully constructed objects. The host_buf_ allocation is permanently leaked. Using std::string or std::unique_ptr for the buffers would ensure cleanup through their own destructors.",
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
    hints: [
      "What is the lifetime of the string object that table_ refers to?",
      "When a const reference parameter binds to a temporary, how long does that temporary live?",
      "Does storing a reference in a class member extend the lifetime of the object it refers to?",
    ],
    explanation:
      'The constructor parameter table binds to a temporary std::string created from the string literal "users". The member reference table_ is initialized from this parameter, but storing a reference in a member does not extend the temporary\'s lifetime. The temporary is destroyed when the full expression completes, leaving table_ as a dangling reference. Calling execute() reads through freed memory — undefined behavior. The member should be std::string by value, not const std::string&.',
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
    hints: [
      "What happens to the object's memory after delete this executes?",
      "Does execution of the member function continue after delete this?",
      "Are any member variables accessed after the point where the object might be destroyed?",
    ],
    explanation:
      "When release() decrements ref_count_ to 0 and calls delete this, the object is destroyed and its memory freed. However, execution continues past the if block and accesses name_ and ref_count_ on the next line — both members of the now-deleted object. This is use-after-free. The function must return immediately after delete this to avoid accessing any member state.",
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
    hints: [
      "Look carefully at the allocation syntax — what exactly does new int(n) allocate?",
      "What is the difference between new int(n) and new int[n]?",
    ],
    explanation:
      "The expression new int(num_bins) allocates a single int initialized to the value 10, not an array of 10 ints. The program then writes to bins[0] through bins[9], which is a massive heap buffer overflow past the one allocated int. The fix is to use new int[num_bins] with square brackets for array allocation.",
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
    hints: [
      "What does strncpy guarantee about the destination buffer when the source is longer than max_len?",
      "If the source string is longer than max_len, does strncpy add a null terminator?",
    ],
    explanation:
      "strncpy copies at most max_len characters but does not null-terminate the destination if the source is as long as or longer than max_len. Since long_text is 44 characters and max_len is 10, the buffer has no null terminator. Printing it with cout and calling strlen both read past the allocated 10 bytes — a heap buffer overread. The fix is to add buf[max_len - 1] = '\\0' after the strncpy call.",
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
    hints: [
      "How was the pixel array allocated?",
      "Does the deallocation method match the allocation method?",
    ],
    explanation:
      "The pixel array is allocated with std::malloc but freed with delete[]. Mixing C allocation (malloc/calloc/realloc) with C++ deallocation (delete/delete[]) is undefined behavior. The fix is to use std::free(gradient) instead of delete[], or to allocate with new Pixel[width] instead of malloc.",
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
    hints: [
      "How many separate heap allocations are made in create_grid?",
      "Does the cleanup code free every allocation that was made?",
    ],
    explanation:
      "create_grid makes rows + 1 allocations: one for the pointer array and one for each row. The cleanup only calls delete[] grid, which frees the array of pointers but not the individually allocated rows. All row data is permanently leaked. The fix is to loop through each row calling delete[] grid[i] before deleting the outer array.",
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
    hints: [
      "What happens to existing references into the buffer when push() causes a resize?",
      "Under what condition does push() reallocate the internal storage?",
      "Is the reference obtained from front() still valid after the buffer grows?",
    ],
    explanation:
      "The reference ref obtained from front() points into the internal data_ array. When the fifth push(50) triggers grow(), the old data_ array is deleted and a new one is allocated. The reference ref now points to freed memory. Reading it is undefined behavior. References and pointers into the buffer are invalidated by any operation that triggers a resize.",
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
    hints: [
      "How many elements does the flatten function allocate for the output?",
      "How many elements does the nested loop actually write?",
      "Are the dimensions used in the allocation consistent with those used in the loop?",
    ],
    explanation:
      "The allocation uses rows * rows (3 * 3 = 9) instead of rows * cols (3 * 5 = 15). The nested loop writes 15 values into a 9-element buffer, causing a heap buffer overflow. The fix is to allocate new int[rows * cols].",
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
    hints: [
      "What is the third argument to std::memcpy — is it a byte count or an element count?",
      "How many bytes does each Student struct occupy?",
      "Does the memcpy copy enough data to fully transfer all existing students?",
    ],
    explanation:
      "std::memcpy's third argument is a byte count, not an element count. The call passes count (the number of students) instead of count * sizeof(Student). Since each Student is 68 bytes, only 1-3 bytes of the old roster are copied during each resize, leaving the transferred entries almost entirely uninitialized. The fix is std::memcpy(new_roster, roster, count * sizeof(Student)).",
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
    hints: [
      "How were the Particle objects that a and b point to originally allocated?",
      "Is it valid to call delete on a pointer that points into the middle of a new[] array?",
      "What should the code use instead of delete to return particles to the pool?",
    ],
    explanation:
      "The particles pointed to by a and b are elements within the pool's contiguous new Particle[cap] array — they were not individually allocated with new. Calling delete on pointers into the middle of an array is undefined behavior. The program should call pool.deallocate(a) and pool.deallocate(b) instead of delete.",
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
    hints: [
      "What type information does the compiler have when delete is called on each resource?",
      "Can the compiler invoke the correct destructor through a void pointer?",
      "What happens to std::string's internal heap buffer when it is never properly destructed?",
    ],
    explanation:
      "Deleting a void* is undefined behavior per the C++ standard. The compiler has no type information, so it cannot call destructors. For the std::string objects, their internal heap-allocated character buffers are never freed. The fix is to cast each pointer back to its original type before deleting, or to use a type-safe container like std::variant.",
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
    hints: [
      "What values do the entries in the tasks array contain before any Task objects are constructed?",
      "If the construction of tasks[2] throws, how many entries hold valid pointers?",
      "Does the cleanup loop in the catch block account for the fact that some entries were never assigned?",
    ],
    explanation:
      "When Task(\"Deploy\", -2) throws, only tasks[0] and tasks[1] hold valid pointers. The array was allocated with new Task*[count], which does not zero-initialize the pointers, so tasks[2] and tasks[3] contain indeterminate garbage values. The catch block's cleanup loop deletes all count entries, calling delete on garbage pointers — undefined behavior. The fix is to value-initialize the array with new Task*[count]() so unset entries are nullptr, making delete on them safe.",
  },
];
