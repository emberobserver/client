import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  separator: Ember.computed('list.lastObject', 'item', function(){
    if(this.get('list.lastObject') === this.get('item')){
      return "";
    }
    else {
      return ", ";
    }
  })
});
