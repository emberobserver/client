import { get } from '@ember/object';
import Component from '@glimmer/component';

export default class ScoreDisplay extends Component {
  get hasBeenReviewedAndScored() {
    let score = get(this.args, 'addon.score');
    return typeof score === 'number' && get(this.args, 'addon.hasBeenReviewed');
  }
}
