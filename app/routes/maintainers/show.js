import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class ShowRoute extends Route {
  model(params) {
    return this.store.query('maintainer', { filter: { name: params.name } }).then((maintainers) => {
      return maintainers.get('firstObject');
    });
  }

  titleToken(model) {
    return model.get('name');
  }
}
