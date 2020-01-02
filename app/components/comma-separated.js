import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('span')
export default class CommaSeparated extends Component {
  @computed('list.lastObject', 'item')
  get separator() {
    if (this.get('list.lastObject') === this.item) {
      return '';
    } else {
      return ', ';
    }
  }
}
