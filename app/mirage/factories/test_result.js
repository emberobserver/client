import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  succeeded: true,
  status_message: '',

  version_id: null,
  ember_version_compatibility_ids: [ ]
});
