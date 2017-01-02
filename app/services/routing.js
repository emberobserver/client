import Ember from 'ember';

const { getOwner, Service } = Ember;

export default Service.extend({
  transitionTo() {
    return getOwner(this).lookup('router:main').transitionTo(...arguments);
  }
});
