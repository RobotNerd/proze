# Compiler

The proze compiler converts the proze files in your project into an output document. Multiple [document types are supported](#supported-formats), incluing pdf and ebook formats.

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

## What does the compiler do?

> TODO - fill this out in much more detail

Here's what the compiler does when generating the output document.

- Comments and bracketed text blocks are ignored.
- The `*` and `__` for italics and bold text are removed, and the text
  between is converted to italics or bold in the output document.
- `--` is converted to the em dash (U+2014) character.
- All empty lines between paragraphs are removed.
- All contiguous whitespace in a paragraph (up until the first completely
  blank line) is collapsed into a single space.
- The first line of a paragraph is indented with a tab.
  - The first line of the first paragraph of a chapter or a section is not
    indented with a tab by default. This behavior is configurable.
  - The title tag and chapter tag are treated the same for this
    feature. This ensures that short stories, which have a title but no
    chapters, will be treated the same.


## Supported formats

> TODO
