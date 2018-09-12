import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    this.get('session').fetch();
  },
  actions: {
    login(email, password) {
      let route = this;
      this.get('session').open(email, password).then(function() {
        route.transitionTo('admin.index');
      });
    }
  },

  model() {
    return {
      categories: this.get('store').findAll('category', { include: 'subcategories,parent' })
    };
  },

  title(tokens) {
    let tokenStr = tokens.join(' | ');
    if (tokenStr) {
      return `${tokenStr} - Ember Observer`;
    } else {
      return 'Ember Observer';
    }
  }
});
