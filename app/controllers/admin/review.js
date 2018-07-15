import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { oneWay, readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';
import { lists } from 'ember-observer/services/admin-lists';

const possibleLists = Object.keys(lists).map((key) => {
  return { title: lists[key].title, key }
});

export default Controller.extend({
  queryParams: ['list'],
  list: null,
  adminLists: inject(),
  router: inject(),
  addons: readOnly('adminLists.find.lastSuccessful.value.addons'),
  possibleLists,
  selectedListKey: oneWay('model.key'),
  selectedList: computed('selectedListKey', function() {
    return possibleLists.find(l => l.key === this.get('selectedListKey'));
  }),
  selectList(list) {
    this.set('selectedListKey', list.key);
    this.get('router').transitionTo('admin.review', { queryParams: { list: list.key } });
  }
});
