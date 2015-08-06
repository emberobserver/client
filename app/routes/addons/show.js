import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params) {
    return this.store.peekAll('addon').findBy('name', params.name);
  },

  titleToken: function(model) {
    return model.get('name');
  },

  afterModel: function(model) {
    this.store.query('keyword', { addon_id: model.get('id') });
    this.store.query('version', { addon_id: model.get('id') });
  },

  actions: {
    error: function() {
      this.replaceWith('/not-found');
    }
  }
});
