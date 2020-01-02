import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  api: service(),
  actions: {
    submitCorrection() {
      this.api.request('/corrections', {
        method: 'POST',
        data: {
          name: this.get('name'),
          email: this.get('email'),
          addon: this.get('model.name'),
          correction: this.get('correction'),
        },
      }).then(() => {
        this.transitionToRoute('addons.show', this.get('model.name'));
      });
    },

    cancel() {
      this.transitionToRoute('addons.show', this.get('model.name'));
    },
  },
});
