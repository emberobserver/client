import classic from 'ember-classic-decorator';
import { classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@tagName('fieldset')
@classNames('note', 'test-addon-note')
export default class AddonNote extends Component {
  content = '';
}
