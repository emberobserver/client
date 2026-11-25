import Component from '@glimmer/component';
import SvgIcon from "./svg-icon.gjs";
import { concat } from "@ember/helper";

export default class OfficialIcon extends Component {<template><SvgIcon @iconName="stars" @title="Official Ember-CLI addon" @class={{concat "official " @class}} />
</template>

}
