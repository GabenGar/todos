# TODOs

## Table of Contents
- [Requirements](#requrements)
- [Installation](#installation)
- [Develop](#develop)
- [Turborepo](#turborepo)
- [Troubleshooting](#troubleshooting)
- [Update dependencies](#update-dependencies)

## Requrements
NodeJS - 20.9+

## Link Overwatch Extension
1. Clone the repo:
   ```sh
   git clone https://github.com/GabenGar/todos.git
   ```
2. Switch to the repo:
   ```sh
   cd ./todos
   ```
3. Create a [pruned output](https://turbo.build/repo/docs/reference/prune) for the extension package:
   ```sh
   npx turbo prune "link-overwatch" --out-dir "./dist"
   ```
4. Switch into it
   ```sh
   cd dist
   ```
5. Install dependencies:
   ```sh
   npm install
   ```
6. Build extension:
   ```sh
   npm run build
   ```
7. The extension archive will be located in `/apps/extension/dist`.

## Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/GabenGar/todos.git
   ```
2. Switch to the repo:
   ```sh
   cd ./todos
   ```

3. Install all dependencies:
    ```sh
    npm install
    ```
4. Build the project:
    ```sh
    npm run build
    ```
5. Start the server:
    ```sh
    npm run start
    ```


## Develop

```sh
npm run dev
```

### Prep the Workflow

1. Open git config:
   ```sh
   open ./.git/config
   ```
2. Add `user` section:
   ```ini
   [user]
       name = <username>
       email = <email>
   ```
3. Add ssh key to `core` section:
   ```ini
     sshCommand = ssh -i <ssh_key_path> -F /dev/null
   ```
4. Change `push` remote to ssh endpoint:
   ```sh
   git remote set-url --push origin git@github.com:<username>/todos.git
   ```

### Turborepo
Turborepo claims that [the invocation from global install will invoke local install if applicable](https://turbo.build/repo/docs/installing#install-per-repository), so it can be installed globally:

```sh
npm install turbo --global
```
And then instead of `npm run ...` commands it can be used as `turbo run ...`.

### Create a Package
```sh
turbo generate workspace --type=package --name=<name> --empty --destination=<path>
npm install
```

## Troubleshooting

- **I get `npm ERR! code ENOWORKSPACES frontend:dev: npm ERR! This command does not support workspaces.` error when starting development.**
  Run `cd apps/frontend && npx next telemetry disable`.

## Update dependencies

The repo has a bunch of singleteon packages or the packages which don't work well when there are different versions of them across worspaces. These packages have to be pinned up to minor versions across all workspaces which depend on them and updated to the same versions at the same time.

The packages in question:
- `turbo`
   Run `npx @turbo/codemod migrate` after updating to new version.
- `biome`
   Run `npx biome migrate --write` after updating to new version.
- `typescript`
- `@types/node`
   Must match `engines` field.

- `i18next`
- `i18next-resources-to-backend`
- `react-i18next`
   `i18next` stuff.

- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`
   ReactJS stuff.

- `@next/env`
- `next`
   NextJS stuff.

- `@tanstack/react-router`
- `@tanstack/react-start`
   TankStack stuff.

- `react-router`
- `@react-router/express`
- `@react-router/node`
- `@react-router/serve`
- `@react-router/dev`
   React Router stuff.


Always run `npm update` after all version manipualtions are complete, and `npm install` afterwards, because reasons.


