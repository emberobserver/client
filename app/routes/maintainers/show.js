import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.all('maintainer').findBy('name', params.name);
  },

  titleToken: function(model){
    return model.get('name');
  }
});
