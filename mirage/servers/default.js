import { createServer } from 'miragejs';
import { pluralize, singularize } from '@warp-drive/utilities/string';

import routes from '../config';
import factories from '../factories';
import models from '../models';
import serializers from '../serializers';
import defaultScenario from '../scenarios/default';

/**
 * ember-cli-mirage found these modules at runtime. ember-mirage needs them imported.
 */
export default function makeServer(environment) {
  return createServer({
    environment,
    factories,
    models,
    serializers,
    scenarios: { default: defaultScenario },
    inflector: { pluralize, singularize },
    routes,
  });
}
