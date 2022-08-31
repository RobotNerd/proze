# Proze grammar

> TODO

## Antlr on mac

Follow this guide: https://tomassetti.me/antlr-mega-tutorial/

### CLASSPATH

To get `grun` working, update the `CLASSPATH` environment variable.

- Find the path to the antlr-*.jar file installed with brew. On my system
  it was located in `/opt/homebrew/Cellar/antlr/4.10.1/`.
- Add this to the CLASSPATH env var in .zshrc. For example:
```
export CLASSPATH=/opt/homebrew/Cellar/antlr/4.10.1/antlr-4.10.1-complete.jar:$CLASSPATH
```

## Building

- Generate python files from the grammar.

```shell
make generate_grammar
```
