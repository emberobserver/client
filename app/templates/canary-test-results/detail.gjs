import canaryVersion from "../../helpers/canary-version.js";
import TestResultStatus from "../../components/test-result-status.gjs";
import momentFormat from "ember-moment/helpers/moment-format";
import BuildResultOutput from "../../components/build-result-output.gjs";
<template><div class="test-result-detail">
  <h1>
    {{@controller.addon.name}} {{@controller.addonVersion.version}}
    against {{canaryVersion @controller.testResult}}
  </h1>

  <div>
    Status: <TestResultStatus @testResult={{@controller.testResult}} />
  </div>

  <div>
    Tests run at: <span class="test-run-date">{{momentFormat @controller.testResult.testsRunAt "YYYY-MM-DD HH:mm" allowEmpty=true}}</span>
  </div>

  <h2>Output</h2>
  <BuildResultOutput @buildResult={{@controller.testResult}} />
</div>
</template>