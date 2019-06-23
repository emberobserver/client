import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { readOnly, oneWay } from '@ember/object/computed';
import Controller from '@ember/controller';
import { lists } from 'ember-observer/services/admin-lists';

const possibleLists = Object.keys(lists).map((key) => {
  return { title: lists[key].title, key }
});

@classic
export default class ReviewController extends Controller {
  queryParams = ['list'];
  list = null;

  @inject
  @inject
  adminLists;

  @inject
  @inject
  router;

  @readOnly('adminLists.find.lastSuccessful.value.addons')
  addons;

  possibleLists = possibleLists;

  @oneWay('model.key')
  selectedListKey;

  @computed('selectedListKey')
  get selectedList() {
    return possibleLists.find(l => l.key === this.get('selectedListKey'));
  }

  selectList(list) {
    this.set('selectedListKey', list.key);
    this.get('router').transitionTo('admin.review', { queryParams: { list: list.key } });
  }
}
