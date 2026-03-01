import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 6,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "Which smart pointer should be your default choice in modern C++?",
    options: [
      "std::shared_ptr",
      "std::auto_ptr",
      "std::weak_ptr",
      "std::unique_ptr",
    ],
    correctIndex: 3,
    explanation:
      "unique_ptr has zero overhead compared to a raw pointer (no reference counting), expresses exclusive ownership clearly, and can be converted to shared_ptr later if needed.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 7,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What happens on the second line?",
    code: `std::unique_ptr<int> a = std::make_unique<int>(42);\nstd::unique_ptr<int> b = a;`,
    options: [
      "b gets a copy of 42",
      "Runtime double-free",
      "Compilation error",
      "Both share the int",
    ],
    correctIndex: 2,
    explanation:
      "unique_ptr is non-copyable. You must use std::move(a) to transfer ownership to b.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 8,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Why is std::make_unique<T>(args...) preferred over std::unique_ptr<T>(new T(args...))?",
    options: [
      "make_unique performs a single allocation instead of two separate ones, reducing memory overhead",
      "make_unique supports custom deleters that run user-defined cleanup logic on destruction",
      "make_unique avoids a potential memory leak from unsequenced evaluation of function arguments (pre-C++17)",
      "make_unique enables the pointer to be implicitly copied and shared across multiple owners",
    ],
    correctIndex: 2,
    explanation:
      "Before C++17, if new T succeeded but another argument's evaluation threw, the allocated memory would leak. make_unique wraps the allocation safely.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique.html",
  },
  {
    id: 41,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "What happens when both a and b go out of scope?",
    code: `int* raw = new int(42);\nstd::shared_ptr<int> a(raw);\nstd::shared_ptr<int> b(raw);`,
    options: [
      "Memory leak -- neither shared_ptr takes ownership of the allocation",
      "Undefined behavior",
      "The integer is freed once",
      "Compilation error",
    ],
    correctIndex: 1,
    explanation:
      "Each shared_ptr creates its own independent control block with ref count 1. When each reaches zero, both try to delete raw. Always use make_shared or copy/move an existing shared_ptr.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr.html",
  },
  {
    id: 42,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "How many heap allocations does std::make_shared<Widget>() perform compared to std::shared_ptr<Widget>(new Widget())?",
    options: [
      "make_shared does 2, shared_ptr(new) does 1",
      "Both do 1 allocation",
      "make_shared does 1, shared_ptr(new) does 2",
      "Same -- both do 2 allocations",
    ],
    correctIndex: 2,
    explanation:
      "make_shared allocates the object and the control block (reference counts) in a single memory block. shared_ptr(new Widget()) allocates the object with new and then separately allocates a control block.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared.html",
  },
  {
    id: 43,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "A shared_ptr points to an object with a strong reference count of 1. You create a weak_ptr from it. What is the strong reference count now?",
    options: [
      "1",
      "0",
      "2",
      "Undefined -- weak_ptr cannot be created from a shared_ptr",
    ],
    correctIndex: 0,
    explanation:
      "weak_ptr does not increment the strong reference count. It only increments the weak count. This is what allows weak_ptr to break circular reference cycles.",
    link: "https://en.cppreference.com/w/cpp/memory/weak_ptr.html",
  },
  {
    id: 60,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "You use std::make_shared<LargeObject>(). The last shared_ptr is destroyed, but a weak_ptr still exists. When is the memory for LargeObject actually freed?",
    options: [
      "When weak_ptr::lock() is called and returns nullptr",
      "Immediately when the last shared_ptr is destroyed",
      "At program exit",
      "When the last weak_ptr is also destroyed",
    ],
    correctIndex: 3,
    explanation:
      "make_shared allocates the object and the control block in a single memory block. The object's destructor runs when the strong count hits zero, but the memory block cannot be freed until the weak count also reaches zero.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared.html",
  },
  {
    id: 65,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Which approach is correct for safely promoting a weak_ptr to a shared_ptr in a multithreaded program?",
    options: [
      "if) { auto sp = wp.lock(); use(sp); }",
      "auto sp = wp.lock(); if (sp) { use(sp); }",
      "auto sp = std::shared_ptr(wp); use(sp);",
      "if > 0) { auto sp = wp.lock(); use(sp); }",
    ],
    correctIndex: 1,
    explanation:
      "lock() atomically checks and promotes in a single operation. Options A and D suffer from a TOCTOU race: the object could be destroyed between the check and the lock() call. Option C throws std::bad_weak_ptr if the object is already destroyed.",
    link: "https://en.cppreference.com/w/cpp/memory/weak_ptr/lock.html",
  },
  {
    id: 587,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What is the difference between stack and heap allocation?",
    options: [
      "There is no meaningful performance difference between stack and heap allocation on modern CPUs because the memory management unit (MMU) maps both regions to the same physical RAM with identical access latency and caching behavior through the TLB",
      "Stack allocation is automatic (local variables",
      "Stack memory is reserved exclusively for class instances and their virtual function tables, while heap memory is used for primitive types and POD structures that don't require constructor or destructor calls during their lifetime and can be bitwise-copied",
      "The stack is slower but much larger than the heap because it must traverse a linked list of activation frames to find free space; the heap is faster because it uses a simple bump-pointer allocator by default and avoids the overhead of frame traversal during each allocation",
    ],
    correctIndex: 1,
    explanation:
      "Stack allocation is just a pointer adjustment (nanoseconds). Heap allocation involves searching a free list, potentially requesting memory from the OS (microseconds or more). Stack memory is also cache-friendly (contiguous). Prefer stack allocation; use heap only when you need dynamic lifetime or large/variable-size data.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 588,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What is a memory leak?",
    code: `void leak() {\n    int* p = new int[1000];\n    // ... work with p ...\n    return;  // forgot delete[] p!\n}`,
    options: [
      "When a program uses too much stack space by allocating large local arrays or deeply recursive calls, causing the stack pointer to exceed the guard page and triggering a segmentation fault",
      "When a local variable goes out of scope and its stack memory is reclaimed \u2014 any pointer still referencing that address becomes a dangling pointer, which is technically classified as a leak",
      "When dynamically allocated memory is never freed because all pointers to it are lost. The memory remains allocated but inaccessible for the lifetime of the program, gradually consuming more and more RAM",
      "When the same heap memory block is freed twice via delete or free(), causing the allocator\u2019s internal free-list to become corrupted \u2014 this is called a double-free bug, not a memory leak",
    ],
    correctIndex: 2,
    explanation:
      "C++ has no garbage collector. If you lose every pointer to a heap allocation (by overwriting, returning, or going out of scope), that memory is leaked. Repeated leaks cause the program to consume ever more RAM. Use smart pointers (unique_ptr, shared_ptr) to prevent leaks.",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 589,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What is the difference between new/delete and new[]/delete[]?",
    code: `int* single = new int(42);     // one int\nint* array = new int[100];     // 100 ints\n\ndelete single;    // free one object\ndelete[] array;   // free array`,
    options: [
      "delete[] only frees the first element of the array and leaves the remaining elements allocated on the heap -- you must call delete in a loop for each element to properly release all of the array's memory",
      "They are interchangeable -- the compiler detects whether the pointer refers to an array or a single object and automatically selects the correct deallocation strategy at runtime through metadata stored in the allocation header",
      "new[] is deprecated in modern C++ in favor of std::vector and std::array -- the C++17 standard marks array-new as a legacy feature and all conforming compilers issue deprecation warnings when it is used",
      "new allocates a single object; new[] allocates an array. You MUST match them: delete for new, delete[] for new[]. Mixing them is undefined behavior because delete[] needs to know how many destructors to call",
    ],
    correctIndex: 3,
    explanation:
      "new[] stores the array size (typically before the returned pointer) so delete[] knows how many destructors to call. Using delete on a new[] pointer (or vice versa) corrupts this bookkeeping -- UB. In practice, almost always prefer std::vector or std::array over raw new[].",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 590,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What does std::make_unique do?",
    code: `auto p = std::make_unique<Widget>(42, "hello");\n// equivalent to:\n// std::unique_ptr<Widget> p(new Widget(42, \"hello\"));`,
    options: [
      "Takes an existing raw pointer and makes it unique by scanning all other smart pointers in the program and deleting any copies that reference the same address",
      "Creates a shared_ptr with a reference count of one, using a single allocation for both the control block and the object",
      "Creates a unique_ptr that points to an existing stack-allocated object without performing any heap allocation, transferring ownership of the local variable to the smart pointer",
      "Allocates an object with new and wraps it in a unique_ptr in one step",
    ],
    correctIndex: 3,
    explanation:
      "make_unique (C++14) forwards its arguments to the constructor and wraps the result in a unique_ptr. It's preferred over unique_ptr<T>(new T(...)) because: no chance of leak if another argument evaluation throws, it's shorter, and the new/delete are encapsulated. make_shared does the same for shared_ptr.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique.html",
  },
  {
    id: 591,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What happens when you use a pointer after the memory it points to has been freed?",
    code: `int* p = new int(42);\ndelete p;\nstd::cout << *p;  // What happens?`,
    options: [
      "Undefined behavior",
      "Prints 42 reliably",
      "Prints 0 -- the C++ standard requires that freed memory is zeroed out by the allocator before being returned to the free list, ensuring that sensitive data cannot be leaked through reuse of heap blocks",
      "Compilation error",
    ],
    correctIndex: 0,
    explanation:
      "After delete, the memory is returned to the allocator. The pointer still holds the old address (dangling pointer), but the memory may be reused for something else. Reading it may return garbage; writing it corrupts unrelated data. Set pointers to nullptr after delete, or better yet, use smart pointers.",
    link: "https://www.learncpp.com/cpp-tutorial/dangling-pointers/",
  },
  {
    id: 592,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What is the Rule of Zero and how does it relate to memory management?",
    options: [
      "If a class only uses RAII members (smart pointers, std::string, std::vector) that manage their own resources, the compiler-generated destructor, copy, and move operations do the right thing",
      "Never define any special member functions regardless of what resources the class manages",
      "Classes should have zero data members and rely entirely on free functions and global state for their behavior",
      "Never use dynamic memory allocation (new/delete) anywhere in the codebase",
    ],
    correctIndex: 0,
    explanation:
      "The Rule of Zero says: prefer classes that need no custom special members. Use string instead of char*, vector instead of new[], unique_ptr instead of raw pointers. The compiler-generated operations correctly compose the operations of each member. Only define the Big Five when you own a raw resource.",
    link: "https://en.cppreference.com/w/cpp/language/rule_of_three.html",
  },
  {
    id: 593,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What is the difference between std::unique_ptr and std::shared_ptr?",
    options: [
      "unique_ptr cannot be stored in standard library containers such as std::vector or std::map because containers require their elements to be copyable, and unique_ptr explicitly deletes its copy constructor and copy assignment operator",
      "unique_ptr is designed exclusively for single heap-allocated objects; shared_ptr is designed exclusively for dynamically allocated arrays",
      "unique_ptr has exclusive ownership. shared_ptr has shared ownership. Use unique_ptr by default; use shared_ptr only when multiple owners truly need shared lifetime management",
      "shared_ptr is always faster than unique_ptr due to its internal reference counting mechanism, which allows the runtime to batch deallocations and free multiple objects at once when the count drops to zero, amortizing the cost",
    ],
    correctIndex: 2,
    explanation:
      "unique_ptr is the same size as a raw pointer (zero overhead). shared_ptr adds a control block (reference counts, deleter) and atomic operations on copy/destroy. shared_ptr enables shared ownership but introduces overhead and potential cycles (break with weak_ptr). Default to unique_ptr -- use shared_ptr only when necessary.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 594,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What is std::weak_ptr and what problem does it solve?",
    code: `struct Node {\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev;  // break the cycle!\n};`,
    options: [
      "weak_ptr observes a shared_ptr-managed object without affecting the reference count. It breaks ownership cycles that would otherwise cause memory leaks. To use the object, call lock() to get a temporary shared_ptr",
      "weak_ptr prevents the managed object from being deleted by the shared_ptr control block",
      "A weak_ptr is a slower version of shared_ptr that trades performance for additional safety checks",
      "weak_ptr is simply a non-owning raw pointer wrapper with syntactic sugar",
    ],
    correctIndex: 0,
    explanation:
      "If A holds a shared_ptr to B and B holds a shared_ptr to A, neither's count ever reaches zero -- leak. Making one a weak_ptr breaks the cycle. weak_ptr::lock() returns a shared_ptr if the object is alive, or an empty shared_ptr if it's been destroyed. The weak count keeps the control block alive (not the object).",
    link: "https://en.cppreference.com/w/cpp/memory/weak_ptr.html",
  },
  {
    id: 595,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What is std::allocator and when would you write a custom one?",
    options: [
      "std::allocator is the default memory allocation strategy used by STL containers. Custom allocators let you control where memory comes from",
      "std::allocator is the garbage collector for C++",
      "Allocators only control memory alignment and padding between fields, not the actual allocation or deallocation of memory",
      "Custom allocators were possible in C++03 but the allocator model was completely removed from the standard in C++17 in favor of std::pmr, making direct allocator template customization impossible in modern conforming code",
    ],
    correctIndex: 0,
    explanation:
      "STL containers are parameterized by an allocator. The default (std::allocator<T>) calls new/delete. Custom allocators can use pre-allocated pools (O(1) allocation, zero fragmentation), thread-local arenas (no locking), or special memory (shared memory, GPU memory). Game engines commonly use pool and arena allocators.",
    link: "https://en.cppreference.com/w/cpp/memory/allocator.html",
  },
  {
    id: 596,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What does std::unique_ptr with a custom deleter look like?",
    code: `auto fileDeleter = [](FILE* f) { if (f) fclose(f); };\nstd::unique_ptr<FILE, decltype(fileDeleter)> file(\n    fopen("data.txt", "r"), fileDeleter\n);`,
    options: [
      "Custom deleters are not supported by unique_ptr because the deleter is hardcoded to operator delete",
      "The deleter must be a plain function pointer and cannot be a lambda, functor, or any other callable type",
      "You specify the deleter type as the second template argument. When the unique_ptr is destroyed, it calls your custom deleter instead of delete. This lets unique_ptr manage any resource",
      "Custom deleters fundamentally change unique_ptr's semantics to match shared_ptr",
    ],
    correctIndex: 2,
    explanation:
      "unique_ptr stores the deleter inline (zero overhead for stateless lambdas and function pointers). shared_ptr stores the deleter in the control block (type-erased, more flexible). Custom deleters extend RAII to any resource: fclose for FILE*, CloseHandle for Windows HANDLEs, SDL_DestroyWindow for SDL, etc.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 597,
    difficulty: "Hard",
    topic: "Memory Management",
    question: "What is an arena (bump) allocator and why is it used in games?",
    options: [
      "An allocator that compacts live objects by relocating them to eliminate memory gaps, updating all existing pointers via a forwarding table maintained in a side structure",
      "An allocator that reserves a large virtual address space using mmap or VirtualAlloc and commits physical pages on demand as allocations grow, trading TLB pressure and page fault overhead for the ability to grow allocations in place without copying data to a new location",
      "An allocator that uses alloca() to allocate all requested memory directly from the current function's stack frame, providing extremely fast allocation with automatic cleanup when the function returns but strictly limited to the calling thread's available stack size",
      "An arena allocator pre-allocates a large block and hands out memory by simply incrementing a pointer. Deallocation is all-at-once. It's extremely fast (O(1), no fragmentation, no per-object overhead) but can't free individual objects",
    ],
    correctIndex: 3,
    explanation:
      "Arena (bump/linear) allocators are the fastest possible: allocate = pointer += size. No free lists, no headers, no fragmentation. At the end of a frame (or scope), reset the pointer to the start -- all memory is freed at once. Game engines use per-frame arenas for temporary allocations (particles, AI decisions, render commands).",
    link: "https://en.cppreference.com/w/cpp/memory/memory_resource.html",
  },
  {
    id: 598,
    difficulty: "Hard",
    topic: "Memory Management",
    question: "What is memory fragmentation and how does it affect long-running programs?",
    options: [
      "Fragmentation actually improves cache performance because scattered allocations distribute data across more cache sets in the L1 and L2 caches, reducing conflict misses and ensuring that frequently accessed objects are less likely to evict each other from the same cache line, leading to higher hit rates overall",
      "Fragmentation only affects disk storage media and has no impact on RAM, because the CPU's memory management unit (MMU) provides virtual-to-physical page mapping that makes all allocations appear contiguous to the application regardless of their actual physical placement in DRAM",
      "Modern allocators like jemalloc, tcmalloc, and mimalloc have completely solved the fragmentation problem through slab allocation, per-thread local caches, and automatic size-class bucketing",
      "External fragmentation: free memory exists but is scattered in small non-contiguous blocks, so large allocations fail even though total free memory is sufficient. Internal fragmentation: allocated blocks are larger than needed. Both degrade performance and can cause allocation failures in long-running programs like game servers",
    ],
    correctIndex: 3,
    explanation:
      "After many alloc/free cycles of varying sizes, the heap becomes a patchwork of used and free blocks. A 1MB allocation may fail even with 10MB total free if no single contiguous block is large enough. Pool allocators (fixed-size blocks) eliminate external fragmentation. Arena allocators eliminate both kinds.",
    link: "https://en.cppreference.com/w/cpp/memory.html",
  },
  {
    id: 599,
    difficulty: "Hard",
    topic: "Memory Management",
    question: "How does std::pmr::polymorphic_allocator enable runtime allocator selection?",
    code: `char buffer[4096];\nstd::pmr::monotonic_buffer_resource pool(buffer, sizeof(buffer));\nstd::pmr::vector<int> v(&pool);  // allocates from stack buffer!`,
    options: [
      "It uses virtual dispatch on the allocator interface but still embeds the concrete memory resource type as a template parameter in the container, so pmr::vector<int, monotonic_buffer_resource> and pmr::vector<int, synchronized_pool_resource> remain entirely different types with incompatible ABIs and cannot be assigned to each other",
      "pmr only works with monotonic (arena-style) allocation because the polymorphic_allocator base class interface assumes that memory is never freed individually",
      "std::pmr uses a memory_resource base class with virtual allocate/deallocate. Containers use polymorphic_allocator which holds a pointer to a memory_resource. This allows changing allocation strategy at runtime without changing the container type",
      "pmr is a compile-time-only allocator model identical to std::allocator in its parameterization approach",
    ],
    correctIndex: 2,
    explanation:
      "Standard allocators are template parameters -- vector<int, PoolAlloc> and vector<int, ArenaAlloc> are different types. pmr uses type erasure: all pmr containers use polymorphic_allocator, which forwards to a memory_resource via virtual dispatch. This lets you swap allocators at runtime and store different-allocator containers in the same collection.",
    link: "https://en.cppreference.com/w/cpp/memory/polymorphic_allocator.html",
  },
  {
    id: 600,
    difficulty: "Hard",
    topic: "Memory Management",
    question: "What is the 'aliasing constructor' of shared_ptr?",
    code: `struct Model {\n    Mesh mesh;\n    Texture texture;\n};\n\nauto model = std::make_shared<Model>(...);\nstd::shared_ptr<Mesh> meshPtr(model, &model->mesh);`,
    options: [
      "The aliasing constructor creates a shared_ptr that shares ownership of the Model but points to a sub-object (mesh). The Model stays alive as long as meshPtr exists, even if the original model pointer is destroyed. The stored pointer and owned pointer are different",
      "It's a convenience alias for make_shared that co-allocates the sub-object on the heap in a single memory block alongside a new control block, similar to how make_shared combines the managed object and its control block into one allocation for cache efficiency",
      "It creates a separate shared_ptr that heap-allocates an independent copy of the member sub-object, giving the copy its own control block with an independent reference count completely unrelated to the parent object's ownership and lifetime management",
      "It creates a weak_ptr pointing to the member sub-object rather than the parent, allowing non-owning observation of just that member's lifetime independently of the parent object",
    ],
    correctIndex: 0,
    explanation:
      "The aliasing constructor takes (shared_ptr<Y> owner, T* stored). It shares the control block with owner (keeping the Model alive) but get() returns the stored pointer (&model->mesh). This lets you hand out shared_ptrs to sub-objects while keeping the parent alive -- no separate allocation needed.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/shared_ptr.html",
  },
  {
    id: 601,
    difficulty: "Hard",
    topic: "Memory Management",
    question: "What are the alignment requirements for dynamic memory and how does std::aligned_alloc help?",
    code: `// Need 64-byte aligned memory for SIMD / cache lines\nvoid* p = std::aligned_alloc(64, 1024);\n// ... use p for SIMD operations ...\nstd::free(p);`,
    options: [
      "Alignment only matters on embedded systems with no MMU",
      "aligned_alloc is a C-only function defined in the C11 standard header <stdlib.h> that is not available in C++",
      "new/malloc guarantee alignment to alignof(std::max_align_t). For stricter alignment, use aligned_alloc (C17), operator new(size, align) (C++17), or platform-specific functions. Misaligned SIMD access can crash or silently degrade performance",
      "All allocations from new and malloc are already aligned to any boundary the program might need, because modern operating system virtual memory managers map pages at 4096-byte boundaries and the heap allocator inherits this alignment guarantee for every individual allocation it returns",
    ],
    correctIndex: 2,
    explanation:
      "SIMD instructions (SSE, AVX, NEON) require specific alignment (16, 32, or 64 bytes). Default new gives alignof(max_align_t) which is often 16. C++17 added aligned new: operator new(size, std::align_val_t(64)). For classes with over-aligned members, use alignas(64) and C++17 will automatically use aligned allocation.",
    link: "https://en.cppreference.com/w/cpp/memory/c/aligned_alloc.html",
  },
  {
    id: 1002,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "Where is a local variable like `int x = 5;` stored during function execution?",
    options: [
      "On the stack frame of the function",
      "On the heap via dynamic allocation",
      "In the program's static storage area",
      "In the read-only code segment region",
    ],
    correctIndex: 0,
    explanation:
      "Local variables declared inside a function are allocated on the stack. They are automatically created when the function is called and destroyed when it returns. Heap memory is used for dynamic allocations made with `new`.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 1003,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What does the `new` operator do in C++?",
    code: `int* p = new int(42);`,
    options: [
      "Declares a pointer variable on the stack only",
      "Creates a reference to an existing local variable",
      "Allocates memory on the heap and returns a pointer",
      "Reserves memory on the stack and returns a pointer",
    ],
    correctIndex: 2,
    explanation:
      "The `new` operator allocates memory on the heap (free store) and returns a pointer to that memory. In this example, it allocates space for one `int`, initializes it to 42, and returns a pointer to it.",
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  {
    id: 1004,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What causes a memory leak in C++?",
    code: `void f() {
    int* p = new int(10);
    // function returns here
}`,
    options: [
      "Using a pointer after the memory is deleted",
      "Forgetting to call delete on heap-allocated memory",
      "Declaring too many local variables inside a function",
      "Assigning nullptr to a pointer variable before use",
    ],
    correctIndex: 1,
    explanation:
      "A memory leak occurs when heap-allocated memory is never freed with `delete`. In this code, `p` goes out of scope without `delete p;` being called, so the allocated integer is leaked and can never be reclaimed.",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 1005,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What should you set a pointer to after calling `delete` on it?",
    code: `int* p = new int(5);
delete p;
p = ???;`,
    options: [
      "Set it to the value 0 as an integer",
      "Set it to a new heap allocation",
      "Leave it unchanged to preserve the address",
      "Set it to nullptr to avoid dangling use",
    ],
    correctIndex: 3,
    explanation:
      "After `delete`, the pointer still holds the old address, making it a dangling pointer. Setting it to `nullptr` prevents accidental use of freed memory, since dereferencing `nullptr` is easier to detect and debug than using a dangling pointer.",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 1006,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What is a dangling pointer?",
    options: [
      "A pointer that refers to memory that has been freed",
      "A pointer that has been set to nullptr explicitly",
      "A pointer that was never assigned any valid address",
      "A pointer that points to a large allocated buffer",
    ],
    correctIndex: 0,
    explanation:
      "A dangling pointer is a pointer that still holds the address of memory that has already been deallocated with `delete`. Using a dangling pointer leads to undefined behavior because the memory it references is no longer valid.",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 1007,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "What does `sizeof(ptr)` return when `ptr` is an `int*` on a 64-bit system?",
    code: `int* ptr = new int[100];`,
    options: [
      "400 -- the total size of the array in bytes",
      "100 -- the number of elements in the array",
      "8 -- the size of the pointer itself in bytes",
      "4 -- the size of a single int element in bytes",
    ],
    correctIndex: 2,
    explanation:
      "The `sizeof` operator applied to a pointer returns the size of the pointer itself, not what it points to. On a 64-bit system, all pointers are typically 8 bytes regardless of the type they point to or the size of the allocated block.",
    link: "https://en.cppreference.com/w/cpp/language/sizeof",
  },
  {
    id: 1008,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "How should you deallocate memory created with `new int[10]`?",
    code: `int* arr = new int[10];`,
    options: [
      "Call free(arr) to release the array memory",
      "Call delete[] arr to release the entire array",
      "Call delete arr to release the first element only",
      "No action needed since arrays auto-deallocate",
    ],
    correctIndex: 1,
    explanation:
      "Memory allocated with `new[]` must be deallocated with `delete[]`. Using plain `delete` instead of `delete[]` on an array allocation causes undefined behavior. The bracket form ensures all elements are properly cleaned up.",
    link: "https://en.cppreference.com/w/cpp/language/delete",
  },
  {
    id: 1009,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What is the most common cause of a stack overflow error?",
    options: [
      "Allocating too many objects on the heap",
      "Forgetting to free dynamically allocated memory",
      "Using delete[] instead of delete on a pointer",
      "Infinite or very deep recursion without a base case",
    ],
    correctIndex: 3,
    explanation:
      "A stack overflow occurs when the call stack exceeds its fixed size limit. The most common cause is infinite or excessively deep recursion, where each recursive call adds a new stack frame. Very large local arrays can also contribute to stack overflow.",
    link: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/",
  },
  {
    id: 1010,
    difficulty: "Easy",
    topic: "Memory Management",
    question: "What does RAII stand for, and what is its core idea?",
    options: [
      "Resource Acquisition Is Initialization",
      "Runtime Allocation Is Immediate",
      "Reference Assignment Is Inherited",
      "Resource Access Is Indirect",
    ],
    correctIndex: 0,
    explanation:
      "RAII (Resource Acquisition Is Initialization) is a C++ idiom where resources such as memory, file handles, or locks are acquired in a constructor and released in the destructor. This ties resource lifetime to object scope, preventing leaks automatically.",
    link: "https://en.cppreference.com/w/cpp/language/raii",
  },
  {
    id: 1011,
    difficulty: "Easy",
    topic: "Memory Management",
    question:
      "What is the main advantage of using `std::unique_ptr` over a raw pointer?",
    code: `#include <memory>
std::unique_ptr<int> p = std::make_unique<int>(42);`,
    options: [
      "It allows multiple owners to share the same object",
      "It stores the pointer in static memory for faster access",
      "It automatically deletes the managed object when it goes out of scope",
      "It prevents the pointer from being dereferenced accidentally",
    ],
    correctIndex: 2,
    explanation:
      "`std::unique_ptr` is a smart pointer that owns and manages a heap object. When the `unique_ptr` goes out of scope, it automatically calls `delete` on the managed pointer, eliminating the risk of memory leaks without needing manual cleanup.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr",
  },
  {
    id: 1012,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "When is the managed object destroyed in this code?",
    code: `auto a = std::make_shared<Widget>();
auto b = a;
auto c = a;
b.reset();
c.reset();`,
    options: [
      "The Widget is destroyed when b.reset() is called because b was the most recent copy made",
      "The Widget is destroyed when c.reset() is called because a still holds one reference",
      "The Widget is destroyed when a goes out of scope because it is the last remaining shared_ptr",
      "The Widget is destroyed immediately after c.reset() because the reference count drops to zero",
    ],
    correctIndex: 2,
    explanation:
      "std::shared_ptr uses reference counting. After b.reset() and c.reset(), the count drops from 3 to 1. The object is destroyed only when the last shared_ptr (a) is destroyed or reset.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr.html",
  },
  {
    id: 1013,
    difficulty: "Medium",
    topic: "Memory Management",
    question:
      "What does calling lock() on a std::weak_ptr return when the managed object has already been destroyed?",
    options: [
      "It returns a shared_ptr whose get() method gives a dangling raw pointer to freed memory",
      "It throws a std::bad_weak_ptr exception to signal that the object no longer exists",
      "It returns an empty shared_ptr that evaluates to false in a boolean context check",
      "It returns a shared_ptr that owns a default-constructed replacement object of that type",
    ],
    correctIndex: 2,
    explanation:
      "weak_ptr::lock() returns an empty shared_ptr (equivalent to nullptr) if the managed object has been destroyed. This is how weak_ptr safely checks whether the object still exists without risking a dangling reference.",
    link: "https://en.cppreference.com/w/cpp/memory/weak_ptr/lock.html",
  },
  {
    id: 1014,
    difficulty: "Medium",
    topic: "Memory Management",
    question:
      "Why is std::make_unique preferred over using raw new inside a function call like f(std::unique_ptr<A>(new A), g())?",
    options: [
      "make_unique allocates the control block and object together in one allocation for efficiency",
      "make_unique guarantees exception safety because the allocation is wrapped before g() can throw",
      "make_unique allows the unique_ptr to be implicitly copied to another unique_ptr if needed",
      "make_unique uses placement new internally, which avoids calling the global allocator entirely",
    ],
    correctIndex: 1,
    explanation:
      "Before C++17, the compiler could evaluate new A, then g(), then construct the unique_ptr. If g() throws after new A but before the unique_ptr takes ownership, memory leaks. make_unique wraps the allocation safely.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique.html",
  },
  {
    id: 1015,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What happens when delete is called twice on the same raw pointer?",
    code: `int* p = new int(42);
delete p;
delete p;  // second delete`,
    options: [
      "The second delete is safely ignored because the runtime marks freed blocks as invalid",
      "It deallocates the next adjacent block on the heap and silently corrupts nearby allocations",
      "It throws a std::runtime_error exception that can be caught with a try-catch block here",
      "It causes undefined behavior",
    ],
    correctIndex: 3,
    explanation:
      "Double free is undefined behavior. The heap allocator's internal bookkeeping may be corrupted, leading to crashes, silent data corruption, or security vulnerabilities. Always set pointers to nullptr after delete or use smart pointers.",
    link: "https://en.cppreference.com/w/cpp/language/delete.html",
  },
  {
    id: 1016,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What does placement new do in this code?",
    code: `alignas(Widget) unsigned char buf[sizeof(Widget)];
Widget* w = new (buf) Widget(42);
// ... use w ...
w->~Widget();`,
    options: [
      "It allocates new heap memory at the address buf and copies the Widget data into that space",
      "It allocates aligned heap memory of size sizeof(Widget) and ignores the provided buffer buf",
      "It creates a temporary Widget on the stack and then moves it into the memory region at buf",
      "It constructs a Widget object in the pre-allocated buffer buf without allocating new memory",
    ],
    correctIndex: 3,
    explanation:
      "Placement new constructs an object at a specific memory address without performing any allocation. The programmer is responsible for ensuring proper alignment and calling the destructor manually when done.",
    link: "https://en.cppreference.com/w/cpp/language/new.html",
  },
  {
    id: 1017,
    difficulty: "Medium",
    topic: "Memory Management",
    question:
      "Why does memory alignment (as reported by alignof) matter for program performance?",
    options: [
      "Misaligned access causes a compile-time error on all platforms that support the alignof operator",
      "Aligned data lets the CPU load values in single bus transactions instead of multiple slow ones",
      "Alignment only matters for stack variables because heap allocations are always page-aligned",
      "The alignof operator is purely informational and has no effect on runtime data access speed",
    ],
    correctIndex: 1,
    explanation:
      "CPUs access memory most efficiently when data is aligned to its natural boundary. Misaligned access may require two memory bus transactions or cause hardware exceptions on some architectures, significantly hurting performance.",
    link: "https://en.cppreference.com/w/cpp/language/alignof.html",
  },
  {
    id: 1018,
    difficulty: "Medium",
    topic: "Memory Management",
    question:
      "What is the purpose of the custom deleter in this unique_ptr declaration?",
    code: `auto deleter = [](FILE* f) { if (f) fclose(f); };
std::unique_ptr<FILE, decltype(deleter)> file(
    fopen("log.txt", "w"), deleter
);`,
    options: [
      "The custom deleter calls fclose instead of delete so the FILE handle is properly released",
      "The custom deleter converts the FILE* to a shared_ptr so multiple owners can share the file",
      "The custom deleter flushes the write buffer and syncs data to disk before the pointer is reset",
      "The custom deleter is needed because unique_ptr cannot otherwise manage C-style struct types",
    ],
    correctIndex: 0,
    explanation:
      "By default, unique_ptr calls delete on destruction. For non-memory resources like FILE handles, a custom deleter ensures the correct cleanup function (fclose) is called instead of delete.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr.html",
  },
  {
    id: 1019,
    difficulty: "Medium",
    topic: "Memory Management",
    question: "What does std::move accomplish when transferring a unique_ptr?",
    code: `auto a = std::make_unique<Widget>(10);
auto b = std::move(a);
// What is the state of a now?`,
    options: [
      "a is now a null unique_ptr because ownership of the Widget was transferred entirely to b",
      "a and b both point to the same Widget object and share ownership of the managed resource",
      "a still owns the Widget but b holds a weak reference that does not affect the lifetime of it",
      "The code fails to compile because std::move is not defined for unique_ptr template types",
    ],
    correctIndex: 0,
    explanation:
      "std::move casts a to an rvalue reference, enabling the move constructor of unique_ptr. After the move, a is left in a valid but empty state (nullptr), and b now owns the Widget exclusively.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/unique_ptr.html",
  },
  {
    id: 1020,
    difficulty: "Medium",
    topic: "Memory Management",
    question:
      "What causes memory fragmentation and how do memory pools help reduce it?",
    options: [
      "Fragmentation is caused by stack overflows; pools help by moving all allocations to the heap",
      "Fragmentation is caused by using smart pointers; pools avoid it by using only raw new/delete",
      "Fragmentation only affects virtual memory pages; pools bypass this by using physical addresses",
      "Fragmentation occurs from repeated allocation and deallocation of varied sizes creating gaps",
    ],
    correctIndex: 3,
    explanation:
      "When objects of different sizes are allocated and freed over time, small gaps appear between live allocations. Memory pools pre-allocate fixed-size blocks, eliminating variable-size gaps and reducing fragmentation.",
    link: "https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/",
  },
  {
    id: 1021,
    difficulty: "Medium",
    topic: "Memory Management",
    question:
      "Which statement correctly describes a difference between operator new and malloc?",
    options: [
      "malloc calls the constructor and returns a typed pointer; operator new returns raw void*",
      "operator new throws std::bad_alloc on failure; malloc returns nullptr on allocation failure",
      "malloc is type-safe and throws exceptions on failure; operator new returns nullptr instead",
      "There is no meaningful difference because operator new is just a thin wrapper over malloc",
    ],
    correctIndex: 1,
    explanation:
      "operator new throws std::bad_alloc when allocation fails (unless the nothrow variant is used), while malloc returns nullptr. Additionally, new expressions call constructors after allocating memory, which malloc does not.",
    link: "https://en.cppreference.com/w/cpp/memory/new/operator_new.html",
  },
  {
    id: 1022,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "What does the control block of a std::shared_ptr typically contain, and where is it allocated?",
    code: `auto sp = std::make_shared<Widget>(42);
auto sp2 = sp;
auto wp = std::weak_ptr<Widget>(sp);
// How many control blocks exist?`,
    options: [
      "One heap-allocated block with strong count, weak count, and deleter",
      "One stack-allocated block with only the strong reference counter",
      "Two heap-allocated blocks",
      "One heap-allocated block with strong count only, no weak count",
    ],
    correctIndex: 0,
    explanation:
      "A shared_ptr's control block is a single heap-allocated object that stores the strong reference count, the weak reference count, and the deleter (plus optionally the allocator). make_shared allocates the control block and the managed object together in one allocation. Copying the shared_ptr and creating a weak_ptr all share the same control block.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr",
  },
  {
    id: 1023,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "What happens if a class calls shared_ptr<MyClass>(this) inside a member function without using enable_shared_from_this?",
    code: `struct Obj {
  std::shared_ptr<Obj> get_self() {
    return std::shared_ptr<Obj>(this);
  }
};
auto p = std::make_shared<Obj>();
auto q = p->get_self();`,
    options: [
      "It creates an alias pointer that shares the original control block",
      "The compiler rejects this with a static_assert at compile time",
      "It safely transfers ownership from the original shared_ptr to q",
      "A second independent control block is created, causing double delete",
    ],
    correctIndex: 3,
    explanation:
      "Constructing a shared_ptr directly from a raw this pointer creates a brand new control block, independent of the existing one from make_shared. Both control blocks believe they own the object, so when both reach zero references, the object is deleted twice -- undefined behavior. enable_shared_from_this solves this by letting the object find and share its existing control block.",
    link: "https://en.cppreference.com/w/cpp/memory/enable_shared_from_this",
  },
  {
    id: 1024,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "What is the role of std::pmr::polymorphic_allocator compared to a classic std::allocator?",
    code: `std::pmr::monotonic_buffer_resource pool;
std::pmr::vector<int> v(&pool);
v.push_back(1);
v.push_back(2);
// Where does v allocate its internal buffer?`,
    options: [
      "It uses type erasure to dispatch to a memory_resource at runtime",
      "It is a template parameter so each resource creates a new type",
      "It allocates using the default global new operator always",
      "It allocates exclusively from the stack using alloca internally",
    ],
    correctIndex: 0,
    explanation:
      "std::pmr::polymorphic_allocator uses type erasure so that containers with different memory resources share the same type. It dispatches allocation and deallocation calls to the memory_resource provided at construction time via virtual function calls. This avoids the classic problem where std::vector<int, A1> and std::vector<int, A2> are incompatible types.",
    link: "https://en.cppreference.com/w/cpp/memory/polymorphic_allocator",
  },
  {
    id: 1025,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Why does the STL use std::allocator_traits<Alloc> instead of calling allocator methods directly?",
    code: `template<typename Alloc>
void example(Alloc& a) {
  using Traits = std::allocator_traits<Alloc>;
  auto p = Traits::allocate(a, 1);
  Traits::construct(a, p, 42);
  Traits::destroy(a, p);
  Traits::deallocate(a, p, 1);
}`,
    options: [
      "It forces the allocator to be a polymorphic type with vtable",
      "It provides compile-time defaults so allocators need fewer members",
      "It converts allocator calls to use operator new under the hood",
      "It wraps allocators in shared_ptr for automatic lifetime tracking",
    ],
    correctIndex: 1,
    explanation:
      "allocator_traits provides sensible default implementations for methods that a custom allocator does not define. For example, if an allocator lacks construct(), allocator_traits provides a default using placement new. This means custom allocators only need to define allocate() and deallocate(), with traits supplying the rest -- greatly simplifying the allocator model.",
    link: "https://en.cppreference.com/w/cpp/memory/allocator_traits",
  },
  {
    id: 1026,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Is it legal to reuse the storage of a destroyed object by using placement new to create an object of a different type?",
    code: `alignas(double) unsigned char buf[sizeof(double)];
new (buf) int(42);
int* ip = std::launder(reinterpret_cast<int*>(buf));
*ip = 7;
// Now placement-new a double in the same storage:
new (buf) double(3.14);`,
    options: [
      "It is always undefined behavior to reuse storage for a new type",
      "It is legal only if the old object is trivially destructible first",
      "It is legal only when both types have identical size and alignment",
      "It is legal if storage is suitably aligned and the old lifetime ended",
    ],
    correctIndex: 3,
    explanation:
      "The C++ standard allows you to reuse storage for a different type as long as the storage is suitably aligned and sized, and the previous object's lifetime has ended (either via explicit destructor call or because it was trivially destructible). The original pointer cannot be used to access the new object without std::launder, however.",
    link: "https://en.cppreference.com/w/cpp/language/lifetime",
  },
  {
    id: 1027,
    difficulty: "Hard",
    topic: "Memory Management",
    question: "When is std::launder needed after placement new in existing storage?",
    code: `struct A { const int x; };
A* pa = new A{1};
pa->~A();
new (pa) A{2};
// Is pa->x guaranteed to be 2?`,
    options: [
      "std::launder is never needed because placement new updates the pointer",
      "std::launder is only needed for volatile-qualified members in the type",
      "std::launder is needed here because a const member was changed in place",
      "std::launder is needed only when the new object has a different type",
    ],
    correctIndex: 2,
    explanation:
      "When an object with const or reference members is destroyed and a new object is created at the same address via placement new, the compiler may assume const members have not changed and optimize reads using the old value. std::launder(pa)->x is required to tell the compiler it must re-read the value. Without it, pa->x may still yield 1 due to the compiler's const propagation optimization.",
    link: "https://en.cppreference.com/w/cpp/utility/launder",
  },
  {
    id: 1028,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "What does std::atomic<std::shared_ptr<T>> (C++20) provide over the deprecated atomic free functions for shared_ptr?",
    code: `std::atomic<std::shared_ptr<Config>> global_cfg;

void writer() {
  global_cfg.store(std::make_shared<Config>("v2"));
}
void reader() {
  auto snap = global_cfg.load();
  snap->use();
}`,
    options: [
      "It avoids heap allocation by storing the shared_ptr in atomic memory",
      "It makes the pointed-to Config object itself lock-free automatically",
      "It guarantees the pointed-to object is never destroyed during a read",
      "It provides a proper type with load/store/CAS, replacing the free API",
    ],
    correctIndex: 3,
    explanation:
      "C++20 introduced std::atomic<std::shared_ptr<T>> as a proper specialization that wraps a shared_ptr with atomic load, store, compare_exchange_weak, and compare_exchange_strong member functions. This replaces the older free functions (std::atomic_load, std::atomic_store for shared_ptr) which were deprecated in C++20. It does not make the pointee lock-free or prevent normal shared_ptr destruction semantics.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/atomic2",
  },
  {
    id: 1029,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "Does the default operator new in C++ act as a memory barrier with respect to other threads?",
    code: `int* data = nullptr;
std::atomic<bool> ready{false};

// Thread 1:
data = new int(42);
ready.store(true, std::memory_order_release);

// Thread 2:
if (ready.load(std::memory_order_acquire))
  assert(*data == 42);`,
    options: [
      "new is a full sequential barrier so the atomic is not needed here",
      "new provides acquire-release ordering on all mainstream platforms",
      "new has no ordering guarantees",
      "new provides release semantics only and a matching acquire is needed",
    ],
    correctIndex: 2,
    explanation:
      "The C++ standard does not specify any memory ordering guarantees for operator new itself. The allocation may involve internal synchronization (e.g., a mutex in the allocator), but this does not create happens-before relationships for user data. In the example, the atomic store with memory_order_release and the atomic load with memory_order_acquire are what establish the correct ordering so that Thread 2 sees the value 42.",
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  {
    id: 1030,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "How does the Small Buffer Optimization (SBO) in std::string avoid heap allocation for short strings?",
    code: `std::string s1 = "Hi";        // short
std::string s2 = std::string(100, 'x'); // long
std::cout << sizeof(s1) << " "
          << sizeof(s2) << '\n';
// Both print the same sizeof -- why?`,
    options: [
      "The compiler places short strings in static storage at compile time",
      "It stores short strings in the string object's own internal buffer",
      "It uses a global arena allocator shared by all short string objects",
      "It uses mmap to map short strings into a read-only memory page area",
    ],
    correctIndex: 1,
    explanation:
      "With SBO, the std::string object itself contains a small inline buffer (commonly 15-22 bytes depending on the implementation). Strings that fit within this buffer are stored directly inside the string object on the stack, avoiding any heap allocation. Longer strings trigger a heap allocation. Because sizeof measures the object layout, it is the same regardless of whether the string is short or long.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring/",
  },
  {
    id: 1031,
    difficulty: "Hard",
    topic: "Memory Management",
    question:
      "When would std::unique_ptr<T[]> be preferred over std::vector<T> for owning a dynamic array?",
    code: `// Option A:
auto arr = std::make_unique<int[]>(1'000'000);

// Option B:
std::vector<int> vec(1'000'000);

// What is a key advantage of Option A?`,
    options: [
      "unique_ptr<T[]> has a fixed size with no capacity/size overhead cost",
      "unique_ptr<T[]> supports push_back and resize unlike std::vector",
      "unique_ptr<T[]> is faster to iterate because it has no indirection",
      "unique_ptr<T[]> automatically initializes elements but vector cannot",
    ],
    correctIndex: 0,
    explanation:
      "std::unique_ptr<T[]> stores only a pointer (and optionally a deleter), whereas std::vector stores a pointer plus size and capacity fields. When you need a fixed-size dynamic array and will never resize, unique_ptr<T[]> has lower per-object overhead. Both support element access via operator[], but unique_ptr<T[]> lacks push_back, resize, and iterators that vector provides.",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr",
  },
];
