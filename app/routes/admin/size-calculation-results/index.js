import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import moment from 'moment';
import { service } from '@ember/service';

@classic
export default class SizeCalculationResultsIndexRoute extends Route {
  @service store;

  queryParams = {
    date: { refreshModel: true },
  };

  model(params) {
    params = params || {};
    if (!params.date) {
      params.date = moment().format('YYYY-MM-DD');
    }
    return this.store.query('size-calculation-result', {
      fields: {
        'size-calculation-results':
          'succeeded,error-message,created-at,version',
      },
      filter: {
        date: params.date,
      },
      include: 'version,version.addon',
    });
  }
}
