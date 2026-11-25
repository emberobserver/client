import Component from '@glimmer/component';
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";

export default class SortOption extends Component {<template><button type="button" class="button-option {{if this.isSelected "selected"}}" {{on "click" (fn @sortBy @key)}} ...attributes>
  {{@name}}
</button>
</template>
  get isSelected() {
    return this.args.selectedSort === this.args.key;
  }
}
