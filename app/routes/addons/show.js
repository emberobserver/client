import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params) {
    return this.get('store').queryRecord('addon', { name: params.name }, { reload: true });
  },

  titleToken: function(model) {
    return model.get('name');
  },

  afterModel: function(model) {
    this.get('store').query('keyword', { addon_id: model.get('id') });
    this.get('store').query('version', { addon_id: model.get('id') });
    this.get('emberVersions').fetch();
  },
  emberVersions: Ember.inject.service(),
  actions: {
    error: function() {
      this.replaceWith('model-not-found');
    }
  }
});
