import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  Inflector.inflector.uncountable('github-stats');
}

export default {
  name: 'inflections',
  initialize
};
