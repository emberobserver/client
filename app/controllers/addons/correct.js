import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class CorrectController extends Controller {
  @service
  api;

  @action
  submitCorrection() {
    this.api.request('/corrections', {
      method: 'POST',
      data: {
        name: this.name,
        email: this.email,
        addon: this.get('model.name'),
        correction: this.correction,
      },
    }).then(() => {
      this.transitionToRoute('addons.show', this.get('model.name'));
    });
  }

  @action
  cancel() {
    this.transitionToRoute('addons.show', this.get('model.name'));
  }
}
