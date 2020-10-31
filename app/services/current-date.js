import Service from '@ember/service';

export default class CurrentDateService extends Service {
  currentDateOverride = null;

  get date() {
    return this.currentDateOverride || new Date();
  }

  set date(date) {
    this.currentDateOverride = date;
  }
}
