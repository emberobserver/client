import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';

const { attr, belongsTo } = DS;

export const questions = [
  { text: 'Are there meaningful tests?', fieldName: 'hasTests' },
  { text: 'Is the README filled out?', fieldName: 'hasReadme' },
  { text: 'Does the addon have a build?', fieldName: 'hasBuild' }
];

export default DS.Model.extend({
  questions,
  review: attr('string'),
  createdAt: attr('date'),
  hasTests: attr('number'),
  hasReadme: attr('number'),
  hasBuild: attr('number'),
  version: belongsTo('version'),
  versionReleased: alias('version.released'),
  score: computed(
    'hasTests',
    'hasBuild',
    'hasReadme',
    function() {
      let s = 2;
      /* eslint-disable */
      if (this.get('hasTests') === 1) { s++; }
      if (this.get('hasBuild') === 1) { s++; }
      if (this.get('hasReadme') === 1) { s++; }
      /* eslint-enable */
      return s;
    }
  )
});
