import Ember from 'ember';

export default Ember.Component.extend({
  regex: /\/\/(.*\..*?)(\/.*)/,
  results: function() {
    return this.get('url').match(this.regex);
  }.property('url'),
  domain: function() {
    return this.get('results')[1].replace(/^(www.)?/, '');
  }.property('results'),
  pathname: function() {
    return this.get('results')[2];
  }.property('results')
});
