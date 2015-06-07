import Ember from 'ember';

export default Ember.Component.extend({
  anchor: Ember.computed('url', 'isInserted', function(){
    if(this.get('isInserted')){
      return this.$('a')[0];
    }
  }),

  domain: Ember.computed('anchor', function() {
    if(this.get('anchor')){
      return this.get('anchor').hostname.replace(/^(www.)?/, '');
    }
  }),

  pathname: Ember.computed('anchor', function() {
    if(this.get('anchor')){
      return this.get('anchor').pathname;
    }
  }),

  didInsertElement: function(){
    this.set('isInserted', true);
  }
});
