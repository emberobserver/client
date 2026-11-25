import { get } from '@ember/object';
import asArray from 'ember-observer/utils/as-array';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

import measure from '../../utils/measure';
import { service } from '@ember/service';

export default class ShowRoute extends Route {
  @service store;

  model(params) {
    return this.modelFor('application').categories.then(() => {
      let category = asArray(this.store.peekAll('category')).find((item) => get(item, 'slug') === params.slug);
      if (!category) {
        throw new Error(`no such category ${params.slug}`);
      }
      let addons = this.store.query('addon', {
        filter: { inCategory: category.get('id') },
        include: 'categories',
      });
      return hash({
        category,
        addons,
      });
    });
  }

  afterModel = measure;
}
