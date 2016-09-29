import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  isNewSerializerAPI: true,
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key;
    if (key === 'categories') {
      json[key] = (record.hasMany(key) || []).mapBy('id');
    } else {
      this._super.apply(this, arguments);
    }
  }
});
