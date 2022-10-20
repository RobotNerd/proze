
build: build_all

# For displaying newlines
define n


endef

clean:
	$(info $n--- Cleaning)
	rm -fr ./compiler/dist/*

build_all:
	$(info $n--- Building grammar and typescript)
	(cd compiler && npm run build-all)

build_compiler:
	$(info $n--- Building compiler)
	(cd compiler && npm run build)

test:
	(cd compiler && npm run test)
