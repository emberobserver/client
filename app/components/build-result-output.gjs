import Component from '@glimmer/component';
import { concat } from "@ember/helper";

export default class BuildResultOutput extends Component {<template><div class="build-result-output">
  {{#if this.isJsonFormat}}
    {{#each this.groups as |group|}}
      <section>
        <details open={{group.has_failures}}>
          <summary>{{group.group}}</summary>

          {{#each group.commands as |command|}}
            {{!-- template-lint-disable no-nested-interactive --}}
            <details open={{command.failed}}>
              <summary>{{command.command}} {{if command.elapsedTime (concat "(" command.elapsedTime "s)")}}</summary>
              <output>{{command.output}}</output>
            </details>
          {{/each}}
        </details>
      </section>
    {{/each}}
  {{else}}
    <pre class="test-output">{{@buildResult.output}}</pre>
  {{/if}}
</div>
</template>
  get isJsonFormat() {
    return this.args.buildResult?.outputFormat === 'json';
  }

  get parsedJSON() {
    return JSON.parse(this.args.buildResult.output);
  }

  get groups() {
    return this.parsedJSON;
  }
}
