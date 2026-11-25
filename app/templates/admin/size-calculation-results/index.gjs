import DateNav from "../../../components/date-nav.gjs";
import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";
import momentFormat from "ember-moment/helpers/moment-format";
<template><DateNav @date={{@controller.date}} as |nav|>
  <LinkTo @route="admin.size-calculation-results.index" @query={{hash date=nav.formattedPreviousDate}} @class="previous-day">
    &laquo; previous day
  </LinkTo>

  Size calculation results for {{nav.formattedDisplayDate}}

  {{#if nav.showFollowingDayLink}}
    <LinkTo @route="admin.size-calculation-results.index" @query={{hash date=nav.formattedFollowingDate}} @class="next-day">
      next day &raquo;
    </LinkTo>
  {{/if}}
</DateNav>

<table>
  <thead>
    <tr>
      <th>Addon</th>
      <th>Version</th>
      <th>Date/time</th>
      <th>Result</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    {{#each @controller.sortedSizeCalculationResults as |result|}}
      <tr class="test-size-calculation-result" data-sizeCalculationResultId={{result.id}}>
        <td>
          <LinkTo @route="addons.show" @model={{result.version.addon.name}}>
            {{result.version.addon.name}}
          </LinkTo>
        </td>
        <td>{{result.version.version}}</td>
        <td>{{momentFormat result.testsRunAt "YYYY-MM-DD HH:mm" allowEmpty=true}}</td>
        <td>
          {{#if result.succeeded}}
            succeeded
          {{else}}
            failed - {{result.errorMessage}}
          {{/if}}
        </td>
        <td>
          <LinkTo @route="admin.size-calculation-results.show" @model={{result.id}}>
            details
          </LinkTo>
        </td>
      </tr>
    {{/each}}
  </tbody>
</table>
</template>