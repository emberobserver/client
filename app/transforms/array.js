import { typeOf } from '@ember/utils';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    let type = typeOf(serialized);
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
