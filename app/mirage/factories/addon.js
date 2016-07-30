import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: (i) => `ember-${i}`,
  description: (i) => `An addon that provides stuff ${i}`,
  repository_url: 'https://github.com/kategengler/ember-feature-flags',
  latest_version_date: '2014-12-21T23:17:50.212Z',
  latest_reviewed_version_date: null,
  license: 'MIT',
  is_deprecated: false,
  note: '#Test',
  rendered_note: '<h1>Test</h1>',
  is_official: false,
  is_cli_dependency: false,
  is_hidden: false,
  has_invalid_github_repo: false,
  is_new_addon: false,
  score: 2,
  open_issues: 0,
  forks: 0,
  contributors: [
    { name: 'kategengler', avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=3' }
  ],
  first_commit_date: '2014-12-21T21:37:23.000Z',
  latest_commit_date: '2014-12-21T23:12:54.000Z',
  last_month_downloads: 1,
  stars: 1,
  is_wip: false,
  is_top_downloaded: false,
  committed_to_recently: true,
  is_top_starred: false,
  demoUrl: null,
  is_fully_loaded: true,
  readme_id: null
});
