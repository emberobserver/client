import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  resultsCollapsed: false,
  toggleResultsExpansion() {
    this.toggleProperty('resultsCollapsed');
  }
});
