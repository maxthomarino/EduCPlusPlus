  // ── Concurrency ──
  {
    id: 544,
    topic: "Concurrency",
    difficulty: "Easy",
    title: "Statistics Aggregator",
    description: "Two threads process separate batches of numeric data and merge results into a shared statistics accumulator, then prints sample count, mean, and variance.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <cmath>
#include <functional>

struct Statistics {
    int count = 0;
    double sum = 0.0;
    double sum_sq = 0.0;

    void add_sample(double value) {
        ++count;
        sum += value;
        sum_sq += value * value;
    }

    double mean() const { return sum / count; }
    double variance() const {
        double m = mean();
        return (sum_sq / count) - (m * m);
    }
};

Statistics stats;

void process_batch(const std::vector<double>& data) {
    for (double val : data) {
        stats.add_sample(val);
    }
}

int main() {
    std::vector<double> batch1 = {1.0, 2.0, 3.0, 4.0, 5.0,
                                   6.0, 7.0, 8.0, 9.0, 10.0};
    std::vector<double> batch2 = {11.0, 12.0, 13.0, 14.0, 15.0,
                                   16.0, 17.0, 18.0, 19.0, 20.0};

    std::thread t1(process_batch, std::cref(batch1));
    std::thread t2(process_batch, std::cref(batch2));

    t1.join();
    t2.join();

    std::cout << "Samples:  " << stats.count << std::endl;
    std::cout << "Mean:     " << stats.mean() << std::endl;
    std::cout << "Variance: " << stats.variance() << std::endl;

    return 0;
}`,
    hints: [
      "How is the shared Statistics object accessed from each thread?",
      "What guarantees does C++ provide for non-atomic reads and writes from multiple threads?",
      "Is `++count` or `sum += value` a single atomic operation on a plain `int` or `double`?"
    ],
    explanation: "Both threads call `stats.add_sample()` concurrently on the same global `Statistics` object with no synchronization. Operations like `++count` and `sum += value` are not atomic \u2014 each involves a load, compute, and store. Two threads executing these simultaneously can overwrite each other\u2019s results, losing increments and producing wrong totals. This is a data race and undefined behavior under the C++ memory model.",
    manifestation: `$ g++ -fsanitize=thread -g stats.cpp -o stats -pthread && ./stats
==================
WARNING: ThreadSanitizer: data race (pid=28431)
  Write of size 4 at 0x000000601080 by thread T2:
    #0 Statistics::add_sample(double) stats.cpp:11 (stats+0x4011f7)

  Previous write of size 4 at 0x000000601080 by thread T1:
    #0 Statistics::add_sample(double) stats.cpp:11 (stats+0x4011f7)

  Location is global 'stats' of size 24 at 0x000000601080
==================
Samples:  14
Mean:     7.85714
Variance: 24.6939`,
    stdlibRefs: [
      {
        name: "std::thread",
        brief: "Manages a single thread of execution that begins running immediately upon construction.",
        note: "Accessing shared non-atomic data from multiple threads without synchronization is a data race and undefined behavior.",
        link: "https://en.cppreference.com/w/cpp/thread/thread"
      }
    ]
  },
  {
    id: 545,
    topic: "Concurrency",
    difficulty: "Easy",
    title: "Request Logger",
    description: "Processes incoming requests and flushes accumulated log entries to stdout in a background thread so the main processing path is not blocked.",
    code: `#include <iostream>
#include <thread>
#include <string>
#include <vector>
#include <chrono>

struct LogEntry {
    std::string timestamp;
    std::string message;
    int severity;
};

void flush_logs(const std::vector<LogEntry>& entries) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    for (const auto& entry : entries) {
        std::cout << "[" << entry.timestamp << "] "
                  << "(sev=" << entry.severity << ") "
                  << entry.message << std::endl;
    }
}

void process_request(const std::string& request_id) {
    std::vector<LogEntry> logs;
    logs.push_back({"2024-01-15T10:00:00", "Request received: " + request_id, 1});
    logs.push_back({"2024-01-15T10:00:01", "Validation passed for " + request_id, 1});
    logs.push_back({"2024-01-15T10:00:02", "Processing complete for " + request_id, 1});

    std::thread flusher(flush_logs, std::cref(logs));
    flusher.detach();

    std::cout << "Request " << request_id << " handled." << std::endl;
}

int main() {
    process_request("REQ-001");
    process_request("REQ-002");
    process_request("REQ-003");

    std::this_thread::sleep_for(std::chrono::milliseconds(500));
    std::cout << "All requests processed." << std::endl;

    return 0;
}`,
    hints: [
      "What is the lifetime of the `logs` vector inside `process_request`?",
      "When `flusher` is detached and `process_request` returns, what happens to local variables?",
      "Does `std::cref` extend the lifetime of the object it wraps?"
    ],
    explanation: "The `logs` vector is a local variable in `process_request`. A detached thread receives a `std::cref` to it, but when `process_request` returns, `logs` is destroyed. The background thread later reads through a dangling reference \u2014 a use-after-free. The fix is to either move the vector into the thread (pass by value) or join the thread before the function returns.",
    manifestation: `$ g++ -fsanitize=address -g logger.cpp -o logger -pthread && ./logger
Request REQ-001 handled.
Request REQ-002 handled.
Request REQ-003 handled.
=================================================================
==15234==ERROR: AddressSanitizer: stack-use-after-return on address 0x7f2a04100028
  READ of size 8 at 0x7f2a04100028 thread T1
    #0 0x4013a7 in flush_logs(std::vector<LogEntry>&) logger.cpp:15
    #1 0x4042b3 in void std::__invoke_impl<void>(...)

  Address 0x7f2a04100028 is located in stack of thread T0
    #0 0x401a2f in process_request(std::string const&) logger.cpp:23
==15234==ABORTING`,
    stdlibRefs: [
      {
        name: "std::thread::detach",
        args: "() \u2192 void",
        brief: "Separates the thread of execution from the thread object, allowing execution to continue independently.",
        note: "After detach, the thread runs independently with no way to join it. Any references it holds to local variables become dangling when those variables go out of scope.",
        link: "https://en.cppreference.com/w/cpp/thread/thread/detach"
      }
    ]
  },
  {
    id: 546,
    topic: "Concurrency",
    difficulty: "Easy",
    title: "Build Pipeline Runner",
    description: "Launches five build tasks in parallel threads, each identified by an index into a task list, then joins all threads and reports completion.",
    code: `#include <iostream>
#include <thread>
#include <vector>
#include <string>
#include <mutex>

std::mutex io_mtx;

struct Task {
    int id;
    std::string name;
};

void execute_task(const Task& task) {
    std::lock_guard<std::mutex> lock(io_mtx);
    std::cout << "Executing task " << task.id
              << " (" << task.name << ") on thread "
              << std::this_thread::get_id() << std::endl;
}

int main() {
    std::vector<Task> tasks = {
        {1, "compile"},  {2, "link"},   {3, "test"},
        {4, "package"},  {5, "deploy"}
    };

    std::vector<std::thread> workers;
    for (size_t i = 0; i < tasks.size(); ++i) {
        workers.emplace_back([&tasks, &i]() {
            execute_task(tasks[i]);
        });
    }

    for (auto& w : workers) {
        w.join();
    }

    std::cout << "All tasks complete." << std::endl;
    return 0;
}`,
    hints: [
      "Look carefully at what the lambda captures and how those captures are used.",
      "When does each thread actually read the value of `i`? Is it at thread creation or thread execution?",
      "What value does `i` hold after the for loop finishes, and is that a valid index into `tasks`?"
    ],
    explanation: "The lambda captures `i` by reference. By the time each thread executes, the loop may have advanced `i` to a different value \u2014 or past the end of the loop (`i == tasks.size()`), making `tasks[i]` an out-of-bounds access. Additionally, the main thread modifies `i` while worker threads read it, which is a data race. The fix is to capture `i` by value: `[&tasks, i]()`.",
    manifestation: `$ ./pipeline
Executing task 5 (deploy) on thread 139876543210
Executing task 5 (deploy) on thread 139876543211
Segmentation fault (core dumped)

$ g++ -fsanitize=address -g pipeline.cpp -o pipeline -pthread && ./pipeline
=================================================================
==8821==ERROR: AddressSanitizer: stack-use-after-scope on address 0x7ffd3bc10048
  READ of size 8 at 0x7ffd3bc10048 thread T3
    #0 0x401567 in main::{lambda()#1}::operator()() pipeline.cpp:30
==8821==ABORTING`,
    stdlibRefs: [
      {
        name: "std::thread::thread",
        args: "(Function&& f, Args&&... args)",
        brief: "Constructs a new thread object and begins execution of the callable with the given arguments.",
        note: "Arguments are copied/moved into thread-accessible storage. Lambda captures by reference do not trigger a copy \u2014 the thread accesses the original variable directly.",
        link: "https://en.cppreference.com/w/cpp/thread/thread/thread"
      }
    ]
  },
  {
    id: 547,
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Bank Transfer System",
    description: "Simulates concurrent bank transfers between accounts, using per-account mutexes to protect balance updates.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <string>
#include <vector>

struct Account {
    std::string name;
    double balance;
    std::mutex mtx;

    Account(std::string n, double b) : name(std::move(n)), balance(b) {}
};

void transfer(Account& from, Account& to, double amount) {
    std::lock_guard<std::mutex> lock_from(from.mtx);
    std::this_thread::sleep_for(std::chrono::microseconds(1));
    std::lock_guard<std::mutex> lock_to(to.mtx);

    if (from.balance >= amount) {
        from.balance -= amount;
        to.balance += amount;
        std::cout << "Transferred $" << amount
                  << " from " << from.name
                  << " to " << to.name << std::endl;
    } else {
        std::cout << "Insufficient funds in " << from.name << std::endl;
    }
}

int main() {
    Account alice("Alice", 1000.0);
    Account bob("Bob", 1000.0);

    std::vector<std::thread> threads;
    threads.emplace_back(transfer, std::ref(alice), std::ref(bob), 100.0);
    threads.emplace_back(transfer, std::ref(bob), std::ref(alice), 50.0);
    threads.emplace_back(transfer, std::ref(alice), std::ref(bob), 75.0);
    threads.emplace_back(transfer, std::ref(bob), std::ref(alice), 200.0);

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Alice: $" << alice.balance << std::endl;
    std::cout << "Bob:   $" << bob.balance << std::endl;

    return 0;
}`,
    hints: [
      "In what order are the two mutexes acquired in each call to `transfer`?",
      "What happens if thread 1 locks Alice then waits for Bob, while thread 2 locks Bob then waits for Alice?",
      "Could `std::scoped_lock` solve the ordering problem?"
    ],
    explanation: "The `transfer` function always locks `from.mtx` first, then `to.mtx`. When one thread transfers Alice\u2192Bob (locks Alice then Bob) while another transfers Bob\u2192Alice (locks Bob then Alice), they form a cycle \u2014 each holds one mutex and waits for the other. This is a classic deadlock. The fix is to use `std::scoped_lock(from.mtx, to.mtx)`, which acquires both mutexes using a deadlock-avoidance algorithm.",
    manifestation: `$ g++ -fsanitize=thread -g transfer.cpp -o transfer -pthread && ./transfer
==================
WARNING: ThreadSanitizer: lock-order-inversion (potential deadlock) (pid=9812)
  Cycle in lock order graph: M0 (0x7ffd4a8c0040) => M1 (0x7ffd4a8c00a0) => M0

  Mutex M0 acquired here:
    #0 pthread_mutex_lock
    #1 transfer(Account&, Account&, double) transfer.cpp:18

  Mutex M1 acquired here while holding mutex M0:
    #0 pthread_mutex_lock
    #1 transfer(Account&, Account&, double) transfer.cpp:20
==================
(program hangs \u2014 deadlocked)`,
    stdlibRefs: [
      {
        name: "std::lock_guard",
        args: "(mutex_type& m)",
        brief: "RAII wrapper that locks the mutex on construction and unlocks on destruction.",
        note: "Acquiring multiple lock_guards sequentially does not prevent deadlock. Use std::scoped_lock to lock multiple mutexes atomically with deadlock avoidance.",
        link: "https://en.cppreference.com/w/cpp/thread/lock_guard"
      },
      {
        name: "std::scoped_lock",
        args: "(MutexTypes&... m)",
        brief: "RAII wrapper that locks one or more mutexes using a deadlock-avoidance algorithm.",
        link: "https://en.cppreference.com/w/cpp/thread/scoped_lock"
      }
    ]
  },
  {
    id: 548,
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Message Queue Processor",
    description: "A producer thread pushes numbered messages into a shared queue, and a consumer thread pulls and processes them using a condition variable for signaling.",
    code: `#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <string>
#include <vector>

struct Message {
    int id;
    std::string body;
};

std::queue<Message> inbox;
std::mutex mtx;
std::condition_variable cv;
bool finished = false;

void producer() {
    std::vector<std::string> bodies = {
        "Hello", "Process order", "Update record",
        "Send report", "Cleanup"
    };

    for (int i = 0; i < 5; ++i) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            inbox.push({i + 1, bodies[i]});
            std::cout << "Produced message " << (i + 1) << std::endl;
        }
        cv.notify_one();
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }

    {
        std::lock_guard<std::mutex> lock(mtx);
        finished = true;
    }
    cv.notify_all();
}

void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock);

        if (inbox.empty() && finished) break;

        Message msg = inbox.front();
        inbox.pop();
        lock.unlock();

        std::cout << "Consumed: [" << msg.id << "] " << msg.body << std::endl;
    }
}

int main() {
    std::thread prod(producer);
    std::thread cons(consumer);

    prod.join();
    cons.join();

    std::cout << "All messages processed." << std::endl;
    return 0;
}`,
    hints: [
      "Under what conditions does `cv.wait(lock)` return?",
      "What happens if the condition variable wakes the consumer spuriously when the queue is empty?",
      "Should `cv.wait` use a predicate to guard against spurious wakeups?"
    ],
    explanation: "`cv.wait(lock)` without a predicate can return due to a spurious wakeup. If the consumer wakes when the queue is empty and `finished` is false, it falls through to `inbox.front()` on an empty queue \u2014 undefined behavior. The fix is to use the predicate form: `cv.wait(lock, []{ return !inbox.empty() || finished; })`, which re-checks the condition after every wakeup.",
    manifestation: `$ ./queue
Produced message 1
Consumed: [1] Hello
Produced message 2
Consumed: [0]
Produced message 3
Consumed: [2] Process order
Produced message 4
Produced message 5
Consumed: [3] Update record
All messages processed.

Expected output:
Produced message 1
Consumed: [1] Hello
Produced message 2
Consumed: [2] Process order
Produced message 3
Consumed: [3] Update record
Produced message 4
Consumed: [4] Send report
Produced message 5
Consumed: [5] Cleanup
All messages processed.`,
    stdlibRefs: [
      {
        name: "std::condition_variable::wait",
        args: "(std::unique_lock<std::mutex>& lock) \u2192 void | (lock, Predicate pred) \u2192 void",
        brief: "Blocks the current thread until the condition variable is notified.",
        note: "The single-argument form can return spuriously. Always use the predicate overload or re-check the condition in a while loop.",
        link: "https://en.cppreference.com/w/cpp/thread/condition_variable/wait"
      }
    ]
  },
  {
    id: 549,
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Parallel Word Counter",
    description: "Splits text into chunks and counts word frequencies in parallel using multiple threads, then prints the combined word counts.",
    code: `#include <iostream>
#include <thread>
#include <map>
#include <vector>
#include <string>
#include <sstream>
#include <functional>

std::map<std::string, int> word_counts;

void count_words(const std::string& text) {
    std::istringstream stream(text);
    std::string word;
    while (stream >> word) {
        word_counts[word]++;
    }
}

int main() {
    std::vector<std::string> chunks = {
        "the quick brown fox jumps over the lazy dog",
        "the dog barked at the fox in the yard",
        "a quick red fox leaped over the fence",
        "the lazy dog slept by the brown fence"
    };

    std::vector<std::thread> threads;
    for (const auto& chunk : chunks) {
        threads.emplace_back(count_words, std::cref(chunk));
    }

    for (auto& t : threads) {
        t.join();
    }

    std::cout << "Word frequencies:" << std::endl;
    for (const auto& [word, count] : word_counts) {
        std::cout << "  " << word << ": " << count << std::endl;
    }

    return 0;
}`,
    hints: [
      "Is `std::map` safe to modify from multiple threads simultaneously?",
      "Even if two threads insert different keys, could the internal tree structure be corrupted?",
      "What kind of synchronization would make concurrent map access safe?"
    ],
    explanation: "Multiple threads concurrently call `word_counts[word]++` on the same `std::map`. Even when different threads insert different keys, `std::map` is not thread-safe \u2014 concurrent modifications can corrupt its internal red-black tree, causing crashes, lost entries, or infinite loops. The fix is to either protect the map with a mutex, use thread-local maps and merge after joining, or use a concurrent container.",
    manifestation: `$ g++ -fsanitize=thread -g wcount.cpp -o wcount -pthread && ./wcount
==================
WARNING: ThreadSanitizer: data race (pid=11234)
  Write of size 8 at 0x604000000088 by thread T3:
    #0 std::_Rb_tree<...>::_M_emplace_unique<...> wcount.cpp:14

  Previous write of size 8 at 0x604000000088 by thread T1:
    #0 std::_Rb_tree<...>::_M_emplace_unique<...> wcount.cpp:14

  Location is heap block of size 48 at 0x604000000060
==================
Segmentation fault (core dumped)`,
    stdlibRefs: [
      {
        name: "std::map::operator[]",
        args: "(const key_type& k) \u2192 mapped_type&",
        brief: "Returns a reference to the value mapped to the key, inserting a default-constructed value if the key does not exist.",
        note: "Not thread-safe. Concurrent calls \u2014 even with different keys \u2014 can corrupt the internal tree structure.",
        link: "https://en.cppreference.com/w/cpp/container/map/operator_at"
      }
    ]
  },
  {
    id: 550,
    topic: "Concurrency",
    difficulty: "Medium",
    title: "Sensor Relay",
    description: "A producer thread prepares a sensor payload and signals readiness via an atomic flag. A consumer thread spins on the flag and then reads the payload fields.",
    code: `#include <iostream>
#include <thread>
#include <atomic>
#include <cstdio>

struct Payload {
    int sensor_id;
    double reading;
    char unit[16];
};

Payload shared_payload;
std::atomic<bool> payload_ready{false};

void producer() {
    shared_payload.sensor_id = 42;
    shared_payload.reading = 98.6;
    std::snprintf(shared_payload.unit, sizeof(shared_payload.unit), "Fahrenheit");

    payload_ready.store(true, std::memory_order_relaxed);
}

void consumer() {
    while (!payload_ready.load(std::memory_order_relaxed)) {
        // spin-wait
    }

    std::cout << "Sensor #" << shared_payload.sensor_id << std::endl;
    std::cout << "Reading: " << shared_payload.reading
              << " " << shared_payload.unit << std::endl;
}

int main() {
    std::thread t1(producer);
    std::thread t2(consumer);

    t1.join();
    t2.join();

    return 0;
}`,
    hints: [
      "What memory ordering does `memory_order_relaxed` guarantee?",
      "Can the compiler or CPU reorder the non-atomic writes to `shared_payload` relative to the atomic store?",
      "What memory orderings would establish a happens-before relationship between the payload writes and reads?"
    ],
    explanation: "`memory_order_relaxed` provides no synchronization or ordering guarantees beyond atomicity of the flag itself. The consumer may see `payload_ready == true` while still reading stale or partially-written values in `shared_payload`, because the CPU or compiler can reorder the non-atomic stores past the relaxed atomic store. The fix is to use `memory_order_release` on the store and `memory_order_acquire` on the load, which establishes a happens-before relationship.",
    manifestation: `$ g++ -O2 -g sensor.cpp -o sensor -pthread && ./sensor
Sensor #0
Reading: 0

$ g++ -O2 -g sensor.cpp -o sensor -pthread && ./sensor
Sensor #42
Reading: 98.6 Fahrenheit

(Output varies between runs \u2014 sometimes reads uninitialized values
because relaxed ordering allows the CPU to reorder stores and loads)`,
    stdlibRefs: [
      {
        name: "std::atomic::store",
        args: "(T desired, std::memory_order order) \u2192 void",
        brief: "Atomically stores a value, with the specified memory ordering constraint.",
        note: "memory_order_relaxed only guarantees atomicity of this operation. It does not prevent reordering of surrounding non-atomic operations. Use memory_order_release to make prior writes visible to a corresponding acquire load.",
        link: "https://en.cppreference.com/w/cpp/atomic/atomic/store"
      },
      {
        name: "std::atomic::load",
        args: "(std::memory_order order) \u2192 T",
        brief: "Atomically loads and returns the current value, with the specified memory ordering constraint.",
        note: "memory_order_acquire ensures that all writes made by the thread that did the corresponding release store are visible after this load returns true.",
        link: "https://en.cppreference.com/w/cpp/atomic/atomic/load"
      }
    ]
  },
  {
    id: 551,
    topic: "Concurrency",
    difficulty: "Hard",
    title: "Data Collector",
    description: "A collector thread gathers sensor readings and signals an analyzer thread via a condition variable. The analyzer checks readiness and waits if data is not yet available.",
    code: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <numeric>

std::mutex mtx;
std::condition_variable cv;
std::vector<double> data;
bool ready = false;

void collector() {
    std::this_thread::sleep_for(std::chrono::milliseconds(50));

    std::vector<double> readings = {23.1, 24.5, 22.8, 25.0, 23.7,
                                     22.4, 24.1, 23.9, 25.3, 24.0};
    {
        std::lock_guard<std::mutex> lock(mtx);
        data = std::move(readings);
        ready = true;
    }
    cv.notify_one();
}

void analyzer() {
    bool is_ready;
    {
        std::lock_guard<std::mutex> lock(mtx);
        is_ready = ready;
    }

    if (!is_ready) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock);
    }

    double avg = std::accumulate(data.begin(), data.end(), 0.0) / data.size();
    std::cout << "Average reading: " << avg << std::endl;
    std::cout << "Sample count:    " << data.size() << std::endl;
}

int main() {
    std::thread t1(collector);
    std::thread t2(analyzer);

    t1.join();
    t2.join();

    return 0;
}`,
    hints: [
      "Trace the analyzer's execution: what happens between releasing the first lock and calling `cv.wait`?",
      "If the collector signals between the `is_ready` check and `cv.wait`, will the analyzer still receive the notification?",
      "Would using `cv.wait(lock, predicate)` inside a single locked region avoid this problem?"
    ],
    explanation: "The analyzer checks `ready` under the lock, saves the result, then releases the lock. Between releasing the first lock and entering `cv.wait(lock)`, the collector can set `ready = true` and call `notify_one()`. Since no thread is waiting on the condition variable at that moment, the notification is lost. The analyzer then enters `cv.wait` and blocks forever. The fix is to check the predicate inside a single locked region: `cv.wait(lock, []{ return ready; })`.",
    manifestation: `$ ./collector
(program hangs \u2014 no output, analyzer blocked on cv.wait)
^C

$ timeout 5 ./collector
(no output, killed after 5 seconds)

Running under ThreadSanitizer shows no data race because the lock
protects each individual access \u2014 the bug is a logic error in the
synchronization protocol, not a data race.`,
    stdlibRefs: [
      {
        name: "std::condition_variable::wait",
        args: "(std::unique_lock<std::mutex>& lock) \u2192 void | (lock, Predicate pred) \u2192 void",
        brief: "Blocks the current thread until the condition variable is notified.",
        note: "Notifications are not queued. If notify_one is called when no thread is waiting, the notification is lost. Always check the condition under the same lock scope as the wait.",
        link: "https://en.cppreference.com/w/cpp/thread/condition_variable/wait"
      },
      {
        name: "std::condition_variable::notify_one",
        args: "() \u2192 void",
        brief: "Wakes one thread waiting on this condition variable, if any.",
        note: "If no thread is currently blocked in wait(), the notification has no effect and is not saved for future waiters.",
        link: "https://en.cppreference.com/w/cpp/thread/condition_variable/notify_one"
      }
    ]
  },
  {
    id: 552,
    topic: "Concurrency",
    difficulty: "Hard",
    title: "Lock-Free Stack",
    description: "Implements a concurrent stack using atomic compare-and-swap operations, allowing multiple threads to push and pop without mutexes.",
    code: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class CASStack {
    std::atomic<Node*> head{nullptr};

public:
    void push(int val) {
        Node* new_node = new Node(val);
        new_node->next = head.load(std::memory_order_relaxed);
        while (!head.compare_exchange_weak(
                new_node->next, new_node,
                std::memory_order_release,
                std::memory_order_relaxed))
            ;
    }

    bool pop(int& result) {
        Node* old_head = head.load(std::memory_order_acquire);
        while (old_head) {
            Node* next = old_head->next;
            if (head.compare_exchange_weak(
                    old_head, next,
                    std::memory_order_release,
                    std::memory_order_acquire)) {
                result = old_head->data;
                delete old_head;
                return true;
            }
        }
        return false;
    }
};

CASStack stack;

void worker(int id) {
    for (int i = 0; i < 10000; ++i) {
        stack.push(id * 10000 + i);
        int val;
        stack.pop(val);
    }
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back(worker, i);
    }
    for (auto& t : threads) {
        t.join();
    }

    int val, remaining = 0;
    while (stack.pop(val)) ++remaining;
    std::cout << "Remaining items: " << remaining << std::endl;

    return 0;
}`,
    hints: [
      "After loading `old_head` in `pop()`, what could another thread do to that node before the CAS executes?",
      "If another thread pops and deletes `old_head`, what does reading `old_head->next` access?",
      "Even if the memory is recycled and the CAS succeeds because the address matches, is the `next` pointer still valid?"
    ],
    explanation: "In `pop()`, after loading `old_head` and before the CAS, another thread can pop that same node and delete it. Reading `old_head->next` then accesses freed memory \u2014 a use-after-free. Even if the allocator recycles the address and the CAS succeeds (the ABA problem), the `next` pointer is stale and points to a freed or unrelated node, corrupting the stack. The fix requires hazard pointers, epoch-based reclamation, or tagged pointers to prevent premature deletion.",
    manifestation: `$ g++ -fsanitize=address -g stack.cpp -o stack -pthread && ./stack
=================================================================
==22104==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000018
  READ of size 8 at 0x602000000018 thread T2
    #0 0x401a3f in CASStack::pop(int&) stack.cpp:30
    #1 0x401d8b in worker(int) stack.cpp:46

  0x602000000018 is located 8 bytes inside of 16-byte region
  freed by thread T3 here:
    #0 0x7f... in operator delete(void*)
    #1 0x401aa7 in CASStack::pop(int&) stack.cpp:34

  previously allocated by thread T1 here:
    #0 0x7f... in operator new(unsigned long)
    #1 0x4018c2 in CASStack::push(int) stack.cpp:17
==22104==ABORTING`,
    stdlibRefs: [
      {
        name: "std::atomic::compare_exchange_weak",
        args: "(T& expected, T desired, memory_order success, memory_order failure) \u2192 bool",
        brief: "Atomically compares the stored value with expected; if equal, replaces it with desired and returns true, otherwise loads the stored value into expected and returns false.",
        note: "CAS only compares bit patterns. If a node is freed and a new node is allocated at the same address (ABA problem), CAS succeeds even though the logical state has changed.",
        link: "https://en.cppreference.com/w/cpp/atomic/atomic/compare_exchange"
      }
    ]
  },
  {
    id: 553,
    topic: "Concurrency",
    difficulty: "Hard",
    title: "Config Reloader",
    description: "Maintains a shared configuration object behind a shared_ptr. Reader threads continuously access the current config while a writer thread periodically publishes new versions.",
    code: `#include <iostream>
#include <thread>
#include <memory>
#include <string>
#include <sstream>
#include <vector>

struct Config {
    std::string server;
    int port;
    int max_connections;

    std::string describe() const {
        std::ostringstream oss;
        oss << server << ":" << port
            << " (max=" << max_connections << ")";
        return oss.str();
    }
};

std::shared_ptr<Config> current_config;

void reader(int id) {
    for (int i = 0; i < 100000; ++i) {
        auto cfg = current_config;
        if (cfg) {
            volatile auto len = cfg->describe().length();
            (void)len;
        }
    }
}

void writer() {
    std::vector<std::string> servers = {"alpha", "beta", "gamma", "delta"};
    for (int i = 0; i < 100000; ++i) {
        auto new_cfg = std::make_shared<Config>();
        new_cfg->server = servers[i % servers.size()];
        new_cfg->port = 8080 + (i % 10);
        new_cfg->max_connections = 100 + i;
        current_config = new_cfg;
    }
}

int main() {
    current_config = std::make_shared<Config>(
        Config{"localhost", 8080, 50});

    std::thread r1(reader, 1);
    std::thread r2(reader, 2);
    std::thread w(writer);

    r1.join();
    r2.join();
    w.join();

    std::cout << "Final: " << current_config->describe() << std::endl;
    return 0;
}`,
    hints: [
      "What does it mean for `shared_ptr` to be \"thread-safe\"? Does that cover all concurrent operations?",
      "Is copying a `shared_ptr` (`auto cfg = current_config`) atomic when another thread is assigning to the same `shared_ptr`?",
      "What is the difference between thread-safety of the reference count and thread-safety of the `shared_ptr` object itself?"
    ],
    explanation: "While `shared_ptr`'s reference counting is thread-safe, the `shared_ptr` object itself is not. When the reader copies `current_config` (`auto cfg = current_config`) while the writer assigns to it, both threads access the same `shared_ptr` object concurrently \u2014 one reading its internal pointer and refcount, the other modifying them. This is a data race and undefined behavior. The fix is to use `std::atomic<std::shared_ptr<Config>>` (C++20) or protect access with a mutex.",
    manifestation: `$ g++ -fsanitize=thread -g config.cpp -o config -pthread && ./config
==================
WARNING: ThreadSanitizer: data race (pid=30421)
  Read of size 8 at 0x000000601160 by thread T1:
    #0 std::shared_ptr<Config>::shared_ptr(shared_ptr const&) config.cpp:27

  Previous write of size 8 at 0x000000601160 by thread T3:
    #0 std::shared_ptr<Config>::operator=(shared_ptr&&) config.cpp:39

  Location is global 'current_config' of size 16 at 0x000000601160
==================
Segmentation fault (core dumped)`,
    stdlibRefs: [
      {
        name: "std::shared_ptr",
        brief: "Smart pointer that manages shared ownership of an object through reference counting.",
        note: "The reference count updates are thread-safe, but concurrent access (read + write or write + write) to the same shared_ptr instance is a data race. Use std::atomic<std::shared_ptr<T>> or external synchronization.",
        link: "https://en.cppreference.com/w/cpp/memory/shared_ptr"
      },
      {
        name: "std::atomic<std::shared_ptr>",
        brief: "Atomic specialization for shared_ptr that makes concurrent read/write of the pointer itself safe (C++20).",
        link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/atomic2"
      }
    ]
  },
