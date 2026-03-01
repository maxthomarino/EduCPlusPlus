---
title: "You probably don't need a destructor"
description: "How a simple class with a raw pointer spirals into five special member functions, and why modern C++ lets you write none of them."
publishDate: 2026-03-01
tags:
  - cpp
  - resource-management
  - raii
  - special-member-functions
  - cxx11
author: "EduC++ Team"
draft: false
---

Here is a perfectly normal class. It holds a name and an age. You have written a hundred things like it.

```cpp
struct Person {
    std::string name;
    int age;
};
```

You can copy it, move it, destroy it. The compiler generates all the plumbing for you. Every member gets copied when you copy, moved when you move, destroyed when you destroy. Life is simple.

Now suppose you need to store a dynamically sized buffer of sensor readings. You reach for a raw pointer because you want to control the allocation yourself. Maybe you have a performance reason, maybe you are interfacing with a C library, maybe you just want to learn how memory works. Whatever the reason, you write this:

```cpp
class SensorLog {
    double* data_;
    std::size_t size_;
public:
    SensorLog(std::size_t n)
        : data_(new double[n]), size_(n) {}
};
```

This compiles. It runs. You allocate memory in the constructor, and everything looks fine until you try to use it in the most ordinary way imaginable:

```cpp
SensorLog a(100);
SensorLog b = a;
```

Two objects. Both have a `data_` pointer. Both point to the same heap memory. When `b` goes out of scope, it destroys and frees that memory. Then `a` goes out of scope and frees the same memory again. That is a double free, and your program is now corrupt. It might crash. It might silently keep running with garbage data. Either way, you have a bug that compiles without a single warning.

The compiler-generated copy constructor did exactly what it always does: it copied every member, byte for byte. For an `int` or a `std::string`, that is perfectly correct. For a raw pointer to heap memory, it is catastrophic.

So you write a destructor to clean up:

```cpp
~SensorLog() { delete[] data_; }
```

That fixes the leak. But the double-free is still there because the copy constructor still does a shallow pointer copy. Fine, so you write a proper copy constructor that allocates its own memory:

```cpp
SensorLog(const SensorLog& other)
    : data_(new double[other.size_]), size_(other.size_) {
    std::copy(other.data_, other.data_ + size_, data_);
}
```

Now copies are independent. Each object owns its own buffer. But what about assignment? If you write `a = b` where both already exist, the compiler-generated copy assignment does the same shallow copy of the pointer. The old buffer that `a` owned leaks, and now both objects share `b`'s buffer. Same double-free problem, just triggered through a different door.

So you write copy assignment too:

```cpp
SensorLog& operator=(const SensorLog& other) {
    if (this != &other) {
        delete[] data_;
        data_ = new double[other.size_];
        size_ = other.size_;
        std::copy(other.data_, other.data_ + size_, data_);
    }
    return *this;
}
```

Count what you have now. A destructor, a copy constructor, and a copy assignment operator. Three special member functions, all required because of one raw pointer. If you had written any one of them without the other two, you would have a bug. They come as a package deal. If your class needs custom logic for destroying its resources, it almost certainly needs custom logic for copying them, and vice versa. That pattern, the tight coupling between those three, is what C++ programmers call the Rule of Three.

## But C++11 changed the game

When move semantics arrived, the picture got more complicated. Your `SensorLog` might be returned from a function, or pushed into a vector, or swapped. Without move operations, all of those paths fall back to copying, which means allocating and copying the entire buffer every time. That is correct but wasteful.

A move constructor can transfer ownership instead. Steal the pointer, null out the source, and you have moved a potentially huge buffer in constant time:

```cpp
SensorLog(SensorLog&& other) noexcept
    : data_(other.data_), size_(other.size_) {
    other.data_ = nullptr;
    other.size_ = 0;
}
```

And move assignment follows the same logic:

```cpp
SensorLog& operator=(SensorLog&& other) noexcept {
    if (this != &other) {
        delete[] data_;
        data_ = other.data_;
        size_ = other.size_;
        other.data_ = nullptr;
        other.size_ = 0;
    }
    return *this;
}
```

Now you have five special member functions. Destructor, copy constructor, copy assignment, move constructor, move assignment. All five exist because of one raw pointer. All five must be consistent with each other or you get bugs. That is the Rule of Five: if you need to write any one of these, you probably need to write all five.

There is an important subtlety hiding here. When you declared a destructor, the compiler actually stopped generating move operations for you. It still generates copy operations (for backward compatibility with old C++ code), but it considers that generation deprecated. So if you wrote only a destructor and a copy constructor but forgot move operations, your class silently falls back to copying in move contexts. No error, no warning. Just slower code than you expected, and no indication that anything is wrong.

## What if you could write none of them?

Go back to the original `Person` struct. It had no destructor, no copy constructor, no assignment operators. The compiler did everything. And it did everything correctly because `std::string` and `int` already know how to copy, move, and destroy themselves.

That is the real insight. The problem was never that the compiler is bad at generating special member functions. The compiler is excellent at it. The problem is that raw pointers do not carry ownership semantics. A `double*` does not know it "owns" heap memory. It is just an address. So the compiler's generated copy does the only thing it can: copy the address.

But `std::unique_ptr<double[]>` does carry ownership semantics. It knows it owns the memory. It deletes the memory in its destructor. It refuses to be copied (because ownership cannot be duplicated). It transfers ownership when moved.

```cpp
class SensorLog {
    std::unique_ptr<double[]> data_;
    std::size_t size_;
public:
    SensorLog(std::size_t n)
        : data_(std::make_unique<double[]>(n)), size_(n) {}
};
```

No destructor. No copy constructor. No copy assignment. No move constructor. No move assignment. Zero special member functions. The compiler generates the right behavior for every operation because every member already knows how to manage itself. `unique_ptr` handles the memory. `size_t` is trivially copyable. The compiler composes correct behavior from correct parts.

This class cannot be copied (because `unique_ptr` is not copyable), but it can be moved. If you also want copying, you would add a copy constructor that clones the buffer, but that is a design decision, not a resource management obligation.

The principle is simple: if every member of your class manages its own resources correctly, your class manages its resources correctly. You do not need to write a destructor. You do not need to write copy or move operations. The compiler handles it. That is the Rule of Zero. Prefer to write zero special member functions by composing your class from members that already do the right thing.

## The hierarchy in practice

These three rules are not really three separate ideas. They are one idea at different levels of abstraction.

At the bottom, someone has to manage raw resources. That is where the Rule of Five lives. Classes like `unique_ptr`, `shared_ptr`, `vector`, `string`, and `fstream` each manage one resource and implement all five special member functions (or deliberately delete the ones that do not make sense). These are resource handles.

At the top, your application classes compose those handles together. A `Person` has a `string`. A `SensorLog` has a `unique_ptr`. A `Connection` has an `fstream`. These classes follow the Rule of Zero because their members already do the heavy lifting.

The Rule of Three is what you get when you are stuck between the two levels. You are managing a raw resource directly but C++11 does not exist yet, or you have not switched to RAII wrappers. It is historically important and still shows up in older codebases, but in modern C++ it is usually a signal that the class should be refactored.

The practical takeaway is this: if you find yourself writing a destructor, pause. Ask whether you can replace the raw resource with a standard library type that already handles cleanup. If you can, delete the destructor and let the compiler do its job. If you genuinely cannot (maybe you are writing the low-level handle itself, or interfacing with a C API that demands manual cleanup), then commit to all five operations and get them right. The dangerous middle ground is writing one or two and assuming the compiler will fill in the rest correctly.

One more thing. There is a defensive idiom you will see in well-maintained codebases: explicitly defaulting all five operations even when the compiler would generate them anyway.

```cpp
class SensorLog {
    std::unique_ptr<double[]> data_;
    std::size_t size_;
public:
    SensorLog(std::size_t n);
    ~SensorLog() = default;
    SensorLog(const SensorLog&) = delete;
    SensorLog& operator=(const SensorLog&) = delete;
    SensorLog(SensorLog&&) noexcept = default;
    SensorLog& operator=(SensorLog&&) noexcept = default;
};
```

This is not strictly necessary. But it tells the next person reading the code that the author thought about resource management and made a deliberate choice. In a class that owns resources, silence about special member functions can look like oversight. Explicit defaults and deletes turn that silence into a clear statement.

The rules have names. The Rule of Zero, the Rule of Three, the Rule of Five. But the underlying idea is older and simpler than any of them: every resource should have exactly one owner, and that owner should clean up after itself. Build your classes from owners that already work, and the compiler will compose the rest. Start managing raw resources by hand, and you have signed up for all the bookkeeping that entails. There is no middle ground that stays correct on its own.
