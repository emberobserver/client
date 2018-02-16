import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';
import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';
import './qunit-assertions';
import './mock-analytics';
import LocalStore from '../../utils/local-storage';
import mockStorage from './local-storage-mock';

import './visit-addon';

registerPowerSelectHelpers();

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  LocalStore.storage = function() {
    return mockStorage;
  };

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
