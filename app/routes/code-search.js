import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    codeQuery: {
      replace: true
    },
    regex: {
      replace: true
    }
  }
});
