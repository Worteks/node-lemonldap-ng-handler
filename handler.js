// Generated by CoffeeScript 1.9.3
(function() {
  var http, https, llngHandler;

  http = require('http');

  https = require('https');

  require('llngconf');

  llngHandler = (function() {
    function llngHandler() {
      this.confObj = new LemonldapConf;
    }

    return llngHandler;

  })();

  exports.handler = new llngHandler;

}).call(this);
