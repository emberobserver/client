import classic from 'ember-classic-decorator';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

@classic
export default class SearchService extends Service {
  @service
  @service
  ajax;

  _autocompleteData = null;
  _latestSearchResults = null;

  @task
  _fetchAutocompleteData;

  _searchAddons(query, possibleAddons) {
    let addonResultsMatchingOnName = findMatches(query, 'name', possibleAddons);
    let addonResultsMatchingOnDescription = findMatches(query, 'description', possibleAddons);
    let addonIds = [].concat(addonResultsMatchingOnName, addonResultsMatchingOnDescription).uniq().mapBy('id');
    return {
      matchIds: addonIds,
      matchCount: addonIds.length
    };
  }

  _searchCategories(query, possibleCategories) {
    let categoryIds = findMatches(query, 'name', possibleCategories).mapBy('id');
    return {
      matchIds: categoryIds,
      matchCount: categoryIds.length
    };
  }

  _searchMaintainers(query, possibleMaintainers) {
    let maintainerIds = findMatches(query, 'name', possibleMaintainers).mapBy('id');
    return {
      matchIds: maintainerIds,
      matchCount: maintainerIds.length
    };
  }

  @task
  _searchReadmes;

  @task
  searchAddonNames;

  @task
  search;
}

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
