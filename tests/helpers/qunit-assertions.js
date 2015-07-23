import Ember from 'ember';

QUnit.assert.contains = function(selector, text, message) {
  var elements = find(selector);
  var regex = new RegExp(escapeForRegex(text) + '($|\\W)', 'gm');
  var result = false;
  message = `${(message || '')} - At least one element ${selector} containing ${text} should exist.`;

  if (elements.length === 1) {
    var resultText = Ember.$(elements).text();
    result = regex.test(resultText);
    this.push(result, resultText, text, message);
  } else {
    elements.each(function() {
      if (regex.test(Ember.$(this).text())) {
        result = true;
      }
    });
    this.push(result, result, text, message);
  }
};

QUnit.assert.containsExactly = function(selector, text, message = '') {
  var elements = find(selector);
  if (elements.length !== 1) { throw new Error('One element was expected with selector ' + selector + ' but ' + elements.length + ' were found'); }
  var result = (Ember.$(elements[0]).text().trim().replace(/\s+/gm, '') === text.trim().replace(/\s+/gm, ''));
  message = message + ` - ${selector} should contain ${text}`;
  this.push(result, Ember.$(elements[0]).text(), text, message);
};

QUnit.assert.notExists = function(selector, prependMessage = '') {
  var elementCount = find(selector).length;
  var result = (elementCount === 0);
  var message = `${prependMessage} - ${selector} should not exist.`;
  this.push(result, `${elementCount} of ${selector}`, `0 of ${selector}`, message);
};

QUnit.assert.exists = function(selector, ...args) {
  var expectedCount = (typeof(args[0]) === 'string') ? null : args[0];
  var prependMessage = (typeof(args[0]) === 'string') ? args[0] : args[1];
  var result = false;
  var elementCount = find(selector).length;
  var countMessage = '';

  if (expectedCount) {
    result = elementCount === expectedCount;
    countMessage = `${expectedCount}`;
  } else {
    result = elementCount >= 1;
    countMessage = 'At least 1';
  }

  var message = `${(prependMessage || '')} - ${countMessage} of ${selector} should exist.`;
  this.push(result, `${elementCount} of ${selector}`, `${countMessage} of ${selector}`, message);
};

QUnit.assert.notVisible = function(selector, prependMessage) {
  prependMessage = prependMessage || '';
  var message = `${prependMessage} - ${selector} should not be visible.`;
  var visibleElementsMatchingSelector = find(selector).filter(':visible');
  var result = (visibleElementsMatchingSelector.length === 0);

  if (!result) {
    message = message + ` but ${visibleElementsMatchingSelector.length} are`;
  }

  this.push(result, result, true, message);
};

QUnit.assert.visible = function(selector, count, prependMessage) {
  count = (count !== undefined) ? count : 1;
  prependMessage = prependMessage || '';
  var message = `${prependMessage} - (${count}) ${selector} should be visible.`;
  var visibleElementsMatchingSelector = find(selector).filter(':visible');
  var result = (visibleElementsMatchingSelector.length === count);

  if (!result) {
    message = message + ` but ${visibleElementsMatchingSelector.length} are`;
  }

  this.push(result, visibleElementsMatchingSelector.length, count, message);
};

function escapeForRegex(str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}
