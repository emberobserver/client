import Ember from 'ember';

export default Ember.Component.extend({
  domain: function() {
    return new URL(this.get('url')).hostname.replace(/^(www.)?/, '');
  }.property('url'),

  pathname: function() {
    return new URL(this.get('url')).pathname;
  }.property('url')
});
