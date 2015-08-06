import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.store;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var maintainer = store.peekAll('maintainer').findBy('name', params.name);
      if (maintainer) {
        resolve(maintainer);
      } else {
        reject('not found');
      }
    });
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
