import Application from 'ember-observer/app';
import config from 'ember-observer/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import './helpers/qunit-assertions';
import './helpers/mock-analytics';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
