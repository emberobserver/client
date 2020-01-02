import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class TopRoute extends Route {
  beforeModel() {
    this.transitionTo('lists.top-addons');
  }
}
