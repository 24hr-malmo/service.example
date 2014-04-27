var zmq = require('zmq');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

var sock = zmq.socket('sub');

// Instead of binding our pub socket, we connect to the PUB -> XSUB
sock.connect('tcp://127.0.0.1:5555');
sock.subscribe("somechannel");

sock.on("message", function(msg){
    console.log("data");
    for(var j = 0, jj = socketioClients.length; j < jj; j++){
        socketioClients[j].emit("msg", msg.toString());
    }
});

// webpart
var socketioClients = [];
app.listen(8080);
console.log("listening on 8080");

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
    socketioClients.push(socket);
    socket.emit("msg", "hello, socketio connected");

    socket.on('disconnect', function(){
        socketioClients.splice(socketioClients.indexOf(socket), 1);
    });
});
