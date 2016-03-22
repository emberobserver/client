import Ember from 'ember';

export default Ember.Controller.extend({
  newBuildServerName: '',

  actions: {
    addBuildServer() {
      this.store.createRecord('build-server', { name: this.get('newBuildServerName') }).save();
    }
  }
});
