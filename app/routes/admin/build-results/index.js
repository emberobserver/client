import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({
  queryParams: {
    date: { refreshModel: true }
  },
  model(params) {
    params = params || { };
    if (!params.date) {
      params.date = moment().format('YYYY-MM-DD');
    }
    return this.store.query('test-result', {
      filter: {
        date: params.date
      },
      include: 'version,version.addon'
    });
  }
});
