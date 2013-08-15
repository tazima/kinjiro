
/**
 * Module dependencies.
 */

var expect = require('expect.js'),
    sanitize = require('../sanitise');

describe('sanitize', function() {

  it('should filter out tags that are not specified', function() {
    expect(sanitize('<script>alert("hoge")</script><a href="/hoge">Hoge</a>', {
      tags: ['a'], attributes: ['href']
    })).to.equal('<a href="/hoge">Hoge</a>');
  });

});
