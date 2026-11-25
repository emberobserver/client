import asArray from 'ember-observer/utils/as-array';
import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class ScoreDetail extends Component {
  constructor(owner, args) {
    super(owner, args);
    this.fetchScoreCalculation.perform();
  }

  @tracked
  showExplanation = false;

  get addon() {
    return this.args.addon;
  }

  @service
  store;

  @task(function* () {
    let calculationResult = yield this.store.query('score-calculation', {
      filter: { addonId: get(this.addon, 'id'), latest: true },
    });
    return asArray(calculationResult)[0];
  })
  fetchScoreCalculation;

  @action
  toggleExplainScore() {
    this.showExplanation = !this.showExplanation;
  }
}
