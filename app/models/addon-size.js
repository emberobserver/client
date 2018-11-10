import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default Model.extend({
  appJsSize: attr('number'),
  appCssSize: attr('number'),
  vendorJsSize: attr('number'),
  vendorCssSize: attr('number'),
  otherJsSize: attr('number'),
  otherCssSize: attr('number'),
  addonVersion: belongsTo('version'),

  totalJsSize: computed('appJsSize', 'vendorJsSize', 'otherJsSize', function() {
    return this.appJsSize + this.vendorJsSize + this.otherJsSize;
  }),

  totalCssSize: computed('appCssSize', 'vendorCssSize', 'otherJCssSize', function() {
    return this.appCssSize + this.vendorCssSize + this.otherCssSize;
  })
});
