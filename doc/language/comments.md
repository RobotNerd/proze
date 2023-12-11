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

[Previous: Headers](./headers.md) | [Proze Language](./proze-language.md) | [Next: Brackets](./brackets.md)
