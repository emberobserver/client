import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    codeQuery: {
      replace: true
    },
    regex: {
      replace: true
    }
  }
});
