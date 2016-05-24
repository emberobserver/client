import Ember from 'ember';

export default Ember.Component.extend({
  parsed: Ember.computed('url', function() {
    if (this.get('url')) {
      let a = document.createElement('a');

      a.href = this.get('url');

      let host = a.hostname;
      let pathname = a.pathname.replace(/^\/?/, '/');

      return { host, pathname };
    }
  }),
  domain: Ember.computed('parsed.host', function() {
    return this.getWithDefault('parsed.host', '').replace(/^(www.)?/, '');
  }),
  pathname: Ember.computed.alias('parsed.pathname')
});
