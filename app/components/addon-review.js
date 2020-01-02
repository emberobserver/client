import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { questions } from '../models/review';

const ANSWER_MAP = {
  1: 'Yes',
  2: 'No',
  3: 'N/A',
  4: 'Unknown'
};

@classic
export default class AddonReview extends Component {
  @computed('review')
  get answeredQuestions() {
    let review = this.review;
    return questions.filter(function(question) {
      return !isEmpty(review.get(question.fieldName));
    }).map(function(question) {
      return {
        text: question.text,
        answer: ANSWER_MAP[review.get(question.fieldName)]
      };
    });
  }
}
