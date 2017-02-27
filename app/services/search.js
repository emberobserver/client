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
  _searchReadmes: task(function* (query) {
    let results = yield this.get('ajax').request('/api/v2/search', {
      data: {
        query
      }
    });

    let addonMatchMap = {};
    results.search.forEach((result) => {
      addonMatchMap[result.addon_id] = result.matches;
    });

    return {
      matchIds: Object.keys(addonMatchMap),
      matchMap: addonMatchMap,
      matchCount: results.search.length
    };
  }),
  searchAddonNames: task(function* (query) {
    let data = yield this.get('_fetchAutocompleteData').perform();
    let trimmed = query.trim();
    let addonResultsMatchingOnName = findMatches(trimmed, 'name', data.addons);
    let exactMatch = addonResultsMatchingOnName.findBy('name', trimmed);
    let results = [];
    if (exactMatch) {
      results.push(exactMatch.name);
      addonResultsMatchingOnName.removeObject(exactMatch);
    }
    results.pushObjects(addonResultsMatchingOnName.mapBy('name'));
    return results;
  }),
  search: task(function* (query, options) {
    let data = yield this.get('_fetchAutocompleteData').perform();
    let addonResults = this._searchAddons(query, data.addons);
    let categoryResults = this._searchCategories(query, data.categories);
    let maintainerResults = this._searchMaintainers(query, data.maintainers);
    let readmeResults = { matchIds: [], matchMap: {}, matchCount: 0 };
    if (options.includeReadmes) {
      readmeResults = yield this.get('_searchReadmes').perform(query);
    }
    let results = {
      query,
      addonResults,
      maintainerResults,
      categoryResults,
      readmeResults,
      length: (addonResults.matchCount + maintainerResults.matchCount + categoryResults.matchCount + readmeResults.matchCount)
    };
    this.set('_latestSearchResults', results);
    return results;
  })
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
