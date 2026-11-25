import Component from '@glimmer/component';
import ExclusiveButton from "./exclusive-button.gjs";

export default class ExclusiveButtonGroup extends Component {<template><div ...attributes>
<div>
  {{yield (component ExclusiveButton selectedValue=this.selectedValue updateSelectedValue=this.updateSelectedValue)}}
</div>
</div>
</template>
  get selectedValue() {
    return this.args.selectedValue;
  }

  get updateSelectedValue() {
    return this.args.updateSelectedValue;
  }
}
