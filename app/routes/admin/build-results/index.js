import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import moment from 'moment';

@classic
export default class IndexRoute extends Route {
  queryParams = {
    date: { refreshModel: true }
  };

  model(params) {
    params = params || { };
    if (!params.date) {
      params.date = moment().format('YYYY-MM-DD');
    }
    return this.store.query('test-result', {
      fields: {
        'test-results': 'succeeded,status-message,created-at,semver-string,canary,version'
      },
      filter: {
        date: params.date
      },
      include: 'version,version.addon'
    });
  }
}
