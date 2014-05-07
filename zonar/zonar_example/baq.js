var zonar = require("zonar");
var helper = require("service.helper");

// zonar
var node = zonar.create({
    "name" : "baq",
    "net" : "frukost",
});

helper.handleInterrupt(node);
node.start();
