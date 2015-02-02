module.exports = function(app) {
  var express = require('express');
  var categoriesRouter = express.Router();

  var categories = [
    {id: 1, name: 'Authentication', description: 'Addons for auth', package_ids: [1, 2, 3]},
    {id: 2, name: 'Components', description: 'Addons that provide a component'},
    {id: 3, name: 'Styles', description: 'Addons that provide styles, css frameworks, preprocessors'},
    {id: 4, name: 'Testing', description: 'Addons related to testing'},
    {id: 5, name: 'Build tools', description: 'Addons related to preprocessing, broccoli plugins and dependencies of ember-cli'},
    {id: 6, name: 'Data', description: 'Addons related to ember-data or alternatives to ember-data'},
    {id: 7, name: 'Library wrappers', description: 'Addons that wrap third party libraries, jQuery plugins and the like'},
    {id: 8, name: 'Miscellaneous', description: 'The addons that don\'t fit into other categories'}
  ];

  categoriesRouter.get('/', function(req, res) {
    res.send({
      'categories': categories
    });
  });

  categoriesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  categoriesRouter.get('/:id', function(req, res) {
    res.send({
      'category': categories[req.params.id - 1]
    });
  });

  categoriesRouter.put('/:id', function(req, res) {
    res.send({
      'categories': {
        id: req.params.id
      }
    });
  });

  categoriesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/categories', categoriesRouter);
};
