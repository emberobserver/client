import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  isNewSerializerAPI: true,
  serializeHasMany(record, json, relationship) {
    let { key } = relationship;
    if (key === 'categories') {
      json[key] = (record.hasMany(key) || []).mapBy('id');
    } else {
      this._super(...arguments);
    }
  }
});
