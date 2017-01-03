import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  _autocompleteData: null,
  _latestSearchResults: null,
  _fetchAutocompleteData: task(function* () {
    if (!this.get('_autocompleteData')) {
      let data = yield this.get('ajax').request('/api/v2/autocomplete_data');
      this.set('_autocompleteData', {
        addons: data.addons.sortBy('score').reverse(),
        categories: data.categories,
        maintainers: data.maintainers
      });
    }
    return this.get('_autocompleteData');
  }),
  _searchAddons(query, possibleAddons) {
    let addonResultsMatchingOnName = findMatches(query, 'name', possibleAddons);
    let addonResultsMatchingOnDescription = findMatches(query, 'description', possibleAddons);
    let addonIds = [].concat(addonResultsMatchingOnName, addonResultsMatchingOnDescription).uniq().mapBy('id');
    return {
      matchIds: addonIds,
      matchCount: addonIds.length
    };
  },
  _searchCategories(query, possibleCategories) {
    let categoryIds = findMatches(query, 'name', possibleCategories).mapBy('id');
    return {
      matchIds: categoryIds,
      matchCount: categoryIds.length
    };
  },
  _searchMaintainers(query, possibleMaintainers) {
    let maintainerIds = findMatches(query, 'name', possibleMaintainers).mapBy('id');
    return {
      matchIds: maintainerIds,
      matchCount: maintainerIds.length
    };
  },
  _searchReadmes(query) {
    return this.get('ajax').request('/api/search', {
      data: {
        query
      }
    }).then((results) => {
      return results.search.map((result) => {
        return {
          addon: this.get('store').peekRecord('addon', result.addon_id),
          matches: result.matches
        };
      });
    });
  },
  search(query, options) {
    return this.get('_fetchAutocompleteData').perform().then((data) => {
      let addonResults = this._searchAddons(query, data.addons);
      let categoryResults = this._searchCategories(query, data.categories);
      let maintainerResults = this._searchMaintainers(query, data.maintainers);
      let readmeResults;
      if (options.includeReadmes) {
        readmeResults = this._searchReadmes(query);
      }
      let results = {
        query,
        addonResults,
        maintainerResults,
        categoryResults,
        readmeResults,
        length: (addonResults.matchCount + maintainerResults.matchCount + categoryResults.matchCount)
      };
      this.set('_latestSearchResults', results);
      return Ember.RSVP.resolve(results);
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
