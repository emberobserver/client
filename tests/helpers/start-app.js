import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './qunit-assertions';
import LocalStore from '../../utils/local-storage';
import mockStorage from './local-storage-mock';

export default function startApp(attrs) {
  var application;

  LocalStore.storage = function() {
    return mockStorage;
  };

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
