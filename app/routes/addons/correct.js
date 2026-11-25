import asArray from 'ember-observer/utils/as-array';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CorrectRoute extends Route {
  @service store;

  model(params) {
    let name = params.name.replace(/%2F/i, '/');
    return this.store
      .query(
        'addon',
        { filter: { name }, page: { limit: 1 } },
        { reload: true }
      )
      .then((addons) => {
        return asArray(addons)[0];
      });
  }
}
