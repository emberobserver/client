import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class ShowRoute extends Route {
  @service store;

  model(params) {
    return this.store
      .query('maintainer', { filter: { name: params.name } })
      .then((maintainers) => {
        return maintainers.get('firstObject');
      });
  }

  titleToken(model) {
    return model.get('name');
  }
}
