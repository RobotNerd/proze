# Files and folders

Proze projects can contain multiple proze files and a configuration file to describe the project (see [Configuration file](./config.md)). We'll discuss the files and folder structure below.

## File extension

Proze files are UTF-8 and use the file extension `.proze`.

## Folder Structure

The folder that contains all of the proze files for your story is called the `root` folder. This is where your configuration file is placed. You can store your proze files in the root folder or in subfolders contained in the root folder. Proze files will be loaded by the compiler in alphanumeric order from the root folder and its subfolders unless you manually include a [file order in the config file](./config-compiler.md#file-order).


[Previous: Comment Tokens](./comment-tokens.md) | [Proze Language](./proze-language.md) | [Next: Configuration File](./config.md)
