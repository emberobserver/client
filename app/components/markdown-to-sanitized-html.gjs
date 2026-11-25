import MarkdownToHtml from 'ember-cli-showdown/components/markdown-to-html';
import domPurify from "../helpers/dom-purify.js";

export default class MarkdownToSanitizedHtml extends MarkdownToHtml {<template>{{domPurify this.html}}
</template>}
