var zmq = require('zmq');
var port = 'tcp://*:12345';

var socket = zmq.socket('rep');

// simply echo any request
socket.bind(port, function(err) {
    if (err) throw err;
    console.log('bound on ' + port);

    socket.on('message', function(data) {
        console.log("sending response");
        socket.send("ECHO : " + data);
    });
});
