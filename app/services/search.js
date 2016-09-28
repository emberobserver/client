import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  addonData: Ember.computed(function() {
    return this.get('store').peekAll('addon').sortBy('score').reverse().map(function(addon) {
      return {
        name: addon.get('name'),
        description: addon.get('description'),
        id: addon.get('id')
      };
    });
  }),
  categoryData: Ember.computed(function() {
    return this.get('store').peekAll('category').map(function(category) {
      return {
        name: category.get('name'),
        id: category.get('id')
      };
    });
  }),
  maintainerData: Ember.computed(function() {
    return this.get('store').peekAll('maintainer').map(function(maintainer) {
      return {
        name: maintainer.get('name'),
        id: maintainer.get('id')
      };
    });
  }),
  search(query) {
    return new Ember.RSVP.Promise((resolve) => {
      let addonResultsMatchingOnName = findMatches(query, 'name', this.get('addonData'));
      let addonResultsMatchingOnDescription = findMatches(query, 'description', this.get('addonData'));
      let addons = [].concat(addonResultsMatchingOnName, addonResultsMatchingOnDescription).uniq().map((result) => {
        return this.get('store').peekRecord('addon', result.id);
      });
      let categories = findMatches(query, 'name', this.get('categoryData')).map((result) => {
        return this.get('store').peekRecord('category', result.id);
      });
      let maintainers = findMatches(query, 'name', this.get('maintainerData')).map((result) => {
        return this.get('store').peekRecord('maintainer', result.id);
      });
      resolve({
        addons,
        categories,
        maintainers,
        length: (addons.get('length') + maintainers.get('length') + categories.get('length'))
      });
    });
  }
});

function findMatches(query, prop, items) {
  query = escapeForRegex(query);
  let matcher = new RegExp(query, 'i');
  let results = items.filter(function(item) {
    return matcher.test(item[prop]);
  });
  return results;
}

function escapeForRegex(str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}
