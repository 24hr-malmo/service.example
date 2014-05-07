var zonar = require("zonar");
var helper = require("service.helper");

// zonar
var node = zonar.create({
    "name" : "foo",
    "net" : "frukost",
});

helper.handleInterrupt(node);
node.start();
