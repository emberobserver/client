import Ember from 'ember';

export default Ember.Component.extend({
  displayedAddons: Ember.computed('addons', 'sort', 'count', function() {
    var addons = this.get('addons');
    return addons.slice(0, this.get('count'));
  })
});
