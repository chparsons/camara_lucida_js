
//TODO make camara_lucida.js
var cml = cml || {};

cml.KinectWS = function(opt)
{
	opt = opt || {};
	var def = {
		url: 'localhost',
		port: '9093',
		protocol: 'of-protocol',
		on_update: undefined,
		on_open: undefined,
		on_close: undefined
	};
	for (var k in def)
		if (opt[k] === undefined)
			opt[k] = def[k];

	var header = { 
		width: 640, height: 480, channels: 1, 
		size: 640 * 480
	};

	var _canvas = document.createElement('canvas'),
	    ctx = _canvas.getContext('2d'),
	    img_data;

	update_size();

	this.canvas = function() { return _canvas; }

	//TODO if Firefox: new MozWebSocket(url,protocol);
	var socket = new WebSocket(
			'ws://'+opt.url+':'+opt.port+'/', 
			opt.protocol );
	socket.binaryType = 'arraybuffer';
	socket.onopen = on_open;
	socket.onmessage = on_message;
	socket.onclose = on_close;	

	function on_message( e )
	{
		if ( update_kinect_buff( e ) )
		{
			call( opt.on_update );
		}
		else
		{
			update_header( e );
		}
		update_size();
	}

	function update_kinect_buff( e )
	{
		if ( ! (e.data instanceof ArrayBuffer) )
			return false;

		var data = img_data.data;

		var bytearray = new Uint8Array( e.data );

		var depth,
		    i, 
		    len = data.length, //i.e. (w * h * 4)
		    bai = 0;

		for (i = 0; i < len; i += 4)
		{
			depth = bytearray[bai++];
			data[i] = depth; 
			data[i + 1] = depth;
			data[i + 2] = depth;
			data[i + 3] = 255;
		}

		ctx.putImageData( img_data, 0, 0 );

		return true;
	}

	function update_header( e )
	{
		if (typeof e.data !== 'string') 
			return false;

		var _data = e.data.split(':');

		header.width = _data[0];
		header.height = _data[1];
		header.channels = _data[2];
		header.size = _data[3];

		return true;
	}

	function update_size()
	{
		var w = header.width,
		    h = header.height;

		if ( _canvas.width == w && _canvas.height == h )
			return;
		
		_canvas.width = w;
		_canvas.height = h;

		img_data = ctx.getImageData(0, 0, w, h);
	}

	function on_open()
	{
		call( opt.on_open );
	}

	function on_close()
	{
		call( opt.on_close );
	}

	function call(fn)
	{
		if (typeof fn === 'function') fn();
	}
}

