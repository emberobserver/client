import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  isSelected: Ember.computed('selected', 'option', function() {
    var selected = this.get('selected');
    var opt = this.get('option');
    if (!selected) { return false; }
    return opt.value === selected.value;
  }),
  actions: {
    select: function(option) {
      this.sendAction('action', option);
    }
  }
});
