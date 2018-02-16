import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  parsed: computed('url', function() {
    if (this.get('url')) {
      let a = document.createElement('a');

      a.href = this.get('url');

      let host = a.hostname;
      let pathname = a.pathname.replace(/^\/?/, '/');

      return { host, pathname };
    }
  }),
  domain: computed('parsed.host', function() {
    return this.getWithDefault('parsed.host', '').replace(/^(www.)?/, '');
  }),
  pathname: alias('parsed.pathname')
});
