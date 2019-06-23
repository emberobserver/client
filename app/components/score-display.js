import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('')
export default class ScoreDisplayComponent extends Component {
  @computed('addon.{score,hasBeenReviewed}')
  get hasBeenReviewedAndScored() {
    let score = this.get('addon.score');
    return typeof(score) === 'number' && this.get('addon.hasBeenReviewed');
  }
}
