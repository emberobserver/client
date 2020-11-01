import Component from '@glimmer/component';

export default class HumanUrl extends Component {
  get parsed() {
    if (this.args.url) {
      let a = document.createElement('a');

      a.href = this.args.url;

      let host = a.hostname;
      let pathname = a.pathname.replace(/^\/?/, '/');

      return { host, pathname };
    }
    return null;
  }

  get domain() {
    return this.parsed?.host?.replace(/^(www.)?/, '');
  }

  get pathname() {
    return this.parsed?.pathname;
  }
}
