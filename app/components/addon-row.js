import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    showAddon: function(addon){
      this.sendAction("showAddon", addon);
    }
  }
});
