import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model(params) {
    let addon = this.get('store').query('addon', { filter: { name: params.name }, include: 'versions,maintainers,keywords,reviews,reviews.version,categories', page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });

    let latestTestResult = this.get('store').query('test-result', { filter: { canary: false, addonName: params.name }, sort: '-createdAt', page: { limit: 1 }, include: 'ember-version-compatibilities' }).then((results) => {
      return results.get('firstObject');
    });

    let data = {
      addon,
      latestTestResult
    };

    if (this.get('session.isAuthenticated')) {
      data.categories = this.get('store').findAll('category', { include: 'subcategories' });
    }

    return Ember.RSVP.hash(data);
  },

  titleToken(model) {
    return model.addon.get('name');
  },

  afterModel() {
    this.get('emberVersions').fetch();
  },
  emberVersions: Ember.inject.service(),
  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});
