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
    }
  },

  model: function() {
    return Ember.RSVP.hash({
      addons: this.get('store').findAll('addon'),
      categories: this.get('store').findAll('category'),
      maintainers: this.get('store').findAll('maintainer')
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
