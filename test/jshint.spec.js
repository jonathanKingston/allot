//JShint is broken in browserify - its only really important for Node anyway
if (typeof(window) === 'undefined') {
  require('mocha-jshint')();
}