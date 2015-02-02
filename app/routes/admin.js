import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    loginToAdmin: function(username, password){
      //var route = this;
      //this.get('session').open('custom', {
      //  username: username,
      //  password: password
      //}).then(function(authorization){
      //  console.log('yay');
      //  console.log(authorization);
      //  route.transitionTo('admin.index');
      //}).catch(function(){
      //  console.log('nope');
      //});
    }
  }
});
