import Mirage from 'miragejs';
import moment from 'moment';

export default Mirage.Factory.extend({
  succeeded: true,
  errorMessage: '',
  createdAt: () => moment.utc(),
  output: () => '[]',
});
