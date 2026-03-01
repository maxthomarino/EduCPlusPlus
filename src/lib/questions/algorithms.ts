import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 13,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "Why does std::sort not work with std::list?",
    options: [
      "std::list elements are always const",
      "std::list iterators are not random-access",
      "std::list does not support the < operator",
      "std::list has no iterators",
    ],
    correctIndex: 1,
    explanation:
      "std::sort requires random-access iterators for its O(n log n) introsort algorithm. std::list provides only bidirectional iterators. Use list::sort() instead.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 14,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What is the main advantage of C++20 range views over traditional STL algorithms with intermediate containers?",
    options: [
      "They are always faster at runtime due to compiler vectorization",
      "They evaluate lazily, avoiding intermediate copies and allocations",
      "They are constexpr by default and run entirely at compile time",
      "They work on C-style arrays but traditional STL algorithms do not",
    ],
    correctIndex: 1,
    explanation:
      "Views compose into pipelines where each element is processed on-demand. No intermediate vector or container is created between steps.",
    link: "https://en.cppreference.com/w/cpp/ranges.html",
  },
  {
    id: 46,
    difficulty: "Easy",
    topic: "Algorithms",
    question:
      "What does std::find(v.begin(), v.end(), 42) return if 42 is not in the vector?",
    options: [
      "An iterator to v.end()",
      "A null pointer",
      "Throws std::out_of_range",
      "An iterator to the last element",
    ],
    correctIndex: 0,
    explanation:
      "All STL search algorithms return the past-the-end iterator to signal 'not found.' You must check the result against end() before dereferencing.",
    link: "https://en.cppreference.com/w/cpp/algorithm/find.html",
  },
  {
    id: 512,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does Big-O notation describe?",
    options: [
      "The exact number of CPU cycles an algorithm takes, measured by counting each arithmetic operation and memory access individually",
      "The upper bound on how an algorithm's time or space requirements grow as the input size grows, ignoring constant factors",
      "The minimum possible runtime of an algorithm",
      "The amount of memory an algorithm uses at peak, measured in bytes relative to the input size without considering time complexity",
    ],
    correctIndex: 1,
    explanation:
      "Big-O describes asymptotic growth rate. O(n) means runtime grows linearly with input size. O(n²) means quadratic growth. It ignores constant factors and lower-order terms because these become irrelevant for large inputs. It's an upper bound -- the worst-case or average-case growth rate.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/",
  },
  {
    id: 513,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::sort require from its iterator range?",
    code: `std::vector<int> v = {5, 3, 1, 4, 2};\nstd::sort(v.begin(), v.end());  // {1, 2, 3, 4, 5}`,
    options: [
      "Forward iterators and an equality operator",
      "Random access iterators and a less-than comparison. It runs in O(n log n) average time",
      "Input iterators and a hash function",
      "Bidirectional iterators only",
    ],
    correctIndex: 1,
    explanation:
      "std::sort requires random access iterators (for efficient indexing) and uses operator< by default. It's typically implemented as introsort (quicksort + heapsort fallback), giving O(n log n) guaranteed. You can pass a custom comparator as the third argument.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 514,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "How does std::find search for an element?",
    code: `std::vector<int> v = {10, 20, 30, 40};\nauto it = std::find(v.begin(), v.end(), 30);\nif (it != v.end()) std::cout << *it;  // 30`,
    options: [
      "Hash lookup -- O(1), because std::find builds a temporary hash table from the range and then probes it for the target",
      "It sorts the range first in O(n log n) time, then uses binary search to find the element in O(log n) for an overall O(n log n)",
      "Binary search -- O(log n), because std::find sorts the range internally and then uses a divide-and-conquer lookup",
      "Linear scan from begin to end",
    ],
    correctIndex: 3,
    explanation:
      "std::find performs a simple linear search, checking each element with operator==. It works on any input range (not just sorted). For sorted ranges, use std::lower_bound (O(log n)). For hash-based O(1) lookup, use std::unordered_set/map.",
    link: "https://en.cppreference.com/w/cpp/algorithm/find.html",
  },
  {
    id: 515,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::transform do?",
    code: `std::vector<int> v = {1, 2, 3, 4};\nstd::vector<int> result(v.size());\nstd::transform(v.begin(), v.end(), result.begin(),\n    [](int x) { return x * x; });\n// result = {1, 4, 9, 16}`,
    options: [
      "Applies a function to each element in the input range and writes the results to the output range",
      "Sorts the elements using the lambda as a comparison function, similar to passing a custom comparator to std::sort",
      "Filters elements that match the lambda, removing all elements for which the lambda returns false from the output range",
      "Rearranges elements according to the lambda by using it as a priority function that determines the new position of each element",
    ],
    correctIndex: 0,
    explanation:
      "std::transform applies a unary (or binary) operation to each element and stores the results. It's the C++ equivalent of functional map(). The output range can be the same as the input for in-place transformation.",
    link: "https://en.cppreference.com/w/cpp/algorithm/transform.html",
  },
  {
    id: 516,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::accumulate do?",
    code: `std::vector<int> v = {1, 2, 3, 4, 5};\nint sum = std::accumulate(v.begin(), v.end(), 0);  // 15`,
    options: [
      "Counts the number of elements in the range that are greater than the initial value passed as the third argument. It increments an internal counter for each qualifying element in the range",
      "Finds the maximum element in the range by comparing each element against a running maximum value starting from the initial argument. It returns the largest value found in the sequence",
      "Folds/reduces the range into a single value by repeatedly applying a binary operation with an initial value. Like 'reduce' or 'fold' in functional programming",
      "Accumulates elements into a new container by appending each element from the source range to a dynamically growing output sequence. It returns the fully populated container by value",
    ],
    correctIndex: 2,
    explanation:
      "std::accumulate (from <numeric>) starts with init=0, then computes 0+1+2+3+4+5=15. You can pass a custom binary op: accumulate(begin, end, 1, std::multiplies<>{}) computes the product. Note: the init type determines the result type -- use 0.0 for doubles.",
    link: "https://en.cppreference.com/w/cpp/algorithm/accumulate.html",
  },
  {
    id: 517,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What is the difference between std::remove and actually erasing elements?",
    code: `std::vector<int> v = {1, 2, 3, 2, 4};\nauto newEnd = std::remove(v.begin(), v.end(), 2);\n// v is now {1, 3, 4, ?, ?} with newEnd pointing past 4\nv.erase(newEnd, v.end());  // actually shrinks: {1, 3, 4}`,
    options: [
      "std::remove and erase are identical",
      "std::remove only shifts non-removed elements forward and returns a new logical end",
      "std::remove sorts the elements first to group matching elements at the end, and then truncates the container to remove them. The algorithm uses a modified quicksort partition to cluster matched elements contiguously for efficient batch deletion",
      "std::remove deletes elements from the container, freeing their memory and reducing the container's size in a single operation. It calls the destructor for each removed element and updates the internal bookkeeping to reflect the smaller size",
    ],
    correctIndex: 1,
    explanation:
      "std::remove is an algorithm that works on iterators -- it doesn't know about the container. It overwrites removed elements by shifting keepers forward, then returns an iterator to the new logical end. The erase-remove idiom (or C++20's std::erase) combines both steps.",
    link: "https://en.cppreference.com/w/cpp/algorithm/remove.html",
  },
  {
    id: 518,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What does std::lower_bound return and what are its requirements?",
    code: `std::vector<int> v = {10, 20, 30, 30, 40};\nauto it = std::lower_bound(v.begin(), v.end(), 30);`,
    options: [
      "An iterator to the first element not less than 30. The range must be sorted. Uses binary search for O(log n) with random access iterators",
      "An iterator to the element immediately before 30 in the sorted order",
      "An iterator to the last 30 in the range",
      "The index of the smallest element in the range",
    ],
    correctIndex: 0,
    explanation:
      "lower_bound returns an iterator to the first element >= the value. upper_bound returns the first element > the value. Together they define the equal range. The range must be partitioned (sorted) with respect to the comparison. O(log n) for random access iterators, O(n) for forward iterators.",
    link: "https://en.cppreference.com/w/cpp/algorithm/lower_bound.html",
  },
  {
    id: 519,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "How do you sort with a custom comparator?",
    code: `struct Student { std::string name; int grade; };\nstd::vector<Student> students;\nstd::sort(students.begin(), students.end(),\n    [](const Student& a, const Student& b) {\n        return a.grade > b.grade;  // descending\n    });`,
    options: [
      "The comparator is a binary predicate that returns true if the first argument should come before the second in the sorted order. It must define a strict weak ordering",
      "Custom sorting requires overloading operator< on the element type",
      "The comparator takes one argument and returns a sort key",
      "The lambda must return an int like strcmp",
    ],
    correctIndex: 0,
    explanation:
      "The comparator must satisfy strict weak ordering: comp(a,a) is false, if comp(a,b) then !comp(b,a), and transitivity. Returning a.grade > b.grade sorts descending. Violating these rules (e.g., using >= instead of >) is undefined behavior and can cause crashes or infinite loops.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 520,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What does std::partition do and what is its time complexity?",
    code: `std::vector<int> v = {1, 7, 3, 8, 2, 9, 4};\nauto pivot = std::partition(v.begin(), v.end(),\n    [](int x) { return x < 5; });\n// v: {1, 4, 3, 2, | 8, 9, 7}  (partition point at |)`,
    options: [
      "Divides the range into two equal halves by count, placing the smaller half before the larger half regardless of element values. The algorithm splits the range at the midpoint index to ensure both partitions have the same number of elements",
      "Removes elements that don't satisfy the predicate from the container and reduces the container's size to include only matching elements. Non-matching elements are destroyed and their memory is returned to the allocator during the operation",
      "Sorts the range into two sorted halves",
      "Rearranges elements so that all elements satisfying the predicate come before those that don't. Returns an iterator to the partition point. O(n) time, no extra memory. Elements within each partition are not sorted",
    ],
    correctIndex: 3,
    explanation:
      "std::partition is a linear-time rearrangement. All 'true' elements end up before all 'false' elements, but their relative order within each group is unspecified. Use std::stable_partition to preserve relative order (at the cost of O(n log n) or O(n) with extra memory).",
    link: "https://en.cppreference.com/w/cpp/algorithm/partition.html",
  },
  {
    id: 521,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What is the difference between std::for_each and a range-based for loop?",
    code: `std::for_each(v.begin(), v.end(), [](int& x) { x *= 2; });\n// vs\nfor (auto& x : v) { x *= 2; }`,
    options: [
      "Range-for can't modify elements",
      "for_each is always faster because it uses compiler intrinsics to unroll the loop and apply SIMD vectorization automatically. The standard mandates that implementations exploit hardware vector units when the element type supports parallel operations",
      "for_each requires random access iterators, while range-for works with any iterable type including forward and input iterators. The for_each implementation internally uses iterator arithmetic (it + n) to skip elements, demanding random access",
      "Functionally similar, but std::for_each works with any iterator pair, can be passed to higher-order functions, and returns the function object. Range-for is simpler syntax but always iterates the entire container",
    ],
    correctIndex: 3,
    explanation:
      "Both iterate and apply an operation. for_each accepts arbitrary iterator ranges (not just begin/end), can be parallelized with execution policies (std::for_each(std::execution::par, ...)), and returns the functor. Range-for is cleaner for simple full-container iteration.",
    link: "https://en.cppreference.com/w/cpp/algorithm/for_each.html",
  },
  {
    id: 522,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "What does std::nth_element guarantee and what is its complexity?",
    code: `std::vector<int> v = {5, 1, 9, 3, 7, 2, 8};\nstd::nth_element(v.begin(), v.begin() + 3, v.end());\n// v[3] == 5 (the 4th smallest), elements before it are <=5, after are >=5`,
    options: [
      "It fully sorts the range in O(n log n) using quicksort, despite its name suggesting it only operates on the nth element. The algorithm recursively partitions the array until every element is in its final sorted position",
      "It finds the nth element without modifying the range, returning an iterator to the nth smallest element while leaving all elements in place. The algorithm reads but never writes, preserving the original element order",
      "It places the nth element in its sorted position with smaller elements before and larger after, but neither side is sorted. Average O(n)",
      "It's equivalent to partial_sort",
    ],
    correctIndex: 2,
    explanation:
      "nth_element uses introselect (quickselect with fallback), giving O(n) average complexity. After the call, element n is in its sorted position, and the range is partitioned around it. Use this for finding the median, kth-largest, or partitioning around a value -- much faster than sorting the entire range.",
    link: "https://en.cppreference.com/w/cpp/algorithm/nth_element.html",
  },
  {
    id: 523,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "How do execution policies (C++17) parallelize algorithms?",
    code: `#include <execution>\nstd::sort(std::execution::par, v.begin(), v.end());`,
    options: [
      "They have no effect",
      "Execution policies tell the algorithm HOW to execute: seq (sequential), par, par_unseq. The implementation may use a thread pool. Element access must be data-race-free; exceptions during parallel execution call std::terminate",
      "They only work with std::for_each",
      "They require OpenMP to be installed as a system-level dependency, because the C++ standard library delegates all parallelism to the OpenMP runtime. The execution policy tag is translated into an OpenMP pragma that the compiler processes during parallel lowering",
    ],
    correctIndex: 1,
    explanation:
      "std::execution::par allows the algorithm to split work across multiple threads. par_unseq additionally allows SIMD vectorization (your functor must not acquire locks). If an exception is thrown during parallel execution, std::terminate is called (no stack unwinding). Not all standard library implementations support this yet.",
    link: "https://en.cppreference.com/w/cpp/algorithm/execution_policy_tag.html",
  },
  {
    id: 524,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "Why is std::stable_sort slower than std::sort, and when should you use it?",
    options: [
      "stable_sort is always faster because the merge sort algorithm it uses has better cache locality and fewer comparisons than introsort. The sequential access pattern of merge sort exploits hardware prefetchers more effectively, resulting in fewer cache misses on large arrays",
      "stable_sort preserves the relative order of equivalent elements (stability) but typically uses merge sort (O(n log n) time, O(n) extra space) vs sort's introsort (O(n log n) time, O(1) space). Use stable_sort when relative order matters",
      "stable_sort has O(n squared) complexity because it uses insertion sort internally, trading speed for guaranteed stability of equal elements. The algorithm compares and shifts each element into its correct position one at a time, resulting in quadratic behavior on random input",
      "stable_sort only works on linked lists",
    ],
    correctIndex: 1,
    explanation:
      "Stability means equal elements keep their original relative order. std::sort (introsort) is unstable but uses O(log n) stack space. std::stable_sort (merge sort) is stable but needs O(n) extra memory. If sufficient memory isn't available, it falls back to an O(n log² n) in-place merge sort.",
    link: "https://en.cppreference.com/w/cpp/algorithm/stable_sort.html",
  },
  {
    id: 525,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "What is the algorithmic difference between std::set_intersection and a manual nested loop approach?",
    code: `std::vector<int> a = {1, 2, 3, 4, 5};\nstd::vector<int> b = {3, 4, 5, 6, 7};\nstd::vector<int> result;\nstd::set_intersection(a.begin(), a.end(),\n    b.begin(), b.end(),\n    std::back_inserter(result));  // {3, 4, 5}`,
    options: [
      "Both are O(n squared)",
      "set_intersection uses hashing for O(1) lookup by building a temporary hash table from the first range and probing it with the second. The algorithm allocates a hash set proportional to the smaller range to accelerate membership queries",
      "There is no difference",
      "set_intersection uses a merge-like two-pointer technique on sorted ranges giving O(n + m) time, while a naive nested loop is O(n × m). Both ranges must be sorted. The algorithm advances both iterators simultaneously",
    ],
    correctIndex: 3,
    explanation:
      "Like merging two sorted arrays, set_intersection walks both ranges with two pointers. If *a < *b, advance a. If *b < *a, advance b. If equal, output and advance both. This is O(n+m) vs O(nm) for brute force. All set operations (union, difference, symmetric_difference) work the same way.",
    link: "https://en.cppreference.com/w/cpp/algorithm/set_intersection.html",
  },
  {
    id: 526,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "How does std::make_heap / std::priority_queue work internally?",
    code: `std::vector<int> v = {3, 1, 4, 1, 5};\nstd::make_heap(v.begin(), v.end());\n// v is now a max-heap: {5, 3, 4, 1, 1}`,
    options: [
      "It rearranges the array into a binary max-heap stored in array form: element i's children are at 2i+1 and 2i+2. make_heap runs in O(n) via bottom-up heapification. push_heap and pop_heap are O(log n). priority_queue wraps this with a clean API",
      "It uses a hash table internally, mapping element values to their priority scores for O(1) access to the highest-priority element. The implementation maintains a hash map from values to priority indices that supports constant-time max extraction",
      "It creates a separate tree data structure on the heap, with each node containing a value and pointers to its children. The algorithm allocates a node for every element and links them into a pointer-based binary tree using new for each allocation",
      "It sorts the array in descending order and renames it a heap",
    ],
    correctIndex: 0,
    explanation:
      "A binary heap is stored in a flat array where parent i has children 2i+1, 2i+2. make_heap builds the heap bottom-up in O(n) (not O(n log n) -- the math works out because most nodes are near the bottom). std::priority_queue is a container adaptor that wraps a vector with heap operations.",
    link: "https://en.cppreference.com/w/cpp/algorithm/make_heap.html",
  },
  {
    id: 1032,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What is the average time complexity of std::sort?",
    options: [
      "O(n log n) -- it uses an introsort hybrid",
      "O(n^2) -- it uses basic insertion sort",
      "O(n) -- it uses a counting sort method",
      "O(log n) -- it uses binary divide steps",
    ],
    correctIndex: 0,
    explanation:
      "std::sort uses introsort, a hybrid of quicksort, heapsort, and insertion sort. Its average and worst-case complexity is O(n log n), as guaranteed by the C++ standard.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 1033,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::find return if the element is not found in the range?",
    options: [
      "A default-constructed iterator value",
      "An iterator equal to the end iterator",
      "A null pointer to signal not found",
      "It throws a std::out_of_range error",
    ],
    correctIndex: 1,
    explanation:
      "std::find performs a linear search and returns an iterator to the first matching element. If no match is found, it returns the end iterator that was passed as the second argument.",
    link: "https://en.cppreference.com/w/cpp/algorithm/find.html",
  },
  {
    id: 1034,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::count return for a given range and value?",
    code: `std::vector<int> v = {3, 1, 4, 1, 5, 1};
auto result = std::count(v.begin(), v.end(), 1);`,
    options: [
      "A boolean true if 1 exists in v",
      "An iterator to the first 1 found",
      "The number of elements equal to 1",
      "The index of the last 1 in the v",
    ],
    correctIndex: 2,
    explanation:
      "std::count returns the number of elements in the range that are equal to the given value. In this example, 1 appears three times, so the result is 3.",
    link: "https://en.cppreference.com/w/cpp/algorithm/count.html",
  },
  {
    id: 1035,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "Which header must you include to use std::accumulate?",
    options: [
      "You must include the <algorithm> header",
      "You must include the <functional> header",
      "You must include the <iterator> header file",
      "You must include the <numeric> header file",
    ],
    correctIndex: 3,
    explanation:
      "std::accumulate is defined in the <numeric> header, not <algorithm>. It computes the sum (or a general fold) of elements in a range, starting from an initial value.",
    link: "https://en.cppreference.com/w/cpp/algorithm/accumulate.html",
  },
  {
    id: 1036,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::reverse do to the elements in a range?",
    code: `std::vector<int> v = {1, 2, 3, 4, 5};
std::reverse(v.begin(), v.end());
// What is v now?`,
    options: [
      "It reverses elements in-place: {5, 4, 3, 2, 1}",
      "It returns a new reversed copy and leaves v alone",
      "It sorts v in descending order: {5, 4, 3, 2, 1}",
      "It rotates the elements left by one: {2, 3, 4, 5, 1}",
    ],
    correctIndex: 0,
    explanation:
      "std::reverse reverses the order of elements in the range [first, last) in-place. It does not return a new container. After the call, v becomes {5, 4, 3, 2, 1}.",
    link: "https://en.cppreference.com/w/cpp/algorithm/reverse.html",
  },
  {
    id: 1037,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::max_element return when called on a non-empty range?",
    options: [
      "It returns the maximum value as an integer copy",
      "An iterator pointing to the largest element found",
      "A pair containing the min and the max elements",
      "The index of the largest element in the container",
    ],
    correctIndex: 1,
    explanation:
      "std::max_element returns an iterator to the greatest element in the range [first, last). You can dereference the iterator to get the actual value. For the index, subtract begin() from the result.",
    link: "https://en.cppreference.com/w/cpp/algorithm/max_element.html",
  },
  {
    id: 1038,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What is a precondition for using std::binary_search on a range?",
    options: [
      "The container must support random access iterators only",
      "The range must have no duplicate values at all inside",
      "Each element must be a primitive type like int or char",
      "The range must be sorted with respect to the comparator",
    ],
    correctIndex: 3,
    explanation:
      "std::binary_search requires the range to be sorted (or at least partitioned) with respect to the comparator used. It returns a bool indicating whether the value exists in the range.",
    link: "https://en.cppreference.com/w/cpp/algorithm/binary_search.html",
  },
  {
    id: 1039,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::copy do with the elements in a source range?",
    options: [
      "It moves elements, leaving the source in a blank state",
      "It swaps elements between the source and destination now",
      "It copies elements from the source to the destination range",
      "It removes duplicates and copies unique elements to dest",
    ],
    correctIndex: 2,
    explanation:
      "std::copy copies each element from the input range [first, last) to the output range starting at the destination iterator. The source range is not modified. For moving, use std::move instead.",
    link: "https://en.cppreference.com/w/cpp/algorithm/copy.html",
  },
  {
    id: 1040,
    difficulty: "Easy",
    topic: "Algorithms",
    question: "What does std::fill do to a given range?",
    code: `std::vector<int> v(5);
std::fill(v.begin(), v.end(), 42);
// What is v now?`,
    options: [
      "Sets every element to 42: {42, 42, 42, 42, 42}",
      "Appends 42 to the end giving v a size of six now",
      "Fills only the first element with 42 and skips rest",
      "Replaces elements greater than 42 and keeps the rest",
    ],
    correctIndex: 0,
    explanation:
      "std::fill assigns the given value to every element in the range [first, last). After the call, all five elements in v are set to 42.",
    link: "https://en.cppreference.com/w/cpp/algorithm/fill.html",
  },
  {
    id: 1041,
    difficulty: "Easy",
    topic: "Algorithms",
    question:
      "How does std::swap exchange two values in modern C++ (C++11 and later)?",
    options: [
      "It always uses three copy assignments to swap values",
      "It creates a deep clone of both objects then exchanges",
      "It uses a temporary variable and two copy constructors",
      "It uses move semantics to efficiently exchange the values",
    ],
    correctIndex: 3,
    explanation:
      "Since C++11, std::swap is implemented using std::move, performing one move construction and two move assignments. This avoids expensive copies for types that support move semantics.",
    link: "https://en.cppreference.com/w/cpp/algorithm/swap.html",
  },
  {
    id: 1042,
    difficulty: "Medium",
    topic: "Algorithms",
    question:
      "What does this lambda do when passed to std::sort as the third argument?",
    code: `std::vector<int> v = {3, 1, 4, 1, 5};
std::sort(v.begin(), v.end(),
    [](int a, int b) { return a > b; });`,
    options: [
      "Sorts v in descending order",
      "Sorts v in ascending order",
      "Removes duplicate elements from v",
      "Reverses v without sorting",
    ],
    correctIndex: 0,
    explanation:
      "The comparator defines a strict weak ordering where a > b means larger values are ordered before smaller ones. std::sort places element a before b when the comparator returns true. So return a > b gives descending order, while the default return a < b gives ascending order.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 1043,
    difficulty: "Medium",
    topic: "Algorithms",
    question:
      "What does std::partition return, and what guarantee does it provide about element ordering?",
    code: `std::vector<int> v = {8, 2, 9, 1, 7, 3};
auto it = std::partition(v.begin(), v.end(),
    [](int x) { return x < 5; });`,
    options: [
      "An iterator to the smallest element",
      "An iterator to the first element for which the predicate returns false",
      "A pair of iterators marking the boundaries of matching and non-matching groups so you can iterate each partition independently",
      "A boolean indicating whether any elements matched the predicate",
    ],
    correctIndex: 1,
    explanation:
      "std::partition rearranges elements so that all elements satisfying the predicate come before those that don't. It returns an iterator to the partition point -- the first element for which the predicate returns false. The relative order within each group is not guaranteed (use std::stable_partition if order matters). Complexity is O(n).",
    link: "https://en.cppreference.com/w/cpp/algorithm/partition.html",
  },
  {
    id: 1044,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What is the output of this code using std::transform?",
    code: `std::vector<int> a = {1, 2, 3};
std::vector<int> b = {10, 20, 30};
std::vector<int> c(3);
std::transform(a.begin(), a.end(), b.begin(), c.begin(),
    [](int x, int y) { return x + y; });
// What is c?`,
    options: [
      "c = {10, 20, 30}",
      "c = {1, 2, 3, 10, 20, 30}",
      "c = {11, 22, 33}",
      "c = {30, 60, 90}",
    ],
    correctIndex: 2,
    explanation:
      "The binary form of std::transform takes elements pairwise from two input ranges and applies the binary operation. Here it computes 1+10=11, 2+20=22, 3+30=33. The output range must be large enough to hold the results. This is like a zip-with-function operation from functional programming.",
    link: "https://en.cppreference.com/w/cpp/algorithm/transform.html",
  },
  {
    id: 1045,
    difficulty: "Medium",
    topic: "Algorithms",
    question:
      "Why must a range be sorted before calling std::unique to remove all duplicates?",
    code: `std::vector<int> v = {3, 1, 3, 2, 1};
// Without sorting: unique removes only consecutive duplicates
auto it1 = std::unique(v.begin(), v.end());
// v might be {3, 1, 3, 2, 1} -- no consecutive dups to remove

std::sort(v.begin(), v.end());  // {1, 1, 2, 3, 3}
auto it2 = std::unique(v.begin(), v.end());
// v is {1, 2, 3, ?, ?} -- all dups removed`,
    options: [
      "std::unique only removes consecutive duplicate elements",
      "std::unique uses binary search internally to locate duplicates, which requires sorted input",
      "std::unique modifies the comparison operator based on sort order",
      "Sorting is optional but improves performance from O(n squared) to O(n)",
    ],
    correctIndex: 0,
    explanation:
      "std::unique compares each element with its immediate predecessor and removes consecutive duplicates by shifting unique elements forward. Without sorting, duplicates scattered across the range won't be adjacent and won't be detected. After unique, call erase to actually shrink the container (the erase-unique idiom).",
    link: "https://en.cppreference.com/w/cpp/algorithm/unique.html",
  },
  {
    id: 1046,
    difficulty: "Medium",
    topic: "Algorithms",
    question:
      "What is the difference between std::lower_bound and std::upper_bound when searching for value 30?",
    code: `std::vector<int> v = {10, 20, 30, 30, 30, 40, 50};
auto lo = std::lower_bound(v.begin(), v.end(), 30);
auto hi = std::upper_bound(v.begin(), v.end(), 30);
// lo points to index 2, hi points to index 5`,
    options: [
      "lower_bound returns the last occurrence of 30 and upper_bound returns the first",
      "lower_bound returns the element just below 30 and upper_bound returns the element just above 30",
      "lower_bound points to the first element >= 30 and upper_bound points to the first element > 30",
      "lower_bound counts elements less than 30 and upper_bound counts elements greater than 30",
    ],
    correctIndex: 2,
    explanation:
      "lower_bound finds the first position where 30 could be inserted without breaking the sort order (first element >= 30). upper_bound finds the last such position (first element > 30). The distance between them (hi - lo = 3) gives the count of 30s. Both use binary search with O(log n) complexity for random access iterators.",
    link: "https://en.cppreference.com/w/cpp/algorithm/lower_bound.html",
  },
  {
    id: 1047,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What guarantees does std::nth_element provide after execution?",
    code: `std::vector<int> v = {9, 4, 7, 2, 5, 1, 8};
std::nth_element(v.begin(), v.begin() + 3, v.end());
// v[3] now holds the value that would be at index 3 if v were fully sorted`,
    options: [
      "It fully sorts the range in O(n log n) and then returns",
      "It places the median element at position n and leaves all other elements in their original positions completely unchanged from input",
      "It sorts only the first n elements in ascending order and leaves the rest completely unsorted in their original arrangement in the range",
      "The element at the nth position is the one that would be there in a sorted range",
    ],
    correctIndex: 3,
    explanation:
      "std::nth_element is a partial sorting algorithm with O(n) average complexity. It guarantees three things: (1) the element at nth position equals the sorted-order value, (2) all elements before nth are less than or equal to it, (3) all elements after are greater than or equal. It's ideal for finding medians or top-k elements without fully sorting.",
    link: "https://en.cppreference.com/w/cpp/algorithm/nth_element.html",
  },
  {
    id: 1048,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "When should you prefer std::stable_sort over std::sort?",
    code: `struct Employee { std::string name; int department; };
std::vector<Employee> emps = {{"Alice",2}, {"Bob",1}, {"Carol",2}, {"Dave",1}};
// Sort by department -- should Alice still appear before Carol in dept 2?
std::stable_sort(emps.begin(), emps.end(),
    [](const Employee& a, const Employee& b) {
        return a.department < b.department;
    });`,
    options: [
      "When you need equal elements to keep their original relative order",
      "When you want the fastest possible sort",
      "When sorting integers only",
      "When the range is nearly sorted already",
    ],
    correctIndex: 0,
    explanation:
      "std::stable_sort preserves the relative order of elements that compare equal. In the example, Alice and Carol are both in department 2 -- stable_sort guarantees Alice stays before Carol. std::sort may reorder them. stable_sort uses merge sort (O(n log n) guaranteed) and needs O(n) extra memory, while std::sort uses introsort and is typically faster.",
    link: "https://en.cppreference.com/w/cpp/algorithm/stable_sort.html",
  },
  {
    id: 1049,
    difficulty: "Medium",
    topic: "Algorithms",
    question:
      "Why is the erase-remove idiom necessary, and what does std::remove actually do to the container?",
    code: `std::vector<int> v = {1, 2, 3, 2, 4, 2, 5};
auto newEnd = std::remove(v.begin(), v.end(), 2);
// v.size() is still 7 here!
v.erase(newEnd, v.end());
// Now v.size() is 4: {1, 3, 4, 5}`,
    options: [
      "std::remove physically deletes elements and reduces the container size",
      "std::remove shifts non-matching elements forward and returns a new logical end",
      "std::remove marks elements for lazy deletion with a tombstone flag",
      "std::remove swaps matching elements to the front of the range for inspection",
    ],
    correctIndex: 1,
    explanation:
      "std::remove is an algorithm operating on iterators -- it has no knowledge of the container itself. It shifts elements that don't match the value forward, overwriting removed elements, and returns an iterator to the new logical end. The container's size is unchanged. You must call container.erase(newEnd, end()) to actually shrink it. C++20 introduced std::erase(container, value) as a shorthand.",
    link: "https://en.cppreference.com/w/cpp/algorithm/remove.html",
  },
  {
    id: 1050,
    difficulty: "Medium",
    topic: "Algorithms",
    question: "What happens if you pass unsorted ranges to std::set_intersection?",
    code: `std::vector<int> a = {3, 1, 4, 1, 5};
std::vector<int> b = {2, 7, 1, 8};
std::vector<int> result;
std::set_intersection(a.begin(), a.end(), b.begin(), b.end(),
    std::back_inserter(result));
// What is result?`,
    options: [
      "result = {1} -- the algorithm finds common elements by hashing both ranges into temporary sets and computing their intersection in O(n) time",
      "result = {1, 1}",
      "The algorithm silently produces an empty result",
      "The behavior is undefined",
    ],
    correctIndex: 3,
    explanation:
      "std::set_intersection, std::set_union, std::set_difference, and std::set_symmetric_difference all require both input ranges to be sorted with respect to the comparison. They use a merge-like O(n+m) linear scan that advances iterators based on ordering. Unsorted input violates the precondition, leading to undefined behavior.",
    link: "https://en.cppreference.com/w/cpp/algorithm/set_intersection.html",
  },
  {
    id: 1051,
    difficulty: "Medium",
    topic: "Algorithms",
    question:
      "Why does std::sort require random access iterators while std::find works with input iterators?",
    code: `std::list<int> lst = {5, 3, 1, 4, 2};
// std::sort(lst.begin(), lst.end());  // ERROR: list has bidirectional iterators, not random access
lst.sort();  // OK: list has its own sort member function

auto it = std::find(lst.begin(), lst.end(), 4);  // OK: find only needs input iterators`,
    options: [
      "std::sort modifies elements in place while std::find is read-only",
      "std::find needs random access too but falls back to linear scan automatically",
      "std::sort needs O(1) access to arbitrary positions for efficient partitioning and swapping, while std::find only advances sequentially forward",
      "Both algorithms actually work with any iterator category",
    ],
    correctIndex: 2,
    explanation:
      "std::sort uses introsort (quicksort + heapsort), which requires jumping to arbitrary positions via arithmetic like mid = begin + (end - begin) / 2. This needs random access iterators. std::find only scans sequentially with ++it, so input iterators suffice. std::list provides bidirectional iterators, so you must use its member function lst.sort() which uses merge sort internally.",
    link: "https://en.cppreference.com/w/cpp/iterator/random_access_iterator.html",
  },
  {
    id: 1052,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What hybrid algorithm does std::sort typically use internally, and why?",
    code: `#include <algorithm>
std::vector<int> v = {9, 3, 7, 1, 5, 8, 2, 6, 4};
std::sort(v.begin(), v.end());
// Internally: introsort = quicksort + heapsort + insertion sort`,
    options: [
      "Introsort -- starts with quicksort for cache efficiency, switches to heapsort when recursion exceeds 2*log2(n) to guarantee O(n log n) worst case, and uses insertion sort for small sub-arrays due to low overhead",
      "Pure quicksort with randomized pivot selection, always achieving O(n log n) average case and O(n squared) worst case. The implementation uses a random number generator to select the pivot element at each level of the recursion",
      "Merge sort exclusively, because it offers guaranteed O(n log n) worst case and stability. The standard mandates a merge-based implementation since stable ordering of equal elements is required by the specification for std::sort",
      "Timsort adapted from Python",
    ],
    correctIndex: 0,
    explanation:
      "Most implementations use introsort (Musser, 1997). It begins with quicksort for practical speed, monitors recursion depth, and switches to heapsort if depth exceeds 2*log2(n) -- preventing quicksort's O(n^2) worst case. For partitions smaller than about 16 elements, insertion sort finishes the job because its low overhead beats the recursive algorithms on tiny arrays.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
  {
    id: 1053,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What does the projection parameter in C++20 std::ranges::sort allow you to do?",
    code: `#include <algorithm>
#include <ranges>
struct Employee { std::string name; int salary; };
std::vector<Employee> staff = {{"Alice", 90000}, {"Bob", 75000}};
std::ranges::sort(staff, std::ranges::less{}, &Employee::salary);
// Sorted by salary ascending without writing a custom comparator`,
    options: [
      "It pre-filters elements so that only those satisfying the projection predicate are included in the sort operation. Elements that fail the projection check remain at their original positions while matching elements get sorted among themselves",
      "It specifies an output range where sorted results are written instead of sorting in-place. The projection acts as an output iterator adaptor that maps each element to a location in the destination container for out-of-place sorting",
      "It transforms each element through a callable before comparison, letting you sort by a member or computed value without writing a full comparator. The projection is applied transparently",
      "It controls the execution policy by projecting the sort across multiple CPU cores for parallel execution. The projection parameter is a thread-affinity hint that tells the scheduler which core group should process each partition of the range",
    ],
    correctIndex: 2,
    explanation:
      "A projection is a unary callable applied to each element before the comparator sees it. In the example, &Employee::salary extracts the salary field, so std::ranges::less compares salaries rather than Employee objects. This eliminates the need for verbose lambda comparators. Any callable works -- member pointers, lambdas, or function objects.",
    link: "https://en.cppreference.com/w/cpp/algorithm/ranges/sort.html",
  },
  {
    id: 1054,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "When and why would you choose std::partial_sort over std::sort?",
    code: `#include <algorithm>
std::vector<int> v = {9, 4, 7, 1, 3, 8, 2, 6, 5};
std::partial_sort(v.begin(), v.begin() + 3, v.end());
// First 3 elements are {1, 2, 3}; remaining elements are unspecified order`,
    options: [
      "partial_sort is always faster for every input size because it uses radix sort internally and achieves O(n) time by distributing elements into digit-based buckets. It avoids comparisons entirely and processes integer keys one digit at a time",
      "partial_sort is identical to std::sort but returns early after placing the first k elements. There is no algorithmic advantage",
      "partial_sort uses heapselect to place the smallest k elements in sorted order in O(n log k) time. When k is much smaller than n, this is significantly faster than a full O(n log n) sort",
      "partial_sort sorts only even-indexed elements and leaves odd-indexed ones in place. The name refers to sorting a partial subset based on position parity, and the algorithm alternates between sorted and unsorted slots throughout the container",
    ],
    correctIndex: 2,
    explanation:
      "std::partial_sort builds a max-heap of the first k elements, then scans the rest -- if an element is smaller than the heap's max, it replaces the max and re-heapifies. This is O(n log k). When you need only the top-10 from 1 million elements, partial_sort (O(n log 10)) vastly outperforms full sort (O(n log n)).",
    link: "https://en.cppreference.com/w/cpp/algorithm/partial_sort.html",
  },
  {
    id: 1055,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What thread-safety requirement does std::execution::par impose on the callable passed to an algorithm?",
    code: `#include <algorithm>
#include <execution>
#include <vector>
std::vector<int> v(1000000, 1);
int sum = 0;
std::for_each(std::execution::par, v.begin(), v.end(),
    [&sum](int x) { sum += x; });  // BUG: data race on sum
// Correct: use std::reduce(std::execution::par, v.begin(), v.end());`,
    options: [
      "No requirements",
      "The callable must be marked constexpr so the compiler can evaluate it at compile time instead of at runtime. Parallel execution requires compile-time evaluation to divide work statically across threads before the program runs",
      "The callable must avoid acquiring mutexes or doing any synchronization, because std::execution::par automatically manages all needed locks. The runtime assumes lock-free code and will deadlock if the callable uses its own synchronization",
      "The callable must not cause data races",
    ],
    correctIndex: 3,
    explanation:
      "std::execution::par may execute the callable on multiple threads simultaneously. The standard does NOT provide automatic synchronization -- the user must ensure thread safety. The example has a data race on sum because multiple threads increment it concurrently. The fix is to use std::reduce (which handles accumulation internally) or protect sum with std::atomic.",
    link: "https://en.cppreference.com/w/cpp/algorithm/execution_policy_tag.html",
  },
  {
    id: 1056,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What is the key difference between std::reduce and std::accumulate that enables parallelism?",
    code: `#include <numeric>
#include <execution>
std::vector<double> v = {1.0, 2.0, 3.0, 4.0};
// accumulate: strictly left-to-right fold
double a = std::accumulate(v.begin(), v.end(), 0.0);
// reduce: may combine elements in any order
double r = std::reduce(std::execution::par, v.begin(), v.end(), 0.0);`,
    options: [
      "std::reduce requires the operation to be associative and commutative because it may combine elements in any order or group sub-results arbitrarily. This flexibility allows parallel execution but means floating-point results may differ slightly from accumulate",
      "std::reduce only works with integer types and will refuse to compile with floating-point arguments. The parallel reduction algorithm requires exact arithmetic guarantees that only integer types can provide to ensure deterministic results",
      "There is no difference",
      "std::reduce returns a std::optional instead of a plain value to signal when the range is empty, while accumulate always returns the initial value for empty ranges. The optional wrapper is needed because parallel reduction cannot initialize from an empty set",
    ],
    correctIndex: 0,
    explanation:
      "std::accumulate always folds left-to-right: ((init op e0) op e1) op e2. std::reduce may partition the range and combine sub-results in any order, enabling parallel execution. This requires the operation to be associative and commutative. For floating-point, this means reduce may produce slightly different results due to different summation order (floating-point addition is not truly associative).",
    link: "https://en.cppreference.com/w/cpp/algorithm/reduce.html",
  },
  {
    id: 1057,
    difficulty: "Hard",
    topic: "Algorithms",
    question:
      "What goes wrong when a custom comparator violates strict weak ordering?",
    code: `#include <algorithm>
std::vector<int> v = {3, 1, 2, 1, 3};
// BUG: using <= instead of < violates strict weak ordering
std::sort(v.begin(), v.end(), [](int a, int b) {
    return a <= b;  // irreflexivity violated: (x <= x) is true
});`,
    options: [
      "The compiler will emit a diagnostic error at compile time because the comparator's return type is checked statically against the strict weak ordering axioms. Template constraints on std::sort verify irreflexivity during overload resolution",
      "The sort produces a valid result but in descending order instead of ascending, because <= reverses the comparison polarity. The algorithm interprets less-or-equal as greater-than and reverses the direction of every swap it makes during partitioning",
      "The sort silently works correctly for all inputs because modern implementations detect and compensate for non-strict comparators. The introsort algorithm includes a runtime fallback that normalizes any comparison function into a valid strict weak ordering",
      "Undefined behavior",
    ],
    correctIndex: 3,
    explanation:
      "Strict weak ordering requires: irreflexivity (comp(x,x) == false), asymmetry (if comp(a,b) then !comp(b,a)), and transitivity. Using <= violates irreflexivity because x <= x is true. This can cause introsort's partition to never terminate or access memory outside the range. This is genuine undefined behavior -- not just wrong results -- and has caused real-world crashes and security vulnerabilities.",
    link: "https://en.cppreference.com/w/cpp/named_req/Compare.html",
  },
  {
    id: 1058,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "How does std::inplace_merge work and where is it used?",
    code: `#include <algorithm>
std::vector<int> v = {1, 3, 5, 2, 4, 6};
// First half [1,3,5] and second half [2,4,6] are each sorted
std::inplace_merge(v.begin(), v.begin() + 3, v.end());
// v = {1, 2, 3, 4, 5, 6}`,
    options: [
      "It calls std::sort on the full range regardless of existing order, ignoring that the two halves are already sorted. The algorithm discards the sorted-halves precondition and performs a complete introsort pass over all elements from scratch",
      "It merges two consecutively sorted sub-ranges within the same container in O(n) time with O(n) extra memory, or O(n log n) time in-place if memory allocation fails. This is the merge step used to implement bottom-up merge sort",
      "It interleaves elements from two ranges by alternating",
      "It only works on std::list and std::forward_list because merging requires node splicing for O(1) element movement. The algorithm modifies internal node pointers rather than copying values, which is only possible with node-based containers",
    ],
    correctIndex: 1,
    explanation:
      "std::inplace_merge merges two sorted, consecutive sub-ranges [first, middle) and [middle, last) into one sorted range. With sufficient memory it runs in O(n) comparisons and O(n) extra space. If memory allocation fails, it falls back to an O(n log n) rotation-based in-place merge. This is exactly the merge step of merge sort, making it a key building block for std::stable_sort.",
    link: "https://en.cppreference.com/w/cpp/algorithm/inplace_merge.html",
  },
  {
    id: 1059,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "What does std::rotate do and what is its time complexity?",
    code: `#include <algorithm>
std::vector<int> v = {1, 2, 3, 4, 5};
std::rotate(v.begin(), v.begin() + 2, v.end());
// v = {3, 4, 5, 1, 2}
// The element pointed to by middle becomes the first element`,
    options: [
      "It reverses the entire range and then reverses each half separately to achieve a circular shift effect. It runs in O(n) with O(1) extra space by performing at most 2n swaps, and returns an iterator to the new position of the original first element",
      "It creates a temporary copy of the range, rearranges elements in the copy, and writes them back. This requires O(n) extra space for the temporary buffer and runs in O(n) time by copying each element twice",
      "It only works on deques and lists because rotation requires O(1) insertion at both ends. For vectors, it falls back to an O(n squared) algorithm that repeatedly moves the first element to the back position one step at a time using std::swap",
      "It sorts the range in a circular manner by treating the container as a ring buffer and shifting the sort origin. The rotation is a byproduct of the sort algorithm reinterpreting iterator offsets relative to a new starting index in the buffer",
    ],
    correctIndex: 0,
    explanation:
      "std::rotate performs a left rotation so that the element at middle becomes the new first element. It runs in O(n) time with O(1) extra space. The classic implementation uses three reverses: reverse [first, middle), reverse [middle, last), reverse [first, last). It returns an iterator pointing to where the original first element ended up. Rotate is a fundamental building block used inside std::stable_partition and other algorithms.",
    link: "https://en.cppreference.com/w/cpp/algorithm/rotate.html",
  },
  {
    id: 1060,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "How does lazy evaluation work in a C++20 ranges views pipeline?",
    code: `#include <ranges>
#include <vector>
std::vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
auto result = v | std::views::filter([](int x) { return x % 2 == 0; })
                | std::views::transform([](int x) { return x * x; })
                | std::views::take(3);
// result lazily yields: 4, 16, 36 -- stops after 3 matches`,
    options: [
      "Views are lazy",
      "The pipeline eagerly evaluates each stage into a temporary std::vector before passing results to the next stage. The filter creates a new vector of even numbers, then transform squares each one into another vector, and finally take selects the first three",
      "Views execute all stages in parallel on separate threads, with each stage running concurrently on its own core. The pipe operator spawns a thread per stage and elements flow through a lock-free queue connecting the filter, transform, and take stages",
      "The pipeline compiles down to a single std::copy_if call because the compiler fuses all view stages into one loop at compile time. Views are purely a compile-time abstraction that the optimizer always eliminates through mandatory stage fusion",
    ],
    correctIndex: 0,
    explanation:
      "C++20 range views are lazy adaptors that compose into a pipeline. When you iterate result, each element is pulled through the chain on demand: filter checks if the element is even, transform squares it, and take counts how many have been yielded. Once take has 3 results, iteration stops -- elements 8 and 10 are never touched. No intermediate containers are created. This is similar to lazy iterators in Rust or Python generators.",
    link: "https://en.cppreference.com/w/cpp/ranges.html",
  },
  {
    id: 1061,
    difficulty: "Hard",
    topic: "Algorithms",
    question: "Which statement about constexpr algorithms in C++20 is correct?",
    code: `#include <algorithm>
#include <array>
constexpr auto make_sorted() {
    std::array<int, 5> a = {5, 3, 1, 4, 2};
    std::sort(a.begin(), a.end());  // constexpr sort in C++20
    return a;
}
constexpr auto sorted = make_sorted();  // computed at compile time
static_assert(sorted[0] == 1);  // verified at compile time`,
    options: [
      "Only std::find and std::count are constexpr in C++20",
      "Constexpr algorithms run at compile time only if marked with the consteval keyword instead of constexpr. Without consteval, the algorithms always execute at runtime regardless of whether the inputs are compile-time constants or not",
      "C++20 made most non-parallel <algorithm> and <numeric> algorithms constexpr, allowing std::sort, std::transform, std::fill, and many others to execute at compile time. This works because C++20 also allows constexpr dynamic memory",
      "All algorithms became constexpr in C++17",
    ],
    correctIndex: 2,
    explanation:
      "C++20 added constexpr to the vast majority of algorithms in <algorithm> and <numeric>. This was enabled by C++20 also permitting constexpr dynamic memory allocation (within constant evaluation). You can now sort, search, transform, and accumulate arrays at compile time. Parallel algorithms (those taking execution policies) are excluded because thread creation cannot happen at compile time.",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort.html",
  },
];
