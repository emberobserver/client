import Ember from 'ember';

export default Ember.Service.extend({
  apiAjax: Ember.inject.service(),

  store: Ember.inject.service(),

  addonData: Ember.computed(function() {
    return this.get('store').peekAll('addon').sortBy('score').reverse().map(function(addon) {
      return {
        name: addon.get('name'),
        addon: addon
      };
    });
  }),

  addons(query) {
    return this.get('apiAjax').request('/search/addons', {
      data: {
        query
      }
    }).then((response) => {
      let addons = [];
      response.results.forEach((item) => {
        let addonData = this.get('addonData').findBy('name', item.addon);
        if (addonData) {
          addons.pushObject({ addon: addonData.addon, count: item.count });
        }
      });
      return addons;
    });
  }
});
