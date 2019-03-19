import Route from '@ember/routing/route';

export default Route.extend({
  model({ id }) {
    return this.store.findRecord('test-result', id, {
      include: [
        'ember-version-compatibilities',
        'version',
        'version.addon'
      ].join(','),
      reload: true
    });
  }
});
