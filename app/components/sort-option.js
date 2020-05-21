import Component from '@glimmer/component';

export default class SortOption extends Component {
  get isSelected() {
    return this.args.selectedSort === this.args.key;
  }
}
