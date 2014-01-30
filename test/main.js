(function () {

  var classHelpers = require('../');
  var assert = require('chai').assert;

  describe('classHelpers.factory', function(){
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

      var Thingerston = classHelpers.factory(Thing, function Thinger() {}, {
        buildFromSuper: true,
        staticProxyPrototypes: ['doSomething'],
      });
      Thingerston.doSomething('thiss');
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
    });


    it('should be able to build new objects mapping to the super methods', function() {

      var Thingerston = classHelpers.factory(Thing, function Thinger() {}, {
        buildFromSuper: true,
        staticProxyMethods: ['doMethod'],
      });
      Thingerston.doMethod('thiss');
      assert.typeOf(Thingerston, 'function', 'Check constructor exists');

      var ThingerstonInstance = new Thingerston();
      assert.typeOf(ThingerstonInstance, 'object', 'Check build object has classes');
    });



  });

}());
