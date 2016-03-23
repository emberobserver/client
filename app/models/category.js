import Ember from 'ember';
import DS from 'ember-data';

let { attr, belongsTo, hasMany } = DS;
let { computed } = Ember;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  position: attr('number'),
  addons: hasMany('addon', { async: true }),
  parent: belongsTo('category', { async: false }),
  subcategories: hasMany('category', { inverse: 'parent', async: false }),
  slug: function() {
    return this.get('name').dasherize();
  }.property('name'),
  displayName: function() {
    if (this.get('parent')) {
      return this.get('parent.name') + ' > ' + this.get('name');
    } else {
      return this.get('name');
    }
  }.property('parent.name', 'name'),
  directAddonCount: computed.alias('addons.length'),
  addonCount: function() {
    return this.get('subcategories').mapBy('directAddonCount').reduce(function(categoryA, categoryB) {
      return categoryA + categoryB;
    }, this.get('addons.length'));
  }.property('addons.length', 'subcategories.@each.directAddonCount')
});
