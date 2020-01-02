import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { alias, gt } from '@ember/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

@classic
@classNames('addon-dependency-table')
export default class DependencyTable extends Component {
  limit = 8;
  showingAllDependencies = false;
  collapsed = false;

  init() {
    super.init(...arguments);
    if (!this.collapsed) {
      this.loadDependencies.perform();
    }
  }

  @task(function * () {
    let { dependencies, devDependencies } = yield this.fetchData();
    this.set('dependencies',  dependencies);
    this.set('devDependencies',  devDependencies);
    this.set('collapsed', false);
  })
  loadDependencies;

  @computed('dependencies', 'devDependencies')
  get addonHasDependencies() {
    return !isEmpty(this.dependencies) || !isEmpty(this.devDependencies);
  }

  @alias('dependencies.length')
  dependencyCount;

  @alias('devDependencies.length')
  devDependencyCount;

  @computed('dependencyCount', 'devDependencies')
  get hasManyDependencies() {
    if (!this.dependencyCount || !this.devDependencyCount) {
      return false;
    }
    return this.dependencyCount > this.limit || this.devDependencyCount > this.limit;
  }

  @computed('dependencyCount', 'showingAllDependencies')
  get hiddenDependencyCount() {
    if (this.showingAllDependencies) {
      return 0;
    }
    return Math.max(this.dependencyCount - this.limit, 0);
  }

  @computed('devDependencyCount', 'showingAllDependencies')
  get hiddenDevDependencyCount() {
    if (this.showingAllDependencies) {
      return 0;
    }
    return Math.max(this.devDependencyCount - this.limit, 0);
  }

  @gt('hiddenDevDependencyCount', 0)
  hasHiddenDevDependencies;

  @gt('hiddenDependencyCount', 0)
  hasHiddenDependencies;
}
