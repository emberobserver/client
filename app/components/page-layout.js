import Ember from 'ember';

const { isBlank } = Ember;

export default Ember.Component.extend({
  showHeaderSearch: true,
  searchTerm: null,
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  routing: Ember.inject.service(),
  metrics: Ember.inject.service(),
  categories: Ember.computed(function() {
    return this.get('store').peekAll('category');
  }),
  goSearch() {
    if (!isBlank(this.get('searchTerm'))) {
      this.get('metrics').trackEvent({ category: 'Header search', action: `Search on ${document.location.pathname}`, label: this.get('searchTerm') });
      this.get('routing').transitionTo('index', { queryParams: { query: this.get('searchTerm') } });
    }
  },
  logoutUser() {
    this.get('session').close().finally(() => {
      this.get('routing').transitionTo('index');
    });
  }
});
