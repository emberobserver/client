import Ember from 'ember';

export default Ember.Component.extend({
  parsed: Ember.computed('url', function() {
    if (this.get('url')) {
      return new URL(this.get('url'));
    }
  }),
  domain: Ember.computed('parsed.host', function() {
    return this.getWithDefault('parsed.host', '').replace(/^(www.)?/, '');
  }),
  pathname: Ember.computed.alias('parsed.pathname')
});
