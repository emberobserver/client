import Mirage from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  succeeded: true,
  status_message: '',
  tests_run_at: () => moment.utc(),
  stdout: '',
  stderr: '',

  version_id: null,
  ember_version_compatibility_ids: [ ]
});
