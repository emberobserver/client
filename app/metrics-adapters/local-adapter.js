import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default class LocalAdapter extends BaseAdapter {
  toStringExtension() {
    return 'LocalAdapter';
  }

  init() {}

  identify(options = {}) {
    console.log('Metrics:', 'identify', options);
  }

  trackEvent(options = {}) {
    console.log('Metrics:', 'trackEvent', options);
  }

  trackPage(options = {}) {
    console.log('Metrics:', 'trackPage', options);
  }

  alias(options = {}) {
    console.log('Metrics:', 'alias', options);
  }
}
