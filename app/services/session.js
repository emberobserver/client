import Ember from 'ember';

export default Ember.Object.extend({
  open: function(email, password){
    var session = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: 'api/authentication/login.json',
        data: { email: email, password: password },
        dataType: 'json',
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    }).then(function(response){
      return new Ember.RSVP.Promise(function(resolve, reject){
        if(response.token){
          session.set('token', response.token);
          window.localStorage.setItem('sessionToken', response.token);
          resolve();
        }
        else {
          reject();
        }
      });
    }).catch(function(){
      session.clearToken();
      console.log('Failed logging in');
    });
  },
  fetch: function(){
    var token = window.localStorage.getItem('sessionToken');
    if(token){
      this.set('token', token);
    }
  },
  close: function(){
    var session = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: 'api/authentication/logout.json',
        dataType: 'json',
        headers: session.get('header'),
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    }).finally(function(){
      session.clearToken();
    });
  },
  clearToken: function(){
    this.set('token', null);
    window.localStorage.removeItem('sessionToken');
  },
  isAuthenticated: isPresent('token'),
  header: Ember.computed('token', function(){
    return {"Authorization": 'Token token=' + this.get('token')};
  })
});

function isPresent ( strProp ) {
  return Ember.computed( strProp, function () {
    var str = this.get( strProp );
    return typeof str !== 'undefined' && !( /^\s*$/ ).test( str ) && (str !== null);
  });
}
