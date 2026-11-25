import Component from '@glimmer/component';
import XSelect from "./x-select.gjs";

export default class CategoryPositionDropdown extends Component {<template><div ...attributes>
<XSelect @value={{this.position}} @action={{@updatePosition}} as |xs|>
  <xs.option @value={{-1}}>At end</xs.option>
  {{#each this.categories as |category|}}
    <xs.option @value={{category.position}}>Before "{{category.name}}"</xs.option>
  {{/each}}
</XSelect>
</div>
</template>
  get categories() {
    return this.args.categories;
  }

  get position() {
    return this.args.position ?? -1;
  }
}
