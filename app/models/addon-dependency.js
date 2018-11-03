import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default Model.extend({
  package: attr('string'),
  dependencyType: attr('string'),
  dependentVersion: belongsTo('version'),

  isDependency: computed.equal('dependencyType', 'dependencies'),
  isDevDependency: computed.equal('dependencyType', 'devDependencies'),
});
