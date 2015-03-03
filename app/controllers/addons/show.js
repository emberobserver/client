import Ember from 'ember';
import sortBy from '../../utils/sort-by';

export default Ember.Controller.extend({
  categories: function(){
    return this.store.all('category');
  }.property(),

  //BUG: See https://github.com/emberjs/data/issues/2666
  keywords: Ember.computed.filterBy('model.keywords', 'isDeleted', false),
  maintainers: Ember.computed.filterBy('model.maintainers', 'isDeleted', false),

  licenseUrl: function(){
    return `https://spdx.org/licenses/${this.get('model.license')}`;
  }.property('model.license'),
  sortedReviews: sortBy('model.reviews', 'version.released:desc'),
  latestReview: Ember.computed.alias('sortedReviews.firstObject'),
  isLatestReviewForLatestVersion: function(){
    return this.get('latestReview') === this.get('model.latestVersion.review');
  }.property('latestReview', 'model.latestVersion.review'),
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
    saveReview: function(newReview){
      var controller = this;
      newReview.set('version', this.get('model.latestVersion'));
      newReview.save().catch(function() {
        alert("Saving failed");
      }).finally(function(){
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    }
  }

});
