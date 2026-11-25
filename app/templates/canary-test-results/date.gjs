import { LinkTo } from "@ember/routing";
import CanaryTestResultSummary from "../../components/canary-test-result-summary.gjs";
import testResultStatusClass from "../../helpers/test-result-status-class.js";
import TestResultStatus from "../../components/test-result-status.gjs";
<template><section class="admin-build-result-nav">
  <LinkTo @route="canary-test-results.date" @model={{@controller.formattedPreviousDate}} class="previous-day">
    &laquo; previous day
  </LinkTo>

  Canary test results for {{@controller.formattedDisplayDate}}

  {{#if @controller.showFollowingDayLink}}
    <LinkTo @route="canary-test-results.date" @model={{@controller.formattedFollowingDate}} class="next-day">
      next day &raquo;
    </LinkTo>
  {{/if}}
</section>

<CanaryTestResultSummary @testResults={{@controller.model.testResults}} />

<table>
  <thead>
    <tr>
      <th>Addon</th>
      <th>Addon Version</th>
      <th>Ember Version</th>
      <th>Result</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    {{#each @controller.model.testResults as |testResult|}}
      <tr class="canary-test-result">
        <td>
          <LinkTo @route="addons.show" @model={{testResult.version.addon.name}}>
            {{testResult.version.addon.name}}
          </LinkTo>
        </td>
        <td>
          {{testResult.version.version}}
        </td>
        <td>
          {{testResult.emberVersionCompatibilities.firstObject.emberVersion}}
        </td>
        <td class="test-result {{testResultStatusClass testResult}}">
          <TestResultStatus @testResult={{testResult}} />
        </td>
        <td>
          <LinkTo @route="canary-test-results.detail" @model={{testResult.id}}>
            View
          </LinkTo>
        </td>
      </tr>
    {{/each}}
  </tbody>
</table>
</template>