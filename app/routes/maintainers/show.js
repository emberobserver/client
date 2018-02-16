import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').query('maintainer', { filter: { name: params.name } }).then((maintainers) => {
      return maintainers.get('firstObject');
    });
  },

  titleToken(model) {
    return model.get('name');
  },

  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});
