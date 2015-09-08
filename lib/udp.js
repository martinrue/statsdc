var dns = require('dns');
var dgram = require('dgram');

var config = {};

var init = function(host, port, callback) {
  dns.lookup(host, function(err, address) {
    if (err) {
      return callback && callback(err);
    }

    config.host = address;
    config.port = port;
    config.socket = dgram.createSocket('udp4');

    return callback && callback();
  });
};

var send = function(data) {
  if (config.socket) {
    var buffer = new Buffer(data);
    config.socket.send(buffer, 0, buffer.length, config.port, config.host);
  }
};

var close = function() {
  if (config.socket) {
    config.socket.close();
    config.socket = null;
  }
};

module.exports = {
  init: init,
  send: send,
  close: close
};