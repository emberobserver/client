import { action, get } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import SvgIcon from "./svg-icon.gjs";
import pluralize from "../helpers/pluralize.js";
import cleanRepoUrl from "../helpers/clean-repo-url.js";
import padLineNumber from "../helpers/pad-line-number.js";
import isEqual from "../helpers/is-equal.js";
import DotSpinner from "./dot-spinner.gjs";

export default class AddonSourceUsages extends Component {<template><div ...attributes>
<div class="usage-count">
  <button type="button" class="test-usage-count" {{on "click" this.toggleUsages}}>
    {{#if this.showUsages}}
      <SvgIcon @iconName="expand-more" />
    {{else}}
      <SvgIcon @iconName="chevron-right" />
    {{/if}}
    {{@count}} {{pluralize @count "usage"}}
  </button>
  {{#if this.showUsages}}
    {{#if this.usages}}
      {{#each this.visibleUsages as |usage|}}
        <div class="usage test-usage">
          <a class="filename" href="{{cleanRepoUrl @addon.repositoryUrl}}/tree/master/{{usage.filename}}#L{{usage.line_number}}">
            {{usage.filename}}:{{usage.line_number}}
          </a>
          {{#each usage.lines as |line|}}
            <pre class="line"><span class="number">{{padLineNumber line.number usage.lines}}</span><span class={{if (isEqual usage.line_number line.number) "match"}}>{{line.text}}</span></pre>
          {{/each}}
        </div>
      {{/each}}
      {{#if this.moreUsages}}
        <button type="button" class="view-more" {{on "click" this.viewMore}}>
          See more usages
        </button>
      {{/if}}
    {{else if this.fetchUsages.isRunning}}
      <div class="usage">
        <DotSpinner />
      </div>
    {{/if}}
  {{/if}}
</div>
</div>
</template>
  @tracked
  visibleUsageCount = 25;

  @tracked
  showUsages = false;

  @tracked
  usages = null;

  get regex() {
    return this.args.regex ?? false;
  }

  get fileFilter() {
    return this.args.fileFilter;
  }

  @service
  codeSearch;

  get visibleUsages() {
    return this.usages.slice(0, this.visibleUsageCount);
  }

  get moreUsages() {
    return this.visibleUsageCount < get(this, 'usages.length');
  }

  fetchUsages = task({ drop: true }, async () => {
    let usages = await get(this, 'codeSearch.usages').perform(
      get(this.args, 'addon.id'),
      this.args.query,
      this.regex
    );
    this.usages = filterByFilePath(usages, this.fileFilter);
  });

  @action
  toggleUsages() {
    this.showUsages = !this.showUsages;
    if (this.showUsages && this.usages === null) {
      this.fetchUsages.perform();
    }
  }

  @action
  viewMore() {
    let newUsageCount = this.visibleUsageCount + 25;
    this.visibleUsageCount = newUsageCount;
  }
}

function filterByFilePath(usages, filterTerm) {
  if (isEmpty(filterTerm)) {
    return usages;
  }
  let filterRegex;
  try {
    filterRegex = new RegExp(filterTerm);
  } catch (e) {
    return [];
  }
  return usages.filter((usage) => {
    return usage.filename.match(filterRegex);
  });
}
