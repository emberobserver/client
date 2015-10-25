import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr;
var belongsTo = DS.belongsTo;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  position: attr('number'),
  addons: hasMany('addon', { async: true }),
  parent: belongsTo('category', { async: false }),
  subcategories: hasMany('category', { inverse: 'parent', async: false }),
  slug: Ember.computed('name', function() {
    return this.get('name').dasherize();
  }),
  displayName: Ember.computed('parent.name', 'name', function() {
    if (this.get('parent')) {
      return this.get('parent.name') + ' > ' + this.get('name');
    } else {
      return this.get('name');
    }
  }),
  addonCount: Ember.computed('addons.length', 'subcategories.@each.addons.lenth', function() {
    return this.get('subcategories').mapBy('addons.length').reduce(function(categoryA, categoryB) {
      return categoryA + categoryB;
    }, this.get('addons.length'));
  })
});
