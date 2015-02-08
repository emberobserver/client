import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
      addons: this.store.find('addon'),
      categories: this.store.find('category')
    });
  }
});
