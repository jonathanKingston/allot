(function () {

  var allot = require('../');
  var assert = require('chai').assert;

  function Thing() {
  }

  Thing.prototype.doSomething = function (name) {
    this[name] = 'randomPropertyValue';
    return 'prop return -' + name;
  };

  Thing.doMethod = function (name) {
    this[name] = 'randomPropertyValue';
    return 'prop return -' + name;
  };

  var name = 'testVar';


  describe('allot.inherits', function () {

    it('should be able to extend a class and return a result', function () {
      var MyThing = function () {
      };

      allot.inherits(MyThing, Thing);

      assert.isFunction(MyThing);

      var myInstance = new MyThing();
      assert.isObject(myInstance);
    });

    it('should retain the origional methods defined in the child constructor', function () {
      var MyThing = function () {
      };

      MyThing.doMethod = function () {
        return 'ChildTest';
      };

      allot.inherits(MyThing, Thing);

      assert.isFunction(MyThing);
      assert.isFunction(MyThing.doMethod);
      assert.strictEqual(MyThing.doMethod(), 'ChildTest', 'Check we are using the child method');
    });

    it('should run the methods defined in the super constructor', function () {
      var MyThing = function () {
      };

      allot.inherits(MyThing, Thing);
      assert.isFunction(MyThing);
      assert.isFunction(MyThing.doMethod, 'Check we have a function');
      assert.strictEqual(MyThing.doMethod('test'), 'prop return -test', 'Check we are using the child method');
    });

  });

  describe('allot.factory', function (){

    it('should be able to build new objects mapping to all supertypes', function() {
      var Thingerston = allot.factory(Thing, {
        constructor: function Thinger() {},
        staticProxyPrototypes: true,
      });
      Thingerston.doSomething(name);
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();

      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
      assert.isUndefined(Thing[name], 'Check for variable leekage into parent class');
      assert.isDefined(Thingerston[name], 'Check for variable is set');
      assert.isUndefined(ThingerstonInstance[name], 'Check for variable leekage into instance');
    });


    it('should be able to build new objects mapping to the super prototypes', function() {
      var Thingerston = allot.factory(Thing, {
        constructor: function Thinger() {},
        buildFromSuper: true,
        staticProxyPrototypes: ['doSomething'],
      });
      Thingerston.doSomething(name);
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();

      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
      assert.isUndefined(Thing[name], 'Check for variable leekage into parent class');
      assert.isDefined(Thingerston[name], 'Check for variable is set');
      assert.isUndefined(ThingerstonInstance[name], 'Check for variable leekage into instance');
    });


    it('should be able to build new objects mapping to the super methods', function() {

      var Thingerston = allot.factory(Thing, {
        constructor: function Thinger() {},
        buildFromSuper: true,
        staticProxyMethods: ['doMethod'],
      });
      Thingerston.doMethod(name);

      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
      assert.isUndefined(Thing[name], 'Check for variable leekage into parent class');
      assert.isDefined(Thingerston[name], 'Check for variable is set');
      assert.isUndefined(ThingerstonInstance[name], 'Check for variable leekage into instance');
    });


    it('should be able to build new objects mapping prototypes to the super methods', function() {

      var Thingerston = allot.factory(Thing, {
        constructor: function Thinger() {},
        buildFromSuper: true,
        instanceProxyMethods: ['doMethod'],
      });
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');
      assert.typeOf(Thingerston.prototype.doMethod, 'function', 'Check prototype exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
      ThingerstonInstance.doMethod(name);
      assert.typeOf(ThingerstonInstance.doMethod, 'function', 'Check function exists');
      assert.isUndefined(Thing[name], 'Check for variable leekage into parent class');
      assert.isUndefined(Thingerston[name], 'Check for leakage to class');
      assert.isDefined(ThingerstonInstance[name], 'Check for variable is set on instance');
    });

    it('should be able to build new objects mapping prototypes to the super prototypes', function() {

      var Thingerston = allot.factory(Thing, {
        constructor: function Thinger() {},
        buildFromSuper: true,
        instanceProxyPrototypes: ['doSomething'],
      });
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
      ThingerstonInstance.doSomething(name);
      assert.typeOf(ThingerstonInstance.doSomething, 'function', 'Check function exists');
      assert.isUndefined(Thing[name], 'Check for variable leekage into parent class');
      assert.isUndefined(Thingerston[name], 'Check for leakage to class');
      assert.isDefined(ThingerstonInstance[name], 'Check for variable is set on instance');
    });

    it('should be building an abstract constructor if none are provided', function() {
      var Thingerston = allot.factory(Thing, {
        constructor: undefined,
        buildFromSuper: true,
        staticProxyPrototypes: ['doSomething'],
      });
      Thingerston.doSomething(name);
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');
    });

  });

  describe('allot.proxyMethods', function(){

    it('should return false if methodNames is not an array', function () {
      assert.isFalse(allot.proxyMethods(false, {}, function () {}));
    });

    it('should skip methodNames not found in functions', function () {
      var Constructor = function () {};
      var functions = {
        thing: function () {}
      };
      var returnVal = allot.proxyMethods(['thing', 'other'], functions, Constructor);

      assert.isTrue(returnVal);
      assert.isFunction(Constructor);
      assert.isFunction(Constructor.thing);
      assert.isUndefined(Constructor.other);
    });

    it('should skip methodNames that are not functions', function () {
      var Constructor = function () {};
      var functions = {
        thing: function () {},
        other: 'string'
      };
      var returnVal = allot.proxyMethods(['thing', 'other'], functions, Constructor);

      assert.isTrue(returnVal);
      assert.isFunction(Constructor);
      assert.isFunction(Constructor.thing);
      assert.isUndefined(Constructor.other);
    });

  });

  describe('allot.getAllMethodNames', function () {

    it('should return blank array if no matching arrays are found', function () {
      var object = {};

      var methodNames = allot.getAllMethodNames(object);
      assert.isArray(methodNames, 'return is of array type');
      assert.lengthOf(methodNames, 0, 'return has a length of 0');
    });

    it('should return an array of strings when a valid object is supplied', function () {
      var object = {
        thing: 12,
        otherThing: function () {}
      };
      var methodNames = allot.getAllMethodNames(object);
      var object2 = {
        thing: 12,
        otherThing: function () {},
        otherThing2: function () {}
      };
      var methodNames2 = allot.getAllMethodNames(object2);

      assert.isArray(methodNames, 'return is of array type');
      assert.lengthOf(methodNames, 1, 'return has a length of 1');

      assert.isArray(methodNames2, 'return is of array type');
      assert.lengthOf(methodNames2, 2, 'return has a length of 2');
    });

    it('should return null when an invalid object is supplied', function () {

      assert.isNull(allot.getAllMethodNames([]), 'array passed in returns null');
      assert.isNull(allot.getAllMethodNames('thing'), 'string passed in returns null');
      assert.isNull(allot.getAllMethodNames(12), 'number passed in returns null');

    });

    it('should return the methods of a prototype', function () {
       function MyCheckClass() {
       }
       MyCheckClass.testing = function () {
       };
       MyCheckClass.prototype.thing = function () {
       };
       MyCheckClass.prototype.fun = function () {
       };
       MyCheckClass.prototype.funny = 12;

       var MyCheckInstance = new MyCheckClass();

       assert.sameMembers(allot.getAllMethodNames(MyCheckClass.prototype), ['thing', 'fun'], 'Has the same define named members as expected');
       assert.sameMembers(allot.getAllMethodNames(MyCheckClass), ['testing'], 'Has the same define named members as expected');
       assert.sameMembers(allot.getAllMethodNames(MyCheckInstance), ['thing', 'fun'], 'Has the same define named members as expected');

    });

  });

}());
