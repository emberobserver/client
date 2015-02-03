import Ember from 'ember';

export default Ember.Route.extend({
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
    }
  }
});
