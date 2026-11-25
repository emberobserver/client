import asArray from 'ember-observer/utils/as-array';
import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';
import config from '#config';
const PageSize = config.codeSearchPageSize;

export default class CodeSearchService extends Service {
  @service
  api;

  @service
  store;

  addons = task(async (query, regex) => {
    let addons;

    let { results } = await this.api.request('/search/addons', {
      params: {
        query,
        regex,
      },
    });

    if (results.length < 4 * PageSize) {
      let idsParam = results.map((r) => r.addon).join(',');
      addons = await this.store.query('addon', {
        filter: { id: idsParam },
        include: 'categories',
      });
    } else {
      addons = await this.store.query('addon', {
        filter: { codeSearch: true },
        include: 'categories',
        page: { limit: 10000 },
      });
    }
    return asArray(results
      .map((result) => {
        let addon = addons.find((a) => a.get('id') === result.addon);
        if (addon) {
          return { addon, count: result.count, files: result.files };
        }
      })).filter((item) => item != null);
  });

  usages = task(async (addon, query, regex) => {
    let response = await this.api.request('/search/source', {
      params: {
        addon,
        query,
        regex,
      },
    });
    return response.results;
  });
}
