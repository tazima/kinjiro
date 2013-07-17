/**
 * Module dependencies.
 */

var nodeio = require("node.io");

exports = module.exports = function(originalUrl, cb) {
  var job = new nodeio.Job({
    input: [originalUrl],

    run: function(originalUrl) {
      this.getHtml(originalUrl, function(err, $) {
        if (err) { return this.exit(err); }

        var url = $("link[type=application/rss+xml]").attribs.href;
        if (url.length < 1) { return this.exit("Cannot find feed url"); }

        this.emit(url);
      });
    }
  });

  nodeio.start(job, { silent: true }, cb, true);
};

