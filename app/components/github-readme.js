import Ember from 'ember';

export default Ember.Component.extend({
  html: '',
  actionMessage: 'Show Readme',
  showReadme: false,

  actions: {
    toggleReadme: function() {
      if (this.get('showReadme')) {
        this.set('actionMessage', 'Show Readme');
        this.set('showReadme', false);
      } else {
        this.set('actionMessage', 'Hide Readme');
        this.set('showReadme', true);
      }
    }
  }
});
