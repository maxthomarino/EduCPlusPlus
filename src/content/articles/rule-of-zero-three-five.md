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

Here is a perfectly normal class. It holds a name and an age. You may have written a hundred things like it.

```cpp
struct Person {
    std::string name;
    int age;
};
```

You can copy it, move it, pass it to a function, store it in a vector, return it from a factory. The compiler generates all the machinery behind the scenes: how to copy each member, how to move each member, how to tear the whole thing down when it goes out of scope. You never think about any of this. You just use the type and it works.

```cpp
std::vector<Person> team;
team.push_back({"Alice", 30});
team.push_back({"Bob", 25});
Person p = team[0];  // copy, independent of the vector
```

Every line here is doing real work under the hood. The vector is allocating storage, constructing `Person` objects, copying strings. When `team` is eventually destroyed, every `Person` inside it is destroyed, and every string inside every person frees its buffer. None of this required you to write anything. The compiler generated correct copy constructors, move constructors, and destructors for `Person` because every member of `Person` already knows how to handle itself. You could add more members, more strings, nested vectors, maps. As long as every member type manages its own resources, the composed class manages its resources correctly too.

That feeling of "it just works" is worth paying attention to. The compiler is doing a lot of work behind the scenes, generating five different operations for `Person`: a destructor, a copy constructor, a copy assignment operator, a move constructor, and a move assignment operator. You have probably heard those called "special member functions." For `Person`, all five are correct. The compiler writes them, they work, and you never think about them.

Until you do something that breaks the pattern.

Now suppose you need something slightly different. You need a class that holds a dynamically sized buffer of sensor readings. The size is not known at compile time. You want to control the allocation yourself. Maybe you are interfacing with a C library that gives you raw memory. Maybe you are implementing a ring buffer and want precise control over the allocation. Maybe you just want to understand how ownership works under the hood. Whatever the reason, you write something like this:

```cpp
class SensorLog {
    double* data_;
    std::size_t size_;
public:
    SensorLog(std::size_t n)
        : data_(new double[n]), size_(n) {}
};
```

This compiles. The constructor allocates a heap buffer and stores the pointer. Everything looks fine. You start using it.

```cpp
SensorLog a(100);
SensorLog b = a;
```

Two objects. You copied one from the other. That is the most ordinary thing you can do with a value type in C++. But something has gone very wrong. Both `a` and `b` now hold a `data_` pointer, and both pointers contain the same address. They point to the same heap buffer. There are not two buffers. There is one buffer with two owners. And C++ does not have a concept of shared ownership by default. It has destructors that run unconditionally when objects leave scope.

When `b` is destroyed, its destructor (which the compiler generates as a no-op, since you did not write one) does nothing. So the buffer leaks. If you had written a destructor that calls `delete[]`, then when `b` is destroyed it frees the buffer. Then `a` is destroyed and frees the same buffer again. That is a double free. Your program is now corrupt. It might crash immediately with a segfault. It might corrupt the heap allocator's metadata and crash minutes later in completely unrelated code. It might silently keep running and produce wrong results. The compiler gave you no warning. The code looks completely reasonable.

The compiler-generated copy constructor did exactly what it always does: it copied every member, field by field. For an `int`, that is fine. For a `std::string`, that triggers string's own copy constructor, which allocates a fresh buffer and copies the characters. The copy is independent of the original. But for a raw `double*`, copying the member just copies the eight bytes of the address. The compiler has no way to know that this pointer "owns" heap memory. It is just a number. Copying a number gives you the same number, and now two objects think they own the same resource.

And the thing is, the compiler is not wrong. It did exactly what it was supposed to do. The member is a `double*`. Copying a pointer means copying its value. That is the correct semantics for a pointer. The problem is not the compiler's behavior. The problem is that you used a type whose copy semantics do not match your ownership semantics. You wanted "copy the data this points to." You got "copy the pointer itself." The gap between those two things is the entire source of the bug.

## The fix that makes things worse

The obvious first move is to write a destructor so the buffer gets freed:

```cpp
~SensorLog() { delete[] data_; }
```

That fixes the leak for objects that are never copied. But you have only treated one symptom. The double-free is still there. Copying still produces two objects that share one buffer, and now both of them have destructors that are eager to call `delete[]` on it.

So you write a copy constructor that does a proper deep copy:

```cpp
SensorLog(const SensorLog& other)
    : data_(new double[other.size_]), size_(other.size_) {
    std::copy(other.data_, other.data_ + size_, data_);
}
```

Now each copy gets its own buffer with its own data. Copies are truly independent. The double-free is gone.

You feel like the problem is solved. And if all you ever do is construct copies, it is. But C++ has more than one way to put one object's value into another. Construction is one. Assignment is a different operation entirely. Someone writes `a = b` where both `a` and `b` already exist. This is not construction; this is assignment. The compiler-generated copy assignment operator does the same member-wise copy: it overwrites `a.data_` with `b.data_`, losing the old pointer forever. The buffer that `a` used to own is gone. No one holds its address anymore. It will never be freed. That is a memory leak. And now `a` and `b` share the same pointer again, so when they are both destroyed you get the double-free back. Same bug, just triggered through a different door.

This is what makes resource management in C++ so treacherous. The language has multiple ways to put one value into another: construction, assignment, move construction, move assignment. Each one is a separate operation with a separate compiler-generated default. If any of those defaults is wrong for your type, you have a bug. And the defaults are wrong for any type that owns a resource through a raw pointer.

The really insidious part is that each bug only manifests through a specific usage pattern. If you only ever construct and destroy SensorLogs without copying or assigning, everything works fine. The bugs only appear when someone uses the class in a perfectly normal way that you did not test. And "perfectly normal ways" in C++ include passing by value, storing in containers, returning from functions, and dozens of other everyday operations.

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

Count what you have now. A destructor, a copy constructor, and a copy assignment operator. Three custom operations, all required because of one raw pointer. If you had written any one of them without the other two, you would have a bug. A destructor without a copy constructor gives you double frees. A copy constructor without a destructor gives you leaks from the copies. A copy constructor without copy assignment gives you double frees on assignment. They come as a package deal. If your class needs custom logic for cleaning up its resources, it almost certainly needs custom logic for duplicating them, and vice versa. That tight coupling between these three operations is what C++ programmers call the Rule of Three.

But we are not done. Not even close.

If this were 2003, we could stop here. The Rule of Three would be the whole story. But C++ did not stop evolving, and the addition of move semantics in C++11 turned three into an insufficient number.

## Five is the new three

With C++11, the language added move semantics. The motivation was exactly the kind of waste we have been talking about. If a value is about to be destroyed anyway, like a temporary or an object you explicitly do not need anymore, you can transfer its resources to a new owner instead of duplicating them. For a `SensorLog` holding a million doubles, copying means calling `new double[1000000]`, then copying every value one by one, then eventually freeing the old buffer. Moving means copying two numbers (the pointer and the size), writing two zeros into the source, and you are done. Constant time, regardless of how large the buffer is.

Your Rule of Three SensorLog should benefit from this automatically, right? The compiler knows about move semantics now. It should generate move operations for you.

It does not.

There is a trap hiding in the compiler's rules. When you declared that destructor, the compiler quietly stopped generating move operations for your class. It still generates copy operations (for backward compatibility with pre-C++11 code), but it considers that implicit copy generation deprecated. Move constructor and move assignment? Suppressed entirely. The compiler's reasoning is simple: if you wrote a custom destructor, you probably have custom resource management logic, and the compiler does not trust itself to generate correct move operations for a class with custom cleanup.

That means your SensorLog class, with its Rule of Three implementation, silently falls back to copying in every context where a move would have been used. Consider a simple function that creates and returns a SensorLog:

```cpp
SensorLog make_log(std::size_t n) {
    SensorLog log(n);
    // ... fill in data ...
    return log;
}
```

Without move operations, the return statement copies the entire buffer. The compiler might apply copy elision in some cases, but it cannot always. In contexts where it cannot, you pay for a full allocation and copy of every element, followed by the destruction of the original. Pushing into a vector that needs to reallocate? Copies every element. Swapping two SensorLogs? Copies both. The code compiles and runs correctly. But it performs terribly, and there is zero indication anything is wrong. No warning, no error. Just unnecessary allocations hiding behind correct behavior.

So you write a move constructor. The idea is simple: instead of allocating new memory and copying data, just take the other object's pointer and leave it in an empty state. Steal the pointer, null the source:

```cpp
SensorLog(SensorLog&& other) noexcept
    : data_(other.data_), size_(other.size_) {
    other.data_ = nullptr;
    other.size_ = 0;
}
```

The moved-from object is left in a valid but empty state. Its `data_` is `nullptr` and its `size_` is 0. When its destructor eventually runs, `delete[] nullptr` is a no-op. The object can be safely destroyed, assigned to, or reused.

And move assignment, which has to free the old buffer before stealing the new one:

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

Now you have five special member functions. Destructor, copy constructor, copy assignment, move constructor, move assignment. All five exist because of one raw pointer. All five must be consistent with each other or you get bugs. Miss the move constructor and you silently copy instead of moving. Miss the copy assignment and you get double frees on assignment. Miss the destructor and you leak. Forget to null the source in the move constructor and the moved-from object's destructor frees memory that the new owner is using.

Every one of these bugs compiles without warnings. Every one of them produces undefined behavior. Some of them crash immediately. Some of them corrupt memory and crash minutes later in completely unrelated code. Some of them run correctly for months and then fail under load when a specific sequence of moves and copies hits the wrong path.

This is the Rule of Five: if you need to customize any one of these five special member functions, you almost certainly need to customize all five.

Notice `noexcept` on the move operations. That is not decoration. It changes how the standard library treats your type. When a `std::vector` needs to reallocate, it has to transfer its elements to a new, larger buffer. If it uses move operations and a move constructor throws halfway through, some elements have been moved out of the old buffer and some have not. The old buffer is in a partially-destroyed state. The new buffer is incomplete. The vector cannot roll back, because moving the already-moved elements back could also throw. The strong exception guarantee, which promises that a failed operation leaves the container unchanged, is broken.

So `std::vector` makes a conservative choice. If your move constructor is not `noexcept`, it falls back to copying, because copy constructors do not modify the source. If a copy throws, the old buffer is still intact and the vector can clean up the partial new buffer. The downside is that you pay the full cost of copying every element, which for a SensorLog with a million doubles is enormous.

The fix is simple: mark your move constructor and move assignment `noexcept`. If they truly cannot throw (and pointer-stealing moves generally cannot), this tells the standard library it is safe to use them. You can write a perfect move constructor and still get copies in the hot path just because you forgot that one keyword.

## What if you wrote none of them?

Five special member functions. All of them doing careful pointer management. All of them needing to be consistent with each other. All of them existing because of one `double*` member. It feels like a lot of ceremony for something that should be simple.

Go back to `Person` for a moment. That struct never needed a destructor. Never needed a copy constructor or copy assignment. Never needed move operations. The compiler generated all five, and all five were correct.

Why?

Because `std::string` already knows how to copy itself, move itself, and destroy itself. String's copy constructor allocates a new buffer and copies the characters. String's move constructor steals the buffer pointer and nulls the source. String's destructor frees the buffer. All of that is built into the type. And `int` is trivially copyable: copying an int just copies the bytes, and destroying an int does nothing.

So when the compiler generates a copy constructor for `Person`, it just copies each member using that member's own copy constructor. `std::string` handles the string copy. `int` handles the int copy. The compiler composed correct behavior from correct parts. It did not need to understand what a string is or how heap memory works. It just asked each member to copy itself, and each member knew how.

The problem with `SensorLog` was never that the compiler is bad at generating these operations. The compiler is excellent at it.

The problem is that `double*` does not carry ownership semantics. A raw pointer is just an address. It is eight bytes on a 64-bit machine. The compiler has no way to know that those eight bytes represent ownership of a heap allocation. It does not know that copying the address should allocate a new buffer, or that destroying the object should call `delete[]`. So the compiler does the only thing it can: copy the address byte for byte, and do nothing on destruction. And that is wrong, because those eight bytes represent ownership, not just data.

What if you could replace that `double*` with a type that does carry ownership semantics? A type whose copy constructor is deleted (because you cannot duplicate unique ownership), whose move constructor transfers the pointer (because ownership can be transferred), and whose destructor calls `delete[]` (because the owner is responsible for cleanup)?

That type already exists. It is `std::unique_ptr<double[]>`. It wraps a raw pointer and gives it ownership behavior. Its destructor calls `delete[]`. Its copy constructor and copy assignment are deleted, because there is no sensible way to copy unique ownership. Its move constructor transfers the pointer and nulls the source. Its move assignment frees the old resource and then transfers. All five special member functions are either correctly implemented or deliberately deleted. All of that behavior is baked into the type, the same way `std::string` bakes in its own copy-move-destroy behavior. And because `unique_ptr` has zero overhead over a raw pointer (it compiles down to the exact same machine code), you pay nothing for this safety.

```cpp
class SensorLog {
    std::unique_ptr<double[]> data_;
    std::size_t size_;
public:
    SensorLog(std::size_t n)
        : data_(std::make_unique<double[]>(n)), size_(n) {}
};
```

No destructor. No copy constructor. No copy assignment. No move constructor. No move assignment. Zero special member functions written by you. The compiler generates them all, and they are all correct, because every member already knows how to manage itself. `unique_ptr`'s destructor calls `delete[]`. `unique_ptr`'s move constructor steals the pointer and nulls the source. `unique_ptr` refuses to be copied. `size_t` is trivially copyable and trivially destructible. The compiler composes correct behavior from correct parts, just like it did with `Person`. We are back to the safe ground we started on.

This class cannot be copied (because `unique_ptr` is not copyable), but it can be moved. For many resource-owning types, that is exactly right. Unique ownership means unique ownership. You can transfer it, but you cannot duplicate it.

But sometimes you genuinely need deep copies. Maybe you want to snapshot a SensorLog so you can modify one copy without affecting the other. In that case, you add just a copy constructor and copy assignment that clone the buffer:

```cpp
class SensorLog {
    std::unique_ptr<double[]> data_;
    std::size_t size_;
public:
    SensorLog(std::size_t n)
        : data_(std::make_unique<double[]>(n)), size_(n) {}

    SensorLog(const SensorLog& other)
        : data_(std::make_unique<double[]>(other.size_)),
          size_(other.size_) {
        std::copy(other.data_.get(),
                  other.data_.get() + size_, data_.get());
    }

    SensorLog& operator=(const SensorLog& other) {
        if (this != &other) {
            data_ = std::make_unique<double[]>(other.size_);
            size_ = other.size_;
            std::copy(other.data_.get(),
                      other.data_.get() + size_, data_.get());
        }
        return *this;
    }
};
```

The move operations are still compiler-generated, because you did not declare a destructor. The compiler sees two members: a `unique_ptr` (movable, not copyable) and a `size_t` (trivially copyable and movable). It generates a move constructor that moves both. It does not generate a copy constructor because `unique_ptr` is not copyable. But you provided one explicitly, so copies work through your custom implementation. Move operations and destruction are handled by the compiler and the smart pointer. You only wrote the operations that `unique_ptr` cannot provide on its own: deep-copy semantics. Everything else is inherited from the members.

This is a subtle but important point. You wrote two special member functions (copy constructor and copy assignment), not five. The compiler filled in the other three correctly because you did not trigger the suppression rules. You did not declare a destructor (no need, `unique_ptr` handles it). You did not declare move operations (no need, the compiler generates them from the members). The class is not quite Rule of Zero, but it is far from Rule of Five. It sits in a natural middle ground: the smart pointer handles the resource, and you only step in for the one behavior the smart pointer cannot provide.

The pure form of this principle, writing zero special member functions by composing your class from members that already do the right thing, is called the Rule of Zero.

Prefer to write none of them. Let the compiler compose correct behavior from correct parts.

There is a defensive idiom worth knowing. Even when the compiler would generate everything correctly, some teams explicitly spell out their intentions:

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

This is not strictly necessary. The compiler would do the same thing. But it tells the next person reading the code that the author thought about resource management and made a deliberate choice. Silence about special member functions can look like oversight. Explicit `= default` and `= delete` turn that silence into a clear statement.

## Watching the machine work

To see why this matters beyond aesthetics, imagine a `std::vector<SensorLog>` with capacity 2, holding two logs of a million readings each. You push a third element. The vector needs to grow.

If your SensorLog has only the Rule of Three operations (destructor, copy constructor, copy assignment, no move operations), here is what happens step by step. The vector allocates a new, larger internal buffer. Then, for each of the two existing elements, it calls the copy constructor. Each copy constructor call does `new double[1000000]`, allocates a fresh heap buffer, and copies every single double from the old element into the new one. That is two heap allocations and two million `double` copies. Then the vector destroys the two old elements, each of which calls `delete[]` on its buffer. Two heap frees. Then it frees the old vector storage itself. The total cost: two heap allocations, two million-element memory copies, three heap frees. All of that just to make room for one new element.

If your SensorLog has the full Rule of Five (including `noexcept` move operations), the story is completely different. The vector allocates the new buffer, same as before. But now, for each existing element, it calls the move constructor. The move constructor copies `data_` (a pointer, eight bytes) and `size_` (another eight bytes) from the old element into the new one, then writes `nullptr` and `0` into the old element. That is it. No heap allocation. No data copying. Each move is four writes to memory. The old elements are empty shells. When the vector destroys them, their destructors see `data_ == nullptr` and do nothing. The old vector storage is freed. Total cost: one allocation for the new vector buffer, a few pointer writes, one free. The million-element heap buffers were never touched. They just changed owners.

If your SensorLog uses `unique_ptr` and the Rule of Zero, the exact same thing happens. The compiler-generated move constructor moves each member: `unique_ptr`'s move constructor transfers the pointer, and `size_t` is trivially copied. Same pointer stealing, same null-writing, same performance. But you wrote zero lines of special member function code.

The memory layout at each stage tells the story. Before reallocation, the vector's internal buffer holds two SensorLog objects. Each one has a `data_` pointer aimed at its own heap buffer somewhere else in memory. Think of it as two small structs on the vector's storage, each with an arrow pointing to a large block on the heap.

After the move-based reallocation, the new vector buffer holds two SensorLog objects whose `data_` pointers aim at the same heap buffers the old objects used to own. The arrows just moved. The old objects still exist momentarily in the old vector buffer, but their `data_` pointers are null and their sizes are zero. When the vector frees the old buffer and destructs those empty shells, nothing happens. The heap buffers survive, owned by the new objects. No memory was copied. Ownership just slid from one container to another.

If you drew this on a napkin, it would look like a row of small boxes (the SensorLog objects in the vector) each with an arrow pointing to a large block (the heap buffer). During a copy-based reallocation, you draw new boxes and new large blocks, copy all the data into the new blocks, then erase the old boxes and old blocks. During a move-based reallocation, you draw new boxes, redirect the arrows from the old boxes to the new boxes, then erase the old boxes. The large blocks never move. They just get new owners.

This is not a micro-optimization. For a vector of a hundred SensorLogs, each holding a megabyte of data, the difference between copy-based and move-based reallocation is the difference between copying a hundred megabytes and writing a few hundred pointer values. It is the kind of performance gap that shows up as a wall in profiler output, and the fix is either writing five correct special member functions or writing zero and letting the compiler compose them from smart pointers.

## The hierarchy underneath

So there are three rules: the Rule of Three, the Rule of Five, and the Rule of Zero. They sound like three separate guidelines you need to memorize. But they are really one idea seen at different levels of abstraction.

At the bottom, someone has to manage raw resources. That is where the Rule of Five lives. Classes like `unique_ptr`, `shared_ptr`, `vector`, `string`, and `fstream` each wrap one raw resource and implement all five special member functions correctly (or deliberately delete the ones that should not exist). These are the resource handles. They are the classes that deal with `new` and `delete`, with `fopen` and `fclose`, with `socket` and `close`. You do not write many of them in application code. The standard library already provides most of the ones you need. And when you do need a custom one, maybe for a C library handle or a platform-specific resource, you write it once, test it thoroughly, and then compose it into everything else.

At the top, your application classes compose those handles together. A `Person` has a `string`. A `SensorLog` has a `unique_ptr`. A `DatabaseConnection` might hold a `unique_ptr<Socket>` and a `std::string` for the connection string. An `HttpResponse` might hold a `std::vector<char>` for the body and a `std::unordered_map<std::string, std::string>` for the headers. None of these classes need custom special member functions. Every member manages itself. The compiler composes correct behavior from correct parts, and you write nothing. That is why most classes in a well-designed modern C++ codebase have no destructor, no copy constructor, and no assignment operators. The Rule of Zero is not an aspiration. It is the default.

The Rule of Three is what you get when you are stuck between the two levels. You are managing a raw resource directly but have not wrapped it in a proper handle. In pre-C++11 code, that was sometimes the only option. There were no move semantics and no `unique_ptr`. You managed raw pointers and wrote three custom operations and hoped you got them right. In modern C++, the Rule of Three is usually a signal that the class should be refactored: extract the raw resource into a dedicated RAII handle (Rule of Five), then let the outer class compose it (Rule of Zero). Two layers, clean separation, correct behavior at both levels.

It is worth understanding the exact compiler rules that make all of this treacherous. The suppression logic works like this: if you declare any of a destructor, copy constructor, or copy assignment operator, the compiler will not implicitly generate move constructor or move assignment operator. It will still generate the copy operations you did not declare (for backward compatibility with C++98 code), but the standard considers that implicit generation deprecated. In a future version of C++, it may stop generating them entirely. So if you declare a destructor and nothing else, you get a class that can be copied (through deprecated implicit generation) but cannot be moved (suppressed). That is the worst of both worlds: silently correct but silently slow.

The other direction works too. If you declare a move constructor or move assignment operator, the compiler deletes the implicit copy constructor and copy assignment operator. It does not just suppress them; it actively deletes them. So if you write a move constructor but forget copy operations, your class becomes move-only. That might be intentional (like `unique_ptr`) or it might be a mistake that produces confusing compiler errors when someone tries to copy it.

These asymmetries are not intuitive. They exist because C++11 had to be backward compatible with billions of lines of C++98 code while still adding move semantics. Consider a pre-C++11 class that declares a destructor and a copy constructor. That code worked fine in C++03. If C++11 had said "declaring a destructor deletes the implicit copy constructor," billions of lines of code would have broken. So the committee chose a compromise: declaring a destructor suppresses move generation (new behavior, no backward compat needed) but only deprecates implicit copy generation (keeps old code working, with a warning that this might change someday).

The result is a set of rules that make sense historically but feel like a minefield when you are writing new code. You can memorize the table of which declarations suppress which implicit generation. Or you can sidestep the entire problem: either declare none of the five (Rule of Zero) or explicitly declare all five (Rule of Five). The compiler's implicit generation rules only bite you when you are in the middle.

If you do find yourself writing all five, there is an idiom that can simplify the implementation: copy-and-swap. The idea is that copy assignment can be implemented in terms of the copy constructor and a no-throw swap:

```cpp
SensorLog& operator=(SensorLog other) {
    std::swap(data_, other.data_);
    std::swap(size_, other.size_);
    return *this;
}
```

Notice the parameter is taken by value, not by reference. When you call `a = b`, the compiler uses the copy constructor to create `other` as a copy of `b`. Then you swap the guts of `this` with `other`. When `other` goes out of scope at the end of the function, its destructor cleans up what used to be `this`'s old data. This gives you exception safety for free: if the copy constructor throws during allocation, the function body never executes and `this` is not modified. The failed copy is just cleaned up normally.

And because the parameter is by value, this same function handles move assignment too. When you call `a = std::move(b)`, the parameter is constructed via move constructor instead of copy constructor, and the rest works the same way. The swap steals the moved-from guts, and the destructor cleans up the leftovers. One function handles both cases.

With copy-and-swap, you can collapse copy assignment and move assignment into a single function, reducing the Rule of Five to four explicit declarations plus one function that handles two jobs. It is an elegant trick, and it eliminates an entire class of bugs (exception-unsafe assignment operators). But in modern C++, you should still ask yourself whether you need any of this in the first place. If you can use `unique_ptr` or another RAII wrapper, the Rule of Zero saves you from writing any of it.

There is one more trap that catches experienced developers, and it involves inheritance. Polymorphic base classes need a virtual destructor so that deleting through a base pointer calls the derived class's cleanup. That is correct and important. Every C++ textbook covers it.

But here is the part the textbooks often skip. Declaring a virtual destructor, even `virtual ~Base() = default`, is still a declaration of a destructor. It triggers the same compiler rule: implicit move operations are suppressed. The base class loses its move constructor and move assignment operator. If the base class has no data members, you might not notice because there is nothing to move. But derived classes inherit from this base, and if the derived class relies on the base's move operations being available for the compiler to compose its own move operations, things break. A derived class with heavy members like vectors or strings silently loses move semantics and falls back to copying. No warning. No error. Just a performance cliff hiding behind a one-line virtual destructor declaration.

The fix is to explicitly default the move operations alongside the virtual destructor:

```cpp
struct Base {
    virtual ~Base() = default;
    Base(Base&&) noexcept = default;
    Base& operator=(Base&&) noexcept = default;
    Base(const Base&) = default;
    Base& operator=(const Base&) = default;
};
```

All five, explicitly defaulted. It looks verbose for a class that might have no data members at all. But it is the only way to get both polymorphic destruction and move semantics in a class hierarchy. Without those explicit defaults, every class that inherits from `Base` and has move-worthy members will silently fall back to copying. In a large codebase, this kind of silent pessimization can add up before anyone notices.

The underlying principle behind all of this has a name too: RAII, which stands for Resource Acquisition Is Initialization. The idea is that every resource, whether it is heap memory, a file handle, a network socket, or a mutex lock, should be acquired in a constructor and released in a destructor. If you follow that pattern, then destruction is always automatic, because C++ guarantees that destructors run when objects leave scope. There is no "did I remember to close the file" question. The destructor closes it. There is no "did I remember to free the buffer" question. The destructor frees it.

RAII is what makes the Rule of Zero possible. It is the reason `Person` just works and raw-pointer `SensorLog` does not. `std::string` follows RAII: it acquires a character buffer in its constructor and releases it in its destructor. `std::unique_ptr` follows RAII: it acquires ownership of a pointer in its constructor and releases the memory in its destructor. `std::vector` follows RAII. `std::fstream` follows RAII. If every member of your class follows RAII, then the compiler-generated destructor for the outer class just calls each member's destructor, and every resource is released. The compiler-generated copy constructor calls each member's copy constructor, and every resource is independently duplicated (or the copy is refused, like with `unique_ptr`). The compiler-generated move constructor calls each member's move constructor, and every resource is efficiently transferred.

The Rule of Zero is RAII taken to its logical conclusion. Do not manage resources manually in application classes. Let resource handles do the managing. Let the compiler compose the handles into larger objects.

The less code you write in special member functions, the fewer places bugs can hide.

If you find yourself writing a destructor, pause.

Ask whether you can replace the raw resource with a standard library type that already handles cleanup. Can you replace `FILE*` with `std::fstream`? Can you replace `T*` with `std::unique_ptr<T>`? Can you replace a manual `new[]` with `std::vector`?

If you can make the switch, delete the destructor and let the compiler do its job.

If you genuinely cannot, because you are writing the low-level handle itself, or wrapping a C API that demands manual cleanup, or implementing a custom allocator, then commit to all five operations and get them right. Mark the move operations `noexcept`. Consider copy-and-swap for exception-safe assignment. Test the edge cases: self-assignment, move-from-self, empty states after move. And keep the class small. A Rule of Five class should manage exactly one resource. If it manages two, a failure in acquiring the second can leak the first. One resource, one handle, one set of five operations. If your class needs two resources, wrap each one in its own handle and compose them.

The dangerous place to be is in the middle, where you have written one or two special member functions and are trusting the compiler to fill in the rest correctly. That middle ground is where double frees, memory leaks, and silent performance cliffs live.

The safe resting places are zero and five. Zero is where you want to be for almost every class you write. Five is where the standard library lives, doing the hard work so you do not have to. Three is where old code lives, waiting to be modernized. And the middle, where you have a destructor but no move operations, or a copy constructor but no assignment operator, is where bugs live.

Pick zero or five. Let the compiler work for you, or take full responsibility. There is no safe ground in between.
