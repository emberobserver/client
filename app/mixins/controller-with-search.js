import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['query', 'searchReadmes'],
  query: '',
  searchReadmes: false
});
