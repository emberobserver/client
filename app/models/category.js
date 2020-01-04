import { computed } from '@ember/object';
import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  position: attr('number'),
  addonCount: attr('number'),
  addons: hasMany('addon'),
  parent: belongsTo('category', { async: false, inverse: 'subcategories' }),
  subcategories: hasMany('category', { inverse: 'parent', async: false }),
  slug: computed('name', function() {
    return this.name.dasherize();
  }),
  displayName: computed('parent.name', 'name', function() {
    if (this.parent) {
      return `${this.get('parent.name')} > ${this.name}`;
    } else {
      return this.name;
    }
  }),
  totalAddonCount: computed('subcategories.@each.addonCount', function() {
    return this.subcategories.mapBy('addonCount').reduce(function(categoryA, categoryB) {
      return categoryA + categoryB;
    }, this.addonCount);
  })
});
