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


    it('should be able to build new objects mapping to the super prototypes', function() {

      var Thingerston = allot.factory(Thing, function Thinger() {}, {
        buildFromSuper: true,
        staticProxyPrototypes: ['doSomething'],
      });
      Thingerston.doSomething('thiss');
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
    });


    it('should be able to build new objects mapping to the super methods', function() {

      var Thingerston = allot.factory(Thing, function Thinger() {}, {
        buildFromSuper: true,
        staticProxyMethods: ['doMethod'],
      });
      Thingerston.doMethod('thiss');
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
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
      ThingerstonInstance.doMethod('thiss');
      assert.typeOf(ThingerstonInstance.doMethod, 'function', 'Check function exists');

    });

    it('should be able to build new objects mapping prototypes to the super prototypes', function() {

      var Thingerston = allot.factory(Thing, function Thinger() {}, {
        buildFromSuper: true,
        instanceProxyPrototypes: ['doSomething'],
      });
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
      ThingerstonInstance.doSomething('thiss');
      assert.typeOf(ThingerstonInstance.doSomething, 'function', 'Check function exists');
    });


  });

}());
