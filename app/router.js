import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },
  previousPage: null,
  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      let page = document.location.pathname;
      let title = this.getWithDefault('currentRouteName', 'unknown');
      if (page !== this.get('previousPage')) {
        Ember.get(this, 'metrics').trackPage({ page, title });
        this.set('previousPage', page);
      }
    });
  }
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

  this.route('lists', function() {
    this.route('top-addons');
    this.route('new-addons');
    this.route('recently-scored-addons');
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
    this.route('build-servers');
  });

  this.route('about');

  this.route('model-not-found');
  this.route('not-found', { path: '/*path' });
});

export default Router;
