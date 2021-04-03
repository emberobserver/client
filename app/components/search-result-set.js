import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SearchResultSet extends Component {
  @tracked resultsCollapsed = false;

  @action
  toggleResultsExpansion() {
    this.resultsCollapsed = !this.resultsCollapsed;
  }
}
