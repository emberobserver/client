import Ember from 'ember';
import sortBy from '../../utils/sort-by';
import moment from 'moment';

export default Ember.Controller.extend({
  showExplanation: false,
  showBadgeText: false,
  categories: Ember.computed(function() {
    return this.get('store').peekAll('category').sortBy('displayName');
  }),

  // BUG: See https://github.com/emberjs/data/issues/2666
  keywords: Ember.computed.filterBy('model.keywords', 'isDeleted', false),
  maintainers: Ember.computed.filterBy('model.maintainers', 'isDeleted', false),

  licenseUrl: Ember.computed('model.license', function() {
    return `https://spdx.org/licenses/${this.get('model.license')}`;
  }),
  sortedReviews: sortBy('model.reviews', 'versionReleased:desc'),
  latestReview: Ember.computed.alias('sortedReviews.firstObject'),
  isLatestReleaseInLast3Months: Ember.computed('model.latestVersion.released', function() {
    if (!this.get('model.latestVersion.released')) {
      return false;
    }
    let threeMonthsAgo = moment().subtract(3, 'months');
    return moment(this.get('model.latestVersion.released')).isAfter(threeMonthsAgo);
  }),
  isLatestReviewForLatestVersion: Ember.computed('latestReview', 'model.latestVersion.review', function() {
    return this.get('latestReview') === this.get('model.latestVersion.review');
  }),
  badgeText: Ember.computed('model.name', function() {
    return `[![Ember Observer Score](https://emberobserver.com/badges/${this.get('model.name')}.svg)](https://emberobserver.com/addons/${this.get('model.name')})`;
  }),
  installCommandText: Ember.computed('model.name', function() {
    return `ember install ${this.get('model.name')}`;
  }),
  badgeSrc: Ember.computed('model.name', function() {
    return `https://emberobserver.com/badges/${this.get('model.name')}.svg`;
  }),

  latestTestResult: Ember.computed('model.sortedVersions.@each.latestTestResult', function() {
    return this.get('model.sortedVersions').filter((version) => version.get('latestTestResult')).get('firstObject.latestTestResult');
  }),
  isTestResultForLatestVersion: Ember.computed('latestTestResult.version', 'model.latestVersion', function() {
    return this.get('latestTestResult.version.version') === this.get('model.latestVersion.version');
  }),

  actions: {
    save() {
      let controller = this;
      this.set('isSaving', true);
      this.get('model').save().catch(function() {
        alert('Saving failed');
      }).finally(function() {
        controller.set('isSaving', false);
      });
    },
    review() {
      let newReview = this.get('store').createRecord('review');
      this.set('newReview', newReview);
      this.set('isReviewing', true);
    },
    renewLatestReview() {
      let newReview = this.get('store').createRecord('review');
      let latestReview = this.get('latestReview');

      latestReview.questions.forEach(function(question) {
        newReview.set(question.fieldName, latestReview.get(question.fieldName));
      });
      newReview.set('review', latestReview.get('review'));

      this.send('saveReview', newReview);
    },
    saveReview(newReview) {
      let controller = this;
      newReview.set('version', this.get('model.latestVersion'));
      newReview.save().catch(function() {
        alert('Saving failed');
      }).finally(function() {
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    },
    toggleExplainScore() {
      this.toggleProperty('showExplanation');
    },
    toggleBadgeText() {
      this.toggleProperty('showBadgeText');
    }
  }

});
