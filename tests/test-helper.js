import Application from 'ember-observer/app';
import config from 'ember-observer/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import './helpers/qunit-assertions';
import './helpers/mock-analytics';

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);

  setupEmberOnerrorValidation();

  qunitStart();
}
