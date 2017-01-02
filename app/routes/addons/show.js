import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    return this.get('store').queryRecord('addon', { name: params.name }, { reload: true });
  },

  titleToken(model) {
    return model.get('name');
  },

  afterModel(model) {
    this.get('store').query('keyword', { addon_id: model.get('id') }); // eslint-disable-line camelcase
    this.get('store').query('version', { addon_id: model.get('id') }); // eslint-disable-line camelcase
    this.get('emberVersions').fetch();
  },
  emberVersions: Ember.inject.service(),
  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});
