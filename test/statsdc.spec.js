var expect = require('expect.js');
var stats = require('../statsdc');
var udp = require('./mocks/udp');

afterEach(stats.close);
afterEach(udp.reset);

udp.activateMock();

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
      expect(udp.getLastDatagram()).to.be('timer-1:250|ms');

      stats.ms('timer-2', 500, 0.5);
      expect(udp.getLastDatagram()).to.be('timer-2:500|ms|@0.5');

      return done();
    });
  });

  it('sends correct metric for counters', function(done) {
    stats.init({ host: 'localhost', port: 8080 }, function(err) {
      expect(err).to.be(undefined);

      stats.c('counter-1', 1);
      expect(udp.getLastDatagram()).to.be('counter-1:1|c');

      stats.c('counter-2', 2, 0.1);
      expect(udp.getLastDatagram()).to.be('counter-2:2|c|@0.1');

      return done();
    });
  });

  it('sends correct metric for gauges', function(done) {
    stats.init({ host: 'localhost', port: 8080 }, function(err) {
      expect(err).to.be(undefined);

      stats.g('gauge-1', 50);
      expect(udp.getLastDatagram()).to.be('gauge-1:50|g');

      stats.g('gauge-2', 100, 0.05);
      expect(udp.getLastDatagram()).to.be('gauge-2:100|g|@0.05');

      return done();
    });
  });
});