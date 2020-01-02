import Component from '@ember/component';

export default Component.extend({
  actions: {
    login() {
      this.loginAction(this.email, this.password);
    }
  }
});
