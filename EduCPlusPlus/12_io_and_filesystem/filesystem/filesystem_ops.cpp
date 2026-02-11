/**
 * filesystem_ops.cpp - The std::filesystem Library (C++17)
 *
 * Before C++17, there was no portable way to work with files and
 * directories. You had to use platform-specific APIs (WinAPI on
 * Windows, POSIX on Linux/macOS) or third-party libraries like Boost.
 * std::filesystem (based on Boost.Filesystem) gives C++ a standard,
 * cross-platform API for file system operations.
 *
 * Key abstractions:
 *   std::filesystem::path        — a file or directory path
 *   std::filesystem::directory_entry — metadata about one entry
 *   std::filesystem::directory_iterator — iterate a directory
 *   std::filesystem::recursive_directory_iterator — iterate recursively
 *
 * The namespace is long, so most code uses an alias:
 *   namespace fs = std::filesystem;
 *
 * Prerequisites: Basic I/O, RAII, exception handling.
 * Reference:     reference/en/cpp/filesystem.html
 *
 * LINKING NOTE: On some compilers (GCC < 9), you may need -lstdc++fs.
 *               Modern GCC, Clang, and MSVC include it automatically.
 */

#include <iostream>
#include <format>
#include <filesystem>
#include <fstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

// =====================================================
// FREQUENTLY ASKED QUESTIONS (first-timer Q&A)
// =====================================================
//
// Q: What IS a "path"? Is it a string?
// A: fs::path is a class that represents a file system path. It stores
//    the path internally (in a platform-appropriate format) and provides
//    methods to extract components: filename, extension, parent, stem.
//    It implicitly converts to/from std::string, but it's NOT just a
//    string — it understands path separators, roots, and extensions.
//
// Q: Forward slash or backslash?
// A: Use forward slashes ("/") everywhere. fs::path handles the
//    conversion to the platform's native separator automatically.
//    On Windows, both "/" and "\\" work in fs::path. Writing
//    "C:/Users/name" is portable; "C:\\Users\\name" is Windows-only.
//
// Q: Do these operations throw exceptions?
// A: By default, YES. Most functions have two overloads:
//    1. fs::copy_file(src, dst);                  — throws on error
//    2. fs::copy_file(src, dst, error_code);       — sets error_code instead
//    Use the error_code overload when failure is expected (e.g., checking
//    if a file exists before deleting it). Use the throwing overload when
//    failure is unexpected and should propagate.
//
// Q: Is std::filesystem thread-safe?
// A: Individual operations are atomic in the file system sense (the OS
//    ensures each operation completes), but there's no protection against
//    TOCTOU (Time-Of-Check-Time-Of-Use) races. If you check exists()
//    then create_directory(), another process could create it in between.
//    This is a fundamental limitation of file systems, not of C++.
//
// Q: What's the difference between "path" and "canonical path"?
// A: A path like "../foo/./bar" contains relative components (.. and .).
//    A canonical path is absolute and has all symlinks, ".", and ".."
//    resolved. fs::canonical() returns the canonical form but requires
//    the path to exist. fs::weakly_canonical() resolves what it can
//    without requiring existence.
//
// Q: How do I get the current working directory?
// A: fs::current_path() returns it. You can also SET it:
//    fs::current_path("/some/dir"); But changing the CWD affects the
//    entire process, so be cautious in multithreaded programs.
// =====================================================

// =====================================================
// HOW fs::path STORES AND MANIPULATES PATHS
//
// Internally, fs::path stores the path in the OS's preferred format:
//   - Windows: std::wstring (wide characters, UTF-16)
//   - POSIX:   std::string  (narrow characters, typically UTF-8)
//
// The path is decomposed into components:
//
//   fs::path p = "/home/user/docs/report.txt";
//
//   p.root_name()      →  ""               (or "C:" on Windows)
//   p.root_directory()  →  "/"
//   p.root_path()       →  "/"              (root_name + root_directory)
//   p.relative_path()   →  "home/user/docs/report.txt"
//   p.parent_path()     →  "/home/user/docs"
//   p.filename()        →  "report.txt"
//   p.stem()            →  "report"         (filename without extension)
//   p.extension()       →  ".txt"           (including the dot)
//
// Path concatenation:
//   p / "subdir"       →  "/home/user/docs/report.txt/subdir"
//   operator/ is overloaded to join paths with the platform separator.
//
//   p.replace_extension(".pdf")  →  "/home/user/docs/report.pdf"
//   p.replace_filename("notes.md") → "/home/user/docs/notes.md"
// =====================================================

// -----------------------------------------------
// 1. Path manipulation
// -----------------------------------------------
void demo_paths() {
    std::cout << "=== 1. Path manipulation ===\n\n";

    fs::path p = "C:/Users/student/projects/main.cpp";
    // On Windows this could also be "C:\\Users\\student\\projects\\main.cpp"
    // fs::path normalizes both forms.

    std::cout << std::format("  Full path:     {}\n", p.string());
    std::cout << std::format("  Root name:     {}\n", p.root_name().string());
    std::cout << std::format("  Root dir:      {}\n", p.root_directory().string());
    std::cout << std::format("  Parent:        {}\n", p.parent_path().string());
    std::cout << std::format("  Filename:      {}\n", p.filename().string());
    std::cout << std::format("  Stem:          {}\n", p.stem().string());
    std::cout << std::format("  Extension:     {}\n", p.extension().string());

    // --- Building paths with / operator ---
    fs::path base = "C:/Projects";
    fs::path full = base / "MyApp" / "src" / "main.cpp";
    std::cout << std::format("\n  Built path:    {}\n", full.string());
    // operator/ adds the correct separator for the platform.
    // NEVER manually concatenate with + and hardcoded separators.

    // --- Modifying paths ---
    fs::path doc = "report.txt";
    doc.replace_extension(".pdf");
    std::cout << std::format("  After replace_extension: {}\n", doc.string());

    // --- Checking path properties ---
    fs::path abs = "C:/absolute/path";
    fs::path rel = "relative/path";
    std::cout << std::format("\n  \"{}\" is absolute? {}\n",
                              abs.string(), abs.is_absolute());
    std::cout << std::format("  \"{}\" is relative? {}\n",
                              rel.string(), rel.is_relative());
}

// -----------------------------------------------
// 2. Checking existence and file types
// -----------------------------------------------
void demo_existence_checks() {
    std::cout << "\n=== 2. Existence and type checks ===\n\n";

    // Check the current directory
    fs::path cwd = fs::current_path();
    std::cout << std::format("  Current directory: {}\n", cwd.string());

    // Check various properties
    std::cout << std::format("  Exists?        {}\n", fs::exists(cwd));
    std::cout << std::format("  Is directory?  {}\n", fs::is_directory(cwd));
    std::cout << std::format("  Is file?       {}\n", fs::is_regular_file(cwd));

    // Check a file that probably doesn't exist (using error_code overload)
    fs::path fake = "this_file_does_not_exist_xyz.tmp";
    std::error_code ec;
    bool exists = fs::exists(fake, ec);
    std::cout << std::format("  \"{}\" exists? {} (no exception thrown)\n",
                              fake.string(), exists);
    // The error_code overload is safer when checking — it won't throw
    // if the path is invalid or permissions are denied.
}

// -----------------------------------------------
// 3. Creating and removing directories
// -----------------------------------------------
void demo_directory_operations() {
    std::cout << "\n=== 3. Directory operations ===\n\n";

    fs::path demo_dir = "demo_filesystem_test";
    fs::path nested = demo_dir / "level1" / "level2" / "level3";

    // --- Create nested directories ---
    // create_directory: creates ONE directory (parent must exist)
    // create_directories: creates ALL missing directories in the path
    fs::create_directories(nested);
    std::cout << std::format("  Created: {}\n", nested.string());

    // Create a file inside the nested directory
    {
        std::ofstream(nested / "test.txt") << "Hello from nested dir!\n";
    }

    // --- List directory contents ---
    std::cout << "\n  Contents of demo_filesystem_test (recursive):\n";
    for (const auto& entry : fs::recursive_directory_iterator(demo_dir)) {
        // entry.path() gives the full path
        // entry.is_directory() / entry.is_regular_file() check the type
        std::string type = entry.is_directory() ? "[DIR]" : "[FILE]";
        // Calculate depth by counting how deep we are relative to demo_dir
        auto rel = fs::relative(entry.path(), demo_dir);
        std::cout << std::format("    {} {}\n", type, rel.string());
    }

    // --- Remove everything ---
    // remove: deletes ONE file or EMPTY directory
    // remove_all: deletes a directory and ALL its contents (like rm -rf)
    auto removed = fs::remove_all(demo_dir);
    std::cout << std::format("\n  Removed {} items\n", removed);

    // Watch out: remove_all is DANGEROUS — it's the C++ equivalent
    // of rm -rf. Always double-check the path before calling it.
    // Consider using remove() in a loop with logging for safety.
}

// -----------------------------------------------
// 4. Copying and renaming files
// -----------------------------------------------
void demo_copy_rename() {
    std::cout << "\n=== 4. Copy and rename ===\n\n";

    // Create a source file
    fs::path src = "demo_source.txt";
    { std::ofstream(src) << "Original content\n"; }

    // --- Copy a file ---
    fs::path dst = "demo_copy.txt";
    fs::copy_file(src, dst, fs::copy_options::overwrite_existing);
    // copy_options::overwrite_existing allows overwriting.
    // Without it, copying to an existing file throws.
    // Other options:
    //   skip_existing     — silently skip if destination exists
    //   update_existing   — overwrite only if source is newer
    std::cout << std::format("  Copied {} -> {}\n", src.string(), dst.string());

    // --- Rename (move) a file ---
    fs::path renamed = "demo_renamed.txt";
    fs::rename(dst, renamed);
    std::cout << std::format("  Renamed {} -> {}\n", dst.string(), renamed.string());
    // rename() works for both files and directories.
    // It can also MOVE files across directories on the same filesystem.
    // Moving across filesystems may fail — use copy + remove instead.

    // --- File size ---
    auto size = fs::file_size(src);
    std::cout << std::format("  Size of {}: {} bytes\n", src.string(), size);

    // --- Last write time ---
    auto time = fs::last_write_time(src);
    // Converting file_time to readable format is complex pre-C++20.
    // We'll just show that we can retrieve it.
    std::cout << "  Last write time retrieved successfully\n";

    // Cleanup
    fs::remove(src);
    fs::remove(renamed);
}

// -----------------------------------------------
// 5. Iterating directories
// -----------------------------------------------
void demo_directory_iteration() {
    std::cout << "\n=== 5. Directory iteration ===\n\n";

    // List the current directory (non-recursive)
    std::cout << "  Files in current directory (first 10):\n";
    int count = 0;
    for (const auto& entry : fs::directory_iterator(fs::current_path())) {
        if (++count > 10) {
            std::cout << "    ... (truncated)\n";
            break;
        }
        std::string type;
        if (entry.is_directory())    type = "[DIR] ";
        else if (entry.is_regular_file()) type = "[FILE]";
        else                         type = "[????]";

        std::cout << std::format("    {} {}\n", type,
                                  entry.path().filename().string());
    }

    // --- Filtering by extension ---
    // There's no built-in filter — use a simple if statement
    std::cout << "\n  .cpp files in current directory:\n";
    for (const auto& entry : fs::directory_iterator(fs::current_path())) {
        if (entry.is_regular_file() && entry.path().extension() == ".cpp") {
            std::cout << std::format("    {}\n", entry.path().filename().string());
        }
    }
    // For recursive search, use fs::recursive_directory_iterator instead.
}

// -----------------------------------------------
// 6. Space information
// -----------------------------------------------
void demo_space_info() {
    std::cout << "\n=== 6. Disk space information ===\n\n";

    auto info = fs::space(fs::current_path());

    // space_info contains:
    //   capacity  — total size of the filesystem
    //   free      — free space (including reserved for root)
    //   available — free space available to non-privileged users

    auto to_gb = [](std::uintmax_t bytes) {
        return static_cast<double>(bytes) / (1024.0 * 1024.0 * 1024.0);
    };

    std::cout << std::format("  Capacity:  {:.1f} GB\n", to_gb(info.capacity));
    std::cout << std::format("  Free:      {:.1f} GB\n", to_gb(info.free));
    std::cout << std::format("  Available: {:.1f} GB\n", to_gb(info.available));
}

// -----------------------------------------------
// 7. Temporary directory and path utilities
// -----------------------------------------------
void demo_temp_and_utils() {
    std::cout << "\n=== 7. Temp directory and utilities ===\n\n";

    // --- Temporary directory ---
    fs::path temp = fs::temp_directory_path();
    std::cout << std::format("  Temp directory: {}\n", temp.string());

    // --- Absolute and canonical paths ---
    fs::path relative = ".";
    fs::path absolute = fs::absolute(relative);
    fs::path canonical = fs::canonical(relative);
    // canonical() resolves symlinks and ".." — requires the path to exist
    // absolute() just prepends the CWD — doesn't resolve symlinks

    std::cout << std::format("  Relative:  {}\n", relative.string());
    std::cout << std::format("  Absolute:  {}\n", absolute.string());
    std::cout << std::format("  Canonical: {}\n", canonical.string());

    // --- Relative path between two paths ---
    fs::path from = "C:/Users/student";
    fs::path to   = "C:/Users/student/projects/app";
    fs::path rel  = fs::relative(to, from);
    std::cout << std::format("\n  Relative path from {} to {}:\n    {}\n",
                              from.string(), to.string(), rel.string());
}

// =========================================
// Key Takeaways:
//   1. namespace fs = std::filesystem; — always alias the namespace.
//   2. fs::path handles separators portably. Use / to join paths.
//   3. Most functions have a throwing and an error_code overload.
//   4. Use create_directories() (plural) for nested paths.
//   5. remove_all() is recursive and dangerous — double-check paths.
//   6. directory_iterator is non-recursive; recursive_directory_iterator
//      traverses subdirectories.
//   7. File system operations are subject to TOCTOU races — checking
//      exists() then acting is never fully safe in concurrent programs.
// =========================================

int main() {
    demo_paths();
    demo_existence_checks();
    demo_directory_operations();
    demo_copy_rename();
    demo_directory_iteration();
    demo_space_info();
    demo_temp_and_utils();

    return 0;
}
