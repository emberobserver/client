import { isEmpty } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  answerMap: {
    1: 'Yes',
    2: 'No',
    3: 'N/A',
    4: 'Unknown'
  },
  answeredQuestions: computed('review', function() {
    let component = this;
    let review = this.get('review');
    if (!review) {
      return;
    }
    return review.questions.filter(function(question) {
      return !isEmpty(review.get(question.fieldName));
    }).map(function(question) {
      return EmberObject.create({
        text: question.text,
        answer: component.answerMap[review.get(question.fieldName)]
      });
    });
  })
});
