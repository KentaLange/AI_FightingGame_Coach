Here are some notes for future sessions:

### `ls` Command
*   `ls -F`: Lists files and directories, adding a trailing character to indicate the type of file (`/` for directories, `@` for symbolic links, `*` for executables).
*   `ls -a`: Lists all files, including hidden ones (those starting with `.`).
*   `ls -l`: Provides a long listing format with details like permissions, owner, size, and modification date.
*   `ls -R`: Lists files in the current directory and all its subdirectories recursively.

### `glob` Functionality
*   `*`: Matches any sequence of characters (except `/`).
*   `?`: Matches any single character.
*   `[]`: Matches any one of the characters enclosed in the brackets.
*   `**`: If `globstar` is enabled, this matches all files and zero or more directories and subdirectories.

### `Makefile`
*   **Variables:** Use `VARIABLE_NAME = value` to define variables. Access them with `$(VARIABLE_NAME)`.
*   **Targets:** Define targets with `target_name: dependencies`.
*   **Commands:** Prefix commands with a tab character.
*   **Phony Targets:** Use `.PHONY: target_name` to declare targets that don't represent files.
*   **Conditional Logic:** Use `ifeq`, `ifneq`, `else`, and `endif` for conditional execution.

### `podman` Commands
*   `podman build -t <image_name> .`: Builds a Docker image from the current directory.
*   `podman images`: Lists all local Docker images.
*   `podman run -d -p <host_port>:<container_port> <image_name>`: Runs a Docker container in detached mode and maps a port.
*   `podman ps`: Lists all running containers.
*   `podman ps -a`: Lists all containers, including stopped ones.
*   `podman stop <container_id>`: Stops a running container.
*   `podman rm <container_id>`: Removes a stopped container.
*   `podman rmi <image_id>`: Removes a Docker image.
*   `podman exec -it <container_id> /bin/bash`: Accesses a running container's shell.

### `git` Commands
*   `git init`: Initializes a new Git repository.
*   `git clone <repository_url>`: Clones a repository into a new directory.
*   `git add <file>`: Adds file contents to the index.
*   `git commit -m "message"`: Records changes to the repository.
*   `git status`: Displays the status of the working directory and the staging area.
*   `git log`: Shows the commit logs.
*   `git branch`: Lists, creates, or deletes branches.
*   `git checkout <branch_name>`: Switches branches or restores working tree files.
*   `git merge <branch_name>`: Joins two or more development histories together.
*   `git pull`: Fetches from and integrates with another repository or a local branch.
*   `git push`: Updates remote refs along with associated objects.

### Shell Commands
*   `pwd`: Prints the current working directory.
*   `cd <directory>`: Changes the current directory.
*   `mkdir <directory>`: Creates a new directory.
*   `rm <file>`: Removes a file.
*   `rm -r <directory>`: Removes a directory and its contents recursively.
*   `cp <source> <destination>`: Copies files or directories.
*   `mv <source> <destination>`: Moves or renames files or directories.
*   `cat <file>`: Concatenates and displays the content of files.
*   `grep <pattern> <file>`: Searches for a pattern in a file.
*   `find <directory> -name <filename>`: Searches for files and directories.

### General
*   **Globbing:** Use `glob` to find files matching a pattern.
*   **File System:** Use `ls` to navigate and `mkdir`, `rm`, `cp`, `mv` to manage files.
*   **Git:** Use `git` for version control.
*   **Podman:** Use `podman` for container management.
*   **Shell:** Use shell commands for general tasks.
