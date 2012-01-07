clean:
	./js naxx/scripts/clean.js
all:
	./js naxx/scripts/build.js
	./js jquery/generate/page naxx index.html
