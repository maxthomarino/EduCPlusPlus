import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: 224,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does the `pwd` command do?",
    options: [
      "Lists the contents of the current directory recursively",
      "Prints the absolute path of the current working directory",
      "Changes to the previous working directory in the shell",
      "Prints the current user's password from the shadow file",
    ],
    correctIndex: 1,
    explanation:
      "pwd stands for 'print working directory.' It outputs the full absolute path of the directory you are currently in, e.g., /home/user/projects. This is useful for confirming your location in the filesystem before running other commands.",
    link: "https://man7.org/linux/man-pages/man1/pwd.1.html",
  },
  {
    id: 225,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `ls -a` show that `ls` alone does not?",
    options: [
      "Files sorted by their most recent modification time first",
      "Only directories in the listing, excluding regular files",
      "File sizes displayed in a human-readable format like KB or MB",
      "Hidden files and directories",
    ],
    correctIndex: 3,
    explanation:
      "The -a (all) flag causes ls to include entries whose names begin with a dot (.), which are hidden by default on Unix systems. This includes files like .bashrc, .gitignore, and the special entries . (current directory) and .. (parent directory).",
    link: "https://man7.org/linux/man-pages/man1/ls.1.html",
  },
  {
    id: 226,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `cd -` do?",
    options: [
      "Prints the current directory and stays there",
      "Changes to the root directory",
      "Changes back to the previous working directory",
      "Changes to the home directory",
    ],
    correctIndex: 2,
    explanation:
      "cd - switches to the previous working directory (stored in the $OLDPWD variable) and prints its path. This is a convenient shortcut for toggling between two directories without typing full paths.",
    link: "https://man7.org/linux/man-pages/man1/cd.1p.html",
  },
  {
    id: 227,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does the `cat` command do?",
    options: [
      "Creates a new empty file at the specified path on disk",
      "Changes the access and modification permissions on a file",
      "Compiles and translates source code into machine instructions",
      "Concatenates files and prints their contents to standard output",
    ],
    correctIndex: 3,
    explanation:
      "cat is short for 'concatenate.' When given one file, it prints that file's contents to stdout. When given multiple files, it concatenates them in order. It is one of the most commonly used commands for quickly viewing file contents.",
    link: "https://man7.org/linux/man-pages/man1/cat.1.html",
  },
  {
    id: 228,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What is the difference between `cp` and `mv`?",
    options: [
      "There is no difference",
      "cp works only on regular files; mv works exclusively on directories and cannot move individual files",
      "mv creates a symbolic link at the destination; cp creates a hard link pointing to the same inode",
      "cp copies files; mv moves or renames files",
    ],
    correctIndex: 3,
    explanation:
      "cp creates a duplicate of the file at the destination while leaving the source intact. mv relocates the file (or renames it if the destination is in the same directory). Within the same filesystem, mv is nearly instant because it only updates directory entries rather than copying data.",
    link: "https://man7.org/linux/man-pages/man1/cp.1.html",
  },
  {
    id: 229,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does `rm -r` do, and why should it be used with caution?",
    options: [
      "Removes only empty directories, failing with an error if any files remain inside the target path",
      "Recursively removes a directory and all of its contents",
      "Moves files to a hidden trash folder for later recovery, similar to the desktop recycle bin",
      "Removes a single file and always prompts for confirmation before each deletion regardless of flags",
    ],
    correctIndex: 1,
    explanation:
      "The -r (recursive) flag tells rm to descend into directories and delete everything inside them. Unlike GUI file managers, rm does not use a trash can -- deleted files are gone immediately. Combining -r with -f (force) skips all confirmation prompts, which is especially dangerous.",
    link: "https://man7.org/linux/man-pages/man1/rm.1.html",
  },
  {
    id: 230,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does `mkdir -p path/to/dir` do that `mkdir path/to/dir` does not?",
    options: [
      "Creates a symbolic link pointing to the path instead of making a real directory on the filesystem",
      "Creates all intermediate (parent) directories as needed, and does not error if the directory already exists",
      "Creates a hidden directory by automatically prefixing the name with a dot character on Unix systems",
      "Creates the directory with special elevated permissions that override the default umask settings",
    ],
    correctIndex: 1,
    explanation:
      "Without -p, mkdir fails if any parent directory in the path does not exist. The -p (parents) flag creates the entire path of directories as needed and silently succeeds if the target directory already exists. This is commonly used in build scripts and Makefiles.",
    link: "https://man7.org/linux/man-pages/man1/mkdir.1.html",
  },
  {
    id: 231,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `touch myfile.txt` do if the file does not exist?",
    options: [
      "Prints an error because the file was not found",
      "Creates a directory named myfile.txt",
      "Creates a new empty file named myfile.txt",
      "Opens the file in a text editor",
    ],
    correctIndex: 2,
    explanation:
      "touch creates an empty file if it does not exist. If the file already exists, touch updates its access and modification timestamps without changing its contents. This dual behavior makes it useful for both creating placeholder files and updating timestamps.",
    link: "https://man7.org/linux/man-pages/man1/touch.1.html",
  },
  {
    id: 232,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `head -n 20 file.txt` display?",
    options: [
      "The last 20 lines of file.txt",
      "20 random lines from file.txt",
      "The first 20 lines of file.txt",
      "Every 20th line of file.txt",
    ],
    correctIndex: 2,
    explanation:
      "head outputs the first part of a file. The -n flag specifies the number of lines to display (default is 10). Its counterpart, tail, displays the last N lines. Together they are useful for quickly inspecting the beginning or end of log files and data files.",
    link: "https://man7.org/linux/man-pages/man1/head.1.html",
  },
  {
    id: 233,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does the `man` command do?",
    options: [
      "Manages installed software packages on the current system",
      "Creates a new user account with default configuration",
      "Displays the manual page for a given command",
      "Compiles a C program from source into an executable file",
    ],
    correctIndex: 2,
    explanation:
      "man (manual) is the built-in documentation system for Unix. Running 'man ls' shows the full documentation for the ls command, including all flags and examples. Man pages are organized into sections (1 for user commands, 2 for system calls, 3 for library functions, etc.).",
    link: "https://man7.org/linux/man-pages/man1/man.1.html",
  },
  {
    id: 234,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does `echo $HOME` print?",
    options: [
      "The contents of a file that is named HOME",
      "The path to the current user's home directory",
      "The literal string '$HOME' without expansion",
      "The hostname of the machine on the network",
    ],
    correctIndex: 1,
    explanation:
      "echo prints its arguments to stdout. When an argument contains $VARIABLE, the shell expands it to the variable's value before echo sees it. $HOME is a standard environment variable containing the current user's home directory path (e.g., /home/alice). To print the literal string '$HOME', use single quotes: echo '$HOME'.",
    link: "https://man7.org/linux/man-pages/man1/echo.1.html",
  },
  {
    id: 235,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `which python3` output?",
    options: [
      "A list of all files named python3 found on the system",
      "The process ID of any currently running python3 instance",
      "The version number of the python3 installation",
      "The full path to the python3 executable that would be run",
    ],
    correctIndex: 3,
    explanation:
      "which searches the directories listed in the $PATH environment variable and prints the full path to the first matching executable. This helps you determine which installation of a program will run when you type its name, which is especially useful when multiple versions are installed.",
    link: "https://man7.org/linux/man-pages/man1/which.1.html",
  },
  {
    id: 236,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What does the pipe operator `|` do?",
    options: [
      "Compares the output of two commands and prints the lines that differ between them",
      "Connects the standard output of one command to the standard input of the next command",
      "Writes the output of a command to a file, overwriting any existing contents",
      "Runs two commands simultaneously in the background as independent parallel processes",
    ],
    correctIndex: 1,
    explanation:
      "The pipe (|) takes the stdout of the command on its left and feeds it as stdin to the command on its right. For example, 'ls -l | grep .txt' passes the directory listing through grep to filter for lines containing '.txt'. Pipes are the foundation of the Unix philosophy of composing small tools.",
    link: "https://man7.org/linux/man-pages/man1/bash.1.html",
  },
  {
    id: 237,
    difficulty: "Easy",
    topic: "Linux Commands",
    question:
      "What is the difference between `>` and `>>` when redirecting output?",
    options: [
      "There is no difference",
      "> appends to a file; >> overwrites the file with new content",
      "> redirects stderr to a file; >> redirects stdout to a file",
      "> overwrites (truncates) the file; >> appends to the end of the file",
    ],
    correctIndex: 3,
    explanation:
      "> creates the file if it doesn't exist and overwrites it if it does (truncating its contents to zero first). >> also creates the file if needed, but appends new output to the end without erasing existing contents. Use >> for log files where you want to accumulate output over time.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Redirections",
  },
  {
    id: 238,
    difficulty: "Easy",
    topic: "Linux Commands",
    question: "What does `tail -f /var/log/syslog` do?",
    options: [
      "Prints the first 10 lines of the log file starting from the beginning and then exits immediately",
      "Prints the last 10 lines of the log file to standard output and then exits immediately",
      "Deletes the last 10 lines of the log file and writes the remaining content back to disk",
      "Prints the last 10 lines and then continues to output new lines as they are appended to the file in real time",
    ],
    correctIndex: 3,
    explanation:
      "The -f (follow) flag causes tail to keep running after displaying the last lines, watching the file for new data and printing it as it arrives. This is the standard way to monitor log files in real time. Press Ctrl+C to stop following.",
    link: "https://man7.org/linux/man-pages/man1/tail.1.html",
  },
  {
    id: 239,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `chmod 755 script.sh` do?",
    options: [
      "Makes the file hidden from all users except root by setting the system hidden attribute on the inode",
      "Changes the file's owner to the user with numeric ID 755, transferring all ownership privileges",
      "Sets the file to read-only for everyone, preventing any user from writing to or executing it",
      "Gives the owner read/write/execute, and group and others read/execute",
    ],
    correctIndex: 3,
    explanation:
      "Octal permissions use three digits (owner, group, others). Each digit is the sum of read (4), write (2), and execute (1). So 7 = rwx, 5 = r-x. 755 means the owner can do anything, while group members and others can read and execute but not modify the file. This is the standard permission for scripts and executables.",
    link: "https://man7.org/linux/man-pages/man1/chmod.1.html",
  },
  {
    id: 240,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `chmod +x script.sh` do, and how does it differ from setting octal permissions?",
    options: [
      "It sets the permissions to exactly 111, removing all read and write permissions from every user category",
      "It only works on files owned by root, and silently does nothing if the current user lacks superuser privileges to modify permissions",
      "It adds execute permission for all users using symbolic notation, modifying only the execute bit and leaving other permissions unchanged",
      "It removes the execute permission from all users, making the file non-executable while preserving read and write bits",
    ],
    correctIndex: 2,
    explanation:
      "Symbolic notation (u/g/o/a and +/-/=) modifies specific permission bits without affecting others. 'chmod +x' is shorthand for 'chmod a+x', adding execute for everyone. In contrast, octal notation (like 755) sets all nine permission bits at once. Symbolic notation is safer when you only want to change one bit.",
    link: "https://man7.org/linux/man-pages/man1/chmod.1.html",
  },
  {
    id: 241,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `grep -rn 'TODO' src/` do?",
    options: [
      "Replaces every occurrence of 'TODO' with an empty string in all files under src/, performing an in-place substitution",
      "Deletes all lines containing 'TODO' from every file under src/, modifying the files in place without creating backups",
      "Counts the total number of files in src/ that contain at least one 'TODO' match and prints only the final count",
      "Recursively searches all files under src/ for the pattern 'TODO' and prints matching lines with their file name and line number",
    ],
    correctIndex: 3,
    explanation:
      "grep searches files for lines matching a pattern. The -r flag makes it recursive (descending into directories), and -n prepends each match with its line number. Combined with the path argument src/, this searches every file in the source tree -- a very common workflow for finding code annotations.",
    link: "https://man7.org/linux/man-pages/man1/grep.1.html",
  },
  {
    id: 242,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `2>/dev/null` do when appended to a command?",
    options: [
      "Redirects standard error to /dev/null, discarding error messages",
      "Redirects both stdout and stderr together to /dev/null, silencing all output",
      "Redirects standard output to /dev/null, suppressing all normal program output entirely",
      "Sends the number 2 as input data to /dev/null, which discards it silently",
    ],
    correctIndex: 0,
    explanation:
      "File descriptor 2 is stderr. The redirection 2>/dev/null sends all error output to /dev/null (a special file that discards everything written to it). This is useful when you expect some errors and don't want them cluttering your output. To discard both stdout and stderr, use &>/dev/null or >/dev/null 2>&1.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Redirections",
  },
  {
    id: 243,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `wc -l file.txt` output?",
    options: [
      "The number of characters in file.txt",
      "The number of words in file.txt",
      "The number of lines in file.txt",
      "The file size in bytes",
    ],
    correctIndex: 2,
    explanation:
      "wc (word count) counts lines, words, and bytes. The -l flag restricts output to just the line count. This is frequently used in pipelines: for example, 'git log --oneline | wc -l' counts the total number of commits.",
    link: "https://man7.org/linux/man-pages/man1/wc.1.html",
  },
  {
    id: 244,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `sort file.txt | uniq` do, and why must the input be sorted first?",
    options: [
      "Sorts the file numerically by treating each line as an integer value, then prints only the unique values found",
      "Sorts the file alphabetically, then removes adjacent duplicate lines",
      "Removes all duplicate lines from the file without requiring the input to be sorted first, checking the entire file at once",
      "Sorts the file alphabetically and then removes all lines from the output entirely, leaving it completely empty",
    ],
    correctIndex: 1,
    explanation:
      "uniq filters out consecutive identical lines. If duplicates are scattered throughout the file, uniq misses them because it only compares adjacent lines. Sorting first groups identical lines together, making uniq effective. Alternatively, 'sort -u' combines both operations in one step.",
    link: "https://man7.org/linux/man-pages/man1/uniq.1.html",
  },
  {
    id: 245,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `cut -d',' -f2 data.csv` do?",
    options: [
      "Extracts the second field from each line, using comma as the delimiter",
      "Cuts the file into two equal halves and outputs the second part only",
      "Replaces all commas with spaces in the file and then prints field 2",
      "Removes the second column from the CSV file and prints the remaining data",
    ],
    correctIndex: 0,
    explanation:
      "cut extracts sections from each line of input. -d sets the field delimiter (comma here, tab by default) and -f selects which fields to print. 'cut -d',' -f2' is a quick way to extract a single column from a CSV without a full CSV parser -- though it doesn't handle quoted fields containing commas.",
    link: "https://man7.org/linux/man-pages/man1/cut.1.html",
  },
  {
    id: 246,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `ps aux` show?",
    options: [
      "Only the processes owned by the current user, excluding system daemons and other users' processes",
      "A live-updating view of all processes sorted by CPU usage that refreshes automatically every few seconds",
      "Only background processes started by the current shell session, excluding foreground and system processes",
      "A snapshot of all running processes on the system, with columns for user, PID, CPU%, memory%, and the command",
    ],
    correctIndex: 3,
    explanation:
      "ps aux shows a snapshot of every process running on the system. 'a' shows processes from all users, 'u' adds the user/owner column and memory/CPU stats, and 'x' includes processes not attached to a terminal. For a live-updating view, use top or htop instead.",
    link: "https://man7.org/linux/man-pages/man1/ps.1.html",
  },
  {
    id: 247,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `tee` do in a pipeline like `make 2>&1 | tee build.log`?",
    options: [
      "It splits the input into two separate files based on line count, creating two equally-sized output files",
      "It compresses the output using gzip before writing to the file, reducing disk space usage for large outputs",
      "It filters out duplicate lines before writing them to the output, similar to how the uniq command operates",
      "It reads from stdin and writes to both stdout and the specified file, allowing you to see output on screen while also saving it",
    ],
    correctIndex: 3,
    explanation:
      "tee copies its stdin to both stdout and one or more files simultaneously -- like a T-shaped pipe splitter. This lets you watch command output in real time while also capturing it to a log file. Use 'tee -a' to append to the file instead of overwriting.",
    link: "https://man7.org/linux/man-pages/man1/tee.1.html",
  },
  {
    id: 248,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does the `$PATH` environment variable control?",
    options: [
      "A colon-separated list of directories the shell searches, in order, to find executables when you type a command name",
      "The location where downloaded files are saved by default when using tools like curl or wget",
      "The current working directory that the shell uses as the default location for all file operations",
      "The path to the user's home directory, which is also the default destination for the cd command",
    ],
    correctIndex: 0,
    explanation:
      "When you type a command like 'python3', the shell searches each directory listed in $PATH from left to right until it finds an executable with that name. This is why installing a program means either placing it in a $PATH directory (like /usr/local/bin) or adding its directory to $PATH. You can see the current value with 'echo $PATH'.",
    link: "https://man7.org/linux/man-pages/man7/environ.7.html",
  },
  {
    id: 249,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `tar -czf archive.tar.gz mydir/` do?",
    options: [
      "Extracts the contents of archive.tar.gz into mydir/, restoring the original directory structure and files",
      "Lists the contents of an existing tar archive without extracting any of the files to disk",
      "Creates a gzip-compressed tar archive named archive.tar.gz containing all files in mydir/",
      "Compresses mydir/ in place by replacing the directory with archive.tar.gz and deleting the original",
    ],
    correctIndex: 2,
    explanation:
      "tar bundles files into a single archive. -c creates a new archive, -z applies gzip compression, and -f specifies the output filename. To extract, use -xzf. The mnemonic 'create zip file' helps remember -czf. tar preserves file permissions, ownership, and directory structure.",
    link: "https://man7.org/linux/man-pages/man1/tar.1.html",
  },
  {
    id: 250,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `df -h` show?",
    options: [
      "A list of recently deleted files that can potentially be recovered from the filesystem",
      "The amount of free and used disk space on all mounted filesystems, in human-readable units (KB, MB, GB)",
      "The disk usage of each individual file and subdirectory in the current working directory",
      "The total number of files and directories stored on each mounted filesystem",
    ],
    correctIndex: 1,
    explanation:
      "df (disk free) reports the total, used, and available space for each mounted filesystem. The -h flag (human-readable) converts raw byte counts to KB, MB, or GB. To see how much space specific files and directories use, use 'du' instead.",
    link: "https://man7.org/linux/man-pages/man1/df.1.html",
  },
  {
    id: 251,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `du -sh *` show when run in a directory?",
    options: [
      "The total disk usage of the entire filesystem, aggregated across all mount points and partitions",
      "The disk space used by each file and subdirectory in the current directory, summarized and in human-readable format",
      "The number of inodes used by each item, showing how many filesystem entries each directory contains",
      "The access time of each file, showing when it was last read or opened by any process",
    ],
    correctIndex: 1,
    explanation:
      "du (disk usage) calculates the size of files and directories. -s (summarize) shows only the total for each argument instead of listing every file inside, and -h makes the output human-readable. 'du -sh *' is the standard way to find out which directories are consuming the most disk space.",
    link: "https://man7.org/linux/man-pages/man1/du.1.html",
  },
  {
    id: 252,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `find . -name '*.log' -mtime +30` do?",
    options: [
      "Deletes all .log files older than 30 days from the current directory and all subdirectories",
      "Finds all .log files that were created on exactly the 30th day before today, not before or after",
      "Finds all .log files under the current directory that were last modified more than 30 days ago",
      "Finds the 30 largest .log files by size under the current directory and prints their paths",
    ],
    correctIndex: 2,
    explanation:
      "find recursively searches directories matching criteria. -name '*.log' matches filenames ending in .log, and -mtime +30 matches files whose data was last modified more than 30 days ago. find only finds files -- it does not delete them unless you add -delete or -exec rm {}. This makes it safe for exploratory searches.",
    link: "https://man7.org/linux/man-pages/man1/find.1.html",
  },
  {
    id: 253,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `export MY_VAR=hello` do, and how does it differ from `MY_VAR=hello`?",
    options: [
      "export saves the variable persistently to a configuration file on disk; without export, it only exists in memory for the duration of the current session",
      "export makes the variable read-only and immutable for the shell session; without export, the variable can be freely changed or unset at any time by the user",
      "export makes the variable available to child processes; without export, the variable exists only in the current shell",
      "They are identical",
    ],
    correctIndex: 2,
    explanation:
      "Without export, a variable is a shell-local variable -- child processes don't inherit it. export marks the variable for inclusion in the environment of subsequently launched processes. This is why .bashrc uses 'export PATH=...' -- the PATH must be visible to every command the shell launches.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Bourne-Shell-Builtins",
  },
  {
    id: 254,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `curl -o output.html https://example.com` do?",
    options: [
      "Uploads the local file output.html to the server at example.com",
      "Downloads the content at the URL and saves it to a file named output.html",
      "Pings the server at the URL and prints the round-trip response time",
      "Opens the URL in the default web browser and displays the page",
    ],
    correctIndex: 1,
    explanation:
      "curl transfers data from or to a server. By default, it prints the response to stdout. The -o flag saves the output to the specified file instead. curl supports many protocols (HTTP, HTTPS, FTP, etc.) and is the standard command-line tool for interacting with web APIs. Use -O (uppercase) to save with the remote filename.",
    link: "https://man7.org/linux/man-pages/man1/curl.1.html",
  },
  {
    id: 255,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does running a command with `&` at the end (e.g., `./server &`) do?",
    options: [
      "Runs the command and automatically logs all output to a timestamped file",
      "Runs the command in the background, returning control of the terminal to the user immediately",
      "Runs the command with elevated root privileges, similar to prepending sudo",
      "Runs the command in a separate virtual terminal session detached from the current one",
    ],
    correctIndex: 1,
    explanation:
      "The & operator tells the shell to run the command as a background job. The shell prints the job number and PID, then gives you back the prompt. You can bring it to the foreground with 'fg', list background jobs with 'jobs', or send it back to the background with 'bg'. The process still has its stdout connected to the terminal unless redirected.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Lists",
  },
  {
    id: 256,
    difficulty: "Medium",
    topic: "Linux Commands",
    question:
      "What does `chown alice:developers file.txt` do?",
    options: [
      "Copies the file to alice's home directory",
      "Creates a new user named alice in the developers group",
      "Changes the file's owner to alice and its group to developers",
      "Changes the file's permissions to allow alice and the developers group to access it",
    ],
    correctIndex: 2,
    explanation:
      "chown (change owner) changes the user and/or group ownership of files. The syntax is user:group. This is commonly used after copying files between users or when deploying applications that need to run as a specific user. Changing ownership of files you don't own typically requires root privileges (sudo).",
    link: "https://man7.org/linux/man-pages/man1/chown.1.html",
  },
  {
    id: 257,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What is the difference between `cmd1 && cmd2` and `cmd1 ; cmd2`?",
    options: [
      "&& runs both commands in parallel as concurrent background jobs; semicolon runs them strictly sequentially one after another",
      "&& pipes the standard output of cmd1 into the standard input of cmd2; semicolon runs them independently without piping",
      "&& runs cmd2 only if cmd1 succeeds (exit code 0); semicolon runs cmd2 regardless of whether cmd1 succeeded or failed",
      "There is no difference",
    ],
    correctIndex: 2,
    explanation:
      "&& (logical AND) short-circuits: cmd2 executes only if cmd1 returns exit code 0 (success). This is useful for chaining dependent commands like 'make && make install'. The semicolon simply runs commands sequentially regardless of exit codes. || (logical OR) does the opposite: cmd2 runs only if cmd1 fails.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Lists",
  },
  {
    id: 258,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `find . -name '*.tmp' -exec rm {} +` do, and how does `+` differ from `\\;`?",
    options: [
      "+ only works with the rm command due to its special argument handling for multiple files; \\\\; is the general-purpose terminator that works universally with any command",
      "+ collects matching filenames and passes as many as possible to each rm invocation (batching), while \\\\; runs rm once per file found",
      "There is no difference between + and \\\\;",
      "+ runs rm in the background as a detached process for each batch of files; \\\\; runs it synchronously in the foreground, waiting for completion before proceeding to the next",
    ],
    correctIndex: 1,
    explanation:
      "With \\;, find runs the command once per matched file (e.g., 1000 files = 1000 rm invocations). With +, find groups files into batches and runs fewer rm invocations, similar to how xargs works. This reduces process creation overhead and can be orders of magnitude faster for large numbers of files.",
    link: "https://man7.org/linux/man-pages/man1/find.1.html",
  },
  {
    id: 259,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `xargs` do, and why is it used with commands like `find`?",
    options: [
      "It sets extra arguments as environment variables that are visible to the command being executed and all of its child processes, persisting across invocations",
      "It reads items from stdin and passes them as arguments to a command, converting a stream of input into command-line arguments",
      "It validates the arguments passed to a command before executing it, checking for correct types, proper formatting, and safe values to prevent runtime errors",
      "It runs a command in a clean environment with no arguments and no inherited environment variables from the parent shell, providing complete process isolation",
    ],
    correctIndex: 1,
    explanation:
      "Many commands (rm, cp, chmod) expect filenames as arguments, not on stdin. xargs bridges this gap by reading stdin (one item per line or null-delimited) and appending items as arguments to the given command. 'find . -name '*.o' | xargs rm' is more efficient than 'find -exec rm {} \\;' because xargs batches arguments. Use -0 with 'find -print0' to handle filenames with spaces.",
    link: "https://man7.org/linux/man-pages/man1/xargs.1.html",
  },
  {
    id: 260,
    difficulty: "Hard",
    topic: "Linux Commands",
    question: "What does `sed -i 's/foo/bar/g' file.txt` do?",
    options: [
      "Deletes all lines containing the pattern 'foo' from file.txt and saves the result",
      "Searches for 'foo' in file.txt and prints all the lines that contain a match to stdout",
      "Creates a new file called bar.txt containing the transformed contents of the original foo.txt",
      "Replaces every occurrence of 'foo' with 'bar' in file.txt, modifying the file in place",
    ],
    correctIndex: 3,
    explanation:
      "sed (stream editor) processes text line by line. The 's/foo/bar/g' command substitutes 'foo' with 'bar' -- the g flag means globally (all occurrences per line, not just the first). The -i flag edits the file in place rather than printing to stdout. On macOS, -i requires an argument (e.g., -i '' for no backup); on GNU/Linux, -i alone works.",
    link: "https://man7.org/linux/man-pages/man1/sed.1.html",
  },
  {
    id: 261,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `awk '{print $2}' file.txt` do?",
    options: [
      "Prints the second whitespace-delimited field from each line of file.txt",
      "Prints every other line of file.txt starting from line two",
      "Removes the second column from file.txt and saves the rest",
      "Prints only the second line of file.txt to standard output",
    ],
    correctIndex: 0,
    explanation:
      "awk splits each input line into fields by whitespace (by default). $1 is the first field, $2 the second, and so on ($0 is the entire line). awk is a full programming language with variables, conditionals, and loops, but it is most commonly used for extracting and transforming columnar data. Use -F to change the field separator (e.g., -F',' for CSV).",
    link: "https://man7.org/linux/man-pages/man1/awk.1p.html",
  },
  {
    id: 262,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does command substitution `$(...)` do in bash?",
    code: "echo \"There are $(ls | wc -l) files here\"",
    options: [
      "It creates a shell variable whose name is derived from the enclosed expression and whose value is the literal command text",
      "It suppresses the output of the enclosed command by redirecting both stdout and stderr to /dev/null internally",
      "It defines a subshell that runs in the background as an asynchronous job, returning control to the parent shell immediately",
      "It runs the enclosed command and replaces the $(...) expression with its stdout output, allowing you to embed command output in strings or arguments",
    ],
    correctIndex: 3,
    explanation:
      "Command substitution runs the command inside $(...) in a subshell and replaces the expression with its standard output. In the example, $(ls | wc -l) is replaced by the number of files. This is cleaner than the older backtick syntax (`...`) and supports nesting. It is widely used in scripts to capture command output into variables: count=$(wc -l < file.txt).",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Command-Substitution",
  },
  {
    id: 263,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does process substitution `<(...)` do in bash?",
    code: "diff <(sort file1.txt) <(sort file2.txt)",
    options: [
      "It runs the command in an isolated subshell and silently discards all of its output, effectively acting as a background no-op that produces no visible results",
      "It provides the output of a command as if it were a file, allowing commands that require file arguments to read from a command's output",
      "It creates a temporary file on disk containing the output of the command, which is automatically deleted when the parent process exits or the shell session ends",
      "It redirects the command's standard output directly to the parent shell's stdin, replacing whatever input source was previously connected to it and consuming the data",
    ],
    correctIndex: 1,
    explanation:
      "Process substitution <(cmd) runs cmd and presents its output through a special file path (like /dev/fd/63). The parent command receives this path as an argument, so it can open and read it like a regular file. This lets you use commands that expect file arguments with dynamic data. In the example, diff compares two sorted streams without creating temporary files.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Process-Substitution",
  },
  {
    id: 264,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `trap 'rm -f /tmp/mylock' EXIT` do in a bash script?",
    options: [
      "It creates a lock file at /tmp/mylock that prevents other instances of the same script from running concurrently",
      "It redirects all error messages and stderr output from the entire script to the file /tmp/mylock for later inspection",
      "It prevents the script from being killed by any signal, making it immune to SIGTERM, SIGINT, and all other termination signals",
      "It registers a command to run when the script exits, ensuring cleanup happens even if the script is interrupted",
    ],
    correctIndex: 3,
    explanation:
      "trap registers a handler for signals or pseudo-signals. EXIT fires when the shell exits for any reason (normal exit, error, SIGTERM, etc.). This is the standard pattern for cleanup in shell scripts -- removing temporary files, releasing locks, or restoring settings. You can also trap specific signals: trap 'echo interrupted' INT catches Ctrl+C.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Bourne-Shell-Builtins",
  },
  {
    id: 265,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `scp -r user@host:/var/log/ ./logs/` do?",
    options: [
      "Mounts the remote directory locally as a FUSE filesystem via SSH, making it accessible as a local path",
      "Synchronizes the two directories incrementally, only copying files that have changed since the last transfer",
      "Creates a symbolic link on the local machine that points to the remote directory over the SSH connection",
      "Recursively copies the /var/log/ directory from the remote host to a local ./logs/ directory over an encrypted SSH connection",
    ],
    correctIndex: 3,
    explanation:
      "scp (secure copy) transfers files between hosts over SSH. -r enables recursive copying of directories. Unlike rsync, scp always copies all files regardless of whether they've changed, making it simpler but less efficient for repeated transfers. For incremental syncs, rsync -avz is preferred. scp is being deprecated in favor of sftp in newer OpenSSH versions.",
    link: "https://man7.org/linux/man-pages/man1/scp.1.html",
  },
  {
    id: 266,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `grep -oP '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' access.log` do?",
    options: [
      "Counts the number of IP addresses in access.log and prints a single total at the end of the output",
      "Replaces all IP addresses with '***' in access.log to anonymize the file before sharing or analysis",
      "Prints only the matched IP address patterns from access.log, using Perl-compatible regex",
      "Filters out lines that contain IP addresses, printing only the lines that have no IP address matches",
    ],
    correctIndex: 2,
    explanation:
      "-o (only matching) prints just the matched text, not the entire line. -P enables Perl-compatible regular expressions (PCRE), which support \\d for digits. The pattern matches IPv4-like strings (1-3 digits separated by dots). Without -o, grep would print every full line containing an IP. This combination is powerful for extracting specific data from logs.",
    link: "https://man7.org/linux/man-pages/man1/grep.1.html",
  },
  {
    id: 267,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What is a here document (heredoc), and what does this script do?",
    code: "cat <<'EOF'\nHello $USER\nThe date is $(date)\nEOF",
    options: [
      "It causes a syntax error because heredocs cannot contain $ characters in the body of the document",
      "It prints the text literally without expanding variables or commands, because the delimiter EOF is quoted",
      "It prints the text with $USER and $(date) expanded to their current runtime values by the shell",
      "It writes the text to a file named EOF in the current working directory, creating it if necessary",
    ],
    correctIndex: 1,
    explanation:
      "A heredoc (<<DELIM ... DELIM) feeds multi-line text as stdin to a command. When the delimiter is quoted ('EOF' or \"EOF\"), the shell does NOT expand variables or command substitutions inside the body -- everything is treated as literal text. Without quotes (<<EOF), expansion occurs normally. This distinction is important when generating config files or code that contains $ characters.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Here-Documents",
  },
  {
    id: 268,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `ls *.txt` do if no .txt files exist in the current directory (with default bash settings)?",
    options: [
      "Prints all files in the directory regardless of extension, as the glob expands to match everything",
      "The shell throws a syntax error before ls runs because unmatched globs are considered invalid syntax",
      "Prints nothing to standard output and exits with a successful zero exit code",
      "The literal string '*.txt' is passed to ls, which reports an error because no file named '*.txt' exists",
    ],
    correctIndex: 3,
    explanation:
      "By default in bash, if a glob pattern matches nothing, it is passed unexpanded as a literal string to the command. So ls receives the literal argument '*.txt' and reports it doesn't exist. This is a common source of bugs in scripts. The 'nullglob' shell option (shopt -s nullglob) changes this behavior to expand unmatched patterns to nothing instead.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#Filename-Expansion",
  },
  {
    id: 269,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What is the difference between `ssh user@host 'cmd'` and `ssh -t user@host 'cmd'`?",
    options: [
      "-t enables encryption for the SSH session; without it, the connection transmits data in plaintext over the network",
      "-t runs the command in the background on the remote host as a detached daemon process that persists after disconnection",
      "There is no difference",
      "Without -t, SSH does not allocate a pseudo-terminal (PTY), so interactive programs will not work correctly; -t forces PTY allocation",
    ],
    correctIndex: 3,
    explanation:
      "When SSH runs a single command (not an interactive shell), it does not allocate a PTY by default. This means programs that need terminal features (curses, line editing, password prompts) will fail or behave oddly. The -t flag forces a pseudo-terminal allocation. Use -tt to force it even when SSH's stdin isn't a terminal (e.g., in a pipeline).",
    link: "https://man7.org/linux/man-pages/man1/ssh.1.html",
  },
  {
    id: 270,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does `set -euo pipefail` at the top of a bash script do?",
    options: [
      "Sets the script's text encoding to UTF-8 and configures the locale, ensuring all string operations and file I/O handle Unicode characters correctly throughout execution",
      "Makes the script safer: -e exits on any command failure, -u treats unset variables as errors, -o pipefail makes a pipeline fail if any command in it fails",
      "Prevents the script from being run by non-root users by checking the effective UID at startup and exiting immediately with an error message if it is not zero",
      "Enables verbose debugging output for every command in the script, printing each line with its expanded variables to stderr before the shell executes it",
    ],
    correctIndex: 1,
    explanation:
      "This is the 'strict mode' for bash scripts. -e causes immediate exit on non-zero return codes (instead of silently continuing). -u makes referencing an unset variable an error (instead of expanding to empty string). pipefail propagates failure from any pipeline stage (by default, only the exit code of the last command matters). Together, they catch many common scripting bugs early.",
    link: "https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin",
  },
  {
    id: 271,
    difficulty: "Hard",
    topic: "Linux Commands",
    question:
      "What does this pipeline do?",
    code: "ps aux | awk '{print $11}' | sort | uniq -c | sort -rn | head -10",
    options: [
      "Shows the 10 oldest running processes based on their start time, from earliest to most recent",
      "Lists the 10 largest processes by memory usage, sorted from highest to lowest resident set size",
      "Lists the 10 most frequently occurring command names across all running processes, sorted by count in descending order",
      "Kills the top 10 CPU-consuming processes by sending SIGTERM to each one identified in the output",
    ],
    correctIndex: 2,
    explanation:
      "This is a classic Unix pipeline that composes small tools: ps aux lists all processes, awk extracts the 11th field (the command name), sort groups identical names together, uniq -c counts consecutive duplicates, sort -rn sorts numerically in reverse (highest count first), and head -10 takes the top 10. This pattern of 'extract | sort | count | sort | head' is extremely common for quick data analysis on the command line.",
    link: "https://man7.org/linux/man-pages/man1/ps.1.html",
  },
];
