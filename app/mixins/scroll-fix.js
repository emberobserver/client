import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({
  activate: function() {
    this._super();
    if (config.environment !== 'test') {
      window.scrollTo(0, 0);
    }
  }
});
