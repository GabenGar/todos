# TODOs

## Develop

1. Clone the repo:
   ```sh
   git clone https://github.com/GabenGar/todos.git
   ```
2. Switch to the repo:
   ```sh
   cd ./todos
   ```
3. Open git config:
   ```sh
   open ./.git/config
   ```
4. Add `user` section:
   ```ini
   [user]
       name = <username>
       email = <email>
   ```
5. Add ssh key to `core` section:
   ```ini
     sshCommand = ssh -i <ssh_key_path> -F /dev/null
   ```
6. Change `push` remote to ssh endpoint:
   ```sh
   git remote set-url --push origin git@github.com:<username>/todos.git
   ```
