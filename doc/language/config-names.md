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

[Previous: Configuration File](./config.md) | [Proze Language](./proze-language.md) | [Next: Configuration Names](./config-compile-order.md)
