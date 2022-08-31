#!/usr/bin/python3
from logging.config import listen
from typing import List
import antlr4

from generated.ProzeLexer import ProzeLexer
from generated.ProzeParser import ProzeParser
from generated.ProzeListener import ProzeListener

test_input = 'Title: My Book\n'


class Listener(ProzeListener):
    
    def enterTitle_tag(self, ctx: ProzeParser.Title_tagContext):
        super().enterTitle_tag(ctx)
        for word in ctx.markup_value().WORD():
            print(word.getText())

chars = antlr4.InputStream(test_input)
lexer = ProzeLexer(chars)
tokens = antlr4.CommonTokenStream(lexer)
parser = ProzeParser(tokens)

parser.buildParseTrees = True
tree = parser.document()
listener = Listener()

walker = antlr4.ParseTreeWalker()
walker.walk(listener, tree)
