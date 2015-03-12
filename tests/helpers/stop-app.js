import Ember from 'ember';

export default function stopApp(application) {
  Ember.run(application, 'destroy');
}
