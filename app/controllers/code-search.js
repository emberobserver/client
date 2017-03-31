import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['codeQuery', 'sort', 'regex', 'fileFilter'],
  codeQuery: '',
  sort: 'name',
  regex: false,
  fileFilter: null
});
