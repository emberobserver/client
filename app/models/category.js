import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  position: attr('number'),
  addons: hasMany('addon', {async: true}),
  parent: belongsTo('category'),
  subcategories: hasMany('category', {inverse: 'parent'}),
  slug: function(){
    return this.get('name').dasherize();
  }.property('name'),
  displayName: function(){
    if(this.get('parent')){
      return this.get('parent.name') + ' > ' + this.get('name');
    }
    else {
      return this.get('name');
    }
  }.property('parent.name', 'name'),
  addonCount: function(){
    return this.get('subcategories').mapBy('addons.length').reduce(function(categoryA, categoryB) {
      return categoryA + categoryB;
    }, this.get('addons.length'));
  }.property('addons.length', 'subcategories.@each.addons.length')
});
