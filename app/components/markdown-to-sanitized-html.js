import classic from 'ember-classic-decorator';
import { layout } from '@ember-decorators/component';
import MarkdownToHtml from 'ember-cli-showdown/components/markdown-to-html';

@classic
@layout('')
export default class MarkdownToSanitizedHtmlComponent extends MarkdownToHtml {}
