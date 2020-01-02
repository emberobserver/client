import classic from 'ember-classic-decorator';
import { attributeBindings, tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('time')
@attributeBindings('isoDate:datetime', 'isoDate:title')
export default class RelativeTime extends Component {
  date = null;

  @computed('date')
  get isoDate() {
    let date = this.date;
    return date ? date.toISOString() : null;
  }
}
