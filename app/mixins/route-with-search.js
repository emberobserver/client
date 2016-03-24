import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    query: {
      replace: true
    }
  }
});
