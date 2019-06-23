import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class ApplicationRoute extends Route {
  beforeModel() {
    this.get('session').fetch();
  }

  model() {
    return {
      categories: this.get('store').findAll('category', { include: 'subcategories,parent' })
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
