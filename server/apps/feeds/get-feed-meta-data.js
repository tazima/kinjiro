
/**
 * Module dependencies.
 */

var nodeio = require("node.io"),
    request = require('request'),
    FeedParser = require('feedparser');

/**
 * Expose `getFeedMetaData`.
 */

exports = module.exports = getFeedMetaData;

/**
 * Get rss feed meta data of `url`.
 * First try to parse feed.
 * If get `Not feed url` error then try to scraping `url`
 * to find feed url and retry to parse feed.
 * 
 * @param {String} url
 * @param {Function} cb
 */

function getFeedMetaData(url, cb) {
  var job = new nodeio.Job({

    input: [url],

    run: function(url) {
      var job = this,
          emit = job.emit.bind(job);

      request(url)
        .pipe(new FeedParser())
        .on("error", function(err) {
          console.log("Get feed, first fail + " + url);
          console.log("Get feed, try scraping + " + url);

          job.getHtml(url, function(err, $) {
            console.log("get html");
            if (err) { return job.exit(err); }
            var rssUrl = $("link[type=application/rss+xml]", $("html"), true),
                atomUrl = $("link[type=application/atom+xml]", $("html"), true),
                feedUrl = rssUrl || feedUrl;

            if (!feedUrl) { return job.exit("Cannot find feed url"); }

            request(feedUrl.attribs.href)
              .pipe(new FeedParser())
              .on("error", function(err) {
                console.log("Get feed, second fail " + url);
                console.log("Get feed, abort " + url);
                return job.exit(err);
              })
              .on("meta", emit);
          });
        })
        .on("meta", emit);
    }

  });

  nodeio.start(job, { silent: true }, cb, true);
};

