
module.exports = function(userId) {
  return [
    {
      "name": "DailyJS",
      "url": "http://feeds.feedburner.com/dailyjs",
      "_user": userId
    },
    {
      "name": "ROR",
      "url": "http://weblog.rubyonrails.org/feed/atom.xml",
      "_user": userId
    }
  ];
};

