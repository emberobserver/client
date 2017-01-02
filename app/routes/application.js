import Ember from 'ember';

export default Ember.Route.extend({
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
    return Ember.RSVP.hash({
      addons: this.get('store').findAll('addon'),
      categories: this.get('store').findAll('category'),
      maintainers: this.get('store').findAll('maintainer')
    });
  },

  title(tokens) {
    let tokenStr = tokens.join('');
    if (tokenStr) {
      return `${tokenStr} - Ember Observer`;
    } else {
      return 'Ember Observer';
    }
  }
});
