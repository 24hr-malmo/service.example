var zmq = require('zmq');
var zonar = require('zonar');

var pubPort = 6666;

// setup
var broadcaster = zonar.create({
    net: '24hr',
    name: 'example_publisher',
    payload: { 'sampledata': {type : 'sub', port : pubPort}, 'doc': {type : "req", port : 6667 }}
});

broadcaster.start(function(){
    console.log("zonar broadcasting started.");

    var socket = zmq.socket('pub');

    var addr = "tcp://*:" + pubPort;
    socket.bindSync(addr);

    console.log("Listening for connections on %s", addr);

    setInterval(function(){
        console.log("Sending a message");
        socket.send("msg");
    }, 5000);

});
