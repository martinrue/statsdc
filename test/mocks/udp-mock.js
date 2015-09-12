var udp = require('../../lib/udp');

var lastDatagram;

var activate = function() {
  udp.send = function(data) {
    lastDatagram = data;
  };
};

var getLastDatagram = function() {
  return lastDatagram;
};

var reset = function() {
  lastDatagram = '';
};

module.exports = {
  activate: activate,
  getLastDatagram: getLastDatagram,
  reset: reset
};