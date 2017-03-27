import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').query('addon', { filter: { name: params.name }, page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });
  }
});
