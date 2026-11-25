import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TopRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('lists.top-addons');
  }
}
