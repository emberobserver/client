import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['codeQuery', 'sort', 'sortAscending', 'regex', 'fileFilter'],
  preserveScrollPosition: true,
  codeQuery: '',
  sort: 'name',
  sortAscending: true,
  regex: false,
  fileFilter: null
});
