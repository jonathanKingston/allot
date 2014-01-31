(function () {

  /**
   * A collection of helpers for class building
   * @namespace allot
   */
  var allot = {};

  /**
   * Robust type checker provided by Crockford
   * @method typeOf
   * @memberof StrutUtils
   * @param {string} value The value to check the type of
   * @returns {string} object type where null and array identify correctly
   */
  allot.typeOf = function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (Object.prototype.toString.call(value) == '[object Array]') {
          s = 'array';
        }
      } else {
        s = 'null';
      }
    }
    return s;
  };

  /**
   * Run a function under a certain context - this is a useful abstraction for performance and ease of maintenance
   * @param {function} func function we are extending
   * @param {object} context The context we are applying the function to
   * @returns {function} Returns a proxy method which will call the corresponding methods with passed in arguments
   */
  allot.proxyMethod = function proxyMethod(func, context) {
    return function () {
      func.apply(context, arguments);
    }
  };

  /**
   * Run all the functions specified in the methodNames under the context
   * @param {array} methodNames An array of methodNames to copy over
   * @param {object} functions An context object to take functions from
   * @param {object} context A context to run functions under
   */
  allot.proxyMethods = function proxyMethods(methodNames, functions, context) {
    if ('array' !== allot.typeOf(methodNames)) {
      return false;
    }
    methodNames.forEach(function (methodName) {
      if (!(methodName in functions)) {
        return false;
      }
      if ('function' !== allot.typeOf(functions[methodName])) {
        return false;
      }
      context[methodName] = allot.proxyMethod(functions[methodName], context);
    });

    return true;
  };

  /**
   * Factory to build new objects based upon other ones
   * @param {function} SuperClass A superclass for the new function to be constructed from
   * @param {function} Constructor
   * @param {object} options A set of options to configure the built function
   *    staticProxyPrototypes
   *      - an array of method names to map from SuperClass prototype to ChildClass
   *    instanceProxyPrototypes
   *      - an array of method names to map from SuperClass prototype to ChildClass prototype
   *    staticProxyMethods
   *      - an array of method names to map from SuperClass to ChildClass
   *    instanceProxyMethods
   *      - an array of method names to map from SuperClass to ChildClass prototype
   *    buildFromSuper: false
   * @returns {object} ChildClass
   */
  allot.factory = function factory(SuperClass, Constructor, options) {
    var AbstractClass;

    options = options || {};

    //Allows passed in named function declarations
    if ('function' === typeof Constructor) {
      AbstractClass = Constructor;
    } else {
      AbstractClass = function AbstractClass() {};
    }

    if ('buildFromSuper' in options) {
      AbstractClass.prototype = new SuperClass();
    }

    if ('staticProxyPrototypes' in options) {
      allot.proxyMethods(options.staticProxyPrototypes, SuperClass.prototype, AbstractClass);
    }
    if ('staticProxyMethods' in options) {
      allot.proxyMethods(options.staticProxyMethods, SuperClass, AbstractClass);
    }
    if ('instanceProxyMethods' in options) {
      allot.proxyMethods(options.instanceProxyMethods, SuperClass, AbstractClass.prototype);
    }
    if ('instanceProxyPrototype' in options) {
      allot.proxyMethods(options.instanceProxyPrototypes, SuperClass.prototype, AbstractClass.prototype);
    }
        
    return AbstractClass;
  };

  module.exports = allot;

}());