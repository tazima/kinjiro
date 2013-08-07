
var fs = require("fs");

module.exports = function(grunt) {
  grunt.registerTask('pipe-coveralls', 'Pipe lcov output to coveralls.js', function() {
    var done = this.async();

    require("child_process").exec(
      "cat ./lcov | ./node_modules/coveralls/bin/coveralls.js"
    , {}, function(err, stdout, stderr) { done(); });
  });
};
