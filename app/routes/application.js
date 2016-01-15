import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    this.get('session').fetch();
  },
  actions: {
    login(email, password) {
      var route = this;
      this.get('session').open(email, password).then(function() {
        route.transitionTo('admin.index');
      });
    },
    logout() {
      var route = this;
      this.get('session').close().finally(function() {
        route.transitionTo('index');
      });
    },

    showAddon(pkg) {
      this.transitionTo('addons.show', pkg.get('name'));
    },

    showCategory(category) {
      this.transitionTo('categories.show', category);
    },

    showMaintainer(maintainer) {
      this.transitionTo('maintainers.show', maintainer);
    }
  },

  model() {
    return Ember.RSVP.hash({
      addons: this.store.findAll('addon'),
      categories: this.store.findAll('category'),
      maintainers: this.store.findAll('maintainer')
    });
  },

  title(tokens) {
    var tokenStr = tokens.join('');
    if (tokenStr) {
      return tokenStr + ' - Ember Observer';
    } else {
      return 'Ember Observer';
    }
  }
});
