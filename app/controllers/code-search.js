import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['codeQuery', 'sort', 'regex', 'fileFilter'],
  codeQuery: '',
  sort: 'name',
  regex: false,
  fileFilter: null
});
