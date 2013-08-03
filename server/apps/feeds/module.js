
/**
 * Module dependencies.
 */

var knit = require("knit");

exports = module.exports = function() {
  knit.config(function(bind) {
    bind("feedRequest").to(require("./feed-request"));
  });
};
