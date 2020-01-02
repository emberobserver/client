import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@classic
export default class LoginForm extends Component {
  @action
  login() {
    this.loginAction(this.email, this.password);
  }
}
