import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    submitCorrection() {
      var controller = this;
      Ember.$.post('/api/corrections', {
        name: this.get('name'),
        email: this.get('email'),
        addon: this.get('model.name'),
        correction: this.get('correction')
      }).done(function() {
        controller.transitionToRoute('addons.show', controller.get('model'));
      });
    },

    cancel() {
      this.transitionToRoute('addons.show', this.get('model'));
    }
  }
});
