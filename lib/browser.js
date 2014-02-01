require('es5-shim');

if (!Object.create) {
  Object.create = (function(){
    function F(){}
    
    return function(o){
      if (arguments.length != 1) {
          throw new Error('Object.create implementation only accepts one parameter.');
      }
      F.prototype = o
        return new F()
    }
  })()
}

alloc = require('./main');

module.exports = alloc;