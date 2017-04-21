var five            = require("johnny-five");
var Emitter         = require("events").EventEmitter;
const request       = require('request');
function Lights(board, socket) {
  if (!(this instanceof Lights)) {
    return new Lights(board);
  }
  var ledGreen;
  var ledRed;
  var _self = this;
  board.on("ready", function() {
    ledGreen = new five.Led(13);
    ledRed   = new five.Led(12);
    console.log('Ready Lights');
    getInitialData();
  });

  // -- Handle LEDs ------------------------------------------------------------------------------------------------- --

  function turnOn(led) {
    if(led){
      led.on();
    }
  }
  function turnOff(led) {
    if(led){
      led.off();
    }
  }

  function parkingIsFull(){
    turnOn(ledRed);
    turnOff(ledGreen);
  }
  function parkingHasSpace(){
    turnOn(ledGreen);
    turnOff(ledRed);
  }

  // -- GET INITIAL DATA STATE FROM SERVER -------------------------------------------------------------------------- --

  function getInitialData(){
    var options = {
      uri: process.env.SERVER_URL+'/api/parking',
      headers: [
        {
          name: 'content-type',
          value: 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      ],
      form: {
        id: process.env.PARKING_ID,
      }
    };
    request.post(options, function(err, resp, body) {
      if(err){
        return null;
      }

      checkStatus(JSON.parse(body).isFull);
    });
  }
  socket.on('parking_change', function(data){
    checkStatus(data.isFull);
  });

  socket.on('connect', function(){
    getInitialData();
  });

  function checkStatus(state) {
    if (state === true ) {
      parkingIsFull();
    }else {
      parkingHasSpace();
    }
  }

}



Lights.prototype.__proto__ = Emitter.prototype;
module.exports = Lights;
