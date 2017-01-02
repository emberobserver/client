import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    return this.get('store').peekAll('category').findBy('slug', params.slug);
  },

  titleToken(model) {
    return model.get('name');
  },

  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});
