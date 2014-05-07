var zonar = require("zonar");
var helper = require("service.helper");

var name = "foo";

// zonar
var node = zonar.create({
    "name" : name,
    "net" : "frukost",
});

helper.handleInterrupt(node);
node.start();
