var zmq = require('zmq');
var proxy = 'tcp://127.0.0.1:12346';

var socket = zmq.socket('req');

socket.connect(proxy)
socket.on("message" , function(msg) {
    console.log("got response : " + msg);
});

socket.send("ohoy");
