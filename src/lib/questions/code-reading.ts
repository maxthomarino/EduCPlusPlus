import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 972,
    difficulty: "Easy",
    topic: "Code Reading",
    question:
      "What does this code print? Pay close attention to the condition inside the if statement.",
    code: `#include <iostream>
int main() {
    int x = 3;
    if (x = 5) {
        std::cout << x;
    } else {
        std::cout << 0;
    }
    return 0;
}`,
    options: [
      "5 -- the assignment sets x to 5, which is truthy",
      "3 -- the original value of x is preserved here",
      "0 -- the condition evaluates to false so else runs",
      "Compilation error",
    ],
    correctIndex: 0,
    explanation:
      "The condition uses = (assignment) not == (comparison). The expression x = 5 assigns 5 to x and evaluates to 5, which is truthy. So the if-branch runs and prints 5.",
    link: "https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/",
  },
  {
    id: 973,
    difficulty: "Easy",
    topic: "Code Reading",
    question: "After this loop finishes, what is the value of the variable `count`?",
    code: `#include <iostream>
int main() {
    int count = 0;
    for (int i = 0; i < 5; i++) {
        count += 2;
    }
    std::cout << count;
    return 0;
}`,
    options: [
      "5 -- the loop runs five times adding 1 each time",
      "8 -- the loop runs four times adding 2 each time",
      "10 -- the loop runs five times adding 2 each time",
      "12 -- the loop runs six times adding 2 each time",
    ],
    correctIndex: 2,
    explanation:
      "The loop runs with i = 0, 1, 2, 3, 4, which is exactly 5 iterations. Each iteration adds 2 to count, so count = 0 + 2*5 = 10.",
    link: "https://www.learncpp.com/cpp-tutorial/for-statements/",
  },
  {
    id: 974,
    difficulty: "Easy",
    topic: "Code Reading",
    question: "What values of a and b are printed after the function call?",
    code: `#include <iostream>
void modify(int x, int& y) {
    x = 10;
    y = 20;
}
int main() {
    int a = 1, b = 2;
    modify(a, b);
    std::cout << a << " " << b;
    return 0;
}`,
    options: [
      "10 20 -- both parameters are modified by the function",
      "1 20 -- only the reference parameter b is changed",
      "1 2 -- neither value is changed after the function call",
      "10 2 -- only the first parameter a gets modified here",
    ],
    correctIndex: 1,
    explanation:
      "Parameter x is passed by value, so modifying x inside the function does not affect a. Parameter y is passed by reference, so modifying y changes b directly. The output is 1 20.",
    link: "https://www.learncpp.com/cpp-tutorial/pass-by-lvalue-reference/",
  },
  {
    id: 975,
    difficulty: "Easy",
    topic: "Code Reading",
    question: "What does this code print when accessing the array element?",
    code: `#include <iostream>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    std::cout << arr[3];
    return 0;
}`,
    options: [
      "30 -- index 3 means the third element in the array",
      "10 -- array indexing starts at the first element here",
      "50 -- index 3 refers to the last accessible element",
      "40 -- index 3 is the fourth element since arrays start at 0",
    ],
    correctIndex: 3,
    explanation:
      "C++ arrays use zero-based indexing. arr[0] is 10, arr[1] is 20, arr[2] is 30, and arr[3] is 40. So the output is 40.",
    link: "https://www.learncpp.com/cpp-tutorial/arrays-part-i/",
  },
  {
    id: 976,
    difficulty: "Easy",
    topic: "Code Reading",
    question: "What string does this code print to the console?",
    code: `#include <iostream>
#include <string>
int main() {
    std::string a = "Hello";
    std::string b = " World";
    std::string c = a + b + "!";
    std::cout << c;
    return 0;
}`,
    options: [
      "Hello -- only the first string is stored in variable c",
      "Hello World -- the exclamation mark is dropped from output",
      "Hello World! -- all three parts are concatenated together",
      "Error -- you cannot concatenate strings with the + operator",
    ],
    correctIndex: 2,
    explanation:
      "The + operator on std::string performs concatenation. It joins \"Hello\", \" World\", and \"!\" into a single string \"Hello World!\", which is then printed.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring/",
  },
  {
    id: 977,
    difficulty: "Easy",
    topic: "Code Reading",
    question:
      "What does this switch statement print? Watch for missing break statements.",
    code: `#include <iostream>
int main() {
    int val = 2;
    switch (val) {
        case 1: std::cout << "A";
        case 2: std::cout << "B";
        case 3: std::cout << "C";
        default: std::cout << "D";
    }
    return 0;
}`,
    options: [
      "BCD -- fall-through causes cases 2, 3, and default to run",
      "B -- only the matching case 2 runs and then exits switch",
      "ABCD -- all cases always execute regardless of the value",
      "BD -- it prints the matching case then skips to default",
    ],
    correctIndex: 0,
    explanation:
      "When val matches case 2, execution starts there and falls through all subsequent cases because there are no break statements. So it prints B, then C, then D, giving BCD.",
    link: "https://www.learncpp.com/cpp-tutorial/switch-statement-basics/",
  },
  {
    id: 978,
    difficulty: "Easy",
    topic: "Code Reading",
    question:
      "What value is assigned to the variable `result` by this ternary expression?",
    code: `#include <iostream>
int main() {
    int x = 7;
    int result = (x > 10) ? 100 : 200;
    std::cout << result;
    return 0;
}`,
    options: [
      "100 -- the condition x > 10 evaluates to true for x = 7",
      "7 -- the ternary operator returns the value of x itself",
      "10 -- the ternary returns the comparison threshold value",
      "200 -- the condition is false so the second branch is taken",
    ],
    correctIndex: 3,
    explanation:
      "The condition x > 10 is false because x is 7. When the condition is false, the ternary operator returns the value after the colon, which is 200.",
    link: "https://www.learncpp.com/cpp-tutorial/the-conditional-operator/",
  },
  {
    id: 979,
    difficulty: "Easy",
    topic: "Code Reading",
    question:
      "What does this code print? Pay attention to prefix vs postfix increment.",
    code: `#include <iostream>
int main() {
    int a = 5;
    int b = a++;
    int c = ++a;
    std::cout << b << " " << c;
    return 0;
}`,
    options: [
      "6 6 -- both increments produce the same result value",
      "5 7 -- postfix returns old value, prefix returns new value",
      "6 7 -- postfix returns new value, prefix returns new value",
      "5 6 -- postfix returns old value, prefix returns old value",
    ],
    correctIndex: 1,
    explanation:
      "a++ (postfix) returns the original value of a (5) then increments a to 6. So b = 5. Then ++a (prefix) increments a from 6 to 7 and returns the new value. So c = 7. Output is 5 7.",
    link: "https://www.learncpp.com/cpp-tutorial/increment-decrement-operators-and-side-effects/",
  },
  {
    id: 980,
    difficulty: "Easy",
    topic: "Code Reading",
    question:
      "What does this code print? Consider how short-circuit evaluation works with the logical AND operator.",
    code: `#include <iostream>
int main() {
    int x = 0;
    if (x != 0 && (10 / x) > 1) {
        std::cout << "Yes";
    } else {
        std::cout << "No";
    }
    return 0;
}`,
    options: [
      "No -- x is 0 so the first condition is false and && short-circuits",
      "Yes -- the division evaluates successfully and the result is true",
      "Runtime error -- division by zero crashes the running program here",
      "Compilation error",
    ],
    correctIndex: 0,
    explanation:
      "Since x is 0, the left side of && (x != 0) is false. With short-circuit evaluation, the right side (10 / x) is never evaluated, avoiding a division by zero. The else branch runs, printing No.",
    link: "https://www.learncpp.com/cpp-tutorial/logical-operators/",
  },
  {
    id: 981,
    difficulty: "Easy",
    topic: "Code Reading",
    question: "What does this code print when calling getValue() on the object?",
    code: `#include <iostream>
class Counter {
    int count;
public:
    Counter(int c) : count(c) {}
    int getValue() { return count; }
};
int main() {
    Counter obj(42);
    std::cout << obj.getValue();
    return 0;
}`,
    options: [
      "A garbage value",
      "0 -- all class member variables default to zero in C++ code",
      "42 -- the constructor initializes count to the passed argument",
      "Compilation error",
    ],
    correctIndex: 2,
    explanation:
      "The constructor Counter(int c) uses an initializer list to set count to 42. The method getValue() is a public member function that can access private members of its own class, so it returns 42.",
    link: "https://www.learncpp.com/cpp-tutorial/constructors/",
  },
  {
    id: 982,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What does this program print?",
    code: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int* ptr = arr;
    cout << *(ptr + 2) << " " << *(ptr + 4);
    return 0;
}`,
    options: [
      "20 40 -- ptr+2 skips two bytes from the start of the array",
      "10 30 -- pointer arithmetic starts from index 1 in arrays",
      "30 50 -- ptr+2 advances two int-sized steps to index 2",
      "30 40 -- ptr+4 wraps around to the fourth byte in memory",
    ],
    correctIndex: 2,
    explanation:
      "Pointer arithmetic on int* advances by sizeof(int) per step. ptr points to arr[0] which is 10. ptr+2 points to arr[2] which is 30, and ptr+4 points to arr[4] which is 50. So the output is \"30 50\".",
    link: "https://en.cppreference.com/w/cpp/language/operator_arithmetic.html",
  },
  {
    id: 983,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What does this program print when run?",
    code: `#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() { cout << "Animal"; }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void speak() override { cout << "Woof"; }
};

class Cat : public Animal {
public:
    void speak() override { cout << "Meow"; }
};

int main() {
    Animal* pet = new Cat();
    pet->speak();
    delete pet;
    return 0;
}`,
    options: [
      "It prints \"Animal\" because the pointer type is Animal*",
      "It prints \"Meow\" because virtual dispatch uses the Cat vtable",
      "It prints \"Woof\" because Dog is declared before Cat in code",
      "It causes undefined behavior due to the base pointer type",
    ],
    correctIndex: 1,
    explanation:
      "The pointer pet has static type Animal* but points to a Cat object. Because speak() is virtual, the call pet->speak() uses dynamic dispatch through the vtable of the actual object (Cat), so Cat::speak() runs and prints \"Meow\".",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 984,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "How many times is the copy constructor called in this program?",
    code: `#include <iostream>
using namespace std;

class Box {
public:
    int val;
    Box(int v) : val(v) { cout << "Ctor "; }
    Box(const Box& o) : val(o.val) { cout << "Copy "; }
    Box& operator=(const Box& o) {
        val = o.val;
        cout << "Assign ";
        return *this;
    }
};

int main() {
    Box a(5);
    Box b = a;
    Box c(10);
    c = a;
    return 0;
}`,
    options: [
      "Exactly once -- only \"Box b = a\" calls the copy constructor",
      "Exactly twice -- both \"Box b = a\" and \"c = a\" use copy ctor",
      "Zero times -- all three lines use the regular constructor only",
      "Exactly three times",
    ],
    correctIndex: 0,
    explanation:
      "\"Box a(5)\" calls the regular constructor. \"Box b = a\" is copy-initialization and calls the copy constructor (once). \"Box c(10)\" calls the regular constructor. \"c = a\" calls the assignment operator, not the copy constructor. Output: \"Ctor Copy Ctor Assign\". The copy constructor is called exactly once.",
    link: "https://en.cppreference.com/w/cpp/language/copy_constructor.html",
  },
  {
    id: 985,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What values does this program print?",
    code: `#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int y = 20;
    auto byVal = [x, y]() { return x + y; };
    auto byRef = [&x, &y]() { return x + y; };
    x = 100;
    y = 200;
    cout << byVal() << " " << byRef();
    return 0;
}`,
    options: [
      "100 200 -- both lambdas see the updated values of x and y",
      "30 300 -- byVal sees a copy, but byRef uses current memory",
      "30 30 -- both lambdas captured the values at creation time",
      "30 300 -- byVal captured copies at creation, byRef sees updates",
    ],
    correctIndex: 3,
    explanation:
      "The byVal lambda captures x and y by value at the time of creation, so it holds copies of 10 and 20 and returns 30. The byRef lambda captures x and y by reference, so after x=100 and y=200, it returns 300. The output is \"30 300\".",
    link: "https://en.cppreference.com/w/cpp/language/lambda.html",
  },
  {
    id: 986,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What does this program print?",
    code: `#include <iostream>
using namespace std;

int counter() {
    static int count = 0;
    count += 5;
    return count;
}

int main() {
    cout << counter() << " ";
    cout << counter() << " ";
    cout << counter();
    return 0;
}`,
    options: [
      "5 5 5 -- static just limits visibility, resets each call",
      "5 10 15 -- the static local persists between function calls",
      "0 5 10 -- count is returned before the increment each time",
      "5 25 125 -- static variables multiply instead of adding here",
    ],
    correctIndex: 1,
    explanation:
      "A static local variable is initialized only once and retains its value between calls. The first call sets count from 0 to 5 and returns 5. The second call adds 5 to get 10. The third call adds 5 to get 15. Output: \"5 10 15\".",
    link: "https://en.cppreference.com/w/cpp/language/storage_duration.html",
  },
  {
    id: 987,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What does this program print?",
    code: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40};
    int* p = arr;
    cout << *p++ << " ";
    cout << *p++ << " ";
    cout << *p;
    return 0;
}`,
    options: [
      "10 20 30 -- *p++ dereferences p first, then advances p",
      "11 21 31 -- the ++ increments the pointed-to value by one",
      "20 30 40 -- p++ advances the pointer before dereferencing it",
      "10 20 40 -- the second ++ skips an element in the array",
    ],
    correctIndex: 0,
    explanation:
      "The expression *p++ is parsed as *(p++) due to operator precedence. Postfix ++ returns the original pointer value, so * dereferences the old position. Then p advances. First call: dereference arr[0]=10, p moves to arr[1]. Second: dereference arr[1]=20, p moves to arr[2]. Third: dereference arr[2]=30. Output: \"10 20 30\".",
    link: "https://en.cppreference.com/w/cpp/language/operator_incdec.html",
  },
  {
    id: 988,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What does this program print?",
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};
    for (auto x : v) {
        x *= 10;
    }
    for (auto& x : v) {
        x += 1;
    }
    cout << v[0] << " " << v[2] << " " << v[4];
    return 0;
}`,
    options: [
      "10 30 50 -- the first loop multiplied all values by ten",
      "11 31 51 -- both loops modified the vector's stored values",
      "2 4 6 -- only the second loop modified the actual elements",
      "1 3 5 -- neither loop can modify the original vector data",
    ],
    correctIndex: 2,
    explanation:
      "In the first loop, \"auto x\" creates a copy of each element, so x *= 10 modifies only the local copy -- the vector is unchanged. In the second loop, \"auto& x\" is a reference to each element, so x += 1 modifies the vector in place. The vector becomes {2, 3, 4, 5, 6}. Output: \"2 4 6\".",
    link: "https://en.cppreference.com/w/cpp/language/range-for.html",
  },
  {
    id: 989,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "Does this code compile and run? If so, what does it print?",
    code: `#include <iostream>
#include <string>
using namespace std;

string greet() {
    return "Hello, World!";
}

int main() {
    const string& msg = greet();
    cout << msg;
    return 0;
}`,
    options: [
      "It fails to compile",
      "It compiles but crashes at runtime due to a dangling reference",
      "It compiles and prints garbage because the temporary is destroyed",
      "It compiles and prints \"Hello, World!\"",
    ],
    correctIndex: 3,
    explanation:
      "In C++, binding a const lvalue reference to a temporary extends the lifetime of that temporary to match the lifetime of the reference. So the string returned by greet() lives as long as msg does, and the program safely prints \"Hello, World!\".",
    link: "https://en.cppreference.com/w/cpp/language/reference_initialization.html",
  },
  {
    id: 990,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What does this program print?",
    code: `#include <iostream>
using namespace std;

int main() {
    int result = 0;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (j == 1) break;
            result += 1;
        }
    }
    cout << result;
    return 0;
}`,
    options: [
      "3 -- break exits the inner loop only, outer runs all 3 times",
      "1 -- break exits both loops after the very first j==1 check",
      "6 -- break has no effect because j is incremented beforehand",
      "9 -- the if condition is never true so break never executes",
    ],
    correctIndex: 0,
    explanation:
      "The break statement exits only the innermost loop it appears in. For each iteration of i (0,1,2), the inner loop starts with j=0, increments result by 1, then when j=1 the break exits the inner loop. So the inner loop adds 1 per outer iteration. 3 outer iterations gives result = 3.",
    link: "https://en.cppreference.com/w/cpp/language/break.html",
  },
  {
    id: 991,
    difficulty: "Medium",
    topic: "Code Reading",
    question: "What type does the compiler deduce for the variable result?",
    code: `#include <iostream>
#include <string>
using namespace std;

template <typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {
    return a + b;
}

int main() {
    auto result = add(3, 4.5);
    cout << result;
    return 0;
}`,
    options: [
      "int -- the first argument is int so the return type matches it",
      "long -- adding int and double promotes the result to long type",
      "double -- int + double promotes to double via usual conversions",
      "float -- mixed arithmetic with a decimal defaults to float type",
    ],
    correctIndex: 2,
    explanation:
      "The trailing return type decltype(a + b) with a being int and b being double yields double, because the usual arithmetic conversions promote int to double when added to double. So result is deduced as double, and the program prints 7.5.",
    link: "https://en.cppreference.com/w/cpp/language/template_argument_deduction.html",
  },
  {
    id: 992,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "What does this program print when a Derived object is passed by value to a function taking a Base parameter?",
    code: `#include <iostream>
struct Base {
  virtual std::string name() { return "Base"; }
};
struct Derived : Base {
  std::string name() override { return "Derived"; }
};

void print(Base b) {
  std::cout << b.name();
}

int main() {
  Derived d;
  print(d);
}`,
    options: [
      "It prints \"Base\" because the Derived part is sliced off when d is copied into the Base parameter by value",
      "It prints \"Derived\" because the virtual dispatch still resolves to the overridden method in the copy",
      "It causes undefined behavior because the vtable pointer is invalidated during the copy from Derived to Base",
      "It fails to compile because a Derived object cannot be implicitly converted to a Base value parameter",
    ],
    correctIndex: 0,
    explanation:
      "When a Derived object is passed by value to a function expecting a Base, object slicing occurs. The copy constructor of Base is invoked, creating a pure Base object. The Derived portion -- including the overridden virtual function dispatch -- is lost. The resulting object's vtable points to Base's vtable, so b.name() calls Base::name() and prints \"Base\". This is a classic pitfall of passing polymorphic objects by value instead of by reference or pointer.",
    link: "https://www.learncpp.com/cpp-tutorial/object-slicing/",
  },
  {
    id: 993,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "What order of destructor calls does this program print when main returns?",
    code: `#include <iostream>
struct Obj {
  char c;
  Obj(char ch) : c(ch) { std::cout << "+" << c; }
  ~Obj() { std::cout << "-" << c; }
};

int main() {
  Obj a('A');
  Obj b('B');
  Obj c('C');
}`,
    options: [
      "It prints +A+B+C-A-B-C because objects are destroyed in the same order they were constructed",
      "It prints +A+B+C-B-A-C because the middle object is destroyed first then outward in both directions",
      "The destruction order is unspecified by the standard and may vary between different compiler vendors",
      "It prints +A+B+C-C-B-A because local objects are destroyed in reverse order of their construction",
    ],
    correctIndex: 3,
    explanation:
      "The C++ standard requires that local objects with automatic storage duration are destroyed in the reverse order of their construction. Objects a, b, and c are constructed in that order, so the construction output is +A+B+C. When main returns, c is destroyed first, then b, then a, producing -C-B-A. The full output is +A+B+C-C-B-A. This reverse destruction order is guaranteed and ensures that objects constructed later (which might depend on earlier ones) are cleaned up first.",
    link: "https://en.cppreference.com/w/cpp/language/destructor",
  },
  {
    id: 994,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "What can happen when this program is compiled with optimizations enabled?",
    code: `#include <iostream>
#include <climits>

int main() {
  int x = INT_MAX;
  if (x + 1 > x) {
    std::cout << "overflow detected";
  } else {
    std::cout << "no overflow";
  }
}`,
    options: [
      "It always prints \"no overflow\" because INT_MAX + 1 wraps to INT_MIN which is less than INT_MAX",
      "It always prints \"overflow detected\" because the comparison is always true for any finite integer x",
      "It prints \"overflow detected\" because the optimizer assumes signed overflow cannot happen and removes the else",
      "It fails to compile because the compiler detects the guaranteed signed overflow at compile time as an error",
    ],
    correctIndex: 2,
    explanation:
      "Signed integer overflow is undefined behavior in C++. The compiler is allowed to assume it never happens. With optimizations, the compiler reasons: for any valid int x, x + 1 > x is always true (since overflow \"cannot\" occur). It therefore optimizes away the else branch entirely and always executes the if branch, printing \"overflow detected\". This is a well-known consequence of UB-based optimization. Without optimizations, wrapping might occur on two's complement hardware, but relying on that is non-portable.",
    link: "https://en.cppreference.com/w/cpp/language/ub",
  },
  {
    id: 995,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "What does this program print, and does std::move on a const object actually perform a move?",
    code: `#include <iostream>
#include <string>

void take(std::string s) {
  std::cout << s;
}

int main() {
  const std::string msg = "hello";
  std::string copy = std::move(msg);
  take(std::move(msg));
  std::cout << "|" << msg;
}`,
    options: [
      "It prints \"hello|\" because both std::move calls successfully move from msg, leaving it in an empty state",
      "It prints \"hello|hello\" because std::move on a const object produces a const rvalue reference, selecting copy",
      "It causes undefined behavior because moving from the same const object twice violates the moved-from contract",
      "It fails to compile because std::move cannot be called on a const-qualified lvalue expression at all",
    ],
    correctIndex: 1,
    explanation:
      "std::move on a const object produces a const rvalue reference (const std::string&&). The move constructors and move assignment operators of std::string take a non-const rvalue reference (std::string&&), so they do not match. Instead, the copy constructor (which takes const std::string&) is selected because a const rvalue reference can bind to a const lvalue reference. No actual move ever happens -- msg is copied each time and remains \"hello\". The output is \"hello|hello\".",
    link: "https://en.cppreference.com/w/cpp/utility/move",
  },
  {
    id: 996,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "In what order are the base class constructors called in this multiple inheritance hierarchy?",
    code: `#include <iostream>
struct A {
  A() { std::cout << "A"; }
};
struct B {
  B() { std::cout << "B"; }
};
struct C {
  C() { std::cout << "C"; }
};
struct D : C, A, B {
  D() : B(), A(), C() { std::cout << "D"; }
};

int main() {
  D d;
}`,
    options: [
      "It prints CABD because bases are constructed in the order they appear in the inheritance list, not the init list",
      "It prints ABCD because base constructors are always called in alphabetical order by their type names",
      "It prints BACD because the member initializer list order (B, A, C) determines the construction sequence",
      "It prints DCAB because the most-derived constructor body runs first then base constructors run afterward",
    ],
    correctIndex: 0,
    explanation:
      "The C++ standard mandates that base class constructors are called in the order they appear in the class definition's base-specifier list, regardless of the order in the member initializer list. D inherits from C, A, B (in that order), so the constructors run as C, A, B, then D's own body. The member initializer list order (B(), A(), C()) is ignored for base class construction ordering. The output is CABD. Compilers typically issue a warning when the initializer list order differs from the declaration order.",
    link: "https://en.cppreference.com/w/cpp/language/constructor",
  },
  {
    id: 997,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "When an exception is thrown after constructing a local RAII object, is the destructor called for that object?",
    code: `#include <iostream>
#include <stdexcept>

struct Guard {
  Guard()  { std::cout << "acquired "; }
  ~Guard() { std::cout << "released "; }
};

void work() {
  Guard g;
  throw std::runtime_error("fail");
}

int main() {
  try { work(); }
  catch (...) { std::cout << "caught"; }
}`,
    options: [
      "It prints \"acquired caught\" only because destructors are skipped when an exception propagates out of scope",
      "It prints \"acquired\" then terminates because throwing in a function with a local object calls std::terminate",
      "The behavior is implementation-defined and compilers may or may not invoke the destructor during unwinding",
      "It prints \"acquired released caught\" because stack unwinding destroys all fully-constructed local objects",
    ],
    correctIndex: 3,
    explanation:
      "When an exception is thrown, the C++ runtime performs stack unwinding. During this process, destructors are called for all local objects with automatic storage duration that have been fully constructed in the scope being exited. Since Guard g was fully constructed before the throw, its destructor runs during unwinding, printing \"released\". The exception is then caught in main, printing \"caught\". This deterministic cleanup is the foundation of the RAII idiom and is guaranteed by the standard.",
    link: "https://en.cppreference.com/w/cpp/language/throw",
  },
  {
    id: 998,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "What happens when this function returns a reference to a local variable and the caller uses it?",
    code: `#include <iostream>

int& getVal() {
  int local = 42;
  return local;
}

int main() {
  int& ref = getVal();
  std::cout << ref;
}`,
    options: [
      "It reliably prints 42 because the reference extends the lifetime of the local variable until ref goes out of scope",
      "It fails to compile because returning a reference to an automatic local variable is a syntax error in all standards",
      "It causes undefined behavior because the local variable is destroyed when getVal returns, leaving a dangling ref",
      "It prints 0 because the local's memory is zero-initialized by the runtime after the function's stack frame is freed",
    ],
    correctIndex: 2,
    explanation:
      "Returning a reference to a local variable creates a dangling reference. The local variable is destroyed when getVal() returns, and the reference ref then refers to memory that is no longer valid. Using this reference is undefined behavior -- it might print 42, garbage, 0, or crash. Compilers typically emit a warning but it is not a compilation error. The key misconception is that binding a reference extends lifetime, but that only applies to binding a const reference to a temporary, not to returning references to locals.",
    link: "https://en.cppreference.com/w/cpp/language/reference",
  },
  {
    id: 999,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "Does this aggregate initialization compile under C++11 and later, given the narrowing conversion?",
    code: `#include <iostream>

struct Point {
  int x;
  int y;
};

int main() {
  double a = 3.7, b = 4.2;
  Point p = {a, b};
  std::cout << p.x << " " << p.y;
}`,
    options: [
      "It compiles and prints 3.7 4.2 because the struct stores the double values and int is implicitly widened on output",
      "It fails to compile because brace initialization prohibits narrowing conversions from double to int since C++11",
      "It compiles and prints 3 4 because the doubles are truncated to int as implicit narrowing conversions are allowed",
      "It compiles but has undefined behavior because the fractional parts are lost in an unspecified truncation manner",
    ],
    correctIndex: 1,
    explanation:
      "Since C++11, list (brace) initialization prohibits narrowing conversions. Converting from double to int is a narrowing conversion because it can lose the fractional part. The code Point p = {a, b}; attempts to narrow doubles a and b into int fields, which is ill-formed. A conforming compiler must issue a diagnostic (typically an error). If the values were constexpr and fit exactly in int (e.g., 3.0), it would be allowed, but runtime double variables always count as potentially narrowing.",
    link: "https://en.cppreference.com/w/cpp/language/list_initialization",
  },
  {
    id: 1000,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "In a constexpr-if statement inside a template, does the compiler check the discarded branch for errors?",
    code: `#include <iostream>
#include <type_traits>

template <typename T>
void process(T val) {
  if constexpr (std::is_integral_v<T>) {
    std::cout << val * 2;
  } else {
    static_assert(std::is_floating_point_v<T>,
      "Only numeric types are supported");
    std::cout << val + 0.5;
  }
}

int main() {
  process(10);
}`,
    options: [
      "It prints 20 -- the else branch is discarded entirely and its static_assert is not evaluated for integral types",
      "It prints 20 -- the else branch is fully compiled but never executed, so the static_assert is checked and passes",
      "It fails to compile because static_assert in a discarded constexpr-if branch is always evaluated by the compiler",
      "It has undefined behavior because both branches generate code and the else branch's assert fires at runtime",
    ],
    correctIndex: 0,
    explanation:
      "When if constexpr evaluates to true, the else branch is a discarded statement. In a template, a discarded branch is not instantiated for the current template arguments. The static_assert depends on the template parameter T (via std::is_floating_point_v<T>), making it a dependent expression that is only checked upon instantiation. Since the else branch is never instantiated for T=int, the static_assert is never evaluated. The if branch runs, printing 10*2 = 20. If the static_assert's condition were non-dependent (e.g., static_assert(false)), it would fire even in a discarded branch.",
    link: "https://en.cppreference.com/w/cpp/language/if",
  },
  {
    id: 1001,
    difficulty: "Hard",
    topic: "Code Reading",
    question:
      "What do the structured binding variables bind to when iterating over a std::map with a range-based for loop?",
    code: `#include <iostream>
#include <map>

int main() {
  std::map<std::string, int> m = {
    {"alpha", 1}, {"beta", 2}
  };
  for (const auto& [key, val] : m) {
    std::cout << key << val << " ";
  }
}`,
    options: [
      "key binds to a copy of the string and val binds to a copy of the int stored separately from the map entries",
      "The binding fails to compile because structured bindings cannot destructure std::pair elements inside map nodes",
      "key and val bind to temporary pair objects created by the iterator, so modifying val would have no effect on m",
      "key binds to the pair's first and val binds to the pair's second (int) as references into the map",
    ],
    correctIndex: 3,
    explanation:
      "In a std::map, each element is a std::pair<const Key, Value>. When using structured bindings with const auto&, the binding aliases the pair's members by reference. Here, key is a reference to the const std::string (the pair's first member), and val is a const reference to the int (the pair's second member, made const by the const auto& qualifier). No copies are made. The map stores elements in sorted key order, so the output is \"alpha1 beta2 \". Without the const, val would be a non-const reference allowing modification of the map's values.",
    link: "https://en.cppreference.com/w/cpp/language/structured_bindings",
  },
];
