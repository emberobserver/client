import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'ember-addon-review/tests/helpers/start-app';

var application;

module('Acceptance: Addons', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('displays 0 for score when addon has zero score', function(assert) {
  var addon = server.create('addon', {
    name: 'test-with-zero-score',
    score: 0
  });
  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.score', 'Score 0', 'Displays 0 for score when addon has a score of zero');
  });
});

test('displays N/A for score when addon has no score', function(assert) {
  var addon = server.create('addon', {
    name: 'test-with-na-score',
    score: null
  });
  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.score', 'N/A', 'Displays N/A for score when addon has no score');
  });
});

QUnit.assert.contains = function( selector, text, message ) {
  var elements = find(selector);
  var result = false;
  var regex = new RegExp(escapeForRegex(text) + "($|\\W)", 'gm');
  elements.each(function(){
    if(regex.test($(this).text())){
      result = true;
    }
  });

  if(!result){
    message = message + ` - ${selector} containing ${text} should exist.`;
  }

  this.push(result, result, true, message);
};

function escapeForRegex(str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
