/* eslint-disable camelcase */

import EmberVersionsResponse from './ember-version-response';
export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
  this.namespace = '/api';    // make this `api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.get('/categories');

  this.get('/addons', function(schema, request) {
    if (request.queryParams.name) {
      return schema.addons.where({ name: request.queryParams.name }).models[0];
    }

    let simpleAddonData = schema.db.addons.map(function(addon) {
      return {
        id: addon.id,
        name: addon.name,
        latest_version_date: addon.latestVersionDate,
        latest_reviewed_version_date: addon.latestReviewedVersionDate,
        description: addon.description,
        is_deprecated: addon.isDeprecated,
        is_official: addon.isOfficial,
        is_cli_dependency: addon.isCliDependency,
        is_hidden: addon.isHidden,
        score: addon.score,
        is_wip: addon.isWip,
        is_fully_loaded: false
      };
    });
    return { addons: simpleAddonData };
  });

  this.get('/maintainers');
  this.get('/keywords');
  this.get('/versions', ['reviews', 'testResults', 'emberVersionCompatibilities', 'versions']);
  this.get('/reviews');
  this.get('/build_servers');
  this.get('/test_results');
  this.get('/test_results/:id');
  this.post('/authentication/login.json');

  this.get('/search', () => {
    return {
      search: []
    };
  });

  this.get('https://api.github.com/repos/emberjs/ember.js/releases', function(/* db, request*/) {
    return EmberVersionsResponse;
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
