import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: (i) => `maintainer-${i}`,
  gravatar: '412412d3d6d6fc8809f9121216dd0'
});
