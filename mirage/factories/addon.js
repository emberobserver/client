import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: (i) => `ember-${i}`,
  description: (i) => `An addon that provides stuff ${i}`,
  repositoryUrl: 'https://github.com/kategengler/ember-feature-flags',
  latestVersionDate: '2014-12-21T23:17:50.212Z',
  latestReviewedVersionDate: null,
  license: 'MIT',
  isDeprecated: false,
  note: '#Test',
  renderedNote: '<h1>Test</h1>',
  isOfficial: false,
  isCliDependency: false,
  isHidden: false,
  hasInvalidGithubRepo: false,
  isNewAddon: false,
  score: 2,
  openIssues: 0,
  forks: 0,
  contributors: [
    { name: 'kategengler', avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=3' } // eslint-disable-line camelcase
  ],
  firstCommitDate: '2014-12-21T21:37:23.000Z',
  latestCommitDate: '2014-12-21T23:12:54.000Z',
  lastMonthDownloads: 1,
  stars: 1,
  isWip: false,
  isTopDownloaded: false,
  committedToRecently: true,
  isTopStarred: false,
  demoUrl: null,
  isFullyLoaded: true
});
