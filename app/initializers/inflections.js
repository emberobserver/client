import Ember from 'ember';
const { inflector } = Ember.Inflector;

export function initialize(/* application */) {
  inflector.uncountable('github-stats');
}

export default {
  name: 'inflections',
  initialize
};
