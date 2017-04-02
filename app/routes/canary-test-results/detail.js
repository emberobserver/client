import Ember from 'ember';

export default Ember.Route.extend({
  model({ id }) {
    return this.store.findRecord('test-result', id, {
      include: [
        'ember-version-compatibilities',
        'version',
        'version.addon'
      ].join(',')
    });
  }
});
