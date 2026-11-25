/* eslint-disable ember/no-classic-classes */
import Component from '@glimmer/component';

export default class SvgIcon extends Component {<template><svg class="icon icon-{{@iconName}} {{if this.alignBaseline "baseline"}} {{@class}}"><title>{{@title}}</title><use xlink:href="#icon-{{@iconName}}"></use></svg>
</template>
  get alignBaseline() {
    return this.args.alignBaseline ?? true;
  }
}
