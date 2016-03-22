import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  queryParams: {
    query: {
      replace: true
    }
  }
});
