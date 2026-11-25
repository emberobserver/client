import { asRecord } from 'ember-observer/utils/as-array';
import asArray from 'ember-observer/utils/as-array';
import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

@classic
export default class ShowRoute extends Route {
  @service store;

  @service
  session;

  model(params) {
    let name = params.name.replace(/%2F/i, '/');
    let addon = this.store
      .query(
        'addon',
        {
          filter: { name },
          include:
            'versions,maintainers,keywords,latest-review,latest-review.version,latest-addon-version,latest-addon-version.addon-size,categories',
          page: { limit: 1 },
        },
        { reload: true }
      )
      .then((addons) => {
        return asArray(addons)[0];
      });

    let latestTestResult = this.store
      .query('test-result', {
        filter: { canary: false, addonName: name },
        sort: '-createdAt',
        page: { limit: 1 },
        include: 'ember-version-compatibilities,version',
      })
      .then((results) => {
        return asArray(results)[0];
      });

    let data = {
      addon,
      latestTestResult,
    };

    if (this.get('session.isAuthenticated')) {
      data.categories = asRecord(this.store.findAll('category', {
        include: 'subcategories',
      }));
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
  emberVersions;
}
