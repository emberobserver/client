import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";
import momentFormat from "ember-moment/helpers/moment-format";
<template><section class="admin-build-result-nav">
  <LinkTo @route="admin.build-results.index" @query={{hash date=@controller.formattedPreviousDate}} class="previous-day">
    &laquo; previous day
  </LinkTo>

  Builds for {{@controller.formattedDisplayDate}}

  {{#if @controller.showFollowingDayLink}}
    <LinkTo @route="admin.build-results.index" @query={{hash date=@controller.formattedFollowingDate}} class="next-day">
      next day &raquo;
    </LinkTo>
  {{/if}}
</section>

<table>
  <thead>
    <tr>
      <th>Addon</th>
      <th>Version</th>
      <th>Date/time</th>
      <th>Result</th>
      <th>Semver string</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    {{#each @controller.sortedBuildResults as |testResult|}}
      <tr class="test-build-result" data-testResultId={{testResult.id}}>
        <td>
          <LinkTo @route="addons.show" @model={{testResult.version.addon.name}}>
            {{testResult.version.addon.name}}
          </LinkTo>
        </td>
        <td>{{testResult.version.version}}</td>
        <td>{{momentFormat testResult.testsRunAt "YYYY-MM-DD HH:mm" allowEmpty=true}}</td>
        <td>
          {{#if testResult.succeeded}}
            succeeded
          {{else}}
            failed - {{testResult.statusMessage}}
          {{/if}}
        </td>
        <td>
          {{if testResult.canary "canary" testResult.semverString}}
        </td>
        <td>
          <LinkTo @route="admin.build-results.show" @model={{testResult.id}}>
            details
          </LinkTo>
        </td>
      </tr>
    {{/each}}
  </tbody>
</table>
</template>