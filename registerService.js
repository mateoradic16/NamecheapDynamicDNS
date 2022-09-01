var Service = require('node-windows').Service;
var svc = new Service({
 name:'NameCheap Dynamic DNS',
 description: 'Periodically Updates DNS for specified Domain Names registered on NameCheap.',
 script: 'C:\\NodeJS Scripts\\NamecheapDynamicDNS\\index.js'
});

svc.on('install',function(){
 svc.start();
});

svc.install();