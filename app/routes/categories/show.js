import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params) {
    return this.store.all('category').findBy('slug', params.slug);
  },

  titleToken: function(model) {
    return model.get('name');
  },

  actions: {
    error: function() {
      this.replaceWith('/not-found');
    }
  }
});
