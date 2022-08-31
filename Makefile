build: generate_grammar

generate_grammar: clean
	antlr -Dlanguage=Python3 -o ./compiler/generated ./grammar/Proze.g4
	mv ./compiler/generated/grammar/* ./compiler/generated/
	rm -r ./compiler/generated/grammar

clean:
	rm -fr ./compiler/generated/*
