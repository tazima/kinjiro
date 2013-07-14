
/**
 * Module dependencies.
 */

var fs = require("fs"),
    json = require("component-json"),
    path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({

    watch: {
      component_build: {
        files: [
          "client/**/*!(-test).js"
        ],
        tasks: ['component_build:dev']
      },

      karma: {
        files: [
          "build/build.js",
          "client/**/test/*-test.js"
        ],
        tasks: ['karma:unit:run']        
      },

      mochaTest: {
        files: [
          "app.js",
          "server/**/*.js",
          "server/**/*.ejs"
        ],
        tasks: ["mochaTest"]
      }
    },

    express: {
      server: {
        options: {
          hostname: "localhost",
          server: path.resolve('./app')
        }
      }
    },

    component_build: {
      dev: {
        name: "build",
        styles: true,
        scripts: true,
        verbose: true,
        plugins: ["templates"],
        configure: function(builder) {
          builder.development();
          builder.addSourceURLs();
          builder.use(json);
        }
      },
      prod: {
        name: "build",
        styles: true,
        scripts: true,
        verbose: true,
        plugins: ["templates"],
        configure: function(builder) {
          builder.use(json);
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      test: {
        src: ['server/**/test/*-test.js']
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        background: true
      },
      ci: {
        browsers: ["PhantomJS"],
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks("grunt-component-build");
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadTasks("tasks");

  // start server for development.
  grunt.registerTask('server', ['express', 'express-keepalive']);

  // default for development task.
  grunt.registerTask("default", ["karma:unit", "watch"]);

  // ci
  grunt.registerTask("ci", [
    "component_build:prod",
    "karma:ci",
    "mochaTest"
  ]);

};