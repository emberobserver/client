import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';
import Pretender from 'pretender';

export default function startApp(attrs) {
  var application;
  var server;

  server = new Pretender(function () {});

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    application.server = server;
  });

  return application;
}
