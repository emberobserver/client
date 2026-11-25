import asArray from 'ember-observer/utils/as-array';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default class ScoreDetail extends Component {
  showExplanation = false;
  addon = null;

  @service
  store;

  init() {
    super.init(...arguments);
    this.fetchScoreCalculation.perform();
  }

  @task(function* () {
    let calculationResult = yield this.store.query('score-calculation', {
      filter: { addonId: this.addon.get('id'), latest: true },
    });
    return asArray(calculationResult)[0];
  })
  fetchScoreCalculation;

  @action
  toggleExplainScore() {
    this.toggleProperty('showExplanation');
  }
}
