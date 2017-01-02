import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let store = this.get('store');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let maintainer = store.peekAll('maintainer').findBy('name', params.name);
      if (maintainer) {
        resolve(maintainer);
      } else {
        reject('not found');
      }
    });
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
