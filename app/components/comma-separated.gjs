import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import Component from '@glimmer/component';

export default class CommaSeparated extends Component {<template><span ...attributes>
{{yield @item this.separator}}

</span>
</template>
  get separator() {
    if (asArray(get(this.args, 'list')).slice(-1)[0] === this.args.item) {
      return '';
    } else {
      return ', ';
    }
  }
}
