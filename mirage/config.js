/* eslint-disable camelcase */

import Mirage from 'ember-cli-mirage';
import EmberVersionsResponse from './ember-version-response';
export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
  this.post('/api/authentication/login.json', function() {
    return { token: 'abc123' };
  });

  this.namespace = '/api/v2';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/autocomplete_data', function(schema) {
    let addonData = schema.addons.all().models.map((a) => {
      return {
        id: a.id,
        name: a.name,
        description: a.description
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
      let addons = schema.addons.where({ name: request.queryParams['filter[name]'] });
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

    return schema.addons.all();
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
  this.get('/build-servers');
  this.get('/test-results');
  this.get('/test-results/:id');

  this.get('/search', () => {
    return {
      search: []
    };
  });

  this.get('https://api.github.com/repos/emberjs/ember.js/releases', function(/* db, request*/) {
    return EmberVersionsResponse;
  });

  this.get('/search/addons', () => {
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
