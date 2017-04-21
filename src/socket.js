module.exports = function () {
  var io      = require('socket.io-client');
  var Emitter = require("events").EventEmitter;
  var socket = io(process.env.SERVER_URL);
  console.log('SOCKET CONFIG');
  socket.on('connect', function(){
    console.log("Server connect - " + socket.id);
  });
  socket.on('disconnect', function(){
    console.log("Server is Down");
  });
  socket.on('reconnect', function(){
    console.log("Server reconnected");
  });
  return socket;
}
