import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class TopRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('lists.top-addons');
  }
}
