# Configuration Names

You can add names used in the project to the configuration file. (Adding names to the config file is optional but strongly recommended!) These are the names of characters, places, and things unique to the story. Text editors will use syntax highlighting to make these names visually distinct from the surrounding text. This makes it easy to notice if you misspell a character name or use the wrong name while writing.

Let's start with example showing names ina confile file. Here's the JSON version.

```json
{
  "names": {
    "characters": [
      "Eric,Eric Walters",
      "Jacob Mathers,Dr. Mathers,Mathers",
      "Sammy"
    ],
    "places": [
      "Pleasantville,Pleasantville High School",
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

And here's the same example config using a YAML format.

```yaml
---
names:
  characters:
    - Eric,Eric Walters
    - Jacob Mathers,Dr. Mathers,Mathers
    - Sammy
  places:
    - Pleasantville,Pleasantville High School
    - Willow Street
  things:
    - laser cannon
    - time drive
  invalid:
    - Jeremy
    - Sandra
    - laser rifle
```

As you can see in the examples, there is a top-level `names` group where all unqiue names are defined. Under this, there are four name categories:
- `characters`: Names of your characters.
- `places`: Names of unique locations in your story.
- `things`: Things unique to your story.
- `invalid`: Names that should NOT be used in your story.

The `invalid` category can be useful if you want to make sure you don't write the wrong name in the story. For example, you might decide to change a character's name from `Jane` to `Anne` after you've already written a lot of the story using the name `Jane`. In this case, you would add `Jane` to the `invalid` category and `Anne` to the `characters` category. Now any time you write the name `Jane` will be highlighted as an error in the text editor.

## Comma-separated names

In the examples above, you'll notice that there are some lines that have multiple entries separated by commas. This is a shorthand for adding variations of the same name together on a single line. From the example, the entry `Eric,Eric Walters` means that both `Eric` and `Eric Walters` will be highlighted as valid names in the editor. Alternatively, you could write each name on a separate line, like this:

```yaml
names:
  characters:
    - Eric
    - Eric Walters
```

## Matching

Names are matched exactly the way they are listed in the config file, which is case sensitive.

## Spell checking

If the editor supports it, the names listed in the config file are temporarily added to the spell checker when opening a proze project. This comes in handy when you're writing something like a fantasy or scifi story, where the names won't exist in the dictionary.


[Previous: Configuration File](./config.md) | [Proze Language](./proze-language.md) | [Next: Compiler Configuration](./config-compiler.md)
