import Controller from '@ember/controller';

export default Controller.extend({
  newBuildServerName: '',

  actions: {
    addBuildServer() {
      this.store.createRecord('build-server', { name: this.get('newBuildServerName') }).save();
    }
  }
});
