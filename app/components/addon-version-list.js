import Ember from 'ember';

export default Ember.Component.extend({
  showAll: false,
  showingVersions: function() {
    if (this.get('showAll')) {
      return this.get('versions');
    }
    return this.get('versions').slice(0, 10);
  }.property('versions', 'showAll'),
  moreThan10Versions: Ember.computed.gt('versions.length', 10),
  thereAreHiddenVersions: function() {
    return this.get('moreThan10Versions') && !this.get('showAll');
  }.property('moreThan10Versions', 'showAll'),
  actions: {
    showAllVersions: function() {
      this.set('showAll', true);
    }
  }
});
