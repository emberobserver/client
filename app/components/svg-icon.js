import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

export default @classic
@tagName('')
class SvgIconComponent extends Component {
  alignBaseline = true;
}.reopenClass({
  positionalParams: ['iconName']
});
