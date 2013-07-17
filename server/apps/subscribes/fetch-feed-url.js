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
        var url = $("link[type=application/rss+xml]", $("html"), true);
        if (!url) { return this.exit("Cannot find feed url"); }

        this.emit(url.attribs.href);
      });
    }
  });

  nodeio.start(job, { silent: true }, cb, true);
};

