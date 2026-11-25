import Route from '@ember/routing/route';

export default class CodeSearchRoute extends Route {
  queryParams = {
    codeQuery: {
      replace: true,
    },
    regex: {
      replace: true,
    },
  };
}
