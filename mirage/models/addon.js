import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  readme: belongsTo(),
  latestAddonVersion: belongsTo('version', { inverse: null }),
  latestReview: belongsTo('review', { inverse: null }),
  versions: hasMany('version', { inverse: 'addon' }),
  keywords: hasMany(),
  categories: hasMany(),
  maintainers: hasMany(),
  githubUsers: hasMany(),
});
