import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './qunit-assertions';
import './mock-analytics';
import LocalStore from '../../utils/local-storage';
import mockStorage from './local-storage-mock';

import './visit-addon';

export default function startApp(attrs) {
  let application;

  LocalStore.storage = function() {
    return mockStorage;
  };

  // use defaults, but you can override
  let attributes = Ember.assign({}, config.APP, attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
