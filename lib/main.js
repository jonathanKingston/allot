(function () {

  var crock = require('crock');

  /**
   * A collection of helpers for class building
   * @namespace allot
   */
  var allot = {};

  /**
   * Run a function under a certain context - this is a useful abstraction for performance and ease of maintenance
   * @param {function} func function we are extending
   * @param {object} context The context we are applying the function to
   * @returns {function} Returns a proxy method which will call the corresponding methods with passed in arguments
   */
  allot.proxyMethod = function proxyMethod(func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  /**
   * Returns an array of strings of the method names of the object provided
   * @param {object} objectName
   * @param {array} methodNames
   */
  allot.getAllMethodNames = function getAllMethodNames(objectName) {
    var methodNames = [];

    if ('object' !== crock.typeOf(objectName) && 'function' !== crock.typeOf(objectName)) {
      return null;
    }

    for (var propertyName in objectName) {
      if ('function' === crock.typeOf(objectName[propertyName])) {
        methodNames.push(propertyName);
      }
    }
    return methodNames;
  };

  /**
   * Run all the functions specified in the methodNames under the context
   * @param {array|true} methodNames An array of methodNames to copy over or true to copy all
   * @param {object} functions An context object to take functions from
   * @param {object} context A context to run functions under
   */
  allot.proxyMethods = function proxyMethods(methodNames, functions, context) {
    //If true has been provided find all the relevant methods
    if (true === methodNames) {
      methodNames = this.getAllMethodNames(functions);
    }

    if ('array' !== crock.typeOf(methodNames)) {
      return false;
    }
    methodNames.forEach(function (methodName) {
      if (!(methodName in functions)) {
        return false;
      }
      if ('function' !== crock.typeOf(functions[methodName])) {
        return false;
      }
      context[methodName] = allot.proxyMethod(functions[methodName], context);
    });

    return true;
  };

  /**
   * Factory to build new objects based upon other ones
   * @param {function} SuperClass A superclass for the new function to be constructed from
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
   *      - Sets the returned object with a prototype of the superClasses constructed object
   *    constructor: object
   *      - an object to which to abstract classes from
   * @returns {object} ChildClass
   */
  allot.factory = function factory(SuperClass, options) {
    var AbstractClass;

    options = options || {};

    //Allows passed in named function declarations
    if ('function' === typeof options.constructor) {
      AbstractClass = options.constructor;
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
    if ('instanceProxyPrototypes' in options) {
      allot.proxyMethods(options.instanceProxyPrototypes, SuperClass.prototype, AbstractClass.prototype);
    }
        
    return AbstractClass;
  };

  module.exports = allot;

}());