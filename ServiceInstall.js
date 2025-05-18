var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'MozziTrack',
  description: 'MozziTrack',
  script: 'D:\\Final Project\\Mozzi Tracker_live\\BE\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();