var udp = require('../../lib/udp');

var lastDatagram;

var activateMock = function() {
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
  activateMock: activateMock,
  getLastDatagram: getLastDatagram,
  reset: reset
};