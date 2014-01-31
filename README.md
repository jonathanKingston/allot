Allot
-----

[![Build Status](https://travis-ci.org/jonathanKingston/allot.png?branch=master)](https://travis-ci.org/jonathanKingston/allot)
[![browser support](http://ci.testling.com/jonathanKingston/allot.png)](http://ci.testling.com/jonathanKingston/allot)
[![Coverage Status](https://coveralls.io/repos/jonathanKingston/allot/badge.png)](https://coveralls.io/r/jonathanKingston/allot)


A collection of utils for JavaScript classes but could also be used with browserify for in browser classes.


`allot.factory` builds a new class based upon SuperClass.

```js

function SuperClass() {
};

SuperClass.prototype.doSomething = function () {
  return 'Hello there';
};

var ChildClass = allot.factory(SuperClass, Constructor, {
  staticProxyPrototypes: ['doSomething']
});

ChildClass.doSomething();

var instance = new ChildClass();

```