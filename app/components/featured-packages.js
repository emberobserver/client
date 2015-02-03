import Ember from 'ember';

export default Ember.Component.extend({
  displayedPackages: function() {
    var packages = this.get('packages');
    return packages.slice(0, this.get('count'));
  }.property('packages', 'sort', 'count')
});
