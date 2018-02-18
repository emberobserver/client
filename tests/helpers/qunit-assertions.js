/* global QUnit */

import { findAll } from '@ember/test-helpers';

QUnit.assert.typeaheadSuggestionsAre = function(selector, suggestions, message) {
  let actualSuggestions = findAll(`${selector} .ember-power-select-option`).map((option) => option.textContent.trim());
  this.deepEqual(actualSuggestions, suggestions, message || 'Typeahead suggestions should match exactly');
};
