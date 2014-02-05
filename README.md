# Allot

A collection of utils for JavaScript classes but could also be used with browserify for in browser classes.

## Usage

`allot.factory` builds a new class based upon SuperClass.

```js

function SuperClass() {
};

SuperClass.prototype.doSomething = function () {
  return 'Hello there';
};

var ChildClass = allot.factory(SuperClass, {
  staticProxyPrototypes: ['doSomething']
});

ChildClass.doSomething();

var instance = new ChildClass();

```

## Status

[![Build Status](https://travis-ci.org/jonathanKingston/allot.png?branch=master)](https://travis-ci.org/jonathanKingston/allot)
[![Coverage Status](https://coveralls.io/repos/jonathanKingston/allot/badge.png)](https://coveralls.io/r/jonathanKingston/allot)
[![Dependency Status](https://david-dm.org/jonathankingston/allot.png)](https://david-dm.org/jonathankingston/allot)
[![devDependency Status](https://david-dm.org/jonathankingston/allot/dev-status.png)](https://david-dm.org/jonathankingston/allot#info=devDependencies)

[![Browser Support](http://ci.testling.com/jonathanKingston/allot.png)](http://ci.testling.com/jonathanKingston/allot)

## Licence

Copyright (c) 2014 Jonathan Kingston

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
