import Ember from 'ember';

export default Ember.Component.extend({
  regex: /\/\/(.*\..*?)(\/.*)/,
  results: Ember.computed('url', function() {
    if (this.get('url')) {
      return this.get('url').match(this.regex);
    }
  }),
  domain: Ember.computed('results', function() {
    var results = this.get('results');
    if (results && results[1]) {
      return results[1].replace(/^(www.)?/, '');
    }
  }),
  pathname: Ember.computed('results', function() {
    var results = this.get('results');
    if (results && results[2]) {
      return results[2];
    }
  })
});
