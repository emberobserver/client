import Ember from 'ember';
import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  position: attr('number'),
  addonCount: attr('number'),
  addons: hasMany('addon'),
  parent: belongsTo('category', { async: false }),
  subcategories: hasMany('category', { inverse: 'parent', async: false }),
  slug: Ember.computed('name', function() {
    return this.get('name').dasherize();
  }),
  displayName: Ember.computed('parent.name', 'name', function() {
    if (this.get('parent')) {
      return `${this.get('parent.name')} > ${this.get('name')}`;
    } else {
      return this.get('name');
    }
  }),
  directAddonCount: computed.alias('addons.length')
  // addonCount: Ember.computed('addons.length', 'subcategories.@each.directAddonCount', function() {
  //   return this.get('subcategories').mapBy('directAddonCount').reduce(function(categoryA, categoryB) {
  //     return categoryA + categoryB;
  //   }, this.get('addons.length'));
  // })
});
