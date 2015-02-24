import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    return this.store.find('maintainer', params.id);
  },

  titleToken: function(model){
    return model.get('name');
  }
});
