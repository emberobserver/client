import { getOwner } from '@ember/application';
import Service from '@ember/service';

export default Service.extend({
  transitionTo() {
    return getOwner(this).lookup('router:main').transitionTo(...arguments);
  }
});
