import Ember from 'ember';

export default Ember.Component.extend({
  regex: /\/\/(.*\..*?)(\/.*)/,
  results: function() {
    if (this.get('url')) {
      return this.get('url').match(this.regex);
    }
  }.property('url'),
  domain: function() {
    var results = this.get('results');
    if (results && results[1]) {
      return results[1].replace(/^(www.)?/, '');
    }
  }.property('results'),
  pathname: function() {
    var results = this.get('results');
    if (results && results[2]) {
      return results[2];
    }
  }.property('results')
});
