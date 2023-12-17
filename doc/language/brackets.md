# Brackets

Special notes are placed inside a pair of brackets `[]`. When compiling a proze project, the bracketed block of text is automatically removed and won't show up in the final document.

## Why use brackets?

Bracketed text is very similar to comments in the way that they are removed from the document when compiling. You can use square brackets to add notes and comments to your proze files. However, brackets become more important when specifying metadata to change the way the proze document is compiled.

> TODO overriding fonts with bracket blocks

## Using brackets

All text between and including `[` and `]` characters is part of the bracketed block of text.

```proze
[Some text in brackets.]

It was a dark and stormy night; [more text in brackets] the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

The brackets and their text will be removed in the compiled output.

```text
It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

### No closing bracket

If you have an open bracket `[` but forget to include a closing bracket `]`, then everything until the end of the file will be ignored. In this example, the opening bracket in the first sentence is never closed.

```proze
It was a dark and stormy night; [OPENING BRACKET the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.

Through one of the obscurest quarters of London, and among haunts little loved by the gentlemen of the police, a man, evidently of the lowest orders, was wending his solitary way. He stopped twice or thrice at different shops and houses of a description correspondent with the appearance of the quartier in which they were situated, and tended inquiry for some article or another which did not seem easily to be met with.
```

Which will result in this output.

```text
It was a dark and stormy night;
```

### Space before the opening bracket

There must be whitespace before the opening bracket unless it is the first character on the line.

```proze
[Valid bracket block]

It was a dark and stormy night;[NOT REMOVED] the rain fell in torrents—except [REMOVED at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.]
```

This will compile to:

```text
It was a dark and stormy night;[NOT REMOVED] the rain fell in torrents—except
```

## How to keep bracket characters `[]` in the final output doc?

What do you do if you want to have square brackets in our compiled document? All you need to do is add a backslash `\` character before each square bracket to escape it.

```proze
It was a dark and stormy night; \[NOT REMOVED\] the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

The escaped square brackets will be in the compiled output.

```text
It was a dark and stormy night; [NOT REMOVED] the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

[Previous: Comments](./comments.md) | [Proze Language](./proze-language.md) | [Next: Comment Tokens](./comment-tokens.md)
