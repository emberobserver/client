import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  parsed: computed('url', function() {
    if (this.url) {
      let a = document.createElement('a');

      a.href = this.url;

      let host = a.hostname;
      let pathname = a.pathname.replace(/^\/?/, '/');

      return { host, pathname };
    }
    return null;
  }),
  domain: computed('parsed.host', function() {
    return this.getWithDefault('parsed.host', '').replace(/^(www.)?/, '');
  }),
  pathname: alias('parsed.pathname')
});
