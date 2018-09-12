import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    addonCount: { serialize: false }
  },
  normalize(modelClass, responseHash) {
    if (responseHash.relationships) {
      if (responseHash.relationships.parent.links) {
        delete responseHash.relationships.parent.links;
      }
      if (responseHash.relationships.subcategories.links) {
        delete responseHash.relationships.subcategories.links;
      }
    }
    return this._super(...arguments);
  }
});
