import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import sortBy from '../utils/sort-by';

export default Model.extend({
  isAddon: true,
  name: attr('string'),
  description: attr('string'),
  isFullyLoaded: attr('boolean'),
  repositoryUrl: attr('string'),
  latestVersionDate: attr('date'),
  latestReviewedVersionDate: attr('date'),
  license: attr('string'),
  isDeprecated: attr('boolean'),
  note: attr('string'),
  renderedNote: attr('string'),
  isOfficial: attr('boolean'),
  isCliDependency: attr('boolean'),
  isHidden: attr('boolean'),
  hasInvalidGithubRepo: attr('boolean'),
  isNewAddon: attr('boolean'),
  publishedDate: attr('date'),
  score: attr('number'),
  openIssues: attr('number'),
  ranking: attr('number'),
  forks: attr('number'),
  contributors: attr('array'),
  firstCommitDate: attr('date'),
  latestCommitDate: attr('date'),
  lastMonthDownloads: attr('number'),
  stars: attr('number'),
  isWip: attr('boolean'),
  isTopDownloaded: attr('boolean'),
  committedToRecently: attr('boolean'),
  isTopStarred: attr('boolean'),
  demoUrl: attr('string'),
  categories: hasMany('category', { async: true }),
  keywords: hasMany('keyword', { async: true }),
  versions: hasMany('version', { async: true }),
  maintainers: hasMany('maintainer', { async: true }),
  reviews: hasMany('review', { async: true }),
  readme: belongsTo('readme', { async: true }),
  sortedVersions: sortBy('versions', 'released:desc'),
  latestVersion: Ember.computed.alias('sortedVersions.firstObject'),
  oldestVersion: Ember.computed.alias('sortedVersions.lastObject'),
  hasMoreThan1Contributor: Ember.computed.gt('contributors.length', 1),
  hasGithubData: Ember.computed('hasInvalidGithubRepo', 'firstCommitDate', function() {
    return !this.get('hasInvalidGithubRepo') && this.get('firstCommitDate');
  }),
  npmUrl: Ember.computed('name', function() {
    return `https://www.npmjs.com/package/${this.get('name')}`;
  })
});
