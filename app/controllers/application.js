import Ember from 'ember';
import ControllerWithSearch from '../mixins/controller-with-search';

export default Ember.Controller.extend(ControllerWithSearch, {
  shouldShowCategories: Ember.computed('currentRouteName', function() {
    return this.get('currentRouteName') !== 'addons.show';
  })
});
