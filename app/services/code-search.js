import classic from 'ember-classic-decorator';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'ember-observer/config/environment';
const PageSize = config.codeSearchPageSize;

@classic
export default class CodeSearchService extends Service {
  @service
  @service
  apiAjax;

  @service
  @service
  store;

  @task
  addons;

  @task
  usages;
}
