export function initialize(container, application) {
  application.inject('adapter', 'session', 'service:session');
  application.inject('route', 'session', 'service:session');
  application.inject('controller', 'session', 'service:session');
}

export default {
  name: 'session-service',
  initialize: initialize
};
