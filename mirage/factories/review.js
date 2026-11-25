import Mirage from 'miragejs';

export default Mirage.Factory.extend({
  review: 'A review',
  createdAt: () => new Date(),
  hasTests: 1,
  hasReadme: 1,
  hasBuild: 1,
});
