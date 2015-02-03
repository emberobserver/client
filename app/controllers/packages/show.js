import Ember from 'ember';

export default Ember.Controller.extend({
  categories: function(){
    return this.store.find('category');
  }.property(),
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
