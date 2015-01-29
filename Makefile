all: clean scripts copy

clean:
	rm -rf dist

scripts:
	cd app; \
	6to5 *.js --out-dir ../dist

copy:
	cp -r app/node_modules dist/node_modules \
	| cp app/package.json dist

watch:
	fswatch -0 app | xargs -0 -n 1 -I {} make scripts

.PHONY: all clean scripts copy