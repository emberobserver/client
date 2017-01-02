import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
  deserialize(serialized) {
    let type = Ember.typeOf(serialized);
    if (type === 'array') {
      return serialized;
    } else {
      return [];
    }
  },
  serialize(deserialized) {
    return deserialized;
  }
});
