# Comments

You can use comments to write text in your proze files that will not make it into the final document. Here's a quick example.

```proze
## TODO rewrite the intro

It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

When you compile this proze file, the commented text will be removed from the output.

```text
It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

There are two reasons to use comments:
- Leaving notes for yourself.
- Hide something you've written.

We've already seen how you might leave notes for yourself in the example above. Here's an example of how you might hide something you've written.

```proze
It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.

## Through one of the obscurest quarters of London, and among haunts little loved by the gentlemen of the police, a man, evidently of the lowest orders, was wending his solitary way. He stopped twice or thrice at different shops and houses of a description correspondent with the appearance of the quartier in which they were situated, and tended inquiry for some article or another which did not seem easily to be met with.

All the answers he received were couched in the negative; and as he turned from each door he muttered to himself, in no very elegant phraseology, his disappointment and discontent. At length, at one house, the landlord, a sturdy butcher, after rendering the same reply the inquirer had hitherto received, added, “But if this vill do as vell, Dummie, it is quite at your sarvice!”
```

In this example, only the first and third paragraphs will end up in the compiled document. The second paragraph is hidden by the comment at the begining of the line.

## How to use comments

There are two types of comments: line comments and block comments. The next two sections will walk through examples of how to use them.

### Line comments

You can comment out everything until the end of a line using the `##` characters.

```proze
## This entire line will not be in the output document.
The first part of this line will be in the output ## but this part will not.
```

Will compile to.

```text
The first part of this line will be in the output
```

You must have whitespace before the `##` characters unless they're the first thing on the line.

```proze
## This is a valid comment.
This is not## a comment.
```

Compiles to.

```text
This is not## a comment.
```

### Block comments

You can comment large blocks of your document that can span newlines by using a pair of `###` tokens. Everything between the opening `###` and closing `###` will be part of the comment.

```proze
It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.

### Through one of the obscurest quarters of London, and among haunts little loved by the gentlemen of the police, a man, evidently of the lowest orders, was wending his solitary way. He stopped twice or thrice at different shops and houses of a description correspondent with the appearance of the quartier in which they were situated, and tended inquiry for some article or another which did not seem easily to be met with.

All the answers he received were couched in the negative; and as he turned from each door he muttered to himself, in no very elegant phraseology, his disappointment and discontent. At length, at one house, the landlord, a sturdy butcher, after rendering the same reply the inquirer had hitherto received, added, “But if this vill do as vell, Dummie, it is quite at your sarvice!”###
```

In this example, only the first paragraph will be in the output document.

```text
It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

Block comments can also be contained within a single line.

```proze
It was a dark and stormy night; ### THIS COMMENTED OUT TEXT WILL NOT BE IN THE OUTPUT ### the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

Compiles to this.

```text
It was a dark and stormy night; the rain fell in torrents—except at occasional intervals, when it was checked by a violent gust of wind which swept up the streets (for it is in London that our scene lies), rattling along the housetops, and fiercely agitating the scanty flame of the lamps that struggled against the darkness.
```

If you start a block comment but forget to include the closing `###`, then the block comment will extend until the end of the proze file.

Like with line comments, you must have whitespace immediately before the opening `###` token unless it's at the beginning of the line.

```proze
### This is a valid
block comment.
###
This is not### a valid block comment.
```

Compiles to this.

```text
This is not### a valid block comment.
```


## What if I want `##` or `###` in my document?

If you want to include `##` or `###` in your compiled document, just add a backslash `\` before the comment characters.

```proze
## This text will not be in the output.
Everything on this line \## will be \### in the output.
```

The compiled document will look like this.

```text
Everything on this line ## will be ### in the output.
```

[Previous: Headers](./headers.md) | [Proze Language](./proze-language.md) | [Next: Brackets](./brackets.md)
