import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

export default Ember.Component.extend(FocusableComponent, {
  addonSets: Ember.inject.service('addon-sets'),
  topAddons: Ember.computed(function() {
    return this.get('addonSets.top').slice(0, 10);
  }),
  newAddons: Ember.computed(function() {
    return this.get('addonSets.newest').slice(0, 10);
  })
});

