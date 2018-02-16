import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  resultsCollapsed: false,
  toggleResultsExpansion() {
    this.toggleProperty('resultsCollapsed');
  }
});
