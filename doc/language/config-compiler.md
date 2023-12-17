# Compiler configuration

The config file can be used to customize the output of the compiler. Here's an example config file showing compiler-specific settings. We will go into detail for each of these below.

## Paragraph indentation

Values: true, false
Default: true

When you use `true`, a tab is inserted to indent the first line of every paragraph. Blank lines between paragraphs are removed.

If `false`, the first line of each paragraph is left-justified (i.e. it touches the left margin of the page). A single blank line will be be used between paragraphs to separate them.

Example:

```yaml
---
compile:
  indent: true
```

## File order

An optional `order` section can be included to define a specific order in which proze files are added to the project. This is a list of file paths relative to the project root. If a file exists in the project directory but isn't included in the order list, then it will not be added to the compiled output.

If no `order` field exists in the config file, then all proze files found in the project and its subfolders will be compiled in alphabetical order. This order takes into account the full path from the project root to the file. A subdirectory can be included, and all files under that subdirectory will be recursively added in alphabetical order.

Example:

```yaml
---
compile:
  order:
    - title.proze
    - chapter01/
    - chapter02/
    - epilogue.proze
    - acknowledgements.proze
```


[Next: Configuration Names](./config-names.md) | [Proze Language](./proze-language.md) | [Next: Syntax Highlighting](./syntax-highlighting.md)
