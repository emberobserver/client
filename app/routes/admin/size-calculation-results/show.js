import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('size-calculation-result', params.id, {
      include: 'version,version.addon',
      reload: true
    });
  }
});
