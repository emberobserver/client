import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    showAddon(addon) {
      this.sendAction('showAddon', addon);
    }
  }
});
