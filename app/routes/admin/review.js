import asArray from 'ember-observer/utils/as-array';
import { service as inject } from '@ember/service';
import Route from '@ember/routing/route';

export default class ReviewRoute extends Route {
  @inject router;

  queryParams = {
    list: {
      refreshModel: true,
    },
  };

  @inject()
  adminLists;

  model({ list }) {
    if (list) {
      return this.get('adminLists.find').perform(list);
    }
  }

  redirect(model, transition) {
    if (transition.targetName === 'admin.review.index') {
      if (model && asArray(model.addons).length) {
        return this.router.replaceWith(
          'admin.review.addon',
          asArray(model.addons)[0]?.name
        );
      }

      if (!transition.to.queryParams.list) {
        return this.router.replaceWith('admin.review.index', {
          queryParams: { list: 'needing-review' },
        });
      }
    }
  }
}
