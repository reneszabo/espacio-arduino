var five            = require("johnny-five");
var Emitter         = require("events").EventEmitter;
function ProximitySensor(board) {
  if (!(this instanceof ProximitySensor)) {
    return new ProximitySensor(board);
  }

  var statusSensorOne = false;
  var statusSensorTwo = false;
  var status          = [];
  var traceOut        = [{ s1: false, s2: true }, { s1: true, s2: true }, { s1: true, s2: false }, { s1: false, s2: false }];
  var traceIn         = [{ s1: true, s2: false }, { s1: true, s2: true }, { s1: false, s2: true }, { s1: false, s2: false }];
  var ledOne;
  var ledTwo;
  var _self = this;
  Emitter.call(this);
  board.on("ready", function() {
    ledOne = new five.Led(8);
    ledTwo = new five.Led(7);
    var proximity = new five.Proximity({
      controller: "HCSR04",
      pin: "A0"
    }).on("data", function() {
      var status = isClose(this.cm);
      if(statusSensorOne !== status){
        statusSensorOne = status;
        status?ledOne.on():ledOne.off();
        showSensorsStatus();
      }
    });
    var proximity2 = new five.Proximity({
      controller: "HCSR04",
      pin: "A1"
    }).on("data", function() {
      var status = isClose(this.cm);
      if(statusSensorTwo !== status){
        statusSensorTwo = status;
        status?ledTwo.on():ledTwo.off();
        showSensorsStatus();
      }
    });
  });
  function showSensorsStatus() {
    status.push({s1: statusSensorOne, s2: statusSensorTwo});
    if( statusSensorOne===false && statusSensorTwo === false) {
      readMove(status.slice(0));
      status = [];
    }
  }
  function isClose(s) {
    return s<30?true:false;
  }
  function readMove(statusClone) {
    console.log(statusClone);
    if(statusClone.length == 4) {
      var data = { direction: 'IN' };
      if(traceOut.every(function(element,index){return (element.s1 === statusClone[index].s1) && (element.s2 === statusClone[index].s2); }) ) {
        data.direction = 'OUT';
        _self.emit("data", data);
      } else if (traceIn.every(function(element,index){return (element.s1 === statusClone[index].s1) && (element.s2 === statusClone[index].s2); }) ) {
        data.direction = 'IN';
        _self.emit("data", data);
      }
    }
  }
}
ProximitySensor.prototype.__proto__ = Emitter.prototype;
module.exports = ProximitySensor;
