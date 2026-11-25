import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import formatBytes from "../helpers/format-bytes.js";
import { on } from "@ember/modifier";
import SvgIcon from "./svg-icon.gjs";

export default class DependencySizeComponent extends Component {<template><div class="addon-size" ...attributes>
  {{#if @addonSize.appJsSize}}
    <div class="row">
      <div class="column-1">App JS:</div>
      <div class="column-2 test-app-js">{{formatBytes @addonSize.appJsSize}} <span class="asset-size">({{formatBytes @addonSize.appJsGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
  {{#if @addonSize.appCssSize}}
    <div class="row">
      <div class="column-1">App CSS:</div>
      <div class="column-2 test-app-css">{{formatBytes @addonSize.appCssSize}} <span class="asset-size">({{formatBytes @addonSize.appCssGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
  {{#if @addonSize.vendorJsSize}}
    <div class="row">
      <div class="column-1">Vendor JS:</div>
      <div class="column-2 test-vendor-js">{{formatBytes @addonSize.vendorJsSize}} <span class="asset-size">({{formatBytes @addonSize.vendorJsGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
  {{#if @addonSize.vendorCssSize}}
    <div class="row">
      <div class="column-1">Vendor CSS:</div>
      <div class="column-2 test-vendor-css">{{formatBytes @addonSize.vendorCssSize}} <span class="asset-size">({{formatBytes @addonSize.vendorCssGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
  {{#if @addonSize.otherAssetsSize}}
    <div class="row">
      <div class="column-1">Other Assets:</div>
      <div class="column-2 test-other-assets">{{formatBytes @addonSize.otherAssetsSize}}
        <span class="asset-size">
          ({{formatBytes @addonSize.otherAssetsGzipSize}} gzipped)
          {{#if @addonSize.hasOtherAssetsFiles}}
            <a role="button" href="#" class="test-other-assets-toggle toggle-detail" {{on "click" this.toggleOtherAssets}}>
              <SvgIcon @iconName={{if this.isViewingOtherAssets "expand-less" "expand-more"}} />
            </a>
          {{/if}}
        </span>
      </div>
    </div>
  {{/if}}
  {{#if this.isViewingOtherAssets}}
    {{#each @addonSize.normalizedOtherAssetFiles as |file|}}
      <div class="row other-assets test-other-assets-details">
        <div class="column-1 test-asset-name">- {{file.name}}:</div>
        <div class="column-2 test-asset-size">{{formatBytes file.size}} <span class="asset-size">({{formatBytes file.gzipSize}} gzipped)</span></div>
      </div>
    {{/each}}
  {{/if}}
  {{#if @addonSize.totalJsSize}}
    <div class="row {{if @showTotalRow "" "total"}}">
      <div class="column-1">Total JS:</div>
      <div class="column-2 test-total-js">{{formatBytes @addonSize.totalJsSize}} <span class="asset-size">({{formatBytes @addonSize.totalJsGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
  {{#if @addonSize.totalCssSize}}
    <div class="row {{if @showTotalRow "" "total"}}">
      <div class="column-1">Total CSS:</div>
      <div class="column-2 test-total-css">{{formatBytes @addonSize.totalCssSize}} <span class="asset-size">({{formatBytes @addonSize.totalCssGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
  {{#if @showTotalRow}}
    <div class="row total grand-total">

      <div class="column-1">Total size:</div>
      <div class="column-2 test-total-size">{{formatBytes @addonSize.totalSize}} <span class="asset-size">({{formatBytes @addonSize.totalGzipSize}} gzipped)</span></div>
    </div>
  {{/if}}
</div>
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
