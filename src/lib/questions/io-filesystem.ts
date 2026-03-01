import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 32,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "Which header provides std::filesystem::path and directory operations in C++17?",
    options: ["<cstdio>", "<iostream>", "<fstream>", "<filesystem>"],
    correctIndex: 3,
    explanation:
      "The <filesystem> header (C++17) provides std::filesystem::path, directory_iterator, and functions like exists(), create_directory(), and copy().",
    link: "https://en.cppreference.com/w/cpp/filesystem.html",
  },
  {
    id: 33,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      'What is the state of std::cin after extraction when the user types "hello" for an int?',
    code: `int x;\nstd::cin >> x;  // user types "hello"`,
    options: [
      "Fail -- the failbit is set",
      "Good -- x is set to 0",
      "Bad -- an irrecoverable error occurred",
      "EOF -- the stream reached end-of-file",
    ],
    correctIndex: 0,
    explanation:
      'The extraction fails because "hello" cannot be parsed as an integer. The failbit is set. You must call cin.clear() and discard the bad input before reading again.',
    link: "https://en.cppreference.com/w/cpp/io/basic_istream/operator_gtgt.html",
  },
  {
    id: 467,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "What is the difference between std::cin and std::getline?",
    code: `std::string word, line;\nstd::cin >> word;            // reads \"hello\"\nstd::getline(std::cin, line); // reads \"hello world\"`,
    options: [
      "They are identical",
      "std::cin >> is faster because it skips parsing and copies raw bytes directly from the input buffer into the variable",
      "std::getline only works with C-strings (char arrays), and you must use cin >> for std::string input",
      "std::cin >> extracts one whitespace-delimited token. std::getline reads an entire line including spaces, stopping at the newline character",
    ],
    correctIndex: 3,
    explanation:
      "operator>> skips leading whitespace and reads until the next whitespace. getline reads everything up to (and discards) the newline. A common pitfall: after cin >>, a leftover newline in the buffer causes the next getline to read an empty string.",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-iostream-cout-cin-and-endl/",
  },
  {
    id: 468,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "How do you write to and read from a file using streams?",
    code: `std::ofstream out("data.txt");\nout << "hello" << 42;\nout.close();\n\nstd::ifstream in("data.txt");\nstd::string s;\nin >> s;`,
    options: [
      "std::ofstream opens a file for writing, std::ifstream for reading. They use the same << and >> operators as cout/cin. The file is automatically closed when the stream object is destroyed",
      "You must use C-style fopen/fclose",
      "You must use std::filesystem to read/write files",
      "File streams require calling open() before any I/O",
    ],
    correctIndex: 0,
    explanation:
      "File streams mirror cin/cout but target files. The constructor opens the file, the destructor closes it (RAII). You can also explicitly call open()/close(). ofstream truncates by default; use std::ios::app to append.",
    link: "https://www.learncpp.com/cpp-tutorial/basic-file-io/",
  },
  {
    id: 469,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "What is std::stringstream used for?",
    code: `std::stringstream ss;\nss << "Age: " << 25;\nstd::string result = ss.str();  // "Age: 25"`,
    options: [
      "Compressing strings using a built-in zlib integration that reduces memory usage for large text buffers",
      "Reading from the network using a socket-based stream interface that wraps TCP/IP connections in the standard I/O model",
      "Encrypting string data using AES-256 encryption so that the in-memory representation is protected from unauthorized access",
      "Treating a string as an I/O stream",
    ],
    correctIndex: 3,
    explanation:
      "std::stringstream provides stream operations on an in-memory string. Use << to build formatted strings (alternative to string concatenation) and >> to parse values out of strings. It's especially useful for converting between strings and numeric types.",
    link: "https://www.learncpp.com/cpp-tutorial/stream-classes-for-strings/",
  },
  {
    id: 470,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "What does std::endl do compared to '\\n'?",
    options: [
      "'\\\\n' only works on Linux and macOS systems; std::endl is the cross-platform way to insert a newline that correctly handles \\\\r\\\\n line endings on Windows operating systems",
      "Both insert a newline, but std::endl also flushes the output buffer. Flushing forces the data to be written immediately, which is slower than just writing '\\\\n'",
      "std::endl inserts two newlines to visually separate output sections, while '\\\\n' inserts just one",
      "They are identical",
    ],
    correctIndex: 1,
    explanation:
      "std::endl = '\\n' + flush. Flushing on every line is unnecessary in most cases and can significantly slow I/O. Use '\\n' by default. Use std::endl (or std::flush) only when you need to guarantee the output is visible immediately (e.g., before a crash or before reading input).",
    link: "https://www.learncpp.com/cpp-tutorial/introduction-to-iostream-cout-cin-and-endl/",
  },
  {
    id: 471,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "How do you check if a file was opened successfully?",
    code: `std::ifstream file("data.txt");\nif (!file) {\n    std::cerr << "Failed to open file\\n";\n}`,
    options: [
      "The stream converts to bool: true if the stream is in a good state, false if it failed to open or encountered an error",
      "You must call file.check() after opening, which returns an error code indicating whether the file was opened successfully",
      "You can't -- file opens always succeed because the OS creates the file automatically if it does not already exist",
      "You must catch an exception thrown by the constructor, because ifstream always throws std::ios_base::failure on open errors",
    ],
    correctIndex: 0,
    explanation:
      "Stream objects have an operator bool() that returns true when the stream is in a good state. If the file doesn't exist or can't be opened, the stream enters a fail state and evaluates to false. Always check before performing I/O.",
    link: "https://www.learncpp.com/cpp-tutorial/basic-file-io/",
  },
  {
    id: 472,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "What is the difference between text mode and binary mode when opening a file?",
    code: `std::ofstream text("a.txt");                       // text mode\nstd::ofstream bin("b.dat", std::ios::binary);      // binary mode`,
    options: [
      "No difference on any platform",
      "Text mode may translate newlines. Binary mode writes/reads bytes exactly as-is with no translation. Use binary mode for non-text data",
      "Binary mode is faster because it bypasses the format parser, but it can't handle strings or any human-readable text data",
      "Text mode adds encryption to the file stream so the data is protected at rest with OS-level encryption; binary mode writes unencrypted raw bytes directly to disk without any security transformation",
    ],
    correctIndex: 1,
    explanation:
      "On Windows, text mode translates \\n to \\r\\n on write and \\r\\n to \\n on read. Binary mode performs no translation. If you write a struct or image in text mode on Windows, the \\r\\n translations corrupt the data. Always use binary mode for non-text data.",
    link: "https://en.cppreference.com/w/cpp/io/basic_filebuf/open.html",
  },
  {
    id: 473,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "How do you read an entire file into a string efficiently?",
    code: `std::ifstream file("data.txt");\nstd::string content(\n    (std::istreambuf_iterator<char>(file)),\n    std::istreambuf_iterator<char>()\n);`,
    options: [
      "This reads the file backwards from the end to the beginning, because istreambuf_iterator traverses the stream buffer in reverse order by default",
      "istreambuf_iterator reads raw characters from the stream buffer without formatting. Constructing a string from begin/end iterators reads the entire file in one pass, typically faster than repeated getline calls",
      "This only works for files smaller than 1KB because istreambuf_iterator uses a fixed internal buffer that cannot be resized, and larger files cause a buffer overflow that silently truncates content",
      "This is invalid",
    ],
    correctIndex: 1,
    explanation:
      "istreambuf_iterator bypasses formatted extraction (no whitespace skipping) and reads raw chars. The default-constructed iterator represents EOF. This is a common idiomatic pattern for slurping a file. Alternatively, read the file size and use string::resize + file.read().",
    link: "https://en.cppreference.com/w/cpp/iterator/istreambuf_iterator.html",
  },
  {
    id: 474,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "What stream state flags exist and what do they mean?",
    code: `std::cin >> x;\nif (std::cin.fail())  { /* ... */ }\nif (std::cin.eof())   { /* ... */ }\nif (std::cin.bad())   { /* ... */ }`,
    options: [
      "eof means the file was deleted during reading",
      "There is only one flag: good or bad",
      "goodbit: no errors. failbit: a logical error. eofbit: end of input reached. badbit: an irrecoverable I/O error. fail() returns true if failbit or badbit is set",
      "These flags are automatically cleared after each read operation, so you never need to call stream.clear() manually",
    ],
    correctIndex: 2,
    explanation:
      "Streams have four state bits. failbit is set for recoverable input errors (wrong format). badbit signals a serious I/O failure. eofbit signals end of file. fail() checks failbit|badbit. To continue after a failure, call stream.clear() to reset flags and stream.ignore() to skip bad input.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/iostate.html",
  },
  {
    id: 475,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "How does std::filesystem::path handle cross-platform paths?",
    code: `namespace fs = std::filesystem;\nfs::path p = fs::path("/usr") / "local" / "bin";\nstd::cout << p;`,
    options: [
      "It only works on Linux and POSIX paths",
      "It always uses forward slashes regardless of platform",
      "path::operator/ joins path segments using the platform's native separator. path provides methods like stem(), extension(), parent_path() that work cross-platform, abstracting away / vs \\\\\\\\ differences",
      "The / operator performs division on path sizes, returning the ratio of the left path's byte length to the right path's byte length",
    ],
    correctIndex: 2,
    explanation:
      "std::filesystem::path (C++17) encapsulates a pathname and provides cross-platform manipulation. operator/ joins segments. On Windows it uses \\\\, on Unix /. Methods like filename(), extension(), parent_path() parse the path correctly regardless of platform.",
    link: "https://en.cppreference.com/w/cpp/filesystem/path.html",
  },
  {
    id: 476,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "Why is printf sometimes preferred over std::cout for performance-critical output?",
    options: [
      "printf supports more format specifiers than cout, including specifiers for wide strings, complex numbers, binary output, and custom user-defined types",
      "cout is deprecated in modern C++",
      "printf formats into a buffer and writes in one system call. cout's operator<< chain may cause multiple virtual calls and buffer flushes. However, with std::ios_base::sync_with_stdio(false), cout can be comparably fast",
      "printf is always faster in every scenario because it is implemented in hand-tuned assembly and bypasses the C++ runtime entirely",
    ],
    correctIndex: 2,
    explanation:
      "By default, cout is synchronized with C stdio (for mixing cout/printf), adding overhead. Calling sync_with_stdio(false) and cin.tie(nullptr) can make cout much faster. printf also avoids the overhead of chained operator<< calls. For best performance, C++20's std::format + write combines safety and speed.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/sync_with_stdio.html",
  },
  {
    id: 477,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question: "How does I/O buffering work and what are the three buffering modes?",
    options: [
      "Buffering only applies to input streams, not output streams",
      "Fully buffered: data is written when the buffer is full (files). Line buffered: data is written when a newline is encountered. Unbuffered: data is written immediately (stderr). Buffering reduces system calls by batching writes",
      "The buffer is always exactly 4096 bytes, and this size cannot be changed by the application or the runtime",
      "I/O is always unbuffered",
    ],
    correctIndex: 1,
    explanation:
      "Buffering amortizes the cost of system calls. Full buffering collects data until the buffer fills, then writes all at once. Line buffering flushes on newlines (useful for terminals). Unbuffered writes immediately (cerr/stderr). You can set the buffer size with setvbuf or pubsetbuf.",
    link: "https://en.cppreference.com/w/cpp/io/basic_streambuf.html",
  },
  {
    id: 478,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question: "How do you safely write a struct to a binary file and read it back?",
    code: `struct Record {\n    int id;\n    double value;\n};\n\nRecord r{1, 3.14};\nstd::ofstream out("data.bin", std::ios::binary);\nout.write(reinterpret_cast<const char*>(&r), sizeof(r));`,
    options: [
      "reinterpret_cast is undefined behavior here because casting a struct pointer to const char* violates the strict aliasing rule in all cases",
      "You must use text mode for struct I/O because binary mode does not support structured data",
      "This is always safe for any struct, including those with pointers, virtual functions, and std::string members",
      "This works for trivially copyable types with no pointers, but is fragile: padding, endianness, and sizeof may differ between compilers/platforms. Portable serialization requires explicit field-by-field writing or a serialization library",
    ],
    correctIndex: 3,
    explanation:
      "Binary I/O of a flat struct works if the struct is trivially copyable and you read on the same platform. But struct layout (padding, alignment), byte order (endianness), and type sizes may differ across compilers or architectures. For portable formats, use explicit serialization (protobuf, flatbuffers, or manual field-by-field).",
    link: "https://en.cppreference.com/w/cpp/io/basic_ostream/write.html",
  },
  {
    id: 479,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question: "What is memory-mapped I/O and when would you use it instead of streams?",
    options: [
      "It's the same as reading a file into a std::string",
      "It requires custom kernel drivers to be installed, because standard operating systems do not expose memory mapping to user-space programs. Without these drivers, the virtual memory subsystem has no mechanism to fault in file-backed pages on demand",
      "It's only available on embedded systems that have direct physical memory access and no virtual memory translation layer. Desktop and server operating systems like Linux and Windows lack the hardware support to map files into process address space",
      "Memory-mapped I/O maps a file directly into the process's virtual address space, letting you access file contents via pointers as if they were in memory. The OS handles paging. It's faster for large files and random access patterns",
    ],
    correctIndex: 3,
    explanation:
      "Instead of read/write system calls, mmap maps file pages into virtual memory. Accessing the mapped region triggers page faults that load data on demand. Benefits: no user-space buffering, efficient random access, shared mapping between processes. Downsides: no portable C++ API (OS-specific), tricky error handling.",
    link: "https://en.cppreference.com/w/cpp/io.html",
  },
  {
    id: 480,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question: "What does std::filesystem::recursive_directory_iterator do and what pitfalls should you watch for?",
    code: `namespace fs = std::filesystem;\nfor (const auto& entry : fs::recursive_directory_iterator("/project")) {\n    if (entry.is_regular_file())\n        std::cout << entry.path() << " " << entry.file_size() << "\\n";\n}`,
    options: [
      "It recursively traverses all subdirectories. Pitfalls: symlink loops (can cause infinite recursion",
      "It's only available on Linux",
      "It reads the contents of all files recursively, loading each file's data into memory so you can process them without separate open calls. This is how large-scale file search tools work: they read every file into a buffer and then scan the buffer for pattern matches",
      "It only lists files in the top-level directory",
    ],
    correctIndex: 0,
    explanation:
      "recursive_directory_iterator walks all nested directories. By default it doesn't follow symlinks (safe). Always handle permission errors -- use the error_code overload or try/catch to skip inaccessible directories. Don't create/delete files while iterating.",
    link: "https://en.cppreference.com/w/cpp/filesystem/recursive_directory_iterator.html",
  },
  {
    id: 481,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question: "How do you create a custom stream manipulator?",
    code: `std::ostream& comma(std::ostream& os) {\n    return os << ", ";\n}\n\nstd::cout << "a" << comma << "b" << comma << "c";`,
    options: [
      "Manipulators require a special REGISTER_MANIP macro to register themselves with the stream's internal dispatch table before use. Without registration, the stream has no way to look up the function",
      "Only the standard library can define manipulators",
      "A function taking and returning an ostream& can be used directly as a manipulator because operator<< has an overload for function pointers of that signature. This prints 'a, b, c'",
      "This is invalid",
    ],
    correctIndex: 2,
    explanation:
      "ostream has: ostream& operator<<(ostream& (*fn)(ostream&)). When you pass a function with that signature, it's called automatically. std::endl, std::flush, and std::hex are all implemented this way. For manipulators with parameters (like setw), you return a small helper object with its own operator<<.",
    link: "https://en.cppreference.com/w/cpp/io/manip.html",
  },
  {
    id: 1182,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "Which C++ stream class is specifically designed for reading data from files?",
    options: [
      "std::ifstream, defined in the <fstream> header for file input operations",
      "std::ofstream, defined in the <fstream> header for file output operations",
      "std::stringstream, defined in the <sstream> header for string parsing",
      "std::ostream, defined in the <iostream> header for general output tasks",
    ],
    correctIndex: 0,
    explanation:
      "std::ifstream (input file stream) is the class dedicated to reading from files. std::ofstream is for writing, std::stringstream operates on strings, and std::ostream is a general output base class.",
    link: "https://en.cppreference.com/w/cpp/io/basic_ifstream",
  },
  {
    id: 1183,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "What does std::endl do when used with an output stream?",
    options: [
      "It inserts a newline character and then flushes the output buffer immediately",
      "It inserts a newline character without performing any flush of the buffer",
      "It clears the entire contents of the stream buffer without adding characters",
      "It resets the stream state flags and repositions the write pointer to start",
    ],
    correctIndex: 0,
    explanation:
      "std::endl inserts a newline character into the stream and then calls flush() on it. This is different from just writing the newline character, which does not force the buffer to be flushed.",
    link: "https://en.cppreference.com/w/cpp/io/manip/endl",
  },
  {
    id: 1184,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "Which function reads an entire line of text from an input stream into a std::string?",
    options: [
      "std::getline reads characters from the stream until the delimiter is found",
      "stream.get reads a single character from the stream on each invocation",
      "stream.read extracts a fixed number of characters into a character buffer",
      "stream.peek returns the next character from the stream without extracting it",
    ],
    correctIndex: 0,
    explanation:
      "std::getline(stream, string) reads all characters up to and including the delimiter (newline by default), stores everything except the delimiter in the string, and discards the delimiter from the stream.",
    link: "https://en.cppreference.com/w/cpp/string/basic_string/getline",
  },
  {
    id: 1185,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "What is the purpose of the std::ios::binary flag when opening a file?",
    options: [
      "It enables the stream to encode all written data into a binary number format",
      "It prevents the operating system from performing newline character translation",
      "It forces the file to be opened in read-only mode regardless of other flags",
      "It compresses file content automatically to reduce the total size on storage",
    ],
    correctIndex: 1,
    explanation:
      "On some platforms, text mode translates newline characters (e.g., converting between \\n and \\r\\n on Windows). Opening with std::ios::binary suppresses this translation, which is important for non-text data.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/openmode",
  },
  {
    id: 1186,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "Which manipulator sets the output to display floating-point numbers in fixed notation?",
    options: [
      "std::scientific forces the stream to use scientific exponential number notation",
      "std::setprecision controls the total digit count but does not set the notation",
      "std::fixed forces the stream to use fixed-point decimal notation for output",
      "std::defaultfloat restores the stream to its default floating-point formatting",
    ],
    correctIndex: 2,
    explanation:
      "std::fixed sets the floatfield format flag so that floating-point numbers are displayed in fixed-point notation. After setting std::fixed, std::setprecision controls the number of digits after the decimal point.",
    link: "https://en.cppreference.com/w/cpp/io/manip/fixed",
  },
  {
    id: 1187,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "What happens when you try to read from an std::ifstream that failed to open a file?",
    options: [
      "The program throws a std::runtime_error exception with a descriptive message",
      "The stream enters a fail state and all subsequent read operations return zero",
      "The read operations silently succeed but produce empty or default-initialized values",
      "The stream sets its failbit and all subsequent extraction operations will also fail",
    ],
    correctIndex: 3,
    explanation:
      "If the file cannot be opened, the stream sets its failbit internally. Any extraction attempted on this stream will also fail. You should always check whether the file opened successfully using the stream boolean conversion or the is_open() method.",
    link: "https://en.cppreference.com/w/cpp/io/basic_ifstream/open",
  },
  {
    id: 1188,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "Which header must be included to use std::setw and std::setprecision?",
    options: [
      "The <iomanip> header provides parameterized stream formatting manipulators",
      "The <iostream> header provides only the basic stream objects and operations",
      "The <fstream> header provides file stream classes for reading and writing files",
      "The <sstream> header provides string-based stream classes for text processing",
    ],
    correctIndex: 0,
    explanation:
      "The parameterized manipulators like std::setw, std::setprecision, std::setfill, and std::setbase are defined in the <iomanip> header. The <iostream> header provides std::cout and non-parameterized manipulators.",
    link: "https://en.cppreference.com/w/cpp/header/iomanip",
  },
  {
    id: 1189,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "What does the is_open() member function check on a file stream object?",
    options: [
      "It checks whether the stream has reached the end-of-file position already",
      "It checks whether a file is currently associated with the stream successfully",
      "It checks whether the stream buffer still has unread data available in it",
      "It checks whether the file on disk exists at the path given during creation",
    ],
    correctIndex: 1,
    explanation:
      "is_open() returns true if the file stream has a file successfully associated with it. This is the recommended way to verify that a call to open() or the constructor actually succeeded.",
    link: "https://en.cppreference.com/w/cpp/io/basic_fstream/is_open",
  },
  {
    id: 1190,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question: "Which operator is used to write data to an output stream in C++?",
    options: [
      "The >> extraction operator reads formatted input from a given stream object",
      "The << insertion operator writes formatted output to a given stream object",
      "The = assignment operator copies one stream object state into another object",
      "The () function-call operator invokes the stream as a callable output object",
    ],
    correctIndex: 1,
    explanation:
      "The << operator (insertion operator) is overloaded for output streams. It converts its right operand to text and inserts the characters into the stream. The >> operator performs the reverse, extracting formatted input.",
    link: "https://en.cppreference.com/w/cpp/io/basic_ostream/operator_ltlt",
  },
  {
    id: 1191,
    difficulty: "Easy",
    topic: "I/O & Filesystem",
    question:
      "What does std::cin.ignore() do by default when called with no arguments?",
    options: [
      "It extracts and discards exactly one character from the standard input stream",
      "It clears all error flags on the stream to allow further extraction attempts",
      "It discards every remaining character in the stream buffer until it is empty",
      "It peeks at the next character without extracting or discarding any of them",
    ],
    correctIndex: 0,
    explanation:
      "When called with no arguments, std::cin.ignore() extracts and discards a single character from the input stream. To discard more characters, you can pass a count and an optional delimiter character.",
    link: "https://en.cppreference.com/w/cpp/io/basic_istream/ignore",
  },
  {
    id: 1192,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "What is the output of this code that uses std::stringstream?",
    code: `#include <sstream>
#include <iostream>

std::stringstream ss("42 3.14 hello");
int i; double d; std::string s;
ss >> i >> d >> s;
std::cout << i << " " << s;`,
    options: [
      "The program outputs \"42 hello\" after extracting all three values correctly",
      "The program outputs \"42 3.14\" because the string extraction is not attempted",
      "The program outputs \"0 hello\" because integer extraction from text will fail",
      "The program fails to compile because stringstream cannot parse multiple types",
    ],
    correctIndex: 0,
    explanation:
      "std::stringstream supports the same formatted extraction as std::cin. The >> operator extracts 42 as an int, 3.14 as a double, and \"hello\" as a string. The output prints the int and string.",
    link: "https://en.cppreference.com/w/cpp/io/basic_stringstream",
  },
  {
    id: 1193,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "What happens to the contents of a file when you open it with std::ios::app mode?",
    options: [
      "All existing content is erased before any new data is written to the file",
      "The write position is set to the end so new data is appended after existing content",
      "The file is opened in read-only mode and write operations will silently be ignored",
      "The existing content is loaded into a memory buffer and overwritten from the start",
    ],
    correctIndex: 1,
    explanation:
      "std::ios::app (append mode) moves the write position to the end of the file before every write operation. This ensures that existing content is preserved and new data always goes at the end.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/openmode",
  },
  {
    id: 1194,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "How do you properly clear an error state on std::cin so extraction can resume?",
    options: [
      "Call std::cin.clear() to reset the state flags then discard the invalid input",
      "Call std::cin.flush() which resets the error flags and empties the read buffer",
      "Assign std::cin to a new istream object to obtain a completely fresh state",
      "Call std::cin.reset() which is the standard method for clearing stream errors",
    ],
    correctIndex: 0,
    explanation:
      "std::cin.clear() resets the stream state flags (failbit, badbit, eofbit) back to goodbit. After clearing, you typically need to also discard the bad input using ignore() before attempting further reads.",
    link: "https://en.cppreference.com/w/cpp/io/basic_ios/clear",
  },
  {
    id: 1195,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question: "What does std::setw(10) affect when used with the insertion operator?",
    options: [
      "It sets the minimum field width for only the very next formatted output operation",
      "It sets the minimum field width for all subsequent formatted output operations",
      "It sets the maximum number of characters that can be inserted into the stream",
      "It pads the output buffer with exactly ten space characters before writing data",
    ],
    correctIndex: 0,
    explanation:
      "std::setw is a non-sticky manipulator. It sets the minimum field width for the next formatted output operation only, after which the width resets to 0. Other manipulators like std::setprecision are sticky.",
    link: "https://en.cppreference.com/w/cpp/io/manip/setw",
  },
  {
    id: 1196,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "Which method would you use to get the current read position in an input file stream?",
    options: [
      "tellg() returns the current position of the get pointer in the input stream",
      "tellp() returns the current position of the put pointer in the output stream",
      "seekg() moves the get pointer to a new position within the input stream data",
      "seekp() moves the put pointer to a new position within the output stream data",
    ],
    correctIndex: 0,
    explanation:
      "tellg() (tell-get) returns the current position of the input (get) pointer as a std::streampos value. tellp() is for the output (put) pointer. seekg() and seekp() reposition their respective pointers.",
    link: "https://en.cppreference.com/w/cpp/io/basic_istream/tellg",
  },
  {
    id: 1197,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "What is the difference between std::ios::trunc and std::ios::app when opening an output file?",
    options: [
      "trunc erases existing content on open while app preserves content and appends new data",
      "trunc opens the file for reading only while app opens the file for writing operations only",
      "trunc appends data at the end of the file while app erases the file before each new write",
      "trunc and app are aliases for the same behavior and can be used interchangeably in code",
    ],
    correctIndex: 0,
    explanation:
      "std::ios::trunc truncates the file to zero length when opened, discarding all existing content. std::ios::app preserves existing content and moves the write position to the end before each write operation.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/openmode",
  },
  {
    id: 1198,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "What does this code output when reading a file with std::istreambuf_iterator?",
    code: `#include <fstream>
#include <string>
#include <iterator>
// file.txt contains "Hello World"
std::ifstream ifs("file.txt");
std::string content(
  (std::istreambuf_iterator<char>(ifs)),
  std::istreambuf_iterator<char>()
);
std::cout << content.size();`,
    options: [
      "It outputs 11 because istreambuf_iterator reads all characters including the space",
      "It outputs 5 because istreambuf_iterator stops reading at the first whitespace found",
      "It outputs 0 because istreambuf_iterator requires binary mode to read file contents",
      "It causes a compilation error because istreambuf_iterator cannot initialize a string",
    ],
    correctIndex: 0,
    explanation:
      "std::istreambuf_iterator reads characters directly from the stream buffer without skipping whitespace. It reads every character until EOF, so \"Hello World\" (11 characters including the space) is fully captured.",
    link: "https://en.cppreference.com/w/cpp/io/istreambuf_iterator",
  },
  {
    id: 1199,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "How does std::filesystem::exists() behave when given a path to a broken symbolic link?",
    options: [
      "It returns false because the target of the symbolic link does not exist on disk",
      "It returns true because the symbolic link file itself still exists on the filesystem",
      "It throws a std::filesystem::filesystem_error exception for the broken link case",
      "It returns true and sets a warning flag that can be queried through an error code",
    ],
    correctIndex: 0,
    explanation:
      "std::filesystem::exists() follows symbolic links by default. If the symlink target does not exist, exists() returns false. To check whether the symlink itself exists, use std::filesystem::symlink_status() instead.",
    link: "https://en.cppreference.com/w/cpp/filesystem/exists",
  },
  {
    id: 1200,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "What is the purpose of the std::ios::ate open mode flag for file streams?",
    options: [
      "It opens the file and positions the stream pointer at the end but allows seeking back",
      "It opens the file and appends all writes to the end without allowing any repositioning",
      "It opens the file in text mode and converts all line endings to the native platform form",
      "It opens the file exclusively so that no other process can access it simultaneously",
    ],
    correctIndex: 0,
    explanation:
      "std::ios::ate (at-end) positions the stream pointer at the end of the file immediately after opening. Unlike app mode, ate allows you to seek to any position afterward for reading or writing.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/openmode",
  },
  {
    id: 1201,
    difficulty: "Medium",
    topic: "I/O & Filesystem",
    question:
      "What does the std::noskipws manipulator do when applied to an input stream?",
    options: [
      "It causes the stream to throw an exception when whitespace characters are encountered",
      "It tells the extraction operator to skip all whitespace including embedded newlines",
      "It prevents the extraction operator from automatically skipping leading whitespace",
      "It converts all whitespace characters into underscore characters during extraction",
    ],
    correctIndex: 2,
    explanation:
      "By default, formatted input with >> skips leading whitespace. Applying std::noskipws disables this behavior, causing the extraction operator to process whitespace characters instead of skipping them.",
    link: "https://en.cppreference.com/w/cpp/io/manip/skipws",
  },
  {
    id: 1202,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What happens when you write a custom streambuf that overrides overflow() but not xsputn()?",
    options: [
      "The default xsputn calls overflow for each character so single-character output still works",
      "All multi-character writes silently produce no output because xsputn returns zero always",
      "The compiler rejects the class because xsputn is a pure virtual function requiring override",
      "The stream falls back to using the C stdio functions for all multi-character write requests",
    ],
    correctIndex: 0,
    explanation:
      "The default implementation of std::streambuf::xsputn() writes characters one at a time by calling sputc(), which in turn calls overflow() when the buffer is full. So overriding overflow() alone is sufficient for correctness, though not optimal for performance.",
    link: "https://en.cppreference.com/w/cpp/io/basic_streambuf/sputn",
  },
  {
    id: 1203,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "Why can reading a large file with repeated std::getline() calls be slower than using read() with a buffer?",
    options: [
      "getline scans every character looking for the delimiter which prevents large block reads",
      "getline automatically flushes the output stream after reading each individual line of data",
      "getline allocates a new string object on the heap for every single line that it extracts",
      "getline uses a mutex lock internally making it slower on systems with multiple CPU cores",
    ],
    correctIndex: 0,
    explanation:
      "std::getline must examine each character individually to detect the line delimiter. This character-by-character processing prevents the stream from performing large, efficient block reads. Using read() with a pre-allocated buffer allows the OS to transfer data in larger chunks.",
    link: "https://en.cppreference.com/w/cpp/string/basic_string/getline",
  },
  {
    id: 1204,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What subtle issue can arise when mixing std::cout and std::printf in the same program?",
    options: [
      "The compiler will reject the program because C and C++ I/O cannot coexist together",
      "Output from cout and printf may appear interleaved unless sync_with_stdio is enabled",
      "printf will always execute before cout regardless of the order they appear in the code",
      "All cout output is silently discarded when any printf call exists in the translation unit",
    ],
    correctIndex: 1,
    explanation:
      "C++ streams and C stdio have separate buffers. By default, std::ios_base::sync_with_stdio(true) keeps them synchronized. If you disable synchronization for performance, output from cout and printf may become interleaved unpredictably.",
    link: "https://en.cppreference.com/w/cpp/io/ios_base/sync_with_stdio",
  },
  {
    id: 1205,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What is the behavior of std::filesystem::recursive_directory_iterator when it encounters a permission-denied directory?",
    options: [
      "It throws a filesystem_error exception immediately and stops the entire iteration process",
      "It silently skips that directory and all its contents then continues with sibling entries",
      "It depends on the directory_options: skip_permission_denied makes it skip that entry",
      "It logs a warning message to std::cerr and then continues iterating remaining entries",
    ],
    correctIndex: 2,
    explanation:
      "By default, recursive_directory_iterator throws filesystem_error on permission denied. Passing directory_options::skip_permission_denied to the constructor makes it skip inaccessible directories and continue iteration.",
    link: "https://en.cppreference.com/w/cpp/filesystem/recursive_directory_iterator",
  },
  {
    id: 1206,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What is the purpose of std::streambuf::pubsetbuf() and when might it have no effect?",
    options: [
      "It requests the stream use a user-provided buffer, but implementations may ignore it",
      "It always forces the stream to use the provided buffer on every conforming compiler",
      "It sets the internal locale facet buffer used for character encoding conversions only",
      "It adjusts the maximum character count the stream will cache before writing to disk",
    ],
    correctIndex: 0,
    explanation:
      "pubsetbuf() calls the protected virtual function setbuf(), which requests the stream to use a caller-provided character buffer. However, the C++ standard allows implementations to ignore this request entirely. Some standard library implementations treat it as a no-op.",
    link: "https://en.cppreference.com/w/cpp/io/basic_streambuf/pubsetbuf",
  },
  {
    id: 1207,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What does std::filesystem::weakly_canonical() do that canonical() does not?",
    options: [
      "It resolves the existing prefix of a path and normalizes the rest without requiring existence",
      "It returns the path unchanged without resolving any symbolic links or relative components",
      "It canonicalizes the path but uses weak_ptr internally to avoid circular symlink references",
      "It performs the same resolution as canonical but caches the result for faster future lookups",
    ],
    correctIndex: 0,
    explanation:
      "weakly_canonical() resolves symlinks and normalizes the portion of the path that exists, then appends the remaining non-existent portion in normalized form. canonical() requires the entire path to exist and throws if it does not.",
    link: "https://en.cppreference.com/w/cpp/filesystem/weakly_canonical",
  },
  {
    id: 1208,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What problem does std::unitbuf solve and which standard stream uses it by default?",
    options: [
      "It flushes the stream after every output operation, and std::cerr uses it by default",
      "It buffers output in fixed-size units for efficiency, and std::cout uses it by default",
      "It enables thread-safe output by locking on each write, and std::clog uses it by default",
      "It converts output encoding to UTF-8 automatically, and std::wcerr uses it by default",
    ],
    correctIndex: 0,
    explanation:
      "std::unitbuf causes the stream to flush its buffer after every output operation. std::cerr has unitbuf set by default so that error messages appear immediately. std::clog does not have unitbuf set, so it is buffered.",
    link: "https://en.cppreference.com/w/cpp/io/manip/unitbuf",
  },
  {
    id: 1209,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "How does std::filesystem::space() report the available storage for a given path?",
    options: [
      "It returns a space_info struct containing capacity, free space, and available space fields",
      "It returns a single integer representing the total bytes available for the current user",
      "It writes the space information to a provided output stream in human-readable text format",
      "It returns a pair of values representing the total capacity and currently used byte count",
    ],
    correctIndex: 0,
    explanation:
      "std::filesystem::space() returns a std::filesystem::space_info struct with three fields: capacity (total size), free (free space), and available (space available to non-privileged users, which may be less than free due to quotas).",
    link: "https://en.cppreference.com/w/cpp/filesystem/space",
  },
  {
    id: 1210,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What role does the std::codecvt facet play in C++ file stream I/O operations?",
    options: [
      "It performs character encoding conversion between the internal and external representations",
      "It controls the alignment and padding of formatted numeric output in the stream operations",
      "It determines how whitespace characters are classified when parsing formatted input values",
      "It manages the buffering strategy used by file streams to optimize sequential disk access",
    ],
    correctIndex: 0,
    explanation:
      "The std::codecvt locale facet converts between the internal character encoding used by the program and the external encoding stored in the file. For example, a wchar_t file stream uses codecvt to convert between wide characters internally and a multibyte encoding on disk.",
    link: "https://en.cppreference.com/w/cpp/locale/codecvt",
  },
  {
    id: 1211,
    difficulty: "Hard",
    topic: "I/O & Filesystem",
    question:
      "What happens when you call std::filesystem::rename() to move a file across different filesystems?",
    options: [
      "It always succeeds by automatically copying the file then deleting the original source",
      "The behavior is implementation-defined and may fail with an error on cross-device moves",
      "It succeeds only if both filesystems use the same underlying format like NTFS or ext4",
      "It transparently creates a symbolic link at the destination pointing back to the source",
    ],
    correctIndex: 1,
    explanation:
      "std::filesystem::rename() maps to the operating system rename function, which typically cannot move files across filesystem boundaries. On POSIX systems, this produces an EXDEV error. To move cross-device, you must copy the file and then remove the original.",
    link: "https://en.cppreference.com/w/cpp/filesystem/rename",
  },
];
