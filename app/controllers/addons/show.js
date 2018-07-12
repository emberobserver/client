import { computed } from '@ember/object';
import { alias, readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  addon: alias('model.addon'),
  sortedReviews: computed('addon.reviews', function() {
    return (this.get('addon.reviews') || []).sortBy('versionReleased').reverse();
  }),
  latestReview: alias('sortedReviews.firstObject'),
  sortedCategories: computed('model.categories', function() {
    return (this.get('model.categories') || []).sortBy('displayName');
  }),
  sortedAddonVersions: computed('addon.versions', function() {
    return (this.get('addon.versions') || []).sortBy('released').reverse();
  }),
  latestVersion: readOnly('sortedAddonVersions.firstObject'),
  isLatestReleaseInLast3Months: computed('latestVersion.released', function() {
    if (!this.get('latestVersion.released')) {
      return false;
    }
    let threeMonthsAgo = moment().subtract(3, 'months');
    return moment(this.get('latestVersion.released')).isAfter(threeMonthsAgo);
  }),
  isLatestReviewForLatestVersion: computed('latestReview.version.version', 'latestVersion.version', function() {
    return this.get('latestReview.version.version') === this.get('latestVersion.version');
  }),
  isTestResultForLatestVersion: computed('model.latestTestResult.version', 'latestVersion', function() {
    return this.get('model.latestTestResult.version.version') === this.get('latestVersion.version');
  }),
  hasGithubData: computed('addon.hasInvalidGithubRepo', 'addon.githubStats.firstCommitDate', function() {
    return !this.get('addon.hasInvalidGithubRepo') && this.get('addon.githubStats.firstCommitDate');
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
      newReview.set('version', this.get('latestVersion'));
      newReview.save()
      .then(function() {
        // TODO: Fix this once 'latestReview' is put on addon
        return controller.get('addon').hasMany('reviews').reload();
      }).catch(function(e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
        alert('Saving failed');
      }).finally(function() {
        controller.set('newReview', null);
        controller.set('isReviewing', false);
      });
    }
  }

});
