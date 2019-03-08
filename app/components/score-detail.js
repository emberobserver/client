import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';


export default Component.extend({
  showExplanation: false,

  addon: null,

  store: service(),

  init() {
    this._super(...arguments);
    this.get('fetchScoreCalculation').perform();
  },

  fetchScoreCalculation: task(function * () {
    let calculationResult = yield this.store.query('score-calculation', { filter: { addonId: this.addon.get('id'), latest: true } });
    return calculationResult.get('firstObject');
  }),

  actions: {
    toggleExplainScore() {
      this.toggleProperty('showExplanation');
    }
  }
});
