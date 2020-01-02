import classic from 'ember-classic-decorator';
import MarkdownToHtml from 'ember-cli-showdown/components/markdown-to-html';

@classic
export default class MarkdownToSanitizedHtml extends MarkdownToHtml {}
