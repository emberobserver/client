import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    login: function(){
      this.sendAction('loginAction', this.get('email'), this.get('password'));
    }
  }
});
