import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').query('addon', { filter: { name: params.name }, page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });
  }
});
