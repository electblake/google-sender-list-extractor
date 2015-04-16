var expect = require('chai').expect;

describe('Foobar', function() {  
  describe('#sayHello()', function() {
    it('should return some text', function() {
      var foobar = {
        sayHello: function() {
          return 'Hello World!';
        }
      };

      expect(foobar.sayHello()).to.be.a('string').and.to.equal('Hello World!');
    })
  })
})