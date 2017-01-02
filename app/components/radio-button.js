import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  isSelected: Ember.computed('selected', 'option', function() {
    let selected = this.get('selected');
    let opt = this.get('option');
    if (!selected) {
      return false;
    }
    return opt.value === selected.value;
  }),
  actions: {
    select(option) {
      this.sendAction('action', option);
    }
  }
});
