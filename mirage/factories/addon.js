import { Factory } from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  name: (i) => `ember-${i}`,
  description: (i) => `An addon that provides stuff ${i}`,
  repositoryUrl: 'https://github.com/kategengler/ember-feature-flags',
  latestVersionDate: '2014-12-21T23:17:50.212Z',
  latestReviewedVersionDate: null,
  license: 'MIT',
  isDeprecated: false,
  note: '#Test',
  isOfficial: false,
  isCliDependency: false,
  isHidden: false,
  hasInvalidGithubRepo: false,
  isNewAddon: false,
  score: 2,
  lastMonthDownloads: 1,
  isWip: false,
  isTopDownloaded: false,
  isTopStarred: false,
  demoUrl: null,
  publishedDate: null,
  extendsEmber: null,
  extendsEmberCli: null,
  isMonorepo: null,
  overrideRepositoryUrl: null,
  updatedAt() {
    return faker.date.recent();
  },
  hasBeenReviewed() {
    return !!this.latestReview;
  }
});
