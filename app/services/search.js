import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Service.extend({
  api: service(),
  _autocompleteData: null,
  _latestSearchResults: null,
  _fetchAutocompleteData: task(function* () {
    if (!this.get('_autocompleteData')) {
      let data = yield this.get('api').request('/autocomplete_data');
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
    let results = yield this.get('api').request('/search', {
      params: {
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
    let addonResultsMatchingOnName = findAddonNameMatches(trimmed, data.addons);
    return addonResultsMatchingOnName.mapBy('name');
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

function findAddonNameMatches(searchTerm, addons) {
  let query = escapeForRegex(stripEmberPrefixes(searchTerm));
  let matcher = new RegExp(query, 'i');

  let matches = addons.map(function(item) {
    let trimmedName = stripEmberPrefixes(item.name);
    let match = matcher.exec(trimmedName);
    if (match) {
      return { item, match };
    }
    return null;
  }).compact();

  let sortByMatchIndexThenScoreThenAddonName = function(a, b) {
    if (a.match.index < b.match.index) {
      return -1;
    }
    if (a.match.index > b.match.index) {
      return 1;
    }

    if (a.item.score > b.item.score) {
      return -1;
    }
    if (a.item.score < b.item.score) {
      return 1;
    }

    // match indexes are equal, scores are equal, so sort by addon name
    if (a.item.name < b.item.name) {
      return -1;
    }
    if (a.item.name > b.item.name) {
      return 1;
    }
    return 0;
  };

  return matches.sort(sortByMatchIndexThenScoreThenAddonName).mapBy('item');
}

function stripEmberPrefixes(str) {
  return str.replace('ember-cli-', '').replace('ember-', '');
}
function escapeForRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
