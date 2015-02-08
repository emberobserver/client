import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  separator: function(){
    if(this.get('list.lastObject') === this.get('item')){
      return "";
    }
    else {
      return ", ";
    }
  }.property('list.lastObject', 'item')
});
