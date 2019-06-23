import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

@classic
export default class HumanUrlComponent extends Component {
  @computed('url')
  get parsed() {
    if (this.get('url')) {
      let a = document.createElement('a');

      a.href = this.get('url');

      let host = a.hostname;
      let pathname = a.pathname.replace(/^\/?/, '/');

      return { host, pathname };
    }
  }

  @computed('parsed.host')
  get domain() {
    return this.getWithDefault('parsed.host', '').replace(/^(www.)?/, '');
  }

  @alias('parsed.pathname')
  pathname;
}
