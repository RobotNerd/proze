# Compiler Directives

Compiler directives allow you to give specific instructions to the compiler to change how it generates the final document.

## Line and page breaks

Directive: `break`
Values: [`line`, `page`]

### Line break

You can explicitly add line breaks. You generally should not need to use these unless you have specific formatting requirements. For example, you might want to format your text as poetry or music lyrics.

```proze
Lorem ipsum dolor sit amet,[break:line] consectetur adipiscing elit.[break:line] Nullam justo odio,[break:line] varius in accumsan vitae,[break:line] imperdiet a erat.[break:line;break:line]
Vivamus feugiat, sem eu luctus ullamcorper, orci augue venenatis libero, nec volutpat tellus libero eget ipsum.
```

Which will generate this output.

```text
Lorem ipsum dolor sit amet,
consectetur adipiscing elit.
Nullam justo odio,
varius in accumsan vitae,
imperdiet a erat.

Vivamus feugiat, sem eu luctus ullamcorper, orci augue venenatis libero, nec volutpat tellus libero eget ipsum.
```

### Page breaks

Just like with line breaks, you can explicity add page breaks. Proze automatically handles inserting page breaks where they should be, so you should avoid adding additional page breaks unless you have a specific reason to override the default behavior of the compiler.

```proze
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam justo odio, varius in accumsan vitae, imperdiet a erat.[break:page] Vivamus feugiat, sem eu luctus ullamcorper, orci augue venenatis libero, nec volutpat tellus libero eget ipsum.
```

The above example will add a page break at the end of the first sentence, placing the second sentence on a new page.

## Paragraph indentation

Directive: `indent`
Values: [`true`, `false`]

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
