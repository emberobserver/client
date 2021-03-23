import Service from '@ember/service';

export default class CurrentDateService extends Service {
  get date() {
    return new Date();
  }
}
