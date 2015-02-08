import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(){
    this.get('session').fetch();
  },
  actions: {
    login: function(email, password){
      var route = this;
      this.get('session').open(email, password).then(function(){
        route.transitionTo('admin.index');
      });
    },
    logout: function(){
      var route = this;
      this.get('session').close().finally(function(){
        route.transitionTo('index');
      });
    },

    showAddon: function(pkg) {
      this.transitionTo('addons.show', pkg);
    }
  },

  model: function(){
    return Ember.RSVP.hash({
      addons: this.store.find('addon'),
      categories: this.store.find('category')
    });
  },
  afterModel: function(){
    this.store.find('keyword');
  }


});
