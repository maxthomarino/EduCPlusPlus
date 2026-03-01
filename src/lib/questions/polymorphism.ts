import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 912,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "C++ supports two main forms of polymorphism. Which pair correctly names them?",
    options: [
      "Compile-time (static) and runtime (dynamic) polymorphism",
      "Structural polymorphism and behavioral polymorphism",
      "Reference polymorphism and pointer-based polymorphism",
      "Implicit polymorphism and user-defined polymorphism",
    ],
    correctIndex: 0,
    explanation:
      "C++ offers compile-time polymorphism through templates and function overloading, and runtime polymorphism through virtual functions and inheritance. These are the two standard categories recognized by the language.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-object-oriented-programming/",
  },
  {
    id: 913,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What does the `virtual` keyword do when applied to a base class member function?",
    options: [
      "It prevents the function from being called outside the class",
      "It forces every derived class to implement its own version",
      "It makes the function available only at compile time in templates",
      "It enables dynamic dispatch so derived overrides are called at runtime",
    ],
    correctIndex: 3,
    explanation:
      "Marking a base class function as virtual enables dynamic dispatch. When the function is called through a base pointer or reference, the program determines which override to invoke at runtime based on the actual object type.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 914,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What does this code print?",
    code: `class Base {
public:
    virtual void speak() { std::cout << "Base"; }
};
class Derived : public Base {
public:
    void speak() override { std::cout << "Derived"; }
};

Base* ptr = new Derived();
ptr->speak();`,
    options: [
      "It prints nothing because virtual functions suppress output",
      "Derived -- the virtual call resolves to the actual object type",
      "Base -- the pointer type always determines which version runs",
      "It causes a compilation error due to the override specifier",
    ],
    correctIndex: 1,
    explanation:
      "Because speak() is virtual, the call through a Base pointer is resolved at runtime. The actual object is a Derived instance, so Derived::speak() is invoked, printing \"Derived\".",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 915,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What does the syntax `= 0` at the end of a virtual function declaration mean?",
    code: `class Shape {
public:
    virtual double area() const = 0;
};`,
    options: [
      "It assigns a default return value of zero to the function",
      "It marks the function as deprecated and scheduled for removal",
      "It declares a pure virtual function with no base class body",
      "It initializes the virtual table pointer to a null address",
    ],
    correctIndex: 2,
    explanation:
      "The = 0 syntax declares a pure virtual function. It tells the compiler that this function has no implementation in the base class and must be overridden by any concrete derived class.",
    link: "https://en.cppreference.com/w/cpp/language/abstract_class.html",
  },
  {
    id: 916,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "Can you create an instance of a class that contains at least one pure virtual function?",
    options: [
      "Yes, but only if the pure virtual function has a default body provided",
      "Yes, the compiler generates a stub implementation automatically for you",
      "No, unless you cast it to a derived type during the construction call",
      "No, only pointers or references to such a class may be declared",
    ],
    correctIndex: 3,
    explanation:
      "A class with one or more pure virtual functions is abstract and cannot be instantiated directly. You can only create objects of concrete derived classes that override all pure virtual functions, then use base pointers or references.",
    link: "https://www.learncpp.com/cpp-tutorial/pure-virtual-functions-abstract-base-classes-and-interface-classes/",
  },
  {
    id: 917,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "Function overloading is an example of which type of polymorphism?",
    code: `int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }`,
    options: [
      "Compile-time polymorphism",
      "Runtime polymorphism",
      "Template polymorphism",
      "Dynamic polymorphism",
    ],
    correctIndex: 0,
    explanation:
      "Function overloading is resolved entirely at compile time. The compiler uses the number and types of arguments to select the matching function, making it a form of compile-time (static) polymorphism.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-function-overloading/",
  },
  {
    id: 918,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "Which operator function signature correctly overloads the + operator for a Vec2 class?",
    options: [
      "Vec2 add const;",
      "Vec2 operator+ const;",
      "Vec2 plus const;",
      "Vec2 op_add const;",
    ],
    correctIndex: 1,
    explanation:
      "Operator overloading uses the keyword operator followed by the operator symbol. The correct syntax is operator+. The other options use regular function names which do not overload the + operator.",
    link: "https://www.learncpp.com/cpp-tutorial/overloading-the-arithmetic-operators-using-friend-functions/",
  },
  {
    id: 919,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What does the `override` keyword do when placed on a derived class method?",
    code: `class Base {
public:
    virtual void draw() const;
};
class Circle : public Base {
public:
    void draw() const override;
};`,
    options: [
      "It converts the function to a pure virtual function automatically",
      "It replaces the base version so the base function is fully deleted",
      "It tells the compiler to verify the function overrides a base virtual",
      "It changes the function linkage from internal to external visibility",
    ],
    correctIndex: 2,
    explanation:
      "The override specifier instructs the compiler to check that the function actually overrides a virtual function in a base class. If the signatures do not match, the compiler reports an error, preventing silent bugs.",
    link: "https://en.cppreference.com/w/cpp/language/override.html",
  },
  {
    id: 920,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "Why should a base class destructor be declared virtual when objects are deleted through base pointers?",
    code: `class Base {
public:
    virtual ~Base() = default;
};
class Derived : public Base {
    int* data;
public:
    ~Derived() { delete data; }
};`,
    options: [
      "A virtual destructor makes the class abstract and prevents direct use",
      "Without it, the compiler refuses to compile any class with inheritance",
      "It ensures the derived destructor runs, preventing resource leaks",
      "It allows the destructor to be called multiple times without errors",
    ],
    correctIndex: 2,
    explanation:
      "When you delete a Derived object through a Base pointer, a non-virtual destructor would only call Base::~Base(), skipping Derived::~Derived() and leaking resources. A virtual destructor ensures the correct derived destructor is called first.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-destructors-virtual-assignment-and-overriding-virtualization/",
  },
  {
    id: 921,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What is the key difference between static binding and dynamic binding in C++?",
    options: [
      "Static binding resolves function calls at compile time, while dynamic binding resolves them at runtime via virtual dispatch",
      "Static binding applies only to global functions, while dynamic binding applies only to class member functions in every case",
      "Static binding uses the heap for dispatch, while dynamic binding uses the stack for all function resolution lookups",
      "Static binding requires the override keyword, while dynamic binding requires the final keyword on every function",
    ],
    correctIndex: 0,
    explanation:
      "Static binding (early binding) resolves which function to call at compile time based on the declared type. Dynamic binding (late binding) defers resolution to runtime using the virtual table, selecting the function based on the actual object type.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 922,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "What is the vtable in C++ and when is it typically created?",
    code: `class Base {
public:
    virtual void speak() { std::cout << "Base"; }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void speak() override { std::cout << "Derived"; }
};`,
    options: [
      "A per-class table of function pointers, generated at compile time",
      "A per-object table of function pointers, generated at runtime",
      "A per-class table of object addresses, generated at link time",
      "A per-object table of class names, generated at compile time",
    ],
    correctIndex: 0,
    explanation:
      "The vtable is a per-class (not per-object) table of function pointers to virtual functions. The compiler generates it at compile time. Each object with virtual functions contains a hidden vptr that points to its class's vtable, enabling dynamic dispatch.",
    link: "https://www.learncpp.com/cpp-tutorial/the-virtual-table/",
  },
  {
    id: 923,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "What does this code print, and why?",
    code: `class Base {
public:
    int x;
    virtual void show() { std::cout << "Base"; }
    Base() : x(10) {}
};

class Derived : public Base {
public:
    int y;
    void show() override { std::cout << "Derived"; }
    Derived() : y(20) {}
};

int main() {
    Derived d;
    Base b = d;  // copy by value
    b.show();
}`,
    options: [
      "It prints \"Derived\" because d is a Derived object originally",
      "It throws a runtime exception due to type mismatch on copy",
      "It prints \"Base\" because object slicing removes the Derived part",
      "It prints nothing because the assignment is not permitted here",
    ],
    correctIndex: 2,
    explanation:
      "Assigning a Derived object to a Base variable by value causes object slicing. Only the Base portion of d is copied into b, including the Base vptr. The Derived-specific data member y and the Derived vtable pointer are lost, so b.show() calls Base::show().",
    link: "https://www.learncpp.com/cpp-tutorial/object-slicing/",
  },
  {
    id: 924,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "Which statement about covariant return types is correct?",
    code: `class Base {
public:
    virtual Base* clone() const {
        return new Base(*this);
    }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    Derived* clone() const override {
        return new Derived(*this);
    }
};`,
    options: [
      "This code fails to compile because return types must be identical",
      "Covariant returns allow Derived* when Base* is the base return type",
      "Covariant returns only work with references, not with raw pointers",
      "The override keyword is invalid here due to the different return type",
    ],
    correctIndex: 1,
    explanation:
      "C++ allows a covariant return type: if a base virtual function returns Base*, the override may return Derived* (or any type publicly derived from Base). This applies to both pointers and references. The override keyword is valid because the compiler recognizes the covariant relationship.",
    link: "https://en.cppreference.com/w/cpp/language/virtual.html",
  },
  {
    id: 925,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What does calling a virtual function inside a constructor actually invoke?",
    code: `class Base {
public:
    Base() { greet(); }
    virtual void greet() {
        std::cout << "Hello from Base\n";
    }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void greet() override {
        std::cout << "Hello from Derived\n";
    }
};

int main() { Derived d; }`,
    options: [
      "It prints \"Hello from Derived\" via normal virtual dispatch",
      "It prints both \"Hello from Base\" then \"Hello from Derived\"",
      "It is undefined behavior to call virtual functions in constructors",
      "It prints \"Hello from Base\" because the Derived part is not yet constructed",
    ],
    correctIndex: 3,
    explanation:
      "During Base's constructor, the object's dynamic type is Base, not Derived. The Derived portion has not been constructed yet, so virtual dispatch resolves to Base::greet(). This is well-defined behavior -- not undefined -- but it often surprises developers who expect the Derived override to be called.",
    link: "https://www.learncpp.com/cpp-tutorial/calling-virtual-functions-from-constructors-and-destructors/",
  },
  {
    id: 926,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What happens when you try to override a function marked 'final' in a derived class?",
    code: `class Base {
public:
    virtual void process() { }
    virtual ~Base() = default;
};

class Middle : public Base {
public:
    void process() override final { }
};

class Bottom : public Middle {
public:
    void process() override { }
};`,
    options: [
      "Bottom::process causes a compile error because Middle marked it final",
      "Bottom::process silently hides Middle::process without any error",
      "The final keyword is ignored when override is also used on Middle",
      "The code compiles but Middle::process is always called at runtime",
    ],
    correctIndex: 0,
    explanation:
      "The final specifier on Middle::process prevents any further derived class from overriding that function. When Bottom attempts to override it, the compiler produces an error. The final keyword works alongside override -- they are not mutually exclusive.",
    link: "https://en.cppreference.com/w/cpp/language/final.html",
  },
  {
    id: 927,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "How does virtual inheritance solve the diamond problem in multiple inheritance?",
    code: `class Animal {
public:
    int age;
    virtual ~Animal() = default;
};
class Dog : virtual public Animal { };
class Cat : virtual public Animal { };
class DogCat : public Dog, public Cat { };`,
    options: [
      "It prevents DogCat from inheriting any members from Animal at all",
      "It creates two separate copies of Animal that are merged at runtime",
      "It ensures only one shared Animal subobject exists in DogCat objects",
      "It forces Dog and Cat to use pointers to Animal instead of subobjects",
    ],
    correctIndex: 2,
    explanation:
      "Without virtual inheritance, DogCat would contain two separate Animal subobjects (one via Dog, one via Cat), causing ambiguity. Virtual inheritance ensures that Dog and Cat share a single Animal subobject within DogCat, eliminating duplicate base members and ambiguous access.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-base-classes/",
  },
  {
    id: 928,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "When does dynamic_cast return nullptr for pointer types?",
    code: `class Base {
public:
    virtual ~Base() = default;
};
class Derived : public Base { };
class Other : public Base { };

Base* bp = new Other();
Derived* dp = dynamic_cast<Derived*>(bp);`,
    options: [
      "It never returns nullptr because Base has a virtual destructor defined",
      "It returns nullptr when the actual object type is not the target type",
      "It returns nullptr only when used with references rather than pointers",
      "It returns nullptr when the base class does not have virtual functions",
    ],
    correctIndex: 1,
    explanation:
      "dynamic_cast checks the actual runtime type of the object using RTTI. Here bp points to an Other object, not a Derived object, so the cast to Derived* fails and returns nullptr. The base class must be polymorphic (have at least one virtual function) for dynamic_cast to work at all.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast.html",
  },
  {
    id: 929,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "In C++, what is the difference between overriding, overloading, and hiding a base class member function?",
    code: `class Base {
public:
    virtual void foo(int x) { }
    void bar(int x) { }
    virtual ~Base() = default;
};
class Derived : public Base {
public:
    void foo(int x) override { }  // A
    void foo(double x) { }        // B
    void bar(int x) { }           // C
};`,
    options: [
      "A overrides, B overloads foo in Derived, and C overrides bar",
      "A overrides, B also overrides with different parameter, C hides",
      "A overrides, B hides Base::foo(int) in Derived, and C hides bar",
      "A hides Base::foo, B overloads in Derived scope, C overrides bar",
    ],
    correctIndex: 2,
    explanation:
      "A is a proper override of the virtual function Base::foo(int). B declares a new foo(double) in Derived, which hides Base::foo(int) from unqualified lookup in Derived's scope -- this is name hiding, not overloading across scopes. C hides Base::bar(int) because bar is non-virtual, so it cannot be overridden.",
    link: "https://www.learncpp.com/cpp-tutorial/hiding-inherited-functionality/",
  },
  {
    id: 930,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "What is the Non-Virtual Interface (NVI) pattern, and why is it used?",
    code: `class Shape {
public:
    void draw() const {
        validate();
        doDraw();    // calls the private virtual
        log();
    }
    virtual ~Shape() = default;
private:
    virtual void doDraw() const = 0;
    void validate() const { /* ... */ }
    void log() const { /* ... */ }
};`,
    options: [
      "NVI uses only non-virtual functions and avoids virtual dispatch entirely",
      "NVI makes all virtual functions public to simplify the class interface",
      "NVI prevents derived classes from customizing any base class behavior",
      "NVI uses a public non-virtual wrapper that calls a private virtual function",
    ],
    correctIndex: 3,
    explanation:
      "The NVI pattern exposes a public non-virtual function (draw) that performs pre/post operations and delegates to a private virtual function (doDraw) that derived classes override. This lets the base class control the invariant steps while derived classes customize only the core behavior.",
    link: "https://en.cppreference.com/w/cpp/language/nvi.html",
  },
  {
    id: 931,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What is the primary runtime overhead of calling a virtual function compared to a non-virtual function?",
    code: `class Widget {
public:
    virtual void update() { }
    void reset() { }
    virtual ~Widget() = default;
};

Widget* w = getWidget();
w->update();  // virtual call
w->reset();   // non-virtual call`,
    options: [
      "An indirect function call through the vtable pointer, plus a possible cache miss",
      "A full runtime type lookup in a global type registry before each virtual call",
      "An additional heap allocation is required every time a virtual function is called",
      "A mutex lock is acquired to ensure thread safety during virtual function dispatch",
    ],
    correctIndex: 0,
    explanation:
      "A virtual call requires loading the vptr from the object, indexing into the vtable, and calling through the resulting function pointer. This indirection (typically one or two extra memory loads) can cause CPU cache misses. There is no global type registry lookup, heap allocation, or mutex involved in virtual dispatch itself.",
    link: "https://www.learncpp.com/cpp-tutorial/the-virtual-table/",
  },
  {
    id: 932,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Given multiple inheritance from two polymorphic bases, how many vptrs does the most-derived object typically contain?",
    code: `struct A { virtual void f(); };
struct B { virtual void g(); };
struct C : A, B { void f() override; void g() override; };

C obj;
// How many vptrs does obj contain?`,
    options: [
      "Exactly one vptr because the compiler merges all vtables into a single dispatch table for efficiency",
      "Three vptrs -- one for each of A, B, and C -- since every class in the hierarchy gets its own pointer",
      "Two vptrs -- one for the A subobject and one for the B subobject -- each pointing to its own vtable",
      "Zero vptrs because the compiler can resolve all calls at compile time via final overriders in C",
    ],
    correctIndex: 2,
    explanation:
      "In typical implementations, each polymorphic base subobject needs its own vptr. C inherits from both A and B, so the C object contains two vptrs: one at the A subobject offset and one at the B subobject offset. The most-derived class C does not introduce a third vptr; it reuses the A subobject's vptr for its own virtual functions. This is necessary so that a B* pointing into the C object can still dispatch correctly through its own vtable.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 933,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What does this CRTP (Curiously Recurring Template Pattern) code print, and why does it avoid virtual dispatch?",
    code: `template <typename Derived>
struct Base {
  void interface() {
    static_cast<Derived*>(this)->impl();
  }
};

struct Widget : Base<Widget> {
  void impl() { std::cout << "Widget"; }
};

Widget w;
w.interface();`,
    options: [
      "It prints \"Widget\"",
      "It prints nothing",
      "It causes undefined behavior",
      "It fails to compile",
    ],
    correctIndex: 0,
    explanation:
      "CRTP achieves compile-time polymorphism by having the base class template parameterized on the derived class. When interface() calls static_cast<Derived*>(this)->impl(), the compiler knows the exact type at compile time and emits a direct call to Widget::impl() with no vtable overhead. The Derived type is complete by the time the member function is instantiated, so the cast is well-defined.",
    link: "https://en.cppreference.com/w/cpp/language/crtp",
  },
  {
    id: 934,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What does typeid return for a non-polymorphic type accessed through a base reference versus a polymorphic type?",
    code: `struct NonPoly { int x; };
struct DerivedNP : NonPoly {};

struct Poly { virtual ~Poly() = default; };
struct DerivedP : Poly {};

DerivedNP dnp; NonPoly& rnp = dnp;
DerivedP dp;   Poly& rp = dp;

bool a = (typeid(rnp) == typeid(DerivedNP));
bool b = (typeid(rp)  == typeid(DerivedP));`,
    options: [
      "a is true, b is true",
      "a is false, b is true",
      "a is false, b is false",
      "a is true, b is false",
    ],
    correctIndex: 1,
    explanation:
      "For non-polymorphic types, typeid uses the static (declared) type of the expression, so typeid(rnp) yields NonPoly, making a false. For polymorphic types (those with at least one virtual function), typeid uses RTTI to determine the dynamic type at runtime, so typeid(rp) yields DerivedP, making b true. This is why at least one virtual function is needed for dynamic type identification.",
    link: "https://en.cppreference.com/w/cpp/language/typeid",
  },
  {
    id: 935,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "In the diamond inheritance below using virtual bases, how many Base subobjects does Final contain, and how is the shared base located?",
    code: `struct Base { int val = 42; virtual void f() {} };
struct Left  : virtual Base { void f() override {} };
struct Right : virtual Base { void f() override {} };
struct Final : Left, Right  { void f() override {} };

Final obj;
Left*  lp = &obj;
Right* rp = &obj;
// Do lp->val and rp->val refer to the same int?`,
    options: [
      "Two Base subobjects exist",
      "One Base subobject exists at a fixed offset from Final known at compile time, like normal inheritance layout",
      "Two Base subobjects exist but the compiler aliases their memory so writes to one are visible through the other",
      "One Base subobject exists",
    ],
    correctIndex: 3,
    explanation:
      "Virtual inheritance ensures exactly one shared Base subobject in Final. Because Left and Right do not know their offset to the shared Base at compile time (it depends on the most-derived class), they use an indirection mechanism -- typically a vbase pointer or an offset stored in the vtable -- to locate the single Base subobject at runtime. Both lp->val and rp->val refer to the same int.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class",
  },
  {
    id: 936,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "In which scenario can the compiler devirtualize a virtual function call, bypassing the vtable entirely?",
    code: `struct Base {
  virtual int compute() { return 1; }
};
struct Derived final : Base {
  int compute() override { return 2; }
};

void callByValue(Derived d) {
  int r = d.compute(); // Can this be devirtualized?
}

void callByRef(Base& b) {
  int r = b.compute();  // Can this be devirtualized?
}`,
    options: [
      "callByValue can be devirtualized because the exact type is known; callByRef generally cannot without more info",
      "callByRef can be devirtualized because references always carry type info; callByValue cannot due to slicing",
      "Neither call can be devirtualized",
      "Both calls are always devirtualized",
    ],
    correctIndex: 0,
    explanation:
      "In callByValue, the parameter d has the exact type Derived (marked final), so the compiler knows no further overrides exist and can emit a direct call. In callByRef, the reference could point to any class derived from Base, so the compiler must generally use vtable dispatch unless it can prove the dynamic type through other analysis (like seeing the call site). The final keyword on Derived is key -- it guarantees no subclass can override compute().",
    link: "https://en.cppreference.com/w/cpp/language/final",
  },
  {
    id: 937,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Why must a pure virtual destructor still have a definition provided, unlike other pure virtual functions?",
    code: `struct Abstract {
  virtual ~Abstract() = 0;
};
// Abstract::~Abstract() {} // Is this needed?

struct Concrete : Abstract {
  ~Concrete() override {}
};

Concrete c; // What happens without the definition?`,
    options: [
      "No definition is needed",
      "The definition is needed only if Abstract has data members that require non-trivial destruction explicitly",
      "Derived destructors implicitly call the base destructor, so a missing definition causes a linker error",
      "The definition is optional",
    ],
    correctIndex: 2,
    explanation:
      "When Concrete is destroyed, its destructor ~Concrete() automatically chains a call to ~Abstract() as part of the standard destruction sequence. If Abstract::~Abstract() has no definition, this implicit call results in an unresolved symbol at link time. This is unique to destructors because they are always called in the base-to-derived chain during object destruction, unlike other pure virtual functions which are only called if explicitly invoked.",
    link: "https://en.cppreference.com/w/cpp/language/destructor",
  },
  {
    id: 938,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What is the primary advantage of using std::variant with std::visit over a traditional virtual-function class hierarchy?",
    code: `using Shape = std::variant<Circle, Rect, Tri>;

double area(const Shape& s) {
  return std::visit([](const auto& shape) {
    return shape.area();
  }, s);
}

// vs.
// struct Shape { virtual double area() const = 0; };
// struct Circle : Shape { ... };`,
    options: [
      "std::visit uses RTTI under the hood making it slower but safer than virtual dispatch for all type sizes",
      "Values are stored inline with no heap allocation, and dispatch uses a jump table",
      "std::variant allows unlimited types while virtual hierarchies are capped at a compiler-defined maximum depth",
      "std::visit calls are always resolved at compile time, making it impossible to add new types at link time",
    ],
    correctIndex: 1,
    explanation:
      "std::variant stores the active alternative inline (no heap allocation), and std::visit typically dispatches through a compiler-generated jump table or switch indexed by the variant's internal type index. This avoids the pointer indirection and cache misses inherent in virtual dispatch through base pointers to heap-allocated objects. The trade-off is a closed set of types -- you cannot add new alternatives without modifying the variant definition and recompiling.",
    link: "https://en.cppreference.com/w/cpp/utility/variant/visit",
  },
  {
    id: 939,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Why can't C++ virtual functions provide true multiple dispatch, and what is the standard workaround?",
    code: `struct Shape { virtual bool intersects(Shape& o) = 0; };
struct Circle : Shape {
  bool intersects(Shape& o) override {
    // Need to know o's dynamic type too!
    // Single dispatch only resolves 'this'
  }
};
struct Rect : Shape { /* same problem */ };
// How do we resolve both types?`,
    options: [
      "C++ does support multiple dispatch via overload resolution",
      "Use virtual inheritance to merge the dispatch tables so the compiler resolves both arguments automatically",
      "Add RTTI casts inside each override to check the other argument",
      "Use the visitor pattern: the second argument calls back a method on the first, resolving both types via two calls",
    ],
    correctIndex: 3,
    explanation:
      "C++ virtual dispatch only resolves the dynamic type of the object on which the method is called (single dispatch). To dispatch on two dynamic types, the visitor pattern uses two virtual calls: the first call dispatches on 'this', and inside that override, a second virtual call dispatches on the other argument by calling back into it. This two-step process resolves both dynamic types. RTTI with dynamic_cast is fragile and violates the open-closed principle.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 940,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Can a polymorphic base class (one with virtual functions) benefit from Empty Base Optimization (EBO)?",
    code: `struct Empty {};
struct PolyEmpty { virtual ~PolyEmpty() = default; };

struct A : Empty       { int data; };
struct B : PolyEmpty   { int data; };

// sizeof(Empty) == 1, but sizeof(A) == sizeof(int) via EBO.
// What about sizeof(B)?`,
    options: [
      "No EBO -- a polymorphic base contains a hidden vptr, so it is never truly empty and always adds to the size",
      "EBO applies -- the compiler removes the vptr when the base has no data members besides the vtable pointer",
      "EBO applies only if the derived class is also polymorphic and merges vtables with the base class completely",
      "No EBO -- the standard forbids applying EBO to any base class that has any member functions defined at all",
    ],
    correctIndex: 0,
    explanation:
      "EBO allows an empty base subobject to occupy zero bytes in the derived class layout. However, a class with virtual functions is never truly empty because it contains a hidden vptr (virtual table pointer) added by the implementation. Since PolyEmpty has sizeof >= sizeof(void*) due to the vptr, it is not an empty class and EBO does not apply. sizeof(B) will be sizeof(void*) + sizeof(int) (plus any padding), larger than sizeof(A).",
    link: "https://en.cppreference.com/w/cpp/language/ebo",
  },
  {
    id: 941,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What happens if a virtual function called during stack unwinding throws a second exception?",
    code: `struct Resource {
  virtual void cleanup() { throw std::logic_error("oops"); }
  ~Resource() noexcept(false) {
    cleanup(); // virtual call in destructor during unwind
  }
};

try {
  Resource r;
  throw std::runtime_error("first");
  // ~Resource() runs during unwinding and cleanup() throws
} catch (...) { /* ... */ }`,
    options: [
      "The second exception replaces the first one and propagation continues normally with the new logic_error",
      "Both exceptions are stored and can be accessed later through std::current_exception as a chained pair",
      "The first exception is silently discarded and only the second exception from cleanup() is caught by catch",
      "std::terminate is called because two exceptions cannot be active simultaneously during stack unwinding",
    ],
    correctIndex: 3,
    explanation:
      "When an exception is thrown while another exception is already propagating (during stack unwinding), C++ calls std::terminate() immediately. The language does not support multiple simultaneously active exceptions. This is why destructors should be noexcept (the default since C++11) and virtual functions called from destructors must not throw during stack unwinding. Marking the destructor noexcept(false) avoids the implicit noexcept but does not prevent std::terminate.",
    link: "https://en.cppreference.com/w/cpp/error/terminate",
  },
  {
    id: 1122,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What does the 'virtual' keyword do when applied to a member function in a base class?",
    options: [
      "It enables dynamic dispatch so the derived version is called through a base pointer",
      "It prevents derived classes from providing their own version of that function",
      "It forces the compiler to inline the function body at every call site automatically",
      "It restricts the function so that only the base class itself can invoke it directly",
    ],
    correctIndex: 0,
    explanation:
      "Declaring a function as virtual in the base class enables dynamic dispatch. When called through a base class pointer or reference, the runtime resolves the call to the most-derived override, enabling polymorphic behavior.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1123,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What is a pure virtual function in C++?",
    options: [
      "A function declared with the static keyword and no definition in any class",
      "A function that is defined in the base class but cannot be called directly",
      "A virtual function assigned '= 0' that must be overridden in derived classes",
      "A virtual function that has a default body and returns zero automatically",
    ],
    correctIndex: 2,
    explanation:
      "A pure virtual function is declared by appending '= 0' to the function declaration. Any class containing at least one pure virtual function becomes abstract and cannot be instantiated -- derived classes must provide an implementation.",
    link: "https://en.cppreference.com/w/cpp/language/abstract_class",
  },
  {
    id: 1124,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What is the purpose of the 'override' keyword in C++11 and later?",
    options: [
      "It marks a function as virtual so it can participate in dynamic dispatch calls",
      "It allows a derived class function to have a different return type than the base",
      "It tells the compiler to verify the function actually overrides a base virtual one",
      "It makes the function accessible only to classes within the same inheritance tree",
    ],
    correctIndex: 2,
    explanation:
      "The 'override' specifier tells the compiler that a function is intended to override a virtual function from a base class. If no matching base class virtual function exists, the compiler generates an error, catching mistakes early.",
    link: "https://en.cppreference.com/w/cpp/language/override",
  },
  {
    id: 1125,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What happens when you call a virtual function through a base class pointer that points to a derived object?",
    code: `class Base { public: virtual void speak() { std::cout << "Base"; } };
class Dog : public Base { public: void speak() override { std::cout << "Woof"; } };

Base* p = new Dog();
p->speak();`,
    options: [
      "The program prints \"Woof\" because dynamic dispatch resolves to the Dog override",
      "The program prints \"Base\" because the pointer type is Base and not Dog pointer",
      "The program fails to compile because Dog::speak hides the base class function",
      "The behavior is undefined because the base pointer cannot hold a derived object",
    ],
    correctIndex: 0,
    explanation:
      "Because speak() is virtual, calling it through a Base* that points to a Dog object invokes Dog::speak() via dynamic dispatch. This is the fundamental mechanism of runtime polymorphism in C++.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1126,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "Why should a base class with virtual functions typically have a virtual destructor?",
    options: [
      "A virtual destructor makes the class abstract and prevents direct instantiation",
      "Without it, deleting a derived object through a base pointer causes undefined behavior",
      "A virtual destructor automatically prevents memory leaks in all derived class members",
      "Without it, the compiler refuses to allow any virtual function declarations at all",
    ],
    correctIndex: 1,
    explanation:
      "If a base class destructor is not virtual and you delete a derived object through a base pointer, only the base destructor runs. This is undefined behavior and typically causes resource leaks. A virtual destructor ensures the correct derived destructor is called.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-destructors-virtual-assignment-and-overriding-virtualization/",
  },
  {
    id: 1127,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What is the difference between function overriding and function overloading in C++?",
    options: [
      "Overriding changes the return type while overloading changes the function body",
      "Overriding uses templates while overloading uses inheritance to add variations",
      "Overloading requires the virtual keyword while overriding works without virtual",
      "Overriding redefines a base virtual function while overloading uses different parameters",
    ],
    correctIndex: 3,
    explanation:
      "Function overriding provides a new implementation for a base class virtual function in a derived class with the same signature. Function overloading defines multiple functions with the same name but different parameter lists within the same scope.",
    link: "https://www.learncpp.com/cpp-tutorial/function-overloading-differentiation/",
  },
  {
    id: 1128,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "Can an abstract class be instantiated directly in C++?",
    options: [
      "Yes, but only if all pure virtual functions have default parameter values defined",
      "No, you must derive a concrete class that implements all pure virtual functions first",
      "Yes, the compiler generates empty stub implementations for all pure virtual methods",
      "No, but you can use the 'new' operator with a special allocator to work around it",
    ],
    correctIndex: 1,
    explanation:
      "An abstract class contains at least one pure virtual function and cannot be instantiated directly. You must create a derived class that provides implementations for all pure virtual functions before you can create objects.",
    link: "https://en.cppreference.com/w/cpp/language/abstract_class",
  },
  {
    id: 1129,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "Can polymorphism in C++ work through references as well as pointers?",
    options: [
      "No, polymorphism only works through pointers and never through references at all",
      "No, references bind at compile time so dynamic dispatch cannot be performed on them",
      "Yes, but only if the reference is declared as const to prevent object slicing issues",
      "Yes, a base class reference to a derived object invokes derived overrides via dispatch",
    ],
    correctIndex: 3,
    explanation:
      "Polymorphism works through both pointers and references in C++. A base class reference bound to a derived object will invoke the derived class override of a virtual function through dynamic dispatch, just like a base class pointer would.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1130,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What is 'object slicing' in the context of C++ polymorphism?",
    options: [
      "It is a technique for splitting large objects across multiple memory pages efficiently",
      "It is what happens when a derived object is assigned by value to a base class variable",
      "It is the process of removing unused virtual functions during compiler optimizations",
      "It is a method for dividing an object's members between stack and heap storage areas",
    ],
    correctIndex: 1,
    explanation:
      "Object slicing occurs when a derived class object is copied into a base class variable by value. The derived-class-specific data is 'sliced off', leaving only the base portion. This is why polymorphism requires pointers or references rather than value semantics.",
    link: "https://www.learncpp.com/cpp-tutorial/object-slicing/",
  },
  {
    id: 1131,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What is the role of the vtable (virtual function table) in C++ polymorphism?",
    options: [
      "It stores the names of all member variables so the debugger can display them properly",
      "It holds compile-time type information used exclusively by the static_cast operator",
      "It maps each virtual function to the correct override so dynamic dispatch can find it",
      "It records the size of each derived class so the allocator can reserve enough memory",
    ],
    correctIndex: 2,
    explanation:
      "The vtable is an implementation detail used by most C++ compilers to support dynamic dispatch. Each class with virtual functions has a vtable containing pointers to the most-derived implementations. When a virtual function is called, the vtable is consulted to find the correct function to invoke.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1132,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What role does the vtable (virtual table) play in C++ runtime polymorphism?",
    code: `class Base {
public:
    virtual void speak() { std::cout << "Base"; }
};
class Derived : public Base {
public:
    void speak() override { std::cout << "Derived"; }
};

Base* p = new Derived();
p->speak();`,
    options: [
      "It stores inline copies of every virtual function body inside each object instance",
      "It holds function pointers so the correct override is resolved at runtime via indirection",
      "It records the class hierarchy tree so the compiler can verify casts at compile time",
      "It maps each virtual function name to a unique integer used by the linker at link time",
    ],
    correctIndex: 1,
    explanation:
      "Each class with virtual functions has a vtable -- a compiler-generated array of function pointers. Each object stores a hidden vptr that points to its class's vtable. When a virtual function is called through a base pointer, the vptr is followed to the vtable, and the appropriate function pointer is invoked, enabling dynamic dispatch.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1133,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What is the output of the following code that demonstrates the object slicing problem?",
    code: `class Base {
public:
    virtual std::string name() { return "Base"; }
};
class Derived : public Base {
public:
    std::string name() override { return "Derived"; }
};

Derived d;
Base b = d;          // copy by value
std::cout << b.name();`,
    options: [
      "It prints \"Derived\" because the object was originally constructed as a Derived instance",
      "It prints \"Base\" because assigning by value slices away the Derived part of the object",
      "It causes undefined behavior because a Derived object cannot be assigned to a Base variable",
      "It fails to compile because name() must be declared pure virtual to allow this assignment",
    ],
    correctIndex: 1,
    explanation:
      "When a Derived object is copied into a Base variable by value, object slicing occurs. Only the Base sub-object is copied, and the resulting object is a genuine Base -- its vptr points to Base's vtable, so Base::name() is called and prints \"Base\".",
    link: "https://en.cppreference.com/w/cpp/language/object#Object_slicing",
  },
  {
    id: 1134,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "Which statement correctly describes covariant return types for virtual functions in C++?",
    code: `class Base {
public:
    virtual Base* clone() const { return new Base(*this); }
};
class Derived : public Base {
public:
    Derived* clone() const override { return new Derived(*this); }
};`,
    options: [
      "An override may return a pointer or reference to a more-derived type than the base version returns",
      "An override must always return exactly the same type because any difference breaks the vtable layout",
      "Covariant returns only work when the function is declared pure virtual in the base class definition",
      "The override must use static_cast on the return value to convert it back to the base pointer type",
    ],
    correctIndex: 0,
    explanation:
      "C++ allows a virtual function override to return a pointer (or reference) to a type that is derived from the return type of the base class version. This is called a covariant return type. In the example, Derived::clone() returns Derived* instead of Base*, which is valid because Derived publicly inherits from Base.",
    link: "https://en.cppreference.com/w/cpp/language/virtual#Covariant_return_types",
  },
  {
    id: 1135,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "In a diamond inheritance hierarchy, what problem does virtual inheritance solve?",
    code: `class Animal {
public:
    int age = 0;
};
class Dog : virtual public Animal {};
class Cat : virtual public Animal {};
class Hybrid : public Dog, public Cat {};`,
    options: [
      "It prevents the compiler from generating a vtable for the intermediate base classes entirely",
      "It forces all member functions of the base class to be treated as pure virtual functions now",
      "It ensures only one shared sub-object of Animal exists instead of two separate duplicate copies",
      "It automatically makes the most-derived class a friend of each intermediate base class defined",
    ],
    correctIndex: 2,
    explanation:
      "Without virtual inheritance, Hybrid would contain two separate Animal sub-objects -- one through Dog and one through Cat. This causes ambiguity when accessing Animal members. Virtual inheritance ensures a single shared Animal sub-object exists in Hybrid, resolving the diamond problem.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class#Virtual_base_classes",
  },
  {
    id: 1136,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What is the Curiously Recurring Template Pattern (CRTP) and what does it achieve?",
    code: `template <typename Derived>
class Base {
public:
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};
class Concrete : public Base<Concrete> {
public:
    void implementation() { std::cout << "Concrete"; }
};`,
    options: [
      "CRTP uses a recursive template to generate an infinite hierarchy that the linker trims later",
      "CRTP passes the derived class as a template argument to achieve static polymorphism at compile time",
      "CRTP forces the base class to be abstract so only the derived class can be directly instantiated",
      "CRTP wraps each virtual call in a try-catch block to safely handle polymorphic dispatch failures",
    ],
    correctIndex: 1,
    explanation:
      "In CRTP, a derived class passes itself as a template parameter to its base class. The base can then static_cast its this pointer to the derived type and call derived member functions -- all resolved at compile time. This achieves static (compile-time) polymorphism without the overhead of virtual function dispatch.",
    link: "https://en.cppreference.com/w/cpp/language/crtp",
  },
  {
    id: 1137,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What is the difference between the override specifier and the final specifier on virtual functions?",
    code: `class Base {
public:
    virtual void foo() {}
    virtual void bar() {}
};
class Mid : public Base {
public:
    void foo() override final {}
    void bar() override {}
};
class Last : public Mid {
public:
    // void foo() override {} // ERROR
    void bar() override {}
};`,
    options: [
      "override marks a function as replacing a base virtual and final prevents further overriding of it",
      "override disables dynamic dispatch for the function and final re-enables it in deeper subclasses",
      "override is only valid on pure virtual functions while final applies exclusively to non-pure virtuals",
      "override converts a non-virtual function into a virtual one and final removes it from the vtable",
    ],
    correctIndex: 0,
    explanation:
      "The override specifier tells the compiler this function is intended to override a virtual function in a base class -- if no matching base virtual exists, it triggers a compile error. The final specifier prevents any further derived class from overriding that function. They can be combined, as shown with foo() in Mid.",
    link: "https://en.cppreference.com/w/cpp/language/override",
  },
  {
    id: 1138,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What does dynamic_cast return when used with pointers to polymorphic types and the cast fails?",
    code: `class Base {
public:
    virtual ~Base() {}
};
class Derived : public Base {};
class Other : public Base {};

Base* p = new Other();
Derived* d = dynamic_cast<Derived*>(p);
std::cout << (d == nullptr ? "null" : "valid");`,
    options: [
      "It returns a valid pointer because both Derived and Other share the same Base class parent type",
      "It throws std::bad_cast immediately because the pointed-to object is not of type Derived at all",
      "It triggers undefined behavior because dynamic_cast cannot be applied to a base class pointer value",
      "It returns nullptr for pointer casts that fail, so d is null and the program prints the word null",
    ],
    correctIndex: 3,
    explanation:
      "When dynamic_cast is used with pointers and the cast is invalid (the actual object is not of the target type or a type derived from it), it returns nullptr rather than throwing. For reference casts, a failed dynamic_cast throws std::bad_cast. Here p points to an Other object, not Derived, so nullptr is returned.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1139,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What happens when a virtual function is called from inside a constructor or destructor?",
    code: `class Base {
public:
    Base() { greet(); }
    virtual void greet() { std::cout << "Base "; }
};
class Derived : public Base {
public:
    void greet() override { std::cout << "Derived "; }
};

Derived d;`,
    options: [
      "The program prints \"Derived\" because the final override is used even inside the Base constructor",
      "The call is skipped entirely and nothing is printed because virtual calls in constructors are no-ops",
      "The program prints \"Base\" because during Base construction the dynamic type is still Base not Derived",
      "The program causes undefined behavior because calling virtual functions in constructors is prohibited",
    ],
    correctIndex: 2,
    explanation:
      "During the execution of a Base constructor, the object's dynamic type is Base -- the Derived part has not yet been constructed. Therefore, virtual dispatch resolves to Base::greet(), and \"Base\" is printed. The same principle applies in destructors: the dynamic type reverts as each sub-object is destroyed.",
    link: "https://en.cppreference.com/w/cpp/language/virtual#During_construction_and_destruction",
  },
  {
    id: 1140,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "In a diamond-shaped multiple inheritance without virtual bases, what happens when calling an ambiguous member?",
    code: `class A {
public:
    void hello() { std::cout << "A"; }
};
class B : public A {};
class C : public A {};
class D : public B, public C {};

D d;
d.hello();`,
    options: [
      "It calls the A::hello() that was inherited through the first listed base class B automatically",
      "It prints \"A\" twice because both the B path and the C path copies are invoked in sequence here",
      "It causes undefined behavior at runtime because the linker cannot resolve the duplicated symbol",
      "It fails to compile because the call is ambiguous",
    ],
    correctIndex: 3,
    explanation:
      "Without virtual inheritance, D inherits two separate A sub-objects -- one via B and one via C. Calling d.hello() is ambiguous because the compiler cannot determine which A::hello() is intended. This is a compile-time error. The fix is to qualify the call (d.B::hello()) or use virtual inheritance.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class",
  },
  {
    id: 1141,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "How does protected inheritance differ from private inheritance regarding access to base members?",
    code: `class Base {
public:
    void pub() {}
protected:
    void prot() {}
};
class ProDerived : protected Base {};
class PriDerived : private Base {};
class Grand : public ProDerived {};`,
    options: [
      "Protected inheritance makes public base members protected in the derived class and still accessible to grandchildren",
      "Protected and private inheritance are identical in effect",
      "Private inheritance makes base members public in the derived class while protected inheritance hides them all",
      "Protected inheritance converts all base members to private so that only the immediate derived class can use them",
    ],
    correctIndex: 0,
    explanation:
      "With protected inheritance, public members of the base become protected in the derived class -- inaccessible to outside code but still available to further derived classes (like Grand). With private inheritance, public and protected base members become private in the derived class, so grandchild classes cannot access them at all.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class#Protected_inheritance",
  },
  {
    id: 1142,
    difficulty: "Hard",
    topic: "Polymorphism",
    question: "What does this type erasure implementation print when invoked?",
    code: `#include <iostream>
#include <memory>

struct Concept {
    virtual void speak() const = 0;
    virtual ~Concept() = default;
};

template<typename T>
struct Model : Concept {
    T obj;
    Model(T o) : obj(std::move(o)) {}
    void speak() const override { obj.speak(); }
};

struct Any {
    std::unique_ptr<Concept> ptr;
    template<typename T>
    Any(T obj) : ptr(std::make_unique<Model<T>>(std::move(obj))) {}
    void speak() const { ptr->speak(); }
};

struct Cat { void speak() const { std::cout << "Meow"; } };
struct Dog { void speak() const { std::cout << "Woof"; } };

int main() {
    Any a = Cat{};
    a = Dog{};
    a.speak();
}`,
    options: [
      "It prints Meow because the first assignment fixes the stored type permanently",
      "It prints Woof because each assignment constructs a new Model with the new type",
      "It fails to compile because Cat and Dog are unrelated types with no common base",
      "It produces undefined behavior since unique_ptr is reassigned without proper reset",
    ],
    correctIndex: 1,
    explanation:
      "Type erasure wraps unrelated types behind a common Concept interface. Each assignment to 'a' constructs a fresh Model<T> with the new type, so the second assignment stores a Dog and speak() prints Woof. The types need no common base -- that is the entire point of type erasure.",
    link: "https://en.cppreference.com/w/cpp/language/templates",
  },
  {
    id: 1143,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Which compiler optimization can eliminate the overhead of virtual dispatch in this code?",
    code: `#include <iostream>
#include <memory>

struct Base {
    virtual int value() const { return 1; }
    virtual ~Base() = default;
};

struct Derived final : Base {
    int value() const override { return 42; }
};

int main() {
    auto p = std::make_unique<Derived>();
    std::cout << p->value();
}`,
    options: [
      "The compiler applies loop unrolling to flatten the virtual function table lookups",
      "Return value optimization converts the virtual call into an inline static variable",
      "The compiler applies constant propagation to remove the vtable pointer from memory",
      "Devirtualization resolves the call statically since the concrete type is fully known",
    ],
    correctIndex: 3,
    explanation:
      "When the compiler can prove the exact dynamic type at compile time (as with make_unique<Derived>() and the final specifier), it performs devirtualization -- replacing the indirect vtable call with a direct static call. The final keyword guarantees no further derivation, making devirtualization safe.",
    link: "https://en.cppreference.com/w/cpp/language/final",
  },
  {
    id: 1144,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "In a typical implementation with multiple inheritance, how does calling a method through the second base class pointer work?",
    code: `struct A {
    virtual void fa() {}
    virtual ~A() = default;
};

struct B {
    virtual void fb() {}
    virtual ~B() = default;
};

struct C : A, B {
    void fa() override {}
    void fb() override {}
};

int main() {
    C obj;
    B* bp = &obj;  // pointer adjustment occurs here
    bp->fb();
}`,
    options: [
      "The compiler embeds a thunk that adjusts the this pointer back to C before calling fb",
      "The B vtable stores the absolute address of C::fb so no pointer adjustment is needed",
      "The runtime uses RTTI metadata to locate the C subobject offset and dispatch directly",
      "The linker merges the A and B vtables into one combined table to avoid any adjustment",
    ],
    correctIndex: 0,
    explanation:
      "With multiple inheritance, a pointer to the second base (B) is offset from the start of C. The compiler generates a thunk -- a small piece of code that adjusts the this pointer from the B subobject back to the full C object before forwarding to C::fb(). This is required because C::fb expects a C* this pointer.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class",
  },
  {
    id: 1145,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What is the effect of the virtual keyword on the Base class in this diamond inheritance hierarchy?",
    code: `struct Base { int x = 10; };

struct Left : virtual Base {};
struct Right : virtual Base {};

struct Diamond : Left, Right {};

int main() {
    Diamond d;
    d.x = 42;
    Left* lp = &d;
    Right* rp = &d;
    // Both lp->x and rp->x refer to the same int
}`,
    options: [
      "The compiler duplicates Base but keeps them synchronized through a hidden reference count",
      "Virtual inheritance eliminates Base entirely and inlines its members into the Diamond class",
      "Both Left and Right store a vbase pointer that is resolved at runtime to one shared Base",
      "Each path stores its own copy of Base but the compiler merges reads through alias analysis",
    ],
    correctIndex: 2,
    explanation:
      "Virtual inheritance ensures a single shared Base subobject in the Diamond. Both Left and Right contain a hidden vbase pointer (or offset) that the compiler uses to locate the single shared Base subobject at runtime. This prevents ambiguity and duplication of Base's members.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class",
  },
  {
    id: 1146,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What does this RTTI code using typeid and type_info produce at runtime?",
    code: `#include <iostream>
#include <typeinfo>

struct Base {
    virtual ~Base() = default;
};
struct Derived : Base {};

int main() {
    Base* p = new Derived();
    const std::type_info& t1 = typeid(*p);
    const std::type_info& t2 = typeid(p);
    std::cout << (t1 == t2) << " ";
    std::cout << (t1 == typeid(Derived));
    delete p;
}`,
    options: [
      "It prints 1 1 because typeid always inspects the static declared type of the expression",
      "It prints 0 0 because pointer types and pointed-to types are always treated differently",
      "It prints 0 1 because typeid(*p) gives the dynamic type but typeid(p) gives Base pointer",
      "It prints 1 0 because typeid resolves both expressions to Base due to the pointer context",
    ],
    correctIndex: 2,
    explanation:
      "typeid(*p) dereferences the pointer and, since Base is polymorphic (has a virtual destructor), returns the dynamic type -- Derived. typeid(p) gives the static type of the pointer itself -- Base*. So t1 != t2 (prints 0) and t1 == typeid(Derived) (prints 1), yielding 0 1.",
    link: "https://en.cppreference.com/w/cpp/language/typeid",
  },
  {
    id: 1147,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What does this code using std::function for runtime polymorphism print?",
    code: `#include <iostream>
#include <functional>
#include <string>

struct Logger {
    std::string tag;
    void log(int n) const {
        std::cout << tag << ":" << n;
    }
};

int main() {
    Logger lg{"APP"};
    std::function<void(int)> fn = [lg](int n) {
        lg.log(n);
    };
    lg.tag = "SYS";
    fn(42);
}`,
    options: [
      "It prints SYS:42 because std::function stores a reference to the original Logger object",
      "It prints APP:42 because the lambda captures lg by value so later changes do not apply",
      "It prints nothing because std::function erases the lambda type and loses the capture state",
      "It produces undefined behavior because the Logger is modified after lambda construction",
    ],
    correctIndex: 1,
    explanation:
      "The lambda captures lg by value at the point of creation, making a copy where tag is APP. Changing lg.tag to SYS afterward does not affect the copy inside the lambda. std::function uses type erasure to store the callable but preserves all captured state, so fn(42) prints APP:42.",
    link: "https://en.cppreference.com/w/cpp/utility/functional/function",
  },
  {
    id: 1148,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What advantage does the CRTP pattern provide over virtual functions in this code?",
    code: `#include <iostream>

template<typename Derived>
struct Counter {
    void process() {
        static_cast<Derived*>(this)->impl();
    }
};

struct Fast : Counter<Fast> {
    void impl() { std::cout << "fast path"; }
};

struct Safe : Counter<Safe> {
    void impl() { std::cout << "safe path"; }
};

template<typename T>
void run(Counter<T>& c) { c.process(); }

int main() {
    Fast f;
    run(f);
}`,
    options: [
      "CRTP stores the derived type in a hidden field enabling faster runtime type identification",
      "CRTP uses template specialization to create virtual tables that are smaller in binary size",
      "CRTP defers dispatch to link time so the linker can pick the optimal function definition",
      "CRTP resolves dispatch at compile time so the call is inlined with no vtable indirection",
    ],
    correctIndex: 3,
    explanation:
      "CRTP (Curiously Recurring Template Pattern) achieves static polymorphism: the base template knows the exact derived type at compile time through the template parameter. The static_cast resolves the call at compile time, allowing full inlining with zero runtime dispatch overhead -- unlike virtual functions which require an indirect call through the vtable.",
    link: "https://en.cppreference.com/w/cpp/language/crtp",
  },
  {
    id: 1149,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "How does C++20 concept-based polymorphism differ from classical virtual dispatch in this example?",
    code: `#include <iostream>
#include <concepts>

template<typename T>
concept Drawable = requires(T t) {
    { t.draw() } -> std::same_as<void>;
};

struct Circle {
    void draw() { std::cout << "Circle"; }
};

struct Square {
    void draw() { std::cout << "Square"; }
};

void render(Drawable auto& shape) {
    shape.draw();
}

int main() {
    Circle c;
    render(c);
}`,
    options: [
      "Concepts create a hidden virtual table for each type that satisfies the constraint at runtime",
      "Concepts generate a type-erased wrapper so that different shapes can share one container",
      "Concepts enforce the interface at compile time with static dispatch and no vtable overhead",
      "Concepts defer constraint checking to link time allowing cross-translation-unit polymorphism",
    ],
    correctIndex: 2,
    explanation:
      "C++20 concepts constrain templates at compile time. The render function is a template that generates a separate instantiation for each concrete type, so the call to draw() is resolved statically with no vtable. Unlike virtual dispatch, concept-based polymorphism provides zero-overhead abstraction but requires the concrete type to be known at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/constraints",
  },
  {
    id: 1150,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What is a key trade-off of using std::variant-based polymorphism compared to virtual dispatch?",
    code: `#include <iostream>
#include <variant>

struct Circle { double r; };
struct Square { double s; };

using Shape = std::variant<Circle, Square>;

double area(const Shape& sh) {
    return std::visit([](const auto& s) -> double {
        if constexpr (std::is_same_v<std::decay_t<decltype(s)>, Circle>)
            return 3.14159 * s.r * s.r;
        else
            return s.s * s.s;
    }, sh);
}

int main() {
    Shape s = Circle{5.0};
    std::cout << area(s);
}`,
    options: [
      "Variant stores all alternatives inline improving cache locality but requires a closed type set",
      "Variant dispatch is always slower than virtual calls because std::visit uses hash table lookup",
      "Variant polymorphism allows adding new types at runtime without recompiling existing code base",
      "Variant requires all alternative types to share a common base class to enable proper dispatch",
    ],
    correctIndex: 0,
    explanation:
      "std::variant stores the active alternative inline (no heap allocation), which improves data locality and can outperform virtual dispatch. However, the set of types must be known at compile time (closed type set). Virtual dispatch allows open extension -- new derived classes can be added without modifying existing code. This is the classic expression problem trade-off.",
    link: "https://en.cppreference.com/w/cpp/utility/variant",
  },
  {
    id: 1151,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What happens when a derived class overrides a virtual function but changes the noexcept specification?",
    code: `#include <iostream>

struct Base {
    virtual void process() noexcept {
        std::cout << "Base";
    }
    virtual ~Base() = default;
};

struct Derived : Base {
    void process() override {  // no noexcept
        std::cout << "Derived";
    }
};

int main() {
    Derived d;
    Base* p = &d;
    p->process();
}`,
    options: [
      "It compiles and prints Derived because removing noexcept is a valid loosening of contract",
      "It fails to compile because an override cannot have a looser exception specification than base",
      "It compiles but if Derived::process throws then std::terminate is called due to the base spec",
      "It prints Base because the noexcept mismatch causes the compiler to skip the override entry",
    ],
    correctIndex: 1,
    explanation:
      "In C++17 and later, noexcept is part of the function type. An overriding virtual function cannot have a looser exception specification than the base. Since Base::process() is noexcept(true), the override must also be noexcept(true). Omitting noexcept makes it noexcept(false), which is looser, causing a compilation error.",
    link: "https://en.cppreference.com/w/cpp/language/noexcept_spec",
  },
  {
    id: 1152,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What does the 'final' keyword do when applied to a virtual function in a derived class?",
    code: `class Base {
public:
    virtual void draw() const {}
};
class Circle : public Base {
public:
    void draw() const override final {}
};`,
    options: [
      "It forces all further derived classes to provide their own implementation",
      "It removes the function entry from the vtable of the current class",
      "It converts the function from virtual to non-virtual at compile time",
      "It prevents any further derived class from overriding that function",
    ],
    correctIndex: 3,
    explanation:
      "The 'final' specifier on a virtual function prevents any class that inherits from Circle from overriding draw(). If a further derived class attempts to override it, the compiler produces an error. This is useful when you want to lock down a specific implementation in the hierarchy.",
    link: "https://en.cppreference.com/w/cpp/language/final",
  },
  {
    id: 1153,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What does the 'final' keyword do when applied to a class definition?",
    code: `class Widget final {
public:
    virtual void update() {}
};`,
    options: [
      "It makes all member functions of the class implicitly virtual by default",
      "It marks every virtual function in the class as pure virtual automatically",
      "It prevents any other class from inheriting from that class entirely",
      "It restricts the class so it can only be used as a local stack variable",
    ],
    correctIndex: 2,
    explanation:
      "Applying 'final' to a class declaration prevents it from being used as a base class. Any attempt to derive from a final class results in a compilation error. This can also help the compiler devirtualize calls since no further overrides are possible.",
    link: "https://en.cppreference.com/w/cpp/language/final",
  },
  {
    id: 1154,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What happens if a derived class does not override a pure virtual function from its base class?",
    options: [
      "The derived class also becomes abstract and cannot be instantiated directly",
      "The compiler generates a runtime exception when objects of that class are created",
      "The derived class compiles normally and uses a default empty implementation",
      "The linker removes the pure virtual function from the final binary output",
    ],
    correctIndex: 0,
    explanation:
      "If a derived class does not provide an implementation for every pure virtual function it inherits, that derived class is also considered abstract. You cannot create objects of an abstract class directly. Only a class that implements all inherited pure virtual functions can be instantiated.",
    link: "https://www.learncpp.com/cpp-tutorial/pure-virtual-functions-abstract-base-classes-and-interface-classes/",
  },
  {
    id: 1155,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What does this program print?",
    code: `class Animal {
public:
    void speak() { std::cout << "Animal"; }
};
class Cat : public Animal {
public:
    void speak() { std::cout << "Meow"; }
};

Animal* p = new Cat();
p->speak();`,
    options: [
      "Meow, because Cat::speak() hides Animal::speak() for all call sites",
      "Animal, because speak() is not virtual so static binding is applied",
      "The program fails to compile because speak() is redefined without override",
      "The behavior is undefined because the pointer type does not match the object",
    ],
    correctIndex: 1,
    explanation:
      "Because speak() is not declared virtual in Animal, the call through an Animal pointer uses static binding. The compiler resolves the call based on the pointer type (Animal*), not the actual object type (Cat). To get dynamic dispatch, the base class function must be virtual.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1156,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "When calling a virtual function through a base class pointer, how does the program determine which function to invoke at runtime?",
    options: [
      "It compares the pointer address against a global registry of all known class type names",
      "It reads the object's string-based type tag stored as a hidden member variable in memory",
      "It follows the object's hidden vptr to a vtable that holds the correct function pointer",
      "It scans the inheritance chain from base to derived until it finds a matching function name",
    ],
    correctIndex: 2,
    explanation:
      "Most C++ compilers implement dynamic dispatch using a hidden pointer (vptr) in each polymorphic object. This vptr points to a vtable containing function pointers for the virtual functions of that class. At runtime, the program follows the vptr, looks up the function in the vtable, and calls the correct override.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1157,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What does this program print?",
    code: `class Shape {
public:
    virtual void name() { std::cout << "Shape"; }
};
class Square : public Shape {
public:
    void name() override { std::cout << "Square"; }
};

void identify(Shape& s) { s.name(); }

Square sq;
identify(sq);`,
    options: [
      "Shape, because the function parameter is a base class value, not a pointer",
      "Square, because dynamic dispatch works through references just like pointers",
      "The program fails to compile because references cannot bind to derived objects",
      "The output is implementation-defined and varies between different compilers",
    ],
    correctIndex: 1,
    explanation:
      "Dynamic dispatch in C++ works through both pointers and references. Since identify() takes a Shape& reference and name() is virtual, calling s.name() on a Square object resolves to Square::name() at runtime. The reference preserves the dynamic type of the object.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1158,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What does the 'override' keyword help prevent when writing derived class functions?",
    code: `class Base {
public:
    virtual void process(int x) const;
};
class Derived : public Base {
public:
    void process(int x) override;  // missing const
};`,
    options: [
      "It prevents accidental signature mismatches that would create a new function",
      "It prevents the derived class from accessing any private members of the base class",
      "It prevents the derived function from being inlined by the compiler optimizer stage",
      "It prevents the base class version from being called inside the derived function body",
    ],
    correctIndex: 0,
    explanation:
      "In this example, Derived::process is missing the const qualifier, so its signature does not match Base::process. Without 'override', this would silently create a new function instead of overriding the base version. With 'override', the compiler detects the mismatch and reports an error.",
    link: "https://en.cppreference.com/w/cpp/language/override",
  },
  {
    id: 1159,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "What problem occurs when deleting a derived object through a base pointer if the base destructor is not virtual?",
    code: `class Base {
public:
    ~Base() { /* cleanup base */ }
};
class Derived : public Base {
    std::vector<int> data;
public:
    ~Derived() { /* cleanup derived */ }
};

Base* p = new Derived();
delete p;`,
    options: [
      "The program throws a std::bad_alloc exception during the delete operation",
      "The derived destructor runs first and then the base destructor runs as expected",
      "The compiler prevents this code from compiling due to a missing virtual keyword",
      "The behavior is undefined because only the base destructor is called directly",
    ],
    correctIndex: 3,
    explanation:
      "When the base destructor is not virtual, deleting through a Base* calls only Base::~Base(). The Derived destructor never runs, which is undefined behavior per the C++ standard. The Derived members (like the vector) may never be properly cleaned up. Declaring the base destructor virtual fixes this.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-destructors-virtual-assignment-and-overriding-virtualization/",
  },
  {
    id: 1160,
    difficulty: "Easy",
    topic: "Polymorphism",
    question:
      "Which of the following correctly describes the relationship between static binding and dynamic binding?",
    options: [
      "Static binding resolves the call at compile time based on the declared type",
      "Static binding resolves the call at runtime by checking the actual object type",
      "Dynamic binding resolves the call at compile time using template argument deduction",
      "Dynamic binding resolves the call at link time by matching function name and its arity",
    ],
    correctIndex: 0,
    explanation:
      "Static binding (early binding) resolves function calls at compile time based on the declared (static) type of the variable or pointer. Dynamic binding (late binding) resolves calls at runtime based on the actual (dynamic) type of the object, using the virtual dispatch mechanism.",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1161,
    difficulty: "Easy",
    topic: "Polymorphism",
    question: "What does this program print?",
    code: `class Vehicle {
public:
    virtual void type() { std::cout << "Vehicle"; }
};
class Car : public Vehicle {
public:
    void type() override { std::cout << "Car"; }
};
class Sedan : public Car {
public:
    void type() override { std::cout << "Sedan"; }
};

Vehicle* v = new Sedan();
v->type();`,
    options: [
      "Vehicle, because the pointer type determines which function is called at runtime",
      "Car, because dynamic dispatch stops at the first derived class in the hierarchy",
      "The program fails to compile because multi-level overriding is not allowed in C++",
      "Sedan, because dynamic dispatch resolves to the most-derived override at runtime",
    ],
    correctIndex: 3,
    explanation:
      "Dynamic dispatch always resolves to the most-derived override of a virtual function. Since the actual object is a Sedan and Sedan provides its own override of type(), calling v->type() through a Vehicle pointer invokes Sedan::type(), printing \"Sedan\".",
    link: "https://www.learncpp.com/cpp-tutorial/virtual-functions/",
  },
  {
    id: 1162,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What does this code print when a Derived object is passed by value to process()?",
    code: `class Base {
public:
    virtual std::string who() { return "Base"; }
};
class Derived : public Base {
    int extra = 99;
public:
    std::string who() override { return "Derived"; }
};

void process(Base obj) {
    std::cout << obj.who();
}

Derived d;
process(d);`,
    options: [
      "It prints \"Derived\" because the original object is a Derived instance",
      "It prints \"Derived\" followed by the value 99 stored in the extra member variable",
      "It fails to compile because a Derived cannot be passed where a Base is expected",
      "It prints \"Base\" because passing by value slices the object to its Base portion",
    ],
    correctIndex: 3,
    explanation:
      "When a Derived object is passed by value to a function expecting a Base parameter, the copy constructor of Base is invoked, copying only the Base sub-object. The Derived-specific members and vtable pointer are lost. The resulting object inside process() is a genuine Base, so Base::who() is called. This is called object slicing and is a common pitfall when polymorphic objects are passed by value instead of by pointer or reference.",
    link: "https://en.cppreference.com/w/cpp/language/object#Object_slicing",
  },
  {
    id: 1163,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What does the Derived::clone() function return in this covariant return type example?",
    code: `class Base {
public:
    virtual Base* clone() const { return new Base(*this); }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    Derived* clone() const override { return new Derived(*this); }
};

Derived d;
Derived* copy = d.clone();`,
    options: [
      "A Derived* directly, since calling d.clone() uses the covariant return type",
      "A Base* only, because clone() overrides must match the base return type exactly",
      "A void* that the caller must cast via static_cast to the correct derived type",
      "A Derived* only if the base clone() is declared as a pure virtual function",
    ],
    correctIndex: 0,
    explanation:
      "C++ allows a virtual function override to return a pointer or reference to a more-derived type than the base version. This is called a covariant return type. Here, Base::clone() returns Base* while Derived::clone() returns Derived*. When called directly on a Derived object, the compiler knows the static type and returns Derived* without requiring a cast. When called through a Base pointer, the return type is Base*, but the actual object created is still a Derived.",
    link: "https://en.cppreference.com/w/cpp/language/virtual#Covariant_return_types",
  },
  {
    id: 1164,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What per-object memory overhead does a typical compiler add when a class has virtual functions?",
    code: `class NoVirtual {
    int x;
    int y;
};

class WithVirtual {
    int x;
    int y;
public:
    virtual void foo() {}
    virtual ~WithVirtual() = default;
};

std::cout << sizeof(NoVirtual) << " "
          << sizeof(WithVirtual);`,
    options: [
      "Both classes are the same size because virtual functions are stored in a separate table",
      "WithVirtual adds one function pointer per virtual function declared in the class",
      "WithVirtual is larger by one hidden vptr that points to the class vtable",
      "WithVirtual doubles in size because each virtual function needs its own dispatch slot",
    ],
    correctIndex: 2,
    explanation:
      "When a class has at least one virtual function, most compilers add a single hidden pointer (the vptr) to each object instance. This vptr points to the class's vtable, which is a shared per-class array of function pointers. Regardless of how many virtual functions the class declares, only one vptr is added per object. On a 64-bit system, NoVirtual would typically be 8 bytes while WithVirtual would be 16 bytes (8 for the two ints plus 8 for the vptr, with possible padding).",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1165,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "What does constructing a Derived object print in this code?",
    code: `class Base {
public:
    Base() { identify(); }
    virtual void identify() { std::cout << "B"; }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    Derived() { identify(); }
    void identify() override { std::cout << "D"; }
};

Derived d;`,
    options: [
      "It prints \"DD\" because both constructors dispatch to Derived::identify()",
      "It prints \"BB\" because constructors always resolve to Base::identify()",
      "It prints \"BD\" because Base's constructor calls Base::identify() first",
      "It prints \"DB\" because the Derived constructor runs before Base::Base()",
    ],
    correctIndex: 2,
    explanation:
      "During the execution of Base's constructor, the object's dynamic type is Base because the Derived sub-object has not yet been constructed. Virtual dispatch in a constructor resolves to the version defined in the class currently being constructed. So Base() calls Base::identify() printing \"B\". Then Derived's constructor runs, and at that point the dynamic type is Derived, so identify() resolves to Derived::identify() printing \"D\". The combined output is \"BD\".",
    link: "https://en.cppreference.com/w/cpp/language/virtual#During_construction_and_destruction",
  },
  {
    id: 1166,
    difficulty: "Medium",
    topic: "Polymorphism",
    question: "How can the ambiguous call to greet() on object d be resolved?",
    code: `class A {
public:
    void greet() { std::cout << "A"; }
};
class B {
public:
    void greet() { std::cout << "B"; }
};
class D : public A, public B {};

D d;
d.greet();  // error: ambiguous`,
    options: [
      "Change D to inherit virtually from both A and B to merge the two greet() functions",
      "Add 'using A::greet;' inside class D to select which base version to expose",
      "Cast d to void* first and then call greet() through the resulting untyped pointer",
      "Declare greet() as static in both A and B so the linker can pick one automatically",
    ],
    correctIndex: 1,
    explanation:
      "When D inherits from both A and B, and both provide a function named greet(), calling d.greet() is ambiguous. One fix is to qualify the call explicitly (d.A::greet()). Another is to place a using declaration inside D, such as 'using A::greet;', which brings A's version into D's scope and resolves the ambiguity. Virtual inheritance would not help here since A and B are unrelated classes, not a shared base.",
    link: "https://en.cppreference.com/w/cpp/language/using_declaration",
  },
  {
    id: 1167,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "How does protected inheritance affect access to Base's public members from outside code?",
    code: `class Base {
public:
    void hello() { std::cout << "Hi"; }
};

class Mid : protected Base {};
class Child : public Mid {};

Mid m;
m.hello();  // line X`,
    options: [
      "Line X compiles because protected inheritance keeps public members accessible to everyone",
      "Line X fails because protected inheritance makes Base's public members protected in Mid",
      "Line X compiles but hello() prints nothing due to the access level being downgraded",
      "Line X fails because protected inheritance makes Base's public members private in Mid",
    ],
    correctIndex: 1,
    explanation:
      "Protected inheritance converts all public members of the base class into protected members of the derived class. This means hello() is accessible inside Mid and its subclasses (like Child) but not from outside code. So m.hello() at line X is a compile error. This differs from private inheritance, which would make hello() private in Mid, blocking access even from grandchild classes.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class#Protected_inheritance",
  },
  {
    id: 1168,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What is the key difference between dynamic_cast and static_cast when downcasting a polymorphic pointer?",
    code: `class Base {
public:
    virtual ~Base() = default;
};
class Derived : public Base {
public:
    int value = 42;
};

Base* bp = new Base();
Derived* dp1 = static_cast<Derived*>(bp);
Derived* dp2 = dynamic_cast<Derived*>(bp);`,
    options: [
      "static_cast succeeds silently but causes undefined behavior; dynamic_cast returns nullptr",
      "Both casts return nullptr when the actual object type does not match the target downcast type",
      "dynamic_cast is faster than static_cast because it skips the runtime RTTI type verification",
      "static_cast performs a runtime type check and throws on failure; dynamic_cast returns nullptr",
    ],
    correctIndex: 0,
    explanation:
      "static_cast performs no runtime type check. It trusts the programmer and compiles the downcast unconditionally. If the actual object is not a Derived (as here, where bp points to a plain Base), accessing dp1->value is undefined behavior. dynamic_cast uses RTTI to verify the cast at runtime and returns nullptr for pointer casts that fail. This makes dynamic_cast safer but slightly slower due to the runtime type check.",
    link: "https://en.cppreference.com/w/cpp/language/dynamic_cast",
  },
  {
    id: 1169,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "Can a pure virtual function have a default implementation that derived classes can call?",
    code: `class Base {
public:
    virtual void action() = 0;
    virtual ~Base() = default;
};

void Base::action() {
    std::cout << "default ";
}

class Derived : public Base {
public:
    void action() override {
        Base::action();
        std::cout << "extended";
    }
};

Derived d;
d.action();`,
    options: [
      "It fails to compile because a pure virtual function cannot have any implementation at all",
      "It prints \"extended\" because the pure virtual base body is ignored during dispatch",
      "It prints \"default extended\" because derived classes can explicitly call the base body",
      "It causes undefined behavior because calling a pure virtual function is always illegal",
    ],
    correctIndex: 2,
    explanation:
      "C++ allows a pure virtual function to have a definition provided outside the class body. The class remains abstract and cannot be instantiated, but derived classes can explicitly call the base implementation using the qualified name Base::action(). In this example, Derived::action() first calls Base::action() which prints \"default \", then prints \"extended\". This pattern is useful for providing a common default that derived classes can optionally invoke.",
    link: "https://en.cppreference.com/w/cpp/language/abstract_class",
  },
  {
    id: 1170,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "What design principle does the Non-Virtual Interface (NVI) pattern apply to virtual functions?",
    code: `class Widget {
public:
    void draw() {          // non-virtual public interface
        setup();
        doDraw();
        cleanup();
    }
    virtual ~Widget() = default;
private:
    virtual void doDraw() = 0;  // virtual implementation detail
    void setup()   { /* ... */ }
    void cleanup() { /* ... */ }
};`,
    options: [
      "The public interface is non-virtual and delegates to a private virtual for customization",
      "The public interface is virtual and the private helper functions handle all dispatch logic",
      "The virtual function is made public so derived classes can call it directly without wrappers",
      "All member functions are declared virtual to let derived classes override the full workflow",
    ],
    correctIndex: 0,
    explanation:
      "The Non-Virtual Interface pattern separates the public interface from the customization point. The public function draw() is non-virtual and controls the overall workflow (setup, draw, cleanup). The actual drawing is delegated to a private pure virtual function doDraw() that derived classes override. This lets the base class enforce pre-conditions and post-conditions while still allowing polymorphic customization. Derived classes override the private virtual but cannot skip the wrapper.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1171,
    difficulty: "Medium",
    topic: "Polymorphism",
    question:
      "Which version of the default argument is used when show() is called through a Base pointer to a Derived object?",
    code: `class Base {
public:
    virtual void show(int x = 10) {
        std::cout << "Base:" << x;
    }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void show(int x = 20) override {
        std::cout << "Derived:" << x;
    }
};

Base* p = new Derived();
p->show();`,
    options: [
      "It prints \"Derived:20\" because the derived default argument matches the derived override",
      "It prints \"Base:10\" because both the function body and default come from the base class",
      "It fails to compile because base and derived default arguments must have the same value",
      "It prints \"Derived:10\" because the body is from Derived but the default is from Base",
    ],
    correctIndex: 3,
    explanation:
      "Default arguments are resolved statically based on the declared type of the pointer or reference, not the dynamic type of the object. Since p is declared as Base*, the default argument value 10 from Base::show() is used. However, because show() is virtual, the function body called at runtime is Derived::show(). The result is that x receives the value 10 from Base's default, but the Derived body executes, printing \"Derived:10\". This mismatch is a well-known pitfall.",
    link: "https://en.cppreference.com/w/cpp/language/default_arguments",
  },
  {
    id: 1172,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "In a multiple inheritance layout, what is a 'thunk' used for during virtual dispatch through a secondary base pointer?",
    code: `struct A { virtual void f(); };
struct B { virtual void g(); };
struct C : A, B {
    void f() override;
    void g() override;
};

B* bp = new C;
bp->g();  // How does dispatch reach C::g?`,
    options: [
      "It adjusts the this pointer to the most-derived object before jumping to the override",
      "It allocates a temporary wrapper object that bridges the secondary base for each virtual call",
      "It copies the vtable from the primary base into the secondary base at runtime",
      "It converts the function signature to match the secondary base calling convention",
    ],
    correctIndex: 0,
    explanation:
      "When a virtual function is called through a secondary base pointer (B* in this case), the this pointer points to the B subobject, not the beginning of C. A thunk is a small compiler-generated code stub that adjusts (subtracts an offset from) the this pointer so it points to the complete C object before jumping to C::g(). Without this adjustment, the override would receive the wrong this pointer and access incorrect memory.",
    link: "https://en.cppreference.com/w/cpp/language/derived_class",
  },
  {
    id: 1173,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What does sizeof(D) most likely print on a typical 64-bit implementation, and why?",
    code: `struct A { virtual void f() {} };
struct B { virtual void g() {} };
struct D : A, B { void f() override {} void g() override {} };

std::cout << sizeof(D);`,
    options: [
      "8, because the compiler merges both vtables into one shared vptr",
      "24, because each virtual function adds 8 bytes to the object layout",
      "32, because each base contributes a vptr and a padding block of 8 bytes",
      "16, because D contains two vptrs from inheriting two polymorphic bases",
    ],
    correctIndex: 3,
    explanation:
      "When a class inherits from two separate polymorphic base classes, the most-derived object typically contains one vptr for each polymorphic base. On a 64-bit platform each vptr is 8 bytes. Since D inherits from both A and B, it contains two vptrs totaling 16 bytes. The compiler cannot merge them because each base needs its own vtable pointer so that a pointer to A or B within D points to the correct vtable.",
    link: "https://en.cppreference.com/w/cpp/language/object#Polymorphic_objects",
  },
  {
    id: 1174,
    difficulty: "Hard",
    topic: "Polymorphism",
    question: "Why can the compiler devirtualize the call to p->speak() in this code?",
    code: `#include <iostream>
struct Animal {
    virtual void speak() { std::cout << "Animal"; }
};
struct Dog : Animal {
    void speak() override { std::cout << "Woof"; }
};

void greet() {
    Dog d;
    Animal* p = &d;
    p->speak();
}`,
    options: [
      "The compiler cannot devirtualize here because p is declared as a base class pointer",
      "The optimizer proves the dynamic type is Dog and emits a direct call",
      "Devirtualization only applies when the function is marked constexpr",
      "The override keyword instructs the compiler to skip vtable lookup",
    ],
    correctIndex: 1,
    explanation:
      "The compiler can see that p is assigned the address of a local Dog object whose dynamic type cannot change. Through escape analysis and type propagation, the optimizer proves that p always points to a Dog, so it replaces the indirect vtable call with a direct call to Dog::speak(). This is called devirtualization. It has nothing to do with constexpr or the override keyword; it is a general optimization that modern compilers perform when they can prove the concrete type at compile time.",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  {
    id: 1175,
    difficulty: "Hard",
    topic: "Polymorphism",
    question: "What does this type erasure implementation print?",
    code: `#include <iostream>
#include <memory>

class Drawable {
    struct Concept {
        virtual void draw_() const = 0;
        virtual ~Concept() = default;
    };
    template <typename T>
    struct Model : Concept {
        T obj;
        Model(T o) : obj(std::move(o)) {}
        void draw_() const override { obj.draw(); }
    };
    std::unique_ptr<Concept> p_;
public:
    template <typename T>
    Drawable(T x) : p_(std::make_unique<Model<T>>(std::move(x))) {}
    void draw() const { p_->draw_(); }
};

struct Circle { void draw() const { std::cout << "O"; } };
struct Square { void draw() const { std::cout << "[]"; } };

int main() {
    Drawable a(Circle{});
    Drawable b(Square{});
    a.draw();
    b.draw();
}`,
    options: [
      "Compilation error because Circle and Square do not inherit from the Concept interface",
      "Undefined behavior because the unique_ptr is moved during constructor initialization",
      "O[] because each Model wraps its type and delegates via virtual dispatch",
      "O[] because template argument deduction bypasses the virtual function mechanism",
    ],
    correctIndex: 2,
    explanation:
      "Type erasure works by wrapping any type T that satisfies a structural requirement (having a draw() method) inside a Model<T> that inherits from a polymorphic Concept base. Circle and Square do not need to inherit from anything; Model<Circle> and Model<Square> inherit from Concept and override draw_(). The Drawable constructor creates the appropriate Model and stores it as a unique_ptr<Concept>. When draw() is called, virtual dispatch on the Concept pointer reaches the correct Model, which calls the stored object's draw(). The output is O followed by [].",
    link: "https://en.cppreference.com/w/cpp/language/templates",
  },
  {
    id: 1176,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What key trade-off does std::variant with std::visit have compared to a virtual function hierarchy?",
    code: `#include <variant>
#include <iostream>

struct Circle { double r; };
struct Rect   { double w, h; };

using Shape = std::variant<Circle, Rect>;

double area(const Shape& s) {
    return std::visit([](auto& sh) -> double {
        if constexpr (std::is_same_v<std::decay_t<decltype(sh)>, Circle>)
            return 3.14159 * sh.r * sh.r;
        else
            return sh.w * sh.h;
    }, s);
}`,
    options: [
      "std::visit always performs slower runtime dispatch than a single vtable indirect call",
      "std::variant cannot hold types larger than 64 bytes due to internal stack size constraints",
      "std::variant requires all alternative types to share a common base class for dispatch",
      "Adding a new type requires changing every visit call site instead of adding a subclass",
    ],
    correctIndex: 3,
    explanation:
      "With virtual functions, adding a new shape only requires creating a new derived class that overrides the virtual methods. Existing code that dispatches through base pointers does not change. With std::variant, adding a new alternative type means the variant type alias changes, and every std::visit call site must handle the new alternative or the code will not compile. This is the classic expression problem: virtual hierarchies make adding types easy but adding operations hard, while variant/visit makes adding operations easy but adding types hard.",
    link: "https://en.cppreference.com/w/cpp/utility/variant",
  },
  {
    id: 1177,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Where is the RTTI type_info object for a polymorphic class typically stored relative to the vtable?",
    code: `struct Base {
    virtual ~Base() = default;
};
struct Derived : Base {};

Base* p = new Derived;
// typeid(*p) accesses RTTI -- where is that data?`,
    options: [
      "Inside each object instance alongside the vptr stored as a second hidden data member",
      "In a global hash map keyed by the mangled class name and populated at program startup",
      "At a fixed negative offset from the address that the vptr points to",
      "In a separate thread-local table that is rebuilt on every dynamic_cast operation",
    ],
    correctIndex: 2,
    explanation:
      "In common ABI implementations such as the Itanium C++ ABI, the type_info pointer for a polymorphic class is stored at a negative offset (typically slot -1) from the address that the vptr points to. When typeid is applied to a polymorphic expression, the compiler reads the vptr from the object, then fetches the type_info pointer from just before the first vtable entry. This avoids enlarging the object itself and keeps RTTI tightly coupled to the vtable.",
    link: "https://en.cppreference.com/w/cpp/types/type_info",
  },
  {
    id: 1178,
    difficulty: "Hard",
    topic: "Polymorphism",
    question: "What does this C++20 code produce, and why is it valid?",
    code: `#include <iostream>

struct Base {
    constexpr virtual int value() const { return 1; }
    constexpr virtual ~Base() = default;
};
struct Derived : Base {
    constexpr int value() const override { return 42; }
};

consteval int get_val() {
    Derived d;
    Base const& ref = d;
    return ref.value();
}

int main() {
    constexpr int v = get_val();
    std::cout << v;
}`,
    options: [
      "Compilation error because virtual functions cannot be declared constexpr in any standard",
      "1, because constexpr evaluation always uses the static type for function dispatch",
      "42, because C++20 allows constexpr virtual calls resolved at compile time",
      "Undefined behavior because consteval functions cannot invoke virtual dynamic dispatch",
    ],
    correctIndex: 2,
    explanation:
      "C++20 permits virtual functions to be declared constexpr. During constant evaluation the compiler knows the complete dynamic type of every object, so it can resolve virtual calls without a vtable. In get_val(), d is a Derived object and ref is bound to it. The compiler resolves ref.value() to Derived::value() and returns 42. The result is stored in the constexpr variable v, and the program prints 42.",
    link: "https://en.cppreference.com/w/cpp/language/constexpr",
  },
  {
    id: 1179,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "Why does a polymorphic base class with virtual functions not benefit from Empty Base Optimization?",
    code: `struct Empty {};
struct Poly { virtual void f() {} };

struct A : Empty { int x; };
struct B : Poly  { int x; };

// sizeof(A) is likely 4, sizeof(B) is likely 16`,
    options: [
      "The standard prohibits EBO for any class that uses inheritance with overrides",
      "Virtual functions require a hidden vptr member so the base is never truly empty",
      "EBO only works with final classes that the compiler can fully inline at link time",
      "The polymorphic base stores RTTI strings inline which prevents size optimization",
    ],
    correctIndex: 1,
    explanation:
      "Empty Base Optimization allows a base class with no non-static data members to occupy zero bytes inside a derived class. However, a class with virtual functions is never empty in practice because the compiler inserts a hidden vptr (virtual table pointer) into every polymorphic object. This vptr is typically 8 bytes on a 64-bit platform. Since the base is no longer truly empty, EBO does not apply and the derived class B has both the vptr from Poly and its own int x member, plus alignment padding.",
    link: "https://en.cppreference.com/w/cpp/language/ebo",
  },
  {
    id: 1180,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "What advantage does CRTP-based static polymorphism have over virtual dispatch in this benchmark scenario?",
    code: `template <typename Derived>
struct Base {
    void execute() { static_cast<Derived*>(this)->do_work(); }
};
struct Fast : Base<Fast> {
    void do_work() { /* compute */ }
};

void run(Base<Fast>& obj) {
    for (int i = 0; i < 1'000'000; ++i)
        obj.execute();
}`,
    options: [
      "CRTP avoids heap allocation by storing the vtable inside the stack frame",
      "CRTP calls are resolved at compile time so the optimizer can inline them fully",
      "CRTP allows multiple return types from the same function signature at runtime",
      "CRTP skips the destructor chain making cleanup faster in tight loops like this",
    ],
    correctIndex: 1,
    explanation:
      "CRTP resolves the call target at compile time through the static_cast to Derived*. Because execute() calls Derived::do_work() directly without an indirect vtable lookup, the compiler sees the exact function being called and can inline it completely. In a tight loop of one million iterations this eliminates the branch prediction overhead and memory indirection cost of virtual dispatch. The key benefit is that the compiler can optimize across the call boundary since the callee is known statically.",
    link: "https://en.cppreference.com/w/cpp/language/crtp",
  },
  {
    id: 1181,
    difficulty: "Hard",
    topic: "Polymorphism",
    question:
      "How does std::pmr::polymorphic_allocator achieve type-erased memory allocation?",
    code: `#include <memory_resource>
#include <vector>

std::pmr::monotonic_buffer_resource pool;
std::pmr::vector<int> v(&pool);
v.push_back(42);`,
    options: [
      "It stores a pointer to a memory_resource base and dispatches via virtual allocate/deallocate",
      "It uses a std::variant of all standard resource types to select the allocation strategy at compile time",
      "It embeds a function pointer table directly in the vector object to avoid heap indirection overhead",
      "It requires the container to be templated on the concrete resource type for each allocation strategy",
    ],
    correctIndex: 0,
    explanation:
      "std::pmr::polymorphic_allocator holds a pointer to std::pmr::memory_resource, which is an abstract base class with virtual functions do_allocate(), do_deallocate(), and do_is_equal(). Any concrete memory resource such as monotonic_buffer_resource or synchronized_pool_resource inherits from memory_resource and overrides these virtual functions. This is classic runtime polymorphism: the allocator does not need to know the concrete resource type, so containers using polymorphic_allocator all share the same type regardless of which memory resource backs them.",
    link: "https://en.cppreference.com/w/cpp/memory/polymorphic_allocator",
  },
];
