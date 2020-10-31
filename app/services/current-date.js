import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentDateService extends Service {
  @tracked currentDateOverride = null;

  get date() {
    return this.currentDateOverride || new Date();
  }

  set date(date) {
    this.currentDateOverride = date;
  }
}
