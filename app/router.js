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
      let previousPage = this.get('previousPage');
      let hasQuery = /query=/.test(document.location.search);

      if (hasQuery) {
        page = `${page}/?query=`;
      }

      if (page !== previousPage) {
        this.set('previousPage', page);
        Ember.get(this, 'metrics').trackPage({ page, title });
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
    this.route('build-results', function() {
      this.route('show', { path: '/:id' });
    });
  });

  this.route('about');

  this.route('model-not-found');
  this.route('not-found', { path: '/*path' });
});

export default Router;
