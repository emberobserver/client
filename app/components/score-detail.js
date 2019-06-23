import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';


@classic
export default class ScoreDetailComponent extends Component {
  showExplanation = false;
  addon = null;

  @service
  @service
  store;

  init() {
    super.init(...arguments);
    this.get('fetchScoreCalculation').perform();
  }

  @task
  fetchScoreCalculation;

  @action
  toggleExplainScore() {
    this.toggleProperty('showExplanation');
  }
}
