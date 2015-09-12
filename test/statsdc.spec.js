var expect = require('expect.js');
var stats = require('../statsdc');
var udpMock = require('./mocks/udp-mock');

afterEach(stats.close);
afterEach(udpMock.reset);

udpMock.activate();

describe('statsdc', function() {
  it('exposes correct public interface', function() {
    expect(Object.keys(stats)).to.eql(['init', 'close', 'ms', 'c', 'g']);
  });

  it('fails when no host is specified', function(done) {
    stats.init({ port: 8080 }, function(err) {
      expect(err).to.match(/host/);
      return done();
    });
  });

  it('fails when no port is specified', function(done) {
    stats.init({ host: 'google.com' }, function(err) {
      expect(err).to.match(/port/);
      return done();
    });
  });

  it('fails when host is invalid', function(done) {
    stats.init({ host: '---', port: 8080 }, function(err) {
      expect(err).to.match(/ENOTFOUND/);
      return done();
    });
  });

  it('sends correct metric for timing', function(done) {
    stats.init({ host: 'localhost', port: 8080 }, function(err) {
      expect(err).to.be(undefined);

      stats.ms('timer-1', 250);
      expect(udpMock.getLastDatagram()).to.be('timer-1:250|ms');

      stats.ms('timer-2', 500, 0.5);
      expect(udpMock.getLastDatagram()).to.be('timer-2:500|ms|@0.5');

      return done();
    });
  });

  it('sends correct metric for counters', function(done) {
    stats.init({ host: 'localhost', port: 8080 }, function(err) {
      expect(err).to.be(undefined);

      stats.c('counter-1', 1);
      expect(udpMock.getLastDatagram()).to.be('counter-1:1|c');

      stats.c('counter-2', 2, 0.1);
      expect(udpMock.getLastDatagram()).to.be('counter-2:2|c|@0.1');

      return done();
    });
  });

  it('sends correct metric for gauges', function(done) {
    stats.init({ host: 'localhost', port: 8080 }, function(err) {
      expect(err).to.be(undefined);

      stats.g('gauge-1', 50);
      expect(udpMock.getLastDatagram()).to.be('gauge-1:50|g');

      stats.g('gauge-2', 100, 0.05);
      expect(udpMock.getLastDatagram()).to.be('gauge-2:100|g|@0.05');

      return done();
    });
  });

  it('sends correct metric with prefix for gauges', function(done) {
    stats.init({ host: 'localhost', port: 8080, prefix: 'some-app' }, function(err) {
      expect(err).to.be(undefined);

      stats.c('counter-1', 1);
      expect(udpMock.getLastDatagram()).to.be('some-app.counter-1:1|c');

      stats.g('gauge-1', 2);
      expect(udpMock.getLastDatagram()).to.be('some-app.gauge-1:2|g');

      stats.ms('timer-1', 3);
      expect(udpMock.getLastDatagram()).to.be('some-app.timer-1:3|ms');

      return done();
    });
  });
});