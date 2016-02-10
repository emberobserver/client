import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').peekAll('addon').findBy('name', params.name);
  }
});
