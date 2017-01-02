import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    return this.get('store').peekAll('addon').findBy('name', params.name);
  }
});
