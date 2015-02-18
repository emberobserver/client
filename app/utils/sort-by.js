export default function( arrProp, sortProperty ) {
  var sortProperties = sortProperty.split(':');
  var sortProp = sortProperties[0];
  var sortDirection = sortProperties[1];
  return Ember.computed( arrProp + '.@each.' + sortProp, function(){
    var val = this.get(arrProp);
    if(!val) { return []; }
    var sorted = this.get(arrProp).sortBy(sortProp);
    if (sortDirection === 'desc') {
      return sorted.reverse();
    } else {
      return sorted;
    }
  });
}
