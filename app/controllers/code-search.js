import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['codeQuery', 'sort', 'regex'],
  codeQuery: '',
  sort: 'name',
  regex: false
});
