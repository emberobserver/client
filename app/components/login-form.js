import Component from '@ember/component';

export default Component.extend({
  actions: {
    login() {
      this.loginAction(this.get('email'), this.get('password'));
    }
  }
});
