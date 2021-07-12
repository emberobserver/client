import Component from '@glimmer/component';

export default class TotalScoreComponent extends Component {
  get score() {
    if(!this.args.addons.length) {
      return 0;
    }

    let score = this.args.addons.reduce((total, currentAddon) => {
      return currentAddon.score + total;
    }, 0);

    return score.toFixed(1);
  }

  get averageScore() {
    if (!this.score || !this.args.addons.length){
      return 0;
    }

    let average = this.score / this.args.addons.length;
    return average.toFixed(1);
  }
}
