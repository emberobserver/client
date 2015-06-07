import Ember from 'ember';
import sortBy from '../../utils/sort-by';

export default Ember.Controller.extend({
  showExplanation: false,
  categories: Ember.computed(function(){
    return this.store.all('category').sortBy('displayName');
  }),

  //BUG: See https://github.com/emberjs/data/issues/2666
  keywords: Ember.computed.filterBy('model.keywords', 'isDeleted', false),
  maintainers: Ember.computed.filterBy('model.maintainers', 'isDeleted', false),

  licenseUrl: Ember.computed('model.license', function(){
    return `https://spdx.org/licenses/${this.get('model.license')}`;
  }),
  sortedReviews: sortBy('model.reviews', 'version.released:desc'),
  latestReview: Ember.computed.alias('sortedReviews.firstObject'),
  isLatestReleaseInLast3Months: Ember.computed('model.latestVersion.released', function(){
    var threeMonthsAgo = window.moment().subtract(3, 'months');
    return window.moment(this.get('model.latestVersion.released')).isAfter(threeMonthsAgo);
  }),
  isLatestReviewForLatestVersion: Ember.computed('latestReview', 'model.latestVersion.review', function(){
    return this.get('latestReview') === this.get('model.latestVersion.review');
  }),
  badgeText: Ember.computed('model.name', function(){
    return `[![Ember Observer Score](http://emberobserver.com/badges/${this.get('model.name')}.svg)](http://emberobserver.com/addons/${this.get('model.name')})`;
  }),
  installCommandText: Ember.computed('model.name', function(){
    return `ember install ${this.get('model.name')}`;
  }),
  badgeSrc: Ember.computed('model.name', function(){
    return `http://emberobserver.com/badges/${this.get('model.name')}.svg`;
  }),
  actions: {
    save: function(){
      var controller = this;
      this.set('isSaving', true);
      this.get('model').save().catch(function() {
        alert("Saving failed");
      }).finally(function(){
        controller.set('isSaving', false);
      });
    },
    review: function(){
      var newReview = this.store.createRecord('review');
      this.set('newReview', newReview);
      this.set('isReviewing', true);
    },
    renewLatestReview: function(){
      var newReview = this.store.createRecord('review');
      var latestReview = this.get('latestReview');

      latestReview.questions.forEach(function(question){
        newReview.set(question.fieldName, latestReview.get(question.fieldName));
      });
      newReview.set('review', latestReview.get('review'));

      this.send('saveReview', newReview);
    },
    saveReview: function(newReview){
      var controller = this;
      newReview.set('version', this.get('model.latestVersion'));
      newReview.save().catch(function() {
        alert("Saving failed");
      }).finally(function(){
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    },
    toggleExplainScore: function(){
      this.toggleProperty('showExplanation');
    }
  }

});
