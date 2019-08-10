import Mirage from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  succeeded: true,
  errorMessage: '',
  testsRunAt: () => moment.utc(),
  output: () => "[]"
});
