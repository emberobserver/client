import classic from 'ember-classic-decorator';
import { action, get } from '@ember/object';
import { empty, gt, filter, oneWay, alias } from '@ember/object/computed';
import { Promise as EmberPromise } from 'rsvp';
import Controller from '@ember/controller';
import { service } from '@ember/service';
import asArray, { sortBy } from 'ember-observer/utils/as-array';

@classic
export default class EditController extends Controller {
  @service router;

  @service store;

  categoryNameSorting = ['name:asc'];
  categoryPositionSorting = ['position:asc'];

  @alias('model.categories')
  categories;

  @alias('model.category')
  category;

  @oneWay('category.description')
  categoryDescription;

  @oneWay('category.name')
  categoryName;

  @oneWay('category.parent.id')
  categoryParent;

  @oneWay('category.position')
  categoryPosition;

  get subcategories() {
    return sortBy(get(this, 'category.subcategories'), get(this, 'categoryPositionSorting'));
  }

  @filter('categories', function (item) {
    return item.get('parent.id') === this.get('category.parent.id');
  })
  siblingCategories;

  get sortedSiblingCategories() {
    return sortBy(get(this, 'siblingCategories'), get(this, 'categoryPositionSorting'));
  }

  @gt('siblingCategories.length', 1)
  hasSiblingCategories;

  @empty('category.parent')
  isTopLevelCategory;

  get topLevelCategories() {
    return asArray(get(this, 'categories')).filter((item) => item.parent === null);
  }

  get alphabeticTopLevelCategories() {
    return sortBy(get(this, 'topLevelCategories'), get(this, 'categoryNameSorting'));
  }

  newCategoryName = '';
  newCategoryDescription = '';
  newCategoryPosition = -1;

  @action
  addSubcategory() {
    let newCategory = this.store.createRecord('category', {
      name: this.newCategoryName,
      description: this.newCategoryDescription,
      position: this.newCategoryPosition,
      parent: this.category,
    });
    newCategory
      .save()
      .then(() => {
        this.router.transitionTo('admin.categories.index');
      })
      .catch((message) => {
        newCategory.deleteRecord();
        alert(message);
      });
  }

  @action
  updateCategory() {
    let category = this.category;

    let parentId = this.categoryParent;
    let position = this.categoryPosition;

    if (parentId === category.get('id')) {
      alert("You can't make a category a subcategory of itself");
      return;
    }

    if (parentId != category.get('parent.id')) {
      // when changing a category's parent, always put it at the end of the list
      position = -1;
    }

    category.set('name', this.categoryName);
    category.set('description', this.categoryDescription);
    category.set('position', position);

    let findPromise;
    if (parentId) {
      findPromise = this.store.find('category', parentId);
    } else {
      findPromise = new EmberPromise((resolve) => resolve(null));
    }

    findPromise
      .then(function (parentCategory) {
        category.set('parent', parentCategory);
        return category.save();
      })
      .then(() => {
        this.router.transitionTo('admin.categories.index');
      })
      .catch((message) => {
        category.rollbackAttributes();
        alert(message);
      });
  }
}
