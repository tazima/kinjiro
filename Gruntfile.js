
/**
 * Module dependencies.
 */

var fs = require("fs"),
    less = require("component-less"),
    path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({

    watch: {
      component_build: {
        files: [
          "client/**/*!(-test).js",
          "client/**/*.html",
          "kinjiro.less",
          "client/**/*.less"
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
        tasks: ["mochaTest:unit"]
      },

      jshint: {
        files: [
          "Gruntfile.js",
          "app.js",
          "server/**/*.js",
          "client/**/*.js",
          "tasks/**/*.js"
        ],
        tasks: ["jshint"]
      }
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: ["Gruntfile.js", "app.js", "server/**/*.js", "client/**/*.js", "tasks/**/*.js"]
    },

    express: {
      docs: {
        options: {
          hostname: "localhost",
          port: 3001,
          bases: "."
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
          builder.use(less);
        }
      },
      prod: {
        name: "build",
        styles: true,
        scripts: true,
        verbose: true,
        plugins: ["templates"],
        configure: function(builder) {
          builder.use(less);
        }
      }
    },

    uglify: {
      prod: {
        files: {
          "build/build.min.js": ["build/build.js"]
        }
      }
    },

    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          growl: true
        },
        src: ['server/**/test/*-test.js']
      },
      ci: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: "lcov",
          require: 'server/test/blanket'
        },
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
    },

    env: {
      dev: {
        NODE_ENV: "development"
      },
      test: {
        NODE_ENV: "test"
      }
    },

    nodemon: {
      dev: {
        file: "app.js",
        watchedExtensions: ['js', "ejs"],
        watchedFolders: ["server"]
      }
    },

    dox: {
      files: {
        src: ['server/', 'client/'],
        dest: './docs'
      }
    },

    open: {
      dev: {
        path: "http://127.0.0.1:3000"
      },
      docs: {
        path: "http://127.0.0.1:3001/docs/index.html"
      }
    }
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks("grunt-component-build");
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-open');

  grunt.loadTasks("tasks");

  // start server for development.
  grunt.registerTask('server', [
    "component_build:dev",
    "env:dev",
    "nodemon" // TODO add `open` task
  ]);

  // start api documentation server.
  grunt.registerTask('docs', [
    "dox",
    "express:docs",
    "open:docs",
    "express-keepalive"
  ]);

  // default for test task.
  grunt.registerTask("default", [
    "env:test",
    "karma:unit",
    "watch"
  ]);

  // ci
  grunt.registerTask("ci", [
    "env:test",
    "jshint",
    "component_build:dev",
    "uglify",
    "karma:ci",
    "mochaTest:ci",
    "pipe-coveralls"
  ]);

  // heroku
  grunt.registerTask("heroku:production", [
    "component_build:prod",
    "uglify"
  ]);
};
