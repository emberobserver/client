/* global QUnit */

import Ember from 'ember';

QUnit.assert.contains = function(selector, text, message) {
  let elements = find(selector);
  let regex = new RegExp(`${escapeForRegex(text)}($|\\W)`, 'gm');
  let result = false;
  message = `${(message || '')} - At least one element ${selector} containing "${text}" should exist.`;

  if (elements.length === 1) {
    let resultText = Ember.$(elements).text();
    result = regex.test(resultText);
    this.pushResult({ result, actual: resultText, expected: text, message });
  } else {
    elements.each(function() {
      if (regex.test(Ember.$(this).text())) {
        result = true;
      }
    });
    this.pushResult({ result, actual: result, expected: true, message });
  }
};

QUnit.assert.containsExactly = function(selector, text, message = '') {
  let elements = find(selector);
  if (elements.length !== 1) {
    throw new Error(`One element was expected with selector ${selector} but ${elements.length} were found`);
  }
  let result = (Ember.$(elements[0]).text().trim().replace(/\s+/gm, '') === text.trim().replace(/\s+/gm, ''));
  message = `${message} - ${selector} should contain ${text}`;
  this.pushResult({ result, actual: Ember.$(elements[0]).text(), expected: text, message });
};

QUnit.assert.notExists = function(selector, prependMessage = '') {
  let elementCount = find(selector).length;
  let result = (elementCount === 0);
  let message = `${prependMessage} - ${selector} should not exist.`;
  this.pushResult({ result, actual: `${elementCount} of ${selector}`, expected: `0 of ${selector}`, message });
};

QUnit.assert.exists = function(selector, ...args) {
  let expectedCount = (typeof(args[0]) === 'string') ? null : args[0];
  let prependMessage = (typeof(args[0]) === 'string') ? args[0] : args[1];
  let result = false;
  let elementCount = find(selector).length;
  let countMessage = '';

  if (expectedCount) {
    result = elementCount === expectedCount;
    countMessage = `${expectedCount}`;
  } else {
    result = elementCount >= 1;
    countMessage = 'At least 1';
  }

  let message = `${(prependMessage || '')} - ${countMessage} of ${selector} should exist.`;
  this.pushResult({ result, actual: `${elementCount} of ${selector}`, expected: `${countMessage} of ${selector}`, message });
};

QUnit.assert.notVisible = function(selector, prependMessage) {
  prependMessage = prependMessage || '';
  let message = `${prependMessage} - ${selector} should not be visible.`;
  let visibleElementsMatchingSelector = find(selector).filter(':visible');
  let result = (visibleElementsMatchingSelector.length === 0);

  if (!result) {
    message = `${message} but ${visibleElementsMatchingSelector.length} are`;
  }

  this.push({ result, actual: result, expected: true, message });
};

QUnit.assert.visible = function(selector, count, prependMessage) {
  count = (count !== undefined) ? count : 1;
  prependMessage = prependMessage || '';
  let message = `${prependMessage} - (${count}) ${selector} should be visible.`;
  let visibleElementsMatchingSelector = find(selector).filter(':visible');
  let result = (visibleElementsMatchingSelector.length === count);

  if (!result) {
    message = `${message} but ${visibleElementsMatchingSelector.length} are`;
  }

  this.pushResult({ result, actual: visibleElementsMatchingSelector.length, expected: count, message });
};

function escapeForRegex(str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}
