import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('')
export default class SortOption extends Component {
  @computed('selectedSort', 'key')
  get isSelected() {
    return this.selectedSort === this.key;
  }
}
