import Ember from 'ember';

export default Ember.Controller.extend({
  categories: function(){
    return this.store.all('category');
  }.property(),
  licenseUrl: function(){
    return `https://spdx.org/licenses/${this.get('model.license')}`;
  }.property('model.license'),
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
