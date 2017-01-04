import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    return this.get('store').query('addon', { filter: { name: params.name }, page: { limit: 1 } }, { reload: true }).then((addons) => {
      return addons.get('firstObject');
    });
  }
});
