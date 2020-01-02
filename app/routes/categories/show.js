import classic from 'ember-classic-decorator';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

import measure from '../../utils/measure';

@classic
export default class ShowRoute extends Route {
  model(params) {
    return this.modelFor('application').categories.then(() => {
      let category = this.store.peekAll('category').findBy('slug', params.slug);
      if (!category) {
        throw new Error(`no such category ${params.slug}`);
      }
      let addons = this.store.query('addon', { filter: { inCategory: category.get('id') }, include: 'categories' });
      return hash({
        category,
        addons
      });
    });
  }

  afterModel = measure;

  titleToken(model) {
    return model.category.get('name');
  }
}
