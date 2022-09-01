#!/usr/bin/python3
import unittest

from compiler import Compiler


class MockArgs:
    format = 'text'


class TestStructuralMarkup(unittest.TestCase):

    def test_title_only(self):
        test_string = 'Title: My Book\n'
        compiler = Compiler(MockArgs, test_string)
        output = compiler.compile()
        self.assertEqual(output, 'My Book\n')
