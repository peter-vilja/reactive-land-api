all: clean scripts copy

clean:
	rm -rf dist

scripts:
	cd app; \
	../node_modules/babel/bin/babel/index.js *.js --out-dir ../dist

copy:
	cp -r ./node_modules ./dist/node_modules
	cp ./package.json dist

watch:
	fswatch -0 app | xargs -0 -n 1 -I {} make scripts

.PHONY: all clean scripts copy
