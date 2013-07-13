
/**
 * Module dependencies.
 */

var app = require("../app");

module.exports = function(grunt) {
  grunt.registerTask('routes', 'Listing express routes', function() {
    console.log(app.routes);
  });
};
