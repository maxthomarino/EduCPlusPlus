/**
 * streams.cpp - File I/O and String Streams in C++
 *
 * C++ I/O is built on the "streams" abstraction: a stream is a sequence
 * of bytes that you can read from (input) or write to (output). The
 * same << and >> operators you use with std::cout work with files,
 * strings, and any other stream.
 *
 *   std::ifstream   — read from a file (input file stream)
 *   std::ofstream   — write to a file (output file stream)
 *   std::fstream    — read AND write to a file
 *   std::istringstream — read from a string (as if it were a file)
 *   std::ostringstream — write to a string (build strings like cout)
 *   std::stringstream  — read and write to a string
 *
 * The stream hierarchy (simplified):
 *
 *   std::ios_base          <- formatting flags, precision, width
 *     └── std::ios         <- stream state (good, fail, eof, bad)
 *          ├── std::istream <- operator>> (input)
 *          │    ├── std::ifstream
 *          │    └── std::istringstream
 *          ├── std::ostream <- operator<< (output)
 *          │    ├── std::ofstream
 *          │    └── std::ostringstream
 *          └── std::iostream <- both input and output
 *               ├── std::fstream
 *               └── std::stringstream
 *
 * Prerequisites: Basic I/O with std::cout, RAII concepts.
 * Reference:     reference/en/cpp/io.html
 */

#include <iostream>
#include <format>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <filesystem>
#include <stdexcept>

// =====================================================
// FREQUENTLY ASKED QUESTIONS (first-timer Q&A)
// =====================================================
//
// Q: Why do I need fstream when I can use C's fopen/fclose?
// A: Streams are RAII-based: the destructor closes the file
//    automatically, even if an exception is thrown. With fopen,
//    a thrown exception leaks the file handle. Streams also work
//    with operator<< and operator>>, so the same code that prints
//    to the console can write to a file with zero changes.
//
// Q: What's the difference between >> and std::getline?
// A: operator>> reads ONE TOKEN (whitespace-delimited word).
//    std::getline reads the ENTIRE LINE (up to '\n').
//    Use >> for structured data (numbers, single words).
//    Use getline for free-form text, paths, or CSV fields.
//
// Q: Should I check if the file opened successfully?
// A: YES, always. Opening can fail (file doesn't exist, no
//    permissions, disk full). Check with if (!file) or
//    if (!file.is_open()). Better yet, set the exceptions()
//    mask so failures throw exceptions automatically.
//
// Q: Do I need to close the file manually?
// A: No. The destructor closes it when the stream goes out of scope
//    (RAII). However, you CAN call .close() explicitly if you need
//    to reuse the variable or ensure the file is closed at a specific
//    point. After close(), the stream can be reopened with .open().
//
// Q: What is "text mode" vs "binary mode"?
// A: Text mode (default) translates platform-specific line endings:
//    on Windows, "\r\n" in the file becomes "\n" when read.
//    Binary mode (std::ios::binary) reads/writes raw bytes with
//    no translation. Use binary for images, archives, serialized
//    data — anything that isn't plain text.
//
// Q: Why does my output file appear empty?
// A: Output streams buffer data in memory and flush to disk
//    periodically. If the program crashes before flushing, data is
//    lost. The destructor flushes automatically, but if you need
//    data written immediately, use: file << std::flush; or
//    file << std::endl; (which writes '\n' AND flushes).
//    Prefer '\n' over std::endl in loops — endl forces a flush
//    every iteration, which is much slower.
//
// Q: What's std::stringstream for?
// A: It's an in-memory stream backed by a std::string instead of a
//    file. Great for: parsing strings as if they were files, building
//    complex strings piece by piece, and converting between types.
//    With C++20 std::format, you need stringstream less often for
//    formatting, but it's still useful for parsing.
// =====================================================

// =====================================================
// HOW STREAM STATE WORKS
//
// Every stream maintains state flags:
//
//   goodbit (0)  — no errors, ready for I/O
//   eofbit       — end of input reached
//   failbit      — a logical I/O error (wrong format, file not found)
//   badbit       — an unrecoverable I/O error (disk failure, etc.)
//
// You can check them with:
//   stream.good()  — goodbit is set (no errors at all)
//   stream.eof()   — eofbit is set
//   stream.fail()  — failbit OR badbit is set
//   stream.bad()   — badbit is set (serious error)
//   stream.operator bool() — equivalent to !fail()
//
// The idiomatic way to check is:
//   if (stream) { /* good */ }
//   if (!stream) { /* failed */ }
//
// After a failure, the stream is "stuck" — all further I/O operations
// are no-ops until you clear the error:
//   stream.clear();  // Reset all error flags
//   stream.clear(std::ios::eofbit);  // Clear specific flags
//
// WHY STREAMS GET "STUCK":
//   This is a safety feature. If reading an integer fails because the
//   input is "abc", you don't want the stream to silently skip ahead
//   and parse garbage. The sticky fail state forces you to handle
//   the error before continuing.
// =====================================================

// Helper: create a temporary file for demos
// (We create files programmatically so the examples are self-contained)
const std::string DEMO_FILE = "demo_output.txt";
const std::string CSV_FILE  = "demo_data.csv";

// -----------------------------------------------
// 1. Writing to a file with std::ofstream
// -----------------------------------------------
void demo_file_writing() {
    std::cout << "--- 1. Writing to a file ---\n";

    // Open file for writing (creates if doesn't exist, truncates if does)
    std::ofstream out(DEMO_FILE);

    // ALWAYS check that the file opened successfully
    if (!out) {
        std::cerr << "  ERROR: Could not open " << DEMO_FILE << " for writing\n";
        return;
    }
    // Alternative: out.exceptions(std::ios::failbit | std::ios::badbit);
    // This makes the stream throw std::ios_base::failure on errors
    // instead of silently setting flags. Choose one style and be consistent.

    // Write to file — same syntax as std::cout
    out << "Line 1: Hello, file I/O!\n";
    out << "Line 2: The number is " << 42 << '\n';
    out << "Line 3: Pi = " << 3.14159 << '\n';
    out << std::format("Line 4: Formatted with std::format: {:#x}\n", 255);

    // File is automatically closed when 'out' goes out of scope (RAII)
    // But we can close explicitly if needed:
    out.close();

    std::cout << std::format("  Wrote 4 lines to {}\n", DEMO_FILE);
}

// -----------------------------------------------
// 2. Reading from a file with std::ifstream
// -----------------------------------------------
void demo_file_reading() {
    std::cout << "\n--- 2. Reading from a file ---\n";

    std::ifstream in(DEMO_FILE);
    if (!in) {
        std::cerr << "  ERROR: Could not open " << DEMO_FILE << " for reading\n";
        return;
    }

    // --- 2a. Read entire file line by line (most common pattern) ---
    std::cout << "  Reading line by line:\n";
    std::string line;
    int line_num = 0;
    while (std::getline(in, line)) {
        ++line_num;
        std::cout << std::format("    [{}] {}\n", line_num, line);
    }
    // Loop ends when getline hits EOF or an error.
    // getline returns a reference to the stream; the stream converts
    // to false when it's in a fail/eof state.

    // --- 2b. Reset stream to read again ---
    in.clear();              // Clear the EOF flag
    in.seekg(0);             // Seek back to the beginning
    // seekg = "seek get" (input position). seekp = "seek put" (output position).

    // --- 2c. Read word by word with >> ---
    std::cout << "\n  First 5 words:\n    ";
    std::string word;
    for (int i = 0; i < 5 && in >> word; ++i) {
        std::cout << std::format("[{}] ", word);
    }
    std::cout << '\n';
    // operator>> skips whitespace and reads one token.
    // This is why "Line 1:" becomes two tokens: "Line" and "1:".
}

// -----------------------------------------------
// 3. Appending to a file
// -----------------------------------------------
void demo_file_appending() {
    std::cout << "\n--- 3. Appending to a file ---\n";

    // std::ios::app positions the write pointer at the end
    std::ofstream out(DEMO_FILE, std::ios::app);
    if (!out) {
        std::cerr << "  ERROR: Could not open for appending\n";
        return;
    }
    out << "Line 5: This line was appended!\n";
    std::cout << "  Appended one line.\n";

    // Other useful open modes:
    //   std::ios::trunc  — truncate file to zero length (default for ofstream)
    //   std::ios::app    — append to end (write pointer always at end)
    //   std::ios::ate    — open and seek to end (but you can seek back)
    //   std::ios::binary — binary mode (no newline translation)
    //   std::ios::in     — open for reading (default for ifstream)
    //   std::ios::out    — open for writing (default for ofstream)
    //
    // Modes can be combined with |:
    //   std::fstream both("file.dat", std::ios::in | std::ios::out);
}

// -----------------------------------------------
// 4. Structured data: writing and reading CSV
// -----------------------------------------------
void demo_csv_io() {
    std::cout << "\n--- 4. CSV reading and writing ---\n";

    // --- Write CSV ---
    {
        std::ofstream csv(CSV_FILE);
        csv << "name,age,score\n";
        csv << "Alice,30,95.5\n";
        csv << "Bob,25,88.0\n";
        csv << "Charlie,35,92.3\n";
    }
    std::cout << "  Wrote " << CSV_FILE << '\n';

    // --- Read CSV ---
    std::ifstream csv(CSV_FILE);
    std::string header;
    std::getline(csv, header);  // Skip header line
    std::cout << std::format("  Header: {}\n", header);

    std::string name;
    int age;
    double score;
    char comma;  // To consume the comma separators

    std::cout << "  Data:\n";
    std::string data_line;
    while (std::getline(csv, data_line)) {
        // Parse each line with a stringstream
        std::istringstream line_stream(data_line);
        std::getline(line_stream, name, ',');     // Read until comma
        line_stream >> age >> comma >> score;       // Read int, skip comma, read double
        std::cout << std::format("    {} (age {}): {:.1f}\n", name, age, score);
    }
    // Why use istringstream for CSV?
    // Because getline(stream, str, ',') reads until a delimiter,
    // which handles fields containing spaces. operator>> stops at
    // whitespace, which would break on "New York,30,95.5".
}

// -----------------------------------------------
// 5. std::stringstream — in-memory stream
// -----------------------------------------------
void demo_stringstream() {
    std::cout << "\n--- 5. std::stringstream ---\n";

    // --- 5a. Building a string (like cout but to a string) ---
    std::ostringstream oss;
    oss << "The answer is " << 42 << " and pi is " << 3.14;
    std::string result = oss.str();
    std::cout << std::format("  Built string: \"{}\"\n", result);
    // Note: with C++20 std::format, you often don't need ostringstream
    // for formatting. But it's still useful when you need to build
    // strings incrementally across function calls.

    // --- 5b. Parsing a string (like cin but from a string) ---
    std::string input = "100 200 300 400 500";
    std::istringstream iss(input);
    std::vector<int> numbers;
    int num;
    while (iss >> num) {
        numbers.push_back(num);
    }
    std::cout << "  Parsed numbers: ";
    for (int n : numbers) std::cout << n << ' ';
    std::cout << '\n';

    // --- 5c. Type conversion with stringstream ---
    std::string text_number = "3.14159";
    std::istringstream converter(text_number);
    double value;
    converter >> value;
    std::cout << std::format("  Converted string \"{}\" to double: {:.5f}\n",
                              text_number, value);
    // Modern alternative: std::stod("3.14159") or std::from_chars
    // But stringstream works for any type that has operator>>.
}

// -----------------------------------------------
// 6. Error handling with streams
// -----------------------------------------------
void demo_error_handling() {
    std::cout << "\n--- 6. Stream error handling ---\n";

    // --- 6a. Failed open ---
    std::ifstream bad_file("nonexistent_file_xyz.txt");
    if (!bad_file) {
        std::cout << "  Could not open nonexistent file (expected)\n";
    }

    // --- 6b. Parse failure ---
    std::istringstream iss("hello 42 world");
    int value;
    iss >> value;  // Tries to read "hello" as int — fails

    if (iss.fail()) {
        std::cout << "  Parse failed: \"hello\" is not an integer (expected)\n";
        iss.clear();       // Clear the fail flag
        std::string word;
        iss >> word;       // Now read "hello" as a string
        iss >> value;      // Now read 42 as an int
        std::cout << std::format("  After recovery: word=\"{}\", value={}\n", word, value);
    }

    // --- 6c. Exception-based error handling ---
    std::cout << "\n  Exception-based error handling:\n";
    try {
        std::ifstream strict("nonexistent_file_xyz.txt");
        strict.exceptions(std::ios::failbit);  // Throw on fail
        // The file didn't open, so failbit is already set.
        // Setting exceptions() retroactively checks the current state
        // and throws immediately if any flagged bits are set.
    } catch (const std::ios_base::failure& e) {
        std::cout << std::format("    Caught ios_base::failure: {}\n", e.what());
    }
}

// -----------------------------------------------
// 7. Binary I/O
// -----------------------------------------------
void demo_binary_io() {
    std::cout << "\n--- 7. Binary I/O ---\n";

    struct Record {
        int id;
        double value;
        char label[16];
    };

    // --- Write binary ---
    const std::string bin_file = "demo_binary.bin";
    {
        std::ofstream out(bin_file, std::ios::binary);
        Record records[] = {
            {1, 3.14, "alpha"},
            {2, 2.72, "beta"},
            {3, 1.41, "gamma"}
        };
        // write() takes a const char* and a byte count
        // reinterpret_cast is needed because write() expects char*,
        // not Record* — we're writing raw bytes
        out.write(reinterpret_cast<const char*>(records), sizeof(records));
    }
    std::cout << "  Wrote 3 binary records\n";

    // --- Read binary ---
    {
        std::ifstream in(bin_file, std::ios::binary);
        Record rec;
        std::cout << "  Reading back:\n";
        while (in.read(reinterpret_cast<char*>(&rec), sizeof(Record))) {
            std::cout << std::format("    id={}, value={:.2f}, label=\"{}\"\n",
                                      rec.id, rec.value, rec.label);
        }
    }

    // Watch out: binary I/O is NOT portable across:
    //   - Different architectures (endianness: big vs little)
    //   - Different compilers (struct padding/alignment)
    //   - Different platforms (sizeof(int) may differ)
    // For portable serialization, use a format like JSON, Protocol
    // Buffers, or MessagePack. Binary I/O is fine for temporary
    // files, caches, or single-platform applications.

    // Cleanup
    std::filesystem::remove(bin_file);
}

// =========================================
// Key Takeaways:
//   1. Streams are RAII — the destructor closes the file. No leaks.
//   2. Always check if a file opened: if (!file) { handle error; }
//   3. Use std::getline for lines, >> for tokens, read()/write() for binary.
//   4. std::stringstream parses strings like cin and builds strings like cout.
//   5. Prefer '\n' over std::endl in loops (endl forces a flush every time).
//   6. Use std::ios::binary for non-text data to avoid newline translation.
//   7. Stream state is "sticky" — after a failure, clear() before retrying.
// =========================================

int main() {
    demo_file_writing();
    demo_file_reading();
    demo_file_appending();
    demo_csv_io();
    demo_stringstream();
    demo_error_handling();
    demo_binary_io();

    // Cleanup demo files
    std::filesystem::remove(DEMO_FILE);
    std::filesystem::remove(CSV_FILE);
    std::cout << "\n(Cleaned up demo files)\n";

    return 0;
}
