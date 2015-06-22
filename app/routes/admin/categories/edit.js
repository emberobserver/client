import Ember from 'ember';
import scrollFix from '../../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
	model: function(params) {
		return Ember.RSVP.hash({
			categories: this.store.all('category'),
			category: this.store.all('category').findBy('slug', params.slug)
		});
	}
});
