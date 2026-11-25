import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('span')
export default class CommaSeparated extends Component {
  @computed('list.lastObject', 'item')
  get separator() {
    if (asArray(get(this, 'list')).slice(-1)[0] === this.item) {
      return '';
    } else {
      return ', ';
    }
  }
}
