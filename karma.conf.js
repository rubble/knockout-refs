var babelify = require("babelify");

module.exports = function(karma) {
  karma.set({

    // base path that will be used to resolve all patterns (eg. files,
    // exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["browserify", "fixture", "jasmine"],

    // list of file patterns to load in the browser
    files: [
      "tests/*.spec.js",
      "tests/fixtures/*.html",
      {pattern: "tests/fixtures/*.html"},
    ],

    // run a proxy server for static files
    proxies: {},

    // list of files to exclude
    exclude: [],

    // preprocessors
    // matching files before serving them to the browser available
    // preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "src/*.js": ["babel"],
      "tests/*.spec.js": ["browserify"],
      "tests/fixtures/*.html": ["html2js"],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress",],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: karma.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome", "Firefox"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    babelPreprocessor: {
      options: {
        presets: ["es2015"],
        sourceMap: "inline",
      },
      filename: function(file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function(file) {
        return file.originalPath;
      },
    },

    browserify: {
      debug: true,
      cache: {},
      packageCache: {},
      configure: function configure(b) {
        return b.transform(babelify.configure({
          presets: ["es2015"],
        }));
      }
    },

    watchify: {
      // do not wait between change and emitting the `update` event
      delay: 0,
    },

  });
};
