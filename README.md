# Allot

A way of defining interfaces from one JavaScript class to a new class.

The idea is still a little abstract at the moment however its useful for building quick interfaces from one class to another.

[Full documentation](http://jonathankingston.github.io/allot/)

## Usage

### `allot.inherits`
  Classical inheritance to JavaScript, however methods are not copied or referenced they use the proxy methods defined in this module.


```js

function SuperClass() {
};

SuperClass.thing = function () {
  return 'thing';
};

SuperClass.prototype.doSomething = function () {
  return 'Hello there';
};

var ChildClass = allot.inherits(function () {}, SuperClass);

ChildClass.thing();

var instance = new ChildClass();
instance.doSomething();

```


### `allot.factory`
  Builds a new class based upon SuperClass.


#### Static methods from instance methods

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

#### Static methods from static methods

```js

function SuperClass() {
};

SuperClass.doSomething = function () {
  return 'Hello there';
};

var ChildClass = allot.factory(SuperClass, {
  staticProxyMethods: ['doSomething']
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
