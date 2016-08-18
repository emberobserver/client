import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['query', { searchReadmes: 'readmes' }],
  query: '',
  searchReadmes: false
});
