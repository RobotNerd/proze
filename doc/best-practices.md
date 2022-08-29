# Best practices

A quick reference of recommendations on how to use proze.

## Writing Proze

These are suggestions to make your proze documents consistent and easier to read.

- Leave __two__ blank lines after title and chapter structural markup blocks.
  ```
  Title: My Story
  By: Mary Sue


  It was a dark and story night...
  ```
- Leave only __one__ blank line between paragraphs.
- Leave __two__ empty lines above and __two__ empty lines below a
  section break.
  ```
  ...and that's the last I heard from him.


  ---


  That night, we walked down the gravel road under the light of the...
  ```
- Comments
  - Leave __one__ space before the double/triple hash of a comment unless
    it starts at the beginning of a line.
  - Leave __one__ space after the double/triple hash of a comment unless
    it is at the end of the line.
  - Leave __one__ space before the opening and closing block comments, unless
    it starts at the beginning of the line.
  - Comment examples:
    ```
    ## This is a comment.
    This text is part of the story. ## And this part is a comment.

    This paragraph ### this comment isn't part of the paragraph ### has an
    embedded block comment.

    ###
    This entire section is commented out.
    ###
    ```
- Brackets vs. comments
  - Both can be used for keeping notes to yourself in the story.
  - Only use comments to cut out text that you don't want as part of the story
    but aren't ready to delete yet.
- Comment tokens should be added to bracket blocks or comment blocks as needed.
  - When editing, search for comment tokens in proze files to find specific
    areas that still need to be worked on.
  - Suggested use of comment tokens:
    - Use `TODO` for portions of a story that haven't yet been written.
    - Use `FIXME` for problem areas that need to be rewritten.
    - Use `IMPORTANT` to flag areas that the writer must pay attention to
      (e.g. a part of the story that will need to be foreshadowed earlier
      in the story).
    - Use `NOTE` for background or supporting information that the author
      or editor will need when working on the story.
  - Examples
    ```
    [TODO need to write an action sequence here]

    [FIXME The character dialogue here is sloppy.]

    Jane looked out across the tall grass. ## It stretched to the horizon,
    rippling in the wind like the sea.
    ```

## Folder structure

Each story written with proze should be placed in its own directory.
The configuration file must be placed in the root directory of the project.
Proze files containing the actual narrative writing can be placed in the
root directory or in subfolders.

Here is a simple example with everything in the project root directory:

```
my-project/
  config.yml
  my-story-chp-1.proze
  my-story-chp-2.proze
  title.proze
```

A more complicated example may look like this:

```
my-project/
  acknowledgements.proze
  appendix.proze
  config.json
  part1/
    chapter-01.proze
    chapter-02.proze
    chapter-03.proze
  part2/
    chapter-04.proze
    chapter-05.proze
    chapter-06.proze
    chapter-07.proze
  part3/
    chapter-08.proze
  title.proze
```

See [Configuration: project compilation configuration](#configuration-project-compilation-configuration)
for information on how to order files when compiling a document from
proze files.

## Text editor settings

The following are suggested best practices for using proze:
- Text editors should be configured to line wrap.
  - Don't manually add line breaks within a paragraph.
  - Line wrapping makes it much easier to edit text in paragraph form.
- Enable spell checking in the text editor.

## Version control

It is strongly recommended that all proze projects be placed under
version control. The proze syntax project uses [git](https://git-scm.com/),
but any alternative version control system can be used.
Commits should be performed frequently while writing.

At the minimum, this provides psychological safety for a writer. New
portions of the story can be added, rewritten, or deleted without fear
of losing any work. Old versions can always be retrieved from the
repository history.
