#!/usr/bin/python3
from generated.ProzeParser import ProzeParser
from generated.ProzeListener import ProzeListener


class TextListener(ProzeListener):
    
    def enterTitle_tag(self, ctx: ProzeParser.Title_tagContext):
        super().enterTitle_tag(ctx)
        for word in ctx.markup_value().WORD():
            print(word.getText())
