
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
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['server/**/test/*-test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks("grunt-component-build");
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.loadTasks("tasks");

  grunt.registerTask('server', ['express', 'express-keepalive']);

  grunt.registerTask("default", ["component_build"]);
};