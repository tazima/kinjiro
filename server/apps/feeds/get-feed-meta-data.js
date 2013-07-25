
/**
 * Module dependencies.
 */

var url = require("url"),
    nodeio = require("node.io"),
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

function getFeedMetaData(originalUrl, cb) {
  var job = new nodeio.Job({

    input: [originalUrl],

    run: function(originalUrl) {
      var job = this,
          emit = job.emit.bind(job);

      request(originalUrl)
        .pipe(new FeedParser())
        .on("error", function(err) {
          console.log("Get feed, first fail + " + originalUrl);
          console.log("Get feed, try scraping + " + originalUrl);

          job.getHtml(originalUrl, function(err, $) {
            console.log("get html");
            if (err) { return job.exit(err); }
            var rssUrl = $("link[type=application/rss+xml]", $("html"), true),
                atomUrl = $("link[type=application/atom+xml]", $("html"), true),
                feedUrl = rssUrl || feedUrl;

            if (!feedUrl) { return job.exit("Cannot find feed url"); }

            feedUrl = feedUrl.attribs.href;
            if (feedUrl.match(/^\/.*/)) { feedUrl = url.resolve(originalUrl, feedUrl); }
            console.log(feedUrl);

            request(feedUrl)
              .pipe(new FeedParser())
              .on("error", function(err) {
                console.log("Get feed, second fail " + originalUrl);
                console.log("Get feed, abort " + originalUrl);
                return job.exit(err);
              })
              .on("meta", emit);
          });
        })
        .on("meta", emit);
    }

  });

  nodeio.start(job, { silent: true }, cb, true);
}

