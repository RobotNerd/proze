# Header tags

Header tags are used to define titles and subtitles in the document.

Example:

```proze
Title: A Windy Day
Author: Mary Sue


Chapter: Leaves

It was a bright and windy day. The sun shone down on the grassy field...
```

## Title

Use this to set the title for your story. There can only be one title per project.

```proze
Title: My Story
```

## Author

Use this to set the name of the story author.

```proze
Author: John Doe
```

## Chapter

Use this to start a new chapter. You can have multiple chapters in a proze project.

Chapter titles are optional. Here's an example of a chapter with a title.

```proze
Chapter: My Chapter

It was a bright and windy day. The sun shone down on the grassy field...
```

Here's an example of a chapter without a title.

```proze
Chapter:

It was a bright and windy day. The sun shone down on the grassy field...
```

If you don't include a chapter title, the compile will generate a numbered chapter, e.g. `Chapter 3`.

## Section

Sections are used to break up a chapter into parts. Section titles are optional.

```proze
Section: A section
```

A section without a title.

```proze
Section:
```

Another way to write a section without a title.

```proze
---
```

The compiler will use the section title in the output document. If you don't include a title, then the compiler will insert `---` between paragraphs.


## Things to watch out for

Header tags must be left-justified (i.e. no space to the left) and on a line by themselves.

```proze
Title: This is a valid title

   Title: But this is not a valid title
```

There needs to be at least one blank line between a header tag and the paragraphs of the story. You can group header tags together without blank lines.


```proze
Title: Valid title and author tags
Author: Mary Sue


Title: Not a valid title
It was a bright and windy day. The sun shone down on the grassy field...
```


[Previous: Formatting](./formatting.md) | [Proze Language](./proze-language.md) | [Next: Commnets](./comments.md)
