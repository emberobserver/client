import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'title', 'alt'],
  src: computed('gravatarId', function() {
    let gravatarId = this.get('gravatarId') || '';
    return `https://secure.gravatar.com/avatar/${gravatarId}?d=identicon`;
  })
});
