import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

@classic
export default class AddonRoute extends Route {
  model(params) {
    let name = params.name.replace(/%2F/i, '/');
    let list = this.modelFor('admin.review');

    let addon = this.store.query('addon', { filter: { name, hidden: [true, false] }, include: 'latest-addon-version,versions,maintainers,keywords,latest-review,latest-review.version,categories', page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });

    let data = {
      addon,
      list,
      categories: this.store.findAll('category', { include: 'subcategories,parent' })
    };

    return hash(data);
  }

  titleToken(model) {
    return model.addon.get('name');
  }
}
