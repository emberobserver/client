import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { on } from "@ember/modifier";
import formatBytes from "../helpers/format-bytes.js";
import SvgIcon from "./svg-icon.gjs";
import AddonSize from "./addon-size.gjs";

export default class DependencySizeComponent extends Component {<template>{{#if this.shouldShow}}
  <span class="dependency-size">
    <a role="button" href="#" {{on "click" this.toggleDetail}} class="test-size-summary toggle-detail">
      {{formatBytes @addonSize.totalSize}} ({{formatBytes @addonSize.totalGzipSize}} gzipped) <SvgIcon @iconName={{if this.isViewingDetails "expand-less" "expand-more"}} />
    </a>

    {{#if this.isViewingDetails}}
      <AddonSize @addonSize={{@addonSize}} class="size-detail test-size-detail" />
    {{/if}}
  </span>
{{/if}}
</template>
  @tracked isViewingDetails;
  @tracked isViewingOtherAssets;

  get shouldShow() {
    let addonSize = this.args.addonSize;
    return addonSize && get(addonSize, 'totalSize') > 0;
  }

  @action
  toggleDetail(e) {
    e.preventDefault();
    this.isViewingDetails = !this.isViewingDetails;
    if (!this.isViewingDetails) {
      this.isViewingOtherAssets = false;
    }
  }

  @action
  toggleOtherAssets(e) {
    e.preventDefault();
    this.isViewingOtherAssets = !this.isViewingOtherAssets;
  }
}
