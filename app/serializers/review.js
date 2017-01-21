import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    createdAt: { serialize: false }
  }
});
