var zmq = require("zmq");

var externalPub = 'tcp://127.0.0.1:5555';
var internalSub = 'tcp://127.0.0.1:5556';
var hwm = 1000;
var verbose = 0;

var subSock = zmq.socket('xsub');
subSock.identity = 'subscriber' + process.pid;
subSock.bindSync(internalSub);

var pubSock = zmq.socket('xpub');
pubSock.identity = 'publisher' + process.pid;
pubSock.setsockopt(zmq.ZMQ_SNDHWM, hwm); //  Set high water mark for outbound messages

// By default xpub only signals new subscriptions
// Settings it to verbose = 1 , will signal on every new subscribe
pubSock.setsockopt(zmq.ZMQ_XPUB_VERBOSE, verbose);
pubSock.bindSync(externalPub);

// When we receive data on subSock , it means someone is publishing
subSock.on('message', function(data) {
    // We just relay it to the pubSock, so subscribers can receive it
    pubSock.send(data + " ( through external publisher )");
});

// When Pubsock receives a message , it's subscribe requests
pubSock.on('message', function(data, bla) {
    // The data is a slow Buffer
    // The first byte is the subscribe (1) /unsubscribe flag (0)
    var type = data[0]===0 ? 'unsubscribe' : 'subscribe';
    // The channel name is the rest of the buffer
    var channel = data.slice(1).toString();
    console.log(type + ':' + channel);
    // We send it to subSock, so it knows to what channels to listen to
    subSock.send(data);
});


function proxyPublish(addr){
    var pub = zmq.socket('pub');
    var sub = zmq.socket('sub');

    pub.connect(internalSub);

    sub.connect(addr);
    sub.subscribe("");

    sub.on("message", function(msg){
        console.log("got msg : " + msg.toString("utf8"));
        pub.send(msg + " ( through internalproxy ) ");
    });
}

function simpleTestSub(){
    proxyPublish("tcp://127.0.0.1:6000");
}

simpleTestSub();
