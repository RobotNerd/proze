# Compiler

## Build

Run this command in the root of the repository.

```bash
make build_compiler
```

This will transpile typescript to javascript and place all files in the `compiler/dist` folder.

## Usage

See the available command line arguments.

```bash
cd compiler/dist
node index.js -h
```

Example: compile a prose project at `PROZE_PATH` to a pdf file.

```bash
cd compiler/dist
node index.js --path PROZE_PATH --format pdf
```
