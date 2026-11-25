import Route from '@ember/routing/route';
import moment from 'moment';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  queryParams = {
    date: { refreshModel: true },
  };

  model(params) {
    params = params || {};
    if (!params.date) {
      params.date = moment().format('YYYY-MM-DD');
    }
    return this.store.query('test-result', {
      fields: {
        'test-results':
          'succeeded,status-message,created-at,semver-string,canary,version',
      },
      filter: {
        date: params.date,
      },
      include: 'version,version.addon',
    });
  }
}
