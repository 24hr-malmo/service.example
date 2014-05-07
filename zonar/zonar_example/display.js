var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var zonar = require("zonar");
var helper = require("service.helper")

var socketioClients = [];

// zonar
var node = zonar.create({
    name : "display",
    net : "frukost"
});

var nodes = null;

function updateNodesList(){
    nodes = node.getList();
    console.log("nodelist update");

    for(var n in nodes){
        populateDoc(nodes[n]);
    }

    for(var j = 0, jj = socketioClients.length; j < jj; j++){
        socketioClients[j].emit("updatedList", nodes);
    }
}

function populateDoc(remoteNode){
    return;

    helper.getService(node, remoteNode.name + ".doc", function(err, request){

        if (err != false){
            console.log("ERROR");
            console.log(err);
            return;
        }

        request.send("doc");

        request.on("message", function(msg){
            try {
                var data = JSON.parse(msg.toString("utf8"));
                remoteNode.doc = data.doc;
            } catch (e) {
                // invalid data
                console.log("invalid data " + msg.toString());
            }
            console.log(msg.toString("utf8"));
            request.close();
        });
    });
}

node.on('dropped', updateNodesList);
node.on('found', updateNodesList);

helper.handleInterrupt(node);

node.start();

// webserver
app.listen(8080);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
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

    socket.on('disconnect', function(){
        socketioClients.splice(socketioClients.indexOf(socket), 1);
    });

    socket.emit('updatedList', node.getList());
});
