import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from "@ember/modifier";
import SvgIcon from "./svg-icon.gjs";
import lessThan from "../helpers/less-than.js";
import perform from "ember-concurrency/helpers/perform";

export default class SearchResultSet extends Component {<template>{{#if @results.length}}
  <div class="results {{@resultClass}}">
    <h5>
      <button type="button" class="btn-link" {{on "click" this.toggleResultsExpansion}}>
        {{#if this.resultsCollapsed}}
          <SvgIcon @iconName="chevron-right" />
        {{else}}
          <SvgIcon @iconName="expand-more" />
        {{/if}}
        {{@title}} ({{@totalCount}})
      </button>
    </h5>
    {{#unless this.resultsCollapsed}}
      <div class="results-content">
        {{yield}}
        {{#if (lessThan @results.length @totalCount)}}
          {{#if @fetchMore.isRunning}}
            <button type="button" class="button more-results">Fetching more...</button>
          {{else}}
            <button type="button" class="button more-results" {{on "click" (perform @fetchMore)}}>Show more</button>
          {{/if}}
        {{/if}}
      </div>
    {{/unless}}
  </div>
{{/if}}
</template>
  @tracked resultsCollapsed = false;

  @action
  toggleResultsExpansion() {
    this.resultsCollapsed = !this.resultsCollapsed;
  }
}
