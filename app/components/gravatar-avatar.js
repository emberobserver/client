import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'title', 'alt'],
  src: Ember.computed('gravatarId', function(){
    var gravatarId = this.get('gravatarId') || "";
    return `https://secure.gravatar.com/avatar/${gravatarId}?d=identicon`;
  })
});
