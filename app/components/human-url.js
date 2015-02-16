import Ember from 'ember';

export default Ember.Component.extend({
  anchor: function(){
    if(this.get('isInserted')){
      return this.$('a')[0];
    }
  }.property('url', 'isInserted'),

  domain: function() {
    if(this.get('anchor')){
      return this.get('anchor').hostname.replace(/^(www.)?/, '');
    }
  }.property('anchor'),

  pathname: function() {
    if(this.get('anchor')){
      return this.get('anchor').pathname;
    }
  }.property('anchor'),

  didInsertElement: function(){
    this.set('isInserted', true);
  }
});
