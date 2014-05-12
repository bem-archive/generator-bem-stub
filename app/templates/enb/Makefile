NPM_BIN = node_modules/.bin
ENB = $(NPM_BIN)/enb
BOWER = $(NPM_BIN)/bower

ifneq ($(YENV),production)
	YENV=development
endif

.PHONY: server
server: npm_deps bower_deps build
	$(ENB) server

.PHONY: build
build: npm_deps bower_deps
	$(ENB) make --no-cache

.PHONY: clean
clean: npm_deps
	$(ENB) make clean

.PHONY: bower_deps
bower_deps: npm_deps
	$(BOWER) install

.PHONY: npm_deps
npm_deps:
	npm install