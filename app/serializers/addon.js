import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  serializeHasMany: function ( record, json, relationship ) {
    var key = relationship.key;
    if ( key === 'categories' ) {
      json[ key ] = record.get( key ).mapBy( 'id' );
    } else {
      this._super.apply( this, arguments );
    }
  }
});

