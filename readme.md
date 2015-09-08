# statsdc
A tiny [statsd](https://github.com/etsy/statsd) client that supports timing, counters and gauges.

### Installation

```
npm install https://github.com/martinrue/statsdc/tarball/master
```

### Usage

```javascript
var stats = require('statsdc');

stats.init({ host: 'localhost', port: 8125 }, function(err) {
  // set timer to 100ms
  stats.ms('some-timer', 100);

  // set timer to 500ms, sampling one in ten events
  stats.ms('some-timer', 500, 0.1);

  // set gauge to 11
  stats.g('some-gauge', 11);

  // increment counter by 1
  stats.c('some-counter', 1);

  // decrement counter by 10
  stats.c('some-counter', -10);
});
```

### Notes

If `host` is set to a hostname rather than an IP address, a single DNS lookup is performed and cached during init.

If you need to shut down the client, `stats.close()` will gracefully unbind the UDP socket.

Metrics are submitted to [statsd](https://github.com/etsy/statsd) on every respective call via UDP. A single UDP socket is created during init and reused.

### License
MIT