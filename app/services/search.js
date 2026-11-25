import { get } from '@ember/object';
import { compare } from '@ember/utils';
import asArray from 'ember-observer/utils/as-array';
import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class SearchService extends Service {
  @service
  api;

  _autocompleteData = null;
  _latestSearchResults = null;

  _fetchAutocompleteData = task(async () => {
    if (!this._autocompleteData) {
      let data = await this.api.request('/autocomplete_data');
      this.set('_autocompleteData', {
        addons: asArray(data.addons).slice().sort((a, b) => compare(get(a, 'score'), get(b, 'score'))).reverse(),
        categories: data.categories,
        maintainers: data.maintainers,
      });
    }
    return this._autocompleteData;
  });

  _searchAddons(query, possibleAddons) {
    let addonResultsMatchingOnName = findMatches(query, 'name', possibleAddons);
    let addonResultsMatchingOnDescription = findMatches(
      query,
      'description',
      possibleAddons
    );
    let addonIds = Array.from(new Set(asArray([]
      .concat(addonResultsMatchingOnName, addonResultsMatchingOnDescription)))).map((item) => get(item, 'id'));
    return {
      matchIds: addonIds,
      matchCount: addonIds.length,
    };
  }

  _searchCategories(query, possibleCategories) {
    let categoryIds = asArray(findMatches(query, 'name', possibleCategories)).map((item) => get(item, 'id'));
    return {
      matchIds: categoryIds,
      matchCount: categoryIds.length,
    };
  }

  _searchMaintainers(query, possibleMaintainers) {
    let maintainerIds = asArray(findMatches(query, 'name', possibleMaintainers)).map((item) => get(item, 'id'));
    return {
      matchIds: maintainerIds,
      matchCount: maintainerIds.length,
    };
  }

  _searchReadmes = task(async (query) => {
    let results = await this.api.request('/search', {
      params: {
        query,
      },
    });

    let addonMatchMap = {};
    results.search.forEach((result) => {
      addonMatchMap[result.addon_id] = result.matches;
    });

    return {
      matchIds: Object.keys(addonMatchMap),
      matchMap: addonMatchMap,
      matchCount: results.search.length,
    };
  });

  searchAddonNames = task(async (query) => {
    let data = await this._fetchAutocompleteData.perform();
    let trimmed = query.trim();
    let addonResultsMatchingOnName = findAddonNameMatches(trimmed, data.addons);
    return asArray(addonResultsMatchingOnName).map((item) => get(item, 'name'));
  });

  search = task(async (query, options) => {
    let data = await this._fetchAutocompleteData.perform();
    let addonResults = this._searchAddons(query, data.addons);
    let categoryResults = this._searchCategories(query, data.categories);
    let maintainerResults = this._searchMaintainers(query, data.maintainers);
    let readmeResults = { matchIds: [], matchMap: {}, matchCount: 0 };
    if (options.includeReadmes) {
      readmeResults = await this._searchReadmes.perform(query);
    }
    let results = {
      query,
      addonResults,
      maintainerResults,
      categoryResults,
      readmeResults,
      length:
        addonResults.matchCount +
        maintainerResults.matchCount +
        categoryResults.matchCount +
        readmeResults.matchCount,
    };
    this.set('_latestSearchResults', results);
    return results;
  });
}

function findMatches(query, prop, items) {
  query = escapeForRegex(query);
  let matcher = new RegExp(query, 'i');
  let results = items.filter(function (item) {
    return matcher.test(item[prop]);
  });
  return results;
}

function findAddonNameMatches(searchTerm, addons) {
  let query = escapeForRegex(stripEmberPrefixes(searchTerm));
  let matcher = new RegExp(query, 'i');

  let matches = asArray(addons
    .map(function (item) {
      let trimmedName = stripEmberPrefixes(item.name);
      let match = matcher.exec(trimmedName);
      if (match) {
        return { item, match };
      }
      return null;
    })).filter((item) => item != null);

  let sortByMatchIndexThenScoreThenAddonName = function (a, b) {
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

  return asArray(matches.sort(sortByMatchIndexThenScoreThenAddonName)).map((element) => get(element, 'item'));
}

function stripEmberPrefixes(str) {
  return str.replace('ember-cli-', '').replace('ember-', '');
}
function escapeForRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
