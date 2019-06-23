import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

@classic
export default class ShowRoute extends Route {
  @service
  @service
  session;

  model(params) {
    let name = params.name.replace(/%2F/i, '/');
    let addon = this.get('store').query('addon', { filter: { name }, include: 'versions,maintainers,keywords,latest-review,latest-review.version,latest-addon-version,categories', page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });

    let latestTestResult = this.get('store').query('test-result', { filter: { canary: false, addonName: name }, sort: '-createdAt', page: { limit: 1 }, include: 'ember-version-compatibilities,version' }).then((results) => {
      return results.get('firstObject');
    });

    let data = {
      addon,
      latestTestResult
    };

    if (this.get('session.isAuthenticated')) {
      data.categories = this.get('store').findAll('category', { include: 'subcategories' });
    }

    return hash(data);
  }

  titleToken(model) {
    return model.addon.get('name');
  }

  afterModel() {
    this.emberVersions.fetch();
  }

  @service
  @service
  emberVersions;
}
