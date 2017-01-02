import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    select(option) {
      this.set('selected', option);
      this.sendAction('selectOption', this.get('valueField'), option.value);
    }
  }
});
