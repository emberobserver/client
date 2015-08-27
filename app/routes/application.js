import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.get('session').fetch();
  },
  actions: {
    login: function(email, password) {
      var route = this;
      this.get('session').open(email, password).then(function() {
        route.transitionTo('admin.index');
      });
    },
    logout: function() {
      var route = this;
      this.get('session').close().finally(function() {
        route.transitionTo('index');
      });
    },

    showAddon: function(pkg) {
      this.transitionTo('addons.show', pkg);
    },

    showCategory: function(category) {
      this.transitionTo('categories.show', category);
    },

    showMaintainer: function(maintainer) {
      this.transitionTo('maintainers.show', maintainer);
    }
  },

  model: function() {
    return Ember.RSVP.hash({
      addons: this.store.findAll('addon'),
      categories: this.store.findAll('category'),
      maintainers: this.store.findAll('maintainer')
    });
  },

  title: function(tokens) {
    var tokenStr = tokens.join('');
    if (tokenStr) {
      return tokenStr + ' - Ember Observer';
    } else {
      return 'Ember Observer';
    }
  }
});
