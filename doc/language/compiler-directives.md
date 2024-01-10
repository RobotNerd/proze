# Compiler Directives

Compiler directives allow you to give specific instructions to the compiler to change how it generates the final document.

## Paragraph indentation

You can manually control indentation of paragraphs. You can use this if you need to override the default indentation behavior (see [paragraph indentation](./config-compiler.md#paragraph-indentation)). Here's an example that forces the paragraph to be unindented (left-justified).

```proze
[indent:false] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam justo odio, varius in accumsan vitae, imperdiet a erat. Vivamus feugiat, sem eu luctus ullamcorper, orci augue venenatis libero, nec volutpat tellus libero eget ipsum.
```

And here's an example that forces the paragraph to be indented.

```proze
[indent:true] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam justo odio, varius in accumsan vitae, imperdiet a erat. Vivamus feugiat, sem eu luctus ullamcorper, orci augue venenatis libero, nec volutpat tellus libero eget ipsum.
```

Note that if the compiler directive does the same thing as the indentation behavior already specified in the config, then the directive has no effect.

Additional requirements:
- Indentation directives must occur at the beginning of the paragraph before the first sentence. If placed anywhere else within the paragraph, it will be ignored.

## Duplicate directives

If you have duplicate compiler directives in the proze file, the last one overwrite the earlier ones. You should avoid having duplicate compiler directives to make it easier to understand how your document will be compiled.

[Previous: Brackets](./brackets.md) | [Proze Language](./proze-language.md) | [Next: Comment Tokens](./comment-tokens.md)
