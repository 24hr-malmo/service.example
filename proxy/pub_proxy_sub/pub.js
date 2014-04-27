// Beware if pub is started before a subcriber listening, it just goes into /dev/null space
var zmq = require('zmq');
var sock = zmq.socket('pub');

// Instead of binding our pub socket, we connect to the PUB -> XSUB
sock.bindSync('tcp://*:6000');


function sendData(){
    console.log("sending some data...");
    sock.send('somechannel (' + new Date()  + ') this is a somechannel message');
    console.log("sent.");
}

setInterval(sendData, 5000);
sendData();
