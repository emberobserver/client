import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from "@ember/modifier";

export default class ToggleSwitch extends Component {<template><div class="component-toggle-switch" ...attributes>
  <input type="checkbox" name="toggle-switch-{{@name}}" id="toggle-switch-{{@name}}" checked={{@isChecked}} {{on "change" this.onToggle}}>
  <label for="toggle-switch-{{@name}}">{{@label}}</label>
</div>
</template>
  @action
  onToggle(event) {
    const checked = event.target.checked;
    this.args.onToggle(checked);
  }
}
