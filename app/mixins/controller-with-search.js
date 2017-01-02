import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['query', 'searchReadmes'],
  query: '',
  searchReadmes: false
});
