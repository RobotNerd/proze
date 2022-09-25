
build: build_all

define n


endef

clean:
	$(info $n--- Cleaning)
	rm -fr ./compiler/generated/* ./compiler/dist/*

build_all:
	$(info $n--- Building grammar and typescript)
	(cd compiler && npm run build-all)

generate_grammar: clean
	$(info $n--- Building grammar)
	(cd compiler && npm run antlr4ts)

build_compiler:
	$(info $n--- Building compiler)
	(cd compiler && npm run build)

test:
	(cd compiler && npm run test)
