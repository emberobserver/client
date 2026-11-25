import { get } from '@ember/object';
import asArray from 'ember-observer/utils/as-array';
import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { dasherize } from '@ember/string';
import Model, { hasMany, belongsTo, attr } from '@ember-data/model';

@classic
export default class Category extends Model {
  @attr('string')
  name;

  @attr('string')
  description;

  @attr('number')
  position;

  @attr('number')
  addonCount;

  @hasMany('addon', { async: true, inverse: 'categories' })
  addons;

  @belongsTo('category', { async: false, inverse: 'subcategories' })
  parent;

  @hasMany('category', { inverse: 'parent', async: false })
  subcategories;

  @computed('name')
  get slug() {
    return dasherize(this.name);
  }

  @computed('parent.name', 'name')
  get displayName() {
    if (this.parent) {
      return `${this.get('parent.name')} > ${this.name}`;
    } else {
      return this.name;
    }
  }

  @computed('addonCount', 'subcategories.@each.addonCount')
  get totalAddonCount() {
    return asArray(this.subcategories).map((item) => get(item, 'addonCount'))
      .reduce(function (categoryA, categoryB) {
        return categoryA + categoryB;
      }, this.addonCount);
  }
}
