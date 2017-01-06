import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['codeQuery', 'sort'],
  codeQuery: '',
  sort: 'name'
});
