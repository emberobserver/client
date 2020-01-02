import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('addon', { filter: { hidden: true }, sort: '-latestVersionDate' });
  }
});
