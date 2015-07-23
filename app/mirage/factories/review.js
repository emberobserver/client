import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  review: 'A review',
  created_at: () => new Date(),
  has_tests: 1,
  has_readme: 1,
  is_more_than_empty_addon: 1,
  is_open_source: 1,
  has_build: 1,
  version_id: null,
  addon_id: null
});
