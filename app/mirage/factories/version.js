import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  version: (i) => `1.0.${i}`,
  released: () => new Date(),
  ember_cli_version: '1.13.1',
  addon_id: null,
  review_id: null,
  ember_version_compatibility_ids: [ ]
});
