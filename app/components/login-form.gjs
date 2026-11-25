import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import preventDefault from "../helpers/prevent-default.js";
import { Input } from "@ember/component";

export default class LoginForm extends Component {<template><div ...attributes>
<form {{on "submit" (preventDefault this.login)}}>
  <label for="email">Email</label>
  <Input @value={{this.email}} name="email" class="test-email" />
  <label for="password">Password</label>
  <Input @type="password" @value={{this.password}} name="password" class="test-password" />
  <Input @type="submit" @value="Log in" class="button test-log-in" />
</form>
</div>
</template>
  @tracked email;

  @tracked password;

  @action
  login() {
    this.args.loginAction(this.email, this.password);
  }
}
