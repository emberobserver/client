import Component from '@ember/component';

export default Component.extend({
  select(option) {
    this.set('selected', option);
    this.selectOption(this.valueField, option.value);
  }
});
