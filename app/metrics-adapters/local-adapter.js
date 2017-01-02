import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'LocalAdapter';
  },

  init() {
  },

  identify(options = {}) {
    console.log('Metrics:', 'identify', options); // eslint-disable-line no-console
  },

  trackEvent(options = {}) {
    console.log('Metrics:', 'trackEvent', options); // eslint-disable-line no-console
  },

  trackPage(options = {}) {
    console.log('Metrics:', 'trackPage', options); // eslint-disable-line no-console
  },

  alias(options = {}) {
    console.log('Metrics:', 'alias', options); // eslint-disable-line no-console
  }
});
