import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 942,
    difficulty: "Easy",
    topic: "Value Categories",
    question: "Which best describes an lvalue in C++?",
    options: [
      "An expression with a persistent, addressable memory location",
      "A temporary value that cannot be stored in any variable",
      "A compile-time constant known before the program runs",
      "An expression that can only appear on the right of =",
    ],
    correctIndex: 0,
    explanation:
      "An lvalue is an expression that refers to a persistent object with an identifiable memory location. You can take its address with the & operator and it can appear on the left side of an assignment.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 943,
    difficulty: "Easy",
    topic: "Value Categories",
    question: "Which best describes an rvalue in C++?",
    options: [
      "A named variable stored on the heap segment of memory",
      "An expression that designates a temporary without lasting address",
      "A pointer to a function that returns an integer value",
      "A reference that can only bind to const-qualified objects",
    ],
    correctIndex: 1,
    explanation:
      "An rvalue is a temporary expression that does not have a persistent memory address. Typical rvalues include literals like 42, arithmetic results like (x + 1), and values returned by functions that return by value.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 944,
    difficulty: "Easy",
    topic: "Value Categories",
    question: "What does the following declaration create?",
    code: `int x = 10;
int& ref = x;`,
    options: [
      "A pointer to x that can be reassigned later on",
      "An independent copy of x stored at a new address",
      "An lvalue reference that is an alias for x",
      "An rvalue reference bound to a temporary value",
    ],
    correctIndex: 2,
    explanation:
      "int& ref = x; declares an lvalue reference. The variable ref becomes another name (alias) for x. Any modification through ref also changes x, and they share the same address.",
    link: "https://www.learncpp.com/cpp-tutorial/lvalue-references/",
  },
  {
    id: 945,
    difficulty: "Easy",
    topic: "Value Categories",
    question: "What does the following declaration create?",
    code: `int&& rref = 42;`,
    options: [
      "A const lvalue reference bound to the literal 42",
      "A pointer that stores the memory address of 42",
      "A macro alias that replaces rref with 42 at compile time",
      "An rvalue reference bound to the temporary value 42",
    ],
    correctIndex: 3,
    explanation:
      "The && syntax declares an rvalue reference. It can bind to temporary (rvalue) expressions like the literal 42. The compiler extends the lifetime of the temporary so rref remains valid.",
    link: "https://en.cppreference.com/w/cpp/language/reference",
  },
  {
    id: 946,
    difficulty: "Easy",
    topic: "Value Categories",
    question:
      "What happens if you try to take the address of an rvalue, as in &(x + 1)?",
    options: [
      "It causes a compilation error because rvalues have no address",
      "It creates a new pointer to a heap-allocated copy",
      "It returns the address of the variable x in memory",
      "It returns a null pointer since the value is temporary",
    ],
    correctIndex: 0,
    explanation:
      "Rvalues are temporary expressions without a persistent memory location. The address-of operator (&) requires an lvalue operand, so applying it to an rvalue like (x + 1) causes a compile error.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 947,
    difficulty: "Easy",
    topic: "Value Categories",
    question:
      "What is the value category of a string literal such as \"hello\" in C++?",
    options: [
      "It is an rvalue because literal values are always temporary",
      "It is an xvalue because literals can be moved from safely",
      "It is an lvalue because it resides in static storage memory",
      "It is a prvalue because it produces a new temporary object",
    ],
    correctIndex: 2,
    explanation:
      "String literals are stored in static memory for the entire duration of the program. Because they occupy a persistent, addressable location, they are classified as lvalues -- unlike numeric literals which are prvalues.",
    link: "https://en.cppreference.com/w/cpp/language/string_literal",
  },
  {
    id: 948,
    difficulty: "Easy",
    topic: "Value Categories",
    question: "What does std::move(x) return?",
    options: [
      "A deep copy of x allocated on the heap memory segment",
      "A const lvalue reference preventing modification of x",
      "A nullptr if x has already been moved from previously",
      "An rvalue reference (xvalue) enabling move semantics on x",
    ],
    correctIndex: 3,
    explanation:
      "std::move does not actually move anything. It performs an unconditional cast of its argument to an rvalue reference (specifically an xvalue). This allows move constructors or move assignment operators to be selected by overload resolution.",
    link: "https://en.cppreference.com/w/cpp/utility/move",
  },
  {
    id: 949,
    difficulty: "Easy",
    topic: "Value Categories",
    question:
      "How does a function parameter of type int& differ from one of type int&&?",
    options: [
      "int& accepts only lvalues; int&& accepts only rvalues",
      "int& accepts only rvalues; int&& accepts only lvalues",
      "int& is for const values; int&& is for mutable values",
      "There is no difference",
    ],
    correctIndex: 0,
    explanation:
      "An int& parameter (lvalue reference) can only bind to lvalues such as named variables. An int&& parameter (rvalue reference) can only bind to rvalues such as temporaries or expressions cast via std::move.",
    link: "https://www.learncpp.com/cpp-tutorial/rvalue-references/",
  },
  {
    id: 950,
    difficulty: "Easy",
    topic: "Value Categories",
    question:
      "Can an rvalue reference parameter bind directly to an lvalue without any cast?",
    code: `void foo(int&& val);
int x = 5;
foo(x); // Does this compile?`,
    options: [
      "Yes -- rvalue references can bind to any expression type",
      "No -- you need std::move(x) to cast the lvalue to rvalue",
      "Yes -- but only when the lvalue is a non-const integer",
      "No -- you need static_cast<const int>(x) to convert it",
    ],
    correctIndex: 1,
    explanation:
      "An rvalue reference cannot bind to an lvalue directly. To pass x to a function expecting int&&, you must cast it using std::move(x), which produces an xvalue that the rvalue reference can bind to.",
    link: "https://en.cppreference.com/w/cpp/utility/move",
  },
  {
    id: 951,
    difficulty: "Easy",
    topic: "Value Categories",
    question:
      "What is the value category of the expression f() if f is declared as int f();?",
    options: [
      "It is an lvalue because function calls always produce lvalues",
      "It is a prvalue because the function returns a temporary by value",
      "It is an xvalue because return values are about to expire soon",
      "It is an lvalue because the return type int is not a reference",
    ],
    correctIndex: 1,
    explanation:
      "A function call that returns by value (not by reference) produces a prvalue -- a pure rvalue. The result is a temporary object without a persistent identity. If the function returned int& instead, the result would be an lvalue.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 952,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "In the C++11 value category taxonomy, which two categories together form the set of all glvalues?",
    code: `// Value category taxonomy:
//
//       expression
//       /       \
//    glvalue   rvalue
//    /    \    /    \
// lvalue  xvalue  prvalue`,
    options: [
      "lvalues and xvalues are the two subcategories that compose glvalue",
      "prvalues and xvalues are the two subcategories that compose glvalue",
      "lvalues and prvalues are the two subcategories that compose glvalue",
      "rvalues and prvalues are the two subcategories that compose glvalue",
    ],
    correctIndex: 0,
    explanation:
      "A glvalue (generalized lvalue) is either an lvalue or an xvalue. An rvalue is either an xvalue or a prvalue. The xvalue category sits at the intersection -- it is both a glvalue and an rvalue. lvalues have identity and cannot be moved from implicitly, while xvalues have identity but are expiring and can be moved from.",
    link: "https://en.cppreference.com/w/cpp/language/value_category.html",
  },
  {
    id: 953,
    difficulty: "Medium",
    topic: "Value Categories",
    question: "What does std::move actually do at runtime?",
    code: `std::string a = "hello";
std::string b = std::move(a);
// What did std::move do?`,
    options: [
      "It performs an unconditional cast to an rvalue reference without moving data",
      "It transfers ownership of the internal buffer from source to target directly",
      "It swaps the internal pointers of both objects so each gets the other's data",
      "It copies the data first then empties the source to simulate a move operation",
    ],
    correctIndex: 0,
    explanation:
      "std::move does not move anything. It is simply a static_cast to T&& (an rvalue reference). The actual move happens when the move constructor or move assignment operator of std::string is invoked with that rvalue reference. std::move just enables the move by changing the value category.",
    link: "https://en.cppreference.com/w/cpp/utility/move.html",
  },
  {
    id: 954,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "What is the danger of storing an rvalue reference to a temporary object?",
    code: `std::string&& ref = std::string("temp");
// ref is valid here -- lifetime extended

std::string&& get() {
  std::string local = "oops";
  return std::move(local);
}
std::string&& bad = get();
// What is bad?`,
    options: [
      "bad is a compile error because rvalue references cannot bind to moved locals",
      "bad holds a dangling reference because the local was destroyed when get returned",
      "bad is valid because std::move transfers ownership out of the function cleanly",
      "bad is a copy of the local string since the compiler converts moves to copies",
    ],
    correctIndex: 1,
    explanation:
      "Returning an rvalue reference to a local variable creates a dangling reference. The local is destroyed when the function returns, and the reference now points to freed memory. Lifetime extension only works when binding a temporary directly, not when returning a reference to a local from a function.",
    link: "https://en.cppreference.com/w/cpp/language/reference_initialization.html",
  },
  {
    id: 955,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "After an object has been moved from using std::move, what state is the moved-from object guaranteed to be in?",
    code: `std::vector<int> a = {1, 2, 3};
std::vector<int> b = std::move(a);
// What can we say about a now?`,
    options: [
      "It is always empty with size zero because the standard mandates clearing moved-from containers",
      "It is in an unspecified state but accessing it without reassigning first is undefined behavior",
      "It retains its original value because move is just a hint the compiler can ignore freely",
      "It is in a valid but unspecified state",
    ],
    correctIndex: 3,
    explanation:
      "The C++ standard requires moved-from objects to be in a valid but unspecified state. This means you can safely destroy the object or assign a new value to it, but you should not rely on its contents. For standard containers, the moved-from container is valid but its size and contents are unspecified.",
    link: "https://en.cppreference.com/w/cpp/utility/move.html",
  },
  {
    id: 956,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "What problem does std::forward solve in template code with forwarding references?",
    code: `template<typename T>
void wrapper(T&& arg) {
  // Should we pass arg as lvalue or rvalue?
  inner(std::forward<T>(arg));
}`,
    options: [
      "It prevents template argument deduction from failing when const references are passed in",
      "It converts any argument to an rvalue reference to guarantee the move constructor is called",
      "It preserves the value category of the original argument",
      "It removes const qualifiers from the argument so the inner function can modify it freely",
    ],
    correctIndex: 2,
    explanation:
      "std::forward implements perfect forwarding. Inside a function template, a named parameter is always an lvalue (it has a name). std::forward conditionally casts it back to an rvalue if the original argument was an rvalue. This preserves the original value category, allowing inner() to select the correct overload.",
    link: "https://en.cppreference.com/w/cpp/utility/forward.html",
  },
  {
    id: 957,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "When is T&& a forwarding (universal) reference rather than an rvalue reference?",
    code: `template<typename T>
void foo(T&& x);       // Case A

void bar(std::string&& y); // Case B

auto&& z = getValue(); // Case C`,
    options: [
      "Only in Case A because it uses a class type and the other cases use a concrete type parameter",
      "In Cases A and C because T&& and auto&& both involve type deduction on the reference target",
      "In all three cases because && always means universal reference regardless of deduction context",
      "Only in Case B because a concrete type rvalue reference is the true universal reference form",
    ],
    correctIndex: 1,
    explanation:
      "A forwarding (universal) reference occurs when && is applied to a deduced type -- either a template parameter T&& where T is deduced, or auto&&. In Case A, T is deduced so T&& is a forwarding reference. In Case C, auto&& deduces the type. In Case B, std::string is a concrete type so std::string&& is just a plain rvalue reference.",
    link: "https://en.cppreference.com/w/cpp/language/reference.html",
  },
  {
    id: 958,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "Under what condition is the compiler allowed to apply Named Return Value Optimization (NRVO)?",
    code: `Widget makeWidget(bool flag) {
  Widget a, b;
  if (flag) return a;
  else      return b;
}`,
    options: [
      "The compiler can always apply NRVO even when multiple different local variables may be returned",
      "NRVO cannot apply here because the compiler cannot know which variable to construct in place",
      "NRVO only applies when the function is marked constexpr and the result is used at compile time",
      "NRVO is mandatory in C++17 for all named return values so the compiler must optimize this case",
    ],
    correctIndex: 1,
    explanation:
      "NRVO lets the compiler construct the return value directly in the caller's space, eliminating the copy or move. However, when multiple different local variables might be returned (as with a and b depending on a flag), the compiler typically cannot apply NRVO because it does not know which variable to place in the return slot at construction time.",
    link: "https://en.cppreference.com/w/cpp/language/copy_elision.html",
  },
  {
    id: 959,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "How does auto&& differ from auto& when deducing the type of a variable?",
    code: `int x = 42;
auto& a = x;           // OK
// auto& b = 42;       // Error
auto&& c = 42;         // OK
auto&& d = x;          // OK`,
    options: [
      "auto&& always deduces an rvalue reference, while auto& always deduces an lvalue reference to x",
      "auto&& and auto& are identical in behavior",
      "auto&& is a forwarding reference",
      "auto&& deduces a const reference automatically, while auto& deduces a non-const reference only",
    ],
    correctIndex: 2,
    explanation:
      "auto&& is a forwarding reference. When initialized with an lvalue, reference collapsing produces an lvalue reference (auto deduces int&, and int& && collapses to int&). When initialized with an rvalue, auto deduces int, giving int&&. In contrast, auto& always deduces an lvalue reference and cannot bind to rvalues.",
    link: "https://www.learncpp.com/cpp-tutorial/type-deduction-with-pointers-references-and-const/",
  },
  {
    id: 960,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "When does 'return x;' for a local variable trigger an implicit move instead of a copy?",
    code: `Widget func() {
  Widget w;
  // ... use w ...
  return w; // copy or move?
}`,
    options: [
      "Only when the programmer writes std::move(w) explicitly",
      "Only when the Widget class is trivially copyable and the compiler applies copy elision on return",
      "When copy elision does not apply and the return expression names a local or parameter by value",
      "When the returned variable was originally declared as an rvalue reference inside the function",
    ],
    correctIndex: 3,
    explanation:
      "Since C++11, when a return statement names a local variable or by-value parameter eligible for copy elision (even if elision is not performed), the compiler first tries overload resolution as if the expression were an rvalue. If a move constructor is found, it is used instead of copying. In C++20 and later, this implicit move applies even more broadly, including to rvalue reference variables.",
    link: "https://en.cppreference.com/w/cpp/language/return.html",
  },
  {
    id: 961,
    difficulty: "Medium",
    topic: "Value Categories",
    question:
      "Given two overloads void process(const std::string&) and void process(std::string&&), which is called here?",
    code: `std::string name = "Alice";
process(name);            // Call 1
process(std::move(name)); // Call 2
process("Bob");           // Call 3`,
    options: [
      "Call 1 uses const&, Call 2 uses &&, and Call 3 uses const& since literals are always lvalues",
      "All three calls select the const& overload because it can bind to both lvalues and rvalues",
      "Call 1 uses const&, Call 2 uses &&, and Call 3 uses && after implicit conversion to temporary",
      "Call 1 uses &&, Call 2 uses const&, and Call 3 uses && because named variables are rvalues",
    ],
    correctIndex: 2,
    explanation:
      "Call 1 passes an lvalue, so the const& overload wins. Call 2 passes an xvalue (via std::move), so the && overload wins -- rvalue references bind more tightly to rvalues. Call 3 passes a string literal which implicitly constructs a temporary std::string (a prvalue), so the && overload wins. While const& can bind to rvalues, the && overload is a better match.",
    link: "https://en.cppreference.com/w/cpp/language/overload_resolution.html",
  },
  {
    id: 962,
    difficulty: "Hard",
    topic: "Value Categories",
    question: "Which of these expressions is classified as an xvalue?",
    code: `struct S { int m; };
S s;
S getS();

// (A) s.m
// (B) getS().m
// (C) std::move(s)
// (D) S{}`,
    options: [
      "s.m is an xvalue because member access always yields an xvalue",
      "S{} is an xvalue because it constructs a temporary object on the spot",
      "std::move(s) is an xvalue because it casts s to an rvalue reference",
      "getS() is an xvalue because it returns a class type by value here",
    ],
    correctIndex: 2,
    explanation:
      "std::move(s) is equivalent to static_cast<S&&>(s), which produces an xvalue. s.m is an lvalue (member of an lvalue). S{} is a prvalue. getS() is a prvalue (returns by value). However, getS().m is an xvalue -- member access on an rvalue. The question asks about std::move(s) specifically, which is the classic xvalue example.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 963,
    difficulty: "Hard",
    topic: "Value Categories",
    question: "In C++17, when does prvalue materialization occur in this code?",
    code: `struct Widget {
    Widget() { std::cout << "C"; }
    Widget(const Widget&) { std::cout << "CC"; }
};

const Widget& ref = Widget();`,
    options: [
      "A temporary is materialized when the prvalue is bound to ref",
      "A temporary is created first, then copied into the reference slot",
      "No temporary is ever materialized because of mandatory elision",
      "The prvalue is stored directly in ref without materialization",
    ],
    correctIndex: 0,
    explanation:
      "In C++17, prvalues are not objects -- they are initializations waiting to happen. When a prvalue is bound to a reference (const Widget& ref = Widget()), temporary materialization occurs: a temporary object is created from the prvalue. No copy or move constructor is invoked. Only the default constructor prints \"C\". This is distinct from copy elision -- it is a separate mechanism called temporary materialization conversion.",
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion#Temporary_materialization",
  },
  {
    id: 964,
    difficulty: "Hard",
    topic: "Value Categories",
    question:
      "Under C++17 mandatory copy elision, how many times is a constructor called?",
    code: `struct Obj {
    Obj() { std::cout << "D"; }
    Obj(const Obj&) { std::cout << "C"; }
    Obj(Obj&&) { std::cout << "M"; }
};

Obj makeObj() { return Obj(); }
Obj x = makeObj();`,
    options: [
      "Three constructors are called: default, then move, then move again",
      "Two constructors called: default in makeObj, then move into x",
      "Two constructors called: default in makeObj, then copy into x here",
      "One constructor called: only the default constructor, printing \"D\"",
    ],
    correctIndex: 3,
    explanation:
      "In C++17, mandatory copy elision means prvalues are not objects until they need to be. Obj() is a prvalue, and return Obj() does not materialize it -- it propagates the prvalue to the caller. Obj x = makeObj() initializes x directly from the prvalue. No move or copy constructor is ever called. Only the default constructor fires once, printing just \"D\".",
    link: "https://en.cppreference.com/w/cpp/language/copy_elision",
  },
  {
    id: 965,
    difficulty: "Hard",
    topic: "Value Categories",
    question:
      "What type does T resolve to after reference collapsing in this template instantiation?",
    code: `template<typename T>
void foo(T&& param);

int x = 42;
foo(x);  // What is T deduced as?

// After deduction, the parameter type T&& becomes what?`,
    options: [
      "T is deduced as int, so T&& is int&&",
      "T is deduced as int&, so T&& collapses to int&",
      "T is deduced as int&&, and T&& becomes int&&&& which is invalid",
      "T is deduced as const int&, so T&& collapses to const int& here",
    ],
    correctIndex: 1,
    explanation:
      "When an lvalue of type int is passed to a forwarding reference T&&, template argument deduction deduces T as int&. Then the parameter type becomes int& && which, by the reference collapsing rules, collapses to int&. The rule is: if either reference is an lvalue reference, the result is an lvalue reference. Only T&& && produces T&&.",
    link: "https://en.cppreference.com/w/cpp/language/reference#Reference_collapsing",
  },
  {
    id: 966,
    difficulty: "Hard",
    topic: "Value Categories",
    question: "What types do decltype(x) and decltype((x)) deduce here?",
    code: `int x = 10;

using A = decltype(x);
using B = decltype((x));

// What are A and B?`,
    options: [
      "A is int, B is int& because (x) is an lvalue expression",
      "A is int&, B is int because parentheses strip the reference",
      "A is int, B is int because the parentheses have no effect here",
      "A is int&, B is int& because x is always an lvalue expression",
    ],
    correctIndex: 0,
    explanation:
      "decltype(x) where x is the unparenthesized name of a variable yields the declared type, which is int. But decltype((x)) treats (x) as an expression, not a variable name. Since (x) is an lvalue expression of type int, decltype yields int&. This is a critical distinction: decltype on an id-expression gives the declared type, while decltype on any other expression gives a type qualified by value category (lvalue yields T&, xvalue yields T&&, prvalue yields T).",
    link: "https://en.cppreference.com/w/cpp/language/decltype",
  },
  {
    id: 967,
    difficulty: "Hard",
    topic: "Value Categories",
    question: "What happens to the temporary's lifetime in this code?",
    code: `struct Data { int val; };
Data makeData() { return Data{42}; }

const int& ref = makeData().val;
std::cout << ref;`,
    options: [
      "Prints 42 because const& extends the temporary Data object lifetime",
      "Prints 42 because .val copies the int out of the temporary object",
      "Prints 0 because the Data temporary is value-initialized by default",
      "Undefined behavior",
    ],
    correctIndex: 3,
    explanation:
      "Binding a const reference to a member of a temporary does not extend the temporary's lifetime. The temporary Data returned by makeData() is destroyed at the end of the full expression. The reference ref then dangles. Accessing ref is undefined behavior. Lifetime extension only applies when a reference is bound directly to a temporary, not to a subobject or member of a temporary (prior to C++23, which fixes this specific case).",
    link: "https://en.cppreference.com/w/cpp/language/reference_initialization#Lifetime_of_a_temporary",
  },
  {
    id: 968,
    difficulty: "Hard",
    topic: "Value Categories",
    question:
      "How does std::forward preserve value category using reference collapsing?",
    code: `template<typename T>
T&& forward(std::remove_reference_t<T>& arg) {
    return static_cast<T&&>(arg);
}

// When T = int&, what does static_cast<T&&>(arg) produce?`,
    options: [
      "It produces int&& because T&& always creates an rvalue reference",
      "It produces int& because int& && collapses to int& via the rules",
      "It produces int because the reference is stripped by the cast here",
      "It produces const int& because forward adds const qualification",
    ],
    correctIndex: 1,
    explanation:
      "When T is deduced as int& (because an lvalue was passed), T&& becomes int& && which collapses to int& by the reference collapsing rules. So static_cast<int&>(arg) returns an lvalue reference, preserving the lvalue category. When T is deduced as int (because an rvalue was passed), T&& is simply int&&, and the cast produces an rvalue reference. This is how std::forward conditionally casts to an rvalue only when the original argument was an rvalue.",
    link: "https://en.cppreference.com/w/cpp/utility/forward",
  },
  {
    id: 969,
    difficulty: "Hard",
    topic: "Value Categories",
    question:
      "Why does std::vector use copy instead of move when the move constructor is not noexcept?",
    code: `struct Item {
    Item() = default;
    Item(const Item&) { /* copy */ }
    Item(Item&&) { /* move, not noexcept */ }
};

std::vector<Item> v;
v.push_back(Item());
v.push_back(Item());  // reallocation happens here`,
    options: [
      "The vector always copies on reallocation regardless of noexcept status",
      "The standard forbids move constructors that can throw any exceptions",
      "If move throws mid-reallocation, already-moved elements cannot be restored",
      "The compiler optimizes away the move and uses placement new copies instead",
    ],
    correctIndex: 2,
    explanation:
      "When vector reallocates, it needs to transfer existing elements to the new buffer. If it used move and the move constructor threw after some elements were already moved, those elements would be in a moved-from state in the old buffer -- the strong exception guarantee would be violated. By using copy, if an exception occurs, the old buffer is still intact. std::move_if_noexcept is used internally to choose copy when move is not noexcept.",
    link: "https://en.cppreference.com/w/cpp/utility/move_if_noexcept",
  },
  {
    id: 970,
    difficulty: "Hard",
    topic: "Value Categories",
    question:
      "What is the value category of the expression returned by this function, and why is it dangerous?",
    code: `int&& dangerous() {
    int local = 42;
    return std::move(local);
}

int&& ref = dangerous();
std::cout << ref;`,
    options: [
      "The result is a prvalue so a copy of local is made, which is safe",
      "The result is an lvalue since the caller binds it to a named variable",
      "The result is a prvalue and mandatory elision avoids the dangling ref",
      "The result is an xvalue, and ref dangles because local is destroyed",
    ],
    correctIndex: 3,
    explanation:
      "A function call whose return type is an rvalue reference (T&&) produces an xvalue. Here, dangerous() returns int&&, which is an xvalue. However, it returns a reference to a local variable that is destroyed when the function returns. The reference ref binds to a destroyed object, resulting in undefined behavior. Returning rvalue references to local variables is almost always a bug -- unlike returning by value, no copy or move occurs.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 971,
    difficulty: "Hard",
    topic: "Value Categories",
    question:
      "How are *p, p[0], and static_cast<int&&>(x) classified by value category?",
    code: `int x = 10;
int* p = &x;

auto& a = *p;                       // expression: *p
auto& b = p[0];                     // expression: p[0]
int&& c = static_cast<int&&>(x);    // expression: static_cast<int&&>(x)`,
    options: [
      "*p is lvalue, p[0] is lvalue, and static_cast<int&&>(x) is an xvalue",
      "*p is lvalue, p[0] is prvalue, static_cast<int&&>(x) is an xvalue",
      "*p is xvalue, p[0] is lvalue, static_cast<int&&>(x) is a prvalue",
      "*p is lvalue, p[0] is lvalue, and static_cast<int&&>(x) is prvalue",
    ],
    correctIndex: 0,
    explanation:
      "The indirection operator *p yields an lvalue because it refers to an object in memory. The subscript operator p[0] is defined as *(p+0), which is also an lvalue for the same reason. A static_cast to an rvalue reference type (int&&) produces an xvalue -- this is the same mechanism that std::move uses internally. So the classification is: *p = lvalue, p[0] = lvalue, static_cast<int&&>(x) = xvalue.",
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1452,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What is an lvalue in C++?`,
    options: [
      "An expression that refers to a temporary object which will be destroyed at the end of the statement",
      "An expression that can only appear on the right-hand side of an assignment and has no memory address",
      "An expression that refers to an object with a persistent memory location whose address can be taken",
      "An expression that results from a function call returning by value and cannot be assigned a new value",
    ],
    correctIndex: 2,
    explanation: `An lvalue (locator value) is an expression that designates an object with a persistent memory location. You can take the address of an lvalue using the & operator. Examples include variable names, dereferenced pointers, and array elements.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1453,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `Which of the following is an example of an rvalue expression?`,
    code: `int x = 5;
int y = x + 3;`,
    options: [
      "The expression x + 3 is an rvalue because it produces a temporary result with no persistent address",
      "The variable x is an rvalue because it appears on the right-hand side of the second assignment here",
      "The variable y is an rvalue because it has just been declared and does not yet hold a stable address",
      "The literal 5 and the variable x are both rvalues because they both appear in assignment expressions",
    ],
    correctIndex: 0,
    explanation: `The expression x + 3 produces a temporary value that has no persistent memory address, making it an rvalue. The variable x is an lvalue even when it appears on the right side of an assignment. Being on the right side does not make something an rvalue.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1454,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `Can you take the address of an lvalue using the \`&\` operator in C++?`,
    options: [
      "No, the address-of operator only works with rvalues because they need explicit memory allocation first",
      "No, the address-of operator works only with pointers and not with regular variables or other lvalues",
      "Yes, but only if the lvalue is declared as a pointer type or is a reference to a dynamically allocated value",
      "Yes, lvalues have a persistent memory location so the address-of operator can retrieve their address",
    ],
    correctIndex: 3,
    explanation: `One of the defining properties of an lvalue is that it has an identifiable memory location. The & operator can retrieve this address. In contrast, rvalues (like temporaries) do not have a persistent address, so you cannot apply & to them.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1455,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What value category does a named variable have when used in an expression?`,
    code: `int x = 42;
foo(x);`,
    options: [
      "It is an rvalue because the variable is being passed to a function and will be consumed by that call",
      "It is an lvalue because a named variable refers to an object with a persistent location in memory",
      "It is an xvalue because accessing a named variable triggers the expiring value conversion mechanism",
      "It depends on the context and the variable could be either an lvalue or rvalue at the call site itself",
    ],
    correctIndex: 1,
    explanation: `A named variable is always an lvalue, regardless of where it appears in an expression. Even when passed to a function that takes an rvalue reference, the name itself is an lvalue. This is why std::move exists: to cast the lvalue to an rvalue reference.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1456,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What value category does a temporary object typically have in C++?`,
    code: `std::string("hello");`,
    options: [
      "It is a prvalue because it is a pure rvalue that produces a temporary with no persistent memory address",
      "It is an lvalue because the constructor creates an object that exists in memory until scope completion",
      "It is an xvalue because all temporaries are considered to be expiring values by the language definition",
      "It is a glvalue because temporaries have a generalized location that can be referenced by the program",
    ],
    correctIndex: 0,
    explanation: `A temporary object created by a constructor call like std::string("hello") is a prvalue (pure rvalue). Prvalues do not have a persistent memory address and represent values that can initialize objects or be bound to references.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1457,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What value category does \`std::move(x)\` produce?`,
    code: `int x = 10;
auto&& ref = std::move(x);`,
    options: [
      "It produces an lvalue because x is a named variable and std::move does not change the underlying object",
      "It produces a prvalue because std::move creates a new temporary copy of the object that can be consumed",
      "It produces an xvalue because std::move casts x to an rvalue reference, marking it as an expiring value",
      "It produces a glvalue because std::move returns a generalized reference that preserves the object identity",
    ],
    correctIndex: 2,
    explanation: `std::move performs an unconditional cast to an rvalue reference (T&&). The result is an xvalue (expiring value), which is a subcategory of both rvalue and glvalue. It has identity (refers to x) but is treated as movable.`,
    link: "https://en.cppreference.com/w/cpp/utility/move",
  },
  {
    id: 1458,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `Can a class-type rvalue be used to call member functions in C++?`,
    options: [
      "No, because rvalues do not have an address and member functions require a valid this pointer to execute",
      "No, because calling a member function would modify the temporary and the language prevents that action",
      "Yes, but only const member functions can be called on rvalues since the temporary cannot be modified",
      "Yes, you can call any member function on a class-type rvalue including non-const member functions too",
    ],
    correctIndex: 3,
    explanation: `You can call any member function on a class-type rvalue, including non-const ones. For example, std::string("hello").append(" world") is valid. The temporary exists long enough for the member function call to complete.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1459,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What type of reference can bind to an lvalue in C++?`,
    options: [
      "Only an rvalue reference declared with && can bind to an lvalue expression in any calling context used",
      "An lvalue reference declared with & can bind to an lvalue, and a const lvalue reference can bind as well",
      "Neither lvalue references nor rvalue references can bind to lvalues directly without using std::move first",
      "Only a const rvalue reference can bind to an lvalue because it prevents modification of the named object",
    ],
    correctIndex: 1,
    explanation: `An lvalue reference (T&) can bind to an lvalue of compatible type. A const lvalue reference (const T&) can also bind to an lvalue. Rvalue references (T&&) cannot bind to lvalues directly; you would need std::move to cast the lvalue to an rvalue reference.`,
    link: "https://en.cppreference.com/w/cpp/language/reference",
  },
  {
    id: 1460,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What value category does a string literal like \`"hello"\` have in C++?`,
    options: [
      "It is an lvalue because a string literal is a const char array with a fixed location that persists always",
      "It is a prvalue because string literals are temporary constants that do not have a real memory address",
      "It is an xvalue because the literal expires after the expression in which it appears finishes evaluation",
      "It is an rvalue because literals are constants and constants cannot appear on the left side of assignment",
    ],
    correctIndex: 0,
    explanation: `A string literal is an lvalue. It refers to a const char array stored in static memory with a fixed address. You can take the address of a string literal. This differs from numeric literals like 42, which are prvalues.`,
    link: "https://en.cppreference.com/w/cpp/language/string_literal",
  },
  {
    id: 1461,
    difficulty: "Easy",
    topic: "Value Categories",
    question: `What kind of expressions can an rvalue reference (\`T&&\`) bind to?`,
    options: [
      "It can bind to both lvalues and rvalues because rvalue references are universal references in all contexts",
      "It can bind only to named variables that have been explicitly marked with the const qualifier by the user",
      "It can bind to rvalues such as temporaries and expressions cast to rvalue references via std::move calls",
      "It can bind only to lvalues because the double ampersand is actually a reference to a reference in C++ code",
    ],
    correctIndex: 2,
    explanation: `An rvalue reference (T&&) binds to rvalues: temporaries, literals (except string literals), and expressions cast to rvalue references via std::move. It does not bind to lvalues directly. Note that T&& in a template context can be a forwarding reference, which is different.`,
    link: "https://en.cppreference.com/w/cpp/language/reference",
  },
  {
    id: 1462,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What are the three primary value categories defined in the C++11 standard?`,
    options: [
      "const, volatile, and mutable, which describe the mutability properties of expressions in the language",
      "stack, heap, and static, which describe where the expression's result is stored in program memory layout",
      "temporary, persistent, and expiring, which classify how long the result of an expression remains valid",
      "lvalue, prvalue, and xvalue, which classify expressions based on identity and whether they can be moved",
    ],
    correctIndex: 3,
    explanation: `C++11 defines three primary value categories: lvalue (has identity, cannot be moved from implicitly), prvalue (no identity, can be moved from), and xvalue (has identity, can be moved from). Two composite categories also exist: glvalue (lvalue or xvalue) and rvalue (prvalue or xvalue).`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1463,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What defines a prvalue (pure rvalue) in the C++11 value category taxonomy?`,
    options: [
      "A prvalue is an expression that has no identity and whose result can be used to initialize an object",
      "A prvalue is any expression that refers to a named variable appearing on the right side of an assignment",
      "A prvalue is an expression that has identity but is about to expire and can therefore be moved from safely",
      "A prvalue is a special category reserved for expressions that involve pointer arithmetic and array subscripts",
    ],
    correctIndex: 0,
    explanation: `A prvalue (pure rvalue) is an expression that does not have identity (you cannot take its address) and computes a value or initializes an object. Examples include numeric literals (42), arithmetic expressions (a + b), and function calls that return by value.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1464,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What is an xvalue (expiring value) in C++?`,
    options: [
      "An expression referring to a global object that is about to go out of scope when the program terminates",
      "An expression referring to a stack-allocated variable that is currently being deallocated by the runtime",
      "An expression that has identity and whose resources can be moved because the object is nearing its end",
      "An expression that results from evaluating a constexpr function at compile time and has no runtime form",
    ],
    correctIndex: 2,
    explanation: `An xvalue (expiring value) is an expression that has identity (refers to an object) but whose resources can be reused because the object is considered to be nearing the end of its lifetime. The most common xvalue is the result of std::move(). Xvalues are both glvalues and rvalues.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1465,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What is a glvalue (generalized lvalue) in the C++ value category taxonomy?`,
    options: [
      "A glvalue is any expression that has no identity and produces a temporary result for immediate consumption",
      "A glvalue is an expression that has identity, meaning it refers to an object whose address can be found",
      "A glvalue is an expression that can only appear inside a generic lambda or a variadic template parameter",
      "A glvalue is any expression that has been cast to a const reference and can no longer be modified at all",
    ],
    correctIndex: 1,
    explanation: `A glvalue (generalized lvalue) is any expression that has identity, meaning it refers to some object or function. It is the union of lvalues and xvalues. The key property is that a glvalue has an address, even if (in the case of xvalues) its resources may be moved.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1466,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What value category does the expression \`static_cast<std::string&&>(s)\` have?`,
    code: `std::string s = "hello";
auto&& ref = static_cast<std::string&&>(s);`,
    options: [
      "It is a prvalue because the static cast creates a temporary copy of the string in a new memory location",
      "It is an lvalue because s is a named variable and a cast does not change the underlying value category",
      "It is a glvalue but not an xvalue because the static_cast only changes the type and not the value category",
      "It is an xvalue because casting to an rvalue reference produces an expiring value that can be moved from",
    ],
    correctIndex: 3,
    explanation: `A cast to an rvalue reference type (T&&) produces an xvalue. This is exactly what std::move does internally. The result has identity (it still refers to s) but is treated as an expiring value, enabling move semantics.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1467,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What is temporary materialization in C++17?`,
    options: [
      "The implicit conversion that creates an object from a prvalue when a glvalue is expected by the context",
      "The process of moving a temporary into a named variable using an implicit call to the move constructor",
      "The optimization that eliminates temporary objects entirely by constructing them directly at their target",
      "The mechanism that converts an xvalue back into an lvalue when it is bound to a const reference variable",
    ],
    correctIndex: 0,
    explanation: `Temporary materialization is the implicit conversion from a prvalue to an xvalue. It occurs when a prvalue is used in a context that requires a glvalue (e.g., binding to a reference, accessing a member). The prvalue 'materializes' into a temporary object with an address.`,
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion",
  },
  {
    id: 1468,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `How does \`decltype\` determine its result when applied to an expression that is an lvalue?`,
    code: `int x = 5;
// What is decltype((x))?`,
    options: [
      "decltype reports the declared type of the variable exactly, so the result for int x would just be int here",
      "decltype reports a pointer type to the expression result, so the result for int x would be int* in this case",
      "decltype adds an lvalue reference to the type, so for an int lvalue the result is int& as the final answer",
      "decltype adds an rvalue reference to the type, so for an int lvalue the result would be int&& as the answer",
    ],
    correctIndex: 2,
    explanation: `When decltype is applied to an expression (not just a variable name), it adds a reference based on the value category: lvalue expressions yield T&, xvalue expressions yield T&&, and prvalue expressions yield T. Since (x) is an lvalue expression, decltype((x)) is int&.`,
    link: "https://en.cppreference.com/w/cpp/language/decltype",
  },
  {
    id: 1469,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What value category does a function call that returns by value produce?`,
    code: `std::string getName() { return "Alice"; }
auto s = getName();`,
    options: [
      "It produces an xvalue because the return value is an object that is about to expire after the call returns",
      "It produces a prvalue because the function returns a temporary result that has no persistent memory address",
      "It produces an lvalue because the returned string is a fully constructed object that has been named already",
      "It produces a glvalue because the result could be either an lvalue or xvalue depending on the call context",
    ],
    correctIndex: 1,
    explanation: `A function call that returns a non-reference type produces a prvalue. The returned object is a temporary with no persistent address. In C++17, this prvalue can directly initialize the target (guaranteed copy elision) without creating an intermediate temporary.`,
    link: "https://en.cppreference.com/w/cpp/language/value_category",
  },
  {
    id: 1470,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `Why can a \`const T&\` (const lvalue reference) bind to an rvalue in C++?`,
    options: [
      "Because the language allows const lvalue references to extend the lifetime of the temporary they bind to",
      "Because the compiler implicitly converts the rvalue into an lvalue before binding it to the const reference",
      "Because const references are actually implemented as rvalue references internally by the compiler backend",
      "Because rvalues are automatically promoted to static storage when bound, giving them a stable address used",
    ],
    correctIndex: 0,
    explanation: `A const lvalue reference can bind to an rvalue, and when it does, the lifetime of the temporary is extended to match the lifetime of the reference. This was a deliberate design choice to allow functions taking const T& to accept both lvalues and rvalues.`,
    link: "https://en.cppreference.com/w/cpp/language/reference_initialization",
  },
  {
    id: 1471,
    difficulty: "Medium",
    topic: "Value Categories",
    question: `What value category does a \`static_cast<int>(x)\` produce when x is a double variable?`,
    options: [
      "It produces an lvalue because the cast preserves the value category of the original operand expression",
      "It produces an xvalue because static_cast always marks its result as an expiring value to enable moving",
      "It is implementation-defined and depends on whether the compiler performs the cast at compile or runtime",
      "It produces a prvalue because the cast creates a new temporary int value from the double conversion",
    ],
    correctIndex: 3,
    explanation: `A static_cast to a non-reference type produces a prvalue. The cast creates a new temporary value of the target type. Only casts to rvalue reference types (T&&) produce xvalues. Casts to lvalue reference types (T&) produce lvalues.`,
    link: "https://en.cppreference.com/w/cpp/language/static_cast",
  },
  {
    id: 1472,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What value category does a member access expression on an xvalue have?`,
    code: `struct S { int x; };
S makeS();
int val = std::move(makeS()).x;`,
    options: [
      "It is an lvalue because member access always produces an lvalue regardless of the object's own category",
      "It is a prvalue because accessing a member on a temporary creates a new independent temporary for it",
      "It is an xvalue because member access on an xvalue propagates the xvalue category to the member result",
      "It is a glvalue but the exact subcategory is unspecified and depends on the implementation used by it",
    ],
    correctIndex: 2,
    explanation: `When you access a non-static data member of an xvalue, the result is also an xvalue. The value category propagates from the object expression to the member access. Similarly, member access on an lvalue produces an lvalue, and on a prvalue (after materialization) produces an xvalue.`,
    link: "https://en.cppreference.com/w/cpp/language/operator_member_access",
  },
  {
    id: 1473,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What is the difference between \`decltype(x)\` and \`decltype((x))\` for a variable \`int x\`?`,
    options: [
      "decltype(x) is int while decltype((x)) is int* because the parentheses trigger address-of conversion",
      "decltype(x) is int while decltype((x)) is int& because parenthesized names are treated as expressions",
      "They are identical and both produce int because parentheses have no effect on decltype evaluation rules",
      "decltype(x) is int while decltype((x)) is int&& because parentheses trigger rvalue reference deduction",
    ],
    correctIndex: 1,
    explanation: `decltype(x) where x is the name of a variable gives the declared type of x, which is int. But decltype((x)) treats (x) as an expression, and since x is an lvalue, the result is int&. This distinction catches many programmers off guard.`,
    link: "https://en.cppreference.com/w/cpp/language/decltype",
  },
  {
    id: 1474,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `How do value categories affect overload resolution when both \`void foo(T&)\` and \`void foo(T&&)\` exist?`,
    code: `void foo(std::string&);
void foo(std::string&&);
std::string s;
foo(s);
foo(std::move(s));`,
    options: [
      "Lvalue arguments select the lvalue reference overload and rvalue arguments select the rvalue reference one",
      "Both calls select the lvalue reference overload because it is considered more specialized by the compiler",
      "Both calls select the rvalue reference overload because rvalue references can also bind to lvalue arguments",
      "The calls are ambiguous and the compiler reports an error because both overloads match equally well here",
    ],
    correctIndex: 0,
    explanation: `Overload resolution uses value categories to select the best match. An lvalue argument (s) prefers the T& overload, while an rvalue argument (std::move(s)) prefers the T&& overload. This is the foundation of move-aware APIs that optimize for temporary objects.`,
    link: "https://en.cppreference.com/w/cpp/language/overload_resolution",
  },
  {
    id: 1475,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What are the rules for lifetime extension when a reference binds to a temporary in C++?`,
    options: [
      "Any reference type extends the lifetime of any temporary it binds to, with no exceptions in the language",
      "Only rvalue references extend temporary lifetimes, while const lvalue references always create a copy first",
      "Lifetime is extended only when the reference directly binds to the temporary, not through function returns",
      "Lifetime extension only works in function parameter contexts and never applies to local reference variables",
    ],
    correctIndex: 2,
    explanation: `Lifetime extension occurs when a reference directly binds to a temporary. However, if a function returns a reference to a local temporary, the lifetime is NOT extended. The binding must be direct at the declaration site. Returning a const T& from a function that creates a temporary leads to a dangling reference.`,
    link: "https://en.cppreference.com/w/cpp/language/lifetime",
  },
  {
    id: 1476,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What value category does a \`throw\` expression have in C++?`,
    code: `void f() {
  throw std::runtime_error("fail");
}`,
    options: [
      "It is an lvalue because the thrown exception object persists in memory until it is caught by a handler block",
      "It has no value category because a throw expression has type void and it does not produce any usable result",
      "It is a prvalue of type void because throw is an expression that evaluates but yields no value for use",
      "It is an xvalue because the thrown object is an expiring value that transfers its ownership to the handler",
    ],
    correctIndex: 2,
    explanation: `A throw expression is a prvalue of type void. It is classified as an expression (not a statement), which means it can appear in contexts like the conditional operator: condition ? value : throw error(). However, since its type is void, it cannot be used to initialize objects.`,
    link: "https://en.cppreference.com/w/cpp/language/throw",
  },
  {
    id: 1477,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What value category does the built-in comma operator produce?`,
    code: `int a = 1, b = 2;
int& ref = (a, b);`,
    options: [
      "It always produces a prvalue regardless of what the right-hand operand is, because the result is computed",
      "It produces the same value category as its right-hand operand, so if b is an lvalue the result is an lvalue",
      "It produces an xvalue because the left-hand operand is discarded and the right side is treated as expiring",
      "It produces a prvalue unless both operands are lvalues, in which case the result is also a valid lvalue here",
    ],
    correctIndex: 1,
    explanation: `The built-in comma operator evaluates both operands left-to-right, discards the left result, and produces the right operand. The value category of the result is the same as the right operand. Since b is an lvalue, (a, b) is an lvalue, which is why binding to int& works.`,
    link: "https://en.cppreference.com/w/cpp/language/operator_other",
  },
  {
    id: 1478,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What value category does the conditional operator \`?:\` produce when both alternatives are lvalues of the same type?`,
    code: `int a = 1, b = 2;
bool cond = true;
int& ref = cond ? a : b;`,
    options: [
      "It produces an lvalue when both the second and third operands are lvalues of the same type in the expression",
      "It always produces a prvalue because the conditional operator creates a temporary to hold the chosen result",
      "It produces an xvalue because the unchosen operand is effectively discarded and treated as expiring by it",
      "It produces a prvalue when the condition is true and an lvalue when the condition is false at runtime always",
    ],
    correctIndex: 0,
    explanation: `The conditional operator can produce an lvalue when both the second and third operands are lvalues of the same type. This allows binding the result to a reference, as shown in the example. If the operands differ in value category or type, conversions may produce a prvalue instead.`,
    link: "https://en.cppreference.com/w/cpp/language/operator_other",
  },
  {
    id: 1479,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What value category does the built-in subscript operator produce?`,
    code: `int arr[5] = {1, 2, 3, 4, 5};
arr[2] = 10;`,
    options: [
      "It produces a prvalue because array subscripting computes a new value from the base address and the index",
      "It produces an xvalue because the accessed element could be moved from when used in the right context here",
      "It produces a glvalue that is neither lvalue nor xvalue but a special third category for array access only",
      "It produces an lvalue because it refers to a specific element at a fixed position within the array object",
    ],
    correctIndex: 3,
    explanation: `The built-in subscript operator (a[b]) produces an lvalue. It refers to a specific object in memory (the array element), and you can take its address or assign to it. This is because a[b] is defined as *(a + b), and dereferencing a pointer always yields an lvalue.`,
    link: "https://en.cppreference.com/w/cpp/language/operator_member_access",
  },
  {
    id: 1480,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What happens to the value category during an implicit lvalue-to-rvalue conversion?`,
    options: [
      "The lvalue is converted to a prvalue that represents the value stored in the object, reading its contents",
      "The lvalue is converted to an xvalue so that the original object can be moved from after the conversion here",
      "The lvalue is converted to a glvalue that strips away the identity while preserving the storage class of it",
      "No actual conversion happens because lvalues and rvalues are interchangeable in all of the expression contexts",
    ],
    correctIndex: 0,
    explanation: `The lvalue-to-rvalue conversion reads the value from the lvalue object, producing a prvalue. This happens implicitly when an lvalue appears in a context that requires an rvalue, such as most arithmetic operations. The resulting prvalue carries just the value, with no identity.`,
    link: "https://en.cppreference.com/w/cpp/language/implicit_conversion",
  },
  {
    id: 1481,
    difficulty: "Hard",
    topic: "Value Categories",
    question: `What value category does a lambda expression have in C++?`,
    code: `auto fn = [](int x) { return x * 2; };`,
    options: [
      "It is an xvalue because the closure object is considered expiring and will be moved into the target variable",
      "It is a prvalue because the lambda expression produces a temporary closure object of a unique unnamed type",
      "It is an lvalue because the lambda creates a named function object that persists beyond the full expression",
      "It is a glvalue because the closure can be either an lvalue or xvalue depending on the context of the usage",
    ],
    correctIndex: 1,
    explanation: `A lambda expression is a prvalue. It produces a temporary object of a unique, unnamed closure type. Like other prvalues, it can be used to initialize variables (as shown) or be bound to references. The closure object itself is not an lvalue until it is stored in a named variable.`,
    link: "https://en.cppreference.com/w/cpp/language/lambda",
  },
];
