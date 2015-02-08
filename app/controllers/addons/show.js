import Ember from 'ember';

export function sortBy( arrProp, sortProperty ) {
  var sortProperties = sortProperty.split(':');
  var sortProp = sortProperties[0];
  var sortDirection = sortProperties[1];
  return Ember.computed( arrProp + '.@each.' + sortProp, function(){
    var sorted = this.get(arrProp).sortBy(sortProp);
    if (sortDirection === 'desc') {
      return sorted.reverse();
    } else {
      return sorted;
    }
  });
}

export default Ember.Controller.extend({
  categories: function(){
    return this.store.all('category');
  }.property(),
  licenseUrl: function(){
    return `https://spdx.org/licenses/${this.get('model.license')}`;
  }.property('model.license'),
  sortedVersions: sortBy('model.versions', 'released:desc'),
  actions: {
    save: function(){
      var controller = this;
      this.set('isSaving', true);
      this.get('model').save().finally(function(){
        controller.set('isSaving', false);
      });
    }
  }

});
