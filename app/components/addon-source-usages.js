import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  showUsages: false,

  usages: null,

  codeSearch: Ember.inject.service(),

  toggleUsages: task(function * () {
    if (this.get('usages') === null) {
      let usages = yield this.get('codeSearch').usages(this.get('addon.name'), this.get('query'));
      this.set('usages', usages);
    }
    this.toggleProperty('showUsages');
  }).restartable()
});
