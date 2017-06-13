'use strict';
var net = require('net');
var TPLINK_PORT = 9999;
var HS100_HOST = '$$LOCAL-IP';
var HS110_HOST = '$$LOCAL-IP';
/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onButtonPressed = function onButtonPressed(deviceid, name) {
  if (deviceid === "power-on-HS100") {
    var b64string = "AAAAKtDygfiL/5r31e+UtsWg1Iv5nPCR6LfEsNGlwOLYo4HyhueT9tTu36Lfog==";
    var magic = Buffer.from(b64string, 'base64');
    var client = new net.Socket();
    client.connect(TPLINK_PORT, HS100_HOST, function() {
    console.log('CONNECTED TO: ' + HS100_HOST + ':' + TPLINK_PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(magic);
    client.destroy();
      });
  };
  if (deviceid === "power-off-HS100") {
    var b64string = "AAAAKtDygfiL/5r31e+UtsWg1Iv5nPCR6LfEsNGlwOLYo4HyhueT9tTu3qPeow==";
    var magic = Buffer.from(b64string, 'base64');
    var client = new net.Socket();
    client.connect(TPLINK_PORT, HS100_HOST, function() {
    console.log('CONNECTED TO: ' + HS100_HOST + ':' + TPLINK_PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(magic);
    client.destroy();
      });
  }
  if (deviceid === "power-off-HS110") {
    var b64string = "AAAAKtDygfiL/5r31e+UtsWg1Iv5nPCR6LfEsNGlwOLYo4HyhueT9tTu3qPeow==";
    var magic = Buffer.from(b64string, 'base64');
    var client = new net.Socket();
    client.connect(TPLINK_PORT, HS110_HOST, function() {
    console.log('CONNECTED TO: ' + HS110_HOST + ':' + TPLINK_PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(magic);
    client.destroy();
      });
  };
  if (deviceid === "power-on-HS110") {
    var b64string = "AAAAKtDygfiL/5r31e+UtsWg1Iv5nPCR6LfEsNGlwOLYo4HyhueT9tTu36Lfog==";
    var magic = Buffer.from(b64string, 'base64');
    var client = new net.Socket();
    client.connect(TPLINK_PORT, HS110_HOST, function() {
    console.log('CONNECTED TO: ' + HS110_HOST + ':' + TPLINK_PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(magic);
    client.destroy();
      });
  };
};