import { action } from '@ember/object';
import Component from '@ember/component';

export default class LoginForm extends Component {
  @action
  login() {
    this.loginAction(this.email, this.password);
  }
}
