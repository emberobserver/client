import Ember from 'ember';

export default Ember.Controller.extend({
  autocompleteData: Ember.computed('model.categories', 'model.addons', function(){
    return {
      categories: {
        data: this.get('model.categories'),
        key: 'displayName',
        action: 'showCategory'
      },
      addons: {
        data: this.get('model.addons').sortBy('score').reverse(),
        key: 'name',
        action: 'showAddon'
      },
      maintainers: {
        data: this.store.all('maintainer'),
        key: 'name',
        action: 'showMaintainer'
      }
    };
  })
});
