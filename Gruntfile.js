
/**
 * Module dependencies.
 */

var fs = require("fs"),
    json = require("component-json"),
    path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      server: {
        options: {
          hostname: "localhost",
          server: path.resolve('./app')
        }
      }
    },

    component_build: {
      build: {
        styles: false,
        scripts: true,
        verbose: true,
        plugins: ["templates"],
        configure: function(builder) {
          builder.development();
          builder.addSourceURLs();
          builder.use(json);
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks("grunt-component-build");

  grunt.loadTasks("tasks");

  grunt.registerTask("default", ["component_build"]);
  grunt.registerTask('server', ['express', 'express-keepalive']);
};