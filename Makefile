build: generate_grammar

clean:
	rm -fr ./compiler/generated/*

generate_grammar: clean
	antlr -Dlanguage=Python3 -o ./compiler/generated ./grammar/Proze.g4
	mv ./compiler/generated/grammar/* ./compiler/generated/
	rm -r ./compiler/generated/grammar

test:
	(cd compiler && python3 -m unittest)
