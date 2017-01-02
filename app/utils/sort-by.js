import Ember from 'ember';

export default function(arrProp, sortProperty) {
  let sortProperties = sortProperty.split(':');
  let [sortProp, sortDirection] = sortProperties;
  return Ember.computed(`${arrProp}.@each.${sortProp}`, function() {
    let val = this.get(arrProp);
    if (!val) {
      return [];
    }
    let sorted = this.get(arrProp).sortBy(sortProp);
    if (sortDirection === 'desc') {
      return sorted.reverse();
    } else {
      return sorted;
    }
  });
}
