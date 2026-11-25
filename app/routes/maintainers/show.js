import asArray from 'ember-observer/utils/as-array';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ShowRoute extends Route {
  @service store;

  model(params) {
    return this.store
      .query('maintainer', { filter: { name: params.name } })
      .then((maintainers) => {
        return asArray(maintainers)[0];
      });
  }
}
