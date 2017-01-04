export function initialize(/* application */) {
  let inflector = Ember.Inflector.inflector;
  inflector.uncountable('github-stats');
}

export default {
  name: 'inflections',
  initialize
};
