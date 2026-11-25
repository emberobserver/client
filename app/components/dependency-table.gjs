import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import DotSpinner from "./dot-spinner.gjs";
import { on } from "@ember/modifier";
import perform from "ember-concurrency/helpers/perform";
import { LinkTo } from "@ember/routing";
import { fn } from "@ember/helper";
import DependencySizeToggle from "./dependency-size-toggle.gjs";

export default class DependencyTable extends Component {<template><div class="addon-dependency-table" ...attributes>
{{#if this.collapsed}}
  {{#if this.loadDependencies.isRunning}}
    <p class="uncollapse"><DotSpinner /></p>
  {{else if this.loadDependencies.last.isError}}
    <p class="uncollapse test-uncollapse-error">Unable to load addons</p>
  {{else}}
    <button type="button" class="uncollapse test-show-dependents btn-link" {{on "click" (perform this.loadDependencies)}}>Show addons</button>
  {{/if}}
{{else}}
  {{#if this.addonHasDependencies}}
    <p class="description">{{@description}}</p>
    <div class="dependency-table">
      <div>
        <table class="version-dependencies test-dev-dependencies">
          <tr>
            <th>Dev Dependencies</th>
          </tr>
          {{#each this.devDependencies as |dependency index|}}
            {{#if (or this.showingAllDependencies (lt index this.limit))}}
              <tr>
                <td class="test-dev-dependency-{{dependency.packageName}}">
                  <LinkTo @route="addons.show" @model={{dependency.packageName}} class="test-dependency-name">{{dependency.packageName}}</LinkTo>
                </td>
              </tr>
            {{/if}}
          {{else}}
            <tr><td>None</td></tr>
          {{/each}}
          {{#if this.hasHiddenDevDependencies}}
            <tr><td>...</td></tr>
            <tr>
              <td>
                <button type="button" class="btn-link more test-show-all-dependencies" {{on "click" (fn (mut this.showingAllDependencies) true)}}>Show {{this.hiddenDevDependencyCount}} more</button>
              </td>
            </tr>
          {{/if}}
        </table>
      </div>
      <div>
        <table class="version-dependencies test-dependencies">
          <tr>
            <th>Dependencies</th>
          </tr>
          {{#each this.dependencies as |dependency index|}}
            {{#if (or this.showingAllDependencies (lt index this.limit))}}
              <tr>
                <td class="test-dependency-{{dependency.packageName}}">
                  <LinkTo @route="addons.show" @model={{dependency.packageName}} class="test-dependency-name">{{dependency.packageName}}</LinkTo>
                  {{#if dependency.size}}
                    <DependencySizeToggle @addonSize={{dependency.size}} />
                  {{/if}}
                </td>
              </tr>
            {{/if}}
          {{else}}
            <tr><td>None</td></tr>
          {{/each}}
          {{#if this.hasHiddenDependencies}}
            <tr><td>...</td></tr>
            <tr>
              <td>
                <button type="button" class="btn-link more test-show-all-dependencies" {{on "click" (fn (mut this.showingAllDependencies) true)}}>Show {{this.hiddenDependencyCount}} more</button>
              </td>
            </tr>
          {{/if}}
        </table>
      </div>
    </div>
    <hr>
  {{else}}
    <p class="no-addons description test-no-addons-message">{{@noAddonsMessage}}</p>
  {{/if}}
{{/if}}
</div>
</template>
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

  loadDependencies = task(async () => {
    let { dependencies, devDependencies } = await this.args.fetchData();
    this.dependencies = dependencies;
    this.devDependencies = devDependencies;
    this.collapsed = false;
  });

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
