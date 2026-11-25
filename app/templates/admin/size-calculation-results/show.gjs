import { LinkTo } from "@ember/routing";
import { on } from "@ember/modifier";
import momentFormat from "ember-moment/helpers/moment-format";
import BuildResultOutput from "../../../components/build-result-output.gjs";
<template><div class="admin-build-result">
  <h1>
    Size Calculation #{{@controller.sizeCalculationResult.id}}
    (<span class="test-addon-name"><LinkTo @route="addons.show" @model={{@controller.addon.name}}>{{@controller.addon.name}}</LinkTo></span>
    <span class="test-addon-version">{{@controller.addonVersion.version}}</span>)
  </h1>

  <div>
    Status: <span class="test-build-status">{{@controller.buildStatus}}</span>
    {{#if @controller.canRetryBuild}}
      <button type="button" {{on "click" @controller.retryBuild}} class="test-retry-build">Retry</button>
    {{/if}}
  </div>

  <div>
    Tests run at: <span class="test-run-date">{{momentFormat @controller.sizeCalculationResult.testsRunAt "YYYY-MM-DD HH:mm" allowEmpty=true}}</span>
  </div>

  <h2>Output</h2>
  <BuildResultOutput @buildResult={{@controller.sizeCalculationResult}} />
</div>
</template>