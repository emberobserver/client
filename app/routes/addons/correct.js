import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.peekAll('addon').findBy('name', params.name);
  }
});
