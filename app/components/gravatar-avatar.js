import Component from '@glimmer/component';

export default class GravatarAvatar extends Component {
  get src() {
    let gravatarId = this.args.gravatarId || '';
    return `https://secure.gravatar.com/avatar/${gravatarId}?d=identicon`;
  }
}
