import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { questions } from '../models/review';

const ANSWER_MAP = {
  1: 'Yes',
  2: 'No',
  3: 'N/A',
  4: 'Unknown'
};

export default class AddonReview extends Component {
  get answeredQuestions() {
    let review = this.args.review;
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
