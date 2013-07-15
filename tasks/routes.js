
module.exports = function(grunt) {
  grunt.registerTask('routes', 'Listing express routes', function() {
    console.log(require("../app").routes);
  });
};
