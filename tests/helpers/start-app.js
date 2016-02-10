import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './qunit-assertions';
import './mock-analytics';
import LocalStore from '../../utils/local-storage';
import mockStorage from './local-storage-mock';

export default function startApp(attrs) {
  let application;

  LocalStore.storage = function() {
    return mockStorage;
  };

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
