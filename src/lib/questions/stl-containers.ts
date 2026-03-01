import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 9,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "Which of the following STL containers can insert and delete from both the front and back in O(1)?",
    options: ["list", "deque", "Both B and C", "vector"],
    correctIndex: 2,
    explanation:
      "deque supports O(1) push_front/push_back. list (doubly-linked) supports O(1) insertion/removal at both ends.",
    link: "https://en.cppreference.com/w/cpp/container/deque.html",
  },
  {
    id: 10,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the average-case time complexity of find() in std::unordered_map?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 3,
    explanation:
      "unordered_map uses a hash table, so lookups are O(1) on average. Worst case is O(n) due to hash collisions.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 11,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "Which container should you use if you need fast lookup AND sorted order of keys?",
    options: ["std::map", "std::vector", "std::unordered_map", "std::deque"],
    correctIndex: 0,
    explanation:
      "std::map uses a balanced BST (typically red-black tree), giving O(log n) lookup while maintaining keys in sorted order.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 12,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "Which operation on std::vector invalidates all iterators, pointers, and references to its elements?",
    options: [
      "erase on the last element",
      "push_back when size() < capacity()",
      "push_back when size() == capacity()",
      "clear()",
    ],
    correctIndex: 2,
    explanation:
      "This triggers reallocation, moving all elements to a new memory block and invalidating every existing iterator.",
    link: "https://en.cppreference.com/w/cpp/container/vector.html",
  },
  {
    id: 44,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "What is the runtime overhead of std::array<int, 100> compared to int arr[100]?",
    options: [
      "Significantly slower due to heap allocation",
      "Zero",
      "Slightly slower due to bounds checking",
      "Faster due to compiler optimizations on STL types",
    ],
    correctIndex: 1,
    explanation:
      "std::array is stack-allocated with a compile-time fixed size, just like a C array. It adds no runtime cost while providing .size(), iterators, and other STL container interfaces.",
    link: "https://en.cppreference.com/w/cpp/container/array.html",
  },
  {
    id: 45,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "Why can't you pass &myDeque[0] to a C function that expects a pointer to contiguous memory?",
    options: [
      "deque elements are always heap-allocated individually",
      "deque stores elements in reverse order",
      "deque does not support operator[]",
      "deque elements are stored in non-contiguous chunks of memory",
    ],
    correctIndex: 3,
    explanation:
      "Unlike vector, deque uses multiple fixed-size blocks. Elements are not guaranteed to be contiguous, so pointer arithmetic across elements is invalid.",
    link: "https://en.cppreference.com/w/cpp/container/deque.html",
  },
  {
    id: 56,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the key advantage of v.emplace_back(args...) over v.push_back(T(args...))?",
    options: [
      "emplace_back constructs the object in-place, avoiding a temporary",
      "emplace_back checks bounds before inserting and throws if full",
      "emplace_back preallocates extra capacity to reduce future reallocations",
      "emplace_back is thread-safe and can be called from multiple threads",
    ],
    correctIndex: 0,
    explanation:
      "emplace_back forwards arguments directly to the constructor, building the object in the vector's memory. push_back requires an already-constructed object that is then copied or moved into the container.",
    link: "https://en.cppreference.com/w/cpp/container/vector/emplace_back.html",
  },
  {
    id: 129,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What does v.reserve(1000) do?",
    code: `std::vector<int> v;\nv.reserve(1000);`,
    options: [
      "Allocates memory for at least 1000 elements without changing v's size",
      "Sets v's size to 1000 and fills each element with the value zero",
      "Limits v so it can never hold more than 1000 elements total",
      "Creates 1000 default-initialized integers inside the vector v immediately",
    ],
    correctIndex: 0,
    explanation:
      "reserve() pre-allocates storage so future push_back calls up to that capacity avoid reallocation. It does not change size() or add any elements. Use resize() if you want to actually create elements.",
    link: "https://en.cppreference.com/w/cpp/container/vector/reserve.html",
  },
  {
    id: 130,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "After pushing 5 elements into a default-constructed std::vector<int>, which statement is guaranteed?",
    options: [
      "size() is always > capacity()",
      "size() == 5 and capacity() >= 5",
      "capacity() is exactly == 5",
      "size() is always == capacity()",
    ],
    correctIndex: 1,
    explanation:
      "size() is always the number of elements actually stored. capacity() is the number of elements the vector can hold before reallocating. capacity() is always >= size(), but the exact capacity depends on the implementation's growth strategy.",
    link: "https://en.cppreference.com/w/cpp/container/vector.html",
  },
  {
    id: 131,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Which container adaptor implements LIFO (last-in, first-out) semantics?",
    options: ["std::stack", "std::queue", "std::deque", "std::priority_queue"],
    correctIndex: 0,
    explanation:
      "std::stack provides push(), pop(), and top() -- all operating on the most recently added element. It is a container adaptor that wraps an underlying container (std::deque by default).",
    link: "https://en.cppreference.com/w/cpp/container/stack.html",
  },
  {
    id: 132,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What two guarantees does std::set provide about its elements?",
    options: [
      "Insertion order preservation and O(1) access",
      "Thread safety and sorted order",
      "Contiguous memory and constant-time lookup",
      "Sorted order and uniqueness",
    ],
    correctIndex: 3,
    explanation:
      "std::set uses a balanced BST (typically red-black tree) to keep elements in sorted order and rejects duplicate insertions. Both insert and find are O(log n).",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 133,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Which container adaptor should you use for a FIFO (first-in, first-out) queue?",
    options: ["std::priority_queue", "std::stack", "std::vector", "std::queue"],
    correctIndex: 3,
    explanation:
      "std::queue provides push() (add to back) and pop()/front() (remove from front), implementing classic FIFO semantics. It wraps std::deque by default.",
    link: "https://en.cppreference.com/w/cpp/container/queue.html",
  },
  {
    id: 134,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the key difference between v.at(i) and v[i] for std::vector?",
    options: [
      "at() throws std::out_of_range if i >= size(); operator[] has undefined behavior",
      "operator[] returns a copy of the element; at() returns a reference to it",
      "at() is faster because it skips bounds checking entirely for performance",
      "There is no difference -- they are interchangeable aliases for the same operation",
    ],
    correctIndex: 0,
    explanation:
      "at() performs bounds checking and throws an exception on out-of-range access. operator[] provides no check for performance reasons -- accessing an invalid index is undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/container/vector/at.html",
  },
  {
    id: 135,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is std::forward_list, and how does it differ from std::list?",
    options: [
      "forward_list is doubly-linked (two pointers per node); list is singly-linked (one pointer per node)",
      "forward_list is singly-linked (one pointer per node); list is doubly-linked (two pointers per node)",
      "forward_list stores elements contiguously in a flat array; list uses separate heap-allocated nodes",
      "forward_list supports random access via operator[]; list only provides sequential iteration",
    ],
    correctIndex: 1,
    explanation:
      "std::forward_list uses one pointer per node (next only), saving memory compared to std::list's two pointers (next and prev). The trade-off is that forward_list can only iterate forward and lacks size(), push_back(), and reverse iteration.",
    link: "https://en.cppreference.com/w/cpp/container/forward_list.html",
  },
  {
    id: 136,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "You insert the values 3, 1, 3, 2, 3 into a std::set<int>. What does the set contain?",
    options: [
      "{1, 2, 3} -- sorted and deduplicated",
      "{3, 1, 3, 2, 3}",
      "{3, 1, 2} -- only the first occurrence of each value",
      "{1, 2, 3, 3, 3}",
    ],
    correctIndex: 0,
    explanation:
      "std::set stores only unique elements in sorted order. Duplicate insertions are silently ignored (insert returns a pair where the bool is false for duplicates). Use std::multiset if you need to allow duplicates.",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 137,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "After calling v.clear(), what is true about v?",
    code: `std::vector<int> v = {1, 2, 3, 4, 5};\nv.clear();`,
    options: [
      "v.size() == 0 and v.capacity() == 0",
      "v is in an unspecified state and cannot be used again",
      "v.size() == 5 but all elements are zeroed to default values",
      "v.size() == 0 but v.capacity() is unchanged (still >= 5)",
    ],
    correctIndex: 3,
    explanation:
      "clear() destroys all elements and sets size to 0, but does NOT release the allocated memory. The capacity remains at least as large as before. Use shrink_to_fit() after clear() if you want to release memory.",
    link: "https://en.cppreference.com/w/cpp/container/vector/clear.html",
  },
  {
    id: 138,
    difficulty: "Easy",
    topic: "STL Containers",
    question:
      "Which STL container stores key-value pairs sorted by key and provides O(log n) lookup?",
    options: [
      "std::map",
      "std::vector<std::pair>",
      "std::unordered_map",
      "std::set",
    ],
    correctIndex: 0,
    explanation:
      "std::map is an ordered associative container backed by a balanced BST. Keys are always sorted, and lookup, insertion, and deletion are O(log n). std::unordered_map is O(1) average but does not maintain order.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 139,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the default underlying container of std::priority_queue?",
    options: [
      "std::deque",
      "std::list",
      "std::set",
      "std::vector",
    ],
    correctIndex: 3,
    explanation:
      "std::priority_queue uses std::vector by default as its underlying container. It organizes elements as a max-heap using std::make_heap, std::push_heap, and std::pop_heap internally.",
    link: "https://en.cppreference.com/w/cpp/container/priority_queue.html",
  },
  {
    id: 140,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the time complexity of std::set::find()?",
    options: ["O(n log n)", "O(1)", "O(log n)", "O(n)"],
    correctIndex: 2,
    explanation:
      "std::set is backed by a balanced BST, so find() performs a binary search through the tree in O(log n) time. For O(1) average lookup, use std::unordered_set.",
    link: "https://en.cppreference.com/w/cpp/container/set/find.html",
  },
  {
    id: 141,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is the default underlying container of std::stack?",
    options: ["std::array", "std::list", "std::vector", "std::deque"],
    correctIndex: 3,
    explanation:
      "std::stack uses std::deque by default. You can change this with the second template parameter: std::stack<int, std::vector<int>>. Any container supporting back(), push_back(), and pop_back() can be used.",
    link: "https://en.cppreference.com/w/cpp/container/stack.html",
  },
  {
    id: 142,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Can you iterate over all elements of a std::stack using a range-based for loop?",
    options: [
      "No -- std::stack only exposes top(), push(), and pop() -- no iterators",
      "Yes -- std::stack provides begin() and end() iterators",
      "Yes -- by calling stack::data() to get the underlying array",
      "Yes -- but only in reverse order",
    ],
    correctIndex: 0,
    explanation:
      "Container adaptors (std::stack, std::queue, std::priority_queue) intentionally hide the underlying container's interface. They expose only the operations appropriate for their abstraction. If you need iteration, use the underlying container directly.",
    link: "https://en.cppreference.com/w/cpp/container/stack.html",
  },
  {
    id: 143,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What is std::span (C++20)?",
    code: `void process(std::span<int> data) {\n    for (int x : data) { /* ... */ }\n}`,
    options: [
      "A non-owning view over a contiguous sequence of elements",
      "A drop-in replacement for std::vector that provides better runtime performance guarantees",
      "A container that dynamically allocates a contiguous array",
      "A thread-safe wrapper around std::array that synchronizes all element accesses automatically",
    ],
    correctIndex: 0,
    explanation:
      "std::span is a lightweight, non-owning reference to a contiguous sequence of objects. It can be created from a std::vector, std::array, C array, or any contiguous range. It does not own or allocate memory.",
    link: "https://en.cppreference.com/w/cpp/container/span.html",
  },
  {
    id: 144,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "What does v.front() return on a non-empty vector?",
    options: [
      "An iterator to the first element",
      "A reference to the first element",
      "The index of the first element (always 0)",
      "A copy of the first element",
    ],
    correctIndex: 1,
    explanation:
      "front() returns a reference to the first element, allowing both reading and modification. Calling front() on an empty vector is undefined behavior. Similarly, back() returns a reference to the last element.",
    link: "https://en.cppreference.com/w/cpp/container/vector/front.html",
  },
  {
    id: 145,
    difficulty: "Easy",
    topic: "STL Containers",
    question: "Does std::unordered_set maintain any particular order of its elements?",
    options: [
      "Yes -- elements are sorted numerically by their computed hash values within each bucket",
      "Yes -- elements are kept in the exact order they were originally inserted into the set",
      "Yes -- elements are sorted in ascending order based on the default comparison operator",
      "No -- the order depends on the hash function and may change after insertions",
    ],
    correctIndex: 3,
    explanation:
      "std::unordered_set uses a hash table internally. Element order depends on hash values and bucket arrangement, and can change when rehashing occurs (e.g., after insertions that exceed the load factor).",
    link: "https://en.cppreference.com/w/cpp/container/unordered_set.html",
  },
  {
    id: 146,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "When should you prefer std::set over std::unordered_set?",
    options: [
      "When you need elements in sorted order or need to perform range queries",
      "When you need O(1) average lookup time and ordering does not matter",
      "When your elements do not support the < operator but do provide a hash",
      "When you want the fastest possible insertion regardless of element ordering",
    ],
    correctIndex: 0,
    explanation:
      "std::set maintains sorted order, enabling operations like lower_bound(), upper_bound(), and range iteration. std::unordered_set offers O(1) average lookup but no ordering. Choose set when order matters; unordered_set when it doesn't and speed is critical.",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 147,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What happens when you insert a key that already exists in std::map?",
    code: `std::map<std::string, int> m;\nm.insert({"key", 1});\nm.insert({"key", 2});\nstd::cout << m["key"];`,
    options: [
      "Prints 2 -- the second insert overwrites the first",
      "Prints 0 -- duplicate keys cause the value to be zeroed",
      "Compilation error",
      "Prints 1 -- insert does not overwrite existing keys",
    ],
    correctIndex: 3,
    explanation:
      "std::map::insert() is a no-op when the key already exists -- it returns an iterator to the existing element and false. Use insert_or_assign() (C++17) or operator[] to overwrite existing values.",
    link: "https://en.cppreference.com/w/cpp/container/map/insert.html",
  },
  {
    id: 148,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What does std::map::operator[] do when accessed with a key that does not exist?",
    code: `std::map<std::string, int> m;\nstd::cout << m["missing"];`,
    options: [
      "Throws std::out_of_range because the key was not found in the container",
      "Returns a default value without modifying the map or inserting any new entries",
      "Inserts a new element with a value-initialized (zero) value and returns a reference to it",
      "Returns an iterator pointing to end() to indicate that the key does not exist",
    ],
    correctIndex: 2,
    explanation:
      "operator[] inserts a default-constructed value if the key is absent. This is why it cannot be used on a const map. Use find() or at() (which throws) if you don't want unintended insertion.",
    link: "https://en.cppreference.com/w/cpp/container/map/operator_at.html",
  },
  {
    id: 149,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "You need a key-value store with frequent lookups but don't care about key order. Which container is generally faster?",
    options: [
      "std::unordered_map",
      "std::vector<std::pair<K,V>>",
      "std::set<std::pair<K,V>>",
      "std::map -- balanced tree is always faster than hashing",
    ],
    correctIndex: 0,
    explanation:
      "std::unordered_map uses a hash table for O(1) average-case lookup, insertion, and deletion. std::map uses a balanced BST for O(log n). When key ordering is unnecessary, unordered_map is typically the faster choice.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 150,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the time complexity of inserting an element at the beginning of a std::vector with 10,000 elements?",
    code: `v.insert(v.begin(), 42);`,
    options: [
      "O(1) -- same as push_back",
      "O(n) -- all existing elements must be shifted right by one position",
      "O(log n) -- the vector uses binary search to find the insertion point",
      "O(1) amortized -- the vector reserves extra space at the front",
    ],
    correctIndex: 1,
    explanation:
      "Inserting at the front of a vector requires shifting all n existing elements one position to the right. This is O(n). If you need frequent front insertions, use std::deque which supports O(1) push_front().",
    link: "https://en.cppreference.com/w/cpp/container/vector/insert.html",
  },
  {
    id: 151,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What does v.shrink_to_fit() do?",
    code: `std::vector<int> v = {1, 2, 3};\nv.reserve(1000);\nv.shrink_to_fit();`,
    options: [
      "Does nothing -- it is a deprecated no-op retained only for backwards compatibility",
      "Guarantees that capacity() == size() by reallocating to an exactly-sized buffer",
      "Deletes excess elements from the end to fit within the current allocated capacity",
      "Requests the vector to reduce capacity() to match size()",
    ],
    correctIndex: 3,
    explanation:
      "shrink_to_fit() is a non-binding request to reduce capacity to size. The implementation may ignore it. In practice, most implementations do honor the request by reallocating to a smaller buffer.",
    link: "https://en.cppreference.com/w/cpp/container/vector/shrink_to_fit.html",
  },
  {
    id: 152,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "How does std::multimap differ from std::map?",
    options: [
      "multimap does not maintain sorted order",
      "multimap stores values but not keys",
      "multimap uses a hash table instead of a tree",
      "multimap allows multiple entries with the same key",
    ],
    correctIndex: 3,
    explanation:
      "std::multimap allows duplicate keys -- multiple key-value pairs can share the same key. It still maintains sorted order by key. Use equal_range() to get all entries for a given key.",
    link: "https://en.cppreference.com/w/cpp/container/multimap.html",
  },
  {
    id: 153,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "By default, std::priority_queue<int> gives you which element first via top()?",
    options: [
      "The most recently pushed element",
      "The least recently pushed element",
      "The largest (maximum) element",
      "The smallest (minimum) element",
    ],
    correctIndex: 2,
    explanation:
      "std::priority_queue uses std::less<T> by default, creating a max-heap. top() returns the largest element. For a min-heap, use std::priority_queue<int, std::vector<int>, std::greater<int>>.",
    link: "https://en.cppreference.com/w/cpp/container/priority_queue.html",
  },
  {
    id: 154,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What makes std::list::splice() unique compared to inserting elements into other containers?",
    options: [
      "It transfers nodes from one list to another without copying or moving elements",
      "It works across different container types, allowing you to splice nodes from a vector into a list",
      "It automatically inserts elements in sorted order by comparing each node's value during the transfer",
      "It is the only O(n log n) insertion operation in the STL, using merge sort internally to place elements",
    ],
    correctIndex: 0,
    explanation:
      "splice() moves list nodes by relinking internal pointers -- no element copy/move constructors are called. This is O(1) for single elements or an entire list, and is exclusive to node-based containers.",
    link: "https://en.cppreference.com/w/cpp/container/list/splice.html",
  },
  {
    id: 155,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What happens to iterators when an std::unordered_map rehashes (e.g., after many insertions)?",
    options: [
      "Only iterators to the newly inserted element are invalidated; all others remain stable",
      "All iterators are invalidated, but references and pointers to elements remain valid",
      "Both iterators and references are invalidated, requiring all saved handles to be refreshed",
      "Iterators remain valid",
    ],
    correctIndex: 1,
    explanation:
      "Rehashing rearranges which bucket each element lives in, invalidating iterators. However, the elements themselves are not moved in memory, so references and pointers to values remain valid.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 156,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the key behavioral difference between map::insert({k, v}) and map[k] = v?",
    options: [
      "insert requires the key to exist; operator[] creates it if missing",
      "insert returns void; operator[] returns a bool",
      "insert is O(n); operator[] is O(log n)",
      "insert does not overwrite an existing key; operator[] always overwrites",
    ],
    correctIndex: 3,
    explanation:
      "insert() leaves existing entries untouched (no-op on duplicate key). operator[] inserts a default value if the key is missing, then assigns. So m[k] = v always sets the value, while insert only sets it if the key is new.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 157,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What does v.data() return?",
    code: `std::vector<int> v = {10, 20, 30};`,
    options: [
      "An iterator pointing to the first element in the vector",
      "The total memory used by the vector measured in bytes",
      "A pointer to the underlying contiguous array of elements",
      "A copy of the internal data returned as a std::array object",
    ],
    correctIndex: 2,
    explanation:
      "data() returns a raw pointer to the first element of the internal contiguous array. This is useful for interoperating with C APIs that expect a pointer. The pointer is valid as long as the vector is not reallocated.",
    link: "https://en.cppreference.com/w/cpp/container/vector/data.html",
  },
  {
    id: 158,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "How do you create a std::set that stores integers in descending order?",
    options: [
      "std::set<int>(std::greater<int>())",
      "std::reverse_set<int>",
      "std::set<int, std::greater<int>>",
      "std::set<int, std::less<int>>",
    ],
    correctIndex: 2,
    explanation:
      "The second template parameter of std::set is the comparator. std::greater<int> reverses the default std::less<int> ordering, producing descending order. The same technique works for std::map, std::priority_queue, etc.",
    link: "https://en.cppreference.com/w/cpp/container/set.html",
  },
  {
    id: 159,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "Before C++20, checking if a key exists in a std::map required m.find(key) != m.end() or m.count(key). What does C++20 add?",
    options: [
      "m.check(key)",
      "m.contains(key)",
      "m.exists(key)",
      "m.has(key)",
    ],
    correctIndex: 1,
    explanation:
      "C++20 added contains() to all associative and unordered associative containers. It returns a bool directly, making code clearer than the find/end idiom. contains() does not insert or modify the container.",
    link: "https://en.cppreference.com/w/cpp/container/map/contains.html",
  },
  {
    id: 160,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "What does std::list provide that std::forward_list does not?",
    options: [
      "Random access via operator[] with constant-time element retrieval",
      "O(1) push_front and O(1) pop_front for efficient head operations",
      "Contiguous memory storage that enables pointer arithmetic on elements",
      "Bidirectional iteration, push_back(), and an O(1) size() function",
    ],
    correctIndex: 3,
    explanation:
      "std::list is doubly-linked, supporting iteration in both directions, push_back(), and constant-time size() (since C++11). std::forward_list is singly-linked and omits these to minimize per-node memory overhead.",
    link: "https://en.cppreference.com/w/cpp/container/list.html",
  },
  {
    id: 161,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "When two different keys hash to the same bucket in std::unordered_map, how are they stored?",
    options: [
      "The map throws std::runtime_error to signal that a hash collision has occurred in the bucket",
      "The second key silently replaces the first, discarding the original key-value pair entirely",
      "They are stored in a linked list within that bucket",
      "The second key is placed in the next empty bucket using open addressing with linear probing",
    ],
    correctIndex: 2,
    explanation:
      "The C++ standard requires that std::unordered_map use chaining (also called separate chaining) for collision resolution. Each bucket contains a linked list of elements. This is why iterators to existing elements remain valid after insertions (unless rehashing occurs).",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 162,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What advantage does map::try_emplace(key, args...) (C++17) have over map::emplace(key, args...)?",
    options: [
      "try_emplace allows multiple values per key, effectively turning the map into a multimap",
      "try_emplace is always faster due to reduced comparisons during the tree traversal phase",
      "try_emplace does not move-from or construct the value arguments if the key already exists",
      "try_emplace returns void instead of a pair, simplifying the call site for insert operations",
    ],
    correctIndex: 2,
    explanation:
      "With emplace(), the value arguments may be moved-from even if the insertion fails (key exists). try_emplace guarantees that args... are untouched if the key is already present. This matters when the value is expensive to construct or when args are move-only.",
    link: "https://en.cppreference.com/w/cpp/container/map/try_emplace.html",
  },
  {
    id: 163,
    difficulty: "Medium",
    topic: "STL Containers",
    question:
      "What is the time complexity of inserting an element in the middle of a std::vector of n elements?",
    options: [
      "O(n log n) -- the vector re-sorts itself after each middle insertion",
      "O(log n) -- the vector uses binary search to find room for the new element",
      "O(1) -- the vector inserts in place without moving any existing elements",
      "O(n) -- all elements after the insertion point must be shifted",
    ],
    correctIndex: 3,
    explanation:
      "Inserting in the middle requires shifting all subsequent elements one position to make room. On average, this involves moving n/2 elements, which is O(n). For frequent middle insertions, consider std::list (O(1) insert at a known position).",
    link: "https://en.cppreference.com/w/cpp/container/vector/insert.html",
  },
  {
    id: 164,
    difficulty: "Medium",
    topic: "STL Containers",
    question: "How does std::multiset differ from std::set?",
    options: [
      "multiset uses a hash table instead of a tree",
      "multiset allows multiple elements with the same value",
      "multiset does not keep elements sorted",
      "multiset only works with integer types",
    ],
    correctIndex: 1,
    explanation:
      "std::multiset allows duplicate elements while still maintaining sorted order. Use count() to see how many copies of a value exist, or equal_range() to get iterators to all matching elements.",
    link: "https://en.cppreference.com/w/cpp/container/multiset.html",
  },
  {
    id: 165,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "What does std::map::extract(key) (C++17) return, and why is it useful?",
    options: [
      "A std::optional containing the value, or std::nullopt if the key was not found in the map",
      "A node handle that owns the extracted element",
      "An iterator to the next element in sorted order after the removed one, enabling continued traversal",
      "A copy of the value associated with the key",
    ],
    correctIndex: 1,
    explanation:
      "extract() unlinks a node from the map and returns a node_handle. You can modify the node's key (normally impossible) and reinsert it into the same or another map. No memory allocation or deallocation occurs during the entire process.",
    link: "https://en.cppreference.com/w/cpp/container/map/extract.html",
  },
  {
    id: 166,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "To use a custom type as a key in std::unordered_map, what must you provide?",
    options: [
      "Only operator< for the type to establish ordering within each hash bucket",
      "Only a conversion to std::string, which the default hash function then processes",
      "A hash function and an equality operator (operator==) for the type",
      "A comparison function and a swap function to enable bucket-level sorting",
    ],
    correctIndex: 2,
    explanation:
      "std::unordered_map needs a hash function to assign keys to buckets and operator== to handle collisions (determine if two keys in the same bucket are actually equal). You can provide the hash as a template argument or specialize std::hash<T>.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 167,
    difficulty: "Hard",
    topic: "STL Containers",
    question: "Why is std::vector<bool> considered problematic?",
    options: [
      "It cannot be resized after construction, making it behave more like std::array than std::vector",
      "It is not a true container",
      "It uses more memory than std::bitset for the same number of booleans due to internal bookkeeping overhead",
      "It does not support push_back() or emplace_back() like other vector specializations, limiting dynamic usage",
    ],
    correctIndex: 1,
    explanation:
      "std::vector<bool> is a space-optimized specialization that stores one bit per element. Because you can't have a reference to a single bit, operator[] returns a proxy object instead of bool&. This breaks code that expects &v[0] to work or takes references to elements. Prefer std::vector<char> or std::bitset if this matters.",
    link: "https://en.cppreference.com/w/cpp/container/vector_bool.html",
  },
  {
    id: 168,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "In std::unordered_map, two distinct keys end up in the same bucket. How are they distinguished?",
    options: [
      "By calling operator== on the keys",
      "By their insertion order within the bucket",
      "By comparing their hash values at full precision",
      "They cannot be distinguished once in the same bucket",
    ],
    correctIndex: 0,
    explanation:
      "A hash collision means two different keys produce the same bucket index. The container traverses the bucket's chain and calls operator== to find the exact key. This is why both a hash function and an equality comparison are required for unordered containers.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 169,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "std::vector::push_back() occasionally triggers a full reallocation. What is its amortized time complexity, and why?",
    options: [
      "O(1) amortized -- geometric growth ensures that the average cost per push_back is constant over a sequence of operations",
      "O(log n) amortized",
      "O(n) amortized -- each push_back must copy all existing elements into the newly allocated buffer every time it is called",
      "O(1) worst-case",
    ],
    correctIndex: 0,
    explanation:
      "Vectors grow by a constant factor (typically 1.5x or 2x). A reallocation that copies n elements is expensive, but it happens after n insertions since the last reallocation. Spreading the O(n) cost over those n operations gives O(1) per push_back on average.",
    link: "https://en.cppreference.com/w/cpp/container/vector/push_back.html",
  },
  {
    id: 170,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "What does the load factor of an std::unordered_map represent, and what happens when it exceeds max_load_factor()?",
    options: [
      "The ratio of memory used to memory allocated",
      "The percentage of empty buckets remaining",
      "The ratio of element count to bucket count",
      "The number of hash collisions per bucket",
    ],
    correctIndex: 2,
    explanation:
      "load_factor() = size() / bucket_count(). When it exceeds max_load_factor() (default 1.0), the container automatically rehashes -- allocating more buckets and redistributing elements. This keeps average chain length short, maintaining O(1) average lookup.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map/load_factor.html",
  },
  {
    id: 171,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "Short strings in most std::string implementations avoid heap allocation entirely. What is this optimization called?",
    options: [
      "Copy-on-write (COW)",
      "Small String Optimization (SSO)",
      "Compile-time string evaluation",
      "String interning",
    ],
    correctIndex: 1,
    explanation:
      "SSO uses the bytes of the string object itself (typically 16–32 bytes depending on implementation) to store short strings without any heap allocation. Only when the string exceeds this internal buffer does the implementation allocate on the heap. This is a major performance win since most strings in practice are short.",
    link: "https://en.cppreference.com/w/cpp/string/basic_string.html",
  },
  {
    id: 172,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "In which scenario is std::deque a better choice than std::vector?",
    options: [
      "When you need guaranteed contiguous memory layout for interoperability with C APIs",
      "When you frequently insert and remove elements at both the front and back",
      "When you need iterators that are never invalidated by insert or erase",
      "When you need random access to elements to be faster than O(1) amortized",
    ],
    correctIndex: 1,
    explanation:
      "std::deque supports O(1) push_front() and push_back() without invalidating references to existing elements (unless inserting in the middle). std::vector only has O(1) push_back(). However, deque lacks contiguous memory, so it cannot be passed to C APIs expecting a pointer.",
    link: "https://en.cppreference.com/w/cpp/container/deque.html",
  },
  {
    id: 173,
    difficulty: "Hard",
    topic: "STL Containers",
    question: "What does a.merge(b) do for two std::maps? (C++17)",
    code: `std::map<int,std::string> a = {{1,"one"}, {3,"three"}};\nstd::map<int,std::string> b = {{2,"two"}, {3,"THREE"}};\na.merge(b);`,
    options: [
      "Both maps are cleared and a new separately allocated merged map is returned as the result value",
      "a receives all elements from b regardless of key conflicts; b becomes completely empty after the operation",
      "Nodes from b whose keys don't exist in a are transferred to a; conflicting keys stay in b",
      "b is appended to a without any deduplication, creating duplicate keys in the resulting container",
    ],
    correctIndex: 2,
    explanation:
      "merge() moves nodes (not elements) from b into a. If a key already exists in a, that node stays in b. After the merge, a = {{1,\"one\"}, {2,\"two\"}, {3,\"three\"}} and b = {{3,\"THREE\"}}. No copying, moving, or allocation occurs -- only internal pointer relinking.",
    link: "https://en.cppreference.com/w/cpp/container/map/merge.html",
  },
  {
    id: 174,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "Why is iterating over a std::unordered_map with 10,000 elements typically slower than iterating over a std::vector of the same 10,000 elements?",
    options: [
      "unordered_map iterators are more complex objects that require additional CPU instructions per increment during traversal",
      "unordered_map nodes are scattered across the heap, causing frequent cache misses",
      "unordered_map must rehash each element during iteration to verify that it is still in the correct bucket placement",
      "unordered_map iteration has O(n log n) complexity due to bucket traversal, while vector iteration is always O(n)",
    ],
    correctIndex: 1,
    explanation:
      "std::unordered_map is a node-based container -- each element is a separately heap-allocated node. Iterating jumps between random memory locations, causing CPU cache misses. std::vector stores elements contiguously, so prefetching fills cache lines efficiently. Both are O(n), but the constant factor differs dramatically.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map.html",
  },
  {
    id: 175,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "How do you safely erase elements from a std::map while iterating over it?",
    code: `std::map<int,int> m = {{1,10},{2,20},{3,30},{4,40}};\nfor (auto it = m.begin(); it != m.end(); ) {\n    if (it->second > 15)\n        it = m.erase(it);\n    else\n        ++it;\n}`,
    options: [
      "This code has undefined behavior",
      "You must iterate in reverse using reverse iterators to safely erase elements during traversal",
      "This is correct",
      "You must use std::remove_if to mark elements for removal, then call erase on the range separately",
    ],
    correctIndex: 2,
    explanation:
      "For associative containers (map, set, etc.), erase() invalidates only the erased iterator. It returns an iterator to the next element (since C++11). The pattern shown -- using the return value of erase() -- is the idiomatic safe approach.",
    link: "https://en.cppreference.com/w/cpp/container/map/erase.html",
  },
  {
    id: 176,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "std::set::insert() returns a std::pair<iterator, bool>. Why does it return a pair instead of just an iterator?",
    options: [
      "The pair format is a legacy design from early C++ that cannot be changed now due to ABI compatibility rules",
      "The bool indicates whether the container was reallocated to accommodate the new element being inserted",
      "The iterator points to the previous element; the bool indicates if the set was empty before the insert call",
      "The bool indicates whether the insertion actually occurred",
    ],
    correctIndex: 3,
    explanation:
      "Since std::set rejects duplicates, you need to know whether a new element was actually added (true) or the value already existed (false). The iterator always points to the element with that value, whether newly inserted or previously existing.",
    link: "https://en.cppreference.com/w/cpp/container/set/insert.html",
  },
  {
    id: 177,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "What happens to pointers and references to elements of a std::map when other elements are inserted or erased?",
    options: [
      "They are valid only if the map has fewer than 1024 elements",
      "They remain valid",
      "Only references are invalidated because the tree rewires them during rebalancing; raw pointers bypass this and remain stable",
      "They are invalidated",
    ],
    correctIndex: 1,
    explanation:
      "std::map (and all node-based containers like set, list, unordered_map) allocate each element in its own node. Inserting or erasing other elements relinks pointers between nodes but never moves existing nodes in memory. This is a key advantage over contiguous containers like std::vector.",
    link: "https://en.cppreference.com/w/cpp/container/map.html",
  },
  {
    id: 178,
    difficulty: "Hard",
    topic: "STL Containers",
    question:
      "The C++ standard guarantees that std::vector elements are stored contiguously. What important consequence does this have?",
    options: [
      "Pointer arithmetic on vector elements is valid: &v[0] + n == &v[n], and &v[0] can be passed to any C function expecting an array",
      "The vector can never grow beyond the initially allocated capacity without explicitly calling reserve() a second time",
      "Elements cannot be polymorphic -- storing derived objects by value in a vector causes object slicing, preventing virtual dispatch",
      "Elements must be trivially copyable -- types with custom constructors or destructors cannot be stored in a vector",
    ],
    correctIndex: 0,
    explanation:
      "The contiguity guarantee means &v[0] gives you a pointer to a true C-style array. You can pass it to C APIs like memcpy, fwrite, or any function expecting a pointer and size. This is the reason v.data() exists and why vector is the default container for interoperating with C code.",
    link: "https://en.cppreference.com/w/cpp/container/vector.html",
  },
];
