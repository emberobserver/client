import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';

@classic
export default class AddonReviewForm extends Component {
  questionOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 2 },
    { label: 'N/A', value: 3 },
    { label: 'Unknown', value: 4 }
  ];

  @action
  _save() {
    this.sendAction('save', this.review);
  }

  @action
  selectOption(fieldName, value) {
    this.review.set(fieldName, value);
  }
}
