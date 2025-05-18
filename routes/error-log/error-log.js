var express = require("express");
var router = express.Router();
const log = require('log-to-file');

ErrorLog = (req, e) => {

    let Param = 'Params: None';
    let User = 'User : Common'
      if(Object.keys(req.params).length !== 0) Param = 'Params: ' + JSON.stringify(req.params)
      else if(Object.keys(req.query).length !== 0) Param = 'Params: ' + JSON.stringify(req.query)
      else if(Object.keys(req.body).length !== 0) {
          Param = 'Params: ' + JSON.stringify(req.body)
          User = 'User: ' + (req.body.UserName ? req.body.UserName : 'Common')
      }
  
      let l = '\n' + 'Endpoint: ' + req.method + ' ' + req.originalUrl + '\n' + Param + '\n' + 
              'IP: ' + req.socket.remoteAddress + '\n' + User + '\n' + 'Error: ' + e + '\n'
      log(l, 'log/log.txt');
    //console.log("error", req.query);
  }

module.exports = router;

