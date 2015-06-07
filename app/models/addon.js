import Ember from 'ember';
import DS from 'ember-data';
import sortBy from '../utils/sort-by';

var attr = DS.attr;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  isAddon: true,
  name: attr('string'),
  description: attr('string'),
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
  score: attr('number'),
  openIssues: attr('number'),
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
  categories: hasMany('category', {async: true}),
  keywords: hasMany('keyword', {async: true}),
  versions: hasMany('version', {async: true}),
  maintainers: hasMany('maintainer'),
  reviews: hasMany('review', {async: true}),
  sortedVersions: sortBy('versions', 'released:desc'),
  latestVersion: Ember.computed.alias('sortedVersions.firstObject'),
  oldestVersion: Ember.computed.alias('sortedVersions.lastObject'),
  hasMoreThan1Contributor: Ember.computed.gt('contributors.length', 1),
  hasGithubData: Ember.computed('hasInvalidGithubRepo', 'firstCommitDate', function(){
    return !this.get('hasInvalidGithubRepo') && this.get('firstCommitDate');
  }),
  npmUrl: Ember.computed('name', function(){
    return `https://www.npmjs.com/package/${this.get('name')}`;
  })
});
