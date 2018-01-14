import Component from '@ember/component';

export default Component.extend({
  showExplanation: false,
  actions: {
    toggleExplainScore() {
      this.toggleProperty('showExplanation');
    }
  }
});
