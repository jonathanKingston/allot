(function () {

  var type = require('component-type');
  var protoInherits = require('inherits');

  /**
   * A collection of helpers for class building
   * @namespace allot
   */
  var allot = {};

  /**
   * Run a function under a certain context - this is a useful abstraction for performance and ease of maintenance
   * @memberof allot
   * @param {function} func function we are extending
   * @param {object} context The context we are applying the function to
   * @returns {function} Returns a proxy method which will call the corresponding methods with passed in arguments
   */
  allot.proxyMethod = function proxyMethod(func, context) {
    return function () {
      return func.apply(context, arguments);
    };
  };

  /**
   * Returns an array of strings of the method names of the object provided
   * @memberof allot
   * @param {object} objectName
   * @param {array} methodNames
   */
  allot.getAllMethodNames = function getAllMethodNames(objectName) {
    var methodNames = [];

    if ('object' !== type(objectName) && 'function' !== type(objectName)) {
      return null;
    }

    for (var propertyName in objectName) {
      if ('function' === type(objectName[propertyName])) {
        methodNames.push(propertyName);
      }
    }
    return methodNames;
  };

  /**
   * Run all the functions specified in the methodNames under the context
   * @memberof allot
   * @param {array|true} methodNames An array of methodNames to copy over or true to copy all
   * @param {object} functions An context object to take functions from
   * @param {object} context A context to run functions under
   */
  allot.proxyMethods = function proxyMethods(methodNames, functions, context) {
    //If true has been provided find all the relevant methods
    if (true === methodNames) {
      methodNames = this.getAllMethodNames(functions);
    }

    if ('array' !== type(methodNames)) {
      return false;
    }
    methodNames.forEach(function (methodName) {
      if (!(methodName in functions)) {
        return false;
      }
      if ('function' !== type(functions[methodName])) {
        return false;
      }
      //If there is a method already, skip this
      if (methodName in context) {
        return true;
      }
      context[methodName] = allot.proxyMethod(functions[methodName], context);
    });

    return true;
  };

  /**
   * Factory options - A set of options to configure the built function
   * @typedef {object} allot~factoryOptions
   * @property {array|true} [staticProxyPrototypes] an array of method names to map from SuperClass prototype to ChildClass
   * @property {array|true} [instanceProxyPrototypes] an array of method names to map from SuperClass prototype to ChildClass prototype
   * @property {array|true} [staticProxyMethods] an array of method names to map from SuperClass to ChildClass
   * @property {array|true} [instanceProxyMethods] an array of method names to map from SuperClass to ChildClass prototype
   * @property {boolean} [buildFromSuper=false] Sets the returned object with a prototype of the superClasses constructed object
   * @property {class} [constructor=AbstractClass] an object to which to abstract classes from
   */

  /**
   * Factory to build new objects based upon other ones
   * @memberof allot
   * @param {function} SuperClass A superclass for the new function to be constructed from
   * @param {allot~factoryOptions} options A set of options to configure the built function
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

  /**
   * A way to give classical inheritance to another class.
   * Use sparingly as normal inherits npm / Utils.inherits is better usually.
   * @memberof allot
   * @param {function} ChildConstructor A superclass for the new function to be constructed from
   * @param {function} SuperConstructor A superclass for the new function to be constructed from
   * @returns {object} ChildClass
   */
  allot.inherits = function inherits(ChildConstructor, SuperConstructor) {
    ChildConstructor = allot.factory(SuperConstructor, {
      constructor: ChildConstructor,
      staticProxyMethods: true
    });

    protoInherits(ChildConstructor, SuperConstructor);
    return ChildConstructor;
  };

  module.exports = allot;

}());