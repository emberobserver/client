import Component from '@glimmer/component';

export default class CategoryChooser extends Component {
  get sortedCategories() {
    return this.args.categories.sortBy('displayName');
  }
}
