import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['query', 'searchReadmes'],
  query: '',
  searchReadmes: false
});
