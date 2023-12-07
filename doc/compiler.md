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
node ./compiler/dist/index.js -h
```

Example: compile a prose project at `PROZE_PATH` to a pdf file.

```bash
node ./compiler/dist/index.js --path PROZE_PATH --format pdf
```

Example: pass proze in an input string as a command line argument and print output to console.

```bash
node ./compiler/dist/index.js --format text --input-string $'this is a\ntest'
```
