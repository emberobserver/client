import Service, { inject as service } from '@ember/service';

export default Service.extend({
  apiAjax: service(),

  store: service(),

  addons(query, regex) {
    return this.get('apiAjax').request('/search/addons', {
      data: {
        query, regex
      }
    }).then((response) => {
      return response.results.map((item) => {
        return { addonName: item.addon, count: item.count, files: item.files };
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
