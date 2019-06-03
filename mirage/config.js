/* eslint-disable camelcase */

import Mirage from 'ember-cli-mirage';
export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
  this.namespace = '/api/v2';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.post('/authentication/login.json', function() {
    return { token: 'abc123' };
  });

  this.get('/autocomplete_data', function(schema) {
    let addonData = schema.addons.all().models.map((a) => {
      return {
        id: a.id,
        name: a.name,
        description: a.description,
        score: a.score
      };
    });
    let categoryData = schema.categories.all().models.map((c) => {
      return {
        id: c.id,
        name: c.name
      };
    });
    let maintainerData = schema.maintainers.all().models.map((m) => {
      return {
        id: m.id,
        name: m.name
      };
    });
    return {
      addons: addonData,
      categories: categoryData,
      maintainers: maintainerData
    };
  });

  this.get('/categories', function(schema, request) {
    if (request.queryParams['filter[id]']) {
      let categories = schema.categories.find(request.queryParams['filter[id]'].split(','));
      if (!categories.models.length) {
        return new Mirage.Response(404);
      } else {
        return categories;
      }
    }

    return schema.categories.all();
  });
  this.get('/categories/:id');

  this.get('/addons', function(schema, request) {
    if (request.queryParams['filter[name]']) {
      let addonsIds = request.queryParams['filter[name]'].split(',').map((name) => {
        let addon = schema.addons.where({ name });
        if (addon.models.length) {
          return addon.models[0].id;
        }
      });

      let addons = schema.addons.find(addonsIds.compact());

      if (!addons.models.length) {
        return new Mirage.Response(404);
      } else {
        return addons;
      }
    }

    if (request.queryParams['filter[id]']) {
      let addons = schema.addons.find(request.queryParams['filter[id]'].split(','));
      if (!addons.models.length) {
        return new Mirage.Response(404);
      } else {
        return addons;
      }
    }

    if (request.queryParams['filter[inCategory]']) {
      let category = schema.categories.find(request.queryParams['filter[inCategory]']);
      return category.addons;
    }

    if (request.queryParams['filter[needsReReview]']) {
      return schema.addons.where({ latestReview: null });
    }

    if (request.queryParams['filter[hidden]']) {
      return schema.addons.where({ isHidden: true });
    }

    return schema.addons.all();
  });

  this.get('/addons/:id/latest-review', function(schema, request) {
    let addon = schema.addons.find(+request.params.id);
    if (addon.latestReview) {
      return addon.latestReview;
    }
    return { data: null };
  });

  this.get('/addons/:id/github-stats', function(schema, request) {
    let stats = schema.githubStats.where({ addonId: +request.params.id });
    if (stats && stats.models.length) {
      return stats.models[0];
    }
    return { data: null };
  });

  this.get('/addons/:id/github-users', function(schema, request) {
    return schema.addons.find(request.params.id).githubUsers;
  });

  this.get('/maintainers', function(schema, request) {
    if (request.queryParams['filter[name]']) {
      let maintainers = schema.maintainers.where({ name: request.queryParams['filter[name]'] });
      if (!maintainers.models.length) {
        return new Mirage.Response(404);
      } else {
        return maintainers;
      }
    }

    return schema.maintainers.all();
  });

  this.get('/keywords');
  this.get('/versions');
  this.get('/reviews');
  this.get('/reviews/:id');
  this.get('/build-servers');

  let filterByRelatedAddonName = (schema, resourceTableName, request) => {
    if (request.queryParams['filter[addonName]']) {
      let addons = schema.addons.where({ name: request.queryParams['filter[addonName]'] });
      let [addon] = addons.models;
      if (!addon) {
        return { data: [] };
      }
      let [version] = schema.versions.where({ addonId: addon.id }).models;
      if (!version) {
        return { data: [] };
      }
      return schema[resourceTableName].where({ versionId: version.id });
    }
    return schema[resourceTableName].all();
  };

  this.get('/test-results', function(schema, request) {
    return filterByRelatedAddonName(schema, 'testResults', request);
  });
  this.get('/test-results/:id');

  this.get('/size-calculation-results', function(schema, request) {
    return filterByRelatedAddonName(schema, 'sizeCalculationResults', request);
  });
  this.get('/size-calculation-results/:id');

  this.get('/search', () => {
    return {
      search: []
    };
  });

  this.get('/ember-versions');

  this.get('/search/addons', function() {
    return {
      results: [
        {
          addon: 'ember-try',
          count: 1
        },
        {
          addon: 'ember-blanket',
          count: 3
        }
      ]
    };
  });

  this.post('/reviews');
  this.patch('/addons/:id', function(schema, request) {
    let addon = schema.addons.find(+request.params.id);
    addon.update(this.normalizedRequestAttrs());
    let categories = schema.categories.find(JSON.parse(request.requestBody).data.relationships.categories.data.mapBy('id'));
    addon.categoryIds = categories.models.mapBy('id');
    addon.save();
    return addon;
  });

  this.get('/addon-dependencies');

  this.get('/score-calculations', function(schema, { queryParams }) {
    let addonFilter = queryParams['filter[addonId]'];
    if (addonFilter && queryParams['filter[latest]']) {
      return schema.scoreCalculations.where({ addonId: +addonFilter });
    }

    return schema.scoreCalculations.all();
  });

  /*
    Route shorthand cheatsheet
  */
  /*
    GET shorthands

    // Collections
    this.get('/contacts');
    this.get('/contacts', 'users');
    this.get('/contacts', ['contacts', 'addresses']);

    // Single objects
    this.get('/contacts/:id');
    this.get('/contacts/:id', 'user');
    this.get('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    POST shorthands

    this.post('/contacts');
    this.post('/contacts', 'user'); // specify the type of resource to be created
  */

  /*
    PUT shorthands

    this.put('/contacts/:id');
    this.put('/contacts/:id', 'user'); // specify the type of resource to be updated
  */

  /*
    DELETE shorthands

    this.del('/contacts/:id');
    this.del('/contacts/:id', 'user'); // specify the type of resource to be deleted

    // Single object + related resources. Make sure parent resource is first.
    this.del('/contacts/:id', ['contact', 'addresses']);
  */

  /*
    Function fallback. Manipulate data in the db via

      - db.{collection} // returns all the data defined in /app/mirage/fixtures/{collection}.js
      - db.{collection}.find(id)
      - db.{collection}.where(query)
      - db.{collection}.update(target, attrs)
      - db.{collection}.remove(target)

    // Example: return a single object with related models
    this.get('/contacts/:id', function(db, request) {
      var contactId = +request.params.id;
      var contact = db.contacts.find(contactId);
      var addresses = db.addresses
        .filterBy('contact_id', contactId);

      return {
        contact: contact,
        addresses: addresses
      };
    });

  */
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/

/* eslint-enable camelcase */
