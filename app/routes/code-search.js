import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class CodeSearchRoute extends Route {
  queryParams = {
    codeQuery: {
      replace: true
    },
    regex: {
      replace: true
    }
  };
}
