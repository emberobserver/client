import Component from '@glimmer/component';

export default class CategoryFinder extends Component {
  get categoryLinkRoute() {
    return this.args.categoryLinkRoute || 'categories.show';
  }

  get topLevelCategories() {
    return this.args.categories.filterBy('parent', null);
  }

  get sortedTopLevelCategories() {
    return this.topLevelCategories.sortBy('position');
  }
}
