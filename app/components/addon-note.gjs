import Component from '@glimmer/component';
import MarkdownToSanitizedHtml from "./markdown-to-sanitized-html.gjs";

export default class AddonNote extends Component {<template><fieldset class="note test-addon-note" ...attributes>
<legend>Note</legend>
<MarkdownToSanitizedHtml @markdown={{this.content}} @tables={{true}} @ghCodeBlocks={{true}} @tasklists={{true}} @simplifiedAutoLink={{true}} />
</fieldset>
</template>
  get content() {
    return this.args.content ?? '';
  }
}
