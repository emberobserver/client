import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['codeQuery', 'sort', 'sortAscending', 'regex', 'fileFilter'],
  codeQuery: '',
  sort: 'name',
  sortAscending: true,
  regex: false,
  fileFilter: null
});
