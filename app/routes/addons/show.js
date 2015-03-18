import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params){
    return this.store.all('addon').findBy('name', params.name);
  },

  titleToken: function(model){
    return model.get('name');
  },

  afterModel: function(model){
    this.store.findQuery('keyword', {addon_id: model.get('id')});
    this.store.findQuery('version', {addon_id: model.get('id')});
    this.store.findQuery('readme', {addon_id: model.get('id')});
  },

  actions: {
    error: function() {
      this.replaceWith('/not-found');
    }
  }
});
