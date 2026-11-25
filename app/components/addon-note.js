import Component from '@glimmer/component';

export default class AddonNote extends Component {
  get content() {
    return this.args.content ?? '';
  }
}
