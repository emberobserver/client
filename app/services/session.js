import Ember from 'ember';

export default Ember.Object.extend({
  open: function(email, password){
    var session = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: 'api/auth.json',
        data: { email: email, password: password },
        dataType: 'json',
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      })
    }).then(function(response){
      session.set('token', response.token);
    });
  },

  close: function(){
    var session = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: 'api/logout.json',
        dataType: 'json',
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      })
    }).finally(function(response){
        session.set('token', null);
    });
  },
  isAuthenticated: isPresent('token')
});

function isPresent ( strProp ) {
  return Ember.computed( strProp, function () {
    var str = this.get( strProp );
    return typeof str !== 'undefined' && !( /^\s*$/ ).test( str ) && (str !== null);
  });
}
