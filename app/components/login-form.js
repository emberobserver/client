import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    login: function(){
      this.sendAction('loginAction', this.get('username'), this.get('password'));
    }
  }
});
