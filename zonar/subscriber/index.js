var helper = require('service.helper');
var zonar = require('zonar');

var z = zonar.create({ net : '24hr', name: 'example_subscriber'});

helper.handleInterrupt(z);

z.start(function(){

    console.log("Connecting to service/Waiting for service to go online...")

    helper.getService(z,'example_publisher.sampledata', function(err, subSock){

        if(err){
            console.log(err);
            return;
        }

        console.log("Connected!");

        console.log("Subscribing to everything")
        subSock.subscribe("");

        console.log("Listening for messages.");
        subSock.on("message", function(msg){
            console.log("Got message : " + msg.toString());
        });
    });
});
