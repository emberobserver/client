import Ember from 'ember';

export default function stopApp(application) {
  application.server.shutdown();
  Ember.run(application, 'destroy');
}
