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

## Headers and Footers

You can control what information is displayed in the header and footer of your book. Here is the default configuration:

```yaml
---
compile:
  header:
    even:
      left: page
      center: author
    odd:
      center: title
      right: page
```

Here's what this configuration tells the compiler to do:
- Nothing in the footer (since there is no `footer` entry).
- In the header
  - On even-numbered pages
    - Add the current page number on the left side of the header.
    - Add the author's name in the center of the header.
  - On odd-numbered pages
    - Add the book title in the center of the header.
    - Add the current page number on the right side of the header.

> Even and odd pages: When publishing a physical book, even numbered pages are on the left side and odd numbered pages on the right.

Available slots in the header and footer:

| Slot |
| - |
| left |
| center |
| right |

Available values to put in a slot:

| Value | Supported Formats | Description |
| - | - | - |
| author | pdf | Author's name |
| chapter | | Current chapter title (use "Chapter #" if no chapter title.) |
| page | pdf | Current page number |
| title | pdf | Book title |

Let's create another example that has a different formatting:
- Header
  - Author name in the left slot on even numbered pages.
  - Chapter name in the right slot on odd numbered pages.
- Footer
  - Current page number in the center slot on even and odd numbered pages

```yaml
---
compile:
  header:
    even:
      left: author
    odd:
      right: chapter
  footer:
    even:
      center: page
    odd:
      center: page
```

## Section breaks

By default, untitled section breaks insert a `---` symbol between paragraphs. You can change this so that section breaks are whitespace-only. Doing so will insert blank lines between paragraphs to denote a section break. Add this to your config file.

```yaml
---
compile:
  section:
    whitespaceOnly: true
```


[Next: Configuration Names](./config-names.md) | [Proze Language](./proze-language.md) | [Next: Syntax Highlighting](./syntax-highlighting.md)
