import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import RouterScroll from 'ember-router-scroll';

@classic
class Router extends EmberRouter.extend(RouterScroll) {
  location = config.locationType;
  rootURL = config.rootURL;

  @service
  metrics;

  init() {
    super.init(...arguments);
    this.on('routeDidChange', () => this.routeDidChange());
    this.on('routeWillChange', () => this.routeWillChange());
  }

  routeDidChange() {
    scheduleOnce('afterRender', this, this._trackPage);
    performance.mark('routeDidChange');
  }

  routeWillChange() {
    performance.mark('routeWillChange');
  }

  previousPage = null;

  _trackPage() {
    let page = document.location.pathname;
    let title = this.getWithDefault('currentRouteName', 'unknown');
    let previousPage = this.previousPage;
    let hasQuery = /query=/.test(document.location.search);

    if (hasQuery) {
      page = `${page}/?query=`;
    }

    if (page !== previousPage) {
      this.set('previousPage', page);
      this.metrics.trackPage({ page, title });
    }
  }
}

Router.map(function() {
  this.route('categories', function() {
    this.route('show', { path: '/:slug' });
  });

  this.route('addons', function() {
    this.route('correct', { path: '/*name/correct' });
    this.route('show', { path: '/*name' });
    this.route('top', { path: '/lists/top' });
  });

  this.route('lists', function() {
    this.route('top-addons');
    this.route('new-addons');
    this.route('recently-scored-addons');
    this.route('invalid-repo-url');
  });

  this.route('maintainers', function() {
    this.route('show', { path: '/:name' });
  });

  this.route('code-search');

  this.route('canary-test-results', function() {
    this.route('date', { path: '/:date' });
    this.route('detail', { path: '/:id/detail' });
  });

  this.route('login');
  this.route('admin', function() {
    this.route('categories', function() {
      this.route('index', { path: '/' });
      this.route('new');
      this.route('edit', { path: '/:slug' });
    });
    this.route('build-servers');
    this.route('build-results', function() {
      this.route('show', { path: '/:id' });
    });

    this.route('size-calculation-results', function() {
      this.route('show', { path: '/:id' });
    });

    this.route('addon-lists', function() {
      this.route('addons-needing-categorization');
      this.route('addons-needing-review');
      this.route('addons-needing-rereview');
      this.route('addons-hidden');
      this.route('addons-wip');
    });

    this.route('review', function() {
      this.route('addon', { path: '/*name' });
    });
  });

  this.route('about');

  this.route('not-found', { path: '/*path' });
});

export default Router;
