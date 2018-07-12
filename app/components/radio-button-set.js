import Component from '@ember/component';

export default Component.extend({
  select(option) {
    this.set('selected', option);
    this.get('selectOption')(this.get('valueField'), option.value);
  }
});
