import type { Article } from '@/types/content';

export const linuxCommandsArticle: Article = {
  id: 'linux-commands-developers-devops',
  slug: 'linux-commands-developers-devops',
  category: 'Backend',
  title: 'Linux Commands Every Developer and DevOps Engineer Should Know',
  summary:
    'A beginner-first guide to the Linux and Unix commands developers use every day: navigating files, searching logs, working with processes, inspecting ports, connecting to servers with SSH, transferring files with scp and rsync, managing services, and combining commands into practical DevOps workflows.',
  topics: ['Linux', 'DevOps', 'CLI', 'Terminal', 'Development'],
  difficulty: 'basic',
  blocks: [
    {
      type: 'paragraph',
      text: 'If you work as a developer or DevOps engineer, eventually you end up in a terminal. Maybe you are connecting to an EC2 instance over SSH, debugging a Node.js application, inspecting an Nginx log, copying a build to a server, or trying to figure out why port 3000 is already occupied. At that point, knowing a few Linux commands can save a surprising amount of time. This article starts with the commands you use every day and gradually moves into searching files, processing text, managing permissions, inspecting processes, debugging networks, connecting to remote servers, transferring files with scp and rsync, and managing services.'
    },
    {
      type: 'paragraph',
      text: 'The goal is not to memorize hundreds of commands. The Linux command line becomes much easier once you understand what each command is designed to answer. `pwd` answers "Where am I?", `ls` answers "What is here?", `find` answers "Where is that file?", `grep` answers "Where is this text?", `ps` answers "What is running?", and `curl` answers "Can I make this HTTP request?". Once those building blocks become familiar, you can combine them to solve much larger problems.'
    },

    {
      type: 'heading',
      id: 'terminal-mental-model',
      level: 2,
      text: 'The terminal mental model'
    },
    {
      type: 'paragraph',
      text: 'A terminal gives you a way to interact with the operating system by entering commands. When you run `ls`, you are asking the operating system to execute a program called `ls`. When you run `mkdir project`, you are executing `mkdir` and passing `project` as an argument.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `command[options][arguments]

Examples:

ls
ls - la
ls - la /var/log`
    },
    {
      type: 'paragraph',
      text: 'The general structure is a command followed by optional options and arguments. Options change how the command behaves, while arguments tell it what to operate on. Once this structure becomes familiar, shell commands stop looking like random punctuation and start looking like small programs with predictable inputs and outputs.'
    },

    {
      type: 'heading',
      id: 'pwd',
      level: 2,
      text: '`pwd`: Where am I?'
    },
    {
      type: 'paragraph',
      text: '`pwd` means "print working directory". It tells you the directory your current shell session is operating inside.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `pwd

/home/yogesh/projects/quickrecall`
    },
    {
      type: 'paragraph',
      text: 'This is particularly useful when working over SSH, inside Docker containers, or anywhere that the current directory is not immediately obvious. Before running a command that changes or deletes files, knowing where you are is a surprisingly good habit.'
    },

    {
      type: 'heading',
      id: 'ls',
      level: 2,
      text: '`ls`: What is here?'
    },
    {
      type: 'paragraph',
      text: '`ls` lists the contents of a directory.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ls

ls /var/log`
    },
    {
      type: 'paragraph',
      text: 'One of the most useful variations is `ls -l`, which produces a long listing containing information such as permissions, ownership, file size, and modification time.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ls -l`
    },
    {
      type: 'paragraph',
      text: 'Another extremely common version is `ls -la`. The `-a` option includes hidden files.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ls -la`
    },
    {
      type: 'paragraph',
      text: 'Files beginning with a dot are commonly treated as hidden on Unix-like systems. Examples include `.env`, `.git`, `.gitignore`, and `.npmrc`.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Hidden does not mean secure',
      text: 'A file named `.env` is hidden from a normal `ls` listing, but it is not protected. If it contains passwords, API keys, or database credentials, those values are still plain text. A leading dot is not a security mechanism.'
    },

    {
      type: 'heading',
      id: 'cd',
      level: 2,
      text: '`cd`: Move between directories'
    },
    {
      type: 'paragraph',
      text: '`cd` means "change directory". It changes the current working directory of your shell.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `cd projects

cd projects/quickrecall

cd ..`
    },
    {
      type: 'paragraph',
      text: '`cd ..` moves to the parent directory. `cd ~` moves to your home directory, and running `cd` without an argument normally does the same.'
    },

    {
      type: 'heading',
      id: 'absolute-relative-paths',
      level: 2,
      text: 'Absolute paths vs relative paths'
    },
    {
      type: 'paragraph',
      text: 'An absolute path starts from the filesystem root, while a relative path starts from your current directory.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `Absolute path:

/home/user/projects/app


Relative path:

projects/app`
    },
    {
      type: 'paragraph',
      text: 'If your current directory is `/home/user`, both paths can point to the same location. The difference is that the relative path depends on where you currently are, while the absolute path does not.'
    },

    {
      type: 'heading',
      id: 'mkdir',
      level: 2,
      text: '`mkdir`: Create directories'
    },
    {
      type: 'paragraph',
      text: '`mkdir` creates a directory.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `mkdir projects

mkdir -p projects/frontend/src`
    },
    {
      type: 'paragraph',
      text: 'The `-p` option creates missing parent directories as necessary. Without it, creating `projects/frontend/src` fails if the parent directories do not already exist.'
    },

    {
      type: 'heading',
      id: 'touch',
      level: 2,
      text: '`touch`: Create a file'
    },
    {
      type: 'paragraph',
      text: '`touch` is commonly used to create an empty file.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `touch README.md

touch index.html styles.css app.js`
    },
    {
      type: 'paragraph',
      text: 'Technically, `touch` is not simply a "create file" command. Its original purpose is to update file timestamps. If the file does not exist, it creates it. That explains why running `touch` on an existing file does not erase its contents.'
    },

    {
      type: 'heading',
      id: 'cp',
      level: 2,
      text: '`cp`: Copy files and directories'
    },
    {
      type: 'paragraph',
      text: '`cp` copies files from one location to another.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `cp config.example.env .env

cp app.js backup-app.js`
    },
    {
      type: 'paragraph',
      text: 'To copy a directory and its contents, use the recursive option.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `cp -r src backup-src`
    },

    {
      type: 'heading',
      id: 'mv',
      level: 2,
      text: '`mv`: Move or rename files'
    },
    {
      type: 'paragraph',
      text: '`mv` moves files and directories. It is also commonly used to rename them.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `mv app.js src/app.js

mv app-old.js app.js`
    },
    {
      type: 'paragraph',
      text: 'There is no separate command required for an ordinary rename. Moving a file from one filename to another within the same directory effectively renames it.'
    },

    {
      type: 'heading',
      id: 'rm',
      level: 2,
      text: '`rm`: Delete files'
    },
    {
      type: 'paragraph',
      text: '`rm` removes files.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `rm old-file.txt

rm -r old-project`
    },
    {
      type: 'paragraph',
      text: 'The `-r` option removes directories recursively. You may also see `rm -rf`, where `-f` means force.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Be careful with rm -rf',
      text: '`rm -rf` does not move files to a recycle bin. It can permanently remove a directory and everything below it. Be especially careful when using it with `sudo`, variables, wildcards, or paths you have not verified with `pwd` and `ls` first.'
    },

    {
      type: 'heading',
      id: 'reading-files',
      level: 2,
      text: 'Reading files from the terminal'
    },
    {
      type: 'paragraph',
      text: 'Developers frequently need to inspect configuration files, source files, and logs without opening a graphical editor. Several small commands are useful for this.'
    },
    {
      type: 'heading',
      id: 'cat',
      level: 3,
      text: '`cat`: Print a file'
    },
    {
      type: 'code',
      language: 'bash',
      code: `cat package.json`
    },
    {
      type: 'paragraph',
      text: '`cat` prints the contents of a file directly to the terminal. It is convenient for small files, but large files can quickly make your terminal unpleasant to use.'
    },
    {
      type: 'heading',
      id: 'less',
      level: 3,
      text: '`less`: Read large files'
    },
    {
      type: 'code',
      language: 'bash',
      code: `less /var/log/application.log`
    },
    {
      type: 'paragraph',
      text: '`less` lets you inspect a file page by page. You can search with `/text`, move through the file with the keyboard, and press `q` to quit.'
    },
    {
      type: 'heading',
      id: 'head-tail',
      level: 3,
      text: '`head` and `tail`'
    },
    {
      type: 'paragraph',
      text: '`head` displays the beginning of a file, while `tail` displays the end. They are particularly useful when working with logs.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `head application.log

tail application.log

tail -n 50 application.log`
    },
    {
      type: 'heading',
      id: 'tail-follow',
      level: 3,
      text: '`tail -f`: Watch a log in real time'
    },
    {
      type: 'paragraph',
      text: 'The `-f` option tells `tail` to follow the file. Instead of printing the file and exiting, it continues watching for new lines.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `tail -f application.log`
    },
    {
      type: 'paragraph',
      text: 'This is extremely useful while debugging a running application. You can make a request from another terminal or browser and watch the corresponding log entry appear. Press `Ctrl + C` to stop following the file.'
    },

    {
      type: 'heading',
      id: 'grep',
      level: 2,
      text: '`grep`: Search for text'
    },
    {
      type: 'paragraph',
      text: '`grep` searches for matching text in files or in text received from another command.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `grep "ERROR" application.log

grep -i "error" application.log

grep -n "ERROR" application.log`
    },
    {
      type: 'paragraph',
      text: '`-i` makes the search case-insensitive, while `-n` includes line numbers. You can also search recursively through a directory.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `grep -r "TODO" src/`
    },
    {
      type: 'paragraph',
      text: 'A useful mental model is: `grep` searches the contents of files. If you need to find the files themselves, use `find`.'
    },

    {
      type: 'heading',
      id: 'find',
      level: 2,
      text: '`find`: Search for files'
    },
    {
      type: 'paragraph',
      text: '`find` searches directories based on conditions such as filename, file type, size, or modification time.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `find . -name "*.log"

find . -type f -name "*.ts"

find . -type d -name "node_modules"`
    },
    {
      type: 'table',
      columns: ['Command', 'Question it answers'],
      rows: [
        ['`find . -name "*.log"`', 'Where are the log files?'],
        ['`grep "ERROR" application.log`', 'Which lines contain ERROR?'],
        ['`find . -type f -name "*.ts"`', 'Where are the TypeScript files?'],
        ['`grep -r "TODO" src/`', 'Where is TODO mentioned inside src/?']
      ]
    },

    {
      type: 'heading',
      id: 'which',
      level: 2,
      text: '`which`: Which executable am I using?'
    },
    {
      type: 'paragraph',
      text: '`which` shows the executable that your shell will find for a command.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `which node

which npm

which python`
    },
    {
      type: 'paragraph',
      text: 'This is useful when multiple versions of Node.js, Python, or another tool are installed. If `node --version` produces an unexpected version, `which node` can help you determine which executable is actually being used.'
    },

    {
      type: 'heading',
      id: 'man-help',
      level: 2,
      text: '`man` and `--help`: Discover command options'
    },
    {
      type: 'paragraph',
      text: 'You do not need to memorize every option for every command. Linux provides documentation directly from the terminal.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `man ls

man grep

ls --help`
    },
    {
      type: 'paragraph',
      text: '`man` opens the manual page for a command, while `--help` usually provides a shorter command-specific summary. Learning how to look up an unfamiliar option is more useful than trying to memorize hundreds of flags.'
    },

    {
      type: 'heading',
      id: 'history',
      level: 2,
      text: 'Command history'
    },
    {
      type: 'paragraph',
      text: 'Your shell keeps a history of commands you have previously executed.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `history`
    },
    {
      type: 'paragraph',
      text: 'One of the most useful shortcuts is `Ctrl + R`, which lets you search backward through your command history. This is especially useful for long commands such as AWS CLI commands, Docker commands, or rsync deployment commands that you do not want to type again.'
    },

    {
      type: 'heading',
      id: 'pipes',
      level: 2,
      text: 'Pipes: combining commands'
    },
    {
      type: 'paragraph',
      text: 'The pipe character `|` is one of the most important concepts in the Unix command line. It takes the output of one command and sends it as the input to another command.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ls -la | grep ".env"

ps aux | grep node`
    },
    {
      type: 'paragraph',
      text: 'The first command produces output. The next command receives that output and filters or transforms it. You can continue chaining commands together.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ps aux | grep node | grep -v grep`
    },
    {
      type: 'paragraph',
      text: 'Here, `grep -v grep` removes lines containing the word `grep`, which prevents the search command itself from appearing in the result.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'The Unix superpower is composition',
      text: 'Most individual commands are deliberately small. Their real power comes from combining them. Instead of learning one giant command that does everything, you can build a pipeline where each command performs one small transformation.'
    },

    {
      type: 'heading',
      id: 'redirection',
      level: 2,
      text: 'Redirecting command output'
    },
    {
      type: 'paragraph',
      text: 'The `>` operator writes command output to a file.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ls -la > files.txt`
    },
    {
      type: 'paragraph',
      text: 'The `>` operator replaces the existing contents of the destination file. The `>>` operator appends instead.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `echo "hello" > output.txt

echo "world" >> output.txt`
    },
    {
      type: 'paragraph',
      text: 'After these commands, `output.txt` contains both lines. Redirection becomes particularly useful in shell scripts and deployment automation.'
    },

    {
      type: 'heading',
      id: 'standard-streams',
      level: 2,
      text: 'stdin, stdout, and stderr'
    },
    {
      type: 'paragraph',
      text: 'Unix processes commonly work with three standard streams: stdin for input, stdout for normal output, and stderr for error output. This is why you can redirect normal output and errors separately.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `npm run build > build-output.txt

npm run build 2> build-errors.txt

npm run build > output.txt 2>&1`
    },
    {
      type: 'paragraph',
      text: 'The `2>` syntax redirects stderr. The final example sends stdout to `output.txt` and then sends stderr to the same destination.'
    },

    {
      type: 'heading',
      id: 'text-processing',
      level: 2,
      text: 'Text-processing commands'
    },
    {
      type: 'paragraph',
      text: 'Once you become comfortable with `grep` and pipes, commands such as `sort`, `uniq`, `wc`, `cut`, `awk`, and `sed` become useful for processing command output and logs.'
    },
    {
      type: 'heading',
      id: 'wc',
      level: 3,
      text: '`wc`: Count lines, words, and characters'
    },
    {
      type: 'code',
      language: 'bash',
      code: `wc -l application.log

grep "ERROR" application.log | wc -l`
    },
    {
      type: 'paragraph',
      text: 'The second command answers a useful question: how many lines in the log contain `ERROR`?'
    },
    {
      type: 'heading',
      id: 'sort-uniq',
      level: 3,
      text: '`sort` and `uniq`: Organize repeated values'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sort users.txt

sort users.txt | uniq

sort users.txt | uniq -c`
    },
    {
      type: 'paragraph',
      text: '`sort | uniq -c` is a classic shell pattern for counting repeated values. `uniq` removes adjacent duplicate lines, which is why sorting first is often necessary when you want to count all duplicates.'
    },
    {
      type: 'heading',
      id: 'cut',
      level: 3,
      text: '`cut`: Extract fields'
    },
    {
      type: 'code',
      language: 'bash',
      code: `cut -d: -f1 /etc/passwd`
    },
    {
      type: 'paragraph',
      text: 'Here `-d:` specifies `:` as the delimiter and `-f1` selects the first field. `cut` is useful for simple structured text, while more complicated transformations are often better handled with `awk` or another dedicated tool.'
    },
    {
      type: 'heading',
      id: 'awk',
      level: 3,
      text: '`awk`: Process structured text'
    },
    {
      type: 'code',
      language: 'bash',
      code: `awk '{print $1}' file.txt

ps aux | awk '{print $1, $11}'`
    },
    {
      type: 'paragraph',
      text: '`awk` can extract fields, apply conditions, perform calculations, and transform text. You do not need to become an `awk` expert immediately. The useful beginner concept is that it can process structured command output when simpler tools are no longer enough.'
    },
    {
      type: 'heading',
      id: 'sed',
      level: 3,
      text: '`sed`: Transform text'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sed 's/localhost/production/g' config.txt`
    },
    {
      type: 'paragraph',
      text: "This substitutes `localhost` with `production` throughout the file's output. `sed` is particularly useful in scripts where predictable text transformations need to happen automatically."
    },

    {
      type: 'heading',
      id: 'permissions',
      level: 2,
      text: 'Linux file permissions'
    },
    {
      type: 'paragraph',
      text: 'Linux files have permissions controlling who can read, write, and execute them. Run `ls -l` and you may see something such as `-rwxr-xr--`. The permissions are represented for the file owner, the group, and everyone else.'
    },
    {
      type: 'table',
      columns: ['Permission', 'Meaning'],
      rows: [
        ['`r`', 'Read'],
        ['`w`', 'Write'],
        ['`x`', 'Execute'],
        ['`-`', 'Permission not granted']
      ]
    },
    {
      type: 'paragraph',
      text: 'For example, `rwxr-xr-x` means the owner can read, write, and execute, while the group and others can read and execute.'
    },

    {
      type: 'heading',
      id: 'chmod',
      level: 2,
      text: '`chmod`: Change permissions'
    },
    {
      type: 'paragraph',
      text: '`chmod` changes file permissions. A common example is making a deployment script executable.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `chmod +x deploy.sh

./deploy.sh`
    },
    {
      type: 'paragraph',
      text: 'Numeric permissions are also common. `chmod 755 deploy.sh` gives the owner read, write, and execute permissions, while the group and others receive read and execute permissions.'
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not solve every permission problem with 777',
      text: '`chmod 777` gives read, write, and execute permissions to everyone. It is sometimes used as a quick fix when someone encounters a permissions error, but it can create a serious security problem. Understand which user and group actually need access instead of giving the entire machine permission to modify the file.'
    },

    {
      type: 'heading',
      id: 'chown',
      level: 2,
      text: '`chown`: Change ownership'
    },
    {
      type: 'paragraph',
      text: '`chown` changes the owner and optionally the group associated with a file or directory.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sudo chown deploy:deploy app.log`
    },
    {
      type: 'paragraph',
      text: 'This is particularly useful on servers where files may have been created by `root` but should be managed by a dedicated application user.'
    },

    {
      type: 'heading',
      id: 'sudo',
      level: 2,
      text: '`sudo`: Run with elevated privileges'
    },
    {
      type: 'paragraph',
      text: '`sudo` allows an authorized user to execute a command with elevated privileges.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sudo systemctl restart nginx

sudo apt update`
    },
    {
      type: 'paragraph',
      text: 'You will frequently encounter `sudo` while administering Linux servers. However, adding `sudo` to every command is not a substitute for understanding file ownership and permissions. Running application tooling as root can create files owned by root and cause permission problems later.'
    },

    {
      type: 'heading',
      id: 'processes',
      level: 2,
      text: 'Processes: What is currently running?'
    },
    {
      type: 'paragraph',
      text: 'A running program becomes a process. Your Node.js server, Nginx, PostgreSQL, Redis, Docker daemon, and shell itself can all appear as processes. The process ID, or PID, uniquely identifies a running process on the system.'
    },

    {
      type: 'heading',
      id: 'ps',
      level: 2,
      text: '`ps`: Inspect running processes'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ps aux

ps aux | grep node`
    },
    {
      type: 'paragraph',
      text: '`ps aux` lists running processes along with information such as the user, process ID, CPU usage, memory usage, and command. Filtering it with `grep` is a common way to find a particular process.'
    },

    {
      type: 'heading',
      id: 'top',
      level: 2,
      text: '`top`: Monitor processes live'
    },
    {
      type: 'code',
      language: 'bash',
      code: `top`
    },
    {
      type: 'paragraph',
      text: '`top` continuously updates a view of running processes and system resource usage. It is useful when a server appears slow and you want to identify processes consuming significant CPU or memory. On systems where it is installed, `htop` provides a more interactive alternative.'
    },

    {
      type: 'heading',
      id: 'kill',
      level: 2,
      text: '`kill`: Stop a process'
    },
    {
      type: 'paragraph',
      text: 'If a process has a PID of `12345`, you can request that it terminate with `kill 12345`.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `kill 12345

kill -9 12345`
    },
    {
      type: 'paragraph',
      text: 'The normal `kill` command sends SIGTERM, which gives the process an opportunity to shut down cleanly. `kill -9` sends SIGKILL, which forcibly terminates the process and cannot be handled by the application.'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Try graceful termination first',
      text: 'Use normal `kill` when possible. SIGTERM allows an application to close connections, flush data, and perform cleanup. SIGKILL is the emergency button for processes that refuse to terminate normally.'
    },

    {
      type: 'heading',
      id: 'ports',
      level: 2,
      text: 'Finding what is using a port'
    },
    {
      type: 'paragraph',
      text: 'A very common developer problem is seeing an error such as `EADDRINUSE`, which means another process is already using the requested network port.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sudo ss -ltnp

sudo ss -ltnp | grep :3000

sudo lsof -i :3000`
    },
    {
      type: 'paragraph',
      text: '`ss` can show listening network sockets and the processes associated with them. `lsof` can also identify which process has a particular port open. Once you have the PID, you can inspect or stop that process if appropriate.'
    },

    {
      type: 'heading',
      id: 'curl',
      level: 2,
      text: '`curl`: Make HTTP requests'
    },
    {
      type: 'paragraph',
      text: '`curl` is one of the most useful commands for developers because it lets you interact with HTTP services directly from the terminal.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `curl https://example.com

curl -I https://example.com

curl http://localhost:3000`
    },
    {
      type: 'paragraph',
      text: 'You can also test APIs by sending HTTP methods, headers, and request bodies.'
    },
    {
      type: 'code',
      language: 'bash',
      code: String.raw`curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Yogesh"}'`
    },
    {
      type: 'paragraph',
      text: '`curl` is particularly useful when debugging whether a problem exists in the application itself, the reverse proxy, DNS, or the browser. If `curl http://localhost:3000` works on the server but `curl https://example.com` fails, you have immediately narrowed down the problem.'
    },

    {
      type: 'heading',
      id: 'wget',
      level: 2,
      text: '`wget`: Download files'
    },
    {
      type: 'code',
      language: 'bash',
      code: `wget https://example.com/file.zip`
    },
    {
      type: 'paragraph',
      text: '`wget` is commonly used to download files from HTTP or HTTPS URLs, particularly in server setup and automation scripts. It overlaps with `curl`, but the two tools have different command-line interfaces and typical usage patterns.'
    },

    {
      type: 'heading',
      id: 'ping',
      level: 2,
      text: '`ping`: Test basic network reachability'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ping example.com`
    },
    {
      type: 'paragraph',
      text: '`ping` tests whether a host responds to ICMP echo requests. It can help answer whether a host is reachable at the network level, but a successful ping does not prove that an HTTP application is working. A server can respond to ping while Nginx, Node.js, or the application behind it is completely broken.'
    },

    {
      type: 'heading',
      id: 'dns',
      level: 2,
      text: '`nslookup` and `dig`: Inspect DNS'
    },
    {
      type: 'code',
      language: 'bash',
      code: `nslookup example.com

dig example.com

dig example.com A`
    },
    {
      type: 'paragraph',
      text: 'These commands are useful when debugging DNS records, domains, subdomains, Route 53 configuration, CloudFront distributions, and DNS propagation. `dig` generally provides more detailed DNS information than `nslookup`.'
    },

    {
      type: 'heading',
      id: 'ssh',
      level: 2,
      text: '`ssh`: Connect to a remote server'
    },
    {
      type: 'paragraph',
      text: '`ssh` establishes a secure shell connection to a remote machine. This is one of the most important commands for DevOps work because it gives you an interactive terminal on a remote Linux server.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `ssh ubuntu@203.0.113.10`
    },
    {
      type: 'paragraph',
      text: 'After connecting, commands such as `pwd`, `ls`, `ps`, `curl`, `systemctl`, and `tail` are now operating on the remote server rather than your local machine.'
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'SSH is the foundation for several other commands',
      text: 'Commands such as `scp` and `rsync` can use SSH as their transport. Learning SSH therefore gives you more than remote terminal access: it becomes the secure connection used for many remote file-transfer and deployment workflows.'
    },

    {
      type: 'heading',
      id: 'scp',
      level: 2,
      text: '`scp`: Copy files over SSH'
    },
    {
      type: 'paragraph',
      text: '`scp` stands for secure copy. Its simplest mental model is "copy this file from here to there over an SSH connection."'
    },
    {
      type: 'code',
      language: 'bash',
      code: `scp app.tar.gz ubuntu@203.0.113.10:/home/ubuntu/`
    },
    {
      type: 'paragraph',
      text: 'This copies `app.tar.gz` from your local machine to `/home/ubuntu/` on the remote server.'
    },
    {
      type: 'paragraph',
      text: 'You can also copy a file from the remote machine back to your computer.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `scp ubuntu@203.0.113.10:/home/ubuntu/app.tar.gz .`
    },
    {
      type: 'paragraph',
      text: 'The final `.` means "copy it into my current local directory."'
    },
    {
      type: 'paragraph',
      text: 'For directories, use the recursive option.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `scp -r dist/ ubuntu@203.0.113.10:/var/www/app/`
    },
    {
      type: 'paragraph',
      text: '`scp` is excellent for simple, one-off transfers. If you repeatedly deploy a directory and only a small percentage of files change between deployments, however, `rsync` is usually a better fit.'
    },

    {
      type: 'heading',
      id: 'rsync',
      level: 2,
      text: '`rsync`: Synchronize files efficiently'
    },
    {
      type: 'paragraph',
      text: '`rsync` is designed around synchronization rather than simply copying. Its mental model is: "Make the destination match the source while transferring as little unnecessary data as possible."'
    },
    {
      type: 'code',
      language: 'bash',
      code: `rsync -avz ./dist/ ubuntu@203.0.113.10:/var/www/app/`
    },
    {
      type: 'paragraph',
      text: 'The commonly used options here are `-a` for archive mode, `-v` for verbose output, and `-z` for compression during transfer. `rsync` compares files and can avoid retransferring files that have not changed.'
    },
    {
      type: 'paragraph',
      text: 'Imagine a build directory contains thousands of files, but your latest deployment changed only two JavaScript bundles and `index.html`. A synchronization tool can avoid blindly sending every unchanged file again. This is one reason `rsync` is so useful for repeated deployments.'
    },
    {
      type: 'heading',
      id: 'scp-vs-rsync',
      level: 3,
      text: '`scp` vs `rsync`'
    },
    {
      type: 'table',
      columns: ['Use case', '`scp`', '`rsync`'],
      rows: [
        ['One-off file transfer', 'Excellent', 'Works, but may be unnecessary'],
        ['Copy a small directory', 'Simple', 'Also works'],
        ['Repeated deployments', 'Less efficient', 'Excellent'],
        ['Incremental synchronization', 'No synchronization model', 'Yes'],
        ['Remove stale destination files', 'No', 'Yes, with `--delete`'],
        ['Uses SSH for remote transfer', 'Yes', 'Commonly yes'],
        ['Best mental model', 'Copy this', 'Synchronize these']
      ]
    },

    {
      type: 'heading',
      id: 'rsync-trailing-slash',
      level: 3,
      text: 'The `rsync` trailing slash matters'
    },
    {
      type: 'paragraph',
      text: 'One of the small details that causes surprisingly confusing deployment results is the trailing slash on the source directory.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `rsync -av ./dist/ server:/var/www/app/

rsync -av ./dist server:/var/www/app/`
    },
    {
      type: 'paragraph',
      text: 'The first form means "synchronize the contents of `dist` into `/var/www/app/`". The second form treats `dist` itself as the source directory, which can result in `/var/www/app/dist/`. When deploying a build directory directly into a web root, this difference matters.'
    },

    {
      type: 'heading',
      id: 'rsync-delete',
      level: 3,
      text: '`rsync --delete`: Remove stale files'
    },
    {
      type: 'paragraph',
      text: 'A deployment may remove files from the latest build. If the old files remain on the server, users can still encounter stale assets. `rsync` can remove destination files that no longer exist in the source using `--delete`.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `rsync -avz --delete ./dist/ ubuntu@203.0.113.10:/var/www/app/`
    },
    {
      type: 'callout',
      variant: 'warning',
      title: '`--delete` means exactly what it says',
      text: '`--delete` makes the destination more closely match the source by removing destination files that are absent from the source. Verify your source and destination paths before using it, especially in automation. A deployment script should not accidentally turn the wrong directory into a demolition site.'
    },

    {
      type: 'heading',
      id: 'archives',
      level: 2,
      text: 'Archives and compression'
    },
    {
      type: 'paragraph',
      text: 'Developers frequently package application files into archives before transferring them to a server.'
    },
    {
      type: 'heading',
      id: 'tar',
      level: 3,
      text: '`tar`: Create and extract archives'
    },
    {
      type: 'code',
      language: 'bash',
      code: `tar -cvf project.tar project/

tar -czvf project.tar.gz project/

tar -xzvf project.tar.gz`
    },
    {
      type: 'paragraph',
      text: 'A common pattern is `tar -czvf` for creating a gzip-compressed archive and `tar -xzvf` for extracting one. The options look cryptic initially, but you will quickly recognize them after using them a few times.'
    },
    {
      type: 'heading',
      id: 'gzip',
      level: 3,
      text: '`gzip` and `gunzip`'
    },
    {
      type: 'code',
      language: 'bash',
      code: `gzip application.log

gunzip application.log.gz`
    },
    {
      type: 'paragraph',
      text: '`gzip` compresses files, while `gunzip` decompresses them. Log rotation systems frequently use gzip because old log files often compress very well.'
    },

    {
      type: 'heading',
      id: 'disk-usage',
      level: 2,
      text: 'Disk usage: `df` and `du`'
    },
    {
      type: 'heading',
      id: 'df',
      level: 3,
      text: '`df`: How much disk space is available?'
    },
    {
      type: 'code',
      language: 'bash',
      code: `df -h`
    },
    {
      type: 'paragraph',
      text: '`df` reports filesystem disk usage. The `-h` option makes the values easier for humans to read. This is one of the first commands to run when a server starts behaving strangely and you suspect the disk might be full.'
    },
    {
      type: 'heading',
      id: 'du',
      level: 3,
      text: '`du`: Where is the disk space going?'
    },
    {
      type: 'code',
      language: 'bash',
      code: `du -sh .

du -sh *`
    },
    {
      type: 'paragraph',
      text: '`du` reports disk usage for directories and files. `df` answers "how much space is available on the filesystem?", while `du` helps answer "which files or directories are consuming that space?"'
    },

    {
      type: 'heading',
      id: 'environment-variables',
      level: 2,
      text: 'Environment variables'
    },
    {
      type: 'paragraph',
      text: 'Environment variables are values provided to processes by the operating system environment. They are heavily used by applications and deployment systems for configuration.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `echo $NODE_ENV

env

printenv NODE_ENV`
    },
    {
      type: 'paragraph',
      text: 'You can define an environment variable for the current shell with `export`.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `export NODE_ENV=production

echo $NODE_ENV`
    },
    {
      type: 'paragraph',
      text: 'You can also define a variable for a single command without changing the shell environment.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `NODE_ENV=production node server.js`
    },

    {
      type: 'heading',
      id: 'systemctl',
      level: 2,
      text: '`systemctl`: Manage Linux services'
    },
    {
      type: 'paragraph',
      text: 'On Linux systems using systemd, `systemctl` manages services. This becomes especially important when running Nginx, PostgreSQL, Redis, or a custom Node.js application as a server process.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sudo systemctl status nginx

sudo systemctl start nginx

sudo systemctl stop nginx

sudo systemctl restart nginx

sudo systemctl enable nginx`
    },
    {
      type: 'paragraph',
      text: '`status` checks the service, `start` starts it, `stop` stops it, `restart` restarts it, and `enable` configures it to start automatically during boot.'
    },

    {
      type: 'heading',
      id: 'journalctl',
      level: 2,
      text: '`journalctl`: Inspect service logs'
    },
    {
      type: 'paragraph',
      text: 'When a systemd-managed service fails, `journalctl` can show the logs associated with it.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `sudo journalctl -u nginx

sudo journalctl -u nginx -f

sudo journalctl -b`
    },
    {
      type: 'paragraph',
      text: 'The `-u` option filters logs for a specific systemd unit, `-f` follows new log entries, and `-b` shows logs from the current boot.'
    },

    {
      type: 'heading',
      id: 'command-chaining',
      level: 2,
      text: 'Command chaining with `&&` and `||`'
    },
    {
      type: 'paragraph',
      text: 'The `&&` operator runs the next command only when the previous command succeeds.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `npm install && npm run build`
    },
    {
      type: 'paragraph',
      text: 'If `npm install` fails, the build does not run. This is particularly useful in CI/CD scripts.'
    },
    {
      type: 'paragraph',
      text: 'The `||` operator does the opposite: it runs the next command when the previous command fails.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `test -f .env || echo "Missing .env"`
    },
    {
      type: 'paragraph',
      text: 'This means: check whether `.env` exists, and if it does not, print a warning.'
    },

    {
      type: 'heading',
      id: 'developer-workflows',
      level: 2,
      text: 'Useful command combinations for developers'
    },
    {
      type: 'paragraph',
      text: 'The real value of the command line appears when individual commands are combined. The following patterns are worth recognizing because they occur frequently in development and server troubleshooting.'
    },
    {
      type: 'table',
      columns: ['Goal', 'Command'],
      rows: [
        ['Find Node.js processes', '`ps aux | grep node`'],
        ['Find errors in a log', '`grep -Ei "error|exception|failed" application.log`'],
        ['Count errors in a log', '`grep -Ei "error|exception" application.log | wc -l`'],
        ['Watch errors as they appear', '`tail -f application.log | grep -Ei "error|exception"`'],
        ['Find TypeScript files', '`find . -type f -name "*.ts"`'],
        ['Find what uses port 3000', '`sudo lsof -i :3000`'],
        ['Check disk space', '`df -h`'],
        ['Find large directories', '`du -sh * | sort -h`'],
        ['Check Nginx', '`sudo systemctl status nginx`'],
        ['Follow Nginx logs', '`sudo journalctl -u nginx -f`']
      ]
    },

    {
      type: 'heading',
      id: 'devops-troubleshooting',
      level: 2,
      text: 'A practical DevOps troubleshooting workflow'
    },
    {
      type: 'paragraph',
      text: 'Imagine your Node.js application is running on an EC2 instance and users report that the site is unavailable. Instead of immediately restarting everything, you can investigate the problem layer by layer.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Check disk space',
          text: 'Run `df -h`. A completely full filesystem can cause applications, databases, and logging systems to fail in strange ways.'
        },
        {
          title: '2. Check whether the application process exists',
          text: 'Run `ps aux | grep node` or inspect the systemd service with `sudo systemctl status my-app` if the application is managed by systemd.'
        },
        {
          title: '3. Check whether the expected port is listening',
          text: 'Run `sudo ss -ltnp | grep :3000` or `sudo lsof -i :3000`. This tells you whether something is actually listening on the expected port.'
        },
        {
          title: '4. Test the application locally on the server',
          text: 'Run `curl http://localhost:3000`. If this succeeds, the Node.js application may be healthy and the problem may exist between the application and the public internet.'
        },
        {
          title: '5. Check the reverse proxy',
          text: 'Run `sudo systemctl status nginx` and inspect its logs with `sudo journalctl -u nginx -f`. If Nginx cannot reach the application, its logs often reveal why.'
        },
        {
          title: '6. Test the public endpoint',
          text: 'Run `curl -I https://example.com` and inspect the HTTP status and headers. If localhost works but the public URL fails, investigate Nginx, the load balancer, DNS, CloudFront, security groups, or another infrastructure layer.'
        }
      ]
    },
    {
      type: 'paragraph',
      text: 'Notice what happened here. No single command diagnosed the entire problem. Each command answered one smaller question, and the answers gradually narrowed down where the failure could be. That is the real skill behind command-line troubleshooting.'
    },

    {
      type: 'heading',
      id: 'ssh-deployment-workflow',
      level: 2,
      text: 'A simple SSH deployment workflow'
    },
    {
      type: 'paragraph',
      text: 'Now consider a more deployment-oriented example. You have built a frontend application locally and want to copy it to a Linux server.'
    },
    {
      type: 'steps',
      items: [
        {
          title: '1. Connect to the server',
          text: 'Use `ssh ubuntu@server` to establish a remote shell session and verify that you can access the machine.'
        },
        {
          title: '2. Check the destination',
          text: 'Use `pwd` and `ls -la` to confirm where you are and inspect the destination directory before copying files.'
        },
        {
          title: '3. Transfer a build with scp',
          text: 'For a simple one-off deployment, `scp -r dist/ ubuntu@server:/var/www/app/` can copy the build directory to the server.'
        },
        {
          title: '4. Use rsync for repeated deployments',
          text: 'For ongoing deployments, `rsync -avz --delete ./dist/ ubuntu@server:/var/www/app/` can synchronize the build and remove stale destination files.'
        },
        {
          title: '5. Verify the files',
          text: 'SSH into the server and inspect `/var/www/app/` with `ls -la` to verify that the expected build files are present.'
        },
        {
          title: '6. Restart only what needs restarting',
          text: 'If your deployment requires a service restart, use the appropriate `systemctl restart` command. Static files may not require a process restart at all, depending on the architecture.'
        }
      ]
    },

    {
      type: 'heading',
      id: 'beginner-to-devops-progression',
      level: 2,
      text: 'What should you learn first?'
    },
    {
      type: 'paragraph',
      text: 'You do not need to memorize this entire article before using a Linux server. Start with the commands that answer the most basic questions, then add more specialized commands as your work requires them.'
    },
    {
      type: 'table',
      columns: ['Level', 'Commands', 'What you should be able to do'],
      rows: [
        ['Beginner', '`pwd`, `ls`, `cd`, `mkdir`, `touch`', 'Navigate the filesystem and create files/directories'],
        ['Daily development', '`cp`, `mv`, `rm`, `cat`, `less`, `head`, `tail`', 'Manage and inspect files'],
        ['Searching', '`grep`, `find`, `which`', 'Find files and search their contents'],
        ['Command-line power', '`|`, `>`, `>>`, `&&`, `||`, `wc`, `sort`, `uniq`', 'Combine commands and process output'],
        ['Server administration', '`chmod`, `chown`, `sudo`, `ps`, `top`, `kill`', 'Manage permissions and processes'],
        ['Networking', '`curl`, `ping`, `ss`, `lsof`, `dig`, `nslookup`', 'Diagnose application and network problems'],
        ['Remote work', '`ssh`, `scp`, `rsync`', 'Connect to servers and transfer files'],
        ['DevOps', '`systemctl`, `journalctl`, `df`, `du`, `tar`', 'Operate and troubleshoot Linux servers']
      ]
    },

    {
      type: 'heading',
      id: 'commands-to-memorize',
      level: 2,
      text: 'The small set worth memorizing'
    },
    {
      type: 'paragraph',
      text: 'If you only want a compact starting point, become comfortable with these commands first.'
    },
    {
      type: 'list',
      style: 'unordered',
      items: [
        '`pwd` - Where am I?',
        '`ls` - What is here?',
        '`cd` - Move somewhere else',
        '`mkdir` - Create a directory',
        '`cp` - Copy something',
        '`mv` - Move or rename something',
        '`rm` - Remove something',
        '`cat` / `less` - Read a file',
        '`head` / `tail` - Inspect the beginning or end of a file',
        '`grep` - Search text',
        '`find` - Search for files',
        '`ps` - Inspect processes',
        '`kill` - Stop a process',
        '`curl` - Make an HTTP request',
        '`ssh` - Connect to a remote machine',
        '`scp` - Copy files over SSH',
        '`rsync` - Synchronize files efficiently',
        '`chmod` / `chown` - Manage permissions and ownership',
        '`systemctl` - Manage services',
        '`journalctl` - Inspect service logs',
        '`df` / `du` - Investigate disk usage'
      ]
    },

    {
      type: 'heading',
      id: 'final-takeaway',
      level: 2,
      text: 'Final takeaway'
    },
    {
      type: 'paragraph',
      text: 'The Linux command line is not really about memorizing commands. It is about learning how to ask the operating system questions and then combine the answers.'
    },
    {
      type: 'code',
      language: 'bash',
      code: `Where am I?
→ pwd

What is here?
→ ls

Where is that file?
→ find

Does this file contain an error?
→ grep

What is running?
→ ps

What is using this port?
→ ss / lsof

Can I reach the application?
→ curl

How much disk space is left?
→ df

Where is the disk space going?
→ du

How do I reach the server?
→ ssh

How do I copy something there?
→ scp

How do I synchronize repeated deployments?
→ rsync

Is the service running?
→ systemctl

What is the service saying?
→ journalctl`
    },
    {
      type: 'paragraph',
      text: 'The real superpower is composition. A small command such as `grep` becomes much more useful when combined with `tail`, `wc`, or another command through a pipe. `ssh` becomes the foundation for remote administration, while `scp` and `rsync` turn that secure connection into practical deployment workflows.'
    },
    {
      type: 'paragraph',
      text: 'Once these commands become familiar, working inside an EC2 instance, Docker container, CI/CD runner, or Linux-based production server stops feeling like entering a completely different world. The environment changes, but the basic vocabulary stays surprisingly consistent.'
    }
  ]
};
