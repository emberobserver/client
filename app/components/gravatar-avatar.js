import classic from 'ember-classic-decorator';
import { attribute, tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('img')
export default class GravatarAvatarComponent extends Component {
  @computed('gravatarId')
  @attribute
  get src() {
    let gravatarId = this.get('gravatarId') || '';
    return `https://secure.gravatar.com/avatar/${gravatarId}?d=identicon`;
  }
}
