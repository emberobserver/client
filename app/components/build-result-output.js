import Component from '@glimmer/component';

export default class BuildResultOutput extends Component {
  get isJsonFormat() {
    return this.args.buildResult?.outputFormat === 'json';
  }

  get parsedJSON() {
    return JSON.parse(this.args.buildResult.output);
  }

  get groups() {
    return this.parsedJSON;
  }
}
