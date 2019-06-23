import classic from 'ember-classic-decorator';
import { getOwner } from '@ember/application';
import Service from '@ember/service';

@classic
export default class RoutingService extends Service {
  transitionTo() {
    return getOwner(this).lookup('router:main').transitionTo(...arguments);
  }
}
