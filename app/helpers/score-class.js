import Ember from 'ember';

export default Ember.HTMLBars.makeBoundHelper(function(params) {
	let addon = params[0];
	if (addon.get('isWip')) {
		return 'wip';
	}
	let score = addon.get('score');
	if (score) {
		return score;
	} else {
		return 'na';
	}
});
