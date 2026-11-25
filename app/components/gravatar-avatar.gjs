import Component from '@glimmer/component';

export default class GravatarAvatar extends Component {<template><img src={{this.src}} title={{@title}} alt={{@alt}} ...attributes />
</template>
  get src() {
    let gravatarId = this.args.gravatarId || '';
    return `https://secure.gravatar.com/avatar/${gravatarId}?d=identicon`;
  }
}
