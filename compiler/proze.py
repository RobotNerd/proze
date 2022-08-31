#!/usr/bin/python3
import antlr4
import argparse

from generated.ProzeLexer import ProzeLexer
from generated.ProzeParser import ProzeParser
from listeners.text import TextListener


TEST_INPUT = 'Title: My Book\n'


class UnsupportedFormatError(Exception):
    pass


def compile(listener, tree):
    listener = TextListener()
    walker = antlr4.ParseTreeWalker()
    walker.walk(listener, tree)


def create_listener(args):
    if args.format == 'text':
        return TextListener()
    raise UnsupportedFormatError(f'No compiler for format: {args.format}')


def create_parse_tree(input_text):
    chars = antlr4.InputStream(input_text)
    lexer = ProzeLexer(chars)
    tokens = antlr4.CommonTokenStream(lexer)
    parser = ProzeParser(tokens)
    parser.buildParseTrees = True
    return parser.document()


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--format',
        type=str,
        default='text',
        choices=['text'],
        help='output document format (defaults to text)'
    )
    return parser.parse_args()


def run():
    args = parse_args()
    listener = create_listener(args)
    tree = create_parse_tree(TEST_INPUT)
    compile(listener, tree)


if __name__ == '__main__':
    run()
