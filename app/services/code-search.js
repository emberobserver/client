import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Service.extend({
  apiAjax: inject.service(),

  store: inject.service(),

  addons(query, regex) {
    return this.get('apiAjax').request('/search/addons', {
      data: {
        query, regex
      }
    }).then((response) => {
      return response.results.map((item) => {
        return { addonName: item.addon, count: item.count };
      });
    });
  },

  usages(addon, query, regex) {
    return this.get('apiAjax').request('/search/source', {
      data: {
        addon, query, regex
      }
    }).then((response) => {
      return response.results;
    });
  }
});
