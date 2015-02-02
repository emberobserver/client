module.exports = function(app) {
  var express = require('express');
  var packagesRouter = express.Router();

  var packages = [
    {
      id: 1,
      name: 'ember-cli-feature-flags',
      npmjs_url: 'http://npm.com/something/or/other',
      repository_url: 'http://github.com/whatever',
      categories: [1,2,3,4,5,6,7],
      description: "This is a package",
      latest_version: '1.0.0',
      latest_version_date: '2015-01-05T12:32:00Z'
    },
    {
      id: 2,
      name: 'ember-stripe-service',
      npmjs_url: 'https://www.npmjs.com/package/ember-stripe-service',
      repository_url: 'https://github.com/buritica/ember-stripe-service',
      categories: [8],
      description: "An ember-cli addon which injects Stripe as an Ember service",
      latest_version: '1.0.0',
      latest_version_date: '2015-01-05T12:32:00Z'
    },
    {
      id: 3,
      name: 'ember-easy-form',
      npmjs_url: 'https://www.npmjs.com/package/ember-easy-form',
      repository_url: 'https://github.com/stefanpenner/ember-cli',
      categories: [1,2,3,4,5,6,7],
      description: "This is a package",
      latest_version: '0.0.0',
      latest_version_date: '2015-01-05T12:32:00Z'
    }
  ];

  packagesRouter.get('/', function(req, res) {
    res.send({
      'packages': packages
    });
  });

  packagesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  packagesRouter.get('/:id', function(req, res) {
    res.send({
      'package': packages[req.params.id - 1]
    });
  });

  packagesRouter.put('/:id', function(req, res) {
    res.send({
      'packages': {
        id: req.params.id
      }
    });
  });

  packagesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/packages', packagesRouter);
};
