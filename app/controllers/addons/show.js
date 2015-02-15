import Ember from 'ember';

function sortBy( arrProp, sortProperty ) {
  var sortProperties = sortProperty.split(':');
  var sortProp = sortProperties[0];
  var sortDirection = sortProperties[1];
  return Ember.computed( arrProp + '.@each.' + sortProp, function(){
    var val = this.get(arrProp);
    if(!val) { return []; }
    var sorted = this.get(arrProp).sortBy(sortProp);
    if (sortDirection === 'desc') {
      return sorted.reverse();
    } else {
      return sorted;
    }
  });
}

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
  sortedVersions: sortBy('model.versions', 'released:desc'),
  latestVersion: Ember.computed.alias('sortedVersions.firstObject'),
  latestReview: Ember.computed.alias('latestVersion.review'),
  actions: {
    save: function(){
      var controller = this;
      this.set('isSaving', true);
      this.get('model').save().finally(function(){
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
      newReview.set('version', this.get('latestVersion'));
      newReview.save().finally(function(){
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    }
  }

});
