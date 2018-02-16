import Component from '@ember/component';

export default Component.extend({
  actions: {
    login() {
      this.sendAction('loginAction', this.get('email'), this.get('password'));
    }
  }
});
