
/**
 * Module dependencies.
 */

var san = require("html-sanitiser");

/**
 * Expose `sanitize`.
 */

exports = module.exports = sanitize;

var allowedElements = [
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'br',
  'img',
  'code',
  'pre',
  'blockquote',
  'p',
  'div',
  'span'
];

var allowedAttributes = [
  'href',
  'src',
  'width',
  'height',
  'alt',
  'cite',
  'abbr'
];

/**
 * Filter out tags and attributes from `input`.
 *
 * @param {String} input
 * @return {String}
 * @api public
 */

function sanitize(input) {
  return san.sanitiseHTML(input, {
    allowedElements: allowedElements,
    allowedAttributes: allowedAttributes
  });
}

