/* global QUnit */

import $ from 'jquery';

QUnit.assert.contains = function(selector, text, message) {
  let elements = findElements(this, selector);
  let regex = new RegExp(`${escapeForRegex(text)}($|\\W)`, 'gm');
  let result = false;
  message = `${(message || '')} - At least one element ${selector} containing "${text}" should exist.`;

  if (elements.length === 1) {
    let resultText = elements[0].textContent;
    result = regex.test(resultText);
    this.pushResult({ result, actual: resultText, expected: text, message });
  } else {
    elements.forEach((element) => {
      if (regex.test(element.textContent)) {
        result = true;
      }
    });
    this.pushResult({ result, actual: result, expected: true, message });
  }
};

QUnit.assert.containsExactly = function(selector, text, message = '') {
  let elements = findElements(this, selector);
  if (elements.length !== 1) {
    throw new Error(`One element was expected with selector ${selector} but ${elements.length} were found`);
  }
  let result = (elements[0].textContent.trim().replace(/\s+/gm, '') === text.trim().replace(/\s+/gm, ''));
  message = `${message} - ${selector} should contain ${text}`;
  this.pushResult({ result, actual: elements[0].textContent, expected: text, message });
};

QUnit.assert.notExists = function(selector, prependMessage = '') {
  let elementCount = findElements(this, selector).length;
  let result = (elementCount === 0);
  let message = `${prependMessage} - ${selector} should not exist.`;
  this.pushResult({ result, actual: `${elementCount} of ${selector}`, expected: `0 of ${selector}`, message });
};

QUnit.assert.exists = function(selector, ...args) {
  let expectedCount = (typeof(args[0]) === 'string') ? null : args[0];
  let prependMessage = (typeof(args[0]) === 'string') ? args[0] : args[1];
  let result = false;
  let elementCount = findElements(this, selector).length;
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

QUnit.assert.typeaheadSuggestionsAre = function(selector, suggestions, message) {
  let actualSuggestions = findElements(`${selector} .ember-power-select-option`).toArray().map((option) => option.textContent.trim());
  this.deepEqual(actualSuggestions, suggestions, message || 'Typeahead suggestions should match exactly');
};

function escapeForRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function findElements(context, selector) {
  let regex = new RegExp('(.*):eq\\((.*)\\)(.*)');
  if (regex.test(selector)) {
    let baseSelector = RegExp.$1;
    let ind = RegExp.$2;
    let remainingSelector = RegExp.$3;
    let el = context.test.testEnvironment.element.querySelectorAll(baseSelector)[ind];
    if (remainingSelector) {
      return el.querySelectorAll(remainingSelector);
    } else {
      return [el];
    }
  } else {
    return context.test.testEnvironment.element.querySelectorAll(selector);
  }
}
