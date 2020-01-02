import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from 'ember-observer/config/environment';
const PageSize = config.codeSearchPageSize;

export default Service.extend({
  api: service(),

  store: service(),

  addons: task(function* (query, regex) {
    let addons;

    let { results } = yield this.api.request('/search/addons', {
      params: {
        query, regex
      }
    });

    if (results.length < (4 * PageSize)) {
      let idsParam = results.map((r) => r.addon).join(',');
      addons = yield this.store.query('addon', { filter: { id: idsParam }, include: 'categories' })
    } else {
      addons = yield this.store.query('addon', { filter: { codeSearch: true }, include: 'categories', page: { limit: 10000 } });
    }
    return results.map((result) => {
      let addon = addons.find((a) => a.get('id') === result.addon);
      if (addon) {
        return { addon, count: result.count, files: result.files };
      }
    }).compact();
  }),

  usages: task(function* (addon, query, regex) {
    let response = yield this.api.request('/search/source', {
      params: {
        addon, query, regex
      }
    });
    return response.results;
  })
});
