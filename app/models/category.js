import Ember from 'ember';
import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  addons: hasMany('addon', {async: true}),
  parent: belongsTo('category'),
  subcategories: hasMany('category', {inverse: 'parent'}),
  addonCount: function(){
    return this.get('subcategories').mapBy('addons.length').reduce(function(categoryA, categoryB) {
      return categoryA + categoryB;
    }, this.get('addons.length'));
  }.property('addons.length', 'subcategories.@each.addons.length')
});
