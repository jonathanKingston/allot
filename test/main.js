(function () {

  var allot = require('../');
  var assert = require('chai').assert;

  describe('allot.factory', function(){
    function Thing() {
    };

    Thing.prototype.doSomething = function (name) {
      this[name] = 'randomPropertyValue';
      return 'prop return -' + name;
    };

    Thing.doMethod = function (name) {
      this[name] = 'randomPropertyValue';
      return 'prop return -' + name;
    };

    var name = 'testVar';


    it('should be able to build new objects mapping to the super prototypes', function() {
      var Thingerston = allot.factory(Thing, function Thinger() {}, {
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

      var Thingerston = allot.factory(Thing, function Thinger() {}, {
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

      var Thingerston = allot.factory(Thing, function Thinger() {}, {
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

      var Thingerston = allot.factory(Thing, function Thinger() {}, {
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


  });

}());
