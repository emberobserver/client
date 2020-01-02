import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
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

  @hasMany('addon')
  addons;

  @belongsTo('category', { async: false, inverse: 'subcategories' })
  parent;

  @hasMany('category', { inverse: 'parent', async: false })
  subcategories;

  @computed('name')
  get slug() {
    return this.name.dasherize();
  }

  @computed('parent.name', 'name')
  get displayName() {
    if (this.parent) {
      return `${this.get('parent.name')} > ${this.name}`;
    } else {
      return this.name;
    }
  }

  @computed('subcategories.@each.addonCount')
  get totalAddonCount() {
    return this.subcategories.mapBy('addonCount').reduce(function(categoryA, categoryB) {
      return categoryA + categoryB;
    }, this.addonCount);
  }
}
