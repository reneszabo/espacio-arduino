require('dotenv').config();
const request           = require('request');
const five              = require("johnny-five");
const board             = new five.Board();
const socket            = require("./socket")();
const ProximitySensors  = require("./proximity-sensors");
const Lights            = require("./lights");
var proximitySensors  = new ProximitySensors(board);
var lights  = new Lights(board,socket);
var serverURL         = process.env.SERVER_URL;
console.log(serverURL);
proximitySensors.on("data", function(event) {
  console.log(event.direction);
  console.log(serverURL);
  var options = {
    uri: serverURL+'/api/parking/change',
    headers: [
      {
        name: 'content-type',
        value: 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    ],
    form: {
      id: process.env.PARKING_ID,
      status: event.direction
    }
  };
  request.post(options, function(err, resp, body) {
    console.log("ERROR: " + err);
    if(err){
      return null;
    }
    console.log(body);
  });

});