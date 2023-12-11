### Configuration: project compilation configuration

Proze documents are compiled to other formats for publication. This
section describes the compilation configuration that can be included in
the configuration file. All of these options are placed in the
configuration file under the `compile` section.

See [Compiling proze](#compiling-proze) for how to compile projects.

#### File order

An optional `order` section can be included to define a specific
order in which proze files are added to the project. This is a list of
file paths relative to the project root. If a file exists in the
project directory but isn't included in the order list, then it will
not be added to the compiled output.

If no `order` field exists in the config file, then all proze files
found in the project and its subfolders will be compiled in alphabetical
order. This order takes into account the full path
from the project root to the file. A subdirectory can be included, and
all files under that subdirectory will be recursively added in
alphabetical order.

Here is an example portion of `config.yml`:

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

#### Compilation configuration

Compilation rules are used when compiling proze to another
document format. If the document type of the output document does not
support a feature (e.g. bold, italic text), the proze-specific metadata
characters are removed but no additional changes are made.

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

The following rules are configurable:
- `compile.paragraph.mode` controls the paragraph formatting of the entire
  document.
  - __justified__: Each paragraph is left justified. A single blank line
    separates one paragraph from the next.
  - __tab__: (default) A tab is inserted to indent the first line of
    every paragraph. (See the `tabFirst` settings for additional info). Blank
    lines between paragraphs are removed.

  > NOTE: The `compile.paragraph.tabFirst` settings below are used to control
  > whether a tab is inserted for the first paragraph in the story,
  > per chapter, and per section. Written prose is often formatted where the
  > first paragraph is not indented but all subsequent ones are.

- `compile.paragraph.tabFirst.title`: If true, insert a tab at the beginning
  of the first paragraph in the document.
  - Values can be __true__ or __false__.
  - Default __false__.
  - Only applicable if `compile.paragraph.mode` is set to __tab__.
- `compile.paragraph.tabFirst.chapter`: If true, a tab is inserted
  at the beginning of the first paragraph of a chapter.
  - Values can be __true__ or __false__.
  - Default __false__.
  - Only applicable if `compile.paragraph.mode` is set to __tab__.
- `compile.paragraph.tabFirst.secetion` If true, a tab is inserted
  at the beginning of the first paragraph of a section.
  - Values can be __true__ or __false__.
  - Default __false__.
  - Only applicable if `compile.paragraph.mode` is set to __tab__.

- Mode and tabs example:
  ```yaml
  ---
  compile:
    paragraph:
      mode: tab 
      tabFirst:
        title: true
        chapter: false
        section: false
  ```

- `compile.paragraph.removeBlankLines`: If false, blank lines between
  paragraphs are not removed.
  - Values can be __true__ or __false__.
  - Default __true__.
  - Only applicable if `compile.paragraph.mode` is set to __tab__.
  - Example:
    ```yaml
    ---
    compile:
      paragraph:
        mode: tab
        removeBlankLines: false
    ```

- `compile.spacing`: Define the line spacing of the output document.
  - __single__: (default) Use single space.
  - __single+__: Use 1.5 spacing.
  - __double__: Use double spacing.
  - Example:
    ```
    compile:
      spacing: single
    ```

> TODO
>  - conversion options
>    - include "title", "chapter", "section" labels
>    - line break options; before chapter, section, etc.; manual

[Previous: Configuration Names](./config-names.md) | [Proze Language](./proze-language.md) | [Next: Syntax Highlighting](./syntax-highlighting.md)
