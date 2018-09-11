import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import { questions } from '../models/review';

export default Component.extend({
  answerMap: {
    1: 'Yes',
    2: 'No',
    3: 'N/A',
    4: 'Unknown'
  },
  answeredQuestions: computed('review', function() {
    let component = this;
    let review = this.review;
    return questions.filter(function(question) {
      return !isEmpty(review.get(question.fieldName));
    }).map(function(question) {
      return {
        text: question.text,
        answer: component.answerMap[review.get(question.fieldName)]
      };
    });
  })
});
