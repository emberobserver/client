import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  actions: {
    login(email, password) {
      this.session.open(email, password).then(() => {
        this.router.transitionTo('admin.index');
      });
    }
  }
});
