import Ember from 'ember';

export default Ember.HTMLBars.makeBoundHelper(function(params) {
	if (params[0]) {
		return params[0];
	} else {
		return 'N/A';
	}
});
