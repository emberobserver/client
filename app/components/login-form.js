import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class LoginForm extends Component {
  @tracked email;

  @tracked password;

  @action
  login() {
    this.args.loginAction(this.email, this.password);
  }
}
