import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.get('store').query('addon', { filter: { isWip: false, notCategorized: true }, sort: '-latestVersionDate' });
  }
});
