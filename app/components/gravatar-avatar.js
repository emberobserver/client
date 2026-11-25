import { attributeBindings, tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@tagName('img')
@attributeBindings('src', 'title', 'alt')
export default class GravatarAvatar extends Component {
  @computed('gravatarId')
  get src() {
    let gravatarId = this.gravatarId || '';
    return `https://secure.gravatar.com/avatar/${gravatarId}?d=identicon`;
  }
}
