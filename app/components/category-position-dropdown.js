import Component from '@glimmer/component';

export default class CategoryPositionDropdown extends Component {
  get categories() {
    return this.args.categories;
  }

  get position() {
    return this.args.position ?? -1;
  }
}
