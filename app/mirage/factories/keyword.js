import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
	name: function(i) {
		return `keyword-${i}`;
	}
});
