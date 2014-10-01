var connect = require('connect');
var modRewrite = require('connect-modrewrite');

var server = connect()
	.use(modRewrite([
	    '^/test$ /index.html'
	  ]))
	.use(connect.static(__dirname + '/..')).
    listen(8081);

console.log("Server started and listen to http://127.0.0.1:8081, keycode 108 = Mode_switch Multi_key");