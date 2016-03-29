import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('visitAddon', function(_, addon) {
  visit(`/addons/${addon.name}`);
});
