import Component from '@ember/component';

export default Component.extend({
  actions: {
    select(option) {
      this.set('selected', option);
      this.sendAction('selectOption', this.get('valueField'), option.value);
    }
  }
});
