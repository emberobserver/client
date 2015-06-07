import Ember from 'ember';

export default Ember.Component.extend({
  answerMap: {
    1: "Yes",
    2: "No",
    3: "N/A",
    4: "Unknown"
  },
  answeredQuestions: Ember.computed('review', function(){
    var component = this;
    var review = this.get('review');
    if(!review) { return; }
    return review.questions.filter(function(question) {
      return !Ember.isEmpty(review.get(question.fieldName));
    }).map(function(question){
      return Ember.Object.create({
        text: question.text,
        answer: component.answerMap[review.get(question.fieldName)]
      });
    });
  })
});
