import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@classic
export default class LoginFormComponent extends Component {
  @action
  login() {
    this.loginAction(this.get('email'), this.get('password'));
  }
}
