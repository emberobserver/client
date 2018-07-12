import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  readme: belongsTo(),
  latestAddonVersion: belongsTo('version', { inverse: null }),
  reviews: hasMany(),
  versions: hasMany('version', { inverse: 'addon' }),
  keywords: hasMany(),
  categories: hasMany(),
  maintainers: hasMany(),
  githubUsers: hasMany(),
});
