import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class ApplicationRoute extends Route {
  @service session;

  @service store;

  beforeModel() {
    this.session.fetch();
  }

  model() {
    return {
      categories: this.store.findAll('category', {
        include: 'subcategories,parent',
      }),
    };
  }

  title(tokens) {
    let tokenStr = tokens.join(' | ');
    if (tokenStr) {
      return `${tokenStr} - Ember Observer`;
    } else {
      return 'Ember Observer';
    }
  }
}
