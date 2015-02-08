import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.find('addon', params.id);
  },
  afterModel: function(model){
    this.store.findQuery('keyword', {addon_id: model.get('id')});
    this.store.findQuery('version', {addon_id: model.get('id')});
  }
});
