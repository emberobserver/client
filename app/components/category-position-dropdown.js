import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class CategoryPositionDropdownComponent extends Component {
  categories = null;
  position = -1;
}
