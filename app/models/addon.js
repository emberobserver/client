import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import sortBy from '../utils/sort-by';
import moment from 'moment';

export default Model.extend({
  isAddon: true,
  name: attr('string'),
  description: attr('string'),
  repositoryUrl: attr('string'),
  latestVersionDate: attr('date'),
  publishedDate: attr('date'),
  latestReviewedVersionDate: attr('date'),
  license: attr('string'),
  isDeprecated: attr('boolean'),
  note: attr('string'),
  renderedNote: attr('string'),
  isOfficial: attr('boolean'),
  isCliDependency: attr('boolean'),
  isHidden: attr('boolean'),
  hasInvalidGithubRepo: attr('boolean'),
  score: attr('number'),
  ranking: attr('number'),
  githubUsers: hasMany('github-user'),
  lastMonthDownloads: attr('number'),
  isWip: attr('boolean'),
  isTopDownloaded: attr('boolean'),
  isTopStarred: attr('boolean'),
  demoUrl: attr('string'),
  githubStats: belongsTo('github-stats', { async: true }),
  categories: hasMany('category', { async: false }),
  keywords: hasMany('keyword', { async: true }),
  versions: hasMany('version', { async: true }),
  maintainers: hasMany('maintainer', { async: true }),
  reviews: hasMany('review', { async: true }),
  readme: belongsTo('readme', { async: true }),
  sortedVersions: sortBy('versions', 'released:desc'),
  latestVersion: Ember.computed.alias('sortedVersions.firstObject'),
  oldestVersion: Ember.computed.alias('sortedVersions.lastObject'),
  hasMoreThan1Contributor: Ember.computed.gt('githubUsers.length', 1),
  npmUrl: Ember.computed('name', function() {
    return `https://www.npmjs.com/package/${this.get('name')}`;
  }),
  isNewAddon: Ember.computed('publishedDate', function() {
    return moment(this.get('publishedDate')).isAfter(moment().subtract(2, 'weeks'));
  })
});
