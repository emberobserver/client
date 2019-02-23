import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    this.get('session').fetch();
  },

  model() {
    return {
      categories: this.get('store').findAll('category', { include: 'subcategories,parent' })
    };
  },

  title(tokens) {
    let tokenStr = tokens.join(' | ');
    if (tokenStr) {
      return `${tokenStr} - Ember Observer`;
    } else {
      return 'Ember Observer';
    }
  }
});
