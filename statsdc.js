var udp = require('./lib/udp');

var init = function(options, callback) {
  var err = validate(options);

  if (err) {
    return callback && callback(err);
  }

  return udp.init(options.host, options.port, callback);
};

var validate = function(options) {
  if (!options.host) {
    return 'options.host must be set';
  }

  if (!options.port) {
    return 'options.port must be set';
  }
};

var ms = function(name, time, sample) {
  return sendMetric(name, time, 'ms', sample);
};

var c = function(name, value, sample) {
  return sendMetric(name, value || 1, 'c', sample);
};

var g = function(name, value, sample) {
  return sendMetric(name, value, 'g', sample);
};

var close = function() {
  return udp.close();
};

var sendMetric = function(name, value, type, sample) {
  var data = [name, ':', value, '|', type];

  if (sample) {
    data.push('|@' + sample);
  }

  return udp.send(data.join(''));
};

module.exports = {
  init: init,
  close: close,
  ms: ms,
  c: c,
  g: g
};