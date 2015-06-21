import Ember from 'ember';
import scrollFix from '../../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
	model: function(params) {
		return this.store.all('category').findBy('slug', params.slug);
	}
});
