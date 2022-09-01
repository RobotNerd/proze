#!/usr/bin/python3
from generated.ProzeParser import ProzeParser
from generated.ProzeListener import ProzeListener


class TextListener(ProzeListener):

    def __init__(self):
        self._output = ''
    
    def get_output(self):
        return self._output
    
    def enterTitle_tag(self, ctx: ProzeParser.Title_tagContext):
        super().enterTitle_tag(ctx)
        result = []
        for word in ctx.markup_value().WORD():
            result.append(word.getText())
        self._output += ' '.join(result) + '\n'
