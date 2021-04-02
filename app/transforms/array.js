import { typeOf } from '@ember/utils';
import Transform from '@ember-data/serializer/transform';

export default class extends Transform {
  deserialize(serialized) {
    let type = typeOf(serialized);
    if (type === 'array') {
      return serialized;
    } else {
      return [];
    }
  }

  serialize(deserialized) {
    return deserialized;
  }
}
