
build: build_all

define n


endef

clean:
	$(info $n--- Cleaning)
	rm -fr ./compiler-typescript/generated/* ./compiler-typescript/dist/*

build_all:
	$(info $n--- Building grammar and typescript)
	(cd compiler-typescript && npm run build-all)

generate_grammar: clean
	$(info $n--- Building grammar)
	(cd compiler-typescript && npm run antlr4ts)

build_compiler:
	$(info $n--- Building compiler)
	(cd compiler-typescript && npm run build)

test:
	(cd compiler-typescript && npm run test)
