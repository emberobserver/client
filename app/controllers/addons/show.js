import Ember from 'ember';
import sortBy from '../../utils/sort-by';
import moment from 'moment';

export default Ember.Controller.extend({
  showExplanation: false,
  showBadgeText: false,
  categories: function() {
    return this.get('store').peekAll('category').sortBy('displayName');
  }.property(),

  //BUG: See https://github.com/emberjs/data/issues/2666
  keywords: Ember.computed.filterBy('model.keywords', 'isDeleted', false),
  maintainers: Ember.computed.filterBy('model.maintainers', 'isDeleted', false),

  licenseUrl: function() {
    return `https://spdx.org/licenses/${this.get('model.license')}`;
  }.property('model.license'),
  sortedReviews: sortBy('model.reviews', 'versionReleased:desc'),
  latestReview: Ember.computed.alias('sortedReviews.firstObject'),
  isLatestReleaseInLast3Months: function() {
    if (!this.get('model.latestVersion.released')) { return false; }
    var threeMonthsAgo = moment().subtract(3, 'months');
    return moment(this.get('model.latestVersion.released')).isAfter(threeMonthsAgo);
  }.property('model.latestVersion.released'),
  isLatestReviewForLatestVersion: function() {
    return this.get('latestReview') === this.get('model.latestVersion.review');
  }.property('latestReview', 'model.latestVersion.review'),
  badgeText: function() {
    return `[![Ember Observer Score](https://emberobserver.com/badges/${this.get('model.name')}.svg)](https://emberobserver.com/addons/${this.get('model.name')})`;
  }.property('model.name'),
  installCommandText: function() {
    return `ember install ${this.get('model.name')}`;
  }.property('model.name'),
  badgeSrc: function() {
    return `https://emberobserver.com/badges/${this.get('model.name')}.svg`;
  }.property('model.name'),

  latestTestResult: Ember.computed('model.sortedVersions.@each.latestTestResult', function() {
    debugger;
    return this.get('model.sortedVersions').filter(version => version.get('latestTestResult')).get('firstObject.latestTestResult');
  }),
  isTestResultForLatestVersion: Ember.computed('latestTestResult.version', 'model.latestVersion', function() {
    return this.get('latestTestResult.version.version') === this.get('model.latestVersion.version');
  }),

  actions: {
    save: function() {
      var controller = this;
      this.set('isSaving', true);
      this.get('model').save().catch(function() {
        alert('Saving failed');
      }).finally(function() {
        controller.set('isSaving', false);
      });
    },
    review: function() {
      var newReview = this.get('store').createRecord('review');
      this.set('newReview', newReview);
      this.set('isReviewing', true);
    },
    renewLatestReview: function() {
      var newReview = this.get('store').createRecord('review');
      var latestReview = this.get('latestReview');

      latestReview.questions.forEach(function(question) {
        newReview.set(question.fieldName, latestReview.get(question.fieldName));
      });
      newReview.set('review', latestReview.get('review'));

      this.send('saveReview', newReview);
    },
    saveReview: function(newReview) {
      var controller = this;
      newReview.set('version', this.get('model.latestVersion'));
      newReview.save().catch(function() {
        alert('Saving failed');
      }).finally(function() {
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    },
    toggleExplainScore: function() {
      this.toggleProperty('showExplanation');
    },
    toggleBadgeText: function() {
      this.toggleProperty('showBadgeText');
    }
  }

});
