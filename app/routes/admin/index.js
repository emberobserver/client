import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
      packages: this.store.find('package'),
      categories: this.store.find('category')
    });
  }
});
