import Ember from 'ember';

export default Ember.Component.extend({
  parsed: Ember.computed('url', function() {
    if (this.get('url')) {
      try {
        return new URL(this.get('url'));
      } catch (e) {
        return "";
      }
    }
  }),
  domain: Ember.computed('parsed.host', function() {
    return this.getWithDefault('parsed.host', '').replace(/^(www.)?/, '');
  }),
  pathname: Ember.computed.alias('parsed.pathname')
});
