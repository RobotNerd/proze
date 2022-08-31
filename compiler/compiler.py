#!/usr/bin/python3
import antlr4

from generated.ProzeLexer import ProzeLexer
from generated.ProzeParser import ProzeParser
from listeners.text import TextListener


class UnsupportedFormatError(Exception):
    pass


class Compiler:

    def __init__(self, args, input_string):
        self._listener = self._create_listener(args)
        self._tree = self._create_parse_tree(input_string)

    def compile(self):
        walker = antlr4.ParseTreeWalker()
        walker.walk(self._listener, self._tree)

    @staticmethod
    def _create_listener(args):
        if args.format == 'text':
            return TextListener()
        raise UnsupportedFormatError(f'No compiler for format: {args.format}')

    @staticmethod
    def _create_parse_tree(input_text):
        chars = antlr4.InputStream(input_text)
        lexer = ProzeLexer(chars)
        tokens = antlr4.CommonTokenStream(lexer)
        parser = ProzeParser(tokens)
        parser.buildParseTrees = True
        return parser.document()
