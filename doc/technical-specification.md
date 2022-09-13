# Proze Syntax - English

The proze syntax for the English language is a way to bring aspects of
programming to the process of writing literature. Its main feature is
syntax highlighting, which helps writers visualize the grammatical structure
of the text. The goal is to quickly catch some common mistakes made by
writers while writing.

## Table of Contents

- [File extension](#file-extension)
- [Paragraphs](#paragraphs)
- [Dialogue and Emphasis](#dialogue-and-emphasis)
- [Em Dash](#em-dash)
- [Metadata Tags](#metadata-tags)
- [Comments](#comments)
- [Brackets](#brackets)
- [Comment tokens](#comment-tokens)
- [Configuration file](#configuration-file)
  - [Configuration: special names](#configuration-special-names)
  - [Configuration: project compilation configuration](#configuration-project-compilation-configuration)
    - [File order](#file-order)
    - [Conversion options](#conversion-options)
- [Compiling Proze](#compiling-proze)
- [Syntax highlighting](#syntax-highlighting)
- [Folder Structure](#folder-structure)
- [Version control](#version-control)
- [Best practices](#best-practices)

## File extension

Proze files are UTF-8 and use the file extension `.proze`.

## Paragraphs

- Proze documents are written as a series of paragraphs.
- Paragraphs are separated by at least one blank line.
  - Multiple contiguous blank lines are allowed.
  - Lines containing only whitespace characters are treated as blank lines.
- Paragraphs are left-justified, i.e. no whitespace at the beginning of the line.
  - Any preceeding whitespace on a line turns a paragraph into a block quote.
  - All lines of a block quote should be indented by the same amount
    of whitespace. However, if there is not a blank line separating multiple
    indented lines, those lines will be considered part of the same paragraph.
    In this case, the indentation level of the first line of the paragraph
    defines the indentation of the block quote.
  - Multiple levels of embedded block quotes are allowed. To qualify as
    a deeper level block, the amount of leading whitespace on the first line
    of the indented paragraph must be greater than that of the previous
    paragraph.
    - If a subsequent paragraph is indented with fewer leading whitespace
      characters than the previous block quote, then that paragraph is
      un-indented by one level.
    - A block quote cannot be un-indented past the left margin.

## Dialogue and Emphasis

- Dialogue is placed in double quotes `"`.
  - A closing double quote closes the dialogue block.
  - If no closing quote is found, the dialogue block ends at a blank line.
- Text placed between a pair of `*` characters is *italicized*.
  - The italicized block ends at the second `*`.
  - If no closing `*` is found, the italicized block ends at the
    next blank line.
- Text placed between pairs of double underscores `__` is __bold__.
  - The bold block ends at the second `__`.
  - If no closing `__` is found, the bold block ends at the next
    blank line.

## Em Dash

- The [Em Dash](https://en.wikipedia.org/wiki/Dash#Em_dash) is represented
  by two contiguous hyphens `--` within a paragraph.

## Metadata tags

Tags are used to define document metadata.

General rules:
- Tags must be left-justified.
- A tag must be on its own line.
- Multiple tags can be grouped together on contiguous lines,
  but they should be separated from paragraphs by a blank line.

> TODO Consider allowing multiple titles per project. For example,
>      an anthology of short stories would have a title and author
>      for each story. Be smart enough to treat the title tag the
>      same as a chapter in this scenario.

Metadata tags:
- Title
  - The tag `Title:` followed by the title of the work.
  - There can be only one title per project.
  - The title should be in the very first document in the config
    file (see [Configuration: project compilation configuration](#configuration-project-compilation-configuration)).
  - The title should be on the first line of the file in which it is located.
  - All text between the `Title:` tag and a line break is recognized
    as the title of the project.
- Chapter
  - The tag `Chapter:` acts the same as `Title:` unless otherwise noted.
  - There can be multiple chapter tags per project.
  - All text between the `Chapter:` tag and a line break is recognized
    as the title of the project.
    - Adding a chapter title is optional. In other words, a line with
      only the text `Chapter:` will act as a chapter break.
- Author
  - The tag `Author:` must be followed by the name of the writer.
  - Author tags can be placed immediately after title, chapter, or section tags.
- Section
  - The tag `Section:` acts the same as `Chapter:` unless otherwise noted.
  - Sections occur within a chapter.
  - Including a section name is optional.
  - A chapter can contain multiple sections.
  - At least one blank line must be placed before the section tag, and
    at least one blank line must be placed after it.
- Section break
  - The tag `---` is a shortcut for a section tag without a title.

An example title:

```
Title: A Windy Day
Author: Mary Sue


It was a bright and windy day. The sun shone down on the grassy field...
```

An example chapter:

```
Chapter: Leaves


A gust of wind brushed past a pile of autumn leaves, kicking them up...
```

An example section, with a title:

```
...causing the doors to swing shut.


Section: Inside


The barren limbs of a sapling brushed against the glass, echoing in the...
```

Alternatively, a section break (no title) example:

```
...the fire burned out during the long, cold night.


---


The morning brought frost-covered grass on the lawn under a cold sky...
```

## Comments

Portions of the document can be marked as comments. When compiling
a proze project, commented text is ignored. There are two types of
comments: line comments and block comments.

Line comments:
- Begin with `##`.
- End at the next line break.
- There must be whitespace before the `##` unless it is at the
  beginning of the line.
- Adding a backslash as a prefix `\##` will prevent the double hash from
  being recognized as a comment.

Block comments:
- Begin with `###` and end at the next `###` (or at the end of the file).
- Whitespace must occur before the opening `###` unless it is at the
  beginning of the line.
- Everything between the opening and closing comment tags is considered
  part of the comment. If no matching `###` is found, the comment block
  extends to the end of the file.
- Adding a backslash as a prefix `\###` will prevent the triple hash from
  being recognized as the beginning or ending of a block comment.

## Brackets

Special notes are placed inside a pair of brackets `[]`. When compiling
a proze project, the bracketed block of text is ignored.

- Begin with a `[`.
- End at `]` or the end of the file if no closing bracket is found.
- Adding a backslash as a prefix will prevent the opening/closing bracket
  from being recognized as a bracketed block.

## Comment tokens

Comment tokens are capitalized words that provide special metadata for
an author or editor when placed in comments or bracketed blocks. They should have
emphasized highlighting in editors that support proze.

These tokens are recognized:
- FIXME
- IMPORTANT
- NOTE
- TODO

## Configuration file

Each proze project can optionally include a configuration file specific to
that project. It is located in the project root (see
[Folder structure](#folder-structure)). The following formats are supported:
- json
- yaml

The configuration file is named `config.json` or `config.yml` depending
on the file format (e.g. `config.json` or `config.yml`).

The configuration file can contain:
- project compilation configuration
- special names used in the project

Available configuration options are detailed in the subsections below.

### Configuration: special names

Each project can optionally add names used in the project to the configuration
file. These are the names of characters, places, and things unique to
the story. Text editors can use syntax highlighting to make these names
visually distinct from the surrounding text. This helps writers
quickly figure out when they misspell a character name or use the
wrong name in a story.

Rules
- Names are stored in a `names` section of the config file.
- There a four categories of names that can be added to the config file:
  - Characters: Characters in the story.
  - Places: Locations in the story.
  - Things: Objects specific to the story.
  - Invalid: Characters, places, or things that should not be used
    in the story. For example, a character name may have changed during
    the course of rewriting a story. By placing the old name in this group,
    it can be highlighted as an error in the document.
- A list of name patterns is added under each category header.
- The text editor must match words in the name lists and use syntax
  highlighting to distinguish these patterns from the surrounding text.
  - When possible, the highlighting used for the groups of characters,
    places, and things should be visually distinct from each other.
    (For example, all character names might be bold, places underlined, and
    things italicized.)
  - When possible, items in the invalid group should be highlighted as errors.
- Name patterns
  - If the name pattern is all lowercase, then the variation where the first
    letter of the name is uppercase is condisered valid. This is useful
    when a name that isn't a proper noun is capitalized at the beginning
    of a sentence.
  - If the name pattern contains mixed case, then only that variation of
    the name is considered to be valid.
  - ALL-CAPS variations of name patterns within a proze document are also
    considered to be valid.
  - A name pattern is matched with text in a proze document as long as that
    portion of the text is not adjacent to any of these characters:
    - A-Z
    - a-z
    - 0-9
    - \_
    - Example:
      - pattern: Chuck
      - two matches: She looked at Chuck and said, "Hey Chuck!"
      - no matches: He chucked it over the fence and yelled, "Chucks!"
- Spell checking
  - When possible, name patterns should temporarily be added to
    the dictionary of the text editor. This is to ensure that these
    names are not shown as misspellings by built-in spell checkers.
    This is useful, for example, for invented names in fictional stories.
    In addition to the pattern as it is listed in the config file, these
    variations should be added if the spell checker is case sensitive:
    - The ALL-CAPS variation of the name.
    - For all lowercase patterns, the variation of the name where the
      first letter is capitalized.
  - Spell checking of these patterns should only occur for proze
    files in the same project as the configuration file from which the
    name patterns were loaded. The names unique to one story should not
    be permanently added to the spelling dictionary so they don't bleed
    over into other projects where those names might not be valid.

An example names section for `config.json`:

```json
{
  "names": {
    "characters": [
      "Eric|Eric Walters",
      "Jacob Mathers|Dr. Mathers|Mathers",
      "Sammy"
    ],
    "places": [
      "Pleasantville( High School)?",
      "Willow Street"
    ],
    "things": [
      "laser cannon",
      "time drive"
    ],
    "invalid": [
      "Jeremy",
      "Sandra",
      "laser rifle"
    ]
  }
}
```

An example names section for `config.yml`:

```yaml
---
names:
  characters:
    - Eric|Eric Walters
    - Jacob Mathers|Dr. Mathers|Mathers
    - Sammy
  places:
    - Pleasantville( High School)?
    - Willow Street
  things:
    - laser cannon
    - time drive
  invalid:
    - Jeremy
    - Sandra
    - laser rifle
```

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

## Compiling proze

> TODO
>  - how to compile
>    - text editors can implement this functionality internally
>    - alternatively, link to github project with python scripts for compiling
>  - target formats
>    - (?) ebook formats
>    - Microsoft word
>    - ods
>    - pdf
>    - text

## Syntax highlighting

Text editors that support proze should provide syntax highlighting. This is
one of the key benefits of using proze, since syntax highlighting provides
visual feedback to a writer about the structure of the document.

The following elements should be uniquely highlighted:
- Bracketed blocks
- Comments
- Comment tokens
- Dialogue
- Italicized and bolded text
- Special names
- Metadata tags
