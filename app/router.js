import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('categories', function() {
    this.route('show', { path: '/:slug' });
  });

  this.route('addons', function() {
    this.route('show', { path: '/:name' });
    this.route('correct', { path: '/:name/correct' });
    this.route('top', { path: '/lists/top' });
  });

  this.route('maintainers', function() {
    this.route('show', { path: '/:name' });
  });

  this.route('login');
  this.route('admin', function() {
    this.route('categories', function() {
      this.route('new');
      this.route('edit', { path: '/:slug' });
    });
  });

  this.route('about');

  this.route('model-not-found');
  this.route('not-found', { path: '/*path' });
});

export default Router;
