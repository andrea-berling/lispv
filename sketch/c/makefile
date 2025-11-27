compile:
	gcc -lm -o bin/main.out src/*.c

run:
	bin/main.out
	
watch:
	find src | entr -r make all

all:
	make compile
	make run


