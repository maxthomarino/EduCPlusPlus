import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 18,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::mutex protect against?",
    options: [
      "Data races on shared mutable state",
      "Memory leaks from heap allocations",
      "Stack overflow from deep recursion",
      "Deadlocks between competing threads",
    ],
    correctIndex: 0,
    explanation:
      "A mutex ensures mutual exclusion: only one thread can hold the lock at a time, preventing concurrent reads and writes that would cause a data race.",
    link: "https://en.cppreference.com/w/cpp/thread/mutex.html",
  },
  {
    id: 19,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "What advantage does std::scoped_lock (C++17) have over std::lock_guard?",
    options: [
      "It is faster due to reduced locking overhead per acquisition",
      "It bypasses RAII and allows manual lock/unlock control flow",
      "It can lock multiple mutexes simultaneously without deadlock",
      "It supports recursive locking on the same mutex from one thread",
    ],
    correctIndex: 2,
    explanation:
      "scoped_lock accepts multiple mutexes and uses a deadlock-avoidance algorithm to lock them all safely. lock_guard only locks a single mutex.",
    link: "https://en.cppreference.com/w/cpp/thread/scoped_lock.html",
  },
  {
    id: 20,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "For incrementing a shared integer counter across threads, which approach is preferred?",
    options: [
      "No synchronization needed for built-in types",
      "std::atomic<int>",
      "volatile int",
      "std::mutex with std::lock_guard",
    ],
    correctIndex: 1,
    explanation:
      "For simple read-modify-write operations on a single variable, atomics are more efficient than a mutex. volatile does NOT provide atomicity or memory ordering guarantees in C++.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic.html",
  },
  {
    id: 52,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "Why does std::atomic::compare_exchange_weak sometimes fail even when the current value equals the expected value?",
    options: [
      "It always fails the first time as a safety measure to prevent ABA problems",
      "On LL/SC architectures (like ARM), the exclusive monitor can be lost spuriously",
      "It checks type identity rather than value equality, rejecting matching copies",
      "It has a built-in random failure rate to stress-test lock-free code paths",
    ],
    correctIndex: 1,
    explanation:
      "ARM uses Load-Linked/Store-Conditional instead of x86's single compare-and-swap instruction. Context switches or cache evictions can clear the exclusive monitor, causing a spurious failure. Use it in a loop, or use compare_exchange_strong.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange.html",
  },
  {
    id: 53,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "Thread A stores a flag with memory_order_relaxed. Thread B loads the flag with memory_order_relaxed and sees the new value. Can Thread B safely read other data that Thread A wrote before the flag?",
    options: [
      "No -- relaxed provides no ordering guarantees beyond atomicity",
      "Yes -- all atomic operations are sequentially consistent",
      "No -- relaxed stores are never visible to other threads",
      "Yes -- seeing the flag guarantees visibility of prior writes",
    ],
    correctIndex: 0,
    explanation:
      "memory_order_relaxed only guarantees that the atomic operation itself is indivisible. It does not establish any happens-before relationship. Use memory_order_release (store) and memory_order_acquire (load) for producer-consumer synchronization.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order.html",
  },
  {
    id: 68,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "On x86-64, how does std::atomic<int>::fetch_add(1) typically execute at the hardware level?",
    options: [
      "It acquires a kernel mutex, increments, then releases",
      "It uses a compare-and-swap loop in software",
      "It disables interrupts on the CPU core during the increment",
      "It uses a single LOCK XADD instruction",
    ],
    correctIndex: 3,
    explanation:
      "On x86-64, atomic read-modify-write operations for small types map directly to hardware instructions with the LOCK prefix, which locks the cache line. There are no system calls, no kernel transitions, and no OS-level mutexes.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic/fetch_add.html",
  },
  {
    id: 542,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "How do you create and run a thread in C++?",
    code: `void work() { std::cout << "Hello from thread\\n"; }\n\nstd::thread t(work);\nt.join();  // wait for it to finish`,
    options: [
      "std::thread takes a callable and starts executing it immediately in a new thread. join() blocks until the thread completes",
      "Threads are started by calling t.start() after constructing the thread object. The constructor only allocates the thread handle but does not begin execution until start is invoked",
      "std::thread only works with lambdas",
      "You must use OS-specific APIs like pthread_create on Linux or CreateThread on Windows, because the C++ standard library provides no portable threading abstraction",
    ],
    correctIndex: 0,
    explanation:
      "std::thread's constructor launches a new OS thread that immediately begins executing the callable. join() blocks the calling thread until the worker finishes. If you destroy a joinable thread without join() or detach(), std::terminate() is called.",
    link: "https://en.cppreference.com/w/cpp/thread/thread.html",
  },
  {
    id: 543,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What is a data race?",
    code: `int counter = 0;\n\nvoid increment() {\n    for (int i = 0; i < 1000; ++i)\n        ++counter;  // unsynchronized!\n}\n\nstd::thread t1(increment), t2(increment);\nt1.join(); t2.join();\n// counter may NOT be 2000`,
    options: [
      "When two or more threads access the same memory location concurrently, at least one is a write, and there is no synchronization",
      "When two threads try to create the same file on disk simultaneously. The filesystem serializes the creates, so one succeeds and the other fails with an error code from the OS",
      "When two threads run at different speeds due to differences in their workload or CPU scheduling priority. This speed mismatch is harmless and does not cause incorrect behavior",
      "When a thread reads data before it's initialized by the creating thread. This only happens with global and static variables, not with stack-allocated locals passed by reference",
    ],
    correctIndex: 0,
    explanation:
      "A data race is UB in C++. The compiler and CPU may reorder operations, cache values in registers, or perform partial writes. Even simple ++counter is not atomic -- it's a read-modify-write sequence that can interleave. Use mutexes or atomics to prevent data races.",
    link: "https://en.cppreference.com/w/cpp/language/memory_model.html",
  },
  {
    id: 544,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::mutex do?",
    code: `std::mutex mtx;\nint shared = 0;\n\nvoid safeIncrement() {\n    mtx.lock();\n    ++shared;\n    mtx.unlock();\n}`,
    options: [
      "It prevents threads from being created by locking a global thread-creation semaphore, ensuring only the main thread runs until the mutex is explicitly released",
      "It provides mutual exclusion",
      "It creates a copy of the data for each thread that accesses the mutex, giving every thread its own private replica of the shared state to work with independently",
      "It makes a variable atomic by applying hardware-level locking to every read and write operation on that variable, ensuring indivisible access from any thread",
    ],
    correctIndex: 1,
    explanation:
      "A mutex (mutual exclusion) serializes access to a shared resource. Only one thread can hold the lock at a time. However, always prefer std::lock_guard or std::unique_lock over manual lock()/unlock() to ensure the mutex is released even if an exception is thrown.",
    link: "https://en.cppreference.com/w/cpp/thread/mutex.html",
  },
  {
    id: 545,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "Why should you use std::lock_guard instead of manually calling lock()/unlock()?",
    code: `std::mutex mtx;\n\nvoid safe() {\n    std::lock_guard<std::mutex> guard(mtx);\n    // mtx is locked here\n    doWork();  // even if this throws...\n}  // guard's destructor unlocks mtx`,
    options: [
      "lock_guard is faster than manual locking because the compiler optimizes the RAII wrapper into a single atomic instruction that acquires and releases the mutex with no overhead",
      "lock_guard allows multiple threads to hold the lock simultaneously by internally tracking a reference count. Each constructor call increments the count and each destructor decrements it",
      "There is no difference",
      "lock_guard uses RAII",
    ],
    correctIndex: 3,
    explanation:
      "Manual lock()/unlock() is error-prone: if an exception is thrown between them, the mutex stays locked forever (deadlock). lock_guard's destructor always runs, ensuring the mutex is released. C++17's std::scoped_lock is even better -- it can lock multiple mutexes atomically.",
    link: "https://en.cppreference.com/w/cpp/thread/lock_guard.html",
  },
  {
    id: 546,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does thread::join() vs thread::detach() do?",
    options: [
      "detach() is deprecated in C++20 and replaced by std::jthread, which automatically joins on destruction. Using detach triggers a compiler warning on conforming implementations because it is scheduled for removal",
      "join() kills the thread immediately by sending it a termination signal and releasing all resources. The calling thread resumes execution as soon as the signal is delivered to the target thread",
      "join() blocks until the thread finishes, then cleans up. detach() lets the thread run independently",
      "Both do the same thing but at different times",
    ],
    correctIndex: 2,
    explanation:
      "join() synchronizes: the calling thread waits for the worker to complete. detach() makes the thread a daemon -- it runs in the background until it finishes or the program exits. A detached thread accessing local variables from the launching scope is dangerous if that scope has ended.",
    link: "https://en.cppreference.com/w/cpp/thread/thread/join.html",
  },
  {
    id: 547,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What does std::condition_variable do and why does it need a mutex?",
    code: `std::mutex mtx;\nstd::condition_variable cv;\nbool ready = false;\n\n// Consumer\nstd::unique_lock<std::mutex> lock(mtx);\ncv.wait(lock, [&]{ return ready; });\n// proceed...\n\n// Producer\n{\n    std::lock_guard<std::mutex> g(mtx);\n    ready = true;\n}\ncv.notify_one();`,
    options: [
      "It's a timer that wakes threads at intervals specified by a duration argument. The condition variable fires periodic signals to sleeping threads based on the configured timeout, enabling regular polling of shared state",
      "It locks two mutexes simultaneously using a deadlock-avoidance algorithm that acquires both locks in a consistent global order. The condition variable internally manages the lock ordering to prevent circular wait conditions",
      "It allows a thread to sleep until notified by another thread. It needs a mutex to protect the shared predicate (ready) from data races and to handle spurious wakeups via the predicate lambda",
      "It replaces the mutex entirely by providing a lock-free synchronization mechanism based on atomic spinning. Threads busy-wait on an atomic flag instead of blocking, which avoids the overhead of kernel transitions",
    ],
    correctIndex: 2,
    explanation:
      "condition_variable provides efficient waiting. wait() atomically unlocks the mutex and sleeps. When notified, it re-acquires the lock and checks the predicate. The predicate is essential because spurious wakeups can occur -- the thread may wake without notify being called.",
    link: "https://en.cppreference.com/w/cpp/thread/condition_variable.html",
  },
  {
    id: 548,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What is std::async and how does it relate to std::future?",
    code: `auto fut = std::async(std::launch::async, []() {\n    return expensiveComputation();\n});\n// ... do other work ...\nint result = fut.get();  // blocks until ready`,
    options: [
      "async is an alias for std::thread",
      "std::future is a thread-safe container like vector that stores multiple values pushed by producer threads. Consumers pop values from the front while producers append to the back, forming a concurrent queue",
      "std::async runs a callable potentially in a new thread and returns a std::future that holds the result. fut.get() blocks until the result is available. If the callable threw, get() rethrows the exception",
      "std::async always runs synchronously in the calling thread, executing the callable inline before returning the future. The function blocks until the computation completes and stores the result in the returned future",
    ],
    correctIndex: 2,
    explanation:
      "std::async abstracts thread management. launch::async forces a new thread. launch::deferred delays execution until get() is called (lazy evaluation). The future stores the result (or exception). This is simpler than manual thread + shared state, but gives less control than a thread pool.",
    link: "https://en.cppreference.com/w/cpp/thread/async.html",
  },
  {
    id: 549,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What is a deadlock and how does this code cause one?",
    code: `std::mutex m1, m2;\n\n// Thread A\nm1.lock();\nm2.lock();  // waits for m2\n\n// Thread B\nm2.lock();\nm1.lock();  // waits for m1`,
    options: [
      "The OS automatically detects and resolves this by breaking the deadlock cycle and forcing one thread to release its mutex. The kernel's deadlock detector runs periodically and selects a victim thread to abort when a cycle is found",
      "Both threads are waiting for the other's mutex, and neither can make progress",
      "Only one thread will deadlock; the other will proceed normally because the OS scheduler detects the conflict and preempts the blocked thread. The surviving thread runs to completion and releases both mutexes, unblocking the other",
      "This doesn't cause a deadlock",
    ],
    correctIndex: 1,
    explanation:
      "Thread A holds m1, waits for m2. Thread B holds m2, waits for m1. Neither can proceed -- classic deadlock. Solutions: consistent lock ordering, std::scoped_lock (uses a deadlock-avoidance algorithm), or std::lock() which locks multiple mutexes atomically without deadlock.",
    link: "https://en.cppreference.com/w/cpp/thread/scoped_lock.html",
  },
  {
    id: 550,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What does std::atomic provide over a regular variable?",
    code: `std::atomic<int> counter{0};\n\nvoid increment() {\n    for (int i = 0; i < 1000; ++i)\n        ++counter;  // atomic read-modify-write\n}`,
    options: [
      "Atomic operations are guaranteed to be indivisible",
      "Atomic variables prevent deadlocks by eliminating the need for mutexes entirely. Any shared data declared atomic is guaranteed to be free from deadlock, livelock, and priority inversion conditions",
      "Atomic variables are allocated in special hardware memory regions that support lock-free concurrent access. The runtime maps atomic objects into dedicated SRAM banks on the CPU die for faster access",
      "Atomic variables are just faster than regular variables because the compiler aligns them to cache-line boundaries and uses hardware prefetch hints to minimize memory latency on read-heavy workloads",
    ],
    correctIndex: 0,
    explanation:
      "std::atomic ensures operations like ++, --, load, store, and compare_exchange are indivisible and establish happens-before relationships. On x86, many atomic ops compile to a single instruction with a lock prefix. Atomics are faster than mutexes for simple operations but can't protect multi-step transactions.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic.html",
  },
  {
    id: 551,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What is the difference between std::unique_lock and std::lock_guard?",
    options: [
      "They are identical in functionality and performance",
      "lock_guard can lock multiple mutexes simultaneously using a deadlock-avoidance algorithm; unique_lock is limited to a single mutex and must be used with std::lock() for multi-mutex scenarios. scoped_lock was added to bring multi-lock support to RAII",
      "unique_lock is faster because it replaces the mutex's kernel-level synchronization with lock-free atomic operations internally, avoiding system calls on the fast path. The implementation uses a compare-and-swap loop instead of a kernel futex",
      "lock_guard is simpler",
    ],
    correctIndex: 3,
    explanation:
      "Use lock_guard for simple scoped locking. Use unique_lock when you need: deferred locking (std::defer_lock), manual unlock/relock (for condition variables or reducing lock scope), or transferring lock ownership. unique_lock has slight overhead from tracking the lock state.",
    link: "https://en.cppreference.com/w/cpp/thread/unique_lock.html",
  },
  {
    id: 552,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What are memory orderings and why does std::memory_order_relaxed exist?",
    code: `std::atomic<bool> flag{false};\nstd::atomic<int> data{0};\n\n// Thread A\ndata.store(42, std::memory_order_relaxed);\nflag.store(true, std::memory_order_release);\n\n// Thread B\nwhile (!flag.load(std::memory_order_acquire));\nint value = data.load(std::memory_order_relaxed);  // guaranteed 42`,
    options: [
      "Memory orderings control how atomic operations synchronize with other memory accesses. relaxed: only atomicity, no ordering. acquire/release: one-directional fence. seq_cst (default): total global order. Weaker orderings give better performance on ARM/POWER",
      "All orderings produce identical machine code on every architecture because the compiler always emits the strongest fence instructions regardless of the ordering parameter you specify. The memory order enum exists only for documentation purposes and has no effect on code",
      "relaxed means the atomic operation may not complete if the cache line is contended",
      "Memory orderings are irrelevant on modern CPUs because all mainstream architectures guarantee sequential consistency by default at the hardware level, making software fences redundant. The hardware memory model prevents all reordering",
    ],
    correctIndex: 0,
    explanation:
      "CPUs and compilers reorder memory operations for performance. Memory orderings constrain this reordering. relaxed is cheapest -- just atomicity. acquire/release create a happens-before edge (Thread A's writes before release are visible to Thread B after acquire). seq_cst is strongest but slowest (global total order). On x86, acquire/release are free; on ARM they require barrier instructions.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order.html",
  },
  {
    id: 553,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What is false sharing and how does it hurt performance?",
    code: `struct Counters {\n    alignas(64) int countA = 0;  // fixed\n    alignas(64) int countB = 0;  // fixed\n};`,
    options: [
      "When a thread reads stale data from a CPU register because the compiler cached a shared variable in a register instead of reloading it from memory",
      "When two threads share data that should be kept private to each thread",
      "When two threads modify different variables that happen to be on the same CPU cache line. Each write invalidates the entire cache line for the other core, causing constant cache-line bouncing despite no actual data sharing. Fix: align to cache-line boundaries with alignas(64)",
      "When two threads perform concurrent reads on the same shared data structure",
    ],
    correctIndex: 2,
    explanation:
      "CPUs operate on cache lines (64 bytes), not individual bytes. If countA and countB are in the same cache line, a write to countA by Core 1 invalidates Core 2's copy -- even though Core 2 only uses countB. This 'ping-pong' effect can reduce performance by 10-50x. alignas(64) or padding separates them onto different cache lines.",
    link: "https://en.cppreference.com/w/cpp/thread.html",
  },
  {
    id: 554,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What is std::atomic::compare_exchange_weak and why is there a 'weak' version?",
    code: `std::atomic<int> val{0};\nint expected = 0;\nval.compare_exchange_weak(expected, 1);`,
    options: [
      "weak is deprecated since C++20 because modern hardware provides native CAS instructions on all major architectures, making the spurious-failure distinction unnecessary",
      "weak only works with integral types because it relies on hardware CAS instructions that operate on register-sized values, while strong also supports pointer and floating-point types by emulating compare-exchange with a mutex-protected load-store sequence",
      "weak skips the comparison step entirely and performs an unconditional store, making it faster than strong but only correct when you don't care about the previous value. The operation writes the desired value without reading or comparing the current value in the atomic",
      "compare_exchange_weak may spuriously fail on architectures with LL/SC (like ARM). It's meant for loops where you retry anyway. compare_exchange_strong guarantees no spurious failure but may be slower on those architectures",
    ],
    correctIndex: 3,
    explanation:
      "On LL/SC architectures (ARM, POWER), CAS is implemented with load-linked/store-conditional pairs that can spuriously fail if the cache line was evicted. The weak version exposes this -- it's cheaper in a retry loop (which you usually need anyway). On x86, both versions compile to the same CMPXCHG instruction.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange.html",
  },
  {
    id: 555,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What is the difference between std::shared_mutex and std::mutex?",
    code: `std::shared_mutex rw;\n\nvoid reader() {\n    std::shared_lock lock(rw);  // multiple readers OK\n    readData();\n}\n\nvoid writer() {\n    std::unique_lock lock(rw);  // exclusive access\n    writeData();\n}`,
    options: [
      "shared_mutex is a mutex shared across processes via a memory-mapped region in the operating system's shared memory segment. It enables inter-process synchronization by mapping the mutex state into a page visible to all participating processes on the machine",
      "shared_mutex allows multiple threads to hold the lock simultaneously without distinguishing between read and write access. All threads acquire the same lock type, and the mutex simply counts the number of holders to enforce a configurable concurrency limit",
      "shared_mutex is faster than mutex in all cases because it uses atomic spinlocks internally instead of kernel-level synchronization. The shared variant avoids system calls by spinning in user space, reducing latency for both shared and exclusive lock acquisitions",
      "shared_mutex supports two lock modes: shared (read) and exclusive (write). Multiple readers can hold shared locks concurrently, but a writer needs exclusive access",
    ],
    correctIndex: 3,
    explanation:
      "In read-heavy workloads, a regular mutex serializes all access. shared_mutex allows concurrent reads. A writer must wait for all readers to release, then blocks new readers. This improves throughput when reads vastly outnumber writes. Overhead: shared_mutex is heavier than regular mutex for write-heavy workloads.",
    link: "https://en.cppreference.com/w/cpp/thread/shared_mutex.html",
  },
  {
    id: 556,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What problem does std::call_once solve?",
    code: `std::once_flag initFlag;\nConnection* conn = nullptr;\n\nvoid ensureConnected() {\n    std::call_once(initFlag, []() {\n        conn = new Connection("db://localhost");\n    });\n    conn->query(...);\n}`,
    options: [
      "It guarantees that the callable executes exactly once across all threads, even under concurrent calls. All other threads block until the initialization completes. If the callable throws, another thread gets to retry",
      "It calls a function exactly once per thread by associating the once_flag with the calling thread's ID. Each thread maintains its own flag state, so the callable executes independently in every thread that invokes call_once",
      "It registers a callback for program exit by appending the callable to the global atexit handler list. The once_flag ensures the callback is registered only once, and the callable executes during static object destruction at program termination",
      "It's a faster version of std::async that skips the overhead of creating a std::future object. The call_once mechanism launches the callable on a background thread without returning a handle, reducing synchronization costs compared to async",
    ],
    correctIndex: 0,
    explanation:
      "std::call_once provides thread-safe one-time initialization without the overhead of locking on every subsequent call. After the first successful execution, future calls are essentially free (just a flag check). If the callable throws, the flag remains unset and another thread's call will retry.",
    link: "https://en.cppreference.com/w/cpp/thread/call_once.html",
  },
  {
    id: 1332,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::thread represent in C++?",
    options: [
      "A lightweight process with its own separate virtual memory space and file descriptor table",
      "A single thread of execution that runs a callable object concurrently with other threads",
      "A coroutine that can be suspended and resumed at specific yield points in the function",
      "A task queue that schedules work items for execution on a shared pool of worker threads",
    ],
    correctIndex: 1,
    explanation:
      "std::thread represents a single thread of execution. It takes a callable (function, lambda, or functor) and runs it concurrently with the calling thread. Each std::thread manages an OS-level thread.",
    link: "https://en.cppreference.com/w/cpp/thread/thread",
  },
  {
    id: 1333,
    difficulty: "Easy",
    topic: "Multithreading",
    question:
      "What happens if a std::thread object is destroyed without calling join() or detach()?",
    options: [
      "The thread continues running silently in the background until the main function returns",
      "The thread is automatically joined and the destructor waits for the thread to finish first",
      "The thread is automatically detached and continues running independently of the main thread",
      "The destructor calls std::terminate which aborts the entire program with an error message",
    ],
    correctIndex: 3,
    explanation:
      "If a joinable std::thread is destroyed without being joined or detached, the destructor calls std::terminate(), crashing the program. This design forces you to explicitly decide whether to wait for or abandon the thread.",
    link: "https://en.cppreference.com/w/cpp/thread/thread/~thread",
  },
  {
    id: 1334,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What is the difference between join() and detach() on a std::thread?",
    options: [
      "join() blocks until the thread finishes while detach() lets the thread run independently",
      "join() starts the thread running while detach() pauses the thread until it is resumed later",
      "join() combines two threads into one while detach() splits one thread into two new threads",
      "join() shares data between threads while detach() copies data to prevent shared access issues",
    ],
    correctIndex: 0,
    explanation:
      "join() causes the calling thread to block and wait until the target thread completes execution. detach() separates the thread from the std::thread object, allowing it to continue running independently. After detaching, you can no longer join or query the thread.",
    link: "https://en.cppreference.com/w/cpp/thread/thread/join",
  },
  {
    id: 1335,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What is a data race in C++ multithreaded programming?",
    options: [
      "It is a performance issue where threads compete for CPU time and slow each other down",
      "It is a compiler error that occurs when two threads include the same header file simultaneously",
      "It is undefined behavior when two threads access shared data and at least one thread writes",
      "It is a deadlock situation where two threads wait for each other to release their mutex locks",
    ],
    correctIndex: 2,
    explanation:
      "A data race occurs when two or more threads access the same memory location concurrently, at least one access is a write, and there is no synchronization between them. Data races cause undefined behavior in C++.",
    link: "https://en.cppreference.com/w/cpp/language/memory_model#Threads_and_data_races",
  },
  {
    id: 1336,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::lock_guard do when constructed with a mutex?",
    options: [
      "It tries to lock the mutex and returns immediately with a boolean indicating success or failure",
      "It locks the mutex immediately and automatically unlocks it when the guard goes out of scope",
      "It creates a copy of the mutex so that multiple threads can each have their own lock instance",
      "It registers the mutex with a global manager that prevents deadlocks across all program threads",
    ],
    correctIndex: 1,
    explanation:
      "std::lock_guard is an RAII wrapper that locks a mutex in its constructor and unlocks it in its destructor. This ensures the mutex is always released, even if an exception is thrown within the protected scope.",
    link: "https://en.cppreference.com/w/cpp/thread/lock_guard",
  },
  {
    id: 1337,
    difficulty: "Easy",
    topic: "Multithreading",
    question:
      "What does the volatile keyword guarantee about multithreaded access in C++?",
    options: [
      "It provides no thread safety guarantees and does not prevent data races between threads",
      "It makes all reads and writes to the variable atomic and visible to all threads immediately",
      "It prevents the compiler from reordering operations so threads always see consistent values",
      "It creates a memory barrier that synchronizes the variable across all processor cache lines",
    ],
    correctIndex: 0,
    explanation:
      "In C++, volatile prevents the compiler from optimizing away reads and writes, but it provides no atomicity, ordering, or visibility guarantees for multithreaded access. For thread safety, use std::atomic or mutexes.",
    link: "https://en.cppreference.com/w/cpp/language/cv",
  },
  {
    id: 1338,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::async do in C++?",
    options: [
      "It creates a raw OS thread that must be manually joined or detached by the calling code",
      "It sends a network request asynchronously and returns the response body as a string value",
      "It schedules a function for execution on the GPU using the available compute shader pipeline",
      "It launches a function potentially on another thread and returns a future to retrieve the result",
    ],
    correctIndex: 3,
    explanation:
      "std::async runs a callable asynchronously, potentially on a new thread, and returns a std::future that will hold the result. The launch policy can be std::launch::async (new thread) or std::launch::deferred (lazy evaluation on get()).",
    link: "https://en.cppreference.com/w/cpp/thread/async",
  },
  {
    id: 1339,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What does std::future represent in C++ concurrency?",
    options: [
      "It represents a thread pool that manages and reuses threads for submitted tasks automatically",
      "It represents a timer that fires a callback function after a specified duration has elapsed",
      "It represents a value that will become available at some point from an asynchronous operation",
      "It represents a lock-free queue that multiple producer and consumer threads can use safely",
    ],
    correctIndex: 2,
    explanation:
      "std::future provides a mechanism to access the result of an asynchronous operation. Calling get() on a future blocks until the result is available. It works with std::async, std::promise, and std::packaged_task.",
    link: "https://en.cppreference.com/w/cpp/thread/future",
  },
  {
    id: 1340,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What is a deadlock in concurrent programming?",
    options: [
      "It is when a thread consumes all available memory and prevents other threads from allocating",
      "It is when two or more threads are each waiting for the other to release a resource they need",
      "It is when a thread runs an infinite loop and never yields execution time to other threads",
      "It is when the operating system kills a thread that has exceeded its maximum execution time",
    ],
    correctIndex: 1,
    explanation:
      "A deadlock occurs when two or more threads are blocked indefinitely, each holding a resource that another thread needs while waiting for a resource held by the other. Classic prevention strategies include always acquiring locks in a consistent order.",
    link: "https://en.wikipedia.org/wiki/Deadlock",
  },
  {
    id: 1341,
    difficulty: "Easy",
    topic: "Multithreading",
    question: "What header must be included to use std::thread in C++?",
    options: [
      "The <thread> header provides the std::thread class and related thread management utilities",
      "The <mutex> header provides the std::thread class along with all synchronization primitives",
      "The <future> header provides the std::thread class and the asynchronous execution facilities",
      "The <atomic> header provides the std::thread class together with lock-free data structures",
    ],
    correctIndex: 0,
    explanation:
      "std::thread is declared in the <thread> header. Other threading facilities are in separate headers: <mutex> for mutexes and locks, <future> for async and futures, <atomic> for atomic types, and <condition_variable> for condition variables.",
    link: "https://en.cppreference.com/w/cpp/header/thread",
  },
  {
    id: 1342,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "What is the purpose of std::condition_variable and how is it typically used?",
    options: [
      "It provides atomic read-modify-write operations on shared variables without using any locks",
      "It enforces a maximum number of threads that can execute a critical section simultaneously",
      "It allows threads to wait until another thread signals that a specific condition has been met",
      "It creates a barrier that blocks all threads until a specified count of them have arrived",
    ],
    correctIndex: 2,
    explanation:
      "std::condition_variable enables one thread to wait until another thread notifies it that some condition is true. It must be used with a std::unique_lock<std::mutex>. The waiting thread releases the lock while blocked and reacquires it when woken.",
    link: "https://en.cppreference.com/w/cpp/thread/condition_variable",
  },
  {
    id: 1343,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "Why should you always check the condition in a loop when using std::condition_variable::wait()?",
    options: [
      "Because the condition variable may be destroyed while the thread is still waiting on it",
      "Because the mutex may be released by another thread while the wait call is in progress",
      "Because the compiler may optimize away single checks and skip the wait call entirely",
      "Because spurious wakeups can occur and the thread may be woken without the condition being true",
    ],
    correctIndex: 3,
    explanation:
      "Condition variables can experience spurious wakeups where wait() returns even though no thread called notify. Using a predicate loop ensures the thread only proceeds when the condition is genuinely true. The overload wait(lock, predicate) handles this automatically.",
    link: "https://en.cppreference.com/w/cpp/thread/condition_variable/wait",
  },
  {
    id: 1344,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "What memory ordering does std::memory_order_relaxed provide for atomic operations?",
    options: [
      "It guarantees atomicity of the operation but provides no ordering with respect to other accesses",
      "It ensures all preceding writes in the current thread are visible before the atomic operation",
      "It creates a full memory barrier that prevents all reordering of reads and writes around it",
      "It ensures that the atomic operation is visible to all threads before any subsequent operations",
    ],
    correctIndex: 0,
    explanation:
      "memory_order_relaxed guarantees only atomicity: the operation will not be torn. It provides no synchronization or ordering constraints with respect to other memory operations. This is the cheapest ordering but should only be used when no inter-thread ordering is needed.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order#Relaxed_ordering",
  },
  {
    id: 1345,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What is the difference between std::unique_lock and std::lock_guard?",
    options: [
      "unique_lock only works with recursive mutexes while lock_guard works with all mutex types",
      "unique_lock supports deferred locking and manual lock/unlock while lock_guard does not",
      "unique_lock is faster because it avoids the overhead of RAII cleanup in its destructor call",
      "unique_lock can be shared across threads while lock_guard is limited to a single thread only",
    ],
    correctIndex: 1,
    explanation:
      "std::unique_lock is more flexible than std::lock_guard. It supports deferred locking (not locking in the constructor), manual lock()/unlock(), timed locking, and can be moved between scopes. It is required for use with condition_variable::wait().",
    link: "https://en.cppreference.com/w/cpp/thread/unique_lock",
  },
  {
    id: 1346,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What does std::promise do and how does it relate to std::future?",
    options: [
      "It provides a thread-safe queue that multiple producers can push values into for consumers",
      "It wraps a callable object so its return value can be retrieved from a different thread later",
      "It provides a channel for a thread to set a value or exception that a future will deliver",
      "It creates a pool of futures that can be waited on simultaneously using a single blocking call",
    ],
    correctIndex: 2,
    explanation:
      "std::promise is the writing end of a promise-future pair. A thread holding the promise calls set_value() or set_exception() to provide the result. Another thread holding the associated std::future calls get() to retrieve it, blocking if necessary.",
    link: "https://en.cppreference.com/w/cpp/thread/promise",
  },
  {
    id: 1347,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What does std::atomic::compare_exchange_strong() do?",
    options: [
      "It unconditionally stores a new value and returns the value that was previously stored there",
      "It increments the atomic value by the given amount and returns the value before the increment",
      "It loads the current value and stores it into a separate output variable without modification",
      "It atomically compares the stored value with expected and writes desired only if they match",
    ],
    correctIndex: 3,
    explanation:
      "compare_exchange_strong atomically compares the current value with expected. If they are equal, it writes the desired value. If not, it loads the current value into expected. This is the fundamental building block for lock-free algorithms.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange",
  },
  {
    id: 1348,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What is std::shared_mutex and when would you use it?",
    options: [
      "It allows multiple readers to hold the lock simultaneously but only one writer at a time",
      "It allows multiple writers to modify data simultaneously but only one reader at a time",
      "It shares a single mutex instance across multiple processes through shared memory regions",
      "It automatically distributes lock ownership among threads to prevent priority inversion",
    ],
    correctIndex: 0,
    explanation:
      "std::shared_mutex supports two lock modes: shared (read) and exclusive (write). Multiple threads can hold shared locks simultaneously for reading, but an exclusive lock requires no other locks be held. This improves throughput for read-heavy workloads.",
    link: "https://en.cppreference.com/w/cpp/thread/shared_mutex",
  },
  {
    id: 1349,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What does std::call_once guarantee when used with std::once_flag?",
    options: [
      "It guarantees that the callable is executed on the main thread regardless of which thread calls it",
      "It guarantees that the callable is executed exactly once even if multiple threads call it concurrently",
      "It guarantees that the callable completes within a specified timeout or throws a timeout exception",
      "It guarantees that the callable is executed in a lock-free manner without using any mutex internally",
    ],
    correctIndex: 1,
    explanation:
      "std::call_once ensures that a callable is invoked exactly once across all threads, even if multiple threads call it simultaneously. Only one thread executes the callable; all others block until it completes. This is commonly used for lazy initialization.",
    link: "https://en.cppreference.com/w/cpp/thread/call_once",
  },
  {
    id: 1350,
    difficulty: "Medium",
    topic: "Multithreading",
    question:
      "What does the std::launch::deferred policy do when passed to std::async?",
    options: [
      "It launches the function on a new thread immediately but defers joining until get() is called",
      "It queues the function for execution on a background thread pool managed by the runtime system",
      "It defers execution of the function until get() or wait() is called on the returned future object",
      "It launches the function on the calling thread immediately and stores the result in the future",
    ],
    correctIndex: 2,
    explanation:
      "With std::launch::deferred, the function is not executed until get() or wait() is called on the future. It runs in the calling thread at that point, not in a separate thread. This provides lazy evaluation semantics.",
    link: "https://en.cppreference.com/w/cpp/thread/launch",
  },
  {
    id: 1351,
    difficulty: "Medium",
    topic: "Multithreading",
    question: "What is thread_local storage duration and what does it guarantee?",
    options: [
      "It creates a variable that is shared between all threads but protected by an automatic mutex",
      "It creates a variable on the heap that persists until the thread explicitly frees the memory",
      "It creates a variable that can only be accessed by the main thread and is invisible to others",
      "It creates a separate copy of the variable for each thread so modifications are not shared",
    ],
    correctIndex: 3,
    explanation:
      "Variables declared with thread_local have a unique instance per thread. Each thread gets its own copy, initialized independently. The variable is created when the thread starts and destroyed when the thread exits.",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration#thread_local",
  },
  {
    id: 1352,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "What is the difference between memory_order_acquire and memory_order_release?",
    options: [
      "acquire prevents reads/writes from being reordered before it; release prevents them after it",
      "acquire flushes the CPU write buffer to memory; release invalidates the CPU read cache lines",
      "acquire is used only for load operations on mutexes; release is used only for store on atomics",
      "acquire synchronizes with all threads globally; release synchronizes only with the next acquire",
    ],
    correctIndex: 0,
    explanation:
      "memory_order_acquire on a load ensures that no reads or writes in the current thread can be reordered before it. memory_order_release on a store ensures no reads or writes can be reordered after it. Together they form an acquire-release pair for synchronization.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order",
  },
  {
    id: 1353,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What problem does the ABA problem describe in lock-free programming?",
    options: [
      "A thread reads value A, another thread locks the same variable with B, causing a deadlock state",
      "A thread reads A, another changes it to B then back to A, so compare-exchange incorrectly succeeds",
      "A thread allocates memory at address A, another frees it and gets address B, causing a use-after-free",
      "A thread writes value A twice in a row which the atomic hardware incorrectly treats as a single write",
    ],
    correctIndex: 1,
    explanation:
      "The ABA problem occurs in lock-free algorithms using compare-and-swap. A thread reads value A, gets preempted, and another thread changes the value from A to B and back to A. When the first thread resumes, its CAS succeeds even though the value was modified in between.",
    link: "https://en.wikipedia.org/wiki/ABA_problem",
  },
  {
    id: 1354,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "What does memory_order_seq_cst guarantee that acquire/release does not?",
    options: [
      "It guarantees that atomic operations complete within a bounded number of CPU clock cycles",
      "It guarantees that all threads observe atomic operations in the same order as the source code",
      "It guarantees a single total order of all seq_cst operations that all threads agree upon",
      "It guarantees that the compiler will never reorder any instructions in the entire translation unit",
    ],
    correctIndex: 2,
    explanation:
      "memory_order_seq_cst provides the strongest ordering: all sequentially consistent operations across all threads appear to occur in a single total order. Acquire/release only creates pairwise synchronization between specific threads, not a global order.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order#Sequentially-consistent_ordering",
  },
  {
    id: 1355,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What is a memory fence and how does std::atomic_thread_fence() work?",
    options: [
      "It prevents threads from accessing memory regions that belong to other threads in the process",
      "It forces the CPU to complete all pending I/O operations before any thread can continue running",
      "It allocates a guard page in memory that triggers a signal if any thread reads or writes past it",
      "It enforces ordering constraints on memory operations without being tied to a specific variable",
    ],
    correctIndex: 3,
    explanation:
      "std::atomic_thread_fence() is a standalone memory barrier that enforces ordering constraints on all memory operations before and after it, without being associated with a particular atomic variable. It is useful when you need to order non-atomic accesses relative to atomic ones.",
    link: "https://en.cppreference.com/w/cpp/atomic/atomic_thread_fence",
  },
  {
    id: 1356,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "What is a lock-free data structure and what guarantee does it provide?",
    options: [
      "It guarantees system-wide progress so at least one thread makes forward progress in any scenario",
      "It guarantees that no thread will ever block and all operations complete in constant time always",
      "It guarantees that all operations complete in the same order regardless of thread scheduling",
      "It guarantees that memory is never allocated dynamically so there are no heap contention issues",
    ],
    correctIndex: 0,
    explanation:
      "A lock-free data structure guarantees that at least one thread makes progress in a finite number of steps, regardless of what other threads are doing. This is stronger than blocking algorithms but weaker than wait-free, which guarantees every thread makes progress.",
    link: "https://en.wikipedia.org/wiki/Non-blocking_algorithm#Lock-freedom",
  },
  {
    id: 1357,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "What is false sharing and how does it affect multithreaded performance?",
    options: [
      "It occurs when threads share a mutex they do not actually need, adding unnecessary contention",
      "It occurs when threads read stale cached values because they forgot to use atomic operations",
      "It occurs when unrelated variables on the same cache line cause unnecessary cache invalidations",
      "It occurs when threads accidentally write to memory owned by another thread through stale pointers",
    ],
    correctIndex: 2,
    explanation:
      "False sharing happens when threads modify different variables that happen to reside on the same CPU cache line. Each write invalidates the cache line for all other cores, causing expensive cache coherence traffic even though the threads are not logically sharing data.",
    link: "https://en.wikipedia.org/wiki/False_sharing",
  },
  {
    id: 1358,
    difficulty: "Hard",
    topic: "Multithreading",
    question: "How does std::latch differ from std::barrier introduced in C++20?",
    options: [
      "latch can be incremented after construction while barrier has a fixed count set at creation time",
      "latch is single-use and counts down to zero while barrier resets and can be reused across phases",
      "latch supports timed waits with a timeout while barrier only supports indefinite blocking waits",
      "latch synchronizes threads across processes while barrier only works within a single process scope",
    ],
    correctIndex: 1,
    explanation:
      "std::latch is a single-use synchronization primitive: threads count it down to zero and waiting threads are released. std::barrier is reusable: after all threads arrive, it resets to its initial count for the next phase, making it suitable for iterative parallel algorithms.",
    link: "https://en.cppreference.com/w/cpp/thread/latch",
  },
  {
    id: 1359,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "What does the happens-before relationship guarantee in the C++ memory model?",
    options: [
      "If operation A happens-before B, then the effects of A are visible and ordered before B executes",
      "If operation A happens-before B, then A always completes in fewer CPU cycles than B takes to run",
      "If operation A happens-before B, then A and B are guaranteed to execute on different CPU cores",
      "If operation A happens-before B, then A was written before B in the original source code file",
    ],
    correctIndex: 0,
    explanation:
      "The happens-before relationship is the foundation of the C++ memory model. If A happens-before B, then A's effects (writes) are guaranteed to be visible to B. This relationship is established through sequencing rules, synchronization operations, and transitivity.",
    link: "https://en.cppreference.com/w/cpp/atomic/memory_order#Happens-before",
  },
  {
    id: 1360,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "What is priority inversion and how can it affect real-time multithreaded systems?",
    options: [
      "It occurs when a high-priority thread starves because the scheduler always runs lower ones first",
      "It occurs when thread priorities are ignored by the OS and all threads receive equal CPU time",
      "It occurs when two threads with the same priority deadlock because neither can preempt the other",
      "It occurs when a low-priority thread holds a lock needed by a high-priority thread that must wait",
    ],
    correctIndex: 3,
    explanation:
      "Priority inversion happens when a high-priority thread is blocked waiting for a resource held by a low-priority thread, while a medium-priority thread preempts the low-priority one. Solutions include priority inheritance, where the low-priority thread temporarily inherits the higher priority.",
    link: "https://en.wikipedia.org/wiki/Priority_inversion",
  },
  {
    id: 1361,
    difficulty: "Hard",
    topic: "Multithreading",
    question:
      "What is the double-checked locking pattern and why was it broken before C++11?",
    options: [
      "It checks for null twice inside a lock to avoid redundant allocations but was broken by deadlocks",
      "It uses two separate mutexes to protect initialization but was broken by inconsistent lock ordering",
      "It checks a flag before and after locking to avoid locking overhead but was broken by reordering",
      "It locks a mutex twice to ensure recursive safety but was broken by non-recursive mutex semantics",
    ],
    correctIndex: 2,
    explanation:
      "Double-checked locking checks a condition before acquiring a lock and again after. Before C++11, the compiler and CPU could reorder the pointer assignment before construction was complete, allowing another thread to see a non-null pointer to an unconstructed object.",
    link: "https://en.wikipedia.org/wiki/Double-checked_locking",
  },
];
