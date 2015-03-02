import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showAddon: function(addon){
      this.sendAction("showAddon", addon);
    }
  }
});
