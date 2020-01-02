import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    createdAt: { serialize: false }
  }
});
