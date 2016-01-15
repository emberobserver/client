import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showAddon(addon) {
      this.sendAction('showAddon', addon);
    }
  }
});
