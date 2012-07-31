all: camara_lucida.js

debug:
	make DEBUG=1

camara_lucida.js: \
	src/camara_lucida.js \
	src/kinect_ws.js

%.js: 
	cat $^ > $@.cat
ifdef DEBUG
	cp $@.cat $@
else
	java -jar compiler/yuicompressor-2.4.7.jar --type js -o $@ $@.cat
endif
	rm $@.cat

%.css: 
	cat $^ > $@.cat
ifdef DEBUG
	cp $@.cat $@
else
	java -jar compiler/yuicompressor-2.4.7.jar --type css -o $@ $^
endif
	rm $@.cat

clean:
	-rm \
		camara_lucida.js

