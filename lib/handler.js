(function() {
  var conf, fetchId, forbidden, goToPortal, grant, isUnprotected, resolveAlias, retrieveSession, sendHeaders;

  conf = null;

  exports.init = function(args) {
    conf = require('./handlerConf').init(args);
    return exports;
  };

  exports.run = function(req, res, next) {
    var id, protection, str, uri, vhost;
    vhost = req.hostname;
    uri = 'http://' + req.headers.host + req.url;
    if (conf.tsv.maintenance[vhost]) {
      console.log('TODO');
    }
    if (conf.tsv.cda && uri.replace(new RegExp("[\?&;](" + cn + "(http)?=\w+)$", '', 'i'))) {
      str = RegExp.$1;
    }
    protection = isUnprotected(uri);
    if (protection === 'skip') {
      return next;
    }
    if (id = fetchId(req) && retrieveSession(id)) {
      if (!grant(req)) {
        return forbidden(req);
      }
      sendHeaders(req, res, next);
      return next;
    } else if (protection === 'unprotect') {
      return next;
    } else {
      return goToPortal(res, uri);
    }
  };

  grant = function(req) {
    var i, j, len, ref, rule, vhost;
    vhost = resolveAlias();
    if (conf.tsv.defaultCondition[vhost] == null) {
      console.log("No configuration found for " + vhost);
      return false;
    }
    ref = conf.tsv.locationRegexp[vhost];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      rule = ref[i];
      if (uri.match(rule)) {
        return conf.tsv.locationCondition[vhost][i]();
      }
    }
    return conf.tsv.defaultCondition[vhost];
  };

  forbidden = function(req) {
    var u, uri;
    uri = req.uri;
    if (u = conf.datas._logout) {
      return goToPortal(res, u, 'logout=1');
    }
    return 403;
  };

  sendHeaders = function(req, res, next) {};

  goToPortal = function(res, uri, args) {
    var urlc;
    urlc = conf.tsv.portal();
    if (uri) {
      urlc += '?url=' + new Buffer(uri).toString('base64');
    }
    if (args) {
      urlc += uri ? '&' : '?';
      urlc += args;
    }
    return res.redirect(urlc);
  };

  resolveAlias = function() {};

  fetchId = function(req) {};

  retrieveSession = function(id) {};

  isUnprotected = function(uri) {};

}).call(this);