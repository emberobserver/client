import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: function(i) {
    return `ember-${i}`;
  },
  rendered_note: '<h1>Test</h1>',
  repository_url: 'https://github.com/kategengler/ember-feature-flags',
  latest_version_date: '2014-12-21T23:17:50.212Z',
  description: 'An addon that provides stuff',
  license: 'MIT',
  is_deprecated: false,
  note: '#Test',
  is_official: false,
  is_cli_dependency: false,
  is_hidden: false,
  is_new_addon: false,
  has_invalid_github_repo: false,
  open_issues: 0,
  forks: 0,
  contributors: [
    { name: 'kategengler', avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=3' }
  ],
  first_commit_date: '2014-12-21T21:37:23.000Z',
  latest_commit_date: '2014-12-21T23:12:54.000Z',
  last_month_downloads: 1,
  is_top_downloaded: false,
  is_top_starred: false,
  score: 2,
  stars: 1,
  committed_to_recently: true
});
