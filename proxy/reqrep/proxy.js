var zmq      = require('zmq')
  , remote = zmq.socket('req')
  , localservice  = zmq.socket('rep');

remote.connect('tcp://127.0.0.1:12345');
localservice.bindSync('tcp://*:12346');

remote.on('message', function() {
    console.log("got message from localservice");
    var args = Array.apply(null, arguments);
    localservice.send(args);
});

backend.on('message', function() {
    var args = Array.apply(null, arguments);
    console.log("passing request to remote");
    remote.send(args);
});
