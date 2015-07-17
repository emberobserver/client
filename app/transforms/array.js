import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    var type = Ember.typeOf(serialized);
    if (type === 'array') {
      return serialized;
    } else {
      return [];
    }
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});
