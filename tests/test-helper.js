import Application from 'ember-observer/app';
import config from 'ember-observer/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import './helpers/qunit-assertions';
import './helpers/mock-analytics';

setApplication(Application.create(config.APP));

start();
