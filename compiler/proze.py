#!/usr/bin/python3
import argparse

from compiler import Compiler


class UnsupportedFormatError(Exception):
    pass


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--format',
        type=str,
        default='text',
        choices=['text'],
        help='output document format (defaults to text)'
    )
    parser.add_argument(
        '--input-string',
        type=str,
        help='pass formatted proze a string, mainly for testing'
    )
    return parser.parse_args()


def run():
    args = parse_args()
    compiler = Compiler(args, args.input_string)
    print(compiler.compile())


if __name__ == '__main__':
    run()
