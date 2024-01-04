# Compiler configuration

The config file can be used to customize the output of the compiler. Here's an example config file showing compiler-specific settings. We will go into detail for each of these below.

## Paragraph indentation

By default, the compiler uses standard formatting. With standard formatting, each paragraph identation will have the following behavior:

- The first paragraph of a chapter is left-justified.
- The first paragraph after a section break is left-justified.
- The first line of every other paragraph will be indented.

You can control this behavior with configuration options. First, you can disable all indentation of paragraphs with this configuration.

```yaml
---
compile:
  formatting: block
```

Using this configurtaion will make the output document use `block` formatting. In block formatting, every paragraph is left-justified, and blank lines are inserted between paragraphs. (The other possible formatting value is `standard` which is the default.)

When standard formatting is enabled, you can choose to force indentation of the first paragraph of a chapter or section. Here's an example configuration that forces indentation of the first paragraph of both chapters and sections.

```yaml
---
compile:
  indent:
    chapter: true
    section: true
```

Note that if you set the `paragraph` option to `false`, then the options for `chapter` and `section` are ignored.

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
