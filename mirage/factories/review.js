import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  review: 'A review',
  createdAt: () => new Date(),
  hasTests: 1,
  hasReadme: 1,
  hasBuild: 1
});
