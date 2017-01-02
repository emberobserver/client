import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    login() {
      this.sendAction('loginAction', this.get('email'), this.get('password'));
    }
  }
});
