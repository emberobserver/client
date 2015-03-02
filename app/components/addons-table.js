import Ember from 'ember';

export default Ember.Component.extend({
  sortKey: 'score:desc',
  sortedAddons: Ember.computed.sort('addons', 'addonSorting'),

  actions: {
    showAddon: function(addon){
      this.sendAction("showAddon", addon);
    }
  },

  addonSorting: function() {
    return [ this.get('sortKey') ];
  }.property('sortKey')
});
