import Ember from 'ember';

export default Ember.TextField.extend({
	init: function() {
	  this._super();
	  this.on("keyPress", this, this.interpretKeyEvents);
	},

	interpretKeyEvents: function(event){
	  var map = {
	    38: 'arrowUp',
	    40: 'arrowDown'
	  };
	  var method = map[event.keyCode];
	  if (method){
	    return this[method](event);
	  } else {
	    this._super(event);
	  }
	},

	arrowUp: function(event) {
	  this.sendAction('arrow-up', this, event);
	},

	arrowDown: function(event) {
	  this.sendAction('arrow-down', this, event);
	}
});