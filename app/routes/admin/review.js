import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  queryParams: {
    list: {
      refreshModel: true
    }
  },
  adminLists: inject(),
  model({ list }) {
    if (list) {
      return this.get('adminLists.find').perform(list);
    }
  },
  afterModel(model, transition) {
    if (transition.targetName === 'admin.review.index' && model.addons.get('length')) {
      return this.transitionTo('admin.review.addon', model.addons.get('firstObject.name'));
    }
  },
  titleToken() {
    return 'Review';
  },
});
