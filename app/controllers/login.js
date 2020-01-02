import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class LoginController extends Controller {
  @service
  router;

  @action
  login(email, password) {
    this.session.open(email, password).then(() => {
      this.router.transitionTo('admin.index');
    });
  }
}
