## Headers

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

[Previous: Formatting](./formatting.md) | [Proze Language](./proze-language.md) | [Next: Commnets](./comments.md)
