/* global QUnit */

import { findAll } from '@ember/test-helpers';
import { clickTrigger } from 'ember-power-select/test-support/helpers';

QUnit.assert.typeaheadSuggestionsAre = function(selector, suggestions, message) {
  let actualSuggestions = findAll(`${selector} .ember-power-select-option`).map((option) => option.textContent.trim());
  this.deepEqual(actualSuggestions, suggestions, message || 'Typeahead suggestions should match exactly');
};

QUnit.assert.powerSelectOptionsAre = async function(parentSelector, dropdownSelector, expectedOptions, customMessage) {
  let actualOptions = await powerSelectOptions(parentSelector, dropdownSelector);
  this.deepEqual(actualOptions, expectedOptions, customMessage || `Options in ${dropdownSelector} should match expected options`);
};

QUnit.assert.powerSelectMultipleOptionSelected = function(selector, expectedValue, customMessage) {
  this.dom(`${selector} .ember-power-select-multiple-trigger`).includesText(expectedValue, customMessage);
};

async function powerSelectOptions(parentSelector, dropdownSelector) {
  let originalOptions = document.querySelectorAll(`${dropdownSelector} .ember-power-select-option`);

  if (!originalOptions.length) {
    await clickTrigger(parentSelector);
  }

  let actualOptions = Array.from(document.querySelectorAll(`${dropdownSelector} .ember-power-select-option`)).map((option) => option.textContent.trim());

  if (!originalOptions.length) {
    await clickTrigger(parentSelector);
  }

  return actualOptions;
}
