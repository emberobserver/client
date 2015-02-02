module.exports = function(app) {
  var express = require('express');
  var packagesRouter = express.Router();

  var packages = [
    {id: 1, name: 'ember-cli-feature-flags', npmjs_url: 'http://npm.com', github_url: 'http;//github.com', categories: [1,2,3,4,5,6,7], description: "This is a package"},
    {id: 2, name: 'ember-stripe-service', npmjs_url: 'http://npm.com', github_url: 'http;//github.com', categories: [8], description: "This is a package"},
    {id: 3, name: 'ember-easy-form', npmjs_url: 'http://npm.com', github_url: 'http;//github.com', categories: [1,2,3,4,5,6,7],  description: "This is a package"}
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
