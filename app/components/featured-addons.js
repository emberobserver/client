import Ember from 'ember';

export default Ember.Component.extend({
  displayedAddons: function() {
    var addons = this.get('addons');
    return addons.slice(0, this.get('count'));
  }.property('addons', 'sort', 'count')
});
