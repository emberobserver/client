import Ember from 'ember';
import sortBy from '../../utils/sort-by';
import moment from 'moment';

export default Ember.Controller.extend({
  addon: Ember.computed.alias('model.addon'),
  showExplanation: false,
  showBadgeText: false,
  categories: Ember.computed(function() {
    return this.get('store').peekAll('category').sortBy('displayName');
  }),
  licenseUrl: Ember.computed('addon.license', function() {
    return `https://spdx.org/licenses/${this.get('addon.license')}`;
  }),
  sortedReviews: sortBy('addon.reviews', 'versionReleased:desc'),
  latestReview: Ember.computed.alias('sortedReviews.firstObject'),
  isLatestReleaseInLast3Months: Ember.computed('addon.latestVersion.released', function() {
    if (!this.get('addon.latestVersion.released')) {
      return false;
    }
    let threeMonthsAgo = moment().subtract(3, 'months');
    return moment(this.get('addon.latestVersion.released')).isAfter(threeMonthsAgo);
  }),
  isLatestReviewForLatestVersion: Ember.computed('latestReview', 'addon.latestVersion.review', function() {
    return this.get('latestReview') === this.get('addon.latestVersion.review');
  }),
  badgeText: Ember.computed('addon.name', function() {
    return `[![Ember Observer Score](https://emberobserver.com/badges/${this.get('addon.name')}.svg)](https://emberobserver.com/addons/${this.get('addon.name')})`;
  }),
  installCommandText: Ember.computed('addon.name', function() {
    return `ember install ${this.get('addon.name')}`;
  }),
  badgeSrc: Ember.computed('addon.name', function() {
    return `https://emberobserver.com/badges/${this.get('addon.name')}.svg`;
  }),
  isTestResultForLatestVersion: Ember.computed('model.latestTestResult.version', 'addon.latestVersion', function() {
    return this.get('model.latestTestResult.version.version') === this.get('addon.latestVersion.version');
  }),

  actions: {
    save() {
      let controller = this;
      this.set('isSaving', true);
      this.get('addon').save().catch(function() {
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
      newReview.set('version', this.get('addon.latestVersion'));
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
