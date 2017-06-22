'use strict';
var net = require('net');
var HS_PLUG_PORT = 9999;
var HS_PLUG_HOST = '$$LOCAL-IP';
/*
 * Device Controller
 * Events on that device from the Brain will be forwarded here for handling.
 */
module.exports.onButtonPressed = function onButtonPressed(deviceid, name) {
  if (deviceid === "power-on") {
    var b64string = "AAAAKtDygfiL/5r31e+UtsWg1Iv5nPCR6LfEsNGlwOLYo4HyhueT9tTu36Lfog==";
    var magic = Buffer.from(b64string, 'base64');
    var client = new net.Socket();
    client.connect(HS_PLUG_PORT, HS_PLUG_HOST, function() {
    console.log('CONNECTED TO: ' + HS_PLUG_HOST + ':' + HS_PLUG_PORT + ' / Power ON sent.');
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(magic);
    client.destroy();
      });
  };
  if (deviceid === "power-off") {
    var b64string = "AAAAKtDygfiL/5r31e+UtsWg1Iv5nPCR6LfEsNGlwOLYo4HyhueT9tTu3qPeow==";
    var magic = Buffer.from(b64string, 'base64');
    var client = new net.Socket();
    client.connect(HS_PLUG_PORT, HS_PLUG_HOST, function() {
    console.log('CONNECTED TO: ' + HS_PLUG_HOST + ':' + HS_PLUG_PORT + ' / Power OFF sent.');
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(magic);
    client.destroy();
      });
  };
}