import Ember from 'ember';

export default Ember.Component.extend({
  addonSorting: [ 'score:desc' ],
  sortedAddons: Ember.computed.sort('addons', 'addonSorting'),

  actions: {
    showAddon: function(addon){
      this.sendAction("showAddon", addon);
    }
  }
});
