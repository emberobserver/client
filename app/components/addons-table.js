import Ember from 'ember';

export default Ember.Component.extend({
  sortKey: 'score',
  sortedAddons: Ember.computed.sort('addons', 'addonSorting'),

  actions: {
    showAddon: function(addon){
      this.sendAction("showAddon", addon);
    }
  },

  addonSorting: function() {
    var sortKeyMapping = {
      'latestVersionDate': 'latestVersionDate:desc',
      'name': 'name:asc',
      'score': 'score:desc',
    };
    var sortKey = sortKeyMapping[ this.get('sortKey') ] || 'score:desc';
    return [ sortKey ];
  }.property('sortKey')
});
