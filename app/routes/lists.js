import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';
import RouteWithSearch from '../mixins/route-with-search';

export default Ember.Route.extend(scrollFix, RouteWithSearch, {
});
