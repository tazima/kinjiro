
/**
 * Module dependencies.
 */

var Backbone = require('backbone'),
    ReadCollection = require('read-collection');

describe('read-collection', function() {

  it('should be an instance of `Backbone.Collection`', function() {
    expect(new ReadCollection()).to.be.a(Backbone.Collection);
  });

});
