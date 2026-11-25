import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class DependencyTable extends Component {
  constructor(owner, args) {
    super(owner, args);
    if (!this.collapsed) {
      this.loadDependencies.perform();
    }
  }

  @tracked dependencies;

  @tracked devDependencies;

  limit = 8;

  @tracked
  showingAllDependencies = false;

  @tracked localCollapsed;

  get collapsed() {
    let own = this.localCollapsed;

    return own && own.arg === this.args.collapsed ? own.value : this.args.collapsed ?? false;
  }

  set collapsed(value) {
    if (value === this.collapsed) return;

    this.localCollapsed = { arg: this.args.collapsed, value };
    this.args.onCollapsedChange?.(value);
  }

  @task(function* () {
    let { dependencies, devDependencies } = yield this.args.fetchData();
    this.dependencies = dependencies;
    this.devDependencies = devDependencies;
    this.collapsed = false;
  })
  loadDependencies;

  get addonHasDependencies() {
    return !isEmpty(this.dependencies) || !isEmpty(this.devDependencies);
  }

  get dependencyCount() {
    return this.dependencies?.length;
  }

  get devDependencyCount() {
    return this.devDependencies?.length;
  }

  get hasManyDependencies() {
    if (!this.dependencyCount || !this.devDependencyCount) {
      return false;
    }
    return (
      this.dependencyCount > this.limit || this.devDependencyCount > this.limit
    );
  }

  get hiddenDependencyCount() {
    if (this.showingAllDependencies) {
      return 0;
    }
    return Math.max(this.dependencyCount - this.limit, 0);
  }

  get hiddenDevDependencyCount() {
    if (this.showingAllDependencies) {
      return 0;
    }
    return Math.max(this.devDependencyCount - this.limit, 0);
  }

  get hasHiddenDevDependencies() {
    return this.hiddenDevDependencyCount > 0;
  }

  get hasHiddenDependencies() {
    return this.hiddenDependencyCount > 0;
  }
}
