import Ember from 'ember';

export default Ember.Component.extend({
  domain: function() {
    if(this.get('url')){
      return new URL(this.get('url')).hostname.replace(/^(www.)?/, '');
    }
  }.property('url'),

  pathname: function() {
    if(this.get('url')){
      return new URL(this.get('url')).pathname;
    }
  }.property('url')
});
