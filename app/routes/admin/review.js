import classic from 'ember-classic-decorator';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class ReviewRoute extends Route {
  queryParams = {
    list: {
      refreshModel: true
    }
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
      if (model && model.addons.get('length')) {
        return this.replaceWith('admin.review.addon', model.addons.get('firstObject.name'));
      }

      if (!transition.to.queryParams.list) {
        transition.abort();
        return this.replaceWith('admin.review.index', { queryParams: { list: 'needing-review' } });
      }
    }
  }

  titleToken() {
    return 'Review';
  }
}
