/**
 * sequence_containers.cpp - STL Sequence Containers
 *
 * Demonstrates: vector, array, deque, list, forward_list.
 * Sequence containers store elements in a linear order.
 * Choose based on your access and insertion patterns.
 */

#include <iostream>
#include <format>
#include <vector>
#include <array>
#include <deque>
#include <list>
#include <forward_list>
#include <algorithm>
#include <numeric>

int main() {
    // -----------------------------------------------
    // 1. std::vector -- dynamic array (most commonly used)
    //    - Contiguous memory, fast random access O(1)
    //    - Fast push_back (amortized O(1))
    //    - Slow insert/erase in the middle O(n)
    // -----------------------------------------------
    std::cout << "--- std::vector ---\n";
    std::vector<int> vec = {5, 3, 8, 1, 9};

    vec.push_back(7);          // Add to end
    vec.emplace_back(2);       // Construct in-place (avoids copy)

    // Capacity vs size
    std::cout << std::format("Size: {}, Capacity: {}\n",
                              vec.size(), vec.capacity());

    // Reserve to avoid reallocations
    vec.reserve(100);
    std::cout << std::format("After reserve: Capacity: {}\n", vec.capacity());

    // Sort and print
    std::sort(vec.begin(), vec.end());
    std::cout << "Sorted: ";
    for (int n : vec) std::cout << n << ' ';
    std::cout << '\n';

    // Erase-remove idiom: remove all values > 5
    std::erase_if(vec, [](int n) { return n > 5; });  // C++20
    std::cout << "After removing >5: ";
    for (int n : vec) std::cout << n << ' ';
    std::cout << '\n';

    // -----------------------------------------------
    // 2. std::array -- fixed-size array (stack allocated)
    //    - Size known at compile time
    //    - No heap allocation, very fast
    //    - Same interface as vector (begin, end, size, etc.)
    // -----------------------------------------------
    std::cout << "\n--- std::array ---\n";
    std::array<double, 4> arr = {3.14, 2.72, 1.41, 1.73};

    // Compile-time size
    std::cout << std::format("Size: {}\n", arr.size());
    std::cout << std::format("Front: {}, Back: {}\n", arr.front(), arr.back());

    // Works with algorithms
    auto sum = std::accumulate(arr.begin(), arr.end(), 0.0);
    std::cout << std::format("Sum: {:.2f}\n", sum);

    // -----------------------------------------------
    // 3. std::deque -- double-ended queue
    //    - Fast push/pop at BOTH ends O(1)
    //    - Random access O(1), but not contiguous memory
    //    - Good for queues and sliding windows
    // -----------------------------------------------
    std::cout << "\n--- std::deque ---\n";
    std::deque<std::string> dq;
    dq.push_back("middle");
    dq.push_front("front");    // O(1) -- unlike vector!
    dq.push_back("back");

    for (const auto& s : dq) std::cout << s << ' ';
    std::cout << '\n';

    dq.pop_front();  // Remove from front: O(1)
    std::cout << std::format("After pop_front, front = {}\n", dq.front());

    // -----------------------------------------------
    // 4. std::list -- doubly linked list
    //    - Fast insert/erase anywhere O(1) with iterator
    //    - No random access (must traverse)
    //    - Higher memory overhead (prev/next pointers)
    // -----------------------------------------------
    std::cout << "\n--- std::list ---\n";
    std::list<int> lst = {10, 20, 30, 40, 50};

    // Insert in the middle efficiently
    auto it = std::next(lst.begin(), 2);  // Points to 30
    lst.insert(it, 25);                    // Insert 25 before 30

    // Splice: move elements between lists (O(1), no copies!)
    std::list<int> other = {100, 200};
    lst.splice(lst.end(), other);  // Move 'other' to end of 'lst'

    std::cout << "List: ";
    for (int n : lst) std::cout << n << ' ';
    std::cout << '\n';
    std::cout << std::format("Other is now empty: {}\n", other.empty());

    // List-specific sort (can't use std::sort -- needs random access)
    lst.sort();
    lst.unique();  // Remove consecutive duplicates (like Unix uniq)

    // -----------------------------------------------
    // 5. std::forward_list -- singly linked list
    //    - Minimal memory overhead (no backward pointer)
    //    - Only forward iteration
    //    - Insert/erase after a given position
    // -----------------------------------------------
    std::cout << "\n--- std::forward_list ---\n";
    std::forward_list<int> fwd = {1, 2, 3, 4, 5};

    fwd.push_front(0);           // Only push_front (no push_back)
    fwd.insert_after(fwd.begin(), 99);  // Insert after first element

    std::cout << "Forward list: ";
    for (int n : fwd) std::cout << n << ' ';
    std::cout << '\n';

    // -----------------------------------------------
    // Summary: When to use what?
    // -----------------------------------------------
    std::cout << "\n--- Container Selection Guide ---\n";
    std::cout << "vector:       Default choice. Contiguous, cache-friendly.\n";
    std::cout << "array:        Fixed size known at compile time.\n";
    std::cout << "deque:        Need fast push/pop at both ends.\n";
    std::cout << "list:         Frequent insert/erase in the middle.\n";
    std::cout << "forward_list: Minimal memory, forward-only traversal.\n";

    return 0;
}
